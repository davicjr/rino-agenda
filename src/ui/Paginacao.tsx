// Seletor de páginas: anterior, "1 de 3" e próxima. Some quando cabe numa página só.
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = { pagina: number; paginas: number; onIr: (pagina: number) => void; rotulo?: string }

const botao = 'paralelo grid size-11 place-items-center bg-carvao-4 text-carvao-12 active:bg-carvao-5 disabled:text-carvao-7'

export function Paginacao({ pagina, paginas, onIr, rotulo = 'Páginas de alunos' }: Props) {
  if (paginas <= 1) return null
  return (
    <nav aria-label={rotulo} className="flex items-center gap-1">
      <button type="button" onClick={() => onIr(pagina - 1)} disabled={pagina === 1} aria-label="Página anterior" className={botao}><ChevronLeft className="size-5" /></button>
      <span aria-live="polite" className="font-cond min-w-12 text-center text-sm font-bold tracking-wider text-carvao-11 tabular-nums">{pagina} de {paginas}</span>
      <button type="button" onClick={() => onIr(pagina + 1)} disabled={pagina === paginas} aria-label="Próxima página" className={botao}><ChevronRight className="size-5" /></button>
    </nav>
  )
}
