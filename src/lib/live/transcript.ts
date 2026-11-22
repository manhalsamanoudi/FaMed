export type Speaker = "user" | "actor";

export type Turn = {
  id: number;
  role: Speaker;
  text: string;
};

/**
 * Hängt ein Transkript-Fragment an. Fragmente derselben Person werden zu einem
 * Redebeitrag zusammengefasst, bis die andere Person spricht.
 */
export function appendTranscript(turns: Turn[], role: Speaker, fragment: string): Turn[] {
  if (!fragment) return turns;
  const last = turns[turns.length - 1];
  if (last && last.role === role) {
    return [...turns.slice(0, -1), { ...last, text: joinFragments(last.text, fragment) }];
  }
  const id = last ? last.id + 1 : 1;
  return [...turns, { id, role, text: fragment.trimStart() }];
}

function joinFragments(a: string, b: string): string {
  if (!a) return b.trimStart();
  return a + b;
}

/**
 * Entfernt technische Markierungen aus dem Transkript. Schweigt die Rolle bewusst
 * (proactiveAudio), liefert das Modell manchmal „<!-- No audio response -->“.
 * Auch eine noch nicht abgeschlossene Markierung am Ende wird ausgeblendet.
 */
export function sichtbarerText(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<!--[\s\S]*$/, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[.…\s]+$/, "")
    .trim();
}

/** Text-Darstellung für Bewertung und Export. */
export function formatTranscript(turns: Turn[], labels: Record<Speaker, string>): string {
  return turns
    .map((t) => ({ ...t, text: sichtbarerText(t.text) }))
    .filter((t) => t.text.length > 0)
    .map((t) => `${labels[t.role]}: ${t.text}`)
    .join("\n");
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((x, y) => x - y);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
