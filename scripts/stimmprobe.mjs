// Stimmprobe für die Gesprächsrollen: spielt pro Fall ein kurzes Gespräch (Zahnarzt-Sätze als Text)
// über den lokalen Dev-Server ab – also mit genau der Konfiguration der App –, speichert die
// Antworten der Rolle als WAV und lässt Gemini die Natürlichkeit bewerten.
//
// Voraussetzung: npm run dev läuft (Port 3000).
// Aufruf: npm run stimmprobe                                  (alle Gesprächsfälle, eingestellte Stimme)
//         npm run stimmprobe -- <fall-id> [<fall-id> …]
//         npm run stimmprobe -- <fall-id> --stimmen=Gacrux,Sulafat   (Stimmen-Casting)
//         npm run stimmprobe -- --vergleich=.stimmproben/vorher       (mit früherer Probe vergleichen)
//         npm run stimmprobe -- --ohne-bewertung
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";

const BASE = process.env.STIMMPROBE_BASE || "http://localhost:3000";
const OUT = process.env.STIMMPROBE_DIR || join(process.cwd(), ".stimmproben");
const args = process.argv.slice(2);
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const ohneBewertung = args.includes("--ohne-bewertung");
const stimmen = opt("stimmen")?.split(",").filter(Boolean) ?? [null];
const vergleich = opt("vergleich");
const wunsch = args.filter((a) => !a.startsWith("--"));

const SAETZE = {
  anamnese: [
    "Guten Tag, ich bin Zahnärztin Weber. Bitte nehmen Sie Platz. Was führt Sie heute zu mir?",
    "Oh, das klingt unangenehm. Seit wann haben Sie die Beschwerden, und wie fühlen sich die Schmerzen genau an?",
    "Haben Sie Vorerkrankungen, nehmen Sie regelmäßig Medikamente, und rauchen Sie?",
  ],
  aufklaerung: [
    "Guten Tag, ich bin Zahnärztin Weber. Ich möchte heute mit Ihnen über die geplante Behandlung sprechen. Wie geht es Ihnen damit?",
    "Zuerst bekommen Sie eine örtliche Betäubung, damit Sie nichts spüren. Dann führen wir den Eingriff durch, das dauert etwa eine halbe Stunde. Haben Sie bis hierhin Fragen?",
    "Danach kann die Stelle ein paar Tage geschwollen sein und etwas wehtun. Was möchten Sie noch wissen?",
  ],
  vorstellung: [
    "Guten Tag, Frau Kollegin, Herr Kollege, haben Sie kurz Zeit? Ich möchte Ihnen eine Patientin vorstellen, die heute bei uns war.",
    "Die Patientin hat seit einigen Tagen starke Schmerzen im Seitenzahnbereich, die Befunde und das Röntgenbild liegen Ihnen vor. Was möchten Sie zuerst wissen?",
    "Sie nimmt keine Blutverdünner und hat keine bekannten Allergien. Haben Sie noch weitere Fragen?",
  ],
};

