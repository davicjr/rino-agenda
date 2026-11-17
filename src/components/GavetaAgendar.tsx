// Escolher o próprio nome e confirmar. O último nome usado neste aparelho aparece primeiro.
import { useState } from 'react'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import type { Aluno, Horario, UsoSemana } from '@/lib/api'
import { cn } from '@/lib/cn'
import { horaCurta, nomeDia, nomeDiaCurto } from '@/lib/datas'
import { Avatar } from '@/ui/Avatar'
import { Botao } from '@/ui/Botao'
import { Gaveta } from '@/ui/Gaveta'

type Props = {
  horario: Horario | null
  data: string
  doDia: Horario[]
  alunos: Aluno[]
  meuId: number | null
  uso: Map<number, UsoSemana>
  enviando: boolean
  onFechar: () => void
  onConfirmar: (aluno: Aluno) => void
}

const exibir = (a: Aluno) => a.apelido || a.nome

export function GavetaAgendar({ horario, data, doDia, alunos, meuId, uso, enviando, onFechar, onConfirmar }: Props) {
  const [escolhido, setEscolhido] = useState<Aluno | null>(null)
  // Um treino por dia: quem já está em outro horário do dia aparece, mas desabilitado.
  const horaNoDia = new Map(doDia.flatMap((h) => h.agendados.map((a) => [a.aluno_id, h.hora] as const)))
  const livres = alunos.filter((a) => !horario?.agendados.some((x) => x.aluno_id === a.id))
  // Plano: quem já usou todos os treinos da semana também aparece desabilitado.
  const completa = (id: number) => { const u = uso.get(id); return !!u && u.usados >= u.limite }
  const eu = livres.find((a) => a.id === meuId && !horaNoDia.has(a.id) && !completa(a.id))
  const fechar = () => { setEscolhido(null); onFechar() }

  return (
    <Gaveta
      aberta={!!horario}
      onFechar={fechar}
      titulo={escolhido ? 'Confirma?' : 'Quem vai treinar?'}
      descricao={horario && `${nomeDia(data)}, ${horaCurta(horario.hora)}`}
    >
      {escolhido ? (
        <div className="animate-surge">
          <div className="corte-sm flex items-center gap-3 bg-carvao-3 p-4">
            <Avatar nome={exibir(escolhido)} tipo="aluno" id={escolhido.id} foto={escolhido.foto} destaque className="size-12 text-lg" />
            <p className="text-xl font-semibold">{exibir(escolhido)}</p>
          </div>
          {uso.get(escolhido.id) && <ProximoTreino {...uso.get(escolhido.id)!} />}
          <Botao className="mt-5" disabled={enviando} onClick={() => onConfirmar(escolhido)}>
            {enviando ? 'Agendando…' : 'Confirmar treino'}
          </Botao>
          <Botao variante="neutro" className="mt-2" onClick={() => setEscolhido(null)}>Não sou eu</Botao>
        </div>
      ) : (
        <Command label="Buscar aluno" className="flex min-h-0 flex-1 flex-col">
          {eu && (
            <button onClick={() => setEscolhido(eu)} className="corte-sm mb-3 flex items-center gap-3 bg-ouro-3 p-3 text-left active:bg-ouro-4">
              <Avatar nome={exibir(eu)} tipo="aluno" id={eu.id} foto={eu.foto} destaque className="size-10" />
              <span>
                <span className="block text-xs font-semibold tracking-widest text-ouro-11 uppercase">Usado por último neste celular</span>
                <span className="text-lg font-semibold">{exibir(eu)}</span>
              </span>
            </button>
          )}
          <div className="flex h-12 items-center gap-2 rounded-[var(--radius)] bg-carvao-4 px-3 focus-within:ring-2 focus-within:ring-ouro-9">
            <Search className="size-5 text-carvao-10" />
            <Command.Input placeholder="Digite seu nome" className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-carvao-9 focus-visible:outline-none" />
          </div>
          <Command.List className="sem-barra mt-2 min-h-40 flex-1 overflow-y-auto">
            <Command.Empty className="py-6 text-center text-carvao-10">
              {alunos.length ? 'Nome não encontrado. Fala com o professor.' : 'Ainda não tem aluno cadastrado. Fala com o professor.'}
            </Command.Empty>
            {livres.map((a) => {
              const outra = horaNoDia.get(a.id)
              const u = uso.get(a.id)
              const cheia = completa(a.id)
              return (
                <Command.Item
                  key={a.id}
                  value={`${a.nome} ${a.apelido ?? ''}`}
                  disabled={!!outra || cheia}
                  onSelect={() => setEscolhido(a)}
                  className="flex h-13 cursor-pointer items-center gap-3 rounded-[var(--radius)] px-2 data-[disabled=true]:cursor-default data-[disabled=true]:opacity-45 data-[selected=true]:bg-carvao-4"
                >
                  <Avatar nome={exibir(a)} tipo="aluno" id={a.id} foto={a.foto} className="size-9 text-sm" />
                  <span className="flex-1 truncate text-base">{exibir(a)}</span>
                  <span className="font-cond text-sm text-carvao-10 tabular-nums">
                    {outra ? `já treina às ${horaCurta(outra)}` : cheia ? 'semana completa' : u ? `${u.usados} de ${u.limite}` : ''}
                  </span>
                </Command.Item>
              )
            })}
          </Command.List>
        </Command>
      )}
    </Gaveta>
  )
}

// Treinos da semana: os já marcados em amarelo cheio, o deste agendamento contornado,
// e quais dias já estão marcados para a pessoa conferir.
function ProximoTreino({ usados, limite, marcados }: UsoSemana) {
  return (
    <div className="mt-4 rounded-[var(--radius)] bg-carvao-3 p-4">
      <p className="font-cond flex items-baseline justify-between gap-3 text-sm font-bold tracking-wider uppercase">
        <span className="text-carvao-10">Com este, nesta semana</span>
        <span className="font-display text-xl text-ouro-9 tabular-nums">{usados + 1} de {limite}</span>
      </p>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: limite }, (_, i) => (
          <span key={i} className={cn('h-2 flex-1 -skew-x-[20deg]', i < usados ? 'bg-ouro-9' : i === usados ? 'bg-ouro-9/35 ring-1 ring-ouro-9' : 'bg-carvao-5')} />
        ))}
      </div>
      {marcados.length > 0 && (
        <p className="mt-3 text-sm text-carvao-10">
          Já marcado: <span className="text-carvao-12">{marcados.map((m) => `${nomeDiaCurto(m.data).toLowerCase()} ${horaCurta(m.hora)}`).join(', ')}</span>
        </p>
      )}
    </div>
  )
}
