import type { CaseInput } from "@/lib/cases/schema";
import { AUFGABEN_VORSTELLUNG, ELF_MINUTEN, checklisteVorstellung } from "./helpers";

const KOLLEGE_ROLLE =
  "Du bist eine erfahrene Zahnärztin bzw. ein erfahrener Zahnarzt in derselben Praxis. Du kennst den Fall nicht; du kennst nur, was dir vorgestellt wird.";

function kurzbeschreibung(kollege: string) {
  return `Sie haben heute einen neuen Patienten/eine neue Patientin behandelt und möchten mit Ihrem erfahrenen Kollegen/Ihrer erfahrenen Kollegin kurz darüber sprechen. Sie sprechen mit ${kollege}. Sie haben für die gesamte Situation maximal 11 Minuten Zeit.`;
}

function aufgabentext(kollege: string) {
  return {
    einleitung:
      "Entnehmen Sie der Fallbeschreibung alle notwendigen Informationen und berichten Sie Ihrem Kollegen/Ihrer Kollegin folgende Punkte:",
    punkte: AUFGABEN_VORSTELLUNG,
    schluss: `Verwenden Sie angemessene Fachsprache und gehen Sie auf eventuelle Rückfragen ein. Sie sprechen mit ${kollege}.`,
  };
}

