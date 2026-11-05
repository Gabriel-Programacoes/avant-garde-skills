import React from 'react';

export interface LuminaNavPillProps {
  activeRoute: 'home' | 'portal' | 'protocols';
  patientName?: string;
  ctaLabel?: string;
}

export function LuminaNavPill({
  activeRoute = 'home',
  patientName,
  ctaLabel = 'Agendar Consulta →',
}: LuminaNavPillProps) {
  return (
    <header
      className="nav-pill tabular-nums"
      style={{
        background: 'oklch(99.5% 0.003 78.0 / 0.78)',
        backdropFilter: 'blur(16px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 0 oklch(100% 0 0 / 0.9), 0 10px 30px -12px oklch(18% 0.02 155 / 0.08)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '14px',
        padding: '10px 14px 10px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', lineHeight: 1 }}>Lumina Atelier</span>
        <span
          className="brand-meta"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10.5px',
            color: 'var(--ink-secondary)',
            paddingLeft: '14px',
            borderLeft: '1px solid var(--border-hairline)',
          }}
        >
          DERMATOLOGIA CLÍNICA &amp; LASER · CRM-SP 142.890
        </span>
      </div>

      <nav aria-label="Navegação Principal" style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 600 }}>
        <span style={{ color: activeRoute === 'home' ? 'var(--sage-primary)' : 'var(--ink-secondary)' }}>Visão Clínica</span>
        <span style={{ color: activeRoute === 'portal' ? 'var(--sage-primary)' : 'var(--ink-secondary)' }}>Prontuário &amp; Agenda</span>
        <span style={{ color: activeRoute === 'protocols' ? 'var(--sage-primary)' : 'var(--ink-secondary)' }}>Diagnóstico 3D</span>
      </nav>

      <button
        type="button"
        style={{
          background: 'var(--sage-primary)',
          color: 'var(--surface-card)',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {patientName ? `Paciente: ${patientName}` : ctaLabel}
      </button>
    </header>
  );
}
export default LuminaNavPill;
