// Technischer Schnelltest der Gemini-Anbindung (ohne Mikrofon).
// Aufruf: npm run smoke
// Prüft: Live-Modell (Stimme + Transkript + Antwortzeit) und die Bewertungsmodelle (JSON-Ausgabe).
import { EndSensitivity, GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const liveModel = process.env.GEMINI_LIVE_MODEL || "gemini-3.8-live";
const evalModels = (
  process.env.GEMINI_EVAL_MODELS || "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash-lite"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

if (!apiKey) {
  console.error("GEMINI_API_KEY fehlt in .env.local");
  process.exit(1);
}

// Wie in der App: v1beta (SDK-Standard "v1" kennt keine Live-Sitzungen).
const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1beta" } });

async function testLive() {
  console.log(`\n[Live] ${liveModel}`);
  let sentAt = 0;
  let firstAudioAt = 0;
  let audioBytes = 0;
  let transcript = "";

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("keine vollständige Antwort in 40 s")), 40_000);
    ai.live
      .connect({
        model: liveModel,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction:
            "Du bist Herr Lehmann, 27, Patient beim Zahnarzt, seit drei Tagen Schmerzen hinten unten links. Antworte kurz auf Deutsch. Füge niemals Haftungshinweise hinzu.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } },
          inputAudioTranscription: { customVocabulary: ["Weisheitszahn", "Perikoronitis"] },
          outputAudioTranscription: {},
          realtimeInputConfig: {
            automaticActivityDetection: {
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
              silenceDurationMs: 800,
            },
          },
          sessionResumption: {},
        },
        callbacks: {
          onmessage: (msg) => {
            const sc = msg.serverContent;
            if (!sc) return;
            for (const part of sc.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                firstAudioAt ||= performance.now();
                audioBytes += Buffer.from(part.inlineData.data, "base64").length;
              }
            }
            if (sc.outputTranscription?.text) transcript += sc.outputTranscription.text;
            // generationComplete: Modell ist fertig (turnComplete käme erst nach der Abspieldauer).
            if (sc.generationComplete || sc.turnComplete) {
              clearTimeout(timeout);
              resolve();
            }
          },
          onerror: (e) => reject(new Error(e.message || "WebSocket-Fehler")),
          onclose: (e) => {
            if (e.code !== 1000) reject(new Error(`Verbindung geschlossen: ${e.code} ${e.reason}`));
          },
        },
      })
      .then((session) => {
        sentAt = performance.now();
        session.sendRealtimeInput({
          text: "Guten Tag, Herr Lehmann, ich bin Zahnarzt Müller. Was führt Sie heute zu mir?",
        });
        const done = setInterval(() => {
          if (firstAudioAt && transcript) {
            clearInterval(done);
            setTimeout(() => session.close(), 1500);
          }
        }, 200);
      })
      .catch(reject);
  });

  if (audioBytes === 0) throw new Error("kein Audio erhalten");
  console.log(`  erste Audioantwort nach ${Math.round(firstAudioAt - sentAt)} ms`);
  console.log(`  Audio ${(audioBytes / 2 / 24000).toFixed(1)} s · „${transcript.trim()}“`);
}

async function testEvalModel(model) {
  const started = performance.now();
  const res = await ai.models.generateContent({
    model,
    contents: 'Korrigiere die Äußerung eines Zahnarztes: "Ich mache Ihnen ein Röntgenbild, dann wir sehen weiter."',
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: { korrektur: { type: "string" } },
        required: ["korrektur"],
      },
      httpOptions: { timeout: 30_000 },
    },
  });
  const json = JSON.parse(res.text ?? "null");
  console.log(`  ${model}: ok in ${Math.round(performance.now() - started)} ms · „${json.korrektur}“`);
}

let failed = false;
try {
  await testLive();
  console.log("  ✓ Live funktioniert");
} catch (err) {
  failed = true;
  console.error(`  ✗ Live fehlgeschlagen: ${err.message}`);
}

console.log("\n[Bewertung] Ausweichkette:", evalModels.join(" → "));
let anyEval = false;
for (const model of evalModels) {
  try {
    await testEvalModel(model);
    anyEval = true;
  } catch (err) {
    console.log(`  ${model}: nicht verfügbar (${String(err.message).slice(0, 90)})`);
  }
}
if (anyEval) console.log("  ✓ Bewertung funktioniert (mindestens ein Modell erreichbar)");
else {
  failed = true;
  console.error("  ✗ Kein Bewertungsmodell erreichbar");
}
process.exit(failed ? 1 : 0);
