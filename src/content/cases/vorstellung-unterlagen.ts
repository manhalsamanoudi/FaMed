import type { CaseInput } from "@/lib/cases/schema";
import { ELF_MINUTEN, checklisteVorstellung } from "./helpers";
import { KOLLEGE_ROLLE, aufgabentext, kurzbeschreibung } from "./vorstellung";

// ---------------------------------------------------------------------------
// Patientenvorstellungen aus den Unterlagen im Ordner „Fälle/PV“
// (Patienteninformationsblätter + mögliche Lösungen; Formulierungen sprachlich überarbeitet).
// ---------------------------------------------------------------------------

type Wert = string | string[];

type VorstellungInput = {
  id: string;
  title: string;
  untertitel: string;
  /** "Herrn/Frau Dr. Hoffmann" */
  anrede: string;
  /** "Dr. Hoffmann (Kollegin)" */
  partner: string;
  info: {
    diagnose: string;
    name: string;
    anamnese: string[];
    vorerkrankungen: Wert;
    medikation: Wert;
    allergien: string;
    risikofaktoren: Wert;
    familienanamnese: string;
  };
  diagnostik: { label: string; wert: Wert }[];
  neueMedikation: Wert;
  procedere: string[];
  actor: NonNullable<CaseInput["actorCard"]>;
  vocabulary: string[];
  beispiele: { zu: string; saetze: string[] }[];
};

function vorstellungsFall(i: VorstellungInput): CaseInput {
  return {
    id: i.id,
    version: 1,
    stationType: "vorstellung",
    title: i.title,
    untertitel: i.untertitel,
    durationSeconds: ELF_MINUTEN,
    sheet: {
      kurzbeschreibung: kurzbeschreibung(i.anrede),
      gespraechssituation: "Patientenvorstellung",
      gespraechspartner: i.partner,
      abschnitte: [
        {
          titel: "Patienteninformationsblatt",
          eintraege: [
            { label: "(Verdachts-)Diagnose / Leitsymptom", wert: i.info.diagnose },
            { label: "Name, Alter", wert: i.info.name },
            { label: "Hauptsymptomatik / Anamnese", wert: i.info.anamnese },
            { label: "Vorerkrankungen", wert: i.info.vorerkrankungen },
            { label: "Bisherige Medikation", wert: i.info.medikation },
            { label: "Allergien", wert: i.info.allergien },
            { label: "Risikofaktoren", wert: i.info.risikofaktoren },
            { label: "Familienanamnese", wert: i.info.familienanamnese },
          ],
        },
        {
          titel: "Bisherige Diagnostik",
          eintraege: [
            ...i.diagnostik,
            { label: "Neu angesetzte Medikation", wert: i.neueMedikation },
            { label: "Procedere", wert: i.procedere },
          ],
        },
      ],
      aufgabentext: aufgabentext(i.anrede),
    },
    actorCard: i.actor,
    rubric: { checklist: checklisteVorstellung(), fachbegriffe: [] },
    vocabulary: i.vocabulary,
    beispiele: i.beispiele,
  };
}

const EINSTIEG = (kollege: string) =>
  `Guten Tag, ${kollege}, haben Sie kurz Zeit? Ich würde Ihnen gerne einen Patienten/eine Patientin vorstellen, den/die ich heute behandelt habe, und mit Ihnen das weitere Vorgehen besprechen.`;

