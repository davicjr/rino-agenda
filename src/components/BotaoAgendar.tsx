// Botão de agendar que respeita a janela: abre em tal dia, fechado pelo prazo, lotado ou livre.
import type { Horario, RegrasJanela } from '@/lib/api'
import { cn } from '@/lib/cn'
import { diaDoMes, horaCurta, nomeDiaCurto } from '@/lib/datas'

type Props = { h: Horario; lotado: boolean; regras?: RegrasJanela; onAgendar: () => void }

export function BotaoAgendar({ h, lotado, regras, onAgendar }: Props) {
  const j = h.janela
  const livre = j.estado === 'aberta' && !lotado
  const texto =
    j.estado === 'cedo' ? `Abre ${nomeDiaCurto(j.abreEm.data).toLowerCase()} ${diaDoMes(j.abreEm.data)}, ${horaCurta(j.abreEm.hora)}`
    : j.estado === 'fechou' ? (regras?.fechaHorasAntes ? `Fechou ${regras.fechaHorasAntes}h antes` : 'Agendamento fechado')
    : lotado ? 'Turma cheia'
    : `Agendar às ${horaCurta(h.hora)}`
  return (
    <button
      onClick={onAgendar}
      disabled={!livre}
      className={cn(
        'paralelo font-display h-[clamp(3.25rem,7dvh,4rem)] w-full text-xl tracking-wider uppercase transition-transform duration-100 active:scale-[0.98]',
        livre ? 'bg-ouro-9 text-preto active:bg-ouro-10' : 'bg-carvao-4 text-carvao-10',
      )}
    >
      {texto}
    </button>
  )
}
