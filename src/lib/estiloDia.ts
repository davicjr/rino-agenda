// Visual do chip de dia, igual na semana e no calendário do mês.
import { cn } from './cn'

export type EstadoDia = { sel: boolean; bloq: boolean; tem: boolean; passado: boolean }

export const estiloDia = ({ sel, bloq, tem, passado }: EstadoDia) =>
  cn(
    'paralelo relative flex flex-col items-center justify-center transition-colors duration-300 disabled:opacity-25',
    sel ? 'bg-ouro-9 text-preto' : bloq ? 'bg-alerta-3 text-alerta-11 active:bg-alerta-4' : tem ? 'bg-carvao-3 text-carvao-12 active:bg-carvao-4' : 'bg-carvao-2 text-carvao-8',
    passado && !sel && 'opacity-60',
  )

export const estiloNumero = ({ sel, bloq, tem }: EstadoDia) => cn('font-display leading-tight', !tem && !bloq && !sel && 'line-through decoration-2')
