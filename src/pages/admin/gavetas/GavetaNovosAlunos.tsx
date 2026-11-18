// Cadastrar vários alunos de uma vez: um nome por linha, mesmo plano para todos.
import { useState } from 'react'
import { PLANOS, type Plano } from '@/lib/planos'
import { Botao } from '@/ui/Botao'
import { AreaTexto } from '@/ui/Campo'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

type Props = { aberta: boolean; enviando: boolean; onFechar: () => void; onConfirmar: (nomes: string[], plano: Plano) => void }

export function GavetaNovosAlunos({ aberta, enviando, onFechar, onConfirmar }: Props) {
  const [texto, setTexto] = useState('')
  const [plano, setPlano] = useState<Plano>('livre')
  const nomes = texto.split('\n').map((n) => n.trim()).filter((n) => n.length >= 2)
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Novos alunos" descricao="Um nome por linha. Dá para colar a lista inteira.">
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onConfirmar(nomes, plano); setTexto('') }}>
        <AreaTexto
          aria-label="Nomes"
          rows={5}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={'Islan Sena\nMaria Souza'}
        />
        <div>
          <Rotulo>Plano</Rotulo>
          <Chips rotulo="Plano" opcoes={PLANOS.map((p) => ({ valor: p.valor, rotulo: p.rotulo }))} valor={plano} onMudar={setPlano} />
        </div>
        <Botao disabled={!nomes.length || enviando}>{nomes.length > 1 ? `Cadastrar ${nomes.length} alunos` : 'Cadastrar'}</Botao>
      </form>
    </Gaveta>
  )
}
