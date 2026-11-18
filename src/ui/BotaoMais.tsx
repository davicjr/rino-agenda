// Ação de criar das listas do admin: só o sinal de mais, com o nome para leitor de tela.
import { Plus } from 'lucide-react'

export function BotaoMais({ rotulo, onClick }: { rotulo: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={rotulo} className="paralelo grid h-12 w-14 shrink-0 place-items-center bg-ouro-9 text-preto active:bg-ouro-10">
      <Plus className="size-6" />
    </button>
  )
}
