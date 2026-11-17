import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const base = 'h-11 rounded-[var(--radius)] bg-carvao-4 px-3 text-base text-carvao-12 outline-none placeholder:text-carvao-9 focus:ring-2 focus:ring-ouro-9'

export const Entrada = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(base, className)} />
export const Seletor = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(base, className)} />
