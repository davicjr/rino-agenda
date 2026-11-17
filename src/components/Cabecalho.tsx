// Marca no topo: escudo, nome da equipe e o lema.
export function Cabecalho() {
  return (
    <header className="relative z-10 flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),1.25rem)]">
      <img src="/escudo.webp" alt="" width={52} height={52} className="size-13 shrink-0" />
      <div className="leading-none">
        <p className="font-display text-[1.6rem] tracking-wide uppercase">Rino Fight Team</p>
        <p className="font-cond mt-1 text-sm font-semibold tracking-[0.18em] text-carvao-11 uppercase">
          Muay Thai · Agenda de treinos
        </p>
      </div>
    </header>
  )
}
