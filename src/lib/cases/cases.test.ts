import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { listCases, listCasesByStation } from "@/content/cases";
import { buildEvaluationPrompt, buildLetterEvaluationPrompt, ohneRegie } from "@/lib/evaluation/prompt";
import { buildActorInstruction } from "@/lib/live/actor-prompt";
import { stationTypeSchema, toPublicCase } from "./schema";

const cases = listCases();
const gespraeche = cases.filter((c) => c.actorCard);
const briefe = cases.filter((c) => c.arztbrief);

/** Vorgefertigte Gemini-Stimmen (Stand 2026). */
const STIMMEN = new Set([
  "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede", "Callirrhoe", "Autonoe", "Enceladus",
  "Iapetus", "Umbriel", "Algieba", "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar",
  "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi", "Vindemiatrix", "Sadachbia",
  "Sadaltager", "Sulafat",
]);

describe("Fallpool", () => {
  it("hat zu jeder der 4 Stationen mindestens einen Fall", () => {
    for (const typ of stationTypeSchema.options) expect(listCasesByStation(typ).length).toBeGreaterThan(0);
  });

  it("enthält die 7 Aufklärungsthemen aus den Unterlagen", () => {
    expect(listCasesByStation("aufklaerung").map((c) => c.title)).toEqual([
      "Implantation Zahn 36",
      "Parodontalbehandlung (AIT)",
      "Wurzelspitzenresektion Zahn 24",
      "Kronenpräparation Zahn 46",
      "Abszessinzision Regio 36",
      "Abszessinzision + Extraktion Zahn 46",
      "Weisheitszahnentfernung 38 und 48",
    ]);
  });

  it("hat eindeutige IDs", () => {
    expect(new Set(cases.map((c) => c.id)).size).toBe(cases.length);
  });

  it.each(cases)("$id: Checklisten-IDs sind eindeutig", (c) => {
    const ids = c.rubric.checklist.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(cases)("$id: kein altes Branding im Aufgabenblatt", (c) => {
    expect(JSON.stringify(c.sheet)).not.toMatch(/dentsim|\bFSP\b/i);
  });

  it.each(cases)("$id: öffentlicher Teil enthält keine verdeckten Inhalte", (c) => {
    const json = JSON.stringify(toPublicCase(c));
    for (const fact of c.actorCard?.facts ?? []) expect(json).not.toContain(fact);
    if (c.actorCard) expect(json).not.toContain(c.actorCard.persona);
    for (const b of c.beispiele) for (const s of b.saetze) expect(json).not.toContain(s);
    if (c.arztbrief) {
      expect(json).not.toContain(c.arztbrief.musterbrief.slice(0, 60));
      expect(json).not.toContain(c.arztbrief.dialog[5].text);
    }
    expect(json).not.toContain("checklist");
  });
});

describe("Gesprächsfälle", () => {
  it.each(gespraeche)("$id: Rollenanweisung enthält Fakten, Rückfragen und kein Disclaimer-Verhalten", (c) => {
    const prompt = buildActorInstruction(c);
    for (const fact of c.actorCard!.facts) expect(prompt).toContain(fact);
    for (const q of c.actorCard!.followUpQuestions) expect(prompt).toContain(q);
    expect(prompt).toContain("NIEMALS Haftungshinweise");
  });

  it.each(gespraeche)("$id: gültige Stimme und mind. 3 Rückfragen", (c) => {
    expect(STIMMEN.has(c.actorCard!.voice)).toBe(true);
    expect(c.actorCard!.followUpQuestions.length).toBeGreaterThanOrEqual(3);
  });

  it.each(gespraeche)("$id: Bewertungsprompt enthält Aufgabenblatt und alle Checklisten-IDs", (c) => {
    const prompt = buildEvaluationPrompt(c, "Zahnarzt: Guten Tag");
    expect(prompt).toContain(c.sheet.kurzbeschreibung);
    for (const item of c.rubric.checklist) expect(prompt).toContain(`"${item.id}"`);
  });

  it("Aufklärungsfälle folgen dem Übungstest-Aufbau", () => {
    for (const c of listCasesByStation("aufklaerung")) {
      const themen = c.sheet.aufgabentext.punkte.map((p) => p.text);
      expect(themen).toEqual([
        "den Operationsablauf",
        "die Risiken:",
        "die Lokalanästhesie:",
        "das präoperative Vorgehen:",
        "das postoperative Vorgehen:",
      ]);
      const spezielle = c.sheet.aufgabentext.punkte[1].unterpunkte![1].unterpunkte!;
      expect(spezielle.length).toBeGreaterThanOrEqual(3);
      expect(c.beispiele.length).toBeGreaterThan(0);
      expect(c.sheet.abschnitte[0].eintraege.map((e) => e.label)).toContain("Ablauf");
    }
  });

  it("Weisheitszahn-OP im Unterkiefer nennt keine Kieferhöhle (fachlich falsch für 38/48)", () => {
    const wz = listCasesByStation("aufklaerung").find((c) => c.id === "aufklaerung-weisheitszaehne-38-48")!;
    expect(JSON.stringify(wz.sheet)).not.toMatch(/Kieferhöhle/);
  });
});

describe("Arztbrief", () => {
  it.each(briefe)("$id: Audiodatei existiert und ist eine echte MP3", (c) => {
    const file = join(process.cwd(), "public", c.arztbrief!.audioSrc);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(200_000);
    const head = readFileSync(file).subarray(0, 3);
    // MP3: "ID3"-Tag oder Frame-Sync 0xFFE…
    expect(head.toString("latin1") === "ID3" || (head[0] === 0xff && (head[1] & 0xe0) === 0xe0)).toBe(true);
  });

  it.each(briefe)("$id: Bewertungsprompt enthält Gespräch, Brief und Checkliste", (c) => {
    const prompt = buildLetterEvaluationPrompt(c, "Sehr geehrte Kollegin, …");
    expect(prompt).toContain(ohneRegie(c.arztbrief!.dialog[1].text));
    expect(prompt).toContain("Sehr geehrte Kollegin");
    expect(prompt).toContain(c.arztbrief!.musterbrief);
    expect(prompt).not.toMatch(/\[(seufzt|lacht|hustet)/);
    for (const item of c.rubric.checklist) expect(prompt).toContain(`"${item.id}"`);
  });

  it.each(briefe)("$id: Musterbrief folgt dem FaMed-Aufbau", (c) => {
    const m = c.arztbrief!.musterbrief;
    expect(m).toMatch(/^Sehr geehrte/);
    expect(m).toMatch(/wir berichten über/);
    for (const abschnitt of ["Vorerkrankungen:", "Klinische Untersuchung:", "Therapie:", "Procedere:"]) {
      expect(m).toContain(abschnitt);
    }
    expect(m.trim()).toMatch(/Grüßen$/);
  });

  it.each(briefe)("$id: Gespräch hat Sprechweisen für natürliche Stimmen", (c) => {
    expect(c.arztbrief!.sprechweise).toBeDefined();
    expect(STIMMEN.has(c.arztbrief!.sprecher.Zahnarzt)).toBe(true);
    expect(STIMMEN.has(c.arztbrief!.sprecher.Patient)).toBe(true);
  });

  it("ohneRegie entfernt Geräusch-Anweisungen", () => {
    expect(ohneRegie("Ja … [seufzt] seit gestern.")).toBe("Ja … seit gestern.");
    expect(ohneRegie("[lacht kurz] Nee.")).toBe("Nee.");
  });
});

describe("Branding", () => {
  it("in sichtbaren Quelltexten kommt weder DentSim noch FSP vor", () => {
    const dirs = ["src/app", "src/components", "src/content", "src/lib/access/share.ts"];
    const files: string[] = [];
    const walk = (p: string) => {
      const full = join(process.cwd(), p);
      if (statSync(full).isFile()) return files.push(full);
      for (const f of readdirSync(full)) walk(join(p, f));
    };
    dirs.forEach(walk);
    for (const f of files.filter((f) => /\.(tsx?|mjs)$/.test(f) && !f.endsWith(".test.ts"))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/DentSim|\bFSP\b/);
    }
  });
});
