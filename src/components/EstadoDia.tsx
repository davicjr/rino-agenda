// Carregando, erro, dia bloqueado e dia sem treino.
import type { Dia } from '@/lib/api'

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
  if (dia.bloqueioDia) return <Aviso titulo={dia.bloqueioDia} texto="Não tem treino neste dia." />
  if (!dia.horarios.length) return <Aviso titulo="Dia de folga" texto="Sem treino na grade. Descansa que amanhã tem." />
  return null
}

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="corte bg-carvao-2 p-6">
      <p className="font-display text-3xl uppercase">{titulo}</p>
      <p className="mt-2 text-carvao-11">{texto}</p>
    </div>
  )
}
