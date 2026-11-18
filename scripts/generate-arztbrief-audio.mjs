// Erzeugt die Audiodateien für die Arztbrief-Station aus den Gesprächsskripten
// (zwei Stimmen, Gemini TTS, MP3). Einmalig ausführen, Ergebnis liegt in public/audio/.
// Aufruf: npm run audio:arztbrief            (nur fehlende Dateien)
//         npm run audio:arztbrief -- --force (alle neu erzeugen)
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { ARZTBRIEF_FAELLE } from "../src/content/cases/arztbrief.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const model = process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY fehlt (.env.local).");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { apiVersion: "v1beta" } });

const STIL = {
  Zahnarzt: "ruhige, freundliche Zahnärztin im Notdienst, deutsches Hochdeutsch, normales Sprechtempo",
  Patient: "Patient mit starken Schmerzen, etwas müde und leicht gequält, deutsches Alltagsdeutsch",
};

for (const fall of ARZTBRIEF_FAELLE) {
  const a = fall.arztbrief;
  const target = join(root, "public", a.audioSrc);
  if (existsSync(target) && !force) {
    console.log(`✓ ${a.audioSrc} existiert bereits (mit --force neu erzeugen)`);
    continue;
  }
  console.log(`Erzeuge ${a.audioSrc} mit ${model} …`);
  const interaction = await ai.interactions.create({
    model,
    input: [
      {
        type: "user_input",
        content: a.dialog.map((d) => ({
          type: "text",
          text: d.text,
          annotations: [{ type: "speech_metadata", speaker: d.sprecher, style: STIL[d.sprecher] }],
        })),
      },
    ],
    response_format: { type: "audio", mime_type: "audio/mp3" },
    generation_config: {
      speech_config: {
        speakers: [
          { speaker: "Zahnarzt", voice: a.sprecher.Zahnarzt },
          { speaker: "Patient", voice: a.sprecher.Patient },
        ],
      },
    },
  });
  const data = interaction.output_audio?.data;
  if (!data) {
    console.error("Keine Audiodaten erhalten:", JSON.stringify(interaction).slice(0, 400));
    process.exit(1);
  }
  mkdirSync(dirname(target), { recursive: true });
  const buf = Buffer.from(data, "base64");
  writeFileSync(target, buf);
  console.log(`✓ ${a.audioSrc} geschrieben (${(buf.length / 1024).toFixed(0)} KB, Format ${interaction.output_audio?.mime_type ?? "?"})`);
}
