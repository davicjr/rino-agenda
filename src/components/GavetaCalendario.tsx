// Calendário do mês para pular para um dia mais distante.
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { deData, paraData, somarDias } from '@/lib/datas'
import { Gaveta } from '@/ui/Gaveta'

type Props = { aberta: boolean; hoje: string; desde?: string; janela: number; diasComAula: Set<number>; selecionado: string; onFechar: () => void; onEscolher: (d: string) => void }

export function GavetaCalendario({ aberta, hoje, desde, janela, diasComAula, selecionado, onFechar, onEscolher }: Props) {
  const inicio = deData(desde ?? hoje)
  const fim = deData(somarDias(hoje, janela))
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Escolher dia">
      <DayPicker
        mode="single"
        locale={ptBR}
        selected={deData(selecionado)}
        defaultMonth={deData(selecionado)}
        startMonth={inicio}
        endMonth={fim}
        disabled={[{ before: inicio }, { after: fim }, (d) => !diasComAula.has(d.getDay())]}
        onSelect={(d) => d && onEscolher(paraData(d))}
        className="calendario mx-auto"
      />
    </Gaveta>
  )
}
