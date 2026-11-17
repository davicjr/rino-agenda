// Bloqueios de data (feriado, evento): o dia inteiro ou um horário só.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'
import { agoraBahia, ehDataValida } from '../../_lib/regras'

type Corpo = { data?: unknown; gradeId?: unknown; motivo?: unknown }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const r = await env.DB.prepare(
    `SELECT b.id, b.data, b.grade_id, g.hora, b.motivo FROM bloqueios b LEFT JOIN grade g ON g.id = b.grade_id
     WHERE b.data >= ? ORDER BY b.data, g.hora`,
  )
    .bind(agoraBahia().data)
    .all()
  return json(r.results)
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const data = typeof c?.data === 'string' ? c.data : ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const motivo = typeof c?.motivo === 'string' ? c.motivo.trim().slice(0, 80) : ''
  await env.DB.prepare('INSERT INTO bloqueios (data, grade_id, motivo) VALUES (?, ?, ?)')
    .bind(data, inteiro(c?.gradeId), motivo || null)
    .run()
  return json({ ok: true }, 201)
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Bloqueio inválido.')
  await env.DB.prepare('DELETE FROM bloqueios WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
