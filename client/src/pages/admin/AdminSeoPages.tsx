import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Save, Plus, X, Tag, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LocalizedField from "@/components/LocalizedField";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";

const PREDEFINED_PAGES = [
  { slug: "/", label: "Főoldal" },
  { slug: "/szolgaltatasok", label: "Szolgáltatások" },
  { slug: "/rolunk", label: "Rólunk" },
  { slug: "/referenciak", label: "Referenciák" },
  { slug: "/hirek", label: "Blog" },
  { slug: "/kapcsolat", label: "Kapcsolat" },
  { slug: "/ingyenes-seo-audit", label: "Ingyenes SEO Audit" },
  { slug: "/ingyenes-audit", label: "Ingyenes Marketing Audit" },
  { slug: "/szolgaltatasok/keresooptimalizalas", label: "SEO Szolgáltatás" },
  { slug: "/szolgaltatasok/ppc-google-ads", label: "PPC / Google Ads" },
  { slug: "/szolgaltatasok/meta-hirdetes", label: "Meta Hirdetések" },
  { slug: "/szolgaltatasok/tartalommarketing", label: "Tartalommarketing" },
  { slug: "/szolgaltatasok/kozossegi-media", label: "Közösségi Média" },
  { slug: "/szolgaltatasok/marketing-automatizacio", label: "Marketing Automatizáció" },
  { slug: "/szolgaltatasok/webfejlesztes", label: "Webfejlesztés" },
  { slug: "/szolgaltatasok/ai-marketing", label: "AI Marketing" },
  { slug: "/szolgaltatasok/esg-kommunikacio", label: "ESG Kommunikáció" },
  { slug: "/szolgaltatasok/employer-branding", label: "Employer Branding" },
  { slug: "/szolgaltatasok/nemzetkozi-marketing", label: "Nemzetközi Marketing" },
];

type Form = {
  title: string; titleEn: string; titleZh: string;
  metaTitle: string; metaTitleEn: string; metaTitleZh: string;
  metaDescription: string; metaDescriptionEn: string; metaDescriptionZh: string;
  ogTitle: string; ogTitleEn: string; ogTitleZh: string;
  ogDescription: string; ogDescriptionEn: string; ogDescriptionZh: string;
  ogImage: string;
  canonicalUrl: string;
  schemaJson: string;
  keywords: string; keywordsEn: string; keywordsZh: string;
};

const emptyForm: Form = {
  title: "", titleEn: "", titleZh: "",
  metaTitle: "", metaTitleEn: "", metaTitleZh: "",
  metaDescription: "", metaDescriptionEn: "", metaDescriptionZh: "",
  ogTitle: "", ogTitleEn: "", ogTitleZh: "",
  ogDescription: "", ogDescriptionEn: "", ogDescriptionZh: "",
  ogImage: "",
  canonicalUrl: "",
  schemaJson: "",
  keywords: "", keywordsEn: "", keywordsZh: "",
};

const ls: React.CSSProperties = {
  display: "block",
  color: "#888",
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "0.375rem",
  fontFamily: "Geist Mono, monospace",
};
const is: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#111",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "0.625rem 0.75rem",
  color: "#fff",
  fontSize: "0.875rem",
  fontFamily: "Geist Mono, monospace",
  outline: "none",
  boxSizing: "border-box" as const,
};

