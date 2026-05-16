import { useEffect, useRef, useState } from 'react';

const MONTHS_ES_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export type DateRange = { from: string; to: string } | { all: true };

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const today = () => isoDay(new Date());
const startOfMonth = (d: Date) => isoDay(new Date(d.getFullYear(), d.getMonth(), 1));
const endOfMonth = (d: Date) => isoDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
const subDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return isoDay(d); };

export const DEFAULT_RANGE: DateRange = (() => { const d = new Date(); return { from: startOfMonth(d), to: today() }; })();

export function fmtRange(r: DateRange): string {
  if ('all' in r) return 'Histórico';
  const a = new Date(r.from + 'T00:00:00');
  const b = new Date(r.to + 'T00:00:00');
  const sameDay = r.from === r.to;
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const isWholeMonth = r.from === startOfMonth(a) && r.to === endOfMonth(a) && sameMonth;
  const isMonthToDate = r.from === startOfMonth(a) && r.to === today() && sameMonth && b.getMonth() === new Date().getMonth();
  if (isWholeMonth || isMonthToDate) return `${MONTHS_ES_LONG[a.getMonth()]} ${a.getFullYear()}`;
  if (sameDay) return a.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
  if (sameMonth) return `${a.getDate()}–${b.getDate()} ${MONTHS_ES_LONG[a.getMonth()].slice(0, 3)} ${a.getFullYear()}`;
  return `${a.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} – ${b.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' })}`;
}

const PRESETS: { id: string; label: string; build: () => DateRange }[] = [
  { id: 'this-month', label: 'Este mes', build: () => ({ from: startOfMonth(new Date()), to: today() }) },
  { id: 'last-month', label: 'Mes pasado', build: () => { const d = new Date(); d.setMonth(d.getMonth() - 1); return { from: startOfMonth(d), to: endOfMonth(d) }; } },
  { id: 'last-7d', label: 'Últimos 7 días', build: () => ({ from: subDays(6), to: today() }) },
  { id: 'last-30d', label: 'Últimos 30 días', build: () => ({ from: subDays(29), to: today() }) },
  { id: 'last-90d', label: 'Últimos 90 días', build: () => ({ from: subDays(89), to: today() }) },
  { id: 'all', label: 'Histórico', build: () => ({ all: true }) }
];

export default function DateRangePicker({ value, onChange, size = 'md' }: { value: DateRange; onChange: (r: DateRange) => void; size?: 'sm' | 'md' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Custom range working state
  const [customFrom, setCustomFrom] = useState<string>('all' in value ? subDays(29) : value.from);
  const [customTo, setCustomTo] = useState<string>('all' in value ? today() : value.to);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (!('all' in value)) {
      setCustomFrom(value.from);
      setCustomTo(value.to);
    }
  }, [value]);

  const sm = size === 'sm';
  const label = fmtRange(value);
  const isCurr = !('all' in value) && value.from === startOfMonth(new Date()) && value.to === today();

  function pickPreset(id: string) {
    const p = PRESETS.find(x => x.id === id);
    if (p) onChange(p.build());
    setOpen(false);
  }

  function applyCustom() {
    if (customFrom && customTo && customFrom <= customTo) {
      onChange({ from: customFrom, to: customTo });
      setOpen(false);
    }
  }

  // Detect which preset matches current value (for highlighting)
  const activePresetId = (() => {
    if ('all' in value) return 'all';
    for (const p of PRESETS) {
      const r = p.build();
      if (!('all' in r) && r.from === value.from && r.to === value.to) return p.id;
    }
    return 'custom';
  })();

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-2 rounded-full border transition-colors ${sm ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} ${open ? 'glass-strong border-pana-lime/40' : 'glass border-white/10 hover:border-white/25'}`}
      >
        <svg width={sm ? 12 : 14} height={sm ? 12 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-pana-lime">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="font-bold">{label}</span>
        {isCurr && <span className="text-[9px] uppercase tracking-wider text-pana-lime font-bold">Actual</span>}
        <svg width={sm ? 10 : 12} height={sm ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''} text-white/50`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 right-0 w-[320px] glass-strong rounded-2xl p-3 shadow-2xl shadow-black/60 animate-fadeUp">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2 px-1">Atajos</div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => pickPreset(p.id)}
                className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors ${activePresetId === p.id ? 'bg-pana-lime text-pana-navy' : 'text-white/85 bg-white/[0.04] hover:bg-white/[0.08]'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="divider my-2"/>

          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2 px-1">Personalizado</div>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-1 px-1">Desde</label>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                max={customTo}
                className="!py-2 !px-3 text-sm w-full"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-1 px-1">Hasta</label>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                min={customFrom}
                max={today()}
                className="!py-2 !px-3 text-sm w-full"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <button onClick={applyCustom} disabled={!customFrom || !customTo || customFrom > customTo} className="btn-lime w-full !py-2.5 !text-xs justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              Aplicar rango
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
