# FaMed-Zahnmedizin-Simulator – Planungsdokument

Stand: 17.11.2026 (v2: Gemini statt Claude/Azure, 0 € in der Entwicklung) · Status: Entwurf zur Abstimmung, noch kein Code

---

## 1. Ergebnis der Recherche

### 1.1 Was die FaMed ist (Quelle: famed-test.de, Prüfungsordnung RLP, Übungstest Zahnmedizin 02/2026)

- Digitale Fachsprachenprüfung (Niveau C1) für ausländische Ärzt:innen. Betreiber: **digiFORT Gesundheit und Pflege GmbH**. Entwickelt wurde sie an der LMU (Pilotprojekt SAM, Prof. Roche, Prof. Fischer).
- **FaMed Zahnmedizin** gibt es seit 2025/26, zunächst für **Rheinland-Pfalz**. Prüfungszentren: Mainz, Kassel, Nürnberg. Gebühr 530 €. Voraussetzung ist ein B2-Zertifikat.
- **OSCE-Format.** Man sitzt allein vor einem Computer mit Headset, sieht Aufgabentext, Unterlagen und Gesprächspartner auf dem Bildschirm und spricht nur mit **Schauspieler:innen**. Alles wird **aufgezeichnet**. Bewertet wird später **nur anhand der Audioaufnahme**. Das Bewerterteam besteht aus einem approbierten Arzt und einem DaF-Experten.
- Die Fälle werden aus einem **Pool zufällig** gezogen. Die Reihenfolge der mündlichen Stationen variiert. Die **schriftliche Station kommt immer am Schluss**. Zwischen den Stationen gibt es 1 Minute Pause.
- **Fachwissen wird nicht bewertet**, nur Sprachkompetenz. Alle Fakten stehen auf dem Bildschirm.

### 1.2 Prüfungsaufbau Zahnmedizin (aus dem offiziellen Übungstest)

| Station | Situation | Zeit | Aufgabe | Worauf es ankommt |
|---|---|---|---|---|
| **Zahnarzt-Patienten-Kommunikation** | Anamnesegespräch | 11 Min. | Beschwerden und med. Vorgeschichte erheben, **Röntgenbild interpretieren**, Verdachtsdiagnose stellen, nächste Schritte erklären, auf Rückfragen eingehen | Laiensprache, Struktur, Raum für den Patienten, Empathie |
| | Aufklärungsgespräch | 11 Min. | Ablauf, allgemeine und spezielle Risiken, Lokalanästhesie, prä- und postoperatives Verhalten erklären (z. B. Wurzelkanalbehandlung) | Fachbegriffe in Laiensprache übersetzen, Verständnis rückversichern, auf Ängste eingehen |
| **Zahnarzt-Zahnarzt-Kommunikation** | Patientenvorstellung 1 | 11 Min. | Fall einem erfahrenen Kollegen vorstellen: Patientendaten, Anamnese, Diagnostik, Medikation, Procedere (z. B. Parodontitis) | Fachsprache, knapp und präzise, Rückfragen beantworten |
| | Patientenvorstellung 2 | 11 Min. | wie oben (z. B. Wurzellängsfraktur 36, Marcumar, Endokarditisprophylaxe) | ditto, Zahlen und Dosierungen fehlerfrei |
| **Schriftlich** | Arztbrief | 22 Min. | Video eines Anamnesegesprächs (pausierbar, spulbar) → Arztbrief in ganzen Sätzen, dazu vorgegebene Befunde, Therapie und Procedere | Konjunktiv I / indirekte Rede, Fachsprache, Vollständigkeit, Orthografie |

Weitere Rahmenbedingungen:
- **Rollen im Übungstest:** TN (Prüfling), S (Schauspieler mit verdeckten Infos und typischen Rückfragen), B (Bewerter mit Leitfragen).
- **Typisch für Zahnmedizin:** FDI-Zahnschema (16, 36, 46 mesial …), Indizes (PSI, API), OPG- und Einzelzahnaufnahmen, Dosierschemata (1-0-1), Antikoagulation und Endokarditisprophylaxe.

### 1.3 Bewertung (Prüfungsordnung § 3, § 11)

Jede Situation wird unabhängig bewertet, nach diesen Kriterienclustern:
1. **Angemessenheit der Textsorte**: Sind die typischen Merkmale von Gespräch bzw. Arztbrief erfüllt?
2. **Sozio- und pragmalinguistische Angemessenheit**: Gesprächssteuerung, Eingehen auf den Adressaten, Höflichkeit, Flüssigkeit
3. **Strukturelle Korrektheit**: Aussprache, Grammatik, Wortschatz, Orthografie
4. **Globale Gesamtbewertung**

