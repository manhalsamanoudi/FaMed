"use client";

/** Meldet der Kopfzeile, dass eine API den Zugang abgelehnt hat (z. B. anderes Gerät). */
export const LOGGED_OUT_EVENT = "dentsim:abgemeldet";

export function notifyLoggedOut(grund: string | undefined) {
  window.dispatchEvent(new CustomEvent(LOGGED_OUT_EVENT, { detail: grund ?? "keine-anmeldung" }));
}

/** Prüft eine API-Antwort; bei 401 wird die Abmeldung gemeldet. */
export async function handleUnauthorized(res: Response): Promise<boolean> {
  if (res.status !== 401) return false;
  const data = (await res.clone().json().catch(() => ({}))) as { grund?: string };
  notifyLoggedOut(data.grund);
  return true;
}

export const REASON_MESSAGES: Record<string, string> = {
  unbekannt: "Der Code ist nicht richtig.",
  abgelaufen: "Dein Zugang ist abgelaufen. Bitte einen neuen Code anfragen.",
  gesperrt: "Dieser Zugang wurde gesperrt.",
  "anderes-geraet":
    "Du wurdest abgemeldet, weil dein Code auf einem anderen Gerät verwendet wurde. Ein Code gilt immer nur für ein Gerät.",
  "nur-master": "Die Verwaltung ist nur mit dem Master-Code zugänglich.",
  stoerung: "Die Anmeldung ist gerade gestört. Bitte in einer Minute erneut versuchen.",
  abgemeldet: "Du bist abgemeldet.",
};

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "–";
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}
