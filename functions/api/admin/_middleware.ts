// Protege /api/admin/*: em produção exige o JWT do Cloudflare Access; local só com ADMIN_LIVRE_LOCAL=1.
import cloudflareAccess from '@cloudflare/pages-plugin-cloudflare-access'
import { erro, type Env } from '../../_lib/http'

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { ACCESS_DOMAIN, ACCESS_AUD, ADMIN_LIVRE_LOCAL } = ctx.env
  if (ACCESS_DOMAIN && ACCESS_AUD) {
    const plugin = cloudflareAccess({ domain: ACCESS_DOMAIN as `https://${string}.cloudflareaccess.com`, aud: ACCESS_AUD })
    return plugin(ctx as unknown as Parameters<typeof plugin>[0])
  }
  if (ADMIN_LIVRE_LOCAL === '1') return ctx.next()
  return erro('Área restrita.', 403)
}
