// Cliente da API das Pages Functions. Erros chegam como { erro } e viram Error com a mensagem.
export type Aluno = { id: number; nome: string; apelido: string | null }
export type GradeItem = { id: number; dia_semana: number; hora: string; vagas: number }
export type Agora = { data: string; minutos: number }
export type BloqueioDia = { data: string; motivo: string | null }
export type Inicio = { agora: Agora; janelaDias: number; grade: GradeItem[]; alunos: Aluno[]; bloqueiosDia: BloqueioDia[] }
export type Agendado = { id: number; aluno_id: number; nome: string }
export type Professor = { id: number; nome: string }
export type Horario = {
  id: number
  hora: string
  vagas: number
  bloqueio: string | null
  aberto: boolean
  agendados: Agendado[]
  professor: Professor | null
  professorHorarioId: number | null
}
export type Dia = { data: string; bloqueioDia: string | null; professorDiaId: number | null; horarios: Horario[] }

export async function chamar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`/api${caminho}`, {
    ...init,
    headers: init?.body ? { 'content-type': 'application/json' } : undefined,
  })
  const corpo = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((corpo as { erro?: string }).erro ?? 'Algo deu errado. Tente de novo.')
  return corpo as T
}

export const api = {
  inicio: () => chamar<Inicio>('/inicio'),
  dia: (data: string) => chamar<Dia>(`/dia?data=${data}`),
  agendar: (alunoId: number, gradeId: number, data: string) =>
    chamar<{ id: number }>('/agendar', { method: 'POST', body: JSON.stringify({ alunoId, gradeId, data }) }),
  retirar: (id: number) => chamar<{ ok: true }>(`/agendamento/${id}`, { method: 'DELETE' }),
}
