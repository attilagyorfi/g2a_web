import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import AboutHeroDemo from "@/components/page-demos/AboutHeroDemo";
import ProcessIllustration from "@/components/illustrations/ProcessIllustration";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { ArrowRight, Target, Brain, Globe, Zap, Shield, Award } from "lucide-react";
import { useEffect, useRef } from "react";

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const el = ref.current;
    if (el) el.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => disconnect(observer);
  }, [ref]);
}
function disconnect(o: IntersectionObserver) { o.disconnect(); }

// ─── Localised data ─────────────────────────────────────────────────────────
type TeamMember = { name: string; role: string; desc: string; initial: string; image?: string };

// Cloudinary URLs — populate via `node scripts/upload-team-portraits.mjs <attila.jpg> <bence.jpg>`.
// Until uploaded, the page falls back to the initial-letter avatar (graceful degrade via <img onError>).
const PORTRAIT_ATTILA = "https://res.cloudinary.com/dzh1unb6d/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/g2a/team/gyorfi-attila.jpg";
const PORTRAIT_BENCE = "https://res.cloudinary.com/dzh1unb6d/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/g2a/team/rado-bence.jpg";

const TEAM: Record<Language, TeamMember[]> = {
  hu: [
    {
      name: "Győrfi Attila",
      role: "Alapító & Marketing Vezető",
      desc: "Közgazdász, marketing szakember. Az IBS Budapest, a PTE Közgazdaságtudományi Kar és a Varsói Egyetem vendégoktatója. ESG specialista.",
      initial: "GY",
      image: PORTRAIT_ATTILA,
    },
    {
      name: "Radó Bence",
      role: "Tartalom és AI Specialista",
      desc: "AI-alapú tartalomgyártás, prompt-engineering és kreatív szövegírás. Részletes bemutatkozás hamarosan.",
      initial: "RB",
      image: PORTRAIT_BENCE,
    },
  ],
  en: [
    {
      name: "Attila Győrfi",
      role: "Founder & Marketing Lead",
      desc: "Economist and marketing professional. Guest lecturer at IBS Budapest, the University of Pécs Faculty of Economics, and the University of Warsaw. ESG specialist.",
      initial: "GY",
      image: PORTRAIT_ATTILA,
    },
    {
      name: "Bence Radó",
      role: "Content & AI Specialist",
      desc: "AI-powered content production, prompt engineering and creative copywriting. Full bio coming soon.",
      initial: "RB",
      image: PORTRAIT_BENCE,
    },
  ],
  zh: [
    {
      name: "Győrfi Attila (阿提拉)",
      role: "创始人兼营销负责人",
      desc: "经济学家、营销专家。IBS 布达佩斯、佩奇大学经济学院及华沙大学的客座讲师。ESG 可持续性专家。",
      initial: "GY",
      image: PORTRAIT_ATTILA,
    },
    {
      name: "Radó Bence (本采)",
      role: "内容与 AI 专家",
      desc: "AI 驱动的内容生产、提示工程与创意文案。详细介绍即将推出。",
      initial: "RB",
      image: PORTRAIT_BENCE,
    },
  ],
};

type Value = { icon: React.ReactNode; title: string; desc: string };
const VALUE_ICONS = [<Target size={20} />, <Brain size={20} />, <Globe size={20} />, <Zap size={20} />, <Shield size={20} />, <Award size={20} />];
const buildValues = (rows: { title: string; desc: string }[]): Value[] => rows.map((r, i) => ({ ...r, icon: VALUE_ICONS[i] }));

