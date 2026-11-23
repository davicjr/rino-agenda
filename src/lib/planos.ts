export const PLANOS = [
  { valor: '5x', rotulo: '5x por semana', curto: '5x' },
  { valor: '4x', rotulo: '4x por semana', curto: '4x' },
  { valor: '3x', rotulo: '3x por semana', curto: '3x' },
  { valor: '2x', rotulo: '2x por semana', curto: '2x' },
  { valor: '1x', rotulo: '1x por semana', curto: '1x' },
] as const
export type Plano = (typeof PLANOS)[number]['valor']
export const rotuloPlano = (p: string) => PLANOS.find((x) => x.valor === p)?.rotulo ?? p

export const AJUDA_PLANO = 'Quantos dias o aluno pode treinar por semana, de domingo a sábado. Sempre um treino por dia.'
