#!/usr/bin/env node
/**
 * Computational Auditor for Avant-Garde Sonic & Haptics (Zero-Dependency)
 * Verifies procedural Web Audio & tactile UI craft:
 *   1. No JSX `class=` bugs
 *   2. No AI "Pill / Badge Bubble Soup" (`anti-slop-pill-badge`)
 *   3. No un-ramped oscillator clicks (`missing-envelope-ramp`)
 *   4. No external `.mp3`/`.wav` bloat for UI micro-feedback (`raw-audio-asset-bloat`)
 *   5. Mandatory Master Mute control (`missing-mute-control`)
 *   6. Mandatory `tabular-nums` & Living Motion (`static-dead-ui` + `prefers-reduced-motion`)
 *   7. Multi-screen continuity via `design-lock.mjs`
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { verifyProjectContinuity } from './design-lock.mjs';

export function auditSonicSource(content, filename = 'combined.bundle') {
  const issues = [];
  const isTsx = /\.(tsx|jsx)$/.test(filename);

  if (isTsx && /\sclass=["']/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'jsx-class-attr',
      msg: `${path.basename(filename)}: Found HTML 'class=' in JSX/TSX; use 'className='.`,
    });
  }

  if (filename !== 'combined.bundle') return issues;

  // 1. Ban AI "Pastel Pill / Badge Soup"
  const pillBadgeClasses = /\b(eyebrow-pill|brand-tag|status-pill|grounding-pill|risk-badge|doc-badge)\b/i.test(content);
  const lozengeRadiusCount = (content.match(/border-radius:\s*9999?px/g) || []).length;
  if (pillBadgeClasses || lozengeRadiusCount >= 1) {
    issues.push({
      severity: 'error',
      rule: 'anti-slop-pill-badge',
      msg: `Detected AI "Pill/Badge Soup" (${lozengeRadiusCount} lozenge 999px rules). Use architectural 1px hairline ledgers and 6px square indicators instead of pastel rounded-full capsules.`,
    });
  }

  // 2. Check Web Audio API Procedural Synthesis & Envelope Ramping
  if (!/(AudioContext|webkitAudioContext|createOscillator|createBiquadFilter)/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'missing-web-audio-synth',
      msg: 'No procedural Web Audio API synthesis (AudioContext / createOscillator / createBiquadFilter) detected.',
    });
  }
  if (/createOscillator/.test(content) && !/(exponentialRampToValueAtTime|linearRampToValueAtTime|setTargetAtTime)/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'missing-envelope-ramp',
      msg: 'Oscillator created without gain/frequency envelope ramping (exponentialRampToValueAtTime). Causes audible speaker clicks.',
    });
  }

  // 3. Ban external MP3/WAV bloat for UI micro-feedback
  if (/\.(mp3|wav|ogg)["')]/i.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'raw-audio-asset-bloat',
      msg: 'External audio file (.mp3/.wav) detected. Prefer zero-asset procedural Web Audio synthesis for sub-15ms tactile response.',
    });
  }

  // 4. Mandatory Mute Interlock & Tabular Readouts
  if (!/(mute|muted|som\s*\[|audio\s*\[)/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'missing-mute-control',
      msg: 'Missing user-accessible Mute / Audio Interlock control.',
    });
  }
  if (!/tabular-nums/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'missing-tabular-nums',
      msg: 'Missing `tabular-nums` for jitter-free Hz, ms, and dBFS acoustic readouts.',
    });
  }
  if (!/oklch\(/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'oklch-tokens',
      msg: 'Missing OKLCH color tokens.',
    });
  }

  // 5. Living Motion & Tactile States
  const hasMotion = /(@keyframes|\.animate\(|requestAnimationFrame)/.test(content);
  const hasTactile = /(:hover|:active|hover:|active:|onPointerDown)/.test(content);
  if (!hasMotion || !hasTactile) {
    issues.push({
      severity: 'error',
      rule: 'static-dead-ui',
      msg: 'Interface lacks living motion (@keyframes, WAAPI .animate, or rAF oscilloscope) or tactile :hover/:active states.',
    });
  }
  if (hasMotion && !/prefers-reduced-motion/.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'reduced-motion',
      msg: 'Animations used without `prefers-reduced-motion` guard.',
    });
  }

  return issues;
}

function collectFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const out = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else if (/\.(tsx|jsx|ts|js|css|html)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function runSelfTests() {
  const badSonic = `
    <div style="border-radius: 999px" class="status-pill">
      <script>const ctx = new AudioContext(); const o = ctx.createOscillator(); o.start();</script>
    </div>`;
  const badIssues = auditSonicSource(badSonic, 'combined.bundle');
  assert.ok(badIssues.some((i) => i.rule === 'anti-slop-pill-badge'), 'Catches pill badge soup');
  assert.ok(badIssues.some((i) => i.rule === 'missing-envelope-ramp'), 'Catches un-ramped oscillator click');
  assert.ok(badIssues.some((i) => i.rule === 'missing-mute-control'), 'Catches missing mute control');

  const goodSonic = `
    <style>
      :root { --bg: oklch(96% 0.008 82); }
      @keyframes pulse { 0% { opacity: 1; } 100% { opacity: 0.4; } }
      .pad:hover { transform: translateY(-1px); }
      .pad:active { transform: scale(0.97); }
      @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
    </style>
    <main className="tabular-nums">
      <button>SOM [ON] · Mute</button>
      <script>
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      </script>
    </main>`;
  const goodIssues = auditSonicSource(goodSonic, 'combined.bundle');
  assert.equal(goodIssues.length, 0, 'Clean procedural sonic studio should pass with 0 issues');
  console.log('PASS: audit-sonic.mjs self-tests passed.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const target = process.argv[2];
  if (target === 'test') {
    runSelfTests();
    process.exit(0);
  }
  if (!target) {
    console.log('Usage: node audit-sonic.mjs <dir|file|test>');
    process.exit(1);
  }
  const files = collectFiles(target);
  const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  let issues = auditSonicSource(combined, 'combined.bundle');
  for (const f of files) {
    issues.push(...auditSonicSource(fs.readFileSync(f, 'utf8'), f));
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory() && fs.existsSync(path.join(target, '.ui-design-lock.json'))) {
    const lockCheck = verifyProjectContinuity(target);
    for (const li of lockCheck.issues) {
      issues.push({ severity: li.severity.toLowerCase(), rule: li.rule, msg: `${li.file || ''}: ${li.message}` });
    }
  }
  issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];
  if (issues.length === 0) {
    console.log('PASS (sonic-haptics mode): 0 issues found.');
  } else {
    for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
    if (issues.some((i) => i.severity === 'error')) process.exit(1);
  }
}
