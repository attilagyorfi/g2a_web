import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";

export default function AdminHeroSlides() {
  const { data: slides, refetch } = trpc.admin.heroSlides.list.useQuery();
  const createMutation = trpc.admin.heroSlides.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Slide létrehozva"); } });
  const updateMutation = trpc.admin.heroSlides.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Slide frissítve"); } });
  const deleteMutation = trpc.admin.heroSlides.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Slide törölve"); } });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", backgroundImage: "", backgroundImageAlt: "", ctaPrimaryText: "", ctaPrimaryUrl: "", ctaSecondaryText: "", ctaSecondaryUrl: "", sortOrder: 0, isActive: true });
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };

  const startEdit = (s: NonNullable<typeof slides>[0]) => {
    setEditing(s.id);
    setForm({ title: s.title, subtitle: s.subtitle || "", backgroundImage: s.backgroundImage || "", backgroundImageAlt: s.backgroundImageAlt || "", ctaPrimaryText: s.ctaPrimaryText || "", ctaPrimaryUrl: s.ctaPrimaryUrl || "", ctaSecondaryText: s.ctaSecondaryText || "", ctaSecondaryUrl: s.ctaSecondaryUrl || "", sortOrder: s.sortOrder || 0, isActive: s.isActive !== false });
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Hero Slideshow</h1>
        <button onClick={() => { setForm({ title: "", subtitle: "", backgroundImage: "", backgroundImageAlt: "", ctaPrimaryText: "", ctaPrimaryUrl: "", ctaSecondaryText: "", ctaSecondaryUrl: "", sortOrder: 0, isActive: true }); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új slide</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem" }}>{editing ? "Slide szerkesztése" : "Új slide"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ gridColumn: "1/-1" }}><label style={ls}>Főcím *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required style={is} /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={ls}>Alcím</label><textarea value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={2} /></div>
              <div style={{ gridColumn: "1/-1" }}>
                <ImageUploader
                  value={form.backgroundImage}
                  altValue={form.backgroundImageAlt}
                  onChange={(url) => setForm(p => ({ ...p, backgroundImage: url }))}
                  onAltChange={(alt) => setForm(p => ({ ...p, backgroundImageAlt: alt }))}
                  label="Háttérkép"
                  placeholder="Háttérkép URL vagy feltöltés"
                />
              </div>
              <div><label style={ls}>CTA 1 szöveg</label><input value={form.ctaPrimaryText} onChange={e => setForm(p => ({ ...p, ctaPrimaryText: e.target.value }))} style={is} placeholder="Kapcsolatfelvétel" /></div>
              <div><label style={ls}>CTA 1 URL</label><input value={form.ctaPrimaryUrl} onChange={e => setForm(p => ({ ...p, ctaPrimaryUrl: e.target.value }))} style={is} placeholder="/kapcsolat" /></div>
              <div><label style={ls}>CTA 2 szöveg</label><input value={form.ctaSecondaryText} onChange={e => setForm(p => ({ ...p, ctaSecondaryText: e.target.value }))} style={is} placeholder="Szolgáltatásaink" /></div>
              <div><label style={ls}>CTA 2 URL</label><input value={form.ctaSecondaryUrl} onChange={e => setForm(p => ({ ...p, ctaSecondaryUrl: e.target.value }))} style={is} placeholder="/szolgaltatasok" /></div>
              <div><label style={ls}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={is} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.5rem" }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "var(--g2a-amber)" }} />
                <label htmlFor="isActive" style={{ color: "#ccc", fontSize: "0.875rem", cursor: "pointer" }}>Aktív (megjelenik a weboldalon)</label>
              </div>
            </div>

            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <div style={{ display: "grid", gap: "1rem" }}>
        {(slides || []).map(slide => (
          <div key={slide.id} style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden", display: "flex" }}>
            {slide.backgroundImage && <div style={{ width: "120px", flexShrink: 0, backgroundImage: `url(${slide.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
            <div style={{ flex: 1, padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "Roboto Mono, monospace", marginBottom: "0.375rem" }}>{slide.title}</p>
                  {slide.subtitle && <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{slide.subtitle.slice(0, 80)}{slide.subtitle.length > 80 ? "..." : ""}</p>}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {slide.ctaPrimaryText && <span style={{ backgroundColor: "rgba(233,17,48,0.15)", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "4px", padding: "0.2rem 0.5rem", color: "var(--g2a-amber)", fontSize: "0.7rem" }}>{slide.ctaPrimaryText}</span>}
                    {slide.ctaSecondaryText && <span style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "0.2rem 0.5rem", color: "#888", fontSize: "0.7rem" }}>{slide.ctaSecondaryText}</span>}
                    {!slide.isActive && <span style={{ backgroundColor: "rgba(255,100,0,0.15)", border: "1px solid rgba(255,100,0,0.3)", borderRadius: "4px", padding: "0.2rem 0.5rem", color: "#ff6400", fontSize: "0.7rem" }}>Inaktív</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(slide)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                  <button onClick={() => { if (confirm("Biztosan törli?")) deleteMutation.mutate({ id: slide.id }); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!slides || slides.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>Nincsenek slide-ok.</div>}
      </div>
    </div>
  );
}
