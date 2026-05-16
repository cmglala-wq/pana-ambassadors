import { useEffect, useRef, useState } from 'react';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_ES_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function fmtMonth(ym: string, long = true): string {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return ym;
  return `${(long ? MONTHS_ES_LONG : MONTHS_ES)[m - 1]} ${y}`;
}

export function currentMonth(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

export function isCurrentMonth(ym: string): boolean {
  return ym === currentMonth();
}

type Props = {
  value: string | 'all';
  onChange: (v: string | 'all') => void;
  options: string[];
  size?: 'sm' | 'md';
  showAllTime?: boolean;
};

export default function MonthPicker({ value, onChange, options, size = 'md', showAllTime = true }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const label = value === 'all' ? 'Histórico' : fmtMonth(value);
  const isCurr = value !== 'all' && isCurrentMonth(value);
  const sm = size === 'sm';

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
        <div className="absolute z-40 mt-2 right-0 min-w-[220px] glass-strong rounded-2xl p-2 shadow-2xl shadow-black/60 animate-fadeUp">
          {showAllTime && (
            <button
              onClick={() => { onChange('all'); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-colors ${value === 'all' ? 'bg-pana-lime text-pana-navy font-bold' : 'text-white/85 hover:bg-white/5'}`}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-60"/>
              Histórico (todo el tiempo)
            </button>
          )}
          {showAllTime && options.length > 0 && <div className="divider my-1"/>}
          <div className="max-h-[260px] overflow-y-auto no-scrollbar">
            {options.map(m => {
              const isSelected = m === value;
              const isCurr = isCurrentMonth(m);
              return (
                <button
                  key={m}
                  onClick={() => { onChange(m); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-sm transition-colors ${isSelected ? 'bg-pana-lime text-pana-navy font-bold' : 'text-white/85 hover:bg-white/5'}`}
                >
                  <span>{fmtMonth(m)}</span>
                  {isCurr && <span className={`text-[9px] uppercase tracking-wider font-bold ${isSelected ? 'text-pana-navy/70' : 'text-pana-lime'}`}>Este mes</span>}
                </button>
              );
            })}
            {options.length === 0 && <div className="text-center py-4 text-white/40 text-xs">Sin meses con datos</div>}
          </div>
        </div>
      )}
    </div>
  );
}
