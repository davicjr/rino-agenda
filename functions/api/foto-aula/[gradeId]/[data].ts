// GET /api/foto-aula/:gradeId/:data?v=versao: a foto do treino, com cache longo (a versão muda o endereço).
import { erro, inteiro, type Env } from '../../../_lib/http'
import { ehDataValida } from '../../../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const gradeId = inteiro(params.gradeId)
  const data = String(params.data)
  if (!gradeId || !ehDataValida(data)) return erro('Foto inválida.', 404)
  const f = await env.DB.prepare('SELECT mime, dados FROM fotos_aula WHERE grade_id = ? AND data = ?').bind(gradeId, data).first<{ mime: string; dados: ArrayBuffer }>()
  if (!f) return erro('Sem foto.', 404)
  return new Response(new Uint8Array(f.dados), {
    headers: { 'content-type': f.mime, 'cache-control': 'public, max-age=31536000, immutable' },
  })
}
