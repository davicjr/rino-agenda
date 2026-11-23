// Foto do treino, no horário aberto da agenda do admin: só dá para enviar depois que o treino terminou.
// A foto fica disponível no card desse horário, na agenda pública.
import { Camera, Trash2 } from 'lucide-react'
import { useAcao } from '@/hooks/useAdmin'
import type { Horario } from '@/lib/api'
import { admin } from '@/lib/apiAdmin'
import { reduzirFotoTreino } from '@/lib/reduzirFoto'
import { cn } from '@/lib/cn'
import { Rotulo } from '@/ui/Rotulo'

type Props = { gradeId: number; data: string; fase: Horario['fase']; versao: number | null }

const acao = 'paralelo font-cond flex h-11 min-w-0 items-center justify-center gap-2 bg-carvao-4 text-sm font-bold tracking-wider whitespace-nowrap uppercase active:bg-carvao-5'

export function FotoTreino({ gradeId, data, fase, versao }: Props) {
  const chaves = [['dia', data]]
  const enviar = useAcao((f: File) => reduzirFotoTreino(f).then((b) => admin.enviarFotoTreino(gradeId, data, b)), chaves, 'Foto do treino salva.')
  const remover = useAcao(() => admin.removerFotoTreino(gradeId, data), chaves, 'Foto removida.')
  const ocupado = enviar.isPending || remover.isPending
  return (
    <div>
      <Rotulo ajuda="Depois que o treino termina, envie a foto da turma. Ela aparece no card deste horário, na agenda dos alunos.">Foto do treino</Rotulo>
      {versao && (
        <img src={`/api/foto-aula/${gradeId}/${data}?v=${versao}`} alt="Foto do treino" loading="lazy" className={cn('mb-2 max-h-56 w-full object-cover', ocupado && 'opacity-50')} />
      )}
      {fase === 'encerrada' ? (
        <div className={cn('grid gap-2', versao && 'grid-cols-2')}>
          <label className={cn(acao, 'cursor-pointer text-ouro-11 has-[:focus-visible]:brightness-125', ocupado && 'opacity-50')}>
            <Camera className="size-5 shrink-0" /> {enviar.isPending ? 'Enviando…' : versao ? 'Trocar foto' : 'Enviar foto'}
            <input type="file" accept="image/*" className="sr-only" disabled={ocupado} onChange={(e) => { const f = e.target.files?.[0]; if (f) enviar.mutate(f); e.target.value = '' }} />
          </label>
          {versao && (
            <button type="button" disabled={ocupado} onClick={() => remover.mutate()} className={cn(acao, 'text-carvao-11 disabled:opacity-50')}>
              <Trash2 className="size-5 shrink-0" /> Remover
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-carvao-9">Dá para enviar depois que o treino terminar.</p>
      )}
    </div>
  )
}
