export type AcousticVoiceId = 'relay' | 'ceramic' | 'detent' | 'harmonic';

export interface AcousticVoiceSpec {
  id: AcousticVoiceId;
  code: string;
  name: string;
  material: string;
  baseHz: number;
  decayMs: number;
  cutoffHz: number;
  gainDb: string;
}

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

  public trigger(spec: AcousticVoiceSpec, velocity = 1.0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const durSec = Math.max(0.008, spec.decayMs / 1000);

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(spec.cutoffHz, now);

    osc.type = spec.id === 'relay' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(spec.baseHz * velocity, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(48, spec.baseHz * 0.32), now + durSec);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durSec + 0.004);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(spec.id === 'detent' ? 4 : 10);
    }
  }
}
export default SonicSynthEngine;
