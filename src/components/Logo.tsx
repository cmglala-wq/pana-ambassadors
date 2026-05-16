export default function Logo({ size = 38, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3 group">
      <div
        className="relative shrink-0 rounded-[14px] bg-white flex items-center justify-center overflow-hidden shadow-[0_6px_22px_-8px_rgba(207,255,4,0.45)] group-hover:shadow-[0_10px_30px_-6px_rgba(207,255,4,0.7)] transition-all duration-300"
        style={{ width: size, height: size }}
      >
        <img src="/pana-logo.png" alt="Pana" className="object-contain" style={{ width: size * 0.78, height: size * 0.78 }} />
        <span className="absolute inset-0 ring-1 ring-inset ring-pana-lime/0 group-hover:ring-pana-lime/40 rounded-[14px] transition-colors duration-300" />
      </div>

      {withText && (
        <div className="leading-none">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.32em] font-bold text-pana-lime mb-1.5">
            <span className="w-1 h-1 rounded-full bg-pana-lime shadow-[0_0_8px_rgba(207,255,4,0.85)]" />
            <span>
              Pana<span className="opacity-50 ml-[1px]">®</span>
            </span>
            <span className="hidden sm:inline-block w-3 h-px bg-gradient-to-r from-pana-lime/60 to-transparent" />
          </div>
          <div className="relative font-display text-[18px] font-extrabold tracking-[-0.04em] leading-none">
            <span className="bg-gradient-to-r from-white via-white to-pana-lime bg-clip-text text-transparent transition-all duration-500 group-hover:from-pana-lime group-hover:via-white group-hover:to-white">
              Ambassadors
            </span>
            <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-pana-lime to-transparent transition-all duration-500" />
          </div>
        </div>
      )}
    </div>
  );
}
