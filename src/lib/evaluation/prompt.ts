import { STATION_LABELS, type Case } from "@/lib/cases/schema";

export function buildEvaluationPrompt(c: Case, liveTranscript: string): string {
  const isPatientTalk = c.actorCard.role === "patient";
  const checklist = c.rubric.checklist.map((i) => `- id "${i.id}": ${i.label}`).join("\n");

  return `Du bist ein erfahrenes Bewertungsteam (approbierte:r Zahnärzt:in + DaF-Expert:in) für die Fachsprachenprüfung Zahnmedizin auf Niveau C1 (GER), angelehnt an das FaMed-Format. Bewerte ausschließlich die SPRACHKOMPETENZ des Prüflings, nicht das zahnmedizinische Fachwissen.

## Situation
Station: ${STATION_LABELS[c.stationType]}
Aufgabe an den Prüfling:
${c.candidateSheet.kurzbeschreibung}
${c.candidateSheet.aufgaben.map((a) => `- ${a}`).join("\n")}

## Material
1. Audioaufnahme: Mikrofonspur des Prüflings (Zahnarzt/Zahnärztin). Die Stimme des Gesprächspartners kann leise im Hintergrund zu hören sein – bewerte nur den Prüfling.
2. Automatisches Live-Transkript beider Seiten (kann Erkennungsfehler enthalten und glättet Fehler; im Zweifel gilt die Audioaufnahme):
"""
${liveTranscript || "(kein Live-Transkript vorhanden)"}
"""

## Bewertungskriterien (je 0–100 Punkte, Bestehensgrenze 60)
- textsorte: Sind die typischen Merkmale der Gesprächsart erfüllt (Aufbau, Vollständigkeit, Gesprächsphasen, Abschluss)?
- pragmatik: Gesprächssteuerung, Eingehen auf den Gesprächspartner, Höflichkeit, Empathie, Rückversicherung, Flüssigkeit, ${
    isPatientTalk
      ? "Verwendung von LAIENSPRACHE (Fachbegriffe vermeiden oder erklären)"
      : "angemessene FACHSPRACHE, knapp und präzise"
  }.
- strukturell: Grammatik, Wortschatz, Satzbau, Aussprache und Verständlichkeit.
- global: Gesamteindruck im Sinne von C1: spontan, fließend, ohne häufige Wortsuche, klar und strukturiert, Missverständnisse ausgeschlossen.

Sei realistisch und streng wie in der echten Prüfung. 60 Punkte bedeuten „knapp C1“. Begründe mit konkreten Beispielen aus dem Gespräch.

## Checkliste der Aufgabenerfüllung
Markiere jeden Punkt als "erfuellt", "teilweise" oder "fehlt" und gib die id exakt so zurück:
${checklist}

## Fachbegriffe, die ${isPatientTalk ? "dem Laien erklärt werden müssen" : "korrekt verwendet werden sollten"}
${c.rubric.fachbegriffe.join(", ")}
${
  isPatientTalk
    ? "Liste unter nichtErklaerteFachbegriffe jeden Fachbegriff, den der Prüfling gegenüber dem Patienten benutzt hat, ohne ihn verständlich zu erklären – auch solche, die nicht in dieser Liste stehen."
    : "nichtErklaerteFachbegriffe bleibt im Kollegengespräch leer."
}

## Ausgabe
- Erstelle zuerst ein wortgetreues Transkript der Äußerungen des Prüflings aus der Audioaufnahme (mit "ähm", Abbrüchen und Fehlern, nichts verbessern).
- Fehlerliste: die wichtigsten, typischen Fehler; Korrektur und Erklärung auf Deutsch in einfacher Sprache.
- Alle Texte auf Deutsch. Antworte nur mit dem JSON-Objekt.`;
}
