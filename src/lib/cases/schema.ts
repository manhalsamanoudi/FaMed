import { z } from "zod";

/**
 * Fallschema nach dem Aufbau des FaMed-Übungstests Zahnmedizin:
 * - sheet      = Blatt für den Prüfling (TN): Kurzbeschreibung, Gesprächssituation,
 *                Patienteninformationen bzw. Patienteninformationsblatt, Aufgabentext
 * - actorCard  = verdeckte Rollenkarte für Schauspieler:in (S) – nur serverseitig
 * - rubric     = Bewertungshilfe (B) – nur serverseitig
 * - beispiele  = Beispielformulierungen, erst nach der Auswertung sichtbar
 */

export const stationTypeSchema = z.enum(["anamnese", "aufklaerung", "vorstellung", "arztbrief"]);
export type StationType = z.infer<typeof stationTypeSchema>;

export const STATIONS: Record<
  StationType,
  { nr: number; label: string; bereich: string; minuten: number; kurz: string; worauf: string[] }
> = {
  anamnese: {
    nr: 1,
    label: "Anamnesegespräch",
    bereich: "Zahnarzt-Patienten-Kommunikation",
    minuten: 11,
    kurz: "Beschwerden und Vorgeschichte erheben, Verdachtsdiagnose stellen und die nächsten Schritte erklären.",
    worauf: ["Laiensprache", "Struktur", "Raum für den Patienten", "Empathie"],
  },
  aufklaerung: {
    nr: 2,
    label: "Aufklärungsgespräch",
    bereich: "Zahnarzt-Patienten-Kommunikation",
    minuten: 11,
    kurz: "Ablauf, Risiken, Lokalanästhesie sowie Verhalten vor und nach dem Eingriff verständlich erklären.",
    worauf: ["Fachbegriffe übersetzen", "Verständnis rückversichern", "auf Ängste eingehen"],
  },
  vorstellung: {
    nr: 3,
    label: "Patientenvorstellung",
    bereich: "Zahnarzt-Zahnarzt-Kommunikation",
    minuten: 11,
    kurz: "Einen Fall einer erfahrenen Kollegin bzw. einem erfahrenen Kollegen vorstellen und Rückfragen beantworten.",
    worauf: ["Fachsprache", "knapp und präzise", "Zahlen und Dosierungen fehlerfrei"],
  },
  arztbrief: {
    nr: 4,
    label: "Arztbrief",
    bereich: "Schriftliche Station",
    minuten: 22,
    kurz: "Ein Anamnesegespräch anhören und daraus einen Arztbrief in ganzen Sätzen schreiben.",
    worauf: ["Konjunktiv I", "Fachsprache", "Vollständigkeit", "Orthografie"],
  },
};

/** Für bestehenden Code: Kurzname der Station. */
export const STATION_LABELS: Record<StationType, string> = Object.fromEntries(
  Object.entries(STATIONS).map(([k, v]) => [k, v.label]),
) as Record<StationType, string>;

export type Punkt = { text: string; unterpunkte?: Punkt[] };
const punktSchema: z.ZodType<Punkt> = z.lazy(() =>
  z.object({ text: z.string().min(1), unterpunkte: z.array(punktSchema).optional() }),
);

const eintragSchema = z.object({
  label: z.string().min(1),
  /** Einzeiliger Wert oder Aufzählung */
  wert: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
});

export const sheetSchema = z.object({
  kurzbeschreibung: z.string().min(1),
  gespraechssituation: z.string().min(1),
  /** z. B. "Herr Yilmaz (Patient)" – wird neben dem Gesprächspartner angezeigt */
  gespraechspartner: z.string().min(1),
  /** z. B. "Patienteninformationen", "Patienteninformationsblatt", "Bisherige Diagnostik" */
  abschnitte: z.array(z.object({ titel: z.string().min(1), eintraege: z.array(eintragSchema).min(1) })),
  aufgabentext: z.object({
    einleitung: z.string().min(1),
    punkte: z.array(punktSchema).min(1),
    schluss: z.string().optional(),
  }),
});
export type Sheet = z.infer<typeof sheetSchema>;

const checklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight: z.number().positive().default(1),
});

