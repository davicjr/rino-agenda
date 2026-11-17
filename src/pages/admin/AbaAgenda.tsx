// Agenda do dia para o professor: presença, remover agendamento e bloquear dia ou horário.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { api } from '@/lib/api'
import { admin } from '@/lib/apiAdmin'
import { horaCurta, nomeDia, paraData } from '@/lib/datas'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Bloqueios } from './Bloqueios'

export function AbaAgenda() {
  const [data, setData] = useState(() => paraData(new Date()))
  const dia = useQuery({ queryKey: ['dia', data], queryFn: () => api.dia(data) })
  const remover = useAcao(admin.removerAgendamento, [['dia', data]], 'Agendamento removido.')
  const bloquear = useAcao((v: { gradeId: number | null; motivo: string }) => admin.bloquear(data, v.gradeId, v.motivo), [['dia', data], ['bloqueios']], 'Bloqueado.')
  const pedirMotivo = (gradeId: number | null) => {
    const motivo = prompt('Motivo (aparece para os alunos):', 'Feriado')
    if (motivo !== null) bloquear.mutate({ gradeId, motivo })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Entrada type="date" value={data} onChange={(e) => e.target.value && setData(e.target.value)} className="flex-1" />
        <span className="font-display w-24 text-lg uppercase">{nomeDia(data).slice(0, 3)}</span>
      </div>
      {dia.data?.bloqueioDia ? (
        <p className="corte bg-carvao-2 p-4 text-carvao-11">Dia bloqueado: {dia.data.bloqueioDia}</p>
      ) : (
        dia.data?.horarios.length ? <Botao variante="neutro" className="h-11 text-base" onClick={() => pedirMotivo(null)}>Bloquear o dia inteiro</Botao> : <p className="text-carvao-10">Sem horários na grade neste dia.</p>
      )}
      {dia.data?.horarios.map((h) => (
        <div key={h.id} className="corte bg-carvao-2 p-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl">{horaCurta(h.hora)}</span>
            <span className="text-carvao-11">{h.agendados.length}/{h.vagas}</span>
            {h.bloqueio ? <span className="ml-auto text-sm text-sangue-11">{h.bloqueio}</span> : (
              <button onClick={() => pedirMotivo(h.id)} className="ml-auto h-9 text-sm font-semibold text-carvao-11">Bloquear</button>
            )}
          </div>
          <ol className="mt-2 space-y-1">
            {h.agendados.map((a, i) => (
              <li key={a.id} className="flex items-center gap-2 border-t border-carvao-4 pt-1">
                <span className="w-6 text-carvao-9">{i + 1}</span>
                <span className="flex-1">{a.nome}</span>
                <button aria-label={`Remover ${a.nome}`} onClick={() => remover.mutate(a.id)} className="grid size-10 place-items-center text-carvao-10"><X className="size-5" /></button>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <Bloqueios />
    </div>
  )
}
