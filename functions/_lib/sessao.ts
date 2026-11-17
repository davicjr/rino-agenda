// Sessão do admin: token "expira.hmac" assinado com a própria senha (trocar a senha derruba as sessões).
// Usa Web Crypto, presente no runtime do Cloudflare e no Node.

export const COOKIE = 'rino_admin'
export const DURACAO_MS = 30 * 86_400_000

const enc = new TextEncoder()

async function hmac(segredo: string, dado: string): Promise<Uint8Array> {
  const chave = await crypto.subtle.importKey('raw', enc.encode(`rino-agenda:${segredo}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', chave, enc.encode(dado)))
}

const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')

function iguais(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let dif = 0
  for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i]
  return dif === 0
}

/** Compara a senha digitada com a configurada sem vazar tempo proporcional ao acerto. */
export async function senhaConfere(configurada: string, digitada: string): Promise<boolean> {
  if (!configurada || !digitada) return false
  return iguais(await hmac(configurada, 'senha'), await hmac(digitada, 'senha'))
}

export async function assinar(segredo: string, agora = Date.now()): Promise<string> {
  const exp = String(agora + DURACAO_MS)
  return `${exp}.${hex(await hmac(segredo, exp))}`
}

export async function validar(segredo: string, token: string | null | undefined, agora = Date.now()): Promise<boolean> {
  if (!segredo || !token) return false
  const [exp, mac] = token.split('.')
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < agora) return false
  return iguais(enc.encode(hex(await hmac(segredo, exp))), enc.encode(mac))
}

export function lerCookie(req: Request, nome = COOKIE): string | null {
  const m = (req.headers.get('cookie') ?? '').match(new RegExp(`(?:^|;\\s*)${nome}=([^;]+)`))
  return m ? m[1] : null
}

export const cookieSessao = (token: string) =>
  `${COOKIE}=${token}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${DURACAO_MS / 1000}`

export const cookieApagado = () => `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
