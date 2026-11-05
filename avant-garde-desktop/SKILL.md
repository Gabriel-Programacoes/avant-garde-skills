---
name: avant-garde-desktop
description: Design and build distinctive, high-craft desktop software and webview interfaces (Electron, Tauri, Wails, WebView2, PWA). Use when the user asks for a desktop app, admin studio, productivity tool, audio/creative software, dashboard, command center, or desktop UI/UX in TypeScript. Replaces web-page templates with native window mechanics, keyboard-first navigation, dense information architecture, hardware-respecting performance, and distinctive industrial aesthetics.
---

# Avant-Garde Desktop

Goal: craft desktop and webview interfaces with the tactile precision of tools like Linear, Raycast, Zed, Ableton Live, Teenage Engineering hardware, or Panic Nova — high density, sub-150ms micro-interactions, full keyboard navigation, and authentic OS window mechanics. Never build a generic web page inside an electron wrapper.

## 1. Intake & Desktop Brief

Extract from user request. Ask only what is blocking; otherwise adopt a bold default and state it.

| Input | If user gives it | If missing |
|-------|------------------|------------|
| App Purpose & Domain (audio, devtool, analytics, CAD, crypto, writing) | Use it | Ask |
| Target Runtime (Tauri v2, Electron, Wails, WebView2, PWA) | Follow platform-specific APIs | Default to Tauri v2 + Web standards |
| Visual Paradigm (Instrument, Hyper-Monolith, CAD, Luxury Slate) | Follow strictly | Run divergence (section 3.2) |
| Color & Palette (brand colors, monochrome, dark slate, cyber-amber) | Treat as source of truth; blend via section 4 | Generate via section 4 |
| Target Density (Studio ultra-compact, Balanced productivity, Focused canvas) | Use it | Balanced productivity |
| Window Architecture (Unified Titlebar, Floating HUD, Multi-pane Studio) | Use it | Unified Titlebar with integrated search |

User instructions override every default in this skill.

### 1.0 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Before choosing a paradigm, palette, or building a widget, **always run `node scripts/design-lock.mjs status <project-dir>`**:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract every reusable primitive (`Titlebar`, `CommandPalette`, `NumberScrubber`, `CalendarGrid`, `SegmentedSwitch`, `InspectorPanel`) into `components/ui/<Name>.tsx` and lock the project DNA via `node scripts/design-lock.mjs scan <project-dir> --name "<app>" --archetype "<paradigm>" --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Never drift from locked tokens/fonts in `.ui-design-lock.json`. Always run `node scripts/design-lock.mjs find <project-dir> <keyword>` (e.g. `calendar`, `scrubber`, `tabs`, `modal`) and **import/reuse** the registered component from Screen 1 instead of recreating it. Run `node scripts/design-lock.mjs verify <project-dir>` to prove zero token drift and zero duplicate primitives.

### 1.1 Layman-to-Studio Intent Translator (Non-Technical User Prompts)
When a user asks simply for *"um sistema bonito e moderno"*, *"um painel limpo para minha empresa"*, or *"um app fácil de usar"*, **do not force dark military/cyber-terminal themes onto them and never ship generic Bootstrap/shadcn gray slop.**
- **"Bonito, moderno, limpo, comercial" (Clinics, ERP, Finance, Retail, CRM, Scheduling):** Default to **Sunlit Daylight Studio (`node scripts/palette.mjs surfaces "#..." --light`)** or **Paper & Slate Luxe** — warm alabaster canvas (`oklch(96.5% 0.006 H)`), crisp white raised panels (`#ffffff`), subtle 1px tinted borders, `Plus Jakarta Sans` + `Instrument Serif` + `JetBrains Mono` (`tabular-nums`), and an interactive live workflow (inline quick-booking, instant search filter, segmented status switcher).
- **"Rápido, técnico, para desenvolvedores ou estúdio de áudio/vídeo":** Use **Hyper-Productivity Monolith** or **Hardware Instrument** dark surfaces.

---

## 2. Anti-AI Desktop Rules (The "Not a Web Page" Law)

