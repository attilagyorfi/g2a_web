import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, BarChart2, Globe, Zap, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

// ─── Localised data ─────────────────────────────────────────────────────────
const SEO_CHECKS: Record<Language, { id: string; label: string; desc: string }[]> = {
  hu: [
    { id: "title", label: "Meta Title optimalizáció", desc: "Ellenőrizzük a cím hosszát, kulcsszó-elhelyezést és kattintási arányt." },
    { id: "meta", label: "Meta Description", desc: "Vizsgáljuk a leírás relevanciáját és CTA-tartalmát." },
    { id: "h1", label: "H1 struktúra", desc: "Egyetlen, kulcsszó-gazdag H1 cím megléte." },
    { id: "speed", label: "Oldal betöltési sebesség", desc: "Core Web Vitals: LCP, FID, CLS mérőszámok." },
    { id: "mobile", label: "Mobilbarát megjelenés", desc: "Responsive design és mobil UX ellenőrzése." },
    { id: "ssl", label: "SSL / HTTPS biztonság", desc: "Biztonságos kapcsolat és tanúsítvány érvényessége." },
    { id: "sitemap", label: "XML Sitemap", desc: "Sitemap megléte és Google Search Console beküldése." },
    { id: "schema", label: "Strukturált adatok (Schema)", desc: "JSON-LD implementáció és rich snippet lehetőségek." },
    { id: "backlinks", label: "Backlinkek minősége", desc: "Hivatkozó domainek száma és Domain Authority." },
    { id: "content", label: "Tartalmi relevancia", desc: "Kulcsszó-sűrűség, tartalom mélysége és frissessége." },
  ],
  en: [
    { id: "title", label: "Meta Title optimization", desc: "We check title length, keyword placement and click-through rate." },
    { id: "meta", label: "Meta Description", desc: "Relevance and CTA strength of the description." },
    { id: "h1", label: "H1 structure", desc: "Presence of a single keyword-rich H1 heading." },
    { id: "speed", label: "Page load speed", desc: "Core Web Vitals: LCP, FID, CLS metrics." },
    { id: "mobile", label: "Mobile-friendly experience", desc: "Responsive design and mobile UX review." },
    { id: "ssl", label: "SSL / HTTPS security", desc: "Secure connection and certificate validity." },
    { id: "sitemap", label: "XML Sitemap", desc: "Sitemap presence and Google Search Console submission." },
    { id: "schema", label: "Structured data (Schema)", desc: "JSON-LD implementation and rich snippet opportunities." },
    { id: "backlinks", label: "Backlink quality", desc: "Referring domains count and Domain Authority." },
    { id: "content", label: "Content relevance", desc: "Keyword density, content depth and freshness." },
  ],
  zh: [
    { id: "title", label: "Meta Title 优化", desc: "检查标题长度、关键词位置与点击率。" },
    { id: "meta", label: "Meta Description", desc: "审查描述的相关性与 CTA 内容。" },
    { id: "h1", label: "H1 结构", desc: "是否有单一、富关键词的 H1 标题。" },
    { id: "speed", label: "页面加载速度", desc: "Core Web Vitals:LCP、FID、CLS 指标。" },
    { id: "mobile", label: "移动端友好性", desc: "响应式设计与移动端 UX 检查。" },
    { id: "ssl", label: "SSL / HTTPS 安全", desc: "安全连接与证书有效性。" },
    { id: "sitemap", label: "XML 站点地图", desc: "站点地图是否存在以及 Google Search Console 提交情况。" },
    { id: "schema", label: "结构化数据 (Schema)", desc: "JSON-LD 实现与富摘要展示机会。" },
    { id: "backlinks", label: "反向链接质量", desc: "引荐域名数量与 Domain Authority。" },
    { id: "content", label: "内容相关性", desc: "关键词密度、内容深度与更新频率。" },
  ],
};

const BENEFIT_ICONS = [<BarChart2 size={24} />, <TrendingUp size={24} />, <Zap size={24} />, <Shield size={24} />];

const BENEFITS: Record<Language, { title: string; desc: string }[]> = {
  hu: [
    { title: "Azonnali diagnózis", desc: "Percek alatt megkapod, mi akadályozza a Google rangsorolást." },
    { title: "Versenyképes elemzés", desc: "Látod, hol állsz a versenytársaidhoz képest." },
    { title: "Prioritizált teendők", desc: "Konkrét, sorrendbe állított fejlesztési javaslatok." },
    { title: "Gyors eredmények", desc: "Az első javítások már 2–4 héten belül érezhetők." },
  ],
  en: [
    { title: "Instant diagnosis", desc: "In minutes, you'll know what's blocking your Google rankings." },
    { title: "Competitive analysis", desc: "See where you stand against your competitors." },
    { title: "Prioritized action items", desc: "Specific, ranked improvement recommendations." },
    { title: "Quick wins", desc: "First improvements are noticeable within 2–4 weeks." },
  ],
  zh: [
    { title: "即时诊断", desc: "几分钟内即可得知什么在阻碍您的 Google 排名。" },
    { title: "竞品对比分析", desc: "清楚您与竞争对手的差距。" },
    { title: "优先级待办", desc: "按优先级排序的具体改进建议。" },
    { title: "快速见效", desc: "前几项改进在 2–4 周内即可看到效果。" },
  ],
};

