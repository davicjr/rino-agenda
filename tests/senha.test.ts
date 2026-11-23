import { describe, expect, it } from 'vitest'
import { novoRegistro, problemaNaSenhaNova, registroConfere, segredoSessao, senhaAdminConfere } from '../functions/_lib/senha'

describe('senha trocada no sistema', () => {
  it('o registro confere só com a senha certa', async () => {
    const r = await novoRegistro('uma-senha-boa')
    expect(await registroConfere(r, 'uma-senha-boa')).toBe(true)
    expect(await registroConfere(r, 'uma-senha-boa ')).toBe(false)
    expect(await registroConfere(r, '')).toBe(false)
  })
  it('dois registros da mesma senha têm sal e hash diferentes', async () => {
    const [a, b] = await Promise.all([novoRegistro('mesma-senha'), novoRegistro('mesma-senha')])
    expect(a.salt).not.toBe(b.salt)
    expect(a.hash).not.toBe(b.hash)
  })
  it('sem troca vale a senha do Cloudflare; depois da troca, só a nova', async () => {
    const env = { ADMIN_SENHA: 'senha-antiga' }
    expect(await senhaAdminConfere(env, null, 'senha-antiga')).toBe(true)
    const r = await novoRegistro('senha-nova-1')
    expect(await senhaAdminConfere(env, r, 'senha-antiga')).toBe(false)
    expect(await senhaAdminConfere(env, r, 'senha-nova-1')).toBe(true)
  })
  it('a troca muda o segredo que assina a sessão', async () => {
    const env = { ADMIN_SENHA: 'senha-antiga' }
    const r1 = await novoRegistro('senha-nova-1')
    const r2 = await novoRegistro('senha-nova-2')
    const s = [segredoSessao(env, null), segredoSessao(env, r1), segredoSessao(env, r2)]
    expect(new Set(s).size).toBe(3)
  })
  it('valida a senha nova', () => {
    expect(problemaNaSenhaNova('curta', 'x')).toMatch(/8/)
    expect(problemaNaSenhaNova('x'.repeat(129), 'x')).toMatch(/128/)
    expect(problemaNaSenhaNova('igual-igual', 'igual-igual')).toMatch(/diferente/)
    expect(problemaNaSenhaNova('senha-valida', 'outra')).toBeNull()
  })
})
