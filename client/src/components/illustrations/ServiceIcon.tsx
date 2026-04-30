/**
 * Custom SVG icons for each service slug. Replaces generic Lucide icons
 * with distinctive, geometric, brand-aligned compositions.
 *
 * Each icon uses brand teal (#14B8A6) as the primary stroke and a softened
 * white as the secondary. They are 40x40 by default, line-based, and inherit
 * `currentColor` only for accent contrast — the teal is hardcoded so the icon
 * keeps its identity inside icon boxes regardless of context.
 *
 * Usage:
 *   <ServiceIcon slug="webfejlesztes" size={28} />
 */

const TEAL = "#14B8A6";
const SOFT = "rgba(255,255,255,0.7)";

type IconProps = { size?: number };

const wrap = (children: React.ReactNode, size: number) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {children}
  </svg>
);

// ─── Individual icons ──────────────────────────────────────────────────────

function IconBrand({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Three overlapping color chips — palette stack */}
      <rect x="6" y="14" width="14" height="20" rx="3" fill={SOFT} opacity="0.18" />
      <rect x="13" y="10" width="14" height="20" rx="3" fill={TEAL} opacity="0.55" />
      <rect x="20" y="6" width="14" height="20" rx="3" fill="none" stroke={TEAL} strokeWidth="2" />
    </>,
    size
  );
}

function IconAds({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Bar chart + ascending arrow */}
      <rect x="6" y="26" width="5" height="8" rx="1" fill={SOFT} opacity="0.45" />
      <rect x="14" y="20" width="5" height="14" rx="1" fill={SOFT} opacity="0.65" />
      <rect x="22" y="12" width="5" height="22" rx="1" fill={TEAL} />
      <path d="M30 14 L34 10 L34 14 M34 10 L26 18" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    size
  );
}

function IconSocial({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* 3 overlapping speech bubbles */}
      <path d="M6 12 a4 4 0 0 1 4 -4 h10 a4 4 0 0 1 4 4 v6 a4 4 0 0 1 -4 4 h-7 l-4 4 v-4 h-3 a4 4 0 0 1 -4 -4 z" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.6" />
      <path d="M16 22 a4 4 0 0 1 4 -4 h10 a4 4 0 0 1 4 4 v6 a4 4 0 0 1 -4 4 h-3 v4 l-4 -4 h-3 a4 4 0 0 1 -4 -4 z" fill={TEAL} fillOpacity="0.18" stroke={TEAL} strokeWidth="2" />
      <circle cx="22" cy="25" r="1.3" fill={TEAL} />
      <circle cx="26" cy="25" r="1.3" fill={TEAL} />
      <circle cx="30" cy="25" r="1.3" fill={TEAL} />
    </>,
    size
  );
}

function IconStrategy({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Compass / crosshair */}
      <circle cx="20" cy="20" r="14" stroke={SOFT} strokeWidth="1.5" opacity="0.5" />
      <circle cx="20" cy="20" r="9" stroke={TEAL} strokeWidth="2" />
      <circle cx="20" cy="20" r="3" fill={TEAL} />
      <line x1="20" y1="2" x2="20" y2="7" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="33" x2="20" y2="38" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="2" y1="20" x2="7" y2="20" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="33" y1="20" x2="38" y2="20" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </>,
    size
  );
}

function IconSeo({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Ascending ranking bars + magnifier */}
      <rect x="6" y="22" width="4" height="12" rx="1" fill={SOFT} opacity="0.4" />
      <rect x="12" y="16" width="4" height="18" rx="1" fill={SOFT} opacity="0.65" />
      <rect x="18" y="10" width="4" height="24" rx="1" fill={TEAL} />
      <circle cx="28" cy="14" r="6" stroke={TEAL} strokeWidth="2" fill="none" />
      <line x1="33" y1="19" x2="37" y2="23" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" />
    </>,
    size
  );
}

