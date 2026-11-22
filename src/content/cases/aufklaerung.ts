import { aufklaerungsFall } from "./helpers";

/**
 * Aufklärungsgespräche – Inhalte aus den Unterlagen im Ordner „Manhal“
 * (Aufgabenblätter und Musterformulierungen, sprachlich überarbeitet).
 */

const PATIENT_REGELN_AUFKLAERUNG =
  "Du bekommst heute ein Aufklärungsgespräch. Hör zu, reagiere kurz und natürlich, und stelle deine Fragen. Erzähle von dir aus nur wenig.";

export const implantation36 = aufklaerungsFall({
  id: "aufklaerung-implantation-36",
  title: "Implantation Zahn 36",
  untertitel: "Zahnlücke im linken Unterkiefer, Hypertonie, Penicillinallergie",
  anrede: "Herrn/Frau Yilmaz",
  partner: "Herr Y. Yilmaz (Patient)",
  kurzZusatz: "chirurgischen Eingriff",
  situation: "Aufklärung über eine Implantation, die demnächst durchgeführt werden soll.",
  info: [
    { label: "Name", wert: "Y. Yilmaz, 58 Jahre" },
    { label: "Eingriff", wert: "Implantation eines Zahnimplantats im Bereich des Zahnes 36" },
    { label: "Dauer", wert: "ca. 45–60 Min." },
    { label: "Grund des Eingriffs", wert: "Zahnlücke im Bereich des Zahnes 36 nach Zahnverlust; Versorgung durch ein Implantat" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Schnitt am Zahnfleisch und Bildung eines Schleimhautlappens; Vorbereitung des Implantatbetts im Kieferknochen; Kontrolle von Position und Tiefe; Einsetzen des Implantats und der Verschlussschraube; Wundverschluss mit Nähten; Kontrolle der Blutstillung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Arterielle Hypertonie; Hypercholesterinämie" },
    { label: "Dauermedikation", wert: "Ramipril 2,5 mg (1–0–0); Atorvastatin 20 mg (0–0–1)" },
    { label: "Allergien", wert: "Penicillin (Hautausschlag)" },
  ],
  allgemeineRisiken:
    "Schmerzen, Schwellungen, Nachblutungen, Infektionen, allergische Reaktionen, Verletzungen benachbarter Strukturen",
  spezielleRisiken: [
    "Entzündung am Implantat (Periimplantitis)",
    "verzögerte Einheilung, insbesondere bei Rauchern",
    "Implantatverlust oder Bruch des Implantats",
    "vorübergehendes oder dauerhaftes Taubheitsgefühl",
  ],
  la: ["Schmerzen, Schwellungen und Infektionen an der Einstichstelle", "Bluterguss und allergische Reaktionen", "Verletzung benachbarter Strukturen"],
  prae: ["Medikamente wie gewohnt einnehmen"],
  post: [
    "solange die Betäubung wirkt: nicht essen und nichts Heißes trinken",
    "in den ersten Tagen weiche Kost bevorzugen",
    "von außen regelmäßig kühlen",
    "für 24 Stunden auf Alkohol und Rauchen verzichten",
    "für 2 Tage körperliche Belastung vermeiden",
    "bei leichten Schmerzen: Ibuprofen 600 mg, sofern verträglich; bei stärkeren Schmerzen, anhaltender Nachblutung oder Fieber: Wiedervorstellung",
    "Kontrolltermin nach 7–10 Tagen zur Wundkontrolle und ggf. Fadenentfernung",
  ],
  actor: {
    role: "patient",
    name: "Yusuf Yilmaz",
    voice: "Alnilam",
    sprechweise:
      "Mann, 58, Busfahrer aus Duisburg, in Deutschland aufgewachsen, ganz leichter türkischer Einschlag. Ruhig und bedächtig, tiefe, etwas raue Stimme; brummt „hm“ und „ja, ja“, wenn er zuhört; skeptisch („Na, ich weiß nich …“), lässt sich aber überzeugen.",
    persona: `58 Jahre, Busfahrer. Ruhig, aber etwas skeptisch gegenüber Operationen. Er möchte vor allem wissen, ob das Implantat lange hält. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Der Zahn unten links musste vor einem halben Jahr gezogen werden, seitdem ist dort eine Lücke.",
      "Er hat Bluthochdruck und erhöhte Blutfettwerte und nimmt morgens Ramipril und abends Atorvastatin.",
      "Er ist allergisch gegen Penicillin, er bekam davon einen Hautausschlag.",
      "Er raucht nicht mehr seit fünf Jahren.",
    ],
    followUpQuestions: [
      "Wie lange hält so ein Implantat eigentlich?",
      "Bekomme ich ein Antibiotikum? Ich vertrage doch kein Penicillin.",
      "Wann kann ich darauf wieder richtig kauen?",
    ],
  },
  fachbegriffe: ["Implantat", "Periimplantitis", "Schleimhautlappen", "Implantatbett", "Verschlussschraube", "Lokalanästhesie", "Hypertonie"],
  vocabulary: ["Implantat", "Implantation", "Periimplantitis", "Verschlussschraube", "Ramipril", "Atorvastatin", "Penicillin", "Lokalanästhesie", "Schleimhautlappen", "Ibuprofen"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen ist eine Implantation im Bereich des ersten großen Backenzahns im linken Unterkiefer geplant.",
        "Das heißt, dass Sie in diesem Bereich eine Lücke haben, die mit einer künstlichen Zahnwurzel versorgt werden soll.",
        "Ohne Implantation können sich die Nachbarzähne in die Lücke verschieben. Außerdem kann sich der Kieferknochen abbauen.",
        "Deshalb empfehlen wir Ihnen eine Implantation, um die Kaufunktion wiederherzustellen.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Der Eingriff dauert ungefähr 45 bis 60 Minuten und erfolgt unter örtlicher Betäubung, sodass Sie keine Schmerzen spüren.",
        "Zunächst machen wir einen kleinen Schnitt in das Zahnfleisch und klappen ein kleines Stück zur Seite, um den Kieferknochen freizulegen.",
        "Danach wird das Implantatbett im Kieferknochen vorbereitet und die richtige Position und Tiefe sorgfältig kontrolliert.",
        "Anschließend werden das Implantat und eine Verschlussschraube eingesetzt.",
        "Danach wird die Wunde mit Nähten dicht verschlossen, und zum Schluss kontrollieren wir sorgfältig die Blutstillung.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Es kann zu einer Entzündung am Implantat kommen. Das bezeichnet man als Periimplantitis.",
        "Außerdem kann sich die Wundheilung verzögern, insbesondere bei Rauchern.",
        "In seltenen Fällen kann sich das Implantat lockern oder brechen und im schlimmsten Fall verloren gehen.",
        "Darüber hinaus kann ein vorübergehendes oder dauerhaftes Taubheitsgefühl entstehen.",
      ],
    },
    {
      zu: "Vorerkrankungen & Verhalten",
      saetze: [
        "Sie leiden an Bluthochdruck sowie an erhöhten Blutfettwerten und nehmen dagegen morgens Ramipril 2,5 mg und abends Atorvastatin 20 mg ein.",
        "Außerdem sind Sie gegen Penicillin allergisch. Das berücksichtigen wir bei einer antibiotischen Therapie.",
        "Vor dem Eingriff können Sie Ihre Medikamente wie gewohnt weiter einnehmen.",
        "Für die nächsten 24 Stunden sollten Sie auf Rauchen und Alkohol verzichten und für zwei Tage körperliche Anstrengung vermeiden.",
        "Nach 7 bis 10 Tagen ist ein Kontrolltermin geplant, um die Wunde zu kontrollieren und gegebenenfalls die Fäden zu entfernen.",
      ],
    },
  ],
});

export const parodontitisAit = aufklaerungsFall({
  id: "aufklaerung-parodontitis-ait",
  title: "Parodontalbehandlung (AIT)",
  untertitel: "Antiinfektiöse Therapie, Diabetes mellitus Typ 2, Hypothyreose",
  anrede: "Herrn/Frau Neumann",
  partner: "Frau K. Neumann (Patientin)",
  kurzZusatz: "Parodontalbehandlung",
  situation:
    "Aufklärung über eine antiinfektiöse Therapie (AIT) bei Parodontitis, die demnächst durchgeführt werden soll.",
  info: [
    { label: "Name", wert: "K. Neumann, 55 Jahre" },
    { label: "Eingriff", wert: "Antiinfektiöse Therapie (AIT) bei chronischer Parodontitis" },
    { label: "Dauer", wert: "ca. 45–60 Minuten pro Sitzung; mehrere Behandlungssitzungen notwendig" },
    { label: "Grund des Eingriffs", wert: "Chronische Parodontitis mit erhöhten Sondierungstiefen" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie bei Bedarf; Entfernung harter und weicher Zahnbeläge; Reinigung der Zahnfleischtaschen und Glättung der Wurzeloberflächen mit speziellen Instrumenten oder Ultraschall; ggf. Entfernung entzündeten Gewebes oder zusätzliche lokale Behandlung; heute Behandlung der Quadranten 1 und 3, die Quadranten 2 und 4 folgen in einer späteren Sitzung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Hypothyreose; Diabetes mellitus Typ 2" },
    { label: "Dauermedikation", wert: "L-Thyroxin 75 µg (1–0–0); Metformin 500 mg (1–0–1)" },
    { label: "Allergien", wert: "keine" },
  ],
  allgemeineRisiken:
    "Schmerzen, Schwellungen, Nachblutungen, Infektionen, allergische Reaktionen, Verletzung benachbarter Strukturen",
  spezielleRisiken: [
    "vorübergehende Überempfindlichkeit der Zahnhälse",
    "Zahnfleischrückgang und vorübergehende Zahnlockerung",
    "Fortbestehen oder Wiederauftreten der Parodontitis mit weiterem Knochenabbau",
  ],
  la: ["Schmerzen, Schwellung, Infektion", "Bluterguss, allergische Reaktionen", "Verletzung benachbarter Strukturen"],
  prae: ["Medikamente wie gewohnt einnehmen", "ggf. professionelle Zahnreinigung im Vorfeld"],
  post: [
    "gründliche, aber schonende Mundhygiene im behandelten Bereich",
    "Interdentalbürsten und Zahnseide verwenden",
    "Chlorhexidin-Mundspülung nur nach Anweisung",
    "Rauchen vermeiden und den behandelten Bereich nicht mechanisch reizen",
    "bei stärkeren Schmerzen, Schwellung oder Nachblutung: Wiedervorstellung",
    "Kontrolle nach einigen Wochen; Weiterbehandlung der Quadranten 2 und 4 in einer späteren Sitzung",
  ],
  actor: {
    role: "patient",
    name: "Karin Neumann",
    voice: "Vindemiatrix",
    sprechweise:
      "Frau, 55, Bürokauffrau aus Stuttgart, leichte schwäbische Färbung („gell“, „a bissle“). Freundlich, aber besorgt; redet schneller, wenn sie nervös ist, und wird leise und verlegen, wenn es um ihr Zahnfleischbluten geht.",
    persona: `55 Jahre, Bürokauffrau. Freundlich, aber besorgt, ob sie ihre Zähne verlieren wird. Sie schämt sich ein bisschen für ihr Zahnfleischbluten. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Ihr Zahnfleisch blutet seit Monaten beim Zähneputzen, manche Zähne fühlen sich etwas locker an.",
      "Sie hat eine Schilddrüsenunterfunktion (L-Thyroxin morgens) und Zucker (Metformin morgens und abends).",
      "Sie hat keine Allergien.",
    ],
    followUpQuestions: [
      "Kann ich durch die Parodontitis meine Zähne verlieren?",
      "Hat das etwas mit meinem Zucker zu tun?",
      "Tut die Behandlung weh, und wie oft muss ich kommen?",
    ],
  },
  fachbegriffe: ["Parodontitis", "antiinfektiöse Therapie", "Sondierungstiefen", "Quadranten", "Chlorhexidin", "Interdentalbürsten", "Hypothyreose", "Diabetes mellitus"],
  vocabulary: ["Parodontitis", "antiinfektiöse Therapie", "Sondierungstiefe", "Quadrant", "Chlorhexidin", "Interdentalbürste", "L-Thyroxin", "Metformin", "Ultraschall", "Zahnhälse"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen liegt eine chronische Parodontitis mit vertieften Zahnfleischtaschen vor.",
        "Das bedeutet, dass Ihr Zahnfleisch und der Zahnhalteapparat entzündet sind.",
        "Dadurch können sich Bakterien und Beläge in den Taschen ansammeln und zu weiteren Komplikationen führen.",
        "Ohne Behandlung kann sich die Entzündung weiter ausbreiten; es kann zu Knochenabbau und langfristig zum Zahnverlust kommen.",
        "Deshalb empfehlen wir eine antiinfektiöse Therapie, um die Entzündung zu beseitigen.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Insgesamt benötigen wir mehrere Sitzungen; jede dauert ungefähr 45 bis 60 Minuten.",
        "Bei Bedarf erfolgt die Behandlung unter örtlicher Betäubung, sodass Sie keine Schmerzen spüren.",
        "Zunächst werden die harten und weichen Zahnbeläge entfernt.",
        "Danach werden die Zahnfleischtaschen gründlich gereinigt und die Wurzeloberflächen mit speziellen Instrumenten oder Ultraschall geglättet.",
        "Heute behandeln wir den rechten Oberkiefer und den linken Unterkiefer, die anderen beiden Bereiche folgen in einer späteren Sitzung.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Es kann zu einer vorübergehenden Überempfindlichkeit der Zahnhälse kommen.",
        "Außerdem kann sich das Zahnfleisch etwas zurückziehen, und die Zähne können sich vorübergehend lockern.",
        "Trotz der Behandlung kann die Parodontitis bestehen bleiben oder wieder auftreten, mit weiterem Knochenabbau.",
      ],
    },
    {
      zu: "Verhalten nach der Behandlung",
      saetze: [
        "Bitte putzen Sie im behandelten Bereich gründlich, aber schonend.",
        "Verwenden Sie Interdentalbürsten und Zahnseide; eine Chlorhexidin-Mundspülung bitte nur nach unserer Anweisung.",
        "Außerdem sollten Sie möglichst nicht rauchen und die behandelte Stelle nicht reizen.",
        "Bei stärkeren Schmerzen, einer Schwellung oder Nachblutung stellen Sie sich bitte wieder bei uns vor.",
      ],
    },
  ],
});

