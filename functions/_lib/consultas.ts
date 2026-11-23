// Leituras no D1 usadas pela agenda pública e pelo admin.
import { professorDaAula, type Escala } from './professor'
import type { Plano, TipoAgendamento } from './regras'

export type LinhaGrade = { id: number; dia_semana: number; hora: string; vagas: number; ativo: number }
export type LinhaAluno = { id: number; nome: string; apelido: string | null; plano: Plano; ativo: number; foto: number | null }

export const gradeAtiva = (db: D1Database) =>
  db.prepare('SELECT id, dia_semana, hora, vagas FROM grade WHERE ativo = 1 ORDER BY dia_semana, hora').all<LinhaGrade>()

export const alunosAtivos = (db: D1Database) =>
  db.prepare('SELECT id, nome, apelido, foto FROM alunos WHERE ativo = 1 ORDER BY nome COLLATE NOCASE').all<LinhaAluno>()

export async function horariosDoDia(db: D1Database, data: string, diaSemana: number) {
  const [grade, agend, bloq, esc] = await db.batch([
    db
      .prepare(
        `SELECT g.id, g.hora, g.vagas, g.sem_limite, g.professor_id, p.nome AS professor_nome, p.foto AS professor_foto
         FROM grade g LEFT JOIN professores p ON p.id = g.professor_id AND p.ativo = 1
         WHERE g.ativo = 1 AND g.dia_semana = ? ORDER BY g.hora`,
      )
      .bind(diaSemana),
    db
      .prepare(
        `SELECT a.id, a.grade_id, a.aluno_id, a.tipo, COALESCE(NULLIF(al.apelido, ''), al.nome, a.visitante) AS nome, al.foto
         FROM agendamentos a LEFT JOIN alunos al ON al.id = a.aluno_id
         WHERE a.data = ? ORDER BY a.criado_em`,
      )
      .bind(data),
    db.prepare('SELECT grade_id, motivo, nota FROM bloqueios WHERE data = ?').bind(data),
    db.prepare('SELECT e.grade_id, e.professor_id, p.nome, p.foto FROM escala e JOIN professores p ON p.id = e.professor_id WHERE e.data = ?').bind(data),
  ])
  const escala = esc.results as Escala[]
  const bloqueios = bloq.results as { grade_id: number | null; motivo: string | null; nota: string | null }[]
  const diaTodo = bloqueios.find((b) => b.grade_id === null)
  const agendados = agend.results as { id: number; grade_id: number; aluno_id: number | null; tipo: TipoAgendamento; nome: string; foto: number | null }[]
  type G = { id: number; hora: string; vagas: number; sem_limite: number; professor_id: number | null; professor_nome: string | null; professor_foto: number | null }
  return {
    bloqueioDia: diaTodo ? diaTodo.motivo || 'Sem aula' : null,
    bloqueioDiaNota: diaTodo?.nota ?? null,
    horarios: (grade.results as G[]).map(({ professor_id, professor_nome, professor_foto, sem_limite, ...g }) => {
      const b = diaTodo ?? bloqueios.find((x) => x.grade_id === g.id)
      return {
        ...g,
        vagas: sem_limite ? null : g.vagas,
        professor: professorDaAula(g.id, { id: professor_id, nome: professor_nome, foto: professor_foto }, escala),
        professorHorarioId: escala.find((e) => e.grade_id === g.id)?.professor_id ?? null,
        bloqueio: b ? b.motivo || 'Sem aula' : null,
        bloqueioNota: b?.nota ?? null,
        agendados: agendados.filter((a) => a.grade_id === g.id).map(({ id, aluno_id, tipo, nome, foto }) => ({ id, aluno_id, tipo, nome, foto })),
      }
    }),
  }
}
