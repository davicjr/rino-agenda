import type { ReactNode } from 'react'
import { Ajuda } from './Ajuda'

type Props = { children: ReactNode; htmlFor?: string; ajuda?: ReactNode }

export function Rotulo({ children, htmlFor, ajuda }: Props) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <label htmlFor={htmlFor} className="font-cond block text-xs font-bold tracking-[0.16em] text-carvao-10 uppercase">{children}</label>
      {ajuda && <Ajuda assunto={typeof children === 'string' ? children : 'este campo'}>{ajuda}</Ajuda>}
    </div>
  )
}
