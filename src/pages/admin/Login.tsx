// Porta do painel no estilo do cartaz: escudo sobre uma faixa amarela inclinada,
// senha com mostrar/esconder e o formulário tremendo quando a senha está errada.
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import { Link } from 'react-router'
import { sessao } from '@/lib/apiAdmin'
import { cn } from '@/lib/cn'
import { caixaCampo } from '@/ui/Campo'
import { reduzirMovimento } from '@/lib/impacto'

export function Login() {
  const qc = useQueryClient()
  const raiz = useRef<HTMLElement>(null)
  const [senha, setSenha] = useState('')
  const [ver, setVer] = useState(false)
  const entrar = useMutation({
    mutationFn: () => sessao.entrar(senha),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessao'] }),
    onError: () => {
      if (!reduzirMovimento()) gsap.to('.formulario', { keyframes: { x: [0, -10, 8, -5, 3, 0] }, duration: 0.4, ease: 'power2.out' })
    },
  })

  useGSAP(
    () => {
      if (reduzirMovimento()) return
      // O escudo fica sólido antes de a faixa abrir, de trás dele para os dois lados.
      gsap.timeline()
        .from('.escudo-login', { opacity: 0, duration: 0.14, ease: 'none' }, 0)
        .from('.escudo-login', { y: -22, scale: 1.14, duration: 0.5, ease: 'expo.out' }, 0)
        .fromTo('.faixa', { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 0.6, ease: 'expo.out' }, 0.2)
        .from('.entra', { y: 16, opacity: 0, duration: 0.45, ease: 'expo.out', stagger: 0.06, clearProps: 'transform,opacity' }, 0.34)
    },
    { scope: raiz },
  )

  return (
    <main ref={raiz} className="relative mx-auto flex min-h-dvh max-w-sm flex-col overflow-x-clip px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <Link to="/" className="font-cond -ml-2 flex h-11 w-fit items-center gap-2 px-2 text-sm font-bold tracking-widest text-carvao-10 uppercase active:text-carvao-12">
        <ArrowLeft className="size-5" /> Agenda
      </Link>

      <div className="flex flex-1 flex-col justify-center">
        <div className="relative mx-auto grid h-40 w-full place-items-center">
          <span aria-hidden className="faixa absolute top-1/2 left-1/2 h-12 w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-6">
            <span className="paralelo block size-full bg-ouro-9" />
          </span>
          <img src="/escudo.webp" alt="Rino Fight Team" className="escudo-login relative h-40 w-auto drop-shadow-[0_3px_6px_rgb(0_0_0/0.45)]" />
        </div>

        <h1 className="entra font-display mt-8 -skew-x-6 text-center text-4xl leading-none uppercase">Área administrativa</h1>

        <form className="formulario mt-7" onSubmit={(e) => { e.preventDefault(); entrar.mutate() }}>
          <label htmlFor="senha" className="entra font-cond mb-1.5 block text-xs font-bold tracking-[0.16em] text-carvao-10 uppercase">Senha</label>
          <div className={cn('entra', caixaCampo)}>
            <Lock className="size-5 shrink-0 text-carvao-9" />
            <input
              id="senha"
              type={ver ? 'text' : 'password'}
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent outline-none focus-visible:outline-none"
            />
            <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Esconder senha' : 'Mostrar senha'} className="-mr-2 grid size-11 place-items-center text-carvao-9 active:text-carvao-12">
              {ver ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          <p role="alert" className="mt-2 min-h-6 text-sm text-alerta-11">{entrar.error?.message}</p>
          <button
            disabled={!senha || entrar.isPending}
            className="entra paralelo font-display mt-2 flex h-14 w-full items-center justify-center gap-2 bg-ouro-9 text-xl tracking-wider text-preto uppercase transition-transform duration-100 active:scale-[0.98] disabled:opacity-50"
          >
            {entrar.isPending ? 'Entrando…' : <>Entrar <ArrowRight className="size-5" /></>}
          </button>
        </form>
      </div>

      <p className="font-cond text-center text-xs font-bold tracking-[0.3em] text-carvao-8 uppercase">Rino Fight Team · Muay Thai</p>
    </main>
  )
}
