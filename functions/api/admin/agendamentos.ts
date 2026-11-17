// O admin remove qualquer agendamento, mesmo depois do horário.
import { erro, inteiro, json, type Env } from '../../_lib/http'

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = inteiro(new URL(request.url).searchParams.get('id'))
  if (!id) return erro('Agendamento inválido.')
  await env.DB.prepare('DELETE FROM agendamentos WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
