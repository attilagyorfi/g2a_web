import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import ImageUploader from "@/components/ImageUploader";
import LocalizedField from "@/components/LocalizedField";
import { Plus, Edit, Trash2 } from "lucide-react";

type FormState = {
  id?: number;
  title: string; titleEn: string; titleZh: string;
  slug: string;
  client: string; clientEn: string; clientZh: string;
  industry: string; industryEn: string; industryZh: string;
  challenge: string; challengeEn: string; challengeZh: string;
  solution: string; solutionEn: string; solutionZh: string;
  results: string; resultsEn: string; resultsZh: string;
  featuredImage: string;
  featuredImageAlt: string;
  tags: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string; metaTitleEn: string; metaTitleZh: string;
  metaDescription: string; metaDescriptionEn: string; metaDescriptionZh: string;
};

const emptyForm: FormState = {
  title: "", titleEn: "", titleZh: "",
  slug: "",
  client: "", clientEn: "", clientZh: "",
  industry: "", industryEn: "", industryZh: "",
  challenge: "", challengeEn: "", challengeZh: "",
  solution: "", solutionEn: "", solutionZh: "",
  results: "", resultsEn: "", resultsZh: "",
  featuredImage: "", featuredImageAlt: "",
  tags: "",
  isActive: true, sortOrder: 0,
  metaTitle: "", metaTitleEn: "", metaTitleZh: "",
  metaDescription: "", metaDescriptionEn: "", metaDescriptionZh: "",
};

