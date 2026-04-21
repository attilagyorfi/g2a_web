import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

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
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("blog.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem" }}>
              Hírek & Cikkek
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Marketing tippek, trendek és iparági hírek a G2A Marketing csapatától.
            </p>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
                <button
                  onClick={() => { setSelectedCategory(null); setPage(1); }}
                  style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Roboto Mono, monospace", transition: "all 0.2s", backgroundColor: selectedCategory === null ? "#e91130" : "transparent", borderColor: selectedCategory === null ? "#e91130" : "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                  Összes
                </button>
                {categories.map(cat => (
                  <button key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid", fontSize: "0.875rem", cursor: "pointer", fontFamily: "Roboto Mono, monospace", transition: "all 0.2s", backgroundColor: selectedCategory === cat.id ? "#e91130" : "transparent", borderColor: selectedCategory === cat.id ? "#e91130" : "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Posts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {posts.map(post => (
                <Link key={post.id} href={`/hirek/${post.slug}`} style={{ textDecoration: "none" }}>
                  <article className="g2a-card" style={{ height: "100%", cursor: "pointer", padding: 0, overflow: "hidden" }}>
                    {post.featuredImage && (
                      <div style={{ height: "200px", overflow: "hidden" }}>
                        <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                      </div>
                    )}
                    <div style={{ padding: "1.5rem" }}>
                      {post.categoryId && categories?.find(c => c.id === post.categoryId) && (
                        <span className="g2a-tag" style={{ marginBottom: "0.75rem", display: "inline-block" }}>{categories.find(c => c.id === post.categoryId)?.name}</span>
                      )}
                      <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#666", fontSize: "0.75rem" }}>
                            <Calendar size={11} />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "en" ? "en-GB" : "hu-HU") : ""}
                          </span>
                          {post.authorName && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#666", fontSize: "0.75rem" }}>
                              <User size={11} /> {post.authorName}
                            </span>
                          )}
                        </div>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#e91130", fontSize: "0.8125rem", fontWeight: 500 }}>
                          Olvasás <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {posts.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#666" }}>
                Nem találhatók cikkek ebben a kategóriában.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", transition: "all 0.2s", backgroundColor: p === page ? "#e91130" : "transparent", borderColor: p === page ? "#e91130" : "rgba(255,255,255,0.2)", color: "#ffffff" }}>
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
