import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { EvaluateResponse } from "@/lib/evaluation/schema";
import { EvaluationReport } from "./evaluation-report";

function ergebnis(extra: Partial<EvaluateResponse> = {}): EvaluateResponse {
  const c = (punkte: number) => ({ punkte, begruendung: "Begründung" });
  return {
    evaluation: {
      wortgetreuesTranskript: "Guten Tag …",
      bewertungsbogen: {
        aufgabenerfuellung: "Antwort A",
        klarheit: "Antwort K",
        angemessenheit: "Antwort P",
        fehler: "Antwort F",
        gesamteindruck: "Antwort G",
      },
      cluster: { textsorte: c(55), pragmatik: c(55), strukturell: c(74), global: c(70) },
      checkliste: [{ id: "x", status: "teilweise", beleg: "" }],
      faktenfehler: [{ zitat: "Metformin 1000 mg", richtig: "Metformin 500 mg" }],
      fehler: [],
      fehlerAnzahl: 3,
      nichtErklaerteFachbegriffe: [],
      ausspracheHinweise: [],
      fluessigkeit: "flüssig",
      empfehlungen: ["a", "b", "c"],
    },
    station: "arztbrief",
    overall: 64,
    bestanden: false,
    coverage: 55,
    hinweise: ["Im Arztbrief fehlt zu viel Inhalt."],
    kennzahlen: { art: "brief", woerter: 280, stichpunktZeilen: 0, hatAnrede: true, hatGruss: true, konjunktiv: 5, indikativ: 9 },
    checklistLabels: { x: "Allergien" },
    model: "test",
    beispiele: [],
    ...extra,
  };
}

describe("Ergebnisseite", () => {
  it("zeigt Bestehen nach Regel, Hinweise, Bewertungsbogen und Faktenfehler", () => {
    const html = renderToStaticMarkup(createElement(EvaluationReport, { result: ergebnis(), schriftlich: true }));
    // 64 Punkte, aber K.-o.-Regel → nicht bestanden
    expect(html).toContain("nicht bestanden");
    expect(html).toContain("Im Arztbrief fehlt zu viel Inhalt.");
    expect(html).toContain("Sind die Patientenaussagen angemessen in indirekter Rede wiedergegeben?");
    expect(html).toContain("Antwort P");
    expect(html).toContain("Metformin 1000 mg");
    expect(html).toContain("9× Indikativ");
  });

  it("zeigt im Gespräch den Redeanteil und die Leitfragen der Patientenvorstellung", () => {
    const html = renderToStaticMarkup(
      createElement(EvaluationReport, {
        result: ergebnis({
          station: "vorstellung",
          bestanden: true,
          overall: 78,
          hinweise: [],
          kennzahlen: { art: "gespraech", woerterPruefling: 900, redeanteil: 81, rollenfragen: 2 },
        }),
      }),
    );
    expect(html).toContain("78 / 100 · bestanden");
    expect(html).toContain("Ihr Redeanteil: 81 %");
    expect(html).toContain("flexibel, prägnant");
    expect(html).not.toContain("Angewendete Prüfungsregeln");
  });
});
