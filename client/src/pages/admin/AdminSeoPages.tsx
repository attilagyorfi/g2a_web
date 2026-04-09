import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { toast } from "sonner";

const PAGES = [
  { slug: "/", label: "Főoldal" },
  { slug: "/szolgaltatasok", label: "Szolgáltatások" },
  { slug: "/szakertelem", label: "Szakértelem" },
  { slug: "/technologia", label: "Technológia" },
  { slug: "/partnereink", label: "Partnereink" },
  { slug: "/hirek", label: "Hírek / Blog" },
  { slug: "/kapcsolat", label: "Kapcsolat" },
  { slug: "/adatvedelmi-iranyelvek", label: "Adatvédelmi irányelvek" },
];

export default function AdminSeoPages() {
  const [selectedSlug, setSelectedSlug] = useState("/");
  const { data: pageData, refetch } = trpc.content.pageSeo.useQuery({ slug: selectedSlug });
  const upsertMutation = trpc.admin.pages.upsert.useMutation({ onSuccess: () => { refetch(); toast.success("SEO adatok mentve"); } });
  const [form, setForm] = useState({ title: "", metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "", schemaJson: "" });

  useEffect(() => {
    if (pageData) {
      setForm({ title: pageData.title || "", metaTitle: pageData.metaTitle || "", metaDescription: pageData.metaDescription || "", ogTitle: pageData.ogTitle || "", ogDescription: pageData.ogDescription || "", ogImage: pageData.ogImage || "", canonicalUrl: pageData.canonicalUrl || "", schemaJson: pageData.schemaJson || "" });
    } else {
      setForm({ title: "", metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "", schemaJson: "" });
    }
  }, [pageData, selectedSlug]);

  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };

  return (
    <div>
      <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>SEO / Oldalak</h1>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>
        {/* Sidebar */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
          {PAGES.map(p => (
            <button key={p.slug} onClick={() => setSelectedSlug(p.slug)} style={{ width: "100%", padding: "0.875rem 1rem", textAlign: "left", background: selectedSlug === p.slug ? "rgba(233,17,48,0.1)" : "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: selectedSlug === p.slug ? "var(--g2a-amber)" : "#aaa", fontFamily: "Roboto Mono, monospace", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.15s" }}>
              {p.label}
              <span style={{ display: "block", color: "#555", fontSize: "0.7rem", marginTop: "0.2rem" }}>{p.slug}</span>
            </button>
          ))}
        </div>
        {/* Form */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
          <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem", marginBottom: "1.5rem" }}>{PAGES.find(p => p.slug === selectedSlug)?.label} – SEO beállítások</h2>
          <form onSubmit={e => { e.preventDefault(); upsertMutation.mutate({ slug: selectedSlug, ...form }); }}>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div><label style={ls}>Oldal cím</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={is} /></div>
              <div>
                <label style={ls}>Meta cím <span style={{ color: "#555" }}>(max 60 karakter)</span></label>
                <input value={form.metaTitle} onChange={e => setForm(p => ({ ...p, metaTitle: e.target.value }))} style={is} maxLength={60} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                  <span style={{ color: form.metaTitle.length > 55 ? "var(--g2a-amber)" : "#555", fontSize: "0.7rem" }}>{form.metaTitle.length}/60</span>
                  {form.metaTitle.length > 0 && <span style={{ color: "#555", fontSize: "0.7rem" }}>Google keresési megjelenítés</span>}
                </div>
              </div>
              <div>
                <label style={ls}>Meta leírás <span style={{ color: "#555" }}>(max 160 karakter)</span></label>
                <textarea value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={3} maxLength={160} />
                <span style={{ color: form.metaDescription.length > 150 ? "var(--g2a-amber)" : "#555", fontSize: "0.7rem" }}>{form.metaDescription.length}/160</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                <p style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Open Graph (közösségi média)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><label style={ls}>OG Cím</label><input value={form.ogTitle} onChange={e => setForm(p => ({ ...p, ogTitle: e.target.value }))} style={is} /></div>
                  <div><label style={ls}>OG Kép URL</label><input value={form.ogImage} onChange={e => setForm(p => ({ ...p, ogImage: e.target.value }))} style={is} /></div>
                  <div style={{ gridColumn: "1/-1" }}><label style={ls}>OG Leírás</label><textarea value={form.ogDescription} onChange={e => setForm(p => ({ ...p, ogDescription: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={2} /></div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                <div><label style={ls}>Canonical URL</label><input value={form.canonicalUrl} onChange={e => setForm(p => ({ ...p, canonicalUrl: e.target.value }))} style={is} placeholder="https://g2amarketing.hu/..." /></div>
              </div>
              <div>
                <label style={ls}>JSON-LD Schema</label>
                <textarea value={form.schemaJson} onChange={e => setForm(p => ({ ...p, schemaJson: e.target.value }))} style={{ ...is, resize: "vertical", fontFamily: "monospace" }} rows={6} placeholder='{"@context": "https://schema.org", ...}' />
              </div>
              <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "fit-content" }}><Save size={16} /> SEO mentése</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
