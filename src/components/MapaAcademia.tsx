// Mapa do endereço, sem chave de API. Tocar no mapa abre o endereço no Maps; "Como chegar" abre a rota.
// Só carrega com a gaveta aberta, e não captura o dedo, para a gaveta continuar rolando.
import { Navigation } from 'lucide-react'
import { siGooglemaps } from 'simple-icons'
import { IconeMarca } from '@/ui/IconeMarca'

export function MapaAcademia({ endereco }: { endereco: string }) {
  const q = encodeURIComponent(endereco)
  const rota = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  return (
    <div className="paralelo overflow-hidden bg-carvao-3">
      <div className="relative h-40 bg-carvao-4">
        <iframe
          title={`Mapa: ${endereco}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          className="pointer-events-none size-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.7)]"
        />
        <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" aria-label="Abrir endereço no Google Maps" className="absolute inset-0" />
      </div>
      <div className="p-4">
        <p className="flex items-start gap-2.5 leading-snug [overflow-wrap:anywhere]">
          <IconeMarca icone={siGooglemaps} className="mt-0.5 size-5 text-ouro-9" />
          {endereco}
        </p>
        <a href={rota} target="_blank" rel="noopener noreferrer" className="paralelo font-display mt-3 flex h-12 items-center justify-center gap-2 bg-carvao-5 text-lg tracking-wider uppercase active:bg-carvao-6">
          <Navigation className="size-5 text-ouro-9" /> Como chegar
        </a>
      </div>
    </div>
  )
}
