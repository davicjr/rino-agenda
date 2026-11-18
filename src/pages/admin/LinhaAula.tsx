// Um horário na agenda do professor: fechado mostra o resumo; aberto mostra a lista,
// o professor da aula e o bloqueio. A altura anima por grid-template-rows.
import { ChevronDown, Lock, LockOpen, X } from 'lucide-react'
import type { Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { horaCurta } from '@/lib/datas'
import { Rotulo } from '@/ui/Rotulo'
import { SeletorProfessor } from '@/ui/SeletorProfessor'

type Props = {
  h: Horario
  aberta: boolean
  onAlternar: () => void
  onRemover: (agendamentoId: number) => void
  onEscalar: (professorId: number | null) => void
  onBloquear: () => void
  onDesbloquear: (() => void) | null
  /** Falso quando o dia inteiro está bloqueado: a observação já aparece no aviso do dia. */
  mostrarNota: boolean
}

export function LinhaAula({ h, aberta, onAlternar, onRemover, onEscalar, onBloquear, onDesbloquear, mostrarNota }: Props) {
  const lotado = h.agendados.length >= h.vagas
  return (
    <li className={cn('overflow-hidden rounded-[var(--radius-lg)]', h.bloqueio ? 'bg-alerta-3' : 'bg-carvao-2')}>
      <button onClick={onAlternar} aria-expanded={aberta} className={cn('flex min-h-18 w-full items-center gap-4 px-4 py-3 text-left', h.bloqueio ? 'active:bg-alerta-4' : 'active:bg-carvao-3')}>
        <span className="font-display w-14 text-3xl">{horaCurta(h.hora)}</span>
        <span className="min-w-0 flex-1">
          <span className={cn('flex items-center gap-1.5 font-semibold', lotado && 'text-ouro-11', h.bloqueio && 'text-alerta-12')}>
            {h.bloqueio && <Lock className="size-4 shrink-0 text-alerta-11" />}
            <span className="truncate">{h.bloqueio ? `Bloqueado · ${h.bloqueio}` : `${h.agendados.length} de ${h.vagas}${lotado ? ' · lotado' : ''}`}</span>
          </span>
          <span className="block truncate text-sm text-carvao-10">{h.professor ? `Prof. ${h.professor.nome}` : 'Sem professor definido'}</span>
        </span>
        <ChevronDown className={cn('size-5 text-carvao-9 transition-transform duration-300', aberta && 'rotate-180')} />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-300 ease-[var(--ease-saida)]', aberta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="min-h-0">
          <div className={cn('space-y-4 border-t px-4 pt-4 pb-4', h.bloqueio ? 'border-alerta-4' : 'border-carvao-4')}>
            {mostrarNota && h.bloqueioNota && <p className="text-sm text-alerta-12 [overflow-wrap:anywhere]">{h.bloqueioNota}</p>}
            <div>
              <Rotulo htmlFor={`prof-${h.id}`}>Professor desta aula</Rotulo>
              <SeletorProfessor id={`prof-${h.id}`} valor={h.professorHorarioId} nenhum="Igual ao do dia" onMudar={onEscalar} className="w-full" />
            </div>
            <div>
              <Rotulo>Alunos ({h.agendados.length})</Rotulo>
              {h.agendados.length ? (
                <ol className="divide-y divide-carvao-4">
                  {h.agendados.map((a, i) => (
                    <li key={a.id} className="flex h-12 items-center gap-3">
                      <span className="font-cond w-5 text-sm text-carvao-9">{i + 1}</span>
                      <span className="flex-1 truncate">{a.nome}</span>
                      <button aria-label={`Remover ${a.nome}`} onClick={() => onRemover(a.id)} className="grid size-11 place-items-center text-carvao-10 active:text-ouro-11">
                        <X className="size-5" />
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-carvao-9">Ninguém agendado.</p>
              )}
            </div>
            {onDesbloquear ? (
              <button onClick={onDesbloquear} className="flex h-11 items-center gap-2 text-sm font-semibold text-alerta-12"><LockOpen className="size-4" /> Desbloquear horário</button>
            ) : !h.bloqueio && (
              <button onClick={onBloquear} className="flex h-11 items-center gap-2 text-sm font-semibold text-carvao-11"><Lock className="size-4" /> Bloquear horário</button>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
