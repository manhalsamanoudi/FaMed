import { AccessForm } from "@/components/access-form";

export const metadata = { title: "Zugang – DentSim FSP" };

export default function ZugangPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">DentSim FSP</p>
      <h1 className="mt-2 text-2xl font-semibold">Zugang zur Testversion</h1>
      <p className="mt-2 text-muted">
        Bitte den Zugangscode eingeben, den du erhalten hast.
      </p>
      <AccessForm />
    </main>
  );
}
