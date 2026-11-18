// Erzeugt die Audiodateien für die Arztbrief-Station aus den Gesprächsskripten
// (zwei Stimmen, Gemini TTS, MP3). Einmalig ausführen, Ergebnis liegt in public/audio/.
// Aufruf: npm run audio:arztbrief                      (nur fehlende Dateien)
//         npm run audio:arztbrief -- --force           (alle neu erzeugen)
//         npm run audio:arztbrief -- --nur=<fall-id>   (nur diesen Fall, wird immer neu erzeugt)
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { ARZTBRIEF_FAELLE } from "../src/content/cases/arztbrief.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const nur = process.argv.find((a) => a.startsWith("--nur="))?.slice(6);
const model = process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY fehlt (.env.local).");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { apiVersion: "v1beta" } });

/** Gilt für alle Zeilen: echtes Gespräch, kein Hörbuch. */
const NATUERLICH =
  "echtes, spontanes Gespräch in einer deutschen Zahnarztpraxis, NICHT vorgelesen und NICHT wie ein Sprecher im Hörbuch; " +
  "Alltagstempo, verschliffene Endungen, natürliche Atmer und kleine Pausen, Füllwörter beiläufig";

const STANDARD = {
  Zahnarzt: "Zahnärztin/Zahnarzt, freundlich und routiniert, spricht zügig und nicht übertrieben deutlich",
  Patient: "Patient/Patientin, Alltagsdeutsch, spricht nicht immer deutlich, manchmal leise oder nuschelnd",
};

async function erzeuge(fall) {
  const a = fall.arztbrief;
  const basis = a.sprechweise ?? STANDARD;
  const res = await ai.interactions.create({
    model,
    input: [
      {
        type: "user_input",
        content: a.dialog.map((d) => ({
          type: "text",
          text: d.text,
          annotations: [
            {
              type: "speech_metadata",
              speaker: d.sprecher,
              style: [basis[d.sprecher], d.stil, NATUERLICH].filter(Boolean).join("; "),
            },
          ],
        })),
      },
    ],
    response_format: { type: "audio", mime_type: "audio/mp3" },
    generation_config: {
      speech_config: [
        { speaker: "Zahnarzt", voice: a.sprecher.Zahnarzt, language: "de-DE" },
        { speaker: "Patient", voice: a.sprecher.Patient, language: "de-DE" },
      ],
    },
  });
  return res.output_audio;
}

for (const fall of ARZTBRIEF_FAELLE) {
  if (nur && fall.id !== nur) continue;
  const a = fall.arztbrief;
  const target = join(root, "public", a.audioSrc);
  if (existsSync(target) && !force && !nur) {
    console.log(`✓ ${a.audioSrc} existiert bereits (mit --force neu erzeugen)`);
    continue;
  }
  console.log(`Erzeuge ${a.audioSrc} mit ${model} …`);
  let audio;
  for (let versuch = 1; versuch <= 4 && !audio?.data; versuch++) {
    try {
      audio = await erzeuge(fall);
    } catch (err) {
      console.log(`  Versuch ${versuch} fehlgeschlagen: ${String(err?.message ?? err).slice(0, 200)}`);
      await new Promise((r) => setTimeout(r, 15000 * versuch));
    }
  }
  if (!audio?.data) {
    console.error(`✗ ${a.audioSrc}: keine Audiodaten erhalten.`);
    process.exitCode = 1;
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  const buf = Buffer.from(audio.data, "base64");
  writeFileSync(target, buf);
  console.log(`✓ ${a.audioSrc} geschrieben (${(buf.length / 1024).toFixed(0)} KB, Format ${audio.mime_type ?? "?"})`);
}
