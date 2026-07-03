#!/usr/bin/env node
/**
 * Sync the homepage partner-logo marquee (`partners` table) with the active
 * case-study partners: add any case study (with a logo) that isn't already a
 * partner row. Idempotent — skips partners already present by slug or name.
 *
 *   node scripts/sync-partner-logos.mjs            # dry run
 *   node scripts/sync-partner-logos.mjs --apply    # write
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [partners] = await conn.query("SELECT name, slug, sortOrder FROM partners");
const haveName = new Set(partners.map((p) => norm(p.name)));
const haveSlug = new Set(partners.map((p) => p.slug));
let nextOrder = Math.max(0, ...partners.map((p) => Number(p.sortOrder) || 0)) + 1;

const [cs] = await conn.query(
  "SELECT slug, client, logoImage, logoImageAlt, externalLinks, industry FROM case_studies WHERE isActive=1 AND logoImage IS NOT NULL AND logoImage<>''"
);
const missing = cs.filter((x) => !haveName.has(norm(x.client)) && !haveSlug.has(x.slug));

console.log(`${missing.length} partner hozzáadása a logó-sávhoz${APPLY ? " — ÍRÁS" : " (dry run)"}\n`);

for (const x of missing) {
  let website = "";
  try { website = JSON.parse(x.externalLinks || "{}").website || ""; } catch { /* ignore */ }
  console.log(`  + ${x.client.padEnd(40)} logo=${x.logoImage ? "✓" : "✗"} web=${website || "—"}`);
  if (!APPLY) continue;
  await conn.execute(
    `INSERT INTO partners (name, slug, logo, logoAlt, website, description, descriptionEn, descriptionZh, category, isActive, sortOrder)
     VALUES (?, ?, ?, ?, ?, '', '', '', '', 1, ?)`,
    [x.client, x.slug, x.logoImage, x.logoImageAlt || `${x.client} logó`, website, nextOrder]
  );
  nextOrder++;
}

const [cnt] = await conn.query("SELECT COUNT(*) n FROM partners");
await conn.end();
console.log(`\n${APPLY ? "✓ Kész — partners összesen: " + cnt[0].n : "[dry run] — futtasd --apply kapcsolóval."}`);
