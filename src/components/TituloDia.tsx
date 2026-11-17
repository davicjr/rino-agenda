// Título do dia escolhido, grande e inclinado como os cartazes da equipe.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduzirMovimento } from '@/lib/impacto'
import { diaDoMes, mesCurto, nomeDia } from '@/lib/datas'

export function TituloDia({ data, hoje }: { data: string; hoje: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(() => {
    if (reduzirMovimento()) return
    gsap.from(ref.current, { xPercent: -6, opacity: 0, duration: 0.32, ease: 'expo.out' })
  }, { dependencies: [data], revertOnUpdate: true })
  return (
    <h1 ref={ref} className="font-display relative z-10 mt-7 -skew-x-6 px-5 leading-[0.82] uppercase">
      <span className="block text-[clamp(3.5rem,19vw,6rem)]">{data === hoje ? 'Hoje' : nomeDia(data).replace('-feira', '')}</span>
      <span className="block text-[clamp(1.75rem,9vw,3rem)] text-sangue-10">
        {diaDoMes(data)} {mesCurto(data)}
      </span>
    </h1>
  )
}
