// Tela pública: escolher o dia, ver quem vai e agendar ou retirar.
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
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
import { ListaHorarios } from '@/components/ListaHorarios'

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
    <main className="relative mx-auto min-h-dvh max-w-lg overflow-x-clip pb-16">
      <Textura className="top-[5.5rem] -right-28 h-52 w-[26rem] opacity-70" />
      <Cabecalho />
      {inicio.data && data && (
        <>
          <TituloDia data={data} hoje={inicio.data.agora.data} direcao={direcao} />
          <div className="mt-5">
          <FaixaDias
            hoje={inicio.data.agora.data}
            dias={15}
            diasComAula={diasComAula}
            bloqueados={bloqueados}
            selecionado={data}
            onSelecionar={setEscolhido}
            onCalendario={() => setCalendario(true)}
          />
          </div>
        </>
      )}
      <section className={`relative z-10 mt-5 space-y-3 px-5 transition-opacity duration-200 ${dia.isPlaceholderData ? 'opacity-40' : ''}`}>
        <EstadoDia carregando={inicio.isPending || dia.isPending} erro={inicio.error ?? dia.error} dia={dia.data} />
        {dia.data && data && !dia.data.bloqueioDia && (
          <ListaHorarios
            data={dia.data.data}
            direcao={direcao}
            horarios={dia.data.horarios}
            meuId={meuId}
            pulsos={pulsos}
            onAgendar={setAgendarEm}
            onTocarNome={(agendado, horario) => setRetirar({ agendado, horario })}
          />
        )}
      </section>
      <footer className="font-cond mt-12 text-center text-sm tracking-[0.3em] text-carvao-8 uppercase">
        Disciplina · Foco · Força · Evolução
      </footer>

      {data && (
        <GavetaAgendar
          horario={agendarEm}
          data={data}
          doDia={dia.data?.horarios ?? []}
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
