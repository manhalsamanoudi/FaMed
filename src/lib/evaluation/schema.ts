import { z } from "zod";

/** Kriteriencluster nach Prüfungsordnung FaMed § 3 (5). */
export const CLUSTERS = {
  textsorte: "Angemessenheit der Textsorte",
  pragmatik: "Sozio-/pragmalinguistische Angemessenheit",
  strukturell: "Strukturelle Korrektheit",
  global: "Globale Gesamtbewertung",
} as const;
export type ClusterKey = keyof typeof CLUSTERS;

export const PASS_THRESHOLD = 60;

const clusterScore = z.object({
  punkte: z.number().min(0).max(100).describe("Punkte von 0 bis 100"),
  begruendung: z.string().describe("2–3 Sätze Begründung mit konkreten Beispielen"),
});

export const evaluationSchema = z.object({
  wortgetreuesTranskript: z
    .string()
    .describe(
      "Wortgetreues Transkript NUR der Äußerungen des Prüflings aus der Audioaufnahme, inkl. Füllwörtern (ähm), Abbrüchen, Wiederholungen und Fehlern. Nichts korrigieren.",
    ),
  cluster: z.object({
    textsorte: clusterScore,
    pragmatik: clusterScore,
    strukturell: clusterScore,
    global: clusterScore,
  }),
  checkliste: z.array(
    z.object({
      id: z.string().describe("id des Checklistenpunkts"),
      status: z.enum(["erfuellt", "teilweise", "fehlt"]),
      beleg: z.string().describe("kurzes Zitat aus dem Gespräch oder leer"),
    }),
  ),
  fehler: z
    .array(
      z.object({
        zitat: z.string().describe("fehlerhafte Äußerung im Wortlaut"),
        korrektur: z.string().describe("korrekte Formulierung"),
        kategorie: z.enum(["Grammatik", "Wortschatz", "Satzbau", "Aussprache", "Register"]),
        erklaerung: z.string().describe("kurze, verständliche Erklärung"),
      }),
    )
    .describe("die wichtigsten sprachlichen Fehler, maximal 12"),
  nichtErklaerteFachbegriffe: z.array(
    z.object({
      begriff: z.string(),
      laienVorschlag: z.string().describe("laienverständliche Alternative"),
    }),
  ),
  ausspracheHinweise: z
    .array(z.object({ wort: z.string(), hinweis: z.string() }))
    .describe("auffällig ausgesprochene Wörter, maximal 8"),
  fluessigkeit: z.string().describe("2–3 Sätze zu Sprechfluss, Pausen, Wortsuche"),
  empfehlungen: z.array(z.string()).describe("genau 3 konkrete Verbesserungsempfehlungen"),
});

export type Evaluation = z.infer<typeof evaluationSchema>;

/** Antwort von POST /api/evaluate */
export type EvaluateResponse = {
  evaluation: Evaluation;
  overall: number;
  coverage: number;
  checklistLabels: Record<string, string>;
  model: string;
};

export function overallScore(e: Evaluation): number {
  const keys = Object.keys(CLUSTERS) as ClusterKey[];
  const sum = keys.reduce((n, k) => n + e.cluster[k].punkte, 0);
  return Math.round(sum / keys.length);
}

export function checklistCoverage(
  e: Evaluation,
  weights: Record<string, number>,
): number {
  let total = 0;
  let reached = 0;
  for (const [id, w] of Object.entries(weights)) {
    total += w;
    const item = e.checkliste.find((c) => c.id === id);
    if (item?.status === "erfuellt") reached += w;
    else if (item?.status === "teilweise") reached += w / 2;
  }
  return total === 0 ? 0 : Math.round((reached / total) * 100);
}
