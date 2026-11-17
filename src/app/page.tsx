import Link from "next/link";
import { listCases } from "@/content/cases";
import { STATION_LABELS } from "@/lib/cases/schema";

export default function Home() {
  const cases = listCases();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">DentSim FSP</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Prüfungstraining Fachsprache Zahnmedizin
      </h1>
      <p className="mt-4 text-lg text-muted">
        Führe Gespräche per Mikrofon mit KI-Patient:innen und KI-Kolleg:innen – mit echtem
        Prüfungstiming und anschließender Auswertung nach den Bewertungskriterien der
        Fachsprachenprüfung.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Stationstraining</h2>
        <ul className="mt-4 grid gap-3">
          {cases.map((c) => (
            <li key={c.id}>
              <Link
                href={`/training/${c.id}`}
                className="block rounded-xl border border-border bg-card p-5 transition hover:border-accent"
              >
                <span className="text-sm text-muted">
                  {STATION_LABELS[c.stationType]} · {Math.round(c.durationSeconds / 60)} Min.
                </span>
                <span className="mt-1 block text-lg font-medium">{c.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-5 text-sm text-muted">
        <p>
          <strong className="text-foreground">Hinweis:</strong> Unabhängiges Trainingsangebot.
          Nicht offiziell und nicht verbunden mit der FaMed bzw. der digiFORT Gesundheit und
          Pflege GmbH. Alle Bewertungen sind KI-Schätzungen und keine Prognose für die echte
          Prüfung.
        </p>
        <p className="mt-2">
          Entwicklungsversion: Gespräche und Aufnahmen werden über die kostenlose Gemini-API
          verarbeitet. Google kann diese Inhalte zur Verbesserung seiner Produkte nutzen. Bitte
          keine echten Patientendaten verwenden.
        </p>
      </section>
    </main>
  );
}
