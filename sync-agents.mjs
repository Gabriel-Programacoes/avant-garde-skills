#!/usr/bin/env node
// Syncs all avant-garde-* skills in this repository to installed AI coding agents
// (.gemini/skills, .claude/skills, .agents/skills, .codex/skills) while preserving
// and merging history.md anti-repetition logs across all locations.
// Usage:
//   node sync-agents.mjs           Sync to all detected agent folders
//   node sync-agents.mjs --dry-run Preview targets without writing
//   node sync-agents.mjs test      Self-check history merge logic

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();

const AGENT_SKILL_DIRS = [
  path.join(HOME, '.gemini', 'skills'),
  path.join(HOME, '.claude', 'skills'),
  path.join(HOME, '.agents', 'skills'),
  path.join(HOME, '.codex', 'skills'),
];

export function mergeHistory(contents) {
  let headerLines = [];
  const entries = new Set();

  for (const raw of contents) {
    if (!raw) continue;
    const lines = raw.replace(/\r\n/g, '\n').split('\n');
    const currentHeader = [];
    for (const line of lines) {
      if (/^\d{4}-\d{2}-\d{2}\s*\|/.test(line.trim())) {
        entries.add(line.trim());
      } else if (entries.size === 0 && headerLines.length === 0) {
        currentHeader.push(line);
      }
    }
    if (headerLines.length === 0 && currentHeader.length > 0) {
      headerLines = currentHeader;
    }
  }

  while (headerLines.length && headerLines[headerLines.length - 1].trim() === '') {
    headerLines.pop();
  }
  const sorted = [...entries].sort();
  return [...headerLines, '', ...sorted, ''].join('\n');
}

function copyDirRecursive(src, dest, dryRun = false) {
  if (!dryRun) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, dryRun);
    } else if (!dryRun) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function test() {
  const h1 = `# Design history\n\nFormat: \`YYYY-MM-DD | ...\`\n\n2026-10-30 | proj-b | m | s | f | c | i\n`;
  const h2 = `# Design history\n\nFormat: \`YYYY-MM-DD | ...\`\n\n2026-10-29 | proj-a | m | s | f | c | i\n2026-10-30 | proj-b | m | s | f | c | i\n`;
  const merged = mergeHistory([h1, h2]);
  const lines = merged.trim().split('\n').filter((l) => /^\d{4}-\d{2}-\d{2}/.test(l));
  if (lines.length !== 2 || !lines[0].includes('proj-a') || !lines[1].includes('proj-b')) {
    throw new Error('FAIL: history merge & sort failed');
  }
  console.log('All sync-agents checks passed.');
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  test();
  process.exit(0);
}

const dryRun = args.includes('--dry-run');
const skills = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('avant-garde-') && fs.existsSync(path.join(ROOT, d.name, 'SKILL.md')))
  .map((d) => d.name);

const activeAgentDirs = AGENT_SKILL_DIRS.filter((d) => fs.existsSync(d));

for (const skill of skills) {
  const srcDir = path.join(ROOT, skill);
  const srcHistPath = path.join(srcDir, 'history.md');

  // 1. Collect and merge history.md across workspace + all agents
  const historyPayloads = [];
  if (fs.existsSync(srcHistPath)) historyPayloads.push(fs.readFileSync(srcHistPath, 'utf8'));
  for (const agentDir of activeAgentDirs) {
    const agentHist = path.join(agentDir, skill, 'history.md');
    if (fs.existsSync(agentHist)) historyPayloads.push(fs.readFileSync(agentHist, 'utf8'));
  }
  if (historyPayloads.length > 0 && !dryRun) {
    fs.writeFileSync(srcHistPath, mergeHistory(historyPayloads), 'utf8');
  }

  // 2. Sync skill folder to each agent directory
  for (const agentDir of activeAgentDirs) {
    const destDir = path.join(agentDir, skill);
    copyDirRecursive(srcDir, destDir, dryRun);
    console.log(`${dryRun ? '[DRY-RUN] ' : ''}Synced ${skill} -> ${destDir}`);
  }
}
