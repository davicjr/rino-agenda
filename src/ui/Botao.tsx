import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'forte' | 'contorno' | 'neutro' }

export function Botao({ variante = 'forte', className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        'paralelo font-display h-13 w-full text-lg tracking-wider uppercase transition-transform duration-100 active:scale-[0.98] disabled:opacity-50',
        variante === 'forte' && 'bg-ouro-9 text-preto active:bg-ouro-10',
        variante === 'contorno' && 'bg-ouro-3 text-ouro-12 active:bg-ouro-4',
        variante === 'neutro' && 'bg-carvao-4 text-carvao-12 active:bg-carvao-5',
        className,
      )}
    />
  )
}
