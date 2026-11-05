#!/usr/bin/env node
/**
 * Avant-Garde Skills Suite — CLI Installer & Tooling
 * Zero external dependencies.
 *
 * Usage:
 *   npx avant-garde-skills
 *   npx avant-garde-skills install [--all | <skill-name>] [--agent <gemini|claude|agents|codex>] [--dest <path>]
 *   npx avant-garde-skills list
 *   npx avant-garde-skills audit <path> [--mode web|desktop|ai-ux|sonic]
 *   npx avant-garde-skills lock <status|scan|find|verify> <path> [options]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SKILL_DIRS = [
  'avant-garde-frontend',
  'avant-garde-desktop',
  'avant-garde-motion-shaders',
  'avant-garde-data-viz',
  'avant-garde-mobile-tactile',
  'avant-garde-ai-ux',
  'avant-garde-sonic-haptics',
];

const SKILL_METADATA = {
  'avant-garde-frontend': {
    name: 'Avant-Garde Frontend',
    desc: 'Editorial web craft, Layman-to-Studio translator, APCA contrast, anti-slop rules, design-lock continuity.',
  },
  'avant-garde-desktop': {
    name: 'Avant-Garde Desktop',
    desc: 'Hardware instruments & hyper-productivity desktop software (Tauri, Electron), scrubbers, window chrome.',
  },
  'avant-garde-motion-shaders': {
    name: 'Avant-Garde Motion & Shaders',
    desc: 'WebGL2 aspect-correct GLSL, Bayer dithering, liquid domain warp, spring physics, scroll choreography.',
  },
  'avant-garde-data-viz': {
    name: 'Avant-Garde Data Visualization',
    desc: 'Tufte/Lupi editorial journalism, OKLCH perceptual scales, ridgeline charts, 60fps Canvas/SVG telemetry.',
  },
  'avant-garde-mobile-tactile': {
    name: 'Avant-Garde Mobile Tactile',
    desc: 'Pocket instruments, 100dvh safe-area shells, rotary thumb dials, spring-snapping bottom sheets, haptics.',
  },
  'avant-garde-ai-ux': {
    name: 'Avant-Garde AI UX',
    desc: 'Post-chat workbenches, inline semantic diffs (<del>/<ins>), bidirectional citations, reasoning telemetry.',
  },
  'avant-garde-sonic-haptics': {
    name: 'Avant-Garde Sonic & Haptics',
    desc: 'Zero-asset Web Audio API foley synthesis (<2KB), physical relay/ceramic transients, ADSR oscilloscope.',
  },
};

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (['node_modules', '.git', '.tmp'].includes(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function getAgentTargets() {
  const home = os.homedir();
  return [
    { id: 'gemini', name: 'Gemini CLI / Antigravity', baseDir: path.join(home, '.gemini', 'skills') },
    { id: 'claude', name: 'Claude Code', baseDir: path.join(home, '.claude', 'skills') },
    { id: 'agents', name: 'Agents / OpenAI', baseDir: path.join(home, '.agents', 'skills') },
    { id: 'codex', name: 'Codex CLI', baseDir: path.join(home, '.codex', 'skills') },
  ];
}

function printBanner() {
  console.log(`
\x1b[1m\x1b[38;2;221;82;36m  █████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗     ██████╗  █████╗ ██████╗ ██████╗ ███████╗
 ██╔══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔════╝
 ███████║██║   ██║███████║██╔██╗ ██║   ██║       ██║  ███╗███████║██████╔╝██║  ██║█████╗  
 ██╔══██║╚██╗ ██╔╝██╔══██║██║╚██╗██║   ██║       ██║   ██║██╔══██║██╔══██╗██║  ██║██╔══╝  
 ██║  ██║ ╚████╔╝ ██║  ██║██║ ╚████║   ██║       ╚██████╔╝██║  ██║██║  ██║██████╔╝███████╗
 ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝\x1b[0m
 \x1b[2mThe Studio-Grade UI/UX Intelligence Suite for AI Coding Agents (Gemini, Claude, Codex, AGY)\x1b[0m
`);
}

function listSkills() {
  printBanner();
  console.log('\x1b[1mAvailable Avant-Garde Skills (7):\x1b[0m\n');
  for (const dir of SKILL_DIRS) {
    const meta = SKILL_METADATA[dir];
    console.log(`  \x1b[1m\x1b[38;2;24;88;63m● ${dir}\x1b[0m`);
    console.log(`    ${meta.desc}\n`);
  }
  console.log('\x1b[2mRun "npx avant-garde-skills install" to sync all skills to your installed agents.\x1b[0m');
}

function installSkills(args) {
  printBanner();
  const targetSkills = args.filter((a) => !a.startsWith('--') && SKILL_DIRS.includes(a));
  const skillsToInstall = targetSkills.length > 0 ? targetSkills : SKILL_DIRS;

  const destIdx = args.indexOf('--dest');
  const agentIdx = args.indexOf('--agent');
  let targets = [];

  if (destIdx >= 0 && args[destIdx + 1]) {
    targets.push({ id: 'custom', name: 'Custom Destination', baseDir: path.resolve(args[destIdx + 1]) });
  } else {
    const allAgents = getAgentTargets();
    if (agentIdx >= 0 && args[agentIdx + 1]) {
      const selected = allAgents.filter((a) => a.id === args[agentIdx + 1].toLowerCase());
      targets = selected.length > 0 ? selected : allAgents;
    } else {
      targets = allAgents;
    }
  }

  console.log(`Installing ${skillsToInstall.length} skill(s) across target environments:\n`);

  let totalCopied = 0;
  for (const target of targets) {
    console.log(`\x1b[1m→ ${target.name}\x1b[0m (${target.baseDir})`);
    try {
      fs.mkdirSync(target.baseDir, { recursive: true });
      for (const skill of skillsToInstall) {
        const src = path.join(ROOT_DIR, skill);
        const dest = path.join(target.baseDir, skill);
        if (fs.existsSync(src)) {
          copyRecursive(src, dest);
          console.log(`  \x1b[32m✓\x1b[0m ${skill}`);
          totalCopied++;
        }
      }
    } catch (err) {
      console.log(`  \x1b[31m✗\x1b[0m Error writing to ${target.baseDir}: ${err.message}`);
    }
    console.log('');
  }

  console.log(`\x1b[1m\x1b[32mSuccess!\x1b[0m Sourced ${totalCopied} skill installations.`);
  console.log(`Your agents now possess studio-grade UI/UX intelligence.`);
}

async function runAudit(args) {
  const target = args[0] || '.';
  const auditScript = path.join(ROOT_DIR, 'avant-garde-frontend', 'scripts', 'audit-ui.mjs');
  const { spawn } = await import('node:child_process');
  const proc = spawn(process.execPath, [auditScript, target, ...args.slice(1)], { stdio: 'inherit' });
  proc.on('exit', (code) => process.exit(code || 0));
}

async function runLock(args) {
  const lockScript = path.join(ROOT_DIR, 'avant-garde-frontend', 'scripts', 'design-lock.mjs');
  const { spawn } = await import('node:child_process');
  const proc = spawn(process.execPath, [lockScript, ...args], { stdio: 'inherit' });
  proc.on('exit', (code) => process.exit(code || 0));
}

// CLI router
const [cmd, ...rest] = process.argv.slice(2);

switch (cmd) {
  case 'list':
  case 'ls':
    listSkills();
    break;
  case 'install':
  case 'sync':
  case 'add':
    installSkills(rest);
    break;
  case 'audit':
    await runAudit(rest);
    break;
  case 'lock':
    await runLock(rest);
    break;
  case 'help':
  case '--help':
  case '-h':
    printBanner();
    console.log(`
Usage:
  npx avant-garde-skills [command] [options]

Commands:
  install [skills...]     Install skills to AI agents (~/.gemini, ~/.claude, ~/.agents, ~/.codex)
  list                    List all available avant-garde skills
  audit <path>            Run the Anti-Slop UI & Motion Auditor on any directory or file
  lock <action> <dir>     Manage multi-screen design lock (status, scan, find, verify)
  help                    Show this help message

Options for install:
  --agent <name>          Target specific agent (gemini, claude, agents, codex)
  --dest <dir>            Install to a custom directory instead of agent homes

Examples:
  npx avant-garde-skills install
  npx avant-garde-skills install avant-garde-frontend avant-garde-ai-ux
  npx avant-garde-skills audit ./src --mode web
  npx avant-garde-skills lock verify ./src
`);
    break;
  default:
    if (!cmd) {
      // Default behavior when running `npx avant-garde-skills`: interactive banner + prompt to install
      printBanner();
      console.log('No command specified. Installing all 7 skills to detected AI agents...\n');
      installSkills([]);
    } else if (SKILL_DIRS.includes(cmd)) {
      installSkills([cmd, ...rest]);
    } else {
      console.log(`Unknown command: ${cmd}. Run "npx avant-garde-skills help" for available commands.`);
      process.exit(1);
    }
}
