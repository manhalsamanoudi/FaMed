import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { constantTimeEqual, sha256Hex, type CodeRecord } from "./codes";
import { checkSession, type DenyReason } from "./store";

/**
 * Zugangsprüfung für Seiten (Proxy) und API-Routen.
 * Cookie-Formate:
 *   m.<hash>            Master (ohne Ablauf, mehrere Geräte erlaubt)
 *   u.<codeId>.<token>  persönlicher Code (ein Gerät, Ablauf laut Datenbank)
 */

export const ACCESS_COOKIE = "dentsim_zugang";
export const MASTER_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export type AccessReason = DenyReason | "keine-anmeldung" | "nicht-eingerichtet" | "stoerung";

export type Access =
  | { role: "master" }
  | { role: "offen" }
  | { role: "nutzer"; record: CodeRecord; codeId: string; token: string };

export type AccessResult = { ok: true; access: Access } | { ok: false; reason: AccessReason };

export const REASON_TEXT: Record<AccessReason, string> = {
  "keine-anmeldung": "Bitte den Zugangscode eingeben.",
  unbekannt: "Der Code ist nicht richtig.",
  abgelaufen: "Dieser Zugang ist abgelaufen. Bitte einen neuen Code anfragen.",
  gesperrt: "Dieser Zugang wurde gesperrt.",
  "anderes-geraet":
    "Du wurdest abgemeldet, weil dein Code auf einem anderen Gerät verwendet wurde. Ein Code gilt immer nur für ein Gerät.",
  "nicht-eingerichtet": "Der Zugang ist noch nicht eingerichtet (MASTER_CODE fehlt).",
  stoerung: "Die Anmeldung ist gerade gestört. Bitte in einer Minute neu laden.",
};

export function masterCode(): string | null {
  const c = process.env.MASTER_CODE?.trim();
  return c ? c : null;
}

/** Lokal ohne MASTER_CODE bleibt die App offen; in Produktion nie. */
export function isOpenMode(): boolean {
  return !masterCode() && process.env.NODE_ENV !== "production";
}

export async function masterCookieValue(code: string): Promise<string> {
  return `m.${await sha256Hex(`dentsim-master:${code}`)}`;
}

export function userCookieValue(codeId: string, token: string): string {
  return `u.${codeId}.${token}`;
}

export function isMasterCode(input: string): boolean {
  const code = masterCode();
  return Boolean(code) && constantTimeEqual(input.trim().toLowerCase(), code!.toLowerCase());
}

export async function resolveAccess(cookieValue: string | undefined, now = new Date()): Promise<AccessResult> {
  if (isOpenMode()) return { ok: true, access: { role: "offen" } };
  const master = masterCode();
  if (!master) return { ok: false, reason: "nicht-eingerichtet" };
  if (!cookieValue) return { ok: false, reason: "keine-anmeldung" };

  if (cookieValue.startsWith("m.")) {
    return constantTimeEqual(cookieValue, await masterCookieValue(master))
      ? { ok: true, access: { role: "master" } }
      : { ok: false, reason: "keine-anmeldung" };
  }

  const m = /^u\.([0-9a-f-]{36})\.([A-Za-z0-9_-]{20,})$/i.exec(cookieValue);
  if (!m || !isDatabaseConfigured()) return { ok: false, reason: "keine-anmeldung" };
  let check;
  try {
    check = await checkSession(getDb(), m[1], m[2], now);
  } catch (err) {
    console.error("Zugangsprüfung fehlgeschlagen", err);
    return { ok: false, reason: "stoerung" };
  }
  return check.ok
    ? { ok: true, access: { role: "nutzer", record: check.record, codeId: m[1], token: m[2] } }
    : { ok: false, reason: check.reason };
}

export function readAccessCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ACCESS_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

function denied(reason: AccessReason): Response {
  return Response.json(
    { error: REASON_TEXT[reason], grund: reason },
    { status: reason === "stoerung" ? 503 : 401 },
  );
}

/** Für API-Routen: 401-Antwort, wenn kein gültiger Zugang besteht. */
export async function requireAccess(request: Request): Promise<Response | null> {
  const r = await resolveAccess(readAccessCookie(request));
  return r.ok ? null : denied(r.reason);
}

/** Für Verwaltungs-APIs: nur Master (bzw. lokal offen). */
export async function requireMaster(request: Request): Promise<Response | null> {
  const r = await resolveAccess(readAccessCookie(request));
  if (!r.ok) return denied(r.reason);
  if (r.access.role === "nutzer") {
    return Response.json({ error: "Nur mit Master-Code möglich." }, { status: 403 });
  }
  return null;
}

export function isSecureRequest(request: Request): boolean {
  return (
    request.headers.get("x-forwarded-proto") === "https" || new URL(request.url).protocol === "https:"
  );
}

export function buildCookie(value: string, maxAgeSeconds: number, secure: boolean): string {
  return [
    `${ACCESS_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearCookie(secure: boolean): string {
  return buildCookie("", 0, secure);
}
