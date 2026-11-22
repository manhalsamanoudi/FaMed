import { caseSchema, type Case, type StationType } from "@/lib/cases/schema";
import { ANAMNESE_FAELLE } from "./anamnese";
import { ARZTBRIEF_FAELLE } from "./arztbrief";
import { ARZTBRIEF_PRUEFUNG } from "./arztbrief-pruefung";
import { AUFKLAERUNG_FAELLE } from "./aufklaerung";
import { VORSTELLUNG_FAELLE } from "./vorstellung";
import { VORSTELLUNG_UNTERLAGEN } from "./vorstellung-unterlagen";

const ALL_CASES: Case[] = [
  ...ANAMNESE_FAELLE,
  ...AUFKLAERUNG_FAELLE,
  ...VORSTELLUNG_FAELLE,
  ...VORSTELLUNG_UNTERLAGEN,
  ...ARZTBRIEF_FAELLE,
  ...ARZTBRIEF_PRUEFUNG,
].map((c) => caseSchema.parse(c));

export function listCases(): Case[] {
  return ALL_CASES;
}

export function listCasesByStation(station: StationType): Case[] {
  return ALL_CASES.filter((c) => c.stationType === station);
}

export function getCase(id: string): Case | undefined {
  return ALL_CASES.find((c) => c.id === id);
}
