// Card do horário escolhido: hora, professor, vagas, lista completa e a ação.
// Encerrado mostra quem treinou; bloqueado fica vermelho com o motivo.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lock } from 'lucide-react'
import type { Agendado, Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { horaCurta, iniciais } from '@/lib/datas'
import { reduzirMovimento } from '@/lib/impacto'
import { Carimbo } from './Carimbo'
import { Hora } from './Hora'
import { ListaAlunos } from './ListaAlunos'
import { MedidorVagas } from './MedidorVagas'

type Props = { horario: Horario; pulso: number; onAgendar: (h: Horario) => void; onTocarNome: (a: Agendado, h: Horario) => void }

export function CardAula({ horario: h, pulso, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLElement>(null)
  const n = h.agendados.length
  const lotado = n >= h.vagas
  const aberto = h.aberto && !h.bloqueio

  useGSAP(
    () => {
      if (!pulso || reduzirMovimento()) return
      gsap.timeline()
        .fromTo('.flash', { opacity: 0.4 }, { opacity: 0, duration: 0.5, ease: 'power2.out' })
        .to(raiz.current, { keyframes: { x: [0, -8, 6, -3, 0] }, duration: 0.36, ease: 'power2.out' }, 0)
        .from('.nome-novo', { scale: 0.85, opacity: 0, duration: 0.32, ease: 'expo.out' }, 0.08)
    },
    { scope: raiz, dependencies: [pulso] },
  )

  if (h.bloqueio) {
    return (
      <article className="corte bg-alerta-3 p-5" aria-label={`Treino das ${h.hora}`}>
        <Hora hora={h.hora} />
        <p className="font-display mt-4 flex items-center gap-2 text-2xl text-alerta-12 uppercase"><Lock className="size-5 text-alerta-11" /> {h.bloqueio}</p>
        <p className="mt-1 text-alerta-11">Não tem treino neste horário.</p>
      </article>
    )
  }

  return (
    <article ref={raiz} className="corte relative overflow-hidden bg-carvao-2" aria-label={`Treino das ${h.hora}`}>
      <span className="flash pointer-events-none absolute inset-0 bg-ouro-9 opacity-0" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <Hora hora={h.hora} />
          {lotado && aberto ? <Carimbo /> : !aberto && <span className="font-cond rounded-full bg-carvao-4 px-3 py-1 text-xs font-bold tracking-widest text-carvao-10 uppercase">Encerrado</span>}
        </div>
        {h.professor && (
          <div className="mt-4 flex items-center gap-3">
            <span className="font-cond grid size-10 place-items-center rounded-full bg-ouro-9 text-sm font-bold text-preto">{iniciais(h.professor.nome)}</span>
            <div className="leading-tight">
              <p className="font-cond text-xs font-bold tracking-widest text-carvao-9 uppercase">Professor</p>
              <p className="text-base font-semibold">{h.professor.nome}</p>
            </div>
          </div>
        )}
        {aberto && <div className="mt-5"><MedidorVagas ocupadas={n} vagas={h.vagas} /></div>}
      </div>

      <div className="relative border-t border-carvao-4 px-5 pt-4 pb-2">
        <p className="font-cond mb-1 text-xs font-bold tracking-[0.16em] text-carvao-9 uppercase">
          {aberto ? `Confirmados · ${n}` : `Treinaram · ${n}`}
        </p>
        {n ? (
          <ListaAlunos agendados={h.agendados} pulso={pulso} podeRetirar={aberto} onTocar={(a) => onTocarNome(a, h)} />
        ) : (
          <p className="py-4 text-carvao-9">{aberto ? 'Ninguém agendado ainda.' : 'Ninguém treinou neste horário.'}</p>
        )}
      </div>

      {aberto && (
        <div className="relative p-5 pt-3">
          <button
            onClick={() => onAgendar(h)}
            disabled={lotado}
            className={cn(
              'paralelo font-display h-14 w-full text-xl tracking-wider uppercase transition-transform duration-100 active:scale-[0.98]',
              lotado ? 'bg-carvao-4 text-carvao-9' : 'bg-ouro-9 text-preto active:bg-ouro-10',
            )}
          >
            {lotado ? 'Turma cheia' : `Agendar às ${horaCurta(h.hora)}`}
          </button>
        </div>
      )}
    </article>
  )
}
