#!/usr/bin/env node
// Draws creative constraints for mobile apps, PWAs, and tactile pocket instruments.
// Usage: node mobile-constraints.mjs [count=3] [--domain utility|audio|optics|editorial|fitness] | test

const DECK = {
  thumb_mechanic: [
    { text: 'Knurled horizontal thumb-wheel in the bottom 30% zone that scrubs values with tick detents.', domains: ['all'] },
    { text: 'Spring-snapping bottom drawer with 3 detents (peek, half, full) and velocity flick projection.', domains: ['all'] },
    { text: '2D X/Y tactile gesture pad in the thumb zone controlling two coupled parameters simultaneously.', domains: ['audio', 'optics', 'utility'] },
    { text: 'Motorized virtual tape reel or rotary jog dial with inertia and finger-drag braking.', domains: ['audio', 'editorial', 'optics'] },
    { text: 'Segmented mechanical hardware keys (≥48px height) with physical 2px press depression and LED pips.', domains: ['audio', 'utility', 'optics', 'fitness'] },
  ],
  ergonomic_layout: [
    { text: 'Zero top-bar buttons: top 30% of screen is strictly a read-only OLED/LCD telemetry viewfinder.', domains: ['all'] },
    { text: 'One-handed thumb arc: all primary triggers sit within a 140px radius of the bottom-center bezel.', domains: ['all'] },
    { text: 'Split-bezel chassis: physical seam dividing the upper display glass from the lower tactile deck.', domains: ['audio', 'optics', 'utility'] },
    { text: 'Full-bleed instrument viewfinder with perimeter coordinate rulers and floating bottom pill.', domains: ['optics', 'fitness', 'editorial'] },
  ],
  tactile_feedback: [
    { text: 'Detent tick haptics: every discrete step fires navigator.vibrate(6) and flashes the active tick mark.', domains: ['all'] },
    { text: 'Physical mode switch: sliding a hardware latch reconfigures the entire instrument color & scale.', domains: ['all'] },
    { text: 'Hold-to-arm / long-press progressive ring fill for destructive or recording actions (zero confirm modals).', domains: ['audio', 'optics', 'fitness', 'utility'] },
  ],
  surface_finish: [
    { text: 'Anodized bead-blasted aluminum chassis with recessed dark OLED telemetry well and safety-orange accents.', domains: ['audio', 'utility', 'optics'] },
    { text: 'Pitch-black OLED (#000000) night-vision HUD with monochrome hairlines and one high-chroma signal color.', domains: ['optics', 'fitness', 'audio'] },
    { text: 'Matte bone polycarbonate shell with high-contrast black legends and color-coded mechanical caps.', domains: ['utility', 'audio', 'editorial'] },
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
  const draws = Array.from({ length: 20 }, () => draw(4, 'fitness')).flat();
  if (draws.some((d) => d.text.includes('tape reel'))) throw new Error('FAIL: fitness domain leaked tape reel');
  console.log('All mobile-constraint checks passed.');
  process.exit(0);
}

const domainIdx = args.indexOf('--domain');
const domain = domainIdx !== -1 && args[domainIdx + 1] ? args[domainIdx + 1].toLowerCase() : 'all';
const numArg = args.find((a, i) => !a.startsWith('--') && (domainIdx === -1 || i !== domainIdx + 1));
const count = +(numArg || 3);

for (const { axis, text } of draw(count, domain)) {
  console.log(`[${axis}] ${text}`);
}
