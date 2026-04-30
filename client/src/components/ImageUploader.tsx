import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ImageUploaderProps {
  value?: string;
  altValue?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  altValue,
  onChange,
  onAltChange,
  label = "Kép",
  placeholder = "Kép URL vagy feltöltés",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.upload.uploadFile.useMutation({
    onSuccess: (data: { url: string }) => {
      onChange(data.url);
      setUrlInput(data.url);
      setUploading(false);
      setError(null);
    },
    onError: (err: { message: string }) => {
      setError(`Feltöltési hiba: ${err.message}`);
      setUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Csak képfájlok tölthetők fel.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A fájl mérete nem lehet nagyobb 5MB-nál.");
      return;
    }

    setUploading(true);
    setError(null);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        filename: file.name,
        contentType: file.type,
        base64Data: base64,
      });
    };
    reader.onerror = () => {
      setError("Fájl olvasási hiba.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlBlur = () => {
    if (urlInput !== value) {
      onChange(urlInput);
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "6px",
    color: "#ffffff",
    fontFamily: "Geist Mono, monospace",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#b0b0b0",
    fontSize: "0.8125rem",
    marginBottom: "0.375rem",
    fontFamily: "Geist Mono, monospace",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label style={labelStyle}>{label}</label>

      {/* URL Input + Upload Button */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onBlur={handleUrlBlur}
          placeholder={placeholder}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Kép feltöltése"
          style={{
            padding: "0.625rem 0.875rem",
            backgroundColor: "#222",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            color: uploading ? "#666" : "var(--g2a-brand-teal)",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            fontFamily: "Geist Mono, monospace",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          {uploading ? (
            <><Loader2 size={14} className="animate-spin" /> Feltöltés...</>
          ) : (
            <><Upload size={14} /> Feltöltés</>
          )}
        </button>
        {urlInput && (
          <button
            type="button"
            onClick={handleClear}
            title="Törlés"
            style={{
              padding: "0.625rem",
              backgroundColor: "#222",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              color: "#666",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Error message */}
      {error && (
        <p style={{ color: "var(--g2a-brand-teal)", fontSize: "0.8125rem", margin: 0 }}>{error}</p>
      )}

      {/* Alt text field */}
      {onAltChange && (
        <div>
          <label style={labelStyle}>Alt szöveg (SEO)</label>
          <input
            type="text"
            value={altValue || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Leíró alt szöveg a képhez (SEO szempontból fontos)"
            style={inputStyle}
          />
        </div>
      )}

      {/* Image preview */}
      {urlInput && (
        <div style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
          maxWidth: "300px",
          backgroundColor: "#111",
        }}>
          <img
            src={urlInput}
            alt={altValue || "Előnézet"}
            style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<div style="height:160px;display:flex;align-items:center;justify-content:center;color:#444;font-size:0.8125rem;font-family:Roboto Mono,monospace">Kép nem tölthető be</div>`;
              }
            }}
          />
          <div style={{ padding: "0.5rem 0.75rem", backgroundColor: "#111", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#666", fontSize: "0.75rem" }}>
              <ImageIcon size={11} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {urlInput.split("/").pop() || "kép"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
