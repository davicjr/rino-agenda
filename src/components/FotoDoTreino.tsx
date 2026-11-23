// Foto do treino no card do horário: uma faixa com miniatura que abre a foto inteira numa gaveta.
import { useState } from 'react'
import { Camera, Maximize2 } from 'lucide-react'
import { horaCurta, nomeDia } from '@/lib/datas'
import { Gaveta } from '@/ui/Gaveta'

type Props = { gradeId: number; data: string; hora: string; versao: number }

export function FotoDoTreino({ gradeId, data, hora, versao }: Props) {
  const [aberta, setAberta] = useState(false)
  const src = `/api/foto-aula/${gradeId}/${data}?v=${versao}`
  return (
    <>
      <button onClick={() => setAberta(true)} className="paralelo flex h-16 w-full items-center gap-3 bg-carvao-3 pr-4 text-left active:bg-carvao-4">
        <img src={src} alt="" loading="lazy" className="h-full w-20 shrink-0 object-cover" />
        <span className="font-cond flex min-w-0 flex-1 items-center gap-2 text-sm font-bold tracking-wider text-ouro-11 uppercase"><Camera aria-hidden className="size-4 shrink-0" /> Foto do treino</span>
        <Maximize2 aria-hidden className="size-5 shrink-0 text-carvao-10" />
      </button>
      <Gaveta aberta={aberta} onFechar={() => setAberta(false)} titulo="Foto do treino" descricao={`${nomeDia(data)}, ${horaCurta(hora)}`}>
        <img src={src} alt={`Foto do treino de ${nomeDia(data).toLowerCase()}, ${horaCurta(hora)}`} className="max-h-[65dvh] w-full object-contain" />
      </Gaveta>
    </>
  )
}