**Bestehensregel:** In **jedem der drei Bereiche mindestens 60 %**, ohne Ausgleich zwischen den Bereichen. Grundlage sind die GER-C1-Deskriptoren: Flüssigkeit, Wortschatz, Spektrum, Aussprache, Fehler, Kohärenz, Orthografie, Genauigkeit.

### 1.4 Konsequenzen für die App

1. **Die Prüfung ist bereits digital.** Eine gute Web-Simulation kann die Prüfung fast 1:1 nachbilden: Bildschirm, Headset, Timer, Gesprächspartner, Unterlagen. Das ist unser großer Vorteil.
2. **Bewertet wird nur das Audio.** Unsere Auswertung muss deshalb auf dem gesprochenen Wort aufbauen, inklusive Häsitationen, Pausen und Aussprache, und nicht auf einem „geglätteten“ Text.
3. **Die Schauspieler-Rolle ist das Herzstück.** Ein KI-Patient muss wie ein echter Laie reagieren. Er gibt Infos nur auf Nachfrage preis, stellt Rückfragen und **fragt nach, wenn der Prüfling Fachbegriffe benutzt** („Was ist denn eine Pulpitis?“). So wird Laiensprache automatisch trainiert.
4. **Urheberrecht:** Die Fälle im Übungstest gehören digiFORT. Wir **übernehmen sie nicht**, sondern schreiben **eigene Fälle im selben Format**. App-Name und Branding dürfen nicht nach offizieller FaMed aussehen. Ein Disclaimer „nicht offiziell, keine Verbindung zu digiFORT“ ist Pflicht.

---

## 2. Produktvision

> Eine Web-App, in der Zahnärzt:innen die FaMed-Zahnmedizin realistisch per Mikrofon durchspielen: mit KI-Patienten und KI-Kollegen, echtem Prüfungstiming und anschließend einem detaillierten Feedback entlang der offiziellen Bewertungskriterien.

### Zielgruppe
- Zahnärzt:innen aus Drittstaaten und der EU mit B2/C1, die die FSP Zahnmedizin brauchen
- Sekundär: Sprachschulen und Lehrkräfte (später B2B)

### Kernnutzen
1. **Realistische Prüfungssimulation**: komplette Prüfung mit ca. 70 Minuten, Zufallsfällen, harten Timern und ohne Hilfen
2. **Gezieltes Training**: einzelne Stationen mit Hilfen (Redemittel, Pause, Wiederholung)
3. **Ehrliches Feedback**: geschätzte Punktzahl pro Station, konkrete Fehler mit Korrektur, Fortschritt über die Zeit

---

## 3. Funktionsumfang

### 3.1 Modi

| Modus | Beschreibung |
|---|---|
| **Prüfungssimulation** | Alle 5 Situationen am Stück. Reihenfolge wie im Original: mündliche Stationen zufällig, Arztbrief am Ende. 1 Min. Pause dazwischen. Keine Pausen-Taste, keine Hilfen. Auswertung am Ende. |
| **Stationstraining** | Eine Situation frei wählen (z. B. nur Aufklärung). Optional: Timer aus, Redemittel-Panel, „Patient wiederholen lassen“, Sofort-Feedback. |
| **Drills (Phase 3)** | Kurze Sprechübungen à 2–5 Min.: Fachbegriff → Laienerklärung, FDI-Zahnangaben sprechen („Zahn sechsunddreißig“), Dosierungen sprechen („eins-null-eins“), Arztbrief-Sätze in den Konjunktiv I setzen, Redemittel für Rückversicherung und Empathie. |

### 3.2 Ablauf einer Prüfungssimulation (Screens)

1. **Technikcheck**: Mikrofonzugriff, Pegelanzeige, Kopfhörer-Test (TTS-Probesatz), Browsercheck, Hinweis auf eine ruhige Umgebung
2. **Instruktion**: Ablauf, Zeiten, Regeln (wie am Prüfungstag)
3. **Station** (Layout wie in der Prüfung):
   - links: **Aufgabenblatt** (Kurzbeschreibung, Patienteninformationen, Aufgabentext, ggf. Röntgenbild oder Patienteninformationsblatt)
   - rechts: **Gesprächspartner** (Avatar oder Porträt mit Sprech-Animation), Live-Status („hört zu“ / „spricht“), optional Live-Transkript (in der Prüfung aus)
   - oben: **Countdown 11:00**, bei 1:00 Warnung, bei 0:00 harter Abbruch
