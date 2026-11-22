import { describe, expect, it } from "vitest";
import { belegteFaktenfehler, briefKennzahlen, gespraechsKennzahlen, modusZaehlung, wendeRegelnAn } from "./regeln";
import type { Evaluation } from "./schema";

function bewertung(punkte: number, extra: Partial<Evaluation> = {}): Evaluation {
  const c = { punkte, begruendung: "" };
  return {
    wortgetreuesTranskript: "",
    bewertungsbogen: { aufgabenerfuellung: "", klarheit: "", angemessenheit: "", fehler: "", gesamteindruck: "" },
    cluster: { textsorte: { ...c }, pragmatik: { ...c }, strukturell: { ...c }, global: { ...c } },
    checkliste: [],
    faktenfehler: [],
    fehler: [],
    nichtErklaerteFachbegriffe: [],
    ausspracheHinweise: [],
    fluessigkeit: "",
    empfehlungen: [],
    fehlerAnzahl: 0,
    ...extra,
  };
}

const gespraech = (woerter: number) => ({ art: "gespraech" as const, woerterPruefling: woerter, redeanteil: 80, rollenfragen: 2 });

describe("Kennzahlen", () => {
  it("zählt Wörter, Redeanteil und Fragen der Rolle", () => {
    const t = "Zahnarzt: Guten Tag, ich erkläre Ihnen heute die Behandlung.\nPatient:in: Okay. Tut das weh?\nZahnarzt: Nein, Sie bekommen eine Betäubung.";
    const k = gespraechsKennzahlen(t);
    expect(k.woerterPruefling).toBe(13);
    expect(k.rollenfragen).toBe(1);
    expect(k.redeanteil).toBe(76);
  });

  it("versteht Windows-Zeilenumbrüche aus Formulardaten", () => {
    const k = gespraechsKennzahlen("Zahnarzt: Eins zwei drei.\r\nKolleg:in: Und Allergien?\r\nZahnarzt: Keine.");
    expect(k.woerterPruefling).toBe(4);
    expect(k.rollenfragen).toBe(1);
    expect(k.redeanteil).toBe(67);
  });

  it("nutzt das Audio-Transkript, wenn das Live-Transkript fehlt", () => {
    expect(gespraechsKennzahlen("", "eins zwei drei").woerterPruefling).toBe(3);
    expect(gespraechsKennzahlen("", "").redeanteil).toBeNull();
  });

  it("erkennt Stichpunkte, Anrede und Grußformel im Brief", () => {
    const k = briefKennzahlen("Sehr geehrte Kolleginnen und Kollegen,\n- Ramipril 5 mg\n• Penicillinallergie\n1. OPG\nMit freundlichen Grüßen");
    expect(k.stichpunktZeilen).toBe(3);
    expect(k.hatAnrede).toBe(true);
    expect(k.hatGruss).toBe(true);
    expect(briefKennzahlen("Der Patient sei 40 Jahre alt.").hatAnrede).toBe(false);
  });
});

