// Equipe: todas as pessoas da academia. Quem dá aulas aparece na Grade e na Agenda.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { useProfessores } from '@/hooks/useProfessores'
import { admin, type PessoaForm, type ProfessorAdmin } from '@/lib/apiAdmin'
import { telefoneLegivel } from '@/lib/telefone'
import { Avatar } from '@/ui/Avatar'
import { Linha } from '@/ui/Linha'
import { GavetaPessoa } from './gavetas/GavetaPessoa'

const K = [['professores'], ['grade-admin'], ['dia'], ['info']]
const NOVA: PessoaForm = { nome: '', funcao: 'Professor', telefone: null, instagram: null, da_aula: 1, ativo: 1 }

export function AbaEquipe() {
  const lista = useProfessores()
  const [alvo, setAlvo] = useState<PessoaForm | null>(null)
  const fechar = { onSuccess: () => setAlvo(null) }
  const criar = useAcao(admin.criarPessoa, K, 'Pessoa cadastrada.')
  const salvar = useAcao(admin.salvarPessoa, K, 'Dados salvos.')
  const apagar = useAcao(admin.apagarProfessor, K, 'Pessoa apagada.')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-carvao-10">Quem dá aulas aparece na Grade e na Agenda. Toda a equipe ativa aparece no Suporte.</p>
        <button onClick={() => setAlvo(NOVA)} className="paralelo font-display flex h-11 shrink-0 items-center gap-1.5 bg-ouro-9 px-4 tracking-wider text-preto uppercase active:bg-ouro-10">
          <Plus className="size-5" /> Novo
        </button>
      </div>
      <ul className="space-y-2">
        {lista.data?.map((p) => (
          <Linha
            key={p.id}
            titulo={p.nome}
            esquerda={<Avatar nome={p.nome} tipo="professor" id={p.id} foto={p.foto} destaque className="size-11 text-sm" />}
            detalhe={[p.funcao, p.telefone && telefoneLegivel(p.telefone), !p.ativo && 'inativo'].filter(Boolean).join(' · ')}
            apagada={!p.ativo}
            onClick={() => setAlvo(p)}
          />
        ))}
      </ul>
      {lista.data && !lista.data.length && <p className="py-8 text-center text-carvao-9">Ninguém na equipe ainda. Toque em + Novo.</p>}
      <GavetaPessoa
        alvo={alvo}
        enviando={criar.isPending || salvar.isPending}
        onFechar={() => setAlvo(null)}
        onSalvar={(p) => (p.id ? salvar.mutate(p, fechar) : criar.mutate(p, fechar))}
        onApagar={(p: ProfessorAdmin) => confirm(`Apagar ${p.nome}? As escalas dessa pessoa somem e os horários ficam sem professor padrão.`) && apagar.mutate(p.id, fechar)}
      />
    </div>
  )
}