/** Aus den Unterlagen im Ordner „Manhal“ (Patienteninformationsblatt + Formulierungen). */
export const dentitioDifficilis: CaseInput = {
  id: "vorstellung-dentitio-difficilis-38-48",
  version: 1,
  stationType: "vorstellung",
  title: "Dentitio difficilis 38 und 48",
  untertitel: "Rezidivierende Perikoronitis, geplante Extraktion",
  durationSeconds: ELF_MINUTEN,
  sheet: {
    kurzbeschreibung: kurzbeschreibung("Herrn/Frau Dr. Lorenz"),
    gespraechssituation: "Patientenvorstellung",
    gespraechspartner: "Dr. Lorenz (Kollegin)",
    abschnitte: [
      {
        titel: "Patienteninformationsblatt",
        eintraege: [
          {
            label: "(Verdachts-)Diagnose / Leitsymptom",
            wert: "Dentitio difficilis bei teilretinierten Weisheitszähnen 38 und 48 mit rezidivierender Perikoronitis",
          },
          { label: "Name, Alter", wert: "Herr Mehmet Yılmaz, 23 Jahre" },
          {
            label: "Hauptsymptomatik / Anamnese",
            wert: [
              "seit 4 Tagen zunehmende Schmerzen im hinteren Unterkiefer",
              "geschwollenes und gerötetes Zahnfleisch",
              "Schmerzen beim Kauen und Schlucken",
              "eingeschränkte Mundöffnung",
              "unangenehmer Geschmack und Mundgeruch",
              "ähnliche Beschwerden vor 6 Monaten",
              "Fieber bis 38,1 °C am Vortag",
            ],
          },
          { label: "Vorerkrankungen", wert: "Bluthochdruck" },
          { label: "Bisherige Medikation", wert: "Ramipril 2,5 mg (1–0–1)" },
          { label: "Allergien", wert: "keine" },
          {
            label: "Risikofaktoren",
            wert: ["Teilretention der Zähne 38 und 48", "erschwerte Mundhygiene", "Nikotinkonsum: ca. 10 Zigaretten täglich"],
          },
          { label: "Familienanamnese", wert: "unauffällig" },
        ],
      },
      {
        titel: "Bisherige Diagnostik",
        eintraege: [
          {
            label: "Extraorale Untersuchung",
            wert: ["Schwellung beider Unterkieferwinkel", "druckdolente submandibuläre Lymphknoten", "maximale Mundöffnung: 28 mm"],
          },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "gerötete und ödematöse perikoronale Gingiva",
              "purulente Sekretion",
              "Nahrungsretention unter dem Schleimhautdeckel",
              "Zahn 48 perkussionsempfindlich; Zahn 47 unauffällig",
            ],
          },
          {
            label: "Röntgenaufnahme (Orthopantomogramm)",
            wert: ["Teilretention 38 und 48", "mesioanguläre Position beider Zähne", "keine Zyste", "keine Wurzelresorption an Zahn 47"],
          },
          {
            label: "Neu angesetzte Medikation",
            wert: ["Paracetamol 500 mg bei Bedarf, max. 4-mal täglich", "Chlorhexidin 0,2 % (1–0–1)"],
          },
          {
            label: "Procedere",
            wert: [
              "Spülung und Reinigung der Perikoronaltaschen",
              "Entfernung von Nahrungsresten und lokales Debridement",
              "antiseptische Lokaltherapie und Mundhygieneinstruktion",
              "Extraktion 38 und 48 nach Abklingen der akuten Entzündung",
              "Aufklärung über das Risiko einer Läsion des N. alveolaris inferior bei 48",
              "postoperative Wundversorgung, ggf. Naht",
              "Wundkontrolle und Fadenentfernung nach 7–10 Tagen",
            ],
          },
        ],
      },
    ],
    aufgabentext: aufgabentext("Herrn/Frau Dr. Lorenz"),
  },
  actorCard: {
    role: "kollege",
    name: "Dr. Sabine Lorenz",
    voice: "Sulafat",
    sprechweise:
      "Erfahrene Zahnärztin Mitte fünfzig, freundlich, aber im Stress zwischen zwei Patienten: spricht zügig und beiläufig, viele „mhm“, „okay“, „ja, und?“; unterbricht kurz, wenn etwas unklar ist; klingt wie jemand, der nebenbei noch in die Akte schaut.",
    persona: `${KOLLEGE_ROLLE} Du bist freundlich, aber zeitlich knapp, und erwartest eine strukturierte Vorstellung.`,
    facts: [
      "Achte darauf, ob Zahnangaben (38, 48, 47) und Dosierungen präzise genannt werden; frage nach, wenn etwas ungenau ist.",
    ],
    followUpQuestions: [
      "Welche Beschwerden hat der Patient genau geäußert?",
      "Was hat das OPG gezeigt – gibt es Hinweise auf eine Zyste oder Resorption an 47?",
      "Warum wird erst nach Abklingen der akuten Entzündung extrahiert, und worüber muss der Patient aufgeklärt werden?",
    ],
  },
  rubric: {
    checklist: checklisteVorstellung(),
    fachbegriffe: [],
  },
  vocabulary: [
    "Dentitio difficilis", "Perikoronitis", "teilretiniert", "mesioangulär", "Orthopantomogramm", "submandibulär",
    "druckdolent", "perikoronal", "purulent", "Debridement", "Chlorhexidin", "Ramipril", "Paracetamol",
    "Nervus alveolaris inferior", "Läsion",
  ],
  beispiele: [
    {
      zu: "Einstieg",
      saetze: [
        "Guten Tag, Frau Dr. Lorenz, ich würde Ihnen gerne einen Patienten vorstellen, den ich heute behandelt habe, und mit Ihnen das weitere Vorgehen besprechen.",
        "Es handelt sich um Herrn Mehmet Yılmaz, 23 Jahre alt. Die Verdachtsdiagnose lautet Dentitio difficilis bei teilretinierten Weisheitszähnen 38 und 48 mit rezidivierender Perikoronitis.",
      ],
    },
    {
      zu: "Anamnese",
      saetze: [
        "Der Patient habe sich aufgrund seit vier Tagen bestehender, zunehmender Beschwerden im retromolaren Bereich vorgestellt.",
        "Er berichte über eine ödematöse und gerötete Gingiva sowie über Schmerzen beim Kauen und Dysphagie.",
        "Zudem klage er über eine eingeschränkte Mundöffnung, einen unangenehmen Geschmack und Halitosis.",
        "Darüber hinaus berichte er über ähnliche Beschwerden vor sechs Monaten. Am Vortag habe er Fieber bis 38,1 °C gemessen.",
        "In der Allgemeinanamnese sei eine arterielle Hypertonie bekannt; der Patient nehme Ramipril 2,5 mg zweimal täglich ein. Allergien seien nicht bekannt, die Familienanamnese sei unauffällig.",
        "Als relevante Risikofaktoren sind die Teilretention der Zähne 38 und 48, eine erschwerte Mundhygiene sowie ein Nikotinkonsum von ca. 10 Zigaretten täglich zu nennen.",
      ],
    },
    {
      zu: "Bisherige Diagnostik",
      saetze: [
        "Bei der extraoralen Untersuchung zeigte sich eine Schwellung beider Unterkieferwinkel. Außerdem lagen druckdolente submandibuläre Lymphknoten vor; die maximale Mundöffnung betrug 28 mm.",
        "Intraoral zeigte sich eine gerötete und ödematöse perikoronale Gingiva mit purulenter Sekretion; zudem fiel eine Nahrungsretention unter dem Schleimhautdeckel auf.",
        "Der Perkussionstest an Zahn 48 war positiv, an Zahn 47 negativ.",
        "Im Orthopantomogramm zeigten sich eine Teilretention sowie eine mesioanguläre Position der Zähne 38 und 48; es lag weder eine Zyste noch eine Wurzelresorption an Zahn 47 vor.",
      ],
    },
    {
      zu: "Medikation und Procedere",
      saetze: [
        "Als neue Medikation wurden Paracetamol 500 mg bei Bedarf, maximal viermal täglich, sowie Chlorhexidin 0,2 % zweimal täglich verordnet.",
        "Als weiteres Procedere werden zunächst die Perikoronaltaschen gespült und gereinigt; anschließend erfolgen die Entfernung von Nahrungsresten und ein lokales Debridement.",
        "Zusätzlich sind eine antiseptische Lokaltherapie und eine Mundhygieneinstruktion vorgesehen.",
        "Nach Abklingen der akuten Entzündung ist die Extraktion der Zähne 38 und 48 geplant; der Patient wird über das Risiko einer Läsion des N. alveolaris inferior bei 48 aufgeklärt.",
        "Eine Wundkontrolle sowie die Fadenentfernung sind nach etwa 7 bis 10 Tagen vorgesehen.",
        "Ich wäre Ihnen dankbar für Ihre Einschätzung und gegebenenfalls weitere Empfehlungen.",
      ],
    },
  ],
};

