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
    musterbrief: `Sehr geehrte Frau Kollegin, sehr geehrter Herr Kollege,

wir berichten über Ihren Patienten Herrn Rami Haddad, 41 Jahre, der sich am heutigen Tag in unserem zahnärztlichen Notdienst vorstellte.

Der Patient berichtete, dass ihm vor vier Tagen der Zahn 38 extrahiert worden sei. Die ersten zwei Tage seien weitgehend beschwerdefrei gewesen; seit zwei Tagen leide er jedoch unter starken, pochenden Schmerzen, die bis ins linke Ohr ausstrahlten und nachts am stärksten seien. Zudem gab er einen unangenehmen Geschmack sowie Mundgeruch an. Fieber oder eine Schwellung habe er nicht bemerkt. Gegen die Schmerzen habe er dreimal täglich Paracetamol 500 mg eingenommen, jedoch ohne ausreichende Wirkung.

An Vorerkrankungen seien ein Asthma bronchiale sowie seit zwei Jahren eine arterielle Hypertonie bekannt. Als Dauermedikation nehme der Patient ein Kombinationspräparat aus Budesonid und Formoterol (1–0–1), bei Bedarf Salbutamol sowie Bisoprolol 5 mg (1–0–0) ein. Es bestehe eine Allergie gegen Acetylsalicylsäure, die sich durch Atemnot äußere. Der Patient rauche ca. 15 Zigaretten täglich und habe auch nach der Extraktion weitergeraucht; Alkohol trinke er gelegentlich am Wochenende.

Die extraorale Untersuchung war unauffällig. Intraoral zeigte sich eine leere Alveole 38 ohne Blutkoagel mit freiliegendem Alveolarknochen sowie eine gerötete Gingiva regio 38; zudem fiel ein Foetor ex ore auf. Die Einzelzahnaufnahme zeigte weder Wurzelreste noch Fremdkörper regio 38.

Unter dem Verdacht einer Alveolitis sicca wurde die Alveole mit Kochsalzlösung gespült und eine Alveolitis-Tamponade eingelegt. Zur Analgesie wurde Paracetamol 1000 mg bei Bedarf, maximal dreimal täglich, empfohlen.

Wir empfehlen eine Kontrolle mit Wechsel der Tamponade in zwei Tagen in Ihrer Praxis.

Mit freundlichen kollegialen Grüßen`,
  },
};

export const ARZTBRIEF_FAELLE = [alveolitis38];
