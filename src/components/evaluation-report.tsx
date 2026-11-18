import {
  CLUSTERS,
  PASS_THRESHOLD,
  type ClusterKey,
  type EvaluateResponse,
} from "@/lib/evaluation/schema";

const STATUS_LABEL = { erfuellt: "erfüllt", teilweise: "teilweise", fehlt: "fehlt" } as const;
const STATUS_CLASS = {
  erfuellt: "text-success",
  teilweise: "text-amber-600 dark:text-amber-400",
  fehlt: "text-danger",
} as const;

export function EvaluationReport({
  result,
  schriftlich = false,
}: {
  result: EvaluateResponse;
  /** Arztbrief: kein Transkript/keine Aussprache, dafür Musterbrief */
  schriftlich?: boolean;
}) {
  const e = result.evaluation;
  const passed = result.overall >= PASS_THRESHOLD;

  return (
    <section className="mt-8 space-y-6" aria-label="Auswertung">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold">Auswertung (KI-Schätzung)</h2>
          <span className={`text-lg font-semibold ${passed ? "text-success" : "text-danger"}`}>
            {result.overall} / 100 · {passed ? "über" : "unter"} der {PASS_THRESHOLD}-%-Grenze
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(Object.keys(CLUSTERS) as ClusterKey[]).map((k) => (
            <div key={k}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{CLUSTERS[k]}</span>
                <span className="tabular-nums">{e.cluster[k].punkte}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className={`h-full rounded-full ${
                    e.cluster[k].punkte >= PASS_THRESHOLD ? "bg-success" : "bg-danger"
                  }`}
                  style={{ width: `${e.cluster[k].punkte}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted">{e.cluster[k].begruendung}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Top-Empfehlungen</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {e.empfehlungen.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Aufgabenerfüllung · {result.coverage} %</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {e.checkliste.map((c) => (
              <li key={c.id}>
                <span className={`font-medium ${STATUS_CLASS[c.status]}`}>
                  {STATUS_LABEL[c.status]}
                </span>{" "}
                – {result.checklistLabels[c.id] ?? c.id}
                {c.beleg && <span className="block text-muted">„{c.beleg}“</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {e.nichtErklaerteFachbegriffe.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Nicht erklärte Fachbegriffe</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {e.nichtErklaerteFachbegriffe.map((f) => (
                  <li key={f.begriff}>
                    <span className="font-medium">{f.begriff}</span> → {f.laienVorschlag}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">{schriftlich ? "Lesefluss und Struktur" : "Flüssigkeit"}</h3>
            <p className="mt-2 text-sm">{e.fluessigkeit}</p>
            {e.ausspracheHinweise.length > 0 && (
              <>
                <h3 className="mt-4 font-semibold">Aussprache</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {e.ausspracheHinweise.map((a) => (
                    <li key={a.wort}>
                      <span className="font-medium">{a.wort}</span>: {a.hinweis}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {e.fehler.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Sprachliche Fehler</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="py-2 pr-4 font-medium">{schriftlich ? "Geschrieben" : "Gesagt"}</th>
                  <th className="py-2 pr-4 font-medium">Besser</th>
                  <th className="py-2 font-medium">Warum</th>
                </tr>
              </thead>
              <tbody>
                {e.fehler.map((f, idx) => (
                  <tr key={idx} className="border-t border-border align-top">
                    <td className="py-2 pr-4 text-danger">{f.zitat}</td>
                    <td className="py-2 pr-4 text-success">{f.korrektur}</td>
                    <td className="py-2">
                      <span className="text-muted">{f.kategorie}:</span> {f.erklaerung}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.beispiele.length > 0 && (
        <div className="rounded-xl border border-accent/40 bg-card p-5">
          <h3 className="font-semibold">Beispielformulierungen</h3>
          <p className="mt-1 text-sm text-muted">So könnte man es sagen – zum Vergleich mit Ihren eigenen Formulierungen.</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {result.beispiele.map((b) => (
              <div key={b.zu}>
                <h4 className="text-sm font-semibold text-accent">{b.zu}</h4>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
                  {b.saetze.map((s) => (
                    <li key={s} className="border-l-2 border-border pl-3">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.musterbrief && (
        <details className="rounded-xl border border-accent/40 bg-card p-5" open>
          <summary className="cursor-pointer font-semibold">Musterbrief zum Vergleich</summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{result.musterbrief}</p>
        </details>
      )}

      {!schriftlich && (
        <details className="rounded-xl border border-border bg-card p-5">
          <summary className="cursor-pointer font-semibold">Wortgetreues Transkript (Ihre Äußerungen)</summary>
          <p className="mt-3 whitespace-pre-wrap text-sm">{e.wortgetreuesTranskript}</p>
        </details>
      )}

      <p className="text-xs text-muted">
        Bewertet von {result.model}. Schätzung ohne Gewähr – keine Prognose für die echte Prüfung.
      </p>
    </section>
  );
}
