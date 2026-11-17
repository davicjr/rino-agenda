import { describe, expect, it } from 'vitest'
import { limparInfo, normalizarWhatsapp } from '../functions/_lib/info'

describe('normalizarWhatsapp', () => {
  it('aceita formatos comuns e põe o 55', () => {
    expect(normalizarWhatsapp('77 91234-5678')).toBe('5577912345678')
    expect(normalizarWhatsapp('(77) 3421-0000')).toBe('557734210000')
    expect(normalizarWhatsapp('+55 77 91234-5678')).toBe('5577912345678')
  })
  it('vazio continua vazio', () => expect(normalizarWhatsapp('')).toBe(''))
  it('recusa número curto', () => expect(normalizarWhatsapp('12345')).toBeNull())
})

describe('limparInfo', () => {
  it('limpa espaços e o @ do Instagram', () =>
    expect(limparInfo({ responsavel: '  Islan  Sena ', whatsapp: '77912345678', instagram: '@rinofightteam', endereco: '' })).toEqual({
      responsavel: 'Islan Sena', whatsapp: '5577912345678', instagram: 'rinofightteam', endereco: '',
    }))
  it('devolve a mensagem quando o WhatsApp é inválido', () => expect(limparInfo({ whatsapp: '123' })).toMatch(/WhatsApp inválido/))
})
