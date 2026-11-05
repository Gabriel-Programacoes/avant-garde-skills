import React from 'react';

export interface SegmentedOption {
  id: string;
  label: string;
}

export interface LuminaSegmentedPillProps {
  options: SegmentedOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function LuminaSegmentedPill({ options, activeId, onChange }: LuminaSegmentedPillProps) {
  return (
    <div
      role="tablist"
      style={{
        background: 'var(--paper-sunken)',
        padding: '4px',
        borderRadius: '14px',
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        gap: '4px',
      }}
    >
      {options.map((opt) => {
        const selected = opt.id === activeId;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.id)}
            style={{
              background: selected ? 'var(--surface-card)' : 'transparent',
              color: selected ? 'var(--ink-espresso)' : 'var(--ink-secondary)',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
export default LuminaSegmentedPill;