const slugify = (title: string) =>
  title.toLowerCase().replace(/[áéíóöőúüű]/g, (c: string) => ({ á: "a", é: "e", í: "i", ó: "o", ö: "o", ő: "o", ú: "u", ü: "u", ű: "u" }[c] || c))
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminCaseStudies() {
  const confirm = useConfirm();
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
    onError: (e) => toast.error(parseFormError(e)),
  });

  const deleteMutation = trpc.admin.caseStudies.delete.useMutation({
    onSuccess: () => {
      toast.success("Esettanulmány törölve!");
      utils.admin.caseStudies.list.invalidate();
    },
    onError: (e) => toast.error(parseFormError(e)),
  });
  const deleteManyMutation = trpc.admin.caseStudies.deleteMany.useMutation({
    onSuccess: (n) => {
      toast.success(`${n} esettanulmány törölve`);
      utils.admin.caseStudies.list.invalidate();
      selection.clear();
    },
    onError: (e) => toast.error(parseFormError(e)),
  });

  const selection = useBulkSelection<number>(studies.map((s: any) => s.id));

  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} esettanulmányt?\n\nEz nem visszavonható.` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };

  // s is admin.caseStudies.list row; TS can't narrow the shape exactly here, so use any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (s: any) => {
    setForm({
      id: s.id,
      title: s.title || "", titleEn: s.titleEn || "", titleZh: s.titleZh || "",
      slug: s.slug || "",
      client: s.client || "", clientEn: s.clientEn || "", clientZh: s.clientZh || "",
      industry: s.industry || "", industryEn: s.industryEn || "", industryZh: s.industryZh || "",
      challenge: s.challenge || "", challengeEn: s.challengeEn || "", challengeZh: s.challengeZh || "",
      solution: s.solution || "", solutionEn: s.solutionEn || "", solutionZh: s.solutionZh || "",
      results: s.results || "", resultsEn: s.resultsEn || "", resultsZh: s.resultsZh || "",
      featuredImage: s.featuredImage || "", featuredImageAlt: s.featuredImageAlt || "",
      tags: s.tags || "",
      isActive: s.isActive ?? true, sortOrder: s.sortOrder ?? 0,
      metaTitle: s.metaTitle || "", metaTitleEn: s.metaTitleEn || "", metaTitleZh: s.metaTitleZh || "",
      metaDescription: s.metaDescription || "", metaDescriptionEn: s.metaDescriptionEn || "", metaDescriptionZh: s.metaDescriptionZh || "",
    });
    setEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upsertMutation.mutate(form as any);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--g2a-text)" }}>Esettanulmányok</h1>
        {!editing && (
          <button className="g2a-btn-primary" onClick={() => { setForm(emptyForm); setEditing(true); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={16} /> Új esettanulmány
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)" }}>
            {form.id ? "Esettanulmány szerkesztése" : "Új esettanulmány"}
          </h2>
          <LocalizedField label="Cím" field="title" form={form} setForm={(updater) => { setForm((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; return { ...next, slug: next.slug || slugify(next.title) }; }); }} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="g2a-label">Slug (URL) *</label>
              <input className="g2a-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required />
            </div>
            <div>
              <label className="g2a-label">Tagek (vesszővel)</label>
              <input className="g2a-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="SEO, Google Ads, Meta..." />
            </div>
          </div>
          <LocalizedField label="Ügyfél neve" field="client" form={form} setForm={setForm} />
          <LocalizedField label="Iparág" field="industry" form={form} setForm={setForm} placeholder="pl. E-kereskedelem, Ingatlan..." />
          <LocalizedField label="Kihívás" field="challenge" form={form} setForm={setForm} type="textarea" rows={3} />
          <LocalizedField label="Megoldás" field="solution" form={form} setForm={setForm} type="textarea" rows={3} />
          <LocalizedField label="Eredmények" field="results" form={form} setForm={setForm} type="textarea" rows={3} />
          <div>
            <label className="g2a-label">Kiemelt kép</label>
            <ImageUploader value={form.featuredImage} onChange={url => setForm(f => ({ ...f, featuredImage: url }))} />
            <input className="g2a-input" value={form.featuredImageAlt} onChange={e => setForm(f => ({ ...f, featuredImageAlt: e.target.value }))} placeholder="Kép alt szövege (SEO)" style={{ marginTop: "0.5rem" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "end" }}>
            <div>
              <label className="g2a-label">Sorrend</label>
              <input className="g2a-input" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.75rem" }}>
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
              <label htmlFor="isActive" className="g2a-label" style={{ marginBottom: 0 }}>Aktív</label>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--g2a-border)", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--g2a-text-muted)", marginBottom: "0.75rem" }}>SEO beállítások</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <LocalizedField label="Meta cím" field="metaTitle" form={form} setForm={setForm} />
              <LocalizedField label="Meta leírás" field="metaDescription" form={form} setForm={setForm} type="textarea" rows={2} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="g2a-btn-primary" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? "Mentés..." : "Mentés"}
            </button>
            <button type="button" className="g2a-btn-secondary" onClick={() => { setEditing(false); setForm(emptyForm); }}>
              Mégse
            </button>
          </div>
        </form>
      )}

      <BulkActionBar
        count={selection.count}
        itemLabel="kiválasztott esettanulmány"
        onClear={selection.clear}
        onDelete={handleBulkDelete}
        deleting={deleteManyMutation.isPending}
      />

      {isLoading ? (
        <AdminListSkeleton rows={5} asCards />
      ) : studies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--g2a-text-muted)" }}>
          <p>Még nincsenek esettanulmányok. Kattints az "Új esettanulmány" gombra!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {studies.map((s: any) => {
            const hasEn = !!(s.titleEn && s.titleEn.trim());
            const hasZh = !!(s.titleZh && s.titleZh.trim());
            return (
              <div key={s.id} style={{
                background: selection.isSelected(s.id) ? "rgba(20,184,166,0.06)" : "var(--g2a-surface)",
                border: `1px solid ${selection.isSelected(s.id) ? "rgba(20,184,166,0.5)" : "var(--g2a-border)"}`,
                borderRadius: "0.75rem", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
              }}>
                <div style={{ paddingTop: 4 }}>
                  <BulkSelectCheckbox checked={selection.isSelected(s.id)} onToggle={() => selection.toggle(s.id)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontWeight: 600, color: "var(--g2a-text)" }}>{s.title}</h3>
                    {!s.isActive && <span style={{ fontSize: "0.7rem", background: "rgba(255,100,0,0.15)", color: "#ff6400", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Inaktív</span>}
                    <div style={{ display: "inline-flex", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.65rem" }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: "#14B8A620", color: "var(--g2a-brand-teal)" }}>HU</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasEn ? "#14B8A620" : "#33333360", color: hasEn ? "#14B8A6" : "#555" }}>EN</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasZh ? "#14B8A620" : "#33333360", color: hasZh ? "#14B8A6" : "#555" }}>中文</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--g2a-text-muted)", flexWrap: "wrap" }}>
                    {s.client && <span>Ügyfél: {s.client}</span>}
                    {s.industry && <span>Iparág: {s.industry}</span>}
                    <span>Slug: /{s.slug}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(s)} style={{ background: "none", border: "1px solid var(--g2a-border)", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "var(--g2a-text-muted)" }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={async () => {
                    const ok = await confirm({ title: "Esettanulmány törlése", message: `Biztosan törlöd: "${s.title}"?\n\nEz nem visszavonható.` });
                    if (ok) deleteMutation.mutate({ id: s.id });
                  }} style={{ background: "none", border: "1px solid #ef4444", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "#ef4444" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