export default function AdminSeoPages() {
  const confirm = useConfirm();
  const { data: dbPages, refetch } = trpc.admin.pages.list.useQuery();
  const upsertMutation = trpc.admin.pages.upsert.useMutation({
    onSuccess: () => { refetch(); toast.success("SEO beállítások mentve!"); },
    onError: () => toast.error("Hiba a mentés során."),
  });

  // AI assist (OpenAI)
  const aiStatus = trpc.admin.ai.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const seoMetaMutation = trpc.admin.ai.generateSeoMeta.useMutation();
  const aiConfigured = aiStatus.data?.configured ?? false;
  const aiModel = aiStatus.data?.model ?? "";

  const [pages, setPages] = useState(PREDEFINED_PAGES);
  const [selectedSlug, setSelectedSlug] = useState(PREDEFINED_PAGES[0].slug);
  const [form, setForm] = useState<Form>(emptyForm);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageLabel, setNewPageLabel] = useState("");

  useEffect(() => {
    if (!dbPages) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbSlugs = dbPages.map((p: any) => p.slug);
    const extra = dbSlugs
      .filter((slug: string) => !PREDEFINED_PAGES.find((p) => p.slug === slug))
      .map((slug: string) => ({ slug, label: slug }));
    setPages([...PREDEFINED_PAGES, ...extra]);
  }, [dbPages]);

  useEffect(() => {
    if (!dbPages) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbPage: any = dbPages.find((p: any) => p.slug === selectedSlug);
    if (dbPage) {
      setForm({
        title: dbPage.title || "", titleEn: dbPage.titleEn || "", titleZh: dbPage.titleZh || "",
        metaTitle: dbPage.metaTitle || "", metaTitleEn: dbPage.metaTitleEn || "", metaTitleZh: dbPage.metaTitleZh || "",
        metaDescription: dbPage.metaDescription || "", metaDescriptionEn: dbPage.metaDescriptionEn || "", metaDescriptionZh: dbPage.metaDescriptionZh || "",
        ogTitle: dbPage.ogTitle || "", ogTitleEn: dbPage.ogTitleEn || "", ogTitleZh: dbPage.ogTitleZh || "",
        ogDescription: dbPage.ogDescription || "", ogDescriptionEn: dbPage.ogDescriptionEn || "", ogDescriptionZh: dbPage.ogDescriptionZh || "",
        ogImage: dbPage.ogImage || "",
        canonicalUrl: dbPage.canonicalUrl || "",
        schemaJson: dbPage.schemaJson || "",
        keywords: dbPage.keywords || "", keywordsEn: dbPage.keywordsEn || "", keywordsZh: dbPage.keywordsZh || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedSlug, dbPages]);

  const handleAddNewPage = () => {
    if (!newPageSlug.trim()) { toast.error("Az oldal slug nem lehet üres!"); return; }
    const slug = newPageSlug.startsWith("/") ? newPageSlug : `/${newPageSlug}`;
    if (pages.find((p) => p.slug === slug)) { toast.error("Ez a slug már létezik!"); return; }
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>SEO / Oldalak</h1>
        <button onClick={() => setShowNewPageForm(true)} className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
          <Plus size={16} /> Új oldal létrehozása
        </button>
      </div>

      {showNewPageForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.9rem", margin: 0 }}>Új oldal hozzáadása</h3>
            <button onClick={() => setShowNewPageForm(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={16} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
            <div>
              <label style={ls}>Slug (URL útvonal)</label>
              <input value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} style={is} placeholder="/iparagi-landing-oldal" />
            </div>
            <div>
              <label style={ls}>Megjelenítési név</label>
              <input value={newPageLabel} onChange={(e) => setNewPageLabel(e.target.value)} style={is} placeholder="Iparági Landing Oldal" />
            </div>
            <button onClick={handleAddNewPage} className="g2a-btn-primary" style={{ padding: "0.625rem 1rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              Hozzáadás
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem" }}>
        {/* Sidebar */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden", maxHeight: "80vh", overflowY: "auto" }}>
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              style={{
                width: "100%", padding: "0.75rem 1rem", textAlign: "left",
                background: selectedSlug === p.slug ? "rgba(20,184,166,0.1)" : "none",
                border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: selectedSlug === p.slug ? "#14B8A6" : "#aaa",
                fontFamily: "Geist Mono, monospace", fontSize: "0.78rem",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {p.label}
              <span style={{ display: "block", color: "#555", fontSize: "0.68rem", marginTop: "0.15rem" }}>{p.slug}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", margin: 0 }}>
              {pages.find((p) => p.slug === selectedSlug)?.label} – SEO beállítások
            </h2>
            <button
              type="button"
              onClick={async () => {
                if (form.metaTitle.trim() || form.metaDescription.trim()) {
                  const ok = await confirm({ title: "Felülírás megerősítése", message: "Felülírja a meglévő meta címet és leírást?", destructive: false, confirmLabel: "Felülírás" });
                  if (!ok) return;
                }
                const pageLabel = pages.find((p) => p.slug === selectedSlug)?.label || selectedSlug;
                try {
                  const meta = await seoMetaMutation.mutateAsync({
                    topic: form.title?.trim() || pageLabel,
                    slug: selectedSlug,
                    context: `G2A Marketing pécsi B2B marketing ügynökség oldala: ${pageLabel}`,
                    lang: "hu",
                  });
                  setForm((p) => ({ ...p, metaTitle: meta.title, metaDescription: meta.description }));
                  toast.success(`SEO meta generálva (${aiModel})`);
                } catch (err) {
                  toast.error(parseFormError(err, "AI generálás sikertelen"));
                }
              }}
              disabled={!aiConfigured || seoMetaMutation.isPending}
              title={aiConfigured ? `AI SEO meta generálás (${aiModel})` : "OpenAI nincs konfigurálva (.env: OPENAI_API_KEY)"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 6,
                background: aiConfigured ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(20,184,166,0.2))" : "rgba(255,255,255,0.04)",
                border: `1px solid ${aiConfigured ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`,
                color: aiConfigured ? "#c084fc" : "#666",
                cursor: aiConfigured && !seoMetaMutation.isPending ? "pointer" : "not-allowed",
                fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 600,
              }}
            >
              {seoMetaMutation.isPending ? <Loader2 size={12} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={12} />}
              AI: SEO meta
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); upsertMutation.mutate({ slug: selectedSlug, ...form }); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <LocalizedField label="Oldal cím" field="title" form={form} setForm={setForm} />
            <LocalizedField
              label="Meta cím (max 60 karakter)"
              field="metaTitle"
              form={form}
              setForm={setForm}
              hint={`HU: ${form.metaTitle.length}/60`}
            />
            <LocalizedField
              label="Meta leírás (max 160 karakter)"
              field="metaDescription"
              form={form}
              setForm={setForm}
              type="textarea"
              rows={3}
              hint={`HU: ${form.metaDescription.length}/160`}
            />

            <LocalizedField
              label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Tag size={12} /> Kulcsszavak (vesszővel)</span>}
              field="keywords"
              form={form}
              setForm={setForm}
              placeholder="seo, keresőoptimalizálás, google, marketing"
            />
            {form.keywords && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "-0.75rem" }}>
                {form.keywords.split(",").map(kw => kw.trim()).filter(Boolean).map((kw, i) => (
                  <span key={i} style={{ backgroundColor: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "4px", padding: "0.2rem 0.5rem", color: "var(--g2a-brand-teal)", fontSize: "0.72rem", fontFamily: "Geist Mono, monospace" }}>{kw}</span>
                ))}
              </div>
            )}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Open Graph (közösségi média)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <LocalizedField label="OG Cím" field="ogTitle" form={form} setForm={setForm} />
                <LocalizedField label="OG Leírás" field="ogDescription" form={form} setForm={setForm} type="textarea" rows={2} />
                <div>
                  <label style={ls}>OG Kép URL</label>
                  <input value={form.ogImage} onChange={(e) => setForm((p) => ({ ...p, ogImage: e.target.value }))} style={is} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
              <label style={ls}>Canonical URL</label>
              <input value={form.canonicalUrl} onChange={(e) => setForm((p) => ({ ...p, canonicalUrl: e.target.value }))} style={is} placeholder="https://g2amarketing.hu/..." />
            </div>

            <div>
              <label style={ls}>JSON-LD Schema</label>
              <textarea value={form.schemaJson} onChange={(e) => setForm((p) => ({ ...p, schemaJson: e.target.value }))} style={{ ...is, resize: "vertical", fontFamily: "monospace" }} rows={6} placeholder='{"@context": "https://schema.org", ...}' />
            </div>

            <button type="submit" disabled={upsertMutation.isPending} className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "fit-content" }}>
              <Save size={16} /> {upsertMutation.isPending ? "Mentés..." : "SEO mentése"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