const apiKey = process.env.GEMINI_API_KEY;
const master = process.env.MASTER_CODE;
if (!apiKey) throw new Error("GEMINI_API_KEY fehlt (.env.local).");

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function anmelden() {
  if (!master) return "";
  const res = await fetch(`${BASE}/api/zugang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: master }),
  });
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  if (!res.ok || !cookie) throw new Error(`Anmeldung am Dev-Server fehlgeschlagen (${res.status}).`);
  return cookie;
}

async function gespraech(cookie, fall, stimme) {
  const res = await fetch(`${BASE}/api/live-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ caseId: fall.id, ...(stimme ? { stimme } : {}) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token: ${res.status} ${data.error ?? ""}`);

  const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: "v1beta" } });
  const chunks = [];
  const transkript = [];
  let turnFertig = null;
  let aktuell = "";
  const session = await ai.live.connect({
    model: data.model,
    callbacks: {
      onmessage: (msg) => {
        const sc = msg.serverContent;
        if (!sc) return;
        for (const p of sc.modelTurn?.parts ?? []) {
          if (p.inlineData?.data) chunks.push(Buffer.from(p.inlineData.data, "base64"));
        }
        if (sc.outputTranscription?.text) aktuell += sc.outputTranscription.text;
        // turnComplete kommt erst, wenn die Antwort vollständig ist – erst dann den nächsten Satz senden.
        if (sc.turnComplete) turnFertig?.();
      },
      onerror: (e) => console.error("  Fehler:", e.message),
      onclose: () => turnFertig?.(),
    },
  });

  for (const satz of SAETZE[fall.stationType]) {
    await new Promise((resolve) => {
      const t = setTimeout(resolve, 45_000);
      turnFertig = () => {
        clearTimeout(t);
        resolve();
      };
      session.sendRealtimeInput({ text: satz });
    });
    await pause(500); // letzte Transkriptstücke abwarten
    transkript.push(`Zahnärztin: ${satz}`, `${fall.rolle}: ${aktuell.trim()}`);
    aktuell = "";
    chunks.push(Buffer.alloc(24000 * 2 * 0.7)); // 0,7 s Stille zwischen den Antworten
  }
  session.close();
  return { audio: wav(Buffer.concat(chunks)), transkript: transkript.join("\n") };
}

async function bewerten(fall, proben) {
  const teile = [];
  for (const p of proben) {
    teile.push({ text: `Aufnahme „${p.label}“:` });
    teile.push({ inline_data: { mime_type: "audio/wav", data: readFileSync(p.datei).toString("base64") } });
  }
  teile.push({
    text: `Du bist eine strenge Hörspiel-Regisseurin und bewertest, wie MENSCHLICH KI-Stimmen in einem Rollenspiel klingen.
Jede Aufnahme enthält nur die Antworten der Rolle „${fall.rolle}“ (${fall.beschreibung}) auf Fragen einer Zahnärztin, getrennt durch kurze Pausen.
Ziel: Die Rolle soll wie ein echter Mensch klingen – NICHT wie Sprecher, Hörbuch oder Sprachassistent. Alltagstempo, nicht überdeutlich, Füllwörter, Zögern, verschluckte Endungen, echte Atmer und Geräusche, passende Emotion. Die Fakten müssen aber heraushörbar bleiben.
Antworte knapp auf Deutsch, für JEDE Aufnahme eine Zeile:
<label>: menschlich X/10 · zu deutlich ja/nein · passt zur Rolle ja/nein · Auffälligkeiten (vorgelesene Regieanweisungen? englische Aussprache? zu lang? Roboterklang?)
Danach: „Beste: <label>“ mit einem Satz Begründung.`,
  });
  const body = { contents: [{ role: "user", parts: teile }], generationConfig: { temperature: 0 } };
  // Gleiches, möglichst starkes Modell für alle Vergleiche – Lite nur als letzte Rettung.
  for (const [m, versuche] of [["gemini-3.8-flash", 3], ["gemini-3.6-flash", 3], ["gemini-3.5-flash-lite", 2]]) {
    for (let i = 0; i < versuche; i++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180_000),
      }).catch(() => null);
      if (res?.ok) {
        const j = await res.json();
        return `[${m}]\n${j.candidates[0].content.parts.map((p) => p.text ?? "").join("").trim()}`;
      }
      await pause(8000);
    }
  }
  return "(keine Bewertung – Modelle ausgelastet)";
}

const faelle = await (await fetch(`${BASE}/api/stimmprobe-faelle`).catch(() => null))?.json().catch(() => null);
if (!faelle) throw new Error(`Dev-Server unter ${BASE} nicht erreichbar.`);

mkdirSync(OUT, { recursive: true });
const cookie = await anmelden();
const auswahl = faelle.filter((f) => !wunsch.length || wunsch.includes(f.id));
const bericht = [];
for (const fall of auswahl) {
  const proben = [];
  const abschnitt = [`## ${fall.id}`];
  if (vergleich && existsSync(join(vergleich, `${fall.id}.wav`))) {
    proben.push({ label: "Vorher", datei: join(vergleich, `${fall.id}.wav`) });
  }
  for (const stimme of stimmen) {
    const name = stimme ?? fall.stimme;
    process.stdout.write(`${fall.id} (${name}) … `);
    try {
      const { audio, transkript } = await gespraech(cookie, fall, stimme);
      const datei = join(OUT, stimme ? `${fall.id}-${stimme}.wav` : `${fall.id}.wav`);
      writeFileSync(datei, audio);
      proben.push({ label: name, datei });
      console.log(`${(audio.length / 48000).toFixed(0)} s`);
      abschnitt.push(`### ${name}\n${transkript}`);
    } catch (err) {
      console.log(`Fehler: ${err.message}`);
      abschnitt.push(`### ${name}\nFehler: ${err.message}`);
    }
  }
  if (!ohneBewertung && proben.length) abschnitt.push(`### Bewertung\n${await bewerten(fall, proben)}`);
  bericht.push(abschnitt.join("\n\n"));
  writeFileSync(join(OUT, "bericht.md"), bericht.join("\n\n"));
}
console.log(`\nBericht: ${join(OUT, "bericht.md")}`);
