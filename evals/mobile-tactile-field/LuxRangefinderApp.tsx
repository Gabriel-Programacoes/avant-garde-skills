import React, { useState, useRef } from 'react';

const SHUTTERS = ['1/30', '1/60', '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000'];

export function LuxRangefinderApp() {
  const [shutterIdx, setShutterIdx] = useState(4);
  const [sheetDetent, setSheetDetent] = useState<'peek' | 'half' | 'full'>('peek');
  const startX = useRef(0);

  return (
    <main
      className="h-dvh w-full overflow-hidden select-none tabular-nums flex flex-col justify-between"
      style={{
        height: '100dvh',
        touchAction: 'none',
        paddingTop: 'env(safe-area-inset-top, 12px)',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        background: 'oklch(17.0% 0.010 76.4)',
        color: 'oklch(96.0% 0.005 76.4)',
      }}
    >
      {/* Top Read-Only OLED Telemetry Well */}
      <section className="p-3 bg-[oklch(11.0%_0.006_76.4)] border-b border-[oklch(34.0%_0.020_76.4)]">
        <div className="flex justify-between text-xs font-mono">
          <span>LUX-M // OPTICAL METER</span>
          <span style={{ color: 'oklch(74.0% 0.155 76.4)' }}>EV +13.4</span>
        </div>
        <div className="text-3xl font-bold mt-1">{SHUTTERS[shutterIdx]}s · f/2.0 · ISO 160</div>
      </section>

      {/* Bottom Thumb Zone: Pointer-Captured Knurled Dial + 3-Detent Sheet */}
      <section
        className="p-4 flex flex-col gap-3"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const step = Math.round((e.clientX - startX.current) / 24);
          setShutterIdx((i) => Math.max(0, Math.min(SHUTTERS.length - 1, i + step)));
        }}
      >
        <div className="min-h-[52px] flex items-center justify-between px-4 rounded-xl border border-[oklch(34.0%_0.020_76.4)]">
          <span>SHUTTER DIAL</span>
          <span>{SHUTTERS[shutterIdx]}s</span>
        </div>
        <button
          onClick={() => setSheetDetent((d) => (d === 'peek' ? 'half' : d === 'half' ? 'full' : 'peek'))}
          className="min-h-[48px] w-full rounded-xl font-mono text-xs border border-[oklch(34.0%_0.020_76.4)]"
        >
          FILM STOCK SHEET ({sheetDetent.toUpperCase()})
        </button>
      </section>
    </main>
  );
}
export default LuxRangefinderApp;
