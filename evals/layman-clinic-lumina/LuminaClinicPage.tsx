import React, { useState } from 'react';
import { LuminaNavPill } from './components/ui/LuminaNavPill';
import { LuminaSegmentedPill } from './components/ui/LuminaSegmentedPill';
import { LuminaCalendar, CalendarDaySlot } from './components/ui/LuminaCalendar';

const PROTOCOLS = [
  { id: 'glow', label: 'Glow & Manchas', name: 'Laser Lavieen + Exossomos Botânicos', duration: '45 min', price: '680', recovery: 'Zero downtime', hydration: '+64% em 7d' },
  { id: 'lift', label: 'Firmeza 4D', name: 'Ultrassom Microfocado Ultraformer MPT', duration: '60 min', price: '1.290', recovery: 'Imediato', hydration: '+82% firmeza' },
  { id: 'hydra', label: 'Barreira & Poros', name: 'Bioremodelação Profhilo + LED Âmbar', duration: '40 min', price: '920', recovery: 'Zero downtime', hydration: '+91% turgor' },
];

const HERO_DAYS: CalendarDaySlot[] = [
  { dateIso: '2026-11-05', dayNumber: 5, weekdayShort: 'Qui', slots: ['Hoje · 16:30', 'Amanhã · 10:00', 'Qui · 14:30'], recommended: true },
];

export function LuminaClinicPage() {
  const [selectedId, setSelectedId] = useState('glow');
  const [selectedDate, setSelectedDate] = useState('2026-11-05');
  const [selectedSlot, setSelectedSlot] = useState('Hoje · 16:30');
  const selected = PROTOCOLS.find((p) => p.id === selectedId) || PROTOCOLS[0];

  return (
    <main
      className="min-h-screen tabular-nums"
      style={{
        background: 'var(--paper-stone, oklch(97.0% 0.009 78.0))',
        color: 'var(--ink-espresso, oklch(18.0% 0.022 155.0))',
      }}
    >
      <LuminaNavPill activeRoute="home" />

      <section className="mx-auto max-w-6xl py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-6xl leading-[0.95]">Ciência celular para uma pele naturalmente luminosa.</h1>
        </div>
        <aside className="lg:col-span-5 p-6 rounded-3xl bg-white border flex flex-col gap-4">
          <LuminaSegmentedPill
            options={PROTOCOLS.map((p) => ({ id: p.id, label: p.label }))}
            activeId={selectedId}
            onChange={setSelectedId}
          />
          <div className="p-4 rounded-2xl">
            <h3 className="font-bold text-lg">{selected.name}</h3>
            <div className="text-3xl font-serif mt-2">R$ {selected.price}</div>
          </div>
          <LuminaCalendar
            variant="compact"
            days={HERO_DAYS}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectDate={setSelectedDate}
            onSelectSlot={setSelectedSlot}
          />
        </aside>
      </section>
    </main>
  );
}
export default LuminaClinicPage;
