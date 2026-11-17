// Quem dá a aula: escala do horário > escala do dia > professor padrão da grade.
export type Escala = { grade_id: number; professor_id: number; nome: string }

export function professorDaAula(gradeId: number, padrao: { id: number | null; nome: string | null }, escala: Escala[]) {
  const doHorario = escala.find((e) => e.grade_id === gradeId)
  const doDia = escala.find((e) => e.grade_id === 0)
  const e = doHorario ?? doDia
  if (e) return { id: e.professor_id, nome: e.nome }
  return padrao.id ? { id: padrao.id, nome: padrao.nome } : null
}
