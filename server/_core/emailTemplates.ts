/**
 * Shared HTML email templates — welcome confirmation + weekly digest.
 *
 * Email-rendering constraints these templates respect:
 *   - Inline CSS only (Gmail strips <style> blocks)
 *   - Max width 600px (industry convention; Outlook breaks above)
 *   - Web-safe font fallbacks (-apple-system → Segoe → Arial); no Geist
 *   - No external CSS / no @media (Outlook ignores everything anyway)
 *   - Tables for layout where alignment matters (Outlook's Word engine)
 *   - Every email includes a one-click unsubscribe link in the footer
 *     (GDPR + ePrivacy + Eker. tv. + Resend deliverability)
 *
 * Style is intentionally restrained: white body, brand teal (#14B8A6) used
 * as an accent only. No background images — they get blocked or render
 * oddly on Outlook desktop. Visual interest comes from typography rhythm,
 * inline tags, and a generous content hierarchy.
 */

const BRAND_TEAL = "#14B8A6";
const BRAND_DARK = "#0a0a0a";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#475569";
const TEXT_MUTED = "#94a3b8";
const BG_SUBTLE = "#f8fafc";
const BORDER = "#e5e7eb";

const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const FONT_MONO =
  "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', Courier, monospace";

/** Light-grey wrapper around the white card — gives the email a bit of
 *  visual depth in clients that show emails on a coloured background. */
function wrapper(inner: string, preheader: string): string {
  // Preheader = the small grey snippet inbox previews show next to the subject.
  // Hidden visually but visible to the client's preview pane.
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
<body style="margin:0;padding:0;background:${BG_SUBTLE};font-family:${FONT_SANS};color:${TEXT_PRIMARY}">
  ${preheaderHtml}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,0.06)">
          <tr><td>${inner}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Header band — dark with the G2A wordmark and an optional tag. */
function header(opts: { tag?: string }): string {
  const tag = opts.tag
    ? `<div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px">${escapeHtml(opts.tag)}</div>`
    : "";
  return `
    <div style="background:${BRAND_DARK};padding:28px 32px;color:#ffffff">
      ${tag}
      <div style="font-size:18px;font-weight:700;letter-spacing:0.02em">G2A Marketing</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px">Adatvezérelt marketing ügynökség · Pécs</div>
    </div>`;
}

/** Standard footer with impressum + unsubscribe link. */
function footer(unsubscribeUrl: string): string {
  return `
    <div style="padding:24px 32px;border-top:1px solid ${BORDER};background:${BG_SUBTLE}">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.04em;line-height:1.6">
            <strong style="color:${TEXT_SECONDARY}">G2A Marketing Bt.</strong><br>
            7621 Pécs · info@g2amarketing.hu<br>
            <a href="https://g2amarketing.hu" style="color:${TEXT_MUTED};text-decoration:none">g2amarketing.hu</a>
          </td>
          <td align="right" valign="top">
            <a href="https://www.linkedin.com/company/g2a-marketing/" style="text-decoration:none;color:${TEXT_MUTED};font-size:11px;font-family:${FONT_MONO};margin-right:12px">LinkedIn</a>
            <a href="https://www.facebook.com/g2amarketing" style="text-decoration:none;color:${TEXT_MUTED};font-size:11px;font-family:${FONT_MONO}">Facebook</a>
          </td>
        </tr>
      </table>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid ${BORDER};font-size:11px;color:${TEXT_MUTED};line-height:1.6">
        Ezt az emailt azért kaptad, mert feliratkoztál a g2amarketing.hu hírlevelére.<br>
        <a href="${unsubscribeUrl}" style="color:${TEXT_MUTED};text-decoration:underline">Leiratkozás egy kattintással</a> · <a href="https://g2amarketing.hu/adatvedelmi-iranyelvek" style="color:${TEXT_MUTED};text-decoration:underline">Adatvédelmi tájékoztató</a>
      </div>
    </div>`;
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
  /** Topics the subscriber picked — controls which cards we highlight. Empty
   *  array means "all" (footer band signup with no topic selector). */
  topics?: string[];
};

const TOPIC_CARDS: Record<string, { tag: string; title: string; desc: string }> = {
  strategy: {
    tag: "STRATÉGIA",
    title: "B2B marketing stratégia",
    desc: "Pozícionálás, ICP-meghatározás, brand-építés, go-to-market — mély playbookok hetente.",
  },
  ai: {
    tag: "AI",
    title: "AI & automatizáció",
    desc: "Konkrét AI workflow-k, prompt-receptek, kipróbált eszközök magyar B2B kontextusban.",
  },
  paid: {
    tag: "TELJESÍTMÉNY",
    title: "SEO & teljesítményhirdetés",
    desc: "Google Ads, Meta hirdetések, organikus SEO — mérhető eredményekkel, nem találgatás.",
  },
  case_studies: {
    tag: "ESETTANULMÁNY",
    title: "Esettanulmányok & adatok",
    desc: "Anonim ügyfélprojektek, valós számokkal — mi működött és mi nem.",
  },
};

