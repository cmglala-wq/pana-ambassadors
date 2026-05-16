import { useMemo, useState } from 'react';
import { CONTENT_SUBMISSIONS, CONTENT_TOTALS, PLATFORM_META, STATUS_META, type ContentStatus, type Platform, type ContentSubmission } from '../data/content';
import PlatformIcon from './PlatformIcon';

type Variant = 'compact' | 'admin';

export default function ContentBoard({ variant = 'compact', ambassadorName }: { variant?: Variant; ambassadorName?: string }) {
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'ALL'>('ALL');

  const list = useMemo(() => {
    let items = [...CONTENT_SUBMISSIONS];
    if (variant === 'compact' && ambassadorName) {
      items = items.filter(c => c.ambassadorName.toLowerCase() === ambassadorName.toLowerCase());
    }
    if (statusFilter !== 'ALL') items = items.filter(c => c.status === statusFilter);
    if (platformFilter !== 'ALL') items = items.filter(c => c.platform === platformFilter);
    return items.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [variant, ambassadorName, statusFilter, platformFilter]);

  if (variant === 'compact') {
    return <CompactBoard items={list} ambassadorName={ambassadorName}/>;
  }

  return (
    <AdminBoard
      items={list}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      platformFilter={platformFilter}
      setPlatformFilter={setPlatformFilter}
    />
  );
}

function CompactBoard({ items, ambassadorName }: { items: ContentSubmission[]; ambassadorName?: string }) {
  const top = items.slice(0, 3);
  const myStats = useMemo(() => {
    const mine = ambassadorName ? CONTENT_SUBMISSIONS.filter(c => c.ambassadorName.toLowerCase() === ambassadorName.toLowerCase()) : [];
    return {
      total: mine.length,
      paid: mine.filter(c => c.status === 'paid').length,
      pending: mine.filter(c => c.status === 'pending_review').length,
      earnings: mine.filter(c => c.status === 'paid').reduce((s, c) => s + (c.payoutUsd || 0), 0)
    };
  }, [ambassadorName]);

  return (
    <div className="rounded-3xl glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Mi contenido</div>
          <h3 className="h-display text-xl mt-1">Videos y posts</h3>
        </div>
        <span className="text-[10px] text-white/45 font-mono">{myStats.total} total</span>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <MiniBox label="Aprobados" value={CONTENT_SUBMISSIONS.filter(c => c.status === 'approved' && c.ambassadorName.toLowerCase() === (ambassadorName || '').toLowerCase()).length}/>
        <MiniBox label="Pendientes" value={myStats.pending}/>
        <MiniBox label="Pagado" value={`$${myStats.earnings}`} accent/>
      </div>

      <div className="space-y-2 max-h-[460px] overflow-hidden no-scrollbar">
        {top.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm">
            Aún no has subido contenido.<br/>
            <span className="text-pana-lime">Sube tu primer video y arranca el track Influencer.</span>
          </div>
        )}
        {top.map((c, i) => <ContentRow key={c.id} c={c} compact delay={i * 70}/>)}
      </div>

      <button className="mt-4 w-full btn-lime !py-2.5 text-sm justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Subir nuevo contenido
      </button>

      <div className="mt-3 text-[10px] text-white/40 text-center">
        Marketing revisa en 24–48 h. Aprobado paga $100–$400 por pieza.
      </div>
    </div>
  );
}

function AdminBoard({ items, statusFilter, setStatusFilter, platformFilter, setPlatformFilter }: {
  items: ContentSubmission[];
  statusFilter: ContentStatus | 'ALL';
  setStatusFilter: (v: ContentStatus | 'ALL') => void;
  platformFilter: Platform | 'ALL';
  setPlatformFilter: (v: Platform | 'ALL') => void;
}) {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Pendiente revisión" value={CONTENT_TOTALS.pending} hint="Esperando marketing" tone="amber"/>
        <Kpi label="Aprobado" value={CONTENT_TOTALS.approved} hint={`$${CONTENT_TOTALS.pendingPayout.toLocaleString()} por pagar`} tone="lime"/>
        <Kpi label="Pagado YTD" value={`$${CONTENT_TOTALS.totalPayout.toLocaleString()}`} hint={`${CONTENT_TOTALS.paid} videos`} tone="fuchsia"/>
        <Kpi label="Views totales" value={CONTENT_TOTALS.totalViews.toLocaleString()} hint="Estimado de plataformas"/>
      </div>

      {/* Filters */}
      <div className="rounded-3xl glass p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Cola de revisión</div>
            <h3 className="h-display text-xl mt-0.5">{items.length} {items.length === 1 ? 'pieza' : 'piezas'}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="!w-auto !py-2 !px-3 text-sm">
              <option value="ALL">Todos los estados</option>
              <option value="pending_review">En revisión</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="paid">Pagado</option>
            </select>
            <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as any)} className="!w-auto !py-2 !px-3 text-sm">
              <option value="ALL">Todas las plataformas</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">X / Twitter</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.length === 0 && <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-white/40 text-sm">Sin contenido para este filtro.</div>}
          {items.map((c, i) => <ContentCard key={c.id} c={c} delay={i * 50}/>)}
        </div>
      </div>
    </div>
  );
}

