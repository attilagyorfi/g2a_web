import { Phone, Mail, Clock, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";

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

const linkStyle: React.CSSProperties = {
  color: "#888",
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
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e91130"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
      >
        {children}
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "4rem" }}>
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
                style={{ height: "44px", width: "auto" }}
                loading="lazy"
              />
            </a>
            <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem", maxWidth: "260px" }}>
              Adatvezérelt, kreatív online marketing ügynökség. Segítünk márkájának kiemelkedni a digitális térben.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { href: "https://www.facebook.com/g2amarketing", icon: <Facebook size={16} />, label: "Facebook" },
                { href: "https://www.youtube.com/g2amarketing", icon: <Youtube size={16} />, label: "YouTube" },
                { href: "https://www.linkedin.com/company/g2amarketing", icon: <Linkedin size={16} />, label: "LinkedIn" },
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
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderRadius: "6px", color: "#b0b0b0",
                    transition: "all 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#e91130";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#b0b0b0";
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
              color: "#ffffff", fontFamily: "Roboto Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              Szolgáltatások
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {services.map(s => (
                <FooterLink key={s.href} href={s.href}>{s.title}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              color: "#ffffff", fontFamily: "Roboto Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              Vállalat
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {company.map(l => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: "#ffffff", fontFamily: "Roboto Mono, monospace",
              fontSize: "0.8125rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}>
              Elérhetőség
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a
                href="tel:+36301902575"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e91130"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
              >
                <Phone size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                +36 30 190 2575
              </a>
              <a
                href="mailto:info@g2amarketing.hu"
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e91130"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
              >
                <Mail size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                info@g2amarketing.hu
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem" }}>
                <Clock size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                H–P: 08:00 – 17:00
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem" }}>
                <MapPin size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                Pécs, Magyarország
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "1.5rem" }}>
              <a
                href="/ingyenes-audit"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: "#e91130", color: "#fff",
                  padding: "0.625rem 1.25rem", borderRadius: "6px",
                  fontSize: "0.8125rem", fontWeight: 600,
                  textDecoration: "none", fontFamily: "Roboto Mono, monospace",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c40e28"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#e91130"; }}
              >
                Ingyenes Audit
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "1.5rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            © {new Date().getFullYear()} G2A Marketing. Minden jog fenntartva.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a
              href="/adatvedelmi-iranyelvek"
              style={{ color: "#666", fontSize: "0.8125rem", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e91130"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#666"; }}
            >
              Adatvédelmi Irányelvek
            </a>
            <a
              href="/admin"
              style={{ color: "#444", fontSize: "0.8125rem", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#444"; }}
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
