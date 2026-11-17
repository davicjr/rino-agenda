// Criar ou editar um professor.
import { useState } from 'react'
import type { ProfessorAdmin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

type Alvo = { id?: number; nome: string; ativo: number }
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
      <div>
        <Rotulo htmlFor="nome-prof">Nome</Rotulo>
        <Entrada id="nome-prof" autoFocus={!p.id} value={p.nome} onChange={(e) => setP({ ...p, nome: e.target.value })} className="h-12 w-full" />
      </div>
      {p.id && (
        <label className="flex h-12 items-center justify-between rounded-[var(--radius)] bg-carvao-3 px-4">
          <span className="font-semibold">Ativo</span>
          <input type="checkbox" checked={p.ativo === 1} onChange={(e) => setP({ ...p, ativo: e.target.checked ? 1 : 0 })} className="size-5 accent-[var(--color-ouro-9)]" />
        </label>
      )}
      <div className="space-y-2">
        <Botao disabled={enviando || p.nome.trim().length < 2}>Salvar</Botao>
        {p.id && <Botao type="button" variante="neutro" onClick={() => onApagar(p as ProfessorAdmin)}>Apagar professor</Botao>}
      </div>
    </form>
  )
}
