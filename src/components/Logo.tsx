export default function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
        <defs>
          <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#CFFF04" />
            <stop offset="1" stopColor="#1E7FE0" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#0A1628" />
        <circle cx="32" cy="32" r="18" fill="url(#lg)" />
        <text x="50%" y="56%" textAnchor="middle" fontFamily="Inter, system-ui" fontWeight="900" fontSize="22" fill="#0A1628">P</text>
      </svg>
      {withText && (
        <div className="leading-none">
          <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime/80 font-bold">Pana</div>
          <div className="text-[15px] font-bold text-white -mt-0.5">Ambassadors</div>
        </div>
      )}
    </div>
  );
}
