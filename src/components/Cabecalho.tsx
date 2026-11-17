// Topo padrão da agenda e do admin: escudo, título, subtítulo e os ícones à direita.
// O escudo cai no lugar ao abrir.
import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'

type Props = { titulo: string; subtitulo: string; acoes?: ReactNode }

export function Cabecalho({ titulo, subtitulo, acoes }: Props) {
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
    <header ref={ref} className="relative z-10 flex shrink-0 items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),0.75rem)]">
      <img src="/escudo.webp" alt="" width={33} height={48} className="escudo h-12 w-auto shrink-0" />
      <div className="marca min-w-0 flex-1 leading-none">
        <p className="font-display truncate text-[1.5rem] tracking-wide uppercase">{titulo}</p>
        <p className="font-cond mt-1 truncate text-sm font-semibold tracking-[0.18em] text-carvao-11 uppercase">{subtitulo}</p>
      </div>
      <div className="-mr-2.5 flex shrink-0 items-center">{acoes}</div>
    </header>
  )
}
