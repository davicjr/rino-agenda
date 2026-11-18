// Alunos do horário em páginas: mede o espaço do card e mostra só os nomes que cabem,
// sem rolagem. Ao agendar, vai para a última página, onde o nome novo aparece.
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Agendado } from '@/lib/api'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'
import { paginar } from '@/lib/paginar'
import { Avatar } from '@/ui/Avatar'

type Props = { titulo: string; vazio: string; agendados: Agendado[]; pulso: number; podeRetirar: boolean; onTocar: (a: Agendado) => void }

// Linha mínima confortável ao toque; em tela alta sobra mais respiro por aluno.
const linhaMinima = (alturaTela: number) => (alturaTela >= 800 ? 56 : 48)

const botaoPagina = 'paralelo grid size-11 place-items-center bg-carvao-4 text-carvao-12 active:bg-carvao-5 disabled:text-carvao-7'

export function ListaAlunos({ titulo, vazio, agendados, pulso, podeRetirar, onTocar }: Props) {
  const area = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLOListElement>(null)
  const direcao = useRef(1)
  const [porPagina, setPorPagina] = useState(4)
  const [alturaLinha, setAlturaLinha] = useState(56)
  const [pedida, setPedida] = useState(1)
  const n = agendados.length
  const { pagina, paginas, inicio, fim } = paginar(n, porPagina, pedida)
  const ultimo = agendados[n - 1]?.id

  useLayoutEffect(() => {
    const el = area.current
    if (!el || !n) return
    const medir = () => {
      const qtd = Math.max(1, Math.floor(el.clientHeight / linhaMinima(window.innerHeight)))
      setPorPagina(qtd)
      setAlturaLinha(Math.min(el.clientHeight / qtd, 72))
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [n])

  const [pulsoVisto, setPulsoVisto] = useState(pulso)
  if (pulso !== pulsoVisto) {
    setPulsoVisto(pulso)
    if (pulso) setPedida(Number.MAX_SAFE_INTEGER) // paginar() ajusta para a última página, mesmo antes da lista recarregar
  }

  const irPara = (p: number) => {
    direcao.current = p > pagina ? 1 : -1
    setPedida(p)
  }

  useGSAP(
    () => {
      if (reduzirMovimento() || (pagina === 1 && direcao.current === 1)) return
      gsap.fromTo(lista.current, { x: 28 * direcao.current, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'expo.out' })
    },
    { dependencies: [pagina] },
  )

  return (
    <section className="relative flex min-h-0 flex-1 flex-col border-t border-carvao-4 px-5 pt-[var(--folga-p)]">
      <div className="flex h-11 shrink-0 items-center justify-between gap-3">
        <h2 className="font-display flex items-baseline gap-2 text-xl tracking-wide uppercase">
          {titulo} <span className="text-ouro-9 tabular-nums">{n}</span>
        </h2>
        {paginas > 1 && (
          <nav aria-label="Páginas de alunos" className="flex items-center gap-1">
            <button onClick={() => irPara(pagina - 1)} disabled={pagina === 1} aria-label="Página anterior" className={botaoPagina}><ChevronLeft className="size-5" /></button>
            <span aria-live="polite" className="font-cond min-w-12 text-center text-sm font-bold tracking-wider text-carvao-11 tabular-nums">{pagina} de {paginas}</span>
            <button onClick={() => irPara(pagina + 1)} disabled={pagina === paginas} aria-label="Próxima página" className={botaoPagina}><ChevronRight className="size-5" /></button>
          </nav>
        )}
      </div>
      <div ref={area} className="min-h-0 flex-1 overflow-hidden">
        {n ? (
          <ol ref={lista}>
            {agendados.slice(inicio, fim).map((a, i) => (
              <li key={a.id} style={{ height: alturaLinha }} className={cn('border-b border-carvao-3 last:border-b-0', pulso && a.id === ultimo && 'nome-novo')}>
                <button disabled={!podeRetirar} onClick={() => onTocar(a)} className="flex h-full w-full items-center gap-3 text-left active:bg-carvao-3">
                  <span className="font-cond w-5 text-right text-sm text-carvao-9 tabular-nums">{inicio + i + 1}</span>
                  <Avatar nome={a.nome} tipo="aluno" id={a.aluno_id} foto={a.foto} className="size-10 text-sm" />
                  <span className="min-w-0 flex-1 truncate text-[1.0625rem] font-medium">{a.nome}</span>
                  {podeRetirar && <span className="font-cond text-xs font-bold tracking-wider text-carvao-10 uppercase">Retirar</span>}
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-3 text-carvao-10">{vazio}</p>
        )}
      </div>
    </section>
  )
}
