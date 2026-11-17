// Número com botões de menos e mais, para as vagas.
import { Minus, Plus } from 'lucide-react'

export function Contador({ valor, onMudar, min = 1, max = 99, rotulo }: { valor: number; onMudar: (v: number) => void; min?: number; max?: number; rotulo: string }) {
  return (
    <div className="flex h-12 items-center gap-1 rounded-[var(--radius)] bg-carvao-3 p-1" role="group" aria-label={rotulo}>
      <button type="button" aria-label="Menos" onClick={() => onMudar(Math.max(min, valor - 1))} className="grid size-10 place-items-center rounded-[var(--radius-sm)] active:bg-carvao-5"><Minus className="size-5" /></button>
      <span className="font-display w-12 text-center text-2xl tabular-nums">{valor}</span>
      <button type="button" aria-label="Mais" onClick={() => onMudar(Math.min(max, valor + 1))} className="grid size-10 place-items-center rounded-[var(--radius-sm)] active:bg-carvao-5"><Plus className="size-5" /></button>
    </div>
  )
}
