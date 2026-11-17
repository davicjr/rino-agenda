// Horário que já passou ou foi bloqueado: uma linha fina, sem ação. No passado mostra quem treinou.
import { Lock } from 'lucide-react'
import type { Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Hora } from './Hora'

export function CardFechado({ horario: h }: { horario: Horario }) {
  const n = h.agendados.length
  return (
    <article
      className={cn('rounded-[var(--radius)] px-4 py-3', h.bloqueio ? 'bg-alerta-3 text-alerta-12' : 'bg-carvao-2/60 text-carvao-9')}
      aria-label={`Treino das ${h.hora}`}
    >
      <div className="flex min-h-8 items-center gap-4">
      <div className="w-[5.25rem]"><Hora hora={h.hora} pequena /></div>
      <p className="font-cond flex flex-1 items-center gap-2 truncate text-sm font-semibold tracking-wider uppercase">
        {h.bloqueio && <Lock className="size-4 shrink-0 text-alerta-11" />}
        {h.bloqueio ?? 'Encerrado'}
      </p>
      {n > 0 && !h.bloqueio && <p className="font-cond text-sm">{n} {n === 1 ? 'treinou' : 'treinaram'}</p>}
      </div>
      {n > 0 && !h.bloqueio && (
        <p className="mt-1 pl-[6.25rem] text-sm leading-snug text-carvao-10">{h.agendados.map((a) => a.nome.split(' ')[0]).join(', ')}</p>
      )}
    </article>
  )
}
