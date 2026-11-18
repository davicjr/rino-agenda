// Vagas do horário em duas peças: o resumo no topo do card e a barra de energia segmentada.
// Os segmentos novos enchem em sequência; na primeira vez, a barra inteira enche.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'

// Turma grande vira barra proporcional, para os segmentos não ficarem finos demais.
const SEGMENTOS_MAX = 30

export function ResumoVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number | null }) {
  const livres = vagas === null ? null : Math.max(vagas - ocupadas, 0)
  return (
    <p className="shrink-0 text-right">
      <span className="font-cond block text-xs font-bold tracking-wider text-carvao-10 uppercase">{livres === null ? 'Vagas' : livres === 1 ? 'Vaga livre' : 'Vagas livres'}</span>
      <span className="font-display mt-0.5 block text-2xl leading-7 tracking-wide text-ouro-9 uppercase tabular-nums">{livres ?? 'Livre'}</span>
    </p>
  )
}

export function BarraVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number }) {
  const total = Math.min(vagas, SEGMENTOS_MAX)
  const cheios = vagas > SEGMENTOS_MAX ? (ocupadas ? Math.max(1, Math.round((ocupadas / vagas) * total)) : 0) : ocupadas
  const raiz = useRef<HTMLDivElement>(null)
  const anterior = useRef(0)
  useGSAP(
    () => {
      const de = Math.min(anterior.current, cheios)
      anterior.current = cheios
      if (reduzirMovimento() || cheios <= de) return
      const novos = gsap.utils.toArray<HTMLElement>('.seg').slice(de, cheios)
      gsap.fromTo(novos, { scaleY: 0.2, opacity: 0.2 }, { scaleY: 1, opacity: 1, duration: 0.35, ease: 'expo.out', stagger: 0.035, delay: 0.15 })
    },
    { dependencies: [cheios], scope: raiz },
  )
  return (
    <div ref={raiz} className="flex gap-[3px]" role="meter" aria-valuemin={0} aria-valuemax={vagas} aria-valuenow={ocupadas} aria-label="Vagas ocupadas">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn('seg h-2 flex-1 -skew-x-[20deg] transition-colors duration-300', i < cheios ? 'bg-ouro-9' : 'bg-carvao-5')} />
      ))}
    </div>
  )
}
