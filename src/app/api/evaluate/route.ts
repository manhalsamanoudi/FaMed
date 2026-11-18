import {
  FileState,
  createPartFromUri,
  type GenerateContentResponse,
  type GoogleGenAI,
} from "@google/genai";
import { z } from "zod";
import { getCase } from "@/content/cases";
import { requireAccess } from "@/lib/access/session";
import { buildEvaluationPrompt } from "@/lib/evaluation/prompt";
import {
  checklistCoverage,
  evaluationSchema,
  overallScore,
} from "@/lib/evaluation/schema";
import {
  AllModelsBusyError,
  createServerClient,
  errorResponse,
  getServerEnv,
  isRetryableModelError,
} from "@/lib/server/env";

/** Bewertung kann bei 11 Minuten Audio etwas dauern; dazu ggf. Ausweichmodelle. */
export const maxDuration = 300;

/** Höchstwartezeit pro Modell, bevor auf das nächste ausgewichen wird. */
const MODEL_TIMEOUT_MS = 90_000;

const MAX_AUDIO_BYTES = 40 * 1024 * 1024;

export async function POST(request: Request) {
  // Vor dem Lesen des (großen) Bodys prüfen.
  const denied = await requireAccess(request);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const audio = form?.get("audio");
  const caseId = form?.get("caseId");
  const transcript = form?.get("transcript");

  if (!(audio instanceof Blob) || typeof caseId !== "string") {
    return Response.json({ error: "Audio oder caseId fehlt." }, { status: 400 });
  }
  if (audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
    return Response.json({ error: "Audiodatei leer oder zu groß." }, { status: 400 });
  }
  const c = getCase(caseId);
  if (!c) {
    return Response.json({ error: "Fall nicht gefunden." }, { status: 404 });
  }

  let ai: GoogleGenAI | null = null;
  let uploadedName: string | undefined;
  try {
    const env = getServerEnv();
    ai = createServerClient(env.apiKey);

    let file = await ai.files.upload({ file: audio, config: { mimeType: "audio/wav" } });
    uploadedName = file.name;
    for (let tries = 0; file.state === FileState.PROCESSING && tries < 30; tries++) {
      await new Promise((res) => setTimeout(res, 1000));
      file = await ai.files.get({ name: file.name! });
    }
    if (file.state !== FileState.ACTIVE || !file.uri) {
      throw new Error(`Audio-Upload nicht verarbeitet (Status ${file.state}).`);
    }

    const contents = [
      createPartFromUri(file.uri, "audio/wav"),
      buildEvaluationPrompt(c, typeof transcript === "string" ? transcript : ""),
    ];
    const jsonSchema = z.toJSONSchema(evaluationSchema);

    // Ausweichkette: bei Überlastung des besten Modells das nächste versuchen.
    let response: GenerateContentResponse | null = null;
    let usedModel = "";
    for (const model of env.evalModels) {
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
    if (!response) throw new AllModelsBusyError(env.evalModels);

    const parsed = evaluationSchema.safeParse(JSON.parse(response.text ?? "null"));
    if (!parsed.success) {
      console.error("Ungültige Bewertung von Gemini", parsed.error, response.text);
      return Response.json(
        { error: "Die Bewertung hatte ein unerwartetes Format. Bitte erneut versuchen." },
        { status: 502 },
      );
    }

    const weights = Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.weight]));
    return Response.json({
      evaluation: parsed.data,
      overall: overallScore(parsed.data),
      coverage: checklistCoverage(parsed.data, weights),
      checklistLabels: Object.fromEntries(c.rubric.checklist.map((i) => [i.id, i.label])),
      model: usedModel,
    });
  } catch (err) {
    return errorResponse(err);
  } finally {
    // Aufnahme nicht länger als nötig bei Google liegen lassen.
    if (ai && uploadedName) {
      await ai.files.delete({ name: uploadedName }).catch(() => undefined);
    }
  }
}
