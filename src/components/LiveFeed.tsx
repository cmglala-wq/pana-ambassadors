import { useEffect, useState } from 'react';
import { AMBASSADORS } from '../data/ambassadors';

type FeedEvent = {
  id: string;
  ts: string;
  ambassador: string;
  ambId: string;
  kind: 'install' | 'event';
  eventName?: string;
  icon: string;
  verb: string;
  country: string;
  weight: number;
};

type FeedResponse = {
  source: 'live' | 'mock';
  fetchedAt?: string;
  events: FeedEvent[];
  onFire: string[];
  trending: { ambId: string; name: string; count: number }[];
  counters: { last1h: number; last24h: number; total: number };
};

const FLAG_BY_CC: Record<string, string> = {
  DO: '🇩🇴', MX: '🇲🇽', CO: '🇨🇴', GT: '🇬🇹', HN: '🇭🇳', SV: '🇸🇻', US: '🇺🇸',
  AR: '🇦🇷', CL: '🇨🇱', PE: '🇵🇪', VE: '🇻🇪', EC: '🇪🇨', CR: '🇨🇷', PA: '🇵🇦', NI: '🇳🇮'
};

// Photo lookup — match feed's ambassador name to an existing photo from local mock pool
const PHOTO_POOL = [
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/72.jpg',
  'https://randomuser.me/api/portraits/men/27.jpg',
  'https://randomuser.me/api/portraits/men/41.jpg',
  'https://randomuser.me/api/portraits/men/56.jpg',
  'https://randomuser.me/api/portraits/men/64.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/women/48.jpg',
  'https://randomuser.me/api/portraits/women/67.jpg'
];
function photoFor(name: string) {
  const local = AMBASSADORS.find(a => a.name === name || a.name.toLowerCase().includes(name.toLowerCase()));
  if (local) return local.photo;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PHOTO_POOL[h % PHOTO_POOL.length];
}

function relTime(iso: string) {
  const d = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(d / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.floor(h / 24);
  return `hace ${days} d`;
}

export default function LiveFeed({ currentAmbassadorName }: { currentAmbassadorName?: string }) {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const r = await fetch('/api/feed', { cache: 'no-store' });
        if (!r.ok) return;
        const j = (await r.json()) as FeedResponse;
        if (!cancelled) {
          setData(prev => {
            // Trigger pulse animation when new events arrive
            if (prev && j.events[0]?.id !== prev.events[0]?.id) setPulse(p => p + 1);
            return j;
          });
          setLoading(false);
        }
      } catch { /* ignore */ }
    };

    load();
    const id = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl glass p-6 animate-pulse">
        <div className="h-3 w-24 bg-white/10 rounded mb-4"/>
        <div className="space-y-3">
          {[0,1,2].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10"/>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-white/10 rounded w-3/4"/>
                <div className="h-2 bg-white/5 rounded w-1/3"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isLive = data.source === 'live';
  const trending = data.trending[0];
  const onFireSet = new Set(data.onFire);

  return (
    <div className="rounded-3xl glass p-6 relative overflow-hidden">
      {/* Live pulse halo when new events arrive */}
      {pulse > 0 && (
        <div key={pulse} className="absolute inset-0 rounded-3xl pointer-events-none animate-glow" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-pana-lime' : 'bg-amber-300'} opacity-75 animate-ping`}/>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-pana-lime' : 'bg-amber-300'}`}/>
          </span>
          <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">
            En la red, ahora
          </div>
        </div>
        <div className="text-[10px] text-white/50 font-mono">
          {data.counters.last1h} eventos · 1h
        </div>
      </div>

      {/* Trending pill */}
      {trending && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-pana-lime/[0.10] to-pana-blue/[0.05] border border-pana-lime/25 p-3 flex items-center gap-3">
          <img src={photoFor(trending.name)} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-pana-lime"/>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.16em] text-pana-lime font-bold flex items-center gap-1">🔥 Trending hoy</div>
            <div className="text-sm font-bold truncate">{trending.name}</div>
            <div className="text-[11px] text-white/50">{trending.count} eventos en 24h</div>
          </div>
          <div className="text-right text-[10px] text-white/40">
            <div>+{trending.count}</div>
            <div className="text-pana-lime font-bold">activo</div>
          </div>
        </div>
      )}

      {/* Stream */}
      <div className="space-y-2.5 max-h-[440px] overflow-hidden no-scrollbar">
        {data.events.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm">
            La red descansa por ahora.<br/>
            <span className="text-pana-lime">Tú serás el próximo movimiento.</span>
          </div>
        )}
        {data.events.slice(0, 10).map((e, i) => {
          const isMe = currentAmbassadorName && e.ambassador.toLowerCase().includes(currentAmbassadorName.toLowerCase());
          const onFire = onFireSet.has(e.ambId);
          const flag = FLAG_BY_CC[e.country] || '';
          const accent = e.kind === 'install' ? 'border-pana-blue/30 bg-pana-blue/[0.05]'
                       : e.eventName === 'GlobalBankAccountApproved' ? 'border-pana-lime/30 bg-pana-lime/[0.06]'
                       : 'border-white/8 bg-white/[0.02]';
          return (
            <div
              key={e.id}
              className={`flex items-start gap-3 rounded-2xl p-3 border transition-all hover:bg-white/[0.06] ${accent} ${isMe ? '!border-pana-lime/60 !bg-pana-lime/[0.10]' : ''} animate-fadeUp`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative shrink-0">
                <img src={photoFor(e.ambassador)} alt="" className={`w-9 h-9 rounded-full object-cover ring-1 ${isMe ? 'ring-pana-lime' : onFire ? 'ring-orange-400' : 'ring-white/10'}`}/>
                {onFire && <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">🔥</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-tight">
                  <span className="font-bold text-white">{e.ambassador}</span>
                  {isMe && <span className="ml-1.5 text-[9px] uppercase tracking-wider text-pana-lime font-bold">Tú</span>}
                  <span className="text-white/55"> · {e.icon} {e.verb}</span>
                </div>
                <div className="text-[11px] text-white/40 mt-0.5 flex items-center gap-2">
                  <span>{relTime(e.ts)}</span>
                  {flag && <span>{flag}</span>}
                  {e.eventName === 'GlobalBankAccountApproved' && <span className="text-pana-lime font-bold">+$10</span>}
                </div>
              </div>
              <span className={`mt-1 w-1.5 h-1.5 rounded-full ${e.eventName === 'GlobalBankAccountApproved' ? 'bg-pana-lime shadow-[0_0_8px_rgba(207,255,4,0.7)]' : e.kind === 'install' ? 'bg-pana-blue' : 'bg-white/30'}`}/>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/5">
        <span>Actualizado {data.fetchedAt ? relTime(data.fetchedAt) : '—'}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-pana-lime animate-pulse"/>
          Auto-refresh 30s
        </span>
      </div>
    </div>
  );
}
