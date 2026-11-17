import type { Case } from "@/lib/cases/schema";

/**
 * Eigener Übungsfall (kein Material aus FaMed/digiFORT).
 * Leitbild: Dentitio difficilis / Perikoronitis an Zahn 38.
 */
export const anamnesePerikoronitis: Case = {
  id: "anamnese-perikoronitis",
  version: 1,
  stationType: "anamnese",
  title: "Schmerzen hinten unten links",
  durationSeconds: 11 * 60,
  candidateSheet: {
    kurzbeschreibung:
      "Sie sind Zahnarzt/Zahnärztin in einer Praxis. Ein neuer Patient kommt mit akuten Beschwerden zu Ihnen. Führen Sie ein strukturiertes Anamnesegespräch durch. Sie sprechen mit Herrn Lehmann.",
    gesprächspartner: "Herr T. Lehmann (Patient)",
    patientInfo: [{ label: "Name", value: "T. Lehmann" }],
    aufgaben: [
      "Erheben Sie die Beschwerden sowie die relevante medizinische Vorgeschichte.",
      "Stellen Sie anschließend eine Verdachtsdiagnose und erklären Sie dem Patienten verständlich die nächsten Behandlungsschritte.",
      "Gehen Sie auf Rückfragen ein.",
    ],
  },
  actorCard: {
    role: "patient",
    name: "Tobias Lehmann",
    voice: "Charon",
    persona:
      "27 Jahre alt, Elektriker. Etwas nervös, weil er Zahnarztbesuche eher meidet. Freundlich, aber spürbar angeschlagen und müde, weil er schlecht geschlafen hat.",
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
    checklist: [
      { id: "begruessung", label: "Begrüßung, Vorstellung, Gesprächsanlass", weight: 1 },
      { id: "lokalisation", label: "Lokalisation der Schmerzen", weight: 1 },
      { id: "beginn", label: "Beginn und Verlauf", weight: 1 },
      { id: "charakter", label: "Schmerzcharakter und Ausstrahlung", weight: 1 },
      { id: "begleitsymptome", label: "Begleitsymptome (Schwellung, Kieferklemme, Schluckbeschwerden, Fieber)", weight: 2 },
      { id: "medikation-akut", label: "Bisherige Schmerzmedikation", weight: 1 },
      { id: "vorerkrankungen", label: "Vorerkrankungen (Asthma)", weight: 1 },
      { id: "dauermedikation", label: "Medikamente / Blutverdünner", weight: 1 },
      { id: "allergien", label: "Allergien (Penicillin)", weight: 2 },
      { id: "noxen", label: "Nikotin- und Alkoholkonsum", weight: 1 },
      { id: "zahnarztbesuch", label: "Letzter Zahnarztbesuch / frühere Episoden", weight: 1 },
      { id: "verdachtsdiagnose", label: "Verdachtsdiagnose laienverständlich erklärt", weight: 2 },
      { id: "procedere", label: "Nächste Schritte verständlich erklärt", weight: 2 },
      { id: "rueckfragen", label: "Rückfragen angemessen beantwortet", weight: 1 },
    ],
    fachbegriffe: [
      "Perikoronitis",
      "Dentitio difficilis",
      "Kieferklemme",
      "Weisheitszahn",
      "Orthopantomogramm",
      "Antibiose",
      "Inzision",
    ],
  },
  vocabulary: [
    "Weisheitszahn",
    "Perikoronitis",
    "Dentitio difficilis",
    "Kieferklemme",
    "Ibuprofen",
    "Salbutamol",
    "Penicillin",
    "Penicillinallergie",
    "Clindamycin",
    "Röntgenbild",
    "Panoramaaufnahme",
    "Zahnfleischtasche",
    "Anamnese",
  ],
};
