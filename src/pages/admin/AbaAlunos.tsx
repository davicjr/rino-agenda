// Alunos: colar lista de nomes, plano, apelido e ativar/desativar.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAcao } from '@/hooks/useAdmin'
import { admin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Seletor } from '@/ui/Campo'
import { LinhaAluno } from './LinhaAluno'

const K = [['alunos-admin'], ['inicio']]

export function AbaAlunos() {
  const alunos = useQuery({ queryKey: ['alunos-admin'], queryFn: admin.alunos })
  const [texto, setTexto] = useState('')
  const [plano, setPlano] = useState('livre')
  const nomes = texto.split('\n').map((n) => n.trim()).filter((n) => n.length >= 2)
  const criar = useAcao(() => admin.criarAlunos(nomes, plano), K, `${nomes.length} aluno(s) cadastrado(s).`)
  const salvar = useAcao(admin.salvarAluno, K)
  const apagar = useAcao(admin.apagarAluno, K, 'Aluno apagado.')

  return (
    <div className="space-y-6">
      <form className="corte space-y-2 bg-carvao-2 p-4" onSubmit={(e) => { e.preventDefault(); criar.mutate(undefined, { onSuccess: () => setTexto('') }) }}>
        <label htmlFor="nomes" className="font-cond text-sm font-semibold tracking-widest text-carvao-11 uppercase">Cadastrar alunos (um por linha)</label>
        <textarea
          id="nomes"
          rows={4}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={'Islan Sena\nMaria Souza'}
          className="w-full rounded-[var(--radius)] bg-carvao-4 p-3 text-base outline-none placeholder:text-carvao-9 focus:ring-2 focus:ring-sangue-9"
        />
        <div className="flex gap-2">
          <Seletor aria-label="Plano" value={plano} onChange={(e) => setPlano(e.target.value)} className="w-40">
            <option value="livre">Todos os dias</option>
            <option value="3x">3x/semana</option>
            <option value="2x">2x/semana</option>
          </Seletor>
          <Botao className="h-11 flex-1 text-base" disabled={!nomes.length || criar.isPending}>
            Cadastrar {nomes.length > 1 ? nomes.length : ''}
          </Botao>
        </div>
      </form>
      <p className="font-cond text-sm tracking-widest text-carvao-10 uppercase">{alunos.data?.length ?? 0} alunos</p>
      <ul className="space-y-1.5">
        {alunos.data?.map((a) => (
          <LinhaAluno key={`${a.id}-${a.plano}-${a.ativo}`} aluno={a} onSalvar={salvar.mutate} onApagar={() => confirm(`Apagar ${a.nome}? O histórico de agendamentos some junto. Para só esconder, use Desativar.`) && apagar.mutate(a.id)} />
        ))}
      </ul>
    </div>
  )
}
