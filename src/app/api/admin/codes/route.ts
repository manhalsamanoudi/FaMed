import { z } from "zod";
import { toAdminCode } from "@/lib/access/admin-dto";
import { MAX_DURATION_HOURS } from "@/lib/access/codes";
import { requireMaster } from "@/lib/access/session";
import { createCode, listCodes } from "@/lib/access/store";
import { getDb } from "@/lib/db/client";
import { errorResponse } from "@/lib/server/env";

const createSchema = z.object({
  name: z.string().trim().min(1, "Bitte einen Namen eingeben.").max(80),
  art: z.enum(["nutzer", "test"]),
  stunden: z.number().int().min(1).max(MAX_DURATION_HOURS),
});

export async function GET(request: Request) {
  const denied = await requireMaster(request);
  if (denied) return denied;
  try {
    const codes = await listCodes(getDb());
    return Response.json({ codes: codes.map((c) => toAdminCode(c)) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: Request) {
  const denied = await requireMaster(request);
  if (denied) return denied;
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 },
    );
  }
  try {
    const created = await createCode(getDb(), {
      label: parsed.data.name,
      kind: parsed.data.art,
      durationHours: parsed.data.stunden,
    });
    return Response.json({ code: toAdminCode(created) }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
