import { STATIONS, sheetAlsText, type Case } from "@/lib/cases/schema";
import { BOGEN_KEYS, leitfragen } from "./leitfragen";
import { briefKennzahlen, gespraechsKennzahlen, zaehleWoerter } from "./regeln";

function checklistText(c: Case): string {
  return c.rubric.checklist.map((i) => `- id "${i.id}": ${i.label}`).join("\n");
}

function bogenText(c: Case): string {
  const f = leitfragen(c.stationType);
  return BOGEN_KEYS.map((k) => `- ${k}: ${f[k]}`).join("\n");
}

const RAHMEN = `## So wird in der FaMed bewertet
- Ein unabhängiges Team (approbierte:r Zahnärzt:in + DaF-Expert:in) bewertet später nur die Aufnahme bzw. den Text. Bewertet wird ausschließlich die Sprachkompetenz auf Niveau C1 (GER) – kein Fachwissen.
- Jede Situation wird nach vier Kriterienclustern bewertet (je 0–100 Punkte). Eine Station ist ab 60 % bestanden; ein Ausgleich zwischen den Stationen ist nicht möglich.
- Inhaltlich zählt nur, ob die Aufgaben aus dem Aufgabentext erfüllt und die Informationen korrekt weitergegeben wurden (Genauigkeit). Ob eine Therapie fachlich ideal ist, spielt keine Rolle.`;

function baender(schriftlich: boolean): string {
  const fluss = schriftlich ? "sehr gut lesbar, souverän verknüpft" : "mühelos flüssig, ohne Wortsuche";
  const fluss2 = schriftlich ? "gut lesbar, meist sauber verknüpft" : "flüssig mit seltener Wortsuche";
  const fluss3 = schriftlich ? "stellenweise holprig oder aneinandergereiht" : "gelegentliche Wortsuche, Pausen oder Umformulierungen";
  const fluss4 = schriftlich ? "oft unverbunden, schwer lesbar" : "spürbare Wortsuche, Abbrüche, lange Pausen";
  return `## Bandbeschreibungen (gelten für jedes Cluster)
- 90–100: sicher über C1. Nahezu fehlerfrei, ${fluss}, klar gegliedert, sehr präziser Wortschatz.
- 75–89: solides C1. Wenige Fehler, die das Verständnis nie stören; ${fluss2}; Aufgaben vollständig erfüllt.
- 60–74: knapp C1 (bestanden). Mehrere Fehler, ${fluss3}, aber durchgehend verständlich; Aufgaben im Wesentlichen erfüllt.
- 45–59: B2-Niveau (nicht bestanden). Häufige Fehler, die teils das Verständnis stören; ${fluss4}; Struktur lückenhaft oder Aufgaben nur teilweise erfüllt.
- 25–44: deutlich unter C1. Viele grundlegende Fehler, oft schwer verständlich; Aufgaben großteils nicht erfüllt.
- 0–24: kaum bewertbar (fast keine eigene Sprachproduktion).
Nutze die ganze Skala und vermeide reflexartige Werte um 60–70. Bewerte so streng und so fair wie ein geschultes Prüferteam: kein Wohlwollen, aber auch keine Abzüge für Dinge, die in der echten Prüfung nicht zählen (z. B. ein Akzent, der das Verständnis nicht stört, oder eine fachlich andere, aber vertretbare Entscheidung).`;
}

const CLUSTER_ZUORDNUNG = `## Die vier Cluster und die Leitfragen
- textsorte (Angemessenheit der Textsorte) ↔ Leitfrage „aufgabenerfuellung“: Sind die typischen Merkmale dieser Gesprächsart bzw. Textsorte erfüllt – Aufbau, Phasen, Vollständigkeit laut Aufgabentext, Abschluss?
- pragmatik (sozio-/pragmalinguistische Angemessenheit) ↔ Leitfrage „angemessenheit“: Adressatengerechtes Register, Gesprächssteuerung, Eingehen auf das Gegenüber, Höflichkeit, Flexibilität.
- strukturell (strukturelle Korrektheit) ↔ Leitfrage „fehler“: Grammatik, Wortschatz, Satzbau, Aussprache bzw. Orthografie – wie häufig sind Fehler, und stören sie das Verständnis?
- global (globale Gesamtbewertung) ↔ Leitfragen „klarheit“ und „gesamteindruck“: Klar, flüssig, strukturiert, präzise, Missverständnisse ausgeschlossen?`;

