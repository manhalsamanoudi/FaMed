import { describe, expect, it } from "vitest";
import { listCases } from "@/content/cases";
import { buildEvaluationPrompt } from "@/lib/evaluation/prompt";
import { buildActorInstruction } from "@/lib/live/actor-prompt";
import { toPublicCase } from "./schema";

describe("Fallpool", () => {
  const cases = listCases();

  it("enthält mindestens einen gültigen Fall mit eindeutigen IDs", () => {
    expect(cases.length).toBeGreaterThan(0);
    expect(new Set(cases.map((c) => c.id)).size).toBe(cases.length);
  });

  it.each(cases)("$id: Checklisten-IDs sind eindeutig", (c) => {
    const ids = c.rubric.checklist.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(cases)("$id: öffentlicher Teil enthält keine verdeckten Fakten", (c) => {
    const json = JSON.stringify(toPublicCase(c));
    for (const fact of c.actorCard.facts) expect(json).not.toContain(fact);
    expect(json).not.toContain(c.actorCard.persona);
    expect(json).not.toContain("checklist");
  });

  it.each(cases)("$id: Rollenanweisung enthält Fakten und Rückfragen", (c) => {
    const prompt = buildActorInstruction(c);
    for (const fact of c.actorCard.facts) expect(prompt).toContain(fact);
    for (const q of c.actorCard.followUpQuestions) expect(prompt).toContain(q);
  });

  it.each(cases)("$id: Bewertungsprompt enthält alle Checklisten-IDs", (c) => {
    const prompt = buildEvaluationPrompt(c, "Zahnarzt: Guten Tag");
    for (const item of c.rubric.checklist) expect(prompt).toContain(`"${item.id}"`);
  });
});
