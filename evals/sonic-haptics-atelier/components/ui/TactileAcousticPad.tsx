import React from 'react';
import { AcousticVoiceSpec } from './SonicSynthEngine';

export interface TactileAcousticPadProps {
  spec: AcousticVoiceSpec;
  active: boolean;
  hotkey: string;
  onTrigger: (spec: AcousticVoiceSpec) => void;
}

export function TactileAcousticPad({ spec, active, hotkey, onTrigger }: TactileAcousticPadProps) {
  return (
    <button
      type="button"
      className="acoustic-pad tabular-nums"
      aria-pressed={active}
      onClick={() => onTrigger(spec)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{spec.code} // {spec.material}</span>
        <span>[{hotkey}]</span>
      </div>
      <strong>{spec.name}</strong>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px' }}>
        <span>{spec.baseHz} Hz</span>
        <span>{spec.decayMs} ms</span>
        <span>{spec.gainDb}</span>
      </div>
    </button>
  );
}
export default TactileAcousticPad;
