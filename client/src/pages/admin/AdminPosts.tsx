import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectAllCheckbox, BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import { formatAdminDate } from "@/components/admin/formatDate";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";

export default function AdminPosts() {
  const confirm = useConfirm();
  const { data: posts, refetch, isLoading } = trpc.admin.posts.list.useQuery();
  const deleteMutation = trpc.admin.posts.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Cikk törölve"); } });
  const deleteManyMutation = trpc.admin.posts.deleteMany.useMutation({
    onSuccess: (n) => { refetch(); toast.success(`${n} cikk törölve`); selection.clear(); },
  });
  const updateMutation = trpc.admin.posts.update.useMutation({ onSuccess: () => { refetch(); toast.success("Cikk frissítve"); } });

  const selection = useBulkSelection<number>((posts || []).map(p => p.id));

  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} cikket?\n\nEz nem visszavonható.` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Blog Cikkek</h1>
        <Link href="/admin/posts/new" className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}>
          <Plus size={16} /> Új cikk
        </Link>
      </div>
      <BulkActionBar
        count={selection.count}
        itemLabel="kiválasztott cikk"
        onClear={selection.clear}
        onDelete={handleBulkDelete}
        deleting={deleteManyMutation.isPending}
      />
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <th style={{ padding: "0.875rem 0 0.875rem 1rem", width: 36 }}>
                <BulkSelectAllCheckbox allSelected={selection.allSelected} someSelected={selection.someSelected} onToggle={selection.toggleAll} />
              </th>
              {["Cím", "Státusz", "Dátum", "Műveletek"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Geist Mono, monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(posts || []).map(post => (
              <tr key={post.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: selection.isSelected(post.id) ? "rgba(20,184,166,0.06)" : undefined }}>
                <td style={{ padding: "0.875rem 0 0.875rem 1rem" }}>
                  <BulkSelectCheckbox checked={selection.isSelected(post.id)} onToggle={() => selection.toggle(post.id)} />
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#fff", fontSize: "0.875rem" }}>{post.title}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ padding: "0.25rem 0.625rem", borderRadius: "4px", fontSize: "0.75rem", backgroundColor: post.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: post.status === "published" ? "#10b981" : "#f59e0b" }}>
                    {post.status === "published" ? "Közzétett" : "Vázlat"}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.8125rem" }}>
                  {post.publishedAt ? formatAdminDate(post.publishedAt) : "–"}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ color: "#888", display: "flex", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => updateMutation.mutate({ id: post.id, data: { status: post.status === "published" ? "draft" : "published" } })}
                      style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                      {post.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={async () => {
                      const ok = await confirm({ title: "Cikk törlése", message: `Biztosan törlöd a(z) "${post.title}" cikket?\n\nEz nem visszavonható.` });
                      if (ok) deleteMutation.mutate({ id: post.id });
                    }}
                      style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#14B8A6")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <div style={{ padding: "1rem" }}><AdminListSkeleton rows={5} /></div>
        ) : (!posts || posts.length === 0) ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek cikkek.</div>
        ) : null}
      </div>
    </div>
  );
}
