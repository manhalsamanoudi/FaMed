import { GoogleGenAI } from "@google/genai";

/**
 * API-Version für alle Gemini-Aufrufe. Das SDK nutzt sonst "v1", das weder
 * Live-Sitzungen noch Ephemeral Tokens unterstützt.
 */
export const GEMINI_API_VERSION = "v1beta";

/** Gemini-Client für Server-Routen. */
export function createServerClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: GEMINI_API_VERSION } });
}

/**
 * Serverseitige Konfiguration. Niemals in Client-Komponenten importieren:
 * der API-Key darf den Server nicht verlassen.
 */
export function getServerEnv() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  return {
    apiKey,
    liveModel: process.env.GEMINI_LIVE_MODEL || "gemini-3.8-live",
    /** Reihenfolge = Priorität. Bei Überlastung wird das nächste Modell versucht. */
    evalModels: parseModelList(
      process.env.GEMINI_EVAL_MODELS || "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash-lite",
    ),
  };
}

export function parseModelList(value: string): string[] {
  return value
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
}

/**
 * Fehler, bei denen sich ein anderes Modell lohnt: Überlastung (503),
 * Zeitüberschreitung (504), Ratenlimit (429), Serverfehler (500).
 */
export function isRetryableModelError(err: unknown): boolean {
  const status = getStatus(err);
  if (status !== undefined && [429, 500, 503, 504].includes(status)) return true;
  const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return /high demand|UNAVAILABLE|DEADLINE_EXCEEDED|RESOURCE_EXHAUSTED|timed? ?out|AbortError/i.test(msg);
}

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "GEMINI_API_KEY fehlt. Lege die Datei .env.local an (Vorlage: .env.example) und starte den Server neu.",
    );
    this.name = "MissingApiKeyError";
  }
}

export class AllModelsBusyError extends Error {
  constructor(models: string[]) {
    super(
      `Alle Gemini-Modelle sind gerade ausgelastet (${models.join(", ")}). Das kommt in der kostenlosen Stufe vor – bitte in ein paar Minuten erneut auswerten. Die Aufnahme bleibt erhalten.`,
    );
    this.name = "AllModelsBusyError";
  }
}

/** Einheitliche Fehlerantwort für Route Handler, ohne interne Details preiszugeben. */
export function errorResponse(err: unknown): Response {
  if (err instanceof MissingApiKeyError) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  const status = getStatus(err);
  if (err instanceof Error && err.message.includes("API_KEY_INVALID")) {
    return Response.json(
      {
        error:
          "Der Gemini-API-Key in .env.local ist ungültig. Bitte den Key in Google AI Studio neu kopieren und mit Key-eintragen.cmd eintragen.",
      },
      { status: 500 },
    );
  }
  if (err instanceof AllModelsBusyError) {
    return Response.json({ error: err.message }, { status: 503 });
  }
  if (status === 429) {
    return Response.json(
      {
        error:
          "Das kostenlose Gemini-Kontingent ist gerade ausgeschöpft. Bitte in einer Minute erneut versuchen.",
      },
      { status: 429 },
    );
  }
  console.error(err);
  return Response.json(
    { error: "Anfrage an Gemini fehlgeschlagen. Details stehen im Server-Log." },
    { status: 502 },
  );
}

function getStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "status" in err) {
    const s = (err as { status: unknown }).status;
    return typeof s === "number" ? s : undefined;
  }
  return undefined;
}
