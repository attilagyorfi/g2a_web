/**
 * Shared HTML email templates — welcome confirmation + weekly digest.
 *
 * Design language (refresh, May 2026):
 *   - Block-driven layout: each section is its own visually distinct card,
 *     either white-on-grey, grey-on-white, or inverted (white-on-near-black
 *     for emphasis bands). Mirrors the magazine / newsletter conventions
 *     in the inspiration set (red+black "Business" + purple "Marketing
 *     Consultancy" templates), but with the G2A teal as accent.
 *   - 2×2 topic grid in the welcome email — easier to scan than a stacked
 *     list, no wasted vertical real estate.
 *   - Alternating row background in the digest — light / white striping
 *     gives each article its own breathing room and a clear "block" feel.
 *   - Bold dark header band + bold dark CTA band at the end, with the
 *     accent teal pill sitting on the dark fill. Echoes the inspiration's
 *     strong colour blocking.
 *
 * Email-rendering constraints these templates still respect:
 *   - Inline CSS only (Gmail strips <style> blocks)
 *   - Max width 600px (industry convention)
 *   - Web-safe font fallbacks (-apple-system → Segoe → Arial)
 *   - Tables for column layout (Outlook's Word engine)
 *   - No external CSS / no @media — Outlook ignores them anyway
 *   - Mandatory one-click unsubscribe link in the footer
 */

const BRAND_TEAL = "#14B8A6";
const BRAND_TEAL_DARK = "#0d9488";
const BRAND_DARK = "#0a0a0a";
const BRAND_DARK_PANEL = "#161616";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#475569";
const TEXT_MUTED = "#94a3b8";
const BG_PAGE = "#eef2f6";
const BG_SUBTLE = "#f8fafc";
const BORDER = "#e2e8f0";

const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const FONT_MONO =
  "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', Courier, monospace";

/** Outer wrapper. The dark grey page background gives the white email card
 *  visible borders in clients that render emails edge-to-edge. */
function wrapper(inner: string, preheader: string): string {
  const preheaderHtml = `
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
      ${escapeHtml(preheader)}
    </div>`;
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:${BG_PAGE};font-family:${FONT_SANS};color:${TEXT_PRIMARY};-webkit-font-smoothing:antialiased">
  ${preheaderHtml}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_PAGE};padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(15,23,42,0.07)">
          <tr><td>${inner}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Dark header band — wordmark + tag chip. */
