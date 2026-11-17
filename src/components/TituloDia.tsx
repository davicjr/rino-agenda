// Título do dia escolhido, grande e inclinado como os cartazes da equipe.
// Ao trocar de dia, as duas linhas entram com máscara, na direção do dia escolhido.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { diaDoMes, mesCurto, nomeDia } from '@/lib/datas'
import { reduzirMovimento } from '@/lib/impacto'

export function TituloDia({ data, hoje, direcao }: { data: string; hoje: string; direcao: number }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(
    () => {
      if (reduzirMovimento()) return
      gsap.fromTo(
        '.linha',
        { xPercent: 18 * direcao, opacity: 0, clipPath: direcao >= 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
        { xPercent: 0, opacity: 1, clipPath: 'inset(0 0% 0 0%)', duration: 0.55, ease: 'expo.out', stagger: 0.06 },
      )
    },
    { dependencies: [data], scope: ref },
  )
  return (
    <h1 ref={ref} className="font-display relative z-10 mt-7 -skew-x-6 px-5 leading-[0.82] uppercase">
      <span className="linha block text-[clamp(3.5rem,19vw,6rem)]">{data === hoje ? 'Hoje' : nomeDia(data)}</span>
      <span className="linha block text-[clamp(1.75rem,9vw,3rem)] text-ouro-9">
        {diaDoMes(data)} {mesCurto(data)}
      </span>
    </h1>
  )
}