export function renderWelcomeEmailHtml(input: WelcomeEmailInput): string {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const activeTopics =
    input.topics && input.topics.length > 0
      ? input.topics.filter((t) => TOPIC_CARDS[t])
      : Object.keys(TOPIC_CARDS);

  const cards = activeTopics
    .map((key) => {
      const c = TOPIC_CARDS[key]!;
      return `
      <tr>
        <td style="padding:18px 20px;border:1px solid ${BORDER};border-radius:10px;background:#ffffff">
          <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.16em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:6px">${c.tag}</div>
          <div style="font-size:15px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:6px">${c.title}</div>
          <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.55">${c.desc}</div>
        </td>
      </tr>
      <tr><td style="height:10px"></td></tr>`;
    })
    .join("");

  const body = `
    ${header({ tag: "Üdvözöllek a fedélzeten" })}

    <div style="padding:36px 32px 8px">
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">${greeting}</h1>
      <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
        Köszönjük, hogy feliratkoztál a hírlevelünkre. Heti maximum 1 email, péntek reggel — sose kéretlenül.
      </p>
    </div>

    <div style="padding:0 32px 28px">
      <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.14em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">Amit kapni fogsz</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${cards}
      </table>
    </div>

    <div style="padding:0 32px 32px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:${TEXT_PRIMARY};border-radius:10px;padding:22px 24px">
            <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.16em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px">Következő lépés</div>
            <div style="font-size:15px;line-height:1.55;color:#ffffff;margin-bottom:14px">
              Nézz körül a blogunkban, ha van időd. Friss tartalom hetente, gyakorlati B2B és AI témákban.
            </div>
            <a href="https://g2amarketing.hu/hirek" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.04em">Olvass be a blogunkba →</a>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding:0 32px 28px;font-size:13px;line-height:1.65;color:${TEXT_SECONDARY}">
      Ha van bármilyen kérdésed vagy egy konkrét marketing kihíváson dolgozol, válaszolj erre az emailre — átolvassuk és válaszolunk személyesen.
    </div>

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
  /** Display name for the recipient. */
  name?: string | null;
  /** Greeting line under the heading — "Itt a héten nálunk" stb. */
  intro?: string;
  /** Week number or date label shown in the header tag. */
  weekLabel: string;
  articles: DigestArticle[];
  unsubscribeUrl: string;
};

export function renderDigestEmailHtml(input: DigestEmailInput): string {
  const greeting = input.name ? `Szia ${escapeHtml(input.name)}!` : "Szia!";
  const intro =
    input.intro ||
    "Itt van a heti gyakorlati B2B és AI marketing válogatásunk — minden cikk 5-10 perces olvasmány.";

  const articles = input.articles
    .map((a, i) => {
      const card = TOPIC_CARDS[a.topic];
      const tag = card?.tag || a.topic.toUpperCase();
      const readChip = a.readMin
        ? `<span style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED}">${a.readMin} perc olvasás</span>`
        : "";
      return `
        ${i === 0 ? "" : `<tr><td style="padding:0 32px"><div style="height:1px;background:${BORDER};margin:24px 0"></div></td></tr>`}
        <tr>
          <td style="padding:${i === 0 ? "8px" : "0"} 32px 0">
            <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.16em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:10px">${tag}</div>
            <h2 style="margin:0 0 10px;font-size:19px;line-height:1.3;color:${TEXT_PRIMARY};font-weight:700;letter-spacing:-0.01em">
              <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none">${escapeHtml(a.title)}</a>
            </h2>
            <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(a.excerpt)}</p>
            <div style="margin-bottom:6px">
              <a href="${a.url}" style="font-size:13px;color:${BRAND_TEAL};text-decoration:none;font-weight:600">Olvasd el →</a>
              ${readChip ? ` &nbsp;·&nbsp; ${readChip}` : ""}
            </div>
          </td>
        </tr>`;
    })
    .join("");

  const body = `
    ${header({ tag: input.weekLabel })}

    <div style="padding:32px 32px 12px">
      <h1 style="margin:0 0 8px;font-size:24px;line-height:1.3;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">${greeting}</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(intro)}</p>
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${articles}
    </table>

    <div style="padding:28px 32px 0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px;padding:18px 22px">
            <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.16em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:6px">Mit gondolsz?</div>
            <div style="font-size:14px;line-height:1.6;color:${TEXT_SECONDARY}">
              Hasznos volt? Válaszolj erre az emailre egyetlen mondattal — látjuk és válaszolunk. Ha konkrét marketing kérdésed van,
              <a href="https://g2amarketing.hu/kapcsolat" style="color:${BRAND_TEAL};text-decoration:none">vedd fel velünk a kapcsolatot</a>.
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div style="height:32px"></div>

    ${footer(input.unsubscribeUrl)}
  `;

  return wrapper(body, intro);
}
