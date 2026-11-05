#!/usr/bin/env node
// Zero-dependency OKLCH + WCAG 2 + APCA palette helper for avant-garde skills.
// Usage:
//   node palette.mjs ramp <color> [name] [--neutral]   11-step ramp as CSS vars
//   node palette.mjs surfaces <color> [--light]        Desktop elevation & border tokens
//   node palette.mjs mix <colorA> <colorB> [steps]     OKLCH blend (bridge tones)
//   node palette.mjs contrast <fg> <bg>                WCAG 2 ratio + APCA Lc
//   node palette.mjs info <color>                      hex, oklch, sRGB gamut
//   node palette.mjs test                              self-check
// <color> = #rgb | #rrggbb | "oklch(62% 0.21 28)"

const cbrt = Math.cbrt;
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((x) => x + x).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Invalid hex: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function rgbToOklch([r, g, b]) {
  [r, g, b] = [r, g, b].map(toLin);
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = C < 1e-4 ? 0 : (Math.atan2(B, A) * 180 / Math.PI + 360) % 360;
  return { L, C, H };
}

// Returns gamma-encoded sRGB, possibly outside [0,1].
function oklchToRgb({ L, C, H }) {
  const a = C * Math.cos(H * Math.PI / 180);
  const b = C * Math.sin(H * Math.PI / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLin);
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

// Reduce chroma (keep L and H) until the color fits sRGB.
function toGamut(c) {
  if (inGamut(oklchToRgb(c))) return { ...c, clamped: false };
  let lo = 0, hi = c.C;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb({ ...c, C: mid }))) lo = mid; else hi = mid;
  }
  return { ...c, C: lo, clamped: true };
}

const rgbToHex = (rgb) =>
  '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');

function parse(input) {
  const s = String(input).trim();
  if (s.startsWith('#')) return rgbToOklch(hexToRgb(s));
  const m = s.match(/oklch\(\s*([\d.]+)(%?)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (!m) throw new Error(`Unsupported color: ${input} (use #hex or oklch(L% C H))`);
  return { L: m[2] ? +m[1] / 100 : +m[1], C: +m[3], H: +m[4] };
}

const fmt = ({ L, C, H }) => `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`;
const hexOf = (c) => rgbToHex(oklchToRgb(toGamut(c)));

function luminance(c) {
  const [r, g, b] = oklchToRgb(toGamut(c)).map((x) => toLin(Math.min(1, Math.max(0, x))));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

// APCA-W3 (0.0.98G-4g) perceptual contrast (Lc: -108 to +106).
function apcaContrast(fg, bg) {
  const toY = (c) => {
    const [r, g, b] = oklchToRgb(toGamut(c)).map((x) => Math.min(1, Math.max(0, x)) ** 2.4);
    const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
  };
  const yTxt = toY(fg);
  const yBg = toY(bg);
  if (Math.abs(yBg - yTxt) < 0.0005) return 0;
  const sapc = yBg > yTxt
    ? (yBg ** 0.56 - yTxt ** 0.57) * 1.14
    : (yBg ** 0.65 - yTxt ** 0.62) * 1.14;
  if (Math.abs(sapc) < 0.1) return 0;
  return (sapc > 0 ? sapc - 0.027 : sapc + 0.027) * 100;
}

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMP_L = [0.97, 0.93, 0.87, 0.79, 0.7, 0.61, 0.52, 0.44, 0.36, 0.27, 0.2];
const RAMP_C = [0.12, 0.25, 0.5, 0.75, 0.92, 1, 0.95, 0.85, 0.7, 0.55, 0.4];

function ramp(base, neutral = false) {
  const C = neutral ? Math.min(base.C, 0.02) : base.C;
  return STEPS.map((step, i) => ({ step, ...toGamut({ L: RAMP_L[i], C: C * RAMP_C[i], H: base.H }) }));
}

function surfaces(base, light = false) {
  const H = base.H;
  const spec = light
    ? [
        ['surface-sunken', 0.93, 0.008],
        ['surface-canvas', 0.965, 0.006],
        ['surface-panel', 0.985, 0.004],
        ['surface-raised', 1.0, 0.0],
        ['surface-overlay', 1.0, 0.002],
        ['border-subtle', 0.88, 0.01],
        ['border-strong', 0.76, 0.016],
        ['text-primary', 0.16, 0.012],
        ['text-secondary', 0.42, 0.015],
        ['text-tertiary', 0.58, 0.012],
        ['text-disabled', 0.72, 0.008],
      ]
    : [
        ['surface-sunken', 0.11, 0.006],
        ['surface-canvas', 0.14, 0.008],
        ['surface-panel', 0.17, 0.01],
        ['surface-raised', 0.21, 0.012],
        ['surface-overlay', 0.26, 0.015],
        ['border-subtle', 0.24, 0.012],
        ['border-strong', 0.34, 0.02],
        ['text-primary', 0.96, 0.005],
        ['text-secondary', 0.76, 0.014],
        ['text-tertiary', 0.55, 0.014],
        ['text-disabled', 0.36, 0.01],
      ];
  const tokens = Object.fromEntries(spec.map(([k, L, C]) => [k, toGamut({ L, C, H })]));
  tokens['accent-primary'] = toGamut({ L: Math.max(0.62, Math.min(0.74, base.L)), C: Math.max(0.16, base.C), H });
  tokens['accent-hover'] = toGamut({ L: Math.min(0.82, tokens['accent-primary'].L + 0.06), C: tokens['accent-primary'].C * 0.92, H });
  tokens['accent-active'] = toGamut({ L: Math.max(0.48, tokens['accent-primary'].L - 0.06), C: tokens['accent-primary'].C * 1.05, H });
  return tokens;
}

function mix(a, b, t) {
  let ha = a.H, hb = b.H;
  if (a.C < 0.01) ha = hb;
  if (b.C < 0.01) hb = ha;
  let d = hb - ha;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return { L: a.L + (b.L - a.L) * t, C: a.C + (b.C - a.C) * t, H: (ha + d * t + 360) % 360 };
}

function test() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`FAIL: ${msg}`); };
  assert(Math.abs(contrast(parse('#000'), parse('#fff')) - 21) < 0.01, 'black/white = 21');
  assert(Math.abs(apcaContrast(parse('#000'), parse('#fff'))) > 100, 'APCA black on white > 100');
  assert(Math.abs(apcaContrast(parse('#fff'), parse('#000'))) > 100, 'APCA white on black > 100');
  const red = parse('#ff0000');
  assert(Math.abs(red.L - 0.628) < 0.002 && Math.abs(red.C - 0.2577) < 0.002 && Math.abs(red.H - 29.23) < 0.1, 'red oklch');
  for (const h of ['#e63946', '#0a0a0a', '#f1faee', '#1d3557']) assert(hexOf(parse(h)) === h, `roundtrip ${h}`);
  assert(toGamut(parse('oklch(88% 0.4 120)')).clamped, 'out-of-gamut clamps');
  assert(ramp(red).every((s) => inGamut(oklchToRgb(s))), 'ramp in gamut');
  const surf = surfaces(parse('#10b981'));
  assert(contrast(surf['text-primary'], surf['surface-panel']) >= 10, 'surface primary text contrast >= 10');
  assert(contrast(surf['text-secondary'], surf['surface-panel']) >= 4.5, 'surface secondary text contrast >= 4.5');
  assert(hexOf(mix(parse('#ff0000'), parse('#0000ff'), 0)) === '#ff0000', 'mix t=0');
  console.log('All palette checks passed (WCAG2 + APCA + surfaces).');
}

