// O dia em abas de horário: abre no primeiro horário que ainda não passou,
// e o card desliza para o lado da aba tocada (ou do dia escolhido).
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Agendado, Horario, RegrasJanela } from '@/lib/api'
import { reduzirMovimento } from '@/lib/impacto'
import { AbasHorarios } from './AbasHorarios'
import { CardAula } from './CardAula'

type Props = {
  horarios: Horario[]
  regras?: RegrasJanela
  direcaoDia: number
  pulsos: Record<number, number>
  onAgendar: (h: Horario) => void
  onTocarNome: (a: Agendado, h: Horario) => void
}

const inicial = (hs: Horario[]) => (hs.find((h) => h.aberto && !h.bloqueio) ?? hs[0])?.id

export function SessaoDia({ horarios, regras, direcaoDia, pulsos, onAgendar, onTocarNome }: Props) {
  const [sel, setSel] = useState(() => inicial(horarios))
  const [direcao, setDirecao] = useState(direcaoDia)
  const palco = useRef<HTMLDivElement>(null)
  const atual = horarios.find((h) => h.id === sel) ?? horarios[0]

  const escolher = (id: number) => {
    const de = horarios.findIndex((h) => h.id === sel)
    const para = horarios.findIndex((h) => h.id === id)
    setDirecao(para >= de ? 1 : -1)
    setSel(id)
  }

  useGSAP(
    () => {
      if (reduzirMovimento() || !palco.current) return
      gsap.fromTo(palco.current, { x: 48 * direcao, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out', clearProps: 'transform' })
    },
    { dependencies: [atual?.id] },
  )

  if (!atual) return null
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[var(--folga-m)]">
      <AbasHorarios horarios={horarios} selecionado={atual.id} onSelecionar={escolher} />
      <div ref={palco} className="flex min-h-0 flex-1 flex-col">
        <CardAula horario={atual} regras={regras} pulso={pulsos[atual.id] ?? 0} onAgendar={onAgendar} onTocarNome={onTocarNome} />
      </div>
    </div>
  )
}
