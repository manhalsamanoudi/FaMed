import type { StationType } from "@/lib/cases/schema";

/**
 * Leitfragen für die Bewertenden, angelehnt an den offiziellen FaMed-Übungstest
 * Zahnmedizin (Blätter „B“). Dieselben fünf Fragen gelten für jede mündliche
 * Situation; die schriftliche Station hat eigene.
 */
export const BOGEN_KEYS = ["aufgabenerfuellung", "klarheit", "angemessenheit", "fehler", "gesamteindruck"] as const;
export type BogenKey = (typeof BOGEN_KEYS)[number];

export function leitfragen(station: StationType): Record<BogenKey, string> {
  if (station === "arztbrief") {
    return {
      aufgabenerfuellung: "Sind alle Informationen korrekt und fachsprachlich angemessen verschriftlicht?",
      klarheit: "Ist der Text klar und strukturiert?",
      angemessenheit: "Sind die Patientenaussagen angemessen in indirekter Rede wiedergegeben?",
      fehler: "Sind Fehler (Orthografie, Grammatik, Wortschatz) selten – und stören sie das Verständnis?",
      gesamteindruck: "Wie ist der Gesamteindruck des Textes?",
    };
  }
  return {
    aufgabenerfuellung: "Wurden die Aufgaben aus dem Aufgabentext angemessen erfüllt?",
    klarheit: "War die Kommunikation klar, flüssig und strukturiert?",
    angemessenheit:
      station === "vorstellung"
        ? "War die Kommunikation flexibel, prägnant und der Situation angemessen?"
        : "War die Kommunikation flexibel und der Situation angemessen?",
    fehler: "Waren Fehler (Aussprache, Grammatik, Wortschatz) selten – und störten sie das Verständnis?",
    gesamteindruck: "Wie war der Gesamteindruck des Gesprächs?",
  };
}
