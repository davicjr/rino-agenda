// Abas de texto com os horários do dia: o escolhido ganha um sublinhado amarelo que desliza.
// Ocupação embaixo da hora; lotado, encerrado e sem aula mudam a cor do texto.
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

  return (
    <div ref={raiz} role="tablist" aria-label="Horários do dia" className="relative flex shrink-0 border-b border-carvao-4">
      {horarios.map((h) => {
        const sel = h.id === selecionado
        const n = h.agendados.length
        const status = h.bloqueio ? 'sem aula' : !h.aberto ? 'encerrado' : h.vagas === null ? 'sem limite' : n >= h.vagas ? 'lotado' : `${h.vagas - n} ${h.vagas - n === 1 ? 'livre' : 'livres'}`
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
              sel ? 'text-carvao-12' : h.bloqueio ? 'text-alerta-11' : !h.aberto ? 'text-carvao-8' : 'text-carvao-10',
            )}
          >
            <span className="font-display text-[clamp(1.25rem,3dvh,1.75rem)] leading-none">
              {hh}
              <span className="font-cond ml-0.5 text-sm font-bold">{mm === '00' ? 'h' : `:${mm}`}</span>
            </span>
            <span className="font-cond mt-1 text-xs font-semibold tracking-wide">{status}</span>
          </button>
        )
      })}
      <span ref={barra} aria-hidden className="absolute -bottom-px left-0 h-[3px] -skew-x-[20deg] bg-ouro-9 opacity-0" />
    </div>
  )
}
