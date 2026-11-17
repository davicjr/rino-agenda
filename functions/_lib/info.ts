// Informações oficiais da academia (responsável e contato), na tabela `config` com o prefixo info.
export type Info = { responsavel: string; whatsapp: string; instagram: string; endereco: string }
const CAMPOS: (keyof Info)[] = ['responsavel', 'whatsapp', 'instagram', 'endereco']

export async function lerInfo(db: D1Database): Promise<Info> {
  const linhas = (await db.prepare("SELECT chave, valor FROM config WHERE chave LIKE 'info.%'").all<{ chave: string; valor: string }>()).results
  const v = new Map(linhas.map((l) => [l.chave.slice(5), l.valor]))
  return Object.fromEntries(CAMPOS.map((c) => [c, v.get(c) ?? ''])) as Info
}

/** Só dígitos; número brasileiro sem DDI ganha o 55. Vazio continua vazio. */
export function normalizarWhatsapp(bruto: string): string | null {
  const d = bruto.replace(/\D/g, '')
  if (!d) return ''
  const comDdi = d.length === 10 || d.length === 11 ? `55${d}` : d
  return comDdi.length >= 12 && comDdi.length <= 13 ? comDdi : null
}

export function limparInfo(c: Partial<Record<keyof Info, unknown>>): Info | string {
  const txt = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '')
  const whatsapp = normalizarWhatsapp(txt(c.whatsapp, 30))
  if (whatsapp === null) return 'WhatsApp inválido. Use DDD + número, ex.: 77 91234-5678.'
  return {
    responsavel: txt(c.responsavel, 60),
    whatsapp,
    instagram: txt(c.instagram, 40).replace(/^@/, ''),
    endereco: txt(c.endereco, 120),
  }
}