4. **Pause** 1:00 mit Countdown, danach automatisch weiter
5. **Arztbrief**: Medienplayer mit Pause und Spulen, Info-Panel mit Befunden, Textfeld **ohne** Rechtschreibprüfung und Autokorrektur, Timer 22:00
6. **Abgabe → Auswertung** (läuft im Hintergrund, Fortschrittsanzeige)
7. **Ergebnisbericht**: pro Station Punktzahl nach Kriterienclustern, Bestanden/Nicht bestanden mit 60-%-Schwelle, Transkript mit markierten Fehlern, Audio-Wiedergabe der eigenen Antworten, Top-3-Verbesserungsfelder

### 3.3 Feedback (das Alleinstellungsmerkmal)

Pro mündlicher Situation:
- **Inhaltliche Vollständigkeit** (Checkliste je Fall): z. B. Anamnese – Leitsymptom, Lokalisation, Schmerzcharakter, Auslöser, Dauer, Schmerzmittel, Vorerkrankungen, Medikamente, Allergien, Noxen, letzter Zahnarztbesuch, Röntgeninterpretation, Verdachtsdiagnose, nächste Schritte. Das ist kein Fachwissen, sondern zeigt, ob die Aufgabe erfüllt wurde.
- **Laiensprache-Check** (Patientengespräche): nicht erklärte Fachbegriffe werden markiert und ein laiengerechter Alternativvorschlag gemacht.
- **Fachsprache-Check** (Kollegengespräche): Umgangssprache, Ungenauigkeiten, falsch gesprochene Zahlen, Zähne und Dosierungen.
- **Grammatik und Wortschatz**: Fehlerliste mit Original → Korrektur → kurzer Erklärung (Kasus, Verbstellung, Genus …).
- **Flüssigkeit**: Sprechtempo (Wörter/Min.), Anteil und Länge der Pausen, Füllwörter („ähm“), Selbstkorrekturen. Wird aus Wort-Zeitstempeln berechnet.
- **Aussprache**: Markierung auffällig ausgesprochener Wörter mit Hinweis. Gemini hört dafür die Originalaufnahme an; das ist eine qualitative Einschätzung.
- **Gesprächsführung**: Begrüßung und Vorstellung, Struktur, Rückversicherung („Haben Sie das soweit verstanden?“), Empathie, Zusammenfassung, Abschluss.

Arztbrief:
- Vollständigkeit aller Fakten aus Video und Befunden, Konjunktiv I bei Patientenaussagen, ganze Sätze, Fachsprache, Orthografie und Zeichensetzung, Struktur.
- Zusätzlich ein **Musterbrief** zum Vergleich.

**Wichtig – Ehrlichkeit:** Alle Punktzahlen sind **Schätzungen** und werden auch so gekennzeichnet („geschätztes Niveau“). Wir kalibrieren sie gegen menschliche Bewertungen (siehe 7.3).

---

## 4. Technische Architektur

### 4.0 Grundsatz: 0 € in der Entwicklungsphase

Alles läuft über den **kostenlosen Google-Gemini-API-Key** (Google AI Studio) und kostenlose Werkzeuge. Laut offizieller Preisseite (Stand 11/2026) sind diese Gemini-Modellfamilien in der kostenlosen Stufe enthalten:

| Zweck | Kostenlose Modelle (Kandidaten) |
|---|---|
| Live-Sprachgespräch (Audio rein → Audio raus) | `gemini-3.8-live`, `gemini-3.1-flash-live-preview`, `gemini-2.5-flash-native-audio-preview-12-2025` |
| Text, Bewertung, Audio-Analyse | `gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite` |
| Wortgetreue Transkription | `gemini-3.5-transcribe` |
| Sprachausgabe (TTS, auch mit 2 Sprechern) | `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts` |

Die Modellnamen stehen nicht fest im Code, sondern in der `.env`. Google benennt Modelle häufig um.

**Zwei Haken der kostenlosen Stufe, die wir bewusst in Kauf nehmen:**
1. **Ratenlimits:** Google veröffentlicht keine festen Zahlen. Die tatsächlichen Limits zeigt AI Studio je Key an. Für dich als Entwickler und eine Handvoll Testnutzer reicht das, nicht aber für einen öffentlichen Start. Die App fängt Limit-Fehler (HTTP 429) sauber ab („Bitte kurz warten“).
2. **Datennutzung:** In der kostenlosen Stufe darf Google die Inhalte (also Sprachaufnahmen und Transkripte) **zur Verbesserung seiner Produkte verwenden**. Zum Entwickeln und Testen mit eigenen Daten ist das ok. **Vor einem echten Start mit fremden Nutzer:innen** muss man auf die bezahlte Stufe wechseln oder transparent um Einwilligung bitten (siehe Abschnitt 6).

### 4.1 Überblick

