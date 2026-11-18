// Agenda do professor: escolhe o dia na faixa, define o professor do dia e abre cada horário.
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Lock, LockOpen } from 'lucide-react'
import { SemanaDias } from '@/components/SemanaDias'
import { useAcao } from '@/hooks/useAdmin'
import { useInicio } from '@/hooks/useAgenda'
import { api } from '@/lib/api'
import { admin } from '@/lib/apiAdmin'
import { horaCurta, nomeDia } from '@/lib/datas'
import { Rotulo } from '@/ui/Rotulo'
import { SeletorProfessor } from '@/ui/SeletorProfessor'
import { GavetaBloqueio } from './gavetas/GavetaBloqueio'
import { LinhaAula } from './LinhaAula'

export function AbaAgenda({ escolhido, setData }: { escolhido: string | null; setData: (d: string) => void }) {
  const inicio = useInicio()
  const hoje = inicio.data?.agora.data
  const data = escolhido ?? hoje ?? null
  const [aberta, setAberta] = useState<number | null>(null)
  const [bloquearEm, setBloquearEm] = useState<{ gradeId: number | null; titulo: string } | null>(null)
  const diasComAula = useMemo(() => new Set(inicio.data?.grade.map((g) => g.dia_semana)), [inicio.data])

  const dia = useQuery({ queryKey: ['dia', data], queryFn: () => api.dia(data!), enabled: !!data })
  const bloqueios = useQuery({ queryKey: ['bloqueios'], queryFn: admin.bloqueios })
  const K = [['dia', data ?? ''], ['bloqueios']]
  const remover = useAcao(admin.removerAgendamento, K, 'Agendamento removido.')
  const escalar = useAcao((v: { gradeId: number | null; professorId: number | null }) => admin.escalar(data!, v.gradeId, v.professorId), K, 'Professor definido.')
  const bloquear = useAcao((v: { gradeId: number | null; motivo: string; nota: string }) => admin.bloquear(data!, v.gradeId, v.motivo, v.nota), K, 'Bloqueado.')
  const desbloquear = useAcao(admin.desbloquear, K, 'Desbloqueado.')
  const diasBloqueados = useMemo(() => new Set(bloqueios.data?.filter((b) => b.grade_id === null).map((b) => b.data)), [bloqueios.data])
  const bloqueioDe = (gradeId: number | null) => bloqueios.data?.find((b) => b.data === data && b.grade_id === gradeId)

  if (!hoje || !data) return null
  const bDia = bloqueioDe(null)

  return (
    <div className="space-y-5">
      <div className="-mx-5">
        <SemanaDias hoje={hoje} selecionado={data} onSelecionar={(d) => { setData(d); setAberta(null) }} diasComAula={diasComAula} bloqueados={diasBloqueados} />
      </div>

      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display -skew-x-6 text-3xl leading-none uppercase">
          {data === hoje ? 'Hoje' : nomeDia(data)}
        </h2>
        {bDia ? (
          <button onClick={() => desbloquear.mutate(bDia.id)} className="flex h-11 items-center gap-1.5 text-sm font-semibold text-alerta-11"><LockOpen className="size-4" /> Liberar dia</button>
        ) : dia.data?.horarios.length ? (
          <button onClick={() => setBloquearEm({ gradeId: null, titulo: `${nomeDia(data)}, dia inteiro` })} className="flex h-11 items-center gap-1.5 text-sm font-semibold text-carvao-11"><Lock className="size-4" /> Bloquear dia</button>
        ) : null}
      </div>

      {dia.data?.horarios.length ? (
        <div className="paralelo bg-carvao-2 p-4">
          <Rotulo htmlFor="prof-dia">Professor do dia</Rotulo>
          <SeletorProfessor id="prof-dia" valor={dia.data.professorDiaId} nenhum="Padrão de cada horário" onMudar={(id) => escalar.mutate({ gradeId: null, professorId: id })} className="w-full" />
        </div>
      ) : null}

      {dia.data && !dia.data.horarios.length && <p className="paralelo bg-carvao-2 p-5 text-carvao-10">Sem aula na grade neste dia.</p>}
      {bDia && (
        <div className="paralelo bg-alerta-3 p-4 text-alerta-12">
          <p className="flex items-center gap-2 font-semibold [overflow-wrap:anywhere]"><Lock className="size-5 shrink-0 text-alerta-11" /> Dia bloqueado: {bDia.motivo || 'sem aula'}</p>
          {bDia.nota && <p className="mt-2 text-sm text-alerta-11 [overflow-wrap:anywhere]">{bDia.nota}</p>}
        </div>
      )}

      <ul className="space-y-2">
        {dia.data?.horarios.map((h) => {
          const b = bloqueioDe(h.id)
          return (
            <LinhaAula
              key={h.id}
              h={h}
              aberta={aberta === h.id}
              onAlternar={() => setAberta(aberta === h.id ? null : h.id)}
              onRemover={(id) => remover.mutate(id)}
              onEscalar={(professorId) => escalar.mutate({ gradeId: h.id, professorId })}
              onBloquear={() => setBloquearEm({ gradeId: h.id, titulo: `${nomeDia(data)}, ${horaCurta(h.hora)}` })}
              onDesbloquear={b ? () => desbloquear.mutate(b.id) : null}
              mostrarNota={!bDia}
            />
          )
        })}
      </ul>

      <GavetaBloqueio
        alvo={bloquearEm}
        enviando={bloquear.isPending}
        onFechar={() => setBloquearEm(null)}
        onConfirmar={(motivo, nota) => bloquearEm && bloquear.mutate({ gradeId: bloquearEm.gradeId, motivo, nota }, { onSuccess: () => setBloquearEm(null) })}
      />
    </div>
  )
}
