// Notificação no padrão da Rino: corte diagonal, selo que "carimba" na entrada e barra de tempo.
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { reduzirMovimento } from '@/lib/impacto'

export type TipoAviso = 'sucesso' | 'info' | 'erro'

const VISUAL = {
  sucesso: { Icone: Check, fundo: 'bg-carvao-3', selo: 'bg-ouro-9 text-preto', barra: 'bg-ouro-9', titulo: 'text-carvao-12', detalhe: 'text-carvao-11', fechar: 'text-carvao-10' },
  info: { Icone: Info, fundo: 'bg-carvao-3', selo: 'bg-carvao-6 text-carvao-12', barra: 'bg-carvao-9', titulo: 'text-carvao-12', detalhe: 'text-carvao-11', fechar: 'text-carvao-10' },
  erro: { Icone: TriangleAlert, fundo: 'bg-alerta-3', selo: 'bg-alerta-9 text-branco', barra: 'bg-alerta-9', titulo: 'text-alerta-12', detalhe: 'text-alerta-12', fechar: 'text-alerta-11' },
}

type Props = { tipo: TipoAviso; titulo: string; detalhe?: string; duracao: number; onFechar: () => void }

export function Aviso({ tipo, titulo, detalhe, duracao, onFechar }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const v = VISUAL[tipo]
  useGSAP(
    () => {
      if (reduzirMovimento()) return
      gsap.timeline()
        .from('.aviso-selo', { scale: 1.7, rotate: -14, opacity: 0, duration: 0.3, ease: 'power4.in' }, 0.08)
        .from('.aviso-texto > *', { x: 14, opacity: 0, duration: 0.4, ease: 'expo.out', stagger: 0.05 }, 0.2)
    },
    { scope: raiz },
  )
  return (
    <div ref={raiz} role={tipo === 'erro' ? 'alert' : 'status'} className="group w-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.55)]">
      <div className={cn('paralelo relative flex min-h-15 items-center gap-2.5 overflow-hidden py-2 pl-2.5', v.fundo)}>
        <span className={cn('aviso-selo paralelo grid h-10 w-10 shrink-0 place-items-center', v.selo)}><v.Icone className="size-5" strokeWidth={2.75} /></span>
        <div className="aviso-texto min-w-0 flex-1">
          <p className={cn('font-display truncate text-lg leading-tight tracking-wide uppercase', v.titulo)}>{titulo}</p>
          {detalhe && <p className={cn('line-clamp-2 text-[0.8125rem] leading-snug', v.detalhe)}>{detalhe}</p>}
        </div>
        <button type="button" onClick={onFechar} aria-label="Fechar aviso" className={cn('grid h-11 w-9 shrink-0 place-items-center', v.fechar)}><X className="size-4" /></button>
        <span aria-hidden className={cn('aviso-tempo absolute inset-x-0 bottom-0 h-[3px] origin-left group-hover:[animation-play-state:paused]', v.barra)} style={{ animationDuration: `${duracao}ms` }} />
      </div>
    </div>
  )
}
