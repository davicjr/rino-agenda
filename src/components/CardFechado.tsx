// Horário que já passou ou foi bloqueado: uma linha fina, sem ação.
import { Lock } from 'lucide-react'
import type { Horario } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Hora } from './Hora'

export function CardFechado({ horario: h }: { horario: Horario }) {
  const n = h.agendados.length
  return (
    <article
      className={cn('flex h-14 items-center gap-4 rounded-[var(--radius)] px-4', h.bloqueio ? 'bg-alerta-3 text-alerta-12' : 'bg-carvao-2/60 text-carvao-9')}
      aria-label={`Treino das ${h.hora}`}
    >
      <div className="w-[5.25rem]"><Hora hora={h.hora} pequena /></div>
      <p className="font-cond flex flex-1 items-center gap-2 truncate text-sm font-semibold tracking-wider uppercase">
        {h.bloqueio && <Lock className="size-4 shrink-0 text-alerta-11" />}
        {h.bloqueio ?? 'Encerrado'}
      </p>
      {n > 0 && !h.bloqueio && <p className="font-cond text-sm">{n} treinaram</p>}
    </article>
  )
}
