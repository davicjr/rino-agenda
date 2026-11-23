// Senha do admin trocada de dentro do sistema. Fica na tabela `config` como PBKDF2 (sal + hash).
// Enquanto não houver troca, vale o segredo ADMIN_SENHA do Cloudflare; depois da troca, só a nova senha entra.
// O cookie de sessão é assinado com o segredo do servidor + o hash, então trocar a senha derruba as sessões antigas.
import { senhaConfere } from './sessao'

const CHAVE = 'admin.senha'
const ITERACOES = 100_000 // teto do PBKDF2 no runtime do Cloudflare
export const SENHA_MIN = 8
export const SENHA_MAX = 128

export type Registro = { salt: string; hash: string }
export type EnvSenha = { ADMIN_SENHA?: string }

const enc = new TextEncoder()
const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')

async function derivar(senha: string, salt: string): Promise<string> {
  const chave = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: ITERACOES }, chave, 256)
  return hex(new Uint8Array(bits))
}

export async function novoRegistro(senha: string): Promise<Registro> {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)))
  return { salt, hash: await derivar(senha, salt) }
}

export async function registroConfere(r: Registro, digitada: string): Promise<boolean> {
  if (!digitada) return false
  const h = await derivar(digitada, r.salt)
  let dif = h.length ^ r.hash.length
  for (let i = 0; i < h.length; i++) dif |= h.charCodeAt(i) ^ (r.hash.charCodeAt(i) || 0)
  return dif === 0
}

export async function lerRegistro(db: D1Database): Promise<Registro | null> {
  const l = await db.prepare('SELECT valor FROM config WHERE chave = ?').bind(CHAVE).first<{ valor: string }>()
  if (!l) return null
  try {
    const r = JSON.parse(l.valor) as Registro
    return typeof r.salt === 'string' && typeof r.hash === 'string' ? r : null
  } catch {
    return null
  }
}

export async function gravarRegistro(db: D1Database, r: Registro): Promise<void> {
  await db.prepare('INSERT INTO config (chave, valor) VALUES (?, ?) ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor').bind(CHAVE, JSON.stringify(r)).run()
}

/** Segredo que assina o cookie da sessão. */
export const segredoSessao = (env: EnvSenha, r: Registro | null) => (r ? `${env.ADMIN_SENHA ?? ''}|${r.hash}` : (env.ADMIN_SENHA ?? ''))

/** A senha digitada é a do admin hoje (a trocada no sistema, ou a do Cloudflare se nunca foi trocada)? */
export const senhaAdminConfere = (env: EnvSenha, r: Registro | null, digitada: string) =>
  r ? registroConfere(r, digitada) : senhaConfere(env.ADMIN_SENHA ?? '', digitada)

/** Mensagem de erro se a senha nova não serve; null se serve. */
export function problemaNaSenhaNova(nova: string, atual: string): string | null {
  if (nova.length < SENHA_MIN) return `A senha nova precisa de pelo menos ${SENHA_MIN} caracteres.`
  if (nova.length > SENHA_MAX) return `A senha nova pode ter no máximo ${SENHA_MAX} caracteres.`
  if (nova === atual) return 'A senha nova precisa ser diferente da atual.'
  return null
}
