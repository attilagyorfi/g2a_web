import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function AdminPostEdit() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === "new";
  const postId = isNew ? null : parseInt(params.id);

  const { data: allPosts } = trpc.admin.posts.list.useQuery(undefined, { enabled: !!postId });
  const post = allPosts?.find(p => p.id === postId);
  const { data: categories } = trpc.content.categories.useQuery();
  const createMutation = trpc.admin.posts.create.useMutation({ onSuccess: () => { toast.success("Cikk létrehozva"); navigate("/admin/posts"); } });
  const updateMutation = trpc.admin.posts.update.useMutation({ onSuccess: () => toast.success("Cikk mentve") });

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", featuredImage: "", featuredImageAlt: "",
    categoryId: "" as string | number, authorName: "", status: "draft" as "draft" | "published",
    metaTitle: "", metaDescription: "", publishedAt: "",
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "",
        content: post.content || "", featuredImage: post.featuredImage || "",
        featuredImageAlt: post.featuredImageAlt || "", categoryId: post.categoryId || "",
        authorName: post.authorName || "", status: post.status as "draft" | "published",
        metaTitle: post.metaTitle || "", metaDescription: post.metaDescription || "",
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

  const inputStyle = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/posts" style={{ color: "#888", display: "flex", textDecoration: "none" }}><ArrowLeft size={20} /></Link>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>
          {isNew ? "Új cikk" : "Cikk szerkesztése"}
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Cím *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: p.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} required style={inputStyle} placeholder="Cikk címe" />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>URL slug *</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required style={inputStyle} placeholder="url-slug" />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Kivonat</label>
                <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} rows={3} placeholder="Rövid összefoglaló..." />
              </div>
              <div>
                <label style={labelStyle}>Tartalom (HTML) *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required style={{ ...inputStyle, resize: "vertical", minHeight: "300px" }} placeholder="<p>Cikk tartalma...</p>" />
              </div>
            </div>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>SEO</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Meta cím</label>
                <input value={form.metaTitle} onChange={e => setForm(p => ({ ...p, metaTitle: e.target.value }))} style={inputStyle} placeholder="Meta cím (max 60 karakter)" />
              </div>
              <div>
                <label style={labelStyle}>Meta leírás</label>
                <textarea value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} rows={3} placeholder="Meta leírás (max 160 karakter)" />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>Közzététel</h3>
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
              <h3 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>Kiemelt kép</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Kép URL</label>
                <input value={form.featuredImage} onChange={e => setForm(p => ({ ...p, featuredImage: e.target.value }))} style={inputStyle} placeholder="https://..." />
              </div>
              {form.featuredImage && <img src={form.featuredImage} alt="preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.75rem" }} />}
              <div>
                <label style={labelStyle}>Alt szöveg</label>
                <input value={form.featuredImageAlt} onChange={e => setForm(p => ({ ...p, featuredImageAlt: e.target.value }))} style={inputStyle} placeholder="Kép leírása" />
              </div>
            </div>
            <button type="submit" className="g2a-btn-primary" style={{ justifyContent: "center" }}>
              <Save size={16} /> Mentés
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
