import { describe, expect, it } from 'vitest'
import { assinar, senhaConfere, validar } from '../functions/_lib/sessao'

const S = 'senha-de-teste-longa'

describe('sessão do admin', () => {
  it('aceita token recém-assinado', async () => {
    const t = await assinar(S, 1_000)
    expect(await validar(S, t, 2_000)).toBe(true)
  })
  it('recusa token expirado', async () => {
    const t = await assinar(S, 1_000)
    expect(await validar(S, t, 1_000 + 31 * 86_400_000)).toBe(false)
  })
  it('recusa token adulterado ou de outra senha', async () => {
    const t = await assinar(S, 1_000)
    const [exp, mac] = t.split('.')
    expect(await validar(S, `${Number(exp) + 999999}.${mac}`, 2_000)).toBe(false)
    expect(await validar('outra-senha', t, 2_000)).toBe(false)
    expect(await validar(S, 'lixo', 2_000)).toBe(false)
    expect(await validar(S, null, 2_000)).toBe(false)
  })
  it('compara senha', async () => {
    expect(await senhaConfere(S, S)).toBe(true)
    expect(await senhaConfere(S, S + 'x')).toBe(false)
    expect(await senhaConfere(S, '')).toBe(false)
  })
})
