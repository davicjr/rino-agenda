// GET /api/dia?data=YYYY-MM-DD: horários do dia com ocupação e nomes.
import { horariosDoDia } from '../_lib/consultas'
import { erro, json, type Env } from '../_lib/http'
import { agoraBahia, aulaNoFuturo, diaSemana, ehDataValida } from '../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const data = new URL(request.url).searchParams.get('data') ?? ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const agora = agoraBahia()
  const dia = await horariosDoDia(env.DB, data, diaSemana(data))
  return json({
    data,
    bloqueioDia: dia.bloqueioDia,
    horarios: dia.horarios.map((h) => ({ ...h, aberto: aulaNoFuturo(data, h.hora, agora) })),
  })
}
