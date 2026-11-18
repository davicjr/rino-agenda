// Quem dá a aula: escala daquela aula > professor padrão da grade.
export type Escala = { grade_id: number; professor_id: number; nome: string; foto: number | null }

export function professorDaAula(gradeId: number, padrao: { id: number | null; nome: string | null; foto?: number | null }, escala: Escala[]) {
  const e = escala.find((x) => x.grade_id === gradeId)
  if (e) return { id: e.professor_id, nome: e.nome, foto: e.foto ?? null }
  return padrao.id ? { id: padrao.id, nome: padrao.nome, foto: padrao.foto ?? null } : null
}
