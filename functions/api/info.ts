// GET /api/info: responsável, contato e professores ativos (com foto), para a gaveta de suporte.
import { lerInfo } from '../_lib/info'
import { json, type Env } from '../_lib/http'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [info, profs] = await Promise.all([
    lerInfo(env.DB),
    env.DB.prepare('SELECT id, nome, foto FROM professores WHERE ativo = 1 ORDER BY nome COLLATE NOCASE').all(),
  ])
  return json({ ...info, professores: profs.results })
}
