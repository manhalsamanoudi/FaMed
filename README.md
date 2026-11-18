# DentSim FSP – Prüfungstraining Fachsprache Zahnmedizin

Web-App zur Vorbereitung auf die Fachsprachenprüfung Zahnmedizin (FaMed-Format): Gespräche per Mikrofon mit KI-Patient:innen, echtes Prüfungstiming, Auswertung nach den Bewertungskriterien.

> Unabhängiges Trainingsangebot, nicht verbunden mit FaMed / digiFORT.

Planung und Hintergründe: [docs/PLANUNG.md](docs/PLANUNG.md)

## Stand: Phase 0 (Technik-Spike)

- Stationstraining „Anamnesegespräch“ mit einem eigenen Fall (Perikoronitis 38)
- Live-Sprachgespräch mit KI-Patient über die **Gemini Live API** (Audio rein/raus, Live-Transkript, Unterbrechen möglich)
- 11-Minuten-Timer, Messung der Antwortzeit
- Auswertung der eigenen Aufnahme mit **Gemini Flash**: Punkte je Kriteriencluster, Checkliste, Fehlerliste, nicht erklärte Fachbegriffe, Aussprache, Flüssigkeit

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
4. <http://localhost:3000> öffnen (Chrome oder Edge empfohlen), Mikrofon erlauben, **Kopfhörer** verwenden.

## Mit anderen teilen (Testphase)

1. Doppelklick auf `App-teilen.cmd`. Das Fenster zeigt nach kurzer Zeit einen Link `https://….trycloudflare.com`.
2. Link + Zugangscode (`ACCESS_CODE` in `.env.local`) weitergeben.
3. Das Fenster offen lassen. Der Link funktioniert nur, solange der PC an ist und das Fenster läuft. Bei jedem Start gibt es einen neuen Link.

Ohne `ACCESS_CODE` ist die App ungeschützt – dann kann jeder mit dem Link das Gemini-Kontingent verbrauchen.

## Dauerhaft online (Render, kostenlos)

Konfiguration: [`render.yaml`](render.yaml) (Region Frankfurt, Free-Plan, Node 24 über `.node-version`).

1. Code in ein **privates** GitHub-Repository hochladen.
2. Auf <https://dashboard.render.com> mit GitHub anmelden → **New → Blueprint** → Repository auswählen.
3. Render fragt nach `GEMINI_API_KEY` und `ACCESS_CODE` → eintragen → **Deploy**.
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