```
Browser (Next.js/React)
 ├─ Mikrofon (16 kHz PCM) ──WebSocket──► Gemini Live API
 │      ◄── Audio (24 kHz) der Rolle + Transkripte (Nutzer & Rolle)
 │      eingebaut: Spracherkennung, Antwort, Sprachausgabe,
 │                 Pausenerkennung (VAD), Unterbrechen (Barge-in)
 ├─ MediaRecorder → eigene Spur lokal aufnehmen (Wiedergabe + Auswertung)
 ├─ Web Audio API → Pausen/Sprechzeit lokal messen (Flüssigkeit, kostenlos)
 └─ UI: Aufgabenblatt, Timer, Avatar, Arztbrief-Editor
        │  (HTTPS)
Next.js-Server (Route Handlers, Node) – hält den API-Key geheim
 ├─ /api/live-token  → kurzlebiges Ephemeral Token für die Live-Sitzung
 ├─ /api/evaluate    → Aufnahme + Transkript an Gemini Flash → Bewertung als JSON
 └─ (Phase 4) /api/attempts → Versuche serverseitig speichern
Datenhaltung
 ├─ Phase 0–3: lokal im Browser (IndexedDB), kein Login → 0 €
 └─ Phase 4:   z. B. Supabase Free Tier (EU)
Inhalte
 ├─ content/cases/*.json  (versionierte Fälle, Zod-validiert)
 └─ public/ (Röntgenbilder, vorab erzeugte Arztbrief-Audios)
```

### 4.2 Technologie-Entscheidungen

| Bereich | Wahl | Kosten | Begründung |
|---|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | 0 € | Eine Codebasis für UI und kleine Server-Routen |
| UI | **Tailwind CSS + shadcn/ui** | 0 € | schnell, sauber, gut zugänglich |
| KI-SDK | **`@google/genai`** (offizielles Google-Gen-AI-SDK) | 0 € | Live API, Text, Audio, TTS in einem Paket |
| Gespräch (STT + Rolle + Stimme) | **Gemini Live API** | 0 € (Free Tier) | Eine Verbindung statt drei Diensten, sehr niedrige Latenz, eingebaute Pausenerkennung und Unterbrechung, liefert Transkripte beider Seiten |
| Bewertung | **Gemini Flash** mit JSON-Schema (`responseSchema`) | 0 € | hört sich die **Originalaufnahme** an, kann daher auch Aussprache und Flüssigkeit beurteilen |
| Wortgetreues Transkript | **Gemini Transcribe** oder Flash mit der Anweisung „verbatim inkl. ähm, Abbrüche, Fehler“ | 0 € | Fehler dürfen nicht weggeglättet werden |
| Arztbrief-Audio | **Gemini TTS (Multi-Speaker)**, einmal vorab erzeugt | 0 € | Zahnarzt- und Patientenstimme im Dialog |
| Flüssigkeitsmetriken | **Web Audio API** im Browser | 0 € | Pausen, Sprechanteil, Tempo: deterministisch, ohne KI |
| Speicherung | **IndexedDB** (Browser) | 0 € | kein Server, kein Login nötig |
| Validierung | **Zod** | 0 € | Fallschema, KI-Ausgaben prüfen |
| Hosting | lokal (`localhost`), später **Vercel Hobby** oder **Cloudflare Pages** | 0 € | Vercel Hobby ist nur für nicht-kommerzielle Projekte, für den Testbetrieb also ok |

Die KI-Anbindung kapseln wir hinter Interfaces (`ConversationEngine`, `Evaluator`). So kann später ein anderer Anbieter dazukommen, ohne die App umzubauen.

> **Warum nicht die eingebaute Browser-Spracherkennung (Web Speech API)?** Sie ist zwar auch kostenlos, läuft aber nur in Chrome und Edge zuverlässig und **korrigiert Fehler stillschweigend**. Außerdem bräuchte man dann noch eine eigene Sprachausgabe. Die Gemini Live API erledigt alles in einem Schritt und ist ebenfalls kostenlos.

### 4.3 Gesprächs-Pipeline (Latenz ist entscheidend)

