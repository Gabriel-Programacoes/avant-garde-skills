#!/usr/bin/env node
// Computational UI & Anti-Slop Auditor for avant-garde skills.
// Supports static source auditing (zero-dep) and live URL DOM auditing (via Playwright if installed).
// Usage:
//   node audit-ui.mjs <dir-or-file> [--mode web|desktop]
//   node audit-ui.mjs <http://localhost:3000> [--mode web|desktop]
//   node audit-ui.mjs test

import fs from 'node:fs';
import path from 'node:path';
import { verifyProjectContinuity } from './design-lock.mjs';

export function auditSource(content, filename = 'index.tsx', mode = 'web') {
  const issues = [];
  const isTsx = /\.(tsx|jsx)$/.test(filename);

  // 1. JSX attribute bug check
  if (isTsx && /\sclass=["']/.test(content)) {
    issues.push({ severity: 'error', rule: 'jsx-class-attr', msg: 'Found HTML `class=` attribute inside JSX/TSX; use `className=`.' });
  }

  // 2. Anti-AI-Slop checks
  if (/(from|via|to)-(purple|indigo|violet)-(500|600)/.test(content) && !content.includes('/* allow-purple */')) {
    issues.push({ severity: 'error', rule: 'anti-slop-gradient', msg: 'Generic AI purple/indigo Tailwind gradient detected.' });
  }
  // Ban AI "Pastel Pill / Badge Soup" (rounded-full / 999px lozenge tags for status, eyebrows, or metadata)
  const pillBadgeClasses = /\.(eyebrow-pill|brand-tag|status-pill|grounding-pill|risk-badge|doc-badge)\b|\brounded-full\b[^>\n]*\b(bg-(?:emerald|green|red|amber|purple|blue|indigo|rose|orange)-(?:50|100|200|500\/10))\b/i.test(content);
  const lozengeRadiusCount = (content.match(/border-radius:\s*9999?px/g) || []).length;
  if (pillBadgeClasses || lozengeRadiusCount > 2) {
    issues.push({
      severity: 'error',
      rule: 'anti-slop-pill-badge',
      msg: `Detected AI "Pill/Badge Soup" (${lozengeRadiusCount} lozenge 999px rules or pill-badge classes). Replace floating pastel rounded-full tags with naked monospace ledger text, 6px geometric status dots, hairline rules, or inline superscripts.`,
    });
  }
  if (/backdrop-blur-(xl|2xl|3xl)|blur\(\s*[2-9]\dpx\s*\)/.test(content)) {
    const hasOpticalCraft = /saturate\(|inset\s+0\s+1px|allow-glass/.test(content);
    if (!hasOpticalCraft) {
      issues.push({
        severity: mode === 'desktop' ? 'error' : 'warn',
        rule: 'unrefined-glassmorphism',
        msg: 'Heavy backdrop blur used without optical refraction (`saturate(180%)` or specular `inset 0 1px` rim). Elevate to refractive glass or use solid OKLCH surfaces.',
      });
    }
  }
  if (!/oklch\(/i.test(content)) {
    issues.push({ severity: 'warn', rule: 'oklch-tokens', msg: 'No OKLCH color tokens detected in source.' });
  }

  // 3. Living Motion & Micro-Interaction Law (Never ship a static PDF)
  const hasChoreography = /(@keyframes|\.animate\(|requestAnimationFrame|gsap|ScrollTrigger|motion\.|transition\s*:|transition-(all|transform|colors|opacity))/.test(content);
  const hasTactileStates = /(:hover|:active|hover:|active:|onPointerMove|onMouseMove)/.test(content);
  if (!hasChoreography || !hasTactileStates) {
    issues.push({
      severity: 'error',
      rule: 'static-dead-ui',
      msg: 'Interface lacks living motion or tactile hover/active states. Every screen must include entrance/state choreography (@keyframes, WAAPI .animate, or rAF) and :hover/:active micro-interactions.',
    });
  }

  // 4. Mode-specific checks
  if (mode === 'web') {
    if (/(@keyframes|\.animate\(|gsap|ScrollTrigger|Lenis|motion\.)/.test(content) && !/prefers-reduced-motion/.test(content)) {
      issues.push({ severity: 'warn', rule: 'reduced-motion', msg: 'Animations used without `prefers-reduced-motion` guard.' });
    }
  } else if (mode === 'desktop') {
    if (!/app-region:\s*drag/.test(content)) {
      issues.push({ severity: 'error', rule: 'desktop-drag-region', msg: 'Missing `-webkit-app-region: drag` on custom titlebar.' });
    }
    if (/app-region:\s*drag/.test(content) && !/app-region:\s*no-drag/.test(content)) {
      issues.push({ severity: 'error', rule: 'desktop-nodrag-children', msg: 'Found `drag` region without `no-drag` on interactive child controls.' });
    }
    if (!/tabular-nums/.test(content)) {
      issues.push({ severity: 'error', rule: 'desktop-tabular-nums', msg: 'Missing `tabular-nums` for jitter-free numeric readouts.' });
    }
    if (!/select-none|user-select:\s*none/.test(content)) {
      issues.push({ severity: 'error', rule: 'desktop-user-select', msg: 'Missing `select-none` / `user-select: none` on desktop chrome.' });
    }
    if (!/overflow-hidden|overflow:\s*hidden/.test(content)) {
      issues.push({ severity: 'warn', rule: 'desktop-fixed-viewport', msg: 'Desktop shell should lock viewport overflow (`h-screen overflow-hidden`).' });
    }
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
    else if (/\.(tsx|jsx|ts|js|css|html|vue|svelte)$/.test(entry.name)) out.push(full);
  }
  return out;
}

async function auditUrl(url, mode) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    throw new Error('Playwright not installed in current project. Run static source audit or `npm i -D playwright`.');
  }
  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    try {
      browser = await chromium.launch({ channel: 'msedge' });
    } catch {
      browser = await chromium.launch({ channel: 'chrome' });
    }
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const report = await page.evaluate((m) => {
    const issues = [];
    const docEl = document.documentElement;
    if (docEl.scrollWidth > docEl.clientWidth + 2) {
      issues.push({ severity: 'error', rule: 'horizontal-overflow', msg: `Document overflows horizontally (${docEl.scrollWidth}px > ${docEl.clientWidth}px).` });
    }
    if (m === 'desktop') {
      const bodyStyle = getComputedStyle(document.body);
      if (bodyStyle.overflowY !== 'hidden' && docEl.scrollHeight > docEl.clientHeight + 2) {
        issues.push({ severity: 'error', rule: 'desktop-page-scroll', msg: 'Desktop app body scrolls like a web page instead of locking viewport.' });
      }
      const interactiveInDrag = [...document.querySelectorAll('button, input, a, [role="button"]')].filter((el) => {
        const s = getComputedStyle(el);
        return s.webkitAppRegion === 'drag';
      });
      if (interactiveInDrag.length > 0) {
        issues.push({ severity: 'error', rule: 'drag-traps-button', msg: `${interactiveInDrag.length} interactive control(s) trapped inside -webkit-app-region: drag without no-drag.` });
      }
    } else {
      const h1 = document.querySelector('h1');
      if (h1) {
        const f = getComputedStyle(h1).fontFamily.toLowerCase();
        if (/^(inter|roboto|arial|system-ui|-apple-system)\b/.test(f)) {
          issues.push({ severity: 'warn', rule: 'generic-display-font', msg: `Hero <h1> uses default system/Inter font (${f.split(',')[0]}).` });
        }
      }
    }
    return issues;
  }, mode);

  await browser.close();
  return report;
}

function test() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`FAIL: ${msg}`); };
  const badDesktop = `<div class="bg-gradient-to-r from-purple-500 to-indigo-600 backdrop-blur-2xl" style="-webkit-app-region: drag;">123</div>`;
  const issues = auditSource(badDesktop, 'App.tsx', 'desktop');
  assert(issues.some((i) => i.rule === 'jsx-class-attr'), 'detects class= in tsx');
  assert(issues.some((i) => i.rule === 'anti-slop-gradient'), 'detects purple gradient');
  assert(issues.some((i) => i.rule === 'desktop-nodrag-children'), 'detects missing no-drag');
  assert(issues.some((i) => i.rule === 'desktop-tabular-nums'), 'detects missing tabular-nums');

  const goodDesktop = `
    <div className="h-screen overflow-hidden select-none transition-transform hover:scale-100 active:scale-95" style={{ color: 'oklch(96% 0.01 250)' }}>
      <header style={{ WebkitAppRegion: 'drag' } as any} className="app-region: drag">
        <button className="app-region: no-drag tabular-nums">⌘K 120.4</button>
      </header>
    </div>`;
  const cleanIssues = auditSource(goodDesktop, 'App.tsx', 'desktop');
  assert(cleanIssues.filter((i) => i.severity === 'error').length === 0, 'clean desktop passes error checks');
  console.log('All audit-ui checks passed.');
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  test();
  process.exit(0);
}

