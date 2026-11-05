#!/usr/bin/env node
// Starts a local HTTP server for `evals/`, runs static + live computational audits,
// and captures Playwright screenshots asynchronously so the HTTP event loop never blocks.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const EVALS_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.dirname(EVALS_DIR);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const cleanUrl = (req.url || '/').split('?')[0];
  const filePath = path.join(EVALS_DIR, cleanUrl.endsWith('/') ? `${cleanUrl}index.html` : cleanUrl);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
  res.end(fs.readFileSync(filePath));
});

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  console.log(`Server listening on http://127.0.0.1:${port}`);

  try {
    console.log('\n--- 1. Static Source Audits ---');
    const { stdout: webAudit } = await execFileAsync('node', [
      path.join(ROOT_DIR, 'avant-garde-frontend/scripts/audit-ui.mjs'),
      path.join(EVALS_DIR, 'web-kronos'),
      '--mode',
      'web',
    ]);
    console.log('web-kronos:', webAudit.trim());

    const { stdout: deskAudit } = await execFileAsync('node', [
      path.join(ROOT_DIR, 'avant-garde-desktop/scripts/audit-ui.mjs'),
      path.join(EVALS_DIR, 'desktop-hexrack'),
      '--mode',
      'desktop',
    ]);
    console.log('desktop-hexrack:', deskAudit.trim());

    const { stdout: shaderAudit } = await execFileAsync('node', [
      path.join(ROOT_DIR, 'avant-garde-motion-shaders/scripts/audit-shaders.mjs'),
      path.join(EVALS_DIR, 'motion-shaders-aether'),
    ]);
    console.log('motion-shaders-aether:', shaderAudit.trim());

    const { stdout: vizAudit } = await execFileAsync('node', [
      path.join(ROOT_DIR, 'avant-garde-data-viz/scripts/audit-dataviz.mjs'),
      path.join(EVALS_DIR, 'data-viz-observatory'),
    ]);
    console.log('data-viz-observatory:', vizAudit.trim());

    const { stdout: mobAudit } = await execFileAsync('node', [
      path.join(ROOT_DIR, 'avant-garde-mobile-tactile/scripts/audit-mobile.mjs'),
      path.join(EVALS_DIR, 'mobile-tactile-field'),
    ]);
    console.log('mobile-tactile-field:', mobAudit.trim());

    console.log('\n--- 2. Capturing Screenshots via Headless Edge ---');
    const edgePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    const edgeBin = edgePaths.find((p) => fs.existsSync(p));

    const shots = [
      ['1440,900', `http://127.0.0.1:${port}/web-kronos/index.html`, path.join(EVALS_DIR, 'shot-web-desktop.png')],
      ['390,844', `http://127.0.0.1:${port}/web-kronos/index.html`, path.join(EVALS_DIR, 'shot-web-mobile.png')],
      ['1440,900', `http://127.0.0.1:${port}/desktop-hexrack/index.html`, path.join(EVALS_DIR, 'shot-desktop-app.png')],
      ['1440,900', `http://127.0.0.1:${port}/motion-shaders-aether/index.html`, path.join(EVALS_DIR, 'shot-shader-desktop.png')],
      ['1440,900', `http://127.0.0.1:${port}/data-viz-observatory/index.html`, path.join(EVALS_DIR, 'shot-dataviz-desktop.png')],
      ['390,844', `http://127.0.0.1:${port}/data-viz-observatory/index.html`, path.join(EVALS_DIR, 'shot-dataviz-mobile.png')],
      ['390,844', `http://127.0.0.1:${port}/mobile-tactile-field/index.html`, path.join(EVALS_DIR, 'shot-mobile-tactile.png')],
    ];

    for (const [vp, url, out] of shots) {
      await execFileAsync(
        'npx.cmd',
        ['playwright', 'screenshot', '--channel=msedge', `--viewport-size=${vp}`, '--wait-for-timeout=600', url, out],
        { timeout: 25000, shell: true }
      );
      console.log(`Saved: ${path.basename(out)} (${fs.statSync(out).size} bytes)`);
    }
  } catch (err) {
    console.error('Benchmark error:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
