// Criar ou editar um professor.
import { useState } from 'react'
import type { ProfessorAdmin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Gaveta } from '@/ui/Gaveta'
import { Interruptor } from '@/ui/Interruptor'
import { Rotulo } from '@/ui/Rotulo'
import { EditorFoto } from './EditorFoto'

type Alvo = { id?: number; nome: string; ativo: number; foto?: number | null }
type Props = { alvo: Alvo | null; enviando: boolean; onFechar: () => void; onSalvar: (p: Alvo) => void; onApagar: (p: ProfessorAdmin) => void }

export function GavetaProfessor({ alvo, enviando, onFechar, onSalvar, onApagar }: Props) {
  return (
    <Gaveta aberta={!!alvo} onFechar={onFechar} titulo={alvo?.id ? 'Professor' : 'Novo professor'}>
      {alvo && <Formulario key={alvo.id ?? 'novo'} alvo={alvo} enviando={enviando} onSalvar={onSalvar} onApagar={onApagar} />}
    </Gaveta>
  )
}

function Formulario({ alvo, enviando, onSalvar, onApagar }: { alvo: Alvo; enviando: boolean; onSalvar: (p: Alvo) => void; onApagar: (p: ProfessorAdmin) => void }) {
  const [p, setP] = useState(alvo)
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSalvar(p) }}>
      {p.id && <EditorFoto tipo="professor" id={p.id} nome={p.nome} foto={p.foto ?? null} onMudou={(foto) => setP({ ...p, foto })} />}
      <div>
        <Rotulo htmlFor="nome-prof">Nome</Rotulo>
        <Entrada id="nome-prof" autoFocus={!p.id} value={p.nome} onChange={(e) => setP({ ...p, nome: e.target.value })} />
      </div>
      {p.id && (
        <Interruptor rotulo="Ativo" ligado={p.ativo === 1} onMudar={(v) => setP({ ...p, ativo: v ? 1 : 0 })} />
      )}
      <div className="space-y-2">
        <Botao disabled={enviando || p.nome.trim().length < 2}>Salvar</Botao>
        {p.id && <Botao type="button" variante="neutro" onClick={() => onApagar(p as ProfessorAdmin)}>Apagar professor</Botao>}
      </div>
    </form>
  )
}
