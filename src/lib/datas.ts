// Datas como 'YYYY-MM-DD' (sem fuso) e rótulos em português.
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const utc = (data: string) => new Date(`${data}T00:00:00Z`)

export const diaSemana = (data: string) => utc(data).getUTCDay()
export const nomeDia = (data: string) => DIAS[diaSemana(data)]
export const nomeDiaCurto = (data: string) => DIAS_CURTOS[diaSemana(data)]
export const diaDoMes = (data: string) => utc(data).getUTCDate()
export const mesCurto = (data: string) => MESES[utc(data).getUTCMonth()]

export function somarDias(data: string, dias: number) {
  const d = utc(data)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

export const paraData = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const deData = (data: string) => {
  const [a, m, d] = data.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const horaCurta = (hora: string) => (hora.endsWith(':00') ? `${Number(hora.slice(0, 2))}h` : hora)

export const iniciais = (nome: string) =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
export const nomeMes = (data: string) => MESES_LONGOS[utc(data).getUTCMonth()]
export const primeiroDoMes = (data: string) => `${data.slice(0, 8)}01`
export function somarMeses(data: string, meses: number) {
  const d = utc(primeiroDoMes(data))
  d.setUTCMonth(d.getUTCMonth() + meses)
  return d.toISOString().slice(0, 10)
}
