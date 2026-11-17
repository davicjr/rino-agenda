// CRUD de professores.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'

type Corpo = { id?: unknown; nome?: unknown; ativo?: unknown }
const nome = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, 60) : '')

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json((await env.DB.prepare('SELECT id, nome, ativo FROM professores ORDER BY ativo DESC, nome COLLATE NOCASE').all()).results)

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const n = nome((await lerCorpo<Corpo>(request))?.nome)
  if (n.length < 2) return erro('Informe o nome do professor.')
  await env.DB.prepare('INSERT INTO professores (nome) VALUES (?)').bind(n).run()
  return json({ ok: true }, 201)
}

export const onRequestPatch: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const id = inteiro(c?.id), n = nome(c?.nome)
  if (!id || n.length < 2) return erro('Dados inválidos.')
  await env.DB.prepare('UPDATE professores SET nome = ?, ativo = ? WHERE id = ?').bind(n, c?.ativo === false ? 0 : 1, id).run()
  return json({ ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Professor inválido.')
  await env.DB.prepare('DELETE FROM professores WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
