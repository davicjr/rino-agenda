// PUT {data, gradeId?, professorId}: define quem dá aula na data (gradeId ausente = dia inteiro).
// professorId nulo remove a escala e volta ao professor padrão da grade.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'
import { ehDataValida } from '../../_lib/regras'

type Corpo = { data?: unknown; gradeId?: unknown; professorId?: unknown }

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const data = typeof c?.data === 'string' ? c.data : ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const gradeId = inteiro(c?.gradeId) ?? 0
  const professorId = inteiro(c?.professorId)
  if (professorId) {
    await env.DB.prepare(
      `INSERT INTO escala (data, grade_id, professor_id) VALUES (?, ?, ?)
       ON CONFLICT (data, grade_id) DO UPDATE SET professor_id = excluded.professor_id`,
    ).bind(data, gradeId, professorId).run()
  } else {
    await env.DB.prepare('DELETE FROM escala WHERE data = ? AND grade_id = ?').bind(data, gradeId).run()
  }
  return json({ ok: true })
}
