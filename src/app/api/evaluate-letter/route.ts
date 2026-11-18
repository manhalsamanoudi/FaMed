import { z } from "zod";
import { getCase } from "@/content/cases";
import { requireAccess } from "@/lib/access/session";
import { buildLetterEvaluationPrompt } from "@/lib/evaluation/prompt";
import { InvalidEvaluationError, runEvaluation } from "@/lib/evaluation/run";
import { createServerClient, errorResponse, getServerEnv } from "@/lib/server/env";

export const maxDuration = 300;

const bodySchema = z.object({
  caseId: z.string().min(1),
  brief: z.string().trim().min(20, "Der Arztbrief ist zu kurz für eine Auswertung.").max(20_000),
});

/** Bewertung des schriftlichen Arztbriefs. */
export async function POST(request: Request) {
  const denied = await requireAccess(request);
  if (denied) return denied;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage." }, { status: 400 });
  }
  const c = getCase(parsed.data.caseId);
  if (!c || !c.arztbrief) {
    return Response.json({ error: "Fall nicht gefunden." }, { status: 404 });
  }

  try {
    const env = getServerEnv();
    const ai = createServerClient(env.apiKey);
    const result = await runEvaluation(ai, env.evalModels, c, [buildLetterEvaluationPrompt(c, parsed.data.brief)]);
    return Response.json(result);
  } catch (err) {
    if (err instanceof InvalidEvaluationError) {
      return Response.json({ error: err.message }, { status: 502 });
    }
    return errorResponse(err);
  }
}
