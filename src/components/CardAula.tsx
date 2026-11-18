// Card do horário escolhido: hora, professor, vagas, lista completa e a ação.
// Encerrado mostra quem treinou; bloqueado fica vermelho com o motivo.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lock } from 'lucide-react'
import type { Agendado, Horario, RegrasJanela } from '@/lib/api'
import { Avatar } from '@/ui/Avatar'
import { reduzirMovimento } from '@/lib/impacto'
import { Carimbo } from './Carimbo'
import { ListaAlunos } from './ListaAlunos'
import { BotaoAgendar } from './BotaoAgendar'
import { MedidorVagas } from './MedidorVagas'

type Props = { horario: Horario; regras?: RegrasJanela; pulso: number; onAgendar: (h: Horario) => void; onTocarNome: (a: Agendado, h: Horario) => void }

export function CardAula({ horario: h, regras, pulso, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLElement>(null)
  const n = h.agendados.length
  const lotado = h.vagas !== null && n >= h.vagas
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
        <p className="font-display flex items-center gap-2 text-2xl text-alerta-12 uppercase [overflow-wrap:anywhere]"><Lock className="size-5 shrink-0 text-alerta-11" /> <span className="min-w-0">{h.bloqueio}</span></p>
        <p className="mt-1 text-alerta-11">Não tem treino neste horário.</p>
        {h.bloqueioNota && <p className="mt-3 border-t border-alerta-4 pt-3 text-alerta-12 [overflow-wrap:anywhere]">{h.bloqueioNota}</p>}
      </article>
    )
  }

  return (
    <article ref={raiz} className="corte relative flex min-h-0 flex-1 flex-col overflow-hidden bg-carvao-2" aria-label={`Treino das ${h.hora}`}>
      <span className="flash pointer-events-none absolute inset-0 bg-ouro-9 opacity-0" />
      <div className="relative shrink-0 px-5 py-[var(--folga-m)]">
        {(lotado && aberto) || !aberto ? (
          <div className="mb-4">
            {lotado && aberto ? <Carimbo /> : <span className="paralelo font-cond inline-block bg-carvao-4 px-4 py-1.5 text-xs font-bold tracking-widest text-carvao-10 uppercase">Encerrado</span>}
          </div>
        ) : null}
        {h.professor && (
          <p className="flex items-center gap-3">
            <Avatar nome={h.professor.nome} tipo="professor" id={h.professor.id} foto={h.professor.foto} destaque className="size-10 text-sm" />
            <span className="font-cond text-sm font-bold tracking-wider text-carvao-9 uppercase">Prof.</span>
            <span className="truncate text-lg font-semibold">{h.professor.nome}</span>
          </p>
        )}
        {aberto && <div className={h.professor ? 'mt-[var(--folga-m)]' : ''}><MedidorVagas ocupadas={n} vagas={h.vagas} /></div>}
      </div>

      <ListaAlunos
        key={h.id}
        titulo={aberto ? 'Confirmados' : 'Treinaram'}
        vazio={aberto ? 'Ninguém agendado ainda.' : 'Ninguém treinou neste horário.'}
        agendados={h.agendados}
        pulso={pulso}
        podeRetirar={h.podeRetirar}
        onTocar={(a) => onTocarNome(a, h)}
      />

      {aberto && (
        <div className="relative shrink-0 px-5 pt-[var(--folga-p)] pb-[var(--folga-m)]">
          <BotaoAgendar h={h} lotado={lotado} regras={regras} onAgendar={() => onAgendar(h)} />
        </div>
      )}
    </article>
  )
}
