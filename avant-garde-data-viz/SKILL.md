---
name: avant-garde-data-viz
description: Design and engineer high-craft editorial data visualizations, scientific plots, bespoke SVG glyphs, and high-frequency telemetry dashboards in TypeScript (The Pudding, NYT Graphics, Financial Times, Feltron Report, Stripe Radar, Observable). Replaces generic Recharts/Chart.js templates with perceptual OKLCH color scales, direct narrative annotations, small multiples, horizon charts, ridgelines, and 60fps Canvas/SVG rendering.
---

# Avant-Garde Data Visualization

Goal: turn raw numbers into visual evidence with the clarity and typographic authority of *The Pudding*, *New York Times Graphics*, *Financial Times*, *Nicholas Felton (Feltron)*, *Giorgia Lupi (Pentagram)*, and *Stripe Radar*. Never ship the default "4 KPI cards + 1 Recharts area gradient + 1 donut chart" AI dashboard template.

## 1. Intake & Data Brief

Extract from the user request. Ask only what is blocking; otherwise pick a bold default and state it.

| Input | If user gives it | If missing |
|-------|------------------|------------|
| Data Domain & Analytical Question (what causes what, distribution, anomaly, flow, ranking) | Use it | Frame a sharp analytical thesis in the headline |
| Archetype (Editorial Journalism, Quant Telemetry, Scientific Matrix, Network Topology, Multivariate Glyph Poster) | Follow strictly | Run divergence (section 3.2) |
| Scale Type (Sequential, Diverging around zero/mean, Categorical ≤5 groups) | Use it | Pick based on data polarity (section 4) |
| Rendering Engine (Pure SVG + D3 scales, HiDPI Canvas 2D for >1k points, Hybrid SVG/Canvas) | Use it | Pure SVG + bespoke TS math (or HiDPI Canvas for streaming) |
| Interactivity (Crosshair scrubbing, Small-multiple linked brushing, Threshold slicing) | Use it | Synchronized crosshair + direct anomaly callouts |

User instructions override every default in this skill.

### 1.1 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Always run `node scripts/design-lock.mjs status <project-dir>` before starting:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract reusable chart/glyph/filter primitives into `components/ui/<Name>.tsx` and run `node scripts/design-lock.mjs scan <project-dir> --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Inherit all locked OKLCH tokens/fonts from `.ui-design-lock.json`, query `node scripts/design-lock.mjs find <project-dir> <keyword>` before building any chart, calendar, or control, reuse registered components, and run `node scripts/design-lock.mjs verify <project-dir>`.

---

## 2. Anti-Slop Data-Viz Laws (The Tufte & Lupi Rules)

Never ship these amateur data-viz mistakes:
- **No generic "4 KPI cards + 1 spline area + 1 donut" layout:** That is the #1 AI dashboard cliché. Lead with the primary analytical canvas and weave summary metrics directly into axis headers or inline spark-tables.
- **No pie or donut charts with >3 slices:** Human perception is terrible at comparing arc angles. Use horizontal Marimekko bars, Cleveland dot plots, or ranked slopegraphs instead.
- **No detached color legends when direct labels fit:** Never force the reader's eye to bounce between a 6-color legend box and 6 lines. Label series directly at the end of the line or on the geometry.
- **No un-annotated charts:** A chart without direct callouts (peak, trough, regime shift, SLA threshold, or structural break) is just raw wallpaper. Every primary chart must have at least 2 direct annotations (`<g class="annotation">`) pointing to specific data coordinates.
- **No sRGB rainbow colormaps:** Rainbow scales create false perceptual boundaries and fail for colorblind readers. Always use monotonic luminance (`L`) in OKLCH.
- **No non-zero baselines on bar/column charts:** Bar length encodes magnitude; truncating the baseline lies about ratios. Use dot plots or index-change line charts if variation is narrow.
- **No jittery proportional numbers:** Every axis tick, tooltip readout, delta badge, and table cell must use `font-variant-numeric: tabular-nums`.

---

## 3. Five Data-Viz Archetypes & Divergence

