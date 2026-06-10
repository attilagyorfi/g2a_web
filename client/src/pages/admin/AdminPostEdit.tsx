import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Save, ArrowLeft, Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import ImageUploader from "@/components/ImageUploader";
import LocalizedField from "@/components/LocalizedField";
import AiImageButton from "@/components/admin/AiImageButton";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import SocialShareSection from "./SocialShareSection";

type PostForm = {
  title: string; titleEn: string; titleZh: string;
  slug: string;
  excerpt: string; excerptEn: string; excerptZh: string;
  content: string; contentEn: string; contentZh: string;
  featuredImage: string;
  featuredImageAlt: string;
  categoryId: string | number;
  authorName: string;
  status: "draft" | "published";
  metaTitle: string; metaTitleEn: string; metaTitleZh: string;
  metaDescription: string; metaDescriptionEn: string; metaDescriptionZh: string;
  publishedAt: string;
};

const EMPTY: PostForm = {
  title: "", titleEn: "", titleZh: "",
  slug: "",
  excerpt: "", excerptEn: "", excerptZh: "",
  content: "", contentEn: "", contentZh: "",
  featuredImage: "",
  featuredImageAlt: "",
  categoryId: "",
  authorName: "",
  status: "draft",
  metaTitle: "", metaTitleEn: "", metaTitleZh: "",
  metaDescription: "", metaDescriptionEn: "", metaDescriptionZh: "",
  publishedAt: "",
};

