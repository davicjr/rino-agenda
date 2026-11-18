import { describe, expect, it } from 'vitest'
import { paginar } from '../src/lib/paginar'

describe('paginar', () => {
  it('divide em páginas', () => expect(paginar(15, 4, 2)).toEqual({ pagina: 2, paginas: 4, inicio: 4, fim: 8 }))
  it('última página fica com o resto', () => expect(paginar(15, 4, 4)).toEqual({ pagina: 4, paginas: 4, inicio: 12, fim: 15 }))
  it('total exato não cria página vazia', () => expect(paginar(8, 4, 9).paginas).toBe(2))
  it('ajusta página que deixou de existir', () => expect(paginar(5, 4, 3)).toEqual({ pagina: 2, paginas: 2, inicio: 4, fim: 5 }))
  it('lista vazia tem uma página', () => expect(paginar(0, 4, 1)).toEqual({ pagina: 1, paginas: 1, inicio: 0, fim: 0 }))
  it('sempre mostra ao menos um por página', () => expect(paginar(3, 0, 2)).toEqual({ pagina: 2, paginas: 3, inicio: 1, fim: 2 }))
})
