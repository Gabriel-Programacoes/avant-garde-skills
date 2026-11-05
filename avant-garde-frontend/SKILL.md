---
name: avant-garde-frontend
description: Design and build distinctive, award-level frontend experiences (TypeScript) that avoid the generic "AI look". Use when the user asks for a website, portfolio, landing page, UI, design system, color palette, or visual direction, or wants an innovative/editorial/cinematic/Awwwards-style interface. Accepts user-provided style direction or palette and blends palettes, defines color tokens, typography, motion and interactions.
---

# Avant-Garde Frontend

Goal: produce interfaces with the craft of studios like Lusion, Darkroom Engineering, heydamir.design or ousmaneballondor.fr — cinematic scroll, expressive typography, WebGL, page transitions — never the default "AI template" look.

## 1. Intake & Autonomous Prompt Expansion (always first)

When the user sends a **short or simple request** (even 5 words like *"site para cafeteria"* or *"app com glassmorphism"*), **do not stall with questionnaires and never fall back to a generic template**. Autonomously expand the brief into a studio-grade specification:

| Input | If user gives it | If user prompt is simple / missing details |
|-------|------------------|--------------------------------------------|
| Purpose / audience | Use it | Infer from domain and state a sharp positioning thesis |
| Subject / content | Mine it for the concept (section 3.1) | Invent hyper-specific, realistic domain data (real coordinates, materials, technical metrics, prices, horarios) — never use "Lorem ipsum" or "Feature 1/2/3" |
| Light vs. Dark Polarity | Follow user choice | **Match the subject's natural light:** use **Sunlit Daylight / Warm Paper / Alabaster** for botanical, architecture, wellness, coffee, editorial, retail, daytime utilities; use **Obsidian / Night** for cinema, audio, night-vision, space, terminal |
| Style direction (e.g. "glassmorphism", "retro", "pixel", "minimal", "brutalist") | Translate via the **Anti-Slop Style Elevation Matrix (section 2.1)** | Run divergence (section 3.3) |
| Palette | Treat as source of truth; blend via section 4 | Generate via `scripts/palette.mjs` (`--light` for daylight themes) |
| Fonts & Stack | Use them | Pick from section 5 & section 7 |

User instructions override every default in this skill, including divergence and constraints — **but every requested style must be executed in its high-craft, anti-slop form (section 2.1).**

### 1.1 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Before choosing a palette, typography, or layout, **always run `node scripts/design-lock.mjs status <project-dir>`**:

1. **Screen 1 (Greenfield Project — `STATUS: GREENFIELD`):**
   - Extract every reusable UI widget (Custom Calendar, Slot Picker, Segmented Pill Switcher, Top Nav Pill, Metric Card, Modal/Drawer) into standalone, typed components inside `components/ui/<ComponentName>.tsx` — **never trap reusable widgets inline inside a single page file**.
   - Immediately after building Screen 1, lock the project's Design DNA and register its components:
     ```bash
     node scripts/design-lock.mjs scan <project-dir> --name "<project>" --archetype "<style>" --write
     ```
2. **Screen 2..N of the Same Project (`STATUS: LOCKED` or `UNLOCKED_EXISTING_UI`):**
   - **Zero Design Drift Law:** Do **not** run `history.md` anti-repetition or invent new colors, fonts, border-radii, or surface styles. Inherit 100% of the CSS custom properties (`tokens`) and `fonts` locked in `.ui-design-lock.json`.
   - **Mandatory Component Discovery & Reuse:** Before building any interactive widget (e.g., user asks for *"um calendário na tela 20"*, *"um seletor de abas"*, *"um cabeçalho"*), query the project registry first:
     ```bash
     node scripts/design-lock.mjs find <project-dir> <keyword>   # e.g. calendar, calendario, tabs, nav, card
     ```
   - If `MATCH_FOUND` is returned, **import and reuse that exact component** from `components/ui/`. If the new screen needs an extra capability (e.g., compact view or range selection), add an optional backward-compatible prop (`variant?: 'default' | 'compact'`) to the shared component rather than creating a second conflicting component.
   - If `NO_MATCH` is returned and the widget is reusable, create it in `components/ui/<ComponentName>.tsx` and register it with `node scripts/design-lock.mjs register <project-dir> --name <Name> --path components/ui/<Name>.tsx --tags <tags>`.
   - Verify continuity before finishing: `node scripts/design-lock.mjs verify <project-dir>`.

