// Cards do dia. Ao trocar de dia, entram em cascata vindo do lado do dia escolhido.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Agendado, Horario } from '@/lib/api'
import { reduzirMovimento } from '@/lib/impacto'
import { CardHorario } from './CardHorario'

type Props = {
  data: string
  direcao: number
  horarios: Horario[]
  meuId: number | null
  pulsos: Record<number, number>
  onAgendar: (h: Horario) => void
  onTocarNome: (a: Agendado, h: Horario) => void
}

export function ListaHorarios({ data, direcao, horarios, meuId, pulsos, onAgendar, onTocarNome }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const chave = `${data}:${horarios.map((h) => h.id).join(',')}`
  useGSAP(
    () => {
      if (reduzirMovimento() || !horarios.length) return
      gsap.fromTo(
        '.card-horario',
        { x: 56 * direcao, opacity: 0, rotate: 1.5 * direcao },
        { x: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' },
      )
    },
    { dependencies: [chave], scope: raiz },
  )
  return (
    <div ref={raiz} className="space-y-3">
      {horarios.map((h) => (
        <div key={h.id} className="card-horario">
          <CardHorario horario={h} meuId={meuId} pulso={pulsos[h.id] ?? 0} onAgendar={onAgendar} onTocarNome={onTocarNome} />
        </div>
      ))}
    </div>
  )
}
