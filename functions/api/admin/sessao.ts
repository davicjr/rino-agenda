// Login do professor: POST {senha} abre a sessão, GET diz se está logado, DELETE sai.
// Até 5 senhas erradas por IP a cada 15 minutos.
import { erro, json, lerCorpo, type Env } from '../../_lib/http'
import { assinar, cookieApagado, cookieSessao, lerCookie, senhaConfere, validar } from '../../_lib/sessao'

const JANELA_MS = 15 * 60_000
const MAX_FALHAS = 5

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) =>
  json({ logado: env.ADMIN_LIVRE_LOCAL === '1' || (await validar(env.ADMIN_SENHA ?? '', lerCookie(request))) })

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_SENHA) return erro('Senha do painel ainda não configurada.', 503)
  const ip = request.headers.get('cf-connecting-ip') ?? 'local'
  const janela = Math.floor(Date.now() / JANELA_MS)
  const t = await env.DB.prepare('SELECT falhas FROM tentativas_login WHERE ip = ? AND janela = ?').bind(ip, janela).first<{ falhas: number }>()
  if ((t?.falhas ?? 0) >= MAX_FALHAS) return erro('Muitas tentativas. Espere 15 minutos.', 429)

  const corpo = await lerCorpo<{ senha?: unknown }>(request)
  const senha = typeof corpo?.senha === 'string' ? corpo.senha : ''
  if (!(await senhaConfere(env.ADMIN_SENHA, senha))) {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO tentativas_login (ip, janela, falhas) VALUES (?, ?, 1)
         ON CONFLICT (ip, janela) DO UPDATE SET falhas = falhas + 1`,
      ).bind(ip, janela),
      env.DB.prepare('DELETE FROM tentativas_login WHERE janela < ?').bind(janela - 1),
    ])
    return erro('Senha errada.', 401)
  }
  return new Response(JSON.stringify({ logado: true }), {
    headers: { 'content-type': 'application/json', 'set-cookie': cookieSessao(await assinar(env.ADMIN_SENHA)) },
  })
}

export const onRequestDelete: PagesFunction<Env> = async () =>
  new Response(JSON.stringify({ logado: false }), { headers: { 'content-type': 'application/json', 'set-cookie': cookieApagado() } })