const FEHLER_ZAEHLEN = `- fehlerAnzahl: Zähle ALLE strukturellen Fehler (Grammatik, Satzbau, Wortschatz, Orthografie/Zeichensetzung bzw. Aussprachefehler, die ein Wort verfälschen) im gesamten Material, nicht nur die in der Fehlerliste. Ein Fehler pro falscher Form; Füllwörter, Selbstkorrekturen und reine Stilfragen zählen nicht.`;

const FAKTEN = `## Faktenfehler
Liste unter faktenfehler nur EINDEUTIG falsch übertragene Angaben im Vergleich zu Aufgabenblatt bzw. Gespräch: falscher Zahn oder falsche Seite, falsches Medikament, falsche Dosierung oder Einnahme, falsche Allergie, falsche Zeitangabe. „zitat“ ist der exakte Wortlaut des Prüflings. Fehlende Angaben gehören in die Checkliste, nicht hierher. Im Zweifel (z. B. vermutlicher Erkennungsfehler) nicht aufnehmen.`;

const FESTE_REGELN_GESPRAECH = `## Feste Regeln (werden zusätzlich automatisch angewendet – berücksichtige sie schon in deinen Punkten)
- Weniger als 60 % der Checkliste erfüllt → textsorte höchstens 55; unter 40 % → textsorte höchstens 40 und global höchstens 55.
- Patientenvorstellung: eine falsch übertragene Angabe → textsorte höchstens 65; zwei oder mehr → textsorte höchstens 50, global höchstens 55.
- Sehr wenig eigene Sprachproduktion (unter ca. 250 Wörtern in der Situation) → alle Cluster höchstens 50.
- Fehlerdichte (fehlerAnzahl pro 100 gesprochene Wörter): über 2,5 → strukturell höchstens 74; über 4 → höchstens 59; über 6 → höchstens 44.`;

const STATION_FOKUS: Record<Case["stationType"], string> = {
  anamnese: `Anamnesegespräch mit einem Patienten (Laie). Erwartet: Begrüßung und Vorstellung, offene Einstiegsfrage, strukturierte Erhebung (aktuelle Beschwerden, Vorerkrankungen, Medikation, Allergien, Noxen), offene und geschlossene Fragen, Raum für den Patienten, Empathie; danach Röntgenbefund, Verdachtsdiagnose und nächste Schritte in LAIENSPRACHE erklären und Rückfragen verständlich beantworten; Abschluss. Fachbegriffe gegenüber dem Patienten vermeiden oder sofort erklären.`,
  aufklaerung: `Aufklärungsgespräch mit einem Patienten (Laie). Der Prüfling FÜHRT das Gespräch und spricht den größten Teil der Zeit; die Rolle hört überwiegend zu und stellt nur wenige (1–4) einfache Rückfragen. Erwartet: Begrüßung und Einstieg (Anlass, Befinden), verständliche Erklärung von Ablauf, allgemeinen und speziellen Risiken, Risiken der Lokalanästhesie sowie Verhalten vor und nach dem Eingriff – vollständig laut Aufgabentext, in sinnvoller Reihenfolge, in LAIENSPRACHE; Verständnis rückversichern („Haben Sie das so weit verstanden?“); auf Sorgen eingehen; Rückfragen korrekt und verständlich beantworten; Abschluss mit Gelegenheit für Fragen.`,
  vorstellung: `Patientenvorstellung bei einer erfahrenen Kollegin / einem erfahrenen Kollegen. Der Prüfling stellt den Fall ZUSAMMENHÄNGEND und selbstständig vor, ohne dass die Kollegin oder der Kollege alles erfragen muss; die Rolle hört zu und stellt erst danach wenige (1–4) kurze Rückfragen. Erwartet: logische Gliederung (Patient:in mit Name, Alter, Vorstellungsgrund bzw. Verdachtsdiagnose → aktuelle Anamnese → Vorerkrankungen, Medikation, Allergien, Risikofaktoren → Befunde/Diagnostik → Diagnose → Medikation → Procedere), angemessene FACHSPRACHE, knapp und präzise (prägnant), Zahnangaben im FDI-Schema, Zahlen und Dosierungen fehlerfrei, Patientenangaben gern in indirekter Rede, Rückfragen präzise beantworten. Ablesen ganzer Stichpunktlisten ohne Satzbau ist ein Mangel.`,
  arztbrief: "",
};

