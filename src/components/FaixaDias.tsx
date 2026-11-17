// Faixa rolável com os próximos dias. Rolagem nativa com snap dá a inércia do dedo.
import { useEffect, useRef } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/cn'
import { diaDoMes, diaSemana, nomeDiaCurto, somarDias } from '@/lib/datas'

type Props = { hoje: string; dias: number; diasComAula: Set<number>; selecionado: string; onSelecionar: (d: string) => void; onCalendario: () => void }

export function FaixaDias({ hoje, dias, diasComAula, selecionado, onSelecionar, onCalendario }: Props) {
  const lista = Array.from({ length: dias }, (_, i) => somarDias(hoje, i))
  const ativo = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    ativo.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [selecionado])

  return (
    <nav aria-label="Escolher dia" className="relative z-10 mt-6">
      <div className="sem-barra flex snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-px-5 px-5 pb-1">
        {lista.map((d) => {
          const tem = diasComAula.has(diaSemana(d))
          const sel = d === selecionado
          return (
            <button
              key={d}
              ref={sel ? ativo : undefined}
              onClick={() => onSelecionar(d)}
              aria-pressed={sel}
              className={cn(
                'paralelo flex h-[4.5rem] w-14 shrink-0 snap-start flex-col items-center justify-center transition-colors duration-150',
                sel ? 'bg-sangue-9 text-branco' : tem ? 'bg-carvao-3 text-carvao-12 active:bg-carvao-4' : 'bg-carvao-2 text-carvao-8',
              )}
            >
              <span className="font-cond text-xs font-semibold tracking-widest">{d === hoje ? 'HOJE' : nomeDiaCurto(d)}</span>
              <span className="font-display text-2xl leading-tight">{diaDoMes(d)}</span>
              {!tem && <span className="font-cond text-[11px] leading-none uppercase">folga</span>}
            </button>
          )
        })}
        <button
          onClick={onCalendario}
          aria-label="Abrir calendário"
          className="paralelo flex h-[4.5rem] w-14 shrink-0 snap-start items-center justify-center bg-carvao-4 text-carvao-12 active:bg-carvao-5"
        >
          <CalendarDays className="size-6" />
        </button>
      </div>
    </nav>
  )
}
