/**
 * Read-only scan: do the A1/A3/A4 errors flagged by the content-review
 * docx exist in the LIVE database content?
 *   A1 — "béménél" typo (should be "bérénél")
 *   A3 — "http:///" broken link prefix
 *   A4 — "from one hand" hunglish in EN case study copy
 * Also checks "prioritizált" (D) and lingering "Varsói Egyetem".
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const checks = [
  { label: "A1 béménél (posts HU)", sql: `SELECT id, slug FROM posts WHERE content LIKE '%béménél%' OR excerpt LIKE '%béménél%'` },
  { label: "A3 http:/// (posts all locales)", sql: `SELECT id, slug FROM posts WHERE content LIKE '%http:///%' OR contentEn LIKE '%http:///%' OR contentZh LIKE '%http:///%'` },
  { label: "A4 from one hand (case studies EN)", sql: `SELECT id, slug FROM case_studies WHERE challengeEn LIKE '%from one hand%' OR solutionEn LIKE '%from one hand%' OR resultsEn LIKE '%from one hand%'` },
  { label: "A4 from one hand (posts EN)", sql: `SELECT id, slug FROM posts WHERE contentEn LIKE '%from one hand%'` },
  { label: "D prioritizált (posts HU)", sql: `SELECT id, slug FROM posts WHERE content LIKE '%prioritizált%'` },
  { label: "D prioritizált (case studies HU)", sql: `SELECT id, slug FROM case_studies WHERE challenge LIKE '%prioritizált%' OR solution LIKE '%prioritizált%' OR results LIKE '%prioritizált%'` },
  { label: "C2 Varsói Egyetem (posts)", sql: `SELECT id, slug FROM posts WHERE content LIKE '%Varsói Egyetem%'` },
  { label: "EN in consistent quality (case studies)", sql: `SELECT id, slug FROM case_studies WHERE challengeEn LIKE '%in consistent quality%' OR solutionEn LIKE '%in consistent quality%' OR resultsEn LIKE '%in consistent quality%'` },
];

try {
  for (const c of checks) {
    const [rows] = await conn.query(c.sql);
    console.log(`${c.label}: ${rows.length} találat${rows.length ? " → " + rows.map(r => r.slug).join(", ") : ""}`);
  }
} finally {
  await conn.end();
}
