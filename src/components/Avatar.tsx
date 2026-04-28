import { Rarity, RARITY_STYLE } from '../data/badges';

type Props = {
  src: string;
  name: string;
  size?: number;
  ring?: Rarity | 'none' | 'lime' | 'rank';
  rank?: number;
  className?: string;
};

export default function Avatar({ src, name, size = 40, ring = 'none', rank, className = '' }: Props) {
  const ringClass =
    ring === 'none' ? 'ring-1 ring-white/10' :
    ring === 'lime' ? 'ring-2 ring-pana-lime' :
    ring === 'rank' ? (rank === 1 ? 'ring-2 ring-amber-300' : rank && rank <= 3 ? 'ring-2 ring-fuchsia-400' : rank && rank <= 10 ? 'ring-2 ring-pana-blue' : 'ring-1 ring-white/15') :
    `ring-2 ${RARITY_STYLE[ring].ring}`;

  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <div className={`relative inline-flex ${className}`}>
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        className={`rounded-full object-cover bg-pana-navy-2 ${ringClass} ring-offset-2 ring-offset-pana-navy`}
        style={{ width: size, height: size }}
      />
      <span className="absolute inset-0 rounded-full pointer-events-none flex items-center justify-center text-[10px] font-bold text-white/40 -z-10">{initials}</span>
      {rank && rank <= 3 && (
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${rank === 1 ? 'bg-amber-300 text-pana-navy' : rank === 2 ? 'bg-zinc-300 text-pana-navy' : 'bg-orange-400 text-pana-navy'}`}>
          {rank}
        </span>
      )}
    </div>
  );
}
