import { STATIONS, sheetAlsText, type Case } from "@/lib/cases/schema";

function checklistText(c: Case): string {
  return c.rubric.checklist.map((i) => `- id "${i.id}": ${i.label}`).join("\n");
}

const STATION_FOKUS: Record<Case["stationType"], string> = {
  anamnese:
    "Anamnesegespräch: strukturierte Erhebung, offene und geschlossene Fragen, Raum für den Patienten, respektvolle Atmosphäre, LAIENSPRACHE beim Röntgenbefund, bei Verdachtsdiagnose und nächsten Schritten.",
  aufklaerung:
    "Aufklärungsgespräch: Ablauf, Risiken, Lokalanästhesie, prä- und postoperatives Verhalten vollständig vermitteln; LAIENSPRACHE statt Fachbegriffen; Verständnis rückversichern; Empathie bei Bedenken.",
  vorstellung:
    "Patientenvorstellung bei einer Kollegin/einem Kollegen: angemessene FACHSPRACHE, knapp und präzise, logische Reihenfolge (Daten, Anamnese, Diagnostik, Medikation, Procedere), Zahlen/Zahnangaben/Dosierungen fehlerfrei, Rückfragen präzise.",
  arztbrief: "",
};

export function buildEvaluationPrompt(c: Case, liveTranscript: string): string {
  const isPatientTalk = c.actorCard?.role === "patient";
  return `Du bist ein erfahrenes Bewertungsteam (approbierte:r Zahnärzt:in + DaF-Expert:in) für die FaMed Zahnmedizin (Fachsprachenprüfung, Niveau C1 nach GER). Bewerte ausschließlich die SPRACHKOMPETENZ des Prüflings, nicht das zahnmedizinische Fachwissen.

## Station
${STATIONS[c.stationType].label} (${STATIONS[c.stationType].bereich})
Schwerpunkt: ${STATION_FOKUS[c.stationType]}

## Aufgabenblatt des Prüflings
${sheetAlsText(c.sheet)}

## Material
1. Audioaufnahme: Mikrofonspur des Prüflings (Zahnarzt/Zahnärztin). Die Stimme des Gesprächspartners kann leise im Hintergrund zu hören sein – bewerte nur den Prüfling.
2. Automatisches Live-Transkript beider Seiten (kann Erkennungsfehler enthalten und glättet Fehler; im Zweifel gilt die Audioaufnahme):
"""
${liveTranscript || "(kein Live-Transkript vorhanden)"}
"""

## Bewertungskriterien (je 0–100 Punkte, Bestehensgrenze 60)
- textsorte: Sind die typischen Merkmale dieser Gesprächsart erfüllt (Aufbau, Vollständigkeit laut Aufgabenblatt, Gesprächsphasen, Abschluss)?
- pragmatik: Gesprächssteuerung, Eingehen auf den Gesprächspartner, Höflichkeit, Empathie, Rückversicherung, Flüssigkeit, ${
    isPatientTalk ? "LAIENSPRACHE (Fachbegriffe vermeiden oder erklären)" : "angemessene FACHSPRACHE, knapp und präzise"
  }.
- strukturell: Grammatik, Wortschatz, Satzbau, Aussprache und Verständlichkeit.
- global: Gesamteindruck im Sinne von C1: spontan, fließend, ohne häufige Wortsuche, klar und strukturiert, Missverständnisse ausgeschlossen.

Sei realistisch und streng wie in der echten Prüfung. 60 Punkte bedeuten „knapp C1“. Begründe mit konkreten Beispielen aus dem Gespräch.

## Checkliste der Aufgabenerfüllung
Markiere jeden Punkt als "erfuellt", "teilweise" oder "fehlt" und gib die id exakt so zurück:
${checklistText(c)}

## Fachbegriffe
${
  isPatientTalk
    ? `Liste unter nichtErklaerteFachbegriffe jeden Fachbegriff, den der Prüfling gegenüber dem Patienten benutzt hat, ohne ihn verständlich zu erklären (Beispiele: ${c.rubric.fachbegriffe.join(", ")}).`
    : "nichtErklaerteFachbegriffe bleibt im Kollegengespräch leer. Bewerte stattdessen unter Fehler unpräzise oder umgangssprachliche Formulierungen (Kategorie Register)."
}

## Ausgabe
- Erstelle zuerst ein wortgetreues Transkript der Äußerungen des Prüflings aus der Audioaufnahme (mit „ähm“, Abbrüchen und Fehlern, nichts verbessern).
- Fehlerliste: die wichtigsten, typischen Fehler; Korrektur und Erklärung auf Deutsch in einfacher Sprache.
- Alle Texte auf Deutsch. Antworte nur mit dem JSON-Objekt.`;
}

