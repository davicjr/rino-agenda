// Carregando, erro, dia bloqueado e dia sem treino.
import { Lock, Moon, WifiOff } from 'lucide-react'
import type { Dia } from '@/lib/api'
import { AvisoSemTreino } from './AvisoSemTreino'

export function EstadoDia({ carregando, erro, dia }: { carregando: boolean; erro: Error | null; dia?: Dia }) {
  if (erro) return <AvisoSemTreino icone={WifiOff} rotulo="Agenda indisponível" titulo="Sem conexão" nota="Não deu para carregar a agenda. Puxe para atualizar ou tente daqui a pouco." />
  if (carregando && !dia) {
    return (
      <div className="space-y-3" aria-label="Carregando">
        {[0, 1, 2].map((i) => <div key={i} className="paralelo h-36 animate-pulse bg-carvao-2" />)}
      </div>
    )
  }
  if (!dia) return null
  if (dia.bloqueioDia) return <AvisoSemTreino alerta icone={Lock} rotulo="Sem treino neste dia" titulo={dia.bloqueioDia} nota={dia.bloqueioDiaNota} />
  if (!dia.horarios.length) return <AvisoSemTreino icone={Moon} rotulo="Sem treino na grade" titulo="Dia de folga" nota="Descansa que amanhã tem." />
  return null
}
