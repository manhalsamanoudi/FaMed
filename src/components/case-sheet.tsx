import type { Punkt, Sheet } from "@/lib/cases/schema";

function Punkte({ punkte, tiefe = 0 }: { punkte: Punkt[]; tiefe?: number }) {
  const listStyle = tiefe === 0 ? "list-disc" : tiefe === 1 ? "list-[circle]" : "list-[square]";
  return (
    <ul className={`${listStyle} space-y-1 pl-5`}>
      {punkte.map((p) => (
        <li key={p.text}>
          {p.text}
          {p.unterpunkte?.length ? (
            <div className="mt-1">
              <Punkte punkte={p.unterpunkte} tiefe={tiefe + 1} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Aufgabenblatt im Aufbau des FaMed-Übungstests Zahnmedizin. */
export function CaseSheet({ sheet }: { sheet: Sheet }) {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Kurzbeschreibung</h3>
        <p className="mt-1">{sheet.kurzbeschreibung}</p>
      </section>
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Gesprächssituation</h3>
        <p className="mt-1">{sheet.gespraechssituation}</p>
      </section>

      {sheet.abschnitte.map((a) => (
        <section key={a.titel}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{a.titel}</h3>
          <dl className="mt-2 divide-y divide-border rounded-lg border border-border">
            {a.eintraege.map((e) => (
              <div key={e.label} className="grid gap-1 px-3 py-2 sm:grid-cols-[minmax(9rem,32%)_1fr] sm:gap-3">
                <dt className="font-medium">{e.label}</dt>
                <dd>
                  {Array.isArray(e.wert) ? (
                    <ul className="list-disc space-y-0.5 pl-5">
                      {e.wert.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    e.wert
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Aufgabentext</h3>
        <p className="mt-1 font-medium">{sheet.aufgabentext.einleitung}</p>
        <div className="mt-2">
          <Punkte punkte={sheet.aufgabentext.punkte} />
        </div>
        {sheet.aufgabentext.schluss && <p className="mt-3">{sheet.aufgabentext.schluss}</p>}
      </section>
    </div>
  );
}
