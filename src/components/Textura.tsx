// Pinceladas diagonais com borda áspera, da linguagem do cartaz. Entram varrendo uma vez.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

const RISCOS = [
  [120, 40, 420, 30, 0.5],
  [60, 96, 300, 12, 0.35],
  [200, 128, 360, 46, 0.28],
  [90, 204, 180, 8, 0.45],
  [260, 226, 260, 18, 0.22],
] as const

export function Textura({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      if (reduzirMovimento()) return
      gsap.from('.risco', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.1 })
      gsap.from('.pingo', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'expo.out', stagger: 0.04, delay: 0.5 })
    },
    { scope: ref },
  )
  return (
    <svg
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute [mask-image:linear-gradient(to_left,black_35%,transparent_85%)] ${className}`}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="aspero" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="14" />
        </filter>
      </defs>
      <g filter="url(#aspero)" fill="var(--color-ouro-9)" transform="rotate(-28 200 150)">
        {RISCOS.map(([x, y, w, h, o]) => (
          <rect key={`${x}-${y}`} className="risco" x={x} y={y} width={w} height={h} opacity={o} />
        ))}
      </g>
      <g filter="url(#aspero)" fill="var(--color-ouro-9)">
        {[[310, 36, 3], [338, 70, 2], [282, 112, 4], [366, 128, 2], [250, 60, 2], [372, 30, 3]].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} className="pingo" cx={x} cy={y} r={r} opacity="0.6" />
        ))}
      </g>
    </svg>
  )
}
