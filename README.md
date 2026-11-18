# FaMed Zahnmedizin – Prüfungstraining

Web-App zur Vorbereitung auf die FaMed Zahnmedizin (Fachsprachenprüfung): alle vier Prüfungssituationen wie im offiziellen Übungstest, Gespräche per Mikrofon mit KI-Gesprächspartnern, echtes Prüfungstiming, Auswertung nach den Bewertungskriterien.

> Unabhängiges Trainingsangebot, nicht verbunden mit digiFORT.

Planung und Hintergründe: [docs/PLANUNG.md](docs/PLANUNG.md)

## Inhalte

| Nr. | Situation | Bereich | Zeit | Fälle |
|---|---|---|---|---|
| 1 | Anamnesegespräch (inkl. Röntgenbefund erklären) | Zahnarzt-Patienten-Kommunikation | 11 Min. | 2 |
| 2 | Aufklärungsgespräch | Zahnarzt-Patienten-Kommunikation | 11 Min. | 7 (aus eigenen Unterlagen) |
| 3 | Patientenvorstellung | Zahnarzt-Zahnarzt-Kommunikation | 11 Min. | 2 |
| 4 | Arztbrief (Gespräch anhören, Brief schreiben) | Schriftliche Station | 22 Min. | 1 |

- Fälle: `src/content/cases/` (je Station eine Datei, Aufgabenblatt wie im Übungstest, verdeckte Rollenkarte, Bewertungs-Checkliste, Beispielformulierungen)
- Gespräche: **Gemini Live API** (Audio rein/raus, Live-Transkript)
- Auswertung: **Gemini Flash** mit Ausweichkette – Punkte je Kriteriencluster, Checkliste, Fehlerliste, Laiensprache-Check, Beispielformulierungen bzw. Musterbrief
- Arztbrief-Audio: einmalig mit Gemini TTS erzeugt (`npm run audio:arztbrief`), liegt in `public/audio/`

Alles läuft über die **kostenlose** Gemini-API-Stufe.

## Einrichtung

1. **Gemini-API-Key erstellen** (kostenlos): <https://aistudio.google.com/apikey>
2. Datei `.env.example` kopieren und als `.env.local` speichern, Key eintragen:
   ```
   GEMINI_API_KEY=dein-key
   ```
   `.env.local` wird nie ins Git übernommen. Den Key niemals weitergeben.
3. Abhängigkeiten installieren (einmalig) und starten:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```
4. <http://localhost:3000> öffnen (Firefox, Chrome oder Edge), Mikrofon erlauben, **Kopfhörer** verwenden.

## Zugangscodes

- **Master-Code** (`MASTER_CODE`): gilt für immer, mehrere Geräte erlaubt, öffnet die Verwaltung unter `/admin`.
- **Persönliche Codes** werden in der Verwaltung erstellt (Testzugang 24 h, 7 Tage, 30 Tage oder frei) und per WhatsApp weitergegeben.
  - Laufzeit beginnt mit der ersten Anmeldung.
  - Ein Code gilt nur auf einem Gerät: Eine neue Anmeldung meldet das vorherige Gerät ab (spätestens nach ca. 1 Minute).
  - Verlängern, Gerät abmelden, sperren, löschen: in der Verwaltung.
- Gespeichert in Neon-Postgres (`DATABASE_URL`, Projekt `dentsim`, Frankfurt). Tabelle wird automatisch angelegt.
- Lokal ohne `MASTER_CODE` ist die App offen (nur für Entwicklung). In Produktion ist sie ohne `MASTER_CODE` gesperrt.

## Vorübergehend über den eigenen PC teilen

Doppelklick auf `App-teilen.cmd` → Link `https://….trycloudflare.com` erscheint. Funktioniert nur, solange PC und Fenster laufen.

## Dauerhaft online (Render, kostenlos)

Konfiguration: [`render.yaml`](render.yaml) (Region Frankfurt, Free-Plan, Node 24 über `.node-version`).

1. Code in ein **privates** GitHub-Repository hochladen.
2. Auf <https://dashboard.render.com> mit GitHub anmelden → **New → Blueprint** → Repository auswählen.
3. Render fragt nach `GEMINI_API_KEY`, `MASTER_CODE` und `DATABASE_URL` (gepoolte Neon-Adresse) → eintragen → **Deploy**.
4. Nach ca. 5 Minuten ist die App unter `https://dentsim-fsp….onrender.com` erreichbar.

Jeder neue Commit auf `main` wird automatisch neu veröffentlicht. Geheimwerte später im Render-Dashboard unter **Environment** ändern.
Kostenlose Stufe: Nach 15 Minuten ohne Nutzung schläft die App ein, das erste Öffnen dauert dann ca. 1 Minute.

## Befehle

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm test` | Unit-Tests (Vitest) |
| `npm run typecheck` | TypeScript prüfen |
| `npm run lint` | ESLint |
| `npm run build` | Produktions-Build |

## Struktur

```
src/
  app/
    page.tsx                    Startseite
    training/[caseId]/page.tsx  Station (Aufgabenblatt + Gespräch)
    api/live-token/route.ts     Ephemeral Token für Gemini Live (Key bleibt am Server)
    api/evaluate/route.ts       Auswertung der Aufnahme mit Gemini
  components/                   UI (StationRunner, EvaluationReport)
  content/cases/                Fälle (eigene Inhalte, Zod-validiert)
  lib/
    audio/                      PCM-Verarbeitung, Mikrofon, Wiedergabe
    live/                       Gesprächs-Hook, Rollen-Prompt, Transkript
    evaluation/                 Bewertungsschema und -prompt
    server/env.ts               Server-Konfiguration
public/worklets/pcm-capture.js  AudioWorklet fürs Mikrofon
```

## Datenschutz (Entwicklungsphase)

- Aufnahmen bleiben im Browser. Zur Auswertung werden sie kurz an Gemini hochgeladen und danach sofort wieder gelöscht.
- In der kostenlosen Stufe darf Google Inhalte zur Produktverbesserung nutzen. Deshalb nur eigene Testaufnahmen verwenden, keine echten Patientendaten.

## Hinweis zu OneDrive

Der Projektordner liegt in OneDrive. `node_modules` und `.next` enthalten zehntausende Dateien, die OneDrive mitsynchronisiert. Das kann den Rechner bremsen. Falls das passiert, das Projekt in einen Ordner außerhalb von OneDrive verschieben, zum Beispiel `C:\dev\famed`.