Never ship these generic web clichés in a desktop app:
- **No AI "Pill / Badge Bubble Soup" (`anti-slop-pill-badge`):** Never litter headers, cards, or tables with pastel `border-radius: 999px` (`rounded-full`) status bubbles ("balõezinhos" like `RISCO ALTO` or `ATIVO` inside colored lozenges). Use a `6px` status LED dot/square + naked monospace text separated by `1px` hairline rules.
- **No giant hero sections or scroll storyboarding:** Desktop apps are persistent workspaces, not marketing landing pages.
- **No sluggish, blurry glassmorphism everywhere:** Heavy `backdrop-filter: blur(40px)` destroys battery and lags window dragging. Use subtle tinted surfaces and crisp 1px borders instead.
- **No loose 32px padded cards:** Screen space is valuable. Avoid excessive white space that forces unnecessary scrolling.
- **No missing drag regions:** Forgetting `-webkit-app-region: drag` or making interactive buttons unclickable by putting them inside drag zones.
- **No selectable interface text:** Text on buttons, tabs, labels, and statusbars must be `user-select: none;`.
- **No standard web context menus:** Never show the default browser "Inspect Element / Reload" context menu on right click. Provide custom contextual action menus.
- **No mouse-only workflows:** A pro desktop tool without hotkeys, `kbd` hints, or a command palette feels amateur.

Do instead:
- **Persistent workspace structure:** Fixed viewport (`h-screen overflow-hidden`), clear panel hierarchy (sidebar, canvas, inspector, statusbar).
- **Sub-150ms micro-motion:** Instantaneous or spring-based feedback. Never make the user wait for a menu transition.
- **Tactile micro-details:** Tabular numeric scrubbers, status LEDs, physical button press depression, custom subtle scrollbars (`scrollbar-gutter: stable`).
- **OS window harmonization:** Respect macOS traffic lights (`left: 16px`, `pl-[78px]`) or Windows custom caption buttons. Desaturate or dim accents when window loses focus (`document.hasFocus()`).

---

## 3. Desktop Paradigms & Divergence

### 3.1 Five High-Craft Desktop Archetypes

1. **Hardware Instrument / Audio Studio (Teenage Engineering, Ableton, Elektron):**
   - Matte graphite surfaces, tactile knobs/sliders, segmented LED numerals, safety-orange or acid-lime status indicators.
   - Ultra-dense layout, zero wasted pixels, horizontal numeric scrubbers.
2. **Hyper-Productivity Monolith (Linear, Zed, Raycast, Sublime):**
   - Deep obsidian/charcoal surfaces, razor-sharp 1px borders (`oklch(25% 0.01 var(--hue))`), high-contrast crisp text.
   - Command palette (Cmd/Ctrl+K) as first-class citizen, hotkey badges on every actionable item.
3. **Architectural CAD / Precision Blueprint:**
   - Technical crosshair cursors, subtle coordinate rulers along window edges, monospace metadata callouts, wireframe vector canvases.
4. **Paper & Slate Luxe (Reflect, Cron, Panic Nova, Obsidian Craft):**
   - Warm off-black or natural sunlit paper background (`node scripts/palette.mjs surfaces "#..." --light`), etched borders, editorial serif display for project titles paired with monospaced data tables.
5. **Cyber-Terminal / Mission Control:**
   - Dense tabular streaming data, live status indicators, sparklines, amber/emerald phosphor accents, keyboard chord navigation.
6. **Sunlit Industrial / Dieter Rams Studio (Braun, Teenage Engineering Field Light, Playdate Dock):**
   - High-key warm polycarbonate (`oklch(95% 0.01 85)`), crisp recessed input wells (`oklch(90% 0.012 85)`), physical bevel highlights, and high-contrast international orange or cobalt accents.
7. **Spatial Refractive Studio & Retro OS (when requested by user):**
   - *Spatial Glass:* Optical `backdrop-filter: blur(16px) saturate(180%)` with 1px specular top-edge catchlight (`inset 0 1px 0 oklch(100% 0 0 / 0.55)`), never muddy blur.
   - *Retro / Pixel OS (System 1 / NeXT / PC-98):* Stepped pixel borders, zero blur, `4px 4px 0` hard shadows, bitmap fonts (`Silkscreen` / `VT323`), and ordered Bayer dithering.

