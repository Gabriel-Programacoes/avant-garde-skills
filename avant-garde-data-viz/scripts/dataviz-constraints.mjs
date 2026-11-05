#!/usr/bin/env node
// Draws creative constraints for data visualization, scientific plotting, and telemetry interfaces.
// Usage: node dataviz-constraints.mjs [count=3] [--domain editorial|telemetry|scientific|financial] | test

const DECK = {
  chart_form: [
    { text: 'Overlapping ridgeline (Joyplot) distributions comparing density across cohorts or time.', domains: ['editorial', 'scientific', 'telemetry'] },
    { text: 'Horizon chart or P10/P50/P90 confidence fan with direct threshold breach markers.', domains: ['telemetry', 'financial', 'scientific'] },
    { text: 'Small multiples grid: at least 6 synchronized micro-charts sharing the exact same axes.', domains: ['all'] },
    { text: 'Bespoke multivariate Feltron glyphs: each data entity rendered as a custom radial/geometric symbol.', domains: ['editorial', 'scientific'] },
    { text: 'Marimekko / variable-width spine plot or Cleveland dot-and-range plot (zero standard bar charts).', domains: ['editorial', 'financial', 'scientific'] },
  ],
  annotation_layer: [
    { text: 'Zero separate legend boxes: every series is labeled directly at the end of its line or geometry.', domains: ['all'] },
    { text: 'Direct anomaly callouts: at least 3 leader-line annotations explaining specific peaks or structural breaks.', domains: ['all'] },
    { text: 'Shaded regime bands: vertical or horizontal background spans marking historical eras or SLA zones.', domains: ['editorial', 'financial', 'telemetry'] },
    { text: 'Statistical reference overlay: mean, median, and ±2σ standard deviation lines drawn directly on canvas.', domains: ['scientific', 'telemetry', 'financial'] },
  ],
  table_integration: [
    { text: 'Inline spark-matrix: data table where every row embeds an SVG sparkline, barcode distribution, or delta bar.', domains: ['all'] },
    { text: 'Marginal histograms: X and Y axes include compact distribution histograms along the plot borders.', domains: ['scientific', 'telemetry', 'financial'] },
    { text: 'Headline as live equation: the main title embeds dynamic tabular numbers that update as the user scrubs.', domains: ['all'] },
  ],
  color_encoding: [
    { text: 'Focal + Context hierarchy: 1 high-chroma OKLCH focal series against muted monochrome context series.', domains: ['all'] },
    { text: 'Perceptual diverging OKLCH scale: neutral paper/slate midpoint with balanced Cobalt vs Vermilion extremes.', domains: ['scientific', 'editorial', 'financial'] },
    { text: 'Bivariate 2D color matrix: encode two variables simultaneously (e.g. volume × volatility) via OKLCH L and H.', domains: ['scientific', 'financial', 'telemetry'] },
  ],
  interaction_scrub: [
    { text: 'Synchronized crosshair scrubbing: hovering any point updates all small multiples and table rows simultaneously.', domains: ['all'] },
    { text: 'Interactive threshold slicer: dragging a horizontal reference line re-classifies anomalies in real time.', domains: ['telemetry', 'financial', 'scientific'] },
    { text: 'Cohort baseline re-indexing: clicking any date/point re-indexes all series to 100% (or 0Δ) at that moment.', domains: ['financial', 'editorial', 'scientific'] },
  ],
};

const rand = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
const pick = (arr) => arr[rand(arr.length)];

function draw(count = 3, domain = 'all') {
  const axes = Object.keys(DECK);
  for (let i = axes.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [axes[i], axes[j]] = [axes[j], axes[i]];
  }
  const n = Math.min(axes.length, Math.max(1, count));
  return axes.slice(0, n).map((axis) => {
    const pool = DECK[axis].filter((item) => domain === 'all' || item.domains.includes('all') || item.domains.includes(domain));
    return { axis, text: pick(pool.length ? pool : DECK[axis]).text };
  });
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  const draws = Array.from({ length: 20 }, () => draw(4, 'financial')).flat();
  if (draws.some((d) => d.text.includes('Feltron glyphs'))) throw new Error('FAIL: financial domain leaked Feltron glyphs');
  console.log('All dataviz-constraint checks passed.');
  process.exit(0);
}

const domainIdx = args.indexOf('--domain');
const domain = domainIdx !== -1 && args[domainIdx + 1] ? args[domainIdx + 1].toLowerCase() : 'all';
const numArg = args.find((a, i) => !a.startsWith('--') && (domainIdx === -1 || i !== domainIdx + 1));
const count = +(numArg || 3);

for (const { axis, text } of draw(count, domain)) {
  console.log(`[${axis}] ${text}`);
}
