import type { CaseInput } from "@/lib/cases/schema";

// ---------------------------------------------------------------------------
// Arztbrief-Fälle nach bisherigen FaMed-Prüfungen (Aufbereitung „FaMed_Arztbrief_Pruefungsfaelle.pdf“).
// Anamnese-Fakten aus der Aufbereitung; Namen, fehlende Altersangaben, ergänzende Befunde,
// Therapie und Procedere sowie Dialoge und Musterbriefe sind eigenständig formuliert.
// Hinweis: Fall 1 entspricht „Frau Kassis“ und Fall 9 „Frau Siebler (Unterkiefer)“ in arztbrief.ts.
// ---------------------------------------------------------------------------

const KURZ =
  "Sie hören ein Anamnesegespräch. Schreiben Sie danach einen Arztbrief. Sie können das Gespräch pausieren sowie vor- und zurückspulen. Sie haben für die gesamte Situation maximal 22 Minuten Zeit.";

function situation(patient: "einen Patienten" | "eine Patientin") {
  return `Sie arbeiten in einer Zahnarztpraxis und haben ${patient} behandelt. Schreiben Sie einen Arztbrief an die weiterbehandelnden Kolleginnen und Kollegen in ganzen Sätzen und nach fachsprachlichen Standards. Achten Sie darauf, Patientenaussagen mit einer angemessenen Distanz wiederzugeben, zum Beispiel mithilfe des Konjunktivs.`;
}

