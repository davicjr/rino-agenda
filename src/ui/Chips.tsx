// Seletor segmentado em chips inclinados; o chip ativo fica amarelo.
import { cn } from '@/lib/cn'

type Props<T extends string | number> = { opcoes: { valor: T; rotulo: string; marca?: boolean }[]; valor: T; onMudar: (v: T) => void; rotulo: string }

export function Chips<T extends string | number>({ opcoes, valor, onMudar, rotulo }: Props<T>) {
  return (
    <div role="tablist" aria-label={rotulo} className="grid auto-cols-fr grid-flow-col gap-1.5">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={o.valor === valor}
          onClick={() => onMudar(o.valor)}
          className={cn(
            'paralelo font-cond relative h-11 min-w-0 px-1 text-xs font-bold tracking-wider uppercase transition-colors duration-200',
            o.valor === valor ? 'bg-ouro-9 text-preto' : 'bg-carvao-3 text-carvao-11 active:bg-carvao-4',
          )}
        >
          {o.rotulo}
          {o.marca && o.valor !== valor && <span className="absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ouro-9" />}
        </button>
      ))}
    </div>
  )
}
