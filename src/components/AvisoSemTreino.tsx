// Tela de quando não há treino: motivo no centro do espaço livre, sem caixa em volta.
// Vermelho para bloqueio; neutro para folga e falta de conexão.
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = { icone: LucideIcon; rotulo: string; titulo: string; nota?: string | null; alerta?: boolean }

export function AvisoSemTreino({ icone: Icone, rotulo, titulo, nota, alerta = false }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="animate-surge my-auto flex flex-col items-center px-1 py-3 text-center">
        <span className={cn('paralelo grid h-[clamp(2.75rem,7dvh,3.75rem)] w-[clamp(3.25rem,8dvh,4.5rem)] place-items-center', alerta ? 'bg-alerta-9 text-branco' : 'bg-carvao-4 text-carvao-11')}>
          <Icone aria-hidden className="size-[clamp(1.25rem,3.4dvh,1.875rem)]" />
        </span>
        <p className={cn('font-cond mt-[var(--folga-m)] text-sm font-bold tracking-[0.16em] uppercase', alerta ? 'text-alerta-11' : 'text-carvao-10')}>{rotulo}</p>
        <h2 className={cn('font-display mt-1.5 max-w-full leading-[1.05] tracking-wide text-carvao-12 uppercase [overflow-wrap:anywhere]', titulo.length > 16 ? 'text-[clamp(1.5rem,3.8dvh,2rem)]' : 'text-[clamp(2.25rem,6.4dvh,3.5rem)]')}>{titulo}</h2>
        {nota && (
          <p className={cn('mt-[var(--folga-m)] w-full max-w-[34ch] border-t-2 pt-[var(--folga-m)] leading-relaxed text-carvao-11 [overflow-wrap:anywhere]', alerta ? 'border-alerta-9' : 'border-carvao-5')}>{nota}</p>
        )}
      </div>
    </div>
  )
}
