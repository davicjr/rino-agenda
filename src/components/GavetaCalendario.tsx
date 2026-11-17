// Calendário do mês no tema da equipe: mesmos chips da semana, folga riscada,
// bloqueio em vermelho e hoje com o pontinho. Troca de mês com setas e animação.
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { diaDoMes, diaSemana, nomeMes, primeiroDoMes, somarDias, somarMeses } from '@/lib/datas'
import { estiloDia, estiloNumero } from '@/lib/estiloDia'
import { reduzirMovimento } from '@/lib/impacto'
import { Gaveta } from '@/ui/Gaveta'

type Props = {
  aberta: boolean
  hoje: string
  selecionado: string
  diasComAula: Set<number>
  bloqueados: Set<string>
  min: string
  max: string
  onFechar: () => void
  onEscolher: (d: string) => void
}

const INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function GavetaCalendario({ aberta, hoje, selecionado, diasComAula, bloqueados, min, max, onFechar, onEscolher }: Props) {
  const [mes, setMes] = useState(primeiroDoMes(selecionado))
  const [direcao, setDirecao] = useState(1)
  const grade = useRef<HTMLDivElement>(null)
  const inicio = somarDias(mes, -diaSemana(mes))
  const semanas = Math.ceil((diaSemana(mes) + diasNoMes(mes)) / 7)
  const dias = Array.from({ length: semanas * 7 }, (_, i) => somarDias(inicio, i))
  const podeVoltar = somarDias(mes, -1) >= min
  const podeAvancar = somarMeses(mes, 1) <= max

  const trocar = (n: number) => {
    setDirecao(n)
    setMes(somarMeses(mes, n))
  }

  useGSAP(
    () => {
      if (reduzirMovimento() || !grade.current) return
      gsap.fromTo(grade.current, { x: 28 * direcao, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'expo.out' })
    },
    { dependencies: [mes] },
  )

  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Escolher dia">
      <div className="pb-2">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => trocar(-1)} disabled={!podeVoltar} aria-label="Mês anterior" className="-ml-2.5 grid size-11 place-items-center disabled:text-carvao-6">
            <ChevronLeft className="size-6" />
          </button>
          <p className="font-display -skew-x-6 text-2xl tracking-wide uppercase">
            {nomeMes(mes)} <span className="text-ouro-9">{mes.slice(0, 4)}</span>
          </p>
          <button onClick={() => trocar(1)} disabled={!podeAvancar} aria-label="Próximo mês" className="-mr-2.5 grid size-11 place-items-center disabled:text-carvao-6">
            <ChevronRight className="size-6" />
          </button>
        </div>
        <div aria-hidden className="font-cond mb-1.5 grid grid-cols-7 gap-1 text-center text-xs font-bold text-carvao-9">
          {INICIAIS.map((l, i) => <span key={i}>{l}</span>)}
        </div>
        <div ref={grade} className="grid grid-cols-7 gap-1">
          {dias.map((d) => {
            const fora = d.slice(0, 7) !== mes.slice(0, 7)
            const bloq = bloqueados.has(d)
            const estado = { sel: d === selecionado, bloq, tem: diasComAula.has(diaSemana(d)) && !bloq, passado: d < hoje }
            return (
              <button
                key={d}
                disabled={d < min || d > max}
                onClick={() => onEscolher(d)}
                aria-label={`${diaDoMes(d)} de ${nomeMes(d)}`}
                aria-pressed={estado.sel}
                className={cn(estiloDia(estado), 'h-11', fora && 'invisible')}
              >
                <span className={cn('text-lg', estiloNumero(estado))}>{diaDoMes(d)}</span>
                {d === hoje && <span className={cn('absolute bottom-1 size-1 rounded-full', estado.sel ? 'bg-preto' : 'bg-ouro-9')} />}
              </button>
            )
          })}
        </div>
        <div className="font-cond mt-4 flex justify-center gap-5 text-xs font-bold tracking-wider text-carvao-10 uppercase">
          <span className="flex items-center gap-1.5"><span className="size-2.5 bg-carvao-3" /> Aula</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 bg-alerta-9" /> Sem aula</span>
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-ouro-9" /> Hoje</span>
        </div>
      </div>
    </Gaveta>
  )
}

function diasNoMes(primeiro: string) {
  return diaDoMes(somarDias(somarMeses(primeiro, 1), -1))
}