## 2. Anti-AI-look rules

Never ship these defaults unless the user asks:
- Purple/blue gradient hero, glassmorphism cards, glowing blobs.
- **AI "Pill / Tag Bubble Soup" (`anti-slop-pill-badge`):** Never wrap eyebrow headers, status labels, risk warnings, document codes, or section metadata inside pastel `border-radius: 999px` (`rounded-full`) capsules ("balõezinhos"). They are the #1 visual tell of LLM-generated UI. Use **naked monospace typography**, `1px` hairline dividers, `6px` geometric square/dot indicators (`■` / `●`), or left-border callout rules instead.
- Inter / Geist / Roboto everywhere; uniform 16px-rounded cards.
- Centered hero + 3 feature cards + testimonials + CTA template.
- Neutral gray palette with one safe accent; emoji icons; generic stock 3D.
- Equal spacing everywhere, no rhythm, no tension.
- This skill's own clichés when repeated: huge type + grain + marquee + custom cursor on every project is a template too.

Do instead (tools, not a checklist — use only what serves the concept):
- One strong concept per project (a metaphor: "stadium at night", "printed newspaper", "lab specimen").
- Broken / asymmetric grid, oversized type (10–25vw), deliberate negative space.
- One dominant bold color, not a polite palette.
- Motion that tells a story on scroll; transitions between pages; custom cursor where it adds meaning.
- Details: grain/noise texture, marquee, numbered sections, micro-copy with voice, sound toggle when fitting.

### 2.1 Layman-to-Studio Intent Translator (When the User Uses Non-Technical Words)
Most users do not know frontend or design jargon. They will ask for *"uma tela bonita e moderna"*, *"um site elegante"*, *"algo limpo e profissional"*, or *"um app divertido"*.
**Never punish a simple prompt with either (a) generic AI purple/Inter slop OR (b) harsh, illegible dark brutalism.** Translate layman words into studio-grade art direction automatically:

| What the User Says (Layman Prompt) | What They Actually Mean | Studio Direction to Build Automatically |
|------------------------------------|-------------------------|-----------------------------------------|
| **"Bonita e moderna" / "Limpa" / "Agradável"** | Easy to use, trustworthy, contemporary, visually warm, feels like a $50k agency product. | **Sunlit Architectural Daylight + Refractive Tactile Details:** Warm alabaster/stone surface (`oklch(97% 0.008 80)`), expressive serif + clean geometric sans (`Instrument Serif` + `Plus Jakarta Sans`), asymmetric bento layout (never 3 equal cards), 1 rich domain accent (sage, terracotta, cobalt, or amber), a floating optical-glass action bar, and an **interactive utility/simulator** right in the hero. |
| **"Elegante" / "Chique" / "Sofisticada" / "Premium"** | High perceived value, calm authority, boutique feel. | **Editorial Atelier / Quiet Luxury:** Creamy travertine or deep espresso velvet, high-contrast serif headlines, generous negative space, hairline 1px borders, subtle film texture, and smooth `expo.out` transitions. |
| **"Rápida" / "Prática" / "Produtiva" / "Sistema"** | Zero fluff, scannable, immediate feedback, professional tool. | **High-Craft Daylight or Obsidian Studio (Linear / Cron / Stripe style):** Crisp 1px surface hierarchy, `tabular-nums` metrics, inline search/filters, segmented pill switchers, and instant `<120ms` micro-interactions. |
| **"Divertida" / "Jovem" / "Gameficada"** | Energetic, tactile, rewarding to click. | **Tactile Pop & Physical Play:** High-chroma OKLCH accents on warm cream, physical buttons that depress `2px` on click, progress streaks, and spring physics. |
| **"Tecnológica" / "Futurista" / "Impactante"** | Cinematic, memorable, cutting-edge. | **Spatial Refractive UI or Interactive WebGL Stage:** Living light/shader canvas behind optical glass cards with 1px specular rims and kinetic counters. |

