import Link from "next/link";
import { listCasesByStation } from "@/content/cases";
import { STATIONS, type StationType } from "@/lib/cases/schema";

const REIHENFOLGE: StationType[] = ["anamnese", "aufklaerung", "vorstellung", "arztbrief"];

const BEREICH_FARBE: Record<string, string> = {
  "Zahnarzt-Patienten-Kommunikation": "bg-accent/10 text-accent",
  "Zahnarzt-Zahnarzt-Kommunikation": "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "Schriftliche Station": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">FaMed Zahnmedizin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Prüfungstraining für die Fachsprachenprüfung Zahnmedizin
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Üben Sie alle vier Prüfungssituationen wie am Prüfungstag: mit Aufgabenblatt, Zeitvorgabe und einem
          KI-Gesprächspartner, mit dem Sie per Mikrofon sprechen. Danach erhalten Sie eine Auswertung nach den
          Bewertungskriterien der FaMed.
        </p>
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["4", "Prüfungssituationen"],
          ["11 Min.", "je mündliche Situation"],
          ["22 Min.", "schriftliche Station"],
          ["60 %", "Bestehensgrenze je Station"],
        ].map(([wert, label]) => (
          <div key={label} className="rounded-xl border border-border bg-card px-4 py-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="text-xl font-semibold tabular-nums">{wert}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="stationen">
        <h2 id="stationen" className="text-lg font-semibold">
          Die vier Prüfungssituationen
        </h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-2">
          {REIHENFOLGE.map((typ) => {
            const s = STATIONS[typ];
            const anzahl = listCasesByStation(typ).length;
            return (
              <li key={typ}>
                <Link
                  href={`/station/${typ}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
                      {s.nr}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${BEREICH_FARBE[s.bereich]}`}>
                      {s.bereich}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{s.label}</h3>
                  <p className="mt-1 text-sm text-muted">{s.minuten} Minuten · {anzahl} {anzahl === 1 ? "Thema" : "Themen"}</p>
                  <p className="mt-3 leading-relaxed">{s.kurz}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.worauf.map((w) => (
                      <li key={w} className="rounded-md bg-border/50 px-2 py-0.5 text-xs">
                        {w}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 text-sm font-medium text-accent group-hover:underline">Themen ansehen →</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">So läuft die Prüfung ab</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Die FaMed Zahnmedizin besteht aus zwei mündlichen Stationen mit je zwei Situationen und einer
            schriftlichen Station. Sie sprechen am Computer mit Schauspieler:innen; die Gespräche werden aufgezeichnet
            und später bewertet. Die schriftliche Station kommt immer zum Schluss.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Worauf bewertet wird</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>· Angemessenheit der Textsorte</li>
            <li>· Gesprächsführung und Adressatenbezug</li>
            <li>· Strukturelle Korrektheit (Grammatik, Wortschatz, Aussprache)</li>
            <li>· Gesamteindruck auf C1-Niveau</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">So üben Sie hier</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>· Kopfhörer aufsetzen, Mikrofon erlauben</li>
            <li>· Aufgabenblatt lesen, Gespräch selbst beginnen</li>
            <li>· Nach dem Gespräch: Auswertung mit Fehlern und Beispielformulierungen</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
