// Quem já está no treino. Tocar no nome abre a retirada.
import type { Agendado } from '@/lib/api'
import { cn } from '@/lib/cn'
import { iniciais } from '@/lib/datas'

type Props = { agendados: Agendado[]; meuId: number | null; pulso: number; podeRetirar: boolean; onTocar: (a: Agendado) => void }

export function ListaNomes({ agendados, meuId, pulso, podeRetirar, onTocar }: Props) {
  if (!agendados.length) {
    return <p className="font-cond relative mt-3 text-base text-carvao-9">Ninguém ainda. Abre a roda!</p>
  }
  const ultimo = agendados[agendados.length - 1]?.id
  return (
    <ul className="relative mt-3 flex flex-wrap gap-1.5">
      {agendados.map((a) => {
        const eu = a.aluno_id === meuId
        return (
          <li key={a.id} className={cn(pulso && a.id === ultimo && 'nome-novo')}>
            <button
              disabled={!podeRetirar}
              onClick={() => onTocar(a)}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full pr-3 pl-1 text-sm font-medium transition-colors',
                eu ? 'bg-ouro-4 text-ouro-12' : 'bg-carvao-4 text-carvao-12',
                podeRetirar && 'active:bg-carvao-6',
              )}
            >
              <span className={cn('font-cond grid size-7 place-items-center rounded-full text-xs font-bold', eu ? 'bg-ouro-9 text-preto' : 'bg-carvao-6')}>
                {iniciais(a.nome)}
              </span>
              {a.nome.split(' ')[0]}
              {eu && <span className="font-cond text-xs font-bold tracking-wider text-ouro-11 uppercase">você</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
