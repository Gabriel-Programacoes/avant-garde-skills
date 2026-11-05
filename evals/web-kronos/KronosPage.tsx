import React, { useState, useEffect } from 'react';

type ChapterId = '01' | '02' | '03' | '04';

interface ChapterSpec {
  id: ChapterId;
  code: string;
  title: string;
  subtitle: string;
  vph: number;
  hz: number;
  tolerance: string;
  beatError: string;
  amplitude: string;
  notes: string[];
  rawLog: { axis: string; nominal: string; measured: string; delta: string; status: string }[];
}

const CHAPTERS: Record<ChapterId, ChapterSpec> = {
  '01': {
    id: '01',
    code: 'REV-09.A // ESCAPEMENT',
    title: 'Co-Axial Silicon Impulse Escapement',
    subtitle: 'Tangential impulse geometry eliminating sliding friction across pallet jewels.',
    vph: 28800,
    hz: 4.0,
    tolerance: '±0.0008 mm',
    beatError: '0.1 ms',
    amplitude: '312°',
    notes: [
      'DRAWN NOTE [14:02]: Escape wheel tooth flank undercut by 1.4° to prevent oil-film meniscus drag.',
      'MATERIAL SPEC: DRIE-etched monocrystalline silicon wafer (orientation <100>, 142 µm thickness).',
      'REJECTED REV-08: Beryllium-bronze anchor showed 0.4 ms drift after 420h thermal cycling.',
    ],
    rawLog: [
      { axis: 'PALLET-LIFT-ANGLE', nominal: '52.000°', measured: '52.004°', delta: '+0.004°', status: 'PASS' },
      { axis: 'IMPULSE-PIN-RAD', nominal: '0.3400 mm', measured: '0.3396 mm', delta: '-0.0004 mm', status: 'PASS' },
      { axis: 'FORK-HORN-CLEAR', nominal: '0.0450 mm', measured: '0.0452 mm', delta: '+0.0002 mm', status: 'PASS' },
      { axis: 'GUARD-PIN-DEPTH', nominal: '0.0220 mm', measured: '0.0219 mm', delta: '-0.0001 mm', status: 'PASS' },
    ],
  },
  '02': {
    id: '02',
    code: 'REV-09.B // ISOCHRONISM',
    title: 'Free-Sprung Cylindrical Overcoil',
    subtitle: '6-position acoustic laser interferometry across 68-hour power reserve.',
    vph: 36000,
    hz: 5.0,
    tolerance: '±0.0005 mm',
    beatError: '0.0 ms',
    amplitude: '298°',
    notes: [
      'TERMINAL CURVE: Phillips outer curve #14 modified with laser-ablated inner collet.',
      'INERTIA TRIM: 4 recessed platinum-iridium timing weights (0.18 mg per quarter-turn).',
      'THERMAL COEFFICIENT: +0.09 sec/day/°C verified between 8°C and 38°C.',
    ],
    rawLog: [
      { axis: 'POS-DIAL-UP (CH)', nominal: '+0.00 s/d', measured: '+0.18 s/d', delta: '+0.18 s/d', status: 'PASS' },
      { axis: 'POS-CROWN-DOWN (9H)', nominal: '+0.00 s/d', measured: '-0.22 s/d', delta: '-0.22 s/d', status: 'PASS' },
      { axis: 'POS-CROWN-LEFT (6H)', nominal: '+0.00 s/d', measured: '+0.31 s/d', delta: '+0.31 s/d', status: 'PASS' },
      { axis: 'ISO-24H-DECAY', nominal: '<0.80 s/d', measured: '0.29 s/d', delta: '-0.51 s/d', status: 'PASS' },
    ],
  },
  '03': {
    id: '03',
    code: 'REV-09.C // ACOUSTIC',
    title: 'Anharmonic Strike & Gear Train',
    subtitle: 'Involute tooth profile milled on 5-axis kern micro-hd at 48,000 RPM.',
    vph: 21600,
    hz: 3.0,
    tolerance: '±0.0011 mm',
    beatError: '0.2 ms',
    amplitude: '318°',
    notes: [
      'ACOUSTIC TRACE: 18.4 kHz impulse transient damped via grade-5 titanium bridge ribs.',
      'TORQUE RIPPLE: Reduced from 4.8% (standard epicycloidal) to 1.1% across barrel unwind.',
      'LUBRICATION: Dry MoS2 plasma-sputtered pivots; zero wet synthetic oil on escape teeth.',
    ],
    rawLog: [
      { axis: 'BARREL-TORQUE-MAX', nominal: '980.0 µNm', measured: '982.4 µNm', delta: '+2.4 µNm', status: 'PASS' },
      { axis: 'THIRD-WHEEL-RUNOUT', nominal: '0.0015 mm', measured: '0.0009 mm', delta: '-0.0006 mm', status: 'PASS' },
      { axis: 'ESCAPE-PINION-END', nominal: '0.0150 mm', measured: '0.0148 mm', delta: '-0.0002 mm', status: 'PASS' },
      { axis: 'ACOUSTIC-Q-FACTOR', nominal: '64.2 dB', measured: '64.8 dB', delta: '+0.6 dB', status: 'PASS' },
    ],
  },
  '04': {
    id: '04',
    code: 'REV-09.D // ALLOCATION',
    title: 'Bench Casing & Raw Serial Ledger',
    subtitle: '18 movements assembled per annum in La Chaux-de-Fonds. Direct bench allocation.',
    vph: 28800,
    hz: 4.0,
    tolerance: '±0.0004 mm',
    beatError: '0.1 ms',
    amplitude: '310°',
    notes: [
      'DELIVERY INCLUDES: Raw CNC brass test-plate, signed interferometry tape, and 10x loupe.',
      'CASE METAL: Tantalum-992 monolithic ring with sapphire exhibition flank.',
      'WARRANTY: Lifetime bench service directly with the watchmaker who signed the bridge.',
    ],
    rawLog: [
      { axis: 'SERIAL #09-01', nominal: 'GENEVA', measured: 'DELIVERED', delta: '0.14 s/d', status: 'LOCKED' },
      { axis: 'SERIAL #09-02', nominal: 'ZURICH', measured: 'TESTING', delta: '0.19 s/d', status: 'BENCH' },
      { axis: 'SERIAL #09-03', nominal: 'KYOTO', measured: 'AVAILABLE', delta: '0.11 s/d', status: 'OPEN' },
      { axis: 'SERIAL #09-04', nominal: 'SÃO PAULO', measured: 'AVAILABLE', delta: '0.16 s/d', status: 'OPEN' },
    ],
  },
};

