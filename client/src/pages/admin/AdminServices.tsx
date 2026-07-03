import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Edit, Check, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import LocalizedField from "@/components/LocalizedField";
import AiImageButton from "@/components/admin/AiImageButton";
import ServiceSectionEditor, { type LocStr } from "@/components/admin/ServiceSectionEditor";

type ServiceForm = {
  title: string;
  titleEn: string;
  titleZh: string;
  subtitle: string;
  subtitleEn: string;
  subtitleZh: string;
  shortDescription: string;
  shortDescriptionEn: string;
  shortDescriptionZh: string;
  heroTitle: string;
  heroTitleEn: string;
  heroTitleZh: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  heroSubtitleZh: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string;
  introEn: string;
  introZh: string;
  content: string;
  contentEn: string;
  contentZh: string;
  cta: string;
  ctaEn: string;
  ctaZh: string;
  icon: string;
  color: string;
  metaTitle: string;
  metaTitleEn: string;
  metaTitleZh: string;
  metaDescription: string;
  metaDescriptionEn: string;
  metaDescriptionZh: string;
};

// Structured (repeatable) section item shapes — stored as JSON columns.
type BenefitItem = { title: LocStr; desc: LocStr };
type ProcessItem = { step: string; title: LocStr; desc: LocStr };
type FaqItem = { q: LocStr; a: LocStr };

function parseItems<T>(raw: unknown): T[] {
  try { const a = JSON.parse(String(raw || "[]")); return Array.isArray(a) ? (a as T[]) : []; } catch { return []; }
}

const EMPTY_FORM: ServiceForm = {
  title: "", titleEn: "", titleZh: "",
  subtitle: "", subtitleEn: "", subtitleZh: "",
  shortDescription: "", shortDescriptionEn: "", shortDescriptionZh: "",
  heroTitle: "", heroTitleEn: "", heroTitleZh: "",
  heroSubtitle: "", heroSubtitleEn: "", heroSubtitleZh: "",
  heroImage: "", heroImageAlt: "",
  intro: "", introEn: "", introZh: "",
  content: "", contentEn: "", contentZh: "",
  cta: "", ctaEn: "", ctaZh: "",
  icon: "", color: "",
  metaTitle: "", metaTitleEn: "", metaTitleZh: "",
  metaDescription: "", metaDescriptionEn: "", metaDescriptionZh: "",
};