const [cmd, ...args] = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const pos = args.filter((a) => !a.startsWith('--'));

try {
  if (cmd === 'ramp') {
    const name = pos[1] || 'color';
    for (const s of ramp(parse(pos[0]), flags.includes('--neutral')))
      console.log(`--${name}-${s.step}: ${fmt(s)}; /* ${hexOf(s)}${s.clamped ? ' chroma clamped to sRGB' : ''} */`);
  } else if (cmd === 'surfaces') {
    const t = surfaces(parse(pos[0] || '#10b981'), flags.includes('--light'));
    const panel = t['surface-panel'];
    for (const [k, v] of Object.entries(t)) {
      const ratioNote = k.startsWith('text-')
        ? ` — ${contrast(v, panel).toFixed(1)}:1 (Lc ${Math.abs(apcaContrast(v, panel)).toFixed(0)}) on panel`
        : '';
      console.log(`--${k}: ${fmt(v)}; /* ${hexOf(v)}${ratioNote} */`);
    }
  } else if (cmd === 'mix') {
    const [a, b] = [parse(pos[0]), parse(pos[1])];
    const n = Math.max(3, +(pos[2] || 5));
    for (let i = 0; i < n; i++) {
      const c = toGamut(mix(a, b, i / (n - 1)));
      console.log(`${Math.round((i / (n - 1)) * 100)}%  ${fmt(c)}  ${hexOf(c)}`);
    }
  } else if (cmd === 'contrast') {
    const fg = parse(pos[0]), bg = parse(pos[1]);
    const r = contrast(fg, bg);
    const lc = apcaContrast(fg, bg);
    const absLc = Math.abs(lc);
    console.log(
      `WCAG ${r.toFixed(2)}:1 (AA text ${r >= 4.5 ? 'PASS' : 'FAIL'}, UI ${r >= 3 ? 'PASS' : 'FAIL'}, AAA ${r >= 7 ? 'PASS' : 'FAIL'}) | ` +
      `APCA Lc ${lc.toFixed(1)} (body ${absLc >= 75 ? 'PASS' : absLc >= 60 ? 'LARGE/SUB' : 'FAIL'}, UI/spot ${absLc >= 45 ? 'PASS' : 'FAIL'})`
    );
  } else if (cmd === 'info') {
    const c = parse(pos[0]);
    const g = toGamut(c);
    console.log(`${fmt(c)}  ${hexOf(c)}  sRGB ${g.clamped ? `OUT (nearest ${fmt(g)})` : 'IN'}`);
  } else if (cmd === 'test') {
    test();
  } else {
    console.log('Commands: ramp <color> [name] [--neutral] | surfaces <color> [--light] | mix <a> <b> [steps] | contrast <fg> <bg> | info <color> | test');
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
