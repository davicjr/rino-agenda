// GET /api/info: responsável, contato e equipe ativa (com foto e contatos), para a gaveta de suporte.
import { lerInfo } from '../_lib/info'
import { json, type Env } from '../_lib/http'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [info, equipe] = await Promise.all([
    lerInfo(env.DB),
    env.DB.prepare('SELECT id, nome, foto, funcao, telefone, instagram FROM professores WHERE ativo = 1 ORDER BY nome COLLATE NOCASE').all(),
  ])
  return json({ ...info, equipe: equipe.results })
}
