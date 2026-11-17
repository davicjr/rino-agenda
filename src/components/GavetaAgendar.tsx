// Escolher o próprio nome e confirmar. O último nome usado neste aparelho aparece primeiro.
import { useState } from 'react'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import type { Aluno, Horario } from '@/lib/api'
import { horaCurta, iniciais, nomeDia } from '@/lib/datas'
import { Botao } from '@/ui/Botao'
import { Gaveta } from '@/ui/Gaveta'

type Props = {
  horario: Horario | null
  data: string
  doDia: Horario[]
  alunos: Aluno[]
  meuId: number | null
  enviando: boolean
  onFechar: () => void
  onConfirmar: (aluno: Aluno) => void
}

const exibir = (a: Aluno) => a.apelido || a.nome

export function GavetaAgendar({ horario, data, doDia, alunos, meuId, enviando, onFechar, onConfirmar }: Props) {
  const [escolhido, setEscolhido] = useState<Aluno | null>(null)
  // Um treino por dia: quem já está em outro horário do dia aparece, mas desabilitado.
  const horaNoDia = new Map(doDia.flatMap((h) => h.agendados.map((a) => [a.aluno_id, h.hora] as const)))
  const livres = alunos.filter((a) => !horario?.agendados.some((x) => x.aluno_id === a.id))
  const eu = livres.find((a) => a.id === meuId && !horaNoDia.has(a.id))
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
            <span className="font-cond grid size-12 place-items-center rounded-full bg-ouro-9 text-lg font-bold text-preto">{iniciais(exibir(escolhido))}</span>
            <p className="text-xl font-semibold">{exibir(escolhido)}</p>
          </div>
          <Botao className="mt-5" disabled={enviando} onClick={() => onConfirmar(escolhido)}>
            {enviando ? 'Agendando…' : 'Confirmar treino'}
          </Botao>
          <Botao variante="neutro" className="mt-2" onClick={() => setEscolhido(null)}>Não sou eu</Botao>
        </div>
      ) : (
        <Command label="Buscar aluno" className="flex min-h-0 flex-1 flex-col">
          {eu && (
            <button onClick={() => setEscolhido(eu)} className="corte-sm mb-3 flex items-center gap-3 bg-ouro-3 p-3 text-left active:bg-ouro-4">
              <span className="font-cond grid size-10 place-items-center rounded-full bg-ouro-9 font-bold text-preto">{iniciais(exibir(eu))}</span>
              <span>
                <span className="block text-xs font-semibold tracking-widest text-ouro-11 uppercase">Sou eu de novo</span>
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
              return (
                <Command.Item
                  key={a.id}
                  value={`${a.nome} ${a.apelido ?? ''}`}
                  disabled={!!outra}
                  onSelect={() => setEscolhido(a)}
                  className="flex h-13 cursor-pointer items-center gap-3 rounded-[var(--radius)] px-2 data-[disabled=true]:cursor-default data-[disabled=true]:opacity-45 data-[selected=true]:bg-carvao-4"
                >
                  <span className="font-cond grid size-9 place-items-center rounded-full bg-carvao-5 text-sm font-bold">{iniciais(exibir(a))}</span>
                  <span className="flex-1 text-base">{exibir(a)}</span>
                  {outra && <span className="font-cond text-sm text-carvao-10">já treina às {horaCurta(outra)}</span>}
                </Command.Item>
              )
            })}
          </Command.List>
        </Command>
      )}
    </Gaveta>
  )
}
