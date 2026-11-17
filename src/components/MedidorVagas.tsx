// Ocupação como barra de energia segmentada: cada segmento é uma vaga.
// Os segmentos novos enchem em sequência; na primeira vez, a barra inteira enche.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'

export function MedidorVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number }) {
  const livres = Math.max(vagas - ocupadas, 0)
  const raiz = useRef<HTMLDivElement>(null)
  const anterior = useRef(0)
  useGSAP(
    () => {
      const de = Math.min(anterior.current, ocupadas)
      anterior.current = ocupadas
      if (reduzirMovimento() || ocupadas <= de) return
      const novos = gsap.utils.toArray<HTMLElement>('.seg').slice(de, ocupadas)
      gsap.fromTo(novos, { scaleY: 0.2, opacity: 0.2 }, { scaleY: 1, opacity: 1, duration: 0.35, ease: 'expo.out', stagger: 0.035, delay: 0.15 })
    },
    { dependencies: [ocupadas], scope: raiz },
  )
  return (
    <div ref={raiz}>
      <p className="font-cond mb-1.5 flex items-baseline justify-between text-sm font-semibold tracking-wide">
        <span className="text-carvao-12">{livres === 0 ? 'Sem vagas' : `${livres} ${livres === 1 ? 'vaga livre' : 'vagas livres'}`}</span>
        <span className="text-carvao-9 tabular-nums">{ocupadas}/{vagas}</span>
      </p>
      <div className="flex gap-[3px]" role="meter" aria-valuemin={0} aria-valuemax={vagas} aria-valuenow={ocupadas} aria-label="Vagas ocupadas">
        {Array.from({ length: vagas }, (_, i) => (
          <span key={i} className={cn('seg h-2 flex-1 -skew-x-[20deg] transition-colors duration-300', i < ocupadas ? 'bg-ouro-9' : 'bg-carvao-5')} />
        ))}
      </div>
    </div>
  )
}
