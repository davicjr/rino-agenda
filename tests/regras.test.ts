import { describe, expect, it } from 'vitest'
import { agoraBahia, aulaNoFuturo, limiteDaSemana, motivoRecusa, semanaDe, type PedidoAgendamento } from '../functions/_lib/regras'

// Terça, 2026-11-17, 10:00 em Salvador.
const agora = { data: '2026-11-17', minutos: 10 * 60 }

const base: PedidoAgendamento = {
  data: '2026-11-18', hora: '18:00', diaSemanaGrade: 3, gradeAtiva: true, alunoAtivo: true,
  plano: 'livre', bloqueado: false, ocupados: 0, vagas: 15, jaAgendado: false, jaTemNoDia: false, agendadosNaSemana: 0,
}

describe('motivoRecusa', () => {
  it('aceita pedido válido', () => expect(motivoRecusa(base, agora)).toBeNull())
  it('recusa horário lotado', () => expect(motivoRecusa({ ...base, ocupados: 15 }, agora)).toBe('Horário lotado.'))
  it('recusa horário que já passou hoje', () =>
    expect(motivoRecusa({ ...base, data: '2026-11-17', diaSemanaGrade: 2, hora: '09:00' }, agora)).toBe('Esse horário já passou.'))
  it('aceita mais tarde no mesmo dia', () =>
    expect(motivoRecusa({ ...base, data: '2026-11-17', diaSemanaGrade: 2, hora: '17:00' }, agora)).toBeNull())
  it('recusa dia passado', () =>
    expect(motivoRecusa({ ...base, data: '2026-11-16', diaSemanaGrade: 1 }, agora)).toBe('Esse horário já passou.'))
  it('recusa bloqueio', () => expect(motivoRecusa({ ...base, bloqueado: true }, agora)).toBe('Não tem aula nesse horário.'))
  it('recusa duplicado', () => expect(motivoRecusa({ ...base, jaAgendado: true }, agora)).toBe('Você já está nesse horário.'))
  it('recusa segundo treino no mesmo dia', () =>
    expect(motivoRecusa({ ...base, jaTemNoDia: true }, agora)).toMatch(/um por dia/))
  it('plano 3x aceita o terceiro dia e recusa o quarto', () => {
    expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 2 }, agora)).toBeNull()
    expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 3 }, agora)).toMatch(/3x/)
  })
  it('recusa grade de outro dia da semana', () =>
    expect(motivoRecusa({ ...base, diaSemanaGrade: 4 }, agora)).toBe('Esse horário não existe nesse dia.'))
  it('recusa além da janela', () =>
    expect(motivoRecusa({ ...base, data: '2026-12-30', diaSemanaGrade: 3 }, agora)).toMatch(/30 dias/))
  it('recusa data inválida', () => expect(motivoRecusa({ ...base, data: '2026-02-30' }, agora)).toBe('Data inválida.'))
  it('limita plano 2x', () => {
    expect(motivoRecusa({ ...base, plano: '2x', agendadosNaSemana: 1 }, agora)).toBeNull()
    expect(motivoRecusa({ ...base, plano: '2x', agendadosNaSemana: 2 }, agora)).toMatch(/2x/)
  })
  it('limita plano 3x', () => expect(motivoRecusa({ ...base, plano: '3x', agendadosNaSemana: 3 }, agora)).toMatch(/3x/))
  it('plano livre não tem limite', () => expect(motivoRecusa({ ...base, agendadosNaSemana: 20 }, agora)).toBeNull())
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
  it('livre vale os dias com aula', () => expect(limiteDaSemana('livre', 5)).toBe(5))
  it('3x e 2x valem o plano', () => {
    expect(limiteDaSemana('3x', 5)).toBe(3)
    expect(limiteDaSemana('2x', 5)).toBe(2)
  })
  it('semana com feriado reduz o teto', () => expect(limiteDaSemana('3x', 2)).toBe(2))
})
