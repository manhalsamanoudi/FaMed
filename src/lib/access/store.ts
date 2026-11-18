import type { Db } from "@/lib/db/client";
import { ensureSchema } from "@/lib/db/schema";
import {
  codeStatus,
  constantTimeEqual,
  generateCode,
  generateSessionToken,
  sha256Hex,
  type CodeKind,
  type CodeRecord,
} from "./codes";

/**
 * Datenbankzugriffe für persönliche Zugangscodes.
 * Regeln:
 * - Laufzeit beginnt mit der ersten Anmeldung.
 * - Pro Code ist genau eine Sitzung (ein Gerät/Browser) aktiv; eine neue Anmeldung
 *   ersetzt die alte, das alte Gerät wird beim nächsten Zugriff abgemeldet.
 */

type Row = {
  id: string;
  code: string;
  label: string;
  kind: CodeKind;
  duration_hours: number;
  created_at: Date | string;
  activated_at: Date | string | null;
  expires_at: Date | string | null;
  revoked_at: Date | string | null;
  session_hash: string | null;
  last_seen_at: Date | string | null;
  login_count: number;
};

const COLUMNS = `id, code, label, kind, duration_hours, created_at, activated_at, expires_at,
  revoked_at, session_hash, last_seen_at, login_count`;

function toDate(v: Date | string | null): Date | null {
  if (v === null || v === undefined) return null;
  return v instanceof Date ? v : new Date(v);
}

function toRecord(r: Row): CodeRecord {
  return {
    id: r.id,
    code: r.code,
    label: r.label,
    kind: r.kind,
    durationHours: Number(r.duration_hours),
    createdAt: toDate(r.created_at)!,
    activatedAt: toDate(r.activated_at),
    expiresAt: toDate(r.expires_at),
    revokedAt: toDate(r.revoked_at),
    hasSession: Boolean(r.session_hash),
    lastSeenAt: toDate(r.last_seen_at),
    loginCount: Number(r.login_count),
  };
}

const iso = (d: Date) => d.toISOString();

export async function createCode(
  db: Db,
  input: { label: string; kind: CodeKind; durationHours: number },
): Promise<CodeRecord> {
  await ensureSchema(db);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const rows = await db.query<Row>(
        `insert into access_codes (code, label, kind, duration_hours)
         values ($1, $2, $3, $4) returning ${COLUMNS}`,
        [generateCode(), input.label.trim(), input.kind, input.durationHours],
      );
      return toRecord(rows[0]);
    } catch (err) {
      // Sehr seltene Kollision mit bestehendem Code → neuer Versuch
      if (!/unique|duplicate/i.test(String(err))) throw err;
    }
  }
  throw new Error("Konnte keinen eindeutigen Code erzeugen.");
}

export async function listCodes(db: Db): Promise<CodeRecord[]> {
  await ensureSchema(db);
  const rows = await db.query<Row>(`select ${COLUMNS} from access_codes order by created_at desc`);
  return rows.map(toRecord);
}

async function getById(db: Db, id: string): Promise<CodeRecord | null> {
  const rows = await db.query<Row>(`select ${COLUMNS} from access_codes where id = $1`, [id]);
  return rows[0] ? toRecord(rows[0]) : null;
}

export type DenyReason = "unbekannt" | "abgelaufen" | "gesperrt" | "anderes-geraet";

export type LoginResult =
  | { ok: true; record: CodeRecord; sessionToken: string }
  | { ok: false; reason: Exclude<DenyReason, "anderes-geraet"> };

