// CRUD de alunos. POST aceita {nome, apelido?, plano?} ou {nomes: string[], plano?} para colar uma lista.
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'
import { PLANOS_VALIDOS } from '../../_lib/regras'

const PLANOS: string[] = PLANOS_VALIDOS
type Corpo = { id?: unknown; nome?: unknown; nomes?: unknown; apelido?: unknown; plano?: unknown; ativo?: unknown }
const texto = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '')
const plano = (v: unknown) => (typeof v === 'string' && PLANOS.includes(v) ? v : '5x')

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const r = await env.DB.prepare(
    `SELECT id, nome, apelido, plano, ativo, foto FROM alunos ORDER BY ativo DESC, nome COLLATE NOCASE`,
  ).all()
  return json(r.results)
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const nomes = (Array.isArray(c?.nomes) ? c.nomes : [c?.nome]).map(texto).filter((n) => n.length >= 2)
  if (!nomes.length) return erro('Informe ao menos um nome.')
  const apelido = nomes.length === 1 ? texto(c?.apelido) || null : null
  const stmt = env.DB.prepare('INSERT INTO alunos (nome, apelido, plano) VALUES (?, ?, ?)')
  await env.DB.batch(nomes.map((n) => stmt.bind(n, apelido, plano(c?.plano))))
  return json({ criados: nomes.length }, 201)
}

export const onRequestPatch: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Corpo>(request)
  const id = inteiro(c?.id)
  const nome = texto(c?.nome)
  if (!id || nome.length < 2) return erro('Dados inválidos.')
  await env.DB.prepare('UPDATE alunos SET nome = ?, apelido = ?, plano = ?, ativo = ? WHERE id = ?')
    .bind(nome, texto(c?.apelido) || null, plano(c?.plano), c?.ativo === false ? 0 : 1, id)
    .run()
  return json({ ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Aluno inválido.')
  await env.DB.prepare('DELETE FROM alunos WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
