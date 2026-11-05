import React from 'react';

export interface InlineDiffCardProps {
  clauseId: string;
  title: string;
  originalText: string;
  proposedText: string;
  rationale: string;
  confidence: string;
  citation: string;
  status: 'pending' | 'accepted' | 'rejected';
  onAccept: () => void;
  onReject: () => void;
}

export function InlineDiffCard({
  clauseId,
  title,
  originalText,
  proposedText,
  rationale,
  confidence,
  citation,
  status,
  onAccept,
  onReject,
}: InlineDiffCardProps) {
  return (
    <article className="diff-card tabular-nums" aria-label={`Revisão IA ${clauseId}`}>
      <header className="diff-header">
        <span>{clauseId} // {title}</span>
        <span>Confiança {confidence} · Fonte {citation}</span>
      </header>
      {status !== 'accepted' && (
        <del className="diff-del">{originalText}</del>
      )}
      <ins className="diff-add">{status === 'rejected' ? originalText : proposedText}</ins>
      <p className="diff-rationale">{rationale}</p>
      <footer className="diff-actions">
        <button type="button" onClick={onAccept}>Aceitar Redação [Tab]</button>
        <button type="button" onClick={onReject}>Manter Original [Esc]</button>
      </footer>
    </article>
  );
}
export default InlineDiffCard;
