// Foto do aluno ou professor; sem foto, as iniciais. A versão no endereço renova o cache.
import { cn } from '@/lib/cn'
import { iniciais } from '@/lib/datas'

type Props = { nome: string; tipo: 'aluno' | 'professor'; id: number; foto?: number | null; destaque?: boolean; className?: string }

export function Avatar({ nome, tipo, id, foto, destaque = false, className }: Props) {
  if (foto) return <img src={`/api/foto/${tipo}/${id}?v=${foto}`} alt="" loading="lazy" className={cn('shrink-0 rounded-full bg-carvao-5 object-cover', className)} />
  return (
    <span className={cn('font-cond grid shrink-0 place-items-center rounded-full font-bold', destaque ? 'bg-ouro-9 text-preto' : 'bg-carvao-5', className)}>
      {iniciais(nome)}
    </span>
  )
}
