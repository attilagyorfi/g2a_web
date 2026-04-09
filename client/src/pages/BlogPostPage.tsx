import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { data: post, isLoading } = trpc.content.postBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--g2a-text-muted)" }}>Betöltés...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ color: "var(--g2a-text-primary)" }}>Cikk nem található</h1>
          <Link href="/hirek" className="g2a-btn-primary">Vissza a bloghoz</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={post.metaTitle || `${post.title} – G2A Marketing Blog`}
        description={post.metaDescription || post.excerpt || ""}
        ogImage={post.featuredImage || undefined}
        canonicalUrl={`https://g2amarketing.hu/hirek/${post.slug}`}
        schemaJson={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || "",
          "image": post.featuredImage || "",
          "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : "",
          "author": { "@type": "Person", "name": post.authorName || "G2A Marketing" },
          "publisher": { "@type": "Organization", "name": "G2A Marketing", "url": "https://g2amarketing.hu" },
        })}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        {post.featuredImage && (
          <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
            <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(26,26,26,1) 100%)" }} />
          </div>
        )}

        <article style={{ backgroundColor: "var(--g2a-bg-2)", paddingBottom: "5rem" }}>
          <div className="g2a-container" style={{ maxWidth: "800px" }}>
            <div style={{ paddingTop: post.featuredImage ? "0" : "3rem" }}>
              <Link href="/hirek" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                <ArrowLeft size={14} /> Vissza a bloghoz
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {post.categoryId && (
                  <span className="g2a-tag"><Tag size={10} style={{ display: "inline", marginRight: "4px" }} />Kategória</span>
                )}
                {post.publishedAt && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-text-muted)", fontSize: "0.8125rem" }}>
                    <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
                {post.authorName && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-text-muted)", fontSize: "0.8125rem" }}>
                    <User size={12} /> {post.authorName}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3, marginBottom: "2rem" }}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p style={{ fontSize: "1.125rem", color: "var(--g2a-text-secondary)", lineHeight: 1.7, marginBottom: "2rem", borderLeft: "3px solid var(--g2a-amber)", paddingLeft: "1.25rem", fontStyle: "italic" }}>
                  {post.excerpt}
                </p>
              )}

              <div className="g2a-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
