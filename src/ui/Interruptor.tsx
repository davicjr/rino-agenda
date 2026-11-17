// Liga/desliga no padrão da casa: linha de superfície com um interruptor em paralelogramo.
import { cn } from '@/lib/cn'

type Props = { rotulo: string; ligado: boolean; onMudar: (v: boolean) => void }

export function Interruptor({ rotulo, ligado, onMudar }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={() => onMudar(!ligado)}
      className="flex h-12 w-full items-center justify-between rounded-[var(--radius)] bg-carvao-3 px-4 text-left"
    >
      <span className="font-semibold">{rotulo}</span>
      <span className={cn('paralelo relative h-7 w-12 transition-colors duration-200', ligado ? 'bg-ouro-9' : 'bg-carvao-6')}>
        <span className={cn('paralelo absolute top-1 h-5 w-5 bg-preto transition-transform duration-200 ease-[var(--ease-saida)]', ligado ? 'translate-x-6' : 'translate-x-1')} />
      </span>
    </button>
  )
}
