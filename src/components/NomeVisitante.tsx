// Experimental: a pessoa só digita o nome. Não precisa de cadastro.
import { useState } from 'react'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Rotulo } from '@/ui/Rotulo'

export function NomeVisitante({ onContinuar }: { onContinuar: (nome: string) => void }) {
  const [nome, setNome] = useState('')
  const limpo = nome.trim().replace(/\s+/g, ' ')
  return (
    <form className="animate-surge" onSubmit={(e) => { e.preventDefault(); if (limpo.length >= 2) onContinuar(limpo) }}>
      <Rotulo htmlFor="nome-experimental" ajuda="Para quem vem conhecer a aula. Basta o nome, sem cadastro.">Nome de quem vai treinar</Rotulo>
      <Entrada id="nome-experimental" value={nome} maxLength={60} autoComplete="off" placeholder="Nome e sobrenome" onChange={(e) => setNome(e.target.value)} />
      <Botao className="mt-4" disabled={limpo.length < 2}>Continuar</Botao>
    </form>
  )
}
