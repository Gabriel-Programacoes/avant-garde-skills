import React from 'react';

export function ChameleonShowcase() {
  return (
    <main className="h-screen w-screen overflow-hidden grid grid-cols-2 select-none tabular-nums">
      {/* LEFT HALF: Sunlit Optical Glassmorphism (visionOS / Leica Acrylic) */}
      <section
        className="p-8 flex flex-col justify-between"
        style={{
          background: 'oklch(95.5% 0.018 82)',
          color: 'oklch(18.0% 0.025 250)',
        }}
      >
        <div
          className="p-6 rounded-2xl"
          style={{
            backdropFilter: 'blur(18px) saturate(190%)',
            boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.75)',
            background: 'oklch(99% 0.005 85 / 0.52)',
          }}
        >
          <h2 className="text-3xl font-serif">Helios Optical Weather Lens</h2>
          <p className="mt-2 text-xs">24.8°C · UV Index 07 · Barometer 1018 hPa</p>
        </div>
      </section>

      {/* RIGHT HALF: Authentic 1989 Pixel / 1-Bit Retro OS */}
      <section
        className="p-8 flex flex-col justify-between"
        style={{
          background: 'oklch(86.0% 0.035 95)',
          color: 'oklch(16.0% 0.015 95)',
          imageRendering: 'pixelated',
        }}
      >
        <div
          className="p-6 border-2 border-current"
          style={{ boxShadow: '4px 4px 0px oklch(16.0% 0.015 95)' }}
        >
          <h2 className="text-2xl font-mono">CHRONO-BIT // 1989 POCKET OS</h2>
          <p className="mt-2 text-xs">EXP: 1,420 PT · STREAK: 18 DAYS</p>
        </div>
      </section>
    </main>
  );
}
export default ChameleonShowcase;
