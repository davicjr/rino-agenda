import { describe, expect, it } from 'vitest'
import { faseAula, janelaAgendar, mensagemJanela, minutosAte, podeRetirar, REGRAS_PADRAO, type RegrasJanela } from '../functions/_lib/janela'

// Terça, 2026-11-17, 10:00 em Salvador.
const agora = { data: '2026-11-17', minutos: 10 * 60 }
const r = (x: Partial<RegrasJanela>): RegrasJanela => ({ ...REGRAS_PADRAO, ...x })

describe('minutosAte', () => {
  it('conta dias e horas', () => {
    expect(minutosAte('2026-11-17', '18:00', agora)).toBe(8 * 60)
    expect(minutosAte('2026-11-18', '09:00', agora)).toBe(23 * 60)
    expect(minutosAte('2026-11-17', '09:00', agora)).toBe(-60)
  })
})

describe('faseAula', () => {
  it('antes de começar é futura', () => expect(faseAula('2026-11-17', '10:01', agora)).toBe('futura'))
  it('no minuto em que começa já está treinando', () => expect(faseAula('2026-11-17', '10:00', agora)).toBe('treinando'))
  it('segue treinando até o último minuto da hora', () => expect(faseAula('2026-11-17', '09:01', agora)).toBe('treinando'))
  it('encerra quando completa 1h', () => expect(faseAula('2026-11-17', '09:00', agora)).toBe('encerrada'))
  it('aula de outro dia já passou', () => expect(faseAula('2026-11-16', '10:00', agora)).toBe('encerrada'))
  it('aula de amanhã é futura', () => expect(faseAula('2026-11-18', '09:00', agora)).toBe('futura'))
  it('aula das 23h30 segue treinando depois da meia-noite', () =>
    expect(faseAula('2026-11-16', '23:30', { data: '2026-11-17', minutos: 15 })).toBe('treinando'))
})

describe('janelaAgendar', () => {
  it('passou', () => expect(janelaAgendar('2026-11-17', '09:00', agora, r({})).estado).toBe('passou'))
  it('livre na hora: aberta até começar', () => expect(janelaAgendar('2026-11-17', '10:01', agora, r({})).estado).toBe('aberta'))
  it('fecha 12h antes', () => {
    expect(janelaAgendar('2026-11-17', '18:00', agora, r({ fechaHorasAntes: 12 })).estado).toBe('fechou')
    expect(janelaAgendar('2026-11-17', '22:01', agora, r({ fechaHorasAntes: 12 })).estado).toBe('aberta')
  })
  it('abre 7 dias antes', () => {
    const e = janelaAgendar('2026-11-25', '18:00', agora, r({ abreDiasAntes: 7 }))
    expect(e).toEqual({ estado: 'cedo', abreEm: { data: '2026-11-18', hora: '18:00' } })
    expect(janelaAgendar('2026-11-24', '09:00', agora, r({ abreDiasAntes: 7 })).estado).toBe('aberta')
  })
  it('abertura livre não limita', () => expect(janelaAgendar('2027-03-01', '18:00', agora, r({ abreDiasAntes: null })).estado).toBe('aberta'))
  it('mensagens', () => {
    expect(mensagemJanela({ estado: 'fechou' }, r({ fechaHorasAntes: 12 }))).toMatch(/12h antes/)
    expect(mensagemJanela({ estado: 'cedo', abreEm: { data: 'x', hora: 'y' } }, r({ abreDiasAntes: 1 }))).toMatch(/1 dia antes/)
  })
})

describe('podeRetirar', () => {
  it('na hora: até começar', () => {
    expect(podeRetirar('2026-11-17', '10:01', agora, r({}))).toBe(true)
    expect(podeRetirar('2026-11-17', '10:00', agora, r({}))).toBe(false)
  })
  it('2h antes', () => {
    expect(podeRetirar('2026-11-17', '11:59', agora, r({ retirarHorasAntes: 2 }))).toBe(false)
    expect(podeRetirar('2026-11-17', '12:01', agora, r({ retirarHorasAntes: 2 }))).toBe(true)
  })
})
