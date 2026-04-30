import AiMarketingDemo from "./AiMarketingDemo";
import SeoDemo from "./SeoDemo";
import WebDevDemo from "./WebDevDemo";
import AdsDashboardDemo from "./AdsDashboardDemo";
import MetaAdsDemo from "./MetaAdsDemo";
import ContentDemo from "./ContentDemo";
import AutomationDemo from "./AutomationDemo";
import SocialDemo from "./SocialDemo";
import BrandDesignDemo from "./BrandDesignDemo";
import StrategyDemo from "./StrategyDemo";
import LocalizationDemo from "./LocalizationDemo";
import EsgDemo from "./EsgDemo";
import EmployerDemo from "./EmployerDemo";
import InternationalDemo from "./InternationalDemo";

type Props = { slug: string };

/**
 * Slug → demo component mapping. The DEMO_MAP is the single source of truth
 * for which slugs render which mini-product-demo in the hero right column.
 *
 * Returns null for any slug not listed (caller falls back to single-column hero).
 */
const DEMO_MAP: Record<string, React.ComponentType> = {
  // ServicePage (DB-driven slugs)
  "keresooptimalizalas": SeoDemo,
  "webfejlesztes": WebDevDemo,
  "hirdeteskezeles": AdsDashboardDemo,
  "kozossegi-media": SocialDemo,
  "arculattervezes": BrandDesignDemo,
  "strategiai-marketing": StrategyDemo,
  "lokalizacio": LocalizationDemo,
  // NewServicePage (hardcoded SERVICE_CONFIGS slugs)
  "ai-marketing": AiMarketingDemo,
  "ppc-google-ads": AdsDashboardDemo,
  "meta-hirdetes": MetaAdsDemo,
  "tartalommarketing": ContentDemo,
  "marketing-automatizacio": AutomationDemo,
  "esg-kommunikacio": EsgDemo,
  "employer-branding": EmployerDemo,
  "nemzetkozi-marketing": InternationalDemo,
};

export default function ServiceHeroDemo({ slug }: Props) {
  const Demo = DEMO_MAP[slug];
  if (!Demo) return null;
  return <Demo />;
}

export function hasServiceHeroDemo(slug: string): boolean {
  return slug in DEMO_MAP;
}
