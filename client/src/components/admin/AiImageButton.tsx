/**
 * Inline button that opens an AI image-generation modal. On success, calls
 * `onGenerated(url)` with the new Cloudinary CDN URL so the parent form can
 * drop it into a heroImage / featuredImage field.
 *
 * Hidden when OpenAI not configured. Shows a warning when Cloudinary is also
 * missing (the generated URL will expire in ~1 hour).
 */
import { useState } from "react";
import { Loader2, Sparkles, X, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";

type Size = "1024x1024" | "1792x1024" | "1024x1792";
type Quality = "standard" | "hd";
type Style = "vivid" | "natural";

const SIZE_LABELS: Record<Size, string> = {
  "1792x1024": "Széles (1792×1024) — hero, banner",
  "1024x1024": "Négyzet (1024×1024) — kártya, social",
  "1024x1792": "Magas (1024×1792) — story, mobile cover",
};

// DALL·E 3 pricing as of 2026-04 (used to give the admin a cost estimate before generation)
const PRICE: Record<string, number> = {
  "1024x1024_standard": 0.04,
  "1792x1024_standard": 0.08,
  "1024x1792_standard": 0.08,
  "1024x1024_hd": 0.08,
  "1792x1024_hd": 0.12,
  "1024x1792_hd": 0.12,
};

type Props = {
  /** Pre-filled prompt — usually a sensible default like the entity's title + theme. */
  defaultPrompt: string;
  /** Filename hint for the Cloudinary public_id. Slug-based. */
  filenameHint: string;
  /** Cloudinary folder. e.g. "g2a/services/heroes". */
  folder?: string;
  /** Default canvas size. Hero images: 1792x1024. Featured: 1024x1024. */
  defaultSize?: Size;
  /** Called when generation completes with the final URL (Cloudinary or temporary). */
  onGenerated: (url: string) => void;
  /** Optional label override. */
  label?: string;
  /** Compact button vs. full button. */
  compact?: boolean;
};

export default function AiImageButton({
  defaultPrompt,
  filenameHint,
  folder,
  defaultSize = "1792x1024",
  onGenerated,
  label = "AI: kép generálása",
  compact = false,
}: Props) {
  const aiStatus = trpc.admin.ai.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const generateMutation = trpc.admin.ai.generateImage.useMutation();

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [size, setSize] = useState<Size>(defaultSize);
  const [quality, setQuality] = useState<Quality>("standard");
  const [style, setStyle] = useState<Style>("natural");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const aiConfigured = aiStatus.data?.configured ?? false;
  if (!aiConfigured) return null;

  const cost = PRICE[`${size}_${quality}`] ?? 0.08;
  const costHuf = Math.ceil(cost * 380); // ~380 HUF/USD as a rough estimate

  const handleGenerate = async () => {
    if (prompt.trim().length < 8) {
      toast.error("A prompt legalább 8 karakter legyen.");
      return;
    }
    setPreviewUrl(null);
    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        size,
        quality,
        style,
        folder,
        filenameHint,
      });
      setPreviewUrl(result.url);
      if ("ephemeral" in result && result.ephemeral) {
        toast.warning((result as { warning?: string }).warning ?? "A kép URL ~1 óra múlva lejár.");
      } else {
        toast.success("Kép generálva.");
      }
    } catch (err) {
      toast.error(parseFormError(err, "Képgenerálás sikertelen"));
    }
  };

  const handleAccept = () => {
    if (previewUrl) {
      onGenerated(previewUrl);
      setOpen(false);
      setPreviewUrl(null);
      toast.success("Kép beillesztve a mezőbe.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setPrompt(defaultPrompt); setOpen(true); }}
        title={label}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: compact ? "5px 10px" : "8px 14px",
          borderRadius: 5,
          background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(20,184,166,0.2))",
          border: "1px solid rgba(168,85,247,0.45)",
          color: "#c084fc",
          cursor: "pointer",
          fontFamily: "Geist Mono, monospace",
          fontSize: compact ? "0.65rem" : "0.78rem",
          fontWeight: 600,
        }}
      >
        <ImageIcon size={compact ? 11 : 13} />
        {label}
      </button>

      {open && (
        <div
          onClick={() => !generateMutation.isPending && setOpen(false)}
          role="presentation"
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={label}
            style={{
              background: "#1a1a1a", border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: 12, padding: "1.5rem",
              maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto",
              boxShadow: "0 30px 80px -10px rgba(168,85,247,0.3)",
              fontFamily: "Geist, sans-serif",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} style={{ color: "#c084fc" }} /> AI képgenerálás
              </h3>
              <button type="button" onClick={() => !generateMutation.isPending && setOpen(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Prompt */}
            <label style={{ display: "block", color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "Geist Mono, monospace" }}>
              Prompt (mit ábrázoljon a kép?)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              style={{
                width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5,
                padding: "0.65rem 0.85rem", color: "#fff",
                fontFamily: "Geist Mono, monospace", fontSize: "0.82rem", outline: "none", resize: "vertical",
                boxSizing: "border-box",
              }}
              placeholder="pl. Modern, minimal B2B marketing dashboard hero image, dark teal accent, abstract geometric shapes, clean composition"
              disabled={generateMutation.isPending}
            />
            <p style={{ marginTop: 4, fontSize: "0.65rem", color: "#666", fontFamily: "Geist Mono, monospace" }}>
              Tipp: adj meg konkrét vizuális részleteket. Színt, hangulatot, kompozíciót.
            </p>

            {/* Settings */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
              <div>
                <label style={{ display: "block", color: "#888", fontSize: "0.65rem", textTransform: "uppercase", marginBottom: 4, fontFamily: "Geist Mono, monospace" }}>Méret</label>
                <select value={size} onChange={(e) => setSize(e.target.value as Size)} disabled={generateMutation.isPending}
                  style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "6px 8px", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", outline: "none" }}>
                  {(Object.entries(SIZE_LABELS) as [Size, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#888", fontSize: "0.65rem", textTransform: "uppercase", marginBottom: 4, fontFamily: "Geist Mono, monospace" }}>Minőség</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)} disabled={generateMutation.isPending}
                  style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "6px 8px", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", outline: "none" }}>
                  <option value="standard">Standard (olcsóbb)</option>
                  <option value="hd">HD (részletesebb)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#888", fontSize: "0.65rem", textTransform: "uppercase", marginBottom: 4, fontFamily: "Geist Mono, monospace" }}>Stílus</label>
                <select value={style} onChange={(e) => setStyle(e.target.value as Style)} disabled={generateMutation.isPending}
                  style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "6px 8px", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", outline: "none" }}>
                  <option value="natural">Természetes</option>
                  <option value="vivid">Élénk / dramatikus</option>
                </select>
              </div>
            </div>

            {/* Cost */}
            <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 5, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", gap: 8, fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", color: "#fbbf24" }}>
              <AlertTriangle size={13} />
              <span>Várható költség: ${cost.toFixed(2)} (~{costHuf} HUF) · DALL·E 3</span>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "Geist Mono, monospace" }}>
                  Generált kép (preview)
                </label>
                <img src={previewUrl} alt="Generated" style={{ width: "100%", height: "auto", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />
                <p style={{ marginTop: 6, fontSize: "0.65rem", color: "#666", fontFamily: "Geist Mono, monospace", wordBreak: "break-all" }}>
                  URL: {previewUrl.slice(0, 80)}{previewUrl.length > 80 ? "..." : ""}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
              <button
                type="button"
                onClick={() => !generateMutation.isPending && setOpen(false)}
                style={{ padding: "9px 16px", borderRadius: 5, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem" }}
              >
                Mégse
              </button>
              {previewUrl ? (
                <>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending}
                    style={{ padding: "9px 16px", borderRadius: 5, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc", cursor: generateMutation.isPending ? "wait" : "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    {generateMutation.isPending ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={13} />}
                    Újragenerálás
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    style={{ padding: "9px 18px", borderRadius: 5, background: "linear-gradient(135deg, #14B8A6, #0D9488)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Beillesztés
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || prompt.trim().length < 8}
                  style={{
                    padding: "9px 18px", borderRadius: 5,
                    background: generateMutation.isPending ? "rgba(168,85,247,0.3)" : "linear-gradient(135deg, #a855f7, #14B8A6)",
                    border: "none", color: "#fff", cursor: generateMutation.isPending ? "wait" : "pointer",
                    fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    opacity: prompt.trim().length < 8 ? 0.5 : 1,
                  }}
                >
                  {generateMutation.isPending ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={14} />}
                  {generateMutation.isPending ? "Generálás..." : "Generálás"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
