// GET /api/dia?data=YYYY-MM-DD: horários do dia com ocupação e nomes.
import { horariosDoDia } from '../_lib/consultas'
import { erro, json, type Env } from '../_lib/http'
import { faseAula, janelaAgendar, lerRegras, podeRetirar } from '../_lib/janela'
import { agoraBahia, aulaNoFuturo, diaSemana, ehDataValida } from '../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const data = new URL(request.url).searchParams.get('data') ?? ''
  if (!ehDataValida(data)) return erro('Data inválida.')
  const agora = agoraBahia()
  const [dia, regras] = await Promise.all([horariosDoDia(env.DB, data, diaSemana(data)), lerRegras(env.DB)])
  return json({
    data,
    bloqueioDia: dia.bloqueioDia,
    bloqueioDiaNota: dia.bloqueioDiaNota,
    professorDiaId: dia.professorDiaId,
    horarios: dia.horarios.map((h) => ({
      ...h,
      aberto: aulaNoFuturo(data, h.hora, agora),
      fase: faseAula(data, h.hora, agora),
      janela: janelaAgendar(data, h.hora, agora, regras),
      podeRetirar: podeRetirar(data, h.hora, agora, regras),
    })),
  })
}
