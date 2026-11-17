// Horário que já passou ou foi bloqueado: uma linha fina, sem ação.
import type { Horario } from '@/lib/api'
import { Hora } from './Hora'

export function CardFechado({ horario: h }: { horario: Horario }) {
  const n = h.agendados.length
  return (
    <article className="flex h-14 items-center gap-4 rounded-[var(--radius)] bg-carvao-2/60 px-4 text-carvao-9" aria-label={`Treino das ${h.hora}`}>
      <div className="w-[5rem]"><Hora hora={h.hora} pequena /></div>
      <p className="font-cond flex-1 truncate text-sm font-semibold tracking-wider uppercase">{h.bloqueio ?? 'Encerrado'}</p>
      {n > 0 && !h.bloqueio && <p className="font-cond text-sm">{n} treinaram</p>}
    </article>
  )
}
