---
name: avant-garde-mobile-tactile
description: Design and engineer tactile, gesture-first mobile apps, PWAs, and pocket instruments in TypeScript (Not Boring Apps, Halide Mark II, Teenage Engineering TP-7, Leica FOTOS, Cosmos). Replaces squeezed responsive websites with thumb-zone ergonomics, rotary dials, spring-snapping bottom sheets, pointer-captured gestures, 100dvh safe-area shells, and haptic micro-feedback.
---

# Avant-Garde Mobile Tactile

Goal: craft mobile interfaces and PWAs that feel like physical pocket instruments — the tactile immediacy of *Not Boring Camera/Weather* (Andy Works), *Halide Mark II*, *Teenage Engineering TP-7*, *Leica FOTOS*, and *Poolsuite FM*. Never ship a desktop web page squeezed into a 390px column.

## 1. Intake & Mobile Tactile Brief

Extract from the user request. Ask only what is blocking; otherwise pick a bold default and state it.

| Input | If user gives it | If missing |
|-------|------------------|------------|
| App Purpose & Pocket Context (camera/optics, field recorder, weather/navigation, finance, habit/timer, media) | Use it | Ask or pick a bold utility concept |
| Tactile Archetype (Not Boring Utility, Pocket Field Recorder, Spatial Gesture Deck, Sunlight Field HUD, Pocket Zine) | Follow strictly | Run divergence (section 3.2) |
| Primary One-Handed Mechanic (Rotary thumb wheel, 3-detent spring sheet, X/Y gesture pad, Drum roller) | Use it | Rotary thumb dial + snap bottom sheet |
| Lighting Environment (OLED pitch black for night/camera, Anodized alloy, High-lux sunlight paper) | Use it | Match domain ergonomics (section 4) |

User instructions override every default in this skill.

### 1.1 Layman-to-Studio Intent Translator (Non-Technical User Prompts)
When a user simply asks for *"um app bonito e moderno"* without technical UI terms:
- **Never ship a generic white-and-purple template, and never force dark industrial hardware onto everyday consumer apps (health, delivery, finance, booking, education).**
- Automatically translate *"bonito e moderno"* into **Warm Sunlit Tactile + Refractive Bottom Dock**: warm alabaster/ceramic cards (`oklch(97% 0.008 80)`), fluid serif + geometric sans typography, thumb-zone segmented pill bar with `backdrop-filter: blur(16px) saturate(180%)` + 1px specular rim, and immediate spring-loaded touch feedback (`active:scale-[0.97]`).

### 1.2 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Always run `node scripts/design-lock.mjs status <project-dir>` before starting:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract reusable mobile primitives (`BottomSheet`, `RotaryDial`, `CalendarPicker`, `SegmentedDock`) into `components/ui/<Name>.tsx` and run `node scripts/design-lock.mjs scan <project-dir> --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Inherit all locked OKLCH tokens/fonts from `.ui-design-lock.json`, query `node scripts/design-lock.mjs find <project-dir> <keyword>` before building any widget, reuse registered components from Screen 1, and run `node scripts/design-lock.mjs verify <project-dir>`.

---

## 2. Anti-Slop Mobile Laws (The "Not a Squeezed Website" Law)

Never ship these responsive-web mistakes in a mobile app:
- **No unreachable top-left hamburger menus:** The top 25% of a modern phone screen is the "hard-to-reach zone". Keep the top zone for readouts/telemetry/viewfinders; put all primary triggers in the **Bottom Thumb Zone (bottom 38% of `100dvh`)**.
- **No `<44px` touch targets:** Every interactive button, tab, or toggle must have a minimum hit area of `44×44px` (`min-h-[44px] min-w-[44px]`).
- **No `100vh` layout jumps:** Mobile browser chrome expands/collapses dynamically. Always lock the shell to `100dvh` (`height: 100dvh; overflow: hidden;`) with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **No browser gesture collisions:** Interactive dials, scrubbers, and sheets must set `touch-action: none`, `overscroll-behavior: none`, `user-select: none`, and `-webkit-tap-highlight-color: transparent` so dragging never triggers iOS text selection or browser pull-to-refresh.
- **No lost touch drags:** Always use **Pointer Events with `e.currentTarget.setPointerCapture(e.pointerId)`** so the user's thumb can slide outside the dial or slider track without losing control.
- **No hover-dependent UI:** Touch screens have no hover. Replace hover states with immediate `<60ms` physical press compression (`active:scale-[0.96]` or 2px mechanical depression) + haptic pulse (`navigator.vibrate?.(8)`).

---

## 3. Five Mobile Tactile Archetypes & Divergence

### 3.1 Archetypes
1. **Not Boring / Tactile Utility (Andy Works, Halide Mark II):**
   - Matte polycarbonate or anodized chassis, precision knurled thumb-wheel with tick marks, oversized tabular readout in the upper viewport, physical toggle switches.
2. **Pocket Field Recorder & Synth (Teenage Engineering TP-7 / OP-1 Field):**
   - Motorized virtual tape reel or jog wheel in the center/bottom zone, high-contrast OLED telemetry strip at the top, mechanical chiclets with LED corner indicators and safety-orange accents.
