#!/usr/bin/env node
// Computational Data-Viz & Tufte Law Auditor for avant-garde-data-viz.
// Verifies tabular-nums, direct annotations, OKLCH perceptual scales, accessible SVGs, and anti-slop rules.
// Usage:
//   node audit-dataviz.mjs <dir-or-file>
//   node audit-dataviz.mjs test

import fs from 'node:fs';
import path from 'node:path';

export function auditDataVizSource(content, filename = 'Chart.tsx') {
  const issues = [];
  const isTsx = /\.(tsx|jsx)$/.test(filename);

  if (isTsx && /\sclass=["']/.test(content)) {
    issues.push({ severity: 'error', rule: 'jsx-class-attr', msg: 'Found HTML `class=` attribute inside JSX/TSX; use `className=`.' });
  }

  // 1. Tabular figures check
  if (!/tabular-nums/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'dataviz-tabular-nums',
      msg: 'Missing `tabular-nums` (`font-variant-numeric: tabular-nums`) on numeric readouts, axes, or tables.',
    });
  }

  // 2. Direct Annotation check (Tufte Law)
  if (!/annotation|callout|regime|threshold|anomaly/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'dataviz-direct-annotation',
      msg: 'Missing direct chart annotations (callouts, threshold lines, or regime markers). Never ship un-annotated charts.',
    });
  }

  // 3. Perceptual OKLCH color tokens check
  if (!/oklch\(/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'dataviz-oklch-scale',
      msg: 'Missing perceptual `oklch()` color tokens for data encoding.',
    });
  }

  // 4. Accessible SVG data-viz check
  if (/<svg\b/i.test(content) && !/aria-label=|role=["']img["']/i.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'dataviz-svg-a11y',
      msg: 'Data visualization `<svg>` should include `role="img"` and descriptive `aria-label`.',
    });
  }

  // 5. Anti-Slop Pie/Donut & Rainbow check
  if (/PieChart|Doughnut|conic-gradient\s*\([^)]*red[^)]*yellow[^)]*green/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'dataviz-no-pie-rainbow',
      msg: 'Avoid generic pie/donut charts or sRGB rainbow gradients; use perceptual OKLCH scales and position/length encodings.',
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
    else if (/\.(tsx|jsx|ts|js|css|html|svg)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function test() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`FAIL: ${msg}`); };

  const badViz = `<div class="p-4"><PieChart /><svg><path d="M0,0" /></svg></div>`;
  const badIssues = auditDataVizSource(badViz, 'BadViz.tsx');
  assert(badIssues.some((i) => i.rule === 'jsx-class-attr'), 'detects class= in tsx');
  assert(badIssues.some((i) => i.rule === 'dataviz-tabular-nums'), 'detects missing tabular-nums');
  assert(badIssues.some((i) => i.rule === 'dataviz-direct-annotation'), 'detects missing annotations');
  assert(badIssues.some((i) => i.rule === 'dataviz-oklch-scale'), 'detects missing oklch');
  assert(badIssues.some((i) => i.rule === 'dataviz-no-pie-rainbow'), 'detects PieChart slop');

  const goodViz = `
    <div className="tabular-nums" style={{ color: 'oklch(20% 0.02 250)' }}>
      <svg role="img" aria-label="Annotated anomaly horizon plot">
        <g className="annotation"><text>Peak +3.2σ</text></g>
      </svg>
    </div>`;
  const goodIssues = auditDataVizSource(goodViz, 'GoodViz.tsx');
  assert(goodIssues.filter((i) => i.severity === 'error').length === 0, 'clean data-viz passes 0 errors');
  console.log('All audit-dataviz checks passed.');
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  test();
  process.exit(0);
}

const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.log('Usage: node audit-dataviz.mjs <dir|file> | test');
  process.exit(0);
}

const files = collectFiles(target);
const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
let issues = auditDataVizSource(combined, 'combined.bundle');
for (const f of files) {
  for (const issue of auditDataVizSource(fs.readFileSync(f, 'utf8'), f)) {
    if (issue.rule === 'jsx-class-attr') issues.push({ ...issue, msg: `${path.basename(f)}: ${issue.msg}` });
  }
}
issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];

if (issues.length === 0) {
  console.log('PASS (dataviz mode): 0 issues found.');
} else {
  for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
  if (issues.some((i) => i.severity === 'error')) process.exit(1);
}