### 2.2 Anti-Slop Style Elevation Matrix (When User Requests Specific Technical Styles)
Never default to dark brutalism when the user asks for another aesthetic, and never ship the "AI slop" version of their requested style. Elevate every style to studio craft:

| Requested Style | Forbidden "AI Slop" Version | Mandatory Avant-Garde Execution |
|-----------------|-----------------------------|---------------------------------|
| **Glassmorphism / Spatial UI** | Milky `rgba(255,255,255,0.1)` cards floating over a purple/indigo blob background with thick white borders. | **Refractive Optical Acrylic (visionOS / Leica Glass):** Use `backdrop-filter: blur(16px) saturate(180%)`, directional 1px specular rim (`box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.65), inset 1px 0 0 oklch(100% 0 0 / 0.25)`), subtle surface grain, and place crisp geometric shapes/typography *behind* the lens so the refraction visibly bends real content. |
| **Pixel Art / 8-Bit / 16-Bit** | Pixel font slapped onto modern `border-radius: 16px` cards with blurry drop-shadows and smooth CSS gradients. | **Authentic Bitmap & Dither Craft (Playdate / Obra Dinn / PC-98):** Enforce `image-rendering: pixelated; -webkit-font-smoothing: none;`, zero smooth `border-radius` (use stepped pixel corners via `clip-path` or `box-shadow`), hard `4px 4px 0px` offset shadows, Bayer/checkerboard dithering patterns, and real bitmap fonts (`Silkscreen`, `Press Start 2P`, `VT323`). |
| **Retro / Vintage (70s / 80s / 90s)** | Random neon pink/cyan synthwave grid or generic sepia filter. | **Period-Accurate Industrial / OS Hardware:** Either **Dieter Rams 1970s Braun** (warm alabaster polycarbonate, recessed aluminum dials, orange/olive toggles) or **1984 Macintosh System 1 / NeXTSTEP / Win95** (beveled window chrome, 1-bit halftone patterns, crisp monochrome or phosphor amber). |
| **Minimal / Clean / Luxury** | Empty white page with centered Inter text and 3 generic Feather icons. | **Architectural High-Key Daylight:** Warm chalk/limestone paper (`oklch(97% 0.008 80)`), extreme typographic scale contrast (`11px` mono index vs `7vw` editorial serif), hairline rules, and tactile micro-interactions. |

## 3. Concept and divergence

The first idea is the average idea. Originality comes from content, divergence, constraints and iteration — not from a style list.

### 3.1 Concept from content
Before any visual decision, write 5 raw facts about the subject (history, materials, rituals, numbers, places, vocabulary, flaws). Build the concept metaphor from one of them. Example: a football player → "the stadium scoreboard"; an architect → "a blueprint being drawn"; a coffee brand → "the roasting curve".

### 3.2 Reference analysis
For each reference, extract: grid/layout model, type scale and pairing, color logic, motion signature, navigation model, the single "memorable moment". Reuse principles, never layouts or assets.

### 3.3 Divergence (when style is not fixed by the user)
Generate 3 concepts that differ on at least 3 of these axes: layout model, navigation, type, color logic, motion signature, interaction toy.
- **A — Bold but expected**: the strongest version of the obvious idea.
- **B — Unexpected**: built from a less obvious fact in 3.1.
- **C — Wild**: breaks a web convention (scroll direction, navigation, reading order).

Describe each in 3 lines (metaphor, visual rule, memorable moment). Let the user choose; if they want autonomy, pick B or C unless the context requires caution (e.g. banking, healthcare). Mixing elements from several concepts is allowed.

### 3.4 Constraint draw
Run `node scripts/constraints.mjs 2` for default high-beauty, usability-safe studio craft rules (ideal when the user asks for a "modern, beautiful, clean, or commercial" screen). Pass `--wild` (`node scripts/constraints.mjs 2 --wild`) only when the project calls for experimental, convention-breaking art direction. Redraw once if a constraint conflicts with the brief or accessibility.

### 3.5 Anti-repetition memory
Read `history.md` in this skill folder before choosing a direction. Do not reuse a metaphor, display font, dominant hue (±20°) or signature interaction from the last 5 entries unless the user asks. After the project, append one line:
`YYYY-MM-DD | project | metaphor | style | display font | dominant oklch | signature interaction`
If the skill folder is not writable, use `.design/history.md` in the project.

