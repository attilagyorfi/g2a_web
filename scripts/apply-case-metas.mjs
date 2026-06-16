/**
 * Case study EN + ZH meta upload from
 * docs/content-source/G2A-esettanulmanyok-TELJES.md (28 cases).
 *
 * Why: the HU metaTitle/metaDescription are hand-tuned and already in
 * the DB, but metaTitleEn / metaDescriptionEn / metaTitleZh /
 * metaDescriptionZh were all empty — so the /en/ and /zh/ case study
 * pages had no per-page meta at all (only the generic site fallback).
 * This fills those four columns from the TELJES doc.
 *
 * HU columns are intentionally NOT touched.
 *
 * Inline fixes (content-review docx):
 *   A4 — "from one hand" → "under one roof"
 *   D  — "in consistent quality" → "at a consistent quality"
 *
 * Usage:
 *   node scripts/apply-case-metas.mjs            # dry run
 *   node scripts/apply-case-metas.mjs --apply    # write to DB
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
const DOC = readFileSync(
  resolve(__dirname, "../docs/content-source/G2A-esettanulmanyok-TELJES.md"),
  "utf-8",
)
  .replace(/from one hand/g, "under one roof")
  .replace(/in consistent quality/g, "at a consistent quality");

const clean = (s) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

const rows = [];
const parts = DOC.split(/^# (?=\d+ — )/m).slice(1);
for (const part of parts) {
  const slugM = part.match(/`\/referenciak\/([a-z0-9-]+)`/);
  if (!slugM) continue;
  const slug = slugM[1];

  const enM = part.match(/## 🇬🇧 ENGLISH\s*\n([\s\S]*?)(?=## 🇨🇳)/);
  const zhM = part.match(/## 🇨🇳 中文\s*\n([\s\S]*?)(?=\n---|\n# |$)/);

  const enTitle = enM?.[1].match(/\*\*Meta title:\*\*([^\n]+)/);
  const enDesc = enM?.[1].match(/\*\*Meta description:\*\*([^\n]+)/);
  const zhTitle = zhM?.[1].match(/\*\*Meta 标题:\*\*([^\n]+)/);
  const zhDesc = zhM?.[1].match(/\*\*Meta 描述:\*\*([^\n]+)/);

  rows.push({
    slug,
    metaTitleEn: enTitle ? clean(enTitle[1]) : null,
    metaDescriptionEn: enDesc ? clean(enDesc[1]) : null,
    metaTitleZh: zhTitle ? clean(zhTitle[1]) : null,
    metaDescriptionZh: zhDesc ? clean(zhDesc[1]) : null,
  });
}

console.log(`${rows.length} esettanulmány meta felismerve.\n`);
let warned = 0;
for (const r of rows) {
  const miss = ["metaTitleEn", "metaDescriptionEn", "metaTitleZh", "metaDescriptionZh"].filter((k) => !r[k]);
  if (miss.length) { console.warn(`⚠ ${r.slug}: hiányzó ${miss.join(", ")}`); warned++; }
}
if (!warned) console.log("Minden mező megvan mind a 28 esetnél.\n");

console.log(`─── MINTA (${rows[0].slug}) ───`);
console.log(`EN title (${rows[0].metaTitleEn.length}): ${rows[0].metaTitleEn}`);
console.log(`EN desc  (${rows[0].metaDescriptionEn.length}): ${rows[0].metaDescriptionEn}`);
console.log(`ZH title: ${rows[0].metaTitleZh}`);
console.log(`ZH desc : ${rows[0].metaDescriptionZh}`);

if (!APPLY) {
  console.log("\n[dry run] — futtasd --apply kapcsolóval az íráshoz.");
  process.exit(0);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let updated = 0;
try {
  for (const r of rows) {
    const [res] = await conn.query(
      `UPDATE case_studies SET
         metaTitleEn = ?, metaDescriptionEn = ?,
         metaTitleZh = ?, metaDescriptionZh = ?
       WHERE slug = ?`,
      [r.metaTitleEn, r.metaDescriptionEn, r.metaTitleZh, r.metaDescriptionZh, r.slug],
    );
    console.log(`case_studies/${r.slug}: ${res.affectedRows} sor`);
    updated += res.affectedRows;
  }
  console.log(`\n✓ Kész — ${updated} esettanulmány EN+ZH metája feltöltve.`);
} finally {
  await conn.end();
}
