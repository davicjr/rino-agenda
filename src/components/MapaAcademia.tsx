// Mapa do endereço nas cores da equipe, sem chave de API: o Google localiza o número exato,
// o filtro aplica a paleta e o marcador com o escudo fica sobre o ponto. Tocar abre o Maps.
// Os créditos do Google continuam visíveis, e o mapa não captura o dedo, para a gaveta continuar rolando.
import { ExternalLink, MapPin } from 'lucide-react'

export function MapaAcademia({ endereco }: { endereco: string }) {
  const q = encodeURIComponent(endereco)
  return (
    <div className="paralelo overflow-hidden bg-carvao-3">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir ${endereco} no Google Maps`}
        className="relative block h-[min(11.5rem,36dvh)] overflow-hidden bg-carvao-4"
      >
        <iframe
          title={`Mapa: ${endereco}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          className="pointer-events-none size-full border-0 [filter:grayscale(1)_invert(0.92)_sepia(0.45)_saturate(1.7)_brightness(0.82)_contrast(1.15)]"
        />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-preto/70 to-transparent" />
        <span className="paralelo font-cond absolute top-2 left-2 flex h-11 items-center gap-1.5 bg-preto px-3.5 text-xs font-bold tracking-wider text-ouro-11 uppercase">
          Abrir no Maps <ExternalLink className="size-4" />
        </span>
        <Marcador />
      </a>
      <p className="flex items-start gap-2.5 p-4 leading-snug [overflow-wrap:anywhere]">
        <MapPin className="mt-0.5 size-5 shrink-0 text-ouro-9" />
        {endereco}
      </p>
    </div>
  )
}

/** A ponta fica no centro do mapa, exatamente onde o Google marca o endereço. */
function Marcador() {
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
      <span className="absolute -top-3 -left-3 size-6 rounded-full bg-ouro-9/40 motion-safe:animate-ping" />
      <span className="animate-surge absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center drop-shadow-[0_3px_6px_rgb(0_0_0/0.6)]">
        <span className="paralelo block bg-ouro-9 p-0.5">
          <span className="paralelo grid h-12 w-14 place-items-center bg-preto">
            <img src="/escudo.webp" alt="" className="h-10 w-auto" />
          </span>
        </span>
        <span className="-mt-px block h-2.5 w-4 bg-ouro-9 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      </span>
    </span>
  )
}
