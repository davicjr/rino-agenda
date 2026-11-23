// Trocar a senha do painel: senha atual, a nova e a repetição. A sessão deste aparelho continua aberta.
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import { admin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Rotulo } from '@/ui/Rotulo'

const MIN = 8

export function FormSenha() {
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [repete, setRepete] = useState('')
  const [ver, setVer] = useState(false)
  const trocar = useAcao((v: { atual: string; nova: string }) => admin.trocarSenha(v.atual, v.nova), [], 'Senha alterada.')
  const problema = nova && nova.length < MIN ? `Use pelo menos ${MIN} caracteres.` : repete && repete !== nova ? 'As senhas não são iguais.' : ''
  const pronto = !!atual && nova.length >= MIN && nova === repete
  const tipo = ver ? 'text' : 'password'
  return (
    <form
      className="space-y-4 [@media(max-height:620px)]:space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (pronto) trocar.mutate({ atual, nova }, { onSuccess: () => { setAtual(''); setNova(''); setRepete('') } })
      }}
    >
      <div>
        <Rotulo htmlFor="senha-atual">Senha atual</Rotulo>
        <Entrada id="senha-atual" type={tipo} autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} />
      </div>
      <div>
        <Rotulo htmlFor="senha-nova" ajuda={`Mínimo de ${MIN} caracteres. Ao trocar, os outros aparelhos precisam entrar de novo.`}>Senha nova</Rotulo>
        <Entrada id="senha-nova" type={tipo} autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />
      </div>
      <div>
        <Rotulo htmlFor="senha-repete">Repita a senha nova</Rotulo>
        <Entrada id="senha-repete" type={tipo} autoComplete="new-password" value={repete} onChange={(e) => setRepete(e.target.value)} />
      </div>
      <p role="alert" className="min-h-5 text-sm text-alerta-11">{problema}</p>
      <button type="button" onClick={() => setVer(!ver)} className="flex h-11 items-center gap-2 text-sm font-semibold text-carvao-11">
        {ver ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {ver ? 'Esconder senhas' : 'Mostrar senhas'}
      </button>
      <Botao disabled={!pronto || trocar.isPending}>{trocar.isPending ? 'Salvando…' : 'Trocar senha'}</Botao>
    </form>
  )
}
