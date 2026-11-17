/**
 * Einfacher Zugangsschutz per Code. Aktiv nur, wenn ACCESS_CODE gesetzt ist
 * (lokal ohne Code bleibt alles offen).
 * Der Cookie enthält nicht den Code selbst, sondern einen Hash davon.
 */

export const ACCESS_COOKIE = "dentsim_zugang";
export const ACCESS_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function accessCode(): string | null {
  const code = process.env.ACCESS_CODE?.trim();
  return code ? code : null;
}

export async function tokenForCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(`dentsim-zugang:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** true, wenn kein Code konfiguriert ist oder der Cookie zum Code passt. */
export async function hasAccess(cookieValue: string | undefined): Promise<boolean> {
  const code = accessCode();
  if (!code) return true;
  if (!cookieValue) return false;
  return constantTimeEqual(cookieValue, await tokenForCode(code));
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Liest den Zugangs-Cookie aus einem Request-Header. */
export function readAccessCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ACCESS_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/** Für API-Routen: gibt eine 401-Antwort zurück, wenn kein Zugang besteht. */
export async function requireAccess(request: Request): Promise<Response | null> {
  if (await hasAccess(readAccessCookie(request))) return null;
  return Response.json({ error: "Kein Zugang. Bitte Zugangscode eingeben." }, { status: 401 });
}
