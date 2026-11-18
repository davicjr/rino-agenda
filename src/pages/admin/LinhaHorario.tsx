// Horário na Grade: hora à esquerda e as vagas no mesmo estilo da agenda (número em destaque e barra).
import { ChevronRight } from 'lucide-react'
import type { GradeAdmin } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'

const SEGMENTOS_MAX = 30

type Props = { g: GradeAdmin; professor?: string; onClick: () => void }

export function LinhaHorario({ g, professor, onClick }: Props) {
  const complemento = [professor && `Prof. ${professor}`, !g.ativo && 'pausado'].filter(Boolean).join(' · ')
  return (
    <li>
      <button onClick={onClick} className={cn('flex min-h-20 w-full items-center gap-3 rounded-[var(--radius)] bg-carvao-2 px-4 py-3 text-left active:bg-carvao-3', !g.ativo && 'opacity-50')}>
        <span className="font-display w-[4.5rem] shrink-0 text-2xl tracking-wide">{g.hora}</span>
        <span className="min-w-0 flex-1">
          <span className="font-cond flex items-baseline gap-1.5 text-sm font-bold tracking-wide text-carvao-11 uppercase">
            {g.sem_limite ? (
              <><span className="font-display text-2xl leading-none text-ouro-9">Livre</span> sem limite</>
            ) : (
              <><span className="font-display text-2xl leading-none text-ouro-9 tabular-nums">{g.vagas}</span> {g.vagas === 1 ? 'vaga' : 'vagas'}</>
            )}
          </span>
          {!g.sem_limite && (
            <span aria-hidden className="mt-1.5 flex gap-[3px] px-0.5">
              {Array.from({ length: Math.min(g.vagas, SEGMENTOS_MAX) }, (_, i) => <span key={i} className="h-2 flex-1 -skew-x-[20deg] bg-ouro-9" />)}
            </span>
          )}
          {complemento && <span className="mt-1 block truncate text-sm text-carvao-10">{complemento}</span>}
        </span>
        <ChevronRight className="size-5 shrink-0 text-carvao-8" />
      </button>
    </li>
  )
}
