import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, Tag, Clock, BookOpen, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

// Calculate reading time (average 200 words/min in Hungarian)
function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Extract headings from HTML for TOC
type TocItem = { id: string; text: string; level: number };
function extractToc(html: string): TocItem[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const headings = div.querySelectorAll("h2, h3");
  return Array.from(headings).map((h, i) => ({
    id: `heading-${i}`,
    text: h.textContent || "",
    level: parseInt(h.tagName[1]),
  }));
}

// Inject IDs into headings HTML
function injectHeadingIds(html: string): string {
  let idx = 0;
  return html.replace(/<(h[23])(.*?)>/gi, (_m, tag, attrs) => {
    return `<${tag}${attrs} id="heading-${idx++}">`;
  });
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { data: post, isLoading } = trpc.content.postBySlug.useQuery({ slug });
  const { data: allPosts } = trpc.content.posts.useQuery({ limit: 10, page: 1 });

  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [processedContent, setProcessedContent] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.content) {
      const injected = injectHeadingIds(post.content);
      setProcessedContent(injected);
      setToc(extractToc(post.content));
    }
  }, [post?.content]);

  // Scroll spy for TOC
  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const readingTime = post ? calcReadingTime(post.content) : 0;

  // Related posts: same category or just latest, excluding current
  const relatedPosts = allPosts?.posts
    ?.filter((p) => p.slug !== slug)
    .slice(0, 3) || [];

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
      <main style={{ paddingTop: "80px" }}>
        {/* Hero image */}
        {post.featuredImage && (
          <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
            <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, var(--g2a-bg-2) 100%)" }} />
          </div>
        )}

        <div style={{ backgroundColor: "var(--g2a-bg-2)", paddingBottom: "5rem" }}>
          <div className="g2a-container" style={{ maxWidth: "1100px" }}>
            <div style={{ display: "grid", gridTemplateColumns: toc.length > 0 ? "1fr 280px" : "1fr", gap: "3rem", paddingTop: post.featuredImage ? "0" : "3rem", alignItems: "start" }}>
              {/* Main article */}
              <article>
                <Link href="/hirek" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                  <ArrowLeft size={14} /> Vissza a bloghoz
                </Link>

                {/* Meta row */}
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
                  {/* Reading time */}
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-amber)", fontSize: "0.8125rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    <Clock size={12} /> {readingTime} perc olvasás
                  </span>
                </div>

                <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3, marginBottom: "2rem" }}>
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p style={{ fontSize: "1.125rem", color: "var(--g2a-text-secondary)", lineHeight: 1.7, marginBottom: "2rem", borderLeft: "3px solid var(--g2a-amber)", paddingLeft: "1.25rem", fontStyle: "italic" }}>
                    {post.excerpt}
                  </p>
                )}

                {/* Mobile TOC */}
                {toc.length > 0 && (
                  <div style={{ display: "none", backgroundColor: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }} className="mobile-toc">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--g2a-text-primary)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <BookOpen size={14} style={{ color: "var(--g2a-amber)" }} /> Tartalomjegyzék
                    </div>
                    {toc.map((item) => (
                      <a key={item.id} href={`#${item.id}`} style={{ display: "block", padding: `0.25rem 0 0.25rem ${item.level === 3 ? "1rem" : "0"}`, color: activeHeading === item.id ? "var(--g2a-amber)" : "var(--g2a-text-secondary)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s", borderLeft: activeHeading === item.id ? "2px solid var(--g2a-amber)" : "2px solid transparent", paddingLeft: `${item.level === 3 ? 1.5 : 0.5}rem` }}>
                        {item.text}
                      </a>
                    ))}
                  </div>
                )}

                <div ref={contentRef} className="g2a-prose" dangerouslySetInnerHTML={{ __html: processedContent || post.content }} />

                {/* Author card */}
                <div style={{ marginTop: "3rem", padding: "1.5rem", backgroundColor: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "12px", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "var(--g2a-amber-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--g2a-amber)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {(post.authorName || "G")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--g2a-text-primary)", fontSize: "0.9rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{post.authorName || "G2A Marketing"}</div>
                    <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.8rem" }}>G2A Marketing csapat</div>
                  </div>
                </div>
              </article>

              {/* Sticky TOC sidebar */}
              {toc.length > 0 && (
                <aside style={{ position: "sticky", top: "100px", alignSelf: "start" }}>
                  <div style={{ backgroundColor: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "12px", padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--g2a-text-primary)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <BookOpen size={14} style={{ color: "var(--g2a-amber)" }} /> Tartalomjegyzék
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                      {toc.map((item) => (
                        <a key={item.id} href={`#${item.id}`} style={{ display: "block", padding: `0.3rem 0.5rem 0.3rem ${item.level === 3 ? "1.25rem" : "0.5rem"}`, color: activeHeading === item.id ? "var(--g2a-amber)" : "var(--g2a-text-secondary)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s, background 0.2s", borderRadius: "6px", backgroundColor: activeHeading === item.id ? "var(--g2a-amber-light)" : "transparent", borderLeft: `2px solid ${activeHeading === item.id ? "var(--g2a-amber)" : "transparent"}` }}>
                          {item.text}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Reading progress */}
                  <div style={{ marginTop: "1rem", backgroundColor: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                    <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>Becsült olvasási idő</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      <Clock size={14} /> {readingTime} perc
                    </div>
                  </div>
                </aside>
              )}
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--g2a-border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--g2a-text-primary)" }}>Kapcsolódó cikkek</h2>
                  <Link href="/hirek" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-amber)", fontSize: "0.875rem", textDecoration: "none" }}>
                    Összes cikk <ChevronRight size={14} />
                  </Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} href={`/hirek/${rp.slug}`} style={{ textDecoration: "none" }}>
                      <div className="g2a-card" style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                        {rp.featuredImage && (
                          <img src={rp.featuredImage} alt={rp.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }} />
                        )}
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{rp.title}</div>
                        {rp.excerpt && <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{rp.excerpt}</div>}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--g2a-amber)", fontSize: "0.75rem", marginTop: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>
                          <Clock size={11} /> {calcReadingTime(rp.content)} perc
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
