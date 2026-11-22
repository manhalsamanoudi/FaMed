import { z } from "zod";
import type { StationType } from "@/lib/cases/schema";

/** Kriteriencluster nach Prüfungsordnung FaMed § 3 (5). */
export const CLUSTERS = {
  textsorte: "Angemessenheit der Textsorte",
  pragmatik: "Sozio-/pragmalinguistische Angemessenheit",
  strukturell: "Strukturelle Korrektheit",
  global: "Globale Gesamtbewertung",
} as const;
export type ClusterKey = keyof typeof CLUSTERS;

/** FaMed: jede Station muss mindestens 60 % erreichen, ein Ausgleich ist nicht möglich. */
export const PASS_THRESHOLD = 60;

const clusterScore = z.object({
  punkte: z.number().min(0).max(100).describe("Punkte von 0 bis 100 nach den Bandbeschreibungen"),
  begruendung: z.string().describe("2–3 Sätze Begründung mit konkreten Beispielen"),
});

const bogenAntwort = z.string().describe("2–3 Sätze, konkret mit Beispielen");

export const evaluationSchema = z.object({
  wortgetreuesTranskript: z
    .string()
    .describe(
      "Wortgetreues Transkript NUR der Äußerungen des Prüflings aus der Audioaufnahme, inkl. Füllwörtern (ähm), Abbrüchen, Wiederholungen und Fehlern. Nichts korrigieren.",
    ),
  bewertungsbogen: z
    .object({
      aufgabenerfuellung: bogenAntwort,
      klarheit: bogenAntwort,
      angemessenheit: bogenAntwort,
      fehler: bogenAntwort,
      gesamteindruck: bogenAntwort,
    })
    .describe("Antworten auf die fünf Leitfragen der Bewertenden"),
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
  faktenfehler: z
    .array(
      z.object({
        zitat: z.string().describe("die falsche Angabe im exakten Wortlaut des Prüflings"),
        richtig: z.string().describe("die richtige Angabe laut Aufgabenblatt bzw. Gespräch"),
      }),
    )
    .describe("falsch übertragene Fakten (Zahn, Seite, Medikament, Dosierung, Allergie, Zeitangabe), maximal 8, sonst leer"),
  fehler: z
    .array(
      z.object({
        zitat: z.string().describe("fehlerhafte Äußerung im Wortlaut"),
        korrektur: z.string().describe("korrekte Formulierung"),
        kategorie: z.enum(["Grammatik", "Wortschatz", "Satzbau", "Aussprache", "Register", "Orthografie"]),
        erklaerung: z.string().describe("kurze, verständliche Erklärung"),
      }),
    )
    .describe("die wichtigsten sprachlichen Fehler, maximal 12"),
  fehlerAnzahl: z
    .number()
    .min(0)
    .describe(
      "Gesamtzahl ALLER strukturellen Fehler (Grammatik, Satzbau, Wortschatz, Orthografie, Zeichensetzung) im gesamten Text bzw. in allen Äußerungen – auch die, die nicht in der Fehlerliste stehen",
    ),
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

/** Messwerte, die ohne KI aus Transkript bzw. Brief berechnet werden. */
export type Kennzahlen =
  | { art: "gespraech"; woerterPruefling: number; redeanteil: number | null; rollenfragen: number }
  | {
      art: "brief";
      woerter: number;
      stichpunktZeilen: number;
      hatAnrede: boolean;
      hatGruss: boolean;
      /** Verben im Anamnese-Teil: Konjunktiv I bzw. Indikativ */
      konjunktiv: number;
      indikativ: number;
    };

/** Antwort von POST /api/evaluate bzw. /api/evaluate-letter */
export type EvaluateResponse = {
  evaluation: Evaluation;
  station: StationType;
  overall: number;
  /** Bestanden nach FaMed-Regel (≥ 60 %) und ohne K.-o.-Kriterium */
  bestanden: boolean;
  coverage: number;
  /** Welche Prüfungsregeln automatisch angewendet wurden (Punktobergrenzen, K.-o.) */
  hinweise: string[];
  kennzahlen: Kennzahlen;
  checklistLabels: Record<string, string>;
  model: string;
  /** Beispielformulierungen aus dem Fall (erst nach der Auswertung sichtbar) */
  beispiele: { zu: string; saetze: string[] }[];
  /** Nur Arztbrief */
  musterbrief?: string;
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
