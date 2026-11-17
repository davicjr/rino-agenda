export const PLANOS = [
  { valor: 'livre', rotulo: 'Todos os dias', curto: 'Livre' },
  { valor: '3x', rotulo: '3x por semana', curto: '3x' },
  { valor: '2x', rotulo: '2x por semana', curto: '2x' },
] as const
export type Plano = (typeof PLANOS)[number]['valor']
export const rotuloPlano = (p: string) => PLANOS.find((x) => x.valor === p)?.rotulo ?? p