export const wsr24 = aufklaerungsFall({
  id: "aufklaerung-wsr-24",
  title: "Wurzelspitzenresektion Zahn 24",
  untertitel: "Persistierende apikale Parodontitis, Methotrexat, Latexallergie",
  anrede: "Herrn/Frau Wagner",
  partner: "Herr S. Wagner (Patient)",
  situation: "Aufklärung über einen Eingriff, der demnächst stattfinden soll.",
  info: [
    { label: "Name", wert: "S. Wagner, 42 Jahre" },
    { label: "Eingriff", wert: "Wurzelspitzenresektion am Zahn 24 mit ggf. retrograder Wurzelfüllung" },
    { label: "Dauer", wert: "ca. 45–60 Min." },
    { label: "Grund des Eingriffs", wert: "Persistierende apikale Parodontitis am Zahn 24 trotz bereits durchgeführter Wurzelkanalbehandlung" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Schnitt am Zahnfleisch und Bildung eines Schleimhautlappens; Freilegung der Wurzelspitze; Entfernung der Wurzelspitze und des entzündeten Gewebes; Kürettage, Desinfektion und Spülung des Operationsgebietes; retrograde Wurzelfüllung; Wundverschluss mit Nähten; Kontrolle der Blutstillung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Rheumatoide Arthritis; arterielle Hypertonie" },
    { label: "Dauermedikation", wert: "Methotrexat 15 mg (1× wöchentlich); Amlodipin 5 mg (1–0–0)" },
    { label: "Allergien", wert: "Latex" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Nachblutung, Infektion, allergische Reaktion, Verletzung von Nachbarstrukturen",
  spezielleRisiken: [
    "Eröffnung der Kieferhöhle",
    "Verletzung benachbarter Zahnwurzeln",
    "verzögerte Wundheilung",
    "Persistenz oder Wiederauftreten der Entzündung",
    "insuffizienter Verschluss der Wurzelspitze mit möglicher Reinfektion",
  ],
  prae: ["Rücksprache bezüglich der Einnahme von Methotrexat"],
  post: [
    "auf den Tupfer ca. 30 Minuten fest aufbeißen",
    "solange die Betäubung wirkt: nicht essen, nichts Heißes trinken",
    "von außen regelmäßig kühlen",
    "für 2 Tage körperliche Belastung vermeiden",
    "in den ersten 24 Stunden nicht rauchen, keinen Alkohol trinken und nicht kräftig spülen",
    "Wundbereich nicht mit Fingern oder Zunge manipulieren",
    "bei leichten Schmerzen: Ibuprofen 600 mg, sofern verträglich",
    "bei starker Nachblutung, zunehmender Schwellung, Fieber oder starken Schmerzen: sofortige Wiedervorstellung; Nahtentfernung nach ca. 7 Tagen",
  ],
  actor: {
    role: "patient",
    name: "Stefan Wagner",
    voice: "Achird",
    sprechweise:
      "Mann, 42, Lehrer, eigentlich gut artikuliert, aber heute genervt und enttäuscht: seufzt, spricht etwas abgehackt, macht Denkpausen („Hm. Na gut.“), fragt genau nach und lässt sich nicht mit allgemeinen Antworten abspeisen.",
    persona: `42 Jahre, Lehrer. Ist enttäuscht, weil der Zahn schon eine Wurzelbehandlung hatte und trotzdem wieder Probleme macht. Sachlich, fragt genau nach. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Der Zahn oben links wurde vor einem Jahr wurzelbehandelt, jetzt drückt es wieder und manchmal schmeckt es komisch.",
      "Er hat Rheuma und nimmt einmal pro Woche Methotrexat, außerdem morgens Amlodipin gegen Bluthochdruck.",
      "Er ist allergisch gegen Latex.",
    ],
    followUpQuestions: [
      "Warum hat die Wurzelbehandlung nicht gereicht?",
      "Muss ich mein Methotrexat absetzen?",
      "Was passiert, wenn die Kieferhöhle eröffnet wird?",
    ],
  },
  fachbegriffe: ["Wurzelspitzenresektion", "apikale Parodontitis", "retrograde Wurzelfüllung", "Kürettage", "Kieferhöhle", "Methotrexat", "Hämostase"],
  vocabulary: ["Wurzelspitzenresektion", "apikale Parodontitis", "retrograd", "Wurzelfüllung", "Kürettage", "Kieferhöhle", "Methotrexat", "Amlodipin", "Latex", "Tupfer"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen liegt am ersten kleinen Backenzahn im linken Oberkiefer eine Entzündung an der Wurzelspitze vor, obwohl der Zahn bereits wurzelbehandelt wurde.",
        "Das bedeutet, dass die Entzündung trotz der bisherigen Behandlung weiterhin besteht.",
        "Dadurch können starke Schmerzen entstehen, oder es kann sich Eiter ansammeln.",
        "Deshalb empfehlen wir eine Wurzelspitzenresektion, um die Entzündung zu beseitigen und den Zahn möglichst zu erhalten.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Die Behandlung dauert ungefähr 45 bis 60 Minuten und erfolgt unter örtlicher Betäubung.",
        "Zunächst machen wir einen kleinen Schnitt in das Zahnfleisch und klappen ein kleines Stück zur Seite, um die Wurzelspitze freizulegen.",
        "Im nächsten Schritt werden die Wurzelspitze und das umgebende entzündete Gewebe vorsichtig entfernt.",
        "Danach wird die Stelle gründlich gereinigt, desinfiziert und gespült.",
        "Anschließend wird die Wurzelspitze von unten dicht verschlossen, damit keine Bakterien mehr eindringen können.",
        "Danach wird die Wunde vernäht, und zum Schluss kontrollieren wir sorgfältig die Blutstillung.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Es kann zu einer Verbindung zwischen Mundhöhle und Kieferhöhle kommen.",
        "Außerdem können benachbarte Zahnwurzeln verletzt werden.",
        "Darüber hinaus kann sich die Wundheilung verzögern.",
        "Trotz der Behandlung kann die Entzündung bestehen bleiben oder erneut auftreten.",
        "In seltenen Fällen ist der Verschluss der Wurzelspitze nicht vollständig dicht, sodass erneut Bakterien eindringen und eine neue Infektion verursachen können.",
      ],
    },
    {
      zu: "Vorerkrankungen & Verhalten",
      saetze: [
        "Bezüglich der Einnahme von Methotrexat ist vor dem Eingriff eine Rücksprache mit Ihrem behandelnden Arzt notwendig.",
        "Da Sie eine Latexallergie haben, führen wir die Behandlung latexfrei durch.",
        "Nach dem Eingriff beißen Sie bitte etwa 30 Minuten fest auf den Tupfer.",
        "Nach ungefähr sieben Tagen werden die Fäden entfernt.",
      ],
    },
  ],
});

export const krone46 = aufklaerungsFall({
  id: "aufklaerung-krone-46",
  title: "Kronenpräparation Zahn 46",
  untertitel: "Keramikkrone mit Provisorium, Asthma bronchiale, Hypothyreose",
  anrede: "Herrn/Frau Fischer",
  partner: "Frau M. Fischer (Patientin)",
  situation: "Aufklärung über eine Kronenpräparation, die demnächst durchgeführt werden soll.",
  info: [
    { label: "Name", wert: "M. Fischer" },
    {
      label: "Eingriff",
      wert: "Präparation des Zahnes 46 für eine Keramikkrone mit anschließender Abformung und Versorgung mit einem Provisorium",
    },
    { label: "Dauer", wert: "ca. 60–75 Min." },
    {
      label: "Grund des Eingriffs",
      wert: "Zahn 46 ist durch eine große Füllung und einen zusätzlichen Wandbruch stark geschwächt und soll durch eine Krone stabilisiert werden",
    },
    {
      label: "Ablauf",
      wert: "Farbauswahl; Bissnahme; Lokalanästhesie bei Bedarf; Präparation des Zahnes 46; ggf. Aufbau des Zahnes; Anlegen eines Retraktionsfadens; Abformung des präparierten Zahnes; Herstellung und Befestigung eines Provisoriums; Einsetzen der endgültigen Krone bei einem zweiten Termin",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Asthma bronchiale; Hypothyreose" },
    { label: "Dauermedikation", wert: "Salbutamol-Spray bei Bedarf; L-Thyroxin 75 µg (1–0–0)" },
    { label: "Allergien", wert: "keine" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Blutung, Infektion, allergische Reaktion, Verletzung benachbarter Strukturen",
  spezielleRisiken: [
    "Überempfindlichkeit des Zahnes nach der Präparation",
    "Reizung des Zahnnervs bis hin zu einer irreversiblen Pulpitis",
    "Lockerung oder Bruch des Provisoriums",
    "Absplitterung oder Bruch der endgültigen Keramikkrone",
  ],
  la: ["Schmerzen, Schwellung oder Bluterguss an der Einstichstelle", "Verletzung benachbarter Strukturen", "allergische Reaktion"],
  prae: ["Medikamente wie gewohnt einnehmen", "Salbutamol-Spray zur Behandlung mitbringen"],
  post: [
    "solange die Betäubung wirkt: nicht essen und nichts Heißes trinken (Verletzungsgefahr)",
    "auf der behandelten Seite möglichst nicht kauen",
    "harte und klebrige Speisen vermeiden",
    "das Provisorium nicht mit Fingern oder Zunge manipulieren",
    "bei Verlust oder Lockerung des Provisoriums die Praxis kontaktieren",
    "bei starken Schmerzen oder anhaltender Überempfindlichkeit: Wiedervorstellung",
  ],
  actor: {
    role: "patient",
    name: "Monika Fischer",
    voice: "Pulcherrima",
    sprechweise:
      "Frau, 49, Friseurin aus Berlin, gesprächig und ungeduldig: redet schnell, springt im Satz, leicht berlinerisch („nee“, „wat“, „icke“ nur gelegentlich). Lacht nervös, sobald es ums Bohren geht, und unterbricht sich selbst.",
    persona: `49 Jahre, Friseurin. Gesprächig und etwas ungeduldig, fragt nach Aussehen und Kosten-Nebensachen nur kurz. Hat Angst vor dem Bohren. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Beim Essen ist vor zwei Wochen ein Stück vom Zahn unten rechts abgebrochen, der Zahn hat schon eine große Füllung.",
      "Sie hat Asthma (Spray bei Bedarf) und eine Schilddrüsenunterfunktion (L-Thyroxin morgens).",
      "Sie hat keine Allergien.",
    ],
    followUpQuestions: [
      "Sieht man später, dass das eine Krone ist?",
      "Was mache ich, wenn das Provisorium herausfällt?",
      "Muss der Nerv dafür raus?",
    ],
  },
  fachbegriffe: ["Präparation", "Provisorium", "Retraktionsfaden", "Abformung", "irreversible Pulpitis", "Keramikkrone", "Bissnahme"],
  vocabulary: ["Präparation", "Provisorium", "Retraktionsfaden", "Abformung", "Keramikkrone", "Pulpitis", "Salbutamol", "L-Thyroxin", "Bissnahme", "Farbauswahl"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen ist der erste große Backenzahn im rechten Unterkiefer durch eine große Füllung und einen zusätzlichen Bruch stark geschwächt.",
        "Eine erneute Füllung wäre in diesem Fall nicht mehr ausreichend stabil.",
        "Ohne Behandlung kann der Zahn brechen.",
        "Deshalb empfehlen wir eine Keramikkrone, um den Zahn zu schützen und langfristig zu erhalten.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Die Behandlung dauert ungefähr 60 bis 75 Minuten.",
        "Zunächst bestimmen wir die passende Zahnfarbe und registrieren Ihren Biss, also wie Ihre Zähne aufeinandertreffen.",
        "Bei Bedarf erfolgt eine örtliche Betäubung, damit Sie keine Schmerzen spüren.",
        "Im nächsten Schritt wird der Zahn beschliffen, damit genügend Platz für die spätere Krone entsteht; falls nötig, bauen wir ihn vorher auf.",
        "Danach legen wir einen dünnen Faden um den Zahn, um eine genaue Abformung nehmen zu können.",
        "Anschließend bekommen Sie eine vorläufige Krone, die den Zahn bis zum zweiten Termin schützt. Dann wird die endgültige Krone eingesetzt.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Nach der Behandlung kann der Zahn überempfindlich sein.",
        "Außerdem kann sich der Zahnnerv stark entzünden, sodass eine Wurzelkanalbehandlung notwendig wird.",
        "Zudem kann sich die vorläufige Krone lockern oder brechen.",
        "Auch die endgültige Keramikkrone kann absplittern oder brechen.",
      ],
    },
    {
      zu: "Verhalten",
      saetze: [
        "Vor der Behandlung können Sie Ihre Medikamente wie gewohnt einnehmen. Bitte bringen Sie Ihr Asthmaspray mit.",
        "Solange die Betäubung wirkt, sollten Sie nichts essen und nichts Heißes trinken, damit Sie sich nicht verletzen.",
        "Vermeiden Sie bitte harte und klebrige Speisen und kauen Sie möglichst nicht auf der behandelten Seite.",
        "Wenn sich die vorläufige Krone lockert oder herausfällt, melden Sie sich bitte bei uns.",
      ],
    },
  ],
});

