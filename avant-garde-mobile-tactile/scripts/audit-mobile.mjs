#!/usr/bin/env node
// Computational Mobile Tactile & Ergonomics Auditor for avant-garde-mobile-tactile.
// Verifies 100dvh dynamic viewport, touch-action: none, safe-area-inset, tabular-nums, user-select: none, and OKLCH tokens.
// Usage:
//   node audit-mobile.mjs <dir-or-file>
//   node audit-mobile.mjs test

import fs from 'node:fs';
import path from 'node:path';

export function auditMobileSource(content, filename = 'MobileApp.tsx') {
  const issues = [];
  const isTsx = /\.(tsx|jsx)$/.test(filename);

  if (isTsx && /\sclass=["']/.test(content)) {
    issues.push({ severity: 'error', rule: 'jsx-class-attr', msg: 'Found HTML `class=` attribute inside JSX/TSX; use `className=`.' });
  }

  // 1. Dynamic viewport height (100dvh) check
  if (!/100dvh|h-dvh|min-h-dvh/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'mobile-dvh-viewport',
      msg: 'Missing `100dvh` (`h-dvh`) dynamic viewport sizing; `100vh` clips under mobile browser toolbars.',
    });
  }

  // 2. Touch-action gesture guard check
  if (!/touch-action:\s*none|touchAction:\s*['"]none['"]|touch-none/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'mobile-touch-action',
      msg: 'Missing `touch-action: none` on tactile dials/sheets; dragging will trigger browser scroll or pull-to-refresh.',
    });
  }

  // 3. Safe-area inset check
  if (!/safe-area-inset/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'mobile-safe-area',
      msg: 'Missing `env(safe-area-inset-bottom)` / `env(safe-area-inset-top)` for notched/home-indicator devices.',
    });
  }

  // 4. Non-selectable UI chrome check
  if (!/user-select:\s*none|select-none/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'mobile-user-select',
      msg: 'Missing `user-select: none` (`select-none`) on mobile tactile controls.',
    });
  }

  // 5. Tabular numerals check
  if (!/tabular-nums/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'mobile-tabular-nums',
      msg: 'Missing `tabular-nums` on telemetry readouts and dials.',
    });
  }

  // 6. OKLCH tokens check
  if (!/oklch\(/i.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'mobile-oklch-tokens',
      msg: 'No `oklch()` color tokens detected.',
    });
  }

  return issues;
}

function collectFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const out = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else if (/\.(tsx|jsx|ts|js|css|html)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function test() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`FAIL: ${msg}`); };

  const badMobile = `<div class="h-screen">123</div>`;
  const badIssues = auditMobileSource(badMobile, 'BadMobile.tsx');
  assert(badIssues.some((i) => i.rule === 'jsx-class-attr'), 'detects class= in tsx');
  assert(badIssues.some((i) => i.rule === 'mobile-dvh-viewport'), 'detects missing 100dvh');
  assert(badIssues.some((i) => i.rule === 'mobile-touch-action'), 'detects missing touch-action: none');
  assert(badIssues.some((i) => i.rule === 'mobile-safe-area'), 'detects missing safe-area-inset');

  const goodMobile = `
    <div className="h-dvh select-none tabular-nums" style={{ touchAction: 'none', paddingBottom: 'env(safe-area-inset-bottom)', color: 'oklch(96% 0.01 90)' }}>
      24mm f/1.4
    </div>`;
  const goodIssues = auditMobileSource(goodMobile, 'GoodMobile.tsx');
  assert(goodIssues.filter((i) => i.severity === 'error').length === 0, 'clean mobile passes 0 errors');
  console.log('All audit-mobile checks passed.');
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  test();
  process.exit(0);
}

const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.log('Usage: node audit-mobile.mjs <dir|file> | test');
  process.exit(0);
}

const files = collectFiles(target);
const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
let issues = auditMobileSource(combined, 'combined.bundle');
for (const f of files) {
  for (const issue of auditMobileSource(fs.readFileSync(f, 'utf8'), f)) {
    if (issue.rule === 'jsx-class-attr') issues.push({ ...issue, msg: `${path.basename(f)}: ${issue.msg}` });
  }
}
issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];

if (issues.length === 0) {
  console.log('PASS (mobile-tactile mode): 0 issues found.');
} else {
  for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
  if (issues.some((i) => i.severity === 'error')) process.exit(1);
}
