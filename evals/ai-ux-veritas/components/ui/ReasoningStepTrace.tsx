import React from 'react';

export interface ReasoningStep {
  id: string;
  tool: string;
  detail: string;
  ms: number;
}

export interface ReasoningStepTraceProps {
  steps: ReasoningStep[];
  totalMs: number;
  groundingScore: string;
}

export function ReasoningStepTrace({ steps, totalMs, groundingScore }: ReasoningStepTraceProps) {
  return (
    <section className="reasoning-trace tabular-nums" aria-label="Rastreio de Raciocínio e Ferramentas">
      <header style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span>TRACE DE VERIFICAÇÃO ({steps.length} ETAPAS)</span>
        <span>{totalMs}ms · Grounding {groundingScore}</span>
      </header>
      <ul>
        {steps.map((s) => (
          <li key={s.id}>
            <strong>{s.tool}</strong>: {s.detail} ({s.ms}ms)
          </li>
        ))}
      </ul>
    </section>
  );
}
export default ReasoningStepTrace;
