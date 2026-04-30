import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import RevealImage from "@/components/RevealImage";
import BlogHeroDemo from "@/components/page-demos/BlogHeroDemo";
import EmptyState from "@/components/illustrations/EmptyState";
import { pickLocalized } from "@/../../shared/i18n";

export default function BlogPage() {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { data: postsData } = trpc.content.posts.useQuery({ page, limit: 9, categoryId: selectedCategory || undefined });
  const { data: categories } = trpc.content.categories.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/hirek" });

  const posts = postsData?.posts || [];
  const total = postsData?.total || 0;
  const totalPages = Math.ceil(total / 9);

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || "Hírek & Blog – G2A Marketing Pécs"} description={pageSeo?.metaDescription || "Marketing tippek, trendek és iparági hírek a G2A Marketing csapatától."} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 80% 30%, var(--g2a-hero-tint) 0%, transparent 55%), var(--g2a-bg)",
        }}>
          <div className="g2a-container">
            <div
              className="g2a-service-hero-grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 460px)", gap: "3rem", alignItems: "center" }}
            >
              <div>
                <div className="g2a-section-label">{t("blog.sectionLabel")}</div>
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem" }}>
                  {t("blog.title")}
                </h1>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "560px" }}>
                  {t("blog.subtitle")}
                </p>
              </div>
              <div className="g2a-service-hero-demo">
                <BlogHeroDemo />
              </div>
            </div>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
                <button
                  onClick={() => { setSelectedCategory(null); setPage(1); }}
                  style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Geist Mono, monospace", transition: "all 0.2s", backgroundColor: selectedCategory === null ? "#14B8A6" : "transparent", borderColor: selectedCategory === null ? "#14B8A6" : "rgba(255,255,255,0.2)", color: "var(--g2a-text-primary)" }}>
                  {t("references.filterAll")}
                </button>
                {categories.map(cat => (
                  <button key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Geist Mono, monospace", transition: "all 0.2s", backgroundColor: selectedCategory === cat.id ? "#14B8A6" : "transparent", borderColor: selectedCategory === cat.id ? "#14B8A6" : "rgba(255,255,255,0.2)", color: "var(--g2a-text-primary)" }}>
                    {pickLocalized(cat, "name", lang)}
                  </button>
                ))}
              </div>
            )}

            {/* Posts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {posts.map(post => {
                const postTitle = pickLocalized(post, "title", lang);
                const postExcerpt = pickLocalized(post, "excerpt", lang);
                const cat = categories?.find(c => c.id === post.categoryId);
                return (
                <Link key={post.id} href={`/hirek/${post.slug}`} style={{ textDecoration: "none" }}>
                  <article className="g2a-card" style={{ height: "100%", cursor: "pointer", padding: 0, overflow: "hidden" }}>
                    {post.featuredImage && (
                      <RevealImage
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || postTitle}
                        wrapperStyle={{ height: "200px" }}
                        imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <div style={{ padding: "1.5rem" }}>
                      {cat && (
                        <span className="g2a-tag" style={{ marginBottom: "0.75rem", display: "inline-block" }}>{pickLocalized(cat, "name", lang)}</span>
                      )}
                      <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                        {postTitle}
                      </h2>
                      {postExcerpt && (
                        <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                          {postExcerpt}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#666", fontSize: "0.75rem" }}>
                            <Calendar size={11} />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(t("common.dateLocale")) : ""}
                          </span>
                          {post.authorName && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#666", fontSize: "0.75rem" }}>
                              <User size={11} /> {post.authorName}
                            </span>
                          )}
                        </div>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-brand-teal)", fontSize: "0.8125rem", fontWeight: 500 }}>
                          {t("blog.read")} <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
                );
              })}
            </div>

            {posts.length === 0 && (
              <EmptyState
                variant={selectedCategory ? "no-results" : "no-content"}
                title={selectedCategory ? t("blog.emptyCategoryTitle") : t("blog.emptyTitle")}
                description={selectedCategory ? t("blog.emptyCategoryDesc") : t("blog.emptyDesc")}
                action={
                  selectedCategory ? (
                    <button
                      onClick={() => { setSelectedCategory(null); setPage(1); }}
                      className="g2a-btn-secondary"
                      style={{ cursor: "pointer", border: "none", font: "inherit" }}
                    >
                      {t("blog.viewAllPosts")}
                    </button>
                  ) : undefined
                }
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", transition: "all 0.2s", backgroundColor: p === page ? "#14B8A6" : "transparent", borderColor: p === page ? "#14B8A6" : "rgba(255,255,255,0.2)", color: "var(--g2a-text-primary)" }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
