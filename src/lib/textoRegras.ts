// Frases das regras de agendamento, iguais na agenda e no admin.
import type { RegrasJanela } from './api'

const dias = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`

export function resumoRegras(r: RegrasJanela): string {
  const abre = r.abreDiasAntes === null ? 'a qualquer momento' : `de ${dias(r.abreDiasAntes)} antes`
  const fecha = r.fechaHorasAntes ? `até ${r.fechaHorasAntes}h antes da aula` : 'até a aula começar'
  const retirar = r.retirarHorasAntes ? `Retirar só até ${r.retirarHorasAntes}h antes.` : 'Retirar até a aula começar.'
  return `Agendamento ${abre} ${fecha}. ${retirar}`
}
