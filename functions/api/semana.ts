// GET /api/semana?data=: treinos usados e limite de cada aluno ativo na semana (domingo a sábado) da data.
import { erro, json, type Env } from '../_lib/http'
import { diaSemana, ehDataValida, limiteDaSemana, semanaDe, somarDias, type Plano } from '../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const data = new URL(request.url).searchParams.get('data') ?? ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const { inicio, fim } = semanaDe(data)
  const db = env.DB
  const [alunos, usados, grade, bloq] = await db.batch([
    db.prepare('SELECT id, plano FROM alunos WHERE ativo = 1'),
    db.prepare(`SELECT a.aluno_id, a.data, g.hora FROM agendamentos a JOIN grade g ON g.id = a.grade_id WHERE a.tipo = 'plano' AND a.data BETWEEN ? AND ? ORDER BY a.data`).bind(inicio, fim),
    db.prepare('SELECT DISTINCT dia_semana FROM grade WHERE ativo = 1'),
    db.prepare('SELECT data FROM bloqueios WHERE grade_id IS NULL AND data BETWEEN ? AND ?').bind(inicio, fim),
  ])
  const diasGrade = new Set((grade.results as { dia_semana: number }[]).map((g) => g.dia_semana))
  const bloqueados = new Set((bloq.results as { data: string }[]).map((b) => b.data))
  const diasComAula = Array.from({ length: 7 }, (_, i) => somarDias(inicio, i)).filter((d) => diasGrade.has(diaSemana(d)) && !bloqueados.has(d)).length
  const porAluno = new Map<number, { data: string; hora: string }[]>()
  for (const u of usados.results as { aluno_id: number; data: string; hora: string }[]) {
    porAluno.set(u.aluno_id, [...(porAluno.get(u.aluno_id) ?? []), { data: u.data, hora: u.hora }])
  }
  return json({
    inicio,
    fim,
    alunos: (alunos.results as { id: number; plano: Plano }[]).map((a) => {
      const marcados = porAluno.get(a.id) ?? []
      return { id: a.id, usados: marcados.length, limite: limiteDaSemana(a.plano, diasComAula), marcados }
    }),
  })
}
