// Recortador da foto: arrastar posiciona, pinça ou barra aproxima, e o círculo mostra o resultado.
// data-vaul-no-drag impede que arrastar a foto feche a gaveta.
import { useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Botao } from '@/ui/Botao'

type Props = { imagem: string; enviando: boolean; onCancelar: () => void; onUsar: (area: Area) => void }

export function RecortarFoto({ imagem, enviando, onCancelar, onUsar }: Props) {
  const [posicao, setPosicao] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  return (
    <div className="space-y-4">
      <div data-vaul-no-drag className="relative h-72 w-full overflow-hidden rounded-[var(--radius)] bg-preto">
        <Cropper
          image={imagem}
          crop={posicao}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setPosicao}
          onZoomChange={setZoom}
          onCropComplete={(_, px) => setArea(px)}
          style={{ cropAreaStyle: { border: '2px solid var(--color-ouro-9)', color: 'rgb(0 0 0 / 0.7)' } }}
        />
      </div>
      <label data-vaul-no-drag className="flex items-center gap-3">
        <span className="font-cond text-xs font-bold tracking-[0.16em] text-carvao-10 uppercase">Zoom</span>
        <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-11 flex-1 accent-[var(--color-ouro-9)]" />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <Botao type="button" variante="neutro" onClick={onCancelar} disabled={enviando}>Cancelar</Botao>
        <Botao type="button" onClick={() => area && onUsar(area)} disabled={!area || enviando}>{enviando ? 'Enviando…' : 'Usar foto'}</Botao>
      </div>
    </div>
  )
}
