import React, { useState } from 'react';
import { LuminaNavPill } from './components/ui/LuminaNavPill';
import { LuminaSegmentedPill } from './components/ui/LuminaSegmentedPill';
import { LuminaCalendar, CalendarDaySlot } from './components/ui/LuminaCalendar';

const NOVEMBER_SCHEDULE: CalendarDaySlot[] = [
  { dateIso: '2026-11-09', dayNumber: 9, weekdayShort: 'Seg', slots: ['09:30', '14:00'] },
  { dateIso: '2026-11-10', dayNumber: 10, weekdayShort: 'Ter', slots: ['11:00', '15:30', '17:00'] },
  { dateIso: '2026-11-11', dayNumber: 11, weekdayShort: 'Qua', slots: [] },
  { dateIso: '2026-11-12', dayNumber: 12, weekdayShort: 'Qui', slots: ['10:00', '14:30', '16:30'], recommended: true },
  { dateIso: '2026-11-13', dayNumber: 13, weekdayShort: 'Sex', slots: ['09:00', '13:30'] },
  { dateIso: '2026-11-14', dayNumber: 14, weekdayShort: 'Sáb', slots: ['10:30'] },
  { dateIso: '2026-11-15', dayNumber: 15, weekdayShort: 'Dom', slots: [] },
];

export function PatientPortalScreen() {
  const [activeTab, setActiveTab] = useState('evolucao');
  const [selectedDate, setSelectedDate] = useState('2026-11-12');
  const [selectedSlot, setSelectedSlot] = useState('16:30');

  return (
    <main
      className="min-h-screen tabular-nums"
      style={{
        background: 'var(--paper-stone)',
        color: 'var(--ink-espresso)',
      }}
    >
      {/* Reused Component #1 from Screen 1 */}
      <LuminaNavPill activeRoute="portal" patientName="Marina Alencar" />

      <section className="mx-auto max-w-6xl py-6 px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Reused Component #2 from Screen 1 */}
          <LuminaSegmentedPill
            options={[
              { id: 'evolucao', label: 'Evolução Dérmica 3D' },
              { id: 'sessoes', label: 'Ciclo de Sessões (2/3)' },
              { id: 'homecare', label: 'Prescrição Tópica' },
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <aside className="lg:col-span-5">
          {/* Reused Component #3 from Screen 1 (Monthly Calendar Mode) */}
          <LuminaCalendar
            variant="month"
            days={NOVEMBER_SCHEDULE}
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
export default PatientPortalScreen;
