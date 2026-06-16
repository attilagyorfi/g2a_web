/**
 * Audit C1 (prose half) — rewrite the project-count references in the
 * 8 industry pages' whyG2A paragraphs (HU/EN/ZH) to non-numeric
 * phrasing, so nothing contradicts the company-wide "23+ partners".
 *
 * Each pair must match EXACTLY ONCE; the script aborts if any pair
 * matches 0 or >1 times (guards against a doc edit drifting).
 *
 * Usage:
 *   node scripts/fix-project-prose.mjs          # dry run (match counts)
 *   node scripts/fix-project-prose.mjs --apply  # write the file
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../client/src/pages/IparagiLandingPage.tsx");
let src = readFileSync(FILE, "utf-8");

const PAIRS = [
  // ── HU ──
  ["Több mint 40 egészségügyi projekten", "Számos egészségügyi projekten"],
  ["25+ szépségipari projekttel", "Számos szépségipari projekttel"],
  ["30+ mérnöki és építőipari projektben", "Számos mérnöki és építőipari projektben"],
  ["20+ autóipari projektben", "Számos autóipari projektben"],
  ["15+ jogi projektben", "Számos jogi projektben"],
  ["35+ tech projektben dolgoztunk", "Számos tech projektben dolgoztunk"],
  ["10+ önkormányzati és közintézményi projekt mögöttünk", "Számos önkormányzati és közintézményi projekt mögöttünk"],
  ["50+ B2B projekt — a középvállalati", "Számos B2B projekt — a középvállalati"],
  // ── EN ──
  ["on 40+ healthcare projects", "on numerous healthcare projects"],
  ["With 25+ beauty industry projects", "Across numerous beauty industry projects"],
  ["30+ engineering and construction projects with", "Numerous engineering and construction projects with"],
  ["20+ automotive projects with", "Numerous automotive projects with"],
  ["15+ legal projects with", "Numerous legal projects with"],
  ["35+ tech projects from SaaS", "Numerous tech projects from SaaS"],
  ["10+ municipal and public-institution projects", "Numerous municipal and public-institution projects"],
  ["50+ B2B projects, from mid-market", "Numerous B2B projects, from mid-market"],
  // ── ZH (众多 = numerous; drops the digit + space) ──
  ["合作完成 40+ 医疗项目", "合作完成众多医疗项目"],
  ["凭借 25+ 美容行业项目", "凭借众多美容行业项目"],
  ["合作完成 30+ 工程与建筑项目", "合作完成众多工程与建筑项目"],
  ["我们完成 20+ 汽车行业项目", "我们完成众多汽车行业项目"],
  ["完成 15+ 法律项目", "完成众多法律项目"],
  ["完成 35+ 科技项目", "完成众多科技项目"],
  ["完成 10+ 政府与公共机构项目", "完成众多政府与公共机构项目"],
  ["完成 50+ B2B 项目", "完成众多 B2B 项目"],
];

let ok = true;
for (const [from, to] of PAIRS) {
  const n = src.split(from).length - 1;
  if (n !== 1) { console.error(`✗ "${from.slice(0, 40)}…" → ${n} találat (várt: 1)`); ok = false; }
  else { console.log(`✓ "${from.slice(0, 42)}…"`); src = src.replace(from, to); }
}

if (!ok) { console.error("\nNem minden pár egyértelmű — nincs írás."); process.exit(1); }
console.log(`\n${PAIRS.length} próza-csere rendben.`);

if (!APPLY) { console.log("[dry run] — futtasd --apply kapcsolóval az íráshoz."); process.exit(0); }
writeFileSync(FILE, src, "utf-8");
console.log("✓ Fájl frissítve.");
