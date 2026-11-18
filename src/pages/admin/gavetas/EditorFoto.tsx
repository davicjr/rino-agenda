// Foto grande com "Escolher foto" (galeria ou câmera) e "Remover". Ao escolher, abre o recortador;
// a área escolhida é reduzida no aparelho antes de enviar.
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Camera, Trash2 } from 'lucide-react'
import { admin } from '@/lib/apiAdmin'
import { avisar } from '@/lib/avisar'
import { recortarFoto, type Area } from '@/lib/reduzirFoto'
import { cn } from '@/lib/cn'
import { Avatar } from '@/ui/Avatar'
import { RecortarFoto } from './RecortarFoto'

type Props = { tipo: 'aluno' | 'professor'; id: number; nome: string; foto: number | null; onMudou: (foto: number | null) => void }

const acaoFoto = 'paralelo font-cond flex h-11 min-w-0 items-center justify-center gap-2 bg-carvao-4 text-sm font-bold tracking-wider whitespace-nowrap uppercase active:bg-carvao-5'

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
    <div className="flex flex-col items-center gap-4 [@media(max-height:620px)]:gap-2">
      <Avatar nome={nome || '?'} tipo={tipo} id={id} foto={foto} destaque={tipo === 'professor'} className={cn('size-24 shrink-0 text-3xl [@media(max-height:620px)]:size-16 [@media(max-height:620px)]:text-xl', enviando && 'opacity-50')} />
      <div className={cn('grid w-full gap-2', foto && 'grid-cols-2')}>
        <label className={cn(acaoFoto, 'cursor-pointer text-ouro-11 has-[:focus-visible]:brightness-125')}>
          <Camera className="size-5 shrink-0" /> {enviando ? 'Enviando…' : foto ? 'Trocar foto' : 'Escolher foto'}
          <input type="file" accept="image/*" className="sr-only" disabled={enviando} onChange={(e) => { escolher(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {foto && (
          <button type="button" onClick={remover} className={cn(acaoFoto, 'text-carvao-11')}>
            <Trash2 className="size-5 shrink-0" /> Remover
          </button>
        )}
      </div>
    </div>
  )
}
