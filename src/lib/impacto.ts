// Feedback físico de confirmação: vibração curta onde o aparelho suporta.
export function vibrar(padrao: number | number[] = 24) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(padrao)
}

export const reduzirMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
