import type { ReactNode } from 'react'

export const Rotulo = ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="font-cond mb-1.5 block text-xs font-bold tracking-[0.16em] text-carvao-10 uppercase">
    {children}
  </label>
)
