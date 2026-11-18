// Símbolo oficial de uma marca (simple-icons, CC0), na cor do texto ao redor.
import type { SimpleIcon } from 'simple-icons'
import { cn } from '@/lib/cn'

export function IconeMarca({ icone, className }: { icone: SimpleIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className={cn('shrink-0', className)}>
      <path d={icone.path} />
    </svg>
  )
}
