/**
 * Shared HTML email templates — welcome, confirmation (contact/audit/career),
 * and the weekly digest.
 *
 * Copy is trilingual (hu / en / zh): the visitor's language is resolved at the
 * call site and threaded in as `lang`, so a Chinese lead who signs up on the
 * /zh/ site gets a Chinese welcome, not a Hungarian one.
 *
 * Voice (per the client-approved copy, "G2A hírlevél szövegezés"): warm but
 * professional, company "we" voice (not a personal note), Hungarian is tegező,
 * greeting "Kedves {name}!". We position as a strategic PARTNER, sign off with
 * "Stratégia. Technológia. Mérhető eredmények." No guaranteed results, no
 * emoji, no ChatGPT-style scaffolding.
 *
 * Email-rendering constraints these templates respect:
 *   - Inline CSS only (Gmail strips <style> blocks)
 *   - Max width 600px (industry convention)
 *   - Web-safe font fallbacks (-apple-system → Segoe → Arial)
 *   - Tables for column layout (Outlook's Word engine)
 *   - No external CSS / no @media — Outlook ignores them anyway
 *   - Mandatory one-click unsubscribe link in the footer
 */

export type Lang = "hu" | "en" | "zh";

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

/** Normalise any incoming string to a supported language, defaulting to hu. */
export function toLang(value: string | null | undefined): Lang {
  return value === "en" || value === "zh" ? value : "hu";
}

// ─── Shared UI chrome copy ──────────────────────────────────────────────────

const UI = {
  hu: {
    partnerLine: "Stratégia. Technológia. Mérhető eredmények.",
    signOff: "Üdvözlettel,",
    signName: "Győrfi Attila",
    tagline: "Stratégia. Technológia. Mérhető eredmények.",
    submittedLabel: "Amit elküldtél",
    nextLabel: "Mi következik",
    autoNote: "Ez az üzenet automatikusan készült, kérjük, ne válaszolj rá.",
    footerReason: "Ezt az emailt azért kaptad, mert feliratkoztál a g2amarketing.hu hírlevelére.",
    unsubscribe: "Leiratkozás egy kattintással",
    privacy: "Adatvédelmi tájékoztató",
  },
  en: {
    partnerLine: "Strategy. Technology. Measurable results.",
    signOff: "Best regards,",
    signName: "Attila Győrfi",
    tagline: "Strategy. Technology. Measurable results.",
    submittedLabel: "What you sent",
    nextLabel: "What happens next",
    autoNote: "This message was generated automatically — please don't reply to it.",
    footerReason: "You're getting this because you signed up for the g2amarketing.hu newsletter.",
    unsubscribe: "Unsubscribe in one click",
    privacy: "Privacy notice",
  },
  zh: {
    partnerLine: "战略。技术。可衡量的成果。",
    signOff: "顺颂商祺，",
    signName: "Győrfi Attila（久尔菲·阿蒂拉）",
    tagline: "战略。技术。可衡量的成果。",
    submittedLabel: "您提交的内容",
    nextLabel: "接下来会发生什么",
    autoNote: "本邮件为系统自动发送，请勿直接回复。",
    footerReason: "您收到这封邮件，是因为您订阅了 g2amarketing.hu 的通讯。",
    unsubscribe: "一键退订",
    privacy: "隐私说明",
  },
} satisfies Record<Lang, Record<string, string>>;

const PRIVACY_PATH = "/adatvedelmi-iranyelvek";
const SITE_HREF: Record<Lang, string> = {
  hu: "https://g2amarketing.hu",
  en: "https://g2amarketing.hu/en",
  zh: "https://g2amarketing.hu/zh",
};

/** Outer wrapper. The dark grey page background gives the white email card
 *  visible borders in clients that render emails edge-to-edge. */
