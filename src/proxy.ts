import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, resolveAccess } from "@/lib/access/session";

/**
 * Seitenschutz: ohne gültigen Zugang → /zugang (mit Grund, z. B. "anderes-geraet").
 * /admin nur mit Master-Code.
 * API-Routen sind ausgenommen (siehe matcher): Der Proxy würde große Uploads
 * (> 10 MB) abschneiden. Die APIs prüfen den Zugang selbst.
 */
export async function proxy(request: NextRequest) {
  const result = await resolveAccess(request.cookies.get(ACCESS_COOKIE)?.value);
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (result.ok && (!isAdminPath || result.access.role !== "nutzer")) {
    return NextResponse.next();
  }

  const target = new URL("/zugang", request.url);
  if (!result.ok && result.reason !== "keine-anmeldung") target.searchParams.set("grund", result.reason);
  if (result.ok && isAdminPath) target.searchParams.set("grund", "nur-master");

  const response = NextResponse.redirect(target);
  // Ungültigen Cookie entfernen, damit das alte Gerät sauber abgemeldet ist
  // (nicht bei einer kurzen Störung – dann bleibt die Anmeldung erhalten).
  if (!result.ok && result.reason !== "stoerung" && request.cookies.has(ACCESS_COOKIE)) {
    response.cookies.delete(ACCESS_COOKIE);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|zugang|_next/static|_next/image|favicon.ico|worklets).*)"],
};