### 3.1 Archetypes
1. **Editorial Data Journalism (NYT Graphics, Financial Times, The Pudding):**
   - Warm salmon/ivory newsprint (`oklch(95% 0.018 70)`), high-contrast serif thesis headline ("What drove the 14.2σ spike?"), hairline grid rules, greyed-out context series + 1 high-chroma focal series, direct callout notes with leader lines.
2. **High-Frequency Telemetry & Quant Observatory (Bloomberg, SpaceX, Stripe Radar):**
   - Deep obsidian canvas, horizon charts, P50/P95/P99 confidence bands, dense tabular spark-matrices where every row has an inline micro-distribution, live threshold breach markers.
3. **Scientific Ridgeline & Perceptual Matrix (Observable, Distill, CERN):**
   - Overlapping Joyplot/ridgeline density curves, 2D hexbin or OKLCH perceptual heatmaps, marginal histograms on X/Y axes, logarithmic or quantile scales with exact mathematical notation.
4. **Conservation-of-Flow & Network Topology (Sankey, Alluvial, Chord):**
   - Flow ribbons where stroke width strictly conserves volume across stages, highlighting bottleneck drop-offs and conversion leaks with exact delta percentages.
5. **Feltron / Pentagram Multivariate Glyph Poster:**
   - Each entity or time period is rendered as a bespoke geometric glyph (radial spokes, concentric rings, stacked ticks) encoding 4–6 variables simultaneously in a rhythmic small-multiple grid.

### 3.2 Constraint Draw & Anti-Repetition
1. Read `history.md` before choosing a direction. Do not reuse the same archetype, primary chart form, or dominant hue (±20°) from the last 5 entries.
2. Draw 2 constraints before coding:
   ```bash
   node scripts/dataviz-constraints.mjs 2 --domain <editorial|telemetry|scientific|financial>
   ```
3. After building and auditing, append one line to `history.md`:
   `YYYY-MM-DD | project | archetype | chart forms | color scale oklch | signature interaction`

---

## 4. Perceptual OKLCH Color Scales for Data

Use `scripts/palette.mjs` to verify contrast and generate ramps:

1. **Sequential Scale (0 → Max):**
   - Vary **Luminance (`L`) monotonically** (e.g. `L: 92% → 28%` on light backgrounds, or `L: 22% → 88%` on dark backgrounds) while shifting Hue (`H`) slightly (≤45° arc) to boost discriminability without banding.
2. **Diverging Scale (-Max ← 0 → +Max):**
   - Neutral midpoint (`C ≤ 0.015`) so normal/zero values recede visually; two distinct hues at extremes with matched perceptual lightness (`L`) at equal distances from zero (e.g. Cobalt `H: 255` vs Vermilion `H: 28`).
3. **Focal + Context Rule (Categorical):**
   - Instead of 8 loud colors, render background comparison series in muted slate (`oklch(62% 0.015 H)`) and highlight the **1–2 focal series** in high chroma (`C ≥ 0.18`).

---

## 5. Production Zero-Dependency SVG & Scale Primitives (TypeScript)

Never rely on bloated chart libraries when 35 lines of pure TypeScript give pixel-perfect SVG control, confidence bands, and direct annotations:

