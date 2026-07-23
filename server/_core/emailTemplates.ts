/**
 * Shared HTML email templates — welcome, confirmation (contact/audit/career),
 * and the weekly digest.
 *
 * Copy is trilingual (hu / en / zh): the visitor's language is resolved at the
 * call site and threaded in as `lang`, so a Chinese lead who signs up on the
 * /zh/ site gets a Chinese welcome, not a Hungarian one.
 *
 * Voice (per the brand_voice profile): first-person, warm, direct, a little
 * provocative — a message from Attila, not a faceless system. Hungarian is
 * tegező. We position as a strategic PARTNER, never an "ügynökség/agency",
 * never promise guaranteed results, no emoji, no ChatGPT-style scaffolding
 * ("Firstly… In summary… Don't forget…").
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
    partnerLine: "Stratégiai és technológiai partner · Pécs",
    signOff: "Üdv,",
    submittedLabel: "Amit elküldtél",
    nextLabel: "Mi következik",
    footerReason: "Ezt az emailt azért kaptad, mert feliratkoztál a g2amarketing.hu hírlevelére.",
    unsubscribe: "Leiratkozás egy kattintással",
    privacy: "Adatvédelmi tájékoztató",
  },
  en: {
    partnerLine: "Strategic & technology partner · Pécs, Hungary",
    signOff: "Talk soon,",
    submittedLabel: "What you sent",
    nextLabel: "What happens next",
    footerReason: "You're getting this because you signed up for the g2amarketing.hu newsletter.",
    unsubscribe: "Unsubscribe in one click",
    privacy: "Privacy notice",
  },
  zh: {
    partnerLine: "战略与技术合作伙伴 · 匈牙利佩奇",
    signOff: "顺颂商祺，",
    submittedLabel: "您提交的内容",
    nextLabel: "接下来会发生什么",
    footerReason: "您收到这封邮件，是因为您订阅了 g2amarketing.hu 的通讯。",
    unsubscribe: "一键退订",
    privacy: "隐私说明",
  },
} satisfies Record<Lang, Record<string, string>>;

const PRIVACY_PATH = "/adatvedelmi-iranyelvek";

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

/** Cloudinary-hosted G2A logo at email size (180px wide, 2× DPI = 360px source).
 *  Auto-format (Cloudinary `f_auto`) serves PNG to Outlook and WebP to Gmail. */
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

/** Personal sign-off block — appended above the footer so every message feels
 *  written by a human, not shipped by a faceless system. */
function signature(lang: Lang, opts: { name?: string; role?: string } = {}): string {
  const name = opts.name || "Attila";
  const role = opts.role || "G2A Marketing";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 36px 36px">
          <div style="font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;margin-bottom:14px">${escapeHtml(UI[lang].signOff)}</div>
          <div style="display:inline-block;border-left:3px solid ${BRAND_TEAL};padding-left:14px">
            <div style="font-size:16px;font-weight:700;color:${TEXT_PRIMARY};letter-spacing:-0.01em">${escapeHtml(name)}</div>
            <div style="font-size:12px;color:${TEXT_MUTED};font-family:${FONT_MONO};letter-spacing:0.04em;margin-top:3px">${escapeHtml(role)}</div>
          </div>
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
  /** Topics the subscriber picked — controls which cards we highlight.
   *  Empty array means "all" (footer band signup with no topic selector). */
  topics?: string[];
  lang?: Lang;
};

type TopicCard = { tag: string; title: string; desc: string; icon: string };

