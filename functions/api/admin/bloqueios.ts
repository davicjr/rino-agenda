// Bloqueios de data (feriado, evento): o dia inteiro ou um horário só.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'
import { agoraBahia, ehDataValida, somarDias } from '../../_lib/regras'
import { limitarTexto, MOTIVO_MAX, NOTA_MAX } from '../../_lib/texto'

type Corpo = { data?: unknown; gradeId?: unknown; motivo?: unknown; nota?: unknown }

/** Quanto tempo para trás a agenda do admin deixa navegar (igual ao calendário); dias passados também podem ser liberados. */
const DIAS_PARA_TRAS = 365

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const r = await env.DB.prepare(
    `SELECT b.id, b.data, b.grade_id, g.hora, b.motivo, b.nota FROM bloqueios b LEFT JOIN grade g ON g.id = b.grade_id
     WHERE b.data >= ? ORDER BY b.data, g.hora`,
  )
    .bind(somarDias(agoraBahia().data, -DIAS_PARA_TRAS))
    .all()
  return json(r.results)
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const data = typeof c?.data === 'string' ? c.data : ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const motivo = limitarTexto(c?.motivo, MOTIVO_MAX)
  const nota = limitarTexto(c?.nota, NOTA_MAX)
  await env.DB.prepare('INSERT INTO bloqueios (data, grade_id, motivo, nota) VALUES (?, ?, ?, ?)')
    .bind(data, inteiro(c?.gradeId), motivo || null, nota || null)
    .run()
  return json({ ok: true }, 201)
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Bloqueio inválido.')
  await env.DB.prepare('DELETE FROM bloqueios WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
