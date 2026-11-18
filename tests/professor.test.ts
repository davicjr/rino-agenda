import { describe, expect, it } from 'vitest'
import { professorDaAula } from '../functions/_lib/professor'

const padrao = { id: 1, nome: 'Islan' }
describe('professorDaAula', () => {
  it('usa o padrão da grade', () => expect(professorDaAula(5, padrao, [])).toEqual({ id: 1, nome: 'Islan', foto: null }))
  it('escala da aula vence o padrão', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 5, professor_id: 3, nome: 'Ana', foto: null }])).toEqual({ id: 3, nome: 'Ana', foto: null }))
  it('registro antigo do dia inteiro não vale mais', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 0, professor_id: 2, nome: 'Davi', foto: null }])).toEqual({ id: 1, nome: 'Islan', foto: null }))
  it('escala de outro horário não interfere', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 6, professor_id: 3, nome: 'Ana', foto: null }])).toEqual({ id: 1, nome: 'Islan', foto: null }))
  it('sem padrão nem escala', () => expect(professorDaAula(5, { id: null, nome: null }, [])).toBeNull())
})
