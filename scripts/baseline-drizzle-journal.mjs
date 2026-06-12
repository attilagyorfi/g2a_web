/**
 * One-shot repair: baseline the drizzle migration bookkeeping.
 *
 * Symptom this fixes: `pnpm run db:push` dies with
 * ER_TABLE_EXISTS_ERROR ("Table 'test.users' already exists") because
 * the production database was created outside the drizzle migrator —
 * the `__drizzle_migrations` bookkeeping table is empty, so
 * `drizzle-kit migrate` believes nothing has ever run and starts from
 * migration 0000.
 *
 * The mysql2 migrator only compares `created_at` (bigint, ms) of the
 * latest bookkeeping row against each migration's `when` value from
 * drizzle/meta/_journal.json — it applies every migration whose
 * folderMillis is NEWER than the latest row. So a single baseline row
 * stamped with the CURRENT latest journal entry's `when` makes the
 * migrator treat everything up to now as applied, while future
 * migrations (newer `when`) still apply normally.
 *
 * Prerequisite: the database schema must actually match schema.ts
 * (it does — the tables were created manually / via earlier direct
 * SQL, and ai_jobs was just added by create-ai-jobs-table.mjs).
 *
 * Run: node scripts/baseline-drizzle-journal.mjs
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — aborting.");
  process.exit(1);
}

const journal = JSON.parse(
  readFileSync(resolve(REPO, "drizzle/meta/_journal.json"), "utf-8"),
);
const last = journal.entries[journal.entries.length - 1];
if (!last) {
  console.error("Journal has no entries — nothing to baseline.");
  process.exit(1);
}

// Hash matches what drizzle's readMigrationFiles computes (sha256 of
// the raw SQL text). Only created_at drives the skip logic, but a
// real hash keeps the row honest for humans inspecting the table.
const sqlPath = resolve(REPO, `drizzle/${last.tag}.sql`);
const hash = createHash("sha256").update(readFileSync(sqlPath, "utf-8")).digest("hex");

const conn = await mysql.createConnection(url);
try {
  await conn.query(`CREATE TABLE IF NOT EXISTS \`__drizzle_migrations\` (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
  )`);

  const [rows] = await conn.query(
    "SELECT created_at FROM `__drizzle_migrations` ORDER BY created_at DESC LIMIT 1",
  );
  const latest = Array.isArray(rows) && rows.length > 0 ? Number(rows[0].created_at) : null;

  if (latest !== null && latest >= last.when) {
    console.log(`✓ Bookkeeping already at or past ${last.tag} (created_at=${latest}) — nothing to do.`);
  } else {
    await conn.query(
      "INSERT INTO `__drizzle_migrations` (hash, created_at) VALUES (?, ?)",
      [hash, last.when],
    );
    console.log(`✓ Baselined journal at ${last.tag} (when=${last.when}).`);
    console.log("  Future `pnpm run db:push` runs will apply only migrations newer than this.");
  }
} finally {
  await conn.end();
}
