// Bloquear o dia inteiro ou um horário, com o motivo e uma observação opcional que os alunos veem.
import { useState } from 'react'
import { MOTIVO_MAX, NOTA_MAX } from '../../../../functions/_lib/texto'
import { cn } from '@/lib/cn'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

type Props = { alvo: { titulo: string } | null; enviando: boolean; onFechar: () => void; onConfirmar: (motivo: string, nota: string) => void }

export function GavetaBloqueio({ alvo, enviando, onFechar, onConfirmar }: Props) {
  return (
    <Gaveta aberta={!!alvo} onFechar={onFechar} titulo="Bloquear" descricao={alvo?.titulo}>
      {alvo && <Formulario key={alvo.titulo} enviando={enviando} onConfirmar={onConfirmar} />}
    </Gaveta>
  )
}

function Formulario({ enviando, onConfirmar }: { enviando: boolean; onConfirmar: Props['onConfirmar'] }) {
  const [motivo, setMotivo] = useState('Feriado')
  const [nota, setNota] = useState('')
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onConfirmar(motivo, nota) }}>
      <div>
        <Rotulo htmlFor="motivo">Motivo (os alunos veem)</Rotulo>
        <Entrada id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full" maxLength={MOTIVO_MAX} aria-describedby="motivo-limite" />
        <Contador id="motivo-limite" atual={motivo.length} max={MOTIVO_MAX} />
      </div>
      <div>
        <Rotulo htmlFor="nota">Observação (opcional)</Rotulo>
        <textarea
          id="nota"
          rows={3}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          maxLength={NOTA_MAX}
          aria-describedby="nota-limite"
          placeholder="Ex.: as aulas voltam na segunda, no horário normal."
          className="block w-full resize-none rounded-[var(--radius)] bg-carvao-4 p-3 text-base leading-snug text-carvao-12 outline-none placeholder:text-carvao-9 focus:ring-2 focus:ring-ouro-9"
        />
        <Contador id="nota-limite" atual={nota.length} max={NOTA_MAX} />
      </div>
      <Botao disabled={enviando}>Bloquear</Botao>
    </form>
  )
}

function Contador({ id, atual, max }: { id: string; atual: number; max: number }) {
  return <p id={id} className={cn('font-cond mt-1 text-right text-xs font-semibold tabular-nums', atual >= max ? 'text-ouro-11' : 'text-carvao-10')}>{atual}/{max}</p>
}
