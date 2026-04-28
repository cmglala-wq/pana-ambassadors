type Props = { className?: string; tone?: 'lime' | 'blue' | 'mix' };

export default function Blob({ className = '', tone = 'mix' }: Props) {
  const fillA = tone === 'lime' ? '#CFFF04' : tone === 'blue' ? '#1E7FE0' : '#CFFF04';
  const fillB = tone === 'lime' ? '#9BE000' : tone === 'blue' ? '#0B5BD3' : '#1E7FE0';
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden>
      <defs>
        <linearGradient id={`bg-${tone}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={fillA} stopOpacity="0.8"/>
          <stop offset="1" stopColor={fillB} stopOpacity="0.8"/>
        </linearGradient>
        <filter id={`bf-${tone}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14"/>
        </filter>
      </defs>
      <g filter={`url(#bf-${tone})`}>
        <path d="M44,128 C30,82 78,30 132,42 C188,54 200,108 184,150 C168,196 110,212 70,188 C30,164 58,174 44,128 Z" fill={`url(#bg-${tone})`}/>
      </g>
    </svg>
  );
}
