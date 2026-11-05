import React from 'react';

export interface EnvelopeScopeCanvasProps {
  baseHz: number;
  decayMs: number;
  cutoffHz: number;
}

export function EnvelopeScopeCanvas({ baseHz, decayMs, cutoffHz }: EnvelopeScopeCanvasProps) {
  return (
    <section className="scope-panel tabular-nums" aria-label="Osciloscópio de Envelope ADSR e Harmônicos">
      <header style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span>OSCILOSCÓPIO TRANSIENTE // ADSR + FASE HARMÔNICA</span>
        <span>F0: {baseHz}Hz · τ: {decayMs}ms · LPF: {cutoffHz}Hz</span>
      </header>
      <canvas width={640} height={180} />
    </section>
  );
}
export default EnvelopeScopeCanvas;