function wrapper(inner: string, preheader: string, lang: Lang): string {
  const preheaderHtml = `
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
      ${escapeHtml(preheader)}
    </div>`;
  return `<!DOCTYPE html>
<html lang="${lang}">
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

/** Cloudinary-hosted G2A logo at email size (180px wide, 2× DPI = 360px source). */
const LOGO_URL =
  "https://res.cloudinary.com/dzh1unb6d/image/upload/f_auto,q_auto,w_360/g2a/og/default-logo.png";

/** Dark header band — logo + tag chip on dark background, 3px teal underline. */
function darkHeader(opts: { tag?: string; secondaryLine?: string }): string {
  const tag = opts.tag
    ? `<div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.2em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:14px;font-weight:600">${escapeHtml(opts.tag)}</div>`
    : "";
  const secondary = opts.secondaryLine
    ? `<div style="font-size:12px;color:#94a3b8;margin-top:8px;font-family:${FONT_MONO};letter-spacing:0.04em">${escapeHtml(opts.secondaryLine)}</div>`
    : "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK};border-bottom:3px solid ${BRAND_TEAL}">
      <tr>
        <td style="padding:28px 36px;color:#ffffff">
          ${tag}
          <img src="${LOGO_URL}" alt="G2A Marketing" width="180" height="auto" style="display:block;border:0;outline:none;text-decoration:none;width:180px;height:auto;max-width:180px">
          ${secondary}
        </td>
      </tr>
    </table>`;
}

/** Sign-off block — "Üdvözlettel, / Győrfi Attila / G2A Marketing" + tagline. */
function signature(lang: Lang): string {
  const t = UI[lang];
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 36px 36px">
          <div style="font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;margin-bottom:14px">${escapeHtml(t.signOff)}</div>
          <div style="display:inline-block;border-left:3px solid ${BRAND_TEAL};padding-left:14px">
            <div style="font-size:16px;font-weight:700;color:${TEXT_PRIMARY};letter-spacing:-0.01em">${escapeHtml(t.signName)}</div>
            <div style="font-size:12px;color:${TEXT_MUTED};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:3px">G2A Marketing</div>
            <div style="font-size:11px;color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:6px">${escapeHtml(t.tagline)}</div>
          </div>
        </td>
      </tr>
    </table>`;
}

