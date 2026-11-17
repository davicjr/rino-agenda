// Tela pública: escolher o dia, ver quem vai e agendar ou retirar.
import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { Cabecalho } from '@/components/Cabecalho'
import { GavetaCalendario } from '@/components/GavetaCalendario'
import { SemanaDias } from '@/components/SemanaDias'
import { GavetaAgendar } from '@/components/GavetaAgendar'
import { GavetaRetirar } from '@/components/GavetaRetirar'
import { FundoMarca } from '@/components/FundoMarca'
import { TituloDia } from '@/components/TituloDia'
import { useAgendar, useDia, useInicio, useRetirar, useSemana } from '@/hooks/useAgenda'
import { useMeuAluno } from '@/hooks/useMeuAluno'
import type { Agendado, Aluno, Horario } from '@/lib/api'
import { horaCurta, somarDias } from '@/lib/datas'
import { vibrar } from '@/lib/impacto'
import { primeiroDia } from '@/lib/primeiroDia'
import { EstadoDia } from '@/components/EstadoDia'
import { SessaoDia } from '@/components/SessaoDia'

export function Agenda() {
  const inicio = useInicio()
  const [escolhido, setEscolhidoBruto] = useState<string | null>(null)
  const [direcao, setDirecao] = useState(1)
  const data = escolhido ?? (inicio.data ? primeiroDia(inicio.data) : null)
  const setEscolhido = (d: string) => {
    if (data) setDirecao(d >= data ? 1 : -1)
    setEscolhidoBruto(d)
  }
  const dia = useDia(data)
  const semana = useSemana(data)
  const uso = useMemo(() => new Map(semana.data?.alunos.map((a) => [a.id, a])), [semana.data])
  const [meuId, lembrar] = useMeuAluno()
  const [agendarEm, setAgendarEm] = useState<Horario | null>(null)
  const [retirar, setRetirar] = useState<{ agendado: Agendado; horario: Horario } | null>(null)
  const [calendario, setCalendario] = useState(false)
  const [pulsos, setPulsos] = useState<Record<number, number>>({})
  const agendar = useAgendar(data ?? '')
  const tirar = useRetirar(data ?? '')
  const diasComAula = useMemo(() => new Set(inicio.data?.grade.map((g) => g.dia_semana)), [inicio.data])
  const bloqueados = useMemo(() => new Set(inicio.data?.bloqueiosDia.map((b) => b.data)), [inicio.data])

  const confirmar = (aluno: Aluno) => {
    if (!agendarEm) return
    const h = agendarEm
    agendar.mutate(
      { alunoId: aluno.id, gradeId: h.id },
      {
        onSuccess: () => {
          lembrar(aluno.id)
          setAgendarEm(null)
          vibrar([18, 40, 30])
          setPulsos((p) => ({ ...p, [h.id]: (p[h.id] ?? 0) + 1 }))
          const u = uso.get(aluno.id)
          toast.success(`Fechado, ${(aluno.apelido || aluno.nome).split(' ')[0]}! Te vejo às ${horaCurta(h.hora)}.${u ? ` ${u.usados + 1}/${u.limite} nesta semana.` : ''}`)
        },
        onError: (e) => toast.error(e.message),
      },
    )
  }

  const confirmarRetirada = () => {
    if (!retirar) return
    tirar.mutate(retirar.agendado.id, {
      onSuccess: () => { setRetirar(null); toast('Vaga liberada.') },
      onError: (e) => { setRetirar(null); toast.error(e.message) },
    })
  }

  return (
    <main className="relative mx-auto flex h-dvh max-w-lg flex-col overflow-hidden">
      <FundoMarca />
      <Cabecalho
        acoes={
          inicio.data && (
            <button onClick={() => setCalendario(true)} aria-label="Abrir calendário" className="grid size-11 shrink-0 place-items-center text-carvao-11 active:text-carvao-12">
              <CalendarDays className="size-5" />
            </button>
          )
        }
      />
      {inicio.data && data && (
        <>
          <TituloDia data={data} hoje={inicio.data.agora.data} direcao={direcao} />
          <div className="mt-1 shrink-0">
            <SemanaDias
              hoje={inicio.data.agora.data}
              selecionado={data}
              onSelecionar={setEscolhido}
              diasComAula={diasComAula}
              bloqueados={bloqueados}
              min={somarDias(inicio.data.agora.data, -28)}
              max={somarDias(inicio.data.agora.data, inicio.data.janelaDias)}
            />
          </div>
        </>
      )}
      <section className={`relative z-10 mt-4 flex min-h-0 flex-1 flex-col px-5 pb-[max(env(safe-area-inset-bottom),1rem)] transition-opacity duration-200 ${dia.isPlaceholderData ? 'opacity-40' : ''}`}>
        <EstadoDia carregando={inicio.isPending || dia.isPending} erro={inicio.error ?? dia.error} dia={dia.data} />
        {dia.data && data && !dia.data.bloqueioDia && (
          <SessaoDia
            key={dia.data.data}
            horarios={dia.data.horarios}
            direcaoDia={direcao}
            pulsos={pulsos}
            onAgendar={setAgendarEm}
            onTocarNome={(agendado, horario) => setRetirar({ agendado, horario })}
          />
        )}
      </section>

      {data && (
        <GavetaAgendar
          horario={agendarEm}
          data={data}
          doDia={dia.data?.horarios ?? []}
          alunos={inicio.data?.alunos ?? []}
          meuId={meuId}
          uso={uso}
          enviando={agendar.isPending}
          onFechar={() => setAgendarEm(null)}
          onConfirmar={confirmar}
        />
      )}
      <GavetaRetirar alvo={retirar} enviando={tirar.isPending} onFechar={() => setRetirar(null)} onConfirmar={confirmarRetirada} />
      {inicio.data && data && (
        <GavetaCalendario
          key={calendario ? 'aberta' : 'fechada'}
          aberta={calendario}
          hoje={inicio.data.agora.data}
          selecionado={data}
          diasComAula={diasComAula}
          bloqueados={bloqueados}
          min={somarDias(inicio.data.agora.data, -28)}
          max={somarDias(inicio.data.agora.data, inicio.data.janelaDias)}
          onFechar={() => setCalendario(false)}
          onEscolher={(d) => { setEscolhido(d); setCalendario(false) }}
        />
      )}
    </main>
  )
}
