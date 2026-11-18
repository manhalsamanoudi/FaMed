import { caseSchema, type Case, type StationType } from "@/lib/cases/schema";
import { ANAMNESE_FAELLE } from "./anamnese";
import { ARZTBRIEF_FAELLE } from "./arztbrief";
import { AUFKLAERUNG_FAELLE } from "./aufklaerung";
import { VORSTELLUNG_FAELLE } from "./vorstellung";

const ALL_CASES: Case[] = [...ANAMNESE_FAELLE, ...AUFKLAERUNG_FAELLE, ...VORSTELLUNG_FAELLE, ...ARZTBRIEF_FAELLE].map(
  (c) => caseSchema.parse(c),
);

export function listCases(): Case[] {
  return ALL_CASES;
}

export function listCasesByStation(station: StationType): Case[] {
  return ALL_CASES.filter((c) => c.stationType === station);
}

export function getCase(id: string): Case | undefined {
  return ALL_CASES.find((c) => c.id === id);
}
