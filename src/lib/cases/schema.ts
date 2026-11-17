import { z } from "zod";

/**
 * Fallschema nach dem Vorbild der FaMed-Übungstests:
 * - candidateSheet = Blatt für den Prüfling (TN)
 * - actorCard      = verdeckte Rollenkarte für Schauspieler:in (S) – nur serverseitig verwenden
 * - rubric         = Bewertungshilfe (B)
 */

export const stationTypeSchema = z.enum([
  "anamnese",
  "aufklaerung",
  "vorstellung",
  "arztbrief",
]);
export type StationType = z.infer<typeof stationTypeSchema>;

export const STATION_LABELS: Record<StationType, string> = {
  anamnese: "Anamnesegespräch",
  aufklaerung: "Aufklärungsgespräch",
  vorstellung: "Patientenvorstellung",
  arztbrief: "Arztbrief",
};

const checklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight: z.number().positive().default(1),
});

export const caseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().positive(),
  stationType: stationTypeSchema,
  title: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  candidateSheet: z.object({
    kurzbeschreibung: z.string().min(1),
    gesprächspartner: z.string().min(1),
    patientInfo: z.array(z.object({ label: z.string(), value: z.string() })),
    aufgaben: z.array(z.string().min(1)).min(1),
  }),
  actorCard: z.object({
    role: z.enum(["patient", "kollege"]),
    name: z.string().min(1),
    /** Vorgefertigte Gemini-Stimme */
    voice: z.string().min(1),
    persona: z.string().min(1),
    /** Fakten, die nur auf Nachfrage preisgegeben werden */
    facts: z.array(z.string().min(1)).min(1),
    /** Rückfragen, die im Gespräch gestellt werden sollen */
    followUpQuestions: z.array(z.string().min(1)),
  }),
  rubric: z.object({
    checklist: z.array(checklistItemSchema).min(1),
    /** Fachbegriffe, die im Patientengespräch erklärt werden müssen */
    fachbegriffe: z.array(z.string()),
  }),
  /** Fachbegriffe, die die Spracherkennung zuverlässig erkennen soll */
  vocabulary: z.array(z.string()).max(100),
});

export type Case = z.infer<typeof caseSchema>;

/** Teil des Falls, der an den Browser gehen darf (ohne verdeckte Rollenkarte). */
export type PublicCase = Omit<Case, "actorCard" | "rubric"> & {
  actorCard: Pick<Case["actorCard"], "name" | "role">;
};

export function toPublicCase(c: Case): PublicCase {
  return {
    id: c.id,
    version: c.version,
    stationType: c.stationType,
    title: c.title,
    durationSeconds: c.durationSeconds,
    candidateSheet: c.candidateSheet,
    vocabulary: c.vocabulary,
    actorCard: { name: c.actorCard.name, role: c.actorCard.role },
  };
}
