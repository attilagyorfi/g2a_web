/**
 * Sends a sample weekly-digest email so you can preview the design and
 * editorial format before publishing the real Friday send. Pulls 4 real
 * articles from the DB (one per topic) and renders them with the same
 * `renderDigestEmailHtml` template the production cron will use.
 *
 * Usage:
 *   node scripts/send-test-newsletter.mjs                            # to RESEND_NOTIFY_EMAIL
 *   node scripts/send-test-newsletter.mjs --to=93attilagyorfi@gmail.com
 *   node scripts/send-test-newsletter.mjs --welcome                  # send welcome email instead of digest
 *
 * Requires RESEND_API_KEY + RESEND_FROM_EMAIL in .env.
 */
import "dotenv/config";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Run this script with tsx so it can import the TS email templates directly:
//   npx tsx scripts/send-test-newsletter.mjs --to=...
// Plain `node scripts/...` fails because Node 20+ deprecated the loader API
// the tsx programmatic `register()` shim relies on.
const {
  renderDigestEmailHtml,
  renderWelcomeEmailHtml,
  renderConfirmationEmailHtml,
  CONFIRMATION_SUBJECTS,
} = await import(pathToFileURL(join(ROOT, "server", "_core", "emailTemplates.ts")).href);

// ─── CLI ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.some((a) => a === `--${name}`);
const val = (name) => {
  const a = argv.find((a) => a.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : null;
};
const TO = val("to") || process.env.RESEND_NOTIFY_EMAIL || "93attilagyorfi@gmail.com";
const MODE = flag("welcome")
  ? "welcome"
  : flag("audit")
  ? "audit"
  : flag("contact")
  ? "contact"
  : "digest";

// ─── Article picks per topic ──────────────────────────────────────────────
const TOPIC_TO_SLUG = {
  strategy: "miert-bukik-el-a-legtobb-marketingkampany",
  ai: "ai-a-marketingben-hatekonysag-vagy-onamitas",
  paid: "miert-eg-el-a-marketingbudzse-meres-nelkul",
  case_studies: "marketing-ugynokseg-vs-belsos-marketinges",
};

// ─── DB ───────────────────────────────────────────────────────────────────
async function fetchArticles() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
  const u = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: parseInt(u.port),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    ssl: { minVersion: "TLSv1.2" },
  });
  const slugs = Object.values(TOPIC_TO_SLUG);
  const [rows] = await conn.execute(
    `SELECT slug, title, excerpt, content FROM posts WHERE slug IN (${slugs.map(() => "?").join(",")})`,
    slugs,
  );
  await conn.end();
  return rows;
}

/** Strip HTML and trim to a sentence-ish length suitable for the digest card. */
function shortenExcerpt(html, maxLen = 160) {
  const text = (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastPeriod = cut.lastIndexOf(".");
  return (lastPeriod > maxLen - 50 ? cut.slice(0, lastPeriod + 1) : cut.trimEnd() + "…");
}

function estimateReadingMin(html) {
  const words = (html || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Resend ────────────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY required");
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log(`[test-newsletter] Mode: ${MODE} → ${TO}`);
  const unsubscribeUrl = "https://g2a-web.vercel.app/api/newsletter/unsubscribe?token=TESZT-EMAIL-NEM-VALID";

  if (MODE === "audit") {
    const html = renderConfirmationEmailHtml({
      name: "Attila",
      formType: "audit",
      submission: [
        { label: "Email", value: TO },
        { label: "Telefon", value: "+36 30 190 2575" },
        { label: "Cég", value: "G2A Marketing Bt." },
        { label: "Weboldal", value: "https://g2amarketing.hu" },
        { label: "Havi büdzsé", value: "500e - 1M Ft" },
        { label: "Kihívások", value: "Az új weboldal konverziós ratesét szeretném javítani — jelenleg túl alacsony." },
        { label: "Célok", value: "+30% organikus forgalom 6 hónap alatt." },
      ],
    });
    const result = await sendEmail({
      to: TO,
      subject: CONFIRMATION_SUBJECTS.audit + " [TESZT]",
      html,
      text: "Audit kérés visszaigazolás (HTML email).",
    });
    console.log(`✔ Audit confirmation email sent. Resend ID: ${result.id}`);
    return;
  }

  if (MODE === "contact") {
    const html = renderConfirmationEmailHtml({
      name: "Attila",
      formType: "contact",
      submission: [
        { label: "Email", value: TO },
        { label: "Telefon", value: "+36 30 190 2575" },
        { label: "Tárgy", value: "Marketing tanácsadás iránti érdeklődés" },
        { label: "Szolgáltatás", value: "ai-marketing" },
        { label: "Üzenet", value: "Szeretném tudni, hogyan tudnátok segíteni a B2B leadgenerálásban — különösen LinkedIn ABM-en." },
      ],
    });
    const result = await sendEmail({
      to: TO,
      subject: CONFIRMATION_SUBJECTS.contact + " [TESZT]",
      html,
      text: "Kapcsolatfelvétel visszaigazolás (HTML email).",
    });
    console.log(`✔ Contact confirmation email sent. Resend ID: ${result.id}`);
    return;
  }

  if (MODE === "welcome") {
    const html = renderWelcomeEmailHtml({
      name: "Attila",
      unsubscribeUrl,
      topics: ["strategy", "ai", "paid", "case_studies"],
    });
    const result = await sendEmail({
      to: TO,
      subject: "Üdv a G2A Marketing hírlevelében! [TESZT]",
      html,
      text: `Szia Attila!\n\nKöszönjük, hogy feliratkoztál a G2A Marketing hírlevelére. Heti maximum 1 email, péntek reggel — sose kéretlenül.\n\nLeiratkozás: ${unsubscribeUrl}`,
    });
    console.log(`✔ Welcome email sent. Resend ID: ${result.id}`);
    return;
  }

  // Digest mode
  const rows = await fetchArticles();
  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));
  const articles = Object.entries(TOPIC_TO_SLUG)
    .map(([topic, slug]) => {
      const p = bySlug[slug];
      if (!p) return null;
      return {
        topic,
        title: p.title,
        excerpt: shortenExcerpt(p.excerpt || p.content),
        url: `https://g2a-web.vercel.app/hirek/${slug}`,
        readMin: estimateReadingMin(p.content),
      };
    })
    .filter(Boolean);

  if (articles.length === 0) {
    console.error("No articles found for the configured slugs. DB content may be missing.");
    process.exit(1);
  }

  const html = renderDigestEmailHtml({
    name: "Attila",
    weekLabel: `2026 — ${new Date().toLocaleDateString("hu-HU", { month: "long", day: "numeric" })}`,
    intro:
      "Itt egy minta hét — ezt fogod kapni péntek reggelente, ha mind a négy témára feliratkoztál. Egy cikk mindegyik témakörből, 5-10 perces olvasmányok.",
    articles,
    unsubscribeUrl,
  });

  const text = articles
    .map((a) => `[${a.topic.toUpperCase()}] ${a.title}\n${a.url}\n${a.excerpt}\n`)
    .join("\n");

  const result = await sendEmail({
    to: TO,
    subject: "[TESZT] G2A Heti válogatás — minta hírlevél a 4 témára",
    html,
    text,
  });
  console.log(`✔ Digest email sent (${articles.length} articles). Resend ID: ${result.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
