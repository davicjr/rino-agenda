// Vagas livres como barra de energia: cada segmento é uma vaga e a barra esvazia conforme agendam.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'

// Turma grande vira barra proporcional, para os segmentos não ficarem finos demais.
const SEGMENTOS_MAX = 30

export function MedidorVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number | null }) {
  return vagas === null ? <SemLimite ocupadas={ocupadas} /> : <BarraVagas ocupadas={ocupadas} vagas={vagas} />
}

function SemLimite({ ocupadas }: { ocupadas: number }) {
  return (
    <p className="font-cond flex items-baseline justify-between gap-2">
      <span className="flex items-baseline gap-2 text-base font-bold tracking-wide text-carvao-11 uppercase">
        <span className="font-display text-[clamp(1.875rem,4.6dvh,2.75rem)] leading-none text-ouro-9">Livre</span>
        sem limite de vagas
      </span>
      <span className="text-base font-semibold whitespace-nowrap text-carvao-10 tabular-nums">{ocupadas} {ocupadas === 1 ? 'aluno' : 'alunos'}</span>
    </p>
  )
}

function BarraVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number }) {
  const livres = Math.max(vagas - ocupadas, 0)
  const total = Math.min(vagas, SEGMENTOS_MAX)
  const cheios = vagas > SEGMENTOS_MAX ? (livres ? Math.max(1, Math.round((livres / vagas) * total)) : 0) : livres
  const raiz = useRef<HTMLDivElement>(null)
  const anterior = useRef(0)
  useGSAP(
    () => {
      const de = anterior.current
      anterior.current = cheios
      if (reduzirMovimento() || de === cheios) return
      const segmentos = gsap.utils.toArray<HTMLElement>('.seg')
      if (cheios > de) gsap.fromTo(segmentos.slice(de, cheios), { scaleY: 0.2, opacity: 0.2 }, { scaleY: 1, opacity: 1, duration: 0.35, ease: 'expo.out', stagger: 0.02 })
      else gsap.fromTo(segmentos.slice(cheios, de), { scaleY: 1.7 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' })
    },
    { dependencies: [cheios], scope: raiz },
  )
  return (
    <div ref={raiz}>
      <p className="font-cond mb-2 flex items-baseline gap-2 text-base font-bold tracking-wide text-carvao-11 uppercase">
        <span className={cn('font-display text-[clamp(1.875rem,4.6dvh,2.75rem)] leading-none tabular-nums', livres ? 'text-ouro-9' : 'text-alerta-11')}>{livres}</span>
        de {vagas} {vagas === 1 ? 'vaga livre' : 'vagas livres'}
      </p>
      <div className="flex gap-[3px] px-0.5" role="meter" aria-valuemin={0} aria-valuemax={vagas} aria-valuenow={livres} aria-valuetext={`${livres} de ${vagas} vagas livres`} aria-label="Vagas livres">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cn('seg h-3 flex-1 -skew-x-[20deg] transition-colors duration-300', i < cheios ? 'bg-ouro-9' : 'bg-carvao-5')} />
        ))}
      </div>
    </div>
  )
}
