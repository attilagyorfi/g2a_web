import { Link } from "wouter";
import { ArrowRight, Stethoscope, ShoppingBag, Wrench, Car, Scale, Code, Lightbulb, Building2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { pickLocalized } from "@/../../shared/i18n";

/**
 * Iparágak hub — links to the 8 detailed /iparagi/* landing pages.
 *
 * Audit §3.7 fix: previously this page rendered DB rows from the `industries`
 * table but had no link to the matching /iparagi/{slug} subpage, leaving those
 * 8 subpages weakly internally-linked. The DB slugs (technologia, kereskedelem,
 * autoipar, …) also didn't 1:1-match the /iparagi/{slug} URL stems
 * (marketing-technologiai-cegeknek etc.), so we now bypass the DB query for
 * the card grid and use the canonical /iparagi/* list directly. The DB query
 * is kept for SEO meta only.
 *
 * The cards link out as "Részletek →" — making this page the primary internal-
 * link source for the industry cluster.
 */

type IndustryCard = {
  slug: string;
  icon: React.ReactNode;
  color: string;
  label: Record<Language, string>;
  desc: Record<Language, string>;
};

const INDUSTRIES: IndustryCard[] = [
  {
    slug: "marketing-egeszsegugyi-cegeknek",
    icon: <Stethoscope size={22} />,
    color: "#10b981",
    label: { hu: "Egészségügy", en: "Healthcare", zh: "医疗健康" },
    desc: {
      hu: "Klinikák, magánorvosok, fogászatok. Etikai szabályozás-konform marketing, betegszerzés.",
      en: "Clinics, private doctors, dental practices. Compliant marketing, patient acquisition.",
      zh: "诊所、私人医生、牙科。合规营销与患者获取。",
    },
  },
  {
    slug: "marketing-szepsegipari-cegeknek",
    icon: <ShoppingBag size={22} />,
    color: "#ec4899",
    label: { hu: "Szépségipar", en: "Beauty industry", zh: "美容行业" },
    desc: {
      hu: "Szépségszalonok, kozmetikai márkák, esztétikai klinikák. Instagram-vezérelt B2C növekedés.",
      en: "Salons, cosmetics brands, aesthetic clinics. Instagram-driven B2C growth.",
      zh: "美容沙龙、化妆品品牌、美容诊所。以 Instagram 为驱动的 B2C 增长。",
    },
  },
  {
    slug: "marketing-mernoki-irodaknak",
    icon: <Wrench size={22} />,
    color: "#f59e0b",
    label: { hu: "Mérnöki irodák", en: "Engineering firms", zh: "工程设计事务所" },
    desc: {
      hu: "Műszaki tartalommarketing, LinkedIn, hosszú B2B értékesítési ciklus tervezőirodáknak.",
      en: "Technical content, LinkedIn, long B2B sales cycle support for design firms.",
      zh: "技术内容、LinkedIn、面向设计事务所的长周期 B2B 销售支持。",
    },
  },
  {
    slug: "marketing-autoipari-cegeknek",
    icon: <Car size={22} />,
    color: "#3b82f6",
    label: { hu: "Autóipar", en: "Automotive", zh: "汽车行业" },
    desc: {
      hu: "Márkakereskedések, alkatrész-forgalmazók, szervizek. Local SEO + folyamatos leadgenerálás.",
      en: "Dealerships, parts distributors, service shops. Local SEO + ongoing lead generation.",
      zh: "经销商、零配件分销商、维修店。本地 SEO 与持续线索获取。",
    },
  },
  {
    slug: "marketing-ugyvedii-irodaknak",
    icon: <Scale size={22} />,
    color: "#6366f1",
    label: { hu: "Jogi szolgáltatás", en: "Legal services", zh: "法律服务" },
    desc: {
      hu: "Ügyvédi irodák, jogi tanácsadók. Magyar Ügyvédi Kamara reklámkorlátozás-konform kommunikáció.",
      en: "Law firms, legal advisors. Communication compliant with bar association ad restrictions.",
      zh: "律师事务所、法律顾问。符合律师协会广告限制的传播方案。",
    },
  },
  {
    slug: "marketing-technologiai-cegeknek",
    icon: <Code size={22} />,
    color: "#8b5cf6",
    label: { hu: "Technológia", en: "Technology", zh: "科技" },
    desc: {
      hu: "B2B SaaS és tech: pozícionálás, product-led growth, content marketing, ABM, demógyűjtés.",
      en: "B2B SaaS and tech: positioning, PLG, content marketing, ABM, demo capture.",
      zh: "B2B SaaS 与科技：定位、PLG、内容营销、ABM、演示获取。",
    },
  },
  {
    slug: "marketing-onkormanyzati-projekteknek",
    icon: <Lightbulb size={22} />,
    color: "#14b8a6",
    label: { hu: "Önkormányzat", en: "Public sector", zh: "公共部门" },
    desc: {
      hu: "EU-támogatott önkormányzati projektek kommunikációja, lakossági kampányok, közbeszerzés-kompatibilis ajánlatok.",
      en: "EU-funded municipal project comms, citizen campaigns, public-procurement-ready proposals.",
      zh: "欧盟资助的市政项目传播、市民活动、符合公开招标要求的方案。",
    },
  },
  {
    slug: "marketing-b2b-cegeknek",
    icon: <Building2 size={22} />,
    color: "var(--g2a-brand-teal)",
    label: { hu: "B2B vállalkozások", en: "B2B businesses", zh: "B2B 企业" },
    desc: {
      hu: "Gyártók, nagykereskedők, B2B szolgáltatók. LinkedIn, ABM, hosszú deal-ciklus.",
      en: "Manufacturers, wholesalers, B2B service providers. LinkedIn, ABM, long deal cycles.",
      zh: "制造商、批发商、B2B 服务提供商。LinkedIn、ABM、长周期成交。",
    },
  },
];

export default function ExpertisePage() {
  const { t, lang } = useLanguage();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szakertelem" });

  const seoTitle = pickLocalized(pageSeo, "metaTitle", lang) || t("expertise.seoTitle");
  const seoDesc = pickLocalized(pageSeo, "metaDescription", lang) || t("expertise.desc");

  const detailsLabel: Record<Language, string> = { hu: "Részletek", en: "Details", zh: "详情" };

  return (
    <>
      <SeoHead title={seoTitle} description={seoDesc} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("expertise.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              {t("expertise.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("expertise.desc")}
            </p>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {INDUSTRIES.map((ind) => (
                <Link key={ind.slug} href={`/iparagi/${ind.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ width: 48, height: 48, backgroundColor: `${ind.color}20`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: ind.color }}>
                      {ind.icon}
                    </div>
                    <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                      {ind.label[lang]}
                    </h2>
                    <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem", flexGrow: 1 }}>
                      {ind.desc[lang]}
                    </p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-brand-teal)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {detailsLabel[lang]} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-3)" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">{t("about.finalCta.title")}</div>
            <h2 className="g2a-section-title">{t("about.finalCta.title")}</h2>
            <p style={{ color: "#888", maxWidth: "480px", margin: "0 auto 2rem" }}>
              {t("about.finalCta.desc")}
            </p>
            <Link href="/kapcsolat" className="g2a-btn-primary">
              {t("common.contactUs")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
