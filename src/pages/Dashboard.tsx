import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import BadgeIcon from '../components/BadgeIcon';
import Blob from '../components/Blob';
import Sparkle from '../components/Sparkle';
import LiveFeed from '../components/LiveFeed';
import ContentBoard from '../components/ContentBoard';
import { isAdminHost } from '../lib/hosts';
import { resolveSession, getCurrentAmbassador, SessionUser } from '../lib/session';
import { useAmbassadors, viewForRange } from '../lib/useAmbassadors';
import { BADGES, BADGES_BY_ID, levelFromXP } from '../data/badges';
import { RECENT_EVENTS, countryFlag, countryName, type Ambassador } from '../data/ambassadors';
import DateRangePicker, { DEFAULT_RANGE, fmtRange, type DateRange } from '../components/DateRangePicker';

export default function Dashboard() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [leaderRange, setLeaderRange] = useState<DateRange>(DEFAULT_RANGE);
  const nav = useNavigate();
  const live = useAmbassadors();

  useEffect(() => {
    resolveSession().then(s => {
      if (!s) { nav('/login'); return; }
      setSession(s);
      setLoading(false);
    });
  }, [nav]);

  // Hooks MUST run on every render — keep them above the early return.
  const monthView = useMemo(() => viewForRange(live, leaderRange), [live, leaderRange]);

  if (loading || !session) return <LoadingShell/>;

  // Resolve "me" defensively against undefined session fields.
  const sessionEmail = (session.email || '').toLowerCase();
  const sessionFirstName = (session.name || '').split(' ')[0].toLowerCase();
  const me: Ambassador = live.source === 'live' && live.ambassadors.length > 0
    ? (live.ambassadors.find(a => (a.email || '').toLowerCase() === sessionEmail && sessionEmail !== '')
       || (sessionFirstName ? live.ambassadors.find(a => a.name.toLowerCase().includes(sessionFirstName)) : null)
       || live.ambassadors[0])
    : getCurrentAmbassador(session);

  const lvl = levelFromXP(me.xp);
  const earnedSet = new Set(me.badges);
  const allBadges = BADGES;
  const earned = allBadges.filter(b => earnedSet.has(b.id));
  const locked = allBadges.filter(b => !earnedSet.has(b.id));

  const top10 = monthView.ambassadors.slice(0, 10);
  const myInLeader = monthView.ambassadors.find(a => a.id === me.id || a.name === me.name);
  const myLeaderRank = myInLeader?.rank || 0;
  const myRank = me.rank || 0;
  const greeting = useGreeting();
  const referralCode = `pana.app/r/${me.email.split('@')[0]}`;

  function copyLink() {
    navigator.clipboard.writeText(`https://${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen text-white">
      <NavBar user={session}/>

      {/* HERO */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <Blob className="absolute -top-24 -right-32 w-[480px] opacity-50 animate-floaty" tone="lime"/>
        <Blob className="absolute top-40 -left-24 w-[380px] opacity-40 animate-floaty [animation-delay:2s]" tone="blue"/>

        <div className="mx-auto max-w-6xl px-5 relative">
          <div className="text-xs text-white/40 mb-5 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-white/70">Inicio</Link>
            <span>/</span>
            <span className="text-white/70">Portal Embajador</span>
            {live.source === 'live' && <span className="ml-3 text-[10px] uppercase tracking-[0.16em] text-pana-lime font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pana-lime shadow-[0_0_8px_rgba(207,255,4,0.8)]"/> LIVE · Adjust BigQuery</span>}
            {live.source === 'mock' && <span className="ml-3 text-[10px] uppercase tracking-[0.16em] text-amber-300 font-bold">DEMO</span>}
          </div>

          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4 animate-fadeUp">
            {/* Identity card */}
            <div className="rounded-[28px] glass-strong p-6 md:p-8 relative overflow-hidden">
              <Sparkle className="absolute top-5 right-6 w-4 animate-spinSlow opacity-60" color="#CFFF04"/>
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <Avatar src={me.photo} name={me.name} size={92} ring="rank" rank={myRank}/>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/50">{greeting}, {countryFlag(me.country)} {countryName(me.country)}</div>
                  <h1 className="h-display text-3xl md:text-5xl mt-1 leading-none">
                    <span className="gradient-text">{me.name}</span>
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-pana-lime/15 text-pana-lime border border-pana-lime/30">{me.track}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">Rank #{myRank}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]"/> {me.streak} d streak</span>
                  </div>
                </div>
              </div>

              {/* Level + XP */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">Nivel {lvl.curr.lv} · {lvl.curr.name}</div>
                    <div className="font-display text-2xl">{me.xp.toLocaleString()} XP</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">Próximo</div>
                    <div className="text-white/80 text-sm">{lvl.next.name} · {lvl.next.min.toLocaleString()}</div>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-pana-lime via-pana-lime/80 to-pana-blue"
                       style={{ width: `${lvl.progress * 100}%` }}/>
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"/>
                </div>
                <div className="mt-1.5 text-[11px] text-white/40">Faltan {Math.max(0, lvl.next.min - me.xp).toLocaleString()} XP para subir</div>
              </div>
            </div>

            {/* Referral link card */}
            <div className="rounded-[28px] glass-strong p-6 relative overflow-hidden">
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold mb-2">Tu link de referido</div>
              <div className="font-mono text-sm text-white truncate bg-pana-navy-2 rounded-xl px-3 py-2.5 border border-white/5">{referralCode}</div>
              <button onClick={copyLink} className={`mt-3 btn-lime w-full justify-center text-sm transition-all ${copied ? '!bg-white !text-pana-navy' : ''}`}>
                {copied ? '✓ Copiado al portapapeles' : 'Copiar link'}
              </button>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent('Échale un ojo a Pana — abro mi cuenta US sin papeleo: https://' + referralCode)}`} className="rounded-xl py-2 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs text-white/80">WhatsApp</a>
                <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Si recibes pagos del exterior @getpana es la cuenta US sin fricción que andabas buscando 👇 https://' + referralCode)}`} className="rounded-xl py-2 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs text-white/80">Twitter/X</a>
                <button onClick={copyLink} className="rounded-xl py-2 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs text-white/80">Otro</button>
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeUp [animation-delay:120ms]">
            <Stat label="Cuentas activadas" value={me.approved} delta={`+${me.approved30d} este mes`}/>
            <Stat label="Instalaciones" value={me.installs} delta={`+${me.installs30d} este mes`}/>
            <Stat label="Comisión" value={`$${me.commission.toLocaleString()}`} delta="Próximo pago: fin de mes" tone="lime"/>
            <Stat label="Badges" value={`${earned.length}/${allBadges.length}`} delta="Sigue desbloqueando"/>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead kicker="Logros" title="Tu colección" subtitle={`${earned.length} desbloqueadas · ${locked.length} por conquistar`}/>
          <div className="rounded-3xl glass p-6 md:p-8">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-5">
              {BADGES.map(b => <BadgeIcon key={b.id} def={b} unlocked={earnedSet.has(b.id)} size="md"/>)}
            </div>
          </div>

          {/* Latest unlock */}
          {earned.length > 0 && (
            <div className="mt-4 rounded-3xl bg-gradient-to-br from-pana-lime/[0.10] to-pana-blue/[0.05] border border-pana-lime/20 p-5 flex items-center gap-4">
              <BadgeIcon def={earned[earned.length - 1]} unlocked size="lg"/>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Último desbloqueo</div>
                <div className="font-display text-xl mt-0.5">{earned[earned.length - 1].name}</div>
                <div className="text-sm text-white/60 mt-1">{earned[earned.length - 1].desc}</div>
              </div>
              <div className="text-[11px] text-white/40">{earned[earned.length - 1].rule}</div>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard + Activity */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[1.5fr,1fr] gap-4">
          {/* Leaderboard */}
          <div className="rounded-3xl glass p-6 md:p-8">
            <div className="flex items-start justify-between mb-5 gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold">Leaderboard</div>
                <h3 className="h-display text-2xl md:text-3xl mt-1">Top 10 global</h3>
              </div>
              <DateRangePicker
                value={leaderRange}
                onChange={setLeaderRange}
                size="sm"
              />
            </div>
            <div className="space-y-1.5">
              {top10.map(a => {
                const isMe = a.id === me.id || a.name === me.name;
                return (
                  <div key={a.id} className={`flex items-center gap-3 p-2.5 rounded-2xl transition-colors ${isMe ? 'bg-pana-lime/[0.08] ring-1 ring-pana-lime/30' : 'hover:bg-white/[0.04]'}`}>
                    <div className={`w-8 text-center font-display text-lg ${a.rank === 1 ? 'text-amber-300' : a.rank === 2 ? 'text-zinc-300' : a.rank === 3 ? 'text-orange-400' : 'text-white/40'}`}>{a.rank}</div>
                    <Avatar src={a.photo} name={a.name} size={36} ring={isMe ? 'lime' : 'rank'} rank={a.rank}/>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate flex items-center gap-2">
                        {a.name} {isMe && <span className="text-[9px] uppercase tracking-wider text-pana-lime font-bold">Tú</span>}
                      </div>
                      <div className="text-[11px] text-white/50">{a.installs} installs · {a.streak ? `${a.streak}d streak` : 'inactivo'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-base text-white">{a.approved}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">cuentas</div>
                    </div>
                  </div>
                );
              })}
              {top10.length === 0 && (
                <div className="text-center py-8 text-white/40 text-sm">
                  Sin actividad en {fmtRange(leaderRange)}.
                </div>
              )}
            </div>

            {myInLeader && myLeaderRank > 10 && top10[9] && (
              <div className="mt-3 rounded-2xl bg-pana-lime/[0.08] border border-pana-lime/30 p-3 flex items-center gap-3">
                <div className="w-8 text-center font-display text-lg text-pana-lime">{myLeaderRank}</div>
                <Avatar src={me.photo} name={me.name} size={32} ring="lime"/>
                <div className="flex-1">
                  <div className="text-sm font-bold">Tú · {me.name}</div>
                  <div className="text-xs text-white/50">{myInLeader.approved} cuentas aprobadas</div>
                </div>
                <div className="text-[10px] text-white/50 text-right">Faltan {Math.max(1, top10[9].approved - myInLeader.approved + 1)} cuentas para entrar al Top 10</div>
              </div>
            )}
          </div>

          {/* Right column — switches based on whether we're on admin (live data) or public (mock) */}
          {isAdminHost() ? <LiveFeed currentAmbassadorName={me.name}/> : <ContentBoard variant="compact" ambassadorName={me.name}/>}
        </div>
      </section>

      {/* Missions */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead kicker="Misiones" title="Tus próximas misiones" subtitle="Completa misiones para ganar XP, badges y subir en el ranking."/>
          <div className="grid md:grid-cols-2 gap-3">
            {nextMissions(me, top10).map((m, i) => (
              <div key={i} className="rounded-3xl glass p-6 flex items-start gap-5 hover:bg-white/[0.06] transition-all hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-2xl bg-pana-lime/15 text-pana-lime border border-pana-lime/30 flex items-center justify-center font-display text-xl shrink-0">{m.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="font-display text-lg">{m.title}</div>
                    <span className="text-xs font-bold text-pana-lime bg-pana-lime/10 border border-pana-lime/30 px-2.5 py-1 rounded-full whitespace-nowrap">+{m.xp} XP</span>
                  </div>
                  <div className="text-sm text-white/60 mb-3">{m.desc}</div>
                  {m.progress != null && (
                    <div className="mb-3">
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pana-lime to-pana-blue transition-all duration-700" style={{ width: `${m.progress * 100}%` }}/>
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">{m.progressLabel}</div>
                    </div>
                  )}
                  <button onClick={m.id === 'invite' ? copyLink : undefined} className="btn-ghost !py-2 !px-4 text-xs">{m.id === 'invite' && copied ? '✓ Copiado' : m.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function nextMissions(me: Ambassador, top10: Ambassador[]) {
  const isTop10 = (me.rank || 99) <= 10;
  const isTop3 = (me.rank || 99) <= 3;
  return [
    {
      id: 'invite', title: 'Comparte tu link hoy', xp: 10, icon: '↗',
      desc: 'Una sola persona nueva mueve la aguja. Mándalo por WhatsApp o por DM.',
      cta: 'Copiar link',
      progress: null
    },
    {
      id: 'streak', title: `Mantén tu streak (${me.streak}d)`, xp: 25, icon: '➶',
      desc: 'Otra acción hoy y conservas tu racha. Cada 7 días extra desbloquea XP bonus.',
      cta: 'Ver racha',
      progress: Math.min(1, me.streak / 30),
      progressLabel: `${me.streak}/30 días → unlock Marathon`
    },
    isTop10 ? null : {
      id: 'top10', title: 'Entra al Top 10', xp: 80, icon: '⌖',
      desc: `Te faltan ${Math.max(0, top10[9].approved - me.approved + 1)} cuentas para entrar al podio.`,
      cta: 'Ver leaderboard',
      progress: Math.min(1, me.approved / Math.max(1, top10[9].approved)),
      progressLabel: `${me.approved}/${top10[9].approved} aprobadas`
    },
    isTop3 ? null : {
      id: 'top3', title: 'Sube al Top 3', xp: 150, icon: '☖',
      desc: `Top 3 desbloquea badge épico. Faltan ${Math.max(0, top10[2].approved - me.approved + 1)} cuentas.`,
      cta: 'Acelerar',
      progress: Math.min(1, me.approved / Math.max(1, top10[2].approved)),
      progressLabel: `${me.approved}/${top10[2].approved} aprobadas`
    }
  ].filter(Boolean) as Array<{ id: string; title: string; xp: number; icon: string; desc: string; cta: string; progress: number | null; progressLabel?: string }>;
}

function Stat({ label, value, delta, tone }: { label: string; value: string | number; delta?: string; tone?: 'lime' }) {
  return (
    <div className={`rounded-2xl glass p-4 ${tone === 'lime' ? 'border border-pana-lime/25 bg-pana-lime/[0.05]' : 'border border-white/10'}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">{label}</div>
      <div className={`font-display text-2xl mt-1 ${tone === 'lime' ? 'text-pana-lime' : 'text-white'}`}>{value}</div>
      {delta && <div className="text-[11px] text-white/40 mt-1">{delta}</div>}
    </div>
  );
}

function SectionHead({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
      <div>
        <span className="chip mb-3">{kicker}</span>
        <h2 className="h-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {subtitle && <p className="text-white/60 text-sm max-w-md">{subtitle}</p>}
    </div>
  );
}

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function relTime(iso: string) {
  const t = new Date(iso).getTime();
  const d = Math.max(0, Date.now() - t);
  const m = Math.floor(d / 60000);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.floor(h / 24);
  return `hace ${days} d`;
}

function LoadingShell() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/60">
        <div className="w-5 h-5 rounded-full border-2 border-pana-lime border-t-transparent animate-spin"/>
        Cargando portal…
      </div>
    </div>
  );
}
