import { z } from "zod";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  accessCode,
  constantTimeEqual,
  tokenForCode,
} from "@/lib/access";

const bodySchema = z.object({ code: z.string().max(200) });

export async function POST(request: Request) {
  const code = accessCode();
  if (!code) return Response.json({ ok: true });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  const given = parsed.success ? parsed.data.code.trim() : "";

  if (!constantTimeEqual(given.toLowerCase(), code.toLowerCase())) {
    // Bremst automatisches Durchprobieren.
    await new Promise((res) => setTimeout(res, 800));
    return Response.json({ error: "Der Code ist nicht richtig." }, { status: 401 });
  }

  const secure =
    request.headers.get("x-forwarded-proto") === "https" || new URL(request.url).protocol === "https:";
  const cookie = [
    `${ACCESS_COOKIE}=${await tokenForCode(code)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ACCESS_MAX_AGE_SECONDS}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
