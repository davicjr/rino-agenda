// Suporte: responsável, professores e contato oficial. O WhatsApp abre a conversa com mensagem pronta.
import { useQuery } from '@tanstack/react-query'
import { AtSign, MapPin, MessageCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { Avatar } from '@/ui/Avatar'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'

const MENSAGEM = 'Olá! Vim pela agenda da Rino Fight Team e queria tirar uma dúvida.'

export function GavetaSuporte({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const info = useQuery({ queryKey: ['info'], queryFn: api.info, enabled: aberta, staleTime: 5 * 60_000 })
  const d = info.data
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Suporte" descricao="Informações oficiais da Rino Fight Team.">
      {!d ? (
        <p className="py-6 text-carvao-10">{info.error ? 'Não deu para carregar agora.' : 'Carregando…'}</p>
      ) : (
        <div className="space-y-6 pb-2">
          {d.responsavel && (
            <section>
              <Rotulo>Responsável</Rotulo>
              <p className="font-display -skew-x-6 text-2xl uppercase">{d.responsavel}</p>
            </section>
          )}
          {d.professores.length > 0 && (
            <section>
              <Rotulo>Professores</Rotulo>
              <ul className="space-y-2">
                {d.professores.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-[var(--radius)] bg-carvao-3 p-3">
                    <Avatar nome={p.nome} tipo="professor" id={p.id} foto={p.foto} destaque className="size-10 text-sm" />
                    <span className="font-semibold">{p.nome}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="space-y-2">
            <Rotulo>Contato</Rotulo>
            {d.whatsapp ? (
              <a
                href={`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(MENSAGEM)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="paralelo font-display flex h-14 w-full items-center justify-center gap-2 bg-ouro-9 text-xl tracking-wider text-preto uppercase active:bg-ouro-10"
              >
                <MessageCircle className="size-6" /> Conversar no WhatsApp
              </a>
            ) : (
              <p className="text-carvao-10">Contato ainda não cadastrado. Fale com o professor no treino.</p>
            )}
            {d.instagram && (
              <a href={`https://instagram.com/${d.instagram}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-3 rounded-[var(--radius)] bg-carvao-3 px-4 font-semibold">
                <AtSign className="size-5 text-ouro-11" /> {d.instagram}
              </a>
            )}
            {d.endereco && (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(d.endereco)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-[var(--radius)] bg-carvao-3 px-4 py-3">
                <MapPin className="size-5 shrink-0 text-ouro-11" /> <span>{d.endereco}</span>
              </a>
            )}
          </section>
        </div>
      )}
    </Gaveta>
  )
}