export function buildEvaluationPrompt(c: Case, liveTranscript: string): string {
  const isPatientTalk = c.actorCard?.role === "patient";
  const k = gespraechsKennzahlen(liveTranscript);
  const kennzahlen = liveTranscript
    ? `- Wörter des Prüflings (Live-Transkript, Näherung): ca. ${k.woerterPruefling}
- Redeanteil des Prüflings: ${k.redeanteil ?? "?"} %
- Fragen der Rolle (Fragezeichen im Transkript): ${k.rollenfragen}`
    : "- (kein Live-Transkript vorhanden – nur die Audioaufnahme zählt)";

  return `Du bist ein erfahrenes Bewertungsteam (approbierte:r Zahnärzt:in + DaF-Expert:in) für die FaMed Zahnmedizin (Fachsprachenprüfung, Niveau C1 nach GER). Bewerte ausschließlich die SPRACHKOMPETENZ des Prüflings, nicht das zahnmedizinische Fachwissen.

${RAHMEN}

## Station
${STATIONS[c.stationType].label} (${STATIONS[c.stationType].bereich}), Dauer ${STATIONS[c.stationType].minuten} Minuten.
${STATION_FOKUS[c.stationType]}

## Aufgabenblatt des Prüflings
${sheetAlsText(c.sheet)}

## Material
1. Audioaufnahme: Mikrofonspur des Prüflings (Zahnarzt/Zahnärztin). Die Stimme des Gesprächspartners kann leise im Hintergrund zu hören sein – bewerte nur den Prüfling. Die Audioaufnahme ist maßgeblich (Aussprache, Flüssigkeit, Pausen, Selbstkorrekturen).
2. Automatisches Live-Transkript beider Seiten (kann Erkennungsfehler enthalten und glättet Fehler; im Zweifel gilt die Audioaufnahme):
"""
${liveTranscript || "(kein Live-Transkript vorhanden)"}
"""
3. Automatische Messwerte:
${kennzahlen}
Hat sich die Rolle ungewöhnlich oft eingemischt, bewerte den Prüfling dafür nicht schlechter.

## Leitfragen der Bewertenden (beantworte jede unter bewertungsbogen)
${bogenText(c)}

${CLUSTER_ZUORDNUNG}

${baender(false)}

${FESTE_REGELN_GESPRAECH}

## Checkliste der Aufgabenerfüllung
Markiere jeden Punkt als "erfuellt", "teilweise" oder "fehlt" und gib die id exakt so zurück; "beleg" ist ein kurzes Zitat des Prüflings:
${checklistText(c)}

${FAKTEN}

## Fachbegriffe
${
  isPatientTalk
    ? `Liste unter nichtErklaerteFachbegriffe jeden Fachbegriff, den der Prüfling gegenüber dem Patienten benutzt hat, ohne ihn verständlich zu erklären (Beispiele: ${c.rubric.fachbegriffe.join(", ")}). Nur Wörter, die der Prüfling wirklich gesagt hat; alltagsbekannte Wörter wie Wurzelbehandlung, Betäubung, Füllung, Krone oder Röntgenbild zählen nicht. Nicht erklärte Fachbegriffe senken pragmatik.`
    : "nichtErklaerteFachbegriffe bleibt im Kollegengespräch leer. Bewerte stattdessen unter Fehler unpräzise oder umgangssprachliche Formulierungen (Kategorie Register)."
}

## Ausgabe
- Erstelle zuerst ein wortgetreues Transkript der Äußerungen des Prüflings aus der Audioaufnahme (mit „ähm“, Abbrüchen und Fehlern, nichts verbessern).
- Begründungen und Bogen-Antworten mit konkreten Beispielen aus dem Gespräch.
- Fehlerliste: die wichtigsten, typischen Fehler; Korrektur und Erklärung auf Deutsch in einfacher Sprache.
${FEHLER_ZAEHLEN}
- Alle Texte auf Deutsch. Antworte nur mit dem JSON-Objekt.`;
}

