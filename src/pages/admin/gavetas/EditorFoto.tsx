// Foto grande com "Escolher foto" (galeria ou câmera) e "Remover". Ao escolher, abre o recortador;
// a área escolhida é reduzida no aparelho antes de enviar.
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Camera, Trash2 } from 'lucide-react'
import { admin } from '@/lib/apiAdmin'
import { avisar } from '@/lib/avisar'
import { recortarFoto, type Area } from '@/lib/reduzirFoto'
import { Avatar } from '@/ui/Avatar'
import { RecortarFoto } from './RecortarFoto'

type Props = { tipo: 'aluno' | 'professor'; id: number; nome: string; foto: number | null; onMudou: (foto: number | null) => void }

export function EditorFoto({ tipo, id, nome, foto, onMudou }: Props) {
  const qc = useQueryClient()
  const [enviando, setEnviando] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [previa, setPrevia] = useState<string | null>(null)
  const atualizar = (nova: number | null) => {
    onMudou(nova)
    qc.invalidateQueries({ queryKey: [tipo === 'aluno' ? 'alunos-admin' : 'professores'] })
    qc.invalidateQueries({ queryKey: ['inicio'] })
    qc.invalidateQueries({ queryKey: ['info'] })
    qc.invalidateQueries({ queryKey: ['dia'] })
  }
  const escolher = (f?: File) => {
    if (!f) return
    setArquivo(f)
    setPrevia(URL.createObjectURL(f))
  }
  const cancelar = () => {
    if (previa) URL.revokeObjectURL(previa)
    setPrevia(null)
    setArquivo(null)
  }
  const usar = async (area: Area) => {
    if (!arquivo) return
    setEnviando(true)
    try {
      atualizar(await admin.enviarFoto(tipo, id, await recortarFoto(arquivo, area)))
      avisar.sucesso('Foto atualizada')
      cancelar()
    } catch (e) {
      avisar.erro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }
  const remover = async () => {
    await admin.removerFoto(tipo, id)
    atualizar(null)
  }
  if (previa) return <RecortarFoto imagem={previa} enviando={enviando} onCancelar={cancelar} onUsar={usar} />
  return (
    <div className="flex items-center gap-4">
      <Avatar nome={nome || '?'} tipo={tipo} id={id} foto={foto} destaque={tipo === 'professor'} className={`size-16 shrink-0 text-2xl min-[360px]:size-20 ${enviando ? 'opacity-50' : ''}`} />
      <div className="flex min-w-0 items-center gap-3">
        <label className="font-cond flex h-11 cursor-pointer items-center gap-2 text-sm font-bold tracking-wider whitespace-nowrap text-ouro-11 uppercase">
          <Camera className="size-5" /> {enviando ? 'Enviando…' : foto ? 'Trocar foto' : 'Escolher foto'}
          <input type="file" accept="image/*" className="sr-only" disabled={enviando} onChange={(e) => { escolher(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {foto && (
          <button type="button" onClick={remover} className="font-cond flex h-11 items-center gap-2 text-sm font-bold tracking-wider whitespace-nowrap text-carvao-10 uppercase">
            <Trash2 className="size-4" /> Remover
          </button>
        )}
      </div>
    </div>
  )
}
