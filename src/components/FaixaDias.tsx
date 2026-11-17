// Faixa rolável com os próximos dias. Um indicador amarelo desliza até o dia escolhido,
// e a rolagem acontece só dentro da faixa (scrollIntoView arrastava a página inteira).
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/cn'
import { diaDoMes, diaSemana, nomeDiaCurto, somarDias } from '@/lib/datas'
import { reduzirMovimento } from '@/lib/impacto'

type Props = { hoje: string; desde?: string; dias: number; diasComAula: Set<number>; selecionado: string; onSelecionar: (d: string) => void; onCalendario: () => void }

export function FaixaDias({ hoje, desde, dias, diasComAula, selecionado, onSelecionar, onCalendario }: Props) {
  const lista = Array.from({ length: dias }, (_, i) => somarDias(desde ?? hoje, i))
  const trilho = useRef<HTMLDivElement>(null)
  const indicador = useRef<HTMLSpanElement>(null)
  const primeira = useRef(true)

  useGSAP(
    () => {
      const t = trilho.current
      const alvo = t?.querySelector<HTMLElement>(`[data-dia="${selecionado}"]`)
      if (!t || !alvo) return
      const instantaneo = primeira.current || reduzirMovimento()
      primeira.current = false
      gsap.to(indicador.current, {
        x: alvo.offsetLeft,
        width: alvo.offsetWidth,
        opacity: 1,
        duration: instantaneo ? 0 : 0.45,
        ease: 'expo.out',
      })
      if (!instantaneo) gsap.fromTo(alvo.querySelector('.numero'), { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'expo.out' })
      const centro = alvo.offsetLeft - (t.clientWidth - alvo.offsetWidth) / 2
      t.scrollTo({ left: Math.max(centro, 0), behavior: instantaneo ? 'auto' : 'smooth' })
    },
    { dependencies: [selecionado], scope: trilho },
  )

  return (
    <nav aria-label="Escolher dia" className="relative z-10">
      <div ref={trilho} className="sem-barra relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-px-5 px-5 pb-1">
        <span ref={indicador} aria-hidden className="paralelo pointer-events-none absolute top-0 left-0 h-16 w-14 bg-ouro-9 opacity-0" />
        {lista.map((d) => {
          const tem = diasComAula.has(diaSemana(d))
          const sel = d === selecionado
          return (
            <button
              key={d}
              data-dia={d}
              onClick={() => onSelecionar(d)}
              aria-pressed={sel}
              aria-label={tem ? undefined : `${nomeDiaCurto(d)} ${diaDoMes(d)}, folga`}
              className={cn(
                'paralelo relative flex h-16 w-14 shrink-0 snap-start flex-col items-center justify-center transition-colors duration-300',
                sel ? 'bg-transparent text-preto' : tem ? 'bg-carvao-3 text-carvao-12 active:bg-carvao-4' : 'bg-carvao-2 text-carvao-8',
              )}
            >
              <span className="font-cond text-xs font-semibold tracking-widest">{d === hoje ? 'HOJE' : nomeDiaCurto(d)}</span>
              <span className={cn('numero font-display text-2xl leading-tight', !tem && !sel && 'line-through decoration-2')}>{diaDoMes(d)}</span>
            </button>
          )
        })}
        <button
          onClick={onCalendario}
          aria-label="Abrir calendário"
          className="paralelo flex h-16 w-14 shrink-0 snap-start items-center justify-center bg-carvao-4 text-carvao-12 active:bg-carvao-5"
        >
          <CalendarDays className="size-6" />
        </button>
      </div>
    </nav>
  )
}
