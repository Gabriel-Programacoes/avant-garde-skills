#!/usr/bin/env node
/**
 * Procedural Sonic & Haptics Constraint Deck (Zero-Dependency)
 * Usage:
 *   node sonic-constraints.mjs [count] [--domain <hardware|daylight|mobile|editorial>]
 *   node sonic-constraints.mjs test
 */

import assert from 'node:assert/strict';
import path from 'node:path';

export const SONIC_CONSTRAINTS = [
  {
    id: 'velocity-pitch-coupling',
    domains: ['hardware', 'mobile', 'daylight'],
    title: 'Velocity-Coupled Detent Pitch',
    rule: 'Scrubbing or stepping through values must modulate oscillator frequency (Hz) proportionally to pointer/step velocity while updating a live tabular-nums Hz readout.',
  },
  {
    id: 'live-adsr-oscilloscope',
    domains: ['hardware', 'daylight', 'editorial'],
    title: 'Real-Time Envelope & Waveform Telemetry',
    rule: 'Every acoustic trigger must render its real-time ADSR decay curve and harmonic waveform on a HiDPI Canvas or precision SVG scope so sound is visually inspectable even when muted.',
  },
  {
    id: 'zero-pill-ledger-telemetry',
    domains: ['hardware', 'daylight', 'mobile', 'editorial'],
    title: 'Architectural Acoustic Ledger (Zero Pill Badges)',
    rule: 'Display frequency (Hz), decay time (ms), filter cutoff, and gain (dBFS) in naked monospace ledger columns separated by 1px hairline rules—never inside rounded-full pastel capsules.',
  },
  {
    id: 'hardware-mute-interlock',
    domains: ['hardware', 'daylight', 'mobile', 'editorial'],
    title: 'Physical Master Mute Interlock & Visual Fallback',
    rule: 'Provide an explicit keyboard-accessible Master Mute switch ([M]) that cleanly bypasses Web Audio output while preserving 100% of visual spring recoil and haptic telemetry.',
  },
];

export function drawSonicConstraints(count = 2, domain = '') {
  const pool = domain
    ? SONIC_CONSTRAINTS.filter((c) => c.domains.includes(domain.toLowerCase()))
    : SONIC_CONSTRAINTS;
  const activePool = pool.length >= count ? pool : SONIC_CONSTRAINTS;
  const shuffled = [...activePool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, Math.min(count, shuffled.length)));
}

function runTests() {
  const drawn = drawSonicConstraints(2, 'hardware');
  assert.equal(drawn.length, 2, 'Should draw 2 sonic constraints');
  assert.ok(drawn.every((c) => c.id && c.rule), 'Constraints must have id and rule');
  console.log('PASS: sonic-constraints.mjs self-tests passed.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const args = process.argv.slice(2);
  if (args[0] === 'test') {
    runTests();
    process.exit(0);
  }
  const count = Number.isInteger(Number(args[0])) ? Number(args[0]) : 2;
  const domIdx = args.indexOf('--domain');
  const domain = domIdx >= 0 ? args[domIdx + 1] : '';
  const selected = drawSonicConstraints(count, domain);
  console.log(`DRAWN SONIC-HAPTIC CONSTRAINTS (${selected.length}):`);
  for (const c of selected) {
    console.log(`- [${c.id}] ${c.title}: ${c.rule}`);
  }
}
