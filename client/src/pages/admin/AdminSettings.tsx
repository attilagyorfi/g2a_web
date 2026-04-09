import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { toast } from "sonner";

const SETTING_FIELDS = [
  { key: "site_name", label: "Weboldal neve", placeholder: "G2A Marketing" },
  { key: "site_tagline", label: "Szlogen / Tagline", placeholder: "Adatvezérelt marketing ügynökség" },
  { key: "contact_phone", label: "Telefonszám", placeholder: "+36 30 190 2575" },
  { key: "contact_email", label: "Email cím", placeholder: "info@g2amarketing.hu" },
  { key: "contact_address", label: "Cím", placeholder: "Budapest, Magyarország" },
  { key: "opening_hours", label: "Nyitvatartás", placeholder: "H–P: 08:00–17:00" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/..." },
  { key: "footer_text", label: "Footer szöveg", placeholder: "© 2025 G2A Marketing. Minden jog fenntartva." },
  { key: "gtm_id", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
  { key: "ga4_id", label: "Google Analytics 4 Mérési azonosító", placeholder: "G-XXXXXXXXXX" },
  { key: "meta_pixel_id", label: "Meta Pixel ID", placeholder: "1234567890" },
  { key: "google_search_console", label: "Google Search Console verifikációs kód", placeholder: "google-site-verification=..." },
  { key: "crisp_website_id", label: "Crisp Live Chat Website ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
  { key: "brevo_api_key", label: "Brevo (Sendinblue) API kulcs – Ügyfeletértesítő email", placeholder: "xkeysib-..." },
  { key: "brevo_list_id", label: "Brevo lista ID (opcionális)", placeholder: "3" },
];

export default function AdminSettings() {
  const { data: settings, refetch } = trpc.admin.settings.list.useQuery();
  const upsertMutation = trpc.admin.settings.upsert.useMutation({ onSuccess: () => { refetch(); toast.success("Beállítás mentve"); } });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value || ""; });
      setForm(map);
    }
  }, [settings]);

  const handleSave = async (key: string) => {
    setSaving(key);
    await upsertMutation.mutateAsync({ key, value: form[key] || "" });
    setSaving(null);
  };

  const handleSaveAll = async () => {
    setSaving("all");
    for (const field of SETTING_FIELDS) {
      await upsertMutation.mutateAsync({ key: field.key, value: form[field.key] || "" });
    }
    setSaving(null);
    toast.success("Összes beállítás mentve");
  };

  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Weboldal beállítások</h1>
        <button onClick={handleSaveAll} disabled={saving === "all"} className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: saving === "all" ? 0.7 : 1 }}>
          <Save size={16} /> {saving === "all" ? "Mentés..." : "Összes mentése"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {SETTING_FIELDS.map(field => (
          <div key={field.key} style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
            <label style={ls}>{field.label}</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={form[field.key] || ""}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={{ ...is, flex: 1 }}
              />
              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                style={{ backgroundColor: "rgba(233,17,48,0.15)", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "5px", color: "var(--g2a-amber)", cursor: "pointer", padding: "0 0.875rem", flexShrink: 0, opacity: saving === field.key ? 0.7 : 1 }}
                title="Mentés"
              >
                <Save size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