```tsx
import React, { useState } from 'react';

export const scaleLinear = (domain: [number, number], range: [number, number]) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
};

export function AnnotatedBandChart({
  data,
  threshold,
}: {
  data: { t: string; p50: number; p10: number; p90: number; note?: string }[];
  threshold: number;
}) {
  const [hoverIdx, setHoverIdx] = useState<number>(data.length - 1);
  const W = 760, H = 260, PAD = { l: 44, r: 96, t: 24, b: 28 };
  const x = scaleLinear([0, data.length - 1], [PAD.l, W - PAD.r]);
  const y = scaleLinear([0, 120], [H - PAD.b, PAD.t]);

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.p50).toFixed(1)}`).join(' ');
  const bandTop = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.p90).toFixed(1)}`).join(' ');
  const bandBot = [...data].reverse().map((d, i) => `L${x(data.length - 1 - i).toFixed(1)},${y(d.p10).toFixed(1)}`).join(' ');
  const last = data[data.length - 1];
  const active = data[hoverIdx] || last;

  return (
    <figure className="relative font-mono text-xs select-none" style={{ color: 'oklch(18% 0.02 250)' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Annotated P50 and P10-P90 confidence band chart"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.round(((relX - PAD.l) / (W - PAD.l - PAD.r)) * (data.length - 1));
          setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
        }}
      >
        {/* Horizontal Reference Grid & Threshold Rule */}
        {[0, 40, 80, 120].map((tick) => (
          <g key={tick} transform={`translate(0,${y(tick)})`}>
            <line x1={PAD.l} x2={W - PAD.r} stroke="currentColor" strokeOpacity={tick === 0 ? 0.45 : 0.12} strokeDasharray={tick === 0 ? undefined : '2 3'} />
            <text x={PAD.l - 8} y={3} textAnchor="end" className="tabular-nums text-[10px]" fill="currentColor" fillOpacity={0.65}>
              {tick}ms
            </text>
          </g>
        ))}

        {/* SLA Threshold Line */}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(threshold)} y2={y(threshold)} stroke="oklch(58% 0.22 28)" strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={W - PAD.r + 6} y={y(threshold) + 3} fill="oklch(58% 0.22 28)" className="tabular-nums text-[10px] font-semibold">
          SLA {threshold}ms
        </text>

        {/* P10–P90 Confidence Band */}
        <path d={`${bandTop} ${bandBot} Z`} fill="oklch(48% 0.19 255 / 0.16)" />

        {/* Primary P50 Series + Direct End-of-Line Label (No Separate Legend!) */}
        <path d={linePath} fill="none" stroke="oklch(42% 0.19 255)" strokeWidth={2} />
        <text x={x(data.length - 1) + 6} y={y(last.p50) + 3} fill="oklch(42% 0.19 255)" className="tabular-nums text-[10px] font-bold">
          P50 ({last.p50}ms)
        </text>

        {/* Direct Anomaly / Regime Shift Annotations */}
        {data.map((d, i) =>
          d.note ? (
            <g key={i} className="annotation" transform={`translate(${x(i)},${y(d.p90)})`}>
              <line y1={0} y2={-18} stroke="oklch(18% 0.02 250)" strokeWidth={1} />
              <circle r={3} fill="oklch(58% 0.22 28)" />
              <text y={-22} textAnchor="middle" className="text-[10px] font-semibold" fill="currentColor">
                {d.note}
              </text>
            </g>
          ) : null
        )}

        {/* Interactive Crosshair Scrub */}
        <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={PAD.t} y2={H - PAD.b} stroke="currentColor" strokeOpacity={0.35} />
        <circle cx={x(hoverIdx)} cy={y(active.p50)} r={3.5} fill="oklch(42% 0.19 255)" />
      </svg>
    </figure>
  );
}
```

---

## 6. Workflow & Computational Data-Viz Audit

1. **Thesis & Intake**: Define the analytical question (e.g. *"Where did thermal anomalies exceed +2.4σ?"*), read `history.md`, and run `node scripts/dataviz-constraints.mjs 2 --domain <domain>`.
2. **Perceptual Palette**: Generate OKLCH sequential/diverging tokens via `node scripts/palette.mjs` and verify WCAG + APCA contrast.
3. **Architecture**: Combine 1 hero multi-layered analytical view (e.g. ridgeline, horizon chart, or confidence-band time series with direct annotations) + 1 dense small-multiple or inline spark-matrix table.
4. **Computational Data-Viz Audit**:
   Run `scripts/audit-dataviz.mjs` against the source directory:
   ```bash
   node scripts/audit-dataviz.mjs ./src
   ```
   Verifies `tabular-nums`, direct annotations (`annotation` / callout nodes), OKLCH color scales, accessible SVG `role="img"` + `aria-label`, and absence of generic rainbow/pie slop.
5. **Visual Loop**: Capture desktop (`1440x900`) and mobile (`390x844`) screenshots, verify label legibility (no overlapping text callouts), and log in `history.md`.
