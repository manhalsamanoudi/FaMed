// Prüft, ob die Datenbank-Adresse (Umgebungsvariable DATABASE_URL) funktioniert.
// Gibt die Adresse selbst nie aus.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL fehlt.");
  process.exit(2);
}
try {
  const sql = neon(url);
  const rows = await sql.query("select current_database() as db, version() as v", []);
  const host = new URL(url).hostname;
  const region = host.match(/\.([a-z]+-[a-z]+-\d)\.aws/)?.[1] ?? "unbekannt";
  console.log(`OK – Datenbank "${rows[0].db}", Region ${region}`);
} catch (err) {
  console.error(`Verbindung fehlgeschlagen: ${String(err.message).slice(0, 160)}`);
  process.exit(1);
}
