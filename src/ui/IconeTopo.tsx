// Ícone do cabeçalho: mesmo tamanho de toque e mesma cor em todo o app (botão ou link).
import type { ReactNode } from 'react'
import { Link } from 'react-router'

const classe = 'grid size-11 place-items-center text-carvao-10 transition-colors active:text-carvao-12'

type Props = { rotulo: string; children: ReactNode } & ({ para: string; onClick?: never } | { onClick: () => void; para?: never })

export function IconeTopo({ rotulo, children, para, onClick }: Props) {
  if (para) return <Link to={para} aria-label={rotulo} className={classe}>{children}</Link>
  return <button type="button" onClick={onClick} aria-label={rotulo} className={classe}>{children}</button>
}
