import { FileState, createPartFromUri, type GoogleGenAI } from "@google/genai";
import { getCase } from "@/content/cases";
import { requireAccess } from "@/lib/access/session";
import { buildEvaluationPrompt } from "@/lib/evaluation/prompt";
import { InvalidEvaluationError, runEvaluation } from "@/lib/evaluation/run";
import { createServerClient, errorResponse, getServerEnv } from "@/lib/server/env";

/** Bewertung kann bei 11 Minuten Audio etwas dauern; dazu ggf. Ausweichmodelle. */
export const maxDuration = 300;

const MAX_AUDIO_BYTES = 40 * 1024 * 1024;

/** Bewertung eines mündlichen Gesprächs (Aufnahme + Live-Transkript). */
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
  if (!c || !c.actorCard) {
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

    const result = await runEvaluation(ai, env.evalModels, c, [
      createPartFromUri(file.uri, "audio/wav"),
      buildEvaluationPrompt(c, typeof transcript === "string" ? transcript : ""),
    ]);
    return Response.json(result);
  } catch (err) {
    if (err instanceof InvalidEvaluationError) {
      return Response.json({ error: err.message }, { status: 502 });
    }
    return errorResponse(err);
  } finally {
    // Aufnahme nicht länger als nötig bei Google liegen lassen.
    if (ai && uploadedName) {
      await ai.files.delete({ name: uploadedName }).catch(() => undefined);
    }
  }
}
