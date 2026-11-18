import { REASON_TEXT, readAccessCookie, resolveAccess } from "@/lib/access/session";

/**
 * Status der aktuellen Sitzung (für die Kopfzeile und die regelmäßige Prüfung).
 * Kein try/catch: resolveAccess fängt Datenbankfehler selbst ab ("stoerung"), und
 * Next.js braucht den unveränderten Abbruch beim Vorrendern (Zugriff auf Header).
 */
export async function GET(request: Request) {
  const r = await resolveAccess(readAccessCookie(request));
  if (!r.ok) {
    return Response.json(
      { error: REASON_TEXT[r.reason], grund: r.reason },
      { status: r.reason === "stoerung" ? 503 : 401 },
    );
  }
  if (r.access.role === "nutzer") {
    return Response.json({
      rolle: "nutzer",
      name: r.access.record.label,
      ablauf: r.access.record.expiresAt,
    });
  }
  return Response.json({ rolle: r.access.role });
}
