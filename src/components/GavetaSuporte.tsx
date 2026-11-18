// Suporte em abas: equipe (responsável primeiro, sem repetir), contato oficial e localização com mapa.
import { useQuery } from '@tanstack/react-query'
import { siInstagram, siWhatsapp } from 'simple-icons'
import { api, type Suporte } from '@/lib/api'
import { cn } from '@/lib/cn'
import { telefoneLegivel } from '@/lib/telefone'
import { AbasGaveta, type AbaGaveta } from '@/ui/AbasGaveta'
import { Avatar } from '@/ui/Avatar'
import { Gaveta } from '@/ui/Gaveta'
import { IconeMarca } from '@/ui/IconeMarca'
import { MapaAcademia } from './MapaAcademia'

const MENSAGEM = 'Olá! Vim pela agenda da Rino Fight Team e queria tirar uma dúvida.'
const chave = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase()

/** Coloca o responsável em primeiro: quem também é da equipe aparece uma vez só. */
function montarEquipe(d: Suporte) {
  const resp = chave(d.responsavel)
  const dele = d.equipe.find((p) => chave(p.nome) === resp)
  const outros = d.equipe.filter((p) => p !== dele).map((p) => ({ ...p, papel: p.funcao }))
  if (!d.responsavel) return outros
  const papel = dele && chave(dele.funcao) !== 'responsavel' ? `Responsável · ${dele.funcao}` : 'Responsável'
  return [{ id: 0, foto: null, funcao: '', telefone: null, instagram: null, ...dele, nome: dele?.nome ?? d.responsavel, papel }, ...outros]
}

const acaoPessoa = 'paralelo grid h-11 w-10 shrink-0 place-items-center active:brightness-95'
const cartaoContato = 'paralelo flex h-32 min-w-0 flex-col items-center justify-center gap-1 px-4 text-center active:brightness-95'

export function GavetaSuporte({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const info = useQuery({ queryKey: ['info'], queryFn: api.info, enabled: aberta, staleTime: 5 * 60_000 })
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Suporte">
      {info.data ? <Conteudo d={info.data} /> : <p className="py-6 text-carvao-10">{info.error ? 'Não deu para carregar agora.' : 'Carregando…'}</p>}
    </Gaveta>
  )
}

function Conteudo({ d }: { d: Suporte }) {
  const equipe = montarEquipe(d)
  const abas: AbaGaveta[] = []
  if (equipe.length) abas.push({ id: 'equipe', rotulo: 'Equipe', conteudo: <ListaEquipe equipe={equipe} /> })
  abas.push({ id: 'contato', rotulo: 'Contato', conteudo: <Contato d={d} /> })
  if (d.endereco) abas.push({ id: 'local', rotulo: 'Local', conteudo: <MapaAcademia endereco={d.endereco} /> })
  return <div className="pb-2"><AbasGaveta rotulo="Seções do suporte" abas={abas} /></div>
}

function ListaEquipe({ equipe }: { equipe: ReturnType<typeof montarEquipe> }) {
  return (
    <ul className="space-y-2">
      {equipe.map((p) => (
        <li key={`${p.id}-${p.nome}`} className="paralelo flex items-center gap-3 bg-carvao-3 py-3 pr-4 pl-4">
          <Avatar nome={p.nome} tipo="professor" id={p.id} foto={p.foto} destaque className="size-12" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[1.0625rem] font-semibold">{p.nome}</p>
            <p className="font-cond truncate text-sm font-semibold tracking-wide text-ouro-11">{p.papel}</p>
          </div>
          {p.telefone && (
            <a href={`https://wa.me/${p.telefone}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp de ${p.nome}`} className={`${acaoPessoa} bg-[#25D366] text-preto`}>
              <IconeMarca icone={siWhatsapp} className="size-5" />
            </a>
          )}
          {p.instagram && (
            <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${p.nome}`} className={`${acaoPessoa} bg-gradient-to-r from-[#6d2fa0] to-[#d62f5f] text-branco`}>
              <IconeMarca icone={siInstagram} className="size-5" />
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

function Contato({ d }: { d: Suporte }) {
  if (!d.whatsapp && !d.instagram) return <p className="paralelo bg-carvao-3 p-4 text-carvao-10">Contato ainda não cadastrado. Fale com o professor no treino.</p>
  return (
    <div className={cn('grid gap-2', d.whatsapp && d.instagram && 'grid-cols-2')}>
      {d.whatsapp && (
        <a href={`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(MENSAGEM)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chamar no WhatsApp: ${telefoneLegivel(d.whatsapp)}`} className={`${cartaoContato} bg-[#25D366] text-preto`}>
          <IconeMarca icone={siWhatsapp} className="size-8" />
          <span className="font-display mt-1 text-xl leading-none tracking-wide uppercase">WhatsApp</span>
          <span className="font-cond max-w-full truncate text-sm font-bold tabular-nums">{telefoneLegivel(d.whatsapp)}</span>
        </a>
      )}
      {d.instagram && (
        <a href={`https://instagram.com/${d.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`Seguir no Instagram: @${d.instagram}`} className={`${cartaoContato} bg-gradient-to-r from-[#6d2fa0] via-[#b92b7a] to-[#d62f5f] text-branco`}>
          <IconeMarca icone={siInstagram} className="size-8" />
          <span className="font-display mt-1 text-xl leading-none tracking-wide uppercase">Instagram</span>
          <span className="font-cond max-w-full truncate text-sm font-bold">@{d.instagram}</span>
        </a>
      )}
    </div>
  )
}