/** Muted "this is an automated message, don't reply" strip (career email). */
function autoNoteBlock(lang: Lang): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 36px 24px">
          <div style="font-size:12px;color:${TEXT_MUTED};line-height:1.6;font-style:italic">${escapeHtml(UI[lang].autoNote)}</div>
        </td>
      </tr>
    </table>`;
}

/** Standard footer with impressum + unsubscribe link. */
function footer(unsubscribeUrl: string, lang: Lang): string {
  const t = UI[lang];
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
                <a href="https://www.instagram.com/g2amarketingagency/" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO};margin-right:14px">Instagram</a>
                <a href="https://www.facebook.com/g2amarketing" style="text-decoration:none;color:#cbd5e1;font-size:11px;font-family:${FONT_MONO}">Facebook</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:22px;padding-top:16px;border-top:1px solid #1f2937;font-size:11px;color:#64748b;line-height:1.7">
            ${escapeHtml(t.footerReason)}<br>
            <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">${escapeHtml(t.unsubscribe)}</a> · <a href="https://g2amarketing.hu${PRIVACY_PATH}" style="color:#94a3b8;text-decoration:underline">${escapeHtml(t.privacy)}</a>
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
  /** Kept for API compatibility with the newsletter router; no longer used to
   *  branch the layout (the approved copy uses a single fixed "what to expect"
   *  list rather than per-topic cards). */
  topics?: string[];
  lang?: Lang;
};

const WELCOME_COPY: Record<Lang, {
  headerTag: string;
  greeting: (name?: string) => string;
  lead: string;
  expectLabel: string;
  expectItems: string[];
  statement: string;
  comingSoon: string;
  ctaButton: string;
  preheader: string;
}> = {
  hu: {
    headerTag: "Üdvözlünk a fedélzeten",
    greeting: (name) => (name ? `Kedves ${name}!` : "Kedves Feliratkozó!"),
    lead: "Köszönjük, hogy feliratkoztál a G2A Marketing hírlevelére. Mostantól rendszeresen küldünk számodra olyan marketinghíreket, gyakorlati megoldásokat és szakmai elemzéseket, amelyek segítenek tudatosabban fejleszteni vállalkozásod online jelenlétét.",
    expectLabel: "Mire számíthatsz tőlünk?",
    expectItems: [
      "Aktuális marketing- és technológiai trendek",
      "Azonnal alkalmazható gyakorlati tippek",
      "Kampány-, weboldal- és tartalommarketing-megoldások",
      "Mesterséges intelligenciával támogatott marketingmódszerek",
      "Valódi üzleti tapasztalatok és tanulságok",
    ],
    statement: "Nem hiszünk a felesleges körökben és az öncélú marketingben. Olyan információkat küldünk, amelyeknek üzleti értékük van, és amelyekből valódi döntések születhetnek.",
    comingSoon: "Hamarosan érkezik az első levelünk.",
    ctaButton: "WEBOLDAL MEGTEKINTÉSE →",
    preheader: "Köszönjük a feliratkozást — röviden arról, mire számíthatsz tőlünk.",
  },
  en: {
    headerTag: "Welcome aboard",
    greeting: (name) => (name ? `Hello ${name}!` : "Hello!"),
    lead: "Thank you for subscribing to the G2A Marketing newsletter. From now on we'll regularly send you marketing news, practical solutions and professional analysis that help you grow your business's online presence more deliberately.",
    expectLabel: "What to expect from us",
    expectItems: [
      "Current marketing and technology trends",
      "Practical tips you can apply right away",
      "Campaign, website and content-marketing solutions",
      "AI-supported marketing methods",
      "Real business experience and lessons learned",
    ],
    statement: "We don't believe in wasted effort or marketing for its own sake. We send information that carries business value — the kind you can base real decisions on.",
    comingSoon: "Your first proper issue is on its way.",
    ctaButton: "VISIT THE WEBSITE →",
    preheader: "Thanks for subscribing — a quick note on what to expect from us.",
  },
  zh: {
    headerTag: "欢迎加入",
    greeting: (name) => (name ? `${name}，您好！` : "您好！"),
    lead: "感谢您订阅 G2A Marketing 通讯。从现在起，我们会定期为您发送营销资讯、实用方案和专业分析，帮助您更有意识地提升企业的线上表现。",
    expectLabel: "您可以期待",
    expectItems: [
      "最新的营销与技术趋势",
      "可立即上手的实用技巧",
      "推广、网站与内容营销方案",
      "由人工智能支持的营销方法",
      "真实的商业经验与启示",
    ],
    statement: "我们不做无谓的花样，也不做为营销而营销的事。我们发送的，是有商业价值、能支撑真实决策的信息。",
    comingSoon: "第一封正式邮件很快就会送达。",
    ctaButton: "浏览网站 →",
    preheader: "感谢订阅——简单说说您可以期待什么。",
  },
};

/** One "what to expect" list item with a teal check mark. */
function expectRow(text: string, last: boolean): string {
  return `
    <tr>
      <td valign="top" style="width:26px;padding:7px 10px 7px 0;color:${BRAND_TEAL};font-size:15px;line-height:1.5">✓</td>
      <td style="padding:7px 0;font-size:14.5px;color:${TEXT_PRIMARY};line-height:1.5;border-bottom:${last ? "none" : `1px solid ${BORDER}`}">${escapeHtml(text)}</td>
    </tr>`;
}

export function renderWelcomeEmailHtml(input: WelcomeEmailInput): string {
  const lang = input.lang ?? "hu";
  const copy = WELCOME_COPY[lang];
  const greeting = copy.greeting(input.name ? escapeHtml(input.name) : undefined);
  const items = copy.expectItems
    .map((it, i) => expectRow(it, i === copy.expectItems.length - 1))
    .join("");

  const body = `
    ${darkHeader({ tag: copy.headerTag, secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(copy.lead)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:28px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:12px">${escapeHtml(copy.expectLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:8px 20px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${items}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-size:14.5px;line-height:1.65;color:#e2e8f0">${escapeHtml(copy.statement)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 4px">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY}">${escapeHtml(copy.comingSoon)}</p>
          <a href="${SITE_HREF[lang]}" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${escapeHtml(copy.ctaButton)}</a>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;

  return wrapper(body, copy.preheader, lang);
}

// ─── Weekly digest / sample newsletter ──────────────────────────────────────

export type DigestArticle = {
  topic: string;
  title: string;
  excerpt: string;
  url: string;
  readMin?: number;
};

export type DigestEmailInput = {
  name?: string | null;
  intro?: string;
  weekLabel: string;
  articles: DigestArticle[];
  unsubscribeUrl: string;
  lang?: Lang;
};

const DIGEST_COPY: Record<Lang, { greeting: (n?: string) => string; intro: string; reactTag: string; reactBody: string; reactCta: string; reactHref: string; readSuffix: (m: number) => string; readCta: string }> = {
  hu: {
    greeting: (n) => (n ? `Kedves ${n}!` : "Kedves Olvasó!"),
    intro: "A digitális marketing folyamatosan változik, de nem minden újdonság érdemel azonnali figyelmet. Ebben a heti összefoglalóban azokat a híreket és gyakorlati megoldásokat válogattuk össze, amelyek valóban hatással lehetnek a vállalkozásod marketingjére.",
    reactTag: "G2A Marketing-szemszög",
    reactBody: "A marketingben nem az nyer, aki minden új trendet azonnal követ, hanem aki meg tudja különböztetni a valódi üzleti lehetőséget az átmeneti zajtól. Szeretnéd átnézni, hol lehetne hatékonyabb a vállalkozásod online marketingje?",
    reactCta: "Marketingkonzultáció kérése →",
    reactHref: "https://g2amarketing.hu/kapcsolat",
    readSuffix: (m) => `· ${m} perc olvasás`,
    readCta: "OLVASD EL →",
  },
  en: {
    greeting: (n) => (n ? `Hello ${n}!` : "Hello!"),
    intro: "Digital marketing changes constantly, but not every new thing deserves immediate attention. This week's roundup collects the news and practical solutions that can genuinely affect your business's marketing.",
    reactTag: "The G2A Marketing view",
    reactBody: "In marketing, the winner isn't whoever chases every new trend — it's whoever can tell a real business opportunity from passing noise. Want to review where your online marketing could work harder?",
    reactCta: "Request a consultation →",
    reactHref: "https://g2amarketing.hu/en/kapcsolat",
    readSuffix: (m) => `· ${m} min read`,
    readCta: "READ →",
  },
  zh: {
    greeting: (n) => (n ? `${n}，您好！` : "您好！"),
    intro: "数字营销在不断变化，但并非每个新事物都值得立刻关注。本周精选，我们挑出了那些真正可能影响您企业营销的资讯与实用方案。",
    reactTag: "G2A Marketing 观点",
    reactBody: "在营销中，赢家不是追逐每一个新趋势的人，而是能把真正的商业机会与一时的噪音区分开来的人。想看看您的线上营销还能在哪里做得更好吗？",
    reactCta: "预约营销咨询 →",
    reactHref: "https://g2amarketing.hu/zh/kapcsolat",
    readSuffix: (m) => `· ${m} 分钟阅读`,
    readCta: "阅读全文 →",
  },
};

function digestArticleBlock(a: DigestArticle, index: number, lang: Lang): string {
  const isAlt = index % 2 === 1;
  const bg = isAlt ? BG_SUBTLE : "#ffffff";
  const num = String(index + 1).padStart(2, "0");
  const total = String(0);

  const readChip = a.readMin
    ? `<span style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};margin-left:14px">${escapeHtml(DIGEST_COPY[lang].readSuffix(a.readMin))}</span>`
    : "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg}">
      <tr>
        <td style="padding:32px 36px">

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td>
                <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};color:${BRAND_TEAL_DARK};font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:4px">
                  <span style="color:${BRAND_TEAL}">◆</span> &nbsp;${escapeHtml(a.topic)}
                </span>
              </td>
              <td align="right" style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em">
                ${num}${total ? "" : ""}
              </td>
            </tr>
          </table>

          <h2 style="margin:16px 0 12px;font-size:22px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.02em">
            <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none">${escapeHtml(a.title)}</a>
          </h2>

          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(a.excerpt)}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="${a.url}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;padding:9px 18px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${escapeHtml(DIGEST_COPY[lang].readCta)}</a>
              </td>
              <td valign="middle" style="padding-left:8px">${readChip}</td>
            </tr>
          </table>

        </td>
      </tr>
    </table>`;
}

export function renderDigestEmailHtml(input: DigestEmailInput): string {
  const lang = input.lang ?? "hu";
  const dc = DIGEST_COPY[lang];
  const greeting = input.name ? dc.greeting(escapeHtml(input.name)) : dc.greeting();
  const intro = input.intro || dc.intro;

  const articleBlocks = input.articles
    .map((a, i) => digestArticleBlock(a, i, lang))
    .join('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:' + BORDER + '"></td></tr></table>');

  const body = `
    ${darkHeader({ tag: input.weekLabel, secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:36px 36px 8px">
          <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(intro)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:0 36px"><div style="height:3px;background:${BRAND_TEAL};border-radius:2px"></div></td></tr>
    </table>

    ${articleBlocks}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:22px 26px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:8px;font-weight:600">${escapeHtml(dc.reactTag)}</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1">
                  ${escapeHtml(dc.reactBody)} <a href="${dc.reactHref}" style="color:${BRAND_TEAL};text-decoration:none;font-weight:600">${escapeHtml(dc.reactCta)}</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${signature(lang)}

    ${footer(input.unsubscribeUrl, lang)}
  `;

  return wrapper(body, intro, lang);
}

// ─── Audit / contact / career confirmation email ────────────────────────────

export type ConfirmationFormType = "audit" | "contact" | "career";

export type ConfirmationEmailInput = {
  name: string;
  formType: ConfirmationFormType;
  submission?: { label: string; value: string }[];
  lang?: Lang;
};

type ConfirmationCopy = {
  tag: string;
  subject: string;
  intro: string;
  /** Numbered "what happens next" steps (contact / audit). */
  nextSteps?: string[];
  /** Prose paragraphs used instead of numbered steps (career). */
  bodyParagraphs?: string[];
  closing: string;
  /** Career email is a no-reply automated notification. */
  noReply?: boolean;
  secondaryLine: string;
};

const CONFIRMATION_COPY: Record<Lang, Record<ConfirmationFormType, ConfirmationCopy>> = {
  hu: {
    audit: {
      tag: "AUDIT KÉRÉS",
      subject: "Köszönjük az audit kérésed — hamarosan jelentkezünk",
      intro: "Köszönjük, hogy megkerestél minket. Kérésed megérkezett — az alábbiakban ellenőrizheted, amit elküldtél. Ha valamelyik adat pontosításra szorul, elég válaszolnod erre a levélre.",
      nextSteps: [
        "<strong>24 órán belül</strong> áttekintjük a weboldalad és a megadott online jelenléted.",
        "<strong>2-3 munkanapon belül</strong> küldünk egy első értékelést a legfontosabb észrevételekkel.",
        "<strong>5-7 munkanapon belül</strong> elkészül a részletes audit (15-25 oldal), priorizált teendőkkel.",
        "A teljes folyamat <strong>ingyenes</strong> és kötelezettségmentes — nincs utána értékesítési hívás, csak a riport, amit használni tudsz.",
      ],
      closing: "Ha időközben kérdésed merülne fel, válaszolj nyugodtan erre a levélre — minden üzenetet elolvasunk.",
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
    contact: {
      tag: "KAPCSOLATFELVÉTEL",
      subject: "Köszönjük az üzeneted — hamarosan válaszolunk",
      intro: "Köszönjük, hogy felvetted velünk a kapcsolatot. Üzeneted megérkezett hozzánk — az alábbiakban visszaolvashatod, amit elküldtél. Ha bármelyik adat pontatlan, elég válaszolnod erre a levélre.",
      nextSteps: [
        "<strong>Egy munkanapon belül</strong> személyre szabott választ küldünk az üzenetedre — nem sablonlevelet.",
        "Ha a téma összetettebb, egyeztetünk egy <strong>15-30 perces beszélgetést</strong>.",
        "Ha sürgős, hívj minket: <strong>+36 30 190 2575</strong> (hétköznap 8-17 óra között).",
      ],
      closing: "Ha időközben bármi kiegészítenivalód lenne, csak válaszolj erre a levélre — minden üzenetet elolvasunk.",
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
    career: {
      tag: "JELENTKEZÉS",
      subject: "Köszönjük a jelentkezésed — megkaptuk",
      intro: "Köszönjük, hogy jelentkeztél a G2A Marketing csapatába. Jelentkezésed sikeresen megérkezett hozzánk. A beküldött önéletrajzot és a megadott anyagokat a kiválasztási folyamat során részletesen áttekintjük.",
      bodyParagraphs: [
        "Számunkra nemcsak a szakmai tapasztalat fontos, hanem az önállóság, a precizitás, a problémamegoldó gondolkodás, és az is, mennyire tudsz felelősséget vállalni a saját munkádért.",
        "Ha a hátter és a tapasztalataid illeszkednek egy aktuális lehetőséghez, felvesszük veled a kapcsolatot a kiválasztási folyamat következő lépéseivel kapcsolatban.",
        "A jelentkezések számától függően az elbírálás több munkanapot is igénybe vehet — kérjük, addig ne küldd el ismét a jelentkezésed.",
      ],
      closing: "Köszönjük a G2A Marketing iránti érdeklődésed és a jelentkezésre fordított időd.",
      noReply: true,
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
  },
  en: {
    audit: {
      tag: "AUDIT REQUEST",
      subject: "Thanks for your audit request — we'll be in touch soon",
      intro: "Thank you for reaching out. Your request has arrived — you can check below what you sent. If any detail needs correcting, simply reply to this email.",
      nextSteps: [
        "<strong>Within 24 hours</strong> we'll review your website and the online presence you gave us.",
        "<strong>Within 2-3 working days</strong> we'll send a first assessment with the most important findings.",
        "<strong>Within 5-7 working days</strong> you'll get the full audit (15-25 pages) with prioritised actions.",
        "The whole process is <strong>free</strong> and no-strings — no sales call afterwards, just a report you can actually use.",
      ],
      closing: "If a question comes up in the meantime, just reply to this email — we read every message.",
      secondaryLine: "Confirmation · G2A Marketing",
    },
    contact: {
      tag: "MESSAGE RECEIVED",
      subject: "Thanks for your message — we'll reply soon",
      intro: "Thank you for getting in touch. Your message has reached us — you can read back below what you sent. If any detail is off, simply reply to this email.",
      nextSteps: [
        "<strong>Within one working day</strong> we'll send a tailored reply to your message — not a template.",
        "If the topic is more involved, we'll arrange a <strong>15-30 minute call</strong>.",
        "If it's urgent, call us: <strong>+36 30 190 2575</strong> (weekdays, 8am-5pm CET).",
      ],
      closing: "If anything else comes to mind in the meantime, just reply to this email — we read every message.",
      secondaryLine: "Confirmation · G2A Marketing",
    },
    career: {
      tag: "APPLICATION",
      subject: "Thanks for your application — we've received it",
      intro: "Thank you for applying to join the G2A Marketing team. Your application has reached us successfully. We'll review the CV and materials you submitted in detail during the selection process.",
      bodyParagraphs: [
        "What matters to us isn't only professional experience, but also independence, precision, problem-solving, and how far you can take ownership of your own work.",
        "If your background and experience match a current opportunity, we'll get in touch about the next steps in the selection process.",
        "Depending on the number of applications, the review can take several working days — please don't resend your application in the meantime.",
      ],
      closing: "Thank you for your interest in G2A Marketing and for the time you spent applying.",
      noReply: true,
      secondaryLine: "Confirmation · G2A Marketing",
    },
  },
  zh: {
    audit: {
      tag: "审计申请",
      subject: "感谢您的营销审计申请——我们会尽快与您联系",
      intro: "感谢您的联系。您的申请已收到——您可以在下方核对提交的内容。如需更正任何信息，回复这封邮件即可。",
      nextSteps: [
        "<strong>24 小时内</strong>，我们会查看您的网站以及您提供的线上呈现。",
        "<strong>2-3 个工作日内</strong>，我们会先发一份初步评估，列出最重要的发现。",
        "<strong>5-7 个工作日内</strong>，您会收到完整审计报告（15-25 页），并附上按优先级排序的行动建议。",
        "整个过程<strong>免费</strong>、无任何附加条件——之后不会有推销电话，只有一份您真正用得上的报告。",
      ],
      closing: "如果这期间您有任何问题，欢迎直接回复这封邮件——每一封我们都会看。",
      secondaryLine: "确认函 · G2A Marketing",
    },
    contact: {
      tag: "已收到留言",
      subject: "感谢您的留言——我们会尽快回复",
      intro: "感谢您的联系。您的留言已送达——您可以在下方回看提交的内容。如有任何信息不准确，回复这封邮件即可。",
      nextSteps: [
        "<strong>一个工作日内</strong>，我们会针对您的留言发送一份专门的回复，而不是模板。",
        "如果话题较为复杂，我们会安排一次 <strong>15-30 分钟的交流</strong>。",
        "如有急事，请致电：<strong>+36 30 190 2575</strong>（工作日 8:00-17:00，中欧时间）。",
      ],
      closing: "这期间如果还有想补充的内容，回复这封邮件即可——每一封我们都会看。",
      secondaryLine: "确认函 · G2A Marketing",
    },
    career: {
      tag: "求职申请",
      subject: "感谢您的应聘——我们已收到",
      intro: "感谢您应聘加入 G2A Marketing 团队。您的申请已成功送达。在甄选过程中，我们会仔细查阅您提交的简历和相关材料。",
      bodyParagraphs: [
        "对我们而言，重要的不只是专业经验，还有独立性、严谨、解决问题的思维，以及您能在多大程度上为自己的工作负责。",
        "如果您的背景与经验与当前的机会相匹配，我们会就甄选流程的后续步骤与您联系。",
        "视申请数量而定，评估可能需要几个工作日——在此之前，请勿重复提交申请。",
      ],
      closing: "感谢您对 G2A Marketing 的关注，以及您为这次申请付出的时间。",
      noReply: true,
      secondaryLine: "确认函 · G2A Marketing",
    },
  },
};

export function renderConfirmationEmailHtml(input: ConfirmationEmailInput): string {
  const lang = input.lang ?? "hu";
  const cfg = CONFIRMATION_COPY[lang][input.formType];
  const ui = UI[lang];
  const greeting = lang === "zh"
    ? `${escapeHtml(input.name)}，您好！`
    : lang === "en"
      ? `Hello ${escapeHtml(input.name)}!`
      : `Kedves ${escapeHtml(input.name)}!`;

  const submissionRows =
    input.submission && input.submission.length > 0
      ? input.submission
          .filter((s) => s.value && s.value.trim() !== "" && s.value.trim() !== "–")
          .map(
            (s) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.06em;text-transform:uppercase;width:120px;vertical-align:top">
                ${escapeHtml(s.label)}
              </td>
              <td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_PRIMARY};line-height:1.5;vertical-align:top">
                ${escapeHtml(s.value)}
              </td>
            </tr>`,
          )
          .join("")
      : "";

  // Either numbered steps (contact/audit) or prose paragraphs (career).
  const stepsBlock = cfg.nextSteps
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:32px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">${escapeHtml(ui.nextLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${cfg.nextSteps
              .map(
                (s, i) => `
        <tr>
          <td valign="top" style="padding:8px 12px 8px 0;width:32px">
            <div style="background:${BRAND_TEAL};color:#ffffff;font-family:${FONT_MONO};font-size:11px;font-weight:700;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px">${i + 1}</div>
          </td>
          <td style="padding:8px 0;font-size:14px;color:${TEXT_SECONDARY};line-height:1.6">${s}</td>
        </tr>`,
              )
              .join("")}
          </table>
        </td>
      </tr>
    </table>`
    : "";

  const proseBlock = cfg.bodyParagraphs
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 0">
          ${cfg.bodyParagraphs
            .map((p) => `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(p)}</p>`)
            .join("")}
        </td>
      </tr>
    </table>`
    : "";

  const body = `
    ${darkHeader({ tag: cfg.tag, secondaryLine: cfg.secondaryLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 8px">
          <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(cfg.intro)}</p>
        </td>
      </tr>
    </table>

    ${
      submissionRows
        ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:10px">${escapeHtml(ui.submittedLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:6px 18px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${submissionRows}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
        : ""
    }

    ${stepsBlock}
    ${proseBlock}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 8px">
          <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(cfg.closing)}</div>
        </td>
      </tr>
    </table>

    ${signature(lang)}
    ${cfg.noReply ? autoNoteBlock(lang) : ""}

    ${footer("https://g2amarketing.hu/kapcsolat", lang)}
  `;

  return wrapper(body, cfg.intro, lang);
}

/** Subject line for a confirmation email in the given language. */
export function confirmationSubject(formType: ConfirmationFormType, lang: Lang): string {
  return CONFIRMATION_COPY[lang][formType].subject;
}

/** Localised labels for the "what you sent" echo block, so a Chinese/English
 *  confirmation doesn't show Hungarian field names. */
export const FIELD_LABELS: Record<Lang, Record<string, string>> = {
  hu: {
    email: "Email", phone: "Telefon", subject: "Tárgy", service: "Szolgáltatás",
    message: "Üzenet", position: "Pozíció", company: "Cég", website: "Weboldal",
    budget: "Havi büdzsé", challenges: "Kihívások", goals: "Célok", areas: "Területek",
  },
  en: {
    email: "Email", phone: "Phone", subject: "Subject", service: "Service",
    message: "Message", position: "Position", company: "Company", website: "Website",
    budget: "Monthly budget", challenges: "Challenges", goals: "Goals", areas: "Areas",
  },
  zh: {
    email: "邮箱", phone: "电话", subject: "主题", service: "服务",
    message: "留言", position: "应聘职位", company: "公司", website: "网站",
    budget: "每月预算", challenges: "面临的挑战", goals: "目标", areas: "意向领域",
  },
};
