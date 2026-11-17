"use client";

import { GoogleGenAI, Modality, type LiveServerMessage, type Session } from "@google/genai";
import { useCallback, useEffect, useRef, useState } from "react";
import { MicCapture, PcmPlayer } from "@/lib/audio/browser-audio";
import { INPUT_SAMPLE_RATE, base64ToInt16, encodeWav, int16ToBase64 } from "@/lib/audio/pcm";
import { appendTranscript, type Turn } from "./transcript";

export type ConversationStatus = "idle" | "connecting" | "live" | "reconnecting" | "ended" | "error";

/** Ab diesem Pegel (RMS) gilt Mikrofon-Input als Sprache. */
const VOICE_LEVEL = 0.02;
/** Latenzen darüber sind keine Antwortzeiten (z. B. Rolle hat von sich aus gesprochen). */
const MAX_PLAUSIBLE_LATENCY_MS = 10_000;

type Internals = {
  session: Session | null;
  mic: MicCapture | null;
  player: PcmPlayer | null;
  recorded: Int16Array[];
  resumeHandle: string | null;
  lastVoiceAt: number;
  lastActorTurnEndAt: number;
  awaitingFirstAudio: boolean;
  endedByUser: boolean;
  reconnecting: boolean;
  deadline: number;
  interval: ReturnType<typeof setInterval> | null;
};

function freshInternals(): Internals {
  return {
    session: null,
    mic: null,
    player: null,
    recorded: [],
    resumeHandle: null,
    lastVoiceAt: 0,
    lastActorTurnEndAt: 0,
    awaitingFirstAudio: true,
    endedByUser: false,
    reconnecting: false,
    deadline: 0,
    interval: null,
  };
}

