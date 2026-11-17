// Fundo do topo: só o escudo em marca-d'água, bem apagado e cortado no canto.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

export function FundoMarca() {
  const ref = useRef<HTMLImageElement>(null)
  useGSAP(() => {
    if (reduzirMovimento()) return
    gsap.from(ref.current, { scale: 1.1, opacity: 0, duration: 1.2, ease: 'expo.out' })
  })
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
      <img ref={ref} src="/escudo.webp" alt="" className="absolute top-14 -right-24 h-80 w-auto opacity-[0.045] grayscale" />
    </div>
  )
}
