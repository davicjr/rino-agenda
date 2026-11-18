// Padrão único dos campos de formulário: paralelogramo com a mesma altura, cor e contorno de foco.
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const miolo = 'w-full bg-transparent text-base text-carvao-12 outline-none placeholder:text-carvao-9 focus-visible:outline-none'

/** Para campo composto (ícone + input, contador): aplique na caixa e deixe o input transparente. */
export const caixaCampo = 'losango flex h-12 w-full shrink-0 items-center gap-3 px-4 text-base text-carvao-12'

export const Entrada = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => (
  <span className={cn('losango block h-12 w-full', className)}><input {...p} className={cn(miolo, 'h-full px-4')} /></span>
)
export const Seletor = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <span className={cn('losango block h-12 w-full', className)}><select {...p} className={cn(miolo, 'campo-seletor h-full pl-4')}>{children}</select></span>
)
export const AreaTexto = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <span className={cn('losango block w-full', className)}><textarea {...p} className={cn(miolo, 'block resize-none p-4 leading-snug')} /></span>
)
