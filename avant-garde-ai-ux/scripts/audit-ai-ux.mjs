#!/usr/bin/env node
/**
 * Computational Auditor for Avant-Garde AI UX (Zero-Dependency)
 * Verifies post-chat generative UI discipline:
 *   1. No JSX `class=` bugs
 *   2. No generic AI purple/indigo gradients or "How can I help you today?" empty-chat slop
 *   3. Mandatory Epistemic Grounding (citations, confidence telemetry, or semantic diff redlines)
 *   4. Mandatory Streaming/Reasoning Telemetry (`tabular-nums` + step/latency indicators)
 *   5. Mandatory Living Motion (`static-dead-ui` + `prefers-reduced-motion`)
 *   6. Multi-Screen Continuity (`design-lock.mjs` verification when `.ui-design-lock.json` is present)
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { verifyProjectContinuity } from './design-lock.mjs';

export function auditAiUxSource(content, filename = 'combined.bundle') {
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

  // 1. Anti-Slop AI Clichés
  if (/(from|via|to)-(purple|indigo|violet)-(500|600)/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'anti-slop-ai-gradient',
      msg: 'Generic AI purple/indigo gradient detected. Use perceptual OKLCH epistemic tokens.',
    });
  }
  // Ban AI "Pastel Pill / Badge Soup" (floating rounded-full status/risk bubbles)
  const pillBadgeClasses = /\.(eyebrow-pill|brand-tag|status-pill|grounding-pill|risk-badge|doc-badge|diff-status-pill)\b|#risk-badge|id="diff-status-pill"/i.test(content);
  const lozengeRadiusCount = (content.match(/border-radius:\s*9999?px/g) || []).length;
  if (pillBadgeClasses || lozengeRadiusCount > 1) {
    issues.push({
      severity: 'error',
      rule: 'anti-slop-pill-badge',
      msg: `Detected AI "Pill/Badge Soup" (${lozengeRadiusCount} lozenge 999px rules or pastel status bubbles). Replace rounded-full status balloons with naked monospace ledger rows, 6px geometric dots, and hairline rules.`,
    });
  }
  if (/How can I help you today\?|Como posso ajudar você hoje\?/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'anti-slop-empty-chatbot',
      msg: 'Generic "How can I help you today?" empty chatbot prompt detected. Use a Post-Chat Artifact/Diff Workbench.',
    });
  }

  // 2. OKLCH Color Architecture
  if (!/oklch\(/i.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'oklch-tokens',
      msg: 'Missing OKLCH color tokens for surfaces and epistemic states.',
    });
  }

  // 3. Epistemic Grounding & Diff / Citation Check
  const hasGrounding = /(citation|fonte|§|confiança|confidence|grounding|diff-add|diff-del|<ins|<del)/i.test(content);
  if (!hasGrounding) {
    issues.push({
      severity: 'error',
      rule: 'missing-epistemic-grounding',
      msg: 'AI interface lacks epistemic grounding (inline citations [§], confidence telemetry, or semantic diff <ins>/<del>).',
    });
  }

  // 4. Tabular Telemetry & Reasoning Trace Check
  if (!/tabular-nums/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'missing-tabular-telemetry',
      msg: 'Missing `tabular-nums` for jitter-free token latency, confidence scores, and reasoning timers.',
    });
  }

  // 5. Living Motion & Tactile States Check
  const hasMotion = /(@keyframes|\.animate\(|requestAnimationFrame|gsap|motion\.)/.test(content);
  const hasTactile = /(:hover|:active|hover:|active:|onPointerMove)/.test(content);
  if (!hasMotion || !hasTactile) {
    issues.push({
      severity: 'error',
      rule: 'static-dead-ui',
      msg: 'AI interface lacks living motion (@keyframes, WAAPI .animate, or rAF) or tactile :hover/:active states.',
    });
  }
  if (hasMotion && !/prefers-reduced-motion/.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'reduced-motion',
      msg: 'Animations used without `prefers-reduced-motion` accessibility guard.',
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
  const badChatbot = `
    <div class="bg-gradient-to-r from-purple-500 to-indigo-600">
      <h1>How can I help you today?</h1>
    </div>`;
  const badIssues = auditAiUxSource(badChatbot, 'combined.bundle');
  assert.ok(badIssues.some((i) => i.rule === 'anti-slop-ai-gradient'), 'Catches purple gradient');
  assert.ok(badIssues.some((i) => i.rule === 'anti-slop-empty-chatbot'), 'Catches generic empty chatbot');
  assert.ok(badIssues.some((i) => i.rule === 'missing-epistemic-grounding'), 'Catches missing grounding');
  assert.ok(badIssues.some((i) => i.rule === 'static-dead-ui'), 'Catches static dead UI');

  const goodWorkbench = `
    <style>
      :root { --bg: oklch(97% 0.008 80); }
      @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }
      .btn:hover { transform: translateY(-1px); }
      .btn:active { transform: scale(0.97); }
      @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
    </style>
    <main className="tabular-nums">
      <span>Confiança 98.4% · Fonte §4.2</span>
      <del className="diff-del">Old</del><ins className="diff-add">New</ins>
    </main>`;
  const goodIssues = auditAiUxSource(goodWorkbench, 'combined.bundle');
  assert.equal(goodIssues.length, 0, 'Clean post-chat AI workbench should pass with 0 issues');
  console.log('PASS: audit-ai-ux.mjs self-tests passed.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const target = process.argv[2];
  if (target === 'test') {
    runSelfTests();
    process.exit(0);
  }
  if (!target) {
    console.log('Usage: node audit-ai-ux.mjs <dir|file|test>');
    process.exit(1);
  }
  const files = collectFiles(target);
  const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  let issues = auditAiUxSource(combined, 'combined.bundle');
  for (const f of files) {
    issues.push(...auditAiUxSource(fs.readFileSync(f, 'utf8'), f));
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory() && fs.existsSync(path.join(target, '.ui-design-lock.json'))) {
    const lockCheck = verifyProjectContinuity(target);
    for (const li of lockCheck.issues) {
      issues.push({ severity: li.severity.toLowerCase(), rule: li.rule, msg: `${li.file || ''}: ${li.message}` });
    }
  }
  issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];
  if (issues.length === 0) {
    console.log('PASS (ai-ux mode): 0 issues found.');
  } else {
    for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
    if (issues.some((i) => i.severity === 'error')) process.exit(1);
  }
}