function IconWebDev({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Browser window + code brackets */}
      <rect x="4" y="8" width="32" height="24" rx="3" stroke={SOFT} strokeWidth="1.5" opacity="0.6" fill="none" />
      <line x1="4" y1="14" x2="36" y2="14" stroke={SOFT} strokeWidth="1.5" opacity="0.6" />
      <circle cx="8" cy="11" r="1" fill={SOFT} opacity="0.6" />
      <circle cx="12" cy="11" r="1" fill={SOFT} opacity="0.6" />
      <circle cx="16" cy="11" r="1" fill={SOFT} opacity="0.6" />
      {/* Code: < / > */}
      <path d="M14 20 L10 24 L14 28" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M26 20 L30 24 L26 28" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="22" y1="19" x2="18" y2="29" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
    </>,
    size
  );
}

function IconAi({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Neural net node cluster + sparkle */}
      <circle cx="10" cy="20" r="2.5" fill={SOFT} opacity="0.6" />
      <circle cx="20" cy="10" r="2.5" fill={TEAL} />
      <circle cx="20" cy="30" r="2.5" fill={SOFT} opacity="0.6" />
      <circle cx="30" cy="20" r="3" fill={TEAL} />
      <line x1="10" y1="20" x2="20" y2="10" stroke={SOFT} strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="20" x2="20" y2="30" stroke={SOFT} strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="10" x2="30" y2="20" stroke={TEAL} strokeWidth="1.5" />
      <line x1="20" y1="30" x2="30" y2="20" stroke={TEAL} strokeWidth="1.5" />
      {/* Sparkle */}
      <path d="M30 8 L31 11 L34 12 L31 13 L30 16 L29 13 L26 12 L29 11 Z" fill={TEAL} opacity="0.85" />
    </>,
    size
  );
}

function IconPpc({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Cursor click + radial waves */}
      <circle cx="14" cy="14" r="11" fill="none" stroke={SOFT} strokeWidth="1.2" opacity="0.35" strokeDasharray="2 3" />
      <circle cx="14" cy="14" r="6" fill="none" stroke={TEAL} strokeWidth="1.5" opacity="0.6" />
      {/* Cursor arrow */}
      <path d="M16 16 L24 24 L24 28 L26 26 L31 35 L34 33 L29 24 L33 24 Z" fill={TEAL} stroke={TEAL} strokeWidth="1" strokeLinejoin="round" />
    </>,
    size
  );
}

function IconMeta({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Infinity / Meta-style loop */}
      <path
        d="M 8 20 Q 8 12, 14 12 T 20 20 Q 20 28, 26 28 T 32 20 Q 32 12, 26 12 T 20 20 Q 20 28, 14 28 T 8 20 Z"
        fill="none"
        stroke={TEAL}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="12" r="2.2" fill={SOFT} opacity="0.6" />
      <circle cx="26" cy="28" r="2.2" fill={TEAL} />
    </>,
    size
  );
}

function IconContent({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Document with text lines + pen accent */}
      <rect x="8" y="6" width="20" height="26" rx="2" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.6" />
      <line x1="12" y1="13" x2="24" y2="13" stroke={SOFT} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="12" y1="18" x2="24" y2="18" stroke={SOFT} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="12" y1="23" x2="20" y2="23" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
      {/* Pen */}
      <path d="M30 8 L36 14 L24 26 L20 27 L21 23 Z" fill={TEAL} opacity="0.85" stroke={TEAL} strokeWidth="1" strokeLinejoin="round" />
    </>,
    size
  );
}

function IconAutomation({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Connected workflow nodes — trigger → action chain */}
      <rect x="4" y="12" width="10" height="6" rx="2" fill={SOFT} opacity="0.4" stroke={SOFT} strokeWidth="1.2" />
      <rect x="15" y="20" width="10" height="6" rx="2" fill={TEAL} fillOpacity="0.2" stroke={TEAL} strokeWidth="1.5" />
      <rect x="26" y="12" width="10" height="6" rx="2" fill={TEAL} stroke={TEAL} strokeWidth="1.5" />
      {/* Connector arrows */}
      <path d="M14 18 Q 17 18, 17 20" fill="none" stroke={SOFT} strokeWidth="1.2" opacity="0.6" />
      <path d="M23 20 Q 23 18, 26 18" fill="none" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="14" cy="18" r="1.2" fill={SOFT} opacity="0.6" />
      <circle cx="26" cy="18" r="1.2" fill={TEAL} />
    </>,
    size
  );
}

