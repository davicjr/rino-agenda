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
      className="font-display pointer-events-none inline-block -rotate-6 border-[3px] border-sangue-10 px-2.5 py-0.5 text-3xl tracking-widest text-sangue-10 uppercase"
    >
      {texto}
    </span>
  )
}
