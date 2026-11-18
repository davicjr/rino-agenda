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
    : j.estado === 'fechou' ? 'Agendamento fechado'
    : lotado ? 'Turma cheia'
    : `Agendar às ${horaCurta(h.hora)}`
  const dica =
    j.estado === 'cedo' && regras?.abreDiasAntes ? `O agendamento abre ${regras.abreDiasAntes} ${regras.abreDiasAntes === 1 ? 'dia' : 'dias'} antes da aula.`
    : j.estado === 'fechou' && regras ? `O agendamento fecha ${regras.fechaHorasAntes}h antes da aula.`
    : null
  return (
    <>
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
    {dica && <p className="font-cond mt-2 text-center text-sm text-carvao-10">{dica}</p>}
    </>
  )
}
