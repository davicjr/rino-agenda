// Abas de texto com os horários do dia: o escolhido ganha um sublinhado amarelo que desliza.
// Ocupação embaixo da hora; lotado, treinando, encerrado e sem aula mudam a cor do texto.
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'

type Props = { horarios: Horario[]; selecionado: number; onSelecionar: (id: number) => void }

export function AbasHorarios({ horarios, selecionado, onSelecionar }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const barra = useRef<HTMLSpanElement>(null)
  const primeira = useRef(true)
  useGSAP(
    () => {
      const alvo = raiz.current?.querySelector<HTMLElement>(`[data-h="${selecionado}"]`)
      if (!alvo) return
      const parado = primeira.current || reduzirMovimento()
      primeira.current = false
      gsap.to(barra.current, { x: alvo.offsetLeft + 12, width: alvo.offsetWidth - 24, opacity: 1, duration: parado ? 0 : 0.4, ease: 'expo.out' })
    },
    { dependencies: [selecionado, horarios.length], scope: raiz },
  )
  // Girar o celular muda a largura das abas: o sublinhado acompanha a aba escolhida.
  useEffect(() => {
    const el = raiz.current
    if (!el) return
    const observador = new ResizeObserver(() => {
      const alvo = el.querySelector<HTMLElement>(`[data-h="${selecionado}"]`)
      if (alvo && barra.current) gsap.set(barra.current, { x: alvo.offsetLeft + 12, width: alvo.offsetWidth - 24 })
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [selecionado])

  const selBloqueado = !!horarios.find((h) => h.id === selecionado)?.bloqueio

  return (
    <div ref={raiz} role="tablist" aria-label="Horários do dia" className="relative flex shrink-0 border-b border-carvao-4">
      {horarios.map((h) => {
        const sel = h.id === selecionado
        const n = h.agendados.length
        const treinando = h.fase === 'treinando' && !h.bloqueio
        const status = h.bloqueio ? 'sem aula' : treinando ? 'treinando' : !h.aberto ? 'encerrado' : h.vagas === null ? `${n}/∞` : n >= h.vagas ? 'lotado' : `${n}/${h.vagas}`
        const [hh, mm] = h.hora.split(':')
        return (
          <button
            key={h.id}
            data-h={h.id}
            role="tab"
            aria-selected={sel}
            onClick={() => onSelecionar(h.id)}
            className={cn(
              'flex h-[var(--altura-aba)] flex-1 flex-col items-center justify-center transition-colors duration-200',
              h.bloqueio ? 'text-alerta-11' : sel ? 'text-carvao-12' : treinando ? 'text-ouro-11' : !h.aberto ? 'text-carvao-8' : 'text-carvao-10',
            )}
          >
            <span className="font-display text-[clamp(1.25rem,3dvh,1.75rem)] leading-none">
              {hh}
              <span className="font-cond ml-0.5 text-sm font-bold">h{mm !== '00' && mm}</span>
            </span>
            <span className={cn('font-cond mt-1 text-xs font-semibold tracking-wide', treinando && 'text-ouro-11')}>{status}</span>
          </button>
        )
      })}
      <span ref={barra} aria-hidden className={cn('absolute -bottom-px left-0 h-[3px] -skew-x-[20deg] opacity-0 transition-colors duration-300', selBloqueado ? 'bg-alerta-9' : 'bg-ouro-9')} />
    </div>
  )
}
