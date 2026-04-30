import "dotenv/config";
import mysql from "mysql2/promise";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const drizzleDir = join(__dirname, "..", "drizzle");

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const files = readdirSync(drizzleDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const conn = await mysql.createConnection(url);
console.log(`Connected. Applying ${files.length} migration file(s)...\n`);

for (const file of files) {
  const sql = readFileSync(join(drizzleDir, file), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`▶ ${file}  (${statements.length} statement${statements.length > 1 ? "s" : ""})`);
  for (const stmt of statements) {
    try {
      await conn.query(stmt);
      const name = stmt.match(/CREATE TABLE `(\w+)`/i)?.[1]
        ?? stmt.match(/ALTER TABLE `(\w+)`/i)?.[1]
        ?? stmt.split(/\s+/).slice(0, 3).join(" ");
      console.log(`   ✓ ${name}`);
    } catch (err) {
      if (err.code === "ER_TABLE_EXISTS_ERROR" || err.code === "ER_DUP_FIELDNAME" || err.code === "ER_DUP_KEYNAME") {
        console.log(`   ⚠ skip (already exists): ${err.code}`);
      } else {
        console.error(`   ✗ ${err.code}: ${err.message}`);
        console.error(`     SQL: ${stmt.slice(0, 120).replace(/\s+/g, " ")}...`);
      }
    }
  }
}

await conn.end();
console.log("\nDone.");