const AUFGABE = {
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

const AUFGABE_TRAUMA = {
  ...AUFGABE,
  punkte: [
    { text: "Name, Alter" },
    { text: "Unfallhergang und aktuelle Beschwerden" },
    { text: "Ausschluss von Begleitverletzungen (Bewusstlosigkeit, Übelkeit, Erbrechen, Schwindel)" },
    { text: "Vorerkrankungen und Medikamente" },
    { text: "Allergien" },
    { text: "Nikotin- und Alkoholkonsum" },
  ],
};

/** Prüfpunkte, die in jedem Brief vorkommen. */
const FORM = { id: "form", label: "Briefform: Anrede, Einleitungssatz, Grußformel; ganze Sätze statt Stichpunkte", weight: 1 };
const KONJUNKTIV = {
  id: "konjunktiv",
  label: "Patientenaussagen im Konjunktiv I, eigene Befunde/Therapie im Indikativ (Passiv)",
  weight: 2,
};
const FACHSPRACHE = {
  id: "fachsprache",
  label: "Umgangssprache in Fachsprache übertragen (z. B. Schmerzcharakter, Lokalisation, Zahnschema)",
  weight: 1,
};

function patientenInfo(name: string, label = "Name des Patienten") {
  return { titel: "Patienteninformationen", eintraege: [{ label, wert: name }] };
}

// ---------------------------------------------------------------------------
// Fall 2 – Akute Schmerzen und Schwellung im Unterkiefer rechts
// ---------------------------------------------------------------------------
export const schwellungUkRechts: CaseInput = {
  id: "arztbrief-schwellung-46",
  version: 1,
  stationType: "arztbrief",
  title: "Dicke Wange und Schmerzen im rechten Unterkiefer",
  untertitel: "Prüfungsfall: Abszess regio 46, Diabetes, Osteoporose, Z. n. Tumor (Herr Kowalski)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Kowalski",
    abschnitte: [
      patientenInfo("Herr Kowalski"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          {
            label: "Extraorale Untersuchung",
            wert: [
              "druckdolente Schwellung der rechten Wange über dem Unterkiefer",
              "submandibuläre Lymphknoten rechts vergrößert und druckdolent",
              "Mundöffnung nicht eingeschränkt, Schlucken unauffällig",
              "Körpertemperatur 37,8 °C",
            ],
          },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "vestibuläre, fluktuierende Schwellung regio 46",
              "Zahn 46 mit insuffizienter, randundichter Füllung",
              "Vitalitätsprobe 46: negativ",
              "Perkussionstest 46: positiv",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: "periapikale Radioluzenz an beiden Wurzeln von Zahn 46" },
          { label: "Diagnose", wert: "submuköser Abszess regio 46 bei apikaler Parodontitis an Zahn 46" },
          {
            label: "Therapie",
            wert: [
              "Inzision des Abszesses in Lokalanästhesie, Entleerung von Pus",
              "Spülung mit Kochsalzlösung, Einlage einer Gummilasche",
              "Trepanation von Zahn 46 zur Entlastung",
              "Amoxicillin 1000 mg (1-1-1) für 7 Tage",
              "Ibuprofen 600 mg bei Bedarf, max. 3× täglich",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "Kontrolle und Entfernung der Lasche morgen",
              "Wurzelkanalbehandlung 46 nach Abklingen der akuten Entzündung",
              "Kontrolle des Blutzuckers beim Hausarzt empfohlen",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Kowalski, 63 Jahre)", weight: 1 },
      { id: "anlass", label: "seit 5 Tagen Schmerzen im rechten Unterkiefer, zunächst leicht, dann zunehmend", weight: 1 },
      { id: "charakter", label: "pochend, Verstärkung durch Kauen/Druck und Wärme, nachts am stärksten", weight: 2 },
      { id: "schwellung", label: "starke Wangenschwellung, Sprechen erschwert; Schlucken und Mundöffnung unauffällig; leicht erhöhte Temperatur", weight: 2 },
      { id: "vorgeschichte", label: "vor 6 Monaten Entzündung an der Wurzelspitze festgestellt, nicht behandelt", weight: 1 },
      { id: "diabetes", label: "Diabetes mellitus Typ 2 mit Metformin 500 mg (1-0-0)", weight: 2 },
      { id: "hypertonie", label: "arterielle Hypertonie mit Ramipril (1-0-1), Dosierung unbekannt", weight: 1 },
      { id: "osteoporose", label: "Osteoporose ohne antiresorptive Therapie (keine Bisphosphonate)", weight: 1 },
      { id: "tumor", label: "Z. n. Kolonkarzinom vor 3 Jahren (Operation und Chemotherapie, keine Bestrahlung im Kopf-Hals-Bereich)", weight: 1 },
      { id: "allergie", label: "Allergien gegen Katzenhaare und Haselnüsse", weight: 2 },
      { id: "noxen", label: "ca. 1 Zigarette täglich, gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde vollständig: extraoral (Schwellung, Lymphknoten, 37,8 °C), intraoral (Abszess, Vitalität, Perkussion), Röntgen", weight: 2 },
      { id: "therapie", label: "Therapie vollständig: Inzision, Lasche, Trepanation, Amoxicillin 1000 mg 1-1-1, Ibuprofen 600 mg", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle morgen, WKB 46, Blutzuckerkontrolle", weight: 1 },
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-schwellung-46.mp3",
    sprecher: { Zahnarzt: "Kore", Patient: "Charon" },
    sprechweise: {
      Zahnarzt: "Zahnärztin um die vierzig, freundlich und sachlich, zügiges Praxistempo, sagt ab und zu „mhm“ oder „okay“, nicht übertrieben deutlich",
      Patient:
        "Mann Anfang sechzig aus dem Ruhrgebiet, bodenständig und etwas wortkarg; die rechte Wange ist dick geschwollen, deshalb spricht er gedämpft, mit wenig Mundöffnung und ziemlich undeutlich; Alltagsdeutsch mit „nee“, „hab“, „is“",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Herr Kowalski. Setzen Sie sich. Oh, die Wange sieht ja ganz schön dick aus. Was ist passiert?" },
      { sprecher: "Patient", text: "Tach. Ja … seit fünf Tagen hab ich hier unten rechts Schmerzen. Erst war's nur so 'n bisschen, aber dann … wurd's immer schlimmer.", stil: "hält die Hand an die rechte Wange, gedämpft" },
      { sprecher: "Zahnarzt", text: "Mhm. Wie fühlen sich die Schmerzen an?" },
      { sprecher: "Patient", text: "Pochend. Und wenn ich draufbeiße oder draufdrück, dann … [atmet scharf ein] boah. Nachts is es am schlimmsten." },
      { sprecher: "Zahnarzt", text: "Hilft Kälte oder Wärme?" },
      { sprecher: "Patient", text: "Wärme auf keinen Fall. Meine Frau hat mir 'n Kirschkernkissen draufgelegt, das war noch schlimmer." },
      { sprecher: "Zahnarzt", text: "Und die Schwellung, seit wann haben Sie die?" },
      { sprecher: "Patient", text: "Seit vorgestern, so richtig. Reden is auch schwierig, merken Sie ja.", stil: "undeutlich, leicht verlegen" },
      { sprecher: "Zahnarzt", text: "Können Sie gut schlucken? Und den Mund normal aufmachen?" },
      { sprecher: "Patient", text: "Schlucken geht. Aufmachen auch, ja." },
      { sprecher: "Zahnarzt", text: "Hatten Sie Fieber?" },
      { sprecher: "Patient", text: "Nee, Fieber nich. Bisschen erhöht vielleicht, so siebenunddreißig acht." },
      { sprecher: "Zahnarzt", text: "Okay. Waren Sie wegen des Zahns schon mal beim Zahnarzt?" },
      { sprecher: "Patient", text: "Vor 'nem halben Jahr. Da hat der gesagt, an der Wurzelspitze is 'ne Entzündung. Aber … [seufzt] gemacht hab ich dann nix. Tat ja nich weh.", stil: "schuldbewusst" },
      { sprecher: "Zahnarzt", text: "Verstehe. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Zucker hab ich. Typ zwei. Da nehm ich Metformin, fünfhundert, morgens." },
      { sprecher: "Zahnarzt", text: "Mhm. Noch etwas?" },
      { sprecher: "Patient", text: "Bluthochdruck. Ramipril, morgens und abends eine. Die Stärke … weiß ich grad nich. Und Osteoporose hab ich auch." },
      { sprecher: "Zahnarzt", text: "Bekommen Sie gegen die Osteoporose Tabletten oder Spritzen, zum Beispiel Bisphosphonate?" },
      { sprecher: "Patient", text: "Nee, so was hab ich nie gekriegt." },
      { sprecher: "Zahnarzt", text: "Gab es sonst noch größere Erkrankungen oder Operationen?" },
      { sprecher: "Patient", text: "Ja … vor drei Jahren Darmkrebs. Operiert, dann Chemo. Bestrahlt wurd nix. Is aber alles gut jetzt, sagen die.", stil: "ruhiger, ernster" },
      { sprecher: "Zahnarzt", text: "Das freut mich. Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Katzenhaare. Und Haselnüsse." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie, oder trinken Sie Alkohol?" },
      { sprecher: "Patient", text: "Eine am Tag noch. Eine Zigarette, mehr nich. Und Bier ab und zu, am Wochenende." },
      { sprecher: "Zahnarzt", text: "Und wie alt sind Sie, Herr Kowalski?" },
      { sprecher: "Patient", text: "Dreiundsechzig." },
      { sprecher: "Zahnarzt", text: "Gut, danke. Dann schau ich mir das jetzt an und mache eine Röntgenaufnahme." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Kowalski, 63 Jahre alt, der sich aufgrund von Schmerzen und einer Schwellung im rechten Unterkiefer in unserer Praxis vorstellte.

Der Patient berichtete, seit fünf Tagen unter zunächst leichten, dann zunehmend starken Schmerzen im rechten Unterkiefer zu leiden. Die Schmerzen seien pochend, verstärkten sich beim Kauen sowie bei Druck auf die betroffene Seite und seien nachts am stärksten. Wärme verschlimmere die Beschwerden. Seit zwei Tagen bestehe zudem eine ausgeprägte Wangenschwellung, wodurch das Sprechen erschwert sei. Schluckbeschwerden oder eine eingeschränkte Mundöffnung wurden verneint; es habe lediglich eine leicht erhöhte Temperatur von 37,8 °C bestanden. Vor einem halben Jahr sei bei einer zahnärztlichen Untersuchung eine Entzündung an der Wurzelspitze festgestellt worden, die jedoch nicht behandelt worden sei.

Vorerkrankungen:
Es bestehe ein Diabetes mellitus Typ 2, der mit Metformin 500 mg (1-0-0) behandelt werde. Zudem leide der Patient an einer arteriellen Hypertonie, gegen die er Ramipril (1-0-1) einnehme; die Dosierung sei ihm nicht bekannt. Darüber hinaus bestehe eine Osteoporose, eine antiresorptive Therapie (z. B. mit Bisphosphonaten) sei bisher nicht erfolgt. Vor drei Jahren sei ein Kolonkarzinom operiert und mit einer Chemotherapie behandelt worden; eine Bestrahlung sei nicht erfolgt. Es bestünden Allergien gegen Katzenhaare und Haselnüsse. Der Patient rauche eine Zigarette täglich und konsumiere gelegentlich Alkohol.

Klinische Untersuchung:
Extraoral zeigte sich eine druckdolente Schwellung der rechten Wange über dem Unterkiefer. Die submandibulären Lymphknoten rechts waren vergrößert und druckdolent. Die Mundöffnung war nicht eingeschränkt, das Schlucken unauffällig. Die Körpertemperatur betrug 37,8 °C. Intraoral zeigte sich eine vestibuläre, fluktuierende Schwellung regio 46. Der Zahn 46 wies eine insuffiziente, randundichte Füllung auf; die Vitalitätsprobe war negativ, der Perkussionstest positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich eine periapikale Radioluzenz an beiden Wurzeln des Zahns 46.

Diagnose:
Submuköser Abszess regio 46 bei apikaler Parodontitis an Zahn 46.

Therapie:
In Lokalanästhesie wurde der Abszess inzidiert und der Pus entleert. Anschließend wurde die Abszesshöhle mit Kochsalzlösung gespült und eine Gummilasche eingelegt. Zur Entlastung wurde der Zahn 46 trepaniert. Es wurde Amoxicillin 1000 mg (1-1-1) für sieben Tage verordnet; zur Analgesie wurde Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich, empfohlen.

Procedere:
Eine Kontrolle mit Entfernung der Lasche ist für morgen geplant. Nach Abklingen der akuten Entzündung ist eine Wurzelkanalbehandlung des Zahns 46 vorgesehen. Zudem wurde dem Patienten eine Kontrolle des Blutzuckers beim Hausarzt empfohlen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 3 – Schmerzen und Schwellung an Zahn 36
// ---------------------------------------------------------------------------
export const schwellung36: CaseInput = {
  id: "arztbrief-schwellung-36",
  version: 1,
  stationType: "arztbrief",
  title: "Schwellung an Zahn 36, Mund geht kaum auf",
  untertitel: "Prüfungsfall: Abszess regio 36 mit Kieferklemme, Hypothyreose (Herr Brückner)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Brückner",
    abschnitte: [
      patientenInfo("Herr Brückner"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          {
            label: "Extraorale Untersuchung",
            wert: [
              "druckdolente Schwellung der linken Wange regio 36",
              "Kieferklemme, Schneidekantendistanz 25 mm",
              "submandibuläre Lymphknoten links druckdolent",
            ],
          },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Zahn 36 tief kariös zerstört",
              "vestibuläre, fluktuierende Schwellung regio 36",
              "Vitalitätsprobe 36: negativ",
              "Perkussionstest 36: positiv",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: ["Zahn 36: Karies bis an die Pulpa", "apikale Radioluzenz an mesialer und distaler Wurzel"] },
          { label: "Diagnose", wert: "submuköser Abszess regio 36 ausgehend von Zahn 36" },
          {
            label: "Therapie",
            wert: [
              "Leitungsanästhesie, Inzision des Abszesses, Entleerung von Pus",
              "Spülung mit Kochsalzlösung, Einlage einer Gummilasche",
              "Ibuprofen 600 mg bei Bedarf, max. 3× täglich",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "Kontrolle und Laschenwechsel morgen",
              "danach Entscheidung über Wurzelkanalbehandlung oder Extraktion 36",
              "bei Fieber, Schluckbeschwerden oder zunehmender Schwellung sofortige Wiedervorstellung",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Brückner, 46 Jahre)", weight: 1 },
      { id: "anlass", label: "seit 2 Wochen Schmerzen an Zahn 36, seit 2 Tagen deutlich stärker", weight: 2 },
      { id: "charakter", label: "Kauen kaum möglich, nachts stärker, kaum Schlaf", weight: 1 },
      { id: "analgetika", label: "Ibuprofen 400 mg ohne relevante Besserung", weight: 1 },
      { id: "schwellung", label: "Schwellung linke Wange, eingeschränkte Mundöffnung, Sprechen schmerzhaft; keine Schluckbeschwerden, kein Fieber", weight: 2 },
      { id: "vorgeschichte", label: "Kontrolltermine vernachlässigt, letzter Zahnarztbesuch vor ca. 3 Jahren", weight: 1 },
      { id: "vorerkrankung", label: "Hypothyreose mit L-Thyroxin Henning 75 µg (1-0-0)", weight: 2 },
      { id: "allergie", label: "Pollenallergie", weight: 2 },
      { id: "noxen", label: "Ex-Raucher (ca. 20 Jahre geraucht, seit 2 Jahren rauchfrei), gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde vollständig: Schwellung, Kieferklemme (SKD 25 mm), Lymphknoten, Abszess, Vitalität, Perkussion, Röntgen", weight: 2 },
      { id: "therapie", label: "Therapie: Leitungsanästhesie, Inzision, Spülung, Gummilasche, Ibuprofen 600 mg", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle morgen, Entscheidung WKB/Extraktion, Warnzeichen", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-schwellung-36.mp3",
    sprecher: { Zahnarzt: "Orus", Patient: "Algieba" },
    sprechweise: {
      Zahnarzt: "Zahnarzt Ende vierzig, ruhig und freundlich, routiniert, normales Praxistempo, nicht übertrieben deutlich",
      Patient:
        "Mann Mitte vierzig, müde und gereizt nach schlaflosen Nächten; kann den Mund kaum öffnen, spricht deshalb durch die Zähne, gepresst, leise und schwer verständlich; Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Morgen, Herr Brückner. Was kann ich für Sie tun?" },
      { sprecher: "Patient", text: "Morgen. Der Zahn hier … unten links. Der macht mich fertig.", stil: "durch die Zähne, kaum Mundöffnung" },
      { sprecher: "Zahnarzt", text: "Seit wann haben Sie die Beschwerden?" },
      { sprecher: "Patient", text: "Zwei Wochen ungefähr. Am Anfang war's nicht so wild. Aber seit vorgestern … [seufzt] richtig heftig." },
      { sprecher: "Zahnarzt", text: "Können Sie auf der Seite noch kauen?" },
      { sprecher: "Patient", text: "Nee, eigentlich gar nicht mehr. Ich ess nur noch rechts. Und nachts wird's noch schlimmer, ich hab kaum geschlafen." },
      { sprecher: "Zahnarzt", text: "Haben Sie etwas gegen die Schmerzen genommen?" },
      { sprecher: "Patient", text: "Ibuprofen. Die Vierhunderter. Bringt aber … nix, ehrlich gesagt." },
      { sprecher: "Zahnarzt", text: "Mhm. Ich sehe, die linke Wange ist geschwollen. Können Sie den Mund richtig öffnen?" },
      { sprecher: "Patient", text: "Nee, geht nur so weit. Und reden tut auch weh.", stil: "deutet die geringe Öffnung an, gequält" },
      { sprecher: "Zahnarzt", text: "Haben Sie Probleme beim Schlucken? Oder Fieber?" },
      { sprecher: "Patient", text: "Schlucken geht. Fieber hab ich nicht, hab gemessen." },
      { sprecher: "Zahnarzt", text: "Gut. Wann waren Sie zuletzt beim Zahnarzt?" },
      { sprecher: "Patient", text: "Puh … ist schon 'ne Weile her. Drei Jahre? Ich hab die Kontrollen echt schleifen lassen.", stil: "etwas verlegen" },
      { sprecher: "Zahnarzt", text: "Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Schilddrüsenunterfunktion. Da nehm ich L-Thyroxin, von Henning. Fünfundsiebzig Mikrogramm, morgens." },
      { sprecher: "Zahnarzt", text: "Sonst noch Medikamente?" },
      { sprecher: "Patient", text: "Nee, nur das." },
      { sprecher: "Zahnarzt", text: "Allergien?" },
      { sprecher: "Patient", text: "Pollen. Im Frühjahr, Heuschnupfen halt." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Nicht mehr. Hab zwanzig Jahre geraucht, aber seit zwei Jahren bin ich weg davon." },
      { sprecher: "Zahnarzt", text: "Sehr gut. Und Alkohol?" },
      { sprecher: "Patient", text: "Mal 'n Bier, gelegentlich." },
      { sprecher: "Zahnarzt", text: "Wie alt sind Sie, Herr Brückner?" },
      { sprecher: "Patient", text: "Sechsundvierzig." },
      { sprecher: "Zahnarzt", text: "Okay, danke. Dann schauen wir uns das jetzt an. Ich mache auch ein Röntgenbild." },
      { sprecher: "Patient", text: "Hauptsache, es hört auf." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Brückner, 46 Jahre alt, der sich aufgrund von Schmerzen und einer Schwellung im Bereich des Zahns 36 in unserer Praxis vorstellte.

Der Patient gab an, seit zwei Wochen unter Schmerzen an Zahn 36 zu leiden. Anfangs seien die Beschwerden leicht gewesen, seit zwei Tagen hätten sie jedoch deutlich zugenommen. Das Kauen auf der linken Seite sei kaum noch möglich; nachts verstärkten sich die Schmerzen, sodass er kaum schlafen könne. Die Einnahme von Ibuprofen 400 mg habe keine relevante Besserung gebracht. Zusätzlich bestehe eine Schwellung der linken Wange. Der Mund könne nicht richtig geöffnet werden und das Sprechen sei schmerzhaft. Schluckbeschwerden und Fieber wurden verneint. Der Patient gab an, die zahnärztlichen Kontrolltermine vernachlässigt zu haben; der letzte Zahnarztbesuch liege etwa drei Jahre zurück.

Vorerkrankungen:
Es bestehe eine Hypothyreose, die mit L-Thyroxin Henning 75 µg (1-0-0) behandelt werde. Weitere Medikamente nehme der Patient nicht ein. Es bestehe eine Pollenallergie. Der Patient habe etwa 20 Jahre geraucht, sei jedoch seit zwei Jahren Nichtraucher. Alkohol konsumiere er gelegentlich.

Klinische Untersuchung:
Extraoral zeigte sich eine druckdolente Schwellung der linken Wange regio 36 sowie eine Kieferklemme mit einer Schneidekantendistanz von 25 mm. Die submandibulären Lymphknoten links waren druckdolent. Intraoral zeigte sich ein tief kariös zerstörter Zahn 36 mit einer vestibulären, fluktuierenden Schwellung regio 36. Die Vitalitätsprobe an Zahn 36 war negativ, der Perkussionstest positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich an Zahn 36 eine Karies, die bis an die Pulpa reichte, sowie eine apikale Radioluzenz an der mesialen und distalen Wurzel.

Diagnose:
Submuköser Abszess regio 36 ausgehend von Zahn 36.

Therapie:
Nach Leitungsanästhesie wurde der Abszess inzidiert und der Pus entleert. Anschließend wurde die Abszesshöhle mit Kochsalzlösung gespült und eine Gummilasche eingelegt. Zur Analgesie wurde Ibuprofen 600 mg bei Bedarf, maximal dreimal täglich, empfohlen.

Procedere:
Eine Kontrolle mit Laschenwechsel ist für morgen geplant. Danach wird über eine Wurzelkanalbehandlung oder die Extraktion des Zahns 36 entschieden. Der Patient wurde angewiesen, sich bei Fieber, Schluckbeschwerden oder einer Zunahme der Schwellung sofort wieder vorzustellen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 4 – Schmerzen und Schwellung im Oberkiefer rechts (Zahn 16)
// ---------------------------------------------------------------------------
export const schwellung16: CaseInput = {
  id: "arztbrief-schwellung-16",
  version: 1,
  stationType: "arztbrief",
  title: "Schwellung bis zum Auge: Zahn 16",
  untertitel: "Prüfungsfall: Abszess regio 16 nach WKB und WSR, Hypertonie, Gicht (Frau Albrecht)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("eine Patientin"),
    gespraechspartner: "Frau Albrecht",
    abschnitte: [
      patientenInfo("Frau Albrecht", "Name der Patientin"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          {
            label: "Extraorale Untersuchung",
            wert: [
              "ausgeprägte, druckdolente Schwellung der rechten Wange bis zum Unterlid",
              "Augenbeweglichkeit und Sehvermögen unauffällig",
              "eingeschränkte Mundöffnung",
              "Körpertemperatur 36,9 °C",
            ],
          },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "vestibuläre, fluktuierende Schwellung regio 15–17",
              "Zahn 16 überkront",
              "Vitalitätsprobe 16: negativ",
              "Perkussionstest 16: positiv",
            ],
          },
          {
            label: "Röntgenbefund (Einzelzahnaufnahme)",
            wert: ["Zahn 16: Z. n. Wurzelkanalbehandlung und Wurzelspitzenresektion", "periapikale Radioluzenz an der mesiobukkalen Wurzel"],
          },
          { label: "Diagnose", wert: "Abszess regio 16 bei persistierender apikaler Parodontitis" },
          {
            label: "Therapie",
            wert: [
              "Inzision in Lokalanästhesie, Entleerung von Pus",
              "Spülung mit Kochsalzlösung, Einlage einer Drainage (Gummilasche)",
              "Amoxicillin 1000 mg (1-1-1) für 7 Tage",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "Kontrolle morgen",
              "bei Zunahme der Schwellung, Fieber oder Sehstörungen sofortige Überweisung in die MKG-Chirurgie",
              "nach Abklingen Extraktion von Zahn 16 empfohlen",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Frau Albrecht, 51 Jahre)", weight: 1 },
      { id: "anlass", label: "seit einigen Tagen plötzlich aufgetretene Schmerzen an Zahn 16", weight: 1 },
      { id: "charakter", label: "Druckgefühl und teilweise pochend, Verstärkung beim Essen/Kauen", weight: 2 },
      { id: "schwellung", label: "starke Wangenschwellung bis zum Auge, eingeschränkte Mundöffnung, kein Fieber", weight: 2 },
      { id: "analgetika", label: "Ibuprofen 600 mg", weight: 1 },
      { id: "vorgeschichte", label: "WKB 16 vor 15 Jahren, später WSR 16, danach einmalige Schwellung (spontan rückläufig); PZR vor 2 Monaten", weight: 2 },
      { id: "vorerkrankung", label: "arterielle Hypertonie und Gicht; Antihypertensivum (Name unbekannt)", weight: 2 },
      { id: "allergie", label: "keine Allergien", weight: 1 },
      { id: "noxen", label: "früher über 10 Jahre geraucht, vor Kurzem aufgehört; kein Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: Schwellung bis Unterlid, Auge unauffällig, Kieferklemme, Abszess, Vitalität negativ, Perkussion positiv, Röntgen", weight: 2 },
      { id: "therapie", label: "Therapie: Inzision, Drainage, Amoxicillin 1000 mg 1-1-1 für 7 Tage", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle morgen, Warnzeichen/Überweisung MKG, Extraktion 16 empfohlen", weight: 1 },
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-schwellung-16.mp3",
    sprecher: { Zahnarzt: "Callirrhoe", Patient: "Vindemiatrix" },
    sprechweise: {
      Zahnarzt: "Zahnärztin Mitte dreißig, freundlich und aufmerksam, normales Praxistempo, sagt manchmal „mhm“, nicht übertrieben deutlich",
      Patient:
        "Frau Anfang fünfzig, besorgt und etwas aufgeregt wegen der dicken Wange; spricht schnell, erzählt etwas durcheinander, wegen der Schwellung leicht undeutlich und mit wenig Mundöffnung; Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Frau Albrecht. Oje, die Wange ist ja richtig dick. Erzählen Sie mal." },
      { sprecher: "Patient", text: "Ja, gell? Hallo. Das ist oben rechts, der Backenzahn. Der Sechser, glaub ich. Seit ein paar Tagen tut der weh. Ganz plötzlich ging das los.", stil: "aufgeregt, schnell" },
      { sprecher: "Zahnarzt", text: "Was für Schmerzen sind das?" },
      { sprecher: "Patient", text: "So 'n Druck. Und manchmal pocht's auch. Vor allem beim Essen, wenn ich kaue, dann … oh." },
      { sprecher: "Zahnarzt", text: "Und die Schwellung?" },
      { sprecher: "Patient", text: "Die ist heute Morgen richtig schlimm geworden. Das geht hier hoch bis zum Auge, sehen Sie? Und ich krieg den Mund nicht mehr richtig auf.", stil: "besorgt, zeigt zum Auge" },
      { sprecher: "Zahnarzt", text: "Sehen Sie normal? Und hatten Sie Fieber?" },
      { sprecher: "Patient", text: "Sehen geht. Fieber nicht, nee." },
      { sprecher: "Zahnarzt", text: "Haben Sie etwas gegen die Schmerzen genommen?" },
      { sprecher: "Patient", text: "Ibuprofen, sechshundert." },
      { sprecher: "Zahnarzt", text: "Mhm. Wurde an dem Zahn schon mal etwas gemacht?" },
      { sprecher: "Patient", text: "Oh ja. Da wurde vor … fünfzehn Jahren? … der Nerv rausgemacht. Und später haben die an der Wurzelspitze operiert. Danach war schon mal so 'ne Schwellung, aber die ist von allein wieder weggegangen.", stil: "überlegt, zählt nach" },
      { sprecher: "Zahnarzt", text: "Wann waren Sie zuletzt beim Zahnarzt?" },
      { sprecher: "Patient", text: "Vor zwei Monaten, zur Zahnreinigung. Da war eigentlich alles okay." },
      { sprecher: "Zahnarzt", text: "Gut. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Bluthochdruck. Und Gicht hab ich auch, leider." },
      { sprecher: "Zahnarzt", text: "Welche Medikamente nehmen Sie?" },
      { sprecher: "Patient", text: "Was für den Blutdruck. So 'ne kleine weiße Tablette … den Namen weiß ich jetzt echt nicht. [lacht kurz] Tut mir leid.", stil: "verlegen" },
      { sprecher: "Zahnarzt", text: "Kein Problem. Allergien?" },
      { sprecher: "Patient", text: "Nein, keine." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Nicht mehr! Ich hab über zehn Jahre geraucht, aber vor drei Monaten aufgehört.", stil: "stolz" },
      { sprecher: "Zahnarzt", text: "Super. Und Alkohol?" },
      { sprecher: "Patient", text: "Gar nicht." },
      { sprecher: "Zahnarzt", text: "Darf ich noch fragen, wie alt Sie sind?" },
      { sprecher: "Patient", text: "Einundfünfzig." },
      { sprecher: "Zahnarzt", text: "Danke. Dann untersuche ich Sie jetzt und wir machen ein Röntgenbild." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unsere gemeinsame Patientin Frau Albrecht, 51 Jahre alt, die sich aufgrund von Schmerzen und einer Schwellung im rechten Oberkiefer in unserer Praxis vorstellte.

Die Patientin berichtete über seit einigen Tagen bestehende, plötzlich aufgetretene Schmerzen an Zahn 16. Sie beschrieb ein Druckgefühl und teilweise pochende Schmerzen, die sich insbesondere beim Kauen verstärkten. Die rechte Wange sei stark angeschwollen, wobei die Schwellung bis zum Auge reiche; zudem sei die Mundöffnung eingeschränkt. Fieber und Sehstörungen wurden verneint. Zur Analgesie habe sie Ibuprofen 600 mg eingenommen. An Zahn 16 sei vor etwa 15 Jahren eine Wurzelkanalbehandlung durchgeführt worden; später sei eine Wurzelspitzenresektion erfolgt. Danach sei bereits einmal eine Schwellung aufgetreten, die spontan zurückgegangen sei. Der letzte Zahnarztbesuch sei vor zwei Monaten zur professionellen Zahnreinigung erfolgt.

Vorerkrankungen:
Es bestünden eine arterielle Hypertonie sowie eine Gicht. Die Patientin nehme ein Antihypertensivum ein, dessen Namen sie nicht nennen konnte. Allergien seien nicht bekannt. Sie habe über zehn Jahre geraucht und vor drei Monaten damit aufgehört. Alkohol trinke sie nicht.

Klinische Untersuchung:
Extraoral zeigte sich eine ausgeprägte, druckdolente Schwellung der rechten Wange, die bis zum Unterlid reichte. Augenbeweglichkeit und Sehvermögen waren unauffällig. Die Mundöffnung war eingeschränkt, die Körpertemperatur betrug 36,9 °C. Intraoral zeigte sich eine vestibuläre, fluktuierende Schwellung regio 15 bis 17. Der überkronte Zahn 16 reagierte negativ auf die Vitalitätsprobe; der Perkussionstest war positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich an Zahn 16 ein Zustand nach Wurzelkanalbehandlung und Wurzelspitzenresektion mit einer periapikalen Radioluzenz an der mesiobukkalen Wurzel.

Diagnose:
Abszess regio 16 bei persistierender apikaler Parodontitis.

Therapie:
In Lokalanästhesie wurde der Abszess inzidiert und der Pus entleert. Die Abszesshöhle wurde mit Kochsalzlösung gespült und eine Gummilasche als Drainage eingelegt. Zudem wurde Amoxicillin 1000 mg (1-1-1) für sieben Tage verordnet.

Procedere:
Eine Kontrolle ist für morgen geplant. Bei einer Zunahme der Schwellung, bei Fieber oder Sehstörungen ist eine sofortige Überweisung in die Mund-, Kiefer- und Gesichtschirurgie vorgesehen. Nach Abklingen der akuten Entzündung wird die Extraktion des Zahns 16 empfohlen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 5 – Frontzahntrauma nach Sturz zu Hause (Asthma, Raucher)
// ---------------------------------------------------------------------------
export const frontzahntrauma21: CaseInput = {
  id: "arztbrief-frontzahntrauma-21",
  version: 1,
  stationType: "arztbrief",
  title: "Abgebrochener Schneidezahn nach Sturz",
  untertitel: "Prüfungsfall: Frontzahntrauma 21, Asthma bronchiale, Katzenhaarallergie (Herr Krause)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Krause",
    abschnitte: [
      patientenInfo("Herr Krause"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: ["Oberlippe angeschwollen, keine Riss- oder Platzwunde", "Kiefergelenke und Mundöffnung unauffällig"] },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Zahn 21: Schmelz-Dentin-Fraktur der mesioinzisalen Ecke ohne Pulpaeröffnung",
              "Zahn 21: Sensibilitätstest (Kälte) positiv, Perkussion leicht positiv, keine Lockerung",
              "Zähne 11, 12, 22: unauffällig, Sensibilität positiv",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: ["keine Wurzelfraktur", "keine Alveolarfortsatzfraktur", "Parodontalspalt unauffällig"] },
          { label: "Diagnose", wert: "unkomplizierte Kronenfraktur (Schmelz-Dentin-Fraktur) an Zahn 21" },
          { label: "Therapie", wert: ["Dentinschutz", "Aufbaufüllung mit Komposit in Säure-Ätz-Technik"] },
          {
            label: "Procedere",
            wert: ["Sensibilitätskontrolle 21 in 4 Wochen und nach 3 Monaten", "in den nächsten Tagen weiche Kost", "Rauchverzicht empfohlen"],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE_TRAUMA,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Krause, 34 Jahre)", weight: 1 },
      { id: "hergang", label: "Unfallhergang: gestern Abend zu Hause gestürzt, mit den oberen Schneidezähnen aufgeschlagen; Stück von 21 abgebrochen, Fragment nicht gefunden", weight: 2 },
      { id: "schmerz", label: "Schmerzen im Frontzahnbereich, stärker beim Kauen und Zubeißen, in Ruhe geringer; keine Schmerzmittel", weight: 2 },
      { id: "neuro", label: "Bewusstlosigkeit, Erbrechen, Schwindel und Schwarzwerden vor Augen verneint", weight: 2 },
      { id: "vorerkrankung", label: "Asthma bronchiale seit der Kindheit, Salbutamol bei Bedarf", weight: 2 },
      { id: "allergie", label: "Katzenhaarallergie", weight: 1 },
      { id: "noxen", label: "5–10 Zigaretten täglich, gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: Oberlippe geschwollen, Schmelz-Dentin-Fraktur 21 ohne Pulpaeröffnung, Sensibilität positiv, Röntgen ohne Fraktur", weight: 2 },
      { id: "therapie", label: "Therapie: Dentinschutz und Kompositaufbau 21", weight: 2 },
      { id: "procedere", label: "Procedere: Sensibilitätskontrollen (4 Wochen, 3 Monate), weiche Kost, Rauchverzicht", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-frontzahntrauma-21.mp3",
    sprecher: { Zahnarzt: "Sulafat", Patient: "Puck" },
    sprechweise: {
      Zahnarzt: "Zahnärztin Anfang vierzig, freundlich, ruhig und routiniert, normales Tempo, nicht übertrieben deutlich",
      Patient:
        "Mann Mitte dreißig, locker und etwas peinlich berührt über den Unfall; die Oberlippe ist geschwollen, deshalb klingen „f“, „w“ und „s“ etwas verwaschen; spricht zügig, umgangssprachlich",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Hallo, Herr Krause. Was ist denn passiert?" },
      { sprecher: "Patient", text: "Hallo. Ja … [lacht kurz] blöde Geschichte. Ich bin gestern Abend zu Hause hingefallen. Auf der Treppe ausgerutscht. Und dann voll mit den Zähnen aufs Geländer.", stil: "verlegen, geschwollene Lippe" },
      { sprecher: "Zahnarzt", text: "Oh je. Welche Zähne haben was abgekriegt?" },
      { sprecher: "Patient", text: "Oben, vorne. Hier links, da ist ein Stück abgebrochen. Sehen Sie?" },
      { sprecher: "Zahnarzt", text: "Ja, ich sehe es. Haben Sie das abgebrochene Stück noch?" },
      { sprecher: "Patient", text: "Nee, das hab ich nicht gefunden. Keine Ahnung, wo das hin ist." },
      { sprecher: "Zahnarzt", text: "Haben Sie Schmerzen?" },
      { sprecher: "Patient", text: "Ja, vorne halt. Vor allem beim Kauen, wenn ich zubeiße. Wenn ich nix mache, geht's eigentlich." },
      { sprecher: "Zahnarzt", text: "Haben Sie dagegen etwas genommen?" },
      { sprecher: "Patient", text: "Nö. Hab nix genommen." },
      { sprecher: "Zahnarzt", text: "Ich muss noch ein paar Dinge zum Sturz fragen. Waren Sie bewusstlos, auch nur kurz?" },
      { sprecher: "Patient", text: "Nee. Ich war die ganze Zeit da." },
      { sprecher: "Zahnarzt", text: "Mussten Sie sich übergeben? Oder war Ihnen schwindelig, schwarz vor Augen?" },
      { sprecher: "Patient", text: "Nee, nichts davon. Nur der Schreck halt." },
      { sprecher: "Zahnarzt", text: "Gut. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Asthma. Schon seit ich klein bin." },
      { sprecher: "Zahnarzt", text: "Nehmen Sie dafür Medikamente?" },
      { sprecher: "Patient", text: "Nur so 'n Spray, wenn ich's brauch. Salbutamol." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Katzenhaare. Da krieg ich sofort keine Luft mehr." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "[seufzt] Ja … so fünf bis zehn am Tag. Ich weiß, mit Asthma …", stil: "schuldbewusst, leiser" },
      { sprecher: "Zahnarzt", text: "Und Alkohol?" },
      { sprecher: "Patient", text: "Gelegentlich. Am Wochenende mal 'n Bier." },
      { sprecher: "Zahnarzt", text: "Und Sie sind wie alt?" },
      { sprecher: "Patient", text: "Vierunddreißig." },
      { sprecher: "Zahnarzt", text: "Okay, danke. Dann schau ich mir den Zahn jetzt genau an und wir machen ein Röntgenbild." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Krause, 34 Jahre alt, der sich nach einem häuslichen Sturz mit einer Fraktur des Zahns 21 in unserer Praxis vorstellte.

Der Patient berichtete, gestern Abend zu Hause auf der Treppe ausgerutscht und mit den oberen Schneidezähnen auf das Geländer aufgeschlagen zu sein. Dabei sei an einem oberen linken Frontzahn ein Stück abgebrochen; das Fragment habe er nicht gefunden. Seit dem Unfall bestünden Schmerzen im Frontzahnbereich, die sich insbesondere beim Kauen und Zubeißen verstärkten und in Ruhe geringer seien. Schmerzmittel habe er nicht eingenommen. Bewusstlosigkeit, Erbrechen, Schwindel und Schwarzwerden vor Augen wurden verneint.

Vorerkrankungen:
Der Patient leide seit der Kindheit an Asthma bronchiale, das bei Bedarf mit Salbutamol behandelt werde. Es bestehe eine Katzenhaarallergie. Er rauche fünf bis zehn Zigaretten täglich und trinke gelegentlich Alkohol.

Klinische Untersuchung:
Extraoral zeigte sich eine Schwellung der Oberlippe ohne Riss- oder Platzwunde; Kiefergelenke und Mundöffnung waren unauffällig. Intraoral zeigte sich an Zahn 21 eine Schmelz-Dentin-Fraktur der mesioinzisalen Ecke ohne Pulpaeröffnung. Der Sensibilitätstest an Zahn 21 war positiv, die Perkussion leicht positiv; eine Lockerung bestand nicht. Die Zähne 11, 12 und 22 waren unauffällig und sensibel.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigten sich weder eine Wurzelfraktur noch eine Alveolarfortsatzfraktur; der Parodontalspalt war unauffällig.

Diagnose:
Unkomplizierte Kronenfraktur (Schmelz-Dentin-Fraktur) an Zahn 21.

Therapie:
Nach Dentinschutz wurde der Zahn 21 in Säure-Ätz-Technik mit einer Kompositfüllung aufgebaut.

Procedere:
Sensibilitätskontrollen des Zahns 21 sind in vier Wochen sowie nach drei Monaten geplant. Dem Patienten wurde empfohlen, in den nächsten Tagen weiche Kost zu sich zu nehmen und auf das Rauchen zu verzichten.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 6 – Frontzahntrauma beim Spielen mit dem Sohn (Hypertonie, Nichtraucher)
// ---------------------------------------------------------------------------
export const frontzahntrauma11: CaseInput = {
  id: "arztbrief-frontzahntrauma-11",
  version: 1,
  stationType: "arztbrief",
  title: "Frontzahnunfall beim Fußballspielen",
  untertitel: "Prüfungsfall: Fraktur 11 und Konkussion 21, Hypertonie, Katzenhaarallergie (Herr Weiß)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Weiß",
    abschnitte: [
      patientenInfo("Herr Weiß"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: ["Oberlippe angeschwollen", "keine Wunden, Kiefergelenke unauffällig"] },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Zahn 11: Schmelz-Dentin-Fraktur inzisal ohne Pulpaeröffnung, Sensibilität positiv",
              "Zahn 21: perkussionsempfindlich, nicht gelockert, keine Fraktur, Sensibilität positiv",
              "übrige Frontzähne unauffällig",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahmen 11 und 21)", wert: ["keine Wurzelfrakturen", "keine Alveolarfortsatzfraktur"] },
          { label: "Diagnose", wert: ["Schmelz-Dentin-Fraktur an Zahn 11", "Konkussion an Zahn 21"] },
          { label: "Therapie", wert: ["Aufbaufüllung 11 mit Komposit in Säure-Ätz-Technik", "Einschleifen der Okklusion zur Entlastung von 21"] },
          {
            label: "Procedere",
            wert: ["Sensibilitätskontrollen 11 und 21 in 4 Wochen und nach 3 Monaten", "weiche Kost für eine Woche"],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE_TRAUMA,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Weiß, 39 Jahre)", weight: 1 },
      { id: "hergang", label: "Unfallhergang: heute Vormittag beim Fußballspielen mit dem Sohn gestürzt, mit oberen Schneidezähnen aufgeschlagen; Stück von 11 abgebrochen", weight: 2 },
      { id: "schmerz", label: "Schmerzen im Frontzahnbereich, stärker beim Kauen/Zubeißen, in Ruhe geringer; keine Schmerzmittel", weight: 2 },
      { id: "neuro", label: "Bewusstlosigkeit, Erbrechen, Schwindel und Schwarzwerden vor Augen verneint", weight: 2 },
      { id: "vorerkrankung", label: "arterielle Hypertonie mit Ramipril 5 mg (1-0-0)", weight: 2 },
      { id: "allergie", label: "Katzenhaarallergie", weight: 1 },
      { id: "noxen", label: "Nichtraucher, gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: Oberlippe geschwollen, Fraktur 11 ohne Pulpaeröffnung, Konkussion 21, Röntgen ohne Fraktur", weight: 2 },
      { id: "therapie", label: "Therapie: Kompositaufbau 11, Einschleifen zur Entlastung von 21", weight: 2 },
      { id: "procedere", label: "Procedere: Sensibilitätskontrollen 11/21, weiche Kost", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-frontzahntrauma-11.mp3",
    sprecher: { Zahnarzt: "Iapetus", Patient: "Achird" },
    sprechweise: {
      Zahnarzt: "Zahnarzt Mitte fünfzig, gelassen und freundlich, leicht väterlich, normales Tempo, nicht übertrieben deutlich",
      Patient:
        "Mann Ende dreißig, Familienvater, noch etwas aufgewühlt und genervt über sich selbst; Lippe geschwollen, dadurch leicht verwaschene Aussprache; erzählt lebhaft, umgangssprachlich",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Herr Weiß. Sie haben am Telefon gesagt, es war ein Unfall?" },
      { sprecher: "Patient", text: "Ja, genau. Heute Vormittag. Ich hab mit meinem Sohn im Garten Fußball gespielt, und dann … bin ich übers Tor gestolpert. Voll aufs Gesicht.", stil: "lebhaft, ärgerlich über sich selbst" },
      { sprecher: "Zahnarzt", text: "Autsch. Und dabei sind Sie mit den Zähnen aufgeschlagen?" },
      { sprecher: "Patient", text: "Mit den oberen Schneidezähnen, ja. Und rechts, da ist ein Stück abgebrochen. Mein Sohn hat sich totgelacht. [lacht kurz] Ich nicht so." },
      { sprecher: "Zahnarzt", text: "Haben Sie Schmerzen?" },
      { sprecher: "Patient", text: "Vorne, ja. Beim Zubeißen ist es richtig unangenehm. In Ruhe geht's." },
      { sprecher: "Zahnarzt", text: "Haben Sie eine Schmerztablette genommen?" },
      { sprecher: "Patient", text: "Nee, noch nicht." },
      { sprecher: "Zahnarzt", text: "Waren Sie nach dem Sturz kurz weg, also bewusstlos?" },
      { sprecher: "Patient", text: "Nein, gar nicht." },
      { sprecher: "Zahnarzt", text: "Übelkeit, Erbrechen, Schwindel? Wurde Ihnen schwarz vor Augen?" },
      { sprecher: "Patient", text: "Nee. Nichts. Mir geht's sonst gut, wirklich." },
      { sprecher: "Zahnarzt", text: "Gut. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Bluthochdruck. Da nehm ich Ramipril. Fünf Milligramm. Morgens.", stil: "die Dosis „fünf Milligramm“ klar aussprechen, nicht verändern" },
      { sprecher: "Zahnarzt", text: "Sonst noch Medikamente?" },
      { sprecher: "Patient", text: "Nein." },
      { sprecher: "Zahnarzt", text: "Allergien?" },
      { sprecher: "Patient", text: "Gegen Katzenhaare. Deshalb haben wir 'nen Hund. [lacht kurz]" },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Nee, hab ich nie." },
      { sprecher: "Zahnarzt", text: "Und Alkohol?" },
      { sprecher: "Patient", text: "Gelegentlich mal 'n Glas Wein." },
      { sprecher: "Zahnarzt", text: "Wie alt sind Sie, Herr Weiß?" },
      { sprecher: "Patient", text: "Neununddreißig." },
      { sprecher: "Zahnarzt", text: "Danke. Dann schauen wir uns das jetzt genau an, und ich mache Röntgenbilder von den Frontzähnen." },
      { sprecher: "Patient", text: "Okay. Hoffentlich kann man das wieder hinkriegen." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Weiß, 39 Jahre alt, der sich nach einem Sturz mit einer Fraktur des Zahns 11 in unserer Praxis vorstellte.

Der Patient berichtete, heute Vormittag beim Fußballspielen mit seinem Sohn gestolpert und mit den oberen Schneidezähnen aufgeschlagen zu sein. Dabei sei an einem oberen rechten Schneidezahn ein Stück abgebrochen. Seit dem Unfall bestünden Schmerzen im Frontzahnbereich, die sich beim Zubeißen verstärkten und in Ruhe geringer seien. Schmerzmittel habe er nicht eingenommen. Bewusstlosigkeit, Übelkeit, Erbrechen, Schwindel und Schwarzwerden vor Augen wurden verneint.

Vorerkrankungen:
Es bestehe eine arterielle Hypertonie, die mit Ramipril 5 mg (1-0-0) behandelt werde. Weitere Medikamente nehme der Patient nicht ein. Es bestehe eine Katzenhaarallergie. Der Patient sei Nichtraucher und trinke gelegentlich Alkohol.

Klinische Untersuchung:
Extraoral zeigte sich eine Schwellung der Oberlippe ohne Wunden; die Kiefergelenke waren unauffällig. Intraoral zeigte sich an Zahn 11 eine inzisale Schmelz-Dentin-Fraktur ohne Pulpaeröffnung bei positiver Sensibilität. Der Zahn 21 war perkussionsempfindlich, jedoch weder gelockert noch frakturiert, und reagierte sensibel. Die übrigen Frontzähne waren unauffällig.

Röntgenbefund (Einzelzahnaufnahmen 11 und 21):
Röntgenologisch zeigten sich weder Wurzelfrakturen noch eine Alveolarfortsatzfraktur.

Diagnose:
Schmelz-Dentin-Fraktur an Zahn 11 sowie Konkussion an Zahn 21.

Therapie:
Der Zahn 11 wurde in Säure-Ätz-Technik mit einer Kompositfüllung aufgebaut. Zur Entlastung des Zahns 21 wurde die Okklusion eingeschliffen.

Procedere:
Sensibilitätskontrollen der Zähne 11 und 21 sind in vier Wochen sowie nach drei Monaten geplant. Dem Patienten wurde empfohlen, für eine Woche weiche Kost zu sich zu nehmen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 7 – Zahnfleischbluten und Zahnlockerungen (chronische Parodontitis)
// ---------------------------------------------------------------------------
export const parodontitis: CaseInput = {
  id: "arztbrief-parodontitis",
  version: 1,
  stationType: "arztbrief",
  title: "Zahnfleischbluten und lockere Zähne",
  untertitel: "Prüfungsfall: chronische Parodontitis, Raucher, Hypertonie (Herr Richter)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Richter",
    abschnitte: [
      patientenInfo("Herr Richter"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "generalisierte Zahnfleischrötung",
              "deutliche Blutungsneigung",
              "mehrere Konkremente",
              "Zahnlockerung Grad III an den Zähnen 31 und 41",
            ],
          },
          { label: "Röntgenbefund (Orthopantomogramm)", wert: "generalisierter horizontaler Knochenabbau" },
          { label: "Diagnose", wert: "chronische Parodontitis" },
          {
            label: "Therapie",
            wert: ["professionelle Zahnreinigung (PZR)", "Mundhygieneunterweisung", "antiinfektiöse Therapie (AIT) geplant"],
          },
          { label: "Procedere", wert: ["regelmäßige Kontrolltermine", "Rauchverzicht empfohlen"] },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Richter, 54 Jahre)", weight: 1 },
      { id: "anlass", label: "seit einigen Tagen Zahnfleischbluten und Schmerzen, zunehmend", weight: 1 },
      { id: "blutung", label: "Blutung beim Essen und Zähneputzen", weight: 1 },
      { id: "begleit", label: "Druckgefühl beim Kauen, einige Zähne locker, Mundgeruch", weight: 2 },
      { id: "vorgeschichte", label: "Kontrolltermine lange vernachlässigt (letzter Besuch vor ca. 5 Jahren)", weight: 1 },
      { id: "vorerkrankung", label: "arterielle Hypertonie mit Ramipril 5 mg (1-0-0)", weight: 2 },
      { id: "allergie", label: "keine Allergien", weight: 1 },
      { id: "noxen", label: "ca. 10 Zigaretten täglich, gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: extraoral unauffällig, Rötung, Blutung, Konkremente, Lockerung Grad III, OPG horizontaler Knochenabbau", weight: 2 },
      { id: "diagnose", label: "Diagnose chronische Parodontitis", weight: 1 },
      { id: "therapie", label: "Therapie: PZR, Mundhygieneunterweisung, AIT geplant", weight: 2 },
      { id: "procedere", label: "Procedere: regelmäßige Kontrollen, Rauchverzicht", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-parodontitis.mp3",
    sprecher: { Zahnarzt: "Aoede", Patient: "Enceladus" },
    sprechweise: {
      Zahnarzt: "Zahnärztin Ende zwanzig, freundlich und zugewandt, etwas schnelleres Tempo, sagt öfter „okay“, nicht übertrieben deutlich",
      Patient:
        "Mann Mitte fünfzig, Handwerker, etwas brummig und kurz angebunden, ein bisschen beschämt wegen der Zähne; nuschelt, verschluckt Endungen, Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Hallo, Herr Richter. Was führt Sie zu uns?" },
      { sprecher: "Patient", text: "Tag. Mein Zahnfleisch blutet. Seit 'n paar Tagen. Und tut auch weh.", stil: "kurz angebunden, brummig" },
      { sprecher: "Zahnarzt", text: "Okay. War das von Anfang an so stark?" },
      { sprecher: "Patient", text: "Nee, erst nur 'n bisschen. Aber wird immer mehr." },
      { sprecher: "Zahnarzt", text: "Wann blutet es denn?" },
      { sprecher: "Patient", text: "Beim Zähneputzen. Und beim Essen auch, wenn ich in 'n Apfel beiß, dann … na ja, sieht man dann." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen sonst noch etwas aufgefallen?" },
      { sprecher: "Patient", text: "Beim Kauen drückt's irgendwie. Und ein paar Zähne, die wackeln. Unten vorne vor allem.", stil: "leiser, beschämt" },
      { sprecher: "Zahnarzt", text: "Okay. Noch etwas?" },
      { sprecher: "Patient", text: "[seufzt] Meine Frau sagt, ich hab Mundgeruch. Ist mir selber auch schon aufgefallen." },
      { sprecher: "Zahnarzt", text: "Wann waren Sie zuletzt beim Zahnarzt?" },
      { sprecher: "Patient", text: "Lange her. Fünf Jahre bestimmt. Ich hab das echt schleifen lassen, ich weiß." },
      { sprecher: "Zahnarzt", text: "Gut, dass Sie jetzt da sind. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Blutdruck. Da nehm ich Ramipril. Fünf Milligramm, morgens." },
      { sprecher: "Zahnarzt", text: "Andere Medikamente?" },
      { sprecher: "Patient", text: "Nee." },
      { sprecher: "Zahnarzt", text: "Allergien?" },
      { sprecher: "Patient", text: "Keine." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Ja. Zehn am Tag so." },
      { sprecher: "Zahnarzt", text: "Und Alkohol?" },
      { sprecher: "Patient", text: "Ab und zu 'n Bier. Nicht viel." },
      { sprecher: "Zahnarzt", text: "Und wie alt sind Sie?" },
      { sprecher: "Patient", text: "Vierundfünfzig." },
      { sprecher: "Zahnarzt", text: "Okay, danke. Dann schaue ich mir Ihr Zahnfleisch jetzt genau an, und wir machen eine Panoramaaufnahme." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Richter, 54 Jahre alt, der sich aufgrund von Zahnfleischbluten und Zahnlockerungen in unserer Praxis vorstellte.

Der Patient berichtete über seit einigen Tagen bestehendes Zahnfleischbluten sowie Schmerzen. Anfangs seien die Beschwerden gering gewesen, hätten sich jedoch zunehmend verstärkt. Beim Essen und Zähneputzen trete vermehrt eine Blutung auf. Zusätzlich bestehe beim Kauen ein Druckgefühl; einige Zähne, vor allem im Unterkieferfrontzahnbereich, fühlten sich locker an. Außerdem habe er einen Foetor ex ore bemerkt. Die zahnärztlichen Kontrolltermine seien längere Zeit vernachlässigt worden; der letzte Zahnarztbesuch liege etwa fünf Jahre zurück.

Vorerkrankungen:
Es bestehe eine arterielle Hypertonie, die mit Ramipril 5 mg (1-0-0) behandelt werde. Weitere Medikamente nehme der Patient nicht ein. Allergien seien nicht bekannt. Er rauche ca. zehn Zigaretten täglich und konsumiere gelegentlich Alkohol.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigten sich eine generalisierte Rötung der Gingiva, eine deutliche Blutungsneigung sowie mehrere Konkremente. Die Zähne 31 und 41 wiesen einen Lockerungsgrad III auf.

Röntgenbefund (Orthopantomogramm):
Röntgenologisch zeigte sich ein generalisierter horizontaler Knochenabbau.

Diagnose:
Chronische Parodontitis.

Therapie:
Es wurden eine professionelle Zahnreinigung sowie eine Mundhygieneunterweisung durchgeführt. Eine antiinfektiöse Therapie ist geplant.

Procedere:
Regelmäßige Kontrolltermine sind vorgesehen. Dem Patienten wurde ein Rauchverzicht empfohlen.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 8 – Schmerzen nach Zahnextraktion (Alveolitis sicca 46)
// ---------------------------------------------------------------------------
export const alveolitis46: CaseInput = {
  id: "arztbrief-alveolitis-46",
  version: 1,
  stationType: "arztbrief",
  title: "Schmerzen fünf Tage nach Zahnentfernung",
  untertitel: "Prüfungsfall: Alveolitis sicca 46, Diabetes, Penicillinallergie, starker Raucher (Herr Zimmermann)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Zimmermann",
    abschnitte: [
      patientenInfo("Herr Zimmermann"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: ["unauffällig", "Lymphknoten nicht tastbar"] },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Alveole 46 weitgehend leer, kein suffizientes Blutkoagel",
              "freiliegender Alveolarknochen, Wundränder gerötet",
              "geringe Sickerblutung",
              "Foetor ex ore",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: ["keine Wurzelreste regio 46", "keine Fremdkörper"] },
          { label: "Diagnose", wert: "Alveolitis sicca regio 46" },
          {
            label: "Therapie",
            wert: [
              "Lokalanästhesie",
              "vorsichtige Spülung der Alveole mit Kochsalzlösung",
              "medikamentöse Einlage (Alveogyl)",
              "Analgesie: Ibuprofen 600 mg max. 3× täglich, zusätzlich Paracetamol 1000 mg bei Bedarf",
            ],
          },
          {
            label: "Procedere",
            wert: ["Kontrolle und Wechsel der Einlage in 2 Tagen", "Rauchverzicht während der Wundheilung", "gute Blutzuckereinstellung"],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Zimmermann, 48 Jahre)", weight: 1 },
      { id: "anlass", label: "Extraktion eines Backenzahns im rechten Unterkiefer vor 5 Tagen, erste Tage unauffällig", weight: 2 },
      { id: "schmerz", label: "seit 2 Tagen zunehmende Schmerzen, ziehend und teilweise stechend, stärker beim Kauen", weight: 2 },
      { id: "begleit", label: "heute erneute leichte Blutung, unangenehmer Geschmack; kein Fieber", weight: 1 },
      { id: "analgetika", label: "Ibuprofen 600 mg mit kaum Wirkung", weight: 1 },
      { id: "vorerkrankung", label: "Diabetes mellitus mit Metformin 1000 mg (1-0-1)", weight: 2 },
      { id: "allergie", label: "Penicillinallergie mit Hautausschlag", weight: 2 },
      { id: "noxen", label: "ca. eine Packung Zigaretten täglich (auch nach der Extraktion), selten Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: leere Alveole 46, freiliegender Knochen, gerötete Wundränder, Foetor; Röntgen ohne Wurzelreste", weight: 2 },
      { id: "therapie", label: "Therapie: LA, Spülung, medikamentöse Einlage, Analgesie", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle/Wechsel in 2 Tagen, Rauchverzicht, Blutzucker", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-alveolitis-46.mp3",
    sprecher: { Zahnarzt: "Autonoe", Patient: "Schedar" },
    sprechweise: {
      Zahnarzt: "Zahnärztin Mitte vierzig, ruhig, freundlich und sachlich, normales Praxistempo, nicht übertrieben deutlich",
      Patient:
        "Mann Ende vierzig, Raucherstimme, rau und etwas heiser; genervt und erschöpft von den Schmerzen, spricht gepresst und mit wenig Mundöffnung, verschluckt Endungen; Alltagsdeutsch",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Herr Zimmermann. Was kann ich für Sie tun?" },
      { sprecher: "Patient", text: "Tag. Mir wurd vor fünf Tagen 'n Backenzahn gezogen. Unten rechts. Und jetzt … [seufzt] geht's mir schlechter als vorher.", stil: "erschöpft, rau" },
      { sprecher: "Zahnarzt", text: "Oh. Wie war es denn direkt nach dem Ziehen?" },
      { sprecher: "Patient", text: "Die ersten Tage war alles okay. Aber seit vorgestern wird's immer schlimmer." },
      { sprecher: "Zahnarzt", text: "Wie fühlen sich die Schmerzen an?" },
      { sprecher: "Patient", text: "Ziehend. Und manchmal sticht's richtig rein. Beim Kauen ganz schlimm." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen sonst etwas aufgefallen?" },
      { sprecher: "Patient", text: "Heute hat's wieder 'n bisschen geblutet. Und ich hab so 'nen ekligen Geschmack im Mund, ständig.", stil: "angewidert" },
      { sprecher: "Zahnarzt", text: "Hatten Sie Fieber?" },
      { sprecher: "Patient", text: "Nee." },
      { sprecher: "Zahnarzt", text: "Haben Sie etwas gegen die Schmerzen genommen?" },
      { sprecher: "Patient", text: "Ibuprofen sechshundert. Hilft aber kaum noch." },
      { sprecher: "Zahnarzt", text: "Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Zucker. Da nehm ich Metformin, tausend. Morgens und abends." },
      { sprecher: "Zahnarzt", text: "Noch andere Medikamente?" },
      { sprecher: "Patient", text: "Nee." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Penicillin. Da hab ich mal so 'n Ausschlag gekriegt, überall rote Flecken." },
      { sprecher: "Zahnarzt", text: "Gut, dass Sie das sagen. Rauchen Sie?" },
      { sprecher: "Patient", text: "Ja … so 'ne Schachtel am Tag. Und ja, ich hab auch nach dem Ziehen geraucht. Ich weiß, ich weiß.", stil: "abwehrend, etwas genervt" },
      { sprecher: "Zahnarzt", text: "Und Alkohol?" },
      { sprecher: "Patient", text: "Selten." },
      { sprecher: "Zahnarzt", text: "Wie alt sind Sie, Herr Zimmermann?" },
      { sprecher: "Patient", text: "Achtundvierzig." },
      { sprecher: "Zahnarzt", text: "Danke. Dann schaue ich mir die Wunde jetzt an und mache ein Röntgenbild." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Zimmermann, 48 Jahre alt, der sich aufgrund von Schmerzen nach einer Zahnextraktion in unserer Praxis vorstellte.

Der Patient berichtete, dass ihm vor fünf Tagen ein Molar im rechten Unterkiefer extrahiert worden sei. Die ersten Tage seien unauffällig gewesen. Seit zwei Tagen bestünden jedoch zunehmende Schmerzen, die überwiegend ziehend und teilweise stechend seien und sich beim Kauen verstärkten. Heute habe die Wunde erneut leicht geblutet. Zudem bestehe ein unangenehmer Geschmack im Mund. Fieber wurde verneint. Die Einnahme von Ibuprofen 600 mg habe kaum Linderung gebracht.

Vorerkrankungen:
Es bestehe ein Diabetes mellitus, der mit Metformin 1000 mg (1-0-1) behandelt werde. Es bestehe eine Penicillinallergie, die sich durch einen Hautausschlag äußere. Der Patient rauche ca. eine Packung Zigaretten täglich, auch nach der Extraktion; Alkohol konsumiere er selten.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig; die Lymphknoten waren nicht tastbar. Intraoral zeigte sich eine weitgehend leere Alveole 46 ohne suffizientes Blutkoagel mit freiliegendem Alveolarknochen und geröteten Wundrändern. Es bestand eine geringe Sickerblutung. Zudem fiel ein Foetor ex ore auf.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigten sich regio 46 weder Wurzelreste noch Fremdkörper.

Diagnose:
Alveolitis sicca regio 46.

Therapie:
In Lokalanästhesie wurde die Alveole vorsichtig mit Kochsalzlösung gespült. Anschließend wurde eine medikamentöse Einlage (Alveogyl) eingebracht. Zur Analgesie wurden Ibuprofen 600 mg bis zu dreimal täglich und zusätzlich Paracetamol 1000 mg bei Bedarf empfohlen.

Procedere:
Eine Kontrolle mit Wechsel der Einlage ist in zwei Tagen geplant. Der Patient wurde angewiesen, während der Wundheilung auf das Rauchen zu verzichten und auf eine gute Blutzuckereinstellung zu achten.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 10 – Fortgeschrittene Parodontitis, Zahnlockerung unter Apixaban
// ---------------------------------------------------------------------------
export const lockerung36Apixaban: CaseInput = {
  id: "arztbrief-lockerung-36-apixaban",
  version: 1,
  stationType: "arztbrief",
  title: "Wackelnder Backenzahn unter Blutverdünner",
  untertitel: "Prüfungsfall: fortgeschrittene Parodontitis an 36, Extraktion unter Apixaban (Herr Vogt)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Vogt",
    abschnitte: [
      patientenInfo("Herr Vogt"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Zahn 36: Lockerungsgrad III, Sondierungstiefen bis 9 mm, Blutung auf Sondierung",
              "Furkationsbefall Grad III an Zahn 36",
              "Vitalitätsprobe 36: positiv",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: "Knochenabbau an Zahn 36 bis in das apikale Drittel" },
          { label: "Diagnose", wert: "fortgeschrittene Parodontitis an Zahn 36, nicht erhaltungswürdig" },
          {
            label: "Therapie",
            wert: [
              "Extraktion 36 in Lokalanästhesie unter fortgeführter Apixaban-Einnahme",
              "lokale Blutstillung: Kollagenvlies, Naht, Kompression mit Tranexamsäure-getränktem Tupfer",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "Kontrolle morgen, Nahtentfernung nach 7–10 Tagen",
              "Parodontalbefund und systematische Parodontitistherapie des Restgebisses",
              "Planung der prothetischen Versorgung regio 36",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Vogt, 48 Jahre)", weight: 1 },
      { id: "anlass", label: "seit gestern leichte, pochende Schmerzen an einem Molaren im linken Unterkiefer", weight: 1 },
      { id: "charakter", label: "Verstärkung beim Essen/Kauen links; Zahn fühlt sich locker an", weight: 2 },
      { id: "negativ", label: "keine Beschwerden bei Mundöffnung und Schlucken; keine Schmerzmittel", weight: 1 },
      { id: "vorerkrankung", label: "Vorhofflimmern mit Apixaban 5 mg (1-0-1)", weight: 2 },
      { id: "medikation", label: "keine weiteren regelmäßigen Medikamente", weight: 1 },
      { id: "allergie", label: "keine Allergien", weight: 1 },
      { id: "noxen", label: "Nichtraucher, gelegentlich ein Glas Wein", weight: 1 },
      { id: "befunde", label: "Befunde: Lockerung Grad III, ST bis 9 mm, Furkation III, Röntgen Knochenabbau bis apikal", weight: 2 },
      { id: "therapie", label: "Therapie: Extraktion 36 unter Apixaban mit lokaler Blutstillung (Kollagen, Naht, Tranexamsäure)", weight: 2 },
      { id: "procedere", label: "Procedere: Kontrolle, Nahtentfernung, PA-Therapie, prothetische Planung", weight: 1 },
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-lockerung-36-apixaban.mp3",
    sprecher: { Zahnarzt: "Leda", Patient: "Algenib" },
    sprechweise: {
      Zahnarzt: "Zahnärztin um die vierzig, ruhig und freundlich, normales Tempo, nicht übertrieben deutlich",
      Patient:
        "Mann Ende vierzig, Büroangestellter, höflich und etwas besorgt, spricht normal schnell mit kleinen Pausen und „ähm“, Alltagsdeutsch, nicht überdeutlich",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Guten Tag, Herr Vogt. Was führt Sie zu uns?" },
      { sprecher: "Patient", text: "Guten Tag. Ähm, seit gestern hab ich leichte Schmerzen an 'nem Backenzahn. Unten links." },
      { sprecher: "Zahnarzt", text: "Wie würden Sie die Schmerzen beschreiben?" },
      { sprecher: "Patient", text: "So pochend. Nicht schlimm, aber beim Essen merk ich's. Wenn ich links kaue." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen noch etwas aufgefallen?" },
      { sprecher: "Patient", text: "Ja, der Zahn … der wackelt irgendwie. Der bewegt sich, wenn ich mit der Zunge dranstoße.", stil: "besorgt" },
      { sprecher: "Zahnarzt", text: "Haben Sie Beschwerden beim Mundöffnen oder beim Schlucken?" },
      { sprecher: "Patient", text: "Nee, das geht alles." },
      { sprecher: "Zahnarzt", text: "Haben Sie etwas gegen die Schmerzen eingenommen?" },
      { sprecher: "Patient", text: "Nein, noch nicht. Ist ja auszuhalten." },
      { sprecher: "Zahnarzt", text: "Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Ich hab Vorhofflimmern. Seit zwei Jahren ungefähr." },
      { sprecher: "Zahnarzt", text: "Nehmen Sie dafür einen Blutverdünner?" },
      { sprecher: "Patient", text: "Ja, Apixaban. Fünf Milligramm. Morgens und abends.", stil: "die Zahl „fünf“ deutlich sagen" },
      { sprecher: "Zahnarzt", text: "Mhm. Und sonst noch Medikamente?" },
      { sprecher: "Patient", text: "Nein, sonst nichts regelmäßig." },
      { sprecher: "Zahnarzt", text: "Allergien?" },
      { sprecher: "Patient", text: "Nein, keine." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie? Trinken Sie Alkohol?" },
      { sprecher: "Patient", text: "Rauchen nicht. Und ab und zu mal 'n Glas Wein, abends." },
      { sprecher: "Zahnarzt", text: "Wie alt sind Sie?" },
      { sprecher: "Patient", text: "Achtundvierzig." },
      { sprecher: "Zahnarzt", text: "Danke. Dann untersuche ich den Zahn jetzt und mache ein Röntgenbild." },
      { sprecher: "Patient", text: "Muss der raus? Wegen dem Blutverdünner hab ich da ein bisschen Bammel.", stil: "unsicher" },
      { sprecher: "Zahnarzt", text: "Das schauen wir uns gleich gemeinsam an. Keine Sorge, das bekommen wir gut hin." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Vogt, 48 Jahre alt, der sich aufgrund von Schmerzen und einer Lockerung eines Zahns im linken Unterkiefer in unserer Praxis vorstellte.

Der Patient berichtete über seit gestern bestehende leichte Schmerzen an einem Molaren im linken Unterkiefer. Die Beschwerden seien pochend und verstärkten sich beim Essen bzw. Kauen auf der linken Seite. Zudem habe er das Gefühl, dass sich der Zahn bewege. Beschwerden beim Öffnen des Mundes oder beim Schlucken bestünden nicht. Schmerzmittel habe er nicht eingenommen.

Vorerkrankungen:
Es bestehe ein Vorhofflimmern, das mit Apixaban 5 mg (1-0-1) behandelt werde. Weitere regelmäßige Medikamente nehme der Patient nicht ein. Allergien seien nicht bekannt. Er sei Nichtraucher und trinke gelegentlich ein Glas Wein.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigte sich an Zahn 36 ein Lockerungsgrad III mit Sondierungstiefen bis 9 mm und positiver Blutung auf Sondierung. Zudem lag ein Furkationsbefall Grad III vor. Die Vitalitätsprobe an Zahn 36 war positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich an Zahn 36 ein Knochenabbau bis in das apikale Drittel.

Diagnose:
Fortgeschrittene Parodontitis an Zahn 36; der Zahn ist nicht erhaltungswürdig.

Therapie:
Der Zahn 36 wurde in Lokalanästhesie unter fortgeführter Apixaban-Einnahme extrahiert. Zur lokalen Blutstillung wurden ein Kollagenvlies eingebracht, die Wunde vernäht und eine Kompression mit einem Tranexamsäure-getränkten Tupfer durchgeführt.

Procedere:
Eine Kontrolle ist für morgen, die Nahtentfernung nach sieben bis zehn Tagen geplant. Anschließend sind die Erhebung eines Parodontalbefundes und eine systematische Parodontitistherapie des Restgebisses vorgesehen. Die prothetische Versorgung regio 36 wird im Verlauf geplant.

Mit freundlichen kollegialen Grüßen`,
  },
};

// ---------------------------------------------------------------------------
// Fall 11 – Schmerzen, Zahnlockerung und Zahnfleischbluten im Oberkiefer links
// ---------------------------------------------------------------------------
export const parodontitis26: CaseInput = {
  id: "arztbrief-parodontitis-26",
  version: 1,
  stationType: "arztbrief",
  title: "Zahnfleischbluten und lockerer Zahn oben links",
  untertitel: "Prüfungsfall: lokalisierte Parodontitis an 26, Raucher seit 20 Jahren (Herr Becker)",
  durationSeconds: 22 * 60,
  sheet: {
    kurzbeschreibung: KURZ,
    gespraechssituation: situation("einen Patienten"),
    gespraechspartner: "Herr Becker",
    abschnitte: [
      patientenInfo("Herr Becker"),
      {
        titel: "Durchgeführte Maßnahmen",
        eintraege: [
          { label: "Extraorale Untersuchung", wert: "unauffällig" },
          {
            label: "Intraorale Untersuchung",
            wert: [
              "Gingiva regio 26 gerötet und geschwollen",
              "Zahn 26: Sondierungstiefen bis 6 mm, Blutung auf Sondierung, subgingivale Konkremente",
              "Zahn 26: Lockerungsgrad I, Furkationsbefall Grad I bukkal",
              "Vitalitätsprobe 26: positiv, Perkussion leicht positiv",
            ],
          },
          { label: "Röntgenbefund (Einzelzahnaufnahme)", wert: "horizontaler Knochenabbau von ca. 30 % regio 26 mit beginnendem Furkationsbefall" },
          { label: "Diagnose", wert: "lokalisierte Parodontitis an Zahn 26" },
          {
            label: "Therapie",
            wert: [
              "supragingivale Reinigung und Politur",
              "Mundhygieneunterweisung (Interdentalbürsten)",
              "Chlorhexidin-Mundspüllösung 0,12 % zweimal täglich für eine Woche",
            ],
          },
          {
            label: "Procedere",
            wert: [
              "vollständiger Parodontalbefund in 2 Wochen",
              "danach antiinfektiöse Therapie (AIT)",
              "Raucherentwöhnung empfohlen",
            ],
          },
        ],
      },
    ],
    aufgabentext: AUFGABE,
  },
  rubric: {
    checklist: [
      FORM,
      { id: "daten", label: "Name und Alter (Herr Becker, 45 Jahre)", weight: 1 },
      { id: "anlass", label: "seit einigen Tagen leichte Schmerzen an einem Molaren im linken Oberkiefer", weight: 1 },
      { id: "charakter", label: "hauptsächlich beim Kauen/Zubeißen, in Ruhe kaum Beschwerden", weight: 2 },
      { id: "begleit", label: "Zahn etwas locker; Zahnfleisch blutet gelegentlich beim Putzen und fühlt sich gereizt an", weight: 2 },
      { id: "vorerkrankung", label: "arterielle Hypertonie, gut eingestellt, mit Ramipril 5 mg (1-0-0)", weight: 2 },
      { id: "allergie", label: "keine Allergien", weight: 1 },
      { id: "noxen", label: "ca. 10 Zigaretten täglich seit 20 Jahren (ca. 10 Packungsjahre), gelegentlich Alkohol", weight: 1 },
      { id: "befunde", label: "Befunde: Rötung, ST bis 6 mm, BOP, Konkremente, Lockerung I, Furkation I, Vitalität positiv, Röntgen", weight: 2 },
      { id: "therapie", label: "Therapie: supragingivale Reinigung, MHU, CHX 0,12 %", weight: 2 },
      { id: "procedere", label: "Procedere: Parodontalbefund, AIT, Raucherentwöhnung", weight: 1 },
      FACHSPRACHE,
      KONJUNKTIV,
    ],
    fachbegriffe: [],
  },
  vocabulary: [],
  beispiele: [],
  arztbrief: {
    audioSrc: "/audio/arztbrief-parodontitis-26.mp3",
    sprecher: { Zahnarzt: "Erinome", Patient: "Zubenelgenubi" },
    sprechweise: {
      Zahnarzt: "Zahnärztin Anfang dreißig, freundlich und locker, zügiges Tempo, nicht übertrieben deutlich",
      Patient:
        "Mann Mitte vierzig, entspannt und etwas flapsig, spielt die Beschwerden herunter; redet schnell und beiläufig, Alltagsdeutsch mit „irgendwie“, „halt“",
    },
    dialog: [
      { sprecher: "Zahnarzt", text: "Hallo, Herr Becker. Was kann ich für Sie tun?" },
      { sprecher: "Patient", text: "Hi. Also, ist nix Dramatisches. Oben links, so 'n Backenzahn, der tut seit ein paar Tagen 'n bisschen weh.", stil: "locker, spielt es herunter" },
      { sprecher: "Zahnarzt", text: "Wann merken Sie das denn?" },
      { sprecher: "Patient", text: "Beim Kauen halt. Wenn ich draufbeiße. Wenn ich nix mache, merk ich eigentlich kaum was." },
      { sprecher: "Zahnarzt", text: "Ist Ihnen noch etwas aufgefallen?" },
      { sprecher: "Patient", text: "Irgendwie fühlt der sich 'n bisschen locker an. Nicht viel, aber … ja." },
      { sprecher: "Zahnarzt", text: "Blutet das Zahnfleisch manchmal?" },
      { sprecher: "Patient", text: "Ja, beim Zähneputzen, da an der Stelle. Nicht immer, aber ab und zu. Fühlt sich auch so gereizt an." },
      { sprecher: "Zahnarzt", text: "Okay. Haben Sie Vorerkrankungen?" },
      { sprecher: "Patient", text: "Bluthochdruck. Aber der ist gut eingestellt, sagt mein Hausarzt." },
      { sprecher: "Zahnarzt", text: "Was nehmen Sie dafür?" },
      { sprecher: "Patient", text: "Ramipril. Fünf Milligramm, morgens." },
      { sprecher: "Zahnarzt", text: "Haben Sie Allergien?" },
      { sprecher: "Patient", text: "Nee." },
      { sprecher: "Zahnarzt", text: "Rauchen Sie?" },
      { sprecher: "Patient", text: "Ja … zehn am Tag. Seit zwanzig Jahren ungefähr. [lacht kurz] Ich weiß, was jetzt kommt." },
      { sprecher: "Zahnarzt", text: "[lacht kurz] Dazu sag ich gleich noch was. Und Alkohol?" },
      { sprecher: "Patient", text: "Gelegentlich. Am Wochenende mal." },
      { sprecher: "Zahnarzt", text: "Wie alt sind Sie, Herr Becker?" },
      { sprecher: "Patient", text: "Fünfundvierzig." },
      { sprecher: "Zahnarzt", text: "Gut, danke. Dann schaue ich mir den Zahn und das Zahnfleisch jetzt an." },
    ],
    musterbrief: `Sehr geehrte Kolleginnen und Kollegen,

wir berichten über unseren gemeinsamen Patienten Herrn Becker, 45 Jahre alt, der sich aufgrund von Schmerzen, einer Zahnlockerung und Zahnfleischbluten im linken Oberkiefer in unserer Praxis vorstellte.

Der Patient berichtete über seit einigen Tagen bestehende leichte Schmerzen an einem Molaren im linken Oberkiefer. Die Beschwerden träten hauptsächlich beim Kauen bzw. Zubeißen auf; in Ruhe bestünden kaum Beschwerden. Zusätzlich habe er das Gefühl, dass der Zahn etwas locker sei. Beim Zähneputzen blute das Zahnfleisch in diesem Bereich gelegentlich und fühle sich gereizt an.

Vorerkrankungen:
Es bestehe eine gut eingestellte arterielle Hypertonie, die mit Ramipril 5 mg (1-0-0) behandelt werde. Allergien seien nicht bekannt. Der Patient rauche seit etwa 20 Jahren ca. zehn Zigaretten täglich, was etwa zehn Packungsjahren entspricht, und trinke gelegentlich Alkohol.

Klinische Untersuchung:
Die extraorale Untersuchung war unauffällig. Intraoral zeigte sich eine gerötete und geschwollene Gingiva regio 26. An Zahn 26 wurden Sondierungstiefen bis 6 mm mit Blutung auf Sondierung sowie subgingivale Konkremente festgestellt. Der Zahn wies einen Lockerungsgrad I und einen bukkalen Furkationsbefall Grad I auf. Die Vitalitätsprobe war positiv, die Perkussion leicht positiv.

Röntgenbefund (Einzelzahnaufnahme):
Röntgenologisch zeigte sich regio 26 ein horizontaler Knochenabbau von ca. 30 % mit beginnendem Furkationsbefall.

Diagnose:
Lokalisierte Parodontitis an Zahn 26.

Therapie:
Es wurden eine supragingivale Reinigung mit Politur sowie eine Mundhygieneunterweisung mit Instruktion zur Anwendung von Interdentalbürsten durchgeführt. Zudem wurde eine Spülung mit Chlorhexidin-Lösung 0,12 % zweimal täglich für eine Woche empfohlen.

Procedere:
In zwei Wochen ist die Erhebung eines vollständigen Parodontalbefundes geplant, im Anschluss eine antiinfektiöse Therapie. Dem Patienten wurde eine Raucherentwöhnung empfohlen.

Mit freundlichen kollegialen Grüßen`,
  },
};

export const ARZTBRIEF_PRUEFUNG = [
  schwellungUkRechts,
  schwellung36,
  schwellung16,
  frontzahntrauma21,
  frontzahntrauma11,
  parodontitis,
  alveolitis46,
  lockerung36Apixaban,
  parodontitis26,
];
