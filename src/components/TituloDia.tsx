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
    <h1 ref={ref} className="relative z-10 mt-6 flex items-baseline gap-3 px-5 uppercase">
      <span className="linha font-display block origin-bottom-left -skew-x-6 text-[clamp(2.75rem,13vw,4.5rem)] leading-[0.9]">
        {data === hoje ? 'Hoje' : nomeDia(data)}
      </span>
      <span className="linha font-cond block text-[clamp(1.1rem,5vw,1.5rem)] font-bold tracking-wider text-ouro-9">
        {diaDoMes(data)} {mesCurto(data)}
      </span>
    </h1>
  )
}
