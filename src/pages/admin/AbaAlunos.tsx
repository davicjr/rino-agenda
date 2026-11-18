// Alunos: busca, filtro por situação e edição numa gaveta.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { admin, type AlunoAdmin } from '@/lib/apiAdmin'
import { PLANOS } from '@/lib/planos'
import { cn } from '@/lib/cn'
import { Avatar } from '@/ui/Avatar'
import { caixaCampo } from '@/ui/Campo'
import { Chips } from '@/ui/Chips'
import { Linha } from '@/ui/Linha'
import { GavetaAluno } from './gavetas/GavetaAluno'
import { GavetaNovosAlunos } from './gavetas/GavetaNovosAlunos'

const K = [['alunos-admin'], ['inicio']]
const sem = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function AbaAlunos() {
  const alunos = useQuery({ queryKey: ['alunos-admin'], queryFn: admin.alunos })
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'ativos' | 'inativos'>('ativos')
  const [novo, setNovo] = useState(false)
  const [editando, setEditando] = useState<AlunoAdmin | null>(null)
  const criar = useAcao((v: { nomes: string[]; plano: string }) => admin.criarAlunos(v.nomes, v.plano), K, 'Alunos cadastrados.')
  const salvar = useAcao(admin.salvarAluno, K, 'Aluno salvo.')
  const apagar = useAcao(admin.apagarAluno, K, 'Aluno apagado.')

  const lista = (alunos.data ?? [])
    .filter((a) => (filtro === 'ativos' ? a.ativo : !a.ativo))
    .filter((a) => sem(`${a.nome} ${a.apelido ?? ''}`).includes(sem(busca)))
  const inativos = alunos.data?.filter((a) => !a.ativo).length ?? 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className={cn(caixaCampo, 'min-w-0 flex-1')}>
          <Search className="size-5 text-carvao-9" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno" className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-carvao-9 focus-visible:outline-none" />
        </label>
        <button onClick={() => setNovo(true)} aria-label="Novos alunos" className="paralelo grid h-12 w-14 place-items-center bg-ouro-9 text-preto active:bg-ouro-10"><Plus className="size-6" /></button>
      </div>
      <Chips
        rotulo="Situação"
        opcoes={[{ valor: 'ativos', rotulo: `Ativos · ${(alunos.data?.length ?? 0) - inativos}` }, { valor: 'inativos', rotulo: `Inativos · ${inativos}` }]}
        valor={filtro}
        onMudar={setFiltro}
      />
      <ul className="space-y-2">
        {lista.map((a) => (
          <Linha
            key={a.id}
            titulo={a.nome}
            esquerda={<Avatar nome={a.nome} tipo="aluno" id={a.id} foto={a.foto} className="size-11 text-sm" />}
            detalhe={[PLANOS.find((p) => p.valor === a.plano)?.rotulo, a.apelido && `"${a.apelido}"`].filter(Boolean).join(' · ')}
            apagada={!a.ativo}
            onClick={() => setEditando(a)}
          />
        ))}
      </ul>
      {alunos.data && !lista.length && <p className="py-8 text-center text-carvao-9">{busca ? 'Nenhum aluno com esse nome.' : 'Nenhum aluno aqui ainda. Toque no + para cadastrar.'}</p>}

      <GavetaNovosAlunos aberta={novo} enviando={criar.isPending} onFechar={() => setNovo(false)} onConfirmar={(nomes, plano) => criar.mutate({ nomes, plano }, { onSuccess: () => setNovo(false) })} />
      <GavetaAluno
        aluno={editando}
        onFechar={() => setEditando(null)}
        onSalvar={(a) => salvar.mutate(a, { onSuccess: () => setEditando(null) })}
        onApagar={(a) => confirm(`Apagar ${a.nome}? Os agendamentos dele somem junto. Para só esconder, desmarque "Ativo".`) && apagar.mutate(a.id, { onSuccess: () => setEditando(null) })}
      />
    </div>
  )
}