export default function AdminServices() {
  const confirm = useConfirm();
  const { data: services, refetch } = trpc.admin.services.list.useQuery();
  const updateMutation = trpc.admin.services.update.useMutation({
    onSuccess: () => { refetch(); setEditing(null); toast.success("Szolgáltatás mentve"); },
    onError: (err) => toast.error(parseFormError(err)),
  });
  const deleteMutation = trpc.admin.services.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Szolgáltatás törölve"); },
    onError: (err) => toast.error(parseFormError(err)),
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);

  const inputStyle = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Geist Mono, monospace" };

  const startEdit = (s: NonNullable<typeof services>[0]) => {
    setEditing(s.id);
    const sx = s as Record<string, unknown>;
    setBenefits(parseItems<BenefitItem>(sx.benefits));
    setProcessSteps(parseItems<ProcessItem>(sx.process));
    setFaq(parseItems<FaqItem>(sx.faq));
    setForm({
      title: s.title || "",
      titleEn: s.titleEn || "",
      titleZh: s.titleZh || "",
      subtitle: (sx.subtitle as string) || "",
      subtitleEn: (sx.subtitleEn as string) || "",
      subtitleZh: (sx.subtitleZh as string) || "",
      intro: (sx.intro as string) || "",
      introEn: (sx.introEn as string) || "",
      introZh: (sx.introZh as string) || "",
      cta: (sx.cta as string) || "",
      ctaEn: (sx.ctaEn as string) || "",
      ctaZh: (sx.ctaZh as string) || "",
      color: (sx.color as string) || "",
      shortDescription: s.shortDescription || "",
      shortDescriptionEn: s.shortDescriptionEn || "",
      shortDescriptionZh: s.shortDescriptionZh || "",
      heroTitle: s.heroTitle || "",
      heroTitleEn: s.heroTitleEn || "",
      heroTitleZh: s.heroTitleZh || "",
      heroSubtitle: s.heroSubtitle || "",
      heroSubtitleEn: s.heroSubtitleEn || "",
      heroSubtitleZh: s.heroSubtitleZh || "",
      heroImage: s.heroImage || "",
      heroImageAlt: s.heroImageAlt || "",
      content: s.content || "",
      contentEn: s.contentEn || "",
      contentZh: s.contentZh || "",
      icon: s.icon || "",
      metaTitle: s.metaTitle || "",
      metaTitleEn: s.metaTitleEn || "",
      metaTitleZh: s.metaTitleZh || "",
      metaDescription: s.metaDescription || "",
      metaDescriptionEn: s.metaDescriptionEn || "",
      metaDescriptionZh: s.metaDescriptionZh || "",
    });
  };

  if (editing !== null) {
    const editingService = services?.find(s => s.id === editing);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setEditing(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, color: "#aaa", cursor: "pointer", padding: "8px 14px", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.4)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
          >
            <ArrowLeft size={14} /> Vissza a listához
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", marginBottom: 4 }}>
              <span>Szolgáltatások</span>
              <span>/</span>
              <span style={{ color: "var(--g2a-brand-teal)" }}>{editingService?.slug ?? "edit"}</span>
            </div>
            <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
              {editingService?.icon} {editingService?.title || "Szolgáltatás szerkesztése"}
            </h1>
          </div>
        </div>
        <form onSubmit={e => { e.preventDefault(); updateMutation.mutate({ id: editing, data: { ...form, benefits: JSON.stringify(benefits), process: JSON.stringify(processSteps), faq: JSON.stringify(faq) } }); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Cím (H1)" field="title" form={form} setForm={setForm} required />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Alcím (színes hero-sor)" field="subtitle" form={form} setForm={setForm} />
          </div>
          <div>
            <label style={labelStyle}>Ikon (rövid kód, pl. seo — a badge az első 3 betű)</label>
            <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={inputStyle} placeholder="pl. seo, brand, web" />
          </div>
          <div>
            <label style={labelStyle}>Akcentszín (hex)</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(form.color) ? form.color : "#14b8a6"} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ width: 44, height: 40, padding: 2, background: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 5, cursor: "pointer" }} />
              <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={inputStyle} placeholder="#14b8a6" />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Hero kép URL</label>
              <AiImageButton
                compact
                defaultPrompt={`Modern, minimal B2B marketing hero image for "${form.title || "service"}". Dark background with subtle teal accent, abstract geometric shapes, professional, clean composition, 16:9 aspect ratio.`}
                filenameHint={`service-${form.title || "hero"}`}
                folder="g2a/services"
                defaultSize="1792x1024"
                onGenerated={(url) => setForm(p => ({ ...p, heroImage: url }))}
                label="AI: hero kép"
              />
            </div>
            <input value={form.heroImage} onChange={e => setForm(p => ({ ...p, heroImage: e.target.value }))} style={inputStyle} placeholder="https://..." />
            {form.heroImage && (
              <img src={form.heroImage} alt="Hero preview" style={{ marginTop: 8, width: "100%", height: "auto", maxHeight: 160, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} />
            )}
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Rövid leírás" field="shortDescription" form={form} setForm={setForm} type="textarea" rows={2} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Hero cím" field="heroTitle" form={form} setForm={setForm} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Hero leírás (heroDesc — 2-3 mondat a hero alatt)" field="heroSubtitle" form={form} setForm={setForm} type="textarea" rows={2} />
          </div>
          <div>
            <label style={labelStyle}>Hero kép alt</label>
            <input value={form.heroImageAlt} onChange={e => setForm(p => ({ ...p, heroImageAlt: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Bevezető szöveg (intro — az új elrendezés bevezető bekezdése)" field="intro" form={form} setForm={setForm} type="textarea" rows={4} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="CTA gomb szövege" field="cta" form={form} setForm={setForm} />
          </div>
          {/* Structured, DB-driven sections rendered by NewServicePage. */}
          <ServiceSectionEditor
            label="Előnyök (benefits)"
            hint="kártya cím + leírás"
            items={benefits as unknown as Record<string, unknown>[]}
            fields={[{ key: "title", label: "Cím" }, { key: "desc", label: "Leírás", textarea: true }]}
            onChange={(items) => setBenefits(items as unknown as BenefitItem[])}
            emptyItem={() => ({ title: {}, desc: {} })}
          />
          <ServiceSectionEditor
            label="Folyamat (process)"
            hint="lépésszám (pl. 01) + cím + leírás"
            items={processSteps as unknown as Record<string, unknown>[]}
            fields={[{ key: "step", label: "Lépés", plain: true }, { key: "title", label: "Cím" }, { key: "desc", label: "Leírás", textarea: true }]}
            onChange={(items) => setProcessSteps(items as unknown as ProcessItem[])}
            emptyItem={() => ({ step: "", title: {}, desc: {} })}
          />
          <ServiceSectionEditor
            label="GYIK (faq)"
            hint="kérdés + válasz"
            items={faq as unknown as Record<string, unknown>[]}
            fields={[{ key: "q", label: "Kérdés" }, { key: "a", label: "Válasz", textarea: true }]}
            onChange={(items) => setFaq(items as unknown as FaqItem[])}
            emptyItem={() => ({ q: {}, a: {} })}
          />
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField label="Tartalom (HTML/Markdown — régi elrendezés, opcionális)" field="content" form={form} setForm={setForm} type="rich" rows={10} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField
              label="Meta cím (SEO)"
              field="metaTitle"
              form={form}
              setForm={setForm}
              hint={`HU: ${form.metaTitle.length}/60`}
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <LocalizedField
              label="Meta leírás (SEO)"
              field="metaDescription"
              form={form}
              setForm={setForm}
              type="textarea"
              rows={3}
              hint={`HU: ${form.metaDescription.length}/160`}
            />
          </div>
          <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} disabled={updateMutation.isPending}>
              <Check size={16} /> {updateMutation.isPending ? "Mentés..." : "Mentés"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              style={{ padding: "9px 16px", borderRadius: 5, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", fontWeight: 600 }}
            >
              Mégse
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Szolgáltatások</h1>
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Ikon", "Cím", "Slug", "Fordítások", "Műveletek"].map(h => <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Geist Mono, monospace" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(services || []).map(s => {
              const hasEn = !!(s.titleEn && s.titleEn.trim());
              const hasZh = !!(s.titleZh && s.titleZh.trim());
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "1.25rem" }}>{s.icon}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#fff", fontSize: "0.875rem" }}>{s.title}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{s.slug}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "inline-flex", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: "#14B8A620", color: "var(--g2a-brand-teal)" }}>HU</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasEn ? "#14B8A620" : "#33333360", color: hasEn ? "#14B8A6" : "#555" }}>EN</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasZh ? "#14B8A620" : "#33333360", color: hasZh ? "#14B8A6" : "#555" }}>中文</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <button
                        onClick={() => startEdit(s)}
                        title="Szerkesztés"
                        style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                      ><Edit size={15} /></button>
                      <button
                        onClick={async () => {
                          const ok = await confirm({ title: "Szolgáltatás törlése", message: `Biztosan törlöd a(z) "${s.title}" szolgáltatást?\n\nEz nem visszavonható.` });
                          if (ok) deleteMutation.mutate({ id: s.id });
                        }}
                        title="Törlés"
                        disabled={deleteMutation.isPending}
                        style={{ background: "none", border: "none", color: "#666", cursor: deleteMutation.isPending ? "wait" : "pointer", display: "flex" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#666")}
                      ><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!services || services.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek szolgáltatások.</div>}
      </div>
    </div>
  );
}