export const caseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().positive(),
  stationType: stationTypeSchema,
  /** Kurzer Titel in der Themenliste, z. B. "Implantation Zahn 36" */
  title: z.string().min(1),
  /** Eine Zeile Beschreibung in der Themenliste */
  untertitel: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  sheet: sheetSchema,
  actorCard: z
    .object({
      role: z.enum(["patient", "kollege"]),
      name: z.string().min(1),
      /** Vorgefertigte Gemini-Stimme */
      voice: z.string().min(1),
      persona: z.string().min(1),
      /** Fakten, die die Rolle kennt (Patient: nur auf Nachfrage preisgeben) */
      facts: z.array(z.string().min(1)),
      /** Rückfragen, die im Gespräch gestellt werden sollen */
      followUpQuestions: z.array(z.string().min(1)),
    })
    .optional(),
  rubric: z.object({
    checklist: z.array(checklistItemSchema).min(1),
    /** Fachbegriffe, die im Patientengespräch erklärt werden müssen */
    fachbegriffe: z.array(z.string()),
  }),
  /** Fachbegriffe, die die Spracherkennung zuverlässig erkennen soll */
  vocabulary: z.array(z.string()).max(100),
  /** Beispielformulierungen (nach der Auswertung sichtbar) */
  beispiele: z.array(z.object({ zu: z.string(), saetze: z.array(z.string().min(1)).min(1) })).default([]),
  /** Nur Arztbrief: Gespräch zum Anhören */
  arztbrief: z
    .object({
      audioSrc: z.string().startsWith("/"),
      /**
       * Gesprächsskript (Grundlage für Audio und Bewertung). Geräusche in eckigen Klammern
       * („[seufzt]“) setzt die Sprachausgabe als Geräusch um; „stil“ ist eine Regieanweisung für diese Zeile.
       */
      dialog: z
        .array(
          z.object({
            sprecher: z.enum(["Zahnarzt", "Patient"]),
            text: z.string().min(1),
            stil: z.string().min(1).optional(),
          }),
        )
        .min(4),
      /** Stimmen (Gemini-TTS) */
      sprecher: z.object({ Zahnarzt: z.string().min(1), Patient: z.string().min(1) }),
      /** Grundcharakter der Sprecher für die Sprachausgabe */
      sprechweise: z.object({ Zahnarzt: z.string().min(1), Patient: z.string().min(1) }).optional(),
      musterbrief: z.string().min(1),
    })
    .optional(),
});

export type Case = z.infer<typeof caseSchema>;
export type CaseInput = z.input<typeof caseSchema>;

/** Teil des Falls, der an den Browser gehen darf (ohne Rollenkarte, Rubrik, Beispiele, Skript). */
export type PublicCase = {
  id: string;
  stationType: StationType;
  title: string;
  untertitel: string;
  durationSeconds: number;
  sheet: Sheet;
  rolle: "patient" | "kollege" | null;
  audioSrc: string | null;
};

export function toPublicCase(c: Case): PublicCase {
  return {
    id: c.id,
    stationType: c.stationType,
    title: c.title,
    untertitel: c.untertitel,
    durationSeconds: c.durationSeconds,
    sheet: c.sheet,
    rolle: c.actorCard?.role ?? null,
    audioSrc: c.arztbrief?.audioSrc ?? null,
  };
}

/** Text eines Punkts inkl. Unterpunkte, eingerückt (für Prompts). */
export function punkteAlsText(punkte: Punkt[], tiefe = 0): string {
  return punkte
    .map((p) => {
      const zeile = `${"  ".repeat(tiefe)}- ${p.text}`;
      return p.unterpunkte?.length ? `${zeile}\n${punkteAlsText(p.unterpunkte, tiefe + 1)}` : zeile;
    })
    .join("\n");
}

export function sheetAlsText(s: Sheet): string {
  const abschnitte = s.abschnitte
    .map(
      (a) =>
        `${a.titel}:\n` +
        a.eintraege
          .map((e) => (Array.isArray(e.wert) ? `${e.label}:\n${e.wert.map((w) => `  - ${w}`).join("\n")}` : `${e.label}: ${e.wert}`))
          .join("\n"),
    )
    .join("\n\n");
  return [
    `Kurzbeschreibung: ${s.kurzbeschreibung}`,
    `Gesprächssituation: ${s.gespraechssituation}`,
    abschnitte,
    `Aufgabentext: ${s.aufgabentext.einleitung}\n${punkteAlsText(s.aufgabentext.punkte)}${s.aufgabentext.schluss ? `\n${s.aufgabentext.schluss}` : ""}`,
  ].join("\n\n");
}
