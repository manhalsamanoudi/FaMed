import type { CaseInput, Punkt } from "@/lib/cases/schema";

type ChecklistItem = { id: string; label: string; weight: number };

/** Standard-Punkte der Lokalanästhesie-Aufklärung (wie im Übungstest). */
export const LA_RISIKEN = ["Schmerzen, Schwellung, Infektion", "Verletzung benachbarter Strukturen", "allergische Reaktion"];

export const ELF_MINUTEN = 11 * 60;

/**
 * Checkliste aus dem Aufgabentext eines Aufklärungsgesprächs:
 * jeder Unterpunkt (z. B. jedes spezielle Risiko, jede Verhaltensregel) wird ein Prüfpunkt.
 */
export function checklisteAufklaerung(punkte: Punkt[]): ChecklistItem[] {
  const items: ChecklistItem[] = [
    { id: "einstieg", label: "Begrüßung, Gesprächsanlass, Diagnose und Behandlungsgrund laienverständlich erklärt", weight: 2 },
  ];
  punkte.forEach((p, i) => {
    const thema = p.text.replace(/:$/, "");
    if (!p.unterpunkte?.length) {
      items.push({ id: `p${i + 1}`, label: thema, weight: 2 });
      return;
    }
    p.unterpunkte.forEach((u, j) => {
      if (u.unterpunkte?.length) {
        u.unterpunkte.forEach((uu, k) =>
          items.push({ id: `p${i + 1}-${j + 1}-${k + 1}`, label: `${thema} – ${u.text.replace(/:$/, "")}: ${uu.text}`, weight: 1 }),
        );
      } else {
        items.push({ id: `p${i + 1}-${j + 1}`, label: `${thema}: ${u.text}`, weight: 1 });
      }
    });
  });
  items.push(
    { id: "verstaendnis", label: "Verständnis rückversichert und Raum für Fragen gegeben", weight: 1 },
    { id: "rueckfragen", label: "Rückfragen angemessen und laienverständlich beantwortet", weight: 2 },
  );
  return items;
}

export const AUFGABEN_VORSTELLUNG: Punkt[] = [
  { text: "Patientendaten (Name, Alter)" },
  { text: "Anamnese inkl. medizinischer Vorgeschichte" },
  { text: "Bisherige Diagnostik" },
  { text: "Medikation" },
  { text: "Verlauf und Procedere" },
];

export function checklisteVorstellung(): ChecklistItem[] {
  return [
    { id: "einstieg", label: "Kollegialer Einstieg und Anlass der Vorstellung", weight: 1 },
    { id: "daten", label: "Patientendaten (Name, Alter) und Verdachtsdiagnose", weight: 1 },
    { id: "anamnese", label: "Hauptsymptomatik und Anamnese vollständig", weight: 2 },
    { id: "vorgeschichte", label: "Vorerkrankungen, Allergien, Risikofaktoren, Familienanamnese", weight: 2 },
    { id: "diagnostik", label: "Bisherige Diagnostik (extra-/intraoral, Röntgen) korrekt", weight: 2 },
    { id: "medikation", label: "Bisherige und neu angesetzte Medikation mit korrekter Dosierung", weight: 2 },
    { id: "procedere", label: "Verlauf und Procedere vollständig und in sinnvoller Reihenfolge", weight: 2 },
    { id: "rueckfragen", label: "Rückfragen knapp und präzise beantwortet", weight: 2 },
  ];
}

