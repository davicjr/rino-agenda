// Painel do professor: abas fixas no topo (Agenda, Alunos, Grade, Professores).
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck, Clock, Eye, LogOut, Shield, Users } from 'lucide-react'
import { Link } from 'react-router'
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
  const qc = useQueryClient()
  const sair = useMutation({ mutationFn: sessao.sair, onSuccess: () => qc.invalidateQueries({ queryKey: ['sessao'] }) })
  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-20">
      <div className="sticky top-0 z-30 bg-carvao-1/95 px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 backdrop-blur">
        <header className="flex h-12 items-center gap-3">
          <img src="/escudo.webp" alt="" className="h-12 w-auto" />
          <div className="flex-1 leading-none">
            <h1 className="font-display text-[1.5rem] tracking-wide uppercase">Painel</h1>
            <p className="font-cond mt-1 text-sm font-semibold tracking-[0.18em] text-carvao-11 uppercase">Rino Fight Team</p>
          </div>
          <Link to="/" aria-label="Ver agenda pública" className="grid size-11 place-items-center text-carvao-11"><Eye className="size-5" /></Link>
          <button onClick={() => sair.mutate()} aria-label="Sair" className="grid size-11 place-items-center text-carvao-11"><LogOut className="size-5" /></button>
        </header>
        <nav role="tablist" className="mt-3 grid grid-cols-4 gap-1.5">
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
        {aba === 'agenda' && <AbaAgenda />}
        {aba === 'alunos' && <AbaAlunos />}
        {aba === 'grade' && <AbaGrade />}
        {aba === 'professores' && <AbaProfessores />}
      </section>
    </div>
  )
}