```
Browser ──(Mikrofon-Audio, fortlaufend)──► Gemini Live (Rolle als System-Anweisung)
        ◄─(Audio-Antwort gestreamt + Transkript)──
```
- **Ziel: < 1,5 s** vom Sprechende bis zum ersten Ton der Antwort. Mit nativem Audio ist das realistisch, weil keine drei Dienste hintereinander laufen.
- **Unterbrechen (Barge-in)** und **Pausenerkennung** sind eingebaut. Die Empfindlichkeit stellen wir so ein, dass kurze Denkpausen das Gespräch nicht abschneiden.
- **Fallback Push-to-Talk:** Leertaste gedrückt halten, mit manuellem Ende der Äußerung.
- **Sitzungslänge:** Live-Sitzungen sind zeitlich begrenzt (laut Google ca. 10–15 Min. bei reinem Audio). Unsere Situationen dauern 11 Min. und passen hinein. Zur Sicherheit bauen wir Session-Resumption ein.
- **Der Browser verbindet sich direkt mit Gemini** über ein kurzlebiges Token von unserem Server. Der echte API-Key landet nie im Browser.
- **Stimmen:** Gemini Live bietet mehrere vorgefertigte Stimmen. Je Rolle wählen wir eine passende (Patientin, Patient, Kollegin, Kollege).
- Der **Phase-0-Spike** prüft zuerst Latenz, deutsche Sprachqualität und Transkriptgenauigkeit, bevor wir darauf aufbauen.

### 4.4 KI-Rollenspiel (Schauspieler-Engine)

Für jede Situation bekommt Gemini Live eine **Rollenkarte** als System-Anweisung. Das entspricht dem „S“-Blatt des Übungstests: Persona, Beruf, verdeckte Fakten, Persönlichkeit/Angstlevel und **Rückfragen**, die im Gespräch gestellt werden sollen.

Verhaltensregeln für **Patient:innen**:
- Laie: kennt keine Fachbegriffe und **fragt nach**, wenn der Zahnarzt welche benutzt
- gibt Infos **nur auf Nachfrage** preis, damit Vollständigkeit trainiert wird
- antwortet kurz und natürlich (1–3 Sätze), wie ein echter Mensch
- stellt die vorgesehenen Rückfragen an passender Stelle, spätestens ab etwa Minute 7
- zeigt Gefühle (Angst, Schmerzen), damit Empathie nötig wird
- fällt nie aus der Rolle, gibt keine Tipps, korrigiert kein Deutsch

Verhaltensregeln für **Kolleg:innen** (Dr. Hofmann o. ä.):
- erfahrener Zahnarzt, lässt vorstellen und unterbricht ggf. kurz
- stellt gezielte fachliche Rückfragen und erwartet präzise, knappe Antworten

Technik:
- Die verstrichene Zeit wird während der Sitzung als kurzer Text-Hinweis eingespielt (z. B. „Minute 7: stelle jetzt deine offenen Rückfragen“). So bringt die Rolle ihre Rückfragen rechtzeitig unter.
- Rollenkarte und Verhaltensregeln stehen in der System-Anweisung der Live-Sitzung.
- Die Rolle bewertet nicht und gibt keine Tipps. Die Bewertung läuft getrennt danach.

### 4.5 Bewertungs-Engine

Nach jeder Situation, asynchron:
1. **Eingaben:** die **lokale Audioaufnahme** der eigenen Spur, das Live-Transkript beider Seiten, die lokal gemessenen Flüssigkeitsmetriken, das Aufgabenblatt, die **Bewertungs-Checkliste des Falls** und die Rubrik (Kriteriencluster + C1-Deskriptoren)
2. **Schritt A – wortgetreues Transkript:** Gemini erstellt aus der Aufnahme ein Verbatim-Transkript mit „ähm“, Abbrüchen und Fehlern. Das Live-Transkript ist dafür zu „glatt“.
3. **Schritt B – Bewertung:** **Gemini Flash** hört die Aufnahme und liest das Transkript. Es liefert **strukturiertes JSON** (per `responseSchema` erzwungen und mit Zod geprüft):
   - Punkte je Cluster (Textsorte, Pragmatik, strukturelle Korrektheit, global) mit Begründung
   - Checklisten-Abdeckung (erfüllt / teilweise / fehlt, mit Belegstelle im Transkript)
   - Fehlerliste: Zitat → Korrektur → Kategorie → Erklärung
   - Liste nicht erklärter Fachbegriffe (Patientengespräche)
   - Aussprache: auffällige Wörter mit Hinweis (qualitativ, vom Modell gehört)
   - Top-3-Empfehlungen
4. Deterministische Metriken (Sprechtempo, Pausen, Sprechanteil) werden **im Browser** berechnet, nicht vom Modell geschätzt, und fließen gewichtet ein.
5. Stationsergebnis = Mittelwert der Situationen; Bestehen = alle drei Bereiche ≥ 60 %.

> Die Aussprachebewertung über Gemini ist eine **qualitative Einschätzung** und kein phonetischer Messwert. Sollte das nicht reichen, ist Azure Pronunciation Assessment später eine Option. Azure hat ebenfalls ein Gratiskontingent, verlangt aber eine Kreditkarte bei der Anmeldung.

### 4.6 Datenmodell (Kern)