const TOPIC_CARDS: Record<Lang, Record<string, TopicCard>> = {
  hu: {
    strategy: { tag: "STRATÉGIA", title: "B2B marketingstratégia", desc: "Pozícionálás, ICP, brand-építés és go-to-market playbookok.", icon: "◆" },
    ai: { tag: "AI", title: "AI & automatizáció", desc: "AI-workflow-k, prompt-receptek, kipróbált eszközök B2B-kontextusban.", icon: "▲" },
    paid: { tag: "TELJESÍTMÉNY", title: "SEO & teljesítményhirdetés", desc: "Google Ads, Meta, organikus SEO — mérhető eredményekkel.", icon: "●" },
    case_studies: { tag: "ESETTANULMÁNY", title: "Esettanulmányok & adatok", desc: "Valós ügyfélprojektek konkrét számokkal — mi működött, mi nem.", icon: "■" },
  },
  en: {
    strategy: { tag: "STRATEGY", title: "B2B marketing strategy", desc: "Positioning, ICP, brand-building and go-to-market playbooks.", icon: "◆" },
    ai: { tag: "AI", title: "AI & automation", desc: "AI workflows, prompt recipes and tools that actually earn their place in B2B.", icon: "▲" },
    paid: { tag: "PERFORMANCE", title: "SEO & paid performance", desc: "Google Ads, Meta, organic SEO — tied to results you can measure.", icon: "●" },
    case_studies: { tag: "CASE STUDIES", title: "Case studies & data", desc: "Real client projects with real numbers — what worked, what didn't.", icon: "■" },
  },
  zh: {
    strategy: { tag: "战略", title: "B2B 营销战略", desc: "定位、理想客户画像、品牌建设与市场进入方案。", icon: "◆" },
    ai: { tag: "AI", title: "AI 与自动化", desc: "在 B2B 场景中真正好用的 AI 工作流、提示词与工具。", icon: "▲" },
    paid: { tag: "效果", title: "SEO 与效果广告", desc: "Google Ads、Meta、自然搜索——都对得上可衡量的结果。", icon: "●" },
    case_studies: { tag: "案例", title: "案例与数据", desc: "真实客户项目、真实数字——哪些有效，哪些无效。", icon: "■" },
  },
};

const WELCOME_COPY: Record<Lang, {
  headerTag: string;
  greeting: (name?: string) => string;
  lead: string;
  cardsLabel: string;
  ctaTag: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
  ctaHref: string;
  noteStrong: string;
  noteBody: string;
  preheader: string;
}> = {
  hu: {
    headerTag: "Üdv a fedélzeten",
    greeting: (name) => (name ? `Szia ${name}!` : "Szia!"),
    lead: "Attila vagyok, a G2A Marketingtől. Örülök, hogy itt vagy. Péntek reggelente írok egyszer — nem többször, és soha nem olyasmiről, ami ne érne meg öt percet. Ennyi a megállapodás.",
    cardsLabel: "Amiről írni fogok",
    ctaTag: "Addig is",
    ctaTitle: "Nézz szét a korábbi írásokban",
    ctaDesc: "Konkrét magyar B2B- és AI-esetek, valós számokkal — nem elméleti okoskodás.",
    ctaButton: "OLVASS BELE →",
    ctaHref: "https://g2amarketing.hu/hirek",
    noteStrong: "Van egy konkrét kérdésed?",
    noteBody: "Nyomj választ erre az emailre — én olvasom, én válaszolok, nem egy automata. Ha épp egy valós marketinges fejtörőn ülsz, írd meg pár mondatban; sokszor egy 15 perces beszélgetés többet tisztáz, mint egy órányi keresgélés.",
    preheader: "Örülök, hogy itt vagy — röviden arról, mire számíthatsz.",
  },
  en: {
    headerTag: "Welcome aboard",
    greeting: (name) => (name ? `Hi ${name}!` : "Hi there!"),
    lead: "I'm Attila, from G2A Marketing. Glad you're here. I write once, on Friday mornings — no more than that, and never about anything that isn't worth five minutes of your time. That's the deal.",
    cardsLabel: "What I'll write about",
    ctaTag: "In the meantime",
    ctaTitle: "Dig into the earlier pieces",
    ctaDesc: "Concrete B2B and AI cases from the Hungarian market, with real numbers — not theory.",
    ctaButton: "START READING →",
    ctaHref: "https://g2amarketing.hu/en/hirek",
    noteStrong: "Got a specific question?",
    noteBody: "Just hit reply — I read these myself and answer personally, no autoresponder. If you're stuck on a real marketing problem, tell me in a few lines; a 15-minute chat often clears up more than an hour of digging.",
    preheader: "Glad you're here — a quick note on what to expect.",
  },
  zh: {
    headerTag: "欢迎加入",
    greeting: (name) => (name ? `${name}，您好！` : "您好！"),
    lead: "我是 G2A Marketing 的 Attila，很高兴您来到这里。我每周只在周五早上写一封——不会更多，也绝不会写不值得您花五分钟的内容。这就是我们的约定。",
    cardsLabel: "我会写这些",
    ctaTag: "在此之前",
    ctaTitle: "先翻翻过往的文章",
    ctaDesc: "来自匈牙利市场的真实 B2B 与 AI 案例，配上真实数字——不是空谈。",
    ctaButton: "开始阅读 →",
    ctaHref: "https://g2amarketing.hu/zh/hirek",
    noteStrong: "有具体的问题吗？",
    noteBody: "直接回复这封邮件就好——是我本人在读、本人在回，不是自动回复。如果您正卡在一个真实的营销难题上，用几句话告诉我；很多时候一次 15 分钟的交流，比查一个小时资料更管用。",
    preheader: "很高兴您来到这里——简单说说您可以期待什么。",
  },
};