3. **Spatial Gesture Deck & Spring Sheets (Cosmos, Apple Wallet/Maps):**
   - Full-bleed canvas with a velocity-projected bottom sheet that snaps between 3 detents (`peek 18%`, `half 52%`, `expanded 90%`) and throwable card stacks.
4. **Sunlight Field & Optical HUD (Leica FOTOS, CalTopo, Strava):**
   - Pure pitch-black OLED (`#000000`) with high-contrast monochrome + 1 signal color (Leica Red or Safety Amber), live histogram/clinometer grid, oversized gloved-thumb shutter/trigger bar.
5. **Editorial Pocket Zine & Audio Deck (Poolsuite FM, Readwise):**
   - Warm archival paper surface, floating bottom transport pill with scrubbing waveform, thumb-reachable chapter wheel.

### 3.2 Constraint Draw & Anti-Repetition
1. Read `history.md` before choosing a direction. Do not reuse the same archetype, dominant hue (±20°), or primary thumb mechanic from the last 5 entries.
2. Draw 2 constraints before coding:
   ```bash
   node scripts/mobile-constraints.mjs 2 --domain <utility|audio|optics|editorial|fitness>
   ```
3. After building and auditing, append one line to `history.md`:
   `YYYY-MM-DD | project | archetype | thumb mechanic | dominant oklch | viewport audit`

---

## 4. Ergonomic Zones & Surface Architecture

Divide the `390×844` (`100dvh`) viewport into three vertical ergonomic zones:
1. **Top Zone (0% – 28% height): Read-Only Telemetry & Viewfinder**
   - Status pills, live waveforms/histograms, big numeric readouts (`tabular-nums`), mode indicators. Zero critical navigation buttons here.
2. **Center Zone (28% – 62% height): Interactive Stage / Canvas**
   - Direct manipulation surface (2D X/Y pad, optical viewfinder, tape reel, or card stack).
3. **Bottom Thumb Zone (62% – 100% height): Primary Tactile Controls**
   - Knurled rotary dial, drum wheel, physical trigger buttons (`≥48px` height), and bottom sheet handle, padded by `padding-bottom: max(16px, env(safe-area-inset-bottom))`.

Use `scripts/palette.mjs` (`surfaces` or `ramp` + `contrast`) to verify that all readouts pass WCAG AA and APCA `Lc ≥ 60`.

---

## 5. Production Zero-Dependency Touch Primitives (TypeScript)

### 5.1 Pointer-Captured Knurled Rotary Thumb Wheel (`TactileThumbWheel.tsx`)
Uses `setPointerCapture` so the thumb never slips off the wheel while scrubbing, firing haptic ticks on every detent step:

```tsx
import React, { useRef, useState } from 'react';

export function TactileThumbWheel({
  value,
  min,
  max,
  step = 1,
  unit = '',
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  label: string;
  onChange: (v: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startVal = useRef(value);
  const lastStepVal = useRef(value);

  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(2))));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startX.current = e.clientX;
    startVal.current = value;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    const stepsMoved = Math.round(dx / 8);
    const next = clamp(startVal.current + stepsMoved * step);
    if (next !== lastStepVal.current) {
      lastStepVal.current = next;
      navigator.vibrate?.(6);
      onChange(next);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      className="min-h-[64px] w-full select-none rounded-xl p-3 flex flex-col justify-between cursor-ew-resize active:scale-[0.99] transition-transform"
    >
      <div className="flex justify-between items-baseline text-xs font-mono">
        <span className="uppercase tracking-wider opacity-70">{label}</span>
        <span className="text-lg font-bold tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      {/* Knurled Tick Ruler */}
      <div className="h-5 w-full overflow-hidden flex items-end justify-between gap-1 pt-1">
        {Array.from({ length: 31 }, (_, i) => {
          const isMajor = i % 5 === 0;
          return (
            <span
              key={i}
              className={`w-[2px] rounded-full ${isMajor ? 'h-4 opacity-90' : 'h-2 opacity-35'}`}
              style={{ background: isMajor && i === 15 ? 'oklch(68% 0.22 38)' : 'currentColor' }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

## 6. Workflow & Computational Mobile Audit

1. **Intake & History Check**: Read `history.md` and draw 2 constraints with `node scripts/mobile-constraints.mjs 2 --domain <domain>`.
2. **Palette & Contrast**: Generate OKLCH surface and accent tokens via `node scripts/palette.mjs` and verify APCA contrast.
3. **Build Pocket Shell (`390×844` / `100dvh`)**:
   - Top telemetry/viewfinder zone (0–28%), Center stage (28–62%), Bottom thumb zone (62–100%).
   - Use Pointer Events (`setPointerCapture`), `touch-action: none`, `100dvh`, `env(safe-area-inset-bottom)`, and `tabular-nums`.
4. **Computational Mobile Audit**:
   Run `scripts/audit-mobile.mjs` against the source folder:
   ```bash
   node scripts/audit-mobile.mjs ./src
   ```
   Verifies `100dvh` dynamic viewport, `touch-action: none` on gesture controls, `safe-area-inset`, `tabular-nums`, `user-select: none`, and OKLCH tokens.
5. **Visual Loop (`390×844` & `1440×900` Showcase)**: Capture mobile viewport (`390×844`) via Playwright to verify zero horizontal overflow and thumb-zone ergonomics, then log in `history.md`.
