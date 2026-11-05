import React from 'react';

export interface CalendarDaySlot {
  dateIso: string;
  dayNumber: number;
  weekdayShort: string;
  slots: string[];
  recommended?: boolean;
}

export interface LuminaCalendarProps {
  /** 'compact' for hero quick-booking (Screen 1) or 'month' for full patient scheduling (Screen 2..N) */
  variant?: 'compact' | 'month';
  days: CalendarDaySlot[];
  selectedDate: string;
  selectedSlot: string;
  doctorName?: string;
  onSelectDate: (dateIso: string) => void;
  onSelectSlot: (slot: string) => void;
}

export function LuminaCalendar({
  variant = 'compact',
  days,
  selectedDate,
  selectedSlot,
  doctorName = 'Dra. Helena Vasconcelos',
  onSelectDate,
  onSelectSlot,
}: LuminaCalendarProps) {
  const activeDay = days.find((d) => d.dateIso === selectedDate) || days[0];

  return (
    <section
      className="lumina-calendar tabular-nums"
      aria-label={`Calendário de agendamento — ${doctorName}`}
      style={{
        background: 'var(--paper-stone)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '18px',
        padding: '16px',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', color: 'var(--sage-primary)', fontWeight: 600 }}>
            AGENDA CLÍNICA // NOVEMBRO 2026
          </span>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-espresso)' }}>{doctorName}</div>
        </div>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--sage-primary)',
            fontSize: '10.5px',
            fontWeight: 700,
          }}
        >
          {variant === 'month' ? '■ VISÃO MENSAL' : '■ SLOTS RÁPIDOS'}
        </span>
      </header>

      {variant === 'month' && (
        <div
          role="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            marginBottom: '14px',
          }}
        >
          {days.map((d) => {
            const isSelected = d.dateIso === selectedDate;
            const hasSlots = d.slots.length > 0;
            return (
              <button
                key={d.dateIso}
                type="button"
                disabled={!hasSlots}
                aria-pressed={isSelected}
                onClick={() => onSelectDate(d.dateIso)}
                style={{
                  background: isSelected ? 'var(--sage-primary)' : hasSlots ? 'var(--surface-card)' : 'var(--paper-sunken)',
                  color: isSelected ? 'var(--surface-card)' : hasSlots ? 'var(--ink-espresso)' : 'var(--ink-muted)',
                  border: isSelected ? '1px solid var(--sage-primary)' : '1px solid var(--border-hairline)',
                  borderRadius: '12px',
                  padding: '8px 4px',
                  cursor: hasSlots ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '9.5px', textTransform: 'uppercase', opacity: 0.75 }}>{d.weekdayShort}</span>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', lineHeight: 1 }}>{d.dayNumber}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: isSelected ? 'var(--surface-card)' : 'var(--terracotta)' }}>
                  {hasSlots ? `${d.slots.length}h` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {(activeDay?.slots || []).map((slot) => {
          const active = slot === selectedSlot;
          return (
            <button
              key={slot}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectSlot(slot)}
              style={{
                background: active ? 'var(--sage-primary)' : 'var(--surface-card)',
                color: active ? 'var(--surface-card)' : 'var(--ink-espresso)',
                border: active ? '1px solid var(--sage-primary)' : '1px solid var(--border-strong)',
                borderRadius: '10px',
                padding: '9px 10px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </section>
  );
}
export default LuminaCalendar;