// ---------------------------------------------------------------------------
export const abszessExtraktion46: CaseInput = vorstellungsFall({
  id: "vorstellung-abszess-extraktion-46",
  title: "Akuter apikaler Abszess an Zahn 46",
  untertitel: "Inzision und Extraktion, Penicillinallergie, Gastritis",
  anrede: "Frau Dr. Hoffmann",
  partner: "Dr. Hoffmann (Kollegin)",
  info: {
    diagnose: "Akuter apikaler Abszess an Zahn 46",
    name: "Herr Markus Klein, 47 Jahre",
    anamnese: [
      "seit drei Tagen zunehmende Zahnschmerzen im rechten Unterkiefer",
      "seit gestern deutliche Schwellung im rechten Unterkiefer",
      "starke Schmerzen beim Zubeißen, Schmerzintensität 8/10",
      "Zahn fühlt sich „zu hoch“ an",
      "unangenehmer Geschmack im Mund und Eiteraustritt",
      "erhöhte Temperatur seit heute Morgen",
      "Ibuprofen 400 mg mit nur kurzfristiger Wirkung",
    ],
    vorerkrankungen: ["arterielle Hypertonie", "chronische Gastritis"],
    medikation: ["Ramipril 5 mg (1–0–0)", "Pantoprazol 40 mg (1–0–0)"],
    allergien: "Penicillinallergie",
    risikofaktoren: [
      "unregelmäßige zahnärztliche Kontrollen",
      "unzureichende Mundhygiene",
      "ausgeprägte kariöse Läsion an Zahn 46",
      "Nikotinkonsum, ca. 10 Zigaretten täglich",
    ],
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    {
      label: "Extraorale Untersuchung",
      wert: [
        "deutliche Schwellung und Druckdolenz im rechten Unterkieferbereich",
        "leicht druckdolente submandibuläre Lymphknoten rechts",
        "leichte Einschränkung der Mundöffnung",
        "keine Sensibilitätsstörungen",
      ],
    },
    {
      label: "Intraorale Untersuchung",
      wert: [
        "Zahn 46 stark kariös und substanzgeschwächt",
        "vestibuläre Schwellung mit Fluktuation und purulenter Sekretion regio 46",
        "Zahn 46 stark perkussionsempfindlich",
        "Vitalitätsprobe an Zahn 46 negativ",
      ],
    },
    {
      label: "Orthopantomogramm (OPG)",
      wert: [
        "ausgedehnte kariöse Destruktion an Zahn 46",
        "große periapikale Aufhellung an den Wurzeln von Zahn 46",
        "verbreiterter Parodontalligamentspalt",
        "keine Fraktur des Zahnes, keine Beteiligung des Mandibularkanals",
      ],
    },
  ],
  neueMedikation: ["Clindamycin 600 mg (1–1–1)", "Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich"],
  procedere: [
    "Inzision und Drainage des Abszesses",
    "Extraktion des nicht erhaltungswürdigen Zahnes 46",
    "Spülung und Versorgung der Abszesshöhle",
    "postoperative antibiotische Therapie unter Berücksichtigung der Penicillinallergie",
    "klinische Kontrolle nach zwei bis drei Tagen",
    "nach Abklingen der Akutphase Planung der definitiven prothetischen Versorgung",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Petra Hoffmann",
    voice: "Gacrux",
    sprechweise:
      "Erfahrene Zahnärztin Anfang sechzig, warm, aber direkt; etwas rauchige, tiefere Stimme; spricht im normalen Praxistempo, kommentiert beiläufig („mhm, okay, klassisch“), fragt knapp nach. Kein Nachrichtensprecher-Ton.",
    persona: `${KOLLEGE_ROLLE} Du bist erfahren in der Chirurgie und achtest besonders auf Allergien und Antibiotika.`,
    facts: [
      "Achte darauf, ob die Penicillinallergie erwähnt und das Antibiotikum (Clindamycin 600 mg dreimal täglich) korrekt genannt wird.",
      "Achte auf die korrekte Zahnangabe 46 und die Reihenfolge Inzision → Extraktion → Kontrolle.",
    ],
    followUpQuestions: [
      "Warum haben Sie sich für Clindamycin entschieden?",
      "Warum ist der Zahn 46 nicht erhaltungswürdig?",
      "Gab es Hinweise auf eine Beteiligung des Mandibularkanals oder Sensibilitätsstörungen?",
      "Wann sehen Sie den Patienten wieder, und was planen Sie danach?",
    ],
  },
  vocabulary: [
    "apikal", "Abszess", "Inzision", "Drainage", "Extraktion", "Fluktuation", "purulent", "perkussionsempfindlich",
    "Vitalitätsprobe", "Orthopantomogramm", "periapikal", "Parodontalligamentspalt", "Mandibularkanal", "submandibulär",
    "druckdolent", "Clindamycin", "Ibuprofen", "Ramipril", "Pantoprazol", "Gastritis", "Penicillinallergie", "Dysgeusie",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Frau Dr. Hoffmann"),
        "Es handelt sich um Herrn Markus Klein, 47 Jahre alt. Die Verdachtsdiagnose lautet akuter apikaler Abszess an Zahn 46.",
        "Der Patient stellte sich mit seit drei Tagen zunehmenden Zahnschmerzen im rechten Unterkiefer vor. Seit gestern bestehe zudem eine deutliche Weichteilschwellung in diesem Bereich.",
        "Er gab eine starke Aufbissempfindlichkeit mit einer Schmerzintensität von 8 von 10 auf der numerischen Ratingskala an; außerdem habe er das Gefühl, der Zahn 46 sei elongiert.",
        "Weiterhin berichtete er über eine Dysgeusie sowie Eiteraustritt. Seit heute Morgen habe er eine erhöhte Temperatur. Ibuprofen 400 mg habe nur kurzfristig geholfen.",
      ],
    },
    {
      zu: "Vorgeschichte und Risikofaktoren",
      saetze: [
        "In der Allgemeinanamnese seien eine arterielle Hypertonie sowie eine chronische Gastritis bekannt. Der Patient nehme Ramipril 5 mg und Pantoprazol 40 mg jeweils morgens ein.",
        "Es bestehe eine Penicillinallergie, die bei der antibiotischen Therapie berücksichtigt werden muss. Die Familienanamnese sei unauffällig.",
        "Als relevante Risikofaktoren sind unregelmäßige zahnärztliche Kontrollen, eine insuffiziente Mundhygiene, die ausgeprägte kariöse Läsion an Zahn 46 sowie ein Nikotinkonsum von etwa 10 Zigaretten täglich zu nennen.",
      ],
    },
    {
      zu: "Bisherige Diagnostik",
      saetze: [
        "Extraoral zeigten sich eine deutliche Schwellung und Druckdolenz im rechten Unterkieferbereich, leicht druckdolente submandibuläre Lymphknoten rechts sowie eine leicht eingeschränkte Mundöffnung. Sensibilitätsstörungen lagen nicht vor.",
        "Intraoral zeigte sich ein stark kariös zerstörter, substanzgeschwächter Zahn 46 mit vestibulärer, fluktuierender Schwellung und purulenter Sekretion. Der Zahn war stark perkussionsempfindlich, die Vitalitätsprobe negativ.",
        "Im Orthopantomogramm zeigten sich eine ausgedehnte kariöse Destruktion und eine große periapikale Aufhellung an den Wurzeln von 46 sowie ein verbreiterter Parodontalligamentspalt. Weder eine Fraktur noch eine Beteiligung des Mandibularkanals waren nachweisbar.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Es wurden Clindamycin 600 mg dreimal täglich sowie Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich, verordnet.",
        "Als weiteres Procedere sind zunächst die Inzision und Drainage des Abszesses vorgesehen. Anschließend ist die Extraktion des nicht erhaltungswürdigen Zahnes 46 geplant; die Abszesshöhle wird gespült und versorgt.",
        "Postoperativ wird die antibiotische Therapie unter Berücksichtigung der Penicillinallergie fortgeführt. Eine klinische Kontrolle ist nach zwei bis drei Tagen geplant; nach Abklingen der Akutphase wird die prothetische Versorgung geplant.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const alveolitis15: CaseInput = vorstellungsFall({
  id: "vorstellung-alveolitis-15",
  title: "Alveolitis sicca regio 15",
  untertitel: "Schmerzen nach Extraktion, Rauchen direkt nach dem Eingriff",
  anrede: "Herrn Dr. Seidel",
  partner: "Dr. Seidel (Kollege)",
  info: {
    diagnose: "Alveolitis sicca (Dry Socket) regio 15 nach Zahnextraktion",
    name: "Frau Sabine Keller, 47 Jahre",
    anamnese: [
      "Extraktion des Zahnes 15 vor etwa fünf Tagen",
      "zunächst kaum Beschwerden nach der Extraktion",
      "seit drei Tagen zunehmende, starke Schmerzen im Bereich der Extraktionsalveole",
      "Schmerzausstrahlung bis zur rechten Schläfe",
      "unangenehmer Geschmack im Mund und ausgeprägter Mundgeruch",
      "Rauchen direkt nach der Extraktion",
    ],
    vorerkrankungen: "arterielle Hypertonie",
    medikation: "Ramipril 5 mg (1–0–0)",
    allergien: "keine",
    risikofaktoren: [
      "Nikotinkonsum, ca. 10 Zigaretten täglich",
      "Rauchen unmittelbar nach der Zahnextraktion",
      "insuffiziente postoperative Wundpflege",
    ],
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    { label: "Extraorale Untersuchung", wert: ["keine Weichteilschwellung", "keine zervikale Lymphadenopathie"] },
    {
      label: "Intraorale Untersuchung",
      wert: ["weitgehend leere Extraktionsalveole regio 15", "fehlendes Blutkoagulum", "freiliegende Alveolenwand"],
    },
    {
      label: "Zahnfilm regio 15",
      wert: ["keine relevanten ossären Auffälligkeiten", "kein Hinweis auf verbliebenes Wurzelfragment oder Fremdkörper"],
    },
  ],
  neueMedikation: "Ibuprofen 600 mg bei Bedarf",
  procedere: [
    "Aufklärung über die Diagnose Alveolitis sicca",
    "Lokalanästhesie regio 15",
    "vorsichtige mechanische Wundreinigung",
    "Einlage einer medikamentösen Wundauflage",
    "Optimierung der Mundhygiene und postoperative Verhaltensinstruktionen",
    "konsequenter Rauchverzicht während der Wundheilung",
    "klinische Verlaufskontrolle nach 24–48 Stunden",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Frank Seidel",
    voice: "Schedar",
    sprechweise:
      "Kollege Mitte fünfzig, entspannt und trocken-humorvoll, tiefe, etwas brummige Stimme; spricht locker und eher langsam, sagt öfter „na ja“, „hm, typisch“; nicht überdeutlich.",
    persona: `${KOLLEGE_ROLLE} Du bist entspannt, legst aber Wert auf saubere Diagnostik und klare Patientenführung.`,
    facts: [
      "Achte darauf, ob die Röntgenkontrolle (Ausschluss Wurzelrest/Fremdkörper) und der Rauchverzicht erwähnt werden.",
    ],
    followUpQuestions: [
      "Wie haben Sie einen Wurzelrest oder einen Fremdkörper ausgeschlossen?",
      "Was genau legen Sie in die Alveole ein, und wie oft wechseln Sie die Einlage?",
      "Würden Sie hier ein Antibiotikum geben? Warum bzw. warum nicht?",
    ],
  },
  vocabulary: [
    "Alveolitis sicca", "Dry Socket", "Extraktionsalveole", "Blutkoagulum", "Alveolenwand", "Zahnfilm", "ossär",
    "Wurzelfragment", "Fremdkörper", "zervikale Lymphadenopathie", "Wundauflage", "Ramipril", "Ibuprofen", "regio 15",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Herr Dr. Seidel"),
        "Es handelt sich um Frau Sabine Keller, 47 Jahre alt, mit Verdacht auf eine Alveolitis sicca regio 15 nach Zahnextraktion.",
        "Die Patientin stellte sich aufgrund seit drei Tagen zunehmender, starker Schmerzen im Bereich der Extraktionsalveole 15 vor. Der Zahn 15 sei vor etwa fünf Tagen entfernt worden; unmittelbar danach habe sie kaum Beschwerden gehabt.",
        "Die Schmerzen strahlten bis zur rechten Schläfe aus. Zusätzlich klage sie über einen unangenehmen Geschmack sowie einen ausgeprägten Foetor ex ore. Sie habe unmittelbar nach der Extraktion wieder geraucht.",
        "An Vorerkrankungen sei eine arterielle Hypertonie bekannt; sie nehme Ramipril 5 mg einmal täglich ein. Allergien seien nicht bekannt, die Familienanamnese sei unauffällig.",
      ],
    },
    {
      zu: "Risikofaktoren und Diagnostik",
      saetze: [
        "Als Risikofaktoren sind der Nikotinkonsum von etwa zehn Zigaretten täglich, das Rauchen unmittelbar nach der Extraktion sowie eine insuffiziente postoperative Wundpflege zu nennen.",
        "Extraoral zeigten sich weder eine Weichteilschwellung noch eine zervikale Lymphadenopathie.",
        "Intraoral zeigte sich eine weitgehend leere Extraktionsalveole regio 15 ohne Blutkoagulum mit freiliegender Alveolenwand – ein typischer Befund für eine Alveolitis sicca.",
        "Im Zahnfilm regio 15 zeigten sich keine relevanten ossären Auffälligkeiten; ein Wurzelfragment oder ein Fremdkörper konnten nicht nachgewiesen werden.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Zur Schmerztherapie wurde Ibuprofen 600 mg bei Bedarf angesetzt.",
        "Zunächst wird die Patientin über die Diagnose aufgeklärt. Anschließend erfolgen in Lokalanästhesie eine vorsichtige mechanische Wundreinigung und die Einlage einer medikamentösen Wundauflage.",
        "Darüber hinaus erhält sie Instruktionen zur Mundhygiene und Wundpflege; besonders wichtig ist ein konsequenter Rauchverzicht. Eine klinische Verlaufskontrolle ist nach 24 bis 48 Stunden vorgesehen.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const insuffizienteWkb36: CaseInput = vorstellungsFall({
  id: "vorstellung-insuffiziente-wkb-36",
  title: "Insuffiziente Wurzelkanalbehandlung 36",
  untertitel: "Persistierende apikale Parodontitis, Extraktion, Diabetes",
  anrede: "Herrn Dr. Kühn",
  partner: "Dr. Kühn (Kollege)",
  info: {
    diagnose:
      "Persistierende apikale Parodontitis an Zahn 36 infolge einer insuffizienten Wurzelkanalbehandlung mit ungünstiger Erhaltungsprognose",
    name: "Herr Markus Schneider, 56 Jahre",
    anamnese: [
      "seit etwa vier Wochen zunehmende Schmerzen im linken Unterkiefer",
      "Wurzelkanalbehandlung an Zahn 36 vor etwa zwei Jahren",
      "Schmerzen insbesondere beim Kauen und Aufbeißen",
      "zunehmend pochende Schmerzen, teilweise auch in Ruhe",
      "unangenehmer Geschmack im Mund",
    ],
    vorerkrankungen: ["arterielle Hypertonie", "Diabetes mellitus Typ 2"],
    medikation: ["Ramipril 5 mg (1–0–0)", "Metformin 1000 mg (1–0–1)"],
    allergien: "keine",
    risikofaktoren: [
      "insuffiziente Wurzelkanalbehandlung an Zahn 36",
      "unzureichende koronale Abdichtung der Wurzelkanalfüllung",
      "Diabetes mellitus Typ 2",
    ],
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    { label: "Extraorale Untersuchung", wert: ["leichte Druckdolenz über dem linken Unterkiefer", "keine ausgeprägte extraorale Schwellung"] },
    {
      label: "Intraorale Untersuchung",
      wert: ["Zahn 36 mit insuffizienter koronaler Restauration", "deutlich positive Perkussionsempfindlichkeit", "negative Sensibilitätsprüfung an Zahn 36"],
    },
    {
      label: "Zahnfilm regio 36",
      wert: [
        "insuffiziente Wurzelkanalfüllung mit unvollständiger apikaler Obturation",
        "periapikale Radioluzenz an beiden Wurzeln",
        "Verbreiterung des Parodontalspaltes",
      ],
    },
  ],
  neueMedikation: "keine",
  procedere: [
    "Aufklärung über die persistierende apikale Parodontitis und die ungünstige Erhaltungsprognose",
    "Extraktion des Zahnes 36 in Lokalanästhesie",
    "sorgfältige Entfernung entzündlichen Gewebes aus der Alveole",
    "Wundreinigung und Spülung mit steriler Kochsalzlösung",
    "Blutstillung und gegebenenfalls Nahtversorgung",
    "postoperative klinische Verlaufskontrolle",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Andreas Kühn",
    voice: "Algenib",
    sprechweise:
      "Kollege Ende vierzig, Endodontie-Fan, interessiert und etwas kritisch; spricht zügig, denkt laut mit („hm, okay … und Revision?“), unterbricht freundlich, wenn ihm etwas fehlt; nicht überdeutlich.",
    persona: `${KOLLEGE_ROLLE} Du bist auf Endodontie spezialisiert und fragst kritisch, warum keine Revision gemacht wird.`,
    facts: [
      "Achte darauf, dass die Diagnose als persistierende apikale Parodontitis an 36 bezeichnet wird und die Gründe für die ungünstige Prognose genannt werden.",
      "Achte auf die korrekte Dosierung Metformin 1000 mg zweimal täglich.",
    ],
    followUpQuestions: [
      "Warum haben Sie keine Revision der Wurzelkanalbehandlung oder Wurzelspitzenresektion in Betracht gezogen?",
      "Was hat der Zahnfilm genau gezeigt?",
      "Welche Rolle spielt der Diabetes für die Wundheilung?",
      "Wie soll die Lücke später versorgt werden?",
    ],
  },
  vocabulary: [
    "persistierende apikale Parodontitis", "Wurzelkanalbehandlung", "Wurzelkanalfüllung", "Obturation", "koronal", "Restauration",
    "Perkussion", "Sensibilitätsprüfung", "Radioluzenz", "Parodontalspalt", "Revision", "Wurzelspitzenresektion",
    "Erhaltungsprognose", "Metformin", "Ramipril", "Diabetes mellitus", "Kochsalzlösung", "Nahtversorgung",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Herr Dr. Kühn"),
        "Es handelt sich um Herrn Markus Schneider, 56 Jahre alt, mit einer persistierenden apikalen Parodontitis an Zahn 36 infolge einer insuffizienten Wurzelkanalbehandlung.",
        "Der Patient stellte sich aufgrund seit etwa vier Wochen zunehmender Schmerzen im linken Unterkiefer vor. Zahn 36 sei vor etwa zwei Jahren wurzelkanalbehandelt worden.",
        "Die Schmerzen träten insbesondere beim Kauen und Aufbeißen auf, seien zunehmend pochend und mittlerweile teilweise auch in Ruhe vorhanden. Zusätzlich klage er über einen unangenehmen Geschmack.",
        "An Vorerkrankungen seien eine arterielle Hypertonie und ein Diabetes mellitus Typ 2 bekannt. Er nehme Ramipril 5 mg einmal täglich sowie Metformin 1000 mg zweimal täglich ein. Allergien seien nicht bekannt.",
      ],
    },
    {
      zu: "Diagnostik",
      saetze: [
        "Als Risikofaktoren sind die insuffiziente Wurzelkanalbehandlung, die unzureichende koronale Abdichtung sowie der Diabetes mellitus zu nennen, der Wundheilung und Infektabwehr beeinträchtigen kann.",
        "Extraoral zeigte sich eine leichte Druckdolenz über dem linken Unterkiefer ohne ausgeprägte Schwellung.",
        "Intraoral wies Zahn 36 eine insuffiziente koronale Restauration auf; er reagierte deutlich positiv auf die Perkussion, die Sensibilitätsprüfung fiel negativ aus.",
        "Im Zahnfilm zeigten sich eine insuffiziente Wurzelkanalfüllung mit unvollständiger apikaler Obturation, periapikale Radioluzenzen an beiden Wurzeln sowie ein verbreiterter Parodontalspalt.",
      ],
    },
    {
      zu: "Procedere",
      saetze: [
        "Eine neue Medikation wurde bislang nicht angesetzt.",
        "Zunächst wird der Patient über die Diagnose und die ungünstige Erhaltungsprognose aufgeklärt. Anschließend soll Zahn 36 in Lokalanästhesie extrahiert werden.",
        "Danach werden das entzündliche Gewebe sorgfältig aus der Alveole entfernt, die Wunde gereinigt und mit steriler Kochsalzlösung gespült.",
        "Abschließend erfolgen die Blutstillung und gegebenenfalls eine Naht; eine postoperative Kontrolle der Wundheilung ist vorgesehen.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const osteonekrose: CaseInput = vorstellungsFall({
  id: "vorstellung-osteonekrose",
  title: "Kieferosteonekrose nach Extraktion",
  untertitel: "MRONJ im linken Unterkiefer, Zoledronsäure, Mammakarzinom",
  anrede: "Frau Dr. Arnold",
  partner: "Dr. Arnold (Kollegin)",
  info: {
    diagnose: "Medikamentenassoziierte Osteonekrose des Kiefers (MRONJ) im linken Unterkiefer nach Zahnextraktion",
    name: "Frau Claudia Weber, 63 Jahre",
    anamnese: [
      "Zahnextraktion im linken Unterkiefer (regio 36) vor etwa drei Monaten",
      "seit mehreren Wochen Schmerzen im linken Unterkiefer",
      "freiliegender Knochen im Bereich der ehemaligen Extraktionsstelle",
      "unangenehmer Geschmack im Mund und ausgeprägter Mundgeruch",
      "gelegentlicher Eiteraustritt aus dem betroffenen Bereich",
      "verzögerte Wundheilung mit anhaltender Schleimhautläsion",
    ],
    vorerkrankungen: ["arterielle Hypertonie", "Mammakarzinom mit Knochenmetastasen (seit 3 Jahren in Behandlung)"],
    medikation: ["Ramipril 5 mg (1–0–0)", "Zoledronsäure 4 mg i. v. alle 4 Wochen (seit 3 Jahren)", "Analgetika bei Bedarf"],
    allergien: "keine",
    risikofaktoren: [
      "antiresorptive Therapie mit Zoledronsäure",
      "vorausgegangene Zahnextraktion im betroffenen Kieferbereich",
      "onkologische Grunderkrankung",
      "unzureichende Mundhygiene",
    ],
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    {
      label: "Extraorale Untersuchung",
      wert: ["lokale Druckdolenz im linken Unterkiefer", "keine ausgeprägte extraorale Schwellung", "keine zervikale Lymphadenopathie"],
    },
    {
      label: "Intraorale Untersuchung",
      wert: [
        "freiliegender, nekrotischer Knochen regio 36",
        "gerötete und entzündlich veränderte Umgebungsmukosa",
        "purulente Sekretion bei Druck",
      ],
    },
    {
      label: "Orthopantomogramm (OPG)",
      wert: ["irreguläre Knochenstruktur im betroffenen Unterkieferareal", "osteolytische und osteosklerotische Veränderungen", "Verdacht auf Sequesterbildung"],
    },
  ],
  neueMedikation: "antiseptische Mundspüllösung (Chlorhexidin 0,12 %, zweimal täglich)",
  procedere: [
    "Aufklärung über die medikamentenassoziierte Kieferosteonekrose",
    "Überweisung in eine MKG-chirurgische Fachabteilung",
    "Rücksprache mit der behandelnden Onkologin bezüglich der Zoledronsäure-Therapie",
    "antiseptische Lokaltherapie",
    "gegebenenfalls chirurgische Sanierung mit Sequestrektomie und Débridement",
    "engmaschige klinische Verlaufskontrollen",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Monika Arnold",
    voice: "Aoede",
    sprechweise:
      "Kollegin Anfang vierzig, aufmerksam und ernst bei diesem Thema, aber kollegial-locker im Ton; spricht zügig, mit kurzen „okay“, „hm“, und hakt präzise nach. Nicht wie eine Vorleserin.",
    persona: `${KOLLEGE_ROLLE} Du kennst dich mit Kieferosteonekrosen gut aus und willst sicher sein, dass das auslösende Medikament benannt wird.`,
    facts: [
      "Achte darauf, ob die antiresorptive Therapie (Zoledronsäure) als Ursache genannt wird. Wenn nicht, frage gezielt danach.",
      "Achte darauf, dass keine weitere Extraktion oder Kürettage in der Praxis geplant wird, sondern die Überweisung in die MKG-Chirurgie.",
    ],
    followUpQuestions: [
      "Welches Medikament bekommt die Patientin wegen ihrer Tumorerkrankung, und seit wann?",
      "Was spricht in Ihren Befunden für eine Osteonekrose und nicht für eine einfache Wundheilungsstörung?",
      "Warum überweisen Sie in die MKG-Chirurgie und behandeln nicht selbst?",
      "Was kann man solchen Patientinnen vor Beginn einer antiresorptiven Therapie empfehlen?",
    ],
  },
  vocabulary: [
    "Osteonekrose", "MRONJ", "medikamentenassoziiert", "antiresorptiv", "Zoledronsäure", "Bisphosphonat", "Mammakarzinom",
    "Knochenmetastasen", "nekrotisch", "purulent", "osteolytisch", "osteosklerotisch", "Sequester", "Sequestrektomie",
    "Débridement", "MKG-Chirurgie", "Chlorhexidin", "Ramipril", "Lymphadenopathie",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Frau Dr. Arnold"),
        "Es handelt sich um Frau Claudia Weber, 63 Jahre alt, mit Verdacht auf eine medikamentenassoziierte Osteonekrose des Kiefers im linken Unterkiefer nach Zahnextraktion.",
        "Die Patientin stellte sich aufgrund seit mehreren Wochen bestehender Schmerzen im linken Unterkiefer vor. Vor etwa drei Monaten sei ihr dort ein Zahn entfernt worden; seitdem habe sich die Wunde nicht vollständig geschlossen.",
        "Ihr sei freiliegender Knochen aufgefallen. Zusätzlich klage sie über einen unangenehmen Geschmack, einen ausgeprägten Foetor ex ore sowie gelegentlichen Eiteraustritt.",
      ],
    },
    {
      zu: "Vorgeschichte und Risikofaktoren",
      saetze: [
        "In der Allgemeinanamnese seien eine arterielle Hypertonie sowie ein Mammakarzinom mit Knochenmetastasen bekannt. Sie nehme Ramipril 5 mg einmal täglich ein und erhalte seit drei Jahren alle vier Wochen Zoledronsäure 4 mg intravenös; bei Bedarf nehme sie Analgetika ein.",
        "Allergien seien nicht bekannt, die Familienanamnese sei unauffällig.",
        "Als Risikofaktoren sind insbesondere die antiresorptive Therapie, die vorausgegangene Extraktion im betroffenen Bereich, die onkologische Grunderkrankung sowie eine unzureichende Mundhygiene zu nennen.",
      ],
    },
    {
      zu: "Diagnostik",
      saetze: [
        "Extraoral zeigte sich eine lokale Druckdolenz im linken Unterkiefer ohne ausgeprägte Schwellung oder zervikale Lymphadenopathie.",
        "Intraoral zeigte sich im Bereich der ehemaligen Extraktionsstelle freiliegender, nekrotischer Knochen; die umgebende Schleimhaut war gerötet und entzündlich verändert, und bei Druck ließ sich eine purulente Sekretion nachweisen.",
        "Im Orthopantomogramm zeigten sich eine irreguläre Knochenstruktur mit osteolytischen und osteosklerotischen Veränderungen sowie der Verdacht auf eine Sequesterbildung.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Zur antiseptischen Lokalbehandlung wurde eine Chlorhexidin-Mundspüllösung angesetzt.",
        "Zunächst wird die Patientin ausführlich über die Kieferosteonekrose aufgeklärt. Anschließend erfolgt die Überweisung in eine mund-, kiefer- und gesichtschirurgische Fachabteilung; zudem halten wir Rücksprache mit der behandelnden Onkologin.",
        "Abhängig von der Ausdehnung kann eine chirurgische Sanierung mit Sequestrektomie und Débridement erforderlich sein. Engmaschige klinische Verlaufskontrollen sind vorgesehen.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const parodontitisUebungstest: CaseInput = vorstellungsFall({
  id: "vorstellung-parodontitis",
  title: "Parodontitis mit Zahnwanderung",
  untertitel: "Wie im Übungstest: Diabetes, Osteoporose, Latexallergie, PSI 4",
  anrede: "Herrn/Frau Dr. Hofmann",
  partner: "Dr. Hofmann (Kollege)",
  info: {
    diagnose: "Parodontitis",
    name: "Frau Annalena Müller, 52 Jahre",
    anamnese: [
      "Zähne haben sich verschoben, ein Schneidezahn ist „länger geworden“",
      "Mundgeruch",
      "Zahnfleischbluten seit einigen Monaten",
      "vermehrt Essensreste zwischen den Zähnen",
    ],
    vorerkrankungen: ["Diabetes mellitus Typ 2", "Osteoporose"],
    medikation: ["Metformin 500 mg (1–0–1)", "Vitamin D 800 I. E. (1–0–0)"],
    allergien: "Latexallergie",
    risikofaktoren: ["weibliches Geschlecht", "Rauchen (ca. 8 Zigaretten pro Tag)", "Diabetes mellitus", "schlechte Mundhygiene", "Wechseljahre"],
    familienanamnese: "kompletter Zahnverlust bei der Mutter (mit 55 Jahren)",
  },
  diagnostik: [
    { label: "Extraorale Untersuchung", wert: "unauffällig" },
    {
      label: "Intraorale Untersuchung",
      wert: [
        "Zähne (01): konservativ und teils prothetisch behandeltes, vollbezahntes Gebiss",
        "PSI (Parodontaler Screening-Index): 4 – 4 – 4 / 3 – 4 – 4",
        "Plaqueindex (API): 50 %",
      ],
    },
    {
      label: "Röntgenaufnahme (Orthopantomogramm)",
      wert: ["generalisierter horizontaler Knochenabbau von etwa 50 % im Ober- und Unterkiefer", "vertikaler Knochenabbau: 16 distal, 46 mesial"],
    },
  ],
  neueMedikation: "keine",
  procedere: [
    "Erhebung des Parodontalbefundes (6-Punkt-Messung, Furkationsgrad, Lockerungsgrad, Rezessionen, BOP)",
    "Initialphase mit Motivation, Mundhygieneinstruktion und professioneller Zahnreinigung",
    "nicht-chirurgische Therapie: supra- und subgingivale Reinigung",
    "Reevaluation nach 12 Wochen",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Stefan Hofmann",
    voice: "Orus",
    sprechweise:
      "Kollege Mitte vierzig, Parodontologe, freundlich und sachlich, spricht flüssig und ziemlich zügig; sagt „okay“, „genau“, „mhm“ und fragt kurz und konkret nach. Klingt wie ein Gespräch auf dem Praxisflur, nicht wie ein Vortrag.",
    persona: `${KOLLEGE_ROLLE} Du bist Parodontologe und interessierst dich besonders für Risikofaktoren und den Befund.`,
    facts: [
      "Achte darauf, dass der PSI sextantenweise korrekt genannt wird (4 – 4 – 4 / 3 – 4 – 4) und die Latexallergie erwähnt wird.",
    ],
    followUpQuestions: [
      "Welche Risikofaktoren hat die Patientin für eine Parodontitis?",
      "Wie hoch war der PSI, und was bedeutet ein Code 4?",
      "Was ist bei der Latexallergie in der Behandlung zu beachten?",
      "Wann und wie wollen Sie den Therapieerfolg überprüfen?",
    ],
  },
  vocabulary: [
    "Parodontitis", "Gingivablutung", "Zahnwanderung", "Elongation", "Halitosis", "Foetor ex ore", "PSI", "Parodontaler Screening-Index",
    "Plaqueindex", "API", "Orthopantomogramm", "horizontaler Knochenabbau", "vertikaler Knochenabbau", "Furkationsgrad",
    "Lockerungsgrad", "Rezession", "BOP", "Sondierungsblutung", "subgingival", "supragingival", "Reevaluation",
    "Metformin", "Vitamin D", "Latexallergie", "Menopause", "Osteoporose",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Herr Dr. Hofmann"),
        "Es handelt sich um Frau Annalena Müller, 52 Jahre alt, mit Verdacht auf eine Parodontitis.",
        "Die Patientin stellte sich aufgrund einer seit einigen Monaten bestehenden Gingivablutung vor. Sie berichte über Zahnwanderungen sowie eine Elongation eines Schneidezahnes.",
        "Außerdem klage sie über Halitosis sowie vermehrte Speisereste im Interdentalraum.",
      ],
    },
    {
      zu: "Vorgeschichte, Risikofaktoren, Familienanamnese",
      saetze: [
        "In der Allgemeinanamnese seien ein Diabetes mellitus Typ 2 sowie eine Osteoporose bekannt. Die Patientin nehme Metformin 500 mg zweimal täglich sowie Vitamin D 800 internationale Einheiten einmal morgens ein.",
        "Es bestehe eine Latexallergie; deshalb wird die Behandlung latexfrei durchgeführt.",
        "Als relevante Risikofaktoren sind ein Nikotinkonsum von etwa acht Zigaretten täglich, der Diabetes mellitus sowie eine unzureichende Mundhygiene zu nennen. Zudem befindet sich die Patientin in der Menopause, was aufgrund der hormonellen Veränderungen ebenfalls relevant sein kann.",
        "In der Familienanamnese sei ein vollständiger Zahnverlust der Mutter im Alter von 55 Jahren bekannt.",
      ],
    },
    {
      zu: "Diagnostik",
      saetze: [
        "Die extraorale Untersuchung war unauffällig.",
        "Intraoral zeigte sich ein konservativ und teils prothetisch versorgtes, vollbezahntes Gebiss. Der PSI betrug sextantenweise, oben rechts beginnend, 4 – 4 – 4 / 3 – 4 – 4; der Approximalraum-Plaque-Index lag bei 50 %.",
        "Im Orthopantomogramm zeigte sich ein generalisierter horizontaler Knochenabbau von etwa 50 % im Ober- und Unterkiefer; zusätzlich war ein vertikaler Knochenabbau distal an Zahn 16 und mesial an Zahn 46 erkennbar.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Eine neue Medikation wurde nicht verordnet.",
        "Als weiteres Procedere ist zunächst die Erhebung eines vollständigen Parodontalbefundes mit 6-Punkt-Messung vorgesehen; dabei werden Furkationsgrad, Lockerungsgrad, Rezessionen und die Blutung auf Sondierung erfasst.",
        "Anschließend erfolgt die Initialphase mit Motivation, Mundhygieneinstruktion und professioneller Zahnreinigung, danach die nicht-chirurgische Therapie mit supra- und subgingivaler Reinigung.",
        "Nach 12 Wochen ist eine Reevaluation geplant.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const submukoeserAbszess11: CaseInput = vorstellungsFall({
  id: "vorstellung-submukoeser-abszess-11",
  title: "Submuköser Abszess regio 11",
  untertitel: "Inzision und Drainage, später Wurzelkanalbehandlung, Amlodipin",
  anrede: "Frau Dr. Wolff",
  partner: "Dr. Wolff (Kollegin)",
  info: {
    diagnose: "Submuköser Abszess regio 11",
    name: "Frau Sophie Hartmann, 38 Jahre",
    anamnese: [
      "seit etwa drei Tagen zunehmende Schmerzen im Bereich des rechten oberen Schneidezahnes",
      "seit gestern Schwellung am Zahnfleisch oberhalb des Zahnes",
      "pochender Schmerz, besonders beim Zubeißen",
      "Zahn fühlt sich etwas locker bzw. „anders“ an",
      "unangenehmer Geschmack im Mund",
      "leichte Temperaturerhöhung bis 38,0 °C",
      "Schmerzintensität 7/10, Ibuprofen 400 mg nur mit kurzfristiger Wirkung",
    ],
    vorerkrankungen: "arterielle Hypertonie",
    medikation: "Amlodipin 5 mg (1–0–0)",
    allergien: "keine",
    risikofaktoren: [
      "tiefe kariöse Läsion an Zahn 11",
      "unregelmäßige zahnärztliche Kontrollen",
      "insuffiziente Mundhygiene",
      "vor etwa einem Jahr abgebrochene Füllung an Zahn 11",
    ],
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    {
      label: "Extraorale Untersuchung",
      wert: [
        "geringe Schwellung der Oberlippe rechts",
        "leichte Druckdolenz über der rechten Oberkieferfront",
        "keine Lymphknotenschwellung",
        "keine Sensibilitätsstörungen",
      ],
    },
    {
      label: "Intraorale Untersuchung",
      wert: [
        "deutliche vestibuläre Schwellung regio 11",
        "fluktuierende, druckdolente Erhebung der Schleimhaut",
        "purulente Sekretion nach vorsichtiger Eröffnung",
        "Zahn 11 stark perkussionsempfindlich, Vitalitätsprobe negativ",
        "Zahn 11 geringfügig gelockert (Lockerungsgrad I)",
      ],
    },
    {
      label: "Periapikale Röntgenaufnahme",
      wert: [
        "tiefe kariöse Destruktion an Zahn 11",
        "ausgeprägte periapikale Aufhellung",
        "verbreiterter Parodontalligamentspalt",
        "keine Wurzelfraktur, keine Alveolarfortsatzfraktur",
      ],
    },
  ],
  neueMedikation: ["Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich", "Chlorhexidin 0,2 % Mundspüllösung zweimal täglich"],
  procedere: [
    "Inzision und Drainage des submukösen Abszesses regio 11",
    "Entleerung des purulenten Sekrets und Spülung des Abszessraumes",
    "Einlage einer Drainage zur weiteren Sekretableitung",
    "endodontische Weiterbehandlung von Zahn 11 nach Abklingen der akuten Entzündung",
    "klinische Kontrolle nach zwei bis drei Tagen",
    "weitere endodontische und radiologische Verlaufskontrollen",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Katrin Wolff",
    voice: "Autonoe",
    sprechweise:
      "Kollegin Mitte dreißig, lebhaft und freundlich, spricht schnell und locker, sagt „okay, super“, „mhm“, „und dann?“; manchmal schon halb bei der nächsten Patientin. Natürlich, nicht überdeutlich.",
    persona: `${KOLLEGE_ROLLE} Du bist freundlich und schnell und möchtest vor allem wissen, wie es mit dem Zahn weitergeht.`,
    facts: [
      "Achte auf die korrekte Zahnangabe 11 sowie die Dosierungen (Ibuprofen 600 mg, Chlorhexidin 0,2 %).",
    ],
    followUpQuestions: [
      "Hat die Patientin Fieber, und braucht sie ein Antibiotikum?",
      "Warum beginnen Sie nicht sofort mit der Wurzelkanalbehandlung?",
      "Was hat die Röntgenaufnahme gezeigt – gibt es eine Fraktur?",
      "Wann kontrollieren Sie die Drainage?",
    ],
  },
  vocabulary: [
    "submukös", "Abszess", "regio 11", "Inzision", "Drainage", "fluktuierend", "druckdolent", "purulent", "Sekretion",
    "perkussionsempfindlich", "Vitalitätsprobe", "Lockerungsgrad", "periapikal", "Aufhellung", "Parodontalligamentspalt",
    "Wurzelfraktur", "Alveolarfortsatzfraktur", "endodontisch", "Amlodipin", "Chlorhexidin", "Ibuprofen",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Frau Dr. Wolff"),
        "Es handelt sich um Frau Sophie Hartmann, 38 Jahre alt, mit einem submukösen Abszess regio 11.",
        "Die Patientin stellte sich mit seit drei Tagen zunehmenden Schmerzen im Bereich des Zahnes 11 vor. Seit gestern bestehe eine Schwellung der Gingiva oberhalb des Zahnes.",
        "Sie gab pochende Schmerzen, insbesondere beim Zubeißen, mit einer Intensität von 7 von 10 an. Zudem habe sie den Eindruck, dass sich der Zahn gelockert habe.",
        "Außerdem klage sie über einen unangenehmen Geschmack sowie eine leichte Temperaturerhöhung bis 38,0 °C. Ibuprofen 400 mg habe nur kurzfristig geholfen.",
      ],
    },
    {
      zu: "Vorgeschichte und Risikofaktoren",
      saetze: [
        "An Vorerkrankungen sei eine arterielle Hypertonie bekannt, die mit Amlodipin 5 mg morgens behandelt werde. Allergien seien nicht bekannt, die Familienanamnese sei unauffällig.",
        "Als relevante Risikofaktoren sind eine tiefe kariöse Läsion an Zahn 11, unregelmäßige zahnärztliche Kontrollen, eine insuffiziente Mundhygiene sowie eine vor etwa einem Jahr abgebrochene Füllung an Zahn 11 zu nennen.",
      ],
    },
    {
      zu: "Diagnostik",
      saetze: [
        "Extraoral zeigten sich eine geringe Schwellung der Oberlippe rechts sowie eine leichte Druckdolenz über der rechten Oberkieferfront; Lymphknotenschwellungen oder Sensibilitätsstörungen lagen nicht vor.",
        "Intraoral zeigte sich eine deutliche vestibuläre Schwellung regio 11 mit fluktuierender, druckdolenter Schleimhauterhebung; nach vorsichtiger Eröffnung kam es zur purulenten Sekretion.",
        "Zahn 11 war stark perkussionsempfindlich, die Vitalitätsprobe negativ; zudem bestand ein Lockerungsgrad I.",
        "In der periapikalen Röntgenaufnahme zeigten sich eine tiefe kariöse Destruktion mit ausgeprägter periapikaler Aufhellung und ein verbreiterter Parodontalligamentspalt. Weder eine Wurzel- noch eine Alveolarfortsatzfraktur waren nachweisbar.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Neu angesetzt wurden Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich, sowie eine Chlorhexidin-Mundspüllösung 0,2 % zweimal täglich.",
        "Zunächst erfolgen die Inzision des Abszesses, die Entleerung des Sekrets und die Spülung des Abszessraumes; zur weiteren Sekretableitung wird eine Drainage eingelegt.",
        "Nach Abklingen der akuten Entzündung ist die endodontische Weiterbehandlung von Zahn 11 vorgesehen. Eine klinische Kontrolle ist nach zwei bis drei Tagen geplant, danach weitere endodontische und radiologische Verlaufskontrollen.",
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
export const wurzellaengsfraktur36: CaseInput = vorstellungsFall({
  id: "vorstellung-wurzellaengsfraktur-36",
  title: "Wurzellängsfraktur Zahn 36",
  untertitel: "Wie im Übungstest: Marcumar, künstliche Herzklappe, Penicillinallergie",
  anrede: "Herrn/Frau Dr. Khidder",
  partner: "Dr. Khidder (Kollege)",
  info: {
    diagnose: "Wurzellängsfraktur Zahn 36",
    name: "Frau Irina Melnik, 55 Jahre",
    anamnese: [
      "beim Essen auf einen Kirschkern gebissen",
      "lautes Knacken, sofort starke Schmerzen",
      "Schmerzen gegen Abend unter Einnahme von Ibuprofen 600 mg besser",
      "seit heute Morgen Zahn 36 stark aufbissempfindlich",
    ],
    vorerkrankungen: ["künstliche Herzklappe", "Bluthochdruck"],
    medikation: ["Marcumar 3 mg (1–0–0)", "Ramipril 2,5 mg (1–0–0)"],
    allergien: "Penicillinallergie",
    risikofaktoren: "ausgedehnte Füllung an Zahn 36",
    familienanamnese: "unauffällig",
  },
  diagnostik: [
    { label: "Extraorale Untersuchung", wert: "unauffällig" },
    {
      label: "Intraorale Untersuchung",
      wert: [
        "Zähne (01); Zahn 36: sichtbare Rissbildung zwischen Zahn und Füllungsmaterial, mobile Fragmente",
        "Perkussionstest 36: positiv",
        "Vitalität 36: positiv",
        "Schleimhaut: zirkuläre Gingiva gerötet und leicht geschwollen",
      ],
    },
    {
      label: "Röntgenaufnahme (Orthopantomogramm), Befund Zahn 36",
      wert: [
        "deutliche Verschattung (Radioopazität), vereinbar mit okklusaler Füllung",
        "schmale, vertikale Aufhellung (Radioluzenz) entlang der Wurzelachse",
        "Befundkonstellation insgesamt vereinbar mit Verdacht auf Wurzellängsfraktur",
      ],
    },
  ],
  neueMedikation: "keine",
  procedere: [
    "Extraktion 36 geplant",
    "INR-Kontrolle, Absprache mit dem Hausarzt (bei INR < 3,5 Marcumar weiter einnehmen)",
    "Endokarditisprophylaxe bei künstlicher Herzklappe und Penicillinallergie: Azithromycin 500 mg 60 Min. vor dem Eingriff",
    "Naht- und Wundversorgung",
    "7 Tage postoperativ: Fäden ziehen und Wundkontrolle",
  ],
  actor: {
    role: "kollege",
    name: "Dr. Samir Khidder",
    voice: "Rasalgethi",
    sprechweise:
      "Erfahrener Kollege Anfang sechzig, gelassen und freundlich, leicht nachdenklich; spricht ruhig, aber nicht langsam, mit kurzen „hm“, „aha“, „verstehe“; hakt bei Risiken genau nach. Kein Sprecher-Ton.",
    persona: `${KOLLEGE_ROLLE} Du bist gründlich und achtest besonders auf Blutungs- und Endokarditisrisiko.`,
    facts: [
      "Achte auf: INR-Grenzwert 3,5, Endokarditisprophylaxe mit Azithromycin 500 mg 60 Minuten vor dem Eingriff wegen Penicillinallergie, Marcumar 3 mg und Ramipril 2,5 mg.",
    ],
    followUpQuestions: [
      "Muss die Patientin Marcumar vor der Extraktion absetzen?",
      "Warum braucht sie eine Endokarditisprophylaxe, und warum gerade Azithromycin?",
      "Woran haben Sie die Wurzellängsfraktur erkannt? Die Vitalität war ja positiv.",
      "Welche lokalen Maßnahmen zur Blutstillung planen Sie?",
    ],
  },
  vocabulary: [
    "Wurzellängsfraktur", "Kirschkern", "aufbissempfindlich", "Marcumar", "Phenprocoumon", "INR", "Ramipril", "Herzklappe",
    "Herzklappenersatz", "Endokarditisprophylaxe", "Azithromycin", "Penicillinallergie", "Perkussionstest", "Vitalität",
    "Radioopazität", "Radioluzenz", "Wurzelachse", "okklusal", "zirkulär", "Gingiva", "Extraktion", "Nahtversorgung",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        EINSTIEG("Herr Dr. Khidder"),
        "Es handelt sich um Frau Irina Melnik, 55 Jahre alt, mit Verdacht auf eine Wurzellängsfraktur an Zahn 36.",
        "Die Patientin stellte sich aufgrund einer seit heute Morgen bestehenden starken Aufbissempfindlichkeit an Zahn 36 vor. Sie berichte, dass sie beim Essen versehentlich auf einen Kirschkern gebissen und dabei ein lautes Knacken mit sofortigen starken Schmerzen bemerkt habe.",
        "Die Einnahme von Ibuprofen 600 mg habe gegen Abend zu einer deutlichen Besserung geführt.",
      ],
    },
    {
      zu: "Vorgeschichte und Risikofaktoren",
      saetze: [
        "In der Allgemeinanamnese seien ein künstlicher Herzklappenersatz sowie eine arterielle Hypertonie bekannt. Die Patientin nehme Marcumar 3 mg und Ramipril 2,5 mg jeweils einmal morgens ein.",
        "Es bestehe eine Penicillinallergie, die bei der antibiotischen Prophylaxe berücksichtigt werden muss. Die Familienanamnese sei unauffällig.",
        "Als Risikofaktor ist die ausgedehnte Füllung an Zahn 36 zu nennen.",
      ],
    },
    {
      zu: "Diagnostik",
      saetze: [
        "Die extraorale Untersuchung war unauffällig.",
        "Intraoral zeigte sich an Zahn 36 eine sichtbare Rissbildung zwischen Zahn und Füllungsmaterial mit mobilen Fragmenten. Sowohl der Perkussionstest als auch die Vitalitätsprobe an Zahn 36 fielen positiv aus; die zirkuläre Gingiva war gerötet und leicht geschwollen.",
        "Im Orthopantomogramm zeigten sich eine Radioopazität, vereinbar mit der okklusalen Füllung, sowie eine schmale vertikale Radioluzenz entlang der Wurzelachse. Die Befundkonstellation ist insgesamt vereinbar mit einer Wurzellängsfraktur.",
      ],
    },
    {
      zu: "Procedere",
      saetze: [
        "Eine neue Medikation wurde nicht angesetzt.",
        "Als weiteres Procedere ist die Extraktion des Zahnes 36 geplant. Vorher wird der INR-Wert kontrolliert und Rücksprache mit dem Hausarzt gehalten; liegt der INR unter 3,5, kann Marcumar weiter eingenommen werden.",
        "Aufgrund des künstlichen Herzklappenersatzes ist eine Endokarditisprophylaxe vorgesehen – wegen der Penicillinallergie mit Azithromycin 500 mg 60 Minuten vor dem Eingriff.",
        "Anschließend erfolgen die Naht- und Wundversorgung; nach sieben Tagen sind die Fadenentfernung und eine Wundkontrolle geplant.",
      ],
    },
  ],
});

export const VORSTELLUNG_UNTERLAGEN = [
  parodontitisUebungstest,
  wurzellaengsfraktur36,
  abszessExtraktion46,
  submukoeserAbszess11,
  alveolitis15,
  insuffizienteWkb36,
  osteonekrose,
];
