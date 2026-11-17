// Grade semanal: horários por dia, com vagas e liga/desliga.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { admin, type GradeAdmin } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { Botao } from '@/ui/Botao'
import { Entrada, Seletor } from '@/ui/Campo'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const ORDEM = [1, 2, 3, 4, 5, 6, 0]
const K = [['grade-admin'], ['inicio']]

export function AbaGrade() {
  const grade = useQuery({ queryKey: ['grade-admin'], queryFn: admin.grade })
  const criar = useAcao((v: { d: number; h: string; v: number }) => admin.criarHorario(v.d, v.h, v.v), K, 'Horário criado.')
  const salvar = useAcao(admin.salvarHorario, K)
  const apagar = useAcao(admin.apagarHorario, K, 'Horário removido.')
  const [novo, setNovo] = useState({ d: 1, h: '18:00', v: 15 })

  return (
    <div className="space-y-6">
      <form
        className="corte grid grid-cols-[1fr_6rem_4.5rem] gap-2 bg-carvao-2 p-4"
        onSubmit={(e) => { e.preventDefault(); criar.mutate(novo) }}
      >
        <p className="font-cond col-span-3 text-sm font-semibold tracking-widest text-carvao-11 uppercase">Novo horário</p>
        <Seletor aria-label="Dia" value={novo.d} onChange={(e) => setNovo({ ...novo, d: Number(e.target.value) })}>
          {ORDEM.map((d) => <option key={d} value={d}>{DIAS[d]}</option>)}
        </Seletor>
        <Entrada aria-label="Hora" type="time" value={novo.h} onChange={(e) => setNovo({ ...novo, h: e.target.value })} />
        <Entrada aria-label="Vagas" type="number" min={1} value={novo.v} onChange={(e) => setNovo({ ...novo, v: Number(e.target.value) })} />
        <Botao className="col-span-3 h-11 text-base" disabled={criar.isPending}>Adicionar</Botao>
      </form>

      {ORDEM.map((d) => {
        const doDia = grade.data?.filter((g) => g.dia_semana === d) ?? []
        if (!doDia.length) return null
        return (
          <div key={d}>
            <h2 className="font-display text-xl tracking-wide uppercase">{DIAS[d]}</h2>
            <ul className="mt-2 space-y-1.5">
              {doDia.map((g) => <LinhaHorario key={g.id} g={g} onSalvar={salvar.mutate} onApagar={() => confirm(`Apagar ${DIAS[d]} ${g.hora}? Os agendamentos dele somem junto.`) && apagar.mutate(g.id)} />)}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function LinhaHorario({ g, onSalvar, onApagar }: { g: GradeAdmin; onSalvar: (g: GradeAdmin) => void; onApagar: () => void }) {
  return (
    <li className={cn('flex items-center gap-2 rounded-[var(--radius)] bg-carvao-2 p-2', !g.ativo && 'opacity-50')}>
      <span className="font-display w-16 pl-1 text-2xl">{g.hora}</span>
      <label className="flex items-center gap-1.5 text-sm text-carvao-11">
        vagas
        <Entrada type="number" min={1} defaultValue={g.vagas} className="w-16" onBlur={(e) => Number(e.target.value) !== g.vagas && onSalvar({ ...g, vagas: Number(e.target.value) })} />
      </label>
      <button onClick={() => onSalvar({ ...g, ativo: g.ativo ? 0 : 1 })} className="ml-auto h-11 px-3 text-sm font-semibold text-carvao-11">
        {g.ativo ? 'Pausar' : 'Ativar'}
      </button>
      <button onClick={onApagar} aria-label="Apagar horário" className="grid size-11 place-items-center text-sangue-11"><Trash2 className="size-5" /></button>
    </li>
  )
}
