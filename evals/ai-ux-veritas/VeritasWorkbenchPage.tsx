import React, { useState } from 'react';
import { InlineDiffCard } from './components/ui/InlineDiffCard';
import { ReasoningStepTrace } from './components/ui/ReasoningStepTrace';
import { CitationBadge } from './components/ui/CitationBadge';

export function VeritasWorkbenchPage() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [activeRef, setActiveRef] = useState('§4.2');

  return (
    <main className="min-h-screen tabular-nums" style={{ background: 'oklch(96.5% 0.006 264.4)', color: 'oklch(16.0% 0.012 264.4)' }}>
      <InlineDiffCard
        clauseId="CLÁUSULA 4.2"
        title="Limitação de Responsabilidade Indireta"
        originalText="A CONTRATADA responderá ilimitadamente por lucros cessantes e danos indiretos."
        proposedText="A responsabilidade agregada da CONTRATADA limita-se a 12 (doze) meses do valor contratual, excluídos lucros cessantes (Art. 403 CC)."
        rationale="Alinha o teto de indenização ao padrão institucional de M&A e jurisprudência do STJ."
        confidence="98.4%"
        citation="§4.2"
        status={status}
        onAccept={() => setStatus('accepted')}
        onReject={() => setStatus('rejected')}
      />
      <CitationBadge sectionRef="§4.2" confidence="98.4%" active={activeRef === '§4.2'} onSelect={setActiveRef} />
      <ReasoningStepTrace
        totalMs={380}
        groundingScore="98.4%"
        steps={[
          { id: '1', tool: 'vector_index.playbook', detail: 'Matched M&A Liability Cap Playbook v4.2', ms: 140 },
          { id: '2', tool: 'statute_verifier', detail: 'Verified Art. 403 Código Civil correlation', ms: 240 },
        ]}
      />
    </main>
  );
}
export default VeritasWorkbenchPage;
