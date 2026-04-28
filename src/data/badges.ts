export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  rarity: Rarity;
  icon: string;
  rule: string;
}

export const RARITY_STYLE: Record<Rarity, { ring: string; bg: string; text: string; glow: string; label: string }> = {
  common:    { ring: 'ring-white/15',    bg: 'from-white/[0.06] to-white/[0.02]',          text: 'text-white/70',  glow: 'shadow-[0_0_24px_-6px_rgba(255,255,255,0.25)]', label: 'Común' },
  uncommon:  { ring: 'ring-pana-lime/40',bg: 'from-pana-lime/[0.18] to-pana-lime/[0.04]',  text: 'text-pana-lime', glow: 'shadow-[0_0_28px_-4px_rgba(207,255,4,0.55)]',     label: 'Poco común' },
  rare:      { ring: 'ring-pana-blue/50',bg: 'from-pana-blue/[0.22] to-pana-blue/[0.05]',  text: 'text-sky-300',   glow: 'shadow-[0_0_32px_-4px_rgba(30,127,224,0.7)]',     label: 'Rara' },
  epic:      { ring: 'ring-fuchsia-400/50',bg: 'from-fuchsia-500/[0.22] to-purple-500/[0.06]',text: 'text-fuchsia-300',glow:'shadow-[0_0_36px_-4px_rgba(217,70,239,0.7)]',    label: 'Épica' },
  legendary: { ring: 'ring-amber-300/60',bg: 'from-amber-300/[0.28] to-orange-500/[0.08]', text: 'text-amber-300', glow: 'shadow-[0_0_44px_-2px_rgba(251,191,36,0.8)]',     label: 'Legendaria' }
};

export const BADGES: BadgeDef[] = [
  { id: 'genesis',    name: 'Génesis',          desc: 'Tu primera cuenta referida activada.',           rarity: 'common',    icon: '◉',  rule: '1 cuenta aprobada' },
  { id: 'rising',     name: 'Rising Star',      desc: 'Cumpliste tu primer mes activo.',                rarity: 'common',    icon: '✦',  rule: '30 días en el programa' },
  { id: 'streak7',    name: 'Constante',        desc: 'Una semana sin parar de mover la red.',          rarity: 'uncommon',  icon: '➶',  rule: '7 días seguidos con actividad' },
  { id: 'lightning',  name: 'Relámpago',        desc: '5 referidos en un solo día.',                    rarity: 'uncommon',  icon: '⚡', rule: '5 cuentas en 24h' },
  { id: 'decimator',  name: 'Decimator',        desc: 'Diez cuentas activadas a tu nombre.',            rarity: 'uncommon',  icon: '✪',  rule: '10 cuentas aprobadas' },
  { id: 'half',       name: 'Medio Centenar',   desc: 'Cincuenta cuentas. Ya eres referencia.',         rarity: 'rare',      icon: '◈',  rule: '50 cuentas aprobadas' },
  { id: 'cross',      name: 'Cross-Border',     desc: 'Tus referidos vienen de 3+ países.',             rarity: 'rare',      icon: '◎',  rule: 'Referidos de 3+ países' },
  { id: 'top10',      name: 'Top 10',           desc: 'Entraste al top 10 del leaderboard global.',     rarity: 'rare',      icon: '⌖',  rule: 'Ranking ≤ 10' },
  { id: 'marathon',   name: 'Marathon',         desc: '30 días seguidos de actividad.',                 rarity: 'rare',      icon: '➹',  rule: '30 días seguidos' },
  { id: 'centurion',  name: 'Centurión',        desc: 'Cien cuentas referidas. Bestia.',                rarity: 'epic',      icon: 'C',  rule: '100 cuentas aprobadas' },
  { id: 'highroller', name: 'High Roller',      desc: 'Generaste $1,000+ USD en comisiones.',           rarity: 'epic',      icon: '$',  rule: '$1,000+ comisión' },
  { id: 'top3',       name: 'Top 3',            desc: 'Estás entre los 3 mejores. Mira hacia arriba.',  rarity: 'epic',      icon: '☖',  rule: 'Ranking ≤ 3' },
  { id: 'influencer', name: 'Influencer Track', desc: 'Promovido al programa de creadores.',            rarity: 'epic',      icon: '▶',  rule: 'Aprobado en track Influencer' },
  { id: 'corp',       name: 'Corporate Hero',   desc: 'Trajiste una empresa al programa Corp.',         rarity: 'epic',      icon: '◆',  rule: 'Cliente corporativo aperturado' },
  { id: 'numero1',    name: 'Número Uno',       desc: 'Lideraste el ranking global. Aplaudimos.',       rarity: 'legendary', icon: '★',  rule: 'Ranking #1' },
  { id: 'diamond',    name: 'Diamante',         desc: 'Alcanzaste el nivel máximo de la red.',          rarity: 'legendary', icon: '◇',  rule: 'Nivel 10 — Legend' }
];

export const BADGES_BY_ID: Record<string, BadgeDef> = Object.fromEntries(BADGES.map(b => [b.id, b]));

export const LEVELS = [
  { lv: 1,  name: 'Newcomer',     min: 0     },
  { lv: 2,  name: 'Spark',        min: 100   },
  { lv: 3,  name: 'Connector',    min: 250   },
  { lv: 4,  name: 'Builder',      min: 500   },
  { lv: 5,  name: 'Multiplier',   min: 1000  },
  { lv: 6,  name: 'Trailblazer',  min: 2000  },
  { lv: 7,  name: 'Powerhouse',   min: 4000  },
  { lv: 8,  name: 'Vanguard',     min: 7000  },
  { lv: 9,  name: 'Luminary',     min: 12000 },
  { lv: 10, name: 'Legend',       min: 20000 }
];

export function levelFromXP(xp: number) {
  let curr = LEVELS[0], next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) { curr = LEVELS[i]; next = LEVELS[i + 1] || LEVELS[i]; }
  }
  const progress = next.min === curr.min ? 1 : Math.min(1, (xp - curr.min) / (next.min - curr.min));
  return { curr, next, progress };
}
