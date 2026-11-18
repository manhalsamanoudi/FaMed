import { neon } from "@neondatabase/serverless";

/**
 * Minimale Datenbank-Schnittstelle. In Produktion Neon (HTTP), in Tests PGlite.
 * Platzhalter im SQL: $1, $2, …
 */
export type Db = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL fehlt. Mit Datenbank-eintragen.cmd eintragen (lokal) bzw. im Render-Dashboard setzen.");
    this.name = "DatabaseNotConfiguredError";
  }
}

let cached: { url: string; db: Db } | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfiguredError();
  if (cached?.url !== url) {
    const sql = neon(url);
    cached = {
      url,
      db: {
        query: async <T,>(text: string, params: unknown[] = []) =>
          (await sql.query(text, params)) as T[],
      },
    };
  }
  return cached.db;
}
