---
name: avant-garde-motion-shaders
description: Design and engineer award-level WebGL2/GLSL shaders, procedural post-processing (Bayer dithering, liquid domain warping, raymarched SDFs, chromatic dispersion), spring physics, and scroll-driven choreography (GSAP, Lenis, View Transitions) in TypeScript. Use when the user asks for shaders, WebGL backgrounds, interactive canvas visuals, custom cursor physics, scroll-pinned animations, page transitions, or Lusion/Active Theory/Unicorn Studio-level motion craft.
---

# Avant-Garde Motion & Shaders

Goal: engineer 60fps procedural shaders and choreographed motion with the technical precision of Lusion, Active Theory, Darkroom Engineering, and Resn — aspect-correct GLSL, OKLCH color math in shaders, zero-leak WebGL2 lifecycles, velocity-reactive scroll, and tactile spring physics. Never ship generic floating purple blobs, uncapped Retina render loops, or broken GLSL.

## 1. Intake & Motion Brief

Extract from the user request. Ask only what is blocking; otherwise pick a bold default and state it.

| Input | If user gives it | If missing |
|-------|------------------|------------|
| Visual Role (Hero stage, interactive background, post-process lens, transition, UI micro-physics) | Use it | Hero stage + interactive pointer field |
| Shader / Motion Archetype (Dither/Halftone, Liquid Domain Warp, Raymarched SDF, Scroll/FLIP, Spring Field) | Follow strictly | Run divergence (section 3.2) |
| Input Driver (Pointer velocity, Scroll progress, Audio FFT, Autonomous time, Click impulse) | Use it | Pointer velocity + autonomous time |
| Color Tokens (OKLCH / hex palette) | Convert via `scripts/palette.mjs` & pass as `vec3` uniforms | Generate via `scripts/palette.mjs` |
| Performance Target (Mobile-safe 60fps, Desktop studio, Ultra-light 2D/SVG) | Use it | Cap DPR at 2.0 (1.5 on mobile), auto-pause offscreen |

User instructions override every default in this skill.

### 1.1 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Always run `node scripts/design-lock.mjs status <project-dir>` before starting:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract reusable shader/motion primitives into `components/ui/<Name>.tsx` and run `node scripts/design-lock.mjs scan <project-dir> --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Inherit all locked OKLCH tokens/fonts from `.ui-design-lock.json`, query `node scripts/design-lock.mjs find <project-dir> <keyword>` before building any widget, reuse registered components, and run `node scripts/design-lock.mjs verify <project-dir>`.

---

## 2. Anti-Slop Shader & Motion Laws

Never ship these amateur motion or WebGL failure modes:
- **No stretched UVs:** Never use `gl_FragCoord.xy / u_resolution.xy` directly for shapes without aspect-ratio correction (`(gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y)`).
- **No WebGL1 / WebGL2 syntax soup:** Never mix `#version 300 es` with `varying`, `attribute`, `gl_FragColor`, or `texture2D`. Standardize on clean **WebGL2 (`#version 300 es`)** with `in`, `out vec4 fragColor`, and `texture()`.
- **No uncapped Retina GPU drain:** Always clamp device pixel ratio: `const dpr = Math.min(window.devicePixelRatio || 1, 2);`.
- **No zombie render loops:** Every `requestAnimationFrame` loop must pause when off-screen (`IntersectionObserver`), when the tab/window is hidden (`document.hidden`), and clean up (`cancelAnimationFrame` + `gl.getExtension('WEBGL_lose_context')`) on unmount.
- **No raw mouse coordinates in shaders:** Raw `mousemove` jumps between frames. Always damp pointer coordinates with frame-rate independent exponential decay (`lerp(current, target, 1.0 - exp(-decay * dt))`).
- **No ignored `prefers-reduced-motion`:** Pass `u_reduced` (`0.0` or `1.0`) into shaders so reduced-motion users see a calm, high-craft static composition instead of faststrobing or dizzying distortion.
- **No generic AI plasma blobs:** Avoid aimless 3-color sine-wave gradients. Every shader needs a tactile surface rule (ordered Bayer dithering, halftone cells, crisp SDF contours, refractive caustics, or analog scanline grain).

