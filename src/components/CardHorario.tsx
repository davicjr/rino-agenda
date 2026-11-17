// "Card de luta": hora gigante inclinada, barra de vagas, quem vai treinar e a ação.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Agendado, Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'
import { Carimbo } from './Carimbo'
import { MedidorVagas } from './MedidorVagas'
import { ListaNomes } from './ListaNomes'

type Props = {
  horario: Horario
  meuId: number | null
  pulso: number
  onAgendar: (h: Horario) => void
  onTocarNome: (a: Agendado, h: Horario) => void
}

export function CardHorario({ horario: h, meuId, pulso, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLElement>(null)
  const lotado = h.agendados.length >= h.vagas
  const estou = meuId !== null && h.agendados.some((a) => a.aluno_id === meuId)
  const fechado = !h.aberto || !!h.bloqueio
  const [hh, mm] = h.hora.split(':')

  // Impacto da confirmação: o card treme, pisca vermelho e o novo nome entra.
  useGSAP(
    () => {
      if (!pulso || reduzirMovimento()) return
      gsap.timeline()
        .fromTo('.flash', { opacity: 0.55 }, { opacity: 0, duration: 0.5, ease: 'power2.out' })
        .to(raiz.current, { keyframes: { x: [0, -8, 6, -3, 0] }, duration: 0.36, ease: 'power2.out' }, 0)
        .from('.nome-novo', { scale: 0.6, opacity: 0, duration: 0.32, ease: 'expo.out' }, 0.08)
    },
    { scope: raiz, dependencies: [pulso] },
  )

  return (
    <article
      ref={raiz}
      className={cn('corte relative overflow-hidden bg-carvao-2 p-4 pb-5', fechado && 'opacity-55')}
      aria-label={`Treino das ${h.hora}`}
    >
      <span className="flash pointer-events-none absolute inset-0 bg-sangue-9 opacity-0" />

      <div className="relative flex items-start gap-4">
        <p className="font-display -skew-x-6 text-[4.25rem] leading-[0.85] tracking-tight" aria-hidden>
          {hh}
          <span className="align-top text-2xl text-carvao-10">:{mm}</span>
        </p>
        <div className="min-w-0 flex-1 pt-1">
          {h.bloqueio ? (
            <p className="font-cond text-lg font-semibold uppercase">{h.bloqueio}</p>
          ) : !h.aberto ? (
            <p className="font-cond text-lg font-semibold text-carvao-10 uppercase">Encerrado</p>
          ) : lotado ? (
            <Carimbo />
          ) : (
            <MedidorVagas ocupadas={h.agendados.length} vagas={h.vagas} />
          )}
        </div>
      </div>

      {!(fechado && !h.agendados.length) && <ListaNomes agendados={h.agendados} meuId={meuId} pulso={pulso} podeRetirar={!fechado} onTocar={(a) => onTocarNome(a, h)} />}

      {!fechado && !lotado && (
        <button
          onClick={() => onAgendar(h)}
          className="paralelo font-display relative mt-4 h-12 w-full bg-sangue-9 text-lg tracking-wider text-branco uppercase transition-transform duration-100 active:scale-[0.98] active:bg-sangue-10"
        >
          {estou ? 'Agendar outro aluno' : 'Bora treinar'}
        </button>
      )}
    </article>
  )
}
