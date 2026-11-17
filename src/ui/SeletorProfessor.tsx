// Select de professor ativo, com uma opção "nenhum" de texto configurável.
import { useProfessores } from '@/hooks/useProfessores'
import { Seletor } from './Campo'

type Props = { id?: string; valor: number | null; nenhum: string; onMudar: (id: number | null) => void; className?: string }

export function SeletorProfessor({ id, valor, nenhum, onMudar, className }: Props) {
  const lista = useProfessores().data?.filter((p) => p.ativo || p.id === valor) ?? []
  return (
    <Seletor id={id} value={valor ?? ''} onChange={(e) => onMudar(e.target.value ? Number(e.target.value) : null)} className={className}>
      <option value="">{nenhum}</option>
      {lista.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
    </Seletor>
  )
}
