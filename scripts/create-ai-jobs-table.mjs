/**
 * One-shot: create the ai_jobs table directly.
 *
 * Why not `pnpm run db:push`: the drizzle migration journal is out of
 * sync with the production database — the tables were created before
 * the journal existed, so `drizzle-kit migrate` tries to re-run the
 * initial CREATE TABLE users migration and dies with
 * ER_TABLE_EXISTS_ERROR. Rebaselining the journal is a bigger surgery;
 * for now we create the single new table idempotently and move on.
 *
 * Run: node scripts/create-ai-jobs-table.mjs
 * Requires DATABASE_URL in env (.env is loaded automatically).
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — aborting.");
  process.exit(1);
}

const DDL = `
CREATE TABLE IF NOT EXISTS \`ai_jobs\` (
  \`id\` varchar(36) NOT NULL,
  \`type\` varchar(32) NOT NULL,
  \`status\` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
  \`phase\` varchar(64),
  \`completedSteps\` int NOT NULL DEFAULT 0,
  \`totalSteps\` int NOT NULL DEFAULT 6,
  \`errorMessage\` text,
  \`createdAt\` timestamp NOT NULL DEFAULT (now()),
  \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`ai_jobs_id\` PRIMARY KEY(\`id\`)
);`;

const conn = await mysql.createConnection(url);
try {
  await conn.query(DDL);
  const [rows] = await conn.query("SHOW TABLES LIKE 'ai_jobs'");
  if (Array.isArray(rows) && rows.length > 0) {
    console.log("✓ ai_jobs table exists (created or already present).");
  } else {
    console.error("✗ CREATE ran but the table is still missing — check permissions.");
    process.exit(1);
  }
} finally {
  await conn.end();
}
