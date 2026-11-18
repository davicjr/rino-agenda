// CRUD da equipe (a tabela segue chamada professores): função, contatos opcionais e se dá aulas.
import { limparPessoa } from '../../_lib/equipe'
import { erro, inteiro, json, lerCorpo, type Env } from '../../_lib/http'

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json((await env.DB.prepare('SELECT id, nome, funcao, telefone, instagram, da_aula, ativo, foto FROM professores ORDER BY ativo DESC, nome COLLATE NOCASE').all()).results)

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const p = limparPessoa((await lerCorpo<Record<string, unknown>>(request)) ?? {})
  if (typeof p === 'string') return erro(p)
  await env.DB.prepare('INSERT INTO professores (nome, funcao, telefone, instagram, da_aula) VALUES (?, ?, ?, ?, ?)')
    .bind(p.nome, p.funcao, p.telefone, p.instagram, p.daAula ? 1 : 0)
    .run()
  return json({ ok: true }, 201)
}

export const onRequestPatch: PagesFunction<Env> = async ({ env, request }) => {
  const c = (await lerCorpo<Record<string, unknown>>(request)) ?? {}
  const id = inteiro(c.id)
  if (!id) return erro('Pessoa inválida.')
  const p = limparPessoa(c)
  if (typeof p === 'string') return erro(p)
  await env.DB.prepare('UPDATE professores SET nome = ?, funcao = ?, telefone = ?, instagram = ?, da_aula = ?, ativo = ? WHERE id = ?')
    .bind(p.nome, p.funcao, p.telefone, p.instagram, p.daAula ? 1 : 0, c.ativo === false ? 0 : 1, id)
    .run()
  return json({ ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Pessoa inválida.')
  await env.DB.prepare('DELETE FROM professores WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
