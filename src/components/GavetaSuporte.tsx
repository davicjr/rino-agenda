// Suporte: equipe (responsável primeiro, sem repetir), contato oficial e localização com mapa.
import { useQuery } from '@tanstack/react-query'
import { siInstagram, siWhatsapp } from 'simple-icons'
import { api, type Suporte } from '@/lib/api'
import { telefoneLegivel } from '@/lib/telefone'
import { Avatar } from '@/ui/Avatar'
import { Gaveta } from '@/ui/Gaveta'
import { IconeMarca } from '@/ui/IconeMarca'
import { MapaAcademia } from './MapaAcademia'

const MENSAGEM = 'Olá! Vim pela agenda da Rino Fight Team e queria tirar uma dúvida.'
const chave = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase()

/** Junta responsável e professores: quem é os dois aparece uma vez só, em primeiro. */
function montarEquipe(d: Suporte) {
  const resp = chave(d.responsavel)
  const dele = d.professores.find((p) => chave(p.nome) === resp)
  const outros = d.professores.filter((p) => p !== dele).map((p) => ({ ...p, papel: 'Professor' }))
  if (!d.responsavel) return outros
  return [{ id: dele?.id ?? 0, nome: dele?.nome ?? d.responsavel, foto: dele?.foto ?? null, papel: dele ? 'Responsável · Professor' : 'Responsável' }, ...outros]
}

function Titulo({ children }: { children: string }) {
  return <h3 className="font-display mb-3 text-xl tracking-wide uppercase">{children}</h3>
}

export function GavetaSuporte({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const info = useQuery({ queryKey: ['info'], queryFn: api.info, enabled: aberta, staleTime: 5 * 60_000 })
  const d = info.data
  const equipe = d ? montarEquipe(d) : []
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Suporte">
      {!d ? (
        <p className="py-6 text-carvao-10">{info.error ? 'Não deu para carregar agora.' : 'Carregando…'}</p>
      ) : (
        <div className="space-y-7 pb-2">
          {equipe.length > 0 && (
            <section>
              <Titulo>Equipe</Titulo>
              <ul className="divide-y divide-carvao-4 rounded-[var(--radius)] bg-carvao-3">
                {equipe.map((p) => (
                  <li key={`${p.id}-${p.nome}`} className="flex items-center gap-3 p-3">
                    <Avatar nome={p.nome} tipo="professor" id={p.id} foto={p.foto} destaque className="size-12" />
                    <div className="min-w-0">
                      <p className="truncate text-[1.0625rem] font-semibold">{p.nome}</p>
                      <p className="font-cond text-sm font-semibold tracking-wide text-ouro-11">{p.papel}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <Titulo>Contato</Titulo>
            {d.whatsapp ? (
              <a
                href={`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(MENSAGEM)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="paralelo flex h-16 items-center justify-center gap-3 bg-[#25D366] text-preto active:brightness-95"
              >
                <IconeMarca icone={siWhatsapp} className="size-7" />
                <span className="text-left leading-none">
                  <span className="font-display block text-xl tracking-wide uppercase">Chamar no WhatsApp</span>
                  <span className="font-cond mt-1 block text-sm font-bold tabular-nums">{telefoneLegivel(d.whatsapp)}</span>
                </span>
              </a>
            ) : (
              <p className="rounded-[var(--radius)] bg-carvao-3 p-4 text-carvao-10">Contato ainda não cadastrado. Fale com o professor no treino.</p>
            )}
            {d.instagram && (
              <a
                href={`https://instagram.com/${d.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="paralelo mt-2 flex h-16 items-center justify-center gap-3 bg-gradient-to-r from-[#6d2fa0] via-[#b92b7a] to-[#d62f5f] text-branco active:brightness-95"
              >
                <IconeMarca icone={siInstagram} className="size-7" />
                <span className="min-w-0 text-left leading-none">
                  <span className="font-display block text-xl tracking-wide uppercase">Seguir no Instagram</span>
                  <span className="font-cond mt-1 block truncate text-sm font-bold">@{d.instagram}</span>
                </span>
              </a>
            )}
          </section>

          {d.endereco && (
            <section>
              <Titulo>Onde estamos</Titulo>
              <MapaAcademia endereco={d.endereco} />
            </section>
          )}
        </div>
      )}
    </Gaveta>
  )
}
