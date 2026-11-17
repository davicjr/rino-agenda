// PUT /api/admin/foto?tipo=aluno&id=1 com a imagem no corpo; DELETE remove.
// O navegador já reduz a foto; aqui só valida tipo e tamanho.
import { erro, inteiro, json, type Env } from '../../_lib/http'

const TIPOS = { aluno: 'alunos', professor: 'professores' } as const
const MIMES = ['image/webp', 'image/jpeg', 'image/png']
const MAX_BYTES = 300_000

function alvo(request: Request) {
  const u = new URL(request.url)
  const tipo = u.searchParams.get('tipo') as keyof typeof TIPOS | null
  const id = inteiro(u.searchParams.get('id'))
  return tipo && tipo in TIPOS && id ? { tipo, id, tabela: TIPOS[tipo] } : null
}

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const a = alvo(request)
  if (!a) return erro('Destino inválido.')
  const mime = (request.headers.get('content-type') ?? '').split(';')[0]
  if (!MIMES.includes(mime)) return erro('Envie uma imagem (WebP, JPEG ou PNG).')
  const dados = await request.arrayBuffer()
  if (!dados.byteLength || dados.byteLength > MAX_BYTES) return erro('Imagem grande demais.')
  const versao = Date.now()
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO fotos (tipo, dono_id, mime, dados) VALUES (?, ?, ?, ?)
       ON CONFLICT (tipo, dono_id) DO UPDATE SET mime = excluded.mime, dados = excluded.dados`,
    ).bind(a.tipo, a.id, mime, dados),
    env.DB.prepare(`UPDATE ${a.tabela} SET foto = ? WHERE id = ?`).bind(versao, a.id),
  ])
  return json({ foto: versao })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const a = alvo(request)
  if (!a) return erro('Destino inválido.')
  await env.DB.batch([
    env.DB.prepare('DELETE FROM fotos WHERE tipo = ? AND dono_id = ?').bind(a.tipo, a.id),
    env.DB.prepare(`UPDATE ${a.tabela} SET foto = NULL WHERE id = ?`).bind(a.id),
  ])
  return json({ foto: null })
}
