import { caseSchema, type Case } from "@/lib/cases/schema";
import { anamnesePerikoronitis } from "./anamnese-perikoronitis";

const ALL_CASES: Case[] = [anamnesePerikoronitis].map((c) => caseSchema.parse(c));

export function listCases(): Case[] {
  return ALL_CASES;
}

export function getCase(id: string): Case | undefined {
  return ALL_CASES.find((c) => c.id === id);
}
