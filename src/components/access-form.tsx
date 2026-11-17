"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccessForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
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
    </form>
  );
}
