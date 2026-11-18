import type { CaseInput } from "@/lib/cases/schema";

/** Eigener Übungsfall: Alveolitis sicca nach Extraktion 38 (zahnärztlicher Notdienst). */
export const alveolitis38: CaseInput = {
  id: "arztbrief-alveolitis-38",
  version: 1,
  stationType: "arztbrief",
  title: "Notdienst: Schmerzen nach Zahnentfernung",
  untertitel: "Arztbrief zu einem Anamnesegespräch im zahnärztlichen Notdienst",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung:
      "Sie hören ein Anamnesegespräch. Schreiben Sie danach einen Arztbrief. Sie können das Gespräch pausieren sowie vor- und zurückspulen. Sie haben für die gesamte Situation maximal 22 Minuten Zeit.",
    gespraechssituation:
      "Sie arbeiten im zahnärztlichen Notdienst und haben einen Patienten behandelt. Schreiben Sie einen Arztbrief in ganzen Sätzen und nach fachsprachlichen Standards. Achten Sie darauf, Patientenaussagen mit einer angemessenen Distanz wiederzugeben, zum Beispiel mithilfe des Konjunktivs.",
    gespraechspartner: "Herr/Frau Haddad",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name des Patienten/der Patientin", wert: "Herr/Frau Haddad" }] },
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: ["Alveole 38: leer, ohne Blutkoagel, freiliegender Alveolarknochen", "Gingiva regio 38 gerötet", "Foetor ex ore"],
          },
          { label: "Röntgenaufnahme (Einzelzahnaufnahme)", wert: ["keine Wurzelreste regio 38", "keine Fremdkörper"] },
          {
            label: "Therapie",
            wert: [
              "Spülung der Alveole mit Kochsalzlösung",
              "Einlage einer Alveolitis-Tamponade",
              "Analgesie: Paracetamol 1000 mg bei Bedarf (max. 3× täglich)",
            ],
          },
          { label: "Procedere", wert: "Kontrolle und Wechsel der Tamponade in 2 Tagen beim Hauszahnarzt empfohlen" },
        ],
      },
    ],
    aufgabentext: {
      einleitung: "Hören Sie das Anamnesegespräch an und verschriftlichen Sie alle Informationen. Dazu zählen:",
      punkte: [
        { text: "Name, Alter" },
        { text: "aktuelle Beschwerden" },
        { text: "Vorerkrankungen und Medikamente" },
        { text: "Allergien" },
        { text: "Nikotin- und Alkoholkonsum" },
      ],
      schluss: "Berichten Sie außerdem von den Maßnahmen, die Sie durchgeführt haben (Untersuchung, Therapie, Procedere).",
    },
  },
  rubric: {
    checklist: [
      { id: "form", label: "Briefform: Anrede/Betreff und Abschluss, ganze Sätze", weight: 1 },
      { id: "daten", label: "Name und Alter (Rami Haddad, 41 Jahre)", weight: 1 },
      { id: "anlass", label: "Vorstellungsgrund und Extraktion 38 vor 4 Tagen", weight: 1 },
      { id: "schmerz", label: "Schmerzbeginn am 2./3. Tag, pochend, Ausstrahlung ins Ohr, nachts stärker", weight: 2 },
      { id: "begleit", label: "schlechter Geschmack, Mundgeruch; kein Fieber, keine Schwellung", weight: 1 },
      { id: "analgetika", label: "bisherige Schmerzmittel (Paracetamol 500 mg, ohne ausreichende Wirkung)", weight: 1 },
      { id: "vorerkrankungen", label: "Asthma bronchiale und Bluthochdruck", weight: 1 },
      { id: "medikation", label: "Salbutamol bei Bedarf, Budesonid/Formoterol 1–0–1, Bisoprolol 5 mg 1–0–0", weight: 2 },
      { id: "allergie", label: "Allergie gegen Acetylsalicylsäure (Atemnot)", weight: 2 },
      { id: "noxen", label: "Rauchen (ca. 15 Zigaretten/Tag, nach der OP weitergeraucht), Alkohol gelegentlich", weight: 1 },
      { id: "befunde", label: "Befunde vollständig und fachsprachlich (extra-/intraoral, Röntgen)", weight: 2 },
      { id: "therapie", label: "Therapie und Procedere vollständig", weight: 2 },
      { id: "konjunktiv", label: "Patientenaussagen im Konjunktiv I bzw. mit Distanz wiedergegeben", weight: 2 },
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-alveolitis-38.mp3",
    sprecher: { Zahnarzt: "Sulafat", Patient: "Algieba" },
    sprechweise: {
      Zahnarzt: "Zahnärztin im Notdienst am Abend, ruhig und freundlich, etwas müde, zügig und routiniert, nicht übertrieben deutlich",
      Patient:
        "Mann Anfang vierzig mit starken Schmerzen nach Zahnentfernung, übermüdet und gequält, spricht mit wenig Mundöffnung, dadurch etwas undeutlich und gepresst; Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Abend, ich bin die diensthabende Zahnärztin. Bitte nehmen Sie Platz. Wie ist Ihr Name?" },
      { sprecher: "Patient", text: "Guten Abend. Rami Haddad." },
      { sprecher: "Zahnarzt", text: "Und wie alt sind Sie, Herr Haddad?" },
      { sprecher: "Patient", text: "Einundvierzig." },
      { sprecher: "Zahnarzt", text: "Was führt Sie heute zu uns in den Notdienst?" },
      { sprecher: "Patient", text: "Mir wurde vor vier Tagen unten links der Weisheitszahn gezogen. Die ersten zwei Tage ging es eigentlich, aber seit vorgestern habe ich wahnsinnige Schmerzen." },
      { sprecher: "Zahnarzt", text: "Wie würden Sie die Schmerzen beschreiben?" },
      { sprecher: "Patient", text: "Pochend. Es zieht bis ins linke Ohr. Und nachts ist es am schlimmsten, ich habe kaum geschlafen." },
      { sprecher: "Zahnarzt", text: "Haben Sie sonst noch etwas bemerkt?" },
      { sprecher: "Patient", text: "Ja, ich habe so einen ekligen Geschmack im Mund. Und meine Frau sagt, ich hätte Mundgeruch." },
      { sprecher: "Zahnarzt", text: "Hatten Sie Fieber, oder ist Ihnen eine Schwellung aufgefallen?" },
      { sprecher: "Patient", text: "Nein, Fieber nicht. Und geschwollen ist eigentlich nichts." },
      { sprecher: "Zahnarzt", text: "Haben Sie schon etwas gegen die Schmerzen eingenommen?" },
      { sprecher: "Patient", text: "Paracetamol, fünfhundert Milligramm, dreimal am Tag. Das hilft aber kaum." },
      { sprecher: "Zahnarzt", text: "Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Ich habe Asthma. Und seit zwei Jahren Bluthochdruck." },
      { sprecher: "Zahnarzt", text: "Welche Medikamente nehmen Sie regelmäßig ein?" },
      { sprecher: "Patient", text: "Für das Asthma ein Spray mit Budesonid und Formoterol, morgens und abends. Bei Bedarf noch Salbutamol. Und gegen den Blutdruck Bisoprolol, fünf Milligramm morgens." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien oder Unverträglichkeiten?" },
      { sprecher: "Patient", text: "Ja, Aspirin. Davon bekomme ich Atemnot." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie, oder trinken Sie Alkohol?" },
      { sprecher: "Patient", text: "Ich rauche, so fünfzehn Zigaretten am Tag. Ehrlich gesagt habe ich nach der OP auch gleich wieder geraucht. Alkohol nur ab und zu am Wochenende." },
      { sprecher: "Zahnarzt", text: "Vielen Dank. Ich schaue mir das jetzt an und mache eine Röntgenaufnahme. Danach besprechen wir die Behandlung." },
      { sprecher: "Patient", text: "Okay, danke." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Rami Haddad, 41 Jahre alt, der sich aufgrund starker Schmerzen nach der Extraktion des Zahns 38 in unserem zahnärztlichen Notdienst vorstellte.

Der Patient berichtete, dass ihm vor vier Tagen der Zahn 38 extrahiert worden sei. Die ersten zwei Tage seien weitgehend beschwerdefrei gewesen; seit zwei Tagen leide er jedoch unter starken, pochenden Schmerzen, die bis ins linke Ohr ausstrahlten und nachts am stärksten seien. Darüber hinaus gab er einen unangenehmen Geschmack sowie Mundgeruch an. Fieber oder eine Schwellung habe er nicht bemerkt. Die Einnahme von Paracetamol 500 mg dreimal täglich habe kaum Wirkung gezeigt.

Vorerkrankungen:
Der Patient leide unter Asthma bronchiale, das mit einem Kombinationspräparat aus Budesonid und Formoterol (1-0-1) sowie bei Bedarf mit Salbutamol behandelt werde. Zudem bestehe seit zwei Jahren eine arterielle Hypertonie, die medikamentös mit Bisoprolol 5 mg (1-0-0) behandelt werde. Es bestehe eine Allergie gegen Acetylsalicylsäure, die sich durch Atemnot äußere. Der Patient rauche ca. 15 Zigaretten täglich und habe auch nach der Extraktion weitergeraucht; Alkohol konsumiere er gelegentlich am Wochenende.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigte sich eine leere Alveole 38 ohne Blutkoagel mit freiliegendem Alveolarknochen sowie eine gerötete Gingiva regio 38. Zudem fiel ein Foetor ex ore auf.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigten sich regio 38 weder Wurzelreste noch Fremdkörper.

Therapie:
Unter dem Verdacht einer Alveolitis sicca wurde die Alveole mit Kochsalzlösung gespült und anschließend eine Alveolitis-Tamponade eingelegt. Zur Analgesie wurde Paracetamol 1000 mg bei Bedarf, maximal dreimal täglich, empfohlen.

Procedere:
Eine Kontrolle mit Wechsel der Tamponade ist in zwei Tagen in Ihrer Praxis empfohlen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fälle nach den FaMed-Arztbriefvideos (Fakten aus den Videos, Dialoge und Musterbriefe eigenständig formuliert)
// ---------------------------------------------------------------------------

const PRAXIS_SITUATION =
  "Sie arbeiten in einer Zahnarztpraxis und haben eine Patientin behandelt. Schreiben Sie einen Arztbrief an die weiterbehandelnden Kolleginnen und Kollegen in ganzen Sätzen und nach fachsprachlichen Standards. Achten Sie darauf, Patientenaussagen mit einer angemessenen Distanz wiederzugeben, zum Beispiel mithilfe des Konjunktivs.";

const KURZ =
  "Sie hören ein Anamnesegespräch. Schreiben Sie danach einen Arztbrief. Sie können das Gespräch pausieren sowie vor- und zurückspulen. Sie haben für die gesamte Situation maximal 22 Minuten Zeit.";

const AUFGABE_PRAXIS = {
  einleitung: "Hören Sie das Anamnesegespräch an und verschriftlichen Sie alle Informationen. Dazu zählen:",
  punkte: [
    { text: "Name, Alter" },
    { text: "aktuelle Beschwerden und bisherige Maßnahmen" },
    { text: "zahnärztliche Vorgeschichte" },
    { text: "Vorerkrankungen und Medikamente" },
    { text: "Allergien" },
    { text: "Nikotin- und Alkoholkonsum" },
  ],
  schluss:
    "Berichten Sie außerdem von den Maßnahmen, die Sie durchgeführt haben (Untersuchung, Therapie, Procedere). Formulieren Sie die Stichpunkte in ganzen Sätzen aus.",
};

/** Frau Dr. Bachmann – dieselbe Zahnärztin in allen drei Videofällen. */
const BACHMANN = {
  stimme: "Callirrhoe",
  sprechweise:
    "Zahnärztin Mitte dreißig, freundlich, ruhig und routiniert, normales Praxis-Alltagstempo, sagt ab und zu „ähm“ oder „mhm“, spricht nicht übertrieben deutlich",
};

/** Arztbriefvideo 1: Frau Kassis, Zahn 37 (zugehöriger FaMed-Musterbrief als Vorlage für den Aufbau). */
export const kassis37: CaseInput = {
  id: "arztbrief-kassis-37",
  version: 1,
  stationType: "arztbrief",
  title: "Pochende Schmerzen im linken Unterkiefer",
  untertitel: "Arztbrief zu einem Anamnesegespräch in der Zahnarztpraxis (Frau Kassis)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: PRAXIS_SITUATION,
    gespraechspartner: "Frau Kassis",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name der Patientin", wert: "Frau Kassis" }] },
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "unauffällige Schleimhautverhältnisse",
              "Zahn 37 stark kariös zerstört",
              "Vitalitätsprobe 37: negativ",
              "Perkussionsprüfung 37: leicht positiv",
            ],
          },
          {
            label: "Röntgenbefund (Einzelzahnaufnahme)",
            wert: ["Zahn 37: deutliche koronale Radioluzenz bis an die Pulpa", "leicht verbreiterter Parodontalspalt"],
          },
          {
            label: "Therapie",
            wert: [
              "Kariesexkavation",
              "Schaffung eines endodontischen Zugangs",
              "initiale Aufbereitung der Wurzelkanäle bis ISO 15",
              "medikamentöse Einlage (Ledermix)",
              "provisorischer Verschluss (Cavit)",
            ],
          },
          { label: "Procedere", wert: "Kontrolle und Fortführung der endodontischen Behandlung 37 in einer Woche" },
        ],
      },
    ],
    aufgabentext: AUFGABE_PRAXIS,
  },
  rubric: {
    checklist: [
      { id: "form", label: "Briefform: Anrede, Einleitungssatz, Grußformel; ganze Sätze statt Stichpunkte", weight: 1 },
      { id: "daten", label: "Name und Alter (Frau Kassis, 40 Jahre)", weight: 1 },
      { id: "anlass", label: "Vorstellungsgrund: seit einigen Tagen Schmerzen im linken Unterkiefer (Backenzahnbereich)", weight: 1 },
      { id: "verlauf", label: "Beginn leicht, seit gestern Nachmittag deutlich progredient", weight: 1 },
      { id: "charakter", label: "pochend, nicht eindeutig lokalisierbar (letzter/vorletzter Backenzahn), Verstärkung durch Wärme", weight: 2 },
      { id: "analgetika", label: "Ibuprofen 600 mg in der Nacht, kaum Wirkung", weight: 1 },
      { id: "vorgeschichte", label: "letzte Kontrolle vor einem halben Jahr unauffällig, keine Behandlung seither", weight: 1 },
      { id: "vorerkrankung", label: "arterielle Hypertonie mit Ramipril 2,5 mg (1-0-0)", weight: 2 },
      { id: "allergie", label: "keine Allergien bekannt", weight: 1 },
      { id: "noxen", label: "Nichtraucherin, täglich ein Bier", weight: 1 },
      { id: "befunde", label: "Befunde vollständig: extra-/intraoral, Vitalität negativ, Perkussion leicht positiv, Röntgen", weight: 2 },
      { id: "therapie", label: "Therapie vollständig: Exkavation, Zugang, Aufbereitung bis ISO 15, Ledermix, Cavit", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle und Fortführung der Wurzelkanalbehandlung in einer Woche", weight: 1 },
      { id: "konjunktiv", label: "Patientenaussagen im Konjunktiv I, eigene Befunde/Therapie im Indikativ (Passiv)", weight: 2 },
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-kassis-37.mp3",
    sprecher: { Zahnarzt: BACHMANN.stimme, Patient: "Despina" },
    sprechweise: {
      Zahnarzt: BACHMANN.sprechweise,
      Patient:
        "Frau, 40, hat seit Tagen Zahnschmerzen und kaum geschlafen; müde und angespannt, spricht leicht verwaschen und eher leise, weil der Kiefer wehtut; Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Frau Kassis. Kommen Sie, setzen Sie sich. Was führt Sie zu mir?" },
      { sprecher: "Patient", text: "Hallo. Ähm … ja, ich hab seit ein paar Tagen so Schmerzen. Hier unten links, am Backenzahn.", stil: "hält die Hand an die Wange, etwas genuschelt" },
      { sprecher: "Zahnarzt", text: "Okay. Kam das plötzlich, oder eher so nach und nach?" },
      { sprecher: "Patient", text: "Eher nach und nach. Erst war's nur so 'n bisschen … [seufzt] aber seit gestern Nachmittag, da ist es echt richtig schlimm geworden." },
      { sprecher: "Zahnarzt", text: "Mhm. Wie fühlt sich der Schmerz denn an?" },
      { sprecher: "Patient", text: "Pochend. So richtig … pochend. Und ich kann gar nicht sagen, welcher Zahn das genau ist. Der letzte, oder vielleicht auch der vorletzte. Irgendwo da hinten.", stil: "zögert, sucht nach Worten" },
      { sprecher: "Zahnarzt", text: "Wird es schlimmer bei Kälte oder eher bei Wärme?" },
      { sprecher: "Patient", text: "Bei Wärme. Heute früh wollt ich 'n Kaffee trinken, und – boah, nee. Da war's noch schlimmer.", stil: "verzieht beim Erzählen das Gesicht, schneller" },
      { sprecher: "Zahnarzt", text: "Haben Sie schon was gegen die Schmerzen eingenommen?" },
      { sprecher: "Patient", text: "Ja, heute Nacht bin ich aufgestanden, ich konnt einfach nicht mehr schlafen, und hab 'ne Ibuprofen genommen. So 'ne normale, sechshundert. Hat aber … na ja. Nicht so richtig geholfen.", stil: "müde, leiser werdend am Satzende" },
      { sprecher: "Zahnarzt", text: "Verstehe. Hatten Sie in letzter Zeit eine Behandlung beim Zahnarzt?" },
      { sprecher: "Patient", text: "Nee. Ich war vor 'nem halben Jahr zur Kontrolle, und da war alles gut. Da war nix." },
      { sprecher: "Zahnarzt", text: "Gut. Dann hab ich noch ein paar allgemeine Fragen. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Ähm … Bluthochdruck. Sonst eigentlich nichts." },
      { sprecher: "Zahnarzt", text: "Nehmen Sie dafür regelmäßig Medikamente?" },
      { sprecher: "Patient", text: "Ja, morgens Ramipril. Zwei Komma fünf Milligramm." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Nee, nicht dass ich wüsste." },
      { sprecher: "Zahnarzt", text: "Und wie alt sind Sie, Frau Kassis?" },
      { sprecher: "Patient", text: "Vierzig." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Nee, nie angefangen. [lacht kurz] Meine Eltern sind da total streng, die hassen Zigaretten." },
      { sprecher: "Zahnarzt", text: "Das ist gut. Und Alkohol?" },
      { sprecher: "Patient", text: "Hm, ja … mein Feierabendbier halt. Eins am Tag, eigentlich jeden Tag.", stil: "etwas verlegen, beiläufig" },
      { sprecher: "Zahnarzt", text: "Okay. Gibt es sonst noch etwas, das Sie mir sagen möchten?" },
      { sprecher: "Patient", text: "Nö, ich glaub nicht. Hauptsache, das hört endlich auf." },
      { sprecher: "Zahnarzt", text: "Das verstehe ich. Dann schaue ich mir das jetzt mal genauer an." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unsere gemeinsame Patientin Frau Kassis, 40 Jahre alt, die sich aufgrund starker Schmerzen im linken Unterkiefer in unserer Praxis vorstellte.

Die Patientin gab an, seit einigen Tagen unter zunächst leichten Schmerzen im Seitenzahnbereich des linken Unterkiefers zu leiden, die seit gestern Nachmittag deutlich progredient seien. Die Schmerzen seien pochend und nicht eindeutig einem Zahn zuzuordnen; betroffen sei vermutlich der letzte oder vorletzte Molar. Wärme verstärke die Beschwerden. Die nächtliche Einnahme von Ibuprofen 600 mg habe keine ausreichende Linderung gebracht. Bei der letzten Kontrolluntersuchung vor einem halben Jahr sei der Befund unauffällig gewesen; seitdem sei keine zahnärztliche Behandlung erfolgt.

Vorerkrankungen:
Es bestehe eine arterielle Hypertonie, die mit Ramipril 2,5 mg (1-0-0) behandelt werde. Allergien seien nicht bekannt. Die Patientin sei Nichtraucherin und konsumiere täglich ein Bier.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigten sich unauffällige Schleimhautverhältnisse sowie ein stark kariös zerstörter Zahn 37. Die Vitalitätsprobe an Zahn 37 fiel negativ aus, die Perkussionsprüfung war leicht positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich an Zahn 37 eine deutliche koronale Radioluzenz, die bis an die Pulpa reichte. Darüber hinaus war der Parodontalspalt leicht verbreitert.

Therapie:
Nach der Kariesexkavation wurde ein endodontischer Zugang geschaffen. Anschließend erfolgte die initiale Aufbereitung der Wurzelkanäle bis ISO 15. Abschließend wurde eine medikamentöse Einlage mit Ledermix eingebracht und der Zahn provisorisch mit Cavit verschlossen.

Procedere:
Eine Kontrolle sowie die Fortführung der endodontischen Behandlung des Zahns 37 sind in einer Woche geplant.

Mit freundlichen kollegialen Grüßen`,
  },
};

const SIEBLER_SPRECHWEISE =
  "Frau Anfang sechzig aus Norddeutschland, gesprächig und direkt, Umgangssprache mit norddeutscher Färbung (Moin, nee, olle), redet zügig, verschluckt Endungen und nuschelt etwas; man hört, dass sie Schmerzen hat";

/** Lernvideo mit Umgangssprache 2: Frau Siebler, neue Oberkieferprothese. */
export const sieblerOk: CaseInput = {
  id: "arztbrief-siebler-oberkiefer",
  version: 1,
  stationType: "arztbrief",
  title: "Schmerzen unter der neuen Oberkieferprothese",
  untertitel: "Arztbrief zu einem Anamnesegespräch mit viel Umgangssprache (Frau Siebler)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: PRAXIS_SITUATION,
    gespraechspartner: "Frau Siebler",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name der Patientin", wert: "Frau Siebler" }] },
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Oberkieferprothese, vor 3 Tagen eingegliedert",
              "Druckstelle palatinal rechts am dorsalen Prothesenrand (regio 17), ca. 5 mm, gerötet und ödematös geschwollen",
              "übrige Mundschleimhaut unauffällig",
            ],
          },
          {
            label: "Therapie",
            wert: [
              "Lokalisation der Druckstelle mit Druckstellenpaste",
              "Beschleifen und Politur der Prothesenbasis im Bereich der Druckstelle",
              "Spülung mit Chlorhexidin-Lösung 0,12 % zweimal täglich empfohlen",
            ],
          },
          {
            label: "Procedere",
            wert: ["Prothese nachts herausnehmen und reinigen", "Kontrolle in 3 Tagen"],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE_PRAXIS,
  },
  rubric: {
    checklist: [
      { id: "form", label: "Briefform: Anrede, Einleitungssatz, Grußformel; ganze Sätze statt Stichpunkte", weight: 1 },
      { id: "daten", label: "Name und Alter (Frau Siebler, 62 Jahre)", weight: 1 },
      { id: "anlass", label: "neue Oberkieferprothese vor 3 Tagen, seit 2 Tagen Schmerzen", weight: 2 },
      { id: "lokalisation", label: "Lokalisation: Gaumen, hinten rechts im Oberkiefer", weight: 1 },
      { id: "charakter", label: "brennend; beim Tragen dauerhaft, verstärkt beim Essen und Sprechen, Besserung ohne Prothese", weight: 2 },
      { id: "schwellung", label: "vermutete Schwellung der Schleimhaut", weight: 1 },
      { id: "selbst", label: "Selbstbehandlung mit Kamistad-Gel aus der Apotheke", weight: 1 },
      { id: "vorgeschichte", label: "letzter Zahnarztbesuch vor 3 Tagen (Eingliederung der Prothese)", weight: 1 },
      { id: "vorerkrankung", label: "Morbus Parkinson mit Madopar 100 dreimal täglich (1-1-1)", weight: 2 },
      { id: "allergie", label: "keine Allergien", weight: 1 },
      { id: "noxen", label: "3–4 Zigaretten täglich, Alkohol selten (gelegentlich ein Schnaps)", weight: 1 },
      { id: "befunde", label: "Befunde vollständig: extraoral, Druckstelle palatinal regio 17 mit Beschreibung", weight: 2 },
      { id: "therapie", label: "Therapie und Procedere vollständig (Druckstellenpaste, Beschleifen, CHX, Kontrolle in 3 Tagen)", weight: 2 },
      { id: "fachsprache", label: "Umgangssprache in Fachsprache übertragen (z. B. „olle Prothese“, „fiese Schmerzen“ nicht übernommen)", weight: 1 },
      { id: "konjunktiv", label: "Patientenaussagen im Konjunktiv I, eigene Befunde/Therapie im Indikativ (Passiv)", weight: 2 },
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-siebler-oberkiefer.mp3",
    sprecher: { Zahnarzt: BACHMANN.stimme, Patient: "Gacrux" },
    sprechweise: {
      Zahnarzt: BACHMANN.sprechweise,
      Patient: `${SIEBLER_SPRECHWEISE}; trägt die drückende Oberkieferprothese und spricht dadurch etwas undeutlich, leicht lispelnd`,
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Frau Siebler. Wie kann ich Ihnen helfen?" },
      { sprecher: "Patient", text: "Moin. Ja, also, wissen Sie … ich hab ja vor drei Tagen die neue Prothese gekriegt. Oben. Und seit zwei Tagen hab ich so richtig fiese Schmerzen.", stil: "legt gleich los, schnell" },
      { sprecher: "Zahnarzt", text: "Oh, das tut mir leid. Wo genau tut es denn weh?" },
      { sprecher: "Patient", text: "Hier, am Gaumen. Also so hinten … hinten oben rechts. Da.", stil: "zeigt in den Mund, Finger am Gaumen, dadurch undeutlich" },
      { sprecher: "Zahnarzt", text: "Haben Sie die Schmerzen die ganze Zeit?" },
      { sprecher: "Patient", text: "Na ja, wenn ich das olle Ding drin hab, eigentlich die ganze Zeit. Aber beim Essen, oder wenn ich viel rede, dann wird's richtig schlimm. Und wenn ich se rausnehm, dann geht's gleich viel besser." },
      { sprecher: "Zahnarzt", text: "Mhm. Wie würden Sie den Schmerz beschreiben?" },
      { sprecher: "Patient", text: "Brennend. So 'n richtig fieses Brennen." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen sonst noch etwas aufgefallen?" },
      { sprecher: "Patient", text: "Ich glaub, die Schleimhaut ist da 'n bisschen dick geworden. Geschwollen, mein ich. Also, fühlt sich so an, ne? Ich hab ja keinen Spiegel, wo ich da reingucken kann." },
      { sprecher: "Zahnarzt", text: "Haben Sie schon etwas gegen die Schmerzen gemacht?" },
      { sprecher: "Patient", text: "Ja, ich war ganz verzweifelt, und dann sind wir, also mein Bernd und ich, in die Apotheke. Und da hab ich so 'n … Gott, wie hieß das noch … Kra… Ka… Kamistad! Genau. Das hab ich mir dann gleich draufgeschmiert.", stil: "sucht das Wort, stockt, dann erleichtert" },
      { sprecher: "Zahnarzt", text: "Okay. Und Ihr letzter Zahnarztbesuch, das war dann vor drei Tagen, oder?" },
      { sprecher: "Patient", text: "Genau. Als ich die Prothese gekriegt hab." },
      { sprecher: "Zahnarzt", text: "Gut. Dann noch ein paar Routinefragen. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Ja. Parkinson.", stil: "kurz, leiser, ernster" },
      { sprecher: "Zahnarzt", text: "Dann nehmen Sie bestimmt regelmäßig Medikamente, oder?" },
      { sprecher: "Patient", text: "Mhm. Madopar hundert. Dreimal am Tag." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Nee, Allergien hab ich keine." },
      { sprecher: "Zahnarzt", text: "Und wie alt sind Sie?" },
      { sprecher: "Patient", text: "Zweiundsechzig." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "[seufzt] Ja … so drei, vier Zigaretten am Tag, mehr nicht. Ich krieg's einfach nicht weg.", stil: "etwas schuldbewusst" },
      { sprecher: "Zahnarzt", text: "Und, ähm, trinken Sie Alkohol?" },
      { sprecher: "Patient", text: "Ach, nur ganz selten mal 'n Schnäpschen mit meinem Bernd." },
      { sprecher: "Zahnarzt", text: "Gut, dann hab ich alle meine Fragen gestellt. Möchten Sie noch etwas ergänzen?" },
      { sprecher: "Patient", text: "Nee. Helfen Sie mir einfach, dass das aufhört." },
      { sprecher: "Zahnarzt", text: "Dann schaue ich mir das jetzt mal an." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unsere gemeinsame Patientin Frau Siebler, 62 Jahre alt, die sich aufgrund von Schmerzen unter ihrer neuen Oberkieferprothese in unserer Praxis vorstellte.

Die Patientin berichtete, dass ihr vor drei Tagen eine neue Oberkieferprothese eingegliedert worden sei. Seit zwei Tagen leide sie unter starken, brennenden Schmerzen am Gaumen dorsal rechts. Beim Tragen der Prothese bestünden die Schmerzen dauerhaft, beim Essen und Sprechen verstärkten sie sich deutlich; nach dem Herausnehmen der Prothese bessere sich die Symptomatik sofort. Zudem habe sie den Eindruck, dass die Schleimhaut in diesem Bereich geschwollen sei. Zur Schmerzlinderung habe sie ein in der Apotheke gekauftes Gel (Kamistad) lokal aufgetragen. Der letzte Zahnarztbesuch sei vor drei Tagen zur Eingliederung der Prothese erfolgt.

Vorerkrankungen:
Die Patientin leide an Morbus Parkinson, der mit Madopar 100 (1-1-1) behandelt werde. Allergien seien nicht bekannt. Sie rauche drei bis vier Zigaretten täglich und konsumiere selten Alkohol.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigte sich palatinal rechts am dorsalen Rand der Oberkieferprothese (regio 17) eine ca. 5 mm große, gerötete und ödematös geschwollene Druckstelle. Die übrige Mundschleimhaut war unauffällig.

Therapie:
Die Druckstelle wurde mit Druckstellenpaste lokalisiert. Anschließend wurde die Prothesenbasis in diesem Bereich beschliffen und poliert. Zusätzlich wurde eine Spülung mit Chlorhexidin-Lösung 0,12 % zweimal täglich empfohlen.

Procedere:
Die Patientin wurde angewiesen, die Prothese nachts herauszunehmen und zu reinigen. Eine Kontrolle ist in drei Tagen geplant.

Mit freundlichen kollegialen Grüßen`,
  },
};

/** Lernvideo mit Umgangssprache 1: Frau Siebler, neue Unterkieferprothese. */
export const sieblerUk: CaseInput = {
  id: "arztbrief-siebler-unterkiefer",
  version: 1,
  stationType: "arztbrief",
  title: "Schmerzen unter der neuen Unterkieferprothese",
  untertitel: "Arztbrief zu einem Anamnesegespräch mit viel Umgangssprache (Frau Siebler)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: PRAXIS_SITUATION,
    gespraechspartner: "Frau Siebler",
    abschnitte: [
      { titel: "Patienteninformationen", eintraege: [{ label: "Name der Patientin", wert: "Frau Siebler" }] },
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: ["unauffällig", "Lymphknoten nicht tastbar"] },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Unterkieferprothese, vor einer Woche eingegliedert; lingualer Prothesenrand links überextendiert",
              "Druckulkus am lingualen Prothesenrand regio 36/37 (Mundboden links), ca. 6 mm, fibrinbelegt, Umgebung gerötet und geschwollen",
            ],
          },
          {
            label: "Therapie",
            wert: [
              "Kürzen und Glätten des lingualen Prothesenrandes regio 36/37",
              "Politur der Prothese",
              "Spülung mit Chlorhexidin-Lösung 0,12 % zweimal täglich für eine Woche empfohlen",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "Prothese bis zur Kontrolle nur stundenweise tragen",
              "Kontrolle in einer Woche",
              "bei fehlender Abheilung innerhalb von zwei Wochen Überweisung zur histologischen Abklärung",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE_PRAXIS,
  },
  rubric: {
    checklist: [
      { id: "form", label: "Briefform: Anrede, Einleitungssatz, Grußformel; ganze Sätze statt Stichpunkte", weight: 1 },
      { id: "daten", label: "Name und Alter (Frau Siebler, 64 Jahre)", weight: 1 },
      { id: "anlass", label: "neue Unterkieferprothese vor einer Woche, seit 4 Tagen Schmerzen", weight: 2 },
      { id: "lokalisation", label: "Lokalisation: unter der Zunge, hinten links (sublingual/Mundboden links)", weight: 1 },
      { id: "charakter", label: "brennend und drückend; beim Tragen dauerhaft, Essen nicht möglich; Prothese seit einigen Tagen nicht getragen", weight: 2 },
      { id: "schwellung", label: "vermutete Schwellung der Schleimhaut", weight: 1 },
      { id: "selbst", label: "mehrmals täglich Mundspülung mit Kamillentee (Tipp der Nachbarin/Internet)", weight: 1 },
      { id: "vorgeschichte", label: "letzter Zahnarztbesuch vor einer Woche (Eingliederung der Prothese)", weight: 1 },
      { id: "vorerkrankung", label: "Z. n. Schilddrüsentumor vor einigen Jahren; L-Thyroxin 175 µg morgens (1-0-0)", weight: 2 },
      { id: "allergie", label: "Haselnussallergie", weight: 2 },
      { id: "noxen", label: "kein Nikotin, kein Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde vollständig: extraoral inkl. Lymphknoten, Druckulkus regio 36/37 mit Beschreibung, überextendierter Rand", weight: 2 },
      { id: "therapie", label: "Therapie und Procedere vollständig (Randkorrektur, Politur, CHX, Tragepause, Kontrolle, ggf. Histologie)", weight: 2 },
      { id: "fachsprache", label: "Umgangssprache in Fachsprache übertragen (z. B. „brennt wie Feuer“, „olles Ding“ nicht übernommen)", weight: 1 },
      { id: "konjunktiv", label: "Patientenaussagen im Konjunktiv I, eigene Befunde/Therapie im Indikativ (Passiv)", weight: 2 },
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-siebler-unterkiefer.mp3",
    sprecher: { Zahnarzt: BACHMANN.stimme, Patient: "Gacrux" },
    sprechweise: { Zahnarzt: BACHMANN.sprechweise, Patient: `${SIEBLER_SPRECHWEISE}; etwas genervt von der neuen Prothese` },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Frau Siebler. Was kann ich für Sie tun?" },
      { sprecher: "Patient", text: "Moin. Ach, wissen Sie, ich hab vor 'ner Woche die neue Prothese gekriegt, unten. Und seit vier Tagen … [seufzt] richtig, richtig fiese Schmerzen.", stil: "genervt, schnell" },
      { sprecher: "Zahnarzt", text: "Oh, okay. Können Sie mir zeigen, wo genau?" },
      { sprecher: "Patient", text: "Hier, unter der Zunge. Also so … hinten links. Da.", stil: "Zunge angehoben, dadurch undeutlich" },
      { sprecher: "Zahnarzt", text: "Haben Sie die Schmerzen dauerhaft?" },
      { sprecher: "Patient", text: "Wenn ich die Prothese drin hab, ja, immer. Und Essen, da brauch ich gar nicht dran denken, das geht überhaupt nicht. Deswegen hab ich das gute Stück die letzten Tage auch gar nicht mehr reingemacht.", stil: "ironisch bei „das gute Stück“" },
      { sprecher: "Zahnarzt", text: "Mhm, verstehe. Ähm, wie fühlt sich der Schmerz an?" },
      { sprecher: "Patient", text: "Das brennt. Wie Feuer. Und drücken tut's auch." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen sonst noch etwas aufgefallen?" },
      { sprecher: "Patient", text: "Ich glaub, das ist da 'n bisschen geschwollen. Die Schleimhaut, mein ich." },
      { sprecher: "Zahnarzt", text: "Haben Sie schon etwas gegen die Schmerzen gemacht?" },
      { sprecher: "Patient", text: "Also, die Neele, das ist meine Nachbarin von gegenüber, die meinte, ich soll mal googeln. Hab ich dann gemacht. Und da stand, Kamillentee hilft. Damit hab ich dann mehrmals am Tag gespült. Aber ich dachte, lass mal lieber 'n Profi drauf gucken.", stil: "plaudernd, schnell, Nebensätze verschluckt" },
      { sprecher: "Zahnarzt", text: "Gut, dass Sie gekommen sind. Ihr letzter Zahnarztbesuch war dann vor einer Woche, oder?" },
      { sprecher: "Patient", text: "Ja, genau. Als ich das olle neue Ding gekriegt hab." },
      { sprecher: "Zahnarzt", text: "Dann noch ein paar Fragen, bevor ich Sie untersuche. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Ja … wissen Sie, vor ein paar Jahren hatte ich so 'n Tumor. Hier, an der Schilddrüse.", stil: "ruhiger, leiser" },
      { sprecher: "Zahnarzt", text: "Oh, das tut mir leid. Nehmen Sie regelmäßig Medikamente?" },
      { sprecher: "Patient", text: "Ja, äh, morgens L-Thyroxin. Hundertfünfundsiebzig." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Haselnuss. Ich hab 'ne Haselnussallergie." },
      { sprecher: "Zahnarzt", text: "Und Sie sind vierundsechzig, richtig?" },
      { sprecher: "Patient", text: "Genau." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie, oder trinken Sie Alkohol?" },
      { sprecher: "Patient", text: "Nö. Nee, weder noch. Da lass ich schön die Finger von.", stil: "ein bisschen stolz" },
      { sprecher: "Zahnarzt", text: "Sehr gut. Dann hab ich alle meine Fragen gestellt. Haben Sie noch Fragen an mich?" },
      { sprecher: "Patient", text: "Nee, ich glaub nicht. Ich will einfach nur, dass das Ding wieder passt." },
      { sprecher: "Zahnarzt", text: "Okay. Dann untersuche ich Sie jetzt." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unsere gemeinsame Patientin Frau Siebler, 64 Jahre alt, die sich aufgrund von Schmerzen unter ihrer neuen Unterkieferprothese in unserer Praxis vorstellte.

Die Patientin berichtete, dass ihr vor einer Woche eine neue Unterkieferprothese eingegliedert worden sei. Seit vier Tagen leide sie unter starken Schmerzen sublingual im linken Seitenzahnbereich. Die Schmerzen seien brennend und drückend und bestünden beim Tragen der Prothese dauerhaft; die Nahrungsaufnahme sei nicht möglich. Aus diesem Grund habe sie die Prothese in den letzten Tagen nicht mehr getragen. Zudem habe sie den Eindruck, dass die Schleimhaut in diesem Bereich geschwollen sei. Auf Empfehlung einer Nachbarin habe sie mehrmals täglich mit Kamillentee gespült. Der letzte Zahnarztbesuch sei vor einer Woche zur Eingliederung der Prothese erfolgt.

Vorerkrankungen:
Vor einigen Jahren sei bei der Patientin ein Schilddrüsentumor aufgetreten. Sie nehme L-Thyroxin 175 µg (1-0-0) ein. Es bestehe eine Haselnussallergie. Die Patientin rauche nicht und trinke keinen Alkohol.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig; die Lymphknoten waren nicht tastbar. Intraoral zeigte sich am lingualen Rand der Unterkieferprothese regio 36/37 ein ca. 6 mm großes, fibrinbelegtes Druckulkus mit geröteter und geschwollener Umgebung. Der linguale Prothesenrand war in diesem Bereich überextendiert.

Therapie:
Der linguale Prothesenrand wurde regio 36/37 gekürzt und geglättet, anschließend wurde die Prothese poliert. Zudem wurde eine Spülung mit Chlorhexidin-Lösung 0,12 % zweimal täglich für eine Woche empfohlen.

Procedere:
Die Patientin soll die Prothese bis zur Kontrolle nur stundenweise tragen. Eine Kontrolle ist in einer Woche geplant. Sollte das Ulkus innerhalb von zwei Wochen nicht abheilen, ist eine Überweisung zur histologischen Abklärung vorgesehen.

Mit freundlichen kollegialen Grüßen`,
  },
};

export const ARZTBRIEF_FAELLE = [kassis37, sieblerOk, sieblerUk, alveolitis38];
