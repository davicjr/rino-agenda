// Abas dentro de uma gaveta. Todas ficam montadas: trocar de aba não perde o que foi digitado.
import { useState, type ReactNode } from 'react'
import { Chips } from './Chips'

export type AbaGaveta = { id: string; rotulo: string; conteudo: ReactNode }

export function AbasGaveta({ abas, rotulo }: { abas: AbaGaveta[]; rotulo: string }) {
  const [escolhida, setEscolhida] = useState(abas[0]?.id)
  const ativa = abas.some((a) => a.id === escolhida) ? escolhida : abas[0]?.id
  return (
    <div className="space-y-4 [@media(max-height:620px)]:space-y-2">
      {abas.length > 1 && <Chips rotulo={rotulo} opcoes={abas.map((a) => ({ valor: a.id, rotulo: a.rotulo }))} valor={ativa} onMudar={setEscolhida} />}
      {abas.map((a) => (
        <div key={a.id} role="tabpanel" aria-label={a.rotulo} hidden={a.id !== ativa} className="animate-surge">
          {a.conteudo}
        </div>
      ))}
    </div>
  )
}
