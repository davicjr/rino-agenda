// Rodapé dos formulários: Salvar sempre visível e, ao editar, Apagar ao lado.
import { cn } from '@/lib/cn'
import { Botao } from './Botao'

type Props = { desabilitado?: boolean; onApagar?: () => void }

export function AcoesForm({ desabilitado, onApagar }: Props) {
  return (
    <div className={cn('grid gap-2', onApagar && 'grid-cols-2')}>
      {onApagar && <Botao type="button" variante="neutro" onClick={onApagar}>Apagar</Botao>}
      <Botao disabled={desabilitado}>Salvar</Botao>
    </div>
  )
}
