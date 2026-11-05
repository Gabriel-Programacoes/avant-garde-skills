#!/usr/bin/env node
// Draws creative constraints for WebGL shaders, procedural graphics, and motion choreography.
// Usage: node shader-constraints.mjs [count=3] [--domain editorial|brutalist|luxury|cyber|audio] | test

const DECK = {
  shader_technique: [
    { text: 'Raymarched SDF boolean sculpture: at least 2 primitives blended via smooth minimum (smin).', domains: ['all'] },
    { text: 'Nested domain warping: fbm(p + fbm(p + u_time)) creating liquid mercury or ink contours.', domains: ['editorial', 'luxury', 'cyber', 'audio'] },
    { text: 'Topographic isolines: slice a 3D scalar field into razor-sharp anti-aliased elevation rings (fwidth/smoothstep).', domains: ['editorial', 'brutalist', 'cyber', 'audio'] },
    { text: 'Voronoi cellular refraction: faceted crystalline tiles that tilt normals toward the pointer.', domains: ['luxury', 'cyber', 'editorial'] },
    { text: 'Harmonic interference field: overlapping wave sources that form dynamic Moiré patterns.', domains: ['brutalist', 'audio', 'editorial'] },
  ],
  post_fx: [
    { text: 'Ordered Bayer 4x4 or 8x8 dithering matrix quantizing luminance into crisp graphic steps.', domains: ['brutalist', 'editorial', 'cyber', 'audio'] },
    { text: 'Chromatic dispersion: RGB channels split along the surface normal or pointer velocity vector.', domains: ['cyber', 'luxury', 'audio'] },
    { text: 'Halftone dot screen: luminance mapped to rotated procedural circle grids.', domains: ['editorial', 'brutalist'] },
    { text: 'Tactile film grain + subtle vignette computed procedurally per frame in fragment shader.', domains: ['luxury', 'editorial', 'all'] },
    { text: 'CRT scanline phosphor mask with sub-pixel aperture grille modulation.', domains: ['cyber', 'audio', 'brutalist'] },
  ],
  trigger_input: [
    { text: 'Damped pointer velocity: shader intensity and dispersion scale with cursor speed, settling when still.', domains: ['all'] },
    { text: 'Click shockwave impulse: clicking injects an expanding ring wave that deforms the field.', domains: ['all'] },
    { text: 'Scroll-scrubbed camera/morph: scrolling morphs the SDF geometry or camera elevation angle.', domains: ['editorial', 'luxury', 'brutalist'] },
    { text: 'Harmonic oscillator presets: interactive frequency switches (Hz/mode) alter the mathematical field.', domains: ['audio', 'cyber', 'brutalist', 'editorial'] },
  ],
  color_light: [
    { text: 'OKLCH duotone in GLSL: shader maps field strictly between 2 exact OKLCH tokens + 1 signal highlight.', domains: ['all'] },
    { text: 'Fresnel rim lighting on dark obsidian: near-black core with high-chroma grazing edge glow.', domains: ['luxury', 'cyber', 'audio'] },
    { text: 'High-key architectural paper: bright warm background where the shader draws dark ink/blueprint lines.', domains: ['editorial', 'brutalist'] },
    { text: 'Iridescent thin-film phase shift controlled by surface angle and pointer proximity.', domains: ['luxury', 'cyber'] },
  ],
  choreography: [
    { text: 'DOM-Shader synchronicity: HTML typography overlays use mix-blend-mode or shared CSS/GLSL coordinate alignment.', domains: ['all'] },
    { text: 'Spring-loaded magnetic HUD controls floating over the WebGL stage with live shader uniform readouts.', domains: ['all'] },
    { text: 'Clip-path geometric mask wipe when switching between shader presets or chapters.', domains: ['editorial', 'luxury', 'brutalist'] },
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
  const luxuryDraws = Array.from({ length: 25 }, () => draw(5, 'luxury')).flat();
  if (luxuryDraws.some((d) => d.text.includes('CRT scanline'))) throw new Error('FAIL: luxury domain leaked CRT scanline');
  console.log('All shader-constraint checks passed.');
  process.exit(0);
}

const domainIdx = args.indexOf('--domain');
const domain = domainIdx !== -1 && args[domainIdx + 1] ? args[domainIdx + 1].toLowerCase() : 'all';
const numArg = args.find((a, i) => !a.startsWith('--') && (domainIdx === -1 || i !== domainIdx + 1));
const count = +(numArg || 3);

for (const { axis, text } of draw(count, domain)) {
  console.log(`[${axis}] ${text}`);
}
