// Número que dá para digitar ou ajustar com menos e mais, no padrão dos campos.
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { caixaCampo } from './Campo'

type Props = { valor: number; onMudar: (v: number) => void; min?: number; max?: number; rotulo: string; id?: string }

const botao = 'paralelo grid h-10 w-10 shrink-0 place-items-center bg-carvao-5 active:bg-carvao-6'

export function Contador({ valor, onMudar, min = 1, max = 999, rotulo, id }: Props) {
  const [texto, setTexto] = useState(String(valor))
  const limitar = (n: number) => Math.min(max, Math.max(min, n))
  const definir = (n: number) => { const v = limitar(n); setTexto(String(v)); onMudar(v) }
  return (
    <div className={cn(caixaCampo, 'justify-between gap-1 px-1')} role="group" aria-label={rotulo}>
      <button type="button" aria-label="Menos" onClick={() => definir(valor - 1)} className={botao}><Minus className="size-5" /></button>
      <input
        id={id}
        inputMode="numeric"
        aria-label={rotulo}
        value={texto}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, '').slice(0, String(max).length)
          setTexto(digitos)
          if (digitos) onMudar(limitar(Number(digitos)))
        }}
        onBlur={() => setTexto(String(valor))}
        className="font-display h-full w-full min-w-0 bg-transparent text-center text-2xl tabular-nums outline-none focus-visible:outline-none"
      />
      <button type="button" aria-label="Mais" onClick={() => definir(valor + 1)} className={botao}><Plus className="size-5" /></button>
    </div>
  )
}
