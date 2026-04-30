/**
 * Tiny centered loader shown by Suspense boundaries while a route chunk
 * downloads. Intentionally minimal — most route chunks are <50KB and load
 * within a couple hundred ms, so a heavy loader would feel worse than this.
 */
export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "100px",
      }}
      aria-label="Töltés"
      role="status"
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid rgba(20,184,166,0.18)",
          borderTopColor: "var(--g2a-brand-teal)",
          animation: "g2a-spin 0.85s linear infinite",
        }}
      />
      <style>{`
        @keyframes g2a-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
