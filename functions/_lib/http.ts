// Respostas JSON e tipo do ambiente das Pages Functions.
export type Env = { DB: D1Database; ACCESS_DOMAIN?: string; ACCESS_AUD?: string; ADMIN_LIVRE_LOCAL?: string }

export const json = (dados: unknown, status = 200) =>
  new Response(JSON.stringify(dados), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })

export const erro = (mensagem: string, status = 400) => json({ erro: mensagem }, status)

export async function lerCorpo<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

export const inteiro = (v: unknown): number | null => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : null
}
