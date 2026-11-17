// Ocupação como barra de energia segmentada: cada segmento é uma vaga.
import { cn } from '@/lib/cn'

export function MedidorVagas({ ocupadas, vagas }: { ocupadas: number; vagas: number }) {
  const livres = Math.max(vagas - ocupadas, 0)
  return (
    <div>
      <div className="flex gap-[3px]" role="meter" aria-valuemin={0} aria-valuemax={vagas} aria-valuenow={ocupadas} aria-label="Vagas ocupadas">
        {Array.from({ length: vagas }, (_, i) => (
          <span
            key={i}
            className={cn('h-2.5 flex-1 -skew-x-[20deg] transition-colors duration-300', i < ocupadas ? 'bg-sangue-9' : 'bg-carvao-5')}
          />
        ))}
      </div>
      <p className="font-cond mt-1.5 text-sm font-semibold tracking-wide text-carvao-11">
        {livres === 0 ? 'Sem vagas' : `${livres} ${livres === 1 ? 'vaga livre' : 'vagas livres'}`}
        <span className="text-carvao-8"> · {ocupadas}/{vagas}</span>
      </p>
    </div>
  )
}
