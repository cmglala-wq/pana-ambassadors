import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import SimpleChart from '../components/SimpleChart';
import { resolveSession, SessionUser, setAdmin } from '../lib/session';
import {
  AMBASSADORS, COUNTRY_BREAKDOWN, MONTHLY_GROWTH, TOTALS, ALL_PAYMENTS, PAYMENTS_BY_MONTH,
  countryFlag, type Country, type Track, type ContractStatus, type Ambassador
} from '../data/ambassadors';

type SortKey = 'rank' | 'name' | 'country' | 'joinedAt' | 'installs' | 'approved' | 'commission';
type Tab = 'ambassadors' | 'contracts' | 'payments';

export default function Admin() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('ambassadors');
  const [country, setCountry] = useState<Country | 'ALL'>('ALL');
  const [track, setTrack] = useState<Track | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('commission');
  const [sortAsc, setSortAsc] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    resolveSession().then(s => {
      if (!s) { nav('/login'); return; }
      setAdmin(true);
      setSession({ ...s, isAdmin: true });
      setLoading(false);
    });
  }, [nav]);

  const filtered = useMemo(() => {
    let list = AMBASSADORS;
    if (country !== 'ALL') list = list.filter(a => a.country === country);
    if (track !== 'ALL') list = list.filter(a => a.track === track);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      const av = (a as any)[sortKey], bv = (b as any)[sortKey];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [country, track, search, sortKey, sortAsc]);

  const installsSeries = MONTHLY_GROWTH.map(m => ({ x: m.month, y: m.installs }));
  const approvedSeries = MONTHLY_GROWTH.map(m => ({ x: m.month, y: m.approved }));
  const commissionSeries = MONTHLY_GROWTH.map(m => ({ x: m.month, y: m.commission }));
  const maxCountry = Math.max(...COUNTRY_BREAKDOWN.map(c => c.commission));

  if (loading || !session) return null;

  return (
    <div className="min-h-screen text-white">
      <NavBar user={session}/>

      <section className="pt-28 pb-6">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-xs text-white/40 mb-4 flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-white/70">Portal</Link>
            <span>/</span>
            <span className="text-white/70">Vista admin</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="chip"><span className="dot"/> Datos en vivo · Adjust + Pana DB</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Actualizado hace 12 min</span>
              </div>
              <h1 className="h-display text-4xl md:text-6xl">Admin <span className="gradient-text">Console</span></h1>
              <p className="text-white/60 mt-2 max-w-xl">Monitorea desempeño, contratos y pagos de la red completa de embajadores.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={country} onChange={e => setCountry(e.target.value as any)} className="!w-auto !py-2 !px-3 text-sm">
                <option value="ALL">Todos los países</option>
                {COUNTRY_BREAKDOWN.map(c => <option key={c.country} value={c.country}>{c.flag} {c.name}</option>)}
              </select>
              <select value={track} onChange={e => setTrack(e.target.value as any)} className="!w-auto !py-2 !px-3 text-sm">
                <option value="ALL">Todas las modalidades</option>
                <option value="Embajador">Embajador</option>
                <option value="Influencer">Influencer</option>
                <option value="Corporativo">Corporativo</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Embajadores" value={TOTALS.ambassadors} delta={`+${AMBASSADORS.filter(a => new Date(a.joinedAt) > new Date('2026-04-01')).length} este mes`}/>
          <Kpi label="Cuentas aprobadas" value={TOTALS.approved.toLocaleString()} delta={`+${TOTALS.approved30d} en 30d`} tone="lime"/>
          <Kpi label="Instalaciones (Adjust)" value={TOTALS.installs.toLocaleString()} delta={`+${TOTALS.installs30d} en 30d`}/>
          <Kpi label="Comisión generada" value={`$${TOTALS.commission.toLocaleString()}`} delta="$10 / cuenta aprobada" tone="lime"/>
        </div>
      </section>

      {/* Charts row */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-3 gap-3">
          <ChartCard title="Cuentas aprobadas" subtitle="Últimos 8 meses" series={approvedSeries} color="#CFFF04"/>
          <ChartCard title="Instalaciones" subtitle="Adjust events" series={installsSeries} color="#1E7FE0"/>
          <ChartCard title="Comisión generada" subtitle="USD generado" series={commissionSeries} color="#E91E63"/>
        </div>
      </section>

      {/* Country + Top performers */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-[1fr,1.2fr] gap-3">
          <div className="rounded-3xl glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Distribución</div>
                <h3 className="h-display text-xl mt-1">Por país</h3>
              </div>
            </div>
            <div className="space-y-3">
              {COUNTRY_BREAKDOWN.map(c => (
                <div key={c.country}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[10px] text-white/40">· {c.ambassadors} emb.</span>
                    </div>
                    <div className="text-pana-lime font-bold text-xs">${c.commission.toLocaleString()}</div>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-pana-lime to-pana-blue transition-all duration-700" style={{ width: `${(c.commission / maxCountry) * 100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Top performers</div>
                <h3 className="h-display text-xl mt-1">Mejores 5 del mes</h3>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {AMBASSADORS.slice(0, 5).map(a => (
                <div key={a.id} className="rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors p-3 flex items-center gap-3 border border-white/5">
                  <Avatar src={a.photo} name={a.name} size={42} ring="rank" rank={a.rank}/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{a.name}</div>
                    <div className="text-[11px] text-white/50 truncate">{countryFlag(a.country)} {a.track} · {a.approved} aprob.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-pana-lime font-display text-base">${a.commission.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pb-3">
        <div className="mx-auto max-w-7xl px-5">
          <div className="rounded-2xl glass-strong p-1 inline-flex gap-1">
            <TabButton active={tab === 'ambassadors'} onClick={() => setTab('ambassadors')} label="Embajadores" hint={String(AMBASSADORS.length)}/>
            <TabButton active={tab === 'contracts'} onClick={() => setTab('contracts')} label="Contratos" hint={String(AMBASSADORS.filter(a => a.contract.status === 'signed').length)}/>
            <TabButton active={tab === 'payments'} onClick={() => setTab('payments')} label="Pagos" hint={`$${ALL_PAYMENTS.reduce((s, p) => s + p.amount, 0).toLocaleString()}`}/>
          </div>
        </div>
      </section>

      {tab === 'ambassadors' && (
        <AmbassadorsTab
          filtered={filtered}
          search={search} setSearch={setSearch}
          sortKey={sortKey} sortAsc={sortAsc} setSortKey={setSortKey} setSortAsc={setSortAsc}
        />
      )}
      {tab === 'contracts' && <ContractsTab filtered={filtered} search={search} setSearch={setSearch}/>}
      {tab === 'payments' && <PaymentsTab filtered={filtered}/>}

      <div className="mx-auto max-w-7xl px-5 pb-10 text-[11px] text-white/40">
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
          <strong className="text-white/70">Modelo de datos:</strong> 4 entidades — <code className="text-pana-lime">Embajadores</code>, <code className="text-pana-lime">Contratos</code> (CT-YYYY-NNN), <code className="text-pana-lime">Eventos</code> (installs + approvals desde Adjust), <code className="text-pana-lime">Pagos</code> ($10 USD por cuenta aprobada, primer 5 días hábiles del mes siguiente).
          Pipeline: BigQuery <code className="text-pana-lime">panaapp-16ce3.adjust.events</code> ⨝ <code className="text-pana-lime">planetscale_pana.users</code> via tracker_token + cio_id, agregado por embajador. Refresh: cada 15 min. Esta vista corre con datos mock realistas mientras se conectan los queries productivos.
        </div>
      </div>

      <Footer/>
    </div>
  );
}

/* ─────────── Tabs ─────────── */

function AmbassadorsTab({ filtered, search, setSearch, sortKey, sortAsc, setSortKey, setSortAsc }: {
  filtered: Ambassador[]; search: string; setSearch: (s: string) => void;
  sortKey: SortKey; sortAsc: boolean; setSortKey: (k: SortKey) => void; setSortAsc: (a: boolean) => void;
}) {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="rounded-3xl glass p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Embajadores</div>
              <h3 className="h-display text-xl mt-0.5">Tabla detallada · {filtered.length} resultados</h3>
            </div>
            <div className="flex items-center gap-2">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, email, ID…" className="!py-2 !px-3 text-sm md:!w-72"/>
              <button onClick={() => downloadCSV(filtered, 'ambassadors')} className="btn-ghost !py-2 !px-3 text-xs">Exportar CSV</button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 md:-mx-6">
            <table className="w-full text-sm border-separate border-spacing-y-1 px-4 md:px-6">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                  <Th onClick={() => toggleSort('rank', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'rank'} asc={sortAsc} label="#"/>
                  <Th onClick={() => toggleSort('name', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'name'} asc={sortAsc} label="Embajador"/>
                  <Th onClick={() => toggleSort('country', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'country'} asc={sortAsc} label="País"/>
                  <Th label="Track"/>
                  <Th onClick={() => toggleSort('joinedAt', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'joinedAt'} asc={sortAsc} label="Alta"/>
                  <Th onClick={() => toggleSort('installs', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'installs'} asc={sortAsc} label="Installs" right/>
                  <Th onClick={() => toggleSort('approved', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'approved'} asc={sortAsc} label="Aprob." right/>
                  <Th onClick={() => toggleSort('commission', sortKey, sortAsc, setSortKey, setSortAsc)} active={sortKey === 'commission'} asc={sortAsc} label="Comisión" right/>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="bg-white/[0.025] hover:bg-white/[0.05] transition-colors">
                    <Td className="rounded-l-xl"><span className={`font-display text-sm ${a.rank! <= 3 ? 'text-amber-300' : a.rank! <= 10 ? 'text-pana-lime' : 'text-white/50'}`}>{a.rank}</span></Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar src={a.photo} name={a.name} size={32} ring={a.rank! <= 3 ? 'rank' : 'none'} rank={a.rank}/>
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[180px]">{a.name}</div>
                          <div className="text-[11px] text-white/40 truncate max-w-[180px]">{a.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><span className="text-base mr-1">{countryFlag(a.country)}</span><span className="text-white/70">{a.country}</span></Td>
                    <Td><TrackPill track={a.track}/></Td>
                    <Td><span className="text-white/60">{fmtDate(a.joinedAt)}</span></Td>
                    <Td right><span className="text-white/80 tabular-nums">{a.installs}</span></Td>
                    <Td right><span className="font-medium tabular-nums">{a.approved}</span></Td>
                    <Td right className="rounded-r-xl"><span className="font-display text-pana-lime tabular-nums">${a.commission.toLocaleString()}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center text-white/40 py-10">No hay embajadores que coincidan con el filtro.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContractsTab({ filtered, search, setSearch }: { filtered: Ambassador[]; search: string; setSearch: (s: string) => void }) {
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'ALL'>('ALL');
  const list = useMemo(() => filtered.filter(a => statusFilter === 'ALL' || a.contract.status === statusFilter), [filtered, statusFilter]);

  const signed = filtered.filter(a => a.contract.status === 'signed').length;
  const pending = filtered.filter(a => a.contract.status === 'pending_signature').length;
  const review = filtered.filter(a => a.contract.status === 'pending_review').length;
  const rate = filtered.length ? Math.round((signed / filtered.length) * 100) : 0;

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-5 space-y-4">
        {/* Header card with PDF preview + downloads */}
        <div className="rounded-3xl glass-strong p-6 md:p-8 grid md:grid-cols-[1fr,2fr] gap-6 items-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pana-lime/15 to-pana-blue/10 border border-pana-lime/20 p-6 aspect-[3/4] flex flex-col items-center justify-center text-center">
            <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] text-pana-lime font-bold">Acuerdo oficial</div>
            <div className="font-display text-2xl text-white mb-2 leading-tight">ACUERDO DE<br/>PARTICIPACIÓN</div>
            <div className="text-xs text-white/60 mb-4">Programa de Embajadores</div>
            <div className="text-[10px] text-white/40 mb-6">7 cláusulas · 2 páginas</div>
            <a href="/acuerdo-embajadores.pdf" target="_blank" rel="noreferrer" className="btn-lime !py-2.5 !px-4 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Descargar PDF
            </a>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold mb-3">Partes del acuerdo</div>
            <div className="font-display text-3xl md:text-4xl mb-4 leading-tight">Pana Finance Inc. <span className="text-white/30">×</span><br/>El/la participante</div>
            <p className="text-sm text-white/70 mb-5 max-w-xl">Acuerdo mes a mes, renovable. $10 USD por cuenta aprobada y activa generada vía link único de Adjust. Pago dentro de los primeros 5 días hábiles del mes siguiente.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {['1. Objeto','2. Requisitos','3. Compensación','4. Rastreo y atribución','5. Propiedad intelectual','6. Duración y terminación','7. Confidencialidad'].map(c => (
                <div key={c} className="rounded-xl bg-white/[0.04] border border-white/5 px-3 py-2.5 hover:bg-white/[0.07] transition-colors">
                  <div className="text-white/85 font-medium">{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contract KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Firmados" value={signed} delta={`${rate}% del total`} tone="lime"/>
          <Kpi label="Pendientes firma" value={pending} delta="Enviados, esperando contraparte"/>
          <Kpi label="En revisión" value={review} delta="Antes de envío"/>
          <Kpi label="Tasa de firma" value={`${rate}%`} delta="Últimos 30 días"/>
        </div>

        {/* Filter + table */}
        <div className="rounded-3xl glass p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Estado por embajador</div>
              <h3 className="h-display text-xl mt-0.5">{list.length} contratos</h3>
            </div>
            <div className="flex items-center gap-2">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="!w-auto !py-2 !px-3 text-sm">
                <option value="ALL">Todos los estados</option>
                <option value="signed">Firmados</option>
                <option value="pending_signature">Pendiente firma</option>
                <option value="pending_review">En revisión</option>
              </select>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar embajador…" className="!py-2 !px-3 text-sm md:!w-60"/>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {list.map(a => <ContractCard key={a.id} amb={a}/>)}
            {list.length === 0 && <div className="md:col-span-2 text-center text-white/40 py-10">No hay contratos en este filtro.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContractCard({ amb }: { amb: Ambassador }) {
  const c = amb.contract;
  const statusStyle = c.status === 'signed'
    ? 'bg-pana-lime/15 text-pana-lime border-pana-lime/40'
    : c.status === 'pending_signature'
    ? 'bg-amber-300/15 text-amber-300 border-amber-300/40'
    : 'bg-white/5 text-white/70 border-white/10';
  const statusLabel = c.status === 'signed' ? 'Firmado' : c.status === 'pending_signature' ? 'Pendiente firma' : c.status === 'pending_review' ? 'En revisión' : 'Vencido';

  return (
    <div className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-4 border border-white/5">
      <div className="flex items-start gap-3">
        <Avatar src={amb.photo} name={amb.name} size={44} ring={c.status === 'signed' ? 'lime' : 'none'}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-bold text-sm truncate max-w-[180px]">{amb.name}</div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle}`}>{statusLabel}</span>
          </div>
          <div className="text-[11px] text-white/50 mt-0.5">{countryFlag(amb.country)} {amb.country} · {amb.track} · {c.id}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-white/40">Enviado</div>
          <div className="text-white/80 mt-0.5">{fmtDate(c.sentAt)}</div>
        </div>
        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-white/40">{c.status === 'signed' ? 'Firmado' : 'Esperando'}</div>
          <div className="text-white/80 mt-0.5">{c.signedAt ? fmtDate(c.signedAt) : '—'}</div>
        </div>
      </div>

      <div className="mt-2 rounded-lg bg-white/[0.025] px-3 py-2 text-[11px] text-white/60 truncate">
        Adjust link: <span className="text-pana-lime font-mono">{amb.adjustLink}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <a href={c.fileUrl} target="_blank" rel="noreferrer" className="btn-ghost !py-1.5 !px-3 text-xs flex-1 justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Ver acuerdo
        </a>
        {c.status === 'pending_signature' && (
          <button className="btn-lime !py-1.5 !px-3 text-xs flex-1 justify-center">Recordar</button>
        )}
        {c.status === 'signed' && c.ip && (
          <span className="text-[10px] text-white/40 px-2">IP {c.ip}</span>
        )}
      </div>
    </div>
  );
}

function PaymentsTab({ filtered }: { filtered: Ambassador[] }) {
  const filteredIds = new Set(filtered.map(a => a.id));
  const payments = ALL_PAYMENTS.filter(p => filteredIds.has(p.ambassadorId));

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingNow = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalAccounts = payments.reduce((s, p) => s + p.approvedAccounts, 0);
  const txns = payments.length;

  // Per-ambassador summary (sorted by total paid desc, top 12)
  const perAmbassador = filtered.map(a => {
    const ap = payments.filter(p => p.ambassadorId === a.id);
    return {
      a,
      total: ap.reduce((s, p) => s + p.amount, 0),
      paidTotal: ap.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      pendingTotal: ap.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
      months: ap.sort((x, y) => x.month.localeCompare(y.month))
    };
  }).sort((x, y) => y.total - x.total);

  const monthlySeries = PAYMENTS_BY_MONTH.map(p => ({ x: p.month, y: p.amount }));

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-5 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Total pagado" value={`$${totalPaid.toLocaleString()}`} delta="Últimos 5 meses cerrados" tone="lime"/>
          <Kpi label="Pendiente abril" value={`$${pendingNow.toLocaleString()}`} delta="Se paga primeros 5 días hábiles de mayo"/>
          <Kpi label="Cuentas aprobadas" value={totalAccounts.toLocaleString()} delta="Origen de comisión"/>
          <Kpi label="Transacciones" value={txns.toLocaleString()} delta="6 meses · todos los embajadores"/>
        </div>

        <div className="rounded-3xl glass p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Pagos por mes</div>
              <h3 className="h-display text-xl mt-0.5">Comisión total / mes</h3>
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">$10 / cuenta · primeros 5 días hábiles</div>
          </div>
          <SimpleChart data={monthlySeries} color="#CFFF04" height={180}/>
        </div>

        <div className="rounded-3xl glass p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Pagos por embajador</div>
              <h3 className="h-display text-xl mt-0.5">Histórico 6 meses · {perAmbassador.length} embajadores</h3>
            </div>
            <button onClick={() => downloadPaymentsCSV(payments)} className="btn-ghost !py-2 !px-3 text-xs">Exportar CSV</button>
          </div>

          <div className="overflow-x-auto -mx-4 md:-mx-6">
            <table className="w-full text-sm border-separate border-spacing-y-1 px-4 md:px-6">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                  <th className="px-3 py-2 text-left">Embajador</th>
                  {PAYMENTS_BY_MONTH.map(m => <th key={m.month} className="px-3 py-2 text-right">{m.month.slice(5)}</th>)}
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {perAmbassador.map(({ a, total, months }) => (
                  <tr key={a.id} className="bg-white/[0.025] hover:bg-white/[0.05] transition-colors">
                    <td className="px-3 py-2.5 rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <Avatar src={a.photo} name={a.name} size={28}/>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate max-w-[180px]">{a.name}</div>
                          <div className="text-[10px] text-white/40 flex items-center gap-1">{countryFlag(a.country)} {a.track}</div>
                        </div>
                      </div>
                    </td>
                    {months.map(p => (
                      <td key={p.id} className="px-3 py-2.5 text-right">
                        <div className={`tabular-nums text-xs ${p.status === 'paid' ? 'text-white/85' : 'text-amber-300'}`}>${p.amount.toLocaleString()}</div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30">{p.status === 'paid' ? 'pagado' : 'pendiente'}</div>
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right rounded-r-xl">
                      <div className="font-display text-pana-lime tabular-nums">${total.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Shared ─────────── */

function TabButton({ active, onClick, label, hint }: { active: boolean; onClick: () => void; label: string; hint?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-pana-lime text-pana-navy' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'}`}
    >
      {label}
      {hint && <span className={`ml-2 text-[10px] font-bold ${active ? 'text-pana-navy/70' : 'text-white/40'}`}>{hint}</span>}
    </button>
  );
}

function Kpi({ label, value, delta, tone }: { label: string; value: string | number; delta?: string; tone?: 'lime' }) {
  return (
    <div className={`rounded-2xl p-5 ${tone === 'lime' ? 'glass-strong border border-pana-lime/30 bg-pana-lime/[0.06]' : 'glass-strong border border-white/10'}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">{label}</div>
      <div className={`font-display text-3xl mt-2 ${tone === 'lime' ? 'text-pana-lime' : 'text-white'}`}>{value}</div>
      {delta && <div className="text-[11px] text-white/40 mt-1">{delta}</div>}
    </div>
  );
}

function ChartCard({ title, subtitle, series, color }: { title: string; subtitle: string; series: { x: string; y: number }[]; color: string }) {
  const last = series[series.length - 1].y;
  const prev = series[series.length - 2].y;
  const delta = prev > 0 ? ((last - prev) / prev * 100) : 0;
  return (
    <div className="rounded-3xl glass p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-bold" style={{ color }}>{title}</div>
          <div className="font-display text-2xl mt-1 text-white">{last.toLocaleString()}</div>
          <div className={`text-xs mt-0.5 ${delta >= 0 ? 'text-pana-lime' : 'text-red-400'}`}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs mes ant.</div>
        </div>
        <div className="text-[10px] text-white/40 uppercase tracking-wider">{subtitle}</div>
      </div>
      <SimpleChart data={series} color={color} height={120}/>
    </div>
  );
}

function TrackPill({ track }: { track: Track }) {
  const cls = track === 'Influencer'
    ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
    : track === 'Corporativo'
    ? 'bg-pana-blue/15 text-sky-300 border-pana-blue/30'
    : 'bg-white/5 text-white/70 border-white/10';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>{track}</span>;
}

function Th({ label, onClick, active, asc, right }: { label: string; onClick?: () => void; active?: boolean; asc?: boolean; right?: boolean }) {
  return (
    <th className={`px-3 py-2 ${right ? 'text-right' : 'text-left'} ${onClick ? 'cursor-pointer hover:text-white' : ''}`} onClick={onClick}>
      <span className="inline-flex items-center gap-1">{label}{active && <span className="text-pana-lime">{asc ? '↑' : '↓'}</span>}</span>
    </th>
  );
}

function Td({ children, className = '', right }: { children: React.ReactNode; className?: string; right?: boolean }) {
  return <td className={`px-3 py-2.5 ${right ? 'text-right' : ''} ${className}`}>{children}</td>;
}

function toggleSort(k: SortKey, curr: SortKey, asc: boolean, setK: (k: SortKey) => void, setA: (a: boolean) => void) {
  if (k === curr) setA(!asc);
  else { setK(k); setA(false); }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
}

function downloadCSV(list: Ambassador[], prefix: string) {
  const header = ['rank','id','name','email','country','track','joined','installs','approved','commission_usd','adjust_link','contract_id','contract_status','signed_at'];
  const rows = list.map(a => [a.rank, a.id, a.name, a.email, a.country, a.track, a.joinedAt, a.installs, a.approved, a.commission, a.adjustLink, a.contract.id, a.contract.status, a.contract.signedAt || '']);
  exportCSV([header, ...rows], `pana-${prefix}-${new Date().toISOString().slice(0,10)}.csv`);
}

function downloadPaymentsCSV(payments: { id: string; ambassadorId: string; month: string; amount: number; status: string; paidAt?: string; approvedAccounts: number }[]) {
  const header = ['payment_id','ambassador_id','month','amount_usd','accounts','status','paid_at'];
  const rows = payments.map(p => [p.id, p.ambassadorId, p.month, p.amount, p.approvedAccounts, p.status, p.paidAt || '']);
  exportCSV([header, ...rows], `pana-payments-${new Date().toISOString().slice(0,10)}.csv`);
}

function exportCSV(rows: any[][], filename: string) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