### 3.2 Divergence & Concept Selection
When the style is not predetermined by the user:
- Present 3 distinct approaches varying in **density**, **window chrome**, and **primary interaction mechanic**.
- Describe each in 3 lines: **Paradigm**, **Window & Layout Architecture**, **Signature Desktop Mechanic**.

### 3.3 Random Desktop Constraint Draw
Run the included constraint script (pass `--domain` to filter constraints for the app domain):
```bash
node scripts/desktop-constraints.mjs 2 --domain <audio|devtool|cad|analytics|writing>
```
Apply the drawn constraints (e.g. statusbar-centric, numeric scrubbers, zero-modal policy) to push the design beyond ordinary SaaS templates.

### 3.4 Anti-Repetition Memory
Read `history.md` before finalizing decisions. Do not repeat the same paradigm, dominant accent hue (±20°), or primary font pairing from the last 5 projects. After building, log the project:
`YYYY-MM-DD | project | paradigm | density | primary font | dominant oklch | signature mechanic`

---

## 4. Desktop Color Architecture & Surface Elevation

Desktop interfaces require distinct surface elevation without muddy drop-shadows.

### 4.1 Surface Layering in OKLCH
Build backgrounds using luminance steps in OKLCH, with subtle chromatic tinting (0.005–0.015 Chroma) derived from the app's domain hue:
```css
:root {
  /* Dark Theme Surfaces */
  --surface-canvas: oklch(14% 0.008 250);     /* Base workspace / canvas */
  --surface-panel:  oklch(17% 0.010 250);     /* Sidebars, docked panels */
  --surface-raised: oklch(21% 0.012 250);     /* Cards, dialogs, popovers */
  --surface-overlay: oklch(26% 0.015 250);    /* Tooltips, command palettes */
  --surface-sunken:  oklch(11% 0.006 250);    /* Input wells, code blocks, terminal */

  /* Razor-sharp 1px Borders */
  --border-subtle: oklch(24% 0.012 250);
  --border-strong: oklch(34% 0.020 250);

  /* Typography */
  --text-primary:   oklch(96% 0.005 250);
  --text-secondary: oklch(72% 0.015 250);
  --text-tertiary:  oklch(48% 0.015 250);
  --text-disabled:  oklch(32% 0.010 250);

  /* High-Utility Accents (Use sparingly: 5% of UI max) */
  --accent-primary: oklch(68% 0.22 145);      /* e.g., Vivid emerald or safety orange */
  --accent-hover:   oklch(74% 0.20 145);
  --accent-active:  oklch(62% 0.24 145);
  
  /* Telemetry / Status LEDs */
  --led-online:  oklch(72% 0.22 142);
  --led-warning: oklch(78% 0.18 75);
  --led-error:   oklch(65% 0.24 25);
}
```

### 4.2 Window Focus State
When the window is blurred (user clicked another app), desaturate accents and dim border highlights:
```css
body.window-blurred {
  --accent-primary: oklch(55% 0.03 250);
  --border-strong: var(--border-subtle);
}
```

### 4.3 Palette Tool (OKLCH + WCAG 2 + APCA + Surfaces)
Use `scripts/palette.mjs` (zero-dependency) to auto-generate calibrated dark/light surface hierarchies, ramps, and verify WCAG 2 + APCA (`Lc`) contrast:
```bash
node scripts/palette.mjs surfaces "#10b981"           # 5 dark surfaces + borders + text tokens
node scripts/palette.mjs surfaces "#10b981" --light   # light studio surface hierarchy
node scripts/palette.mjs ramp "#10b981" accent        # 11-step OKLCH ramp
node scripts/palette.mjs contrast "oklch(96% 0.005 250)" "oklch(17% 0.010 250)"
```

---

## 5. Desktop Typography & Micro-Layout

Desktop UI demands extreme typographic precision, optical sizing, and tabular alignments.

### 5.1 Font Stacks
1. **System Native (Zero Latency):**
   - macOS: `system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`
   - Windows: `"Segoe UI Variable Text", "Segoe UI", sans-serif`
