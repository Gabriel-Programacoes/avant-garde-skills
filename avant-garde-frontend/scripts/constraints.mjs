#!/usr/bin/env node
// Draws creative constraints to elevate a design beyond generic AI templates while respecting usability.
// Default mode draws usability-safe, high-beauty studio craft rules (ideal for "clean and modern" / "uma tela bonita e moderna").
// Pass `--wild` for experimental/avant-garde art-direction rules that break web conventions.
// Usage: node constraints.mjs [count=2] [--domain saas|ecommerce|editorial|portfolio|wellness] [--wild] | test

const CRAFT_DECK = {
  layout: [
    'Asymmetric Bento Architecture: combine 1 dominant hero showcase card (60% width) with 2 compact live-metric or interactive utility cards (40% width); never use 3 equal cards in a row.',
    'Editorial Split-Stage: sticky narrative & action column on one side paired with a live interactive preview, simulator, or visual stage on the other.',
    'Tactile Card Elevation: use warm layered surfaces (paper -> raised card -> recessed input well) separated by crisp 1px borders and subtle specular highlights.',
    'Rhythmic Alternation: alternate between expansive high-breathing-room hero moments and dense, scannable specification strips.',
  ],
  color: [
    'Sunlit Architectural Daylight: warm alabaster/stone background (`oklch(97% 0.008 80)`), deep espresso/slate ink, and 1 rich botanical, terracotta, or cobalt signature accent.',
    'Tinted Neutral Harmony: zero pure white (#fff) or pure gray (#888); tint every background, border, and muted text token with 1-2% chroma of the brand hue.',
    'Refractive Surface Accents: pair solid warm matte surfaces with 1 translucent optical-glass floating dock or badge (`backdrop-filter: blur(16px) saturate(180%)` + 1px inner top highlight).',
    'Soft Dual-Tone Contrast: pair a calm, low-chroma atmospheric base with 1 high-contrast dark card that anchors the primary call-to-action or simulator.',
  ],
  type: [
    'Editorial & Modern Sans Pairing: pair an expressive high-contrast serif (`Instrument Serif` or `Fraunces`) for emotional keywords with a crisp geometric sans (`Plus Jakarta Sans` or `Satoshi`) for UI controls.',
    'Numbers as Hero Evidence: set key metrics, prices, durations, or ratings in oversized `tabular-nums` display type with unit superscripts.',
    'Micro-Label Precision: frame sections with crisp `11px` uppercase tracked labels (`01 // OVERVIEW`) and hairline dividers.',
  ],
  interaction: [
    'Live Interactive Utility Above the Fold: include a working interactive simulator, configurator, estimator, or filterable preview right in the hero — never just static text + button.',
    'Tactile Micro-Feedback: buttons and cards respond with immediate `<150ms` spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`) and subtle physical press compression.',
    'Segmented Pill Switcher: allow the user to toggle views, plans, or scenarios in place with an animated sliding pill indicator.',
  ],
};

const WILD_DECK = {
  layout: [
    'Navigation is horizontal: the whole site scrolls sideways.',
    'Everything sits on a single fixed canvas; content changes in place, the page never scrolls.',
    'Use a 13-column grid and break it at least once per section.',
    'Content lives in the margins; the center of the screen stays mostly empty.',
    'The layout imitates a physical object (ticket, newspaper, dossier, scoreboard, label).',
  ],
  color: [
    'Only 2 colors, no tints. Hierarchy comes from scale and weight.',
    'Monochrome page; color appears only on interaction.',
    'Invert expectations: dark text on a saturated, bright background everywhere.',
  ],
  type: [
    'One typeface only, used in at least 4 extreme sizes.',
    'Text is set vertically or rotated in at least one key section.',
    'Mix a monospace with a high-contrast serif; no sans-serif at all.',
  ],
  interaction: [
    'Motion is mechanical: steps, snaps and stops instead of smooth easing.',
    'Every transition uses a mask or clip-path; no fades.',
    'The cursor is the main actor: it reveals, distorts or paints content.',
  ],
};

const rand = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
const pick = (arr) => arr[rand(arr.length)];

function draw(count = 2, wild = false) {
  const deck = wild ? WILD_DECK : CRAFT_DECK;
  const axes = Object.keys(deck);
  for (let i = axes.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [axes[i], axes[j]] = [axes[j], axes[i]];
  }
  const n = Math.min(axes.length, Math.max(1, count));
  return axes.slice(0, n).map((axis) => ({ axis, text: pick(deck[axis]) }));
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  const defaultDraws = Array.from({ length: 25 }, () => draw(4, false)).flat();
  if (defaultDraws.some((d) => d.text.includes('scrolls sideways'))) {
    throw new Error('FAIL: default craft mode leaked wild sideways scroll');
  }
  const wildDraws = Array.from({ length: 25 }, () => draw(4, true)).flat();
  if (!wildDraws.some((d) => d.text.includes('sideways') || d.text.includes('2 colors'))) {
    throw new Error('FAIL: wild mode did not draw wild deck');
  }
  console.log('All constraint checks passed (craft default + wild mode).');
  process.exit(0);
}

const wild = args.includes('--wild');
const domainIdx = args.indexOf('--domain');
const numArg = args.find((a, i) => !a.startsWith('--') && (domainIdx === -1 || i !== domainIdx + 1));
const count = +(numArg || 2);

for (const { axis, text } of draw(count, wild)) {
  console.log(`[${axis}] ${text}`);
}
