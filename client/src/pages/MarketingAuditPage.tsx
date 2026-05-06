/**
 * Dedicated Marketing Audit landing page (/marketing-audit).
 *
 * Replaces the generic "Ingyenes audit" CTA target with a focused landing
 * that explains: what's in the audit, the 5-step process, why it's free,
 * and a tight signup form. Per the strategy doc (4.20): every audit CTA
 * should funnel here so visitors know exactly what they're getting.
 *
 * Form re-uses the existing /api/audit endpoint via the AuditPage's tRPC
 * mutation — kept simple intentionally (4 fields → server-side full
 * validation, rate-limited, notifies admin).
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  CheckCircle2,
  Search,
  Target,
  TrendingUp,
  Users,
  ChartBar,
  Loader2,
  Mail,
  Quote,
} from "lucide-react";
import { Link } from "wouter";

type AuditDoc = {
  seoTitle: string;
  seoDesc: string;
  badge: string;
  title: string;
  lead: string;
  whatsIncluded: { heading: string; intro: string; items: { icon: React.ReactNode; title: string; desc: string }[] };
  process: { heading: string; steps: { step: string; title: string; desc: string }[] };
  whyFree: { heading: string; body: string };
  testimonial: { quote: string; author: string; role: string };
  formTitle: string;
  formSubtitle: string;
  formNameLabel: string;
  formCompanyLabel: string;
  formEmailLabel: string;
  formWebsiteLabel: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formCta: string;
  formSubmitting: string;
  formSuccess: string;
  formError: string;
  consent: { before: string; linkText: string; after: string };
  finePrint: string;
};

const DOCS: Record<Language, AuditDoc> = {
  hu: {
    seoTitle: "Ingyenes marketing audit – G2A Marketing | Versenytárselemzés és akcióterv",
    seoDesc:
      "Kérj ingyenes marketing auditot: weboldal, SEO, PPC és social media analízis, versenytárselemzés és személyre szabott akcióterv. Átlátható, akcióorientált jelentés.",
    badge: "Ingyenes szolgáltatás",
    title: "Ingyenes marketing audit — tudd meg, hol tart a marketinged",
    lead:
      "Ne költs feleslegesen a marketingre. Az ingyenes auditunk során feltérképezzük jelenlegi online jelenlétedet, azonosítjuk az erősségeket és gyenge pontokat, és konkrét optimalizálási javaslatokat teszünk. Átlátható, akcióorientált jelentést kapsz — hogy minden további lépés megalapozott legyen.",
    whatsIncluded: {
      heading: "Mit tartalmaz az audit?",
      intro:
        "Egy 360°-os átvilágítást kapsz: nem csak elmondjuk hol vannak hibák, hanem konkrét, sorrendezett javítási lépéseket is, amiket akár saját csapattal is végrehajthatsz.",
      items: [
        {
          icon: <Search size={20} />,
          title: "Weboldal és technikai SEO",
          desc: "Sebesség (Core Web Vitals), mobil-megjelenés, indexelhetőség, sitemap, strukturált adat, on-page optimalizáltság.",
        },
        {
          icon: <ChartBar size={20} />,
          title: "PPC fiók-elemzés",
          desc: "Google Ads és Meta hirdetési fiókok átvilágítása: kampánystruktúra, kulcsszavak, hirdetésminőség, költség-hatékonyság, konverziók.",
        },
        {
          icon: <Users size={20} />,
          title: "Közösségi média audit",
          desc: "Facebook, Instagram, LinkedIn, TikTok jelenlét: tartalmi konzisztencia, posztolási kadencia, engagement, kreatívok minősége.",
        },
        {
          icon: <Target size={20} />,
          title: "Tartalommarketing áttekintés",
          desc: "Blog, YouTube, hírlevél: SEO-kulcsszó lefedettség, tartalmi gap-ek, formátumok és gyakoriság.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Versenytárs benchmarking",
          desc: "Top 3-5 versenytársad pozícionálása, ranking, hirdetési stratégia, organikus láthatóság — összehasonlítva veled.",
        },
        {
          icon: <CheckCircle2 size={20} />,
          title: "KPI-lista és roadmap",
          desc: "Konkrét, prioritizált akcióterv: mit változtass az első 30/60/90 napban — kalkulált hatással és nehézséggel.",
        },
      ],
    },
    process: {
      heading: "Hogyan zajlik az audit?",
      steps: [
        {
          step: "1",
          title: "Jelentkezés",
          desc: "Kitöltöd a lenti űrlapot 2 perc alatt — cégnév, weboldal és pár kérdés a céljaidról.",
        },
        {
          step: "2",
          title: "Kick-off konzultáció",
          desc: "30 perces hívás, ahol megbeszéljük a fő üzleti céljaidat és prioritásaidat. Itt válik világossá mit kell mélyebben megnézni.",
        },
        {
          step: "3",
          title: "Adatgyűjtés és elemzés",
          desc: "Hozzáférést kérünk a Google Analytics, Search Console, hirdetési fiókok read-only megosztásához. 5–7 munkanap alatt elemzünk.",
        },
        {
          step: "4",
          title: "Audit jelentés",
          desc: "Strukturált PDF (kb. 25–30 oldal) — találatok, képernyőképek, prioritizált akciólista. Megkapod e-mailben.",
        },
        {
          step: "5",
          title: "Konzultációs call",
          desc: "60 perces átbeszélő, ahol végigmegyünk a jelentésen, válaszolunk minden kérdésedre, és megbeszéljük a következő lépéseket.",
        },
      ],
    },
    whyFree: {
      heading: "Miért ingyenes?",
      body:
        "Mert szeretnénk megismerni a vállalkozásodat és értéket adni előre — kötöttség nélkül. Az audit végén semmilyen elköteleződésre nincs szükség. Te döntöd el, hogy a javaslatokat saját csapatodddal megvalósítod-e, vagy szeretnél-e velünk tovább dolgozni. A célunk: hogy a beszélgetés végén egy konkrét, használható akciótervvel távozz, akkor is, ha sosem leszünk üzleti partnerek.",
    },
    testimonial: {
      quote:
        "Az audit segített rávilágítani, hol veszítünk forgalmat. A javaslatok alapján 3 hónap alatt 40%-os javulást értünk el az organikus konverzióban — anélkül, hogy egyetlen forintot is költöttünk volna új hirdetésre.",
      author: "Korábbi audit-igénylő",
      role: "B2B technológiai cég, Pécs",
    },
    formTitle: "Kérd az ingyenes auditot",
    formSubtitle: "5 mező, 2 perc — 5–7 munkanapon belül kapsz visszajelzést.",
    formNameLabel: "Teljes név",
    formCompanyLabel: "Cégnév",
    formEmailLabel: "E-mail cím",
    formWebsiteLabel: "Weboldal URL",
    formMessageLabel: "Mi a fő kihívásod most? (opcionális)",
    formMessagePlaceholder:
      "Pl. Stagnál a forgalom, drága a Google Ads, nem találnak meg a lokális keresésben...",
    formCta: "Kérem az ingyenes auditot",
    formSubmitting: "Küldés...",
    formSuccess:
      "Köszönjük! 1 munkanapon belül felvesszük a kapcsolatot a kick-off egyeztetéshez.",
    formError: "Hiba történt. Próbáld újra, vagy írj az info@g2amarketing.hu címre.",
    consent: {
      before: "Hozzájárulok, hogy a G2A Marketing Bt. a megadott adatokat az audit elkészítése és kapcsolatfelvétel céljából kezelje, az",
      linkText: "Adatvédelmi tájékoztató",
      after: " szerint.",
    },
    finePrint:
      "Az audit teljesen ingyenes és kötöttségmentes. Nem kell megrendelést leadni utána. Maximum heti 5 új audit-kérelmet tudunk fogadni a részletesség biztosítása érdekében.",
  },
  en: {
    seoTitle: "Free Marketing Audit – G2A Marketing | Competitor analysis & action plan",
    seoDesc:
      "Request a free marketing audit: website, SEO, PPC and social media analysis, competitor benchmarking, and a personalised action plan. Transparent, action-oriented report.",
    badge: "Free service",
    title: "Free marketing audit — find out where your marketing stands",
    lead:
      "Stop wasting marketing budget. Our free audit maps your current online presence, identifies strengths and weaknesses, and gives you concrete optimisation steps. You receive a transparent, action-oriented report — so every next move is grounded in data.",
    whatsIncluded: {
      heading: "What's included?",
      intro:
        "You get a 360° review: not just a list of issues, but a concrete prioritised action plan you can execute even with your own team.",
      items: [
        {
          icon: <Search size={20} />,
          title: "Website & technical SEO",
          desc: "Page speed (Core Web Vitals), mobile usability, indexability, sitemap, structured data, on-page optimisation.",
        },
        {
          icon: <ChartBar size={20} />,
          title: "PPC account audit",
          desc: "Google Ads and Meta ad accounts: campaign structure, keywords, ad quality, cost efficiency, conversion tracking.",
        },
        {
          icon: <Users size={20} />,
          title: "Social media audit",
          desc: "Facebook, Instagram, LinkedIn, TikTok presence: content consistency, posting cadence, engagement, creative quality.",
        },
        {
          icon: <Target size={20} />,
          title: "Content marketing review",
          desc: "Blog, YouTube, newsletter: SEO keyword coverage, content gaps, formats and frequency.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Competitor benchmarking",
          desc: "Top 3–5 competitors' positioning, ranking, ad strategy, organic visibility — directly compared to yours.",
        },
        {
          icon: <CheckCircle2 size={20} />,
          title: "KPI list & roadmap",
          desc: "Concrete, prioritised action plan: what to change in the first 30/60/90 days — with estimated impact and difficulty.",
        },
      ],
    },
    process: {
      heading: "How does the audit work?",
      steps: [
        {
          step: "1",
          title: "Apply",
          desc: "Fill in the form below in 2 minutes — company name, website, and a few questions about your goals.",
        },
        {
          step: "2",
          title: "Kick-off call",
          desc: "30-minute call where we discuss your main business goals and priorities. Clarifies what to look at deepest.",
        },
        {
          step: "3",
          title: "Data gathering & analysis",
          desc: "We request read-only access to Google Analytics, Search Console, ad accounts. We analyse over 5–7 working days.",
        },
        {
          step: "4",
          title: "Audit report",
          desc: "Structured PDF (~25–30 pages) — findings, screenshots, prioritised action list. Delivered by email.",
        },
        {
          step: "5",
          title: "Review call",
          desc: "60-minute call to walk through the report, answer all your questions, and discuss next steps.",
        },
      ],
    },
    whyFree: {
      heading: "Why is it free?",
      body:
        "Because we want to get to know your business and add value upfront — with zero commitment. There's no obligation at the end of the audit. You decide whether to implement the suggestions with your own team or work with us further. Our goal: that you walk away with a concrete, usable action plan, even if we never become business partners.",
    },
    testimonial: {
      quote:
        "The audit helped us see where we were leaking traffic. Following the suggestions, we improved organic conversion by 40% in 3 months — without spending a single forint on new ads.",
      author: "Previous audit recipient",
      role: "B2B tech company, Pécs",
    },
    formTitle: "Request your free audit",
    formSubtitle: "5 fields, 2 minutes — you'll hear back within 5–7 working days.",
    formNameLabel: "Full name",
    formCompanyLabel: "Company name",
    formEmailLabel: "Email",
    formWebsiteLabel: "Website URL",
    formMessageLabel: "What's your main challenge right now? (optional)",
    formMessagePlaceholder:
      "e.g. Traffic is stagnating, Google Ads is too expensive, we don't show up in local search...",
    formCta: "Request my free audit",
    formSubmitting: "Sending...",
    formSuccess:
      "Thank you! We'll be in touch within 1 business day to schedule the kick-off call.",
    formError: "Something went wrong. Please try again or email info@g2amarketing.hu.",
    consent: {
      before:
        "I consent to G2A Marketing Bt. processing the data provided for the purpose of preparing the audit and contacting me, as described in the",
      linkText: "Privacy Policy",
      after: ".",
    },
    finePrint:
      "The audit is fully free and commitment-free. No order required afterwards. We accept a maximum of 5 new audit requests per week to ensure depth.",
  },
  zh: {
    seoTitle: "免费营销审计 – G2A Marketing | 竞争对手分析与行动方案",
    seoDesc:
      "申请免费营销审计:网站、SEO、PPC 与社交媒体分析、竞争对手基准对比与定制化行动方案。透明、可执行的报告。",
    badge: "免费服务",
    title: "免费营销审计 — 了解您的营销现状",
    lead:
      "别再浪费营销预算。我们的免费审计将系统梳理您的在线表现,识别优劣,并给出具体优化建议。您将获得透明、可执行的报告 — 让后续决策有据可依。",
    whatsIncluded: {
      heading: "审计包含什么?",
      intro:
        "您获得 360° 全面诊断:不仅指出问题,还给出可由内部团队执行的优先级行动清单。",
      items: [
        {
          icon: <Search size={20} />,
          title: "网站与技术 SEO",
          desc: "页面速度(Core Web Vitals)、移动可用性、可索引性、Sitemap、结构化数据、On-page 优化。",
        },
        {
          icon: <ChartBar size={20} />,
          title: "PPC 账户审计",
          desc: "Google Ads 与 Meta 广告账户:活动结构、关键词、广告质量、成本效率、转化追踪。",
        },
        {
          icon: <Users size={20} />,
          title: "社交媒体审计",
          desc: "Facebook、Instagram、LinkedIn、TikTok 上的存在:内容一致性、发布节奏、互动率、创意质量。",
        },
        {
          icon: <Target size={20} />,
          title: "内容营销回顾",
          desc: "博客、YouTube、邮件:SEO 关键词覆盖、内容空缺、形式与频率。",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "竞争对手基准",
          desc: "对比您与前 3–5 家竞争对手的定位、排名、广告战略、自然可见度。",
        },
        {
          icon: <CheckCircle2 size={20} />,
          title: "KPI 清单与路线图",
          desc: "具体、优先级排序的行动计划:头 30/60/90 天的改动 — 附预估影响与难度。",
        },
      ],
    },
    process: {
      heading: "审计流程",
      steps: [
        {
          step: "1",
          title: "申请",
          desc: "下方表单 2 分钟填完 — 公司名、网站、几个目标相关问题。",
        },
        {
          step: "2",
          title: "启动通话",
          desc: "30 分钟通话,讨论主要业务目标与优先级,明确深入分析方向。",
        },
        {
          step: "3",
          title: "数据收集与分析",
          desc: "我们申请只读权限访问 Google Analytics、Search Console、广告账户。5–7 个工作日内完成分析。",
        },
        {
          step: "4",
          title: "审计报告",
          desc: "结构化 PDF(约 25–30 页)— 发现、截图、优先级行动清单。邮件送达。",
        },
        {
          step: "5",
          title: "复盘通话",
          desc: "60 分钟通话,逐项过报告、解答所有问题、讨论下一步。",
        },
      ],
    },
    whyFree: {
      heading: "为什么免费?",
      body:
        "因为我们希望先了解您的业务并提前提供价值 — 无需承诺。审计结束时没有任何强制。您可以让自己的团队执行建议,也可以选择与我们继续合作。我们的目标:即使我们从未合作,您也能带走一份具体、可用的行动方案。",
    },
    testimonial: {
      quote:
        "审计帮助我们看到流量流失点。按建议执行后,3 个月内自然转化提升了 40% — 没花一分钱投放新广告。",
      author: "曾经的审计申请者",
      role: "B2B 科技公司,佩奇",
    },
    formTitle: "申请免费审计",
    formSubtitle: "5 个字段,2 分钟 — 5–7 个工作日内收到反馈。",
    formNameLabel: "全名",
    formCompanyLabel: "公司名",
    formEmailLabel: "电子邮箱",
    formWebsiteLabel: "网站 URL",
    formMessageLabel: "目前的主要挑战是什么?(选填)",
    formMessagePlaceholder:
      "如:流量停滞、Google Ads 太贵、本地搜索找不到我们……",
    formCta: "申请我的免费审计",
    formSubmitting: "发送中...",
    formSuccess: "感谢申请!1 个工作日内我们将联系您安排启动通话。",
    formError: "出错了。请稍后重试,或邮件至 info@g2amarketing.hu。",
    consent: {
      before:
        "我同意 G2A Marketing Bt. 为准备审计与联系我之目的,按",
      linkText: "隐私政策",
      after: "处理我提供的数据。",
    },
    finePrint:
      "审计完全免费且无义务。结束后无需下单。为保证深度,我们每周最多接受 5 个新申请。",
  },
};

export default function MarketingAuditPage() {
  const { lang } = useLanguage();
  const doc = DOCS[lang];

  // Reuse the existing audit-form tRPC endpoint (audit.create on the backend
  // already handles rate limiting + admin notification + DB insert).
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const submit = trpc.audit.submit.useMutation({
    onSuccess: () => {
      setStatus("success");
      setName("");
      setCompany("");
      setEmail("");
      setWebsite("");
      setMessage("");
      setConsent(false);
    },
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus("loading");
    submit.mutate({
      name,
      company: company || undefined,
      email,
      website: website || undefined,
      currentChallenges: message || undefined,
      botField: honeypot, // honeypot — server-side AUDIT_HONEYPOT
    });
  };

  return (
    <>
      <SeoHead title={doc.seoTitle} description={doc.seoDesc} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* ── HERO + FORM ──────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "4rem 0 3rem" }}>
          <div className="g2a-container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
                gap: "3rem",
                alignItems: "start",
              }}
              className="g2a-audit-grid"
            >
              {/* Left: hero copy */}
              <div>
                <div className="g2a-section-label">{doc.badge}</div>
                <h1
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                    color: "var(--g2a-text-primary)",
                    fontFamily: "Geist, sans-serif",
                    lineHeight: 1.15,
                    marginBottom: "1.25rem",
                  }}
                >
                  {doc.title}
                </h1>
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "1.05rem",
                    lineHeight: 1.65,
                    maxWidth: "55ch",
                    marginBottom: "1.5rem",
                  }}
                >
                  {doc.lead}
                </p>
                <p
                  style={{
                    color: "var(--g2a-text-muted)",
                    fontSize: "0.78rem",
                    lineHeight: 1.55,
                    fontFamily: "Geist Mono, monospace",
                    maxWidth: "60ch",
                  }}
                >
                  {doc.finePrint}
                </p>
              </div>

              {/* Right: signup card */}
              <div>
                <h2
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--g2a-brand-teal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {doc.formTitle}
                </h2>
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.9rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {doc.formSubtitle}
                </p>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 16,
                    padding: "1.75rem",
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    name="botField"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />

                  <FormField label={doc.formNameLabel} required>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="g2a-input"
                      style={{ width: "100%" }}
                    />
                  </FormField>
                  <FormField label={doc.formCompanyLabel}>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="g2a-input"
                      style={{ width: "100%" }}
                    />
                  </FormField>
                  <FormField label={doc.formEmailLabel} required>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="g2a-input"
                      style={{ width: "100%" }}
                    />
                  </FormField>
                  <FormField label={doc.formWebsiteLabel} required>
                    <input
                      type="url"
                      required
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://"
                      className="g2a-input"
                      style={{ width: "100%" }}
                    />
                  </FormField>
                  <FormField label={doc.formMessageLabel}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={doc.formMessagePlaceholder}
                      className="g2a-input"
                      rows={3}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  </FormField>

                  <label
                    style={{
                      display: "flex",
                      gap: "0.625rem",
                      alignItems: "flex-start",
                      color: "var(--g2a-text-secondary)",
                      fontSize: "0.78rem",
                      lineHeight: 1.55,
                      marginBottom: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      style={{
                        marginTop: "0.18rem",
                        accentColor: "var(--g2a-brand-teal)",
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {doc.consent.before}{" "}
                      <Link
                        href="/adatvedelmi-iranyelvek"
                        style={{
                          color: "var(--g2a-brand-teal)",
                          textDecoration: "underline",
                        }}
                      >
                        {doc.consent.linkText}
                      </Link>
                      {doc.consent.after}
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="g2a-btn-primary"
                    disabled={status === "loading" || !consent}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {status === "loading" ? (
                      <Loader2
                        size={16}
                        style={{ animation: "spin 0.8s linear infinite" }}
                      />
                    ) : (
                      <Mail size={16} />
                    )}
                    {status === "loading" ? doc.formSubmitting : doc.formCta}
                  </button>

                  {status === "success" && (
                    <p
                      role="status"
                      style={{
                        color: "#10b981",
                        marginTop: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {doc.formSuccess}
                    </p>
                  )}
                  {status === "error" && (
                    <p
                      role="alert"
                      style={{
                        color: "#ef4444",
                        marginTop: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {doc.formError}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ──────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 1100 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              {doc.whatsIncluded.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                marginBottom: "2rem",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "62ch",
              }}
            >
              {doc.whatsIncluded.intro}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {doc.whatsIncluded.items.map((it, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 12,
                    padding: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(20,184,166,0.12)",
                      color: "var(--g2a-brand-teal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {it.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--g2a-text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {it.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--g2a-text-secondary)",
                      fontSize: "0.85rem",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {it.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ──────────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container" style={{ maxWidth: 880 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              {doc.process.heading}
            </h2>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "1rem",
              }}
            >
              {doc.process.steps.map((s, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1rem",
                    alignItems: "start",
                    background: "var(--g2a-bg-2)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 12,
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--g2a-brand-teal)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "var(--g2a-text-primary)",
                        marginBottom: "0.3rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--g2a-text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── WHY FREE ─────────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, var(--g2a-bg-2) 50%, rgba(20,184,166,0.05) 100%)",
            borderTop: "1px solid var(--g2a-border)",
            borderBottom: "1px solid var(--g2a-border)",
          }}
        >
          <div className="g2a-container" style={{ maxWidth: 720, textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {doc.whyFree.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              {doc.whyFree.body}
            </p>
          </div>
        </section>

        {/* ── TESTIMONIAL ──────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 720, textAlign: "center" }}>
            <Quote
              size={28}
              style={{
                color: "var(--g2a-brand-teal)",
                margin: "0 auto 1rem",
                opacity: 0.7,
              }}
            />
            <blockquote
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "1.15rem",
                lineHeight: 1.65,
                color: "var(--g2a-text-primary)",
                fontStyle: "italic",
                margin: "0 0 1.25rem",
              }}
            >
              „{doc.testimonial.quote}"
            </blockquote>
            <div
              style={{
                color: "var(--g2a-text-secondary)",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.85rem",
              }}
            >
              <strong style={{ color: "var(--g2a-text-primary)" }}>
                {doc.testimonial.author}
              </strong>{" "}
              · {doc.testimonial.role}
            </div>
          </div>
        </section>
      </main>
      <Footer hideNewsletter />
      <style>{`
        @media (max-width: 900px) {
          .g2a-audit-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: "0.75rem" }}>
      <span
        style={{
          display: "block",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--g2a-text-muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