---

## 3. Five Shader & Choreography Archetypes

### 3.1 Archetypes
1. **Ordered Bayer Dithering & Editorial Halftone:**
   - Quantizes continuous lighting or SDF gradients through an 8x8 or 4x4 Bayer threshold matrix or rotated CMYK halftone grid.
   - Aesthetic: 1-bit/2-bit architectural blueprint, screenprinted zine, Teenage Engineering monochrome OLED.
2. **Liquid Domain Warping & Chromatic Dispersion:**
   - Nested Fractal Brownian Motion (`fbm(p + fbm(p + u_time))`) driven by damped pointer velocity and ring ripples, with subtle RGB wavelength offset along surface normals.
   - Aesthetic: Dark mercury, refractive obsidian glass, ink-in-water laboratory.
3. **Raymarched SDF Monoliths (Zero-Polygon 3D):**
   - Analytic Signed Distance Fields (torus, box, octahedron, gyroid) blended with smooth minimum (`smin`), lit with analytic normals, Fresnel rim glow, and ambient occlusion.
   - Aesthetic: Brutalist kinetic sculpture, liquid metal artifacts, precision CAD solid modeling.
4. **Kinetic Scroll & Clip-Path Choreography:**
   - Scroll velocity drives typographic skew/stretch (`font-variation-settings` + `transform: skewY()`), while sections pin and reveal through geometric `clip-path: polygon(...)` wipes.
5. **Tactile Spring & Magnetic Vector Fields:**
   - A 2D grid of hairlines, glyphs, or particles that deflect elastically around the cursor with Hooke's law + velocity damping and snap back with harmonic overshoot.

### 3.2 Constraint Draw & Anti-Repetition
1. Read `history.md` in this skill folder. Do not reuse the same shader archetype, dominant hue (±20°), or primary input driver from the last 5 entries.
2. Draw 2 constraints before coding:
   ```bash
   node scripts/shader-constraints.mjs 2 --domain <editorial|brutalist|luxury|cyber|audio>
   ```
3. After building and verifying, append one line to `history.md`:
   `YYYY-MM-DD | project | archetype | input driver | dominant oklch | post-fx | fps/audit status`

---

## 4. Production WebGL2 Runner (Zero-Dependency, Leak-Free)

Use this battle-tested WebGL2 quad runner. It handles DPR clamping, resize observation, exponential pointer damping, off-screen suspension, and reduced-motion automatically:

```tsx
import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

export function ShaderStage({
  fragmentSource,
  className = 'w-full h-full block',
}: {
  fragmentSource: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uPointer = gl.getUniformLocation(prog, 'u_pointer');
    const uVelocity = gl.getUniformLocation(prog, 'u_velocity');
    const uReduced = gl.getUniformLocation(prog, 'u_reduced');

    let rafId = 0;
    let isVisible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1.0 : 0.0;
    const targetPtr = { x: 0.5, y: 0.5 };
    const curPtr = { x: 0.5, y: 0.5 };
    let vel = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      targetPtr.x = (e.clientX - r.left) / Math.max(1, r.width);
      targetPtr.y = 1.0 - (e.clientY - r.top) / Math.max(1, r.height);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let lastTime = performance.now();
    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) * 0.001);
      lastTime = now;

      if (isVisible && !document.hidden) {
        const k = 1.0 - Math.exp(-10.0 * dt);
        const dx = targetPtr.x - curPtr.x;
        const dy = targetPtr.y - curPtr.y;
        curPtr.x += dx * k;
        curPtr.y += dy * k;
        vel = vel * 0.9 + Math.hypot(dx, dy) * 8.0 * 0.1;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, reduced ? 12.4 : now * 0.001);
        gl.uniform2f(uPointer, curPtr.x, curPtr.y);
        gl.uniform1f(uVelocity, reduced ? 0.0 : vel);
        gl.uniform1f(uReduced, reduced);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!reduced) rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [fragmentSource]);

  return <canvas ref={canvasRef} className={className} />;
}
```

