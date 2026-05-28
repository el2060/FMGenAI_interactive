export function SgSkyline({ className = '' }) {
  return (
    <svg viewBox="0 0 800 180" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="sg-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE4F1" stopOpacity="0" />
          <stop offset="100%" stopColor="#C7B2FF" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="800" height="180" fill="url(#sg-sky-grad)" />

      {/* HDB blocks left */}
      <g fill="#0A0A12" opacity="0.85">
        <rect x="20" y="110" width="44" height="60" />
        <rect x="68" y="125" width="38" height="45" />
        <g fill="white" opacity="0.8">
          {[0,1,2,3].map(r => [0,1,2].map(c => (
            <rect key={`${r}-${c}`} x={26 + c*12} y={116 + r*12} width="6" height="6" />
          )))}
        </g>
      </g>

      {/* Marina Bay Sands - 3 towers + boat roof */}
      <g fill="#0A0A12" opacity="0.9">
        <rect x="130" y="60" width="22" height="110" />
        <rect x="160" y="60" width="22" height="110" />
        <rect x="190" y="60" width="22" height="110" />
        <path d="M 120 55 L 220 55 L 230 48 L 110 48 Z" />
      </g>

      {/* Esplanade durian (twin domes) */}
      <g fill="#0A0A12" opacity="0.85">
        <ellipse cx="250" cy="155" rx="22" ry="14" />
        <ellipse cx="282" cy="155" rx="22" ry="14" />
        {/* Spikes */}
        {[0,1,2,3,4].map(i => (
          <line key={`d1-${i}`} x1={234 + i*8} y1="146" x2={234 + i*8 - 2} y2="140" stroke="#0A0A12" strokeWidth="1.5" />
        ))}
        {[0,1,2,3,4].map(i => (
          <line key={`d2-${i}`} x1={266 + i*8} y1="146" x2={266 + i*8 - 2} y2="140" stroke="#0A0A12" strokeWidth="1.5" />
        ))}
      </g>

      {/* Singapore Flyer (Ferris wheel) */}
      <g stroke="#0A0A12" strokeWidth="2" fill="none" opacity="0.85">
        <circle cx="345" cy="100" r="42" />
        <line x1="345" y1="58" x2="345" y2="142" />
        <line x1="303" y1="100" x2="387" y2="100" />
        <line x1="315" y1="70" x2="375" y2="130" />
        <line x1="375" y1="70" x2="315" y2="130" />
      </g>
      <line x1="345" y1="142" x2="345" y2="170" stroke="#0A0A12" strokeWidth="3" opacity="0.85" />

      {/* CBD tall buildings */}
      <g fill="#0A0A12" opacity="0.9">
        <rect x="420" y="40"  width="28" height="130" />
        <polygon points="420,40 434,25 448,40" />
        <rect x="455" y="55"  width="24" height="115" />
        <rect x="486" y="70"  width="22" height="100" />
        <rect x="515" y="80"  width="26" height="90"  />
        <rect x="548" y="50"  width="20" height="120" />
        <polygon points="548,50 558,30 568,50" />
        <rect x="575" y="90"  width="24" height="80" />
        <rect x="606" y="65"  width="22" height="105" />
      </g>

      {/* HDB blocks right */}
      <g fill="#0A0A12" opacity="0.85">
        <rect x="650" y="115" width="48" height="55" />
        <rect x="702" y="100" width="42" height="70" />
        <rect x="748" y="120" width="38" height="50" />
        <g fill="white" opacity="0.8">
          {[0,1,2].map(r => [0,1,2,3].map(c => (
            <rect key={`r1-${r}-${c}`} x={656 + c*11} y={121 + r*12} width="6" height="6" />
          )))}
          {[0,1,2,3].map(r => [0,1,2].map(c => (
            <rect key={`r2-${r}-${c}`} x={708 + c*12} y={106 + r*12} width="6" height="6" />
          )))}
        </g>
      </g>

      {/* Ground line */}
      <line x1="0" y1="170" x2="800" y2="170" stroke="#0A0A12" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

export function HdbBlock({ size = 80 }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="6" y="8" width="48" height="60" fill="#FAFAF5" stroke="#0A0A12" strokeWidth="2" />
      <rect x="0" y="0" width="60" height="10" fill="#0A0A12" />
      {[0,1,2,3,4].map(r => [0,1,2].map(c => (
        <rect key={`${r}-${c}`} x={12 + c*14} y={14 + r*10} width="8" height="6" fill="#0A0A12" />
      )))}
      <rect x="25" y="60" width="10" height="8" fill="#0A0A12" />
    </svg>
  );
}

export function SgFlag({ size = 24 }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="36" height="12" fill="#ED2939" />
      <rect y="12" width="36" height="12" fill="white" />
      <circle cx="9" cy="6" r="3" fill="white" />
      <circle cx="10.5" cy="6" r="2.5" fill="#ED2939" />
      <g fill="white">
        {[0,1,2,3,4].map(i => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const x = 14 + Math.cos(angle) * 2;
          const y = 6 + Math.sin(angle) * 2;
          return <circle key={i} cx={x} cy={y} r="0.6" />;
        })}
      </g>
    </svg>
  );
}
