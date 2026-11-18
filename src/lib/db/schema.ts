import type { Db } from "./client";

/** Idempotente Schema-Anweisungen (werden beim ersten Zugriff je Prozess ausgeführt). */
export const SCHEMA_STATEMENTS = [
  `create table if not exists access_codes (
    id uuid primary key default gen_random_uuid(),
    code text not null,
    label text not null,
    kind text not null check (kind in ('nutzer', 'test')),
    duration_hours integer not null check (duration_hours > 0),
    created_at timestamptz not null default now(),
    activated_at timestamptz,
    expires_at timestamptz,
    revoked_at timestamptz,
    session_hash text,
    session_started_at timestamptz,
    last_seen_at timestamptz,
    login_count integer not null default 0
  )`,
  `create unique index if not exists access_codes_code_lower on access_codes (lower(code))`,
];

const ready = new WeakMap<Db, Promise<void>>();

export function ensureSchema(db: Db): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    p = (async () => {
      for (const stmt of SCHEMA_STATEMENTS) await db.query(stmt);
    })();
    // Bei Fehler beim nächsten Aufruf erneut versuchen.
    p.catch(() => ready.delete(db));
    ready.set(db, p);
  }
  return p;
}
