import React from 'react';

export interface CitationBadgeProps {
  sectionRef: string;
  confidence: string;
  active?: boolean;
  onSelect: (ref: string) => void;
}

export function CitationBadge({ sectionRef, confidence, active = false, onSelect }: CitationBadgeProps) {
  return (
    <button
      type="button"
      className="citation-chip tabular-nums"
      aria-pressed={active}
      onClick={() => onSelect(sectionRef)}
    >
      <span>[{sectionRef} · {confidence}]</span>
    </button>
  );
}
export default CitationBadge;
