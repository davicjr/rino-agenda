// Uma linha editável de aluno.
import { Trash2 } from 'lucide-react'
import type { AlunoAdmin } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { Entrada, Seletor } from '@/ui/Campo'

type Props = { aluno: AlunoAdmin; onSalvar: (a: AlunoAdmin) => void; onApagar: () => void }

export function LinhaAluno({ aluno: a, onSalvar, onApagar }: Props) {
  const salvar = (mudou: Partial<AlunoAdmin>) => onSalvar({ ...a, ...mudou })
  return (
    <li className={cn('rounded-[var(--radius)] bg-carvao-2 p-2', !a.ativo && 'opacity-50')}>
      <div className="flex gap-2">
        <Entrada aria-label="Nome" defaultValue={a.nome} className="min-w-0 flex-1" onBlur={(e) => e.target.value.trim() !== a.nome && salvar({ nome: e.target.value })} />
        <button onClick={onApagar} aria-label={`Apagar ${a.nome}`} className="grid size-11 place-items-center text-sangue-11"><Trash2 className="size-5" /></button>
      </div>
      <div className="mt-1.5 flex gap-2">
        <Entrada aria-label="Apelido" placeholder="Apelido (opcional)" defaultValue={a.apelido ?? ''} className="min-w-0 flex-1" onBlur={(e) => e.target.value !== (a.apelido ?? '') && salvar({ apelido: e.target.value })} />
        <Seletor aria-label="Plano" value={a.plano} onChange={(e) => salvar({ plano: e.target.value as AlunoAdmin['plano'] })} className="w-28">
          <option value="livre">Livre</option>
          <option value="3x">3x</option>
          <option value="2x">2x</option>
        </Seletor>
        <button onClick={() => salvar({ ativo: a.ativo ? 0 : 1 })} className="h-11 px-2 text-sm font-semibold text-carvao-11">
          {a.ativo ? 'Desativar' : 'Ativar'}
        </button>
      </div>
    </li>
  )
}
