/**
 * Related-services nav rendered at the bottom of every service subpage that
 * sits in a pillar/cluster relationship with siblings.
 *
 * Audit §3.6 was the trigger — several services (PPC vs hirdetéskezelés vs
 * Meta-ads; lokalizáció vs nemzetközi-marketing) overlapped in subject and
 * were cannibalising each other in search. Decision (from user): keep all
 * pages but signal the hierarchy through explicit internal links.
 *   - "hirdeteskezeles" is the pillar for all paid media
 *     → "ppc-google-ads" and "meta-hirdetes" are detail-level children
 *   - "nemzetkozi-marketing" is the pillar for cross-border work
 *     → "lokalizacio" is the language-specific subservice
 *
 * RELATED_MAP is the single source of truth. Each entry's `pillar` points to
 * the umbrella page (a child links upward), and `siblings` lists co-equal
 * detail pages (mainly for the children to link sideways to each other).
 *
 * The component renders nothing if the current slug isn't in the map — so
 * dropping it onto every service page is free.
 */
import { Link } from "wouter";
import { ArrowUpLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

type ServiceLink = { slug: string; label: Record<Language, string>; desc: Record<Language, string> };

const PILLARS: Record<string, ServiceLink> = {
  hirdeteskezeles: {
    slug: "hirdeteskezeles",
    label: {
      hu: "Hirdetéskezelés (átfogó)",
      en: "Paid media management (overview)",
      zh: "广告投放管理（综合）",
    },
    desc: {
      hu: "Átfogó fizetett hirdetés-pillér — Google, Meta és más platformok együtt.",
      en: "Umbrella paid-media pillar — Google, Meta, and other platforms combined.",
      zh: "综合付费广告板块——Google、Meta 及其他平台。",
    },
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    label: {
      hu: "Nemzetközi marketing (átfogó)",
      en: "International marketing (overview)",
      zh: "国际营销（综合）",
    },
    desc: {
      hu: "Külpiacra-lépés átfogó pillér — kínai (WeChat, Baidu) és európai piacok.",
      en: "Cross-border pillar — Chinese (WeChat, Baidu) and European markets.",
      zh: "进军海外市场综合板块——中国（微信、百度）与欧洲市场。",
    },
  },
};

const CHILDREN: Record<string, ServiceLink[]> = {
  hirdeteskezeles: [
    {
      slug: "ppc-google-ads",
      label: { hu: "PPC & Google Ads", en: "PPC & Google Ads", zh: "PPC 与 Google Ads" },
      desc: {
        hu: "Google Search, Display, Shopping, Performance Max — kifejezetten Google ökoszisztémára.",
        en: "Google Search, Display, Shopping, Performance Max — Google-ecosystem-specific.",
        zh: "Google 搜索、展示、购物、Performance Max——专注 Google 生态。",
      },
    },
    {
      slug: "meta-hirdetes",
      label: { hu: "Meta hirdetés", en: "Meta ads", zh: "Meta 广告" },
      desc: {
        hu: "Facebook + Instagram, retargeting, Advantage+ kampányok és iOS 14+ signal-recovery.",
        en: "Facebook + Instagram, retargeting, Advantage+ campaigns and iOS 14+ signal recovery.",
        zh: "Facebook + Instagram、再营销、Advantage+ 广告系列及 iOS 14+ 信号恢复。",
      },
    },
  ],
  "nemzetkozi-marketing": [
    {
      slug: "lokalizacio",
      label: { hu: "Lokalizáció", en: "Localisation", zh: "本地化" },
      desc: {
        hu: "Nyelvi lokalizáció és kulturális adaptáció — a nemzetközi pillér alá tartozó alszolgáltatás.",
        en: "Language localisation and cultural adaptation — a subservice under the international pillar.",
        zh: "语言本地化与文化适配——国际板块下的子服务。",
      },
    },
  ],
};

/** Map from current-slug → { pillar?, siblings[] }. Builds the actual links
 *  shown on the page from the PILLARS and CHILDREN definitions above. */
function getRelations(slug: string): { pillar?: ServiceLink; siblings: ServiceLink[] } | null {
  // Is this a pillar? Show its children.
  if (CHILDREN[slug]) {
    return { siblings: CHILDREN[slug] };
  }
  // Is this a child? Find the pillar + co-children.
  for (const [pillarSlug, children] of Object.entries(CHILDREN)) {
    if (children.some((c) => c.slug === slug)) {
      return {
        pillar: PILLARS[pillarSlug],
        siblings: children.filter((c) => c.slug !== slug),
      };
    }
  }
  return null;
}

const SECTION_HEADERS: Record<Language, { pillar: string; children: string; siblings: string }> = {
  hu: {
    pillar: "Átfogó pillér oldal",
    children: "Részletes alszolgáltatások",
    siblings: "Kapcsolódó alszolgáltatás",
  },
  en: {
    pillar: "Umbrella pillar page",
    children: "Detail subservices",
    siblings: "Related subservices",
  },
  zh: {
    pillar: "综合板块页",
    children: "详细子服务",
    siblings: "相关子服务",
  },
};

export default function RelatedServices({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const rel = getRelations(slug);
  if (!rel) return null;

  const headers = SECTION_HEADERS[lang];

  return (
    <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
      <div className="g2a-container" style={{ maxWidth: 980 }}>
        {/* Pillar link (only on child pages) */}
        {rel.pillar && (
          <div style={{ marginBottom: rel.siblings.length > 0 ? "2.5rem" : 0 }}>
            <div className="g2a-section-label" style={{ marginBottom: "1rem" }}>
              {headers.pillar}
            </div>
            <Link href={`/szolgaltatasok/${rel.pillar.slug}`} style={{ textDecoration: "none" }}>
              <div
                className="g2a-card"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  borderLeft: "3px solid var(--g2a-brand-teal)",
                  cursor: "pointer",
                }}
              >
                <ArrowUpLeft size={20} style={{ color: "var(--g2a-brand-teal)", flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontWeight: 600, fontSize: "1rem", marginBottom: 4 }}>
                    {rel.pillar.label[lang]}
                  </div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {rel.pillar.desc[lang]}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Children / siblings grid */}
        {rel.siblings.length > 0 && (
          <>
            <div className="g2a-section-label" style={{ marginBottom: "1rem" }}>
              {rel.pillar ? headers.siblings : headers.children}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {rel.siblings.map((s) => (
                <Link key={s.slug} href={`/szolgaltatasok/${s.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ cursor: "pointer", height: "100%" }}>
                    <div style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontWeight: 600, fontSize: "1rem", marginBottom: 6 }}>
                      {s.label[lang]}
                    </div>
                    <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.85rem", lineHeight: 1.55, marginBottom: "0.75rem" }}>
                      {s.desc[lang]}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-brand-teal)", fontSize: "0.8rem", fontWeight: 600 }}>
                      <ArrowRight size={13} /> {lang === "hu" ? "Részletek" : lang === "en" ? "Details" : "详情"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
