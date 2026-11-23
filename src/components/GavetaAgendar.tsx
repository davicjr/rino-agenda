// Escolher quem vai treinar e confirmar: Plano (alunos cadastrados), Diária (lista ou nome digitado)
// e Experimental (só nome digitado). O último aluno usado neste celular aparece primeiro.
import { useState } from 'react'
import type { Aluno, Horario, TipoAgendamento, UsoSemana } from '@/lib/api'
import { cn } from '@/lib/cn'
import { horaCurta, nomeDia, nomeDiaCurto } from '@/lib/datas'
import { nomeExibido } from '@/lib/nomes'
import { Avatar } from '@/ui/Avatar'
import { Botao } from '@/ui/Botao'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { NomeVisitante } from './NomeVisitante'
import { SeletorAluno } from './SeletorAluno'

/** Quem foi escolhido: um aluno da lista ou, na diária e na experimental, um nome digitado. */
export type Escolha = { tipo: TipoAgendamento; aluno: Aluno | null; nome: string }

type Props = {
  horario: Horario | null
  data: string
  doDia: Horario[]
  alunos: Aluno[]
  meuId: number | null
  uso: Map<number, UsoSemana>
  enviando: boolean
  onFechar: () => void
  onConfirmar: (e: Escolha) => void
}

const TIPOS = [
  { valor: 'plano', rotulo: 'Plano' },
  { valor: 'diaria', rotulo: 'Diária' },
  { valor: 'experimental', rotulo: 'Experimental' },
] as const
const CONFIRMAR = { plano: 'Confirmar treino', diaria: 'Confirmar diária', experimental: 'Confirmar experimental' } as const
const ROTULO_TIPO = { plano: '', diaria: 'Diária', experimental: 'Aula experimental' } as const

export function GavetaAgendar({ horario, data, doDia, alunos, meuId, uso, enviando, onFechar, onConfirmar }: Props) {
  const [tipo, setTipo] = useState<TipoAgendamento>('plano')
  const [escolhido, setEscolhido] = useState<Escolha | null>(null)
  // Toda abertura começa no plano, na escolha do nome: quem agendou antes neste celular não fica selecionado.
  const aberta = !!horario
  const [estavaAberta, setEstavaAberta] = useState(aberta)
  if (aberta !== estavaAberta) {
    setEstavaAberta(aberta)
    if (aberta) { setEscolhido(null); setTipo('plano') }
  }
  // Um treino por dia: quem já está em outro horário do dia aparece, mas desabilitado.
  const horaNoDia = new Map(doDia.flatMap((h) => h.agendados.flatMap((a) => (a.aluno_id ? [[a.aluno_id, h.hora] as const] : []))))
  const livres = alunos.filter((a) => !horario?.agendados.some((x) => x.aluno_id === a.id))
  const eu = tipo === 'plano' ? livres.find((a) => a.id === meuId && !horaNoDia.has(a.id) && !(uso.get(a.id) && uso.get(a.id)!.usados >= uso.get(a.id)!.limite)) : undefined
  const fechar = () => { setEscolhido(null); onFechar() }
  const mudarTipo = (t: TipoAgendamento) => { setTipo(t); setEscolhido(null) }
  const doAluno = (aluno: Aluno) => setEscolhido({ tipo, aluno, nome: nomeExibido(aluno) })
  const digitado = (nome: string) => setEscolhido({ tipo, aluno: null, nome })

  return (
    <Gaveta
      aberta={!!horario}
      onFechar={fechar}
      titulo={escolhido ? 'Confirma?' : 'Quem vai treinar?'}
      descricao={horario && `${nomeDia(data)}, ${horaCurta(horario.hora)}`}
    >
      {escolhido ? (
        <div className="animate-surge">
          <div className="paralelo flex items-center gap-3 bg-carvao-3 p-4">
            <Avatar nome={escolhido.nome} tipo="aluno" id={escolhido.aluno?.id ?? 0} foto={escolhido.aluno?.foto} destaque className="size-12 text-lg" />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold">{escolhido.nome}</p>
              {escolhido.tipo !== 'plano' && <p className="font-cond text-sm font-bold tracking-widest text-ouro-11 uppercase">{ROTULO_TIPO[escolhido.tipo]}</p>}
            </div>
          </div>
          {escolhido.tipo === 'plano' && escolhido.aluno && uso.get(escolhido.aluno.id) && <ProximoTreino {...uso.get(escolhido.aluno.id)!} />}
          <Botao className="mt-5" disabled={enviando} onClick={() => onConfirmar(escolhido)}>
            {enviando ? 'Agendando…' : CONFIRMAR[escolhido.tipo]}
          </Botao>
          <Botao variante="neutro" className="mt-2" onClick={() => setEscolhido(null)}>{escolhido.aluno ? 'Não sou eu' : 'Voltar'}</Botao>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <Chips rotulo="Tipo de treino" opcoes={TIPOS.map((t) => ({ valor: t.valor, rotulo: t.rotulo }))} valor={tipo} onMudar={mudarTipo} />
          {tipo === 'experimental' ? (
            <NomeVisitante onContinuar={digitado} />
          ) : (
            <SeletorAluno
              key={tipo}
              alunos={livres}
              horaNoDia={horaNoDia}
              uso={uso}
              usaPlano={tipo === 'plano'}
              eu={eu}
              aceitaNome={tipo === 'diaria'}
              vazio={tipo === 'diaria' ? 'Nome não está na lista? Toque em agendar acima, digitando o nome completo.' : 'Nome não encontrado. Fala com o professor.'}
              onEscolher={doAluno}
              onNome={digitado}
            />
          )}
        </div>
      )}
    </Gaveta>
  )
}

// Treinos da semana: os já marcados em amarelo cheio, o deste agendamento contornado,
// e quais dias já estão marcados para a pessoa conferir.
function ProximoTreino({ usados, limite, marcados }: UsoSemana) {
  return (
    <div className="mt-4 paralelo bg-carvao-3 p-4">
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
