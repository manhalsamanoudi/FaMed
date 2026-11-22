import type { StationType } from "@/lib/cases/schema";
import { PASS_THRESHOLD, overallScore, type ClusterKey, type Evaluation, type Kennzahlen } from "./schema";

/**
 * Feste Prüfungsregeln, die nach der KI-Bewertung im Code angewendet werden.
 * So bleibt die Bewertung realistisch und gleich streng, auch wenn das Modell
 * (vor allem ein Ausweichmodell) zu großzügig oder uneinheitlich bewertet.
 */

export const zaehleWoerter = (s: string) => (s.match(/[\p{L}\p{N}]+/gu) ?? []).length;
const woerter = zaehleWoerter;

const normal = (s: string) =>
  s
    .toLowerCase()
    .replace(/[„“"'‚‘’»«()[\]]/g, "")
    .replace(/[\s.,;:!?–-]+/g, " ")
    .trim();

/** Kennzahlen eines Gesprächs aus dem Live-Transkript („Zahnarzt: …“ / „Patient:in: …“). */
export function gespraechsKennzahlen(transkript: string, wortgetreu = ""): Extract<Kennzahlen, { art: "gespraech" }> {
  let pruefling = 0;
  let rolle = 0;
  let rollenfragen = 0;
  let aktuell: "pruefling" | "rolle" | null = null;
  // Formulardaten kommen mit CRLF an.
  for (const zeile of transkript.split(/\r?\n/)) {
    const m = /^(Zahnarzt|Patient:in|Kolleg:in):\s*(.*)$/.exec(zeile);
    const text = m ? m[2] : zeile;
    if (m) aktuell = m[1] === "Zahnarzt" ? "pruefling" : "rolle";
    if (aktuell === "pruefling") pruefling += woerter(text);
    else if (aktuell === "rolle") {
      rolle += woerter(text);
      rollenfragen += (text.match(/\?/g) ?? []).length;
    }
  }
  // Fällt das Live-Transkript aus, zählt das Transkript aus der Audioaufnahme.
  const woerterPruefling = Math.max(pruefling, woerter(wortgetreu));
  const summe = pruefling + rolle;
  return {
    art: "gespraech",
    woerterPruefling,
    redeanteil: summe > 0 ? Math.round((pruefling / summe) * 100) : null,
    rollenfragen,
  };
}

const STICHPUNKT = /^\s*(?:[-–—•*·▪►]|\d{1,2}[.)])\s+\S/;

// Typische Verben in Patientenaussagen: Indikativ Präsens vs. Konjunktiv I (3. Person).
const INDIKATIV = new Set(
  "ist sind hat leidet nimmt raucht trinkt besteht bestehen wird werden bekommt verträgt verschlimmert verschlimmern verstärkt verstärken strahlt strahlen tut tun kann können muss müssen konsumiert spürt bemerkt verspürt kommt treten tritt".split(" "),
);
const KONJUNKTIV = new Set(
  "sei seien habe leide nehme einnehme rauche trinke bestehe bestünden werde bekomme vertrage verschlimmere verstärke strahle tue könne müsse konsumiere spüre bemerke verspüre komme trete".split(" "),
);

/**
 * Zählt im Anamnese-Teil des Briefs (bis zur Untersuchung) Verben im Indikativ
 * und im Konjunktiv I. Patientenaussagen gehören in indirekte Rede.
 */
export function modusZaehlung(brief: string): { konjunktiv: number; indikativ: number } {
  const ohneAnrede = brief.replace(/^[^\n]*\n/, "");
  // Ende der Anamnese: erste Zeile, die mit Untersuchung/Befund beginnt.
  const ende = ohneAnrede.search(
    /(^|\n)\s*(klinische[rn]? untersuchung|untersuchung|befund|extraoral|intraoral|bei der (klinischen |zahnärztlichen )?untersuchung|röntgen)/i,
  );
  const anamnese = ende > 0 ? ohneAnrede.slice(0, ende) : ohneAnrede.slice(0, Math.round(ohneAnrede.length / 2));
  let konjunktiv = 0;
  let indikativ = 0;
  for (const w of anamnese.toLowerCase().match(/\p{L}+/gu) ?? []) {
    if (KONJUNKTIV.has(w)) konjunktiv++;
    else if (INDIKATIV.has(w)) indikativ++;
  }
  return { konjunktiv, indikativ };
}

/** Kennzahlen eines Arztbriefs. */
export function briefKennzahlen(brief: string): Extract<Kennzahlen, { art: "brief" }> {
  const zeilen = brief.split(/\r?\n/);
  return {
    art: "brief",
    woerter: woerter(brief),
    stichpunktZeilen: zeilen.filter((z) => STICHPUNKT.test(z)).length,
    hatAnrede: /sehr geehrte|liebe kolleg|werte kolleg/i.test(brief.slice(0, 300)),
    hatGruss: /(gr[üu](ß|ss)en|gru(ß|ss))/i.test(brief.slice(-300)),
    ...modusZaehlung(brief),
  };
}

/** Faktenfehler nur behalten, wenn das Zitat wirklich im Text des Prüflings steht (gegen Fehlalarme). */
export function belegteFaktenfehler(e: Evaluation, ...quellen: string[]): Evaluation["faktenfehler"] {
  const texte = quellen.map(normal).filter(Boolean);
  return e.faktenfehler.filter((f) => {
    const z = normal(f.zitat);
    return z.length >= 3 && texte.some((t) => t.includes(z));
  });
}

/** Nicht erklärte Fachbegriffe nur behalten, wenn der Begriff wirklich gesagt wurde. */
export function belegteFachbegriffe(e: Evaluation, ...quellen: string[]): Evaluation["nichtErklaerteFachbegriffe"] {
  const texte = quellen.map(normal).filter(Boolean);
  return e.nichtErklaerteFachbegriffe.filter((f) => {
    const b = normal(f.begriff);
    return b.length >= 3 && texte.some((t) => t.includes(b));
  });
}

export type RegelErgebnis = {
  evaluation: Evaluation;
  overall: number;
  bestanden: boolean;
  hinweise: string[];
};

type Kontext = {
  station: StationType;
  coverage: number;
  kennzahlen: Kennzahlen;
  /** Wortzahl des Musterbriefs (nur Arztbrief) */
  musterWoerter?: number;
};

export function wendeRegelnAn(eingabe: Evaluation, k: Kontext): RegelErgebnis {
  const e = structuredClone(eingabe);
  const hinweise: string[] = [];
  let ko = false;

  const deckel = (keys: ClusterKey[], max: number, grund: string) => {
    for (const key of keys) e.cluster[key].punkte = Math.min(e.cluster[key].punkte, max);
    if (!hinweise.includes(grund)) hinweise.push(grund);
  };
  const alle: ClusterKey[] = ["textsorte", "pragmatik", "strukturell", "global"];

  // 1. Umfang der Sprachprobe
  if (k.kennzahlen.art === "gespraech") {
    const w = k.kennzahlen.woerterPruefling;
    if (w < 80) {
      deckel(alle, 30, `Sie haben nur etwa ${w} Wörter gesprochen. Für eine Bewertung auf C1-Niveau reicht diese Sprachprobe nicht aus.`);
      ko = true;
    } else if (w < 250) {
      deckel(alle, 50, `Sie haben nur etwa ${w} Wörter gesprochen. In 11 Minuten erwarten die Bewertenden deutlich mehr eigene Redeanteile.`);
    }
  } else {
    const w = k.kennzahlen.woerter;
    const soll = k.musterWoerter ?? 250;
    if (w < soll * 0.25) {
      deckel(alle, 30, `Der Brief ist mit ${w} Wörtern viel zu kurz (Musterbrief: ca. ${soll} Wörter).`);
      ko = true;
    } else if (w < soll * 0.5) {
      deckel(alle, 50, `Der Brief ist mit ${w} Wörtern deutlich zu kurz (Musterbrief: ca. ${soll} Wörter); wichtige Inhalte fehlen zwangsläufig.`);
    }
    // 2. Briefform
    if (k.kennzahlen.stichpunktZeilen >= 3) {
      deckel(
        ["textsorte"],
        50,
        `${k.kennzahlen.stichpunktZeilen} Zeilen sind Stichpunkte. Ein Arztbrief muss in ganzen Sätzen geschrieben sein.`,
      );
    }
    if (!k.kennzahlen.hatAnrede || !k.kennzahlen.hatGruss) {
      deckel(["textsorte"], 70, "Anrede oder Grußformel fehlen – die Briefform ist unvollständig.");
    }
    // 2b. Distanz: Patientenaussagen in indirekter Rede (Konjunktiv I)
    const { konjunktiv, indikativ } = k.kennzahlen;
    const quote = konjunktiv + indikativ > 0 ? konjunktiv / (konjunktiv + indikativ) : 1;
    if (indikativ >= 4 && quote < 0.5) {
      deckel(
        ["pragmatik"],
        55,
        `Patientenaussagen stehen überwiegend im Indikativ (${indikativ}× Indikativ, ${konjunktiv}× Konjunktiv I). Die nötige Distanz fehlt.`,
      );
    } else if (indikativ >= 3 && quote < 0.75) {
      deckel(
        ["pragmatik"],
        70,
        `Patientenaussagen stehen oft im Indikativ (${indikativ}× Indikativ, ${konjunktiv}× Konjunktiv I). Die indirekte Rede ist nicht durchgehalten.`,
      );
    }
  }

  // 2c. Fehlerdichte (strukturelle Korrektheit), gesprochen etwas toleranter als geschrieben
  const basis = k.kennzahlen.art === "brief" ? k.kennzahlen.woerter : k.kennzahlen.woerterPruefling;
  if (basis >= 50) {
    const dichte = (e.fehlerAnzahl / basis) * 100;
    const [g1, g2, g3] = k.kennzahlen.art === "brief" ? [2, 3.5, 5] : [2.5, 4, 6];
    const text = `${e.fehlerAnzahl} sprachliche Fehler bei ca. ${basis} Wörtern (${dichte.toFixed(1)} pro 100 Wörter).`;
    if (dichte > g3) deckel(["strukturell"], 44, `${text} Das liegt deutlich unter C1.`);
    else if (dichte > g2) deckel(["strukturell"], 59, `${text} Fehler sind zu häufig für C1.`);
    else if (dichte > g1) deckel(["strukturell"], 74, `${text} Für ein sicheres C1 sollten Fehler seltener sein.`);
  }

  // 3. Aufgabenerfüllung (Checkliste)
  if (k.coverage < 40) {
    deckel(["textsorte"], 40, `Nur ${k.coverage} % der Aufgabenpunkte wurden erfüllt.`);
    deckel(["global"], 55, "Wegen der geringen Aufgabenerfüllung ist die Gesamtbewertung unter der Bestehensgrenze.");
  } else if (k.coverage < 60) {
    deckel(["textsorte"], 55, `Nur ${k.coverage} % der Aufgabenpunkte wurden erfüllt – wichtige Inhalte fehlen.`);
  }
  if (k.station === "arztbrief" && k.coverage < 60) {
    ko = true;
    hinweise.push("Im Arztbrief fehlt zu viel Inhalt (unter 60 % der Checkliste). Das reicht nicht zum Bestehen.");
  }

  // 4. Falsch übertragene Fakten – bei Kollegengespräch und Arztbrief besonders schwer
  if (k.station === "vorstellung" || k.station === "arztbrief") {
    const n = e.faktenfehler.length;
    if (n >= 2) {
      deckel(["textsorte"], 50, `${n} Angaben wurden falsch übertragen (z. B. Zahn, Dosierung, Medikament). Das gefährdet die Patientensicherheit.`);
      deckel(["global"], 55, "Mehrere falsche Angaben schließen Missverständnisse nicht aus – das ist kein C1-Niveau.");
      ko = true;
    } else if (n === 1) {
      deckel(["textsorte"], 65, "Eine Angabe wurde falsch übertragen. Zahlen, Zähne und Dosierungen müssen fehlerfrei sein.");
    }
  }

  const overall = overallScore(e);
  return { evaluation: e, overall, bestanden: overall >= PASS_THRESHOLD && !ko, hinweise };
}
