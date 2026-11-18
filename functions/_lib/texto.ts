// Limites dos textos livres, usados na tela e no servidor.
export const MOTIVO_MAX = 40
export const NOTA_MAX = 140
export const FUNCAO_MAX = 30

/** Junta espaços e quebras de linha e corta no limite, sem partir emoji. */
export function limitarTexto(valor: unknown, max: number): string {
  if (typeof valor !== 'string') return ''
  return [...valor.trim().replace(/\s+/g, ' ')].slice(0, max).join('').trim()
}
