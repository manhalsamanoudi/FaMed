import { Suspense } from "react";
import { AccessForm } from "@/components/access-form";

export const metadata = { title: "Zugang" };

export default function ZugangPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">FaMed Zahnmedizin</p>
      <h1 className="mt-2 text-2xl font-semibold">Zugang zum Prüfungstraining</h1>
      <p className="mt-2 text-muted">Bitte geben Sie den Zugangscode ein, den Sie erhalten haben.</p>
      <Suspense fallback={null}>
        <AccessForm />
      </Suspense>
    </main>
  );
}
