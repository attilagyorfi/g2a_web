/**
 * Audit C5 — on the English service + industry pages, budget figures
 * are quoted in HUF, which is opaque to an international reader. Per
 * the user's call, keep HUF as the base and append a parenthetical
 * EUR estimate: "HUF 100-200k" → "HUF 100-200k (≈ €250–500)".
 *
 * Rate: 400 HUF ≈ 1 EUR (the "~" makes the approximation explicit).
 * HUF only ever appears in the EN sections (the HU sections use
 * "ezer/millió Ft", ZH uses its own form — verified 0 CJK-adjacent
 * HUF), so we can safely process every "HUF <amount>" in both files.
 *
 * Idempotent: skips any HUF figure already followed by "(≈ €".
 *
 * Usage:
 *   node scripts/add-eur-hints.mjs          # dry run (lists conversions)
 *   node scripts/add-eur-hints.mjs --apply  # write the files
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILES = [
  resolve(__dirname, "../client/src/data/serviceConfigs.ts"),
  resolve(__dirname, "../client/src/pages/IparagiLandingPage.tsx"),
];
const RATE = 400;

function unitMul(u) { return u === "M" ? 1e6 : u === "k" ? 1e3 : 1; }
function parseAmt(raw, inheritUnit) {
  const m = raw.match(/^([\d.,]+)\s*(k|M)?$/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ""));
  const u = m[2] || inheritUnit || "";
  return n * unitMul(u);
}
function roundNice(eur) {
  if (eur < 10) return Math.round(eur * 2) / 2;       // 0.5 step
  if (eur < 100) return Math.round(eur / 5) * 5;      // 5
  if (eur < 1000) return Math.round(eur / 10) * 10;   // 10
  if (eur < 10000) return Math.round(eur / 50) * 50;  // 50
  return Math.round(eur / 500) * 500;                 // 500
}
const fmt = (n) => n.toLocaleString("en-US");

// Matches "HUF 100-200k", "HUF 1-3M+", "HUF 300k-1.5M", "HUF 800k",
// "HUF 600-3,500", optionally already-suffixed (skipped below).
// Number = standard thousands grouping + optional decimal, so a
// trailing sentence period or list comma is NOT swallowed into the
// amount ("HUF 400–800." → matches "400"/"800", period stays outside).
const NUM = String.raw`\d{1,3}(?:,\d{3})*(?:\.\d+)?`;
// NB: idempotency is enforced in the callback (offset-based), NOT via a
// trailing lookahead — a lookahead lets the engine backtrack to a
// shorter match ("HUF 100" out of "HUF 100-200k (≈ …)") that slips
// past the guard. The greedy match without a lookahead always takes
// the full "HUF 100-200k"; the callback then skips it if already
// annotated.
const RE = new RegExp(`HUF (${NUM})\\s*(k|M)?\\s*([-–])?\\s*(${NUM}\\s*(?:k|M)?)?(\\+)?`, "g");

let total = 0;
for (const file of FILES) {
  let src = readFileSync(file, "utf-8");
  const conversions = [];
  src = src.replace(RE, (whole, lo, loUnit, dash, hiRaw, plus, offset, string) => {
    // Idempotency: skip if this figure is already annotated.
    if (/^\s*\(≈/.test(string.slice(offset + whole.length, offset + whole.length + 8))) return whole;
    // Determine the high side + its unit (if a range).
    let hiVal = null, hiUnit = "";
    if (dash && hiRaw) {
      const hm = hiRaw.trim().match(/^([\d.,]+)\s*(k|M)?$/);
      hiVal = hm[1]; hiUnit = hm[2] || "";
    }
    // Low side inherits the high side's unit when it has none
    // ("100-200k" → low is 100k).
    const loEur = parseAmt(lo + (loUnit || ""), dash ? hiUnit : loUnit);
    if (loEur == null) return whole;
    let hint;
    if (hiVal != null) {
      const hiEur = parseAmt(hiVal + (hiUnit || ""), "");
      hint = `(≈ €${fmt(roundNice(loEur / RATE))}–${fmt(roundNice(hiEur / RATE))}${plus || ""})`;
    } else {
      hint = `(≈ €${fmt(roundNice(loEur / RATE))}${plus || ""})`;
    }
    conversions.push(`${whole.trim()}  →  ${hint}`);
    total++;
    return `${whole} ${hint}`;
  });
  console.log(`=== ${file.split(/[\\/]/).pop()} (${conversions.length}) ===`);
  conversions.forEach((c) => console.log("  " + c));
  if (APPLY) writeFileSync(file, src, "utf-8");
}

console.log(`\nÖsszesen: ${total} HUF→EUR kiegészítés.`);
if (!APPLY) console.log("[dry run] — futtasd --apply kapcsolóval az íráshoz.");
else console.log("✓ Fájlok frissítve.");
