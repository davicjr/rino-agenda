// Etiqueta ao lado do nome de quem não treina pelo plano: diária ou experimental.
import type { TipoAgendamento } from '@/lib/api'

const ROTULO = { diaria: 'Diária', experimental: 'Experimental' } as const

export function EtiquetaTipo({ tipo }: { tipo: TipoAgendamento }) {
  if (tipo === 'plano') return null
  return <span className="font-cond shrink-0 bg-ouro-3 px-2 py-0.5 text-[0.6875rem] font-bold tracking-widest text-ouro-11 uppercase">{ROTULO[tipo]}</span>
}