### 3.6 Starting points (mutate, never use as-is)
Combine two, or take one and change at least 2 axes from 3.3.
- **Editorial Swiss**: strict grid, huge grotesk, black/white + 1 signal color, hairline rules.
- **Neo-Brutalist**: raw borders, mono fonts, clashing colors, visible structure, hard shadows.
- **Cinematic Dark**: near-black, WebGL scene, film grain, slow scroll-driven reveals, serif display.
- **Sports Hype** (ousmaneballondor-like): giant condensed type, team colors, kinetic counters, video/3D hero, stats as heroes.
- **Luxury Minimal**: warm off-white, refined serif, extreme whitespace, slow easing.
- **Retro-Future / Y2K**: chrome, acid colors, pixel or wide fonts, CRT shaders.
- **Organic / Tactile**: paper textures, earthy tones, hand-drawn SVG, soft physics.

### 3.7 Structural Archetype Diversity (Anti-Template Monoculture Rule)
**NEVER repeat the same structural formula across projects.** The common failure mode is changing colors/fonts while replicating the exact same page anatomy:
`[Navbar] -> [Centered Hero with Big Title + Subtitle] -> [3 Equal KPI Cards in a row] -> [1 Big Chart] -> [1 Simulator at the bottom]`.
This makes every system look like a cloned SaaS marketing page disguised as software.

Before structuring a screen, explicitly choose one of 5 distinct structural archetypes matching the domain:
1. **Institutional Command Desk (Bloomberg / Aladdin / Linear Workbench)**:
   - **Zero marketing hero fluff.** Launches immediately into functional operations.
   - **Top Precision Ribbon**: Market indices, operational status, world financial clocks, monumental NAV ticker.
   - **Asymmetric Multi-Panel Grid**: 300px ledger waterfall | 1fr orderbook & dynamic stress surface | 380px execution & custody desk.
   - Ideal for: Financial terminals, RWA desks, developer tools, trading cockpits, mission control.
2. **Asymmetric Split Dossier (Perplexity Pro / Substack / Editorial Audit)**:
   - 40/60 or 45/55 persistent inspection pane on left, reactive document/evidence feed on right.
   - Inline annotations, deep footnotes, zero equal-spaced card grids.
   - Ideal for: Legal systems, medical patient dossiers, code reviews, investigative data journalism.
3. **Tactile Modular Deck (Teenage Engineering / Braun / Playdate OS)**:
   - Vertically stacked physical hardware rack with analog dials, stepped sliders, toggle switches.
   - 100dvh pocket-safe layout, rotary scrubbers, Web Audio mechanical relay acoustics.
   - Ideal for: Audio synthesis, creative utilities, mobile pocket tools, hardware controllers.
4. **Spatial Canvas & Contextual Inspector (Figma / Miro / Node Graphs)**:
   - Fluid interactive workspace with floating micro-tool docks, minimap, and contextual properties panel appearing only on selection.
   - Ideal for: Visual builders, diagramming, strategy maps, workflow orchestrators.
5. **Editorial Longform Investigation (NYT Graphics / The Pudding)**:
   - Monumental editorial typography scale, narrative scroll-driven transitions, inline Tufte margin plots.
   - Ideal for: Publishing, public reports, longform research, brand manifestos.

State the chosen structural archetype in one line before building layout.

State the chosen concept in one line: metaphor + visual rule + drawn constraints + memorable moment.

## 4. Color system

### 4.1 Generating from scratch
1. Choose a **dominant** hue tied to the concept (not purple by default).
2. Build in **OKLCH** (perceptually uniform). Ramp of 11 steps (50–950) by varying L, keeping hue, lowering chroma at extremes.
3. Add: `ink` (text), `paper` (background), `accent` (complementary or split-complementary to dominant), `signal` (one high-chroma pop for CTAs/highlights).
4. Ratio guide: 60% paper, 30% ink/dominant, 10% accent+signal. Break it on purpose for hero moments.

