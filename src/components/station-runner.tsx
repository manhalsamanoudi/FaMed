"use client";

import Link from "next/link";
import { useState } from "react";
import { handleUnauthorized } from "@/lib/access/client-events";
import { STATION_LABELS, type PublicCase } from "@/lib/cases/schema";
import type { EvaluateResponse } from "@/lib/evaluation/schema";
import { formatTranscript, median } from "@/lib/live/transcript";
import { useLiveConversation } from "@/lib/live/use-live-conversation";
import { EvaluationReport } from "./evaluation-report";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const STATUS_TEXT = {
  idle: "Bereit",
  connecting: "Verbinde …",
  live: "Gespräch läuft",
  reconnecting: "Verbindung wird wiederhergestellt …",
  ended: "Gespräch beendet",
  error: "Fehler",
} as const;

export function StationRunner({ caseData }: { caseData: PublicCase }) {
  const conv = useLiveConversation(caseData.id, caseData.durationSeconds);
  const [showTranscript, setShowTranscript] = useState(true);
  const [evalState, setEvalState] = useState<
    | { kind: "none" }
    | { kind: "loading" }
    | { kind: "done"; result: EvaluateResponse }
    | { kind: "error"; message: string }
  >({ kind: "none" });

  const isRunning = conv.status === "live" || conv.status === "reconnecting";
  const sheet = caseData.candidateSheet;
  const partnerLabel = caseData.actorCard.role === "patient" ? "Patient:in" : "Kolleg:in";
  const medianLatency = median(conv.latencies);

  async function evaluate() {
    const audio = conv.getRecording();
    if (!audio) {
      setEvalState({ kind: "error", message: "Keine Aufnahme vorhanden." });
      return;
    }
    setEvalState({ kind: "loading" });
    const form = new FormData();
    form.append("audio", audio, "aufnahme.wav");
    form.append("caseId", caseData.id);
    form.append(
      "transcript",
      formatTranscript(conv.turns, { user: "Zahnarzt", actor: partnerLabel }),
    );
    try {
      const res = await fetch("/api/evaluate", { method: "POST", body: form });
      if (await handleUnauthorized(res)) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Fehler ${res.status}`);
      setEvalState({ kind: "done", result: data as EvaluateResponse });
    } catch (err) {
      setEvalState({
        kind: "error",
        message: err instanceof Error ? err.message : "Bewertung fehlgeschlagen.",
      });
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Übersicht
          </Link>
          <h1 className="text-xl font-semibold">
            {STATION_LABELS[caseData.stationType]}: {caseData.title}
          </h1>
        </div>
        <div
          className={`rounded-lg border px-4 py-2 font-mono text-2xl tabular-nums ${
            isRunning && conv.remainingSeconds <= 60
              ? "border-danger text-danger"
              : "border-border bg-card"
          }`}
          aria-label="Verbleibende Zeit"
        >
          {formatTime(conv.remainingSeconds)}
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Aufgabenblatt */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Aufgabenblatt
          </h2>
          <p className="mt-3">{sheet.kurzbeschreibung}</p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {sheet.patientInfo.map((p) => (
              <div key={p.label} className="contents">
                <dt className="text-muted">{p.label}</dt>
                <dd>{p.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-5 font-medium">Aufgabe</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {sheet.aufgaben.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">
            Sie haben für die gesamte Situation maximal{" "}
            {Math.round(caseData.durationSeconds / 60)} Minuten Zeit.
          </p>
        </section>

        {/* Gesprächspartner */}
        <section className="flex flex-col rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-semibold transition ${
                conv.actorSpeaking
                  ? "bg-accent text-accent-foreground ring-4 ring-accent/30"
                  : "bg-border text-foreground"
              }`}
              aria-hidden
            >
              {caseData.actorCard.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{sheet.gesprächspartner}</p>
              <p className="text-sm text-muted" role="status">
                {conv.actorSpeaking ? `${partnerLabel} spricht …` : STATUS_TEXT[conv.status]}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted">Ihr Mikrofon</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-100"
                style={{ width: `${isRunning ? Math.min(100, conv.micLevel * 600) : 0}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {!isRunning && conv.status !== "connecting" ? (
              <button
                type="button"
                onClick={() => {
                  setEvalState({ kind: "none" });
                  void conv.start();
                }}
                className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90"
              >
                {conv.status === "idle" ? "Gespräch starten" : "Neu starten"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void conv.stop()}
                disabled={conv.status === "connecting"}
                className="rounded-lg border border-danger px-5 py-2.5 font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
              >
                Gespräch beenden
              </button>
            )}
            {conv.status === "ended" && evalState.kind !== "loading" && (
              <button
                type="button"
                onClick={() => void evaluate()}
                className="rounded-lg border border-accent px-5 py-2.5 font-medium text-accent hover:bg-accent/10"
              >
                {evalState.kind === "done" ? "Erneut auswerten" : "Auswertung starten"}
              </button>
            )}
          </div>

          {conv.status === "idle" && (
            <p className="mt-4 text-sm text-muted">
              Tipp: Kopfhörer verwenden. Beginnen Sie das Gespräch selbst, z. B. mit Begrüßung und
              Vorstellung.
            </p>
          )}
          {conv.error && (
            <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger" role="alert">
              {conv.error}
            </p>
          )}

          <div className="mt-5 text-xs text-muted">
            Antwortzeit (Median):{" "}
            {medianLatency === null ? "–" : `${(medianLatency / 1000).toFixed(2)} s`} ·
            Messungen: {conv.latencies.length}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Live-Transkript
            </h2>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={showTranscript}
                onChange={(e) => setShowTranscript(e.target.checked)}
              />
              anzeigen
            </label>
          </div>
          {showTranscript && (
            <ol className="mt-2 max-h-80 space-y-2 overflow-y-auto text-sm">
              {conv.turns.map((t) => (
                <li key={t.id}>
                  <span className="font-medium">
                    {t.role === "user" ? "Sie" : partnerLabel}:
                  </span>{" "}
                  {t.text}
                </li>
              ))}
              {conv.turns.length === 0 && <li className="text-muted">Noch nichts gesprochen.</li>}
            </ol>
          )}
        </section>
      </div>

      {evalState.kind === "loading" && (
        <p className="mt-8 rounded-xl border border-border bg-card p-5" role="status">
          Auswertung läuft … das dauert meist unter einer Minute, bei ausgelasteten kostenlosen
          Modellen auch etwas länger.
        </p>
      )}
      {evalState.kind === "error" && (
        <p className="mt-8 rounded-xl bg-danger/10 p-5 text-danger" role="alert">
          {evalState.message}
        </p>
      )}
      {evalState.kind === "done" && <EvaluationReport result={evalState.result} />}
    </main>
  );
}
