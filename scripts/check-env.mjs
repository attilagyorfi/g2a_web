#!/usr/bin/env node
/**
 * Env doctor — verifies .env completeness against deployment requirements.
 *
 * Usage:
 *   node scripts/check-env.mjs               # local .env audit
 *   node scripts/check-env.mjs --prod        # strict production check (no DEV_ADMIN_BYPASS=true allowed)
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

const isProd = process.argv.includes("--prod");

const C = {
  reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", cyan: "\x1b[36m", gray: "\x1b[90m", bold: "\x1b[1m",
};

function ok(msg)   { console.log(`  ${C.green}✓${C.reset} ${msg}`); }
function warn(msg) { console.log(`  ${C.yellow}⚠${C.reset} ${msg}`); }
function fail(msg) { console.log(`  ${C.red}✗${C.reset} ${msg}`); }
function head(msg) { console.log(`\n${C.bold}${C.cyan}${msg}${C.reset}`); }

if (!existsSync(envPath)) {
  console.error(`${C.red}.env nem található:${C.reset} ${envPath}`);
  console.error(`Másold le a sablont: ${C.cyan}cp .env.example .env${C.reset}`);
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      if (idx === -1) return [l, ""];
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const isFilled = (k) => env[k] && env[k].length > 0;

let errors = 0, warnings = 0;

head("Kötelező változók");
const required = [
  { key: "DATABASE_URL", check: (v) => v.startsWith("mysql://"), hint: "TiDB Cloud → Connect → connection string" },
  { key: "JWT_SECRET", check: (v) => v.length >= 32, hint: "≥32 char véletlen string · node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" },
];
for (const { key, check, hint } of required) {
  if (!isFilled(key)) {
    fail(`${key} ${C.gray}— üres${C.reset}  ${C.gray}(${hint})${C.reset}`);
    errors++;
  } else if (!check(env[key])) {
    fail(`${key} ${C.gray}— érvénytelen formátum${C.reset}  ${C.gray}(${hint})${C.reset}`);
    errors++;
  } else {
    ok(`${key} ${C.gray}(${env[key].length} char)${C.reset}`);
  }
}

head("Manus OAuth (admin login)");
const oauthKeys = ["VITE_APP_ID", "VITE_OAUTH_PORTAL_URL", "OAUTH_SERVER_URL", "OWNER_OPEN_ID"];
const oauthMissing = oauthKeys.filter((k) => !isFilled(k));

if (oauthMissing.length === oauthKeys.length) {
  if (isProd) {
    fail(`Mind a 4 OAuth változó hiányzik — production-ben az admin elérhetetlen lesz`);
    console.log(`    ${C.gray}Lépések: Manus Cloud → Settings → App Registration${C.reset}`);
    errors++;
  } else {
    warn(`Mind a 4 OAuth változó üres — admin csak DEV_ADMIN_BYPASS-szal érhető el`);
    warnings++;
  }
} else if (oauthMissing.length > 0) {
  fail(`Részleges OAuth konfiguráció — ${oauthMissing.length} változó hiányzik:`);
  for (const k of oauthMissing) console.log(`    ${C.red}·${C.reset} ${k}`);
  console.log(`    ${C.gray}Vagy mind kell, vagy egy se (akkor DEV_ADMIN_BYPASS-szal kerülhető meg)${C.reset}`);
  errors++;
} else {
  for (const k of oauthKeys) ok(k);
  if (env.VITE_OAUTH_PORTAL_URL && !env.VITE_OAUTH_PORTAL_URL.startsWith("https://")) {
    warn(`VITE_OAUTH_PORTAL_URL nem https:// — production-ben kötelező`);
    warnings++;
  }
  if (env.OWNER_OPEN_ID && env.OWNER_OPEN_ID.length < 8) {
    warn(`OWNER_OPEN_ID gyanúsan rövid (${env.OWNER_OPEN_ID.length} char) — Manus openId általában 16+ char`);
    warnings++;
  }
}

head("Dev bypass");
const bypass = env.DEV_ADMIN_BYPASS || "";
if (bypass.toLowerCase() === "true") {
  if (isProd) {
    fail(`DEV_ADMIN_BYPASS=true — ${C.red}production-ben tilos!${C.reset}`);
    errors++;
  } else {
    warn(`DEV_ADMIN_BYPASS=true — admin auth ki van kapcsolva (csak NODE_ENV=development esetén aktív)`);
    warnings++;
  }
} else {
  ok(`DEV_ADMIN_BYPASS=${bypass || "false"}`);
}

head("Opcionális integrációk");
const optional = [
  { key: "DEEPL_API_KEY", purpose: "Admin LocalizedField HU→EN/ZH gomb" },
  { key: "CLOUDINARY_URL", purpose: "Image hosting + auto WebP/AVIF" },
  { key: "VITE_CLOUDINARY_CLOUD_NAME", purpose: "Browser-side Cloudinary képek" },
  { key: "RESEND_API_KEY", purpose: "Tranzakciós email — contact + audit lead értesítés" },
  { key: "BUILT_IN_FORGE_API_KEY", purpose: "AI tartalom-generátor (Manus Forge)" },
  { key: "OPENAI_API_KEY", purpose: "Admin AI asszisztens — blog draft, SEO meta (gpt-4o-mini default)" },
  { key: "VITE_CALENDLY_URL", purpose: "Időpontfoglalás widget (kapcsolat oldal + audit thank-you)" },
  { key: "VITE_PLAUSIBLE_DOMAIN", purpose: "Plausible analytics (cookie-free, GDPR-clean)" },
];
for (const { key, purpose } of optional) {
  if (isFilled(key)) ok(`${key} ${C.gray}— ${purpose}${C.reset}`);
  else console.log(`  ${C.gray}·${C.reset} ${C.gray}${key} (üres) — ${purpose} nem fog működni${C.reset}`);
}

console.log("");
if (errors > 0) {
  console.log(`${C.red}${C.bold}✗ ${errors} hiba${C.reset}${warnings ? `, ${C.yellow}${warnings} figyelmeztetés${C.reset}` : ""}`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`${C.yellow}${C.bold}⚠ ${warnings} figyelmeztetés${C.reset} ${C.gray}(nem blokkoló)${C.reset}`);
  process.exit(0);
} else {
  console.log(`${C.green}${C.bold}✓ Minden rendben${C.reset}${isProd ? ` ${C.gray}(production-ready)${C.reset}` : ""}`);
  process.exit(0);
}
