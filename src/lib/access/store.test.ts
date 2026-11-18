import { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/lib/db/client";
import { codeStatus } from "./codes";
import {
  checkSession,
  createCode,
  deleteCode,
  extendCode,
  kickDevice,
  listCodes,
  loginWithCode,
  logoutSession,
  setRevoked,
} from "./store";

let db: Db;

beforeEach(async () => {
  const pg = new PGlite();
  db = { query: async (text, params) => (await pg.query(text, params as unknown[])).rows as never };
});

const T0 = new Date("2026-11-18T10:00:00Z");
const hoursLater = (h: number) => new Date(T0.getTime() + h * 3600_000);

describe("Zugangscodes", () => {
  it("erstellt Codes im Format Wort-Zahl-Wort, noch nicht aktiviert", async () => {
    const c = await createCode(db, { label: "Dr. Test", kind: "nutzer", durationHours: 720 });
    expect(c.code).toMatch(/^[A-Za-z]+-\d{4}-[A-Za-z]+$/);
    expect(c.activatedAt).toBeNull();
    expect(codeStatus(c, T0)).toBe("neu");
  });

  it("Laufzeit beginnt mit der ersten Anmeldung (Groß-/Kleinschreibung egal)", async () => {
    const c = await createCode(db, { label: "A", kind: "test", durationHours: 24 });
    const r = await loginWithCode(db, c.code.toLowerCase(), T0);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.record.activatedAt?.toISOString()).toBe(T0.toISOString());
    expect(r.record.expiresAt?.toISOString()).toBe(hoursLater(24).toISOString());
  });

  it("zweites Gerät meldet das erste ab", async () => {
    const c = await createCode(db, { label: "A", kind: "nutzer", durationHours: 720 });
    const geraetA = await loginWithCode(db, c.code, T0);
    const geraetB = await loginWithCode(db, c.code, hoursLater(1));
    if (!geraetA.ok || !geraetB.ok) throw new Error("Login fehlgeschlagen");

    expect(await checkSession(db, c.id, geraetB.sessionToken, hoursLater(2))).toMatchObject({ ok: true });
    expect(await checkSession(db, c.id, geraetA.sessionToken, hoursLater(2))).toEqual({
      ok: false,
      reason: "anderes-geraet",
    });
    // Ablauf bleibt bei der ersten Anmeldung verankert
    expect(geraetB.record.expiresAt?.toISOString()).toBe(hoursLater(720).toISOString());
  });

  it("abgelaufene Codes können nicht mehr verwendet werden", async () => {
    const c = await createCode(db, { label: "A", kind: "test", durationHours: 24 });
    const r = await loginWithCode(db, c.code, T0);
    if (!r.ok) throw new Error();
    expect(await checkSession(db, c.id, r.sessionToken, hoursLater(25))).toEqual({
      ok: false,
      reason: "abgelaufen",
    });
    expect(await loginWithCode(db, c.code, hoursLater(25))).toEqual({ ok: false, reason: "abgelaufen" });
  });

  it("unbekannte Codes und manipulierte Sitzungen werden abgelehnt", async () => {
    expect(await loginWithCode(db, "Gibt-1234-Nicht", T0)).toEqual({ ok: false, reason: "unbekannt" });
    const c = await createCode(db, { label: "A", kind: "nutzer", durationHours: 24 });
    await loginWithCode(db, c.code, T0);
    expect(await checkSession(db, c.id, "geraten", T0)).toEqual({ ok: false, reason: "anderes-geraet" });
    expect(await checkSession(db, "kein-uuid", "x", T0)).toEqual({ ok: false, reason: "unbekannt" });
  });

  it("verlängern: vor Aktivierung die Laufzeit, danach den Ablauf", async () => {
    const neu = await createCode(db, { label: "A", kind: "test", durationHours: 24 });
    expect((await extendCode(db, neu.id, 48, T0))?.durationHours).toBe(72);

    const aktiv = await createCode(db, { label: "B", kind: "nutzer", durationHours: 24 });
    await loginWithCode(db, aktiv.code, T0);
    const verl = await extendCode(db, aktiv.id, 24, hoursLater(1));
    expect(verl?.expiresAt?.toISOString()).toBe(hoursLater(48).toISOString());

    // Bereits abgelaufen → ab „jetzt“ verlängern
    const spaet = hoursLater(100);
    const wieder = await extendCode(db, aktiv.id, 24, spaet);
    expect(wieder?.expiresAt?.toISOString()).toBe(new Date(spaet.getTime() + 24 * 3600_000).toISOString());
  });

  it("sperren meldet ab und blockiert; entsperren erlaubt neue Anmeldung", async () => {
    const c = await createCode(db, { label: "A", kind: "nutzer", durationHours: 720 });
    const r = await loginWithCode(db, c.code, T0);
    if (!r.ok) throw new Error();
    await setRevoked(db, c.id, true, T0);
    expect(await checkSession(db, c.id, r.sessionToken, T0)).toEqual({ ok: false, reason: "gesperrt" });
    expect(await loginWithCode(db, c.code, T0)).toEqual({ ok: false, reason: "gesperrt" });
    await setRevoked(db, c.id, false);
    expect((await loginWithCode(db, c.code, hoursLater(1))).ok).toBe(true);
  });

  it("Gerät abmelden und Abmelden durch Nutzer", async () => {
    const c = await createCode(db, { label: "A", kind: "nutzer", durationHours: 720 });
    const r = await loginWithCode(db, c.code, T0);
    if (!r.ok) throw new Error();
    expect((await kickDevice(db, c.id))?.hasSession).toBe(false);
    expect((await checkSession(db, c.id, r.sessionToken, T0)).ok).toBe(false);

    const r2 = await loginWithCode(db, c.code, T0);
    if (!r2.ok) throw new Error();
    await logoutSession(db, c.id, r2.sessionToken);
    expect((await checkSession(db, c.id, r2.sessionToken, T0)).ok).toBe(false);
  });

  it("listet und löscht Codes", async () => {
    const a = await createCode(db, { label: "A", kind: "nutzer", durationHours: 24 });
    await createCode(db, { label: "B", kind: "test", durationHours: 24 });
    expect((await listCodes(db)).map((c) => c.label).sort()).toEqual(["A", "B"]);
    expect(await deleteCode(db, a.id)).toBe(true);
    expect((await listCodes(db)).map((c) => c.label)).toEqual(["B"]);
  });
});