/** Eigener Übungsfall. */
export const mundAntrumVerbindung26: CaseInput = {
  id: "vorstellung-mav-26",
  version: 1,
  stationType: "vorstellung",
  title: "Mund-Antrum-Verbindung nach Extraktion 26",
  untertitel: "Positiver Nasenblasversuch, Bisphosphonat-Therapie, Penicillinallergie",
  durationSeconds: ELF_MINUTEN,
  sheet: {
    kurzbeschreibung: kurzbeschreibung("Herrn/Frau Dr. Brandt"),
    gespraechssituation: "Patientenvorstellung",
    gespraechspartner: "Dr. Brandt (Kollege)",
    abschnitte: [
      {
        titel: "Patienteninformationsblatt",
        eintraege: [
          { label: "(Verdachts-)Diagnose / Leitsymptom", wert: "Mund-Antrum-Verbindung (MAV) nach Extraktion des Zahnes 26" },
          { label: "Name, Alter", wert: "Frau Sabine Krüger, 61 Jahre" },
          {
            label: "Hauptsymptomatik / Anamnese",
            wert: [
              "Extraktion 26 vor 3 Tagen in der Praxis",
              "seitdem Austritt von Flüssigkeit aus der linken Nasenseite beim Trinken",
              "Druckgefühl in der linken Wange",
              "unangenehmer Geschmack im Mund",
              "kein Fieber, kein Nasenbluten",
            ],
          },
          { label: "Vorerkrankungen", wert: "Osteoporose; arterielle Hypertonie" },
          { label: "Bisherige Medikation", wert: "Alendronsäure 70 mg (1× wöchentlich, seit 4 Jahren); Candesartan 8 mg (1–0–0)" },
          { label: "Allergien", wert: "Penicillin (Urtikaria)" },
          {
            label: "Risikofaktoren",
            wert: ["enge Lagebeziehung der Wurzeln 26 zur Kieferhöhle", "orale Bisphosphonat-Therapie", "Nikotinkonsum: keiner"],
          },
          { label: "Familienanamnese", wert: "unauffällig" },
        ],
      },
      {
        titel: "Bisherige Diagnostik",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: ["leichte Schwellung der linken Wange", "keine Druckdolenz", "Lymphknoten unauffällig"] },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Alveole 26 mit unvollständigem Blutkoagel",
              "Nasenblasversuch positiv",
              "Gingiva im Bereich 25–27 leicht gerötet, kein Pus",
            ],
          },
          {
            label: "Röntgenaufnahme (Orthopantomogramm)",
            wert: [
              "Kontinuitätsunterbrechung des Kieferhöhlenbodens regio 26",
              "keine Wurzelreste",
              "leichte Verschattung der linken Kieferhöhle",
            ],
          },
          {
            label: "Neu angesetzte Medikation",
            wert: ["Clindamycin 600 mg (1–1–1) für 7 Tage", "Xylometazolin-Nasenspray 0,1 % (1–1–1) für 5 Tage"],
          },
          {
            label: "Procedere",
            wert: [
              "plastische Deckung der MAV mit vestibulärem Trapezlappen (Rehrmann-Plastik) in Lokalanästhesie",
              "atraumatisches Vorgehen wegen Bisphosphonat-Therapie; Rücksprache mit dem Hausarzt",
              "Verhaltensregeln: 2 Wochen nicht schnäuzen, mit offenem Mund niesen, kein Sport",
              "Nahtentfernung nach 10–14 Tagen",
              "bei persistierender Verschattung der Kieferhöhle: HNO-Konsil",
            ],
          },
        ],
      },
    ],
    aufgabentext: aufgabentext("Herrn/Frau Dr. Brandt"),
  },
  actorCard: {
    role: "kollege",
    name: "Dr. Martin Brandt",
    voice: "Sadaltager",
    sprechweise:
      "Erfahrener Kollege Anfang sechzig, ruhig und bedächtig, tiefe Stimme; denkt hörbar nach („hm … verstehe … und wie war das mit …?“); spricht nicht schnell, aber auch nicht wie ein Nachrichtensprecher, sondern locker kollegial.",
    persona: `${KOLLEGE_ROLLE} Du bist ruhig und genau und fragst gezielt nach Risiken und Medikamenten.`,
    facts: ["Achte auf korrekte Dosierungen und darauf, ob die Bisphosphonat-Therapie erwähnt wird; frage nach, wenn etwas fehlt."],
    followUpQuestions: [
      "Wie haben Sie die Mund-Antrum-Verbindung nachgewiesen?",
      "Die Patientin nimmt ein Bisphosphonat – was bedeutet das für die Operation?",
      "Warum Clindamycin und nicht Amoxicillin?",
    ],
  },
  rubric: { checklist: checklisteVorstellung(), fachbegriffe: [] },
  vocabulary: [
    "Mund-Antrum-Verbindung", "Kieferhöhle", "Nasenblasversuch", "Alveole", "Koagel", "Alendronsäure", "Bisphosphonat",
    "Candesartan", "Clindamycin", "Xylometazolin", "Trapezlappen", "Rehrmann-Plastik", "Verschattung", "HNO-Konsil", "Urtikaria",
  ],
  beispiele: [
    {
      zu: "Einstieg und Anamnese",
      saetze: [
        "Guten Tag, Herr Dr. Brandt, ich möchte Ihnen kurz eine Patientin vorstellen und das weitere Vorgehen mit Ihnen besprechen.",
        "Es handelt sich um Frau Sabine Krüger, 61 Jahre alt, mit Verdacht auf eine Mund-Antrum-Verbindung nach Extraktion des Zahnes 26.",
        "Die Patientin berichte, dass seit der Extraktion vor drei Tagen beim Trinken Flüssigkeit aus der linken Nasenseite austrete. Zudem klage sie über ein Druckgefühl in der linken Wange und einen unangenehmen Geschmack.",
        "An Vorerkrankungen seien eine Osteoporose und eine arterielle Hypertonie bekannt. Sie nehme seit vier Jahren einmal wöchentlich Alendronsäure 70 mg sowie Candesartan 8 mg morgens ein. Es bestehe eine Penicillinallergie mit Urtikaria.",
      ],
    },
    {
      zu: "Diagnostik, Medikation und Procedere",
      saetze: [
        "Intraoral zeigte sich eine Alveole 26 mit unvollständigem Koagel; der Nasenblasversuch war positiv.",
        "Im Orthopantomogramm zeigte sich eine Kontinuitätsunterbrechung des Kieferhöhlenbodens regio 26 ohne Wurzelreste sowie eine leichte Verschattung der linken Kieferhöhle.",
        "Aufgrund der Penicillinallergie wurde Clindamycin 600 mg dreimal täglich für sieben Tage angesetzt, zusätzlich Xylometazolin-Nasenspray für fünf Tage.",
        "Geplant ist eine plastische Deckung mit einem vestibulären Trapezlappen in Lokalanästhesie, wegen der Bisphosphonat-Therapie möglichst atraumatisch und nach Rücksprache mit dem Hausarzt.",
        "Die Fäden sollen nach 10 bis 14 Tagen entfernt werden; bei persistierender Verschattung ist ein HNO-Konsil vorgesehen.",
      ],
    },
  ],
};

export const VORSTELLUNG_FAELLE = [dentitioDifficilis, mundAntrumVerbindung26];
