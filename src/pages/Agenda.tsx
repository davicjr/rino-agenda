// Tela pública: escolher o dia, ver quem vai e agendar ou retirar.
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CardHorario } from '@/components/CardHorario'
import { Cabecalho } from '@/components/Cabecalho'
import { FaixaDias } from '@/components/FaixaDias'
import { GavetaAgendar } from '@/components/GavetaAgendar'
import { GavetaCalendario } from '@/components/GavetaCalendario'
import { GavetaRetirar } from '@/components/GavetaRetirar'
import { Textura } from '@/components/Textura'
import { TituloDia } from '@/components/TituloDia'
import { useAgendar, useDia, useInicio, useRetirar } from '@/hooks/useAgenda'
import { useMeuAluno } from '@/hooks/useMeuAluno'
import type { Agendado, Aluno, Horario } from '@/lib/api'
import { horaCurta } from '@/lib/datas'
import { vibrar } from '@/lib/impacto'
import { primeiroDia } from '@/lib/primeiroDia'
import { EstadoDia } from '@/components/EstadoDia'

export function Agenda() {
  const inicio = useInicio()
  const [escolhido, setEscolhido] = useState<string | null>(null)
  const data = escolhido ?? (inicio.data ? primeiroDia(inicio.data) : null)
  const dia = useDia(data)
  const [meuId, lembrar] = useMeuAluno()
  const [agendarEm, setAgendarEm] = useState<Horario | null>(null)
  const [retirar, setRetirar] = useState<{ agendado: Agendado; horario: Horario } | null>(null)
  const [calendario, setCalendario] = useState(false)
  const [pulsos, setPulsos] = useState<Record<number, number>>({})
  const agendar = useAgendar(data ?? '')
  const tirar = useRetirar(data ?? '')
  const diasComAula = useMemo(() => new Set(inicio.data?.grade.map((g) => g.dia_semana)), [inicio.data])

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
          toast.success(`Fechado, ${(aluno.apelido || aluno.nome).split(' ')[0]}! Te vejo às ${horaCurta(h.hora)}.`)
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
    <main className="relative mx-auto min-h-dvh max-w-lg overflow-x-hidden pb-16">
      <Textura className="-top-10 -right-24 h-80 w-[34rem]" />
      <Cabecalho />
      {inicio.data && data && (
        <>
          <TituloDia data={data} hoje={inicio.data.agora.data} />
          <FaixaDias
            hoje={inicio.data.agora.data}
            dias={15}
            diasComAula={diasComAula}
            selecionado={data}
            onSelecionar={setEscolhido}
            onCalendario={() => setCalendario(true)}
          />
        </>
      )}
      <section className="relative z-10 mt-6 space-y-3 px-5" aria-live="polite">
        <EstadoDia carregando={inicio.isPending || dia.isPending} erro={inicio.error ?? dia.error} dia={dia.data} />
        {dia.data?.horarios.map((h, i) => (
          <div key={h.id} className="animate-surge" style={{ animationDelay: `${i * 45}ms` }}>
            <CardHorario
              horario={h}
              meuId={meuId}
              pulso={pulsos[h.id] ?? 0}
              onAgendar={setAgendarEm}
              onTocarNome={(agendado, horario) => setRetirar({ agendado, horario })}
            />
          </div>
        ))}
      </section>
      <footer className="font-cond mt-12 text-center text-sm tracking-[0.3em] text-carvao-8 uppercase">
        Disciplina · Foco · Força · Evolução
      </footer>

      {data && (
        <GavetaAgendar
          horario={agendarEm}
          data={data}
          alunos={inicio.data?.alunos ?? []}
          meuId={meuId}
          enviando={agendar.isPending}
          onFechar={() => setAgendarEm(null)}
          onConfirmar={confirmar}
        />
      )}
      <GavetaRetirar alvo={retirar} enviando={tirar.isPending} onFechar={() => setRetirar(null)} onConfirmar={confirmarRetirada} />
      {inicio.data && data && (
        <GavetaCalendario
          aberta={calendario}
          hoje={inicio.data.agora.data}
          janela={inicio.data.janelaDias}
          diasComAula={diasComAula}
          selecionado={data}
          onFechar={() => setCalendario(false)}
          onEscolher={(d) => { setEscolhido(d); setCalendario(false) }}
        />
      )}
    </main>
  )
}
