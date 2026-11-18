// Validação dos dados de uma pessoa da equipe. Telefone e Instagram são opcionais.
import { normalizarWhatsapp } from './info'
import { FUNCAO_MAX, limitarTexto } from './texto'

export type Pessoa = { nome: string; funcao: string; telefone: string | null; instagram: string | null; daAula: boolean }

/** Aceita @usuario, usuario ou o link do perfil. Vazio vira '', inválido vira null. */
export function normalizarInstagram(bruto: unknown): string | null {
  const v = limitarTexto(bruto, 120).replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').split(/[/?#]/)[0].toLowerCase()
  return v === '' || /^[a-z0-9._]{1,30}$/.test(v) ? v : null
}

export function limparPessoa(c: Record<string, unknown>): Pessoa | string {
  const nome = limitarTexto(c.nome, 60)
  if (nome.length < 2) return 'Informe o nome.'
  const funcao = limitarTexto(c.funcao, FUNCAO_MAX) || 'Professor'
  if (funcao.length < 2) return 'Informe a função.'
  const telefone = normalizarWhatsapp(limitarTexto(c.telefone, 30))
  if (telefone === null) return 'Telefone inválido. Use DDD + número, ex.: 77 91234-5678.'
  const instagram = normalizarInstagram(c.instagram)
  if (instagram === null) return 'Instagram inválido. Use só o nome do perfil, ex.: @rinofightteam.'
  return { nome, funcao, telefone: telefone || null, instagram: instagram || null, daAula: c.da_aula !== false && c.da_aula !== 0 }
}
