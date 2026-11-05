import React, { useState } from 'react';

export interface BasinRecord {
  id: string;
  name: string;
  lat: string;
  series: number[];
  sigma: number;
  regime: 'BREACH >2σ' | 'ELEVATED' | 'UPWELLING COOL';
}

const BASINS: BasinRecord[] = [
  { id: 'IRM', name: 'Subtropical Gyre (24°N)', lat: '24.2°N 48.0°W', series: [0.08, 0.22, 0.45, 0.68, 0.94, 1.42], sigma: 2.84, regime: 'BREACH >2σ' },
  { id: 'NOR', name: 'Norwegian Sea (66°N)', lat: '66.4°N 04.2°E', series: [0.02, 0.19, 0.51, 0.74, 1.05, 1.31], sigma: 2.62, regime: 'BREACH >2σ' },
  { id: 'GUI', name: 'Guiana Current (08°N)', lat: '08.5°N 52.1°W', series: [0.11, 0.28, 0.49, 0.62, 0.88, 1.18], sigma: 2.36, regime: 'BREACH >2σ' },
  { id: 'CAN', name: 'Canary Upwelling (28°N)', lat: '28.1°N 16.4°W', series: [0.05, 0.14, 0.31, 0.52, 0.79, 1.09], sigma: 2.18, regime: 'BREACH >2σ' },
  { id: 'LAB', name: 'Labrador Basin (56°N)', lat: '56.0°N 53.5°W', series: [-0.12, 0.04, 0.29, 0.41, 0.64, 0.86], sigma: 1.72, regime: 'ELEVATED' },
  { id: 'sub', name: 'Irminger Cold Pool (59°N)', lat: '59.2°N 32.8°W', series: [0.04, -0.18, -0.34, -0.48, -0.22, -0.09], sigma: -0.38, regime: 'UPWELLING COOL' },
];

export function PelagicObservatory() {
  const [baseIdx, setBaseIdx] = useState(0);

  return (
    <main
      className="min-h-screen p-6 font-mono text-xs tabular-nums"
      style={{
        background: 'oklch(95.5% 0.016 75)',
        color: 'oklch(17.0% 0.018 55)',
      }}
    >
      <header className="border-b border-current pb-4 mb-6 flex justify-between items-baseline">
        <h1 className="font-serif text-4xl">North Atlantic Thermohaline Anomaly (+2.84σ Regime Shift)</h1>
        <div className="flex gap-2">
          {['1980', '1990', '2000', '2010', '2020'].map((yr, idx) => (
            <button
              key={yr}
              onClick={() => setBaseIdx(idx)}
              className="px-2 py-1 border border-current"
            >
              BASE: {yr}
            </button>
          ))}
        </div>
      </header>

      <svg role="img" aria-label="North Atlantic SST anomaly trajectory with ±2 sigma threshold annotations" viewBox="0 0 800 240" className="w-full h-auto">
        <g className="annotation">
          <line x1={40} x2={720} y1={50} y2={50} stroke="oklch(48.0% 0.210 26.0)" strokeDasharray="4 3" />
          <text x={725} y={53} fill="oklch(48.0% 0.210 26.0)">+2.0σ THRESHOLD (+1.00°C)</text>
        </g>
      </svg>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="border-b border-current text-left">
            <th>BASIN</th>
            <th>SPARKLINE &amp; BARCODE</th>
            <th>RE-INDEXED Δ°C</th>
            <th>SIGMA</th>
          </tr>
        </thead>
        <tbody>
          {BASINS.map((b) => {
            const delta = b.series[b.series.length - 1] - b.series[baseIdx];
            return (
              <tr key={b.id} className="border-b border-current/20">
                <td>{b.name}</td>
                <td>
                  <svg role="img" aria-label={`${b.name} inline sparkline`} viewBox="0 0 120 24" className="w-28 h-6">
                    <path d="M0,20 L120,4" stroke="oklch(48.0% 0.210 26.0)" fill="none" />
                  </svg>
                </td>
                <td>{delta >= 0 ? `+${delta.toFixed(2)}°C` : `${delta.toFixed(2)}°C`}</td>
                <td>{b.sigma.toFixed(2)}σ</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
export default PelagicObservatory;
