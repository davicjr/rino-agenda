// Lista de alunos com busca por nome. Quem já treina no dia, ou já fechou a semana do plano, aparece desabilitado.
// Com `aceitaNome`, o que foi digitado também pode ser agendado como visitante (diária).
import { useState } from 'react'
import { Command } from 'cmdk'
import { Search, UserPlus } from 'lucide-react'
import type { Aluno, UsoSemana } from '@/lib/api'
import { horaCurta } from '@/lib/datas'
import { nomeExibido } from '@/lib/nomes'
import { Avatar } from '@/ui/Avatar'
import { caixaCampo } from '@/ui/Campo'

type Props = {
  alunos: Aluno[]
  /** Hora do outro treino do dia, por aluno. */
  horaNoDia: Map<number, string>
  uso: Map<number, UsoSemana>
  /** Plano mostra "2 de 3" e bloqueia semana completa; diária não gasta o plano. */
  usaPlano: boolean
  /** Atalho do último nome usado neste celular. */
  eu: Aluno | undefined
  aceitaNome: boolean
  vazio: string
  onEscolher: (a: Aluno) => void
  onNome: (nome: string) => void
}

export function SeletorAluno({ alunos, horaNoDia, uso, usaPlano, eu, aceitaNome, vazio, onEscolher, onNome }: Props) {
  const [busca, setBusca] = useState('')
  const digitado = busca.trim().replace(/\s+/g, ' ')
  const completa = (id: number) => { const u = uso.get(id); return usaPlano && !!u && u.usados >= u.limite }
  return (
    <Command label="Buscar aluno" className="flex min-h-0 flex-1 flex-col">
      {eu && (
        <button onClick={() => onEscolher(eu)} className="paralelo mb-3 flex shrink-0 items-center gap-3 bg-ouro-3 p-3 text-left active:bg-ouro-4">
          <Avatar nome={nomeExibido(eu)} tipo="aluno" id={eu.id} foto={eu.foto} destaque className="size-10" />
          <span>
            <span className="block text-xs font-semibold tracking-widest text-ouro-11 uppercase">Usado por último neste celular</span>
            <span className="text-lg font-semibold">{nomeExibido(eu)}</span>
          </span>
        </button>
      )}
      <div className={caixaCampo}>
        <Search className="size-5 text-carvao-10" />
        <Command.Input value={busca} onValueChange={setBusca} placeholder={aceitaNome ? 'Digite o nome' : 'Digite seu nome'} className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-carvao-9 focus-visible:outline-none" />
      </div>
      {aceitaNome && digitado.length >= 2 && (
        <button onClick={() => onNome(digitado)} className="paralelo mt-2 flex h-13 shrink-0 items-center gap-3 bg-ouro-3 px-3 text-left active:bg-ouro-4">
          <UserPlus className="size-5 shrink-0 text-ouro-11" />
          <span className="min-w-0 flex-1 truncate text-base">Agendar <span className="font-semibold">{digitado}</span> como visitante</span>
        </button>
      )}
      <Command.List className="sem-barra mt-2 min-h-40 flex-1 overflow-y-auto">
        <Command.Empty className="py-6 text-center text-carvao-10">{alunos.length ? vazio : 'Ainda não tem aluno cadastrado. Fala com o professor.'}</Command.Empty>
        {alunos.map((a) => {
          const outra = horaNoDia.get(a.id)
          const u = usaPlano ? uso.get(a.id) : undefined
          const cheia = completa(a.id)
          return (
            <Command.Item
              key={a.id}
              value={`${a.nome} ${a.apelido ?? ''}`}
              disabled={!!outra || cheia}
              onSelect={() => onEscolher(a)}
              className="paralelo flex h-13 cursor-pointer items-center gap-3 px-3 data-[disabled=true]:cursor-default data-[disabled=true]:opacity-45 data-[selected=true]:bg-carvao-4"
            >
              <Avatar nome={nomeExibido(a)} tipo="aluno" id={a.id} foto={a.foto} className="size-9 text-sm" />
              <span className="flex-1 truncate text-base">{nomeExibido(a)}</span>
              <span className="font-cond text-sm text-carvao-10 tabular-nums">
                {outra ? `já treina às ${horaCurta(outra)}` : cheia ? 'semana completa' : u ? `${u.usados} de ${u.limite}` : ''}
              </span>
            </Command.Item>
          )
        })}
      </Command.List>
    </Command>
  )
}
