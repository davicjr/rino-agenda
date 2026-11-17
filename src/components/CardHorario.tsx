// "Card de luta": coluna fixa para a hora (as barras de todos os cards alinham),
// status e barra à direita, nomes embaixo e uma linha de ação compacta.
// Encerrado e bloqueado viram uma linha fina (CardFechado).
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Agendado, Horario } from '@/lib/api'
import { reduzirMovimento } from '@/lib/impacto'
import { Carimbo } from './Carimbo'
import { CardFechado } from './CardFechado'
import { Hora } from './Hora'
import { ListaNomes } from './ListaNomes'
import { MedidorVagas } from './MedidorVagas'

type Props = {
  horario: Horario
  pulso: number
  onAgendar: (h: Horario) => void
  onTocarNome: (a: Agendado, h: Horario) => void
}

export function CardHorario({ horario: h, pulso, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLElement>(null)
  const lotado = h.agendados.length >= h.vagas

  // Impacto da confirmação: o card treme, pisca e o novo nome entra.
  useGSAP(
    () => {
      if (!pulso || reduzirMovimento()) return
      gsap.timeline()
        .fromTo('.flash', { opacity: 0.4 }, { opacity: 0, duration: 0.5, ease: 'power2.out' })
        .to(raiz.current, { keyframes: { x: [0, -8, 6, -3, 0] }, duration: 0.36, ease: 'power2.out' }, 0)
        .from('.nome-novo', { scale: 0.6, opacity: 0, duration: 0.32, ease: 'expo.out' }, 0.08)
    },
    { scope: raiz, dependencies: [pulso] },
  )

  if (h.bloqueio || !h.aberto) return <CardFechado horario={h} />

  const n = h.agendados.length
  return (
    <article ref={raiz} className="corte relative overflow-hidden bg-carvao-2 p-4" aria-label={`Treino das ${h.hora}`}>
      <span className="flash pointer-events-none absolute inset-0 bg-ouro-9 opacity-0" />

      <div className="relative grid grid-cols-[5.25rem_1fr] items-center gap-4">
        <Hora hora={h.hora} />
        <div className="min-w-0">
          {lotado ? <Carimbo /> : <MedidorVagas ocupadas={n} vagas={h.vagas} />}
          {h.professor && (
            <p className="font-cond mt-1 text-sm font-semibold tracking-wide text-carvao-10">
              Prof. <span className="text-carvao-12">{h.professor.nome}</span>
            </p>
          )}
        </div>
      </div>

      {n > 0 && <ListaNomes agendados={h.agendados} pulso={pulso} podeRetirar onTocar={(a) => onTocarNome(a, h)} />}

      <div className="relative mt-3 flex items-center justify-between gap-3">
        <p className="font-cond text-[0.95rem] font-semibold text-carvao-10">
          {lotado ? 'Turma cheia. Se alguém sair, a vaga abre.' : n === 0 ? 'Ninguém agendado ainda' : `${n} ${n === 1 ? 'confirmado' : 'confirmados'}`}
        </p>
        {!lotado && (
          <button
            onClick={() => onAgendar(h)}
            className="paralelo font-display h-11 shrink-0 bg-ouro-9 px-6 text-base tracking-wider text-preto uppercase transition-transform duration-100 active:scale-[0.97] active:bg-ouro-10"
          >
            Agendar
          </button>
        )}
      </div>
    </article>
  )
}
