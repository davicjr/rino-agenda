// CRUD da grade semanal de horários.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'
import { vagasValidas } from '../../_lib/regras'

type Corpo = { id?: unknown; dia_semana?: unknown; hora?: unknown; vagas?: unknown; ativo?: unknown; professor_id?: unknown; sem_limite?: unknown }
const hora = (v: unknown) => (typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : null)
const semLimite = (v: unknown) => (v === true || v === 1 ? 1 : 0)
const ERRO_VAGAS = 'Informe de 1 a 999 vagas.'
const dia = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 6 ? (v as number) : null)

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const r = await env.DB.prepare('SELECT id, dia_semana, hora, vagas, sem_limite, ativo, professor_id FROM grade ORDER BY dia_semana, hora').all()
  return json(r.results)
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const d = dia(c?.dia_semana), h = hora(c?.hora), v = c?.vagas === undefined ? 15 : vagasValidas(c.vagas)
  if (d === null || !h) return erro('Dia ou hora inválidos.')
  if (v === null) return erro(ERRO_VAGAS)
  try {
    await env.DB.prepare('INSERT INTO grade (dia_semana, hora, vagas, sem_limite, professor_id) VALUES (?, ?, ?, ?, ?)').bind(d, h, v, semLimite(c?.sem_limite), inteiro(c?.professor_id)).run()
  } catch (e) {
    if (String(e).includes('UNIQUE')) return erro('Esse horário já existe nesse dia.', 409)
    throw e
  }
  return json({ ok: true }, 201)
}

export const onRequestPatch: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const id = inteiro(c?.id), h = hora(c?.hora), v = vagasValidas(c?.vagas)
  if (!id || !h) return erro('Dados inválidos.')
  if (v === null) return erro(ERRO_VAGAS)
  await env.DB.prepare('UPDATE grade SET hora = ?, vagas = ?, sem_limite = ?, ativo = ?, professor_id = ? WHERE id = ?')
    .bind(h, v, semLimite(c?.sem_limite), c?.ativo === false ? 0 : 1, inteiro(c?.professor_id), id)
    .run()
  return json({ ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Horário inválido.')
  await env.DB.prepare('DELETE FROM grade WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
