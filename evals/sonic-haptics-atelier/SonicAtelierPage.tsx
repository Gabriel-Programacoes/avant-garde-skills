import React, { useState } from 'react';
import { SonicSynthEngine, AcousticVoiceSpec } from './components/ui/SonicSynthEngine';
import { TactileAcousticPad } from './components/ui/TactileAcousticPad';
import { EnvelopeScopeCanvas } from './components/ui/EnvelopeScopeCanvas';

const VOICES: AcousticVoiceSpec[] = [
  { id: 'relay', code: 'V-01', name: 'Relé Mecânico Solenoide', material: 'ALUMÍNIO ANODIZADO', baseHz: 240, decayMs: 26, cutoffHz: 2400, gainDb: '-14.0 dBFS' },
  { id: 'ceramic', code: 'V-02', name: 'Toque Cerâmico Quente', material: 'PORCELANA FOSCA', baseHz: 420, decayMs: 42, cutoffHz: 1150, gainDb: '-12.5 dBFS' },
  { id: 'detent', code: 'V-03', name: 'Detente Rotativo Óptico', material: 'ENCODER DE PRECISÃO', baseHz: 1400, decayMs: 8, cutoffHz: 3600, gainDb: '-18.0 dBFS' },
  { id: 'harmonic', code: 'V-04', name: 'Acorde Harmônico de Quinta', material: 'VIDRO ÓPTICO', baseHz: 528, decayMs: 165, cutoffHz: 2800, gainDb: '-15.0 dBFS' },
];

const engine = new SonicSynthEngine();

export function SonicAtelierPage() {
  const [selected, setSelected] = useState<AcousticVoiceSpec>(VOICES[0]);
  const [muted, setMuted] = useState(false);

  const handleTrigger = (spec: AcousticVoiceSpec) => {
    setSelected(spec);
    engine.muted = muted;
    engine.trigger(spec, 1.0);
  };

  return (
    <main className="min-h-screen tabular-nums" style={{ background: 'oklch(96.5% 0.006 37.5)', color: 'oklch(16.0% 0.012 37.5)' }}>
      <header>
        <span>TONWERK T-1000 // LABORATÓRIO DE FOLEY PROCEDURAL</span>
        <button type="button" onClick={() => setMuted(!muted)}>
          SOM [{muted ? 'MUTE' : 'ON'}]
        </button>
      </header>
      <EnvelopeScopeCanvas baseHz={selected.baseHz} decayMs={selected.decayMs} cutoffHz={selected.cutoffHz} />
      <section>
        {VOICES.map((v, i) => (
          <TactileAcousticPad
            key={v.id}
            spec={v}
            active={selected.id === v.id}
            hotkey={String(i + 1)}
            onTrigger={handleTrigger}
          />
        ))}
      </section>
    </main>
  );
}
export default SonicAtelierPage;