const modeIdx = args.indexOf('--mode');
const mode = modeIdx !== -1 && args[modeIdx + 1] ? args[modeIdx + 1].toLowerCase() : 'web';
const target = args.find((a, i) => !a.startsWith('--') && (modeIdx === -1 || i !== modeIdx + 1));

if (!target) {
  console.log('Usage: node audit-ui.mjs <dir|file|url> [--mode web|desktop] | test');
  process.exit(0);
}

(async () => {
  try {
    let issues = [];
    if (/^https?:\/\//.test(target)) {
      issues = await auditUrl(target, mode);
    } else {
      const files = collectFiles(target);
      const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
      issues = auditSource(combined, 'combined.bundle', mode);
      for (const f of files) {
        for (const issue of auditSource(fs.readFileSync(f, 'utf8'), f, mode)) {
          if (issue.rule === 'jsx-class-attr') issues.push({ ...issue, msg: `${path.basename(f)}: ${issue.msg}` });
        }
      }
      // If a .ui-design-lock.json contract exists in the target directory, enforce multi-screen continuity & component reuse
      if (fs.existsSync(target) && fs.statSync(target).isDirectory() && fs.existsSync(path.join(target, '.ui-design-lock.json'))) {
        const lockCheck = verifyProjectContinuity(target);
        for (const li of lockCheck.issues) {
          issues.push({
            severity: li.severity.toLowerCase(),
            rule: li.rule,
            msg: `${li.file ? li.file + ': ' : ''}${li.message}`,
          });
        }
      }
      // Deduplicate by rule+msg
      issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];
    }

    if (issues.length === 0) {
      console.log(`PASS (${mode} mode): 0 issues found.`);
    } else {
      for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
      if (issues.some((i) => i.severity === 'error')) process.exit(1);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
