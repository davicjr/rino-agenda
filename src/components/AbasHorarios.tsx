// Abas com os horários do dia: hora e ocupação; lotado, encerrado e sem aula mudam a cor.
import type { Horario } from '@/lib/api'
import { cn } from '@/lib/cn'

type Props = { horarios: Horario[]; selecionado: number; onSelecionar: (id: number) => void }

export function AbasHorarios({ horarios, selecionado, onSelecionar }: Props) {
  return (
    <div role="tablist" aria-label="Horários do dia" className="sem-barra -mx-5 flex gap-1.5 overflow-x-auto px-5">
      {horarios.map((h) => {
        const sel = h.id === selecionado
        const n = h.agendados.length
        const status = h.bloqueio ? 'Sem aula' : !h.aberto ? 'Encerrado' : n >= h.vagas ? 'Lotado' : `${n}/${h.vagas}`
        const [hh, mm] = h.hora.split(':')
        return (
          <button
            key={h.id}
            role="tab"
            aria-selected={sel}
            onClick={() => onSelecionar(h.id)}
            className={cn(
              'paralelo flex h-15 min-w-[4.5rem] flex-1 shrink-0 flex-col items-center justify-center gap-0.5 transition-colors duration-300',
              sel ? 'bg-ouro-9 text-preto' : h.bloqueio ? 'bg-alerta-3 text-alerta-11' : !h.aberto ? 'bg-carvao-2 text-carvao-8' : 'bg-carvao-3 text-carvao-12 active:bg-carvao-4',
            )}
          >
            <span className="font-display text-xl leading-none">
              {hh}
              <span className="font-cond ml-0.5 text-sm font-bold">{mm === '00' ? 'h' : `:${mm}`}</span>
            </span>
            <span className={cn('font-cond text-[11px] font-bold tracking-wider uppercase', !sel && 'opacity-80')}>{status}</span>
          </button>
        )
      })}
    </div>
  )
}
