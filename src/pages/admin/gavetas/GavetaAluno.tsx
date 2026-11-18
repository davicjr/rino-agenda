// Editar um aluno em abas: dados e plano numa, foto na outra.
import { useState } from 'react'
import type { AlunoAdmin } from '@/lib/apiAdmin'
import { PLANOS } from '@/lib/planos'
import { AbasGaveta } from '@/ui/AbasGaveta'
import { AcoesForm } from '@/ui/AcoesForm'
import { Entrada } from '@/ui/Campo'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Interruptor } from '@/ui/Interruptor'
import { Rotulo } from '@/ui/Rotulo'
import { EditorFoto } from './EditorFoto'

type Props = { aluno: AlunoAdmin | null; onFechar: () => void; onSalvar: (a: AlunoAdmin) => void; onApagar: (a: AlunoAdmin) => void }

export function GavetaAluno({ aluno, onFechar, onSalvar, onApagar }: Props) {
  return (
    <Gaveta aberta={!!aluno} onFechar={onFechar} titulo="Aluno">
      {aluno && <Formulario key={aluno.id} aluno={aluno} onSalvar={onSalvar} onApagar={onApagar} />}
    </Gaveta>
  )
}

function Formulario({ aluno, onSalvar, onApagar }: { aluno: AlunoAdmin; onSalvar: (a: AlunoAdmin) => void; onApagar: (a: AlunoAdmin) => void }) {
  const [a, setA] = useState(aluno)
  const dados = (
    <div className="space-y-4 [@media(max-height:620px)]:space-y-2">
      <div>
        <Rotulo htmlFor="nome">Nome</Rotulo>
        <Entrada id="nome" value={a.nome} onChange={(e) => setA({ ...a, nome: e.target.value })} />
      </div>
      <div>
        <Rotulo htmlFor="apelido">Apelido (aparece na agenda)</Rotulo>
        <Entrada id="apelido" value={a.apelido ?? ''} placeholder="Opcional" onChange={(e) => setA({ ...a, apelido: e.target.value })} />
      </div>
      <div>
        <Rotulo>Plano</Rotulo>
        <Chips rotulo="Plano" opcoes={PLANOS.map((p) => ({ valor: p.valor, rotulo: p.rotulo }))} valor={a.plano} onMudar={(plano) => setA({ ...a, plano })} />
      </div>
      <Interruptor rotulo="Ativo (aparece para agendar)" ligado={a.ativo === 1} onMudar={(v) => setA({ ...a, ativo: v ? 1 : 0 })} />
    </div>
  )
  const foto = <EditorFoto tipo="aluno" id={a.id} nome={a.nome} foto={a.foto} onMudou={(f) => setA({ ...a, foto: f })} />
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSalvar(a) }}>
      <AbasGaveta rotulo="Seções do aluno" abas={[{ id: 'dados', rotulo: 'Dados', conteudo: dados }, { id: 'foto', rotulo: 'Foto', conteudo: foto }]} />
      <AcoesForm desabilitado={a.nome.trim().length < 2} onApagar={() => onApagar(aluno)} />
    </form>
  )
}
