/**
 * /koszonjuk — thank-you page shown after a lead-magnet opt-in (HU-only).
 */
import SeoHead from "@/components/SeoHead";
import { FunnelShell, C, MONO, wrap, eyebrow } from "@/components/funnel/FunnelShell";

const STEPS = [
  { n: "1", h: "Nézd meg a beérkező leveleket", p: "Ha 5 percen belül nem látod, kukkants be a Promóciók vagy a Spam mappába is — néha oda téved." },
  { n: "2", h: "Tegyél minket a névjegyek közé", p: "Add hozzá az info@g2amarketing.hu címet a kapcsolataidhoz, hogy a következő tippek is biztosan megérkezzenek." },
  { n: "3", h: "Kezdd a checklistával", p: "15 perc alatt átvilágítod a marketinged, és rögtön látod, mire fókuszálj. Ez a leggyorsabb győzelem a csomagból." },
];

export default function KoszonjukPage() {
  return (
    <>
      <SeoHead title="Köszönjük a feliratkozást — G2A Marketing" description="Sikeres feliratkozás. Pár percen belül megérkezik a 4 anyag a postaládádba." noIndex />
      <FunnelShell>
        <div style={{ ...wrap, paddingTop: 70, paddingBottom: 30, maxWidth: 760 }}>
          <div style={eyebrow}>Sikeres feliratkozás</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.2px", color: "#fff", margin: "14px 0 12px", lineHeight: 1.06 }}>Köszönjük! Már úton is van.</h1>
          <p style={{ fontSize: 17, color: C.muted, maxWidth: 560, marginBottom: 32 }}>Pár percen belül megérkezik a 4 anyag a postaládádba. Amíg vársz, itt van, mit érdemes tenned:</p>

          <div style={{ display: "grid", gap: 12 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.teal, color: "#06201d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 3 }}>{s.h}</div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{s.p}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, background: "linear-gradient(180deg,rgba(20,184,166,.06),transparent)", border: `1px solid ${C.line}`, borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: C.teal, marginBottom: 8 }}>Egy jó tanács</div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>Ne akard egyszerre az egészet. Válaszd ki a 3 leggyengébb pontod a checklistából, és a következő hónapban csak azokra fókuszálj. A rendszeresség többet ér, mint a tökéletesség.</p>
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <a href="/marketing-teszt" style={{ background: C.teal, color: "#06201d", fontWeight: 800, fontSize: 14, padding: "12px 22px", borderRadius: 100, textDecoration: "none", fontFamily: MONO }}>Kezdd a checklistával →</a>
            <a href="/" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Vissza a főoldalra</a>
          </div>
        </div>
      </FunnelShell>
    </>
  );
}
