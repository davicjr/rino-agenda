// Semana de domingo a sábado com setas para pular 7 dias. Os 7 dias cabem na largura,
// o destaque amarelo desliza até o dia escolhido e a semana nova entra pelo lado da seta.
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { diaDoMes, diaSemana, mesCurto, nomeDiaCurto, somarDias } from '@/lib/datas'
import { estiloDia, estiloNumero } from '@/lib/estiloDia'
import { reduzirMovimento } from '@/lib/impacto'

type Props = {
  hoje: string
  selecionado: string
  onSelecionar: (d: string) => void
  diasComAula: Set<number>
  bloqueados?: Set<string>
  min?: string
  max?: string
}

const dentro = (d: string, min?: string, max?: string) => (!min || d >= min) && (!max || d <= max)
const INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function SemanaDias({ hoje, selecionado, onSelecionar, diasComAula, bloqueados, min, max }: Props) {
  const domingo = somarDias(selecionado, -diaSemana(selecionado))
  const dias = Array.from({ length: 7 }, (_, i) => somarDias(domingo, i))
  const sabado = dias[6]
  const podeVoltar = !min || somarDias(domingo, -1) >= min
  const podeAvancar = !max || somarDias(sabado, 1) <= max
  const raiz = useRef<HTMLElement>(null)
  const grade = useRef<HTMLDivElement>(null)
  const indicador = useRef<HTMLSpanElement>(null)
  const semanaAnterior = useRef(domingo)
  const primeira = useRef(true)

  const mover = (semanas: number) => {
    let alvo = somarDias(selecionado, 7 * semanas)
    if (min && alvo < min) alvo = min
    if (max && alvo > max) alvo = max
    onSelecionar(alvo)
  }

  useGSAP(
    () => {
      const alvo = grade.current?.querySelector<HTMLElement>(`[data-dia="${selecionado}"]`)
      if (!alvo) return
      const parado = primeira.current || reduzirMovimento()
      const mudouSemana = semanaAnterior.current !== domingo
      const direcao = domingo > semanaAnterior.current ? 1 : -1
      semanaAnterior.current = domingo
      primeira.current = false
      gsap.to(indicador.current, { x: alvo.offsetLeft, width: alvo.offsetWidth, opacity: 1, duration: parado || mudouSemana ? 0 : 0.4, ease: 'expo.out' })
      if (parado) return
      if (mudouSemana) {
        gsap.fromTo(grade.current, { x: 32 * direcao, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'expo.out' })
        gsap.fromTo('.rotulo-semana', { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'expo.out' })
      } else {
        gsap.fromTo(alvo.querySelector('.numero'), { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'expo.out' })
      }
    },
    { dependencies: [selecionado], scope: raiz },
  )

  // Girar o celular muda a largura dos chips: o destaque acompanha o dia escolhido.
  useEffect(() => {
    const el = grade.current
    if (!el) return
    const observador = new ResizeObserver(() => {
      const alvo = el.querySelector<HTMLElement>(`[data-dia="${selecionado}"]`)
      if (alvo && indicador.current) gsap.set(indicador.current, { x: alvo.offsetLeft, width: alvo.offsetWidth })
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [selecionado])

  const rotulo = mesCurto(domingo) === mesCurto(sabado)
    ? `${diaDoMes(domingo)} – ${diaDoMes(sabado)} ${mesCurto(sabado)}`
    : `${diaDoMes(domingo)} ${mesCurto(domingo)} – ${diaDoMes(sabado)} ${mesCurto(sabado)}`

  return (
    <nav ref={raiz} aria-label="Escolher dia" className="relative z-10 shrink-0 px-5">
      <div className="mb-[var(--folga-p)] flex items-center justify-between">
        <button onClick={() => mover(-1)} disabled={!podeVoltar} aria-label="Semana anterior" className="-ml-2.5 grid size-11 place-items-center text-carvao-12 disabled:text-carvao-6">
          <ChevronLeft className="size-6" />
        </button>
        <p className="rotulo-semana font-cond text-base font-bold tracking-[0.14em] text-carvao-11 uppercase">{rotulo}</p>
        <button onClick={() => mover(1)} disabled={!podeAvancar} aria-label="Próxima semana" className="-mr-2.5 grid size-11 place-items-center text-carvao-12 disabled:text-carvao-6">
          <ChevronRight className="size-6" />
        </button>
      </div>
      <div aria-hidden className="font-cond mb-[var(--folga-p)] grid grid-cols-7 gap-1.5 text-center [@media(max-height:680px)]:hidden text-xs font-bold text-carvao-9">
        {INICIAIS.map((l, i) => <span key={i}>{l}</span>)}
      </div>
      <div ref={grade} className="relative grid grid-cols-7 gap-1.5">
        <span ref={indicador} aria-hidden className="paralelo pointer-events-none absolute top-0 left-0 h-[var(--altura-dia)] bg-ouro-9 opacity-0" />
        {dias.map((d) => {
          const bloq = bloqueados?.has(d) ?? false
          const tem = diasComAula.has(diaSemana(d)) && !bloq
          const sel = d === selecionado
          return (
            <button
              key={d}
              data-dia={d}
              disabled={!dentro(d, min, max)}
              onClick={() => onSelecionar(d)}
              aria-pressed={sel}
              aria-label={`${nomeDiaCurto(d)} ${diaDoMes(d)}${d === hoje ? ', hoje' : ''}${bloq ? ', sem aula' : !tem ? ', folga' : ''}`}
              className={cn(estiloDia({ sel, bloq, tem, passado: d < hoje }), 'h-[var(--altura-dia)]', sel && 'bg-transparent')}
            >
              <span className={cn('numero text-[clamp(1.25rem,2.9dvh,1.625rem)]', estiloNumero({ sel, bloq, tem, passado: false }))}>{diaDoMes(d)}</span>
              {d === hoje && <span className={cn('absolute bottom-1 size-1 rounded-full', sel ? 'bg-preto' : 'bg-ouro-9')} />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
