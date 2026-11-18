import { formatDuration } from "./codes";

/** Nachricht zum Weitergeben eines Codes (z. B. per WhatsApp). */
export function buildShareMessage(input: {
  name: string;
  code: string;
  laufzeitStunden: number;
  url: string;
  art: "nutzer" | "test";
}): string {
  const greeting = input.name ? `Hallo ${input.name}!` : "Hallo!";
  const what = input.art === "test" ? "deinen Testzugang" : "deinen Zugang";
  return [
    `${greeting} Hier ist ${what} zum Prüfungstraining FaMed Zahnmedizin (DentSim FSP):`,
    "",
    `🔗 ${input.url}`,
    `🔑 Code: ${input.code}`,
    `⏱ Gültig: ${formatDuration(input.laufzeitStunden)} ab der ersten Anmeldung`,
    "",
    "Wichtig: Der Code funktioniert immer nur auf einem Gerät. Bitte am Computer mit Chrome oder Edge und Kopfhörern öffnen und das Mikrofon erlauben.",
    "Falls die Seite beim ersten Öffnen etwa eine Minute lädt: kurz warten.",
  ].join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
