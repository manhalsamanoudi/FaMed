import { describe, expect, it } from "vitest";
import { z } from "zod";
import { checklistCoverage, evaluationSchema, overallScore, type Evaluation } from "./schema";

const sample: Evaluation = {
  wortgetreuesTranskript: "Guten Tag, ähm, mein Name ist …",
  cluster: {
    textsorte: { punkte: 70, begruendung: "" },
    pragmatik: { punkte: 60, begruendung: "" },
    strukturell: { punkte: 50, begruendung: "" },
    global: { punkte: 61, begruendung: "" },
  },
  checkliste: [
    { id: "a", status: "erfuellt", beleg: "" },
    { id: "b", status: "teilweise", beleg: "" },
  ],
  fehler: [],
  nichtErklaerteFachbegriffe: [],
  ausspracheHinweise: [],
  fluessigkeit: "",
  empfehlungen: ["x", "y", "z"],
};

describe("Bewertung", () => {
  it("validiert das Beispiel", () => {
    expect(evaluationSchema.safeParse(sample).success).toBe(true);
  });

  it("lehnt Punkte über 100 ab", () => {
    const bad = structuredClone(sample);
    bad.cluster.global.punkte = 120;
    expect(evaluationSchema.safeParse(bad).success).toBe(false);
  });

  it("berechnet den Gesamtwert als Mittel der Cluster", () => {
    expect(overallScore(sample)).toBe(60);
  });

  it("gewichtet die Checkliste (teilweise = halb, fehlend = 0)", () => {
    expect(checklistCoverage(sample, { a: 2, b: 2, c: 4 })).toBe(38);
  });

  it("lässt sich als JSON-Schema für Gemini exportieren", () => {
    const schema = z.toJSONSchema(evaluationSchema) as { type: string; required: string[] };
    expect(schema.type).toBe("object");
    expect(schema.required).toContain("cluster");
  });
});
