// GET/PUT das informações oficiais (responsável, WhatsApp, Instagram, endereço).
import { limparInfo, lerInfo, type Info } from '../../_lib/info'
import { erro, json, lerCorpo, type Env } from '../../_lib/http'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => json(await lerInfo(env.DB))

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const c = await lerCorpo<Partial<Record<keyof Info, unknown>>>(request)
  const info = limparInfo(c ?? {})
  if (typeof info === 'string') return erro(info)
  const grava = env.DB.prepare('INSERT INTO config (chave, valor) VALUES (?, ?) ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor')
  await env.DB.batch(Object.entries(info).map(([k, v]) => grava.bind(`info.${k}`, v)))
  return json(info)
}
