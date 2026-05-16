import { AMBASSADORS } from '../data/ambassadors';
import { BADGES, BADGES_BY_ID, levelFromXP, RARITY_STYLE } from '../data/badges';

const SHOWCASE_ID = 'A005'; // Valentina Torres — rank #1 with full badge collection

export default function MobilePreview() {
  const me = AMBASSADORS.find(a => a.id === SHOWCASE_ID) || AMBASSADORS[0];
  const lvl = levelFromXP(me.xp);
  const earnedSet = new Set(me.badges);
  const earnedBadges = BADGES.filter(b => earnedSet.has(b.id));
  const top3 = AMBASSADORS.slice(0, 3);

  return (
    <div className="relative w-full max-w-[320px] mx-auto perspective-[1400px]">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-[60px] bg-gradient-to-br from-pana-lime/30 via-pana-blue/20 to-transparent blur-3xl scale-90"/>
      <div className="absolute -inset-4 -z-10 rounded-[60px] bg-pana-lime/5 blur-2xl animate-glow"/>

      {/* Phone frame */}
      <div
        className="relative rounded-[44px] bg-[#0d0d12] p-2.5 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.7),0_30px_60px_-30px_rgba(207,255,4,0.25),inset_0_0_0_2px_rgba(255,255,255,0.06)]"
        style={{ transform: 'rotateY(-8deg) rotateX(2deg) rotateZ(0deg)' }}
      >
        {/* Side button */}
        <div className="absolute left-[-2px] top-24 w-1 h-12 rounded-l-md bg-[#0a0a0e]"/>
        <div className="absolute left-[-2px] top-44 w-1 h-20 rounded-l-md bg-[#0a0a0e]"/>
        <div className="absolute right-[-2px] top-32 w-1 h-16 rounded-r-md bg-[#0a0a0e]"/>

        <div className="rounded-[36px] bg-pana-navy overflow-hidden relative" style={{ height: 620 }}>
          {/* Dynamic island / notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full bg-black z-30 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pana-lime/40"/>
          </div>

          {/* Status bar */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[10px] text-white/80 font-bold">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <SignalDots/><WifiIcon/><BatteryIcon/>
            </span>
          </div>

          {/* Background blobs */}
          <div className="absolute -top-12 -right-16 w-48 h-48 rounded-full bg-pana-lime/20 blur-3xl"/>
          <div className="absolute top-40 -left-20 w-44 h-44 rounded-full bg-pana-blue/30 blur-3xl"/>

          {/* Content */}
          <div className="relative z-10 px-4 pt-4 pb-4 space-y-3 overflow-hidden">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center overflow-hidden">
                  <img src="/pana-logo.png" alt="" className="w-4 h-4 object-contain"/>
                </div>
                <div className="leading-none">
                  <div className="text-[7px] uppercase tracking-[0.18em] text-pana-lime font-bold">Pana</div>
                  <div className="text-[10px] font-extrabold">Ambassadors</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full ring-1 ring-pana-lime/60 overflow-hidden">
                <img src={me.photo} alt="" className="w-full h-full object-cover"/>
              </div>
            </div>

            {/* Hero card: avatar + level */}
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur p-3.5 relative overflow-hidden">
              <div className="absolute -top-6 -right-8 w-24 h-24 rounded-full bg-pana-lime/15 blur-xl"/>
              <div className="flex items-center gap-3 relative">
                <div className="relative shrink-0">
                  <img src={me.photo} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-300 ring-offset-2 ring-offset-pana-navy"/>
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-300 text-pana-navy text-[10px] font-extrabold flex items-center justify-center">1</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.16em] text-pana-lime font-bold">Buenas tardes</div>
                  <div className="font-extrabold text-[15px] truncate" style={{ fontFamily: 'Bricolage Grotesque, Inter' }}>{me.name}</div>
                  <div className="text-[10px] text-white/55 mt-0.5">🇬🇹 Influencer · Nivel {lvl.curr.lv} {lvl.curr.name}</div>
                </div>
              </div>

              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[9px] text-white/55 mb-1">
                  <span>{me.xp.toLocaleString()} XP</span>
                  <span>{lvl.next.min.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-pana-lime via-pana-lime/80 to-pana-blue" style={{ width: `${lvl.progress * 100}%` }}/>
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"/>
                </div>
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 gap-1.5">
              <MiniStat label="Cuentas" value={me.approved.toString()} accent="lime"/>
              <MiniStat label="Comisión" value={`$${(me.commission/1000).toFixed(1)}k`} accent="lime" big/>
              <MiniStat label="Streak" value={`${me.streak}d`}/>
            </div>

            {/* Badges */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] uppercase tracking-[0.16em] text-pana-lime font-bold">Logros</div>
                <div className="text-[9px] text-white/40">{earnedBadges.length}/{BADGES.length}</div>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {BADGES.slice(0, 12).map(b => {
                  const unlocked = earnedSet.has(b.id);
                  const s = RARITY_STYLE[b.rarity];
                  return (
                    <div
                      key={b.id}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[12px] ${unlocked ? `bg-gradient-to-br ${s.bg} ring-1 ${s.ring} ${s.text}` : 'bg-white/[0.03] ring-1 ring-white/5 text-white/15'}`}
                    >{b.icon}</div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] uppercase tracking-[0.16em] text-pana-lime font-bold">Top 3</div>
                <div className="text-[9px] text-white/40">Abril</div>
              </div>
              <div className="space-y-1.5">
                {top3.map(a => (
                  <div key={a.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${a.id === me.id ? 'bg-pana-lime/10 ring-1 ring-pana-lime/30' : 'bg-white/[0.02]'}`}>
                    <span className={`text-[10px] font-extrabold w-3 ${a.rank === 1 ? 'text-amber-300' : a.rank === 2 ? 'text-zinc-300' : 'text-orange-400'}`}>{a.rank}</span>
                    <img src={a.photo} alt="" className="w-5 h-5 rounded-full object-cover"/>
                    <span className="text-[10px] font-bold flex-1 truncate">{a.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-pana-lime font-bold">${(a.commission/1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/30"/>
        </div>
      </div>

      {/* Floating annotation pills */}
      <div className="hidden md:flex absolute -left-12 top-44 items-center gap-2 px-3 py-2 rounded-full glass-strong text-[11px] font-bold animate-floaty">
        <span className="w-1.5 h-1.5 rounded-full bg-pana-lime shadow-[0_0_8px_rgba(207,255,4,0.8)]"/>
        XP en vivo
      </div>
      <div className="hidden md:flex absolute -right-10 top-72 items-center gap-2 px-3 py-2 rounded-full glass-strong text-[11px] font-bold animate-floaty [animation-delay:1.5s]">
        <span>🏆</span>
        Badges desbloqueables
      </div>
      <div className="hidden md:flex absolute -left-16 bottom-40 items-center gap-2 px-3 py-2 rounded-full glass-strong text-[11px] font-bold animate-floaty [animation-delay:3s]">
        <span>💸</span>
        $10 / cuenta
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent, big }: { label: string; value: string; accent?: 'lime'; big?: boolean }) {
  return (
    <div className={`rounded-xl px-2.5 py-2 ${accent === 'lime' && big ? 'bg-pana-lime/[0.08] border border-pana-lime/30' : 'bg-white/[0.04] border border-white/8'}`}>
      <div className="text-[8px] uppercase tracking-[0.14em] text-white/45 font-bold">{label}</div>
      <div className={`font-extrabold text-[13px] ${accent === 'lime' ? 'text-pana-lime' : 'text-white'}`} style={{ fontFamily: 'Bricolage Grotesque, Inter' }}>{value}</div>
    </div>
  );
}

function SignalDots() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor"><rect x="0" y="5" width="2" height="3" rx="0.5"/><rect x="3" y="3" width="2" height="5" rx="0.5"/><rect x="6" y="1" width="2" height="7" rx="0.5"/><rect x="9" y="0" width="2" height="8" rx="0.5" opacity="0.4"/></svg>
  );
}
function WifiIcon() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M1 3a8 8 0 0 1 10 0"/><path d="M3 5a5 5 0 0 1 6 0"/><circle cx="6" cy="7.5" r="0.6" fill="currentColor"/></svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="22" height="9" viewBox="0 0 22 9" fill="none"><rect x="0.5" y="0.5" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="0.7" opacity="0.7"/><rect x="2" y="2" width="14" height="5" rx="1" fill="currentColor"/><rect x="20" y="3" width="1.2" height="3" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
  );
}
