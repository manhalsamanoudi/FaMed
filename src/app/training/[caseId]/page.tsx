import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCase, listCases } from "@/content/cases";
import { toPublicCase } from "@/lib/cases/schema";
import { StationRunner } from "@/components/station-runner";

/** Alle Fälle sind zur Build-Zeit bekannt → Seiten werden statisch vorgerendert. */
export async function generateStaticParams() {
  return listCases().map((c) => ({ caseId: c.id }));
}

export default function TrainingPage({ params }: PageProps<"/training/[caseId]">) {
  return (
    <Suspense fallback={<p className="p-6 text-muted">Fall wird geladen …</p>}>
      {params.then(({ caseId }) => (
        <CaseStation caseId={caseId} />
      ))}
    </Suspense>
  );
}

function CaseStation({ caseId }: { caseId: string }) {
  const c = getCase(caseId);
  if (!c) notFound();
  // Nur der öffentliche Teil (ohne Rollenkarte/Rubrik) geht an den Browser.
  return <StationRunner caseData={toPublicCase(c)} />;
}
