// Ajustes do admin: regras de agendamento (quando abre, fecha e até quando retirar)
// e as informações oficiais que aparecem no Suporte da agenda.
import { useState } from 'react'
import type { RegrasJanela } from '@/lib/api'
import { resumoRegras } from '@/lib/textoRegras'
import { Botao } from '@/ui/Botao'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Rotulo } from '@/ui/Rotulo'
import { FormInfo } from './FormInfo'

const ABRE = [{ valor: -1, rotulo: 'Livre' }, ...[1, 2, 7, 15, 30].map((n) => ({ valor: n, rotulo: `${n}d` }))]
const HORAS = [{ valor: 0, rotulo: 'Na hora' }, ...[1, 2, 6, 12, 24].map((n) => ({ valor: n, rotulo: `${n}h` }))]

type Props = { aberta: boolean; regras: RegrasJanela | undefined; enviando: boolean; onFechar: () => void; onSalvar: (r: RegrasJanela) => void }

export function GavetaRegras({ aberta, regras, enviando, onFechar, onSalvar }: Props) {
  return (
    <Gaveta aberta={aberta} onFechar={onFechar} titulo="Ajustes">
      <h3 className="font-display mb-3 text-xl tracking-wide uppercase">Regras de agendamento</h3>
      {regras && <Formulario key={JSON.stringify(regras)} inicial={regras} enviando={enviando} onSalvar={onSalvar} />}
      <h3 className="font-display mt-8 mb-3 border-t border-carvao-4 pt-6 text-xl tracking-wide uppercase">Suporte e contato</h3>
      <FormInfo />
    </Gaveta>
  )
}

function Formulario({ inicial, enviando, onSalvar }: { inicial: RegrasJanela; enviando: boolean; onSalvar: (r: RegrasJanela) => void }) {
  const [r, setR] = useState(inicial)
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSalvar(r) }}>
      <div>
        <Rotulo>Abre para agendar (antes da aula)</Rotulo>
        <Chips rotulo="Abre" opcoes={ABRE} valor={r.abreDiasAntes ?? -1} onMudar={(v) => setR({ ...r, abreDiasAntes: v === -1 ? null : v })} />
      </div>
      <div>
        <Rotulo>Fecha o agendamento</Rotulo>
        <Chips rotulo="Fecha" opcoes={HORAS} valor={r.fechaHorasAntes} onMudar={(v) => setR({ ...r, fechaHorasAntes: v })} />
      </div>
      <div>
        <Rotulo>Retirar até</Rotulo>
        <Chips rotulo="Retirar" opcoes={HORAS} valor={r.retirarHorasAntes} onMudar={(v) => setR({ ...r, retirarHorasAntes: v })} />
      </div>
      <p className="rounded-[var(--radius)] bg-carvao-3 p-4 text-carvao-11">{resumoRegras(r)}</p>
      <Botao disabled={enviando}>Salvar regras</Botao>
    </form>
  )
}
