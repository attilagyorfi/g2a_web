import { Link } from "wouter";
import { Phone, Mail, Clock, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const services = [
  { title: "Lokalizáció", slug: "lokalizacio" },
  { title: "Arculattervezés", slug: "arculattervezes" },
  { title: "Hirdetéskezelés", slug: "hirdeteskezeles" },
  { title: "Közösségi Média", slug: "kozossegi-media" },
  { title: "Stratégiai Marketing", slug: "strategiai-marketing" },
  { title: "Keresőoptimalizálás", slug: "keresőoptimalizalas" },
  { title: "Webfejlesztés", slug: "webfejlesztes" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "4rem" }}>
      <div className="g2a-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", paddingBottom: "3rem" }}>
          {/* Brand */}
          <div>
            <Link href="/">
              <img src={LOGO_URL} alt="G2A Marketing logó" style={{ height: "44px", width: "auto", marginBottom: "1.25rem" }} />
            </Link>
            <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              Adatvezérelt, kreatív online marketing ügynökség. Segítünk márkádnak kiemelkedni a digitális térben.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { href: "https://facebook.com/g2amarketing", icon: <Facebook size={16} />, label: "Facebook" },
                { href: "https://youtube.com/g2amarketing", icon: <Youtube size={16} />, label: "YouTube" },
                { href: "https://linkedin.com/company/g2amarketing", icon: <Linkedin size={16} />, label: "LinkedIn" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "6px", color: "#b0b0b0", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e91130"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#b0b0b0"; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
              Szolgáltatások
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {services.map(s => (
                <li key={s.slug}>
                  <Link href={`/szolgaltatasok/${s.slug}`} style={{ color: "#888", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
              Vállalat
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { href: "/szakertelem", label: "Szakértelem" },
                { href: "/technologia", label: "Technológia" },
                { href: "/partnereink", label: "Partnereink" },
                { href: "/hirek", label: "Hírek & Blog" },
                { href: "/kapcsolat", label: "Kapcsolat" },
                { href: "/adatvedelmi-iranyelvek", label: "Adatvédelmi Irányelvek" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: "#888", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
              Elérhetőség
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                <Phone size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                +36301902575
              </a>
              <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                <Mail size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                info@g2amarketing.hu
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem" }}>
                <Clock size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                08:00 – 17:00
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "#888", fontSize: "0.875rem" }}>
                <MapPin size={14} style={{ color: "#e91130", flexShrink: 0 }} />
                Pécs, Magyarország
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            © {new Date().getFullYear()} G2A Marketing. Minden jog fenntartva.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/adatvedelmi-iranyelvek" style={{ color: "#666", fontSize: "0.8125rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
              Adatvédelmi Irányelvek
            </Link>
            <Link href="/admin" style={{ color: "#444", fontSize: "0.8125rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#888")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
