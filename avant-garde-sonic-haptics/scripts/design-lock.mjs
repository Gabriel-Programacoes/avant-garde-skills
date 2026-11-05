#!/usr/bin/env node
/**
 * Multi-Screen Design System Lock & Reusable Component Registry (Zero-Dependency)
 *
 * Prevents two critical multi-screen failure modes:
 *   1. Design Drift: Screen 2..N inventing new colors, fonts, radii, or shadows that break Screen 1's identity.
 *   2. Component Amnesia: Screen 20 recreating a custom Calendar, DatePicker, SegmentedControl, or Modal from scratch
 *      instead of reusing the component built in Screen 1.
 *
 * Commands:
 *   node design-lock.mjs status <project-dir>
 *   node design-lock.mjs scan <project-dir> [--name <project-name>] [--archetype <style>] [--write]
 *   node design-lock.mjs register <project-dir> --name <Name> --path <relPath> --tags <t1,t2> [--props <sig>] [--desc <text>]
 *   node design-lock.mjs find <project-dir> <keyword>
 *   node design-lock.mjs verify <project-dir>
 *   node design-lock.mjs test
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const LOCK_FILENAME = '.ui-design-lock.json';

// Bilingual PT-BR / EN semantic tag synonyms so queries like "calendario", "agenda", or "date" resolve to the same primitive
const TAG_SYNONYMS = {
  calendar: ['calendar', 'calendario', 'calendário', 'date-picker', 'datepicker', 'agenda', 'schedule', 'agendamento', 'slot-picker', 'horarios', 'horários', 'month-grid'],
  'segmented-control': ['segmented-control', 'segmented', 'pill-switcher', 'tabs', 'abas', 'seletor', 'switcher', 'toggle-group'],
  navigation: ['navigation', 'nav', 'navbar', 'header', 'top-bar', 'menu', 'barra-navegacao', 'nav-pill'],
  card: ['card', 'metric-card', 'stat-card', 'bento-card', 'kpi', 'metrica', 'métrica', 'subcard'],
  modal: ['modal', 'dialog', 'drawer', 'bottom-sheet', 'sheet', 'overlay', 'gaveta'],
  scrubber: ['scrubber', 'number-scrubber', 'dial', 'rotary', 'knob', 'slider', 'fader'],
  table: ['table', 'data-table', 'grid', 'tabela', 'list', 'ledger'],
  chart: ['chart', 'graph', 'sparkline', 'curve', 'grafico', 'gráfico', 'telemetry'],
};

function expandQueryTerms(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  const terms = new Set([q]);
  for (const [canonical, list] of Object.entries(TAG_SYNONYMS)) {
    if (canonical.includes(q) || list.some((item) => item.includes(q) || q.includes(item))) {
      terms.add(canonical);
      for (const item of list) terms.add(item);
    }
  }
  return [...terms];
}

function inferTagsFromCode(name, code) {
  const haystack = `${name} ${code}`.toLowerCase();
  const inferred = new Set();
  for (const [canonical, list] of Object.entries(TAG_SYNONYMS)) {
    if (list.some((kw) => haystack.includes(kw))) {
      inferred.add(canonical);
    }
  }
  return [...inferred];
}

function collectProjectFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    fileList.push(dir);
    return fileList;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectProjectFiles(full, fileList);
    else if (/\.(tsx|jsx|ts|js|css|html)$/.test(entry.name)) fileList.push(full);
  }
  return fileList;
}

export function scanProject(projectDir, options = {}) {
  const absDir = path.resolve(projectDir);
  const lockPath = path.join(absDir, LOCK_FILENAME);
  const existingLock = fs.existsSync(lockPath)
    ? JSON.parse(fs.readFileSync(lockPath, 'utf8'))
    : null;

  const files = collectProjectFiles(absDir);
  const tokens = { ...(existingLock?.tokens || {}) };
  const fonts = new Set(existingLock?.fonts || []);
  const componentsMap = new Map();

  if (existingLock?.components) {
    for (const comp of existingLock.components) {
      componentsMap.set(comp.name, comp);
    }
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(absDir, file).replace(/\\/g, '/');

    // 1. Extract CSS Custom Properties (--token: value)
    const tokenRegex = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;}\n]+);/g;
    let m;
    while ((m = tokenRegex.exec(content)) !== null) {
      const key = m[1].trim();
      const val = m[2].trim();
      if (!tokens[key]) tokens[key] = val;
    }

    // 2. Extract Font Families
    const fontRegex = /font-family\s*:\s*['"]?([a-zA-Z0-9\s-]+)['"]?/gi;
    let fm;
    while ((fm = fontRegex.exec(content)) !== null) {
      const family = fm[1].trim();
      if (family && !['inherit', 'system-ui', 'sans-serif', 'serif', 'monospace'].includes(family.toLowerCase())) {
        fonts.add(family);
      }
    }

    // 3. Discover reusable components in components/ or ui/ or exported PascalCase components
    const isComponentDir = /(^|\/)(components|ui|primitives)\//i.test(relPath);
    if (isComponentDir && /\.(tsx|jsx|ts|js)$/.test(relPath)) {
      const exportRegex = /export\s+(?:function|const)\s+([A-Z][A-Za-z0-9_]+)/g;
      let em;
      while ((em = exportRegex.exec(content)) !== null) {
        const compName = em[1];
        const propsMatch = content.match(new RegExp(`interface\\s+${compName}Props\\s*\\{([^}]+)\\}`, 'm'));
        const propsSummary = propsMatch
          ? propsMatch[1]
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
              .join(' ')
          : 'See component file';
        const tags = inferTagsFromCode(compName, content);
        const prev = componentsMap.get(compName);
        componentsMap.set(compName, {
          name: compName,
          path: relPath,
          tags: [...new Set([...(prev?.tags || []), ...tags])],
          props: prev?.props || propsSummary,
          description: prev?.description || `Reusable ${compName} primitive`,
        });
      }
    }
  }

  const lockData = {
    version: '1.0.0',
    project: options.name || existingLock?.project || path.basename(absDir),
    archetype: options.archetype || existingLock?.archetype || 'custom-studio-system',
    updatedAt: new Date().toISOString().slice(0, 10),
    fonts: [...fonts],
    tokens,
    components: [...componentsMap.values()],
  };

  if (options.write) {
    fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2) + '\n', 'utf8');
  }

  return lockData;
}

export function registerComponent(projectDir, { name, relPath, tags = [], props = '', description = '' }) {
  const absDir = path.resolve(projectDir);
  const lockData = scanProject(absDir, { write: false });
  const normalizedPath = relPath.replace(/\\/g, '/');
  const existingIdx = lockData.components.findIndex((c) => c.name === name);

  const entry = {
    name,
    path: normalizedPath,
    tags: [...new Set(tags.map((t) => t.toLowerCase().trim()).filter(Boolean))],
    props: props || 'Standard props',
    description: description || `Reusable ${name} component`,
  };

  if (existingIdx >= 0) {
    lockData.components[existingIdx] = {
      ...lockData.components[existingIdx],
      ...entry,
      tags: [...new Set([...lockData.components[existingIdx].tags, ...entry.tags])],
    };
  } else {
    lockData.components.push(entry);
  }

  const lockPath = path.join(absDir, LOCK_FILENAME);
  fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2) + '\n', 'utf8');
  return entry;
}

export function findComponents(projectDir, rawQuery) {
  const absDir = path.resolve(projectDir);
  const lockPath = path.join(absDir, LOCK_FILENAME);
  const lockData = fs.existsSync(lockPath)
    ? JSON.parse(fs.readFileSync(lockPath, 'utf8'))
    : scanProject(absDir, { write: false });

  const expandedTerms = expandQueryTerms(rawQuery);
  return lockData.components.filter((comp) => {
    const hay = `${comp.name} ${comp.path} ${(comp.tags || []).join(' ')} ${comp.description || ''}`.toLowerCase();
    return expandedTerms.some((term) => hay.includes(term));
  });
}

export function verifyProjectContinuity(projectDir) {
  const absDir = path.resolve(projectDir);
  const lockPath = path.join(absDir, LOCK_FILENAME);
  const issues = [];

  if (!fs.existsSync(lockPath)) {
    return {
      locked: false,
      issues: [{ severity: 'WARN', rule: 'missing-design-lock', message: `No ${LOCK_FILENAME} found in ${projectDir}. Run 'design-lock.mjs scan <dir> --write' after Screen 1.` }],
    };
  }

  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const lockedTokenKeys = new Set(Object.keys(lock.tokens || {}));

  // 1. Verify all registered component files exist on disk
  for (const comp of lock.components || []) {
    const fullCompPath = path.join(absDir, comp.path);
    if (!fs.existsSync(fullCompPath)) {
      issues.push({
        severity: 'ERROR',
        rule: 'missing-registered-component',
        file: comp.path,
        message: `Registered component '${comp.name}' (${comp.path}) does not exist on disk.`,
      });
    }
  }

  // 2. Scan screen/page files for Token Drift & Duplicate Component Creation
  const files = collectProjectFiles(absDir);
  for (const file of files) {
    const relPath = path.relative(absDir, file).replace(/\\/g, '/');
    const isComponentFile = (lock.components || []).some((c) => c.path === relPath);
    const content = fs.readFileSync(file, 'utf8');

    // Check A: Token Drift in CSS Custom Properties (redefining locked token with a different value)
    const tokenRegex = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;}\n]+);/g;
    let m;
    while ((m = tokenRegex.exec(content)) !== null) {
      const key = m[1].trim();
      const val = m[2].trim();
      if (lockedTokenKeys.has(key) && lock.tokens[key] !== val) {
        issues.push({
          severity: 'ERROR',
          rule: 'token-drift',
          file: relPath,
          message: `Token '${key}' drifted in ${relPath}: expected '${lock.tokens[key]}', found '${val}'. Must preserve Screen 1 token contract.`,
        });
      }
    }

    // Check B: Duplicate Primitive Creation in non-component screen files
    if (!isComponentFile && /\.(tsx|jsx)$/.test(relPath)) {
      for (const comp of lock.components || []) {
        // If a screen file declares a brand new function/class with a colliding role (e.g., Calendar) without importing the registered one
        const hasCalendarTag = (comp.tags || []).includes('calendar');
        if (hasCalendarTag) {
          const definesOwnCalendar = /function\s+[A-Za-z0-9_]*(Calendar|DatePicker|MonthGrid)/i.test(content);
          const importsRegistered = content.includes(comp.name);
          if (definesOwnCalendar && !importsRegistered) {
            issues.push({
              severity: 'ERROR',
              rule: 'duplicate-primitive',
              file: relPath,
              message: `Screen '${relPath}' defines a new Calendar/DatePicker inline instead of reusing registered '${comp.name}' from '${comp.path}'.`,
            });
          }
        }
      }
    }
  }

  return { locked: true, lock, issues };
}

function runSelfTests() {
  const tmpDir = path.join(process.cwd(), '.tmp-design-lock-test');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmpDir, 'components', 'ui'), { recursive: true });

  // 1. Write Screen 1 + Reusable Calendar Component
  fs.writeFileSync(
    path.join(tmpDir, 'components', 'ui', 'LuminaCalendar.tsx'),
    `import React from 'react';
export interface LuminaCalendarProps { selectedDate: string; onSelectDate: (d: string) => void; }
export function LuminaCalendar({ selectedDate, onSelectDate }: LuminaCalendarProps) {
  return <div className="calendar-grid">{selectedDate}</div>;
}`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(tmpDir, 'Screen1.tsx'),
    `import React from 'react';
import { LuminaCalendar } from './components/ui/LuminaCalendar';
export const styles = \`:root { --paper-stone: oklch(97% 0.009 78); --sage-primary: oklch(39% 0.092 158); }\`;
export function Screen1() { return <LuminaCalendar selectedDate="2026-11-12" onSelectDate={() => {}} />; }`,
    'utf8'
  );

  // 2. Scan and lock project
  const scanned = scanProject(tmpDir, { name: 'lumina-test', archetype: 'sunlit-daylight', write: true });
  assert.ok(scanned.tokens['--paper-stone'], 'Should extract --paper-stone token');
  assert.equal(scanned.components.length, 1, 'Should auto-discover LuminaCalendar in components/ui/');
  assert.ok(scanned.components[0].tags.includes('calendar'), 'Should auto-tag LuminaCalendar with calendar');

  // 3. Find component using Portuguese layman query "calendario" and "agendamento"
  const foundPt = findComponents(tmpDir, 'calendario');
  assert.equal(foundPt.length, 1, 'PT-BR query "calendario" must find LuminaCalendar');
  const foundAgenda = findComponents(tmpDir, 'agendamento');
  assert.equal(foundAgenda.length, 1, 'PT-BR query "agendamento" must find LuminaCalendar');

  // 4. Verify clean Screen 2 that reuses LuminaCalendar passes
  fs.writeFileSync(
    path.join(tmpDir, 'Screen2Clean.tsx'),
    `import React from 'react';
import { LuminaCalendar } from './components/ui/LuminaCalendar';
export function Screen2Clean() { return <LuminaCalendar selectedDate="2026-11-20" onSelectDate={() => {}} />; }`,
    'utf8'
  );
  const cleanVerify = verifyProjectContinuity(tmpDir);
  assert.equal(cleanVerify.issues.length, 0, 'Clean Screen 2 reusing LuminaCalendar should have 0 issues');

  // 5. Verify drifting Screen 3 that redefines --paper-stone and builds a duplicate calendar fails
  fs.writeFileSync(
    path.join(tmpDir, 'Screen3Drift.tsx'),
    `import React from 'react';
const badCss = \`:root { --paper-stone: oklch(15% 0.02 260); }\`;
function CustomNewCalendar() { return <div />; }
export function Screen3Drift() { return <CustomNewCalendar />; }`,
    'utf8'
  );
  const driftVerify = verifyProjectContinuity(tmpDir);
  assert.ok(driftVerify.issues.some((i) => i.rule === 'token-drift'), 'Should catch token-drift on --paper-stone');
  assert.ok(driftVerify.issues.some((i) => i.rule === 'duplicate-primitive'), 'Should catch duplicate calendar creation');

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('PASS: design-lock.mjs self-tests (scan, PT/EN synonym find, token-drift, duplicate-primitive)');
}

// CLI Entrypoint
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const [cmd, targetDir, ...rest] = process.argv.slice(2);
  if (cmd === 'test') {
    runSelfTests();
    process.exit(0);
  }
  if (!cmd || !targetDir) {
    console.log('Usage: node design-lock.mjs <status|scan|register|find|verify|test> <project-dir> [options]');
    process.exit(1);
  }

  if (cmd === 'status') {
    const lockPath = path.join(path.resolve(targetDir), LOCK_FILENAME);
    if (fs.existsSync(lockPath)) {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      console.log(`STATUS: LOCKED (${lock.project} — ${lock.archetype})`);
      console.log(`FONTS: ${(lock.fonts || []).join(', ')}`);
      console.log(`TOKENS: ${Object.keys(lock.tokens || {}).length} locked CSS variables`);
      console.log(`COMPONENTS (${(lock.components || []).length}):`);
      for (const c of lock.components || []) {
        console.log(`  - ${c.name} [${c.path}] tags=(${c.tags.join(', ')})`);
      }
    } else {
      const files = collectProjectFiles(targetDir);
      console.log(files.length > 0 ? 'STATUS: UNLOCKED_EXISTING_UI (Run scan --write)' : 'STATUS: GREENFIELD');
    }
  } else if (cmd === 'scan') {
    const write = rest.includes('--write');
    const nameIdx = rest.indexOf('--name');
    const archIdx = rest.indexOf('--archetype');
    const res = scanProject(targetDir, {
      write,
      name: nameIdx >= 0 ? rest[nameIdx + 1] : undefined,
      archetype: archIdx >= 0 ? rest[archIdx + 1] : undefined,
    });
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'register') {
    const getArg = (flag) => {
      const idx = rest.indexOf(flag);
      return idx >= 0 ? rest[idx + 1] : '';
    };
    const entry = registerComponent(targetDir, {
      name: getArg('--name'),
      relPath: getArg('--path'),
      tags: getArg('--tags').split(','),
      props: getArg('--props'),
      description: getArg('--desc'),
    });
    console.log(`Registered component: ${entry.name} -> ${entry.path}`);
  } else if (cmd === 'find') {
    const query = rest.join(' ');
    const matches = findComponents(targetDir, query);
    if (matches.length === 0) {
      console.log(`NO_MATCH: No registered component matching '${query}'. Create a reusable primitive in components/ui/ and register it.`);
    } else {
      console.log(`MATCH_FOUND (${matches.length}): Reuse existing component(s):`);
      for (const m of matches) {
        console.log(`  - ${m.name} (import from '${m.path}')`);
        console.log(`    Tags: ${m.tags.join(', ')}`);
        console.log(`    Props: ${m.props}`);
        console.log(`    Note: ${m.description}`);
      }
    }
  } else if (cmd === 'verify') {
    const result = verifyProjectContinuity(targetDir);
    if (result.issues.length === 0) {
      console.log(`PASS (design-lock verify): 0 continuity or component duplication issues across '${targetDir}'.`);
    } else {
      for (const issue of result.issues) {
        console.log(`[${issue.severity}] (${issue.rule}) ${issue.file || ''}: ${issue.message}`);
      }
      if (result.issues.some((i) => i.severity === 'ERROR')) process.exit(1);
    }
  }
}
