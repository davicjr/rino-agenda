// Informações oficiais que aparecem no Suporte da agenda: responsável e contato.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAcao } from '@/hooks/useAdmin'
import type { InfoAcademia } from '@/lib/api'
import { admin } from '@/lib/apiAdmin'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Rotulo } from '@/ui/Rotulo'

export function FormInfo() {
  const info = useQuery({ queryKey: ['info-admin'], queryFn: admin.info })
  if (!info.data) return null
  return <Campos key={JSON.stringify(info.data)} inicial={info.data} />
}

function Campos({ inicial }: { inicial: InfoAcademia }) {
  const [i, setI] = useState({ ...inicial, whatsapp: formatar(inicial.whatsapp) })
  const salvar = useAcao(admin.salvarInfo, [['info-admin'], ['info']], 'Contato salvo.')
  const campo = (k: keyof InfoAcademia, rotulo: string, extra: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}) => (
    <div>
      <Rotulo htmlFor={`info-${k}`}>{rotulo}</Rotulo>
      <Entrada id={`info-${k}`} value={i[k]} onChange={(e) => setI({ ...i, [k]: e.target.value })} className="h-12 w-full" {...extra} />
    </div>
  )
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); salvar.mutate(i) }}>
      {campo('responsavel', 'Responsável', { placeholder: 'Nome de quem responde pela academia' })}
      {campo('whatsapp', 'WhatsApp', { placeholder: '77 91234-5678', inputMode: 'tel' })}
      {campo('instagram', 'Instagram (opcional)', { placeholder: '@rinofightteam' })}
      {campo('endereco', 'Endereço (opcional)', { placeholder: 'Rua, número, bairro, cidade' })}
      <Botao disabled={salvar.isPending}>Salvar contato</Botao>
    </form>
  )
}

/** 5577912345678 → 77 91234-5678, para editar sem o DDI. */
function formatar(w: string) {
  const d = w.startsWith('55') ? w.slice(2) : w
  return d.length >= 10 ? `${d.slice(0, 2)} ${d.slice(2, -4)}-${d.slice(-4)}` : d
}
