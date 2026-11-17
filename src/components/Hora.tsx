// Hora do treino: número grande e o "h" (ou os minutos) pequeno na mesma linha de base.
import { cn } from '@/lib/cn'

export function Hora({ hora, pequena = false }: { hora: string; pequena?: boolean }) {
  const [hh, mm] = hora.split(':')
  return (
    <p className={cn('font-display origin-bottom-left -skew-x-6 leading-none tracking-tight', pequena ? 'text-2xl' : 'text-[3.5rem]')} aria-label={hora}>
      {hh}
      <span className={cn('text-carvao-9', pequena ? 'text-base' : 'text-2xl')}>{mm === '00' ? 'h' : `:${mm}`}</span>
    </p>
  )
}
