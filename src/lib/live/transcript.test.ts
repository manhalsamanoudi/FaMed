import { describe, expect, it } from "vitest";
import { appendTranscript, formatTranscript, median, type Turn } from "./transcript";

describe("appendTranscript", () => {
  it("fasst Fragmente derselben Person zusammen", () => {
    let t: Turn[] = [];
    t = appendTranscript(t, "user", "Guten ");
    t = appendTranscript(t, "user", "Tag");
    expect(t).toEqual([{ id: 1, role: "user", text: "Guten Tag" }]);
  });

  it("beginnt beim Sprecherwechsel einen neuen Beitrag", () => {
    let t: Turn[] = [];
    t = appendTranscript(t, "user", "Hallo");
    t = appendTranscript(t, "actor", " Hallo, Herr Doktor");
    t = appendTranscript(t, "user", "Was führt Sie zu mir?");
    expect(t.map((x) => [x.id, x.role, x.text])).toEqual([
      [1, "user", "Hallo"],
      [2, "actor", "Hallo, Herr Doktor"],
      [3, "user", "Was führt Sie zu mir?"],
    ]);
  });

  it("ignoriert leere Fragmente", () => {
    const t: Turn[] = [];
    expect(appendTranscript(t, "user", "")).toBe(t);
  });
});

describe("formatTranscript", () => {
  it("beschriftet Sprecher und lässt leere Beiträge weg", () => {
    const turns: Turn[] = [
      { id: 1, role: "user", text: " Guten Tag " },
      { id: 2, role: "actor", text: "  " },
      { id: 3, role: "actor", text: "Tag" },
    ];
    expect(formatTranscript(turns, { user: "Zahnarzt", actor: "Patient" })).toBe(
      "Zahnarzt: Guten Tag\nPatient: Tag",
    );
  });
});

describe("median", () => {
  it("berechnet den Median", () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});
