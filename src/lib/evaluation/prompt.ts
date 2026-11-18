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

export function buildLetterEvaluationPrompt(c: Case, letter: string): string {
  const a = c.arztbrief!;
  const dialog = a.dialog.map((d) => `${d.sprecher}: ${d.text}`).join("\n");
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

## Bewertungskriterien (je 0–100 Punkte, Bestehensgrenze 60)
- textsorte: Merkmale eines Arztbriefs: Briefform, Gliederung (Anlass, Anamnese, Befunde, Therapie, Procedere), ganze Sätze, Vollständigkeit aller Informationen aus Gespräch und Aufgabenblatt.
- pragmatik: Fachsprache statt Umgangssprache, angemessene Distanz bei Patientenaussagen (Konjunktiv I / indirekte Rede), sachlicher Stil, Adressatenbezug (Kollege/Kollegin).
- strukturell: Grammatik, Orthografie, Zeichensetzung, Wortschatz, Satzbau.
- global: Gesamteindruck im Sinne von C1: klar, strukturiert, präzise, keine Missverständnisse.

Prüfe besonders: Wurden Fakten falsch übernommen (z. B. Zahn, Dosierung, Allergie)? Das ist ein schwerwiegender Fehler.

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