```ts
Case {
  id, version, stationType: 'anamnese' | 'aufklaerung' | 'vorstellung' | 'arztbrief',
  title, difficulty, topics[],
  candidateSheet: { kurzbeschreibung, patientInfo, aufgabentext, attachments[] }, // TN-Blatt
  actorCard:      { persona, voice, hiddenFacts, personality, followUpQuestions[] }, // S-Blatt
  rubric:         { checklist[{id, label, weight}], keyTerms[], laienAlternativen{} }, // B-Blatt
  media?:         { xray?: {src, license, befund}, arztbriefDialog?: {...} },
  modelAnswer?:   string  // Musterbrief / Beispielformulierungen
}
Attempt { id, mode, startedAt, situations[SituationResult], overall }
SituationResult { caseId, transcript[Turn], audioRef, metrics, evaluation }
```

### 4.7 Arztbrief-Station ohne echtes Video

Im Original gibt es ein gefilmtes Anamnesegespräch. Wir erzeugen stattdessen mit **Gemini-TTS (Multi-Speaker, kostenlos)** einen **Dialog mit zwei Stimmen** (Zahnarzt und Patient) aus einem geschriebenen Skript. Dazu ein Standbild oder einfacher Avatar und ein Player mit Pause, ±10 s und Zeitleiste. Das Skript liefert gleichzeitig die **Faktenliste** für die Bewertung. Die Audios werden einmal vorab generiert und als statische Dateien ausgeliefert, also ohne Kosten pro Nutzung. Später sind echte Videos möglich.

### 4.8 Röntgenbilder

- Die Anamnese-Station verlangt eine Röntgeninterpretation. Wir brauchen **lizenzierte** OPG-, Einzelzahn- und Bissflügelaufnahmen.
- Quellen: offene Datensätze mit CC-BY-Lizenz. Der Übungstest selbst nutzt einen veröffentlichten Panorama-Datensatz. Lizenz je Bild prüfen und Quelle angeben. Alternativ: eigene, anonymisierte Aufnahmen mit Einwilligung.
- Je Bild hinterlegen wir einen **Referenzbefund** (z. B. „tiefe Karies 46 mit periapikaler Aufhellung“), gegen den die gesprochene Interpretation bewertet wird. Bewertet wird die *sprachliche* Beschreibung.

---

## 5. Inhalte (Fallpool)

Ziel zum Start (Phase 2): **je Situationstyp mindestens 5 Fälle**, später 20+.

Themenvorschläge (Zahnmedizin):
- **Anamnese:** irreversible Pulpitis, apikale Parodontitis/Abszess, Dentitio difficilis (Weisheitszahn), Dentinhypersensibilität, CMD/Kiefergelenkschmerz, Zahntrauma beim Kind (Gespräch mit Elternteil), Prothesendruckstelle, Parodontalabszess
- **Aufklärung:** Wurzelkanalbehandlung, Weisheitszahnentfernung (N. alveolaris inferior), Extraktion unter Antikoagulation, Implantation, Wurzelspitzenresektion, Parodontitistherapie, Kronenversorgung, Sinuslift
- **Patientenvorstellung:** Parodontitis Stadium III, Wurzellängsfraktur, Mund-Antrum-Verbindung nach Extraktion, Bisphosphonat-assoziierte Kiefernekrose, Leukoplakie (Abklärung), Perikoronitis, Logenabszess (Überweisung MKG)
- **Arztbrief:** Notdienstfälle (akute Pulpitis, Abszess-Inzision, Zahntrauma, Nachblutung nach Extraktion)

Erstellung: Gemini erstellt einen Entwurf im festen Schema. Danach **Review durch eine Zahnärztin/einen Zahnarzt** (fachliche Plausibilität) und **eine DaF-Lehrkraft** (Sprachniveau, Rubrik). Kein Fall wird aus fremden Materialien übernommen.

---

## 6. Datenschutz, Recht, Qualität

