// Alunos agendados no horário, na agenda do admin, em páginas para a linha não ficar enorme.
import { useState } from 'react'
import { X } from 'lucide-react'
import type { Agendado } from '@/lib/api'
import { paginar } from '@/lib/paginar'
import { Avatar } from '@/ui/Avatar'
import { EtiquetaTipo } from '@/ui/EtiquetaTipo'
import { Paginacao } from '@/ui/Paginacao'

const POR_PAGINA = 6

type Props = { agendados: Agendado[]; onRemover: (agendamentoId: number) => void }

export function AlunosDoHorario({ agendados, onRemover }: Props) {
  const [pedida, setPedida] = useState(1)
  const { pagina, paginas, inicio, fim } = paginar(agendados.length, POR_PAGINA, pedida)
  if (!agendados.length) return <p className="text-sm text-carvao-9">Ninguém agendado.</p>
  return (
    <div>
      <ol className="divide-y divide-carvao-4">
        {agendados.slice(inicio, fim).map((a) => (
          <li key={a.id} className="flex h-14 items-center gap-3">
            <Avatar nome={a.nome} tipo="aluno" id={a.aluno_id ?? 0} foto={a.foto} className="size-10 shrink-0 text-sm" />
            <span className="min-w-0 flex-1 truncate">{a.nome}</span>
            <EtiquetaTipo tipo={a.tipo} />
            <button aria-label={`Remover ${a.nome}`} onClick={() => onRemover(a.id)} className="grid size-11 place-items-center text-carvao-10 active:text-ouro-11">
              <X className="size-5" />
            </button>
          </li>
        ))}
      </ol>
      {paginas > 1 && (
        <div className="mt-2 flex justify-end">
          <Paginacao pagina={pagina} paginas={paginas} onIr={setPedida} />
        </div>
      )}
    </div>
  )
}
