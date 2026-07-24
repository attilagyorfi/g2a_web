import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import AuditHeroDemo from "@/components/page-demos/AuditHeroDemo";
import { trpc } from "@/lib/trpc";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Search, BarChart3, Globe, Code, Target, TrendingUp, Clock, Phone, Mail } from "lucide-react";

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const el = ref.current;
    if (el) el.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

// ─── Localised data ─────────────────────────────────────────────────────────
const INCLUDE_ICONS = [<Code size={20} />, <Search size={20} />, <BarChart3 size={20} />, <Globe size={20} />, <Target size={20} />, <TrendingUp size={20} />];

const AUDIT_INCLUDES: Record<Language, { title: string; desc: string }[]> = {
  hu: [
    { title: "Weboldal technikai audit", desc: "Core Web Vitals, betöltési sebesség, mobilbarátság, HTTPS, strukturált adatok" },
    { title: "SEO elemzés", desc: "Kulcsszó pozíciók, on-page SEO, backlink profil, versenytárs-elemzés" },
    { title: "Hirdetési kampányok", desc: "Google Ads és Meta Ads hatékonyság, ROAS, CPA, Quality Score elemzés" },
    { title: "Közösségi média", desc: "Jelenlét, engagement ráta, tartalom minőség, követőszám trend" },
    { title: "Versenytárs-elemzés", desc: "Top 3 versenytárs összehasonlítása, piaci pozíció, differenciálási lehetőségek" },
    { title: "Konverzió optimalizálás", desc: "Konverziós ráta, UX problémák, A/B tesztelési lehetőségek" },
  ],
  en: [
    { title: "Website technical audit", desc: "Core Web Vitals, load speed, mobile-friendliness, HTTPS, structured data" },
    { title: "SEO analysis", desc: "Keyword rankings, on-page SEO, backlink profile, competitor analysis" },
    { title: "Ad campaigns", desc: "Google Ads and Meta Ads effectiveness, ROAS, CPA, Quality Score analysis" },
    { title: "Social media", desc: "Presence, engagement rate, content quality, follower growth trend" },
    { title: "Competitor analysis", desc: "Top 3 competitor comparison, market position, differentiation opportunities" },
    { title: "Conversion optimisation", desc: "Conversion rate, UX issues, A/B testing opportunities" },
  ],
  zh: [
    { title: "网站技术审计", desc: "Core Web Vitals、加载速度、移动端友好性、HTTPS、结构化数据" },
    { title: "SEO 分析", desc: "关键词排名、页面 SEO、反向链接、竞争对手分析" },
    { title: "广告活动", desc: "Google Ads 与 Meta 广告效果、ROAS、CPA、质量分分析" },
    { title: "社交媒体", desc: "表现、互动率、内容质量、粉丝增长趋势" },
    { title: "竞品分析", desc: "前 3 名竞争对手对比、市场定位、差异化机会" },
    { title: "转化优化", desc: "转化率、UX 问题、A/B 测试机会" },
  ],
};

const PROCESS: Record<Language, { step: string; title: string; desc: string }[]> = {
  hu: [
    { step: "01", title: "Kérés beküldése", desc: "Töltsd ki az alábbi űrlapot – 2 perc az egész." },
    { step: "02", title: "Kapcsolatfelvétel", desc: "24 órán belül felvesszük veled a kapcsolatot." },
    { step: "03", title: "Adatgyűjtés", desc: "Hozzáférést kérünk az Analytics és Ads fiókokhoz." },
    { step: "04", title: "Audit elkészítése", desc: "5–7 munkanapon belül elkészítjük a részletes auditot." },
    { step: "05", title: "Prezentáció", desc: "Online meetingen bemutatjuk az eredményeket és javaslatokat." },
  ],
  en: [
    { step: "01", title: "Submit request", desc: "Fill out the form below – it takes 2 minutes." },
    { step: "02", title: "Contact", desc: "We'll reach out within 24 hours." },
    { step: "03", title: "Data collection", desc: "We'll request access to Analytics and Ads accounts." },
    { step: "04", title: "Audit production", desc: "We deliver the detailed audit within 5–7 business days." },
    { step: "05", title: "Presentation", desc: "Online meeting to walk through findings and recommendations." },
  ],
  zh: [
    { step: "01", title: "提交申请", desc: "填写下方表单 —— 只需 2 分钟。" },
    { step: "02", title: "取得联系", desc: "我们将在 24 小时内联系您。" },
    { step: "03", title: "数据收集", desc: "请求访问您的 Analytics 与广告账户。" },
    { step: "04", title: "制作评估报告", desc: "在 5–7 个工作日内交付详细评估报告。" },
    { step: "05", title: "展示汇报", desc: "通过线上会议介绍分析结果与改进建议。" },
  ],
};

