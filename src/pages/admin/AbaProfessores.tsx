// Professores: lista e edição numa gaveta. Quem dá cada aula se define na Grade e na Agenda.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { useProfessores } from '@/hooks/useProfessores'
import { admin, type ProfessorAdmin } from '@/lib/apiAdmin'
import { Avatar } from '@/ui/Avatar'
import { Linha } from '@/ui/Linha'
import { GavetaProfessor } from './gavetas/GavetaProfessor'

const K = [['professores'], ['grade-admin'], ['dia']]

export function AbaProfessores() {
  const lista = useProfessores()
  const [alvo, setAlvo] = useState<{ id?: number; nome: string; ativo: number; foto?: number | null } | null>(null)
  const fechar = { onSuccess: () => setAlvo(null) }
  const criar = useAcao(admin.criarProfessor, K, 'Professor cadastrado.')
  const salvar = useAcao(admin.salvarProfessor, K, 'Professor salvo.')
  const apagar = useAcao(admin.apagarProfessor, K, 'Professor apagado.')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="max-w-[16rem] text-sm text-carvao-10">Defina o professor padrão de cada horário na Grade e troque por dia na Agenda.</p>
        <button onClick={() => setAlvo({ nome: '', ativo: 1 })} className="paralelo font-display flex h-11 items-center gap-1.5 bg-ouro-9 px-4 tracking-wider text-preto uppercase active:bg-ouro-10">
          <Plus className="size-5" /> Novo
        </button>
      </div>
      <ul className="space-y-2">
        {lista.data?.map((p) => <Linha key={p.id} titulo={p.nome} esquerda={<Avatar nome={p.nome} tipo="professor" id={p.id} foto={p.foto} destaque className="size-11 text-sm" />} detalhe={p.ativo ? undefined : 'inativo'} apagada={!p.ativo} onClick={() => setAlvo(p)} />)}
      </ul>
      {lista.data && !lista.data.length && <p className="py-8 text-center text-carvao-9">Nenhum professor ainda. Toque em + Novo.</p>}
      <GavetaProfessor
        alvo={alvo}
        enviando={criar.isPending || salvar.isPending}
        onFechar={() => setAlvo(null)}
        onSalvar={(p) => (p.id ? salvar.mutate(p as ProfessorAdmin, fechar) : criar.mutate(p.nome, fechar))}
        onApagar={(p: ProfessorAdmin) => confirm(`Apagar ${p.nome}? As escalas dele somem e os horários ficam sem professor padrão.`) && apagar.mutate(p.id, fechar)}
      />
    </div>
  )
}
