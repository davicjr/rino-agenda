// Onde os avisos aparecem. Na agenda ficam sobre o título do dia, que não tem botões,
// deixando livres os ícones do topo, a semana e o botão de agendar. No admin, sobre o cabeçalho.
import type { CSSProperties } from 'react'
import { useLocation } from 'react-router'
import { Toaster } from 'sonner'

export function Avisos() {
  const admin = useLocation().pathname.startsWith('/admin')
  const topo = admin ? 'max(env(safe-area-inset-top), 0.5rem)' : 'calc(max(env(safe-area-inset-top), var(--folga-m)) + 3rem)'
  return (
    <Toaster
      position="top-center"
      theme="dark"
      visibleToasts={1}
      containerAriaLabel="Avisos"
      offset={{ top: topo }}
      mobileOffset={{ top: topo, left: '1.25rem', right: '1.25rem' }}
      swipeDirections={['top', 'left', 'right']}
      style={{ '--width': 'min(28rem, calc(100vw - 2.5rem))' } as CSSProperties}
    />
  )
}