- **DSGVO:** Sprachaufnahmen sind personenbezogene Daten. Nötig sind: ausdrückliche Einwilligung vor der ersten Aufnahme, Löschfunktion und standardmäßig **keine** dauerhafte Speicherung von Audio auf unserem Server (bleibt im Browser).
- **Gemini Free Tier:** Google darf Inhalte aus der kostenlosen Stufe zur Produktverbesserung nutzen, und die Verarbeitung findet nicht garantiert in der EU statt. Für **Entwicklung und Tests mit eigenen Aufnahmen** ist das unproblematisch. **Vor dem Start mit echten Nutzer:innen** muss eine der beiden Lösungen umgesetzt sein: (a) Wechsel auf die bezahlte Stufe mit Auftragsverarbeitungsvertrag, oder (b) ein klar formulierter Hinweis mit Einwilligung, wenn der Testbetrieb kostenlos bleiben soll. Das entscheiden wir in Phase 4.
- **Disclaimer:** „Unabhängiges Trainingsangebot. Nicht offiziell, nicht verbunden mit der FaMed bzw. digiFORT. Ergebnisse sind Schätzungen und keine Prognose für die echte Prüfung.“
- **Name:** eigener Markenname. Arbeitstitel: „DentSim FSP“. „FaMed“ nur beschreibend verwenden („Vorbereitung auf die FaMed Zahnmedizin“).
- **Barrierefreiheit:** Tastaturbedienung, Kontraste, Untertitel-Option im Training.
- **Browser:** Chrome, Edge, Firefox, Safari aktuell, Desktop zuerst (die Prüfung ist auch am PC). Mobil später.

---

## 7. Qualitätssicherung

### 7.1 Tests
- Unit: Fallschema-Validierung, Timer-/Ablauflogik, Punkteberechnung, Metriken
- Integration: `/api/turn` und `/api/evaluate` mit aufgezeichneten Transkripten
- E2E (Playwright): kompletter Prüfungsdurchlauf mit simuliertem Audio

### 7.2 Rollenspiel-Qualität
- Testset mit Transkripten: verrät der Patient zu viel? Fragt er bei Fachbegriffen nach? Stellt er die Rückfragen? Fällt er aus der Rolle?

### 7.3 Bewertungs-Kalibrierung (sehr wichtig)
- 20–30 echte Übungsdurchläufe von Testnutzer:innen werden **von einer DaF-Lehrkraft (C1+) nach derselben Rubrik bewertet**. Wir vergleichen das mit der KI-Bewertung (Abweichung pro Cluster) und passen Prompt und Gewichtung an, bis die Abweichung klein und stabil ist.

---

## 8. Umsetzungsplan in Phasen

### Phase 0 – Fundament & Technik-Spike
- Projekt-Setup: Next.js, TS, Tailwind, ESLint/Prettier, Vitest, Playwright, Git
- Gemini-API-Key in `.env.local` (nie ins Git)
- **Spike Sprachschleife:** Mikrofon → Gemini Live (Patientenrolle, deutsche Stimme) → Lautsprecher. Dabei Latenz, Sprachqualität, Unterbrechen und Transkripte prüfen.
- Spike Bewertung: eine Testaufnahme an Gemini Flash schicken. Kommt ein wortgetreues Transkript zurück, und sind die Aussprachehinweise brauchbar?
- Ratenlimits des eigenen Keys in AI Studio ablesen und dokumentieren
- **Ergebnis:** funktionierender Gesprächs-Prototyp mit gemessener Latenz; Go/No-Go für den Stack
- **Stand 17.11.2026:** Code fertig (Setup, Token-Route, Live-Gespräch, Auswertung, 1 Fall, Tests, Build grün). **Offen:** Praxistest mit echtem Gemini-Key und Mikrofon (Latenz, Sprachqualität, Bewertungsqualität). Noch nicht umgesetzt: Zeit-Hinweise an die Rolle während des Gesprächs, Röntgenbild in der Anamnese (Lizenzklärung), lokale Flüssigkeitsmetriken.

### Phase 1 – MVP: Anamnesegespräch
- Fallschema + 3 eigene Anamnese-Fälle inkl. Röntgenbild
- Stationsscreen (Aufgabenblatt, Timer 11:00, Avatar, Gesprächsstatus, Push-to-Talk-Fallback)
- Schauspieler-Engine (Patient) mit Rollenkarte
- Bewertungs-Engine v1 + Ergebnisseite (Cluster-Punkte, Checkliste, Fehlerliste, Laiensprache-Check, Flüssigkeit)
- Technikcheck-Screen, lokale Speicherung (IndexedDB)
- **Ergebnis:** eine Situation komplett üben und Feedback bekommen

### Phase 2 – Vollständige Prüfungssimulation
- Aufklärungsgespräch, 2× Patientenvorstellung (Kollegen-Rolle), Arztbrief-Station (Dialog-Audio, Player, Editor)
- Prüfungsmodus: Zufallsfälle, Reihenfolge, Pausen, harte Timer, Gesamtauswertung mit 60-%-Regel
- Stationstraining-Modus mit Hilfen
- Fallpool auf ≥ 5 pro Typ, Aussprachebewertung integriert
- **Ergebnis:** komplette Simulation wie am Prüfungstag

