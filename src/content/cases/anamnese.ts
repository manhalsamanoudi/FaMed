import type { CaseInput } from "@/lib/cases/schema";
import { ELF_MINUTEN, checklisteAnamnese } from "./helpers";

const PATIENT_REGELN_ANAMNESE =
  "Du kommst als neuer Patient in die Praxis. Erzähle zuerst nur dein Hauptproblem und beantworte dann die Fragen des Zahnarztes.";

const AUFGABEN_ANAMNESE = {
  einleitung: "Führen Sie ein strukturiertes Anamnesegespräch durch:",
  punkte: [
    { text: "Erheben Sie die Beschwerden sowie die relevante medizinische Vorgeschichte." },
    { text: "Zur Diagnostik wurde ein Röntgenbild angefertigt. Erklären Sie dem Patienten den Befund verständlich." },
    { text: "Stellen Sie anschließend eine Verdachtsdiagnose und erklären Sie kurz die nächsten Behandlungsschritte." },
  ],
  schluss: "Gehen Sie auf Rückfragen ein.",
};

export const perikoronitis38: CaseInput = {
  id: "anamnese-perikoronitis",
  version: 2,
  stationType: "anamnese",
  title: "Schmerzen hinten unten links",
  untertitel: "Neuer Patient mit Schwellung und eingeschränkter Mundöffnung",
  durationSeconds: ELF_MINUTEN,
  sheet: {
    kurzbeschreibung:
      "Sie sind Zahnarzt/-ärztin in einer Praxis. Ein neuer Patient/eine neue Patientin kommt zu Ihnen. Führen Sie ein strukturiertes Anamnesegespräch durch und erklären Sie einen Röntgenbefund. Sie sprechen mit Herrn/Frau Lehmann. Sie haben für die gesamte Situation maximal 11 Minuten Zeit.",
    gespraechssituation: "Anamnesegespräch",
    gespraechspartner: "Herr T. Lehmann (Patient)",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name", wert: "T. Lehmann" }] },
      {
        titel: "Röntgenaufnahme (Orthopantomogramm) – Befund",
        eintraege: [
          {
            label: "Befund",
            wert: [
              "Zahn 38 teilretiniert und mesioanguliert",
              "sichelförmige Aufhellung distal der Krone 38 (erweiterter Follikelraum)",
              "Zahn 37 ohne Karies, keine Wurzelresorption",
              "übriges Gebiss unauffällig",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABEN_ANAMNESE,
  },
  actorCard: {
    role: "patient",
    name: "Tobias Lehmann",
    voice: "Charon",
    persona: `27 Jahre alt, Elektriker. Etwas nervös, weil er Zahnarztbesuche eher meidet. Freundlich, aber angeschlagen und müde, weil er schlecht geschlafen hat. ${PATIENT_REGELN_ANAMNESE}`,
    facts: [
      "Seit drei Tagen Schmerzen hinten unten links, ganz hinten im Kiefer.",
      "Der Schmerz ist dumpf und pochend und zieht manchmal bis ins linke Ohr.",
      "Seit gestern ist die Wange links etwas dick, das Zahnfleisch hinten fühlt sich geschwollen an.",
      "Den Mund kann er nicht mehr richtig weit öffnen, Schlucken tut auf der linken Seite weh.",
      "Gestern Abend hatte er 38,2 °C Fieber.",
      "Es schmeckt unangenehm im Mund, beim Kauen auf der linken Seite tut es weh.",
      "Er hat zweimal täglich Ibuprofen 400 mg genommen, das hilft nur kurz.",
      "Vor etwa einem Jahr hatte er an der gleichen Stelle schon einmal kurz Beschwerden, die von allein weggingen.",
      "Vorerkrankungen: leichtes Asthma, nutzt bei Bedarf ein Spray (Salbutamol), zuletzt vor einigen Wochen.",
      "Allergie: gegen Penicillin, bekam als Kind einen Hautausschlag.",
      "Raucht seit 10 Jahren etwa 10 Zigaretten am Tag, Alkohol nur am Wochenende ein paar Bier.",
      "Letzter Zahnarztbesuch vor etwa drei Jahren.",
      "Keine Blutverdünner, keine weiteren Medikamente.",
    ],
    followUpQuestions: [
      "Ist das was Schlimmes? Muss der Zahn raus?",
      "Bekomme ich jetzt ein Antibiotikum? Ich vertrage doch kein Penicillin.",
      "Kann ich morgen arbeiten gehen?",
    ],
  },
  rubric: {
    checklist: checklisteAnamnese([
      { id: "begleit-fieber", label: "Fieber, Kieferklemme und Schluckbeschwerden erfragt", weight: 1 },
    ]),
    fachbegriffe: ["Perikoronitis", "Dentitio difficilis", "teilretiniert", "mesioanguliert", "Kieferklemme", "Orthopantomogramm", "Antibiose", "Inzision"],
  },
  vocabulary: [
    "Weisheitszahn", "Perikoronitis", "Dentitio difficilis", "Kieferklemme", "Ibuprofen", "Salbutamol", "Penicillin",
    "Penicillinallergie", "Clindamycin", "Röntgenbild", "Panoramaaufnahme", "Zahnfleischtasche", "Anamnese",
  ],
  beispiele: [
    {
      zu: "Röntgenbefund laienverständlich",
      saetze: [
        "Auf dem Röntgenbild sieht man, dass Ihr unterer linker Weisheitszahn nur teilweise durchgebrochen ist und schräg im Kiefer liegt.",
        "Um die Krone herum ist ein dunkler Bereich zu sehen. Das spricht dafür, dass sich dort unter dem Zahnfleisch eine Entzündung gebildet hat.",
        "Der Nachbarzahn ist gesund.",
      ],
    },
    {
      zu: "Verdachtsdiagnose und nächste Schritte",
      saetze: [
        "Ich vermute, dass sich das Zahnfleisch um Ihren Weisheitszahn entzündet hat, weil der Zahn nicht genug Platz hat.",
        "Heute reinigen und spülen wir die Zahnfleischtasche und lindern die Schmerzen. Wegen Ihrer Penicillinallergie bekämen Sie bei Bedarf ein anderes Antibiotikum.",
        "Wenn die Entzündung abgeklungen ist, sollte der Weisheitszahn entfernt werden, damit das nicht wiederkommt.",
      ],
    },
  ],
};

export const abszess46: CaseInput = {
  id: "anamnese-schwellung-46",
  version: 1,
  stationType: "anamnese",
  title: "Dicke Wange rechts",
  untertitel: "Neue Patientin mit Schwellung und Fieber",
  durationSeconds: ELF_MINUTEN,
  sheet: {
    kurzbeschreibung:
      "Sie sind Zahnarzt/-ärztin in einer Praxis. Eine neue Patientin/ein neuer Patient kommt zu Ihnen. Führen Sie ein strukturiertes Anamnesegespräch durch und erklären Sie einen Röntgenbefund. Sie sprechen mit Herrn/Frau Petrova. Sie haben für die gesamte Situation maximal 11 Minuten Zeit.",
    gespraechssituation: "Anamnesegespräch",
    gespraechspartner: "Frau E. Petrova (Patientin)",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name", wert: "E. Petrova" }] },
      {
        titel: "Röntgenaufnahme (Einzelzahnaufnahme 46) – Befund",
        eintraege: [
          {
            label: "Befund",
            wert: [
              "tiefe Karies unter frakturierter Füllung an Zahn 46, bis in die Pulpa reichend",
              "periapikale Aufhellung an der mesialen und distalen Wurzel 46",
              "Nachbarzähne 45 und 47 unauffällig",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABEN_ANAMNESE,
  },
  actorCard: {
    role: "patient",
    name: "Elena Petrova",
    voice: "Despina",
    persona: `39 Jahre alt, Verkäuferin in einer Bäckerei. Hat große Schmerzen, ist erschöpft und macht sich Sorgen, weil die Wange so dick ist. ${PATIENT_REGELN_ANAMNESE}`,
    facts: [
      "Seit drei Tagen pochende Zahnschmerzen unten rechts, seit gestern ist die rechte Wange geschwollen.",
      "Die Schmerzen sind nachts besonders stark, Wärme macht es schlimmer, Kälte lindert etwas.",
      "Der Zahn fühlt sich beim Zubeißen 'zu hoch' an.",
      "Gestern Abend 38,4 °C Fieber, heute fühlt sie sich schlapp.",
      "Mundöffnung und Schlucken sind normal möglich, keine Atemnot.",
      "Von dem Zahn ist vor einigen Monaten ein Stück der Füllung abgebrochen; sie war seitdem nicht beim Zahnarzt.",
      "Sie hat Ibuprofen 400 mg genommen, zuletzt heute früh, es hilft nur ein paar Stunden.",
      "Vorerkrankung: Schilddrüsenunterfunktion, nimmt morgens L-Thyroxin 50 µg.",
      "Sie nimmt die Pille. Sie ist nicht schwanger.",
      "Keine Allergien bekannt.",
      "Sie raucht nicht, Alkohol nur selten.",
      "Letzter Zahnarztbesuch vor etwa zwei Jahren.",
    ],
    followUpQuestions: [
      "Muss ich jetzt ins Krankenhaus?",
      "Brauche ich ein Antibiotikum?",
      "Kann man den Zahn noch retten?",
    ],
  },
  rubric: {
    checklist: checklisteAnamnese([
      { id: "abszess-warnzeichen", label: "Fieber, Mundöffnung, Schlucken und Atmung (Warnzeichen) erfragt", weight: 2 },
      { id: "schwangerschaft", label: "Schwangerschaft vor dem Röntgen bzw. vor Medikamenten erfragt", weight: 1 },
    ]),
    fachbegriffe: ["Abszess", "dentogen", "apikale Parodontitis", "periapikal", "Pulpa", "Inzision", "Trepanation", "Einzelzahnaufnahme"],
  },
  vocabulary: [
    "Abszess", "Schwellung", "Wange", "Ibuprofen", "L-Thyroxin", "Schilddrüsenunterfunktion", "Pille", "Fieber",
    "Röntgenbild", "Wurzelbehandlung", "Antibiotikum", "Füllung",
  ],
  beispiele: [
    {
      zu: "Röntgenbefund laienverständlich",
      saetze: [
        "Auf dem Röntgenbild sieht man unter der abgebrochenen Füllung ein tiefes Loch, das bis zum Zahnnerv reicht.",
        "An den Wurzelspitzen ist ein dunkler Bereich zu sehen. Das zeigt, dass sich dort eine Entzündung im Knochen gebildet hat.",
      ],
    },
    {
      zu: "Verdachtsdiagnose und nächste Schritte",
      saetze: [
        "Ich vermute, dass sich vom Zahn ausgehend Eiter gebildet hat, ein sogenannter Abszess.",
        "Heute öffnen wir die Schwellung unter örtlicher Betäubung, damit der Eiter abfließen kann, und öffnen den Zahn, um ihn zu entlasten.",
        "Wenn möglich, versuchen wir den Zahn mit einer Wurzelbehandlung zu erhalten. Sollten Sie Atemnot oder Schluckbeschwerden bekommen, müssen Sie sofort ins Krankenhaus.",
      ],
    },
  ],
};

export const ANAMNESE_FAELLE = [perikoronitis38, abszess46];
