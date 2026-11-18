"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminCode } from "@/lib/access/admin-dto";
import { formatDateTime, handleUnauthorized } from "@/lib/access/client-events";
import { DURATION_PRESETS, formatDuration, type CodeKind } from "@/lib/access/codes";
import { buildShareMessage, whatsappLink } from "@/lib/access/share";

const STATUS_STYLE: Record<AdminCode["status"], { label: string; cls: string }> = {
  neu: { label: "noch nicht benutzt", cls: "bg-border/60 text-foreground" },
  aktiv: { label: "aktiv", cls: "bg-success/15 text-success" },
  abgelaufen: { label: "abgelaufen", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  gesperrt: { label: "gesperrt", cls: "bg-danger/15 text-danger" },
};

type Filter = "alle" | "aktiv" | "neu" | "beendet";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (await handleUnauthorized(res)) throw new Error("Abgemeldet.");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Fehler ${res.status}`);
  return data as T;
}

export function AdminPanel() {
  const [codes, setCodes] = useState<AdminCode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<AdminCode | null>(null);
  const [filter, setFilter] = useState<Filter>("alle");
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api<{ codes: AdminCode[] }>("/api/admin/codes");
      setCodes(data.codes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Laden fehlgeschlagen.");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setOrigin(window.location.origin);
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  function replace(updated: AdminCode) {
    setCodes((list) => list?.map((c) => (c.id === updated.id ? updated : c)) ?? null);
    setCreated((c) => (c?.id === updated.id ? updated : c));
  }

  async function act(c: AdminCode, body: object, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    try {
      const data = await api<{ code: AdminCode }>(`/api/admin/codes/${c.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      replace(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aktion fehlgeschlagen.");
    }
  }

  async function remove(c: AdminCode) {
    if (!window.confirm(`Code von „${c.name}“ endgültig löschen? Die Person wird sofort abgemeldet.`)) return;
    try {
      await api(`/api/admin/codes/${c.id}`, { method: "DELETE" });
      setCodes((list) => list?.filter((x) => x.id !== c.id) ?? null);
      setCreated((x) => (x?.id === c.id ? null : x));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
    }
  }

  const visible = useMemo(() => {
    if (!codes) return [];
    if (filter === "alle") return codes;
    if (filter === "beendet") return codes.filter((c) => c.status === "abgelaufen" || c.status === "gesperrt");
    return codes.filter((c) => c.status === filter);
  }, [codes, filter]);

  const counts = useMemo(() => {
    const list = codes ?? [];
    return {
      alle: list.length,
      aktiv: list.filter((c) => c.status === "aktiv").length,
      neu: list.filter((c) => c.status === "neu").length,
      beendet: list.filter((c) => c.status === "abgelaufen" || c.status === "gesperrt").length,
    };
  }, [codes]);

  return (
    <div className="space-y-8">
      <CreateForm
        onCreated={(c) => {
          setCreated(c);
          setCodes((list) => [c, ...(list ?? [])]);
        }}
      />

      {created && (
        <section className="rounded-xl border-2 border-accent bg-card p-5" aria-live="polite">
          <h2 className="font-semibold">Neuer Code für {created.name}</h2>
          <p className="mt-3 select-all font-mono text-2xl tracking-wide">{created.code}</p>
          <p className="mt-1 text-sm text-muted">
            {created.art === "test" ? "Testzugang" : "Zugang"} · {formatDuration(created.laufzeitStunden)} ab der
            ersten Anmeldung
          </p>
          <ShareButtons code={created} origin={origin} large />
        </section>
      )}

      {error && (
        <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Alle Codes</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {(
              [
                ["alle", "Alle"],
                ["aktiv", "Aktiv"],
                ["neu", "Unbenutzt"],
                ["beendet", "Abgelaufen/gesperrt"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1 ${
                  filter === key ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card"
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
            <button type="button" onClick={() => void load()} className="rounded-full border border-border bg-card px-3 py-1">
              ↻ Aktualisieren
            </button>
          </div>
        </div>

        {codes === null && !error && <p className="mt-4 text-muted">Lade …</p>}
        {codes && visible.length === 0 && (
          <p className="mt-4 text-muted">{codes.length === 0 ? "Noch keine Codes erstellt." : "Keine Codes in diesem Filter."}</p>
        )}

        <ul className="mt-4 space-y-3">
          {visible.map((c) => (
            <li key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {c.name}{" "}
                    {c.art === "test" && (
                      <span className="ml-1 rounded bg-border/60 px-1.5 py-0.5 text-xs font-normal">Test</span>
                    )}
                  </p>
                  <p className="mt-0.5 select-all font-mono text-sm">{c.code}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[c.status].cls}`}>
                  {STATUS_STYLE[c.status].label}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted">Laufzeit</dt>
                  <dd>{formatDuration(c.laufzeitStunden)}</dd>
                </div>
                <div>
                  <dt className="text-muted">{c.ablauf ? "Gültig bis" : "Erstellt"}</dt>
                  <dd>{formatDateTime(c.ablauf ?? c.erstellt)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Zuletzt aktiv</dt>
                  <dd>{formatDateTime(c.zuletztAktiv)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Gerät</dt>
                  <dd>{c.geraetAngemeldet ? "angemeldet" : "–"} · {c.anmeldungen}× angemeldet</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <ShareButtons code={c} origin={origin} />
                <select
                  aria-label={`Code von ${c.name} verlängern`}
                  className="rounded-lg border border-border bg-card px-2 py-1.5"
                  value=""
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    if (h) void act(c, { aktion: "verlaengern", stunden: h });
                  }}
                >
                  <option value="">Verlängern …</option>
                  <option value="24">+ 1 Tag</option>
                  <option value="168">+ 7 Tage</option>
                  <option value="720">+ 30 Tage</option>
                </select>
                {c.geraetAngemeldet && (
                  <button
                    type="button"
                    onClick={() => void act(c, { aktion: "abmelden" })}
                    className="rounded-lg border border-border px-3 py-1.5 hover:bg-border/40"
                  >
                    Gerät abmelden
                  </button>
                )}
                {c.status === "gesperrt" ? (
                  <button
                    type="button"
                    onClick={() => void act(c, { aktion: "entsperren" })}
                    className="rounded-lg border border-border px-3 py-1.5 hover:bg-border/40"
                  >
                    Entsperren
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void act(c, { aktion: "sperren" }, `Zugang von „${c.name}“ sperren?`)}
                    className="rounded-lg border border-border px-3 py-1.5 hover:bg-border/40"
                  >
                    Sperren
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void remove(c)}
                  className="rounded-lg border border-danger/40 px-3 py-1.5 text-danger hover:bg-danger/10"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CreateForm({ onCreated }: { onCreated: (c: AdminCode) => void }) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<string>("0");
  const [customValue, setCustomValue] = useState(3);
  const [customUnit, setCustomUnit] = useState<"stunden" | "tage">("tage");
  const [customKind, setCustomKind] = useState<CodeKind>("nutzer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCustom = preset === "eigene";
  const chosen = isCustom
    ? {
        hours: customUnit === "tage" ? customValue * 24 : customValue,
        kind: customKind,
      }
    : DURATION_PRESETS[Number(preset)];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api<{ code: AdminCode }>("/api/admin/codes", {
        method: "POST",
        body: JSON.stringify({ name, art: chosen.kind, stunden: chosen.hours }),
      });
      onCreated(data.code);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erstellen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Neuen Code erstellen</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Name der Person</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            placeholder="z. B. Dr. Ahmad"
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Laufzeit</span>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            {DURATION_PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
            <option value="eigene">Eigene Laufzeit …</option>
          </select>
        </label>
      </div>

      {isCustom && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-sm font-medium">Dauer</span>
            <input
              type="number"
              min={1}
              max={customUnit === "tage" ? 365 : 8760}
              value={customValue}
              onChange={(e) => setCustomValue(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 block w-24 rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <select
            aria-label="Einheit"
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value as "stunden" | "tage")}
            className="rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="stunden">Stunden</option>
            <option value="tage">Tage</option>
          </select>
          <select
            aria-label="Art"
            value={customKind}
            onChange={(e) => setCustomKind(e.target.value as CodeKind)}
            className="rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="nutzer">normaler Zugang</option>
            <option value="test">Testzugang</option>
          </select>
        </div>
      )}

      <p className="mt-3 text-sm text-muted">
        Gültig für {formatDuration(chosen.hours)} ab der ersten Anmeldung · nur ein Gerät gleichzeitig
      </p>
      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !name.trim()}
        className="mt-4 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Erstelle …" : "Code erstellen"}
      </button>
    </form>
  );
}

function ShareButtons({ code, origin, large = false }: { code: AdminCode; origin: string; large?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);
  const message = buildShareMessage({
    name: code.name,
    code: code.code,
    laufzeitStunden: code.laufzeitStunden,
    url: origin,
    art: code.art,
  });

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Zum Kopieren markieren:", text);
    }
  }

  const btn = large
    ? "rounded-lg px-4 py-2 font-medium"
    : "rounded-lg px-3 py-1.5";

  return (
    <div className={`flex flex-wrap gap-2 ${large ? "mt-4" : ""}`}>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} bg-[#25D366] text-[#05301a] hover:opacity-90`}
      >
        Per WhatsApp senden
      </a>
      <button type="button" onClick={() => void copy(message, "nachricht")} className={`${btn} border border-border hover:bg-border/40`}>
        {copied === "nachricht" ? "✓ Kopiert" : "Nachricht kopieren"}
      </button>
      <button type="button" onClick={() => void copy(code.code, "code")} className={`${btn} border border-border hover:bg-border/40`}>
        {copied === "code" ? "✓ Kopiert" : "Nur Code kopieren"}
      </button>
    </div>
  );
}
