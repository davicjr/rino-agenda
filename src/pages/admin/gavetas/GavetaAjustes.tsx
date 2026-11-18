// Ajustes do admin: regras de agendamento (quando abre, fecha e até quando retirar)
// e as informações oficiais que aparecem no Suporte da agenda.
import { useState } from 'react'
import type { RegrasJanela } from '@/lib/api'
import { resumoRegras } from '@/lib/textoRegras'
import { AbasGaveta } from '@/ui/AbasGaveta'
import { Botao } from '@/ui/Botao'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'
import { FormInfo } from './FormInfo'

const ABRE = [{ valor: -1, rotulo: 'Livre' }, ...[1, 2, 7, 15, 30].map((n) => ({ valor: n, rotulo: `${n}d` }))]
const HORAS = [{ valor: 0, rotulo: 'Na hora' }, ...[1, 2, 6, 12, 24].map((n) => ({ valor: n, rotulo: `${n}h` }))]

type Props = { aberta: boolean; regras: RegrasJanela | undefined; enviando: boolean; onFechar: () => void; onSalvar: (r: RegrasJanela) => void }

export function GavetaAjustes({ aberta, regras, enviando, onFechar, onSalvar }: Props) {
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Ajustes">
      <Abas regras={regras} enviando={enviando} onSalvar={onSalvar} />
    </Gaveta>
  )
}

function Abas({ regras, enviando, onSalvar }: Pick<Props, 'regras' | 'enviando' | 'onSalvar'>) {
  const formRegras = regras && <Formulario key={JSON.stringify(regras)} inicial={regras} enviando={enviando} onSalvar={onSalvar} />
  return <AbasGaveta rotulo="Seções dos ajustes" abas={[{ id: 'regras', rotulo: 'Regras', conteudo: formRegras }, { id: 'contato', rotulo: 'Contato', conteudo: <FormInfo /> }]} />
}

function Formulario({ inicial, enviando, onSalvar }: { inicial: RegrasJanela; enviando: boolean; onSalvar: (r: RegrasJanela) => void }) {
  const [r, setR] = useState(inicial)
  return (
    <form className="space-y-4 [@media(max-height:620px)]:space-y-2" onSubmit={(e) => { e.preventDefault(); onSalvar(r) }}>
      <div>
        <Rotulo>Abre para agendar (antes da aula)</Rotulo>
        <Chips rotulo="Abre" conteudo opcoes={ABRE} valor={r.abreDiasAntes ?? -1} onMudar={(v) => setR({ ...r, abreDiasAntes: v === -1 ? null : v })} />
      </div>
      <div>
        <Rotulo>Fecha o agendamento</Rotulo>
        <Chips rotulo="Fecha" conteudo opcoes={HORAS} valor={r.fechaHorasAntes} onMudar={(v) => setR({ ...r, fechaHorasAntes: v })} />
      </div>
      <div>
        <Rotulo>Retirar até</Rotulo>
        <Chips rotulo="Retirar" conteudo opcoes={HORAS} valor={r.retirarHorasAntes} onMudar={(v) => setR({ ...r, retirarHorasAntes: v })} />
      </div>
      <p className="paralelo bg-carvao-3 p-3 text-sm leading-snug text-carvao-11">{resumoRegras(r)}</p>
      <Botao disabled={enviando}>Salvar regras</Botao>
    </form>
  )
}
