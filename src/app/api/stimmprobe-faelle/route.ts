import { listCases } from "@/content/cases";

/**
 * Nur Entwicklung: Liste der Gesprächsrollen für scripts/stimmprobe.mjs.
 * In Produktion gibt es diese Route nicht.
 */
export function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Nicht gefunden." }, { status: 404 });
  }
  return Response.json(
    listCases()
      .filter((c) => c.actorCard)
      .map((c) => ({
        id: c.id,
        stationType: c.stationType,
        stimme: c.actorCard!.voice,
        rolle: c.actorCard!.role === "kollege" ? "Kolleg:in" : "Patient:in",
        beschreibung: `${c.actorCard!.name}, ${c.actorCard!.persona.split(". ").slice(0, 2).join(". ")}`,
      })),
  );
}
