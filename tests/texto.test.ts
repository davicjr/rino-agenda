import { describe, expect, it } from 'vitest'
import { limitarTexto, NOTA_MAX } from '../functions/_lib/texto'

describe('limitarTexto', () => {
  it('junta espaços e quebras de linha', () => expect(limitarTexto('  Volta\n\n  às   18h ', 40)).toBe('Volta às 18h'))
  it('corta no limite', () => expect(limitarTexto('x'.repeat(200), NOTA_MAX)).toHaveLength(NOTA_MAX))
  it('não parte emoji', () => expect(limitarTexto('ab🥊🥊', 3)).toBe('ab🥊'))
  it('não deixa espaço no fim do corte', () => expect(limitarTexto('abc def', 4)).toBe('abc'))
  it('ignora o que não é texto', () => expect(limitarTexto(123, 10)).toBe(''))
})
