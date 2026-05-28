import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CookieBanner from "@/components/CookieBanner";
import NewsletterForm from "@/components/NewsletterForm";
import SeoHead from "@/components/SeoHead";
import Marquee from "@/components/Marquee";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import CursorSpotlight from "@/components/CursorSpotlight";
import FloatingDashboard from "@/components/FloatingDashboard";
import SectionDivider from "@/components/illustrations/SectionDivider";
import ServiceIcon from "@/components/illustrations/ServiceIcon";
import { pickLocalized } from "@/../../shared/i18n";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { parseFormError } from "@/lib/utils";
import CloudinaryImage from "@/components/CloudinaryImage";
import CalendlyEmbed, { isCalendlyConfigured } from "@/components/CalendlyEmbed";
import {
  ArrowRight, CheckCircle, ChevronRight, Play, Zap, Target, TrendingUp,
  Globe, Code, Megaphone, Search, Palette, Users, Bot, BarChart3,
  Building2, Stethoscope, Car, Wrench, Lightbulb, Scale, ShoppingBag,
  Star, Quote, Phone, Mail, Clock, Award, Shield, Rocket, Brain,
  ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────
function useRevealAll(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const el = containerRef.current;
    if (el) {
      el.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [containerRef]);
}

// ─── Stat Counter ──────────────────────────────────────────────────────────
function StatCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Data ──────────────────────────────────────────────────────────────────
// Problem cards — ikonok és slug-ok közösek, csak a szöveg lokalizált.
type Problem = { problem: string; desc: string; services: string[]; slug: string };
// Slug per problem card — drives both the link target and the custom ServiceIcon.
// Card 0/3 both link to SEO (different angle: leads vs. visibility), so the
// keresooptimalizalas slug appears twice — that's intentional, not a typo.
const PROBLEM_SLUGS = ["keresooptimalizalas", "hirdeteskezeles", "webfejlesztes", "keresooptimalizalas", "strategiai-marketing", "ai-marketing"];
const buildProblems = (
  texts: { problem: string; desc: string; services: string[] }[]
): Problem[] => texts.map((t, i) => ({ ...t, slug: PROBLEM_SLUGS[i] }));

const PROBLEMS: Record<Language, Problem[]> = {
  hu: buildProblems([
    { problem: "Nem jön elég érdeklődő", desc: "A weboldal látogatói nem konvertálnak, az ajánlatkérések száma alacsony.", services: ["SEO", "Google Ads", "Landing Page"] },
    { problem: "Nem hoz eredményt a hirdetés", desc: "Magas hirdetési költség, alacsony megtérülés, átláthatatlan riportok.", services: ["PPC Audit", "Meta Ads", "Kampányoptimalizálás"] },
    { problem: "Elavult a weboldal", desc: "Lassú, nem mobilbarát, rossz UX – elvesznek a potenciális ügyfelek.", services: ["Webfejlesztés", "UX Design", "Core Web Vitals"] },
    { problem: "Nem találnak rá a Google-ben", desc: "A versenytársak megelőznek a keresési találatokban, elvesznek az organikus látogatók.", services: ["SEO Stratégia", "Tartalommarketing", "Technikai SEO"] },
    { problem: "Nincs marketingstratégia", desc: "Ad-hoc kampányok, egységes stratégia nélkül – az erőforrások szétforgácsolódnak.", services: ["Marketing Stratégia", "Brand Pozicionálás", "Roadmap"] },
    { problem: "Nem használják ki az AI-t", desc: "A versenytársak AI-alapú eszközökkel gyorsabban és olcsóbban dolgoznak.", services: ["AI Marketing", "Automatizáció", "AI Tartalom"] },
  ]),
  en: buildProblems([
    { problem: "Not enough leads coming in", desc: "Website visitors don't convert; inquiry volume is low.", services: ["SEO", "Google Ads", "Landing Page"] },
    { problem: "Ads aren't delivering results", desc: "High ad spend, low return, opaque reporting.", services: ["PPC Audit", "Meta Ads", "Campaign Optimization"] },
    { problem: "Outdated website", desc: "Slow, not mobile-friendly, poor UX – potential clients drop off.", services: ["Web Development", "UX Design", "Core Web Vitals"] },
    { problem: "Invisible on Google", desc: "Competitors outrank you in search; organic traffic vanishes.", services: ["SEO Strategy", "Content Marketing", "Technical SEO"] },
    { problem: "No marketing strategy", desc: "Ad-hoc campaigns with no coherent strategy – resources get fragmented.", services: ["Marketing Strategy", "Brand Positioning", "Roadmap"] },
    { problem: "Not leveraging AI", desc: "Competitors using AI tools work faster and cheaper.", services: ["AI Marketing", "Automation", "AI Content"] },
  ]),
  zh: buildProblems([
    { problem: "客户线索不足", desc: "网站访客转化率低,询盘数量不足。", services: ["SEO", "Google 广告", "落地页"] },
    { problem: "广告投放效果不佳", desc: "广告成本高、回报低、报告不透明。", services: ["PPC 审核", "Meta 广告", "广告活动优化"] },
    { problem: "网站过时落伍", desc: "加载慢、移动端体验差、UX 糟糕 —— 潜在客户流失。", services: ["网站开发", "UX 设计", "Core Web Vitals"] },
    { problem: "Google 搜索找不到您", desc: "竞争对手排名靠前,自然流量流失。", services: ["SEO 战略", "内容营销", "技术性 SEO"] },
    { problem: "缺乏营销战略", desc: "临时性活动缺乏统一战略 —— 资源分散浪费。", services: ["营销战略", "品牌定位", "路线图"] },
    { problem: "未充分利用 AI", desc: "竞争对手使用 AI 工具,更快更省。", services: ["AI 营销", "自动化", "AI 内容"] },
  ]),
};

// Industries — ikonok közösek, label t() kulcsból, count szám + közös suffix.
type Industry = { icon: React.ReactNode; labelKey: string; slug: string; count: number };
const INDUSTRIES: Industry[] = [
  { icon: <Stethoscope size={22} />, labelKey: "industry.healthcare", slug: "marketing-egeszsegugyi-cegeknek", count: 40 },
  { icon: <ShoppingBag size={22} />, labelKey: "industry.beauty", slug: "marketing-szepsegipari-cegeknek", count: 25 },
  { icon: <Wrench size={22} />, labelKey: "industry.engineering", slug: "marketing-mernoki-irodaknak", count: 30 },
  { icon: <Car size={22} />, labelKey: "industry.automotive", slug: "marketing-autoipari-cegeknek", count: 20 },
  { icon: <Scale size={22} />, labelKey: "industry.legal", slug: "marketing-ugyvedii-irodaknak", count: 15 },
  { icon: <Code size={22} />, labelKey: "industry.technology", slug: "marketing-technologiai-cegeknek", count: 35 },
  { icon: <Lightbulb size={22} />, labelKey: "industry.government", slug: "marketing-onkormanyzati-projekteknek", count: 10 },
  { icon: <Building2 size={22} />, labelKey: "industry.b2b", slug: "marketing-b2b-cegeknek", count: 50 },
];

// AI features
type AiFeature = { icon: React.ReactNode; title: string; desc: string };
const AI_ICONS = [<Bot size={20} />, <Search size={20} />, <BarChart3 size={20} />, <TrendingUp size={20} />, <Zap size={20} />, <Globe size={20} />];
const buildAi = (rows: { title: string; desc: string }[]): AiFeature[] => rows.map((r, i) => ({ ...r, icon: AI_ICONS[i] }));

const AI_FEATURES: Record<Language, AiFeature[]> = {
  hu: buildAi([
    { title: "AI Tartalomgyártás", desc: "Gyorsabb, SEO-optimalizált tartalom generálás AI segítségével" },
    { title: "AI SEO Elemzés", desc: "Automatikus kulcsszókutatás és versenytárs-elemzés" },
    { title: "Kampányoptimalizálás", desc: "Valós idejű AI-alapú bid management és targeting" },
    { title: "Prediktív Reporting", desc: "Előrejelzések és automatikus teljesítmény-riportok" },
    { title: "Workflow Automatizáció", desc: "Ismétlődő feladatok automatizálása, több idő a stratégiára" },
    { title: "Nemzetközi Kommunikáció", desc: "AI-alapú fordítás és lokalizáció 20+ nyelven" },
  ]),
  en: buildAi([
    { title: "AI Content Production", desc: "Faster, SEO-optimized content generation with AI" },
    { title: "AI SEO Analysis", desc: "Automated keyword research and competitor analysis" },
    { title: "Campaign Optimization", desc: "Real-time AI bid management and targeting" },
    { title: "Predictive Reporting", desc: "Forecasts and automated performance reports" },
    { title: "Workflow Automation", desc: "Automate repetitive tasks — more time for strategy" },
    { title: "International Communication", desc: "AI-powered translation and localization in 20+ languages" },
  ]),
  zh: buildAi([
    { title: "AI 内容生产", desc: "借助 AI 更快地生成 SEO 优化内容" },
    { title: "AI SEO 分析", desc: "自动关键词研究与竞争对手分析" },
    { title: "广告活动优化", desc: "实时 AI 出价管理与定向投放" },
    { title: "预测性报告", desc: "预测分析与自动化绩效报告" },
    { title: "工作流自动化", desc: "自动化重复任务,把时间留给战略" },
    { title: "国际化沟通", desc: "支持 20+ 语言的 AI 翻译与本地化" },
  ]),
};

// Why us
type Reason = { icon: React.ReactNode; title: string; desc: string };
const WHY_ICONS = [<Brain size={20} />, <Zap size={20} />, <Globe size={20} />, <Bot size={20} />, <Shield size={20} />, <Award size={20} />, <Users size={20} />, <Target size={20} />];
const buildReasons = (rows: { title: string; desc: string }[]): Reason[] => rows.map((r, i) => ({ ...r, icon: WHY_ICONS[i] }));

const WHY_US: Record<Language, Reason[]> = {
  hu: buildReasons([
    { title: "Stratégiai gondolkodás", desc: "Nem csak kivitelezünk – üzleti célokat érünk el" },
    { title: "Gyors reakcióidő", desc: "24 órán belül válaszolunk minden megkeresésre" },
    { title: "Nemzetközi tapasztalat", desc: "Több mint 10 országban szerzett marketing tapasztalat" },
    { title: "AI-alapú működés", desc: "Minden folyamatunkba integrálva van az AI" },
    { title: "Átlátható riportok", desc: "Heti és havi részletes teljesítmény-riportok" },
    { title: "Teljes ökoszisztéma", desc: "Stratégiától a kivitelezésig – egy kézből" },
    { title: "Több iparági tapasztalat", desc: "8+ iparágban bizonyított eredmények" },
    { title: "Mérhető eredmények", desc: "Minden kampánynál KPI-alapú célkitűzések" },
  ]),
  en: buildReasons([
    { title: "Strategic thinking", desc: "We don't just execute — we deliver on business goals" },
    { title: "Fast response time", desc: "We reply to every inquiry within 24 hours" },
    { title: "International experience", desc: "Marketing experience gained across 10+ countries" },
    { title: "AI-powered operations", desc: "AI is integrated into every process we run" },
    { title: "Transparent reports", desc: "Detailed weekly and monthly performance reports" },
    { title: "Complete ecosystem", desc: "From strategy to execution — all from one place" },
    { title: "Multi-industry expertise", desc: "Proven results across 8+ industries" },
    { title: "Measurable results", desc: "Every campaign driven by KPI-based goals" },
  ]),
  zh: buildReasons([
    { title: "战略思维", desc: "我们不只是执行者 —— 而是业务目标的实现者" },
    { title: "快速响应", desc: "每一条咨询 24 小时内回复" },
    { title: "国际化经验", desc: "在 10 多个国家积累的营销经验" },
    { title: "AI 驱动的运营", desc: "AI 融入我们的每一个工作流程" },
    { title: "透明的报告", desc: "每周和每月详细的绩效报告" },
    { title: "完整的生态", desc: "从战略到执行 —— 一站式服务" },
    { title: "跨行业经验", desc: "在 8+ 行业中取得的可靠成果" },
    { title: "可衡量的成果", desc: "每个营销活动都设定 KPI 目标" },
  ]),
};

// Audit checklist items
const AUDIT_ITEMS: Record<Language, string[]> = {
  hu: [
    "Weboldal technikai állapota (Core Web Vitals, sebesség)",
    "SEO jelenlét és kulcsszó pozíciók",
    "Google Ads és Meta kampányok hatékonysága",
    "Közösségi média jelenlét és engagement",
    "Versenytárs-elemzés és piaci pozíció",
    "Konverziós ráta és UX problémák",
  ],
  en: [
    "Website technical state (Core Web Vitals, speed)",
    "SEO presence and keyword rankings",
    "Effectiveness of Google Ads and Meta campaigns",
    "Social media presence and engagement",
    "Competitor analysis and market position",
    "Conversion rate and UX issues",
  ],
  zh: [
    "网站技术状态(Core Web Vitals、加载速度)",
    "SEO 表现与关键词排名",
    "Google Ads 与 Meta 广告效果分析",
    "社交媒体表现与用户互动",
    "竞争对手分析与市场定位",
    "转化率与用户体验问题",
  ],
};

// FAQs
type Faq = { q: string; a: string };
const FAQS: Record<Language, Faq[]> = {
  hu: [
    { q: "Mennyi idő alatt láthatók az eredmények?", a: "SEO esetén 3–6 hónap, PPC kampányoknál 2–4 hét alatt mérhető eredmények jelennek meg. Az ingyenes audit során pontosabb becslést adunk." },
    { q: "Milyen méretű cégeknek dolgoztok?", a: "KKV-któl nagyvállalatig minden méretű ügyféllel dolgozunk. Tapasztalatunk van egyszemélyes vállalkozásoktól multinacionális cégekig." },
    { q: "Mi az ingyenes marketing audit folyamata?", a: "Kitöltöd az audit kérő űrlapot, 24 órán belül felvesszük veled a kapcsolatot, majd 5–7 munkanapon belül elkészítjük a részletes auditot." },
    { q: "Hogyan méritek a kampányok sikerét?", a: "Minden kampányhoz egyedi KPI-okat határozunk meg (ROAS, CPA, CTR, konverziós ráta stb.) és heti/havi riportokban számolunk be az eredményekről." },
    { q: "Dolgoztok nemzetközi piacokon is?", a: "Igen, több mint 10 országban van tapasztalatunk. Lokalizáció, multilingual SEO és nemzetközi PPC kampányok terén egyaránt segítünk." },
  ],
  en: [
    { q: "How soon can results be seen?", a: "SEO typically shows measurable results in 3–6 months; PPC campaigns in 2–4 weeks. We provide more precise estimates during the free audit." },
    { q: "What size companies do you work with?", a: "We work with clients of all sizes — from SMEs to large enterprises, including sole proprietors and multinationals." },
    { q: "What does the free marketing audit involve?", a: "You fill out the audit request form, we contact you within 24 hours, and deliver a detailed audit within 5–7 business days." },
    { q: "How do you measure campaign success?", a: "We define custom KPIs for each campaign (ROAS, CPA, CTR, conversion rate, etc.) and report results weekly and monthly." },
    { q: "Do you work in international markets?", a: "Yes, we have experience in 10+ countries. We help with localization, multilingual SEO and international PPC campaigns." },
  ],
  zh: [
    { q: "多久能看到效果?", a: "SEO 一般在 3–6 个月内见效,PPC 广告活动 2–4 周内可见成效。免费评估时可给出更精确的预期。" },
    { q: "你们服务什么规模的公司?", a: "从中小企业到大型集团,我们服务各种规模的客户 —— 个人创业者到跨国公司都有合作经验。" },
    { q: "免费营销评估的流程是什么?", a: "您填写评估申请表,我们 24 小时内联系您,5–7 个工作日内交付详细评估报告。" },
    { q: "你们如何衡量营销活动的成效?", a: "为每个活动设定专属 KPI(ROAS、CPA、CTR、转化率等),并通过每周/每月报告汇报成果。" },
    { q: "你们服务国际市场吗?", a: "是的,我们在 10 多个国家有经验,提供本地化、多语种 SEO 以及国际化 PPC 营销活动支持。" },
  ],
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useRevealAll(pageRef);

  // Hero pinned-fade: as the user scrolls past the hero, content scales+fades out
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);
  const heroY = useTransform(heroProgress, [0, 1], [0, -60]);

  const { data: seoData } = trpc.content.pageSeo.useQuery({ slug: "fooldal" });
  const { data: testimonialsList } = trpc.content.testimonials.useQuery();
  const { data: partnersList } = trpc.content.partners.useQuery();
  // Real case studies from DB, ordered by sortOrder. We feature the top 3 on
  // the home page — admin can change which 3 by editing sortOrder in /admin.
  const { data: caseStudiesAll } = trpc.content.caseStudies.useQuery();
  const featuredCases = (caseStudiesAll || [])
    .filter(cs => cs.isActive)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 3);

  const { lang, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lokalizált adatok a kiválasztott nyelv alapján
  const problems = PROBLEMS[lang];
  const aiFeatures = AI_FEATURES[lang];
  const whyUs = WHY_US[lang];
  const auditItems = AUDIT_ITEMS[lang];
  const faqs = FAQS[lang];

  return (
    <>
      <SeoHead
        title={seoData?.metaTitle || "G2A Marketing – Adatvezérelt B2B Marketing Ügynökség | Pécs"}
        description={seoData?.metaDescription || "Stratégiai marketing, AI-alapú megoldások és mérhető növekedés. SEO, PPC, webfejlesztés és teljes marketing ökoszisztéma B2B cégeknek."}
      />
      <ScrollProgressBar />
      <Navigation />
      <CookieBanner />

      <div ref={pageRef}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section ref={heroRef} style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          backgroundColor: "transparent",
          position: "relative", overflow: "hidden",
          paddingTop: "6rem",
        }}>
          {/* Animated gradient blobs */}
          <AnimatedBlobs />

          {/* Cursor-following spotlight */}
          <CursorSpotlight size={560} />

          {/* Subtle grid pattern */}
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.35, zIndex: 0 }} />

          {/* Floating dashboard collage (right side, desktop only) */}
          <FloatingDashboard />

          <motion.div
            className="g2a-container"
            style={{ position: "relative", zIndex: 2, padding: "4rem 1.5rem", opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            <div style={{ maxWidth: "820px" }}>
              <div className="g2a-section-label animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                {t("home.hero.badge")}
              </div>

              {/* Hero H1 is rendered as plain text (no RevealText word-stagger)
                   so it's visible on first paint and Lighthouse can detect it
                   as the LCP candidate. The previous opacity:0 initial state
                   confused the LCP detector — no element was visible enough
                   to qualify, producing a NO_LCP error in PageSpeed Insights.
                   Sub-hero content still uses RevealText / fadeInUp for visual
                   polish; only the LCP-critical headline is plain. */}
              <h1 className="g2a-headline-xl" style={{ marginBottom: "1.5rem" }}>
                {t("home.hero.title1")}{" "}
                <span className="g2a-gradient-text">{t("home.hero.title2")}</span>
              </h1>

              <p style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
                color: "var(--g2a-text-secondary)", lineHeight: "1.7",
                maxWidth: "640px", marginBottom: "2.5rem",
                fontFamily: "Geist, sans-serif",
              }}>
                {t("home.hero.subtitle")}
              </p>

              <div className="animate-fadeInUp" style={{ animationDelay: "0.5s", display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
                <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                  <MagneticButton strength={14}>
                    <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                      {t("nav.freeAuditFull")} <ArrowRight size={18} />
                    </span>
                  </MagneticButton>
                </Link>
                <Link href="/referenciak" style={{ textDecoration: "none" }}>
                  <MagneticButton strength={10}>
                    <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                      <Play size={16} /> {t("hero.cta2")}
                    </span>
                  </MagneticButton>
                </Link>
              </div>

              {/* Trust stats */}
              {/* Verified-only trust stats — based on actual partner list at g2amarketing.hu */}
              <div className="animate-fadeIn" style={{
                animationDelay: "0.65s",
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem",
                maxWidth: "460px",
              }}>
                {[
                  { num: 23, suffix: "", label: t("home.stats.partners") },
                  { num: 8, suffix: "+", label: t("home.stats.industries") },
                  { num: 0, suffix: "", label: t("home.stats.foundedSince"), staticText: "2022" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div className="g2a-stat-number">
                      {s.staticText ? s.staticText : <StatCounter target={s.num} suffix={s.suffix} />}
                    </div>
                    <div className="g2a-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            color: "var(--g2a-text-muted)", fontSize: "0.75rem", fontFamily: "Geist Mono, monospace",
            letterSpacing: "0.1em", textTransform: "uppercase",
            animation: "float 2.5s ease-in-out infinite",
          }}>
            <span>{t("home.hero.scrollHint")}</span>
            <ChevronDown size={16} />
          </div>
        </section>

        {/* ── PARTNER LOGOS ─────────────────────────────────────────────── */}
        {partnersList && partnersList.length > 0 && (
          <section style={{
            padding: "2.5rem 0",
            backgroundColor: "var(--g2a-bg-2)",
            borderTop: "1px solid var(--g2a-border)",
            borderBottom: "1px solid var(--g2a-border)",
          }}>
            <Marquee speed={50} gap={48}>
              {partnersList.map((p, i) => (
                <div
                  key={i}
                  className="g2a-marquee-item"
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}
                >
                  {p.logo ? (
                    <img src={p.logo} alt={p.logoAlt || p.name} style={{ height: "32px", width: "auto", maxWidth: "120px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-secondary)", whiteSpace: "nowrap" }}>{p.name}</span>
                  )}
                </div>
              ))}
            </Marquee>
          </section>
        )}

        <SectionDivider variant="dots" label={t("home.targetAudience.label")} />

        {/* ── KINEK SEGÍTÜNK ────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">{t("home.targetAudience.label")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                {t("home.targetAudience.title")}
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                {t("home.targetAudience.desc")}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {INDUSTRIES.map((ind, i) => (
                <Link key={ind.slug} href={`/iparagi/${ind.slug}`} style={{ textDecoration: "none" }}>
                  <div className={`g2a-card reveal reveal-delay-${(i % 4) + 1}`} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="g2a-icon-box">{ind.icon}</div>
                    <div>
                      <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{t(ind.labelKey)}</div>
                      <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", color: "var(--g2a-brand-teal)", letterSpacing: "0.05em" }}>{ind.count}+ {t("common.projectsSuffix")}</div>
                    </div>
                    <ChevronRight size={16} style={{ marginLeft: "auto", color: "var(--g2a-text-muted)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLÉMA-ALAPÚ SZOLGÁLTATÁSOK ────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">{t("home.solutions.label")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                {t("home.solutions.title")}
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                {t("home.solutions.desc")}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {problems.map((p, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <div className="g2a-icon-box-lg"><ServiceIcon slug={p.slug} size={26} /></div>
                    <div>
                      <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{p.problem}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6", margin: 0 }}>{p.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {p.services.map((s, j) => <span key={j} className="g2a-tag-neutral">{s}</span>)}
                  </div>
                  <Link href={`/szolgaltatasok/${p.slug}`} style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-ghost" style={{ padding: "0.5rem 0", fontSize: "0.875rem" }}>
                      {t("home.solutions.viewSolution")} <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ESETTANULMÁNYOK — DB-driven, real partners ─────────────────── */}
        {featuredCases.length > 0 && (
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div className="g2a-section-label reveal">{t("home.cases.label")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ marginBottom: "0.5rem" }}>
                  {t("home.cases.title")}
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2">
                  {t("home.cases.subtitle")}
                </p>
              </div>
              <Link href="/referenciak" style={{ textDecoration: "none" }} className="reveal">
                <span className="g2a-btn-secondary" style={{ fontSize: "0.875rem" }}>
                  {t("home.allReferences")} <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {featuredCases.map((cs, i) => {
                const accentColors = ["#10b981", "#3b82f6", "#8b5cf6"];
                const color = accentColors[i % accentColors.length];
                const csTitle = pickLocalized(cs, "title", lang);
                const csClient = pickLocalized(cs, "client", lang);
                const csIndustry = pickLocalized(cs, "industry", lang);
                const csChallenge = pickLocalized(cs, "challenge", lang);
                let tags: string[] = [];
                try { tags = JSON.parse(cs.tags || "[]"); } catch { tags = []; }
                const challengeShort = csChallenge && csChallenge.length > 140 ? csChallenge.slice(0, 140) + "…" : csChallenge;
                return (
                  <Link key={cs.id} href={`/referenciak/${cs.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div className={`g2a-card reveal reveal-delay-${i + 1}`} style={{ position: "relative", overflow: "hidden", padding: 0, height: "100%", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: color, zIndex: 2 }} />
                      {/* Hero strip with screenshot + logo overlay */}
                      {cs.featuredImage && (
                        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: `linear-gradient(135deg, ${color}18, var(--g2a-tile))` }}>
                          <CloudinaryImage src={cs.featuredImage} alt={cs.featuredImageAlt || csTitle} widths={[480, 768, 1024]} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", opacity: 0.85 }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
                          {cs.logoImage && (
                            <div style={{ position: "absolute", left: 12, bottom: 12, width: 52, height: 52, padding: 7, borderRadius: 10, background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 24px -8px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CloudinaryImage src={cs.logoImage} alt={cs.logoImageAlt || `${csClient} logó`} width={52} height={52} widths={[52, 104]} sizes="52px" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                            </div>
                          )}
                        </div>
                      )}
                      {/* Body */}
                      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                        <div>
                          <span style={{ display: "inline-block", padding: "0.2rem 0.625rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", backgroundColor: `${color}18`, color, marginBottom: "0.5rem" }}>
                            {csIndustry || "Marketing"}
                          </span>
                          <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--g2a-text-primary)", margin: 0, lineHeight: 1.3 }}>
                            {csClient || csTitle}
                          </h3>
                        </div>
                        {challengeShort && (
                          <p style={{ fontSize: "0.85rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: 1.6, flexGrow: 1 }}>
                            {challengeShort}
                          </p>
                        )}
                        {tags.length > 0 && (
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "auto", paddingTop: "0.5rem" }}>
                            {tags.slice(0, 3).map((tag, j) => (
                              <span key={j} className="g2a-tag-neutral" style={{ fontSize: "0.68rem" }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        )}

        <SectionDivider variant="wave" />

        {/* ── AI & INNOVÁCIÓ ────────────────────────────────────────────── */}
        {/* Theme-aware section background: dark mode gets a deep violet→teal hint
            via CSS class, light mode falls back to the standard surface var. */}
        <section className="g2a-section g2a-ai-section" style={{
          borderTop: "1px solid rgba(20,184,166,0.15)",
          borderBottom: "1px solid rgba(20,184,166,0.15)",
        }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">{t("home.ai.label")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">
                  {t("home.ai.title")}
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ marginBottom: "2rem" }}>
                  {t("home.ai.desc")}
                </p>
                <div className="reveal reveal-delay-3">
                  <Link href="/szolgaltatasok/ai-marketing" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-primary">
                      {t("home.ai.cta")} <ArrowRight size={16} />
                    </span>
                  </Link>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {aiFeatures.map((f, i) => (
                  <div key={i} className={`g2a-card-accent reveal reveal-delay-${(i % 3) + 1}`}>
                    <div style={{ color: "var(--g2a-brand-teal)", marginBottom: "0.75rem" }}>{f.icon}</div>
                    <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: "1.5" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MIÉRT MINKET ─────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">{t("home.whyUs.label")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                {t("home.whyUs.title")}
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                {t("home.whyUs.desc")}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {whyUs.map((w, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 4) + 1}`} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{w.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{w.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INGYENES AUDIT ────────────────────────────────────────────── */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">{t("audit.sectionLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">
                  {t("nav.freeAuditFull")}
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ marginBottom: "2rem" }}>
                  {t("home.audit.desc")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }} className="reveal reveal-delay-3">
                  {auditItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle size={16} style={{ color: "var(--g2a-brand-teal)", flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "Geist, sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="g2a-card reveal reveal-delay-2" style={{ padding: "2.5rem" }}>
                <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.375rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>
                  {t("home.audit.cta")}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", marginBottom: "1.75rem" }}>
                  {t("home.audit.followup")}
                </p>
                <AuditForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        {testimonialsList && testimonialsList.length > 0 && (
          <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
            <div className="g2a-container">
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <div className="g2a-section-label reveal">{t("home.testimonials.label")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  {t("home.testimonials.title")}
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {testimonialsList.slice(0, 3).map((t, i) => (
                  <div key={t.id} className={`g2a-card reveal reveal-delay-${i + 1}`}>
                    <Quote size={28} style={{ color: "var(--g2a-brand-teal)", marginBottom: "1rem", opacity: 0.7 }} />
                    <p style={{ fontSize: "0.95rem", color: "var(--g2a-text-secondary)", lineHeight: "1.75", marginBottom: "1.5rem", fontStyle: "italic" }}>
                      "{t.quote}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        backgroundColor: "rgba(20,184,166,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--g2a-brand-teal)",
                      }}>
                        {t.authorName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)" }}>{t.authorName}</div>
                        {t.authorCompany && <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>{t.authorCompany}</div>}
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div className="g2a-section-label reveal">{t("home.faq.label")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  {t("home.faq.title")}
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {faqs.map((faq, i) => (
                  <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ padding: "1.25rem 1.5rem", cursor: "pointer" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                      <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--g2a-text-primary)", margin: 0 }}>{faq.q}</h3>
                      <div style={{ color: "var(--g2a-brand-teal)", flexShrink: 0 }}>
                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    {openFaq === i && (
                      <p style={{ marginTop: "0.875rem", fontSize: "0.9rem", color: "var(--g2a-text-secondary)", lineHeight: "1.7", marginBottom: 0 }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
        <section className="g2a-section-sm" style={{
          backgroundColor: "transparent",
          borderTop: "1px solid var(--g2a-border)",
        }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
              <div className="g2a-section-label reveal">{t("home.newsletter.label")}</div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>
                {t("home.newsletter.title")}
              </h2>
              <p className="reveal reveal-delay-2" style={{ color: "var(--g2a-text-secondary)", marginBottom: "1.75rem", fontSize: "0.95rem" }}>
                {t("home.newsletter.desc")}
              </p>
              <div className="reveal reveal-delay-3">
                <NewsletterForm variant="compact" />
                <p
                  style={{
                    color: "var(--g2a-text-muted)",
                    fontSize: "0.75rem",
                    marginTop: "0.875rem",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {t("newsletter.bandFinePrint")}{" "}
                  <a
                    href="/hirlevel"
                    style={{ color: "var(--g2a-brand-teal)", textDecoration: "underline" }}
                  >
                    {t("home.newsletter.morePrefs")}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BOTTOM ───────────────────────────────────────────────── */}
        <section className="g2a-section" style={{
          background: "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, var(--g2a-bg) 50%, rgba(20,184,166,0.05) 100%)",
          borderTop: "1px solid var(--g2a-border)",
        }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1.25rem" }}>
              {t("home.finalCta.title")}
            </h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              {t("home.finalCta.desc")}
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  {t("common.freeAudit")} <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  <Phone size={16} /> {t("common.contactUs")}
                </span>
              </Link>
            </div>
            <div className="reveal reveal-delay-3" style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
              {[
                { icon: <Phone size={14} />, text: "+36 30 190 2575" },
                { icon: <Mail size={14} />, text: "info@g2amarketing.hu" },
                { icon: <Clock size={14} />, text: "08:00 – 17:00" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", fontFamily: "Geist, sans-serif" }}>
                  <span style={{ color: "var(--g2a-brand-teal)" }}>{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <StickyAuditCTA />

      <Footer />
    </>
  );
}

// ─── Audit Form ────────────────────────────────────────────────────────────
function AuditForm() {
  const { t } = useLanguage();
  // `website` is a honeypot — never visible, must stay empty for the submission to pass.
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [errorMsg, setErrorMsg] = useState<string>("");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => { setStatus("success"); setErrorMsg(""); },
    onError: (err) => { setStatus("error"); setErrorMsg(parseFormError(err, t("common.tryAgainError"))); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      setStatus("error");
      setErrorMsg(t("contact.errorMessageMin"));
      return;
    }
    setErrorMsg("");
    setStatus("loading");
    contactMutation.mutate({ ...form, subject: "Ingyenes Marketing Audit kérés" });
  };

  if (status === "success") {
    const calendlyOn = isCalendlyConfigured();
    return (
      <div style={{ padding: "1.5rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: calendlyOn ? "1.5rem" : 0 }}>
          <CheckCircle size={48} style={{ color: "#10b981", margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{t("home.audit.thanks")}</h3>
          <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>{t("home.audit.thanksDesc")}</p>
        </div>
        {calendlyOn && (
          <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--g2a-border)" }}>
            <p style={{ textAlign: "center", color: "var(--g2a-text-secondary)", fontSize: "0.85rem", marginBottom: "1rem", fontFamily: "Geist Mono, monospace" }}>
              {t("contact.calendlyHintAfterAudit")}
            </p>
            <CalendlyEmbed
              prefill={{ name: form.name, email: form.email }}
              height={620}
              hideEventTypeDetails={false}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Honeypot — invisible to users, traps bots that auto-fill all fields */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className="g2a-label">{t("common.name")} *</label>
          <input className="g2a-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t("home.audit.namePlaceholder")} />
        </div>
        <div>
          <label className="g2a-label">{t("common.email")} *</label>
          <input className="g2a-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@ceg.hu" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className="g2a-label">{t("common.phone")}</label>
          <input className="g2a-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30..." />
        </div>
        <div>
          <label className="g2a-label">{t("home.audit.companyLabel")}</label>
          <input className="g2a-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder={t("home.audit.companyPlaceholder")} />
        </div>
      </div>
      <div>
        <label className="g2a-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span>{t("home.audit.messageLabel")}</span>
          <span aria-live="polite" style={{
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.7rem",
            color: form.message.trim().length > 0 && form.message.trim().length < 10
              ? "#ef4444"
              : form.message.trim().length >= 10
              ? "var(--g2a-text-secondary)"
              : "var(--g2a-text-muted)",
          }}>
            {form.message.trim().length} / 10
          </span>
        </label>
        <textarea
          className="g2a-input"
          rows={3}
          minLength={10}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={t("home.audit.messagePlaceholder")}
          style={{
            resize: "vertical",
            borderColor: form.message.trim().length > 0 && form.message.trim().length < 10 ? "rgba(239,68,68,0.55)" : undefined,
          }}
        />
      </div>
      <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center" }}>
        {status === "loading" ? t("home.audit.submitting") : t("home.audit.submit")}
      </button>
      {status === "error" && <p style={{ color: "#ef4444", fontSize: "0.875rem", textAlign: "center", whiteSpace: "pre-line" }}>{errorMsg || t("common.tryAgainError")}</p>}
    </form>
  );
}

// ─── Sticky CTA ────────────────────────────────────────────────────────────
function StickyAuditCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta">
      <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
        <span className="g2a-btn-primary animate-pulse-red" style={{ fontSize: "0.875rem", padding: "0.875rem 1.5rem", borderRadius: "50px" }}>
          <Zap size={15} /> Ingyenes Audit
        </span>
      </Link>
    </div>
  );
}