---

## 5. Modular GLSL Toolkit (WebGL2 `#version 300 es`)

Compose fragment shaders from these verified building blocks:

```glsl
#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_velocity;
uniform float u_reduced;

// 1. Aspect-Corrected Centered Coordinates (-0.5..0.5 on shortest axis)
vec2 aspectUv(vec2 uv, vec2 res) {
  return (uv - 0.5) * vec2(res.x / min(res.x, res.y), res.y / min(res.x, res.y));
}

// 2. OKLCH to linear/gamma sRGB directly inside GLSL
vec3 oklch2rgb(float L, float C, float H_deg) {
  float h = radians(H_deg);
  float a = C * cos(h);
  float b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;
  vec3 lin = vec3(
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
  return pow(clamp(lin, 0.0, 1.0), vec3(1.0 / 2.2));
}

// 3. Fast 2D Value Noise & 4-Octave FBM for Domain Warping
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return v;
}

// 4. Smooth Minimum for Raymarched / 2D SDF Blending
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// 5. 4x4 Ordered Bayer Dithering Matrix (Crisp Tactile Quantization)
float bayer4x4(vec2 fragCoord) {
  ivec2 p = ivec2(mod(fragCoord, 4.0));
  int idx = p.y * 4 + p.x;
  int m[16] = int[16](
     0,  8,  2, 10,
    12,  4, 14,  6,
     3, 11,  1,  9,
    15,  7, 13,  5
  );
  return (float(m[idx]) + 0.5) / 16.0;
}
```

---

## 6. Tactile Spring & Scroll Choreography Recipes

### 6.1 Frame-Rate Independent Spring Solver (Hooke + Damping)
Use for magnetic buttons, cursor followers, and draggable physics elements without external heavy physics engines:
```ts
export class Spring2D {
  x: number; y: number; vx = 0; vy = 0;
  constructor(x = 0, y = 0, public stiffness = 280, public damping = 22) {
    this.x = x; this.y = y;
  }
  step(targetX: number, targetY: number, dt: number) {
    const safeDt = Math.min(dt, 0.033);
    const ax = -this.stiffness * (this.x - targetX) - this.damping * this.vx;
    const ay = -this.stiffness * (this.y - targetY) - this.damping * this.vy;
    this.vx += ax * safeDt;
    this.vy += ay * safeDt;
    this.x += this.vx * safeDt;
    this.y += this.vy * safeDt;
  }
}
```

### 6.2 Scroll-Velocity Skew & Variable Font Stretch
Map scroll velocity to subtle typographic tension (clamped to `[-6deg, 6deg]` so text stays legible):
```ts
const skewDeg = Math.max(-6, Math.min(6, scrollVelocity * 0.08));
element.style.transform = `translate3d(0,0,0) skewY(${skewDeg.toFixed(2)}deg)`;
```

---

## 7. Workflow & Computational Shader Audit

1. **Intake & History Check**: Read `history.md` and run `node scripts/shader-constraints.mjs 2 --domain <domain>`.
2. **Palette & OKLCH Uniforms**: Generate colors with `node scripts/palette.mjs` and pass exact L, C, H values into `oklch2rgb()` inside GLSL so WebGL canvas colors match DOM CSS tokens seamlessly.
3. **Build Shader + Choreography**: Implement WebGL2 fragment shader + DOM overlay with DPR clamp, pointer damping, and `prefers-reduced-motion` uniform.
4. **Computational Shader Audit**:
   Run `scripts/audit-shaders.mjs` against the source folder and live URL:
   ```bash
   node scripts/audit-shaders.mjs ./src
   node scripts/audit-shaders.mjs http://localhost:3000
   ```
   Verifies WebGL2 syntax consistency, DPR cap, RAF cleanup, reduced-motion handling, aspect-ratio correction, and zero live WebGL compilation errors (`gl.getError() === 0`).
5. **Visual Loop & Multi-Frame Verification**: Capture screenshots at `1440x900` and `390x844` and verify contrast of overlaid typography against the live shader canvas.
6. **Record History**: Log the build in `history.md`.
