import { z } from "zod";
import { loginWithCode, logoutSession } from "@/lib/access/store";
import {
  MASTER_COOKIE_MAX_AGE,
  REASON_TEXT,
  buildCookie,
  clearCookie,
  isMasterCode,
  isOpenMode,
  isSecureRequest,
  masterCode,
  masterCookieValue,
  readAccessCookie,
  userCookieValue,
} from "@/lib/access/session";
import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { errorResponse } from "@/lib/server/env";

const bodySchema = z.object({ code: z.string().max(200) });

/** Anmeldung mit Master-Code oder persönlichem Code. */
export async function POST(request: Request) {
  if (isOpenMode()) return Response.json({ ok: true, rolle: "offen" });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  const code = parsed.success ? parsed.data.code.trim() : "";
  const secure = isSecureRequest(request);

  if (code && isMasterCode(code)) {
    const value = await masterCookieValue(masterCode()!);
    return Response.json(
      { ok: true, rolle: "master" },
      { headers: { "Set-Cookie": buildCookie(value, MASTER_COOKIE_MAX_AGE, secure) } },
    );
  }

  try {
    const result =
      code && isDatabaseConfigured()
        ? await loginWithCode(getDb(), code)
        : ({ ok: false, reason: "unbekannt" } as const);

    if (!result.ok) {
      // Bremst automatisches Durchprobieren.
      await new Promise((res) => setTimeout(res, 800));
      return Response.json({ error: REASON_TEXT[result.reason], grund: result.reason }, { status: 401 });
    }

    const { record, sessionToken } = result;
    const maxAge = (record.expiresAt!.getTime() - Date.now()) / 1000;
    return Response.json(
      { ok: true, rolle: "nutzer", ablauf: record.expiresAt },
      { headers: { "Set-Cookie": buildCookie(userCookieValue(record.id, sessionToken), maxAge, secure) } },
    );
  } catch (err) {
    return errorResponse(err);
  }
}

/** Abmelden auf diesem Gerät. */
export async function DELETE(request: Request) {
  const cookie = readAccessCookie(request);
  const m = cookie && /^u\.([0-9a-f-]{36})\.(.+)$/i.exec(cookie);
  if (m && isDatabaseConfigured()) {
    await logoutSession(getDb(), m[1], m[2]).catch(() => undefined);
  }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearCookie(isSecureRequest(request)) } });
}
