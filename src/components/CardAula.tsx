// Card do horário escolhido: hora, professor, vagas, lista completa e a ação.
// Durante a aula mostra quem está treinando; encerrado mostra quem treinou; bloqueado fica vermelho.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lock } from 'lucide-react'
import type { Agendado, Horario, RegrasJanela } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Avatar } from '@/ui/Avatar'
import { reduzirMovimento } from '@/lib/impacto'
import { Carimbo } from './Carimbo'
import { ListaAlunos } from './ListaAlunos'
import { BotaoAgendar } from './BotaoAgendar'
import { BarraVagas, ResumoVagas } from './MedidorVagas'

type Props = { horario: Horario; regras?: RegrasJanela; pulso: number; onAgendar: (h: Horario) => void; onTocarNome: (a: Agendado, h: Horario) => void }

export function CardAula({ horario: h, regras, pulso, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLElement>(null)
  const n = h.agendados.length
  const lotado = h.vagas !== null && n >= h.vagas
  const aberto = h.aberto && !h.bloqueio
  const treinando = h.fase === 'treinando'

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
      <article className="paralelo bg-alerta-3 p-5" aria-label={`Treino das ${h.hora}`}>
        <p className="font-display flex items-center gap-2 text-2xl text-alerta-12 uppercase [overflow-wrap:anywhere]"><Lock className="size-5 shrink-0 text-alerta-11" /> <span className="min-w-0">{h.bloqueio}</span></p>
        <p className="mt-1 text-alerta-11">Não tem treino neste horário.</p>
        {h.bloqueioNota && <p className="mt-3 border-t border-alerta-4 pt-3 text-alerta-12 [overflow-wrap:anywhere]">{h.bloqueioNota}</p>}
      </article>
    )
  }

  return (
    <article ref={raiz} className="flex min-h-0 flex-1 flex-col" aria-label={`Treino das ${h.hora}`}>
      <div data-palco className="min-h-0 flex-1">
        <div data-painel className="relative flex max-h-full flex-col overflow-hidden">
          <span className="flash pointer-events-none absolute inset-0 bg-ouro-9 opacity-0" />
          <div className="relative shrink-0 space-y-3 pt-2 pb-4">
            <div className="flex items-center gap-3">
              {h.professor && <Avatar nome={h.professor.nome} tipo="professor" id={h.professor.id} foto={h.professor.foto} destaque className="size-12 shrink-0 text-sm" />}
              <p className="min-w-0 flex-1">
                <span className="font-cond block text-xs font-bold tracking-wider text-carvao-10 uppercase">Professor</span>
                <span className={cn('mt-0.5 block truncate text-lg leading-7 font-semibold', !h.professor && 'text-carvao-10')}>{h.professor?.nome ?? 'A definir'}</span>
              </p>
              {treinando
                ? <span className="paralelo font-cond flex shrink-0 items-center gap-1.5 bg-ouro-9 px-3 py-1.5 text-xs font-bold tracking-widest text-preto uppercase"><span aria-hidden className="size-1.5 rounded-full bg-preto motion-safe:animate-pulse" /> Agora</span>
                : !aberto
                ? <span className="paralelo font-cond shrink-0 bg-carvao-4 px-3 py-1.5 text-xs font-bold tracking-widest text-carvao-10 uppercase">Encerrado</span>
                : lotado ? <Carimbo /> : <ResumoVagas ocupadas={n} vagas={h.vagas} />}
            </div>
            {aberto && h.vagas !== null && <BarraVagas ocupadas={n} vagas={h.vagas} />}
          </div>

          <ListaAlunos
            key={h.id}
            titulo={aberto ? 'Confirmados' : treinando ? 'Treinando' : 'Treinaram'}
            vazio={aberto ? 'Ninguém agendado ainda.' : treinando ? 'Ninguém agendado neste horário.' : 'Ninguém treinou neste horário.'}
            agendados={h.agendados}
            limite={aberto ? h.vagas : null}
            pulso={pulso}
            podeRetirar={h.podeRetirar}
            onTocar={(a) => onTocarNome(a, h)}
          />
        </div>
      </div>

      {aberto && (
        <div className="shrink-0 pt-[var(--folga-m)]">
          <BotaoAgendar h={h} lotado={lotado} regras={regras} onAgendar={() => onAgendar(h)} />
        </div>
      )}
    </article>
  )
}
