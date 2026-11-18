// Criar ou editar um horário da grade em abas: hora e vagas numa, professor e situação na outra.
import { useState } from 'react'
import type { GradeAdmin } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { AbasGaveta } from '@/ui/AbasGaveta'
import { AcoesForm } from '@/ui/AcoesForm'
import { caixaCampo, Entrada } from '@/ui/Campo'
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
  const horario = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Rotulo htmlFor="hora">Hora</Rotulo>
          <Entrada id="hora" type="time" value={g.hora} onChange={(e) => setG({ ...g, hora: e.target.value })} />
        </div>
        <div>
          <Rotulo htmlFor="vagas">Vagas</Rotulo>
          {g.sem_limite ? (
            <p className={cn(caixaCampo, 'font-semibold text-carvao-10')}>Sem limite</p>
          ) : (
            <Contador id="vagas" rotulo="Vagas" valor={g.vagas} onMudar={(vagas) => setG({ ...g, vagas })} />
          )}
        </div>
      </div>
      <Interruptor rotulo="Sem limite de vagas" ligado={g.sem_limite === 1} onMudar={(v) => setG({ ...g, sem_limite: v ? 1 : 0 })} />
    </div>
  )
  const detalhes = (
    <div className="space-y-4">
      <div>
        <Rotulo htmlFor="prof-padrao">Professor padrão</Rotulo>
        <SeletorProfessor id="prof-padrao" valor={g.professor_id} nenhum="Nenhum" onMudar={(professor_id) => setG({ ...g, professor_id })} />
      </div>
      {g.id && <Interruptor rotulo="Ativo (aparece na agenda)" ligado={g.ativo === 1} onMudar={(v) => setG({ ...g, ativo: v ? 1 : 0 })} />}
    </div>
  )
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSalvar(g) }}>
      <AbasGaveta rotulo="Seções do horário" abas={[{ id: 'horario', rotulo: 'Horário', conteudo: horario }, { id: 'detalhes', rotulo: 'Detalhes', conteudo: detalhes }]} />
      <AcoesForm desabilitado={enviando || !g.hora} onApagar={g.id ? () => onApagar(g.id!) : undefined} />
    </form>
  )
}
