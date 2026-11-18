// Selo "LOTADO" que cai sobre o card com impacto.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

export function Carimbo({ texto = 'Lotado' }: { texto?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    if (reduzirMovimento()) return
    gsap.from(ref.current, { scale: 1.8, opacity: 0, duration: 0.28, ease: 'power4.in' })
  })
  return (
    <span
      ref={ref}
      className="font-display pointer-events-none mr-1 inline-block shrink-0 -rotate-6 border-2 border-ouro-9 px-2 py-0.5 text-xl tracking-widest text-ouro-9 uppercase"
    >
      {texto}
    </span>
  )
}
