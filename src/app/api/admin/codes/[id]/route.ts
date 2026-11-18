import { z } from "zod";
import { toAdminCode } from "@/lib/access/admin-dto";
import { MAX_DURATION_HOURS } from "@/lib/access/codes";
import { requireMaster } from "@/lib/access/session";
import { deleteCode, extendCode, kickDevice, setRevoked } from "@/lib/access/store";
import { getDb } from "@/lib/db/client";
import { errorResponse } from "@/lib/server/env";

const actionSchema = z.discriminatedUnion("aktion", [
  z.object({ aktion: z.literal("verlaengern"), stunden: z.number().int().min(1).max(MAX_DURATION_HOURS) }),
  z.object({ aktion: z.literal("abmelden") }),
  z.object({ aktion: z.literal("sperren") }),
  z.object({ aktion: z.literal("entsperren") }),
]);

const idSchema = z.uuid();

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/codes/[id]">) {
  const denied = await requireMaster(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!idSchema.safeParse(id).success || !parsed.success) {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  try {
    const db = getDb();
    const a = parsed.data;
    const updated =
      a.aktion === "verlaengern"
        ? await extendCode(db, id, a.stunden)
        : a.aktion === "abmelden"
          ? await kickDevice(db, id)
          : await setRevoked(db, id, a.aktion === "sperren");
    if (!updated) return Response.json({ error: "Code nicht gefunden." }, { status: 404 });
    return Response.json({ code: toAdminCode(updated) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/codes/[id]">) {
  const denied = await requireMaster(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!idSchema.safeParse(id).success) {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  try {
    const ok = await deleteCode(getDb(), id);
    return ok
      ? Response.json({ ok: true })
      : Response.json({ error: "Code nicht gefunden." }, { status: 404 });
  } catch (err) {
    return errorResponse(err);
  }
}
