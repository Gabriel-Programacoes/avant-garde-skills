# Avant-Garde Skills Suite

<p align="center">
  <img src="assets/avant-garde-banner.png" alt="Avant-Garde Skills Suite" width="100%" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills: 7](https://img.shields.io/badge/Skills-7%20Active-emerald)](package.json)
[![Auditors: Zero--Dep](https://img.shields.io/badge/Auditors-Zero--Dependency-orange)](package.json)
[![Tests: Passing](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen)](package.json)

> **The Studio-Grade UI/UX Intelligence Suite for AI Coding Agents.**  
> Compatible with **Google Gemini CLI / Antigravity (AGY)**, **Claude Code**, **OpenAI Agents**, and **Codex**.

Replaces generic "AI slop" — purple/indigo gradients, floating pastel pill badges, empty chatbot boxes, and dark brutalism forced on every project — with **award-level art direction, APCA contrast, aspect-correct WebGL2 shaders, zero-asset Web Audio synthesis, and multi-screen design lock**.

---

## ⚡ Quick Start (Instant Installation via `npx`)

Install all 7 skills directly into your detected agent directories (`~/.gemini/skills`, `~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`) with a single command:

```bash
# Direct run via npm package
npx avant-garde-skills

# Or run directly from GitHub without installing anything
npx github:Gabriel-Programacoes/avant-garde-skills
```

### Install Specific Skills or Target a Specific Agent
```bash
# Install only frontend and AI-UX to Claude Code
npx avant-garde-skills install avant-garde-frontend avant-garde-ai-ux --agent claude

# Install all skills into a custom folder or project repo
npx avant-garde-skills install --dest ./my-project/.agent/skills

# List all available skills and descriptions
npx avant-garde-skills list
```

---

## 🥊 The Proof: Before vs. After (Same Exact Prompt)

Prompt given to the AI:  
> *"Crie uma plataforma moderna e elegante de gestão patrimonial e investimentos privados (Private Wealth & RWA), com visão de rendimento, alocação de carteira e simulador de liquidez."*

### ❌ Without Avant-Garde (Typical AI Slop)
*Inter font everywhere, generic purple/indigo glow blobs, floating pastel pill badges (`border-radius: 9999px`), 3 identical cards, fake sparkle icons (`✨`), static dead SVG.*

![Without Avant-Garde (AI Slop)](evals/comparison-showcase/shot-without-skill.png)

### ✅ With Avant-Garde Skills (Award-Level Studio Craft)
*Warm limestone alabaster ground, `Instrument Serif` + `Plus Jakarta Sans` + `JetBrains Mono` (`tabular-nums`), zero pill badges (naked monospace ledgers + hairline rules), real RWA asset classes, live interactive yield simulator with 60fps rAF interpolation, and zero-asset Web Audio procedural acoustic feedback.*

![With Avant-Garde (Studio Craft)](evals/comparison-showcase/shot-with-skill.png)

| Aspect | Without Avant-Garde (Default LLM) | With Avant-Garde Suite |
|---|---|---|
| **Color Space** | Generic RGB/Tailwind `#0f172a` + purple-indigo gradient | Perceptually uniform OKLCH daylight limestone + forest pine |
| **Typography** | Default `Inter` across all headings and labels | Expressive `Instrument Serif` + `Plus Jakarta Sans` + `JetBrains Mono` |
| **Status / Tags** | Pastel pill/badge bubbles ("balõezinhos" `border-radius: 9999px`) | Architectural naked ledgers, hairline dividers, 6px solid squares (`■`) |
| **Numeric Telemetry** | Plain text that jitters during updates | Fixed `tabular-nums` with smooth 60fps `requestAnimationFrame` ticker |
| **Interactivity** | Static dead mockups with dummy cards | Live interactive multi-horizon simulator (`D+0`, `30d`, `90d`, `365d`) |
| **Sensory Feedback** | Zero sound, zero tactile presence | Zero-asset Web Audio API acoustic transients (`<2KB`) + haptic recoil |
| **Multi-Screen** | Amnesia & Design Drift (Screen 2 breaks Screen 1) | Automatic `.ui-design-lock.json` contract + component registry |

---

## 🏛️ The 7 Avant-Garde Skills

| Skill | Role & Domain | Signature Mechanics | Benchmark Eval |
|---|---|---|---|
| [**`avant-garde-frontend`**](avant-garde-frontend/SKILL.md) | Editorial Web, SaaS & E-Commerce | Layman-to-Studio Translator, APCA (`Lc`) contrast, Style Elevation (Glass/Pixel/Daylight), Asymmetric Bento grids. | [Lumina Atelier](evals/layman-clinic-lumina) |
| [**`avant-garde-desktop`**](avant-garde-desktop/SKILL.md) | Hardware Instruments & Desktop Software (Tauri/Electron) | Pointer-locked scrubbers, sub-120ms keyboard keymaps, custom window chrome, BroadcastChannel multi-window. | [HexRack Studio](evals/desktop-hexrack) |
| [**`avant-garde-motion-shaders`**](avant-garde-motion-shaders/SKILL.md) | 60fps WebGL2 & Procedural Shaders | Aspect-correct GLSL `#version 300 es`, Bayer dithering, liquid domain warp, spring physics, Lenis/GSAP. | [Aether Stage](evals/motion-shaders-aether) |
| [**`avant-garde-data-viz`**](avant-garde-data-viz/SKILL.md) | Editorial Journalism & High-Frequency Telemetry | Tufte & Lupi craft, perceptual OKLCH color scales, ridgeline distributions, small multiples, 60fps Canvas/SVG. | [Pelagic Observatory](evals/data-viz-observatory) |
| [**`avant-garde-mobile-tactile`**](avant-garde-mobile-tactile/SKILL.md) | Pocket Instruments & Mobile PWAs | Thumb-zone ergonomics, 100dvh safe-area shells, rotary dials, spring-snapping bottom sheets, haptic feedback. | [Lux Rangefinder](evals/mobile-tactile-field) |
| [**`avant-garde-ai-ux`**](avant-garde-ai-ux/SKILL.md) | Post-Chat Generative Workbenches | Inline semantic diffs (`<del>`/`<ins>`), bidirectional citation matrices, transparent tool-call trace (`tabular-nums`). | [Veritas Clause](evals/ai-ux-veritas) |
| [**`avant-garde-sonic-haptics`**](avant-garde-sonic-haptics/SKILL.md) | Procedural Acoustics & Micro-Haptics | 100% zero-asset Web Audio API synthesis (`<2KB`), physical solenoid/ceramic transients, ADSR oscilloscope. | [Tonwerk T-1000](evals/sonic-haptics-atelier) |

---

## 🎯 Three Architectural Breakthroughs

### 1. The Layman-to-Studio Intent Translator
Most non-technical users do not know frontend jargon like *"refractive optical acrylic"* or *"APCA Lc 98.8 contrast"*. When a user asks:
> *"Faz uma tela bonita, limpa e moderna para o meu sistema"*

The skill **never** punishes the user with generic purple AI templates or harsh, dark brutalism. It autonomously maps layperson words to studio archetypes:
- **"Bonita e moderna / Limpa"** → Sunlit Architectural Daylight, warm travertine alabaster, `Instrument Serif` + `Plus Jakarta Sans`, asymmetric bento layout, and interactive hero simulator.
- **"Elegante / Sofisticada"** → Editorial Atelier / Quiet Luxury, hairline 1px borders, deep espresso or creamy limestone, generous negative space.
- **"Rápida / Prática / Sistema"** → Linear/Cron/Stripe-style productivity monolith, `tabular-nums` readouts, instant keyboard navigation.

### 2. Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Solves the #1 failure mode of LLM coding in multi-page applications: **Design Drift** and **Component Amnesia**.
- **Screen 1:** Automatically extracts reusable primitives (`Calendar`, `NavPill`, `SegmentedSwitch`, `Modal`, `Scrubber`) into `components/ui/<Name>.tsx` and saves the contract in `.ui-design-lock.json`.
- **Screen 2..N:** Locks 100% of the CSS tokens, fonts, and radii from Screen 1. When the user asks for a calendar on Screen 20, the agent queries `design-lock.mjs find <dir> calendar` and imports the existing component rather than recreating it.
- **Auditor Verification:** Reproves any screen with `token-drift` or `duplicate-primitive`.

### 3. The 3 Anti-Slop Computational Laws
Enforced automatically by `audit-ui.mjs`, `audit-ai-ux.mjs`, and `audit-sonic.mjs`:
1. **No AI Gradient Law (`anti-slop-gradient`):** Zero generic `from-purple-500 to-indigo-600` Tailwind gradients. Uses perceptual OKLCH color spaces.
2. **No Pastel Pill Badge Soup (`anti-slop-pill-badge`):** Completely bans floating pastel `border-radius: 999px` capsules ("balõezinhos") for status, risk, or category tags. Enforces architectural 1px hairline dividers, naked monospace text, and 6px solid geometric indicators (`■`).
3. **The Living Motion Law (`static-dead-ui`):** Rejects any screen that looks like a static PDF. Enforces staggered entrance choreography (`@keyframes`), Web Animations API state morphing, real-time `requestAnimationFrame` counters, and tactile `:hover`/`:active` physics with `@media (prefers-reduced-motion: reduce)` compliance.

---

## 📸 Benchmark Visual Gallery

Every skill in the suite is backed by runnable, audited benchmark implementations in `evals/`:

### Sunlit Architectural Daylight & Reusable Calendar (`avant-garde-frontend`)
*Evaluated on Lumina Atelier Dermatology (Screen 1 → Screen 2 continuity)*  
![Lumina Atelier Desktop](evals/shot-layman-clinic-desktop.png)
*Screen 2: Reusing LuminaCalendar & LuminaNavPill with zero design drift:*  
![Lumina Atelier Screen 2](evals/shot-layman-clinic-screen2.png)

### Post-Chat Redline & Epistemic Grounding (`avant-garde-ai-ux`)
*Evaluated on Veritas Clause Contract Workbench (No pill badges, inline semantic diffs, tool trace):*  
![Veritas Clause Desktop](evals/shot-ai-ux-desktop.png)

### Zero-Asset Procedural Acoustics & ADSR Scope (`avant-garde-sonic-haptics`)
*Evaluated on Tonwerk T-1000 Braun Industrial Sound Laboratory:*  
![Tonwerk T-1000 Desktop](evals/shot-sonic-desktop.png)

### Hardware Instrument & Multi-Pane Studio (`avant-garde-desktop`)
*Evaluated on HexRack Studio:*  
![HexRack Desktop App](evals/shot-desktop-app.png)

### 60fps WebGL2 Aspect-Correct Procedural Shaders (`avant-garde-motion-shaders`)
*Evaluated on Aether Shader Stage:*  
![Aether Shader Desktop](evals/shot-shader-desktop.png)

### Editorial Telemetry & Scientific Observatory (`avant-garde-data-viz`)
*Evaluated on Pelagic Observatory:*  
![Pelagic Observatory Desktop](evals/shot-dataviz-desktop.png)

### Pocket Instrument & Rotary Dial (`avant-garde-mobile-tactile`)
*Evaluated on Lux Rangefinder (100dvh safe-area):*  
<img src="evals/shot-mobile-tactile.png" width="360" alt="Lux Rangefinder Mobile" />

---

## 🛠️ CLI Reference

The suite comes with standalone zero-dependency CLI tooling:

```bash
# Audit any project folder against Anti-Slop, JSX, and Living Motion rules:
npx avant-garde-skills audit ./src --mode web
npx avant-garde-skills audit ./src --mode desktop

# Inspect or verify multi-screen design lock:
npx avant-garde-skills lock status ./src
npx avant-garde-skills lock scan ./src --name "my-app" --archetype "editorial-atelier" --write
npx avant-garde-skills lock find ./src "calendario"
npx avant-garde-skills lock verify ./src

# Sync skills directly to all AI agents:
npm run sync
```

---

## 📦 How to Publish to GitHub & npm

### 1. Push to GitHub
```bash
git remote add origin https://github.com/Gabriel-Programacoes/avant-garde-skills.git
git branch -M main
git push -u origin main
```

### 2. Publish to npm (for `npx avant-garde-skills`)
```bash
npm login
npm publish --access public
```

---

## 📄 License

MIT © 2026 Gabriel-Programacoes. Free to use, adapt, and build studio-grade software.