export default function SeoAuditPage() {
  const { t, lang } = useLanguage();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const seoChecks = SEO_CHECKS[lang];
  const benefits = BENEFITS[lang].map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] }));
  const tags = [t("seoAudit.tag1"), t("seoAudit.tag2"), t("seoAudit.tag3")];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <SeoHead title={t("seoAudit.seoTitle")} description={t("seoAudit.seoDesc")} />
      <ScrollProgressBar />
      <Navigation />

      {/* Hero */}
      <section style={{ paddingTop: "7rem", paddingBottom: "5rem", background: "linear-gradient(135deg, var(--g2a-bg-1) 0%, var(--g2a-bg-2) 100%)", position: "relative", overflow: "hidden" }}>
        <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} />
        <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div className="g2a-section-label" style={{ marginBottom: "1rem" }}>{t("seoAudit.heroLabel")}</div>
              <h1 className="g2a-headline-xl" style={{ marginBottom: "1.5rem" }}>
                {t("seoAudit.heroTitle1")} <span className="g2a-gradient-text">{t("seoAudit.heroTitle2")}</span> {t("seoAudit.heroTitle3")}
              </h1>
              <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2rem" }}>
                {t("seoAudit.heroDesc")}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-amber)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <CheckCircle size={16} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <CheckCircle size={64} style={{ color: "var(--g2a-amber)", margin: "0 auto 1.5rem", display: "block" }} />
                  <h3 style={{ color: "var(--g2a-text-primary)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                    {t("seoAudit.submittedTitle")}
                  </h3>
                  <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    {t("seoAudit.submittedDesc").replace("{email}", "")}<strong>{email}</strong>
                  </p>
                  <Link href="/kapcsolat">
                    <span className="g2a-btn-primary">{t("seoAudit.bookConsultation")} <ArrowRight size={16} /></span>
                  </Link>
                </div>
              ) : (
                <>
                  <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    {t("seoAudit.formTitle")}
                  </h2>
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    {t("seoAudit.formHint")}
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                        {t("seoAudit.urlLabel")} *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Globe size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--g2a-text-secondary)", pointerEvents: "none" }} />
                        <input
                          type="url"
                          placeholder={t("seoAudit.placeholder")}
                          value={url}
                          onChange={e => setUrl(e.target.value)}
                          required
                          style={{
                            width: "100%", padding: "0.75rem 0.875rem 0.75rem 2.5rem",
                            background: "var(--g2a-bg-1)", border: "1px solid var(--g2a-border)",
                            borderRadius: "0.5rem", color: "var(--g2a-text-primary)",
                            fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                        {t("seoAudit.emailLabel")} *
                      </label>
                      <input
                        type="email"
                        placeholder="nev@ceg.hu"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                          width: "100%", padding: "0.75rem 0.875rem",
                          background: "var(--g2a-bg-1)", border: "1px solid var(--g2a-border)",
                          borderRadius: "0.5rem", color: "var(--g2a-text-primary)",
                          fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="g2a-btn-primary"
                      style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? t("seoAudit.submitting") : `${t("seoAudit.submit")} →`}
                    </button>
                    <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.75rem", textAlign: "center" }}>
                      {t("seoAudit.privacyNote")}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section style={{ padding: "5rem 0", backgroundColor: "var(--g2a-bg-1)" }}>
        <div className="g2a-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="g2a-section-label">{t("seoAudit.checksLabel")}</div>
            <h2 className="g2a-section-title">{t("seoAudit.checksTitle")}</h2>
            <p style={{ color: "var(--g2a-text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>
              {t("seoAudit.checksDesc")}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {seoChecks.map((check, i) => (
              <div key={check.id} style={{
                background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)",
                borderRadius: "0.75rem", padding: "1.25rem",
                display: "flex", gap: "1rem", alignItems: "flex-start",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "rgba(20,184,166,0.15)", border: "1px solid var(--g2a-amber)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "var(--g2a-amber)", fontSize: "0.75rem", fontWeight: 700,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600, marginBottom: "0.25rem" }}>{check.label}</div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", lineHeight: "1.5" }}>{check.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "5rem 0", backgroundColor: "var(--g2a-bg-2)" }}>
        <div className="g2a-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="g2a-section-label">{t("seoAudit.benefitsLabel")}</div>
            <h2 className="g2a-section-title">{t("seoAudit.benefitsTitle")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(20,184,166,0.15)", border: "1px solid var(--g2a-amber)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "var(--g2a-amber)" }}>
                  {b.icon}
                </div>
                <h3 style={{ color: "var(--g2a-text-primary)", fontWeight: 700, marginBottom: "0.5rem" }}>{b.title}</h3>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0", background: "linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0.05) 100%)", borderTop: "1px solid var(--g2a-border)" }}>
        <div className="g2a-container" style={{ textAlign: "center" }}>
          <h2 className="g2a-section-title">{t("seoAudit.ctaTitle")}</h2>
          <p style={{ color: "var(--g2a-text-secondary)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: "1.7" }}>
            {t("seoAudit.ctaDesc")}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="g2a-btn-primary">
              {t("seoAudit.submit")} →
            </button>
            <Link href="/kapcsolat">
              <span className="g2a-btn-secondary">{t("seoAudit.bookConsultation")}</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
