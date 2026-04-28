type Point = { x: string; y: number };

export default function SimpleChart({ data, color = '#CFFF04', height = 160, fill = true }: { data: Point[]; color?: string; height?: number; fill?: boolean }) {
  if (data.length < 2) return null;
  const w = 600, h = height, pad = 20;
  const max = Math.max(...data.map(d => d.y));
  const min = Math.min(...data.map(d => d.y));
  const range = Math.max(1, max - min);

  const xStep = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => ({
    x: pad + i * xStep,
    y: pad + (h - pad * 2) * (1 - (d.y - min) / range),
    label: d.x,
    val: d.y
  }));

  const path = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
  const fillPath = `${path} L ${points[points.length - 1].x},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fillg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={fillPath} fill={`url(#fillg-${color.replace('#','')})`}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3} fill={color} className="drop-shadow"/>
          {i === points.length - 1 && (
            <circle cx={p.x} cy={p.y} r="9" fill={color} opacity="0.25" className="animate-pulse"/>
          )}
        </g>
      ))}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={h - 4} textAnchor="middle" className="text-[10px] fill-white/40">{p.label.slice(5)}</text>
      ))}
    </svg>
  );
}