export default function AuditPage() {
  const { t, lang } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", website: "", monthlyBudget: "", currentChallenges: "", goals: "" });
  // `botField` is the honeypot for this form — `website` is a legitimate input
  // (the audit subject's URL), so we use a different name. Real users never
  // see/touch it; bots that auto-fill all inputs get caught silently.
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const auditIncludes = AUDIT_INCLUDES[lang].map((x, i) => ({ ...x, icon: INCLUDE_ICONS[i] }));
  const processSteps = PROCESS[lang];

  const auditMutation = trpc.audit.submit.useMutation({
    onSuccess: () => { setStatus("success"); track.auditRequest("audit-page"); },
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    auditMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      company: form.company || undefined,
      website: form.website || undefined,
      monthlyBudget: form.monthlyBudget || undefined,
      currentChallenges: form.currentChallenges || undefined,
      goals: form.goals || undefined,
      lang,
      botField: honeypot, // honeypot — server-side AUDIT_HONEYPOT
    });
  };

  return (
    <>
      <SeoHead title={t("auditPage.seoTitle")} description={t("auditPage.seoDesc")} />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "55vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.1) 0%, transparent 55%), var(--g2a-bg)",
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
                <div className="g2a-section-label animate-fadeIn">{t("audit.sectionLabel")}</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "640px" }}>
                  {t("auditPage.heroTitle1")} <span className="g2a-gradient-text">{t("auditPage.heroTitle2")}</span>
                </h1>
                <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.15rem", color: "var(--g2a-text-secondary)", maxWidth: "560px", lineHeight: "1.7", fontFamily: "Geist, sans-serif" }}>
                  {t("auditPage.heroDesc")}
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", gap: "1.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
                  {[
                    { icon: <CheckCircle size={14} />, text: t("auditPage.tag1") },
                    { icon: <Clock size={14} />, text: t("auditPage.tag2") },
                    { icon: <CheckCircle size={14} />, text: t("auditPage.tag3") },
                  ].map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem", fontFamily: "Geist, sans-serif" }}>
                      <span style={{ color: "#10b981" }}>{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="g2a-service-hero-demo">
                <AuditHeroDemo />
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">{t("auditPage.includesLabel")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("auditPage.includesTitle")}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {auditIncludes.map((item, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", gap: "1rem" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">{t("auditPage.processLabel")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("auditPage.processTitle")}</h2>
            </div>
            <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "1rem" }}>
              {processSteps.map((p, i) => (
                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ flex: "1 1 180px", textAlign: "center", padding: "0 1rem", position: "relative", minWidth: "160px" }}>
                  {i < processSteps.length - 1 && (
                    <div style={{ position: "absolute", top: "1.5rem", left: "60%", right: "-40%", height: "2px", backgroundColor: "var(--g2a-border)", zIndex: 0 }} />
                  )}
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundColor: "rgba(20,184,166,0.12)", border: "2px solid rgba(20,184,166,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem", position: "relative", zIndex: 1,
                    fontFamily: "Geist Mono, monospace", fontWeight: 700, fontSize: "0.875rem", color: "var(--g2a-brand-teal)",
                  }}>
                    {p.step}
                  </div>
                  <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: "1.5" }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div className="g2a-section-label reveal">{t("auditPage.formLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("auditPage.formTitle")}</h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ textAlign: "center", margin: "0 auto" }}>
                  {t("auditPage.formHint")}
                </p>
              </div>

              {status === "success" ? (
                <div className="g2a-card reveal" style={{ textAlign: "center", padding: "3rem" }}>
                  <CheckCircle size={56} style={{ color: "#10b981", margin: "0 auto 1.25rem" }} />
                  <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>{t("auditPage.successTitle")}</h3>
                  <p style={{ color: "var(--g2a-text-secondary)", marginBottom: "2rem" }}>{t("auditPage.successDesc")}</p>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-secondary">{t("auditPage.backHome")}</span>
                  </Link>
                </div>
              ) : (
                <div className="g2a-card reveal">
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">{t("auditPage.fieldName")} *</label>
                        <input className="g2a-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t("newservice.nameExample")} />
                      </div>
                      <div>
                        <label className="g2a-label">{t("common.email")} *</label>
                        <input className="g2a-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@ceg.hu" />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">{t("common.phone")}</label>
                        <input className="g2a-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30 190 2575" />
                      </div>
                      <div>
                        <label className="g2a-label">{t("auditPage.fieldCompany")}</label>
                        <input className="g2a-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder={t("auditPage.companyPlaceholder")} />
                      </div>
                    </div>
                    <div>
                      <label className="g2a-label">{t("auditPage.fieldWebsite")}</label>
                      {/* Plain text input — `type="url"` rejected anything
                          without an explicit protocol scheme, which most
                          visitors won't type. We accept `ceg.hu`, `www.ceg.hu`,
                          or `https://www.ceg.hu` and let the server normalize. */}
                      <input className="g2a-input" type="text" inputMode="url" autoComplete="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="pl. www.ceg.hu vagy ceg.hu" />
                    </div>
                    <div>
                      <label className="g2a-label">{t("auditPage.challengesLabel")}</label>
                      <textarea className="g2a-input" rows={4} value={form.currentChallenges} onChange={e => setForm(f => ({ ...f, currentChallenges: e.target.value }))} placeholder={t("auditPage.challengesPlaceholder")} style={{ resize: "vertical" }} />
                    </div>
                    {/* Honeypot — hidden from real users, bots will fill it */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>
                      <label htmlFor="botField">Leave this field empty</label>
                      <input
                        id="botField"
                        name="botField"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={e => setHoneypot(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
                      {status === "loading" ? t("audit.submitting") : t("audit.submit")}
                    </button>
                    {status === "error" && <p style={{ color: "var(--g2a-brand-teal)", fontSize: "0.875rem", textAlign: "center" }}>{t("auditPage.errorMsg")}</p>}
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", textAlign: "center" }}>
                      {t("auditPage.privacyNote")} <Link href="/adatvedelmi-iranyelvek" style={{ color: "var(--g2a-brand-teal)" }}>{t("auditPage.privacyLink")}</Link>.
                    </p>
                  </form>
                </div>
              )}

              {/* Working-hours chip removed — the office isn't
                  visitor-facing, opening times shouldn't read as a
                  walk-in invitation. */}
              <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
                {[
                  { icon: <Phone size={14} />, text: "+36 30 190 2575" },
                  { icon: <Mail size={14} />, text: "info@g2amarketing.hu" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--g2a-brand-teal)" }}>{c.icon}</span> {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
