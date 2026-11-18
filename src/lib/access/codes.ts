/**
 * Reine Hilfsfunktionen rund um Zugangscodes (ohne Datenbank, testbar).
 */

const WORDS = [
  "Molar", "Krone", "Wurzel", "Pulpa", "Kiefer", "Schmelz", "Dentin", "Inlay",
  "Bruecke", "Implantat", "Prothese", "Gingiva", "Papille", "Fissur", "Apex", "Sulkus",
  "Alveole", "Veneer", "Onlay", "Bracket", "Matrize", "Kofferdam", "Spiegel", "Sonde",
  "Bohrer", "Abdruck", "Retainer", "Zement", "Komposit", "Keramik", "Titan", "Naht",
  "Tupfer", "Lampe", "Fluorid", "Zahnbogen", "Eckzahn", "Praemolar", "Lippe", "Gaumen",
];

function randomInt(maxExclusive: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % maxExclusive;
}

/** z. B. "Molar-4821-Krone" – gut per WhatsApp weiterzugeben, ca. 14 Mio. Kombinationen. */
export function generateCode(): string {
  const a = WORDS[randomInt(WORDS.length)];
  const b = WORDS[randomInt(WORDS.length)];
  const n = 1000 + randomInt(9000);
  return `${a}-${n}-${b}`;
}

/** Zufälliges Sitzungsgeheimnis (Base64url, 256 Bit). */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type CodeKind = "nutzer" | "test";

export type CodeStatus = "neu" | "aktiv" | "abgelaufen" | "gesperrt";

export type CodeRecord = {
  id: string;
  code: string;
  label: string;
  kind: CodeKind;
  durationHours: number;
  createdAt: Date;
  activatedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  hasSession: boolean;
  lastSeenAt: Date | null;
  loginCount: number;
};

export function codeStatus(c: Pick<CodeRecord, "revokedAt" | "expiresAt">, now: Date): CodeStatus {
  if (c.revokedAt) return "gesperrt";
  if (!c.expiresAt) return "neu";
  return c.expiresAt.getTime() > now.getTime() ? "aktiv" : "abgelaufen";
}

/** "24 Stunden", "7 Tage", "36 Stunden" … */
export function formatDuration(hours: number): string {
  if (hours % 24 === 0) {
    const days = hours / 24;
    return days === 1 ? "1 Tag" : `${days} Tage`;
  }
  return hours === 1 ? "1 Stunde" : `${hours} Stunden`;
}

export const DURATION_PRESETS = [
  { label: "Testzugang 24 Stunden", hours: 24, kind: "test" },
  { label: "7 Tage", hours: 7 * 24, kind: "nutzer" },
  { label: "30 Tage", hours: 30 * 24, kind: "nutzer" },
] as const satisfies ReadonlyArray<{ label: string; hours: number; kind: CodeKind }>;

/** Obergrenze für frei gewählte Laufzeiten: 1 Jahr. */
export const MAX_DURATION_HOURS = 365 * 24;