### 4.2 Blending user palettes
When the user gives two or more palettes or brand colors:
1. Convert all to OKLCH.
2. Keep the user's primary brand color exact as `dominant`.
3. Mix in OKLCH (`color-mix(in oklch, A x%, B)`) to create bridge tones; never mix in sRGB (muddy).
4. Harmonize: shift secondary hues toward a shared temperature (warm or cool) by ≤15°.
5. Derive neutrals by tinting gray with the dominant hue at low chroma (≈0.01–0.02 OKLCH; no pure #888).
6. Show the result as a token table: name, OKLCH, hex, usage.

### 4.3 Palette tool (use it, do not guess color math)
`scripts/palette.mjs` (Node 18+, zero dependencies) lives next to this file. Run it from the skill directory:
```bash
node scripts/palette.mjs info "#e63946"                 # hex + oklch + sRGB gamut check
node scripts/palette.mjs ramp "#e63946" brand            # 11-step ramp as CSS vars
node scripts/palette.mjs ramp "#e63946" gray --neutral   # tinted neutral ramp
node scripts/palette.mjs surfaces "#e63946"              # dark surface elevation + text tokens
node scripts/palette.mjs mix "#0a0a0a" "#e63946" 5       # OKLCH bridge tones
node scripts/palette.mjs contrast "#1a1a1a" "#f5f0e8"    # WCAG 2 ratio + APCA Lc
node scripts/palette.mjs test                            # self-check
```
Ramp steps beyond sRGB are chroma-clamped automatically. If Node is unavailable, use CSS `color-mix(in oklch, …)` and state that contrast is unverified.

### 4.4 Accessibility (WCAG 2 + APCA)
- Body text contrast ≥ 4.5:1 WCAG AA and `|Lc| ≥ 75` APCA (`|Lc| ≥ 60` for subheadings, `|Lc| ≥ 45` for large display/UI parts). Verify every text/background pair with `contrast`. Fix by adjusting L, not hue.
- Never encode meaning in color alone.
- Provide a `prefers-color-scheme` dark variant when relevant. Do not invert the light theme; re-tune L and lower chroma.

### 4.5 Token output (CSS)
```css
:root {
  --paper: oklch(97% 0.01 85); /* #f8f5ee */
  --ink: oklch(18% 0.02 85); /* #161107 — 17.3:1 on paper */
  --dominant: oklch(62% 0.21 28); /* #ea3d35 — 3.7:1 on paper: large text/UI only */
  --accent: oklch(70% 0.11 200); /* #2bb3b9 */
  --signal: oklch(88% 0.2 120); /* #c8e928 */
  --bridge: color-mix(in oklch, var(--dominant) 50%, var(--accent));
}
```
Always add a hex fallback comment next to each token. Expose the same tokens to Tailwind v4 via `@theme` if Tailwind is used:
```css
@import "tailwindcss";
@theme {
  --color-paper: oklch(97% 0.01 85);
  --color-ink: oklch(18% 0.02 85);
  --color-dominant: oklch(62% 0.21 28);
  --font-display: "Your Display", serif;
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 5. Typography

- Pair one **display** font with personality + one **text** font that is readable.
- Sources: Pangram Pangram, Displaay, Velvetyne (OFL), Collletttivo (free), Google Fonts beyond defaults (e.g. Bricolage Grotesque, Instrument Serif, Space Grotesk, Unbounded, Fraunces, Syne, Anton, Big Shoulders).
- Prefer variable fonts; animate `font-variation-settings` (weight/width) on scroll or hover.
- Fluid scale with `clamp()`; display sizes in `vw`. Tight leading (0.85–0.95) for display, 1.5 for body.
- Split text (GSAP SplitText / Splitting.js) for line/char reveals.
- Check the font license before shipping. Pangram Pangram and Displaay are free only for personal use; commercial projects need a paid license. Velvetyne (OFL), Fontshare and Google Fonts are free for commercial use.
- **Zero-friction CDN pairings (ready for `<link>` when local font files are absent):**
  - *Fontshare (`https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap`)*: `Clash Display`, `Cabinet Grotesk`, `Zodiak`, `Panchang`, `General Sans`, `Satoshi`, `Switzer`.
  - *Google Fonts*: `Instrument Serif` + `Bricolage Grotesque`, `Syne` + `Plus Jakarta Sans`, `Unbounded` + `Space Mono`, `Fraunces` + `JetBrains Mono`.
- Self-host fonts (`next/font/local` or `@font-face` + `font-display: swap`) and preload the display font.

## 6. Motion and interaction

Principles: motion has intent (reveal hierarchy, guide eye, give feedback). Use custom easing (`expo.out`, `power4.inOut`, `cubic-bezier(0.16, 1, 0.3, 1)`), never linear UI motion. Respect `prefers-reduced-motion` always.

### 6.0 The 2-Tier Living Motion Law (Never Ship a Static PDF)
A user should **never** have to say *"com animações"* to receive a living interface. `audit-ui.mjs` enforces the `static-dead-ui` rule and will reject any screen lacking choreography and tactile states:

1. **Tier 1 — Baseline Living UI (Mandatory on 100% of screens, even simple prompts):**
   - **Staggered Entrance Reveal:** Cards, headlines, and panels enter with a staggered `cubic-bezier(0.16, 1, 0.3, 1)` keyframe (`translateY(14px) -> 0`, `opacity: 0 -> 1`, `--delay: 60ms * i`).
   - **Sliding Pill Indicator:** Segmented controls and tab bars use a smoothly gliding active indicator (`transform: translateX(...)` with spring easing) instead of abrupt background swaps.
   - **Live Numeric Interpolation (`requestAnimationFrame`):** Hero KPIs, prices, and percentages count up on initial load and interpolate smoothly whenever the user switches tabs, protocols, or dates.
   - **Living SVG & Status Beacons:** SVG curves draw in via `stroke-dashoffset` animation and active status indicators pulse (`@keyframes beaconPulse`).
   - **Tactile Hover & Press Physics:** Cards elevate on `:hover` (`translateY(-2px)` + border/shadow luminance shift), track cursor spotlight (`--mx`, `--my`), and buttons compress (`scale(0.97)`) on `:active`.
2. **Tier 2 — Kinetic Choreography (Triggered when user asks for *"com animações"*, *"animado"*, *"dinâmico"*, *"interativo"*):**
   - **Split-Word / Mask Reveal Headlines:** Words rise from `overflow: hidden` masks on load/scroll.
   - **Web Animations API (`el.animate`) State Morphing:** Switching protocols, tabs, or calendar days triggers a spring-physics card morph (`scale(0.985) -> 1`, `translateY(6px) -> 0`).
   - **Pointer-Reactive 3D Tilt & Ambient Light Drift:** Bento cards respond to pointer coordinates with subtle perspective tilt (`rotateX`/`rotateY` ≤ 2.5deg) and radial specular sheen.

Toolbox:
- **GSAP** (+ ScrollTrigger, SplitText, Flip, MorphSVG — all free) for timelines and scroll.
- **Lenis** for smooth scroll (sync with ScrollTrigger).
- **Motion** (motion.dev) for React layout/gesture animation.
- **Barba.js / Taxi.js** or **View Transitions API** for page transitions.
- **Three.js / React Three Fiber / drei / postprocessing**, **OGL**, **curtains.js** for WebGL; **TSL/WebGPU** for shaders in TS.
- **Theatre.js** for choreographed 3D timelines; **Rive** for interactive vector animation.
- **Spline / Unicorn Studio / Shadergradient** for quick 3D/shader assets.
- Component inspiration: React Bits, Cult UI, Skiper UI, Animata (adapt, never paste as-is). Headless logic: Base UI / Radix primitives styled from scratch.

Signature interaction ideas (pick 2–4, not all): scroll-pinned storytelling sections, image distortion shader on hover, magnetic buttons, custom cursor with context labels, kinetic marquee, horizontal scroll gallery, preloader with count-up, scroll-velocity skew, mask/clip-path reveals, sticky stacked cards, WebGL hero reacting to mouse.

### 6.1 Base setup: GSAP + Lenis + reduced motion (React/Next.js)
```tsx
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```
- In components, use `useGSAP()` from `@gsap/react` with a `scope` ref so animations are cleaned up on unmount.
- Wrap animations in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. In the reduced branch, show final states or simple fades.
- Animate only `transform` and `opacity` (plus `clip-path` and filters sparingly). Never animate `width`, `height`, `top` or `left` on scroll.
- Custom cursor and hover effects only on `(hover: hover) and (pointer: fine)`. Keep the native cursor available for text inputs.

## 7. Default stack

Next.js (App Router) or Astro + TypeScript strict + Tailwind v4 (tokens via CSS vars) + GSAP + Lenis + React Three Fiber (only if 3D adds value). Vue alternative: Nuxt + TresJS.

Performance budget: LCP < 2.5s, lazy-load WebGL after first paint, `dpr` capped at 2, compress textures (KTX2/WebP/AVIF), pause render loops off-screen.

### 7.1 Assets
Code alone gives abstract shapes. Real impact comes from art direction:
- Prefer the user's real photos, video, logos and data. Ask for them early.
- If an image generation tool is available, generate textures, posters or hero art in the project's palette and concept. Keep one consistent visual style across all generated assets.
- Spline (exported scene) or a hand-made Three.js scene for 3D; procedural shaders (noise, displacement, dithering) for backgrounds.
- Treat images: duotone with the palette, halftone, grain, crop aggressively. Untreated stock photos look generic.
- **Zero-Asset Fallback (when user provides no photos):** Never leave empty colored boxes. Combine kinetic typography with an inline SVG film-grain overlay and procedural canvas/SVG geometry:
  ```tsx
  export function TactileGrain({ opacity = 0.045 }: { opacity?: number }) {
    return (
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 h-full w-full" style={{ opacity }}>
        <filter id="ag-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ag-grain)" />
      </svg>
    );
  }
  ```

## 8. Workflow

1. **Intake** (section 1). Output: brief in 3–5 lines.
2. **Concept**: facts → divergence (3 concepts) → constraint draw → history check (section 3).
3. **System**: color tokens table (generated and checked with `scripts/palette.mjs`), type pairing + scale, spacing/grid, motion easing tokens.
4. **Structure**: section list with the signature interaction for each.
5. **Build**: tokens first, then layout, then motion, then assets/WebGL/polish.
6. **Visual loop** (section 9): screenshot, score, fix. Repeat until the bar is met or 3 rounds pass.
7. **Verify**: contrast of every text/background pair, reduced-motion fallback, visible keyboard focus, semantic HTML and alt text, mobile layout (motion simplified, not removed), Lighthouse performance.
8. **Record**: append the line to `history.md` (section 3.5).
9. **Present**: short summary of decisions and final scores; offer 1–2 bolder variations.

Scope modes:
- **Design only** (user asks for palette, direction or design system): stop after step 4 and deliver the spec; still record history.
- **Existing project**: reuse its stack, components and tokens. Introduce the new direction through tokens and motion; do not rewrite the app.
- **Full build**: all steps.

## 9. Visual loop and quality bar

Never judge a design from code alone. Look at it.

### 9.1 Computational Audit & Capture
First run the static and live DOM auditor to catch slop gradients, missing OKLCH tokens, horizontal overflow, or generic default fonts:
```bash
node scripts/audit-ui.mjs ./src --mode web
node scripts/audit-ui.mjs http://localhost:3000 --mode web
```
Then capture screenshots via the agent's browser tool or Playwright:
```bash
npx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 http://localhost:3000 shot-desktop.png
npx playwright screenshot --viewport-size=390,844 --full-page --wait-for-timeout=2500 http://localhost:3000 shot-mobile.png
```
(First run may need `npx playwright install chromium`.) Open the images and critique them. Scroll-driven states need extra captures or a short browser session; full-page shots show only the initial state of animations.

### 9.2 Score (1–5 each, be harsh)
| Criterion | 5 means |
|-----------|---------|
| Concept clarity | The metaphor is readable without explanation |
| Originality | Could not be mistaken for a template or for the last 5 history entries |
| Typography | Distinct pairing, dramatic scale, clean rhythm |
| Color | Dominant color has intent; palette feels owned, contrast passes |
| Composition | Tension, hierarchy and negative space are deliberate |
| Motion / interaction | Has intent, a memorable moment, smooth at 60 fps |
| Craft | No overflow, misalignment, broken mobile, or default focus/scroll glitches |

Ship only if every criterion ≥ 4 and originality = 5. Otherwise fix the lowest score first and capture again. Report the final scores honestly; if 3 rounds do not reach the bar, say what blocks it (usually missing assets or content).
