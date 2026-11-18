import { describe, expect, it } from "vitest";
import { codeStatus, formatDuration, generateCode, generateSessionToken } from "./codes";
import { buildShareMessage, whatsappLink } from "./share";

describe("Code-Hilfsfunktionen", () => {
  it("erzeugt gut lesbare, unterschiedliche Codes", () => {
    const codes = new Set(Array.from({ length: 200 }, generateCode));
    expect(codes.size).toBeGreaterThan(190);
    for (const c of codes) expect(c).toMatch(/^[A-Za-z]+-\d{4}-[A-Za-z]+$/);
  });

  it("erzeugt URL-sichere Sitzungsgeheimnisse", () => {
    const t = generateSessionToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(generateSessionToken()).not.toBe(t);
  });

  it("berechnet den Status", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    expect(codeStatus({ revokedAt: null, expiresAt: null }, now)).toBe("neu");
    expect(codeStatus({ revokedAt: null, expiresAt: new Date("2026-01-02") }, now)).toBe("aktiv");
    expect(codeStatus({ revokedAt: null, expiresAt: new Date("2025-12-31") }, now)).toBe("abgelaufen");
    expect(codeStatus({ revokedAt: now, expiresAt: new Date("2026-01-02") }, now)).toBe("gesperrt");
  });

  it("formatiert Laufzeiten", () => {
    expect(formatDuration(24)).toBe("1 Tag");
    expect(formatDuration(720)).toBe("30 Tage");
    expect(formatDuration(36)).toBe("36 Stunden");
    expect(formatDuration(1)).toBe("1 Stunde");
  });

  it("baut die WhatsApp-Nachricht mit Link, Code und Laufzeit", () => {
    const msg = buildShareMessage({
      name: "Dr. Ahmad",
      code: "Molar-1234-Krone",
      laufzeitStunden: 24,
      url: "https://dentsim-fsp.onrender.com",
      art: "test",
    });
    expect(msg).toContain("Hallo Dr. Ahmad!");
    expect(msg).toContain("Hier ist dein Testzugang");
    expect(msg).toContain("Molar-1234-Krone");
    expect(msg).toContain("1 Tag ab der ersten Anmeldung");
    expect(whatsappLink(msg)).toMatch(/^https:\/\/wa\.me\/\?text=Hallo%20Dr\.%20Ahmad/);
  });
});
