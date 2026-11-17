// Marca no topo: escudo, nome da equipe e o lema. O escudo cai no lugar ao abrir o app.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lock } from 'lucide-react'
import { Link } from 'react-router'
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
    <header ref={ref} className="relative z-10 flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),1rem)]">
      <img src="/escudo.webp" alt="" width={39} height={56} className="escudo h-14 w-auto shrink-0" />
      <div className="marca min-w-0 flex-1 leading-none">
        <p className="font-display text-[1.5rem] tracking-wide uppercase">Rino Fight Team</p>
        <p className="font-cond mt-1 text-sm font-semibold tracking-[0.18em] text-carvao-11 uppercase">
          Muay Thai · Agenda
        </p>
      </div>
      <Link to="/admin" aria-label="Painel do professor" className="-mr-2 grid size-11 shrink-0 place-items-center text-carvao-8 active:text-carvao-12">
        <Lock className="size-5" />
      </Link>
    </header>
  )
}
