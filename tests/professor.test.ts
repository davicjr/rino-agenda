import { describe, expect, it } from 'vitest'
import { professorDaAula } from '../functions/_lib/professor'

const padrao = { id: 1, nome: 'Islan' }
describe('professorDaAula', () => {
  it('usa o padrão da grade', () => expect(professorDaAula(5, padrao, [])).toEqual({ id: 1, nome: 'Islan' }))
  it('escala do dia vence o padrão', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 0, professor_id: 2, nome: 'Davi' }])).toEqual({ id: 2, nome: 'Davi' }))
  it('escala do horário vence a do dia', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 0, professor_id: 2, nome: 'Davi' }, { grade_id: 5, professor_id: 3, nome: 'Ana' }])).toEqual({ id: 3, nome: 'Ana' }))
  it('escala de outro horário não interfere', () =>
    expect(professorDaAula(5, padrao, [{ grade_id: 6, professor_id: 3, nome: 'Ana' }])).toEqual({ id: 1, nome: 'Islan' }))
  it('sem padrão nem escala', () => expect(professorDaAula(5, { id: null, nome: null }, [])).toBeNull())
})
