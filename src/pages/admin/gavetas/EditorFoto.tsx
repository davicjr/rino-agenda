// Foto grande com "Escolher foto" (galeria ou câmera) e "Remover". Reduz no aparelho antes de enviar.
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { admin } from '@/lib/apiAdmin'
import { reduzirFoto } from '@/lib/reduzirFoto'
import { Avatar } from '@/ui/Avatar'

type Props = { tipo: 'aluno' | 'professor'; id: number; nome: string; foto: number | null; onMudou: (foto: number | null) => void }

export function EditorFoto({ tipo, id, nome, foto, onMudou }: Props) {
  const qc = useQueryClient()
  const [enviando, setEnviando] = useState(false)
  const atualizar = (nova: number | null) => {
    onMudou(nova)
    qc.invalidateQueries({ queryKey: [tipo === 'aluno' ? 'alunos-admin' : 'professores'] })
    qc.invalidateQueries({ queryKey: ['inicio'] })
    qc.invalidateQueries({ queryKey: ['dia'] })
  }
  const escolher = async (arquivo?: File) => {
    if (!arquivo) return
    setEnviando(true)
    try {
      atualizar(await admin.enviarFoto(tipo, id, await reduzirFoto(arquivo)))
      toast.success('Foto atualizada.')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }
  const remover = async () => {
    await admin.removerFoto(tipo, id)
    atualizar(null)
  }
  return (
    <div className="flex items-center gap-4">
      <Avatar nome={nome || '?'} tipo={tipo} id={id} foto={foto} destaque={tipo === 'professor'} className={`size-20 text-2xl ${enviando ? 'opacity-50' : ''}`} />
      <div className="flex flex-col gap-1">
        <label className="font-cond flex h-11 cursor-pointer items-center gap-2 text-sm font-bold tracking-wider text-ouro-11 uppercase">
          <Camera className="size-5" /> {enviando ? 'Enviando…' : foto ? 'Trocar foto' : 'Escolher foto'}
          <input type="file" accept="image/*" className="sr-only" disabled={enviando} onChange={(e) => escolher(e.target.files?.[0])} />
        </label>
        {foto && (
          <button type="button" onClick={remover} className="font-cond flex h-9 items-center gap-2 text-sm font-bold tracking-wider text-carvao-10 uppercase">
            <Trash2 className="size-4" /> Remover
          </button>
        )}
      </div>
    </div>
  )
}
