// Protege /api/admin/*: exige o cookie de sessão assinado com ADMIN_SENHA. O login (/sessao) passa livre.
import { erro, type Env } from '../../_lib/http'
import { lerCookie, validar } from '../../_lib/sessao'

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (new URL(ctx.request.url).pathname === '/api/admin/sessao') return ctx.next()
  if (ctx.env.ADMIN_LIVRE_LOCAL === '1') return ctx.next()
  if (await validar(ctx.env.ADMIN_SENHA ?? '', lerCookie(ctx.request))) return ctx.next()
  return erro('Área restrita.', 401)
}
