// Equipe: todas as pessoas da academia. Quem dá aulas aparece na Grade e na Agenda.
import { useState } from 'react'
import { useAcao } from '@/hooks/useAdmin'
import { useProfessores } from '@/hooks/useProfessores'
import { admin, type PessoaForm, type ProfessorAdmin } from '@/lib/apiAdmin'
import { telefoneLegivel } from '@/lib/telefone'
import { Ajuda } from '@/ui/Ajuda'
import { Avatar } from '@/ui/Avatar'
import { BotaoMais } from '@/ui/BotaoMais'
import { Linha } from '@/ui/Linha'
import { GavetaPessoa } from './gavetas/GavetaPessoa'

const K = [['professores'], ['grade-admin'], ['dia'], ['info']]
const NOVA: PessoaForm = { nome: '', funcao: 'Professor', telefone: null, instagram: null, da_aula: 1, ativo: 1 }

export function AbaEquipe() {
  const lista = useProfessores()
  const [alvo, setAlvo] = useState<PessoaForm | null>(null)
  const fechar = { onSuccess: () => setAlvo(null) }
  const total = lista.data?.length ?? 0
  const criar = useAcao(admin.criarPessoa, K, 'Pessoa cadastrada.')
  const salvar = useAcao(admin.salvarPessoa, K, 'Dados salvos.')
  const apagar = useAcao(admin.apagarProfessor, K, 'Pessoa apagada.')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display -skew-x-6 text-3xl leading-none uppercase">{total} {total === 1 ? 'pessoa' : 'pessoas'}</h2>
          <Ajuda assunto="equipe">Quem dá aulas aparece na Grade e na Agenda. Toda a equipe ativa aparece no Suporte.</Ajuda>
        </div>
        <BotaoMais rotulo="Nova pessoa" onClick={() => setAlvo(NOVA)} />
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
      {lista.data && !lista.data.length && <p className="py-8 text-center text-carvao-9">Ninguém na equipe ainda. Toque no + para cadastrar.</p>}
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
