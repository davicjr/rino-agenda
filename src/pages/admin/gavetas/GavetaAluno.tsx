// Editar um aluno: nome, apelido, plano, ativo e apagar.
import { useState } from 'react'
import type { AlunoAdmin } from '@/lib/apiAdmin'
import { PLANOS } from '@/lib/planos'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

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
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSalvar(a) }}>
      <div>
        <Rotulo htmlFor="nome">Nome</Rotulo>
        <Entrada id="nome" value={a.nome} onChange={(e) => setA({ ...a, nome: e.target.value })} className="w-full" />
      </div>
      <div>
        <Rotulo htmlFor="apelido">Apelido (aparece na agenda)</Rotulo>
        <Entrada id="apelido" value={a.apelido ?? ''} placeholder="Opcional" onChange={(e) => setA({ ...a, apelido: e.target.value })} className="w-full" />
      </div>
      <div>
        <Rotulo>Plano</Rotulo>
        <Chips rotulo="Plano" opcoes={PLANOS.map((p) => ({ valor: p.valor, rotulo: p.rotulo }))} valor={a.plano} onMudar={(plano) => setA({ ...a, plano })} />
      </div>
      <label className="flex h-12 items-center justify-between rounded-[var(--radius)] bg-carvao-3 px-4">
        <span className="font-semibold">Ativo (aparece para agendar)</span>
        <input type="checkbox" checked={a.ativo === 1} onChange={(e) => setA({ ...a, ativo: e.target.checked ? 1 : 0 })} className="size-5 accent-[var(--color-ouro-9)]" />
      </label>
      <div className="space-y-2">
        <Botao>Salvar</Botao>
        <Botao type="button" variante="neutro" onClick={() => onApagar(aluno)}>Apagar aluno</Botao>
      </div>
    </form>
  )
}
