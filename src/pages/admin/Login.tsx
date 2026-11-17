// Porta do painel: só a senha do professor.
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
      <img src="/escudo.webp" alt="" className="mx-auto size-24" />
      <h1 className="font-display mt-6 -skew-x-6 text-center text-4xl uppercase">Painel do professor</h1>
      <form className="mt-8 space-y-3" onSubmit={(e) => { e.preventDefault(); entrar.mutate() }}>
        <label htmlFor="senha" className="font-cond text-sm font-semibold tracking-widest text-carvao-11 uppercase">Senha</label>
        <Entrada id="senha" type="password" autoComplete="current-password" autoFocus value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full" />
        {entrar.error && <p role="alert" className="text-sangue-11">{entrar.error.message}</p>}
        <Botao disabled={!senha || entrar.isPending}>{entrar.isPending ? 'Entrando…' : 'Entrar'}</Botao>
      </form>
    </main>
  )
}
