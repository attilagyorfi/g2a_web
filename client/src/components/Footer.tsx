import { Phone, Mail, Clock, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendlyTextLink } from "@/components/CalendlyEmbed";
import NewsletterSection from "@/components/NewsletterSection";
import { useLocation } from "wouter";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

// Services / company links — labels via translation keys, hrefs stable
const SERVICES = [
  { key: "service.localization", href: "/szolgaltatasok/lokalizacio" },
  { key: "service.branding", href: "/szolgaltatasok/arculattervezes" },
  { key: "service.ads", href: "/szolgaltatasok/hirdeteskezeles" },
  { key: "service.social", href: "/szolgaltatasok/kozossegi-media" },
  { key: "service.strategy", href: "/szolgaltatasok/strategiai-marketing" },
  { key: "service.seo", href: "/szolgaltatasok/keresooptimalizalas" },
  { key: "service.webdev", href: "/szolgaltatasok/webfejlesztes" },
  { key: "service.aiMarketing", href: "/szolgaltatasok/ai-marketing" },
  { key: "service.ppc", href: "/szolgaltatasok/ppc-google-ads" },
  { key: "service.meta", href: "/szolgaltatasok/meta-hirdetes" },
  { key: "service.content", href: "/szolgaltatasok/tartalommarketing" },
  { key: "service.automation", href: "/szolgaltatasok/marketing-automatizacio" },
];

const COMPANY = [
  { key: "nav.about", href: "/rolunk" },
  { key: "nav.expertise", href: "/szakertelem" },
  { key: "nav.technology", href: "/technologia" },
  { key: "nav.partners", href: "/partnereink" },
  { key: "nav.references", href: "/referenciak" },
  { key: "nav.blog", href: "/hirek" },
  { key: "nav.freeAudit", href: "/ingyenes-audit" },
  { key: "nav.newsletter", href: "/hirlevel" },
  { key: "nav.career", href: "/karrier" },
  { key: "nav.contact", href: "/kapcsolat" },
];

const linkStyle: React.CSSProperties = {
  color: "var(--g2a-text-secondary)",
  fontSize: "0.875rem",
  textDecoration: "none",
  display: "block",
  padding: "0.2rem 0",
  transition: "color 0.2s",
  cursor: "pointer",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        style={linkStyle}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-accent)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-secondary)"; }}
      >
        {children}
      </a>
    </li>
  );
}

/**
 * Site-wide footer. Automatically renders the newsletter signup band above
 * the link-grid, except on:
 *   - the Home page (which has its own newsletter section in the page flow)
 *   - the /hirlevel landing page (the page IS the form)
 *   - the /admin area (no public chrome)
 *
 * Pass `hideNewsletter` explicitly when a page wants to suppress the band
 * (e.g. /hirlevel does this even though the location check would also
 * catch it — belt-and-braces).
 */
export default function Footer({ hideNewsletter = false }: { hideNewsletter?: boolean } = {}) {
  const { t } = useLanguage();
  const [location] = useLocation();
  const skipNewsletter =
    hideNewsletter ||
    location === "/" ||
    location === "/hirlevel" ||
    location.startsWith("/admin");

  return (
    <>
    {!skipNewsletter && <NewsletterSection />}
    <footer style={{ backgroundColor: "var(--g2a-bg-2)", borderTop: "1px solid var(--g2a-border)", paddingTop: "4rem" }}>
      <div className="g2a-container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
          paddingBottom: "3rem",
        }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <a href="/" style={{ display: "inline-block", marginBottom: "1.25rem" }}>
              <img
                className="g2a-footer-logo"
                src={LOGO_URL}
                alt="G2A Marketing"
                style={{ height: "44px", width: "auto" }}
                loading="lazy"
              />
            </a>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem", maxWidth: "260px" }}>
              {t("footer.tagline")}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { href: "https://www.facebook.com/g2amarketing", icon: <Facebook size={16} />, label: "Facebook" },
                { href: "https://www.youtube.com/g2amarketing", icon: <Youtube size={16} />, label: "YouTube" },
                { href: "https://www.linkedin.com/company/g2a-marketing/", icon: <Linkedin size={16} />, label: "LinkedIn" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px",
                    backgroundColor: "var(--g2a-tile)",
                    border: "1px solid var(--g2a-tile-border)",
                    borderRadius: "6px", color: "var(--g2a-text-secondary)",
                    transition: "all 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#14B8A6";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--g2a-tile)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-secondary)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              {t("footer.services")}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {SERVICES.map(s => (
                <FooterLink key={s.href} href={s.href}>{t(s.key)}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              {t("footer.companyHeader")}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {COMPANY.map(l => (
                <FooterLink key={l.href} href={l.href}>{t(l.key)}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              {t("footer.contactHeader")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a
                href="tel:+36301902575"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-secondary)"; }}
              >
                <Phone size={14} style={{ color: "var(--g2a-text-accent)", flexShrink: 0 }} />
                +36 30 190 2575
              </a>
              <a
                href="mailto:info@g2amarketing.hu"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-secondary)"; }}
              >
                <Mail size={14} style={{ color: "var(--g2a-text-accent)", flexShrink: 0 }} />
                info@g2amarketing.hu
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem" }}>
                <Clock size={14} style={{ color: "var(--g2a-text-accent)", flexShrink: 0 }} />
                {t("footer.workingHoursValue")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem" }}>
                <MapPin size={14} style={{ color: "var(--g2a-text-accent)", flexShrink: 0 }} />
                {t("contact.addressValue")}
              </div>
            </div>

            {/* Calendly direct-booking link — kept as the single secondary CTA
                in the footer contact block. The primary "Ingyenes audit" button
                was removed per design feedback (already redundant with the
                sticky CTA and the main nav). */}
            <div style={{ marginTop: "1.25rem", fontSize: "0.8125rem", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace" }}>
              {t("footer.orBookSlot")}{" "}
              <CalendlyTextLink text={t("footer.bookSlotLink")} style={{ fontWeight: 600 }} />
            </div>
          </div>
        </div>

        {/* Impressum / company identification — required by Eker. tv. 4. § c-d
            and the Hungarian commercial law for limited partnerships (Bt.).
            Kept compact: one line on desktop, wraps on mobile. */}
        <div
          style={{
            borderTop: "1px solid var(--g2a-border)",
            padding: "1rem 0",
            color: "var(--g2a-text-muted)",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            fontFamily: "Geist Mono, monospace",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.25rem 1.25rem",
          }}
        >
          <span>
            <strong style={{ color: "var(--g2a-text-secondary)" }}>
              {t("footer.impressum")}:
            </strong>{" "}
            G2A Marketing Bt.
          </span>
          <span>{t("footer.impressum.address")}: 7625 Pécs, Péter utca 1. fszt. 1.</span>
          <span>{t("footer.impressum.regNumber")}: 02-06-075160</span>
          <span>{t("footer.impressum.taxNumber")}: 32070325-1-02</span>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid var(--g2a-border)",
          padding: "1.5rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", margin: 0 }}>
            © {new Date().getFullYear()} G2A Marketing. {t("footer.rights")}
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a
              href="/adatvedelmi-iranyelvek"
              style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
            >
              {t("footer.privacy")}
            </a>
            <a
              href="/aszf"
              style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
            >
              {t("footer.terms")}
            </a>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("g2a:open-cookie-settings"));
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--g2a-text-muted)",
                fontSize: "0.8125rem",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--g2a-text-accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--g2a-text-muted)"; }}
            >
              {t("footer.cookieSettings")}
            </button>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
