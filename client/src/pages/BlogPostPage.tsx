import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, Tag, Clock, Newspaper } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonLd";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import EmptyState from "@/components/illustrations/EmptyState";
import { SkeletonHeroPage } from "@/components/Skeleton";
import { ogImageUrl } from "@/lib/cloudinary";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";

const ACCENT = "#14B8A6";

/** Estimate reading time in minutes from raw HTML/text — assumes 200 wpm. */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const { data: post, isLoading } = trpc.content.postBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <SkeletonHeroPage />
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navigation />
        <main style={{ paddingTop: "100px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EmptyState
            variant="no-content"
            title={t("blog.noResults")}
            description={t("blog.notFoundDesc")}
            action={
              <Link href="/hirek" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary">{t("references.back")}</span>
              </Link>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  const title = pickLocalized(post, "title", lang);
  const excerpt = pickLocalized(post, "excerpt", lang);
  const content = pickLocalized(post, "content", lang) || post.content;
  const metaTitle = pickLocalized(post, "metaTitle", lang);
  const metaDesc = pickLocalized(post, "metaDescription", lang);
  const readMin = estimateReadingTime(content || "");

  return (
    <>
      <SeoHead
        title={metaTitle || `${title} – G2A Marketing Blog`}
        description={metaDesc || excerpt}
        ogImage={post.featuredImage || ogImageUrl(title, "G2A Marketing — Blog")}
        canonicalUrl={`https://g2amarketing.hu/hirek/${post.slug}`}
        pageSchemas={[
          breadcrumbSchema([
            { name: "G2A Marketing", url: "https://g2amarketing.hu" },
            { name: "Blog", url: "https://g2amarketing.hu/hirek" },
            { name: title, url: `https://g2amarketing.hu/hirek/${post.slug}` },
          ]),
          articleSchema({
            headline: title,
            description: excerpt,
            url: `https://g2amarketing.hu/hirek/${post.slug}`,
            imageUrl: post.featuredImage || undefined,
            publishedAt: post.publishedAt
              ? new Date(post.publishedAt).toISOString()
              : undefined,
            modifiedAt: post.updatedAt
              ? new Date(post.updatedAt).toISOString()
              : undefined,
            authorName: post.authorName || undefined,
          }),
        ]}
      />
      <ScrollProgressBar />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          position: "relative",
          padding: "3.5rem 0 3rem",
          background: `radial-gradient(ellipse at 70% 30%, ${ACCENT}14, transparent 55%), var(--g2a-bg)`,
          overflow: "hidden",
          borderBottom: "1px solid var(--g2a-border)",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, maxWidth: "880px" }}>
            {/* Back link */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: "1.75rem" }}
            >
              <Link href="/hirek" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.78rem", textDecoration: "none", fontFamily: "Geist Mono, monospace", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                <ArrowLeft size={13} /> {t("references.back")}
              </Link>
            </motion.div>

            {/* Category badge */}
            {post.categoryId && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ marginBottom: "1rem" }}
              >
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: `${ACCENT}1f`,
                  border: `1px solid ${ACCENT}40`,
                  color: ACCENT,
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  <Tag size={9} /> {t("blog.allCategories")}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                fontSize: "clamp(1.85rem, 3.5vw, 2.85rem)",
                fontWeight: 800,
                color: "var(--g2a-text-primary)",
                fontFamily: "Geist, sans-serif",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: excerpt ? "1.25rem" : "1.75rem",
                maxWidth: "780px",
              }}
            >
              {title}
            </motion.h1>

            {/* Lede / excerpt */}
            {excerpt && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                style={{
                  fontSize: "1.1rem",
                  color: "var(--g2a-text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "1.75rem",
                  maxWidth: "720px",
                  fontFamily: "Geist, sans-serif",
                }}
              >
                {excerpt}
              </motion.p>
            )}

            {/* Meta strip */}
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
                paddingTop: "1.25rem",
                borderTop: "1px solid var(--g2a-border)",
              }}
            >
              {post.publishedAt && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.04em" }}>
                  <Calendar size={12} style={{ color: ACCENT }} />
                  {new Date(post.publishedAt).toLocaleDateString(t("common.dateLocale"), { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {post.authorName && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem" }}>
                  <User size={12} style={{ color: ACCENT }} />
                  {post.authorName}
                </span>
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem" }}>
                <Clock size={12} style={{ color: ACCENT }} />
                {readMin} {t("blog.minRead")}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.04em" }}>
                <Newspaper size={12} style={{ color: ACCENT }} />
                G2A Blog
              </span>
            </motion.div>
          </div>
        </section>

        {/* Featured image — full-bleed below hero */}
        {post.featuredImage && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ position: "relative", height: "min(440px, 50vw)", overflow: "hidden", borderBottom: "1px solid var(--g2a-border)" }}
          >
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(20,20,22,0.4) 100%)", pointerEvents: "none" }} />
          </motion.div>
        )}

        {/* Article body */}
        <article style={{ backgroundColor: "var(--g2a-bg-2)", paddingBottom: "5rem" }}>
          <div className="g2a-container" style={{ maxWidth: "800px" }}>
            <div style={{ paddingTop: "3rem" }}>
              <div className="g2a-prose" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
