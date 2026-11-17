// Pinceladas diagonais com borda áspera, tiradas da linguagem da camisa da equipe.
export function Textura({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={`pointer-events-none absolute ${className}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="aspero" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="14" />
        </filter>
      </defs>
      <g filter="url(#aspero)" fill="var(--color-sangue-8)" transform="rotate(-28 200 150)">
        <rect x="120" y="40" width="420" height="34" opacity="0.55" />
        <rect x="60" y="96" width="300" height="14" opacity="0.4" />
        <rect x="200" y="128" width="360" height="52" opacity="0.32" />
        <rect x="90" y="204" width="180" height="8" opacity="0.5" />
        <rect x="260" y="226" width="260" height="20" opacity="0.25" />
      </g>
      <g filter="url(#aspero)" fill="var(--color-sangue-9)">
        {[[310, 36, 3], [338, 70, 2], [282, 112, 4], [366, 128, 2], [250, 60, 2], [372, 30, 3]].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity="0.7" />
        ))}
      </g>
    </svg>
  )
}
