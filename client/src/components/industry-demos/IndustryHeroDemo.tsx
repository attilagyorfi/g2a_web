import HealthcareDemo from "./HealthcareDemo";
import BeautyDemo from "./BeautyDemo";
import EngineeringDemo from "./EngineeringDemo";
import AutomotiveDemo from "./AutomotiveDemo";
import LegalDemo from "./LegalDemo";
import TechDemo from "./TechDemo";
import MunicipalDemo from "./MunicipalDemo";
import B2bDemo from "./B2bDemo";

type Props = { slug: string };

/**
 * Industry slug → hero demo component mapping. Single source of truth.
 *
 * Each industry uses its own accent color (not the global teal) so the page
 * communicates the sector's character. Returns null for unknown slugs.
 */
const INDUSTRY_DEMO_MAP: Record<string, React.ComponentType> = {
  "marketing-egeszsegugyi-cegeknek": HealthcareDemo,
  "marketing-szepsegipari-cegeknek": BeautyDemo,
  "marketing-mernoki-irodaknak": EngineeringDemo,
  "marketing-autoipari-cegeknek": AutomotiveDemo,
  "marketing-ugyvedi-irodaknak": LegalDemo,
  "marketing-technologiai-cegeknek": TechDemo,
  "marketing-onkormanyzati-projekteknek": MunicipalDemo,
  "marketing-b2b-cegeknek": B2bDemo,
};

export default function IndustryHeroDemo({ slug }: Props) {
  const Demo = INDUSTRY_DEMO_MAP[slug];
  if (!Demo) return null;
  return <Demo />;
}

export function hasIndustryHeroDemo(slug: string): boolean {
  return slug in INDUSTRY_DEMO_MAP;
}