const VALUES_LIST: Record<Language, Value[]> = {
  hu: buildValues([
    { title: "Eredményorientált", desc: "Minden döntésünket az üzleti eredmény vezérli, nem a látszat." },
    { title: "Stratégiai gondolkodás", desc: "Nem csak kivitelezünk – üzleti stratégiát alkotunk." },
    { title: "Globális szemlélet", desc: "Lokális tudás, nemzetközi tapasztalat." },
    { title: "Agilis működés", desc: "Gyors reakcióidő és rugalmas alkalmazkodás." },
    { title: "Átláthatóság", desc: "Részletes riportok, nyílt kommunikáció." },
    { title: "Minőség", desc: "Prémium minőség minden projektnél, kompromisszumok nélkül." },
  ]),
  en: buildValues([
    { title: "Results-oriented", desc: "Every decision is driven by business outcomes, not appearances." },
    { title: "Strategic thinking", desc: "We don't just execute — we build business strategy." },
    { title: "Global perspective", desc: "Local knowledge, international experience." },
    { title: "Agile operations", desc: "Fast response time and flexible adaptation." },
    { title: "Transparency", desc: "Detailed reports, open communication." },
    { title: "Quality", desc: "Premium quality on every project, no compromises." },
  ]),
  zh: buildValues([
    { title: "结果导向", desc: "每一项决策都以业务成果为导向,而非表面功夫。" },
    { title: "战略思维", desc: "我们不只是执行者 —— 而是战略的构建者。" },
    { title: "全球视野", desc: "本地智慧,国际经验。" },
    { title: "敏捷运作", desc: "快速响应,灵活适应。" },
    { title: "透明公开", desc: "详细的报告,开放的沟通。" },
    { title: "优质品质", desc: "每一个项目都追求优质,绝不妥协。" },
  ]),
};

type Milestone = { year: string; event: string };
const MILESTONES: Record<Language, Milestone[]> = {
  hu: [
    { year: "2022", event: "G2A Marketing megalapítása Pécsett – első partnerek: Vidashop, GRB Skin Clinic" },
    { year: "2022", event: "Első 10 partner, egészségügyi és szépségipari specializáció" },
    { year: "2023", event: "Bővülés: autóipari és vendéglátóipari ügyfelek (Honda, Nissan, Café Frei, Tüke Busz)" },
    { year: "2023", event: "Közösségi média és Google Ads divízió elindítása" },
    { year: "2024", event: "AI-alapú marketing eszközök integrálása a folyamatokba" },
    { year: "2024", event: "20+ aktív partner, 8 iparág, mérhető ROI eredmények" },
    { year: "2025", event: "SEO és tartalommarketing divízió, 23+ partner" },
    { year: "2025", event: "Ingyenes SEO Audit eszköz és B2B lead generálási program" },
  ],
  en: [
    { year: "2022", event: "G2A Marketing founded in Pécs – first partners: Vidashop, GRB Skin Clinic" },
    { year: "2022", event: "First 10 partners, healthcare and beauty industry specialisation" },
    { year: "2023", event: "Expansion: automotive and hospitality clients (Honda, Nissan, Café Frei, Tüke Busz)" },
    { year: "2023", event: "Launch of social media and Google Ads division" },
    { year: "2024", event: "Integration of AI-powered marketing tools into workflows" },
    { year: "2024", event: "20+ active partners, 8 industries, measurable ROI results" },
    { year: "2025", event: "SEO and content marketing division, 23+ partners" },
    { year: "2025", event: "Free SEO Audit tool and B2B lead generation programme" },
  ],
  zh: [
    { year: "2022", event: "G2A Marketing 在佩奇成立 —— 首批合作伙伴:Vidashop、GRB Skin Clinic" },
    { year: "2022", event: "首批 10 家合作伙伴,专注医疗健康与美容行业" },
    { year: "2023", event: "拓展至汽车与餐饮行业(Honda、Nissan、Café Frei、Tüke Busz)" },
    { year: "2023", event: "社交媒体与 Google Ads 部门上线" },
    { year: "2024", event: "将 AI 驱动的营销工具整合到工作流中" },
    { year: "2024", event: "20+ 活跃合作伙伴、8 个行业、可衡量的 ROI 成果" },
    { year: "2025", event: "SEO 与内容营销部门成立,23+ 合作伙伴" },
    { year: "2025", event: "免费 SEO 评估工具与 B2B 线索生成计划" },
  ],
};

