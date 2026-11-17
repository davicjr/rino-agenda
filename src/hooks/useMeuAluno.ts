// Lembra neste aparelho quem agendou por último, para o atalho "sou eu de novo".
import { useState } from 'react'

const CHAVE = 'rino:aluno'

export function useMeuAluno() {
  const [id, setId] = useState<number | null>(() => {
    const v = Number(localStorage.getItem(CHAVE))
    return Number.isInteger(v) && v > 0 ? v : null
  })
  const lembrar = (novo: number) => {
    localStorage.setItem(CHAVE, String(novo))
    setId(novo)
  }
  return [id, lembrar] as const
}
