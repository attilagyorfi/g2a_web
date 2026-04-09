import { Phone, Mail, Clock, MapPin, Facebook, Youtube, Linkedin, ArrowRight } from "lucide-react";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const services = [
  { title: "Lokalizáció", href: "/szolgaltatasok/lokalizacio" },
  { title: "Arculattervezés", href: "/szolgaltatasok/arculattervezes" },
  { title: "Hirdetéskezelés", href: "/szolgaltatasok/hirdeteskezeles" },
  { title: "Közösségi Média", href: "/szolgaltatasok/kozossegi-media" },
  { title: "Stratégiai Marketing", href: "/szolgaltatasok/strategiai-marketing" },
  { title: "Keresőoptimalizálás", href: "/szolgaltatasok/seo" },
  { title: "Webfejlesztés", href: "/szolgaltatasok/webfejlesztes" },
  { title: "AI Marketing", href: "/szolgaltatasok/ai-marketing" },
  { title: "PPC / Google Ads", href: "/szolgaltatasok/ppc-google-ads" },
  { title: "Meta Hirdetések", href: "/szolgaltatasok/meta-hirdetes" },
  { title: "Tartalommarketing", href: "/szolgaltatasok/tartalommarketing" },
  { title: "Marketing Automatizáció", href: "/szolgaltatasok/marketing-automatizacio" },
];

const company = [
  { href: "/rolunk", label: "Rólunk" },
  { href: "/szakertelem", label: "Szakértelem" },
  { href: "/technologia", label: "Technológia" },
  { href: "/partnereink", label: "Partnereink" },
  { href: "/referenciak", label: "Referenciák" },
  { href: "/hirek", label: "Hírek & Blog" },
  { href: "/ingyenes-audit", label: "Ingyenes Audit" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        style={{
          color: "var(--g2a-text-muted)",
          fontSize: "0.875rem",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.25rem 0",
          transition: "color 0.2s",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.5,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-amber)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
      >
        {children}
      </a>
    </li>
  );
}

const headingStyle: React.CSSProperties = {
  color: "var(--g2a-text-primary)",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "1.25rem",
};

export default function Footer() {
  return (
    <footer style={{
      background: "var(--g2a-bg)",
      borderTop: "1px solid var(--g2a-border)",
      paddingTop: "4rem",
    }}>
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
                src={LOGO_URL}
                alt="G2A Marketing logó"
                style={{ height: "40px", width: "auto" }}
                loading="lazy"
              />
            </a>
            <p style={{
              color: "var(--g2a-text-muted)",
              fontSize: "0.875rem",
              lineHeight: "1.7",
              marginBottom: "1.5rem",
              maxWidth: "260px",
              fontFamily: "'Inter', sans-serif",
            }}>
              Adatvezérelt, kreatív online marketing ügynökség. Segítünk márkájának kiemelkedni a digitális térben.
            </p>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {[
                { href: "https://www.facebook.com/g2amarketing", icon: <Facebook size={15} />, label: "Facebook" },
                { href: "https://www.youtube.com/g2amarketing", icon: <Youtube size={15} />, label: "YouTube" },
                { href: "https://www.linkedin.com/company/g2amarketing", icon: <Linkedin size={15} />, label: "LinkedIn" },
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
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: "8px", color: "var(--g2a-text-muted)",
                    transition: "all 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "var(--g2a-amber)";
                    el.style.borderColor = "var(--g2a-amber)";
                    el.style.color = "#000";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "var(--g2a-bg-card)";
                    el.style.borderColor = "var(--g2a-border)";
                    el.style.color = "var(--g2a-text-muted)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={headingStyle}>Szolgáltatások</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              {services.map(s => (
                <FooterLink key={s.href} href={s.href}>{s.title}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={headingStyle}>Vállalat</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              {company.map(l => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={headingStyle}>Elérhetőség</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a
                href="tel:+36301902575"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", textDecoration: "none", fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-amber)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
              >
                <Phone size={14} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />
                +36 30 190 2575
              </a>
              <a
                href="mailto:info@g2amarketing.hu"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", textDecoration: "none", fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-amber)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
              >
                <Mail size={14} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />
                info@g2amarketing.hu
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                <Clock size={14} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />
                H–P: 08:00 – 17:00
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                <MapPin size={14} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />
                Pécs, Magyarország
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "1.5rem" }}>
              <a
                href="/ingyenes-audit"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "var(--g2a-amber)", color: "#000",
                  padding: "0.625rem 1.25rem", borderRadius: "8px",
                  fontSize: "0.8125rem", fontWeight: 700,
                  textDecoration: "none", fontFamily: "'Inter', sans-serif",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--g2a-amber-hover)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--g2a-amber)"; }}
              >
                Ingyenes Audit <ArrowRight size={13} />
              </a>
            </div>
          </div>
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
          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", margin: 0, fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} G2A Marketing. Minden jog fenntartva.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a
              href="/adatvedelmi-iranyelvek"
              style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", textDecoration: "none", fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-amber)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--g2a-text-muted)"; }}
            >
              Adatvédelmi Irányelvek
            </a>
            <a
              href="/admin"
              style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", textDecoration: "none", fontFamily: "'Inter', sans-serif", transition: "color 0.2s", opacity: 0.5 }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.5"; }}
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