2. **Pro Technical Pairing:**
   - UI / Controls: `Inter Display`, `Geist`, `Aptos`, or `Space Grotesk`
   - Code, Coordinates, Numbers: `JetBrains Mono`, `Commit Mono`, `Berkeley Mono`, or `Geist Mono`
   - Luxury / Editorial Studio: Pair with `Instrument Serif` or `Fraunces` for project titles.

### 5.2 Micro-Typography Rules
- **Tabular Figures everywhere:** Add `font-variant-numeric: tabular-nums;` to all data cells, timers, percentages, coordinates, and prices. Numbers must never jitter when ticking.
- **Micro-Badges & Keycaps (`<kbd>`):**
  ```tsx
  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-surface-raised border border-border-strong text-text-secondary shadow-sm select-none">
    ⌘K
  </kbd>
  ```
- **Scale:**
  - Micro / Metadata / Badges: `10px – 11px` (tracking +0.02em)
  - Standard Control / Table Cell: `12px – 13px`
  - Section Header: `14px – 16px` (font-semibold)
  - Big Metric / Hero Readout: `24px – 36px` (mono tabular)

---

## 6. Window Chrome, Drag Regions & Native Shell

A desktop app must integrate seamlessly with OS window frames.

### 6.1 Custom Titlebar Anatomy (React/TSX)
```tsx
<header
  className="h-10 w-full flex items-center justify-between px-3 select-none border-b border-border-subtle bg-surface-panel"
  style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
>
  {/* macOS Traffic Light Buffer (if frameless on macOS) */}
  <div className="flex items-center gap-2 pl-16 non-mac:pl-0" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
    <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
      Workspace / Project Alpha
    </span>
  </div>

  {/* Integrated Quick Search / Command Pill */}
  <button
    className="h-7 px-3 flex items-center gap-2 text-xs rounded-md bg-surface-sunken border border-border-subtle text-text-tertiary hover:text-text-primary transition-colors"
    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
  >
    <span>Quick Search or Jump...</span>
    <kbd className="text-[10px] bg-surface-panel px-1 py-0.5 rounded border border-border-subtle">⌘K</kbd>
  </button>

  {/* Window Status / Actions (No drag on clickable controls) */}
  <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
    <button className="p-1 rounded hover:bg-surface-raised text-text-secondary" title="Split Pane (⌘\)">...</button>
  </div>
</header>
```

### 6.2 The Three Golden Rules of `-webkit-app-region`
1. Never put `drag` on interactive children (`button`, `input`, `a`, scrollbars).
2. Always apply `style="-webkit-app-region: no-drag;"` to all controls inside a draggable header.
3. Keep window controls overlay (WCO) and traffic light offsets dynamic based on `navigator.userAgent`.

### 6.3 Context Menus & Keyboard Traps
- Intercept right clicks: `e.preventDefault()` on container elements and render a lightweight, absolute-positioned floating menu.
- Close on Escape or click outside. Auto-position inside screen bounds.

---

## 7. Keyboard-First Architecture & Micro-Interactions

### 7.1 Keymap Matrix & Input-Safe Registry
- `Cmd/Ctrl + K` or `Cmd/Ctrl + P`: Global Command Palette.
- `Cmd/Ctrl + \` or `Cmd/Ctrl + B`: Toggle primary sidebar/inspector.
- `Cmd/Ctrl + J`: Toggle embedded terminal / bottom tray.
- `Tab` / `Shift + Tab`: Predictable, visible keyboard focus (`focus-visible:ring-1 focus-visible:ring-accent-primary`).
- `Escape`: Clear selection, close modal/popover, return focus to canvas.

Always guard single-key shortcuts so typing in inputs never triggers workspace actions:
```tsx
export function useDesktopKeymap(bindings: Record<string, (e: KeyboardEvent) => void>) {
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const inInput = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      const key = `${mod ? 'Mod+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key.toLowerCase()}`;
      if (inInput && !mod && e.key !== 'Escape') return;
      if (bindings[key]) {
        e.preventDefault();
        bindings[key](e);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bindings]);
}
```

### 7.2 Numeric Scrubber Component (Pointer-Locked + Modifiers + Keyboard)
```tsx
import React, { useState, useRef } from 'react';

