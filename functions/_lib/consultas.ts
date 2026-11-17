// Leituras no D1 usadas pela agenda pública e pelo admin.
import type { Plano } from './regras'

export type LinhaGrade = { id: number; dia_semana: number; hora: string; vagas: number; ativo: number }
export type LinhaAluno = { id: number; nome: string; apelido: string | null; plano: Plano; ativo: number }

export const gradeAtiva = (db: D1Database) =>
  db.prepare('SELECT id, dia_semana, hora, vagas FROM grade WHERE ativo = 1 ORDER BY dia_semana, hora').all<LinhaGrade>()

export const alunosAtivos = (db: D1Database) =>
  db.prepare('SELECT id, nome, apelido FROM alunos WHERE ativo = 1 ORDER BY nome COLLATE NOCASE').all<LinhaAluno>()

export async function horariosDoDia(db: D1Database, data: string, diaSemana: number) {
  const [grade, agend, bloq] = await db.batch([
    db.prepare('SELECT id, hora, vagas FROM grade WHERE ativo = 1 AND dia_semana = ? ORDER BY hora').bind(diaSemana),
    db
      .prepare(
        `SELECT a.id, a.grade_id, a.aluno_id, COALESCE(NULLIF(al.apelido, ''), al.nome) AS nome
         FROM agendamentos a JOIN alunos al ON al.id = a.aluno_id
         WHERE a.data = ? ORDER BY a.criado_em`,
      )
      .bind(data),
    db.prepare('SELECT grade_id, motivo FROM bloqueios WHERE data = ?').bind(data),
  ])
  const bloqueios = bloq.results as { grade_id: number | null; motivo: string | null }[]
  const diaTodo = bloqueios.find((b) => b.grade_id === null)
  const agendados = agend.results as { id: number; grade_id: number; aluno_id: number; nome: string }[]
  return {
    bloqueioDia: diaTodo ? diaTodo.motivo || 'Sem aula' : null,
    horarios: (grade.results as { id: number; hora: string; vagas: number }[]).map((g) => {
      const b = diaTodo ?? bloqueios.find((x) => x.grade_id === g.id)
      return {
        ...g,
        bloqueio: b ? b.motivo || 'Sem aula' : null,
        agendados: agendados.filter((a) => a.grade_id === g.id).map(({ id, aluno_id, nome }) => ({ id, aluno_id, nome })),
      }
    }),
  }
}
