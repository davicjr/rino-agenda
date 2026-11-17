// Marca no topo: escudo, nome da equipe e o lema. O escudo cai no lugar ao abrir o app.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

export function Cabecalho() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reduzirMovimento()) return
      gsap.timeline()
        .from('.escudo', { y: -24, scale: 1.25, rotate: -8, opacity: 0, duration: 0.6, ease: 'expo.out' })
        .from('.marca > *', { x: -16, opacity: 0, duration: 0.45, ease: 'expo.out', stagger: 0.06 }, 0.12)
    },
    { scope: ref },
  )
  return (
    <header ref={ref} className="relative z-10 flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),1.25rem)]">
      <img src="/escudo.webp" alt="" width={44} height={64} className="escudo h-16 w-auto shrink-0" />
      <div className="marca leading-none">
        <p className="font-display text-[1.6rem] tracking-wide uppercase">Rino Fight Team</p>
        <p className="font-cond mt-1 text-sm font-semibold tracking-[0.18em] text-carvao-11 uppercase">
          Muay Thai · Agenda de treinos
        </p>
      </div>
    </header>
  )
}
