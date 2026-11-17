// Lista dos alunos de um horário, com nome inteiro. Tocar abre a retirada (quando ainda dá).
import type { Agendado } from '@/lib/api'
import { cn } from '@/lib/cn'
import { iniciais } from '@/lib/datas'

type Props = { agendados: Agendado[]; pulso: number; podeRetirar: boolean; onTocar: (a: Agendado) => void }

export function ListaAlunos({ agendados, pulso, podeRetirar, onTocar }: Props) {
  const ultimo = agendados[agendados.length - 1]?.id
  return (
    <ol className="divide-y divide-carvao-4">
      {agendados.map((a, i) => (
        <li key={a.id} className={cn(pulso && a.id === ultimo && 'nome-novo')}>
          <button disabled={!podeRetirar} onClick={() => onTocar(a)} className="flex h-13 w-full items-center gap-3 text-left active:bg-carvao-3">
            <span className="font-cond w-5 text-right text-sm text-carvao-8 tabular-nums">{i + 1}</span>
            <span className="font-cond grid size-9 shrink-0 place-items-center rounded-full bg-carvao-5 text-sm font-bold">{iniciais(a.nome)}</span>
            <span className="min-w-0 flex-1 truncate text-base">{a.nome}</span>
            {podeRetirar && <span className="font-cond pr-1 text-xs font-bold tracking-wider text-carvao-9 uppercase">Retirar</span>}
          </button>
        </li>
      ))}
    </ol>
  )
}
