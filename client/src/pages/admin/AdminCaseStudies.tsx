import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

type FormState = {
  id?: number;
  title: string;
  slug: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  featuredImage: string;
  featuredImageAlt: string;
  tags: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
};

const emptyForm: FormState = {
  title: "", slug: "", client: "", industry: "", challenge: "", solution: "",
  results: "", featuredImage: "", featuredImageAlt: "", tags: "",
  isActive: true, sortOrder: 0, metaTitle: "", metaDescription: "",
};

export default function AdminCaseStudies() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);

  const utils = trpc.useUtils();
  const { data: studies = [], isLoading } = trpc.admin.caseStudies.list.useQuery();

  const upsertMutation = trpc.admin.caseStudies.upsert.useMutation({
    onSuccess: () => {
      toast.success(form.id ? "Esettanulmány frissítve!" : "Esettanulmány létrehozva!");
      utils.admin.caseStudies.list.invalidate();
      setForm(emptyForm);
      setEditing(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.caseStudies.delete.useMutation({
    onSuccess: () => {
      toast.success("Esettanulmány törölve!");
      utils.admin.caseStudies.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleEdit = (s: any) => {
    setForm({
      id: s.id, title: s.title || "", slug: s.slug || "", client: s.client || "",
      industry: s.industry || "", challenge: s.challenge || "", solution: s.solution || "",
      results: s.results || "", featuredImage: s.featuredImage || "", featuredImageAlt: s.featuredImageAlt || "",
      tags: s.tags || "", isActive: s.isActive ?? true, sortOrder: s.sortOrder ?? 0,
      metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "",
    });
    setEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(form as any);
  };

  const slugify = (title: string) =>
    title.toLowerCase().replace(/[áéíóöőúüű]/g, (c: string) => ({ á:"a",é:"e",í:"i",ó:"o",ö:"o",ő:"o",ú:"u",ü:"u",ű:"u" }[c] || c))
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--g2a-text)" }}>Esettanulmányok</h1>
          {!editing && (
            <button className="g2a-btn-primary" onClick={() => { setForm(emptyForm); setEditing(true); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={16} /> Új esettanulmány
            </button>
          )}
        </div>

        {editing && (
          <form onSubmit={handleSubmit} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "1.5rem" }}>
              {form.id ? "Esettanulmány szerkesztése" : "Új esettanulmány"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="g2a-label">Cím *</label>
                <input className="g2a-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} required />
              </div>
              <div>
                <label className="g2a-label">Slug (URL) *</label>
                <input className="g2a-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required />
              </div>
              <div>
                <label className="g2a-label">Ügyfél neve</label>
                <input className="g2a-input" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
              </div>
              <div>
                <label className="g2a-label">Iparág</label>
                <input className="g2a-input" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="pl. E-kereskedelem, Ingatlan..." />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="g2a-label">Kihívás</label>
                <textarea className="g2a-input" rows={3} value={form.challenge} onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="g2a-label">Megoldás</label>
                <textarea className="g2a-input" rows={3} value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="g2a-label">Eredmények</label>
                <textarea className="g2a-input" rows={3} value={form.results} onChange={e => setForm(f => ({ ...f, results: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="g2a-label">Kiemelt kép</label>
                <ImageUploader value={form.featuredImage} onChange={url => setForm(f => ({ ...f, featuredImage: url }))} />
                <input className="g2a-input" value={form.featuredImageAlt} onChange={e => setForm(f => ({ ...f, featuredImageAlt: e.target.value }))} placeholder="Kép alt szövege (SEO)" style={{ marginTop: "0.5rem" }} />
              </div>
              <div>
                <label className="g2a-label">Tagek (vesszővel elválasztva)</label>
                <input className="g2a-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="SEO, Google Ads, Meta..." />
              </div>
              <div>
                <label className="g2a-label">Sorrend</label>
                <input className="g2a-input" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
              <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--g2a-border)", paddingTop: "1rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--g2a-text-muted)", marginBottom: "0.75rem" }}>SEO beállítások</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="g2a-label">Meta cím</label>
                    <input className="g2a-input" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} />
                  </div>
                  <div>
                    <label className="g2a-label">Meta leírás</label>
                    <input className="g2a-input" value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <label htmlFor="isActive" className="g2a-label" style={{ marginBottom: 0 }}>Aktív (megjelenik a weboldalon)</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" className="g2a-btn-primary" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Mentés..." : "Mentés"}
              </button>
              <button type="button" className="g2a-btn-secondary" onClick={() => { setEditing(false); setForm(emptyForm); }}>
                Mégse
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <p style={{ color: "var(--g2a-text-muted)" }}>Betöltés...</p>
        ) : studies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--g2a-text-muted)" }}>
            <p>Még nincsenek esettanulmányok. Kattints az "Új esettanulmány" gombra!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {studies.map((s: any) => (
              <div key={s.id} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontWeight: 600, color: "var(--g2a-text)" }}>{s.title}</h3>
                    {!s.isActive && <span style={{ fontSize: "0.7rem", background: "#e9113020", color: "#e91130", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Inaktív</span>}
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>
                    {s.client && <span>Ügyfél: {s.client}</span>}
                    {s.industry && <span>Iparág: {s.industry}</span>}
                    <span>Slug: /{s.slug}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(s)} style={{ background: "none", border: "1px solid var(--g2a-border)", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "var(--g2a-text-muted)" }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => { if (confirm("Biztosan törlöd?")) deleteMutation.mutate({ id: s.id }); }} style={{ background: "none", border: "1px solid #e91130", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "#e91130" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
