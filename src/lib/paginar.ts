// Fatia uma lista em páginas. A página pedida é ajustada para sempre existir.
export function paginar(total: number, porPagina: number, pedida: number) {
  const tamanho = Math.max(1, Math.floor(porPagina))
  const paginas = Math.max(1, Math.ceil(total / tamanho))
  const pagina = Math.min(Math.max(1, pedida), paginas)
  const inicio = (pagina - 1) * tamanho
  return { pagina, paginas, inicio, fim: Math.min(inicio + tamanho, total) }
}
