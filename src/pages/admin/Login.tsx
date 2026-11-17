// Porta do painel: só a senha do professor.
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { sessao } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'

export function Login() {
  const qc = useQueryClient()
  const [senha, setSenha] = useState('')
  const entrar = useMutation({
    mutationFn: () => sessao.entrar(senha),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessao'] }),
  })
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
      <Link to="/" className="font-cond absolute top-[max(env(safe-area-inset-top),1rem)] left-4 flex h-11 items-center gap-2 px-2 text-sm font-bold tracking-widest text-carvao-11 uppercase active:text-carvao-12">
        <ArrowLeft className="size-5" /> Agenda
      </Link>
      <img src="/escudo.webp" alt="" className="mx-auto h-36 w-auto" />
      <h1 className="font-display mt-6 -skew-x-6 text-center text-4xl uppercase">Painel do professor</h1>
      <form className="mt-8 space-y-3" onSubmit={(e) => { e.preventDefault(); entrar.mutate() }}>
        <label htmlFor="senha" className="font-cond text-sm font-semibold tracking-widest text-carvao-11 uppercase">Senha</label>
        <Entrada id="senha" type="password" autoComplete="current-password" autoFocus value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full" />
        {entrar.error && <p role="alert" className="text-ouro-11">{entrar.error.message}</p>}
        <Botao disabled={!senha || entrar.isPending}>{entrar.isPending ? 'Entrando…' : 'Entrar'}</Botao>
      </form>
    </main>
  )
}