function IconEsg({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Leaf + globe */}
      <circle cx="14" cy="22" r="11" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.55" />
      <ellipse cx="14" cy="22" rx="5" ry="11" fill="none" stroke={SOFT} strokeWidth="1.2" opacity="0.45" />
      <line x1="3" y1="22" x2="25" y2="22" stroke={SOFT} strokeWidth="1.2" opacity="0.45" />
      {/* Leaf */}
      <path
        d="M 24 6 Q 36 6, 36 18 Q 36 22, 32 22 Q 24 22, 24 14 Z"
        fill={TEAL}
        fillOpacity="0.25"
        stroke={TEAL}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="24" y1="22" x2="34" y2="9" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" />
    </>,
    size
  );
}

function IconEmployer({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Building silhouette + 2 people */}
      <rect x="20" y="8" width="16" height="26" rx="2" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.6" />
      <rect x="23" y="12" width="3" height="3" fill={SOFT} opacity="0.55" />
      <rect x="29" y="12" width="3" height="3" fill={SOFT} opacity="0.55" />
      <rect x="23" y="18" width="3" height="3" fill={SOFT} opacity="0.55" />
      <rect x="29" y="18" width="3" height="3" fill={TEAL} />
      <rect x="26" y="26" width="4" height="8" fill={TEAL} opacity="0.55" />
      {/* People */}
      <circle cx="9" cy="14" r="3.5" fill="none" stroke={TEAL} strokeWidth="1.8" />
      <path d="M3 32 v-3 a6 6 0 0 1 12 0 v3" stroke={TEAL} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>,
    size
  );
}

function IconInternational({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Globe with orbit ring */}
      <circle cx="20" cy="20" r="11" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.55" />
      <ellipse cx="20" cy="20" rx="5" ry="11" fill="none" stroke={SOFT} strokeWidth="1.2" opacity="0.45" />
      <line x1="9" y1="20" x2="31" y2="20" stroke={SOFT} strokeWidth="1.2" opacity="0.45" />
      {/* Orbit ring (tilted) */}
      <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke={TEAL} strokeWidth="1.5" transform="rotate(-20 20 20)" opacity="0.85" />
      {/* Satellite dot */}
      <circle cx="34" cy="14" r="2.2" fill={TEAL} />
    </>,
    size
  );
}

function IconLocalization({ size = 40 }: IconProps) {
  return wrap(
    <>
      {/* Globe with characters A / 中 */}
      <circle cx="20" cy="20" r="13" fill="none" stroke={SOFT} strokeWidth="1.5" opacity="0.55" />
      <text x="13" y="18" fontFamily="Geist, sans-serif" fontSize="9" fontWeight="800" fill={SOFT} opacity="0.7">
        A
      </text>
      <text x="20" y="28" fontFamily="Geist, sans-serif" fontSize="9" fontWeight="800" fill={TEAL}>
        中
      </text>
      <path d="M14 23 L18 23" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" />
    </>,
    size
  );
}

// ─── Router ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  // ServicesPage / DB-driven slugs
  arculattervezes: IconBrand,
  hirdeteskezeles: IconAds,
  "kozossegi-media": IconSocial,
  "strategiai-marketing": IconStrategy,
  "kereses-optimalizalas": IconSeo,
  keresooptimalizalas: IconSeo,
  webfejlesztes: IconWebDev,
  // NewServicePage / hardcoded slugs
  "ai-marketing": IconAi,
  "ppc-google-ads": IconPpc,
  "meta-hirdetes": IconMeta,
  tartalommarketing: IconContent,
  "marketing-automatizacio": IconAutomation,
  // Optional / future
  "esg-kommunikacio": IconEsg,
  "employer-branding": IconEmployer,
  "nemzetkozi-marketing": IconInternational,
  lokalizacio: IconLocalization,
};

type Props = {
  slug: string;
  size?: number;
  /** Fallback icon if slug not in ICON_MAP. Defaults to IconStrategy. */
  fallback?: React.ComponentType<IconProps>;
};

export default function ServiceIcon({ slug, size = 28, fallback = IconStrategy }: Props) {
  const Icon = ICON_MAP[slug] ?? fallback;
  return <Icon size={size} />;
}

export function hasServiceIcon(slug: string): boolean {
  return slug in ICON_MAP;
}
