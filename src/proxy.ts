import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, hasAccess } from "@/lib/access";

/**
 * Leitet Seitenaufrufe ohne gültigen Zugangscode auf /zugang um.
 * API-Routen sind bewusst ausgenommen (siehe matcher): Der Proxy würde große
 * Uploads (Aufnahmen > 10 MB) abschneiden. Die API prüft den Zugang selbst.
 */
export async function proxy(request: NextRequest) {
  if (await hasAccess(request.cookies.get(ACCESS_COOKIE)?.value)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/zugang", request.url));
}

export const config = {
  matcher: ["/((?!api|zugang|_next/static|_next/image|favicon.ico|worklets).*)"],
};
