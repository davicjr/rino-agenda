// Criar ou editar uma pessoa da equipe: função, se dá aulas e contatos opcionais.
import { useState } from 'react'
import { FUNCAO_MAX } from '../../../../functions/_lib/texto'
import type { PessoaForm, ProfessorAdmin } from '@/lib/apiAdmin'
import { telefoneLegivel } from '@/lib/telefone'
import { Botao } from '@/ui/Botao'
import { Entrada } from '@/ui/Campo'
import { Chips } from '@/ui/Chips'
import { Gaveta } from '@/ui/Gaveta'
import { Interruptor } from '@/ui/Interruptor'
import { Rotulo } from '@/ui/Rotulo'
import { EditorFoto } from './EditorFoto'

const FUNCOES = ['Professor', 'Recepção', 'Auxiliar']
const OUTRA = 'Outra'
const OPCOES = [...FUNCOES, OUTRA].map((f) => ({ valor: f, rotulo: f }))

type Props = { alvo: PessoaForm | null; enviando: boolean; onFechar: () => void; onSalvar: (p: PessoaForm) => void; onApagar: (p: ProfessorAdmin) => void }

export function GavetaPessoa({ alvo, enviando, onFechar, onSalvar, onApagar }: Props) {
  return (
    <Gaveta aberta={!!alvo} onFechar={onFechar} titulo={alvo?.id ? 'Pessoa da equipe' : 'Nova pessoa'}>
      {alvo && <Formulario key={alvo.id ?? 'nova'} alvo={alvo} enviando={enviando} onSalvar={onSalvar} onApagar={onApagar} />}
    </Gaveta>
  )
}

function Formulario({ alvo, enviando, onSalvar, onApagar }: { alvo: PessoaForm; enviando: boolean; onSalvar: Props['onSalvar']; onApagar: Props['onApagar'] }) {
  const [p, setP] = useState<PessoaForm>({ ...alvo, telefone: alvo.telefone ? telefoneLegivel(alvo.telefone) : '', instagram: alvo.instagram ?? '' })
  const [outra, setOutra] = useState(!FUNCOES.includes(alvo.funcao))
  const escolher = (f: string) => {
    setOutra(f === OUTRA)
    if (f === OUTRA) setP({ ...p, funcao: FUNCOES.includes(p.funcao) ? '' : p.funcao, da_aula: 0 })
    else setP({ ...p, funcao: f, da_aula: f === 'Professor' ? 1 : 0 })
  }
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSalvar(p) }}>
      {p.id && <EditorFoto tipo="professor" id={p.id} nome={p.nome} foto={p.foto ?? null} onMudou={(foto) => setP({ ...p, foto })} />}
      <div>
        <Rotulo htmlFor="pessoa-nome">Nome</Rotulo>
        <Entrada id="pessoa-nome" value={p.nome} maxLength={60} onChange={(e) => setP({ ...p, nome: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Rotulo>Função</Rotulo>
        <Chips rotulo="Função" opcoes={OPCOES} valor={outra ? OUTRA : p.funcao} onMudar={escolher} />
        {outra && <Entrada aria-label="Nome da função" placeholder="Ex.: Coordenação" value={p.funcao} maxLength={FUNCAO_MAX} onChange={(e) => setP({ ...p, funcao: e.target.value })} />}
      </div>
      <Interruptor rotulo="Dá aulas" ligado={p.da_aula === 1} onMudar={(v) => setP({ ...p, da_aula: v ? 1 : 0 })} />
      <div className="space-y-3">
        <div>
          <Rotulo htmlFor="pessoa-telefone">Telefone / WhatsApp (opcional)</Rotulo>
          <Entrada id="pessoa-telefone" inputMode="tel" placeholder="77 91234-5678" value={p.telefone ?? ''} onChange={(e) => setP({ ...p, telefone: e.target.value })} />
        </div>
        <div>
          <Rotulo htmlFor="pessoa-instagram">Instagram (opcional)</Rotulo>
          <Entrada id="pessoa-instagram" autoCapitalize="none" placeholder="@perfil" value={p.instagram ?? ''} onChange={(e) => setP({ ...p, instagram: e.target.value })} />
        </div>
        <p className="text-sm text-carvao-10">Os contatos preenchidos ficam visíveis para todos no Suporte da agenda.</p>
      </div>
      {p.id && <Interruptor rotulo="Ativo" ligado={p.ativo === 1} onMudar={(v) => setP({ ...p, ativo: v ? 1 : 0 })} />}
      <div className="space-y-2">
        <Botao disabled={enviando || p.nome.trim().length < 2 || p.funcao.trim().length < 2}>Salvar</Botao>
        {p.id && <Botao type="button" variante="neutro" onClick={() => onApagar(p as ProfessorAdmin)}>Apagar pessoa</Botao>}
      </div>
    </form>
  )
}
