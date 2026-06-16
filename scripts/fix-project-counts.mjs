/**
 * Audit C1 — the 8 industry landing pages each claimed an industry-
 * specific project count (40+ healthcare, 50+ B2B, 35+ tech …) that
 * summed to 225+ projects, contradicting the company-wide "23+ active
 * partners" stated on Home/About. Decision (user): keep 23+ partners
 * as the single truthful number everywhere.
 *
 * This script rewrites the third `results` stat on every industry
 * page from "<N>+ <industry> project(s)" to the company-wide
 * "23+ active partners" (localized), in all three locales.
 *
 * The prose count references in `whyG2A` are fixed separately with
 * targeted edits (they're language-sensitive sentences).
 *
 * Usage:
 *   node scripts/fix-project-counts.mjs          # dry run (shows diff)
 *   node scripts/fix-project-counts.mjs --apply  # write the file
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../client/src/pages/IparagiLandingPage.tsx");
let src = readFileSync(FILE, "utf-8");

// Localized "active partners" stat label, chosen by detecting the
// script of the old label.
const PARTNER_LABEL = { hu: "Aktív partner", en: "Active partners", zh: "活跃合作伙伴" };

// Match a results stat whose label mentions a project count, in any
// of the three locales. Capture the label so we can pick the locale.
const STAT_RE = /\{ num: "\d+\+", label: "([^"]*(?:projekt|projects?|项目)[^"]*)" \}/g;

let count = 0;
src = src.replace(STAT_RE, (whole, label) => {
  // Locale detection: CJK → zh; Latin "project(s)" → en; else hu.
  const locale = /[一-鿿]/.test(label)
    ? "zh"
    : /projects?\b/i.test(label)
      ? "en"
      : "hu";
  count++;
  return `{ num: "23+", label: "${PARTNER_LABEL[locale]}" }`;
});

console.log(`STAT cserék: ${count} (várt: 24)`);

if (!APPLY) {
  // Show the unique resulting stat lines as a sanity check
  const after = [...src.matchAll(/\{ num: "23\+", label: "(Aktív partner|Active partners|活跃合作伙伴)" \}/g)];
  console.log(`23+ partner stat a kimenetben: ${after.length}`);
  console.log("\n[dry run] — futtasd --apply kapcsolóval az íráshoz.");
  process.exit(0);
}

writeFileSync(FILE, src, "utf-8");
console.log("✓ Fájl frissítve.");
