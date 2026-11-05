#!/usr/bin/env node
// Generates creative constraints tailored for desktop software & webview interfaces.
// Usage: node desktop-constraints.mjs [count=3] [--domain audio|devtool|cad|analytics|writing] | test

const DECK = {
  window_chrome: [
    { text: 'Unified titlebar: search/command bar is integrated directly into the window drag area.', domains: ['all'] },
    { text: 'Frameless floating HUD: compact utility window that floats on top, no traditional titlebar.', domains: ['audio', 'devtool'] },
    { text: 'Statusbar-centric: key status, telemetry and workspace switchers live in a dense, live bottom bar.', domains: ['all'] },
    { text: 'Sidebar with collapsible iconography + shortcut hints; no text labels until expanded or hovered.', domains: ['all'] },
    { text: 'Two-pane split with a magnetic, auto-snapping draggable divider; no floating modals.', domains: ['all'] },
    { text: 'Full canvas mode: zero window chrome visible; controls appear only on hotkey or edge trigger.', domains: ['cad', 'writing', 'audio'] },
  ],
  density_layout: [
    { text: 'Ultra-compact studio density (24px row heights, 11px micro-type, zero whitespace waste).', domains: ['audio', 'devtool', 'analytics', 'cad'] },
    { text: 'Master-Detail with instant preview: selecting an item updates the pane with zero loading state.', domains: ['devtool', 'writing', 'analytics'] },
    { text: 'Modular card rack: panels can be rearranged, minimized to titlebars or torn off like audio gear.', domains: ['audio', 'cad', 'analytics'] },
    { text: 'Monospace data grid: tabular layout with custom column reordering and numeric scrubbers.', domains: ['devtool', 'analytics', 'audio'] },
    { text: 'Focus canvas: one massive workspace item in the center, tools docked as thin perimeter rulers.', domains: ['cad', 'writing', 'audio'] },
  ],
  interaction_keyboard: [
    { text: '100% keyboard-navigable: every action has a vim-like chord or single-key shortcut shown in micro-badges.', domains: ['all'] },
    { text: 'Command palette (Cmd/Ctrl+K) is the primary launcher; menus are secondary fallback.', domains: ['all'] },
    { text: 'Numeric scrubbers: click and drag horizontally on any number input to adjust value with cursor lock.', domains: ['audio', 'cad', 'analytics', 'devtool'] },
    { text: 'Zero modal dialogs: confirmations and alerts are inline badges or statusbar prompts.', domains: ['all'] },
    { text: 'Contextual radial or floating quick-action pill at cursor position on right-click / middle-click.', domains: ['cad', 'audio', 'devtool'] },
    { text: 'Spatial navigation: arrow keys move focus spatially across grid and panes.', domains: ['all'] },
  ],
  motion_performance: [
    { text: 'Sub-150ms spring physics only: interactions feel immediate, zero decorative lag.', domains: ['all'] },
    { text: 'Hardware-idle zero: all render loops, canvas repaints, and timers freeze completely when window is unfocused.', domains: ['all'] },
    { text: 'Zero crossfade transitions: UI state swaps are instantaneous; feedback is given via micro-glow or border flash.', domains: ['all'] },
    { text: 'Physical tactile feel: active buttons visually depress 1px with subtle inner bevel change.', domains: ['audio', 'cad', 'devtool'] },
    { text: 'Sound & haptic companion: optional synthesized micro-clicks (Web Audio API) for switches and dials.', domains: ['audio', 'cad'] },
  ],
  visual_style: [
    { text: 'Teenage Engineering / Hardware Laboratory: matte graphite surfaces, segmented LED fonts, safety-orange utility accents.', domains: ['audio', 'cad', 'devtool'] },
    { text: 'Hyper-Productivity Monolith (Linear/Zed aesthetic): deep obsidian backgrounds, 1px razor borders, high-contrast crisp text.', domains: ['devtool', 'analytics', 'writing'] },
    { text: 'Industrial CAD / Blueprint: subtle coordinate rulers, crosshairs on hover, technical mono annotations.', domains: ['cad', 'analytics', 'devtool'] },
    { text: 'Paper & Slate Studio: warm off-black background, etched subtle borders, editorial serif display for project names with mono data.', domains: ['writing', 'analytics'] },
    { text: 'Cyber-Terminal / Amber Phosphor: monochrome dark with glowing amber/emerald monochromatic data channels.', domains: ['devtool', 'analytics', 'audio'] },
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
  const writingDraws = Array.from({ length: 25 }, () => draw(5, 'writing')).flat();
  if (writingDraws.some((d) => d.text.includes('Teenage Engineering'))) throw new Error('FAIL: writing domain leaked hardware lab style');
  console.log('All desktop-constraint checks passed.');
  process.exit(0);
}

const domainIdx = args.indexOf('--domain');
const domain = domainIdx !== -1 && args[domainIdx + 1] ? args[domainIdx + 1].toLowerCase() : 'all';
const numArg = args.find((a, i) => !a.startsWith('--') && (domainIdx === -1 || i !== domainIdx + 1));
const count = +(numArg || 3);

for (const { axis, text } of draw(count, domain)) {
  console.log(`[${axis}] ${text}`);
}