export const abszess36 = aufklaerungsFall({
  id: "aufklaerung-abszess-36",
  title: "Abszessinzision Regio 36",
  untertitel: "Akuter dentogener Abszess, Marcumar, Penicillinallergie",
  anrede: "Herrn/Frau Müller",
  partner: "Frau M. Müller (Patientin)",
  kurzZusatz: "chirurgischen Eingriff",
  situation: "Aufklärung über einen chirurgischen Eingriff, der heute durchgeführt werden soll.",
  info: [
    { label: "Name", wert: "M. Müller" },
    { label: "Eingriff", wert: "Inzision und Drainage eines dentogenen Abszesses" },
    { label: "Dauer", wert: "ca. 20–30 Min." },
    { label: "Grund des Eingriffs", wert: "Akuter dentogener Abszess in Regio 36" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Inzision der Schwellung; Entleerung des Eiters; Spülung der Abszesshöhle; Einlage einer Drainage (falls erforderlich); Kontrolle der Blutstillung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Vorhofflimmern; arterielle Hypertonie" },
    { label: "Dauermedikation", wert: "Marcumar 3 mg (1–0–0); Ramipril 5 mg (1–0–0)" },
    { label: "Allergien", wert: "Penicillin" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Nachblutung, Verletzung benachbarter Strukturen",
  spezielleRisiken: [
    "unvollständige Entleerung des Abszesses",
    "erneute Abszessbildung",
    "Ausbreitung der Infektion trotz Behandlung",
  ],
  la: ["Schmerzen, Schwellung", "Infektionen", "allergische Reaktionen"],
  prae: ["bei einem INR-Wert über 3,0 ist eine Rücksprache mit dem behandelnden Arzt erforderlich"],
  post: [
    "auf den Tupfer ca. 30 Minuten fest aufbeißen",
    "solange die Betäubung wirkt: nicht essen und nichts Heißes trinken",
    "von außen kühlen",
    "für 2 Tage körperliche Anstrengung vermeiden",
    "bei leichten Schmerzen in den nächsten Tagen: Ibuprofen 600 mg; bei stärkeren Schmerzen: Wiedervorstellung",
    "Kontrolltermin am nächsten Tag zur Entfernung der Drainage",
  ],
  actor: {
    role: "patient",
    name: "Marianne Müller",
    voice: "Sulafat",
    sprechweise:
      "Ältere Frau, 67, Rentnerin aus Bayern, leichte bayerische Färbung („mei“, „gell“). Etwas brüchige, zittrige Stimme, spricht langsamer; ängstlich und aufgeregt. Die Wange ist dick und tut weh – sie spricht gepresst und undeutlich und seufzt oft.",
    persona: `67 Jahre, Rentnerin. Hat starke Schmerzen und eine dicke Wange, ist ängstlich und etwas aufgeregt, weil heute schon operiert werden soll. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Seit drei Tagen hat sie Schmerzen unten links, seit gestern ist die Wange dick.",
      "Sie hat Herzrhythmusstörungen und nimmt deshalb Marcumar, außerdem Ramipril gegen Bluthochdruck.",
      "Sie ist allergisch gegen Penicillin.",
      "Ihr letzter INR-Wert war beim Hausarzt vor einer Woche bei 2,6.",
    ],
    followUpQuestions: [
      "Ich nehme doch Marcumar – blute ich da nicht sehr stark?",
      "Kann der Zahn drinbleiben?",
      "Was ist das, eine Drainage? Bleibt die lange drin?",
    ],
  },
  fachbegriffe: ["Abszess", "dentogen", "Inzision", "Drainage", "Abszesshöhle", "INR-Wert", "Marcumar", "Vorhofflimmern"],
  vocabulary: ["Abszess", "Inzision", "Drainage", "Abszesshöhle", "INR", "Marcumar", "Ramipril", "Vorhofflimmern", "Penicillin", "Ibuprofen"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen liegt im Bereich des ersten großen Backenzahns im linken Unterkiefer eine akute Eiteransammlung vor, die vom Zahn ausgeht.",
        "Das bedeutet, dass sich aufgrund einer Entzündung Eiter im Bereich des Zahnes angesammelt hat. Dadurch entstehen Schmerzen und Schwellungen.",
        "Ohne Behandlung kann sich die Entzündung weiter ausbreiten.",
        "Deshalb empfehlen wir, den Eiter zu entleeren, um die Entzündung zu beseitigen und den Zahn möglichst zu erhalten.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Der Eingriff dauert ungefähr 20 bis 30 Minuten und erfolgt unter örtlicher Betäubung.",
        "Zunächst machen wir einen kleinen Schnitt in die Schwellung, damit der Eiter abfließen kann.",
        "Danach wird die Abszesshöhle gründlich gereinigt und gespült.",
        "Falls erforderlich, wird ein kleiner Streifen eingelegt, damit der restliche Eiter abfließen kann.",
        "Zum Schluss kontrollieren wir sorgfältig die Blutstillung.",
      ],
    },
    {
      zu: "Vorerkrankungen & präoperativ",
      saetze: [
        "Sie leiden an Herzrhythmusstörungen und an Bluthochdruck und nehmen deshalb Marcumar 3 mg und Ramipril 5 mg ein.",
        "Da Sie Marcumar einnehmen, besteht bei Ihnen ein erhöhtes Blutungsrisiko. Deshalb wird vor der Behandlung Ihr Gerinnungswert, der INR-Wert, kontrolliert.",
        "Liegt der INR-Wert über 3,0, ist eine Rücksprache mit Ihrem behandelnden Arzt notwendig.",
        "Außerdem haben Sie eine Penicillinallergie, die wir bei einer antibiotischen Therapie berücksichtigen.",
      ],
    },
    {
      zu: "Verhalten nach dem Eingriff",
      saetze: [
        "Nach der Behandlung sollten Sie etwa 30 Minuten fest auf den Tupfer beißen.",
        "Bitte kühlen Sie die Stelle regelmäßig von außen und vermeiden Sie für zwei Tage körperliche Anstrengung.",
        "Bei leichten Schmerzen können Sie Ibuprofen 600 mg einnehmen; bei stärkeren Schmerzen melden Sie sich bitte bei uns.",
        "Morgen ist ein Kontrolltermin geplant, um den Streifen wieder zu entfernen.",
      ],
    },
  ],
});

export const abszessExtraktion46 = aufklaerungsFall({
  id: "aufklaerung-abszess-extraktion-46",
  title: "Abszessinzision + Extraktion Zahn 46",
  untertitel: "Nicht erhaltungswürdiger Zahn, Diabetes, Niereninsuffizienz, Latexallergie",
  anrede: "Herrn/Frau Schneider",
  partner: "Herr T. Schneider (Patient)",
  kurzZusatz: "chirurgischen Eingriff",
  situation: "Aufklärung über einen chirurgischen Eingriff, der heute durchgeführt werden soll.",
  info: [
    { label: "Name", wert: "T. Schneider" },
    { label: "Eingriff", wert: "Inzision und Drainage eines dentogenen Abszesses mit anschließender Extraktion des Zahnes 46" },
    { label: "Dauer", wert: "ca. 45–60 Min." },
    { label: "Grund des Eingriffs", wert: "Akuter dentogener Abszess in Regio 46 mit nicht erhaltungswürdigem Zahn" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Inzision der Schwellung; Entleerung des Eiters und Spülung der Abszesshöhle; Lockerung und Extraktion des Zahnes 46; Kürettage und Reinigung der Alveole; Einlage einer Drainage (falls erforderlich); Kontrolle der Blutstillung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Diabetes mellitus Typ 2; chronische Niereninsuffizienz Stadium 3" },
    { label: "Dauermedikation", wert: "Metformin 1000 mg (1–0–1); Amlodipin 5 mg (1–0–0)" },
    { label: "Allergien", wert: "Latex" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Nachblutung, Infektion, Verletzung benachbarter Strukturen",
  spezielleRisiken: [
    "unvollständige Entleerung des Abszesses",
    "erneute Abszessbildung",
    "Fraktur der Zahnwurzel während der Extraktion",
    "verzögerte Wundheilung",
  ],
  prae: ["Blutzucker sollte vor dem Eingriff gut eingestellt sein", "Medikamente wie gewohnt einnehmen"],
  post: [
    "auf den Tupfer ca. 30 Minuten fest aufbeißen",
    "solange die Betäubung wirkt: nicht essen und nichts Heißes trinken",
    "von außen regelmäßig kühlen",
    "für 24 Stunden auf Rauchen, Alkohol und Mundspülungen verzichten",
    "für 2 Tage körperliche Belastung vermeiden",
    "für 2 Tage weiche Kost bevorzugen",
    "bei leichten Schmerzen: Ibuprofen 600 mg; bei stärkeren Schmerzen, Nachblutung oder Fieber: Wiedervorstellung",
    "Kontrolltermin am nächsten Tag",
  ],
  actor: {
    role: "patient",
    name: "Thomas Schneider",
    voice: "Enceladus",
    sprechweise:
      "Mann, 61, Hausmeister aus dem Ruhrgebiet, tiefe, raue Stimme, brummig und wortkarg („Tach“, „nee“, „wat muss, dat muss“). Die Wange ist geschwollen, deshalb nuschelt er; will, dass es schnell vorbei ist, und ist sauer, dass der Zahn raus muss.",
    persona: `61 Jahre, Hausmeister. Direkt und etwas brummig, hat Schmerzen und will, dass es schnell vorbei ist. Er ist enttäuscht, dass der Zahn raus muss. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Seit vier Tagen hat er Schmerzen unten rechts, seit gestern ist die Wange geschwollen.",
      "Er hat Zucker (Metformin morgens und abends) und eine Nierenschwäche, außerdem nimmt er morgens Amlodipin.",
      "Er ist allergisch gegen Latex.",
      "Er raucht etwa zehn Zigaretten am Tag.",
    ],
    followUpQuestions: [
      "Muss der Zahn wirklich raus? Kann man den nicht retten?",
      "Heilt das bei mir wegen dem Zucker schlechter?",
      "Was kommt später in die Lücke?",
    ],
  },
  fachbegriffe: ["Abszess", "Inzision", "Drainage", "Extraktion", "Alveole", "Kürettage", "Niereninsuffizienz", "Fraktur"],
  vocabulary: ["Abszess", "Inzision", "Drainage", "Extraktion", "Alveole", "Kürettage", "Metformin", "Amlodipin", "Niereninsuffizienz", "Latex"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen liegt im Bereich des ersten großen Backenzahns im rechten Unterkiefer eine akute Eiteransammlung vor, die vom Zahn ausgeht.",
        "Leider ist der betroffene Zahn nicht mehr erhaltungswürdig und muss entfernt werden.",
        "Ohne Behandlung kann sich die Entzündung weiter ausbreiten und bis in den Kieferknochen gelangen.",
        "Deshalb empfehlen wir die Behandlung, um den Eiter zu entleeren und die Entzündung zu beseitigen.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Zunächst machen wir einen kleinen Schnitt in die Schwellung, damit der Eiter abfließen kann, und spülen die Eiterhöhle gründlich.",
        "Danach wird der betroffene Zahn gelockert und entfernt.",
        "Im nächsten Schritt wird das Zahnfach gereinigt.",
        "Falls erforderlich, legen wir einen kleinen Streifen ein, damit der restliche Eiter abfließen kann.",
        "Zum Schluss kontrollieren wir sorgfältig die Blutstillung.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Es kann sein, dass der Eiter nicht vollständig entleert wird, oder dass sich erneut ein Abszess bildet.",
        "Während der Entfernung kann die Zahnwurzel brechen.",
        "Aufgrund Ihres Diabetes kann die Wundheilung verzögert sein.",
      ],
    },
    {
      zu: "Verhalten",
      saetze: [
        "Wichtig ist, dass Ihr Blutzucker vor dem Eingriff gut eingestellt ist. Ihre Medikamente können Sie wie gewohnt einnehmen.",
        "Für 24 Stunden sollten Sie auf Rauchen, Alkohol und Mundspülungen verzichten.",
        "Für zwei Tage sind weiche Kost und körperliche Schonung empfohlen.",
        "Ein Kontrolltermin ist für morgen geplant.",
      ],
    },
  ],
});

