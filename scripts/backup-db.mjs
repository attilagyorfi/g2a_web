#!/usr/bin/env node
/**
 * Backup all G2A tables to a timestamped folder of CSV files.
 *
 *   node scripts/backup-db.mjs                # default → ./backups/<timestamp>/
 *   node scripts/backup-db.mjs --out=/path    # custom output dir
 *   node scripts/backup-db.mjs --tables=posts,case_studies   # subset
 *
 * Why CSV: human-readable, importable into spreadsheets, smaller than a full
 * mysqldump for most use cases, and TiDB Cloud doesn't expose mysqldump
 * over the gateway (port 4000 only allows SQL queries).
 *
 * Each row is written with proper CSV escaping (commas, quotes, newlines all
 * handled). Date columns serialize as ISO 8601.
 *
 * The output dir is added to .gitignore via `backups/` — backups should never
 * be committed (PII risk + size).
 */
import "dotenv/config";
import { mkdirSync, writeFileSync, createWriteStream } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const outFlag = args.find((a) => a.startsWith("--out="))?.slice(6);
const tablesFlag = args.find((a) => a.startsWith("--tables="))?.slice(9);

const C = {
  reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", cyan: "\x1b[36m", gray: "\x1b[90m", bold: "\x1b[1m",
};

if (!process.env.DATABASE_URL) {
  console.error(`${C.red}✗ DATABASE_URL not set — aborting.${C.reset}`);
  process.exit(1);
}

// Tables we manage (everything else is migrations/Drizzle internals)
const ALL_TABLES = [
  "users",
  "categories", "posts",
  "services", "partners", "testimonials",
  "industries", "technologies", "values",
  "hero_slides",
  "case_studies",
  "contact_submissions",
  "newsletter_subscribers",
  "audit_leads",
  "pages",
  "site_settings",
  "email_campaigns",
];

const targetTables = tablesFlag
  ? tablesFlag.split(",").map((t) => t.trim()).filter(Boolean)
  : ALL_TABLES;

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = outFlag ?? join(REPO_ROOT, "backups", stamp);
mkdirSync(outDir, { recursive: true });

console.log(`${C.bold}${C.cyan}DB backup${C.reset} → ${outDir}`);
console.log(`${C.gray}${targetTables.length} table(s) to dump${C.reset}\n`);

const conn = await mysql.createConnection(process.env.DATABASE_URL);

/** RFC 4180 style CSV escape — handle commas, quotes, newlines. */
function esc(v) {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString();
  let s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[,"\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

const summary = [];
let totalRows = 0;

for (const table of targetTables) {
  process.stdout.write(`${C.gray}▶${C.reset} ${table.padEnd(28)}`);
  try {
    const [cols] = await conn.execute(`SHOW COLUMNS FROM \`${table}\``);
    const colNames = cols.map((c) => c.Field);
    const [rows] = await conn.execute(`SELECT * FROM \`${table}\``);

    const filePath = join(outDir, `${table}.csv`);
    const stream = createWriteStream(filePath, { encoding: "utf8" });
    stream.write(colNames.map(esc).join(",") + "\n");
    for (const row of rows) {
      stream.write(colNames.map((c) => esc(row[c])).join(",") + "\n");
    }
    await new Promise((resolve) => stream.end(resolve));

    process.stdout.write(`${C.green}✓${C.reset} ${rows.length} sor\n`);
    summary.push({ table, rows: rows.length, file: `${table}.csv` });
    totalRows += rows.length;
  } catch (err) {
    process.stdout.write(`${C.red}✗${C.reset} ${err.code || err.message}\n`);
    summary.push({ table, rows: 0, file: null, error: err.message });
  }
}

await conn.end();

// Manifest file — useful when restoring
const manifest = {
  generatedAt: new Date().toISOString(),
  databaseUrl: process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@"), // mask password
  tables: summary,
  totalRows,
};
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(`\n${C.bold}Summary${C.reset}`);
console.log(`  ${C.green}${summary.filter((s) => !s.error).length}${C.reset} tables · ${C.cyan}${totalRows}${C.reset} total rows`);
const errors = summary.filter((s) => s.error);
if (errors.length > 0) {
  console.log(`  ${C.red}${errors.length}${C.reset} error(s):`);
  errors.forEach((e) => console.log(`    · ${e.table}: ${e.error.slice(0, 80)}`));
  process.exit(1);
}
console.log(`  ${C.gray}Manifest: ${join(outDir, "manifest.json")}${C.reset}`);
