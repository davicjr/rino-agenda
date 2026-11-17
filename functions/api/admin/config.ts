// GET/PUT das regras de agendamento (janela). Só aceita os valores oferecidos na tela.
import { lerRegras } from '../../_lib/janela'
import { erro, json, lerCorpo, type Env } from '../../_lib/http'

const ABRE = [null, 1, 2, 7, 15, 30]
const HORAS = [0, 1, 2, 6, 12, 24]

export const onRequestGet: PagesFunction<Env> = async ({ env }) => json(await lerRegras(env.DB))

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<{ abreDiasAntes?: unknown; fechaHorasAntes?: unknown; retirarHorasAntes?: unknown }>(request)
  if (!c || !ABRE.includes(c.abreDiasAntes as number | null) || !HORAS.includes(c.fechaHorasAntes as number) || !HORAS.includes(c.retirarHorasAntes as number)) {
    return erro('Valores inválidos.')
  }
  const grava = env.DB.prepare('INSERT INTO config (chave, valor) VALUES (?, ?) ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor')
  await env.DB.batch([
    grava.bind('janela.abre_dias', c.abreDiasAntes === null ? '' : String(c.abreDiasAntes)),
    grava.bind('janela.fecha_horas', String(c.fechaHorasAntes)),
    grava.bind('janela.retirar_horas', String(c.retirarHorasAntes)),
  ])
  return json(await lerRegras(env.DB))
}
