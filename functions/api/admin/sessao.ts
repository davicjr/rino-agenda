// Login do professor: POST {senha} abre a sessão, GET diz se está logado, DELETE sai.
// Até 5 senhas erradas por IP a cada 15 minutos.
import { erro, json, lerCorpo, type Env } from '../../_lib/http'
import { lerRegistro, segredoSessao, senhaAdminConfere } from '../../_lib/senha'
import { assinar, cookieApagado, cookieSessao, lerCookie, validar } from '../../_lib/sessao'
import { excedeu, ipDe, registrarFalha } from '../../_lib/tentativas'

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) =>
  json({ logado: env.ADMIN_LIVRE_LOCAL === '1' || (await validar(segredoSessao(env, await lerRegistro(env.DB)), lerCookie(request))) })

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const registro = await lerRegistro(env.DB)
  if (!env.ADMIN_SENHA && !registro) return erro('Senha do painel ainda não configurada.', 503)
  const ip = ipDe(request)
  if (await excedeu(env.DB, ip)) return erro('Muitas tentativas. Espere 15 minutos.', 429)

  const corpo = await lerCorpo<{ senha?: unknown }>(request)
  const senha = typeof corpo?.senha === 'string' ? corpo.senha : ''
  if (!(await senhaAdminConfere(env, registro, senha))) {
    await registrarFalha(env.DB, ip)
    return erro('Senha errada.', 401)
  }
  return new Response(JSON.stringify({ logado: true }), {
    headers: { 'content-type': 'application/json', 'set-cookie': cookieSessao(await assinar(segredoSessao(env, registro))) },
  })
}

export const onRequestDelete: PagesFunction<Env> = async () =>
  new Response(JSON.stringify({ logado: false }), { headers: { 'content-type': 'application/json', 'set-cookie': cookieApagado() } })
