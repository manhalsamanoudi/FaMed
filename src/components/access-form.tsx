"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { REASON_MESSAGES } from "@/lib/access/client-events";

export function AccessForm() {
  const router = useRouter();
  const grund = useSearchParams().get("grund");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const notice = !error && grund ? REASON_MESSAGES[grund] : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/zugang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; rolle?: string };
      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }
      router.replace(data.rolle === "master" ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Keine Verbindung. Bitte erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {notice && (
        <p
          className={`rounded-lg p-3 text-sm ${
            grund === "abgemeldet" ? "bg-border/50" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
          }`}
          role="status"
        >
          {notice}
        </p>
      )}
      <label className="block">
        <span className="text-sm font-medium">Zugangscode</span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="z. B. Molar-1234-Krone"
          className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2.5 text-base outline-none focus:border-accent"
        />
      </label>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || code.trim().length === 0}
        className="w-full rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Prüfe …" : "Weiter"}
      </button>
      <p className="text-xs text-muted">
        Ein Code gilt immer nur auf einem Gerät. Meldest du dich woanders an, wirst du hier
        abgemeldet.
      </p>
    </form>
  );
}
