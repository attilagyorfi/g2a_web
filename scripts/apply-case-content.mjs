/**
 * Case study body upload from
 * docs/content-source/G2A-esettanulmanyok-TELJES.md (28 × HU/EN/ZH).
 *
 * Maps the labelled lines onto the case_studies columns:
 *   **Kihívás / Challenge / 挑战:**   → challenge / challengeEn / challengeZh
 *   **Megoldás / Solution / 方案:**   → solution / solutionEn / solutionZh
 *   **Eredmény / Result / 成果:**     → results / resultsEn / resultsZh
 *
 * Everything else in the doc is intentionally skipped:
 *   - Meta cím/leírás: the shortened docx B6/B7 versions were applied
 *     in a previous batch and are newer than the TELJES drafts.
 *   - H1/Alcím, Projekt adatok, CTA, AEO: no matching DB columns; the
 *     detail page renders its own header, project sidebar and CTA.
 *
 * Fixes applied during conversion (content-review docx):
 *   A4 — "from one hand" → "under one roof" (9 occurrences, EN)
 *   D  — "in consistent quality" → "at a consistent quality" (EN)
 *
 * Values are stored as PLAIN TEXT (the detail page renders them in
 * <p>…</p>, no HTML). The results field keeps its semicolon
 * separators — the renderer splits on them to build the checkmark
 * chips.
 *
 * Usage:
 *   node scripts/apply-case-content.mjs            # dry run
 *   node scripts/apply-case-content.mjs --apply    # write to DB
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
  // A4 (docx): hunglish mirror-translation, 9 occurrences in EN copy.
  .replace(/from one hand/g, "under one roof")
  // D (docx): EN grammar fix.
  .replace(/in consistent quality/g, "at a consistent quality");

/** Strip markdown emphasis/links — these columns are plain text. */
function plain(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pull a labelled value out of a section. Label colon may be ASCII
 *  or full-width. Value runs to the end of the line. */
function field(section, labels) {
  for (const label of labels) {
    const re = new RegExp(`^\\*\\*${label}[:：]\\*\\*\\s*(.+)$`, "m");
    const m = section.match(re);
    if (m) return plain(m[1]);
  }
  return null;
}

const cases = [];
const parts = DOC.split(/^# (?=\d+ — )/m).slice(1);
for (const part of parts) {
  const slugM = part.match(/`\/referenciak\/([a-z0-9-]+)`/);
  if (!slugM) continue;
  const slug = slugM[1];

  const huM = part.match(/## 🇭🇺 MAGYAR\s*\n([\s\S]*?)(?=## 🇬🇧)/);
  const enM = part.match(/## 🇬🇧 ENGLISH\s*\n([\s\S]*?)(?=## 🇨🇳)/);
  const zhM = part.match(/## 🇨🇳 中文\s*\n([\s\S]*?)(?=\n---|\n# |$)/);
  if (!huM || !enM || !zhM) {
    console.warn(`⚠ ${slug}: hiányzó nyelvi szekció — kihagyva`);
    continue;
  }

  const row = {
    slug,
    challenge: field(huM[1], ["Kihívás"]),
    solution: field(huM[1], ["Megoldás"]),
    results: field(huM[1], ["Eredmény"]),
    challengeEn: field(enM[1], ["Challenge"]),
    solutionEn: field(enM[1], ["Solution"]),
    resultsEn: field(enM[1], ["Results?", "Result"]),
    challengeZh: field(zhM[1], ["挑战"]),
    solutionZh: field(zhM[1], ["方案"]),
    resultsZh: field(zhM[1], ["成果"]),
  };

  const missing = Object.entries(row).filter(([k, v]) => k !== "slug" && !v).map(([k]) => k);
  if (missing.length) console.warn(`⚠ ${slug}: hiányzó mezők: ${missing.join(", ")}`);
  cases.push(row);
}

console.log(`${cases.length} esettanulmány felismerve.\n`);
for (const c of cases) {
  console.log(`${c.slug}: HU ch:${c.challenge?.length} sol:${c.solution?.length} res:${c.results?.length} | EN ${c.challengeEn?.length}/${c.solutionEn?.length}/${c.resultsEn?.length} | ZH ${c.challengeZh?.length}/${c.solutionZh?.length}/${c.resultsZh?.length}`);
}

if (!APPLY) {
  const sample = cases[0];
  console.log(`\n─── MINTA (${sample.slug}) ───`);
  console.log(`HU Kihívás: ${sample.challenge}`);
  console.log(`HU Eredmény: ${sample.results}`);
  console.log(`EN Solution: ${sample.solutionEn}`);
  console.log(`ZH 成果: ${sample.resultsZh}`);
  console.log("\n[dry run] — futtasd --apply kapcsolóval az íráshoz.");
  process.exit(0);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let updated = 0;
try {
  for (const c of cases) {
    const { slug, ...fields } = c;
    const keys = Object.keys(fields).filter((k) => fields[k]);
    const setSql = keys.map((k) => `\`${k}\` = ?`).join(", ");
    const [res] = await conn.query(
      `UPDATE case_studies SET ${setSql} WHERE slug = ?`,
      [...keys.map((k) => fields[k]), slug],
    );
    console.log(`case_studies/${slug}: ${res.affectedRows} sor (${keys.length} mező)`);
    updated += res.affectedRows;
  }
  console.log(`\n✓ Kész — ${updated} esettanulmány frissítve.`);
} finally {
  await conn.end();
}
