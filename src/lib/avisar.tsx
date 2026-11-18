// Único jeito de notificar no app. Mostra um aviso por vez: o novo substitui o anterior.
import { toast } from 'sonner'
import { Aviso, type TipoAviso } from '@/ui/Aviso'
import { vibrar } from './impacto'

const DURACAO: Record<TipoAviso, number> = { sucesso: 3500, info: 3000, erro: 6000 }
let atual: string | number | undefined

function mostrar(tipo: TipoAviso, titulo: string, detalhe?: string) {
  if (atual !== undefined) toast.dismiss(atual)
  const duracao = DURACAO[tipo]
  atual = toast.custom(
    (id) => <Aviso tipo={tipo} titulo={titulo.replace(/\.$/, '')} detalhe={detalhe} duracao={duracao} onFechar={() => toast.dismiss(id)} />,
    { duration: duracao },
  )
}

export const avisar = {
  sucesso: (titulo: string, detalhe?: string) => mostrar('sucesso', titulo, detalhe),
  info: (titulo: string, detalhe?: string) => mostrar('info', titulo, detalhe),
  erro: (detalhe: string, titulo = 'Não deu certo') => {
    vibrar(40)
    mostrar('erro', titulo, detalhe)
  },
}
