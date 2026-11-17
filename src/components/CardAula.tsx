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
        <p className="font-display flex items-center gap-2 text-2xl text-alerta-12 uppercase"><Lock className="size-5 text-alerta-11" /> {h.bloqueio}</p>
        <p className="mt-1 text-alerta-11">Não tem treino neste horário.</p>
      </article>
    )
  }

  return (
    <article ref={raiz} className="corte relative flex min-h-0 flex-1 flex-col overflow-hidden bg-carvao-2" aria-label={`Treino das ${h.hora}`}>
      <span className="flash pointer-events-none absolute inset-0 bg-ouro-9 opacity-0" />
      <div className="relative shrink-0 p-4">
        {(lotado && aberto) || !aberto ? (
          <div className="mb-4">
            {lotado && aberto ? <Carimbo /> : <span className="paralelo font-cond inline-block bg-carvao-4 px-4 py-1.5 text-xs font-bold tracking-widest text-carvao-10 uppercase">Encerrado</span>}
          </div>
        ) : null}
        {h.professor && (
          <p className="flex items-center gap-2.5">
            <Avatar nome={h.professor.nome} tipo="professor" id={h.professor.id} foto={h.professor.foto} destaque className="size-8 text-xs" />
            <span className="font-cond text-sm font-bold tracking-wider text-carvao-9 uppercase">Prof.</span>
            <span className="font-semibold">{h.professor.nome}</span>
          </p>
        )}
        {aberto && <div className={h.professor ? 'mt-3' : ''}><MedidorVagas ocupadas={n} vagas={h.vagas} /></div>}
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-carvao-4 px-4 pt-3 pb-3 [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]">
        <p className="font-cond mb-1 text-xs font-bold tracking-[0.16em] text-carvao-9 uppercase">
          {aberto ? `Confirmados · ${n}` : `Treinaram · ${n}`}
        </p>
        {n ? (
          <ListaAlunos agendados={h.agendados} pulso={pulso} podeRetirar={h.podeRetirar} onTocar={(a) => onTocarNome(a, h)} />
        ) : (
          <p className="py-4 text-carvao-9">{aberto ? 'Ninguém agendado ainda.' : 'Ninguém treinou neste horário.'}</p>
        )}
      </div>

      {aberto && (
        <div className="relative shrink-0 p-4 pt-3">
          <BotaoAgendar h={h} lotado={lotado} regras={regras} onAgendar={() => onAgendar(h)} />
        </div>
      )}
    </article>
  )
}
