// Cliente da API das Pages Functions. Erros chegam como { erro } e viram Error com a mensagem.
export type Aluno = { id: number; nome: string; apelido: string | null; foto: number | null }
export type GradeItem = { id: number; dia_semana: number; hora: string; vagas: number }
export type Agora = { data: string; minutos: number }
export type BloqueioDia = { data: string; motivo: string | null }
export type Inicio = { agora: Agora; janelaDias: number; grade: GradeItem[]; alunos: Aluno[]; bloqueiosDia: BloqueioDia[]; regras: RegrasJanela }
export type TipoAgendamento = 'plano' | 'diaria' | 'experimental'
/** aluno_id é null quando a pessoa foi digitada na hora (diária ou experimental). */
export type Agendado = { id: number; aluno_id: number | null; tipo: TipoAgendamento; nome: string; foto: number | null }
export type Reserva = { tipo: 'plano' | 'diaria'; alunoId: number } | { tipo: 'diaria' | 'experimental'; nome: string }
export type Professor = { id: number; nome: string; foto: number | null }
export type RegrasJanela = { abreDiasAntes: number | null; fechaHorasAntes: number; retirarHorasAntes: number }
export type Janela = { estado: 'aberta' | 'passou' | 'fechou' } | { estado: 'cedo'; abreEm: { data: string; hora: string } }
export type Horario = {
  id: number
  hora: string
  /** null = sem limite de vagas. */
  vagas: number | null
  bloqueio: string | null
  bloqueioNota: string | null
  aberto: boolean
  fase: 'futura' | 'treinando' | 'encerrada'
  agendados: Agendado[]
  professor: Professor | null
  professorHorarioId: number | null
  janela: Janela
  podeRetirar: boolean
}
export type Dia = { data: string; bloqueioDia: string | null; bloqueioDiaNota: string | null; horarios: Horario[] }

export type UsoSemana = { id: number; usados: number; limite: number; marcados: { data: string; hora: string }[] }
export type Semana = { inicio: string; fim: string; alunos: UsoSemana[] }

export type InfoAcademia = { responsavel: string; whatsapp: string; instagram: string; endereco: string }
export type MembroEquipe = { id: number; nome: string; foto: number | null; funcao: string; telefone: string | null; instagram: string | null }
export type Suporte = InfoAcademia & { equipe: MembroEquipe[] }

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
  info: () => chamar<Suporte>('/info'),
  semana: (data: string) => chamar<Semana>(`/semana?data=${data}`),
  agendar: (reserva: Reserva, gradeId: number, data: string) =>
    chamar<{ id: number }>('/agendar', { method: 'POST', body: JSON.stringify({ ...reserva, gradeId, data }) }),
  retirar: (id: number) => chamar<{ ok: true }>(`/agendamento/${id}`, { method: 'DELETE' }),
}