export function NumberScrubber({
  value,
  onChange,
  label,
  step = 1,
  min = -Infinity,
  max = Infinity,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const valRef = useRef(value);
  valRef.current = value;

  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(4))));

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    let acc = valRef.current;
    const el = e.currentTarget;
    el.requestPointerLock?.();

    const onMouseMove = (ev: MouseEvent) => {
      const mult = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1;
      acc = clamp(acc + ev.movementX * step * mult);
      onChange(acc);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      if (document.pointerLockElement === el) document.exitPointerLock?.();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const dir = e.key === 'ArrowUp' ? 1 : -1;
    onChange(clamp(valRef.current + dir * step * mult));
  };

  return (
    <div
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      className={`flex items-center justify-between px-2 py-1 text-xs font-mono rounded bg-surface-sunken border cursor-ew-resize select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary ${
        isDragging ? 'border-accent-primary text-accent-primary' : 'border-border-subtle text-text-secondary'
      }`}
    >
      <span className="text-text-tertiary">{label}</span>
      <span className="tabular-nums font-semibold">{value}</span>
    </div>
  );
}
```

### 7.3 Instantaneous Spring Physics
- Use springs with stiffness > 400 and damping > 30 (Motion / CSS transition: `cubic-bezier(0.16, 1, 0.3, 1)` for under 150ms).
- No long, cinematic fades. UI state changes should feel as responsive as native OS code.

---

## 8. Battery, GPU & Zero-Idle Rule

Desktop apps stay open for days. They must never drain battery or peg CPU while idling.

1. **Zero-CPU Idle Suspension & Focus Class Toggle:**
   ```ts
   useEffect(() => {
     const onFocus = () => document.body.classList.remove('window-blurred');
     const onBlur = () => document.body.classList.add('window-blurred');
     window.addEventListener('focus', onFocus);
     window.addEventListener('blur', onBlur);
     return () => {
       window.removeEventListener('focus', onFocus);
       window.removeEventListener('blur', onBlur);
     };
   }, []);
   ```
2. **Multi-Window / Floating Inspector Sync:** Use `BroadcastChannel('ag-workspace-sync')` so detached inspectors, floating HUDs, and the main window share state under 2ms without server roundtrips.
3. **List Virtualization:** Any list exceeding 100 items (logs, transactions, files, contacts) must use windowing (`@tanstack/react-virtual` or custom light virtualizer).
4. **No Blurring Over Heavy Content:** Avoid multiple overlapping elements with `backdrop-filter: blur()`. Use solid surface colors with alpha borders.

---

## 9. Workflow & Verification Loop

1. **Intake & Paradigm**: Define domain, density target, and select archetype (Instrument, Monolith, CAD, Luxe).
2. **Constraint Draw**: Run `node scripts/desktop-constraints.mjs 2 --domain <domain>`.
3. **Color & Surface Generation**: Generate OKLCH surface hierarchy and verify WCAG + APCA contrast via `node scripts/palette.mjs surfaces "<color>"`.
4. **Window Shell Build**: Titlebar with drag region, split layout, command bar, statusbar.
5. **Interactive Core**: Add tabular grids, scrubbers, context menus, and keyboard shortcuts.
6. **Desktop Verification Audit**:
   - **Computational UI Audit**: Run `node scripts/audit-ui.mjs ./src --mode desktop` (and against live URL `http://localhost:3000` when running) to verify drag regions, `tabular-nums`, `select-none`, and zero slop.
   - **Unplugged Mouse Test**: Can every core feature be navigated and executed via keyboard alone?
   - **Window Resize Test**: Resize window down to 640x480. Do panels collapse cleanly into icon bars?
   - **Window Focus Test**: Does `body.window-blurred` desaturate accents when focus is lost?
   - **Screenshot & Visual Review**: Run visual capture at 1440x900 and evaluate craft.
7. **Record History**: Append the line to `history.md`.
8. **Deliver**: Spec, code, and shortcut cheatsheet.
