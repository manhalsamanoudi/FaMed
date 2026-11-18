import { codeStatus, type CodeKind, type CodeRecord, type CodeStatus } from "./codes";

/** Darstellung eines Codes für die Verwaltungsoberfläche. */
export type AdminCode = {
  id: string;
  code: string;
  name: string;
  art: CodeKind;
  laufzeitStunden: number;
  status: CodeStatus;
  erstellt: string;
  aktiviert: string | null;
  ablauf: string | null;
  geraetAngemeldet: boolean;
  zuletztAktiv: string | null;
  anmeldungen: number;
};

export function toAdminCode(c: CodeRecord, now = new Date()): AdminCode {
  return {
    id: c.id,
    code: c.code,
    name: c.label,
    art: c.kind,
    laufzeitStunden: c.durationHours,
    status: codeStatus(c, now),
    erstellt: c.createdAt.toISOString(),
    aktiviert: c.activatedAt?.toISOString() ?? null,
    ablauf: c.expiresAt?.toISOString() ?? null,
    geraetAngemeldet: c.hasSession && codeStatus(c, now) === "aktiv",
    zuletztAktiv: c.lastSeenAt?.toISOString() ?? null,
    anmeldungen: c.loginCount,
  };
}
