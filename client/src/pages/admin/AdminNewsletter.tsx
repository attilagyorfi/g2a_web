import { trpc } from "@/lib/trpc";
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminNewsletter() {
  const { data: subscribers, refetch } = trpc.admin.newsletter.list.useQuery();
  const deleteMutation = trpc.admin.newsletter.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Feliratkozó törölve"); } });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Hírlevél feliratkozók</h1>
        <div style={{ backgroundColor: "rgba(233,17,48,0.1)", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "6px", padding: "0.5rem 1rem", color: "#e91130", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem" }}>
          {subscribers?.length || 0} feliratkozó
        </div>
      </div>
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Email", "Név", "Feliratkozás dátuma", "Műveletek"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Roboto Mono, monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(subscribers || []).map(sub => (
              <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Mail size={14} color="#e91130" />
                    <span style={{ color: "#fff", fontSize: "0.875rem", fontFamily: "Roboto Mono, monospace" }}>{sub.email}</span>
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{sub.name || "–"}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#666", fontSize: "0.8rem" }}>{new Date(sub.createdAt).toLocaleString("hu-HU")}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <button onClick={() => { if (confirm("Biztosan törli ezt a feliratkozót?")) deleteMutation.mutate({ id: sub.id }); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#e91130")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscribers || subscribers.length === 0) && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek feliratkozók.</div>
        )}
      </div>
    </div>
  );
}