export async function loginWithCode(db: Db, code: string, now = new Date()): Promise<LoginResult> {
  await ensureSchema(db);
  const rows = await db.query<Row>(
    `select ${COLUMNS} from access_codes where lower(code) = lower($1)`,
    [code.trim()],
  );
  if (!rows[0]) return { ok: false, reason: "unbekannt" };
  const current = toRecord(rows[0]);
  const status = codeStatus(current, now);
  if (status === "gesperrt") return { ok: false, reason: "gesperrt" };
  if (status === "abgelaufen") return { ok: false, reason: "abgelaufen" };

  const sessionToken = generateSessionToken();
  const updated = await db.query<Row>(
    `update access_codes set
       activated_at = coalesce(activated_at, $2::timestamptz),
       expires_at = coalesce(expires_at, $2::timestamptz + make_interval(hours => duration_hours)),
       session_hash = $3,
       session_started_at = $2::timestamptz,
       last_seen_at = $2::timestamptz,
       login_count = login_count + 1
     where id = $1
     returning ${COLUMNS}`,
    [current.id, iso(now), await sha256Hex(sessionToken)],
  );
  return { ok: true, record: toRecord(updated[0]), sessionToken };
}

export type SessionCheck =
  | { ok: true; record: CodeRecord }
  | { ok: false; reason: DenyReason };

/** Prüft eine Sitzung und merkt sich „zuletzt aktiv“ (höchstens einmal pro Minute). */
export async function checkSession(
  db: Db,
  codeId: string,
  sessionToken: string,
  now = new Date(),
): Promise<SessionCheck> {
  await ensureSchema(db);
  if (!/^[0-9a-f-]{36}$/i.test(codeId)) return { ok: false, reason: "unbekannt" };
  const rows = await db.query<Row>(`select ${COLUMNS} from access_codes where id = $1`, [codeId]);
  if (!rows[0]) return { ok: false, reason: "unbekannt" };
  const record = toRecord(rows[0]);
  const status = codeStatus(record, now);
  if (status === "gesperrt") return { ok: false, reason: "gesperrt" };
  if (status === "abgelaufen") return { ok: false, reason: "abgelaufen" };
  const hash = await sha256Hex(sessionToken);
  if (!rows[0].session_hash || !constantTimeEqual(rows[0].session_hash, hash)) {
    return { ok: false, reason: "anderes-geraet" };
  }
  if (!record.lastSeenAt || now.getTime() - record.lastSeenAt.getTime() > 60_000) {
    await db.query(`update access_codes set last_seen_at = $2::timestamptz where id = $1`, [
      codeId,
      iso(now),
    ]);
  }
  return { ok: true, record };
}

/** Meldet die Sitzung ab, aber nur wenn sie noch die aktive ist. */
export async function logoutSession(db: Db, codeId: string, sessionToken: string): Promise<void> {
  await ensureSchema(db);
  await db.query(`update access_codes set session_hash = null where id = $1 and session_hash = $2`, [
    codeId,
    await sha256Hex(sessionToken),
  ]);
}

// ---------- Verwaltung (nur Master) ----------

export async function extendCode(db: Db, id: string, hours: number, now = new Date()) {
  await ensureSchema(db);
  // Noch nicht aktiviert: Laufzeit verlängern. Aktiviert: Ablauf verschieben
  // (bei bereits abgelaufenem Code ab jetzt).
  await db.query(
    `update access_codes set
       duration_hours = case when expires_at is null then duration_hours + $2 else duration_hours end,
       expires_at = case when expires_at is null then null
                    else greatest(expires_at, $3::timestamptz) + make_interval(hours => $2) end
     where id = $1`,
    [id, hours, iso(now)],
  );
  return getById(db, id);
}

export async function kickDevice(db: Db, id: string) {
  await ensureSchema(db);
  await db.query(`update access_codes set session_hash = null where id = $1`, [id]);
  return getById(db, id);
}

export async function setRevoked(db: Db, id: string, revoked: boolean, now = new Date()) {
  await ensureSchema(db);
  await db.query(
    `update access_codes set revoked_at = $2::timestamptz,
       session_hash = case when $3 then null else session_hash end
     where id = $1`,
    [id, revoked ? iso(now) : null, revoked],
  );
  return getById(db, id);
}

export async function deleteCode(db: Db, id: string): Promise<boolean> {
  await ensureSchema(db);
  const rows = await db.query(`delete from access_codes where id = $1 returning id`, [id]);
  return rows.length > 0;
}
