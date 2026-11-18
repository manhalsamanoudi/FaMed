import { AdminPanel } from "@/components/admin-panel";

export const metadata = { title: "Verwaltung – DentSim FSP" };

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Zugangscodes verwalten</h1>
      <p className="mt-1 text-muted">
        Codes erstellen und per WhatsApp weitergeben. Jeder Code gilt ab der ersten Anmeldung für die
        gewählte Laufzeit und immer nur auf einem Gerät.
      </p>
      <div className="mt-8">
        <AdminPanel />
      </div>
    </main>
  );
}
