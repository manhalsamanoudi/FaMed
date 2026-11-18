"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { handleUnauthorized } from "@/lib/access/client-events";
import { STATIONS, type PublicCase } from "@/lib/cases/schema";
import type { EvaluateResponse } from "@/lib/evaluation/schema";
import { CaseSheet } from "./case-sheet";
import { EvaluationReport } from "./evaluation-report";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "bereit" | "laeuft" | "abgegeben";

/** Schriftliche Station: Gespräch anhören (pausier-/spulbar) und Arztbrief schreiben. */
export function LetterRunner({ caseData }: { caseData: PublicCase }) {
  const station = STATIONS.arztbrief;
  const [phase, setPhase] = useState<Phase>("bereit");
  const [remaining, setRemaining] = useState(caseData.durationSeconds);
  const [text, setText] = useState("");
  const [evalState, setEvalState] = useState<
    | { kind: "none" }
    | { kind: "loading" }
    | { kind: "done"; result: EvaluateResponse }
    | { kind: "error"; message: string }
  >({ kind: "none" });

  const audioRef = useRef<HTMLAudioElement>(null);
  const deadline = useRef(0);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Die Metadaten können schon vor der Hydration geladen sein – dann kam onLoadedMetadata zu früh.
  useEffect(() => {
    const t = setTimeout(() => {
      const a = audioRef.current;
      if (a && a.readyState >= 1 && Number.isFinite(a.duration)) setAudioDuration(a.duration);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "laeuft") return;
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        audioRef.current?.pause();
        setPhase("abgegeben");
      }
    }, 250);
    return () => clearInterval(t);
  }, [phase]);

  function start() {
    deadline.current = Date.now() + caseData.durationSeconds * 1000;
    setRemaining(caseData.durationSeconds);
    setPhase("laeuft");
    void audioRef.current?.play();
  }

  function seek(delta: number) {
    const a = audioRef.current;
    if (a) a.currentTime = Math.min(Math.max(0, a.currentTime + delta), a.duration || 0);
  }

  async function evaluate() {
    setEvalState({ kind: "loading" });
    try {
      const res = await fetch("/api/evaluate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: caseData.id, brief: text }),
      });
      if (await handleUnauthorized(res)) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Fehler ${res.status}`);
      setEvalState({ kind: "done", result: data as EvaluateResponse });
    } catch (err) {
      setEvalState({ kind: "error", message: err instanceof Error ? err.message : "Bewertung fehlgeschlagen." });
    }
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const locked = phase !== "laeuft";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/station/arztbrief" className="text-sm text-muted hover:text-foreground">
            ← {station.label}: alle Themen
          </Link>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-accent">
            {station.nr} · {station.label} · {station.bereich}
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">{caseData.title}</h1>
        </div>
        <div
          className={`rounded-lg border px-4 py-2 font-mono text-2xl tabular-nums ${
            phase === "laeuft" && remaining <= 120 ? "border-danger text-danger" : "border-border bg-card"
          }`}
          aria-label="Verbleibende Zeit"
        >
          {formatTime(remaining)}
        </div>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1.15fr]">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold">Aufgabenblatt</h2>
          <CaseSheet sheet={caseData.sheet} />
        </section>

        <section className="space-y-4 lg:sticky lg:top-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Anamnesegespräch anhören</h2>
            {caseData.audioSrc && (
              <audio
                ref={audioRef}
                src={caseData.audioSrc}
                preload="metadata"
                onTimeUpdate={(e) => setAudioTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={locked}
                onClick={() => seek(-10)}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-border/40 disabled:opacity-40"
                aria-label="10 Sekunden zurück"
              >
                ⟲ 10 s
              </button>
              <button
                type="button"
                disabled={locked}
                onClick={() => (playing ? audioRef.current?.pause() : void audioRef.current?.play())}
                className="min-w-28 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
              >
                {playing ? "Pause" : "Abspielen"}
              </button>
              <button
                type="button"
                disabled={locked}
                onClick={() => seek(10)}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-border/40 disabled:opacity-40"
                aria-label="10 Sekunden vor"
              >
                10 s ⟳
              </button>
              <span className="ml-auto font-mono text-sm tabular-nums text-muted">
                {formatTime(audioTime)} / {audioDuration ? formatTime(audioDuration) : "–:–"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={audioDuration || 0}
              step={0.1}
              value={audioTime}
              disabled={locked}
              onChange={(e) => {
                if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
              }}
              className="mt-3 w-full accent-[var(--accent)]"
              aria-label="Position im Gespräch"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Arztbrief</h2>
              <span className="text-xs text-muted">{words} Wörter</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={locked}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              placeholder={
                phase === "bereit"
                  ? "Klicken Sie auf „Station starten“. Danach läuft die Zeit, und Sie können das Gespräch anhören und schreiben."
                  : "Sehr geehrte Frau Kollegin, sehr geehrter Herr Kollege, …"
              }
              className="mt-3 block h-[22rem] w-full resize-y rounded-lg border border-border bg-background p-3 font-[inherit] text-[15px] leading-relaxed outline-none focus:border-accent disabled:opacity-70"
            />
            <p className="mt-2 text-xs text-muted">
              Wie in der Prüfung ohne Rechtschreibprüfung. Patientenaussagen im Konjunktiv I wiedergeben.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {phase === "bereit" && (
                <button
                  type="button"
                  onClick={start}
                  className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90"
                >
                  Station starten ({station.minuten} Min.)
                </button>
              )}
              {phase === "laeuft" && (
                <button
                  type="button"
                  onClick={() => {
                    audioRef.current?.pause();
                    setPhase("abgegeben");
                  }}
                  className="rounded-lg border border-accent px-5 py-2.5 font-medium text-accent hover:bg-accent/10"
                >
                  Brief abgeben
                </button>
              )}
              {phase === "abgegeben" && evalState.kind !== "loading" && (
                <>
                  <button
                    type="button"
                    disabled={words < 5}
                    onClick={() => void evaluate()}
                    className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {evalState.kind === "done" ? "Erneut auswerten" : "Auswertung starten"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setText("");
                      setEvalState({ kind: "none" });
                      setPhase("bereit");
                      setRemaining(caseData.durationSeconds);
                      if (audioRef.current) audioRef.current.currentTime = 0;
                    }}
                    className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-border/40"
                  >
                    Neu beginnen
                  </button>
                </>
              )}
            </div>
            {phase === "abgegeben" && remaining === 0 && (
              <p className="mt-3 text-sm text-danger">Die Zeit ist abgelaufen. Ihr Brief wurde abgegeben.</p>
            )}
          </div>
        </section>
      </div>

      {evalState.kind === "loading" && (
        <p className="mt-8 rounded-xl border border-border bg-card p-5" role="status">
          Auswertung läuft … das dauert meist unter einer Minute.
        </p>
      )}
      {evalState.kind === "error" && (
        <p className="mt-8 rounded-xl bg-danger/10 p-5 text-danger" role="alert">
          {evalState.message}
        </p>
      )}
      {evalState.kind === "done" && <EvaluationReport result={evalState.result} schriftlich />}
    </main>
  );
}