export function useLiveConversation(caseId: string, durationSeconds: number) {
  const [status, setStatus] = useState<ConversationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [actorSpeaking, setActorSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  const r = useRef<Internals>(freshInternals());

  const teardown = useCallback(async () => {
    const i = r.current;
    if (i.interval) clearInterval(i.interval);
    i.interval = null;
    try {
      i.session?.close();
    } catch {
      // Sitzung war bereits geschlossen
    }
    i.session = null;
    await i.mic?.stop();
    i.mic = null;
    await i.player?.close();
    i.player = null;
  }, []);

  const stop = useCallback(async () => {
    r.current.endedByUser = true;
    await teardown();
    setActorSpeaking(false);
    setStatus("ended");
  }, [teardown]);

  const fail = useCallback(
    async (message: string) => {
      r.current.endedByUser = true;
      await teardown();
      setError(message);
      setStatus("error");
    },
    [teardown],
  );

  const handleMessage = useCallback((msg: LiveServerMessage) => {
    const i = r.current;
    const update = msg.sessionResumptionUpdate;
    if (update?.resumable && update.newHandle) i.resumeHandle = update.newHandle;

    const sc = msg.serverContent;
    if (!sc) return;

    if (sc.interrupted) {
      i.player?.flush();
      i.awaitingFirstAudio = true;
    }
    if (sc.inputTranscription?.text) {
      const text = sc.inputTranscription.text;
      setTurns((t) => appendTranscript(t, "user", text));
    }
    if (sc.outputTranscription?.text) {
      const text = sc.outputTranscription.text;
      setTurns((t) => appendTranscript(t, "actor", text));
    }
    for (const part of sc.modelTurn?.parts ?? []) {
      const data = part.inlineData?.data;
      if (!data || !part.inlineData?.mimeType?.startsWith("audio/")) continue;
      if (i.awaitingFirstAudio) {
        i.awaitingFirstAudio = false;
        const userSpokeSinceLastTurn = i.lastVoiceAt > i.lastActorTurnEndAt;
        const latency = performance.now() - i.lastVoiceAt;
        if (userSpokeSinceLastTurn && latency < MAX_PLAUSIBLE_LATENCY_MS) {
          setLatencies((l) => [...l, Math.round(latency)]);
        }
      }
      i.player?.enqueue(base64ToInt16(data));
    }
    if (sc.turnComplete) {
      i.awaitingFirstAudio = true;
      i.lastActorTurnEndAt = performance.now();
    }
  }, []);

  // connect und handleClose verweisen aufeinander (Wiederverbindung) – daher über eine Ref.
  const connectRef = useRef<(resumeHandle?: string) => Promise<void>>(async () => undefined);

  const handleClose = useCallback(
    (e: CloseEvent) => {
      const i = r.current;
      if (i.endedByUser || i.reconnecting) return;
      const timeLeft = i.deadline - Date.now();
      if (i.resumeHandle && timeLeft > 5_000) {
        i.reconnecting = true;
        setStatus("reconnecting");
        connectRef
          .current(i.resumeHandle)
          .then(() => setStatus("live"))
          .catch(() => fail("Verbindung verloren und Wiederaufnahme fehlgeschlagen."))
          .finally(() => {
            i.reconnecting = false;
          });
        return;
      }
      void fail(`Verbindung beendet${e.reason ? `: ${e.reason}` : "."}`);
    },
    [fail],
  );

  const connect = useCallback(
    async (resumeHandle?: string) => {
      const res = await fetch("/api/live-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, resumeHandle }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        token?: string;
        model?: string;
        error?: string;
      };
      if (!res.ok || !data.token || !data.model) {
        throw new Error(data.error ?? `Token-Anfrage fehlgeschlagen (${res.status}).`);
      }
      const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: "v1beta" } });
      r.current.session = await ai.live.connect({
        model: data.model,
        config: { responseModalities: [Modality.AUDIO] },
        callbacks: {
          onmessage: handleMessage,
          onerror: (e) => console.error("Live-API-Fehler", e),
          onclose: handleClose,
        },
      });
    },
    [caseId, handleMessage, handleClose],
  );

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const start = useCallback(async () => {
    await teardown();
    r.current = freshInternals();
    setTurns([]);
    setLatencies([]);
    setError(null);
    setRemainingSeconds(durationSeconds);
    setStatus("connecting");

    const i = r.current;
    try {
      i.player = new PcmPlayer();
      await i.player.init();
      i.mic = new MicCapture(({ pcm16k, level }) => {
        i.recorded.push(pcm16k);
        // Echo der Rolle aus den Lautsprechern nicht als Nutzersprache werten.
        if (level > VOICE_LEVEL && !i.player?.isPlaying) i.lastVoiceAt = performance.now();
        setMicLevel(level);
        try {
          i.session?.sendRealtimeInput({
            audio: { data: int16ToBase64(pcm16k), mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}` },
          });
        } catch {
          // Während einer Wiederverbindung gehen einzelne Blöcke verloren.
        }
      });
      await connect();
      await i.mic.start();
    } catch (err) {
      const isPermission = err instanceof DOMException && err.name === "NotAllowedError";
      await fail(
        isPermission
          ? "Kein Mikrofonzugriff. Bitte im Browser erlauben und erneut starten."
          : err instanceof Error
            ? err.message
            : "Start fehlgeschlagen.",
      );
      return;
    }

    i.deadline = Date.now() + durationSeconds * 1000;
    setStatus("live");
    i.interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((i.deadline - Date.now()) / 1000));
      setRemainingSeconds(left);
      setActorSpeaking(Boolean(i.player?.isPlaying));
      if (left === 0) void stop();
    }, 200);
  }, [connect, durationSeconds, fail, stop, teardown]);

  useEffect(() => {
    return () => {
      r.current.endedByUser = true;
      void teardown();
    };
  }, [teardown]);

  /** Eigene Mikrofonspur der gesamten Situation als WAV (16 kHz, mono). */
  const getRecording = useCallback((): Blob | null => {
    const chunks = r.current.recorded;
    if (chunks.length === 0) return null;
    const wav = encodeWav(chunks, INPUT_SAMPLE_RATE);
    return new Blob([wav.buffer as ArrayBuffer], { type: "audio/wav" });
  }, []);

  return {
    status,
    error,
    turns,
    actorSpeaking,
    micLevel,
    latencies,
    remainingSeconds,
    start,
    stop,
    getRecording,
  };
}
