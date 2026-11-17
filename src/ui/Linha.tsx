// Linha de lista tocável: título, detalhe e um elemento à direita.
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = { titulo: ReactNode; detalhe?: ReactNode; direita?: ReactNode; apagada?: boolean; onClick?: () => void }

export function Linha({ titulo, detalhe, direita, apagada, onClick }: Props) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn('flex min-h-16 w-full items-center gap-3 rounded-[var(--radius)] bg-carvao-2 px-4 py-3 text-left active:bg-carvao-3', apagada && 'opacity-50')}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold">{titulo}</span>
          {detalhe && <span className="mt-0.5 block truncate text-sm text-carvao-10">{detalhe}</span>}
        </span>
        {direita}
        <ChevronRight className="size-5 shrink-0 text-carvao-8" />
      </button>
    </li>
  )
}