describe("Prüfungsregeln", () => {
  it("lässt eine gute, vollständige Leistung unverändert", () => {
    const r = wendeRegelnAn(bewertung(80), { station: "aufklaerung", coverage: 90, kennzahlen: gespraech(900) });
    expect(r.overall).toBe(80);
    expect(r.bestanden).toBe(true);
    expect(r.hinweise).toEqual([]);
  });

  it("deckelt bei zu wenig eigener Sprachproduktion", () => {
    expect(wendeRegelnAn(bewertung(80), { station: "vorstellung", coverage: 90, kennzahlen: gespraech(200) }).overall).toBe(50);
    const ko = wendeRegelnAn(bewertung(80), { station: "vorstellung", coverage: 90, kennzahlen: gespraech(50) });
    expect(ko.overall).toBe(30);
    expect(ko.bestanden).toBe(false);
  });

  it("senkt die Textsorte bei geringer Aufgabenerfüllung", () => {
    const r = wendeRegelnAn(bewertung(80), { station: "anamnese", coverage: 50, kennzahlen: gespraech(700) });
    expect(r.evaluation.cluster.textsorte.punkte).toBe(55);
    expect(r.evaluation.cluster.pragmatik.punkte).toBe(80);
  });

  it("wertet mehrere Faktenfehler in der Patientenvorstellung als nicht bestanden", () => {
    const e = bewertung(80, { faktenfehler: [{ zitat: "a", richtig: "b" }, { zitat: "c", richtig: "d" }] });
    const r = wendeRegelnAn(e, { station: "vorstellung", coverage: 90, kennzahlen: gespraech(900) });
    expect(r.evaluation.cluster.textsorte.punkte).toBe(50);
    expect(r.evaluation.cluster.global.punkte).toBe(55);
    expect(r.bestanden).toBe(false);
  });

  it("verlangt im Arztbrief ganze Sätze, Briefform und genug Inhalt", () => {
    const k = { art: "brief" as const, woerter: 300, stichpunktZeilen: 5, hatAnrede: false, hatGruss: true, konjunktiv: 8, indikativ: 1 };
    const r = wendeRegelnAn(bewertung(80), { station: "arztbrief", coverage: 55, kennzahlen: k, musterWoerter: 320 });
    expect(r.evaluation.cluster.textsorte.punkte).toBe(50);
    expect(r.bestanden).toBe(false);
    expect(r.hinweise.length).toBeGreaterThanOrEqual(3);
  });

  it("deckelt einen viel zu kurzen Brief", () => {
    const k = { art: "brief" as const, woerter: 60, stichpunktZeilen: 0, hatAnrede: true, hatGruss: true, konjunktiv: 8, indikativ: 1 };
    const r = wendeRegelnAn(bewertung(85), { station: "arztbrief", coverage: 80, kennzahlen: k, musterWoerter: 320 });
    expect(r.overall).toBe(30);
    expect(r.bestanden).toBe(false);
  });
});

describe("Distanz und Fehlerdichte", () => {
  const indikativBrief = `Sehr geehrte Kolleginnen und Kollegen,
wir berichten über Herrn K., 63 Jahre alt.
Der Patient berichtete, dass er seit fünf Tagen Schmerzen hat. Die Schmerzen seien pochend und werden nachts stärker. Wärme verschlimmert die Beschwerden. Er leidet an Diabetes und nimmt Metformin. Er raucht täglich.
Bei der Untersuchung zeigte sich eine Schwellung. Eine Kontrolle ist morgen geplant.
Mit freundlichen Grüßen`;

  it("zählt Indikativ und Konjunktiv nur im Anamnese-Teil", () => {
    expect(modusZaehlung(indikativBrief)).toEqual({ konjunktiv: 1, indikativ: 6 });
  });

  it("deckelt die Pragmatik bei fehlender Distanz", () => {
    const k = briefKennzahlen(indikativBrief);
    const r = wendeRegelnAn(bewertung(80), { station: "arztbrief", coverage: 90, kennzahlen: { ...k, woerter: 300 }, musterWoerter: 320 });
    expect(r.evaluation.cluster.pragmatik.punkte).toBe(55);
  });

  it("deckelt die strukturelle Korrektheit bei zu vielen Fehlern", () => {
    const k = { art: "brief" as const, woerter: 300, stichpunktZeilen: 0, hatAnrede: true, hatGruss: true, konjunktiv: 8, indikativ: 0 };
    const kontext = { station: "arztbrief" as const, coverage: 90, kennzahlen: k, musterWoerter: 320 };
    expect(wendeRegelnAn(bewertung(85, { fehlerAnzahl: 4 }), kontext).evaluation.cluster.strukturell.punkte).toBe(85);
    expect(wendeRegelnAn(bewertung(85, { fehlerAnzahl: 9 }), kontext).evaluation.cluster.strukturell.punkte).toBe(74);
    expect(wendeRegelnAn(bewertung(85, { fehlerAnzahl: 12 }), kontext).evaluation.cluster.strukturell.punkte).toBe(59);
    expect(wendeRegelnAn(bewertung(85, { fehlerAnzahl: 20 }), kontext).evaluation.cluster.strukturell.punkte).toBe(44);
  });
});

describe("Faktenfehler", () => {
  it("behält nur Zitate, die wirklich im Text stehen", () => {
    const e = bewertung(70, {
      faktenfehler: [
        { zitat: "Ramipril 2,5 mg", richtig: "Ramipril 5 mg" },
        { zitat: "Zahn 47", richtig: "Zahn 46" },
      ],
    });
    const brief = "Er nehme „Ramipril 2,5 mg“ morgens ein.";
    expect(belegteFaktenfehler(e, brief)).toEqual([{ zitat: "Ramipril 2,5 mg", richtig: "Ramipril 5 mg" }]);
  });
});
