import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACCESS_COOKIE,
  isMasterCode,
  masterCookieValue,
  readAccessCookie,
  requireMaster,
  resolveAccess,
} from "./session";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Master-Code und Sitzungsprüfung", () => {
  it("ist lokal ohne MASTER_CODE offen", async () => {
    vi.stubEnv("MASTER_CODE", "");
    expect(await resolveAccess(undefined)).toEqual({ ok: true, access: { role: "offen" } });
  });

  it("ist in Produktion ohne MASTER_CODE gesperrt", async () => {
    vi.stubEnv("MASTER_CODE", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(await resolveAccess(undefined)).toEqual({ ok: false, reason: "nicht-eingerichtet" });
  });

  it("erkennt den Master-Code unabhängig von Groß-/Kleinschreibung", () => {
    vi.stubEnv("MASTER_CODE", "Master-Molar-123456-Krone");
    expect(isMasterCode("master-molar-123456-krone ")).toBe(true);
    expect(isMasterCode("Master-Molar-123456-Kron")).toBe(false);
  });

  it("akzeptiert nur den passenden Master-Cookie", async () => {
    vi.stubEnv("MASTER_CODE", "Master-Molar-123456-Krone");
    const good = await masterCookieValue("Master-Molar-123456-Krone");
    expect(good).not.toContain("Molar");
    expect(await resolveAccess(good)).toEqual({ ok: true, access: { role: "master" } });
    expect(await resolveAccess(await masterCookieValue("anderer-code"))).toMatchObject({ ok: false });
    expect(await resolveAccess(undefined)).toEqual({ ok: false, reason: "keine-anmeldung" });
  });

  it("lehnt Nutzer-Cookies ab, wenn keine Datenbank eingerichtet ist", async () => {
    vi.stubEnv("MASTER_CODE", "Master-X-1-Y");
    vi.stubEnv("DATABASE_URL", "");
    const fake = "u.123e4567-e89b-12d3-a456-426614174000.abcdefghijklmnopqrstuvwxyz";
    expect(await resolveAccess(fake)).toEqual({ ok: false, reason: "keine-anmeldung" });
  });

  it("requireMaster: 401 ohne Anmeldung, durch mit Master-Cookie", async () => {
    vi.stubEnv("MASTER_CODE", "Master-X-1-Y");
    expect((await requireMaster(new Request("http://x")))?.status).toBe(401);
    const cookie = await masterCookieValue("Master-X-1-Y");
    const req = new Request("http://x", { headers: { cookie: `${ACCESS_COOKIE}=${cookie}` } });
    expect(readAccessCookie(req)).toBe(cookie);
    expect(await requireMaster(req)).toBeNull();
  });
});
