import React, { useState, useEffect, useRef } from 'react';

export function useDesktopKeymap(bindings: Record<string, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const inInput =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      const key = `${mod ? 'Mod+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key.toLowerCase()}`;
      if (inInput && !mod && e.key !== 'Escape') return;
      if (bindings[key]) {
        e.preventDefault();
        bindings[key](e);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bindings]);
}

export function NumberScrubber({
  value,
  onChange,
  label,
  unit = '',
  step = 1,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const valRef = useRef(value);
  valRef.current = value;

  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(2))));

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    let acc = valRef.current;
    const el = e.currentTarget;
    el.requestPointerLock?.();

    const onMouseMove = (ev: MouseEvent) => {
      const mult = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1;
      acc = clamp(acc + ev.movementX * step * mult);
      onChange(acc);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      if (document.pointerLockElement === el) document.exitPointerLock?.();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const dir = e.key === 'ArrowUp' ? 1 : -1;
    onChange(clamp(valRef.current + dir * step * mult));
  };

  return (
    <div
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      className={`flex items-center justify-between px-2 py-1 text-xs font-mono rounded bg-[var(--surface-sunken)] border cursor-ew-resize select-none ${
        isDragging ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
      }`}
    >
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="tabular-nums font-semibold">
        {value}
        {unit}
      </span>
    </div>
  );
}

export function HexRackApp() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trayOpen, setTrayOpen] = useState(true);
  const [cutoff, setCutoff] = useState(2480);

  useEffect(() => {
    const onFocus = () => document.body.classList.remove('window-blurred');
    const onBlur = () => document.body.classList.add('window-blurred');
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useDesktopKeymap({
    'Mod+k': () => setCmdOpen((v) => !v),
    'Mod+b': () => setSidebarOpen((v) => !v),
    'Mod+j': () => setTrayOpen((v) => !v),
    escape: () => setCmdOpen(false),
  });

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)] font-mono"
      style={{
        ['--surface-sunken' as string]: 'oklch(11.0% 0.006 38.8)',
        ['--surface-canvas' as string]: 'oklch(14.0% 0.008 38.8)',
        ['--surface-panel' as string]: 'oklch(17.0% 0.010 38.8)',
        ['--border-subtle' as string]: 'oklch(24.0% 0.012 38.8)',
        ['--accent-primary' as string]: 'oklch(67.6% 0.217 38.8)',
      }}
    >
      <header
        className="h-9 flex items-center justify-between px-3 border-b border-[var(--border-subtle)] bg-[var(--surface-panel)]"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2 pl-16" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <span className="text-xs font-semibold tabular-nums">HEX-RACK // DSP 48.0kHz</span>
        </div>
        <button
          onClick={() => setCmdOpen(true)}
          className="h-6 px-3 text-xs bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          Command Launcher <kbd className="ml-2 text-[10px]">⌘K</kbd>
        </button>
      </header>
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {sidebarOpen && <aside className="col-span-3 border-r border-[var(--border-subtle)] p-2">PATCH BANK</aside>}
        <section className="col-span-9 p-3">
          <NumberScrubber label="CUTOFF" value={cutoff} onChange={setCutoff} unit=" Hz" step={10} min={20} max={20000} />
          {trayOpen && <div className="mt-4 tabular-nums text-xs">DSP LOG READY</div>}
          {cmdOpen && <div role="dialog">COMMAND PALETTE</div>}
        </section>
      </main>
    </div>
  );
}
export default HexRackApp;
