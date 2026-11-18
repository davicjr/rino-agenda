import { describe, expect, it } from 'vitest'
import { limparPessoa, normalizarInstagram } from '../functions/_lib/equipe'

describe('normalizarInstagram', () => {
  it('aceita @, nome e link', () => {
    expect(normalizarInstagram('@Rino.Team')).toBe('rino.team')
    expect(normalizarInstagram('rino_team')).toBe('rino_team')
    expect(normalizarInstagram('https://www.instagram.com/rino.team/?hl=pt')).toBe('rino.team')
  })
  it('vazio continua vazio', () => expect(normalizarInstagram('')).toBe(''))
  it('recusa espaço e símbolo', () => expect(normalizarInstagram('rino team!')).toBeNull())
})

describe('limparPessoa', () => {
  it('só o nome basta: vira professor que dá aulas', () =>
    expect(limparPessoa({ nome: ' Ana  Souza ' })).toEqual({ nome: 'Ana Souza', funcao: 'Professor', telefone: null, instagram: null, daAula: true }))
  it('guarda função, contatos e quem não dá aulas', () =>
    expect(limparPessoa({ nome: 'Bia', funcao: 'Recepção', telefone: '(77) 91234-5678', instagram: '@bia', da_aula: false })).toEqual({
      nome: 'Bia', funcao: 'Recepção', telefone: '5577912345678', instagram: 'bia', daAula: false,
    }))
  it('recusa nome curto', () => expect(limparPessoa({ nome: 'A' })).toMatch(/nome/))
  it('recusa telefone inválido', () => expect(limparPessoa({ nome: 'Bia', telefone: '123' })).toMatch(/Telefone/))
  it('recusa Instagram inválido', () => expect(limparPessoa({ nome: 'Bia', instagram: 'a b' })).toMatch(/Instagram/))
  it('corta função longa', () => expect((limparPessoa({ nome: 'Bia', funcao: 'x'.repeat(50) }) as { funcao: string }).funcao).toHaveLength(30))
})
