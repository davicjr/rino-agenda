// Ícone que abre o seletor de data nativo do aparelho (sem biblioteca de calendário).
// O input fica invisível por cima do ícone, então o toque já cai nele no celular.
import { useRef } from 'react'
import { CalendarDays } from 'lucide-react'

type Props = { valor: string; min?: string; max?: string; onEscolher: (d: string) => void }

export function BotaoCalendario({ valor, min, max, onEscolher }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <label className="relative grid size-11 shrink-0 place-items-center text-carvao-11 active:text-carvao-12">
      <CalendarDays className="size-5" />
      <span className="sr-only">Escolher data no calendário</span>
      <input
        ref={ref}
        type="date"
        value={valor}
        min={min}
        max={max}
        onClick={() => ref.current?.showPicker?.()}
        onChange={(e) => e.target.value && onEscolher(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  )
}
