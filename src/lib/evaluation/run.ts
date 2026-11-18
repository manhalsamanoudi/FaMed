import type { GenerateContentResponse, GoogleGenAI, PartUnion } from "@google/genai";
import { z } from "zod";
import type { Case } from "@/lib/cases/schema";
import { AllModelsBusyError, isRetryableModelError } from "@/lib/server/env";
import { checklistCoverage, evaluationSchema, overallScore, type EvaluateResponse } from "./schema";

/** Höchstwartezeit pro Modell, bevor auf das nächste ausgewichen wird. */
const MODEL_TIMEOUT_MS = 90_000;

export class InvalidEvaluationError extends Error {
  constructor() {
    super("Die Bewertung hatte ein unerwartetes Format. Bitte erneut versuchen.");
    this.name = "InvalidEvaluationError";
  }
}

/**
 * Ruft Gemini mit Ausweichkette auf (bei Überlastung nächstes Modell),
 * prüft die JSON-Antwort und baut die Antwort für den Browser.
 */
export async function runEvaluation(
  ai: GoogleGenAI,
  models: string[],
  c: Case,
  contents: PartUnion[],
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
          temperature: 0.2,
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

  const weights = Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.weight]));
  return {
    evaluation: parsed.data,
    overall: overallScore(parsed.data),
    coverage: checklistCoverage(parsed.data, weights),
    checklistLabels: Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.label])),
    model: usedModel,
    beispiele: c.beispiele,
    musterbrief: c.arztbrief?.musterbrief,
  };
}
