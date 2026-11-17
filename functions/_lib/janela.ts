// Janela de agendamento definida no admin: quando abre (dias antes da aula), quando fecha
// e até quando dá para retirar (horas antes). Tudo em minutos até a aula, no fuso da Bahia.
import { minutosDe, somarDias, type Agora } from './regras'

export type RegrasJanela = { abreDiasAntes: number | null; fechaHorasAntes: number; retirarHorasAntes: number }
export const REGRAS_PADRAO: RegrasJanela = { abreDiasAntes: 30, fechaHorasAntes: 0, retirarHorasAntes: 0 }

export type EstadoJanela =
  | { estado: 'aberta' }
  | { estado: 'passou' }
  | { estado: 'fechou' }
  | { estado: 'cedo'; abreEm: { data: string; hora: string } }

/** Minutos entre agora e o início da aula (negativo se já começou). */
export function minutosAte(data: string, hora: string, agora: Agora): number {
  const dias = (Date.parse(`${data}T00:00:00Z`) - Date.parse(`${agora.data}T00:00:00Z`)) / 86_400_000
  return dias * 1440 + minutosDe(hora) - agora.minutos
}

export function janelaAgendar(data: string, hora: string, agora: Agora, r: RegrasJanela): EstadoJanela {
  const m = minutosAte(data, hora, agora)
  if (m <= 0) return { estado: 'passou' }
  if (r.abreDiasAntes !== null && m > r.abreDiasAntes * 1440) {
    return { estado: 'cedo', abreEm: { data: somarDias(data, -r.abreDiasAntes), hora } }
  }
  if (m <= r.fechaHorasAntes * 60) return { estado: 'fechou' }
  return { estado: 'aberta' }
}

export function podeRetirar(data: string, hora: string, agora: Agora, r: RegrasJanela): boolean {
  const m = minutosAte(data, hora, agora)
  return m > 0 && m > r.retirarHorasAntes * 60
}

const dias = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`

export function mensagemJanela(e: EstadoJanela, r: RegrasJanela): string | null {
  if (e.estado === 'passou') return 'Esse horário já passou.'
  if (e.estado === 'cedo') return `O agendamento abre ${dias(r.abreDiasAntes ?? 0)} antes da aula.`
  if (e.estado === 'fechou') return `O agendamento fecha ${r.fechaHorasAntes}h antes da aula.`
  return null
}

/** Lê as regras gravadas na tabela `config`; o que faltar usa o padrão. */
export async function lerRegras(db: D1Database): Promise<RegrasJanela> {
  const linhas = (await db.prepare("SELECT chave, valor FROM config WHERE chave LIKE 'janela.%'").all<{ chave: string; valor: string }>()).results
  const v = new Map(linhas.map((l) => [l.chave, l.valor]))
  const num = (k: string, padrao: number) => (v.has(k) ? Number(v.get(k)) : padrao)
  return {
    abreDiasAntes: v.has('janela.abre_dias') ? (v.get('janela.abre_dias') === '' ? null : Number(v.get('janela.abre_dias'))) : REGRAS_PADRAO.abreDiasAntes,
    fechaHorasAntes: num('janela.fecha_horas', REGRAS_PADRAO.fechaHorasAntes),
    retirarHorasAntes: num('janela.retirar_horas', REGRAS_PADRAO.retirarHorasAntes),
  }
}
