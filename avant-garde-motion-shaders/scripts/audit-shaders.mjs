#!/usr/bin/env node
// Computational WebGL2, GLSL & Motion Auditor for avant-garde-motion-shaders.
// Usage:
//   node audit-shaders.mjs <dir-or-file>
//   node audit-shaders.mjs <http://localhost:3000>
//   node audit-shaders.mjs test

import fs from 'node:fs';
import path from 'node:path';

export function auditShaderSource(content, filename = 'Shader.tsx') {
  const issues = [];
  const isTsx = /\.(tsx|jsx)$/.test(filename);

  if (isTsx && /\sclass=["']/.test(content)) {
    issues.push({ severity: 'error', rule: 'jsx-class-attr', msg: 'Found HTML `class=` attribute inside JSX/TSX; use `className=`.' });
  }

  // 1. WebGL1 / WebGL2 syntax collision check
  if (/#version\s+300\s+es/.test(content)) {
    if (/\b(varying|attribute|gl_FragColor|texture2D)\b/.test(content)) {
      issues.push({
        severity: 'error',
        rule: 'webgl2-syntax-conflict',
        msg: 'GLSL `#version 300 es` cannot use WebGL1 keywords (`varying`, `attribute`, `gl_FragColor`, `texture2D`).',
      });
    }
  }

  // 2. DevicePixelRatio cap check
  if (/devicePixelRatio/.test(content) && !/Math\.min\s*\([^)]*devicePixelRatio/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'uncapped-dpr',
      msg: 'Always clamp `window.devicePixelRatio` with `Math.min(window.devicePixelRatio || 1, 2)` to prevent 4K/Retina GPU thermal throttling.',
    });
  }

  // 3. Reduced motion check
  if (/requestAnimationFrame/.test(content) && !/prefers-reduced-motion/.test(content)) {
    issues.push({
      severity: 'error',
      rule: 'shader-reduced-motion',
      msg: 'Render loop (`requestAnimationFrame`) missing `prefers-reduced-motion` handling.',
    });
  }

  // 4. Aspect-ratio UV check in fragment shaders
  if (/gl_FragCoord/.test(content) || /u_resolution/.test(content)) {
    const hasAspectFix = /min\s*\(\s*u_resolution\.x\s*,\s*u_resolution\.y\s*\)|u_resolution\.x\s*\/\s*u_resolution\.y|aspectUv/.test(content);
    if (!hasAspectFix) {
      issues.push({
        severity: 'error',
        rule: 'stretched-shader-uv',
        msg: 'Shader uses `u_resolution` without aspect-ratio normalization (`min(u_resolution.x, u_resolution.y)` or `u_resolution.x / u_resolution.y`).',
      });
    }
  }

  // 5. Offscreen / hidden pause check
  if (/requestAnimationFrame/.test(content) && !/(IntersectionObserver|document\.hidden|window-blurred|isFocused)/.test(content)) {
    issues.push({
      severity: 'warn',
      rule: 'zombie-raf-loop',
      msg: 'Render loop should pause when offscreen (`IntersectionObserver`) or hidden (`document.hidden`).',
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
    else if (/\.(tsx|jsx|ts|js|glsl|frag|vert|html)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function test() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`FAIL: ${msg}`); };

  const brokenShader = `
    #version 300 es
    varying vec2 vUv;
    uniform vec2 u_resolution;
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      gl_FragColor = vec4(uv, 0.0, 1.0);
    }
    const dpr = window.devicePixelRatio;
    requestAnimationFrame(loop);
  `;
  const badIssues = auditShaderSource(brokenShader, 'BadShader.tsx');
  assert(badIssues.some((i) => i.rule === 'webgl2-syntax-conflict'), 'detects WebGL1 keywords in #version 300 es');
  assert(badIssues.some((i) => i.rule === 'uncapped-dpr'), 'detects uncapped devicePixelRatio');
  assert(badIssues.some((i) => i.rule === 'shader-reduced-motion'), 'detects missing reduced motion');
  assert(badIssues.some((i) => i.rule === 'stretched-shader-uv'), 'detects stretched UVs');

  const cleanShader = `
    #version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform vec2 u_resolution;
    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      fragColor = vec4(p, 0.0, 1.0);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.hidden) requestAnimationFrame(loop);
  `;
  const goodIssues = auditShaderSource(cleanShader, 'GoodShader.tsx');
  assert(goodIssues.filter((i) => i.severity === 'error').length === 0, 'clean WebGL2 shader passes 0 errors');
  console.log('All audit-shaders checks passed.');
}

const args = process.argv.slice(2);
if (args[0] === 'test') {
  test();
  process.exit(0);
}

const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.log('Usage: node audit-shaders.mjs <dir|file> | test');
  process.exit(0);
}

const files = collectFiles(target);
const combined = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
let issues = auditShaderSource(combined, 'combined.bundle');
for (const f of files) {
  for (const issue of auditShaderSource(fs.readFileSync(f, 'utf8'), f)) {
    if (issue.rule === 'jsx-class-attr') issues.push({ ...issue, msg: `${path.basename(f)}: ${issue.msg}` });
  }
}
issues = [...new Map(issues.map((i) => [`${i.rule}:${i.msg}`, i])).values()];

if (issues.length === 0) {
  console.log('PASS (shader-motion mode): 0 issues found.');
} else {
  for (const i of issues) console.log(`[${i.severity.toUpperCase()}] (${i.rule}) ${i.msg}`);
  if (issues.some((i) => i.severity === 'error')) process.exit(1);
}