function darkHeader(opts: { tag?: string; secondaryLine?: string }): string {
  const tag = opts.tag
    ? `<div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.2em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:10px">${escapeHtml(opts.tag)}</div>`
    : "";
  const secondary = opts.secondaryLine
    ? `<div style="font-size:12px;color:#94a3b8;margin-top:6px;font-family:${FONT_MONO};letter-spacing:0.04em">${escapeHtml(opts.secondaryLine)}</div>`
    : "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK};border-bottom:3px solid ${BRAND_TEAL}">
      <tr>
        <td style="padding:28px 36px;color:#ffffff">
          ${tag}
          <div style="font-size:20px;font-weight:800;letter-spacing:-0.01em">G2A Marketing</div>
          ${secondary}
        </td>
      </tr>
    </table>`;
}

/** Standard footer with impressum + unsubscribe link. */
function footer(unsubscribeUrl: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK};color:#94a3b8">
      <tr>
        <td style="padding:28px 36px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-family:${FONT_MONO};font-size:11px;line-height:1.7;letter-spacing:0.04em;color:#cbd5e1">
                <strong style="color:#ffffff;font-size:13px">G2A Marketing Bt.</strong><br>
                7621 Pécs · info@g2amarketing.hu<br>
                <a href="https://g2amarketing.hu" style="color:#cbd5e1;text-decoration:none">g2amarketing.hu</a>
              </td>
              <td align="right" valign="top">
                <a href="https://www.linkedin.com/company/g2a-marketing/" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO};margin-right:14px">LinkedIn</a>
                <a href="https://www.facebook.com/g2amarketing" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO}">Facebook</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:22px;padding-top:16px;border-top:1px solid #1f2937;font-size:11px;color:#64748b;line-height:1.7">
            Ezt az emailt azért kaptad, mert feliratkoztál a g2amarketing.hu hírlevelére.<br>
            <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">Leiratkozás egy kattintással</a> · <a href="https://g2amarketing.hu/adatvedelmi-iranyelvek" style="color:#94a3b8;text-decoration:underline">Adatvédelmi tájékoztató</a>
          </div>
        </td>
      </tr>
    </table>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[c]!);
}

// ─── Welcome email ─────────────────────────────────────────────────────────

export type WelcomeEmailInput = {
  name?: string | null;
  unsubscribeUrl: string;
  /** Topics the subscriber picked — controls which cards we highlight.
   *  Empty array means "all" (footer band signup with no topic selector). */
  topics?: string[];
};

const TOPIC_CARDS: Record<
  string,
  { tag: string; title: string; desc: string; icon: string }
> = {
  strategy: {
    tag: "STRATÉGIA",
    title: "B2B marketing stratégia",
    desc: "Pozícionálás, ICP, brand-építés és go-to-market playbookok.",
    icon: "◆",
  },
  ai: {
    tag: "AI",
    title: "AI & automatizáció",
    desc: "AI workflow-k, prompt-receptek, kipróbált eszközök B2B kontextusban.",
    icon: "▲",
  },
  paid: {
    tag: "TELJESÍTMÉNY",
    title: "SEO & teljesítményhirdetés",
    desc: "Google Ads, Meta hirdetések, organikus SEO — mérhető eredményekkel.",
    icon: "●",
  },
  case_studies: {
    tag: "ESETTANULMÁNY",
    title: "Esettanulmányok & adatok",
    desc: "Anonim ügyfélprojektek valós számokkal — mi működött, mi nem.",
    icon: "■",
  },
};

/** Build a single 2-column row of topic cards. `gridGap` is achieved via
 *  cellspacing on the table; padding inside the cell handles vertical rhythm. */
function topicRow(keys: string[]): string {
  const cell = (key: string) => {
    const c = TOPIC_CARDS[key]!;
    return `
      <td width="50%" valign="top" style="padding:8px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
          <tr>
            <td style="padding:18px 18px 16px">
              <div style="font-family:${FONT_MONO};font-size:14px;color:${BRAND_TEAL};line-height:1;margin-bottom:10px">${c.icon}</div>
              <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL_DARK};text-transform:uppercase;margin-bottom:6px;font-weight:600">${c.tag}</div>
              <div style="font-size:15px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:6px;line-height:1.35">${c.title}</div>
              <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.55">${c.desc}</div>
            </td>
          </tr>
        </table>
      </td>`;
  };
  // Always two cells per row; pad with an invisible cell if odd
  const second = keys[1] ? cell(keys[1]) : '<td width="50%"></td>';
  return `
    <tr>
      ${cell(keys[0])}
      ${second}
    </tr>`;
}

export function renderWelcomeEmailHtml(input: WelcomeEmailInput): string {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const activeTopics =
    input.topics && input.topics.length > 0
      ? input.topics.filter((t) => TOPIC_CARDS[t])
      : Object.keys(TOPIC_CARDS);

  // 2-column grid: pair up the cards into rows of 2
  const rows: string[] = [];
  for (let i = 0; i < activeTopics.length; i += 2) {
    rows.push(topicRow([activeTopics[i], activeTopics[i + 1]].filter(Boolean)));
  }

  const body = `
    ${darkHeader({ tag: "Üdv a fedélzeten", secondaryLine: "Adatvezérelt marketing ügynökség · Pécs" })}

    <!-- Hero copy -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 24px">
          <h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
            Köszönjük, hogy feliratkoztál a hírlevelünkre. Heti maximum 1 email, péntek reggel — sose kéretlenül.
          </p>
        </td>
      </tr>
    </table>

    <!-- 2×2 topic grid -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 28px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:6px;padding:0 8px">Amit kapni fogsz</div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 28px">
      ${rows.join("")}
    </table>

    <!-- Dark CTA block -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:24px 28px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:10px;font-weight:600">Következő lépés</div>
                <div style="font-size:17px;line-height:1.4;color:#ffffff;font-weight:700;margin-bottom:8px">Nézz körül a blogunkban</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;margin-bottom:18px">Friss tartalom hetente — gyakorlati B2B és AI témákban, magyar piaci példákkal.</div>
                <a href="https://g2amarketing.hu/hirek" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:11px 22px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">OLVASS BE A BLOGUNKBA →</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Personal note -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 36px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:18px 22px">
                <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">
                  <strong style="color:${TEXT_PRIMARY}">Kérdésed van?</strong> Válaszolj erre az emailre — átolvassuk és válaszolunk személyesen. Ha konkrét marketing kihíváson dolgozol, jelezd — gyakran egy 15 perces beszélgetés is sokat tisztáz.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${footer(input.unsubscribeUrl)}
  `;

  return wrapper(body, "Üdv a G2A Marketing fedélzetén — mit várhatsz a hírlevelünktől.");
}

// ─── Weekly digest / sample newsletter ──────────────────────────────────────

export type DigestArticle = {
  topic: keyof typeof TOPIC_CARDS;
  title: string;
  excerpt: string;
  url: string;
  /** Optional reading-time minutes. Hidden if absent. */
  readMin?: number;
};

export type DigestEmailInput = {
  name?: string | null;
  /** Greeting line under the heading — overrides the default lead. */
  intro?: string;
  /** Week number or date label shown in the header tag. */
  weekLabel: string;
  articles: DigestArticle[];
  unsubscribeUrl: string;
};

/** Render one article block. Alternating background (white / subtle grey) for
 *  the "blokk" visual rhythm the inspiration designs lean on. Each block has a
 *  big topic chip on top, large headline, excerpt, and a CTA row. */
function digestArticleBlock(a: DigestArticle, index: number): string {
  const card = TOPIC_CARDS[a.topic];
  const tag = card?.tag || a.topic.toUpperCase();
  const icon = card?.icon || "◆";
  const isAlt = index % 2 === 1;
  const bg = isAlt ? BG_SUBTLE : "#ffffff";
  const num = String(index + 1).padStart(2, "0");

  const readChip = a.readMin
    ? `<span style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};margin-left:14px">· ${a.readMin} perc olvasás</span>`
    : "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg}">
      <tr>
        <td style="padding:32px 36px">

          <!-- Tag row: topic chip + article number -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td>
                <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:4px">
                  <span style="color:${BRAND_TEAL}">${icon}</span> &nbsp;${tag}
                </span>
              </td>
              <td align="right" style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em">
                ${num} / 04
              </td>
            </tr>
          </table>

          <!-- Headline -->
          <h2 style="margin:16px 0 12px;font-size:22px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">
            <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none">${escapeHtml(a.title)}</a>
          </h2>

          <!-- Excerpt -->
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(a.excerpt)}</p>

          <!-- CTA row -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="${a.url}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;padding:9px 18px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">OLVASD EL →</a>
              </td>
              <td valign="middle" style="padding-left:8px">${readChip}</td>
            </tr>
          </table>

        </td>
      </tr>
    </table>`;
}

export function renderDigestEmailHtml(input: DigestEmailInput): string {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const intro =
    input.intro ||
    "Itt a heti gyakorlati B2B és AI marketing válogatás — egy cikk minden témakörből, 5-10 perces olvasmányok.";

  const articleBlocks = input.articles
    .map((a, i) => digestArticleBlock(a, i))
    .join('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:' + BORDER + '"></td></tr></table>');

  const body = `
    ${darkHeader({ tag: input.weekLabel, secondaryLine: "Heti válogatás" })}

    <!-- Greeting -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:36px 36px 8px">
          <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(intro)}</p>
        </td>
      </tr>
    </table>

    <!-- Top divider with brand colour -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:0 36px"><div style="height:3px;background:${BRAND_TEAL};border-radius:2px"></div></td></tr>
    </table>

    <!-- Articles with alternating row backgrounds -->
    ${articleBlocks}

    <!-- Reply callout -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 36px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px;font-weight:600">Mit gondolsz?</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1">
                  Hasznos volt? Válaszolj erre az emailre egyetlen mondattal — átolvassuk és válaszolunk. Konkrét marketing kérdésed van? <a href="https://g2amarketing.hu/kapcsolat" style="color:${BRAND_TEAL};text-decoration:none;font-weight:600">Vedd fel velünk a kapcsolatot →</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${footer(input.unsubscribeUrl)}
  `;

  return wrapper(body, intro);
}
