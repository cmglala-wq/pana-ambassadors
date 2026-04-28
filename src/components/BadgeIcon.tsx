import { BadgeDef, RARITY_STYLE } from '../data/badges';

type Props = { def: BadgeDef; unlocked: boolean; size?: 'sm' | 'md' | 'lg' };

export default function BadgeIcon({ def, unlocked, size = 'md' }: Props) {
  const s = RARITY_STYLE[def.rarity];
  const dim = size === 'sm' ? 'w-12 h-12 text-xl' : size === 'lg' ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl';
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`relative ${dim} rounded-2xl flex items-center justify-center font-display ${unlocked ? `bg-gradient-to-br ${s.bg} ring-2 ${s.ring} ${s.text} ${s.glow} group-hover:scale-110` : 'bg-white/[0.02] ring-1 ring-white/5 text-white/15 grayscale'} transition-all duration-300`}>
        <span>{def.icon}</span>
        {unlocked && (
          <span className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <span className="absolute inset-y-0 -inset-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"/>
          </span>
        )}
      </div>
      <div className={`mt-2 text-[11px] font-bold tracking-wide ${unlocked ? 'text-white' : 'text-white/30'} truncate max-w-[80px]`}>{def.name}</div>
    </div>
  );
}
