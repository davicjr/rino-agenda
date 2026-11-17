// GET /api/foto/:tipo/:id?v=versao: a imagem, com cache longo (a versão muda o endereço).
import { erro, inteiro, type Env } from '../../../_lib/http'

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const tipo = String(params.tipo)
  const id = inteiro(params.id)
  if (!id || (tipo !== 'aluno' && tipo !== 'professor')) return erro('Foto inválida.', 404)
  const f = await env.DB.prepare('SELECT mime, dados FROM fotos WHERE tipo = ? AND dono_id = ?').bind(tipo, id).first<{ mime: string; dados: ArrayBuffer }>()
  if (!f) return erro('Sem foto.', 404)
  return new Response(new Uint8Array(f.dados), {
    headers: { 'content-type': f.mime, 'cache-control': 'public, max-age=31536000, immutable' },
  })
}
