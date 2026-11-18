// Botão "?" que abre uma explicação curta por cima da tela, sem empurrar o layout.
// Usa o popover nativo: fecha ao tocar fora e funciona dentro das gavetas.
import { useEffect, useId, useRef, type ReactNode } from 'react'

const MARGEM = 16
const LARGURA = 288

export function Ajuda({ assunto, children }: { assunto: string; children: ReactNode }) {
  const id = useId()
  const botao = useRef<HTMLButtonElement>(null)
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const posicionar = () => {
      const alvo = botao.current?.getBoundingClientRect()
      if (!alvo) return
      const largura = Math.min(LARGURA, window.innerWidth - MARGEM * 2)
      const centro = alvo.left + alvo.width / 2 - largura / 2
      const acima = alvo.top > window.innerHeight * 0.6
      el.style.width = `${largura}px`
      el.style.left = `${Math.min(Math.max(centro, MARGEM), window.innerWidth - largura - MARGEM)}px`
      el.style.top = acima ? 'auto' : `${alvo.bottom - 4}px`
      el.style.bottom = acima ? `${window.innerHeight - alvo.top - 4}px` : 'auto'
    }
    el.addEventListener('beforetoggle', posicionar)
    return () => el.removeEventListener('beforetoggle', posicionar)
  }, [])

  return (
    <>
      <button ref={botao} type="button" popoverTarget={id} aria-label={`Ajuda: ${assunto}`} className="-mx-3 -my-3.5 grid size-11 shrink-0 place-items-center">
        <span aria-hidden className="paralelo font-cond grid h-5 w-6 place-items-center bg-carvao-6 text-xs font-bold text-carvao-12">?</span>
      </button>
      <div ref={caixa} id={id} popover="auto" className="paralelo animate-surge fixed right-auto m-0 border-0 bg-carvao-5 px-4 py-3 text-sm leading-snug font-normal tracking-normal text-carvao-12 normal-case">
        {children}
      </div>
    </>
  )
}
