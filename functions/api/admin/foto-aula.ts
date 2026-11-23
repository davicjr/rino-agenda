// PUT /api/admin/foto-aula?gradeId=1&data=2026-11-23 com a imagem no corpo; DELETE remove.
// Só aceita foto depois que o treino terminou. O navegador já reduz a imagem; aqui só valida.
import { erro, inteiro, json, type Env } from '../../_lib/http'
import { faseAula } from '../../_lib/janela'
import { agoraBahia, diaSemana, ehDataValida } from '../../_lib/regras'

const MIMES = ['image/webp', 'image/jpeg', 'image/png']
const MAX_BYTES = 700_000

function alvo(request: Request) {
  const u = new URL(request.url)
  const gradeId = inteiro(u.searchParams.get('gradeId'))
  const data = u.searchParams.get('data') ?? ''
  return gradeId && ehDataValida(data) ? { gradeId, data } : null
}

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const a = alvo(request)
  if (!a) return erro('Treino inválido.')
  const g = await env.DB.prepare('SELECT dia_semana, hora FROM grade WHERE id = ?').bind(a.gradeId).first<{ dia_semana: number; hora: string }>()
  if (!g || g.dia_semana !== diaSemana(a.data)) return erro('Esse horário não existe nesse dia.', 404)
  if (faseAula(a.data, g.hora, agoraBahia()) !== 'encerrada') return erro('A foto só pode ser enviada depois que o treino terminar.', 409)
  const mime = (request.headers.get('content-type') ?? '').split(';')[0]
  if (!MIMES.includes(mime)) return erro('Envie uma imagem (WebP, JPEG ou PNG).')
  const dados = await request.arrayBuffer()
  if (!dados.byteLength || dados.byteLength > MAX_BYTES) return erro('Imagem grande demais.')
  const versao = Date.now()
  await env.DB.prepare(
    `INSERT INTO fotos_aula (grade_id, data, mime, dados, versao) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (grade_id, data) DO UPDATE SET mime = excluded.mime, dados = excluded.dados, versao = excluded.versao`,
  ).bind(a.gradeId, a.data, mime, dados, versao).run()
  return json({ foto: versao })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const a = alvo(request)
  if (!a) return erro('Treino inválido.')
  await env.DB.prepare('DELETE FROM fotos_aula WHERE grade_id = ? AND data = ?').bind(a.gradeId, a.data).run()
  return json({ foto: null })
}
