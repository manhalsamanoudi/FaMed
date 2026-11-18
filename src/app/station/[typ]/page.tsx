import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { listCasesByStation } from "@/content/cases";
import { STATIONS, stationTypeSchema, type StationType } from "@/lib/cases/schema";

export async function generateStaticParams() {
  return stationTypeSchema.options.map((typ) => ({ typ }));
}

export default function StationPage({ params }: PageProps<"/station/[typ]">) {
  return (
    <Suspense fallback={<p className="p-6 text-muted">Lade …</p>}>
      {params.then(({ typ }) => (
        <StationListe typ={typ} />
      ))}
    </Suspense>
  );
}

function StationListe({ typ }: { typ: string }) {
  const parsed = stationTypeSchema.safeParse(typ);
  if (!parsed.success) notFound();
  const station: StationType = parsed.data;
  const s = STATIONS[station];
  const faelle = listCasesByStation(station);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Alle Prüfungssituationen
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-semibold text-accent-foreground">
          {s.nr}
        </span>
        <div>
          <p className="text-sm font-medium text-accent">{s.bereich}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.label}</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted">{s.kurz}</p>
          <p className="mt-3 text-sm">
            <span className="font-medium">{s.minuten} Minuten</span>
            <span className="text-muted"> · Worauf es ankommt: {s.worauf.join(", ")}</span>
          </p>
        </div>
      </header>

      <h2 className="mt-10 text-lg font-semibold">Themen ({faelle.length})</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {faelle.map((f) => (
          <li key={f.id}>
            <Link
              href={`/training/${f.id}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-sm"
            >
              <span className="text-lg font-medium">{f.title}</span>
              <span className="mt-1 text-sm text-muted">{f.untertitel}</span>
              <span className="mt-4 text-sm font-medium text-accent group-hover:underline">
                {station === "arztbrief" ? "Station starten →" : "Gespräch üben →"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
