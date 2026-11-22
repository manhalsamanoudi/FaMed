import { EndSensitivity, Modality, type LiveConnectConfig } from "@google/genai";
import { z } from "zod";
import { getCase } from "@/content/cases";
import { requireAccess } from "@/lib/access/session";
import type { StationType } from "@/lib/cases/schema";
import { buildActorInstruction } from "@/lib/live/actor-prompt";
import { createServerClient, errorResponse, getServerEnv } from "@/lib/server/env";

/** Stille (ms), nach der ein Redebeitrag des Prüflings als beendet gilt. */
const STILLE_MS: Record<StationType, number> = {
  anamnese: 1000,
  aufklaerung: 1600,
  vorstellung: 1600,
  arztbrief: 1000,
};

const bodySchema = z.object({
  caseId: z.string().min(1),
  /** Handle aus einer vorherigen Sitzung, um nach einem Verbindungsabbruch fortzusetzen */
  resumeHandle: z.string().min(1).optional(),
  /** Nur Entwicklung (scripts/stimmprobe.mjs): andere Stimme ausprobieren */
  stimme: z.string().regex(/^[A-Za-z]+$/).optional(),
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
  if (!c || !c.actorCard) {
    return Response.json({ error: "Fall nicht gefunden." }, { status: 404 });
  }
  const actor = c.actorCard;
  const voiceName =
    process.env.NODE_ENV !== "production" && parsed.data.stimme ? parsed.data.stimme : actor.voice;

  try {
    const env = getServerEnv();
    const ai = createServerClient(env.apiKey);

    const config: LiveConnectConfig = {
      responseModalities: [Modality.AUDIO],
      systemInstruction: buildActorInstruction(c),
      speechConfig: {
        languageCode: "de-DE",
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
      inputAudioTranscription: { customVocabulary: c.vocabulary },
      outputAudioTranscription: {},
      realtimeInputConfig: {
        automaticActivityDetection: {
          // Denkpausen sollen das Gespräch nicht abschneiden. Bei Aufklärung und
          // Patientenvorstellung redet der Prüfling lange am Stück – dort mehr Geduld.
          endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
          silenceDurationMs: STILLE_MS[c.stationType],
        },
      },
      // Die Rolle darf schweigen, wenn der Prüfling nur eine Pause macht und nichts fragt.
      proactivity: { proactiveAudio: true },
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
