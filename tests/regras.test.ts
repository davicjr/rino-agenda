import { describe, expect, it } from 'vitest'
import { agoraBahia, aulaNoFuturo, limiteDaSemana, motivoRecusa, nomeVisitante, PLANOS_VALIDOS, semanaDe, vagasValidas, type PedidoAgendamento } from '../functions/_lib/regras'
import { PLANOS } from '../src/lib/planos'

// Terça, 2026-11-17, 10:00 em Salvador.
const agora = { data: '2026-11-17', minutos: 10 * 60 }

const base: PedidoAgendamento = {
  data: '2026-11-18', hora: '18:00', diaSemanaGrade: 3, gradeAtiva: true, alunoAtivo: true,
  plano: '5x', bloqueado: false, ocupados: 0, vagas: 15, jaAgendado: false, jaTemNoDia: false, agendadosNaSemana: 0, foraDaJanela: null,
}

describe('motivoRecusa', () => {
  it('aceita pedido válido', () => expect(motivoRecusa(base)).toBeNull())
  it('recusa horário lotado', () => expect(motivoRecusa({ ...base, ocupados: 15 })).toBe('Horário lotado.'))
  it('recusa fora da janela com a mensagem dela', () =>
    expect(motivoRecusa({ ...base, foraDaJanela: 'O agendamento fecha 12h antes da aula.' })).toMatch(/12h/))
  it('sem limite de vagas nunca lota', () => expect(motivoRecusa({ ...base, vagas: null, ocupados: 500 })).toBeNull())
  it('recusa bloqueio', () => expect(motivoRecusa({ ...base, bloqueado: true })).toBe('Não tem aula nesse horário.'))
  it('recusa duplicado', () => expect(motivoRecusa({ ...base, jaAgendado: true })).toBe('Você já está nesse horário.'))
  it('recusa segundo treino no mesmo dia', () =>
    expect(motivoRecusa({ ...base, jaTemNoDia: true })).toMatch(/um por dia/))
  it('plano 3x aceita o terceiro dia e recusa o quarto', () => {
    expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 2 })).toBeNull()
    expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 3 })).toMatch(/3x/)
  })
  it('recusa grade de outro dia da semana', () =>
    expect(motivoRecusa({ ...base, diaSemanaGrade: 4 })).toBe('Esse horário não existe nesse dia.'))
  it('recusa data inválida', () => expect(motivoRecusa({ ...base, data: '2026-02-30' })).toBe('Data inválida.'))
  it('limita plano 2x', () => {
    expect(motivoRecusa({ ...base, plano: '2x', agendadosNaSemana: 1 })).toBeNull()
    expect(motivoRecusa({ ...base, plano: '2x', agendadosNaSemana: 2 })).toMatch(/2x/)
  })
  it('limita plano 3x', () => expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 3 })).toMatch(/3x/))
  it('limita plano 1x e 4x', () => {
    expect(motivoRecusa({ ...base, plano: '1x', agendadosNaSemana: 0 })).toBeNull()
    expect(motivoRecusa({ ...base, plano: '1x', agendadosNaSemana: 1 })).toMatch(/1x/)
    expect(motivoRecusa({ ...base, plano: '4x', agendadosNaSemana: 3 })).toBeNull()
    expect(motivoRecusa({ ...base, plano: '4x', agendadosNaSemana: 4 })).toMatch(/4x/)
  })
  it('plano 5x recusa o sexto treino', () => {
    expect(motivoRecusa({ ...base, agendadosNaSemana: 4 })).toBeNull()
    expect(motivoRecusa({ ...base, agendadosNaSemana: 5 })).toMatch(/5x/)
  })
  it('avulso (diária e experimental) não tem limite semanal', () => expect(motivoRecusa({ ...base, plano: 'avulso', agendadosNaSemana: 20 })).toBeNull())
})

describe('datas', () => {
  it('semana vai de domingo a sábado', () => {
    expect(semanaDe('2026-11-17')).toEqual({ inicio: '2026-11-15', fim: '2026-11-21' })
    expect(semanaDe('2026-11-15')).toEqual({ inicio: '2026-11-15', fim: '2026-11-21' })
    expect(semanaDe('2026-11-21')).toEqual({ inicio: '2026-11-15', fim: '2026-11-21' })
  })
  it('converte UTC para Bahia', () => {
    expect(agoraBahia(Date.UTC(2026, 10, 18, 2, 30))).toEqual({ data: '2026-11-17', minutos: 23 * 60 + 30 })
  })
  it('retirar só antes da aula', () => {
    expect(aulaNoFuturo('2026-11-17', '10:00', agora)).toBe(false)
    expect(aulaNoFuturo('2026-11-17', '10:01', agora)).toBe(true)
  })
})

describe('limiteDaSemana', () => {
  it('5x vale os dias com aula, até 5', () => {
    expect(limiteDaSemana('5x', 5)).toBe(5)
    expect(limiteDaSemana('5x', 4)).toBe(4)
  })
  it('3x e 2x valem o plano', () => {
    expect(limiteDaSemana('3x', 5)).toBe(3)
    expect(limiteDaSemana('2x', 5)).toBe(2)
  })
  it('semana com feriado reduz o teto', () => expect(limiteDaSemana('3x', 2)).toBe(2))
})

describe('vagasValidas', () => {
  it('aceita de 1 a 999', () => { expect(vagasValidas(1)).toBe(1); expect(vagasValidas(999)).toBe(999) })
  it('recusa zero, acima do teto, fração e texto', () => {
    for (const v of [0, 1000, 2.5, '15', null]) expect(vagasValidas(v)).toBeNull()
  })
})

describe('planos', () => {
  it('o front oferece exatamente os planos que a API aceita', () => expect([...PLANOS.map((p) => p.valor)].sort()).toEqual([...PLANOS_VALIDOS].sort()))
  it('1x e 4x valem o plano, com teto nos dias de aula', () => {
    expect(limiteDaSemana('1x', 5)).toBe(1)
    expect(limiteDaSemana('4x', 5)).toBe(4)
    expect(limiteDaSemana('4x', 3)).toBe(3)
  })
})

describe('nomeVisitante', () => {
  it('arruma espaços', () => expect(nomeVisitante('  Maria   da  Silva ')).toBe('Maria da Silva'))
  it('recusa curto, longo e não texto', () => {
    expect(nomeVisitante('A')).toBeNull()
    expect(nomeVisitante('x'.repeat(61))).toBeNull()
    expect(nomeVisitante(42)).toBeNull()
    expect(nomeVisitante('   ')).toBeNull()
  })
})