export const weisheitszaehne3848 = aufklaerungsFall({
  id: "aufklaerung-weisheitszaehne-38-48",
  title: "Weisheitszahnentfernung 38 und 48",
  untertitel: "Dentitio difficilis, Diabetes mellitus Typ 2, Ibuprofen-Allergie",
  anrede: "Herrn/Frau Hoffmann",
  partner: "Frau J. Hoffmann (Patientin)",
  situation: "Aufklärung über einen Eingriff, der demnächst stattfinden soll.",
  info: [
    { label: "Name", wert: "J. Hoffmann" },
    { label: "Eingriff", wert: "Operative Entfernung der Weisheitszähne 38 und 48" },
    { label: "Dauer", wert: "ca. 45–60 Min." },
    { label: "Grund des Eingriffs", wert: "Dentitio difficilis an den Weisheitszähnen 38 und 48" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Schnitt am Zahnfleisch und Bildung eines Schleimhautlappens; Freilegung der Weisheitszähne; ggf. Knochenabtragung und Teilung der Zähne; Entfernung der Weisheitszähne; Reinigung und Spülung der Wunden; Wundverschluss mit Nähten; Kontrolle der Blutstillung",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Diabetes mellitus Typ 2" },
    { label: "Dauermedikation", wert: "Metformin 500 mg (1–0–1)" },
    { label: "Allergien", wert: "Ibuprofen (Hautausschlag)" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Nachblutung, Infektion, allergische Reaktion, Verletzung von Nachbarstrukturen",
  spezielleRisiken: [
    "Verletzung des Unterkiefernervs mit möglichem Taubheitsgefühl an Lippe oder Zunge",
    "eingeschränkte Mundöffnung",
    "Fraktur einer Zahnwurzel",
    "verzögerte Wundheilung",
  ],
  prae: ["Medikamente normal einnehmen; Blutzucker gut eingestellt"],
  post: [
    "auf den Tupfer ca. 30 Minuten fest aufbeißen",
    "solange die Betäubung wirkt: nicht essen, nichts Heißes trinken (Verletzungsgefahr)",
    "von außen regelmäßig kühlen",
    "für 3 Tage Rauchen, Alkohol und körperliche Belastung vermeiden",
    "für 3 Tage weiche Kost",
    "Wundbereich nicht mit Fingern oder Zunge manipulieren",
    "bei leichten Schmerzen: Paracetamol 500 mg; bei stärkeren Schmerzen, Nachblutung oder Fieber: Wiedervorstellung",
    "Kontrolltermin nach ca. 10 Tagen zur Nahtentfernung",
  ],
  actor: {
    role: "patient",
    name: "Julia Hoffmann",
    voice: "Laomedeia",
    sprechweise:
      "Junge Frau, 31, Grafikdesignerin, sehr nervös: redet schnell, atmet hörbar, lacht nervös, stellt Fragen hastig hintereinander; jugendliche Umgangssprache („voll“, „krass“, „echt jetzt?“, „okay, okay“).",
    persona: `31 Jahre, Grafikdesignerin. Sehr nervös vor der Operation, hat im Internet Horrorgeschichten über Weisheitszähne gelesen. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Sie hatte in den letzten Monaten immer wieder Schmerzen und geschwollenes Zahnfleisch hinten unten auf beiden Seiten.",
      "Sie hat Diabetes Typ 2 und nimmt morgens und abends Metformin.",
      "Sie verträgt kein Ibuprofen, sie bekommt davon Hautausschlag.",
    ],
    followUpQuestions: [
      "Kann meine Lippe für immer taub bleiben?",
      "Welches Schmerzmittel darf ich nehmen? Ich vertrage doch kein Ibuprofen.",
      "Wie lange bin ich danach krankgeschrieben?",
    ],
  },
  fachbegriffe: ["Dentitio difficilis", "Weisheitszähne", "Schleimhautlappen", "Knochenabtragung", "Nervus alveolaris inferior", "Fraktur", "Paracetamol"],
  vocabulary: ["Dentitio difficilis", "Weisheitszahn", "Unterkiefernerv", "Taubheitsgefühl", "Metformin", "Paracetamol", "Ibuprofen", "Tupfer", "Nahtentfernung", "Schleimhautlappen"],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen haben die beiden unteren Weisheitszähne nicht genügend Platz im Kiefer, um vollständig durchzubrechen.",
        "Dadurch können immer wieder Beschwerden und Entzündungen entstehen.",
        "Ohne Behandlung können sich die Beschwerden verschlimmern und die Entzündung kann sich ausbreiten.",
        "Deshalb empfehlen wir, die Weisheitszähne operativ zu entfernen.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Die Behandlung dauert etwa 45 bis 60 Minuten und erfolgt unter örtlicher Betäubung.",
        "Zunächst machen wir einen kleinen Schnitt in das Zahnfleisch und klappen ein kleines Stück zur Seite, um die Weisheitszähne freizulegen.",
        "Falls erforderlich, wird etwas Knochen abgetragen und die Zähne werden geteilt, damit sie möglichst schonend entfernt werden können.",
        "Danach werden die Wunden gründlich gereinigt, gespült und mit Nähten verschlossen. Zum Schluss kontrollieren wir die Blutstillung.",
      ],
    },
    {
      zu: "Spezielle Risiken",
      saetze: [
        "Es kann zu einer Verletzung des Unterkiefernervs kommen. Dadurch kann ein Taubheitsgefühl an der Lippe oder Zunge entstehen.",
        "Darüber hinaus kann die Mundöffnung vorübergehend eingeschränkt sein.",
        "Während der Behandlung kann eine Zahnwurzel brechen.",
        "Außerdem kann die Wunde verzögert heilen.",
      ],
    },
    {
      zu: "Verhalten",
      saetze: [
        "Ihr Medikament können Sie wie gewohnt einnehmen. Wichtig ist, dass Ihr Blutzucker gut eingestellt ist.",
        "Nach der Behandlung sollten Sie etwa 30 Minuten fest auf einen Tupfer beißen, um die Blutung zu stillen.",
        "Für die nächsten drei Tage sollten Sie auf Rauchen, Alkohol und körperliche Anstrengung verzichten und weiche Kost bevorzugen.",
        "Bei leichten Schmerzen können Sie Paracetamol 500 mg einnehmen, da Sie gegen Ibuprofen allergisch sind.",
        "Nach ungefähr zehn Tagen ist ein Kontrolltermin geplant, um die Fäden zu entfernen.",
      ],
    },
  ],
});

/** Aufklärungsgespräch aus dem FaMed-Übungstest (Unterlagen „Fälle/Aufklärung“, mögliche Lösung). */
export const wkb16 = aufklaerungsFall({
  id: "aufklaerung-wkb-16",
  title: "Wurzelkanalbehandlung Zahn 16",
  untertitel: "Wie im Übungstest: irreversible Pulpitis, zwei Sitzungen, Diabetes mellitus",
  anrede: "Herrn/Frau Sahin",
  partner: "Frau P. Sahin (Patientin)",
  situation: "Aufklärung über einen Eingriff, der demnächst stattfinden soll",
  info: [
    { label: "Name", wert: "P. Sahin" },
    { label: "Eingriff", wert: "Wurzelkanalbehandlung" },
    { label: "Dauer", wert: "ca. 30–45 Min.; zwei Behandlungssitzungen notwendig" },
    { label: "Grund des Eingriffs", wert: "irreversible Pulpitis Zahn 16" },
    {
      label: "Ablauf",
      wert: "Lokalanästhesie; Kofferdam; Kariesexkavation und Zugangskavität; Wurzelkanäle auffinden und darstellen; Bestimmung der Arbeitslänge; Aufbereiten der Kanäle; kontinuierliche Spülung der Kanäle; medikamentöse Einlage; bakteriendichter provisorischer Verschluss; zwei Röntgenbilder erstellen",
    },
    { label: "Vor-/Begleiterkrankungen", wert: "Diabetes mellitus Typ 2" },
    { label: "Dauermedikation", wert: "Metformin 500 mg (1–0–1)" },
  ],
  allgemeineRisiken: "Schmerzen, Schwellung, Infektion, allergische Reaktion, Verletzung von Nachbarstrukturen",
  spezielleRisiken: [
    "Instrumentenfraktur, Via falsa/Perforation",
    "unauffindbare Wurzelkanäle/nicht aufbereitbar",
    "Überpressen von Spülflüssigkeiten/Füllmaterial",
    "Persistenz oder Wiederauftreten der Beschwerden",
  ],
  la: ["Schmerzen, Schwellung, Infektion", "Verletzung benachbarter Strukturen (UK: N. lingualis)", "allergische Reaktion"],
  prae: ["Medikamente normal einnehmen"],
  post: [
    "solange die Betäubung wirkt: nicht essen, nichts Heißes trinken (Verletzungsgefahr)",
    "vorsichtig kauen, keine harten Speisen auf der behandelten Seite (Frakturgefahr des Zahnes)",
    "bei leichten Aufbissschmerzen in den nächsten Tagen: Ibuprofen 600 mg; bei stärkeren Schmerzen: Wiedervorstellung",
    "Weiterbehandlung in 2 Wochen",
  ],
  actor: {
    role: "patient",
    name: "Pınar Sahin",
    voice: "Achernar",
    sprechweise:
      "Frau Mitte vierzig aus Köln, in Deutschland aufgewachsen, Verkäuferin; leicht rheinische Färbung („ne?“, „jetzt mal ehrlich“). Müde, weil der Zahn sie nachts wachhält; spricht etwas schneller, wenn sie nervös wird, und hält sich manchmal die Wange. Nicht überdeutlich, Alltagstempo.",
    persona: `44 Jahre, Verkäuferin. Hat seit Tagen starke Zahnschmerzen oben rechts und kaum geschlafen. Sie hat Angst, dass der Zahn trotz Behandlung verloren geht, und mag keine Spritzen. ${PATIENT_REGELN_AUFKLAERUNG}`,
    facts: [
      "Seit vier Tagen hat sie starke, pochende Schmerzen oben rechts, vor allem nachts; Kaltes und Warmes tun lange weh.",
      "Sie hat Diabetes Typ 2 und nimmt Metformin 500 mg morgens und abends; Allergien hat sie keine.",
      "Ibuprofen verträgt sie gut.",
    ],
    followUpQuestions: [
      "Warum muss ich zweimal kommen? Kann man das nicht in einem Termin machen?",
      "Was ist dieses Gummituch? Bekomme ich darunter überhaupt Luft?",
      "Kann der Zahn danach trotzdem kaputtgehen?",
      "Muss ich wegen meines Diabetes irgendwas beachten?",
    ],
  },
  fachbegriffe: [
    "irreversible Pulpitis", "Wurzelkanalbehandlung", "Kofferdam", "Kariesexkavation", "Zugangskavität", "Arbeitslänge",
    "medikamentöse Einlage", "Provisorium", "Instrumentenfraktur", "Via falsa", "Perforation",
  ],
  vocabulary: [
    "Pulpitis", "Wurzelkanalbehandlung", "Kofferdam", "Kariesexkavation", "Zugangskavität", "Arbeitslänge", "Spülung",
    "medikamentöse Einlage", "provisorisch", "Instrumentenfraktur", "Via falsa", "Perforation", "Metformin", "Ibuprofen",
    "Nervus lingualis", "Diabetes",
  ],
  beispiele: [
    {
      zu: "Diagnose & Behandlungsgrund",
      saetze: [
        "Bei Ihnen liegt am ersten großen Backenzahn im rechten Oberkiefer eine nicht mehr heilbare Entzündung des Zahnnervs vor.",
        "Das bedeutet, dass sich der Zahnnerv stark entzündet hat und sich nicht mehr erholen kann. Dadurch entstehen starke Schmerzen, und es kann sich Eiter ansammeln.",
        "Ohne Behandlung kann sich die Entzündung weiter ausbreiten und bis in den Kieferknochen gelangen.",
        "Deshalb empfehlen wir eine Wurzelkanalbehandlung, um die Entzündung zu beseitigen und den Zahn möglichst zu erhalten. Dafür brauchen wir zwei Sitzungen von jeweils etwa 30 bis 45 Minuten.",
      ],
    },
    {
      zu: "Ablauf",
      saetze: [
        "Die Behandlung erfolgt unter örtlicher Betäubung, sodass Sie keine Schmerzen spüren.",
        "Zunächst wird der Zahn mit einem Gummituch isoliert, damit er vor Speichel geschützt ist. Danach wird die Karies entfernt und ein Zugang ins Innere des Zahnes geschaffen.",
        "Anschließend suchen wir die Wurzelkanäle, bestimmen ihre genaue Länge und bereiten sie gründlich auf. Dabei werden die Kanäle immer wieder gespült, um Bakterien und Gewebereste zu entfernen.",
        "Danach legen wir ein Medikament in die Kanäle ein, und zum Schluss wird der Zahn mit einer vorläufigen Füllung dicht verschlossen. Zur Kontrolle machen wir zwei Röntgenbilder.",
      ],
    },
    {
      zu: "Risiken",
      saetze: [
        "Wie bei jeder zahnärztlichen Behandlung kann es zu Schmerzen, Schwellungen, Infektionen oder allergischen Reaktionen kommen; selten werden benachbarte Strukturen verletzt.",
        "Speziell bei der Wurzelkanalbehandlung kann in seltenen Fällen ein feines Instrument im Kanal abbrechen, oder die Kanalwand kann verletzt werden.",
        "Manchmal sind Wurzelkanäle nicht auffindbar oder können nicht vollständig aufbereitet werden. Außerdem kann Spülflüssigkeit oder Füllmaterial über die Wurzelspitze hinaus gelangen.",
        "Trotz der Behandlung können die Beschwerden bestehen bleiben oder wieder auftreten. Diese Risiken sind aber selten.",
      ],
    },
    {
      zu: "Vor und nach der Behandlung",
      saetze: [
        "Sie leiden an einer Zuckerkrankheit und nehmen Metformin 500 mg zweimal täglich ein. Ihre Medikamente können Sie vor der Behandlung wie gewohnt einnehmen.",
        "Solange die Betäubung wirkt, sollten Sie nichts essen und nichts Heißes trinken, damit Sie sich nicht verletzen.",
        "Bitte kauen Sie vorsichtig und essen Sie keine harten Speisen auf der behandelten Seite, da der Zahn brechen kann.",
        "Bei leichten Aufbissschmerzen können Sie Ibuprofen 600 mg einnehmen; bei stärkeren Schmerzen melden Sie sich bitte bei uns. Die zweite Sitzung ist in zwei Wochen geplant.",
      ],
    },
  ],
});

export const AUFKLAERUNG_FAELLE = [
  wkb16,
  implantation36,
  parodontitisAit,
  wsr24,
  krone46,
  abszess36,
  abszessExtraktion46,
  weisheitszaehne3848,
];