export function KronosPage() {
  const [activeId, setActiveId] = useState<ChapterId>('01');
  const [customHz, setCustomHz] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const spec = CHAPTERS[activeId];
  const hz = customHz ?? spec.hz;

  return (
    <main
      className="min-h-screen md:h-screen md:overflow-hidden grid grid-cols-1 md:grid-cols-13 bg-[var(--paper)] text-[var(--ink)]"
      style={{
        ['--paper' as string]: 'oklch(96.5% 0.008 85)',
        ['--ink' as string]: 'oklch(16.0% 0.020 260)',
        ['--dominant' as string]: 'oklch(37.9% 0.195 263.2)',
        ['--signal' as string]: 'oklch(62.0% 0.210 28.0)',
      }}
    >
      <section className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-[var(--ink)]/20 flex flex-col justify-between">
        <header className="flex justify-between items-baseline font-mono text-xs">
          <span>KRONOS // LAB BENCH 09</span>
          <span>{spec.code}</span>
        </header>
        <div>
          <h1 className="font-serif text-5xl leading-[0.88] tracking-tight">{spec.title}</h1>
          <p className="mt-3 text-sm opacity-80">{spec.subtitle}</p>
        </div>
        <nav aria-label="Blueprint chapters" className="grid grid-cols-4 gap-2 font-mono text-xs">
          {(['01', '02', '03', '04'] as ChapterId[]).map((id) => (
            <button
              key={id}
              onClick={() => {
                setActiveId(id);
                setCustomHz(null);
              }}
              className={`p-2 border text-left transition-transform ${
                activeId === id ? 'bg-[var(--dominant)] text-[var(--paper)]' : 'border-[var(--ink)]/30'
              }`}
            >
              CH.{id}
            </button>
          ))}
        </nav>
      </section>
      <section className="md:col-span-8 p-6 flex flex-col justify-between">
        <div className="font-mono text-xs flex justify-between">
          <span>FREQ: {hz.toFixed(1)} HZ ({Math.round(hz * 7200)} VPH)</span>
          <span>MOTION: {reducedMotion ? 'STATIC' : 'LIVE KINEMATIC'}</span>
        </div>
      </section>
    </main>
  );
}
export default KronosPage;