/** Entfernt Regieanweisungen für die Sprachausgabe wie „[seufzt]“. */
export function ohneRegie(text: string): string {
  return text.replace(/\s*\[[^\]]*\]\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function buildLetterEvaluationPrompt(c: Case, letter: string): string {
  const a = c.arztbrief!;
  const dialog = a.dialog.map((d) => `${d.sprecher}: ${ohneRegie(d.text)}`).join("\n");
  const k = briefKennzahlen(letter);
  return `Du bist ein erfahrenes Bewertungsteam (approbierte:r Zahnärzt:in + DaF-Expert:in) für die FaMed Zahnmedizin (Fachsprachenprüfung, Niveau C1 nach GER), schriftliche Station „Arztbrief“ (22 Minuten inklusive Anhören des Gesprächs). Bewerte ausschließlich die SPRACHKOMPETENZ, nicht das Fachwissen.

${RAHMEN}

## Aufgabenblatt
${sheetAlsText(c.sheet)}

## Das Anamnesegespräch, das der Prüfling gehört hat (Wortlaut)
"""
${dialog}
"""

## Der Arztbrief des Prüflings
"""
${letter}
"""

## Automatische Messwerte
- Wörter: ${k.woerter} (Musterbrief: ca. ${zaehleWoerter(a.musterbrief)})
- Zeilen mit Stichpunkten/Aufzählungszeichen: ${k.stichpunktZeilen}
- Anrede vorhanden: ${k.hatAnrede ? "ja" : "nein"} · Grußformel vorhanden: ${k.hatGruss ? "ja" : "nein"}
- Verben im Anamnese-Teil (grobe Zählung): ${k.konjunktiv}× Konjunktiv I, ${k.indikativ}× Indikativ Präsens

## Musterlösung (Referenz, nicht die einzig richtige Lösung)
"""
${a.musterbrief}
"""

## Korrekturregeln nach dem FaMed-Musterbrief
1. Aufbau: Anrede („Sehr geehrte Kolleginnen und Kollegen,“ o. Ä.) → Einleitungssatz mit Name, Alter und Vorstellungsgrund („Wir berichten über unsere gemeinsame Patientin …, die sich aufgrund … in unserer Praxis vorstellte.“) → aktuelle Anamnese → Vorerkrankungen/Medikation/Allergien/Noxen → Klinische Untersuchung → Röntgenbefund → Therapie → Procedere → Grußformel. Zwischenüberschriften sind erwünscht, aber kein Muss.
2. Alles in GANZEN SÄTZEN. Stichpunkte aus dem Aufgabenblatt müssen in vollständige Sätze umgeformt werden; Stichpunktlisten im Brief sind ein Fehler (Textsorte).
3. Distanz: Alles, was die Patientin/der Patient erzählt hat, steht in indirekter Rede, vorzugsweise im Konjunktiv I („Die Schmerzen seien pochend.“, „Sie leide unter …“, „Relevante Allergien seien nicht bekannt.“) oder mit Einleitung („Die Patientin berichtete, seit … unter … zu leiden.“). Indikativ bei Patientenaussagen = Fehler (Register).
4. Eigene Befunde und Maßnahmen stehen im INDIKATIV Präteritum, gern im Passiv oder mit „erfolgte“: „Die extraorale Untersuchung war unauffällig.“, „Intraoral zeigte sich …“, „Therapeutisch erfolgte …“, „Anschließend wurde … eingebracht.“ Konjunktiv bei eigenen Befunden ist ebenfalls ein Fehler.
5. Procedere mit Zukunftsbezug: „… ist in einer Woche geplant.“ / „Wir empfehlen …“.
6. Fachsprache: Umgangssprachliche Patientenwörter in Fachbegriffe übertragen (z. B. „Bluthochdruck“ → arterielle Hypertonie, „wird immer schlimmer“ → progredient, „unten links“ → linker Unterkiefer/regio 3x). Zahnangaben im FDI-Schema.
7. Textverknüpfung: Konnektoren und Relativsätze (zudem, darüber hinaus, jedoch, anschließend, die …) statt aneinandergereihter Hauptsätze.
8. Vollständigkeit und Korrektheit: Alle Informationen aus Gespräch UND Aufgabenblatt. Falsch übernommene Fakten (Zahn, Seite, Dosierung, Einnahmeschema, Allergie, Zeitangaben) sind schwerwiegende Fehler, weil sie die Patientensicherheit gefährden.
9. Schwere der Fehler: Fehler, die das Verständnis beeinträchtigen, wiegen schwerer als kleine Rechtschreibfehler. Einzelne Tippfehler sind kein Grund zum Nichtbestehen; viele Orthografie- und Zeichensetzungsfehler senken strukturell deutlich.

## Leitfragen der Bewertenden (beantworte jede unter bewertungsbogen)
${bogenText(c)}

${CLUSTER_ZUORDNUNG}
Für den Arztbrief bedeutet das: textsorte = Regeln 1, 2, 5, 8 (Briefform, Gliederung, ganze Sätze, Vollständigkeit); pragmatik = Regeln 3, 4, 6 (Distanz/indirekte Rede, Indikativ bei eigenen Befunden, Fachsprache, sachlicher Stil); strukturell = Grammatik, Orthografie, Zeichensetzung, Wortschatz, Satzbau, Textverknüpfung (Regel 7); global = Gesamteindruck: klar, strukturiert, präzise, keine Missverständnisse.

${baender(true)}

## Feste Regeln (werden zusätzlich automatisch angewendet – berücksichtige sie schon in deinen Punkten)
- Weniger als 60 % der Checkliste erfüllt → nicht bestanden, textsorte höchstens 55.
- Eine falsch übertragene Angabe → textsorte höchstens 65; zwei oder mehr → textsorte höchstens 50, global höchstens 55, nicht bestanden.
- Drei oder mehr Stichpunkt-Zeilen → textsorte höchstens 50. Fehlende Anrede oder Grußformel → textsorte höchstens 70.
- Brief kürzer als die Hälfte des Musterbriefs → alle Cluster höchstens 50.
- Patientenaussagen überwiegend im Indikativ → pragmatik höchstens 55; oft im Indikativ → höchstens 70.
- Fehlerdichte (fehlerAnzahl pro 100 Wörter): über 2 → strukturell höchstens 74; über 3,5 → höchstens 59; über 5 → höchstens 44.

## Checkliste der Vollständigkeit
Markiere jeden Punkt als "erfuellt", "teilweise" oder "fehlt" und gib die id exakt so zurück; "beleg" ist ein kurzes Zitat aus dem Brief:
${checklistText(c)}

${FAKTEN}

## Ausgabe
- Fehlerliste: die wichtigsten Fehler mit Zitat, Korrektur, Kategorie und kurzer Erklärung auf Deutsch.
- Für Kategorie verwende: Grammatik, Wortschatz, Satzbau, Orthografie (Rechtschreibung, Zeichensetzung), Register (Fach-/Umgangssprache, fehlende Distanz). „Aussprache“ darf NICHT vorkommen.
${FEHLER_ZAEHLEN}
- wortgetreuesTranskript: gib den Brief unverändert zurück.
- nichtErklaerteFachbegriffe und ausspracheHinweise: leere Listen.
- fluessigkeit: 2–3 Sätze zu Lesefluss, Satzverknüpfung und Struktur des Briefs.
- Alle Texte auf Deutsch. Antworte nur mit dem JSON-Objekt.`;
}
