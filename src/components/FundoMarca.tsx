// Fundo do topo no estilo do cartaz: escudo em marca-d'água e "RINO FIGHT TEAM" vazado,
// bem apagados e sumindo para baixo. As linhas entram deslizando uma vez.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

const LINHAS = ['Rino Fight', 'Fight Team', 'Rino Fight', 'Fight Team']

export function FundoMarca() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (reduzirMovimento()) return
      gsap.from('.vazado', { xPercent: 12, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 })
      gsap.from('.marca-dagua', { scale: 1.15, opacity: 0, duration: 1.2, ease: 'expo.out' })
    },
    { scope: ref },
  )
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    >
      <img src="/escudo.webp" alt="" className="marca-dagua absolute top-16 -left-20 h-96 w-auto opacity-[0.07] grayscale" />
      <div className="absolute top-20 -right-6 text-right">
        {LINHAS.map((l, i) => (
          <p
            key={i}
            className="vazado font-display text-[4.25rem] leading-[0.95] tracking-wide text-transparent uppercase [-webkit-text-stroke:1px_var(--color-carvao-5)]"
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  )
}
