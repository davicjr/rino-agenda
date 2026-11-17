// DELETE /api/agendamento/:id: o aluno retira o próprio agendamento antes da aula.
import { erro, inteiro, json, type Env } from '../../_lib/http'
import { agoraBahia, aulaNoFuturo } from '../../_lib/regras'

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = inteiro(params.id)
  if (!id) return erro('Agendamento inválido.')
  const linha = await env.DB.prepare(
    'SELECT a.data, g.hora FROM agendamentos a JOIN grade g ON g.id = a.grade_id WHERE a.id = ?',
  )
    .bind(id)
    .first<{ data: string; hora: string }>()
  if (!linha) return erro('Esse agendamento já foi retirado.', 404)
  if (!aulaNoFuturo(linha.data, linha.hora, agoraBahia())) return erro('A aula já começou, não dá mais para retirar.', 409)
  await env.DB.prepare('DELETE FROM agendamentos WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
