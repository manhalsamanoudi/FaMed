import { EndSensitivity, Modality, type LiveConnectConfig } from "@google/genai";
import { z } from "zod";
import { getCase } from "@/content/cases";
import { requireAccess } from "@/lib/access";
import { buildActorInstruction } from "@/lib/live/actor-prompt";
import { createServerClient, errorResponse, getServerEnv } from "@/lib/server/env";

const bodySchema = z.object({
  caseId: z.string().min(1),
  /** Handle aus einer vorherigen Sitzung, um nach einem Verbindungsabbruch fortzusetzen */
  resumeHandle: z.string().min(1).optional(),
});

/**
 * Erstellt ein kurzlebiges Ephemeral Token für genau eine Live-Sitzung.
 * Modell und komplette Sitzungskonfiguration (inkl. verdeckter Rollenkarte)
 * werden serverseitig im Token festgeschrieben – der Browser sieht sie nicht
 * und kann sie nicht verändern.
 */
export async function POST(request: Request) {
  const denied = await requireAccess(request);
  if (denied) return denied;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "caseId fehlt." }, { status: 400 });
  }
  const c = getCase(parsed.data.caseId);
  if (!c) {
    return Response.json({ error: "Fall nicht gefunden." }, { status: 404 });
  }

  try {
    const env = getServerEnv();
    const ai = createServerClient(env.apiKey);

    const config: LiveConnectConfig = {
      responseModalities: [Modality.AUDIO],
      systemInstruction: buildActorInstruction(c),
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: c.actorCard.voice } },
      },
      inputAudioTranscription: { customVocabulary: c.vocabulary },
      outputAudioTranscription: {},
      realtimeInputConfig: {
        automaticActivityDetection: {
          // Denkpausen sollen das Gespräch nicht abschneiden.
          endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
          silenceDurationMs: 800,
        },
      },
      sessionResumption: parsed.data.resumeHandle
        ? { handle: parsed.data.resumeHandle }
        : {},
    };

    const now = Date.now();
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        // Situation + Puffer
        expireTime: new Date(now + (c.durationSeconds + 5 * 60) * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: { model: env.liveModel, config },
      },
    });

    if (!token.name) {
      throw new Error("Gemini hat kein Token zurückgegeben.");
    }
    return Response.json({ token: token.name, model: env.liveModel });
  } catch (err) {
    return errorResponse(err);
  }
}