export function checklisteAnamnese(extra: ChecklistItem[]): ChecklistItem[] {
  return [
    { id: "begruessung", label: "Begrüßung, Vorstellung, offene Einstiegsfrage", weight: 1 },
    { id: "lokalisation", label: "Lokalisation der Beschwerden", weight: 1 },
    { id: "beginn", label: "Beginn, Dauer und Verlauf", weight: 1 },
    { id: "charakter", label: "Schmerzcharakter, Auslöser, Ausstrahlung", weight: 1 },
    { id: "begleitsymptome", label: "Begleitsymptome", weight: 2 },
    { id: "medikation-akut", label: "Bisherige Schmerzmedikation", weight: 1 },
    { id: "vorerkrankungen", label: "Vorerkrankungen", weight: 1 },
    { id: "dauermedikation", label: "Dauermedikation / Blutverdünner", weight: 1 },
    { id: "allergien", label: "Allergien", weight: 2 },
    { id: "noxen", label: "Nikotin- und Alkoholkonsum", weight: 1 },
    { id: "zahnarztbesuch", label: "Letzter Zahnarztbesuch / frühere Episoden", weight: 1 },
    ...extra,
    { id: "roentgen", label: "Röntgenbefund laienverständlich erklärt", weight: 2 },
    { id: "verdachtsdiagnose", label: "Verdachtsdiagnose laienverständlich erklärt", weight: 2 },
    { id: "procedere", label: "Nächste Schritte verständlich erklärt", weight: 2 },
    { id: "rueckfragen", label: "Rückfragen angemessen beantwortet", weight: 1 },
  ];
}

type AufklaerungInput = {
  id: string;
  title: string;
  untertitel: string;
  /** "Herrn/Frau Yilmaz" */
  anrede: string;
  /** "Herr Yilmaz (Patient)" */
  partner: string;
  situation: string;
  kurzZusatz?: string;
  info: { label: string; wert: string | string[] }[];
  allgemeineRisiken: string;
  spezielleRisiken: string[];
  la?: string[];
  prae: string[];
  post: string[];
  actor: NonNullable<CaseInput["actorCard"]>;
  fachbegriffe: string[];
  vocabulary: string[];
  beispiele: { zu: string; saetze: string[] }[];
};

/** Baut ein Aufklärungsgespräch im Format des Übungstests. */
export function aufklaerungsFall(i: AufklaerungInput): CaseInput {
  const punkte: Punkt[] = [
    { text: "den Operationsablauf" },
    {
      text: "die Risiken:",
      unterpunkte: [
        { text: `allgemeine Risiken: ${i.allgemeineRisiken}` },
        { text: "spezielle Risiken:", unterpunkte: i.spezielleRisiken.map((t) => ({ text: t })) },
      ],
    },
    { text: "die Lokalanästhesie:", unterpunkte: (i.la ?? LA_RISIKEN).map((t) => ({ text: t })) },
    { text: "das präoperative Vorgehen:", unterpunkte: i.prae.map((t) => ({ text: t })) },
    { text: "das postoperative Vorgehen:", unterpunkte: i.post.map((t) => ({ text: t })) },
  ];
  // Allgemeine Risiken zählen als ein Prüfpunkt, spezielle einzeln.
  const checklist = checklisteAufklaerung(punkte);
  return {
    id: i.id,
    version: 1,
    stationType: "aufklaerung",
    title: i.title,
    untertitel: i.untertitel,
    durationSeconds: ELF_MINUTEN,
    sheet: {
      kurzbeschreibung: `Sie sind Zahnarzt/-ärztin in einer Praxis. Führen Sie ein Aufklärungsgespräch vor einem ${i.kurzZusatz ?? "Eingriff"} durch. Sie sprechen mit ${i.anrede}. Sie haben für die gesamte Situation maximal 11 Minuten Zeit.`,
      gespraechssituation: i.situation,
      gespraechspartner: i.partner,
      abschnitte: [{ titel: "Patienteninformationen", eintraege: i.info }],
      aufgabentext: {
        einleitung: `Erklären Sie ${i.anrede}:`,
        punkte,
        schluss: "Gehen Sie auf eventuelle Rückfragen ein.",
      },
    },
    actorCard: i.actor,
    rubric: { checklist, fachbegriffe: i.fachbegriffe },
    vocabulary: i.vocabulary,
    beispiele: i.beispiele,
  };
}
