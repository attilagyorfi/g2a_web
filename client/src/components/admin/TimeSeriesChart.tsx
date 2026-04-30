/**
 * Lightweight SVG line chart — no external lib, no canvas.
 *
 * Renders one or more lines over a shared X axis (days). Pass `series` as an
 * array of { name, color, points: number[] } objects sharing the same length
 * as `labels`. Tooltips appear on hover.
 *
 * Why custom: chart libs add 50-150 KB minified. For a single dashboard
 * sparkline-style component this is overkill.
 */
import { useState, useMemo } from "react";

export type ChartSeries = {
  name: string;
  color: string;
  /** Same length as `labels`. */
  points: number[];
};

type Props = {
  /** ISO-ish date strings (YYYY-MM-DD) for the X axis. */
  labels: string[];
  series: ChartSeries[];
  height?: number;
  /** When true, label every day. Otherwise auto-thin to ~6 ticks. */
  showAllXLabels?: boolean;
};

const PAD_LEFT = 36;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;

export default function TimeSeriesChart({ labels, series, height = 240, showAllXLabels = false }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [width, setWidth] = useState(720);

  const max = useMemo(() => {
    let m = 0;
    for (const s of series) for (const p of s.points) if (p > m) m = p;
    return Math.max(m, 1);
  }, [series]);

  const yStep = niceStep(max);
  const yMax = Math.ceil(max / yStep) * yStep || yStep;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const W = width;
  const H = height;
  const innerW = W - PAD_LEFT - PAD_RIGHT;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const xFor = (i: number) => PAD_LEFT + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2);
  const yFor = (v: number) => PAD_TOP + innerH - (v / yMax) * innerH;

  // Auto-thin x-axis labels: target ~6 visible ticks
  const xTickEvery = showAllXLabels ? 1 : Math.max(1, Math.ceil(labels.length / 6));
  const fmtDate = (iso: string) => {
    const [, m, d] = iso.split("-");
    return `${m}.${d}`;
  };

  return (
    <div
      style={{ width: "100%", overflow: "visible" }}
      ref={(el) => { if (el) { const w = el.getBoundingClientRect().width; if (w > 0 && Math.abs(w - width) > 8) setWidth(Math.floor(w)); } }}
    >
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", overflow: "visible", fontFamily: "Geist Mono, monospace" }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Y grid + labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD_LEFT} x2={W - PAD_RIGHT} y1={yFor(v)} y2={yFor(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD_LEFT - 6} y={yFor(v) + 3} fontSize="10" fill="#666" textAnchor="end">{v}</text>
          </g>
        ))}

        {/* X labels */}
        {labels.map((lab, i) => i % xTickEvery === 0 && (
          <text key={lab} x={xFor(i)} y={H - 8} fontSize="9" fill="#666" textAnchor="middle">{fmtDate(lab)}</text>
        ))}

        {/* Series lines + filled area */}
        {series.map((s) => {
          const path = s.points.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");
          const fillPath = `${path} L ${xFor(s.points.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`;
          return (
            <g key={s.name}>
              <path d={fillPath} fill={s.color} opacity={0.08} />
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {/* Endpoints + hover dots */}
              {s.points.map((v, i) => (
                <circle key={i} cx={xFor(i)} cy={yFor(v)} r={i === hoverIdx ? 4 : 2.5} fill={s.color} opacity={hoverIdx === null || i === hoverIdx ? 1 : 0.3} />
              ))}
            </g>
          );
        })}

        {/* Hover overlay rects (one per index for easy targeting) */}
        {labels.map((_lab, i) => (
          <rect key={i}
            x={xFor(i) - innerW / labels.length / 2}
            y={PAD_TOP}
            width={innerW / labels.length}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {/* Tooltip */}
        {hoverIdx !== null && (() => {
          const tx = xFor(hoverIdx);
          const tooltipW = 150;
          const flip = tx + tooltipW + 8 > W - PAD_RIGHT;
          const boxX = flip ? tx - tooltipW - 8 : tx + 8;
          const boxY = PAD_TOP;
          return (
            <g style={{ pointerEvents: "none" }}>
              <line x1={tx} x2={tx} y1={PAD_TOP} y2={H - PAD_BOTTOM} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="2,3" />
              <rect x={boxX} y={boxY} width={tooltipW} height={20 + series.length * 16}
                rx={5} fill="#1a1a1a" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text x={boxX + 8} y={boxY + 14} fontSize="10" fill="#888">{labels[hoverIdx]}</text>
              {series.map((s, si) => (
                <g key={s.name}>
                  <circle cx={boxX + 12} cy={boxY + 28 + si * 16} r={3} fill={s.color} />
                  <text x={boxX + 20} y={boxY + 32 + si * 16} fontSize="10" fill="#ccc">{s.name}</text>
                  <text x={boxX + tooltipW - 8} y={boxY + 32 + si * 16} fontSize="10" fontWeight="700" fill="#fff" textAnchor="end">{s.points[hoverIdx]}</text>
                </g>
              ))}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

/** Pick a "nice" step (1, 2, 5, 10, 20, 50, ...) so the y-axis ticks are clean integers. */
function niceStep(max: number): number {
  if (max <= 1) return 1;
  const exp = Math.floor(Math.log10(max));
  const base = Math.pow(10, exp);
  const m = max / base;
  if (m <= 1) return 0.2 * base;
  if (m <= 2) return 0.5 * base;
  if (m <= 5) return 1 * base;
  return 2 * base;
}
