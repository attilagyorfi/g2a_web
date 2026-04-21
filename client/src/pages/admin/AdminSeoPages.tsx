import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Save, Plus, X, Tag } from "lucide-react";
import { toast } from "sonner";

const PREDEFINED_PAGES = [
  { slug: "/", label: "Főoldal" },
  { slug: "/szolgaltatasok", label: "Szolgáltatások" },
  { slug: "/rolunk", label: "Rólunk" },
  { slug: "/referenciank", label: "Referenciák" },
  { slug: "/blog", label: "Blog" },
  { slug: "/kapcsolat", label: "Kapcsolat" },
  { slug: "/ingyenes-seo-audit", label: "Ingyenes SEO Audit" },
  { slug: "/ingyenes-marketing-audit", label: "Ingyenes Marketing Audit" },
  { slug: "/seo-keresőoptimalizálás", label: "SEO Szolgáltatás" },
  { slug: "/ppc-google-ads", label: "PPC / Google Ads" },
  { slug: "/meta-hirdetesek", label: "Meta Hirdetések" },
  { slug: "/tartalommarketing", label: "Tartalommarketing" },
  { slug: "/kozossegi-media-kezeles", label: "Közösségi Média" },
  { slug: "/marketing-automatizacio", label: "Marketing Automatizáció" },
  { slug: "/webfejlesztes", label: "Webfejlesztés" },
  { slug: "/ai-marketing", label: "AI Marketing" },
  { slug: "/esg-kommunikacio", label: "ESG Kommunikáció" },
  { slug: "/employer-branding", label: "Employer Branding" },
  { slug: "/nemzetkozi-marketing", label: "Nemzetközi Marketing" },
];

const emptyForm = {
  title: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
  schemaJson: "",
  keywords: "",
};

const ls: React.CSSProperties = {
  display: "block",
  color: "#888",
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "0.375rem",
  fontFamily: "JetBrains Mono, monospace",
};
const is: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#111",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "0.625rem 0.75rem",
  color: "#fff",
  fontSize: "0.875rem",
  fontFamily: "JetBrains Mono, monospace",
  outline: "none",
  boxSizing: "border-box" as const,
};

