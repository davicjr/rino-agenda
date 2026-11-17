// Área administrativa: abas fixas no topo (Agenda, Alunos, Grade, Professores).
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck, CalendarDays, Clock, Eye, LogOut, Shield, SlidersHorizontal, Users } from 'lucide-react'
import { Cabecalho } from '@/components/Cabecalho'
import { GavetaCalendario } from '@/components/GavetaCalendario'
import { useInicio } from '@/hooks/useAgenda'
import { admin } from '@/lib/apiAdmin'
import { somarDias } from '@/lib/datas'
import { IconeTopo } from '@/ui/IconeTopo'
import { useAcao } from '@/hooks/useAdmin'
import { GavetaRegras } from './gavetas/GavetaRegras'
import { sessao } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { AbaAgenda } from './AbaAgenda'
import { AbaAlunos } from './AbaAlunos'
import { AbaGrade } from './AbaGrade'
import { AbaProfessores } from './AbaProfessores'
import { Login } from './Login'

const ABAS = [
  { id: 'agenda', rotulo: 'Agenda', Icone: CalendarCheck },
  { id: 'alunos', rotulo: 'Alunos', Icone: Users },
  { id: 'grade', rotulo: 'Grade', Icone: Clock },
  { id: 'professores', rotulo: 'Profs', Icone: Shield },
] as const
type Aba = (typeof ABAS)[number]['id']

export function Admin() {
  const estado = useQuery({ queryKey: ['sessao'], queryFn: sessao.estado })
  if (estado.isPending) return null
  if (!estado.data?.logado) return <Login />
  return <Painel />
}

function Painel() {
  const [aba, setAba] = useState<Aba>('agenda')
  const [dataAgenda, setDataAgenda] = useState<string | null>(null)
  const [calendario, setCalendario] = useState(false)
  const [ajustes, setAjustes] = useState(false)
  const regras = useQuery({ queryKey: ['regras'], queryFn: admin.regras })
  const salvarRegras = useAcao(admin.salvarRegras, [['regras'], ['inicio'], ['dia']], 'Regras salvas.')
  const qc = useQueryClient()
  const inicio = useInicio()
  const bloqueios = useQuery({ queryKey: ['bloqueios'], queryFn: admin.bloqueios })
  const diasComAula = useMemo(() => new Set(inicio.data?.grade.map((g) => g.dia_semana)), [inicio.data])
  const bloqueados = useMemo(() => new Set(bloqueios.data?.filter((b) => b.grade_id === null).map((b) => b.data)), [bloqueios.data])
  const sair = useMutation({ mutationFn: sessao.sair, onSuccess: () => qc.invalidateQueries({ queryKey: ['sessao'] }) })
  const hoje = inicio.data?.agora.data
  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-20">
      <div className="sticky top-0 z-30 bg-carvao-1/95 pb-3 backdrop-blur">
        <Cabecalho
          titulo="Admin"
          subtitulo="Rino Fight Team"
          acoes={
            <>
              {aba === 'agenda' && hoje && <IconeTopo rotulo="Abrir calendário" onClick={() => setCalendario(true)}><CalendarDays className="size-5" /></IconeTopo>}
              <IconeTopo rotulo="Ajustes" onClick={() => setAjustes(true)}><SlidersHorizontal className="size-5" /></IconeTopo>
              <IconeTopo rotulo="Ver agenda pública" para="/"><Eye className="size-5" /></IconeTopo>
              <IconeTopo rotulo="Sair" onClick={() => sair.mutate()}><LogOut className="size-5" /></IconeTopo>
            </>
          }
        />
        <nav role="tablist" className="mt-3 grid grid-cols-4 gap-1.5 px-5">
          {ABAS.map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              role="tab"
              aria-selected={aba === id}
              onClick={() => setAba(id)}
              className={cn(
                'paralelo flex h-14 flex-col items-center justify-center gap-0.5 transition-colors duration-200',
                aba === id ? 'bg-ouro-9 text-preto' : 'bg-carvao-3 text-carvao-10 active:bg-carvao-4',
              )}
            >
              <Icone className="size-5" />
              <span className="font-cond text-xs font-bold tracking-widest uppercase">{rotulo}</span>
            </button>
          ))}
        </nav>
      </div>
      <section key={aba} className="animate-surge px-5 pt-3">
        {aba === 'agenda' && <AbaAgenda escolhido={dataAgenda} setData={setDataAgenda} />}
        {aba === 'alunos' && <AbaAlunos />}
        {aba === 'grade' && <AbaGrade />}
        {aba === 'professores' && <AbaProfessores />}
      </section>
      <GavetaRegras
        aberta={ajustes}
        regras={regras.data}
        enviando={salvarRegras.isPending}
        onFechar={() => setAjustes(false)}
        onSalvar={(r) => salvarRegras.mutate(r)}
      />
      {hoje && (
        <GavetaCalendario
          key={calendario ? 'aberta' : 'fechada'}
          aberta={calendario}
          hoje={hoje}
          selecionado={dataAgenda ?? hoje}
          diasComAula={diasComAula}
          bloqueados={bloqueados}
          min={somarDias(hoje, -365)}
          max={somarDias(hoje, 365)}
          onFechar={() => setCalendario(false)}
          onEscolher={(d) => { setDataAgenda(d); setCalendario(false) }}
        />
      )}
    </div>
  )
}