/** Entfernt Regieanweisungen für die Sprachausgabe wie „[seufzt]“. */
export function ohneRegie(text: string): string {
  return text.replace(/\s*\[[^\]]*\]\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function buildLetterEvaluationPrompt(c: Case, letter: string): string {
  const a = c.arztbrief!;
  const dialog = a.dialog.map((d) => `${d.sprecher}: ${ohneRegie(d.text)}`).join("\n");
  return `Du bist ein erfahrenes Bewertungsteam (approbierte:r Zahnärzt:in + DaF-Expert:in) für die FaMed Zahnmedizin (Fachsprachenprüfung, Niveau C1 nach GER), schriftliche Station „Arztbrief“. Bewerte ausschließlich die SPRACHKOMPETENZ, nicht das Fachwissen.

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
9. Schwere der Fehler: Fehler, die das Verständnis beeinträchtigen, wiegen schwerer als kleine Rechtschreibfehler.

## Bewertungskriterien (je 0–100 Punkte, Bestehensgrenze 60)
- textsorte: Merkmale eines Arztbriefs (Regeln 1, 2, 5, 8): Briefform, Gliederung, ganze Sätze, Vollständigkeit aller Informationen aus Gespräch und Aufgabenblatt.
- pragmatik: Regeln 3, 4, 6: Distanz bei Patientenaussagen, Indikativ/Passiv bei eigenen Befunden, Fachsprache statt Umgangssprache, sachlicher Stil, Adressatenbezug.
- strukturell: Grammatik, Orthografie, Zeichensetzung, Wortschatz, Satzbau, Textverknüpfung (Regel 7).
- global: Gesamteindruck im Sinne von C1: klar, strukturiert, präzise, keine Missverständnisse.

Sei realistisch und streng wie in der echten Prüfung. Vergleiche Inhalt und Formulierungen mit der Musterlösung, akzeptiere aber jede sprachlich und fachlich korrekte Alternative.
Obergrenzen: Fehlt eine Allergie oder wurde eine Dosierung, ein Medikament, ein Zahn oder eine Seite falsch übernommen, ist textsorte höchstens 45. Stehen Befunde oder Therapie als Stichpunkte, ist textsorte höchstens 50. Werden Patientenaussagen überwiegend im Indikativ wiedergegeben, ist pragmatik höchstens 50. Ein Brief, bei dem weniger als 60 % der Checkliste erfüllt sind, ist insgesamt nicht bestanden (global unter 60).

## Checkliste der Vollständigkeit
Markiere jeden Punkt als "erfuellt", "teilweise" oder "fehlt" und gib die id exakt so zurück; "beleg" ist ein kurzes Zitat aus dem Brief:
${checklistText(c)}

## Ausgabe
- Fehlerliste: die wichtigsten Fehler mit Zitat, Korrektur, Kategorie und kurzer Erklärung auf Deutsch.
- Für Kategorie verwende: Grammatik, Wortschatz, Satzbau, Orthografie (Rechtschreibung, Zeichensetzung), Register (Fach-/Umgangssprache, fehlende Distanz). „Aussprache“ darf NICHT vorkommen.
- wortgetreuesTranskript: gib den Brief unverändert zurück.
- nichtErklaerteFachbegriffe und ausspracheHinweise: leere Listen.
- fluessigkeit: 2–3 Sätze zu Lesefluss, Satzverknüpfung und Struktur des Briefs.
- Alle Texte auf Deutsch. Antworte nur mit dem JSON-Objekt.`;
}
