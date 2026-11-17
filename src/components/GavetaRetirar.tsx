// Confirmação para tirar um nome do treino.
import type { Agendado, Horario } from '@/lib/api'
import { horaCurta } from '@/lib/datas'
import { Botao } from '@/ui/Botao'
import { Gaveta } from '@/ui/Gaveta'

type Props = { alvo: { agendado: Agendado; horario: Horario } | null; enviando: boolean; onFechar: () => void; onConfirmar: () => void }

export function GavetaRetirar({ alvo, enviando, onFechar, onConfirmar }: Props) {
  return (
    <Gaveta
      aberta={!!alvo}
      onFechar={onFechar}
      titulo="Retirar do treino?"
      descricao={alvo && <>A vaga das {horaCurta(alvo.horario.hora)} de <strong className="text-carvao-12">{alvo.agendado.nome}</strong> fica livre para outro aluno.</>}
    >
      <Botao variante="contorno" disabled={enviando} onClick={onConfirmar}>{enviando ? 'Retirando…' : 'Retirar'}</Botao>
      <Botao variante="neutro" className="mt-2" onClick={onFechar}>Manter</Botao>
    </Gaveta>
  )
}
