---
name: avant-garde-sonic-haptics
description: Design and engineer zero-asset procedural Web Audio API sound synthesis, physical UI foley (mechanical relays, rotary detents, warm ceramic taps, harmonic chimes), synchronized micro-haptics, and real-time acoustic telemetry in <2KB TypeScript (Teenage Engineering TP-7, Playdate OS, Apple Taptic Engine, Braun Industrial, Lusion).
---

# Avant-Garde Sonic & Haptics (Procedural UI Acoustics)

Goal: give digital interfaces the physical acoustic and tactile presence of precision hardware — *Teenage Engineering OP-1 / TP-7*, *Playdate*, *Leica M-Series shutters*, *Apple watchOS Taptic Engine*, and *Dieter Rams Braun instruments* — using **100% procedural Web Audio API synthesis (`<2KB` TypeScript, zero `.mp3`/`.wav` network assets)** paired with synchronized haptic pulses and spring visual recoil.

## 1. Intake, Layman Translator & Multi-Screen Continuity

Extract from user request. Ask only what is blocking; otherwise expand autonomously into a studio-grade specification.

| Input | If user gives it | If missing / simple prompt |
|-------|------------------|----------------------------|
| Acoustic Material (Mechanical Relay, Ceramic/Wood Tap, Rotary Detent, Harmonic Glass, Tape Foley) | Use it | Match visual polarity: **Warm Ceramic/Wood** for daylight apps, **Mechanical Relay/Detent** for desktop/hardware tools |
| Haptic Coupling (`navigator.vibrate` + visual spring recoil) | Use it | Always pair audio transients with sub-15ms visual spring compression + optional `navigator.vibrate` |
| User Control (Mute toggle, dB trim, reduced-motion/sound respect) | Use it | Mandatory persistent **SOM [ON/OFF]** ledger control + lazy `AudioContext` unlock |

### 1.1 Layman-to-Studio Sonic Translator
When a user asks simply for *"coloque som nos botões"*, *"efeitos sonoros modernos"*, or *"feedback tátil no app"*:
- **Never use harsh 1980s arcade `440Hz` raw square-wave beeps, and never load external `.mp3` files that lag on first click.**
- Automatically synthesize **Physical Acoustic Materials** using filtered noise bursts (`BiquadFilterNode`) + pitch-enveloped sine/triangle body transients (`8ms–65ms` duration, `-18dBFS` subtle mix level) so interactions feel like touching real anodized aluminum, ceramic, or mechanical switches.

### 1.2 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Always run `node scripts/design-lock.mjs status <project-dir>` before starting:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract the procedural audio synthesizer and tactile controls (`SonicSynthEngine`, `TactileAcousticPad`, `EnvelopeScopeCanvas`, `SonicMuteToggle`) into `components/ui/` and lock the project DNA via `node scripts/design-lock.mjs scan <project-dir> --name "<app>" --archetype "<paradigm>" --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Inherit all locked OKLCH tokens/fonts and the shared `SonicSynthEngine` singleton from `.ui-design-lock.json` so every screen in the application shares the exact same acoustic tuning and mute state.

---

## 2. Anti-Slop Sonic & Visual Laws

Never ship these amateur audio/UI mistakes:
1. **No un-ramped oscillator starts/stops (`missing-envelope-ramp`):** Calling `osc.start()` or `osc.stop()` without ramping `GainNode.gain` via `exponentialRampToValueAtTime(0.0001, t + duration)` produces nasty digital speaker pops.
2. **No external `.mp3`/`.wav` files for UI micro-interactions (`raw-audio-asset-bloat`):** Synthesize all clicks, detents, switches, and confirmation chords procedurally in Web Audio API.
3. **No un-muted autoplay (`missing-mute-control`):** Always unlock `AudioContext` lazily on the first user gesture and provide an explicit, keyboard-accessible `SOM [ON/OFF]` control in the header/statusbar.
4. **No AI "Pill / Badge Bubble Soup" (`anti-slop-pill-badge`):** Never wrap Hz, dB, ms, or status labels inside pastel `border-radius: 999px` (`rounded-full`) capsules ("balõezinhos"). Use **naked monospace ledger columns**, `1px` hairline dividers, and `6px` geometric square indicators (`■`).
5. **No static/dead screens (`static-dead-ui`):** Every sonic trigger must have a synchronized visual counterpart (spring button depression, real-time ADSR/waveform oscilloscope trace, or frequency meter) with `@media (prefers-reduced-motion: reduce)` guards.

---

## 3. Five Acoustic Material Archetypes & Constraint Engine

### 3.1 Acoustic Materials
1. **Mechanical Solenoid & Switch Relay (Braun T1000 / Leica M):**
   - `6ms` bandpass-filtered white noise burst (`2400Hz`, `Q=4.0`) + `22ms` pitch-dropping sine body (`220Hz -> 68Hz`).
2. **Warm Sunlit Ceramic & Wood Tap (Aesop / Kinfolk / Playdate):**
   - Triangle wave (`380Hz -> 190Hz` in `35ms`) through a warm lowpass filter (`1100Hz`) with zero harsh high-end.
3. **Precision Rotary Detent Tick (Teenage Engineering TP-7 / Halide):**
   - Ultra-short `3.5ms` highpass impulse (`3200Hz`) whose playback rate scales dynamically with scroll/drag velocity (`1.0 + velocity * 0.15`).
4. **Harmonic Glass Confirmation (visionOS / Raycast):**
   - Two detuned sine oscillators (`528Hz` + `792Hz` perfect fifth) with a `4ms` attack and `160ms` exponential decay.
5. **Sub-Bass Tactile Thud & Error Reject:**
   - Low `95Hz -> 42Hz` sine drop (`55ms`) paired with a double haptic pulse (`navigator.vibrate?.([12, 30, 18])`).

### 3.2 Constraint Draw
Run the constraint engine before designing:
```bash
node scripts/sonic-constraints.mjs 2 --domain <hardware|daylight|mobile|editorial>
```

---

## 4. Zero-Asset Web Audio Synthesis Engine (`SonicSynthEngine.ts`)

```ts
export type AcousticVoice = 'relay' | 'ceramic' | 'detent' | 'harmonic';

export class SonicSynthEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  public trigger(voice: AcousticVoice, velocity = 1.0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.connect(ctx.destination);

    if (voice === 'relay') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240 * velocity, now);
      osc.frequency.exponentialRampToValueAtTime(64, now + 0.024);
      master.gain.setValueAtTime(0.18, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.028);
    } else if (voice === 'ceramic') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1150, now);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420 * velocity, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.038);
      master.gain.setValueAtTime(0.22, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
      osc.connect(filter);
      filter.connect(master);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (voice === 'detent') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 * Math.min(1.6, Math.max(0.8, velocity)), now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.006);
      master.gain.setValueAtTime(0.12, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.008);
    } else {
      // Harmonic fifth chime
      [528, 792].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.018);
        g.gain.setValueAtTime(0.14, now + idx * 0.018);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16 + idx * 0.02);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + idx * 0.018);
        osc.stop(now + 0.18 + idx * 0.02);
      });
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(voice === 'detent' ? 4 : 10);
    }
  }
}
```

---

## 5. Verification & Visual Loop

1. Run the computational sonic auditor and design-lock verifier:
   ```bash
   node scripts/audit-sonic.mjs ./src
   node scripts/design-lock.mjs verify ./src
   ```
2. Capture desktop (`1440x900`) and mobile (`390x844`) screenshots via Playwright (`--channel=msedge`), inspect visually with `read_file`, and log in `history.md`.
