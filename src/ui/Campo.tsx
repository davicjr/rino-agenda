// Padrão único dos campos de formulário: mesma altura, cor, cantos, preenchimento e foco.
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const superficie = 'rounded-[var(--radius)] bg-carvao-3 text-base text-carvao-12 outline-none placeholder:text-carvao-9'
const campo = `${superficie} h-12 w-full px-4 focus:ring-2 focus:ring-ouro-9`

/** Para campo composto (ícone + input, contador): aplique na caixa e deixe o input transparente. */
export const caixaCampo = `${superficie} flex h-12 w-full shrink-0 items-center gap-3 px-4 focus-within:ring-2 focus-within:ring-ouro-9`

export const Entrada = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(campo, className)} />
export const Seletor = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(campo, 'campo-seletor', className)} />
export const AreaTexto = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={cn(superficie, 'block w-full resize-none p-4 leading-snug focus:ring-2 focus:ring-ouro-9', className)} />
)
