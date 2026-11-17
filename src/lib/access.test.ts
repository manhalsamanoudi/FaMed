import { afterEach, describe, expect, it } from "vitest";
import {
  ACCESS_COOKIE,
  constantTimeEqual,
  hasAccess,
  readAccessCookie,
  requireAccess,
  tokenForCode,
} from "./access";

afterEach(() => {
  delete process.env.ACCESS_CODE;
});

describe("Zugangsschutz", () => {
  it("ist ohne ACCESS_CODE offen", async () => {
    expect(await hasAccess(undefined)).toBe(true);
  });

  it("verlangt mit ACCESS_CODE den passenden Cookie", async () => {
    process.env.ACCESS_CODE = "Molar-1234";
    expect(await hasAccess(undefined)).toBe(false);
    expect(await hasAccess("falsch")).toBe(false);
    expect(await hasAccess(await tokenForCode("Molar-1234"))).toBe(true);
  });

  it("speichert nicht den Klartext-Code im Token", async () => {
    const token = await tokenForCode("Molar-1234");
    expect(token).not.toContain("Molar");
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("liest den Cookie aus dem Header", () => {
    const req = new Request("http://x", { headers: { cookie: `a=1; ${ACCESS_COOKIE}=abc; b=2` } });
    expect(readAccessCookie(req)).toBe("abc");
  });

  it("requireAccess liefert 401 ohne Cookie", async () => {
    process.env.ACCESS_CODE = "Molar-1234";
    const res = await requireAccess(new Request("http://x"));
    expect(res?.status).toBe(401);
  });

  it("vergleicht Strings korrekt", () => {
    expect(constantTimeEqual("abc", "abc")).toBe(true);
    expect(constantTimeEqual("abc", "abd")).toBe(false);
    expect(constantTimeEqual("abc", "ab")).toBe(false);
  });
});
