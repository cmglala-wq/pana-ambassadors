export default function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="shrink-0 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-[0_6px_22px_-6px_rgba(207,255,4,0.4)]"
        style={{ width: size, height: size }}
      >
        <img src="/pana-logo.png" alt="Pana" className="object-contain" style={{ width: size * 0.78, height: size * 0.78 }} />
      </div>
      {withText && (
        <div className="leading-none">
          <div className="text-[10px] uppercase tracking-[0.22em] text-pana-lime/80 font-bold">Pana</div>
          <div className="text-[15px] font-bold text-white -mt-0.5">Ambassadors</div>
        </div>
      )}
    </div>
  );
}
