// Regras de negócio puras (sem banco), testadas em tests/regras.test.ts.

export type Plano = '5x' | '4x' | '3x' | '2x' | '1x'
export type TipoAgendamento = 'plano' | 'diaria' | 'experimental'

const LIMITE_DO_PLANO: Record<Plano, number> = { '5x': 5, '4x': 4, '3x': 3, '2x': 2, '1x': 1 }
export const PLANOS_VALIDOS = Object.keys(LIMITE_DO_PLANO) as Plano[]
/** 'avulso' (diária e experimental) não tem limite semanal. */
export const LIMITE_SEMANAL: Record<Plano | 'avulso', number> = { ...LIMITE_DO_PLANO, avulso: Infinity }

/** Nome digitado de visitante: espaços arrumados, 2 a 60 letras. Null se não serve. */
export function nomeVisitante(v: unknown): string | null {
  const n = typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : ''
  return n.length >= 2 && n.length <= 60 ? n : null
}
const OFFSET_BAHIA_MIN = -3 * 60 // America/Bahia: UTC-3, sem horário de verão

export type Agora = { data: string; minutos: number }

/** Data (YYYY-MM-DD) e minutos do dia no fuso da academia. */
export function agoraBahia(utcMs = Date.now()): Agora {
  const d = new Date(utcMs + OFFSET_BAHIA_MIN * 60_000)
  return { data: d.toISOString().slice(0, 10), minutos: d.getUTCHours() * 60 + d.getUTCMinutes() }
}

export function ehDataValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false
  const d = new Date(`${data}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === data
}

/** 0 = domingo, como na tabela `grade`. */
export function diaSemana(data: string): number {
  return new Date(`${data}T00:00:00Z`).getUTCDay()
}

export function somarDias(data: string, dias: number): string {
  const d = new Date(`${data}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

/** Domingo a sábado da semana que contém `data` (igual à semana que o app mostra). */
export function semanaDe(data: string): { inicio: string; fim: string } {
  const inicio = somarDias(data, -diaSemana(data))
  return { inicio, fim: somarDias(inicio, 6) }
}

export function minutosDe(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

/** A aula ainda não começou? */
export function aulaNoFuturo(data: string, hora: string, agora: Agora): boolean {
  if (data !== agora.data) return data > agora.data
  return minutosDe(hora) > agora.minutos
}

export type PedidoAgendamento = {
  data: string
  hora: string
  diaSemanaGrade: number
  gradeAtiva: boolean
  alunoAtivo: boolean
  plano: Plano | 'avulso'
  bloqueado: boolean
  ocupados: number
  /** null = sem limite de vagas. */
  vagas: number | null
  jaAgendado: boolean
  jaTemNoDia: boolean
  agendadosNaSemana: number
  /** Mensagem da janela de agendamento (null = aberta). */
  foraDaJanela: string | null
}

/** Devolve a mensagem de erro, ou null se pode agendar. */
export function motivoRecusa(p: PedidoAgendamento): string | null {
  if (!ehDataValida(p.data)) return 'Data inválida.'
  if (!p.alunoAtivo) return 'Aluno não encontrado.'
  if (!p.gradeAtiva || diaSemana(p.data) !== p.diaSemanaGrade) return 'Esse horário não existe nesse dia.'
  if (p.foraDaJanela) return p.foraDaJanela
  if (p.bloqueado) return 'Não tem aula nesse horário.'
  if (p.jaAgendado) return 'Você já está nesse horário.'
  if (p.jaTemNoDia) return 'Você já tem treino marcado nesse dia. É um por dia.'
  if (p.vagas !== null && p.ocupados >= p.vagas) return 'Horário lotado.'
  const limite = LIMITE_SEMANAL[p.plano]
  if (p.agendadosNaSemana >= limite) return `Seu plano é ${p.plano} por semana e você já usou ${limite} nesta semana.`
  return null
}

/** Treinos que o plano permite numa semana com `diasComAula` dias de aula. */
export function limiteDaSemana(plano: Plano, diasComAula: number): number {
  return Math.min(LIMITE_SEMANAL[plano], diasComAula)
}

export const VAGAS_MAX = 999

/** Número de vagas aceito no cadastro (1 a 999), ou null se inválido. */
export function vagasValidas(v: unknown): number | null {
  return Number.isInteger(v) && (v as number) >= 1 && (v as number) <= VAGAS_MAX ? (v as number) : null
}
