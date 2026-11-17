// Criar ou editar um horário da grade: hora, vagas, professor padrão, pausar e apagar.
import { useState } from 'react'
import type { GradeAdmin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Contador } from '@/ui/Contador'
import { Gaveta } from '@/ui/Gaveta'
import { Interruptor } from '@/ui/Interruptor'
import { Rotulo } from '@/ui/Rotulo'
import { SeletorProfessor } from '@/ui/SeletorProfessor'

export type Rascunho = Omit<GradeAdmin, 'id'> & { id?: number }
type Props = { alvo: Rascunho | null; nomeDia: string; enviando: boolean; onFechar: () => void; onSalvar: (g: Rascunho) => void; onApagar: (id: number) => void }

export function GavetaHorario({ alvo, nomeDia, enviando, onFechar, onSalvar, onApagar }: Props) {
  return (
    <Gaveta aberta={!!alvo} onFechar={onFechar} titulo={alvo?.id ? 'Editar horário' : 'Novo horário'} descricao={nomeDia}>
      {alvo && <Formulario key={alvo.id ?? 'novo'} alvo={alvo} enviando={enviando} onSalvar={onSalvar} onApagar={onApagar} />}
    </Gaveta>
  )
}

function Formulario({ alvo, enviando, onSalvar, onApagar }: { alvo: Rascunho; enviando: boolean; onSalvar: (g: Rascunho) => void; onApagar: (id: number) => void }) {
  const [g, setG] = useState(alvo)
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSalvar(g) }}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Rotulo htmlFor="hora">Hora</Rotulo>
          <Entrada id="hora" type="time" required value={g.hora} onChange={(e) => setG({ ...g, hora: e.target.value })} className="h-12 w-full" />
        </div>
        <div>
          <Rotulo>Vagas</Rotulo>
          <Contador rotulo="Vagas" valor={g.vagas} onMudar={(vagas) => setG({ ...g, vagas })} />
        </div>
      </div>
      <div>
        <Rotulo htmlFor="prof-padrao">Professor padrão</Rotulo>
        <SeletorProfessor id="prof-padrao" valor={g.professor_id} nenhum="Nenhum" onMudar={(professor_id) => setG({ ...g, professor_id })} className="h-12 w-full" />
      </div>
      {g.id && (
        <Interruptor rotulo="Ativo (aparece na agenda)" ligado={g.ativo === 1} onMudar={(v) => setG({ ...g, ativo: v ? 1 : 0 })} />
      )}
      <div className="space-y-2">
        <Botao disabled={enviando}>Salvar</Botao>
        {g.id && <Botao type="button" variante="neutro" onClick={() => onApagar(g.id!)}>Apagar horário</Botao>}
      </div>
    </form>
  )
}
