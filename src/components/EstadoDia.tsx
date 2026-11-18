// Carregando, erro, dia bloqueado e dia sem treino.
import { Lock } from 'lucide-react'
import type { Dia } from '@/lib/api'
import { cn } from '@/lib/cn'

export function EstadoDia({ carregando, erro, dia }: { carregando: boolean; erro: Error | null; dia?: Dia }) {
  if (erro) return <Aviso titulo="Sem conexão" texto="Não deu para carregar a agenda. Puxe para atualizar ou tente daqui a pouco." />
  if (carregando && !dia) {
    return (
      <div className="space-y-3" aria-label="Carregando">
        {[0, 1, 2].map((i) => <div key={i} className="corte h-36 animate-pulse bg-carvao-2" />)}
      </div>
    )
  }
  if (!dia) return null
  if (dia.bloqueioDia) return <Aviso titulo={dia.bloqueioDia} texto="Não tem treino neste dia." nota={dia.bloqueioDiaNota} bloqueio />
  if (!dia.horarios.length) return <Aviso titulo="Dia de folga" texto="Sem treino na grade. Descansa que amanhã tem." />
  return null
}

function Aviso({ titulo, texto, nota, bloqueio = false }: { titulo: string; texto: string; nota?: string | null; bloqueio?: boolean }) {
  return (
    <div className={cn('corte p-6', bloqueio ? 'bg-alerta-3' : 'bg-carvao-2')}>
      {bloqueio && <Lock className="mb-3 size-6 text-alerta-11" />}
      <p className={cn('font-display text-3xl uppercase [overflow-wrap:anywhere]', bloqueio && 'text-alerta-12')}>{titulo}</p>
      <p className={cn('mt-2', bloqueio ? 'text-alerta-11' : 'text-carvao-11')}>{texto}</p>
      {nota && <p className="mt-3 border-t border-alerta-4 pt-3 text-alerta-12 [overflow-wrap:anywhere]">{nota}</p>}
    </div>
  )
}