### Phase 3 – Lerneffekt & Kalibrierung
- Kalibrierung mit DaF-Lehrkraft (7.3)
- Fortschritts-Dashboard (Verlauf je Cluster, häufigste Fehlertypen)
- Drills (Laiensprache, Zahlen/FDI, Konjunktiv I, Redemittel)
- Fallpool-Ausbau

### Phase 4 – Produktreife
- Accounts (Supabase Auth), Verlauf geräteübergreifend, Einwilligungs- und Löschmanagement
- Bezahlmodell (z. B. Credits pro Simulation oder Abo; Stripe)
- Rechtstexte, Monitoring, Kosten-Dashboard, Launch

---

## 9. Kosten

**Phase 0–3: 0 €.** Gemini Free Tier, lokale Entwicklung, Speicherung im Browser, kostenlose Open-Source-Bibliotheken.

Was die kostenlose Stufe begrenzt:
- **Ratenlimits:** Wie viele Simulationen pro Tag möglich sind, zeigt AI Studio. Für Entwicklung und wenige Tester reicht es.
- **Datennutzung durch Google** (siehe Abschnitt 6)

Erst beim öffentlichen Start (Phase 4) entstehen Kosten: bezahlte Gemini-Stufe pro Nutzung, eventuell Hosting und Datenbank. Ob und wie das über ein Bezahlmodell gedeckt wird, entscheiden wir dann. Sparhebel sind schon eingeplant: vorab erzeugte Arztbrief-Audios, kurze Rollenantworten, günstige Flash-Modelle.

---

## 10. Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Zu hohe Gesprächslatenz wirkt unnatürlich | Gemini Live mit nativem Audio (ein Dienst statt drei); früh im Spike messen |
| Ratenlimit der kostenlosen Stufe erreicht | Limits dokumentieren, 429-Fehler sauber abfangen, Bewertung erst nach der Situation (nicht live), sparsame Modelle |
| Google benennt Modelle um oder schaltet Previews ab | Modellnamen nur in der `.env`, Engine hinter Interface |
| Live-Sitzung bricht nach ~10–15 Min. ab | 11-Min.-Situationen passen; zusätzlich Session-Resumption |
| Transkript erkennt Fachbegriffe oder Akzente schlecht | Fachbegriffe des Falls im Prompt mitgeben, Testset mit verschiedenen Akzenten |
| Transkript „glättet“ Fehler → Feedback zu milde | eigene Aufnahme nachträglich wortgetreu transkribieren lassen; ehrliche Kennzeichnung als Schätzung |
| Free Tier: Google nutzt Daten | nur für Entwicklung und Tests; vor dem Start bezahlte Stufe oder Einwilligung (Abschnitt 6) |
| KI-Bewertung weicht von echten Prüfern ab | Kalibrierung mit DaF-Lehrkraft, feste Rubrik, strukturierte Ausgabe |
| KI-Patient verrät zu viel oder fällt aus der Rolle | klare Rollenkarte, Testset, Regeln, kurze Antworten |
| Urheber-/Markenrecht | eigene Fälle, eigener Name, Disclaimer, lizenzierte Röntgenbilder |
| Datenschutz Sprachdaten | EU-Verarbeitung, Einwilligung, AVV, lokale Speicherung |

---

## 11. Offene Entscheidungen (brauche ich von dir)

1. ~~API-Zugänge~~ → **entschieden:** Google-Gemini-API-Key (kostenlose Stufe). Den Key erstellst du selbst in Google AI Studio und trägst ihn in `.env.local` ein.
2. ~~Stack~~ → **entschieden:** Next.js + Gemini Live API + Gemini Flash, alles kostenlos (Abschnitt 4)
3. **Zielgruppe zuerst:** Einzelnutzer:innen (B2C) oder Sprachschulen (B2B)? Das beeinflusst Phase 4.
4. **Fachliches Review:** Hast du Zugang zu einer Zahnärztin/einem Zahnarzt und einer DaF-Lehrkraft für Fall-Review und Kalibrierung?
5. **Name/Branding:** Arbeitstitel „DentSim FSP“ oder eigener Vorschlag?

---

## Quellen
- FaMed Startseite, Prüfungsablauf, Prüfungsergebnis, Anforderungen, FAQ: https://famed-test.de/
- FaMed-Übungstest Zahnmedizin (Version 01, Februar 2026): https://famed-test.de/ubungstest-fzm/
- Prüfungsordnung FaMed RLP (Stand 25.07.2024): https://famed-test.de/pruefungsordnung-rheinland-pfalz/
- FaMed-Übungstest Humanmedizin (zum Vergleich): https://famed-test.de/uebungstest/
- Gemini API Preise / Free Tier: https://aistudio.google.com/docs/pricing
- Gemini Live API: https://aistudio.google.com/docs/live-api
