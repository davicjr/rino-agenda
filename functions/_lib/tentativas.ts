// Limite de senhas erradas por IP: 5 a cada 15 minutos, valendo para o login e para a troca de senha.
const JANELA_MS = 15 * 60_000
export const MAX_FALHAS = 5

export const ipDe = (req: Request) => req.headers.get('cf-connecting-ip') ?? 'local'

export async function excedeu(db: D1Database, ip: string, agora = Date.now()): Promise<boolean> {
  const janela = Math.floor(agora / JANELA_MS)
  const t = await db.prepare('SELECT falhas FROM tentativas_login WHERE ip = ? AND janela = ?').bind(ip, janela).first<{ falhas: number }>()
  return (t?.falhas ?? 0) >= MAX_FALHAS
}

export async function registrarFalha(db: D1Database, ip: string, agora = Date.now()): Promise<void> {
  const janela = Math.floor(agora / JANELA_MS)
  await db.batch([
    db.prepare(
      `INSERT INTO tentativas_login (ip, janela, falhas) VALUES (?, ?, 1)
       ON CONFLICT (ip, janela) DO UPDATE SET falhas = falhas + 1`,
    ).bind(ip, janela),
    db.prepare('DELETE FROM tentativas_login WHERE janela < ?').bind(janela - 1),
  ])
}
