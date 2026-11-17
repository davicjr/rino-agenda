// Primeiro dia da janela que ainda tem treino pela frente.
import type { Inicio } from './api'
import { diaSemana, somarDias } from './datas'

export function primeiroDia({ agora, grade, janelaDias }: Inicio): string {
  for (let i = 0; i <= janelaDias; i++) {
    const d = somarDias(agora.data, i)
    const horas = grade.filter((g) => g.dia_semana === diaSemana(d))
    const futuro = i > 0 || horas.some((g) => Number(g.hora.slice(0, 2)) * 60 + Number(g.hora.slice(3)) > agora.minutos)
    if (horas.length && futuro) return d
  }
  return agora.data
}
