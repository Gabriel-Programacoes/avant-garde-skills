#!/usr/bin/env node
/**
 * Post-Chat AI UX Constraint Deck (Zero-Dependency)
 * Usage:
 *   node ai-ux-constraints.mjs [count] [--domain <coding|research|triage|agents|editorial>]
 *   node ai-ux-constraints.mjs test
 */

import assert from 'node:assert/strict';
import path from 'node:path';

export const AI_UX_CONSTRAINTS = [
  {
    id: 'inline-redline-diff',
    domains: ['coding', 'editorial', 'research', 'triage'],
    title: 'Inline Redline Diff Over Chat Copy-Paste',
    rule: 'AI suggestions must render directly inside the target document/artifact as semantic green/coral diff spans with 1-click or [Tab]/[Esc] Accept/Reject actions.',
  },
  {
    id: 'epistemic-citation-matrix',
    domains: ['research', 'editorial', 'triage'],
    title: 'Bidirectional Source Citation Grounding',
    rule: 'Every synthesized claim must carry a compact monospace citation chip ([§4.2 · 98%]) that highlights the exact source passage in the document pane when clicked or hovered.',
  },
  {
    id: 'transparent-reasoning-trace',
    domains: ['coding', 'research', 'agents', 'triage'],
    title: 'Live Reasoning & Tool-Call Telemetry Ledger',
    rule: 'Never show a bare spinner. Render an inspectable step trace showing tool invocations, matched chunks, latency in ms (tabular-nums), and confidence score.',
  },
  {
    id: 'confidence-horizon-bar',
    domains: ['triage', 'research', 'agents'],
    title: 'Perceptual Confidence & Risk Telemetry',
    rule: 'Display an OKLCH epistemic confidence indicator (Verified Emerald vs Speculative Amber vs Risk Terracotta) alongside every automated classification or clause review.',
  },
  {
    id: 'keyboard-first-human-gate',
    domains: ['coding', 'triage', 'agents', 'editorial'],
    title: 'Single-Keystroke Human-in-the-Loop Gate',
    rule: 'All AI proposals must expose visible keyboard shortcut hints ([Tab] Apply, [Esc] Dismiss, [1-3] Switch Clause) for rapid human verification.',
  },
];

export function drawAiUxConstraints(count = 2, domain = '') {
  const pool = domain
    ? AI_UX_CONSTRAINTS.filter((c) => c.domains.includes(domain.toLowerCase()))
    : AI_UX_CONSTRAINTS;
  const activePool = pool.length >= count ? pool : AI_UX_CONSTRAINTS;
  const shuffled = [...activePool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, Math.min(count, shuffled.length)));
}

function runTests() {
  const drawn = drawAiUxConstraints(2, 'research');
  assert.equal(drawn.length, 2, 'Should draw 2 constraints for research domain');
  assert.ok(drawn.every((c) => c.id && c.rule), 'Every drawn constraint must have id and rule');
  console.log('PASS: ai-ux-constraints.mjs self-tests passed.');
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
  const selected = drawAiUxConstraints(count, domain);
  console.log(`DRAWN AI-UX CONSTRAINTS (${selected.length}):`);
  for (const c of selected) {
    console.log(`- [${c.id}] ${c.title}: ${c.rule}`);
  }
}
