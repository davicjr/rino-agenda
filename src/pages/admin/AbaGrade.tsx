// Grade semanal: um dia por vez nos chips, horários em lista e edição numa gaveta.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { useProfessores } from '@/hooks/useProfessores'
import { admin, type GradeAdmin } from '@/lib/apiAdmin'
import { Chips } from '@/ui/Chips'
import { Linha } from '@/ui/Linha'
import { GavetaHorario, type Rascunho } from './gavetas/GavetaHorario'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const ORDEM = [1, 2, 3, 4, 5, 6, 0]
const K = [['grade-admin'], ['inicio'], ['dia']]

export function AbaGrade() {
  const grade = useQuery({ queryKey: ['grade-admin'], queryFn: admin.grade })
  const professores = useProfessores()
  const [dia, setDia] = useState(1)
  const [alvo, setAlvo] = useState<Rascunho | null>(null)
  const fechar = { onSuccess: () => setAlvo(null) }
  const criar = useAcao(admin.criarHorario, K, 'Horário criado.')
  const salvar = useAcao((g: GradeAdmin) => admin.salvarHorario(g), K, 'Horário salvo.')
  const apagar = useAcao(admin.apagarHorario, K, 'Horário apagado.')
  const doDia = grade.data?.filter((g) => g.dia_semana === dia) ?? []
  const nomeProf = (id: number | null) => professores.data?.find((p) => p.id === id)?.nome

  return (
    <div className="space-y-4">
      <Chips rotulo="Dia da semana" opcoes={ORDEM.map((d) => ({ valor: d, rotulo: CURTOS[d], marca: grade.data?.some((g) => g.dia_semana === d) }))} valor={dia} onMudar={setDia} />
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-display -skew-x-6 text-3xl uppercase">{DIAS[dia]}</h2>
        <button onClick={() => setAlvo({ dia_semana: dia, hora: '18:00', vagas: 15, sem_limite: 0, ativo: 1, professor_id: null })} className="paralelo font-display flex h-11 items-center gap-1.5 bg-ouro-9 px-4 tracking-wider text-preto uppercase active:bg-ouro-10">
          <Plus className="size-5" /> Horário
        </button>
      </div>
      <ul className="space-y-2">
        {doDia.map((g) => (
          <Linha
            key={g.id}
            titulo={<span className="font-display text-2xl tracking-wide">{g.hora}</span>}
            detalhe={[g.sem_limite ? 'Sem limite de vagas' : `${g.vagas} ${g.vagas === 1 ? 'vaga' : 'vagas'}`, nomeProf(g.professor_id) && `Prof. ${nomeProf(g.professor_id)}`, !g.ativo && 'pausado'].filter(Boolean).join(' · ')}
            apagada={!g.ativo}
            onClick={() => setAlvo(g)}
          />
        ))}
      </ul>
      {grade.data && !doDia.length && <p className="py-8 text-center text-carvao-9">Sem aula na {DIAS[dia].toLowerCase()}. Toque em + Horário para criar.</p>}
      <GavetaHorario
        alvo={alvo}
        nomeDia={DIAS[alvo?.dia_semana ?? dia]}
        enviando={criar.isPending || salvar.isPending}
        onFechar={() => setAlvo(null)}
        onSalvar={(g) => (g.id ? salvar.mutate(g as GradeAdmin, fechar) : criar.mutate(g, fechar))}
        onApagar={(id) => confirm('Apagar este horário? Os agendamentos dele somem junto. Para só esconder, desmarque "Ativo".') && apagar.mutate(id, fechar)}
      />
    </div>
  )
}