/** Build a single 2-column row of topic cards. */
function topicRow(keys: string[], lang: Lang): string {
  const cards = TOPIC_CARDS[lang];
  const cell = (key: string) => {
    const c = cards[key]!;
    return `
      <td width="50%" valign="top" style="padding:8px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
          <tr>
            <td style="padding:18px 18px 16px">
              <div style="font-family:${FONT_MONO};font-size:14px;color:${BRAND_TEAL};line-height:1;margin-bottom:10px">${c.icon}</div>
              <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL_DARK};text-transform:uppercase;margin-bottom:6px;font-weight:600">${escapeHtml(c.tag)}</div>
              <div style="font-size:15px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:6px;line-height:1.35">${escapeHtml(c.title)}</div>
              <div style="font-size:13px;color:${TEXT_SECONDARY};line-height:1.55">${escapeHtml(c.desc)}</div>
            </td>
          </tr>
        </table>
      </td>`;
  };
  const second = keys[1] ? cell(keys[1]) : '<td width="50%"></td>';
  return `
    <tr>
      ${cell(keys[0])}
      ${second}
    </tr>`;
}

export function renderWelcomeEmailHtml(input: WelcomeEmailInput): string {
  const lang = input.lang ?? "hu";
  const copy = WELCOME_COPY[lang];
  const greeting = copy.greeting(input.name ? escapeHtml(input.name) : undefined);
  const activeTopics =
    input.topics && input.topics.length > 0
      ? input.topics.filter((t) => TOPIC_CARDS[lang][t])
      : Object.keys(TOPIC_CARDS[lang]);

  const rows: string[] = [];
  for (let i = 0; i < activeTopics.length; i += 2) {
    rows.push(topicRow([activeTopics[i], activeTopics[i + 1]].filter(Boolean), lang));
  }

  const body = `
    ${darkHeader({ tag: copy.headerTag, secondaryLine: UI[lang].partnerLine })}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:40px 36px 24px">
          <h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:${TEXT_PRIMARY};font-weight:800;letter-spacing:-0.025em">${greeting}</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY}">
            ${escapeHtml(copy.lead)}
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 28px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:6px;padding:0 8px">${escapeHtml(copy.cardsLabel)}</div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 28px">
      ${rows.join("")}
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND_DARK_PANEL};border-radius:12px;border-left:4px solid ${BRAND_TEAL}">
            <tr>
              <td style="padding:24px 28px">
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.18em;color:${BRAND_TEAL};text-transform:uppercase;margin-bottom:10px;font-weight:600">${escapeHtml(copy.ctaTag)}</div>
                <div style="font-size:17px;line-height:1.4;color:#ffffff;font-weight:700;margin-bottom:8px">${escapeHtml(copy.ctaTitle)}</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;margin-bottom:18px">${escapeHtml(copy.ctaDesc)}</div>
                <a href="${copy.ctaHref}" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;padding:11px 22px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${escapeHtml(copy.ctaButton)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:24px 36px 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG_SUBTLE};border:1px solid ${BORDER};border-radius:10px">
            <tr>
              <td style="padding:18px 22px">
                <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">
                  <strong style="color:${TEXT_PRIMARY}">${escapeHtml(copy.noteStrong)}</strong> ${escapeHtml(copy.noteBody)}
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

  return wrapper(body, copy.preheader, lang);
}

// ─── Weekly digest / sample newsletter ──────────────────────────────────────

export type DigestArticle = {
  topic: string;
  title: string;
  excerpt: string;
  url: string;
  /** Optional reading-time minutes. Hidden if absent. */
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

const DIGEST_COPY: Record<Lang, { greeting: (n?: string) => string; intro: string; reactTag: string; reactBody: string; reactCta: string; reactHref: string; readSuffix: (m: number) => string }> = {
  hu: {
    greeting: (n) => (n ? `Szia ${n}!` : "Szia!"),
    intro: "Itt a heti gyakorlati B2B- és AI-marketing válogatás — egy cikk minden témakörből, 5-10 perces olvasmányok.",
    reactTag: "Mit gondolsz?",
    reactBody: "Hasznos volt? Válaszolj egyetlen mondattal — átolvasom és válaszolok. Konkrét kérdésed van?",
    reactCta: "Írj nekünk →",
    reactHref: "https://g2amarketing.hu/kapcsolat",
    readSuffix: (m) => `· ${m} perc olvasás`,
  },
  en: {
    greeting: (n) => (n ? `Hi ${n}!` : "Hi there!"),
    intro: "This week's practical B2B and AI marketing picks — one piece per topic, 5-10 minute reads.",
    reactTag: "What do you think?",
    reactBody: "Useful? Reply with a single line — I read them and answer. Got a specific question?",
    reactCta: "Get in touch →",
    reactHref: "https://g2amarketing.hu/en/kapcsolat",
    readSuffix: (m) => `· ${m} min read`,
  },
  zh: {
    greeting: (n) => (n ? `${n}，您好！` : "您好！"),
    intro: "本周实用的 B2B 与 AI 营销精选——每个主题一篇，5-10 分钟读完。",
    reactTag: "您怎么看？",
    reactBody: "有用吗？用一句话回复即可——我会亲自阅读并回复。有具体问题？",
    reactCta: "联系我们 →",
    reactHref: "https://g2amarketing.hu/zh/kapcsolat",
    readSuffix: (m) => `· ${m} 分钟阅读`,
  },
};

function digestArticleBlock(a: DigestArticle, index: number, lang: Lang): string {
  const card = TOPIC_CARDS[lang][a.topic];
  const tag = card?.tag || a.topic.toUpperCase();
  const icon = card?.icon || "◆";
  const isAlt = index % 2 === 1;
  const bg = isAlt ? BG_SUBTLE : "#ffffff";
  const num = String(index + 1).padStart(2, "0");

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
                  <span style="color:${BRAND_TEAL}">${icon}</span> &nbsp;${escapeHtml(tag)}
                </span>
              </td>
              <td align="right" style="font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em">
                ${num} / 04
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
                <a href="${a.url}" style="display:inline-block;background:${TEXT_PRIMARY};color:#ffffff;padding:9px 18px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;font-family:${FONT_MONO};letter-spacing:0.06em">${lang === "zh" ? "阅读全文 →" : lang === "en" ? "READ →" : "OLVASD EL →"}</a>
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
  heading: string;
  intro: string;
  nextSteps: string[];
  closing: string;
  secondaryLine: string;
};

const CONFIRMATION_COPY: Record<Lang, Record<ConfirmationFormType, ConfirmationCopy>> = {
  hu: {
    audit: {
      tag: "AUDIT KÉRÉS",
      subject: "Megvan az audit kérésed — nekilátok",
      heading: "Megkaptam a kérésedet",
      intro: "Köszönöm, hogy rám bíztad ezt. Megvan minden, amit elküldtél — lent visszaellenőrizheted. Ha valamelyik adat nem stimmel, csak válaszolj, és pontosítjuk, mielőtt belekezdek.",
      nextSteps: [
        "<strong>24 órán belül</strong> ránézek a weboldaladra és arra, hol vagy jelen online.",
        "<strong>2-3 munkanap</strong> múlva küldök egy első visszajelzést a legfontosabb észrevételekkel.",
        "<strong>5-7 munkanap</strong> alatt elkészül a részletes audit (15-25 oldal), priorizált teendőkkel.",
        "Az egész <strong>ingyenes</strong> és kötelezettségmentes — nincs utána értékesítős telefon, csak a riport, amit használni tudsz.",
      ],
      closing: "Ha közben kérdésed támad — mondjuk épp egy konkrét kihíváson dolgozol —, csak válaszolj erre a levélre. Olvasom.",
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
    contact: {
      tag: "KAPCSOLATFELVÉTEL",
      subject: "Megvan az üzeneted — jelentkezem",
      heading: "Megkaptam az üzeneted",
      intro: "Köszönöm, hogy írtál. Megvan minden — lent visszaolvashatod, amit elküldtél. Ha valami elírás csúszott bele, csak válaszolj erre a levélre, és javítjuk.",
      nextSteps: [
        "<strong>Egy munkanapon belül</strong> személyesen válaszolok — nem sablonlevéllel, hanem arra, amit írtál.",
        "Ha a téma megkívánja, keresek egy időpontot egy <strong>15-30 perces beszélgetésre</strong>.",
        "Ha sürgős, hívj nyugodtan: <strong>+36 30 190 2575</strong> (hétköznap 8-17 között).",
      ],
      closing: "Ha addig eszedbe jut még valami, csak írd hozzá egy válaszban — úgyis ugyanitt olvasom.",
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
    career: {
      tag: "KARRIER JELENTKEZÉS",
      subject: "Megvan a jelentkezésed — átnézem",
      heading: "Megkaptam a jelentkezésedet",
      intro: "Köszönöm, hogy jelentkeztél — örülök neki. Megvan minden, amit elküldtél; ha valamit pontosítanál, csak válaszolj erre a levélre.",
      nextSteps: [
        "<strong>3-5 munkanapon belül</strong> végigolvasom a jelentkezésed és az önéletrajzod.",
        "Ha passzol, amit keresünk, hívlak egy <strong>rövid online beszélgetésre</strong> (kb. 30 perc).",
        "Utána egy <strong>gyakorlati feladat</strong> a saját szakterületeden — valós helyzetben, nem elvont fejtörő.",
      ],
      closing: "Ha közben kérdésed van — a pozícióról, a csapatról, arról, milyen nálunk dolgozni —, csak válaszolj. Olvasom.",
      secondaryLine: "Visszaigazolás · G2A Marketing",
    },
  },
  en: {
    audit: {
      tag: "AUDIT REQUEST",
      subject: "Got your audit request — I'm on it",
      heading: "Your request is in",
      intro: "Thanks for trusting me with this. I have everything you sent — you can double-check it below. If any detail is off, just reply and we'll fix it before I start.",
      nextSteps: [
        "<strong>Within 24 hours</strong> I'll look at your site and where you show up online.",
        "In <strong>2-3 working days</strong> I'll send a first read with the most important findings.",
        "Within <strong>5-7 working days</strong> you'll get the full audit (15-25 pages) with prioritised actions.",
        "The whole thing is <strong>free</strong> and no-strings — no sales call afterwards, just a report you can actually use.",
      ],
      closing: "If a question comes up in the meantime — say you're wrestling with a specific challenge — just reply to this email. I read them.",
      secondaryLine: "Confirmation · G2A Marketing",
    },
    contact: {
      tag: "MESSAGE RECEIVED",
      subject: "Got your message — I'll be in touch",
      heading: "Your message is in",
      intro: "Thanks for reaching out. I have everything — you can read back what you sent below. If a typo slipped in, just reply to this email and we'll sort it.",
      nextSteps: [
        "<strong>Within one working day</strong> I'll reply personally — not a template, but to what you actually wrote.",
        "If the topic calls for it, I'll find a slot for a <strong>15-30 minute chat</strong>.",
        "Urgent? Call me: <strong>+36 30 190 2575</strong> (weekdays, 8am-5pm CET).",
      ],
      closing: "If something else comes to mind before then, just add it in a reply — it lands in the same place.",
      secondaryLine: "Confirmation · G2A Marketing",
    },
    career: {
      tag: "APPLICATION",
      subject: "Got your application — I'll read it",
      heading: "Your application is in",
      intro: "Thanks for applying — genuinely glad you did. I have everything you sent; if you'd like to correct anything, just reply to this email.",
      nextSteps: [
        "<strong>Within 3-5 working days</strong> I'll read your application and CV.",
        "If it's a fit, I'll invite you to a <strong>short online chat</strong> (around 30 minutes).",
        "After that, a <strong>hands-on task</strong> in your own field — a real situation, not an abstract puzzle.",
      ],
      closing: "If any question comes up — about the role, the team, what it's like to work here — just reply. I read them.",
      secondaryLine: "Confirmation · G2A Marketing",
    },
  },
  zh: {
    audit: {
      tag: "审计申请",
      subject: "已收到您的营销审计申请——我马上开始",
      heading: "您的申请已收到",
      intro: "谢谢您把这件事交给我。您提交的内容我都收到了，可以在下方再核对一遍。如果有任何信息不对，回复我即可，我会在开始前先更正。",
      nextSteps: [
        "<strong>24 小时内</strong>，我会看一下您的网站以及您在网上的呈现。",
        "<strong>2-3 个工作日内</strong>，我会先发一份初步反馈，列出最重要的发现。",
        "<strong>5-7 个工作日内</strong>，您会收到完整审计报告（15-25 页），并附上按优先级排序的行动建议。",
        "整个过程<strong>免费</strong>、无任何附加条件——之后不会有推销电话，只有一份您真正用得上的报告。",
      ],
      closing: "如果这期间您有任何问题——比如正卡在某个具体难题上——直接回复这封邮件就好，我会看。",
      secondaryLine: "确认函 · G2A Marketing",
    },
    contact: {
      tag: "已收到留言",
      subject: "已收到您的留言——我会尽快联系您",
      heading: "您的留言已收到",
      intro: "谢谢您的联系。内容我都收到了，可以在下方回看您提交的信息。如果有笔误，回复这封邮件即可，我们一起更正。",
      nextSteps: [
        "<strong>一个工作日内</strong>，我会亲自回复——不是模板，而是针对您所写的内容。",
        "如果话题需要，我会安排一次 <strong>15-30 分钟的交流</strong>。",
        "急事请直接来电：<strong>+36 30 190 2575</strong>（工作日 8:00-17:00，中欧时间）。",
      ],
      closing: "在那之前如果又想到什么，回复补充一句就好——都会落到同一个地方。",
      secondaryLine: "确认函 · G2A Marketing",
    },
    career: {
      tag: "求职申请",
      subject: "已收到您的申请——我会认真看",
      heading: "您的申请已收到",
      intro: "谢谢您的应聘，真的很高兴。您提交的内容我都收到了；如果想更正什么，回复这封邮件即可。",
      nextSteps: [
        "<strong>3-5 个工作日内</strong>，我会读完您的申请和简历。",
        "如果合适，我会邀请您做一次 <strong>简短的线上交流</strong>（约 30 分钟）。",
        "之后是一个您所在领域的 <strong>实操小任务</strong>——真实场景，而不是抽象考题。",
      ],
      closing: "这期间如果有任何问题——关于职位、团队，或在我们这里工作是什么感觉——回复就好，我会看。",
      secondaryLine: "确认函 · G2A Marketing",
    },
  },
};

export function renderConfirmationEmailHtml(input: ConfirmationEmailInput): string {
  const lang = input.lang ?? "hu";
  const cfg = CONFIRMATION_COPY[lang][input.formType];
  const ui = UI[lang];
  const greeting = lang === "zh" ? `${escapeHtml(input.name)}，您好！` : lang === "en" ? `Hi ${escapeHtml(input.name)}!` : `Szia ${escapeHtml(input.name)}!`;

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

  const steps = cfg.nextSteps
    .map(
      (s, i) => `
        <tr>
          <td valign="top" style="padding:8px 12px 8px 0;width:32px">
            <div style="background:${BRAND_TEAL};color:#ffffff;font-family:${FONT_MONO};font-size:11px;font-weight:700;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px">${i + 1}</div>
          </td>
          <td style="padding:8px 0;font-size:14px;color:${TEXT_SECONDARY};line-height:1.6">${s}</td>
        </tr>`,
    )
    .join("");

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

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:32px 36px 8px">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT_MUTED};text-transform:uppercase;margin-bottom:14px">${escapeHtml(ui.nextLabel)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${steps}
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px 36px 8px">
          <div style="font-size:14px;line-height:1.65;color:${TEXT_SECONDARY}">${escapeHtml(cfg.closing)}</div>
        </td>
      </tr>
    </table>

    ${signature(lang)}

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
    budget: "Havi büdzsé", challenges: "Kihívások", goals: "Célok",
  },
  en: {
    email: "Email", phone: "Phone", subject: "Subject", service: "Service",
    message: "Message", position: "Position", company: "Company", website: "Website",
    budget: "Monthly budget", challenges: "Challenges", goals: "Goals",
  },
  zh: {
    email: "邮箱", phone: "电话", subject: "主题", service: "服务",
    message: "留言", position: "应聘职位", company: "公司", website: "网站",
    budget: "每月预算", challenges: "面临的挑战", goals: "目标",
  },
};
