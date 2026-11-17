// Hora do treino: número grande e o "h" (ou os minutos) menor, separados e na mesma linha de base.
import { cn } from '@/lib/cn'

export function Hora({ hora, pequena = false }: { hora: string; pequena?: boolean }) {
  const [hh, mm] = hora.split(':')
  return (
    <p className="flex items-baseline gap-1 leading-none" aria-label={hora}>
      <span className={cn('font-display origin-bottom-left -skew-x-6', pequena ? 'text-2xl' : 'text-[3.25rem]')}>{hh}</span>
      <span className={cn('font-cond font-bold text-carvao-9', pequena ? 'text-sm' : 'text-lg')}>{mm === '00' ? 'h' : `:${mm}`}</span>
    </p>
  )
}
