// Bloquear o dia inteiro ou um horário, com o motivo que os alunos vão ver.
import { useState } from 'react'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

type Props = { alvo: { titulo: string } | null; enviando: boolean; onFechar: () => void; onConfirmar: (motivo: string) => void }

export function GavetaBloqueio({ alvo, enviando, onFechar, onConfirmar }: Props) {
  const [motivo, setMotivo] = useState('Feriado')
  return (
    <Gaveta aberta={!!alvo} onFechar={onFechar} titulo="Bloquear" descricao={alvo?.titulo}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onConfirmar(motivo) }}>
        <div>
          <Rotulo htmlFor="motivo">Motivo (os alunos veem)</Rotulo>
          <Entrada id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full" maxLength={80} />
        </div>
        <Botao disabled={enviando}>Bloquear</Botao>
      </form>
    </Gaveta>
  )
}
