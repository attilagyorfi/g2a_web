import { useEffect, useState } from "react";
import { X } from "lucide-react";

const WECHAT_GREEN = "#07C160";
const QR_IMAGE_URL = "/wechat-qr.png";

export default function WechatButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="WeChat / 微信"
        title="WeChat / 微信"
        style={{
          position: "fixed",
          bottom: "5.75rem",
          right: "1.5rem",
          zIndex: 999,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: WECHAT_GREEN,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 20px ${WECHAT_GREEN}66`,
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px ${WECHAT_GREEN}99`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${WECHAT_GREEN}66`;
        }}
      >
        {/* WeChat icon (two speech bubbles) */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M9.5 4C5.36 4 2 6.95 2 10.5c0 1.99 1.07 3.78 2.74 4.96L4 18l3.06-1.5c.78.18 1.6.28 2.44.28.21 0 .42-.01.62-.02-.13-.45-.2-.93-.2-1.42 0-2.95 2.91-5.34 6.5-5.34.21 0 .42.01.62.03C16.65 7.55 13.42 4 9.5 4zM7 9.25a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75zm5 0a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
          <path d="M22 15.5c0-2.76-2.91-5-6.5-5S9 12.74 9 15.5s2.91 5 6.5 5c.6 0 1.18-.07 1.72-.19L20 21.5l-.51-2.04C20.97 18.6 22 17.13 22 15.5zm-8.75-.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm4.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="WeChat QR code"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--g2a-bg-card)",
              border: "1px solid var(--g2a-border)",
              borderRadius: 16,
              padding: "2rem",
              maxWidth: 380,
              width: "100%",
              position: "relative",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Bezárás"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: "var(--g2a-text-muted)",
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                display: "flex",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--g2a-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--g2a-text-muted)")}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: WECHAT_GREEN,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                WeChat · 微信
              </div>
              <h3
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--g2a-text-primary)",
                  margin: "0 0 0.5rem",
                }}
              >
                Attila Gyorfi 龙志健
              </h3>
              <p
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.85rem",
                  color: "var(--g2a-text-secondary)",
                  margin: "0 0 1.5rem",
                }}
              >
                扫描二维码加我为好友<br />
                <span style={{ fontSize: "0.78rem", color: "var(--g2a-text-muted)" }}>
                  Scan the QR code to add me as friend
                </span>
              </p>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "1rem",
                  display: "inline-block",
                  marginBottom: "1.25rem",
                }}
              >
                <img
                  src={QR_IMAGE_URL}
                  alt="WeChat QR code – Attila Gyorfi"
                  style={{ display: "block", width: 240, height: 240, objectFit: "contain" }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "block";
                  }}
                />
                <div
                  style={{
                    display: "none",
                    width: 240,
                    height: 240,
                    background: "#f3f4f6",
                    color: "#6b7280",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.7rem",
                    padding: "1rem",
                    borderRadius: 6,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  QR kép nincs feltöltve.<br />
                  Mentsd ide:<br />
                  <code style={{ fontSize: "0.65rem" }}>client/public/wechat-qr.png</code>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.7rem",
                  color: "var(--g2a-text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                ESC vagy kattintás a háttérre a bezáráshoz
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
