// Quem já está no treino. Tocar no nome abre a retirada.
import type { Agendado } from '@/lib/api'
import { cn } from '@/lib/cn'
import { iniciais } from '@/lib/datas'

type Props = { agendados: Agendado[]; pulso: number; podeRetirar: boolean; onTocar: (a: Agendado) => void }

export function ListaNomes({ agendados, pulso, podeRetirar, onTocar }: Props) {
  const ultimo = agendados[agendados.length - 1]?.id
  return (
    <ul className="relative mt-4 flex flex-wrap gap-1.5">
      {agendados.map((a) => (
        <li key={a.id} className={cn(pulso && a.id === ultimo && 'nome-novo')}>
          <button
            disabled={!podeRetirar}
            onClick={() => onTocar(a)}
            className={cn('flex h-9 items-center gap-1.5 rounded-full bg-carvao-4 pr-3 pl-1 text-sm font-medium text-carvao-12 transition-colors', podeRetirar && 'active:bg-carvao-6')}
          >
            <span className="font-cond grid size-7 place-items-center rounded-full bg-carvao-6 text-xs font-bold">{iniciais(a.nome)}</span>
            {a.nome.split(' ')[0]}
          </button>
        </li>
      ))}
    </ul>
  )
}