export default function RolunkPage() {
  const { t, lang } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);

  const team = TEAM[lang];
  const values = VALUES_LIST[lang];
  const milestones = MILESTONES[lang];

  // Verified-only stats — sourced from actual partner list on g2amarketing.hu.
  // Removed: "Aktív év" (would outdate), "Elkötelezettség 100%" (subjective).
  const stats = [
    { num: "2022", label: t("about.stats.founded") },
    { num: "23", label: t("about.stats.partners") },
    { num: "8+", label: t("about.stats.industries") },
  ];

  return (
    <>
      <SeoHead title={t("about.seoTitle")} description={t("about.seoDesc")} />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 60% 40%, rgba(20,184,166,0.08) 0%, transparent 60%), var(--g2a-bg)",
          paddingTop: "6rem",
          position: "relative", overflow: "hidden",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div
              className="g2a-service-hero-grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 460px)", gap: "3rem", alignItems: "center" }}
            >
              <div>
                <div className="g2a-section-label animate-fadeIn">{t("about.sectionLabel")}</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "640px" }}>
                  {t("about.heroTitle1")} <span className="g2a-gradient-text">{t("about.heroTitle2")}</span>
                </h1>
                <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.15rem", color: "var(--g2a-text-secondary)", maxWidth: "580px", lineHeight: "1.7", fontFamily: "Geist, sans-serif" }}>
                  {t("about.heroDesc")}
                </p>
              </div>
              <div className="g2a-service-hero-demo">
                <AboutHeroDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "3rem 0", backgroundColor: "var(--g2a-bg-2)", borderTop: "1px solid var(--g2a-border)", borderBottom: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
              {stats.map((s, i) => (
                <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="g2a-stat-number">{s.num}</div>
                  <div className="g2a-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">{t("about.story.label")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">{t("about.story.title")}</h2>
                <p className="reveal reveal-delay-2" style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem", fontFamily: "Geist, sans-serif" }}>
                  {t("about.story.p1")}
                </p>
                <p className="reveal reveal-delay-3" style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", marginBottom: "2rem", fontFamily: "Geist, sans-serif" }}>
                  {t("about.story.p2")}
                </p>
                <div className="reveal reveal-delay-4">
                  <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-primary">{t("about.story.cta")} <ArrowRight size={16} /></span>
                  </Link>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {milestones.map((m, i) => (
                  <div key={i} className={`reveal reveal-delay-${(i % 4) + 1}`} style={{ display: "flex", gap: "1.25rem", paddingBottom: "1.25rem", position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--g2a-brand-teal)", flexShrink: 0, marginTop: "0.35rem" }} />
                      {i < milestones.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "var(--g2a-border)", marginTop: "4px" }} />}
                    </div>
                    <div style={{ paddingBottom: "0.5rem" }}>
                      <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.75rem", color: "var(--g2a-brand-teal)", fontWeight: 600, letterSpacing: "0.08em" }}>{m.year}</span>
                      <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: "0.25rem 0 0" }}>{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process / Hogyan dolgozunk */}
        <section className="g2a-section" style={{ backgroundColor: "transparent", borderTop: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">{t("process.label")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("process.title")}</h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                {t("process.subtitle")}
              </p>
            </div>
            <ProcessIllustration />
          </div>
        </section>

        {/* Values */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">{t("about.values")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("about.valuesTitle")}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {values.map((v, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", gap: "1rem" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{v.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{v.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">{t("about.teamLabel")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("about.teamTitle")}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {team.map((member, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${i + 1}`} style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
                  {/* Portrait avatar — circular crop. <img> falls back to the
                      initial-letter circle on load failure (e.g. before the
                      Cloudinary asset is uploaded). */}
                  <div style={{ width: "120px", height: "120px", margin: "0 auto 1.25rem", position: "relative" }}>
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        style={{
                          width: "120px", height: "120px", borderRadius: "50%",
                          objectFit: "cover", objectPosition: "center top",
                          border: "2px solid rgba(20,184,166,0.3)",
                          filter: "grayscale(0.15)",
                        }}
                      />
                    )}
                    {/* Initial fallback — sits behind the image so it shows when the img errors out */}
                    <div style={{
                      position: "absolute", inset: 0,
                      borderRadius: "50%",
                      backgroundColor: "rgba(20,184,166,0.12)", border: "2px solid rgba(20,184,166,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--g2a-brand-teal)",
                      zIndex: -1,
                    }}>
                      {member.initial}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{member.name}</div>
                  <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.75rem", color: "var(--g2a-brand-teal)", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{member.role}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{member.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1.25rem" }}>{t("about.finalCta.title")}</h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              {t("about.finalCta.desc")}
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  {t("nav.freeAudit")} <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  {t("common.contactUs")}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
