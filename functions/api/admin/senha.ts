// POST /api/admin/senha {atual, nova}: troca a senha do painel. A sessão atual continua aberta;
// as outras caem, porque o cookie é assinado com o hash da senha. Erros na senha atual contam no limite do login.
import { erro, lerCorpo, type Env } from '../../_lib/http'
import { gravarRegistro, lerRegistro, novoRegistro, problemaNaSenhaNova, segredoSessao, senhaAdminConfere } from '../../_lib/senha'
import { assinar, cookieSessao } from '../../_lib/sessao'
import { excedeu, ipDe, registrarFalha } from '../../_lib/tentativas'

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<{ atual?: unknown; nova?: unknown }>(request)
  const atual = typeof c?.atual === 'string' ? c.atual : ''
  const nova = typeof c?.nova === 'string' ? c.nova : ''
  const registro = await lerRegistro(env.DB)
  const ip = ipDe(request)

  if (await excedeu(env.DB, ip)) return erro('Muitas tentativas. Espere 15 minutos.', 429)
  if (!(await senhaAdminConfere(env, registro, atual))) {
    await registrarFalha(env.DB, ip)
    return erro('A senha atual está errada.', 401)
  }
  const problema = problemaNaSenhaNova(nova, atual)
  if (problema) return erro(problema)

  const novo = await novoRegistro(nova)
  await gravarRegistro(env.DB, novo)
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json', 'set-cookie': cookieSessao(await assinar(segredoSessao(env, novo))) },
  })
}