export default function AdminPostEdit() {
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === "new";
  const postId = isNew ? null : parseInt(params.id);

  const { data: allPosts } = trpc.admin.posts.list.useQuery(undefined, { enabled: !!postId });
  const post = allPosts?.find(p => p.id === postId);
  const { data: categories } = trpc.content.categories.useQuery();
  const createMutation = trpc.admin.posts.create.useMutation({ onSuccess: () => { toast.success("Cikk létrehozva"); navigate("/admin/posts"); } });
  const updateMutation = trpc.admin.posts.update.useMutation({ onSuccess: () => toast.success("Cikk mentve") });

  const [form, setForm] = useState<PostForm>(EMPTY);

  // ─── AI assist (OpenAI) ─────────────────────────────────────────────────────
  const aiStatus = trpc.admin.ai.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  // Drives the AI draft generator. The site is HU/EN/ZH, so we always
  // generate all three languages in one go and populate every locale tab.
  const blogDraftMutation = trpc.admin.ai.generateMultilangBlogDraft.useMutation();
  const seoMetaMutation = trpc.admin.ai.generateSeoMeta.useMutation();
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftTopic, setDraftTopic] = useState("");
  const [draftTone, setDraftTone] = useState<"professional" | "conversational" | "technical">("professional");
  // Extra outputs from the two-pass draft generator — surfaced as
  // separate UI panels rather than dumped into the content field.
  // Per-locale so each language tab gets its own alternatives.
  const [draftAltTitles, setDraftAltTitles] = useState<{ hu: string[]; en: string[]; zh: string[] }>({ hu: [], en: [], zh: [] });
  const [draftEditorNotes, setDraftEditorNotes] = useState<{ hu: string[]; en: string[]; zh: string[] }>({ hu: [], en: [], zh: [] });
  const [showEditorNotes, setShowEditorNotes] = useState(false);

  // Client-side simulated progress for the multilang draft generator.
  // The tRPC mutation is synchronous (single roundtrip, no streaming),
  // so we don't get real progress events from the server. But we DO
  // know the pipeline shape — three drafts run in parallel for ~15s,
  // then three editorial passes run in parallel for ~15s — and we can
  // surface that to the admin so the 20-40s wait doesn't read as
  // a silent freeze. Stage transitions use a fixed schedule keyed off
  // mutation start time; if the real pipeline finishes faster (cached
  // hits, smaller topic), the UI snaps to 100% immediately on success.
  type DraftStage = {
    label: string;
    detail: string;
    minSeconds: number;
  };
  const DRAFT_STAGES: DraftStage[] = [
    { label: "1/2 — Strukturált draft (HU, EN, ZH)", detail: "Három párhuzamos OpenAI hívás indul a témakör alapján.", minSeconds: 0 },
    { label: "1/2 — HU draft folyamatban", detail: "Magyar nyelvű cikk strukturális rétege készül.", minSeconds: 5 },
    { label: "1/2 — EN + ZH draftok véglegesítése", detail: "Az angol és kínai változat is befejezi az első passz-t.", minSeconds: 12 },
    { label: "2/2 — Szerkesztői pass (HU, EN, ZH)", detail: "AI-szagú mondatok átírása, átvezetések finomítása, példák betoldása.", minSeconds: 18 },
    { label: "2/2 — Polírozás véglegesítése", detail: "Címjavaslatok, szerkesztői megjegyzések összeállítása.", minSeconds: 28 },
    { label: "Adatok összesítése", detail: "Mindhárom nyelv betöltése a szerkesztőbe…", minSeconds: 38 },
  ];
  const [draftElapsedSec, setDraftElapsedSec] = useState(0);
  const [draftStartTime, setDraftStartTime] = useState<number | null>(null);

  // Ticker effect — increments elapsed seconds while the mutation runs,
  // resets on success/error.
  useEffect(() => {
    if (!blogDraftMutation.isPending) {
      setDraftElapsedSec(0);
      setDraftStartTime(null);
      return;
    }
    if (draftStartTime === null) {
      setDraftStartTime(Date.now());
    }
    const id = window.setInterval(() => {
      if (draftStartTime !== null) {
        setDraftElapsedSec(Math.floor((Date.now() - draftStartTime) / 1000));
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [blogDraftMutation.isPending, draftStartTime]);

  // Find the active stage based on elapsed time. The last stage that
  // matches `elapsed >= minSeconds` wins.
  const activeStageIndex = DRAFT_STAGES.reduce(
    (acc, stage, idx) => (draftElapsedSec >= stage.minSeconds ? idx : acc),
    0,
  );
  // Soft progress estimate — caps at 95% so we never imply "done"
  // before the mutation actually resolves; success handler will snap
  // to 100% via the cleanup effect.
  const progressPct = blogDraftMutation.isPending
    ? Math.min(95, Math.round((draftElapsedSec / 40) * 100))
    : 0;

  const aiConfigured = aiStatus.data?.configured ?? false;
  const aiModel = aiStatus.data?.model ?? "";

  const handleGenerateDraft = async () => {
    if (!draftTopic.trim()) { toast.error("Adj meg egy témát"); return; }
    if (form.title.trim() || form.titleEn.trim() || form.titleZh.trim()) {
      const ok = await confirm({ title: "Felülírás megerősítése", message: "A meglévő tartalom (cím, kivonat, tartalom, SEO) felülíródik mindhárom nyelven. Folytatod?", destructive: false, confirmLabel: "Felülírás" });
      if (!ok) return;
    }
    try {
      const draft = await blogDraftMutation.mutateAsync({ topic: draftTopic, tone: draftTone });
      setForm(prev => ({
        ...prev,
        // HU
        title: draft.hu.title,
        excerpt: draft.hu.excerpt,
        content: draft.hu.content,
        metaTitle: draft.hu.metaTitle,
        metaDescription: draft.hu.metaDescription,
        // EN
        titleEn: draft.en.title,
        excerptEn: draft.en.excerpt,
        contentEn: draft.en.content,
        metaTitleEn: draft.en.metaTitle,
        metaDescriptionEn: draft.en.metaDescription,
        // ZH
        titleZh: draft.zh.title,
        excerptZh: draft.zh.excerpt,
        contentZh: draft.zh.content,
        metaTitleZh: draft.zh.metaTitle,
        metaDescriptionZh: draft.zh.metaDescription,
        // Slug derives from the HU title only — Hungarian is the canonical
        // version and the same slug is used across all three locales.
        slug: prev.slug || draft.hu.title.toLowerCase().replace(/[áàâä]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i").replace(/[óòôöő]/g, "o").replace(/[úùûüű]/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
      }));
      // Stash the extras (alt titles + editor notes) per locale so the
      // admin can pick a different title or peek at what the editor
      // pass changed.
      setDraftAltTitles({
        hu: draft.hu.alternativeTitles ?? [],
        en: draft.en.alternativeTitles ?? [],
        zh: draft.zh.alternativeTitles ?? [],
      });
      setDraftEditorNotes({
        hu: draft.hu.editorNotes ?? [],
        en: draft.en.editorNotes ?? [],
        zh: draft.zh.editorNotes ?? [],
      });
      setShowDraftModal(false);
      setDraftTopic("");
      toast.success(`AI blog draft generálva HU + EN + ZH nyelven, szerkesztői pass alkalmazva (${aiModel})`);
    } catch (err) {
      toast.error(parseFormError(err, "AI draft generálás sikertelen"));
    }
  };

  const handleGenerateSeoMeta = async () => {
    if (!form.title.trim() && !form.content.trim()) {
      toast.error("Először adj meg címet vagy tartalmat");
      return;
    }
    try {
      const meta = await seoMetaMutation.mutateAsync({
        topic: form.title || "Blog cikk",
        slug: form.slug ? `/blog/${form.slug}` : undefined,
        context: form.content?.slice(0, 2000) || form.excerpt,
        lang: "hu",
      });
      setForm(prev => ({ ...prev, metaTitle: meta.title, metaDescription: meta.description }));
      toast.success(`SEO meta generálva (${aiModel})`);
    } catch (err) {
      toast.error(parseFormError(err, "SEO meta generálás sikertelen"));
    }
  };

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "", titleEn: post.titleEn || "", titleZh: post.titleZh || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "", excerptEn: post.excerptEn || "", excerptZh: post.excerptZh || "",
        content: post.content || "", contentEn: post.contentEn || "", contentZh: post.contentZh || "",
        featuredImage: post.featuredImage || "",
        featuredImageAlt: post.featuredImageAlt || "",
        categoryId: post.categoryId || "",
        authorName: post.authorName || "",
        status: post.status as "draft" | "published",
        metaTitle: post.metaTitle || "", metaTitleEn: post.metaTitleEn || "", metaTitleZh: post.metaTitleZh || "",
        metaDescription: post.metaDescription || "", metaDescriptionEn: post.metaDescriptionEn || "", metaDescriptionZh: post.metaDescriptionZh || "",
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      publishedAt: form.publishedAt ? new Date(form.publishedAt) : undefined,
    };
    if (isNew) {
      createMutation.mutate(data as Parameters<typeof createMutation.mutate>[0]);
    } else if (postId) {
      updateMutation.mutate({ id: postId, data });
    }
  };

  const inputStyle = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Geist Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/posts" style={{ color: "#888", display: "flex", textDecoration: "none" }}><ArrowLeft size={20} /></Link>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>
          {isNew ? "Új cikk" : "Cikk szerkesztése"}
        </h1>
        <button
          type="button"
          onClick={() => setShowDraftModal(true)}
          disabled={!aiConfigured}
          title={aiConfigured ? `AI blog draft generálása (${aiModel})` : "OpenAI nincs konfigurálva (.env: OPENAI_API_KEY)"}
          style={{
            marginLeft: "auto",
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 6,
            background: aiConfigured ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(20,184,166,0.2))" : "rgba(255,255,255,0.04)",
            border: `1px solid ${aiConfigured ? "rgba(168,85,247,0.45)" : "rgba(255,255,255,0.06)"}`,
            color: aiConfigured ? "#c084fc" : "#666",
            cursor: aiConfigured ? "pointer" : "not-allowed",
            fontFamily: "Geist Mono, monospace", fontSize: "0.75rem", fontWeight: 600,
          }}
        >
          <Sparkles size={13} />
          AI: blog draft
        </button>
      </div>

      {/* Blog draft modal */}
      {showDraftModal && (
        <div
          onClick={() => setShowDraftModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1a1a", border: "1px solid rgba(168,85,247,0.4)", borderRadius: 10,
              padding: "1.75rem", maxWidth: 540, width: "100%",
              boxShadow: "0 30px 80px -10px rgba(168,85,247,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} style={{ color: "#c084fc" }} />
                AI blog draft generálása
              </h3>
              <button type="button" onClick={() => setShowDraftModal(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Add meg a cikk témáját — két-fázisú pipeline fut le ({aiModel}): először strukturált draft, majd szerkesztői pass, ami az AI-szagú mondatokat átírja és a stílust HubSpot-szerű B2B hangra polírozza. Output: ~900-1200 szavas HTML cikk + 5 cím-javaslat + szerkesztői megjegyzések, mindhárom nyelven (HU + EN + ZH). 3 nyelv × 2 pass ≈ 20-40 mp. A meglévő tartalom felülíródik.
            </p>
            {/* Inputs + progress are rendered as alternatives — while a
                generation is in flight, the topic input would be edited
                blindly and is useless. */}
            {blogDraftMutation.isPending ? (
              <div style={{ marginBottom: "1.5rem" }}>
                {/* Progress bar */}
                <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: "1rem" }}>
                  <div
                    style={{
                      position: "absolute", inset: 0, right: "auto",
                      width: `${progressPct}%`,
                      background: "linear-gradient(90deg, #a855f7 0%, #14B8A6 100%)",
                      borderRadius: 999,
                      transition: "width 0.6s ease",
                      boxShadow: "0 0 12px rgba(168,85,247,0.45)",
                    }}
                  />
                </div>
                {/* Active stage label + elapsed time */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#c084fc", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", fontWeight: 600 }}>
                    {DRAFT_STAGES[activeStageIndex].label}
                  </span>
                  <span style={{ color: "#888", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem" }}>
                    {draftElapsedSec}s
                  </span>
                </div>
                <p style={{ color: "#888", fontSize: "0.78rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {DRAFT_STAGES[activeStageIndex].detail}
                </p>
                {/* Stage timeline — checkmarks for completed phases */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0.85rem 1rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>
                  {DRAFT_STAGES.map((stage, idx) => {
                    const done = idx < activeStageIndex;
                    const active = idx === activeStageIndex;
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, opacity: done || active ? 1 : 0.45 }}>
                        <span style={{
                          width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: done ? "#10b981" : active ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.08)",
                          border: active ? "1px solid #c084fc" : "1px solid transparent",
                        }}>
                          {done && <span style={{ color: "#fff", fontSize: 9, lineHeight: 1, fontWeight: 700 }}>✓</span>}
                          {active && <Loader2 size={9} style={{ color: "#c084fc", animation: "spin 0.8s linear infinite" }} />}
                        </span>
                        <span style={{
                          color: done ? "#10b981" : active ? "#fff" : "#888",
                          fontFamily: "Geist Mono, monospace", fontSize: "0.7rem",
                          fontWeight: active ? 600 : 400,
                        }}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Téma *</label>
                  <input
                    value={draftTopic}
                    onChange={(e) => setDraftTopic(e.target.value)}
                    placeholder="pl. Hogyan érdemes Google Ads kampányt indítani 2026-ban kis büdzsével"
                    style={inputStyle}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter" && !blogDraftMutation.isPending) { e.preventDefault(); handleGenerateDraft(); } }}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Hangnem</label>
                  <select value={draftTone} onChange={(e) => setDraftTone(e.target.value as typeof draftTone)} style={inputStyle}>
                    <option value="professional">Professzionális (default)</option>
                    <option value="conversational">Beszélgetős</option>
                    <option value="technical">Technikai / részletes</option>
                  </select>
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowDraftModal(false)}
                style={{ padding: "9px 16px", borderRadius: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.8rem" }}
              >
                Mégse
              </button>
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={blogDraftMutation.isPending || !draftTopic.trim()}
                style={{
                  padding: "9px 18px", borderRadius: 6,
                  background: blogDraftMutation.isPending ? "rgba(168,85,247,0.3)" : "linear-gradient(135deg, #a855f7, #14B8A6)",
                  border: "none", color: "#fff", cursor: blogDraftMutation.isPending ? "wait" : "pointer",
                  fontFamily: "Geist Mono, monospace", fontSize: "0.8rem", fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  opacity: !draftTopic.trim() ? 0.5 : 1,
                }}
              >
                {blogDraftMutation.isPending ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={13} />}
                {blogDraftMutation.isPending ? "Generálás (HU+EN+ZH)..." : "Generálás (3 nyelv)"}
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <LocalizedField
                label="Cím"
                field="title"
                form={form}
                setForm={setForm}
                required
                placeholder="Cikk címe"
                placeholderEn="Post title"
                placeholderZh="文章标题"
              />
              {/* Alternative title suggestions from the AI generator —
                  one button per language tab. Clicking promotes the
                  suggestion into the matching title field. */}
              {(draftAltTitles.hu.length > 0 || draftAltTitles.en.length > 0 || draftAltTitles.zh.length > 0) && (
                <div style={{ marginTop: -8, padding: "0.85rem 1rem", background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ ...labelStyle, marginBottom: 0, color: "#c084fc" }}>
                      AI cím-javaslatok (kattints kicseréléshez)
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraftAltTitles({ hu: [], en: [], zh: [] })}
                      style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem" }}
                    >
                      elrejt
                    </button>
                  </div>
                  {(["hu", "en", "zh"] as const).map((loc) => {
                    const titles = draftAltTitles[loc];
                    if (titles.length === 0) return null;
                    const fieldKey = loc === "hu" ? "title" : loc === "en" ? "titleEn" : "titleZh";
                    const langLabel = loc === "hu" ? "HU" : loc === "en" ? "EN" : "ZH";
                    return (
                      <div key={loc} style={{ marginBottom: 6 }}>
                        <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "#888", marginBottom: 4 }}>
                          {langLabel}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {titles.map((t, i) => (
                            <button
                              key={`${loc}-${i}`}
                              type="button"
                              onClick={() => setForm(p => ({ ...p, [fieldKey]: t }))}
                              title={`${langLabel}-cím cseréje erre`}
                              style={{
                                padding: "5px 9px", borderRadius: 5,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#ccc", cursor: "pointer",
                                fontFamily: "Geist, sans-serif", fontSize: "0.72rem",
                                textAlign: "left", maxWidth: "100%",
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div>
                <label style={labelStyle}>URL slug *</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required style={inputStyle} placeholder="url-slug" />
              </div>
              <LocalizedField
                label="Kivonat"
                field="excerpt"
                form={form}
                setForm={setForm}
                type="textarea"
                rows={3}
                placeholder="Rövid összefoglaló..."
                placeholderEn="Short summary..."
                placeholderZh="简短摘要..."
              />
              <LocalizedField
                label="Tartalom (HTML)"
                field="content"
                form={form}
                setForm={setForm}
                type="rich"
                rows={14}
                required
                placeholder="<p>Cikk tartalma...</p>"
                placeholderEn="<p>Post content...</p>"
                placeholderZh="<p>文章内容...</p>"
              />
              {/* Editor-pass notes — what the second-pass review changed.
                  Collapsible because it's purely informational and would
                  clutter the editor when not needed. */}
              {(draftEditorNotes.hu.length > 0 || draftEditorNotes.en.length > 0 || draftEditorNotes.zh.length > 0) && (
                <div style={{ padding: "0.85rem 1rem", background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 7 }}>
                  <button
                    type="button"
                    onClick={() => setShowEditorNotes((v) => !v)}
                    style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", color: "#5eead4", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.75rem", padding: 0 }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={12} /> AI szerkesztői megjegyzések ({(draftEditorNotes.hu.length + draftEditorNotes.en.length + draftEditorNotes.zh.length)} darab)
                    </span>
                    <span style={{ color: "#888", fontSize: "0.68rem" }}>{showEditorNotes ? "elrejt ▴" : "megnyit ▾"}</span>
                  </button>
                  {showEditorNotes && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {(["hu", "en", "zh"] as const).map((loc) => {
                        const notes = draftEditorNotes[loc];
                        if (notes.length === 0) return null;
                        const langLabel = loc === "hu" ? "HU" : loc === "en" ? "EN" : "ZH";
                        return (
                          <div key={loc}>
                            <div style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.6rem", color: "#888", marginBottom: 4 }}>{langLabel}</div>
                            <ul style={{ margin: 0, paddingLeft: 18, color: "#bbb", fontSize: "0.78rem", lineHeight: 1.55 }}>
                              {notes.map((n, i) => <li key={i} style={{ marginBottom: 3 }}>{n}</li>)}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>SEO</h3>
                <button
                  type="button"
                  onClick={handleGenerateSeoMeta}
                  disabled={!aiConfigured || seoMetaMutation.isPending || (!form.title.trim() && !form.content.trim())}
                  title={
                    !aiConfigured
                      ? "OpenAI nincs konfigurálva (.env: OPENAI_API_KEY)"
                      : (!form.title.trim() && !form.content.trim())
                      ? "Először adj meg címet vagy tartalmat"
                      : `AI SEO meta generálás (${aiModel})`
                  }
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 5,
                    background: aiConfigured && (form.title.trim() || form.content.trim())
                      ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${aiConfigured && (form.title.trim() || form.content.trim()) ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: aiConfigured && (form.title.trim() || form.content.trim()) ? "#c084fc" : "#666",
                    cursor: aiConfigured && (form.title.trim() || form.content.trim()) && !seoMetaMutation.isPending ? "pointer" : "not-allowed",
                    fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", fontWeight: 600,
                  }}
                >
                  {seoMetaMutation.isPending ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={11} />}
                  AI generálás
                </button>
              </div>
              <LocalizedField
                label="Meta cím"
                field="metaTitle"
                form={form}
                setForm={setForm}
                placeholder="Meta cím (max 60 karakter)"
                hint={`HU: ${form.metaTitle.length}/60`}
              />
              <LocalizedField
                label="Meta leírás"
                field="metaDescription"
                form={form}
                setForm={setForm}
                type="textarea"
                rows={3}
                placeholder="Meta leírás (max 160 karakter)"
                hint={`HU: ${form.metaDescription.length}/160`}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>Közzététel</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Státusz</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as "draft" | "published" }))} style={{ ...inputStyle }}>
                  <option value="draft">Vázlat</option>
                  <option value="published">Közzétett</option>
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Közzététel dátuma</label>
                <input type="datetime-local" value={form.publishedAt} onChange={e => setForm(p => ({ ...p, publishedAt: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Kategória</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} style={inputStyle}>
                  <option value="">– Nincs kategória –</option>
                  {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Szerző neve</label>
                <input value={form.authorName} onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))} style={inputStyle} placeholder="G2A Marketing" />
              </div>
            </div>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>Kiemelt kép</h3>
                <AiImageButton
                  compact
                  defaultPrompt={`Editorial blog post hero image for "${form.title || "blog post"}". Modern, minimal, B2B marketing context. Dark background with subtle teal accent, professional, clean.`}
                  filenameHint={`post-${form.slug || form.title || "featured"}`}
                  folder="g2a/posts"
                  defaultSize="1792x1024"
                  onGenerated={(url) => setForm(p => ({ ...p, featuredImage: url }))}
                  label="AI: kép"
                />
              </div>
              <ImageUploader
                value={form.featuredImage}
                altValue={form.featuredImageAlt}
                onChange={(url) => setForm(p => ({ ...p, featuredImage: url }))}
                onAltChange={(alt) => setForm(p => ({ ...p, featuredImageAlt: alt }))}
                label="Kiemelt kép"
                placeholder="Kép URL vagy feltöltés"
              />
            </div>
            <button type="submit" className="g2a-btn-primary" style={{ justifyContent: "center" }}>
              <Save size={16} /> Mentés
            </button>
          </div>
        </div>
      </form>

      {/* Social media share section — needs a saved post (i.e. an integer
          ID exists) because drafts attach to that ID. For new unsaved
          posts we surface a placeholder so the admin discovers the
          feature exists rather than silently hiding it. */}
      {!isNew && postId ? (
        <SocialShareSection
          postId={postId}
          slug={form.slug}
          status={form.status}
        />
      ) : (
        <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "#161616", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 12, color: "#888", fontFamily: "Geist Mono, monospace", fontSize: "0.82rem", lineHeight: 1.6 }}>
          <strong style={{ color: "#ccc", display: "block", marginBottom: 4, fontSize: "0.95rem" }}>
            Megosztás közösségi médián
          </strong>
          A LinkedIn / Facebook / Instagram megosztó modul a cikk első mentése után jelenik meg itt. Mentsd el a cikket fent a <em style={{ color: "#5eead4" }}>Mentés</em> gombbal, és visszatöltődés után tudsz platformokra szabott AI-copyt generálni és kattintással megosztani.
        </div>
      )}
    </div>
  );
}
