import type { GenerateContentResponse, GoogleGenAI, PartUnion } from "@google/genai";
import { z } from "zod";
import type { Case } from "@/lib/cases/schema";
import { AllModelsBusyError, isRetryableModelError } from "@/lib/server/env";
import { belegteFachbegriffe, belegteFaktenfehler, briefKennzahlen, gespraechsKennzahlen, wendeRegelnAn, zaehleWoerter } from "./regeln";
import { checklistCoverage, evaluationSchema, type EvaluateResponse, type Kennzahlen } from "./schema";

/** Höchstwartezeit pro Modell, bevor auf das nächste ausgewichen wird. */
const MODEL_TIMEOUT_MS = 90_000;

export class InvalidEvaluationError extends Error {
  constructor() {
    super("Die Bewertung hatte ein unerwartetes Format. Bitte erneut versuchen.");
    this.name = "InvalidEvaluationError";
  }
}

/** Was der Prüfling abgegeben hat: Gespräch (Live-Transkript) oder Brief. */
export type Abgabe = { art: "gespraech"; transkript: string } | { art: "brief"; brief: string };

/**
 * Ruft Gemini mit Ausweichkette auf (bei Überlastung nächstes Modell),
 * prüft die JSON-Antwort, wendet die festen Prüfungsregeln an und baut die
 * Antwort für den Browser.
 */
export async function runEvaluation(
  ai: GoogleGenAI,
  models: string[],
  c: Case,
  contents: PartUnion[],
  abgabe: Abgabe,
): Promise<EvaluateResponse> {
  const jsonSchema = z.toJSONSchema(evaluationSchema);
  let response: GenerateContentResponse | null = null;
  let usedModel = "";
  for (const model of models) {
    try {
      response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: jsonSchema,
          temperature: 0.1,
          httpOptions: { timeout: MODEL_TIMEOUT_MS },
        },
      });
      usedModel = model;
      break;
    } catch (err) {
      if (!isRetryableModelError(err)) throw err;
      console.warn(`Bewertungsmodell ${model} nicht verfügbar, versuche nächstes.`, err);
    }
  }
  if (!response) throw new AllModelsBusyError(models);

  let json: unknown = null;
  try {
    json = JSON.parse(response.text ?? "null");
  } catch {
    // unten als ungültig behandelt
  }
  const parsed = evaluationSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Ungültige Bewertung von Gemini", parsed.error, response.text);
    throw new InvalidEvaluationError();
  }

  const roh = parsed.data;
  let kennzahlen: Kennzahlen;
  if (abgabe.art === "brief") {
    // Nur Faktenfehler, die wörtlich im Brief stehen (gegen Fehlalarme des Modells).
    roh.faktenfehler = belegteFaktenfehler(roh, abgabe.brief);
    kennzahlen = briefKennzahlen(abgabe.brief);
  } else {
    // Nur was der Prüfling gesagt hat (Live-Transkript ohne die Rolle + Audio-Transkript).
    const eigene = abgabe.transkript
      .split(/\r?\n/)
      .filter((z) => z.startsWith("Zahnarzt:"))
      .join("\n");
    roh.faktenfehler = belegteFaktenfehler(roh, eigene, roh.wortgetreuesTranskript);
    roh.nichtErklaerteFachbegriffe = belegteFachbegriffe(roh, eigene, roh.wortgetreuesTranskript);
    kennzahlen = gespraechsKennzahlen(abgabe.transkript, roh.wortgetreuesTranskript);
  }

  const weights = Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.weight]));
  const coverage = checklistCoverage(roh, weights);
  const regel = wendeRegelnAn(roh, {
    station: c.stationType,
    coverage,
    kennzahlen,
    musterWoerter: c.arztbrief ? zaehleWoerter(c.arztbrief.musterbrief) : undefined,
  });

  return {
    evaluation: regel.evaluation,
    station: c.stationType,
    overall: regel.overall,
    bestanden: regel.bestanden,
    coverage,
    hinweise: regel.hinweise,
    kennzahlen,
    checklistLabels: Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.label])),
    model: usedModel,
    beispiele: c.beispiele,
    musterbrief: c.arztbrief?.musterbrief,
  };
}
