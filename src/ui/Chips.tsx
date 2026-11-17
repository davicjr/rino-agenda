// Seletor segmentado em chips inclinados; o chip ativo fica amarelo.
import { cn } from '@/lib/cn'

type Props<T extends string | number> = { opcoes: { valor: T; rotulo: string; marca?: boolean }[]; valor: T; onMudar: (v: T) => void; rotulo: string }

export function Chips<T extends string | number>({ opcoes, valor, onMudar, rotulo }: Props<T>) {
  return (
    <div role="tablist" aria-label={rotulo} className="sem-barra -mx-5 flex gap-1.5 overflow-x-auto px-5">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          role="tab"
          aria-selected={o.valor === valor}
          onClick={() => onMudar(o.valor)}
          className={cn(
            'paralelo font-cond relative h-11 min-w-14 shrink-0 px-4 text-sm font-bold tracking-widest uppercase transition-colors duration-200',
            o.valor === valor ? 'bg-ouro-9 text-preto' : 'bg-carvao-3 text-carvao-11 active:bg-carvao-4',
          )}
        >
          {o.rotulo}
          {o.marca && o.valor !== valor && <span className="absolute top-1.5 right-2.5 size-1.5 rounded-full bg-ouro-9" />}
        </button>
      ))}
    </div>
  )
}