function ContentRow({ c, compact, delay = 0 }: { c: ContentSubmission; compact?: boolean; delay?: number }) {
  const status = STATUS_META[c.status];
  const platform = PLATFORM_META[c.platform];
  return (
    <a href={c.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-2.5 transition-all animate-fadeUp" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-pana-navy-2 shrink-0">
        <img src={c.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute bottom-1 left-1 w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ background: platform.bg.startsWith('linear') ? platform.bg : platform.bg }}>
          <PlatformIcon platform={c.platform} size={10}/>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{c.title}</div>
        <div className="text-[10px] text-white/45 mt-0.5 flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded-full ${status.bg} ${status.color} ${status.ring} border text-[9px] font-bold uppercase tracking-wider`}>{status.label}</span>
          {c.payoutUsd && <span className="text-pana-lime font-bold">${c.payoutUsd}</span>}
        </div>
      </div>
    </a>
  );
}

function ContentCard({ c, delay = 0 }: { c: ContentSubmission; delay?: number }) {
  const status = STATUS_META[c.status];
  const platform = PLATFORM_META[c.platform];

  return (
    <div className="rounded-2xl glass border border-white/8 overflow-hidden hover:-translate-y-0.5 transition-all animate-fadeUp" style={{ animationDelay: `${delay}ms` }}>
      {/* Thumbnail with platform badge */}
      <a href={c.url} target="_blank" rel="noreferrer" className="block relative aspect-[3/4] bg-pana-navy-2 overflow-hidden group">
        <img src={c.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"/>

        {/* Platform pill */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-md" style={{ background: platform.bg.startsWith('linear') ? platform.bg : platform.bg + 'dd' }}>
          <PlatformIcon platform={c.platform} size={11}/>
          <span>{platform.label}</span>
        </div>

        {/* Status pill */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${status.bg} ${status.color} ${status.ring}`}>
          {status.label}
        </div>

        {/* Engagement */}
        {(c.views || 0) > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-white/95 text-[11px] font-bold">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {(c.views! / 1000).toFixed(1)}K
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {(c.likes! / 1000).toFixed(1)}K
            </span>
          </div>
        )}
      </a>

      <div className="p-3.5">
        {/* Ambassador */}
        <div className="flex items-center gap-2 mb-2">
          <img src={c.ambassadorPhoto} alt="" loading="lazy" className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"/>
          <span className="text-[11px] font-medium text-white/85 truncate">{c.ambassadorName}</span>
          <span className="text-[10px] text-white/40 ml-auto">{relTime(c.submittedAt)}</span>
        </div>

        <div className="font-display text-sm text-white leading-tight mb-1">{c.title}</div>
        <div className="text-[11px] text-white/55 leading-relaxed line-clamp-2 mb-3">{c.caption}</div>

        {c.status === 'rejected' && c.rejectionReason && (
          <div className="rounded-lg bg-red-400/[0.08] border border-red-400/20 p-2 mb-3">
            <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold mb-1">Razón rechazo</div>
            <div className="text-[11px] text-white/70 leading-relaxed">{c.rejectionReason}</div>
          </div>
        )}

        {/* Footer: payout + actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
          {c.payoutUsd ? (
            <div className="text-[11px]">
              <span className="text-white/40">Payout: </span>
              <span className="font-display text-pana-lime">${c.payoutUsd}</span>
              {c.paidAt && <span className="ml-1.5 text-[9px] uppercase tracking-wider text-fuchsia-300 font-bold">PAGADO</span>}
            </div>
          ) : (
            <div className="text-[11px] text-white/40">{c.status === 'pending_review' ? 'Pendiente revisar' : 'Sin payout'}</div>
          )}
          {c.status === 'pending_review' && (
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pana-lime/15 text-pana-lime border border-pana-lime/30 hover:bg-pana-lime hover:text-pana-navy transition-colors">Aprobar</button>
              <button className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-400/10 text-red-300 border border-red-400/30 hover:bg-red-400 hover:text-white transition-colors">Rechazar</button>
            </div>
          )}
          {c.status === 'approved' && (
            <button className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/40 hover:bg-fuchsia-500 hover:text-white transition-colors">Marcar pagado</button>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border ${accent ? 'bg-pana-lime/[0.06] border-pana-lime/25' : 'bg-white/[0.04] border-white/8'} p-2.5 text-center`}>
      <div className="text-[9px] uppercase tracking-[0.14em] text-white/45 font-bold">{label}</div>
      <div className={`font-display text-base mt-0.5 ${accent ? 'text-pana-lime' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function Kpi({ label, value, hint, tone }: { label: string; value: string | number; hint?: string; tone?: 'lime' | 'amber' | 'fuchsia' }) {
  const ring = tone === 'lime' ? 'border-pana-lime/30 bg-pana-lime/[0.05]' : tone === 'amber' ? 'border-amber-300/30 bg-amber-300/[0.05]' : tone === 'fuchsia' ? 'border-fuchsia-500/30 bg-fuchsia-500/[0.05]' : 'border-white/10';
  const color = tone === 'lime' ? 'text-pana-lime' : tone === 'amber' ? 'text-amber-300' : tone === 'fuchsia' ? 'text-fuchsia-300' : 'text-white';
  return (
    <div className={`rounded-2xl p-5 glass-strong border ${ring}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-bold">{label}</div>
      <div className={`font-display text-3xl mt-2 ${color}`}>{value}</div>
      {hint && <div className="text-[11px] text-white/45 mt-1">{hint}</div>}
    </div>
  );
}

function relTime(iso: string) {
  const d = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(d / 60000);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.floor(h / 24);
  return `hace ${days} d`;
}
