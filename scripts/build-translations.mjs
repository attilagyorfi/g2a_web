/**
 * Translates the title + description of every prerendered route from HU to
 * EN and ZH via DeepL, caching results in `scripts/prerender-translations.json`.
 *
 * Idempotent: rerunning only translates entries whose HU source has changed
 * (keyed by `path` + content hash). The build picks up the JSON to inject
 * EN/ZH meta into the per-locale prerendered HTMLs.
 *
 * Run:
 *   node scripts/build-translations.mjs            # translate any new/changed routes
 *   node scripts/build-translations.mjs --force    # retranslate everything
 *
 * Requires DEEPL_API_KEY in env.
 *
 * Cost on the free tier:
 *   32 routes × (title + description) × 2 langs ≈ 12 000 characters total
 *   Free tier: 500 000 / month  →  ~2.4% of monthly quota
 */
import "dotenv/config";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { allRoutes } from "./prerender-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = join(__dirname, "prerender-translations.json");
const FORCE = process.argv.includes("--force");

const DEEPL_FREE_HOST = "https://api-free.deepl.com/v2/translate";
const DEEPL_PRO_HOST = "https://api.deepl.com/v2/translate";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function deepl(text, target, attempt = 1) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY required");
  if (!text || !text.trim()) return "";

  const host = key.endsWith(":fx") ? DEEPL_FREE_HOST : DEEPL_PRO_HOST;
  const body = new URLSearchParams();
  body.set("text", text.trim());
  body.set("source_lang", "HU");
  body.set("target_lang", target === "zh" ? "ZH" : "EN-US");
  body.set("preserve_formatting", "1");

  const res = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  if (res.status === 429 && attempt <= 5) {
    // Exponential back-off on rate limit — DeepL's free tier is twitchy
    const wait = 2000 * attempt;
    console.warn(`[deepl] 429, backing off ${wait}ms (attempt ${attempt})`);
    await sleep(wait);
    return deepl(text, target, attempt + 1);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`DeepL ${res.status}: ${t.slice(0, 200) || res.statusText}`);
  }
  const data = await res.json();
  // 250ms gentle pacing between successful calls so we don't trigger the
  // rate limiter on the next one.
  await sleep(250);
  return data.translations?.[0]?.text ?? "";
}

function contentHash(route) {
  return createHash("sha1")
    .update(`${route.path}\n${route.title}\n${route.description}\n${route.ogTitle || ""}`)
    .digest("hex")
    .slice(0, 16);
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf8");
}

async function main() {
  const routes = allRoutes();
  const cache = FORCE ? {} : loadCache();
  let translated = 0;
  let skipped = 0;

  for (const route of routes) {
    const hash = contentHash(route);
    const existing = cache[route.path];
    if (existing && existing.hash === hash && existing.en && existing.zh) {
      skipped++;
      continue;
    }
    console.log(`[translate] ${route.path}`);
    // Sequential rather than Promise.all — DeepL free tier rate-limits hard
    // (429s with 6 concurrent calls), and ~12k chars total is small enough
    // that sequential adds maybe 30 seconds total runtime.
    const enTitle = await deepl(route.title, "en");
    const zhTitle = await deepl(route.title, "zh");
    const enDesc = await deepl(route.description, "en");
    const zhDesc = await deepl(route.description, "zh");
    const enOgTitle = route.ogTitle ? await deepl(route.ogTitle, "en") : "";
    const zhOgTitle = route.ogTitle ? await deepl(route.ogTitle, "zh") : "";

    cache[route.path] = {
      hash,
      en: { title: enTitle, description: enDesc, ogTitle: enOgTitle || undefined },
      zh: { title: zhTitle, description: zhDesc, ogTitle: zhOgTitle || undefined },
    };
    translated++;
    // Save after every successful translation so a mid-run failure doesn't
    // throw away progress.
    saveCache(cache);
  }

  console.log(`\n✔ Done. Translated ${translated}, cache-hit ${skipped}. Output: ${CACHE_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