export default function AdminSeoPages() {
  const { data: dbPages, refetch } = trpc.admin.pages.list.useQuery();
  const upsertMutation = trpc.admin.pages.upsert.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("SEO beállítások mentve!");
    },
    onError: () => toast.error("Hiba a mentés során."),
  });

  const [pages, setPages] = useState(PREDEFINED_PAGES);
  const [selectedSlug, setSelectedSlug] = useState(PREDEFINED_PAGES[0].slug);
  const [form, setForm] = useState(emptyForm);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageLabel, setNewPageLabel] = useState("");

  // Merge DB pages with predefined pages
  useEffect(() => {
    if (!dbPages) return;
    const dbSlugs = dbPages.map((p: any) => p.slug);
    const extra = dbSlugs
      .filter((slug: string) => !PREDEFINED_PAGES.find((p) => p.slug === slug))
      .map((slug: string) => ({ slug, label: slug }));
    setPages([...PREDEFINED_PAGES, ...extra]);
  }, [dbPages]);

  // Load form data when slug changes
  useEffect(() => {
    if (!dbPages) return;
    const dbPage = dbPages.find((p: any) => p.slug === selectedSlug);
    if (dbPage) {
      setForm({
        title: dbPage.title || "",
        metaTitle: dbPage.metaTitle || "",
        metaDescription: dbPage.metaDescription || "",
        ogTitle: dbPage.ogTitle || "",
        ogDescription: dbPage.ogDescription || "",
        ogImage: dbPage.ogImage || "",
        canonicalUrl: dbPage.canonicalUrl || "",
        schemaJson: dbPage.schemaJson || "",
        keywords: (dbPage as any).keywords || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedSlug, dbPages]);

  const handleAddNewPage = () => {
    if (!newPageSlug.trim()) {
      toast.error("Az oldal slug nem lehet üres!");
      return;
    }
    const slug = newPageSlug.startsWith("/") ? newPageSlug : `/${newPageSlug}`;
    if (pages.find((p) => p.slug === slug)) {
      toast.error("Ez a slug már létezik!");
      return;
    }
    const label = newPageLabel.trim() || slug;
    setPages((prev) => [...prev, { slug, label }]);
    setSelectedSlug(slug);
    setNewPageSlug("");
    setNewPageLabel("");
    setShowNewPageForm(false);
    toast.success("Új oldal hozzáadva. Töltsd ki a SEO mezőket és mentsd el.");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          SEO / Oldalak
        </h1>
        <button
          onClick={() => setShowNewPageForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--g2a-amber)",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Új oldal létrehozása
        </button>
      </div>

      {showNewPageForm && (
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              Új oldal hozzáadása
            </h3>
            <button
              onClick={() => setShowNewPageForm(false)}
              style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div>
              <label style={ls}>Slug (URL útvonal)</label>
              <input
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                style={is}
                placeholder="/iparagi-landing-oldal"
              />
            </div>
            <div>
              <label style={ls}>Megjelenítési név</label>
              <input
                value={newPageLabel}
                onChange={(e) => setNewPageLabel(e.target.value)}
                style={is}
                placeholder="Iparági Landing Oldal"
              />
            </div>
            <button
              onClick={handleAddNewPage}
              style={{
                backgroundColor: "var(--g2a-amber)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "0.625rem 1rem",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Hozzáadás
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem" }}>
        {/* Sidebar */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            overflow: "hidden",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                textAlign: "left",
                background:
                  selectedSlug === p.slug ? "rgba(245,158,11,0.1)" : "none",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: selectedSlug === p.slug ? "var(--g2a-amber)" : "#aaa",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p.label}
              <span
                style={{
                  display: "block",
                  color: "#555",
                  fontSize: "0.68rem",
                  marginTop: "0.15rem",
                }}
              >
                {p.slug}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {pages.find((p) => p.slug === selectedSlug)?.label} – SEO beállítások
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              upsertMutation.mutate({ slug: selectedSlug, ...form });
            }}
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={ls}>Oldal cím</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  style={is}
                />
              </div>
              <div>
                <label style={ls}>
                  Meta cím{" "}
                  <span style={{ color: "#555" }}>(max 60 karakter)</span>
                </label>
                <input
                  value={form.metaTitle}
                  onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))}
                  style={is}
                  maxLength={60}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      color: form.metaTitle.length > 55 ? "var(--g2a-amber)" : "#555",
                      fontSize: "0.7rem",
                    }}
                  >
                    {form.metaTitle.length}/60
                  </span>
                  {form.metaTitle.length > 0 && (
                    <span style={{ color: "#555", fontSize: "0.7rem" }}>
                      Google keresési megjelenítés
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label style={ls}>
                  Meta leírás{" "}
                  <span style={{ color: "#555" }}>(max 160 karakter)</span>
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, metaDescription: e.target.value }))
                  }
                  style={{ ...is, resize: "vertical" }}
                  rows={3}
                  maxLength={160}
                />
                <span
                  style={{
                    color: form.metaDescription.length > 150 ? "var(--g2a-amber)" : "#555",
                    fontSize: "0.7rem",
                  }}
                >
                  {form.metaDescription.length}/160
                </span>
              </div>

              {/* Keywords field */}
              <div>
                <label
                  style={{
                    ...ls,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Tag size={12} /> Kulcsszavak{" "}
                  <span
                    style={{
                      color: "#555",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (vesszővel elválasztva)
                  </span>
                </label>
                <input
                  value={form.keywords}
                  onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))}
                  style={is}
                  placeholder="seo, keresőoptimalizálás, google, marketing"
                />
                {form.keywords && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {form.keywords
                      .split(",")
                      .map((kw) => kw.trim())
                      .filter(Boolean)
                      .map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "rgba(245,158,11,0.15)",
                            border: "1px solid rgba(245,158,11,0.3)",
                            borderRadius: "4px",
                            padding: "0.2rem 0.5rem",
                            color: "var(--g2a-amber)",
                            fontSize: "0.72rem",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "1rem",
                }}
              >
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  }}
                >
                  Open Graph (közösségi média)
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label style={ls}>OG Cím</label>
                    <input
                      value={form.ogTitle}
                      onChange={(e) => setForm((p) => ({ ...p, ogTitle: e.target.value }))}
                      style={is}
                    />
                  </div>
                  <div>
                    <label style={ls}>OG Kép URL</label>
                    <input
                      value={form.ogImage}
                      onChange={(e) => setForm((p) => ({ ...p, ogImage: e.target.value }))}
                      style={is}
                    />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={ls}>OG Leírás</label>
                    <textarea
                      value={form.ogDescription}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, ogDescription: e.target.value }))
                      }
                      style={{ ...is, resize: "vertical" }}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "1rem",
                }}
              >
                <div>
                  <label style={ls}>Canonical URL</label>
                  <input
                    value={form.canonicalUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, canonicalUrl: e.target.value }))
                    }
                    style={is}
                    placeholder="https://g2amarketing.hu/..."
                  />
                </div>
              </div>
              <div>
                <label style={ls}>JSON-LD Schema</label>
                <textarea
                  value={form.schemaJson}
                  onChange={(e) => setForm((p) => ({ ...p, schemaJson: e.target.value }))}
                  style={{ ...is, resize: "vertical", fontFamily: "monospace" }}
                  rows={6}
                  placeholder='{"@context": "https://schema.org", ...}'
                />
              </div>
              <button
                type="submit"
                disabled={upsertMutation.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--g2a-amber)",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.625rem 1.25rem",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <Save size={16} />{" "}
                {upsertMutation.isPending ? "Mentés..." : "SEO mentése"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
