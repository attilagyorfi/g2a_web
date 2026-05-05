/**
 * Above-footer newsletter band — rendered automatically inside <Footer />
 * for every public page that's NOT the homepage (which has its own newsletter
 * section in the page flow) and NOT the dedicated /hirlevel page.
 *
 * The band spans the full width with a subtle teal-tinted gradient to break
 * up the page background; the embedded form uses the "compact" variant.
 */
import NewsletterForm from "./NewsletterForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewsletterSection() {
  const { t } = useLanguage();

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, var(--g2a-bg-2) 50%, rgba(20,184,166,0.05) 100%)",
        borderTop: "1px solid var(--g2a-border)",
        borderBottom: "1px solid var(--g2a-border)",
        padding: "3.5rem 0",
      }}
    >
      <div className="g2a-container" style={{ maxWidth: 720, textAlign: "center" }}>
        <div className="g2a-section-label" style={{ marginBottom: "0.75rem" }}>
          {t("newsletter.bandLabel")}
        </div>
        <h2
          style={{
            fontFamily: "Geist, sans-serif",
            fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
            fontWeight: 700,
            color: "var(--g2a-text-primary)",
            marginBottom: "0.6rem",
          }}
        >
          {t("newsletter.bandTitle")}
        </h2>
        <p
          style={{
            color: "var(--g2a-text-secondary)",
            fontSize: "0.95rem",
            lineHeight: 1.55,
            marginBottom: "1.5rem",
          }}
        >
          {t("newsletter.bandSubtitle")}
        </p>
        <NewsletterForm variant="compact" />
        <p
          style={{
            color: "var(--g2a-text-muted)",
            fontSize: "0.75rem",
            marginTop: "0.875rem",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {t("newsletter.bandFinePrint")}
        </p>
      </div>
    </section>
  );
}
