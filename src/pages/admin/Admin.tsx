// Painel do professor: grade, alunos e agenda do dia.
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { sessao } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { AbaAgenda } from './AbaAgenda'
import { AbaAlunos } from './AbaAlunos'
import { AbaGrade } from './AbaGrade'
import { Login } from './Login'

const ABAS = { agenda: 'Agenda', alunos: 'Alunos', grade: 'Grade' } as const
type Aba = keyof typeof ABAS

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
    <main className="mx-auto min-h-dvh max-w-lg px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-16">
      <header className="flex items-center gap-3">
        <img src="/escudo.webp" alt="" className="size-10" />
        <h1 className="font-display flex-1 text-2xl tracking-wide uppercase">Painel do professor</h1>
        <Link to="/" className="font-cond text-sm font-semibold tracking-widest text-carvao-11 uppercase">Agenda</Link>
        <button onClick={() => sair.mutate()} className="font-cond h-11 text-sm font-semibold tracking-widest text-carvao-10 uppercase">Sair</button>
      </header>
      <nav className="mt-5 grid grid-cols-3 gap-1.5" role="tablist">
        {(Object.keys(ABAS) as Aba[]).map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={aba === a}
            onClick={() => setAba(a)}
            className={cn('paralelo font-display h-11 text-base tracking-wider uppercase', aba === a ? 'bg-sangue-9 text-branco' : 'bg-carvao-3 text-carvao-11')}
          >
            {ABAS[a]}
          </button>
        ))}
      </nav>
      <section className="mt-6">
        {aba === 'agenda' && <AbaAgenda />}
        {aba === 'alunos' && <AbaAlunos />}
        {aba === 'grade' && <AbaGrade />}
      </section>
    </main>
  )
}
