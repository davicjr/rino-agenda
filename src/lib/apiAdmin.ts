// Chamadas do admin. Em produção o Cloudflare Access libera /api/admin pelo cookie da sessão.
import { chamar, type InfoAcademia, type RegrasJanela } from './api'
import type { Plano } from './planos'

export type AlunoAdmin = { id: number; nome: string; apelido: string | null; plano: Plano; ativo: number; foto: number | null }
export type GradeAdmin = { id: number; dia_semana: number; hora: string; vagas: number; sem_limite: number; ativo: number; professor_id: number | null }
export type ProfessorAdmin = { id: number; nome: string; funcao: string; telefone: string | null; instagram: string | null; da_aula: number; ativo: number; foto: number | null }
export type PessoaForm = Omit<ProfessorAdmin, 'id' | 'foto'> & { id?: number; foto?: number | null }
const corpoPessoa = (p: PessoaForm) => ({ ...p, ativo: p.ativo === 1, da_aula: p.da_aula === 1 })
export type Bloqueio = { id: number; data: string; grade_id: number | null; hora: string | null; motivo: string | null; nota: string | null }

async function enviarImagem(url: string, imagem: Blob) {
  const r = await fetch(url, { method: 'PUT', headers: { 'content-type': imagem.type }, body: imagem })
  const corpo = (await r.json().catch(() => ({}))) as { erro?: string; foto?: number }
  if (!r.ok) throw new Error(corpo.erro ?? 'Não deu para enviar a foto.')
  return corpo.foto ?? null
}

const corpo = (metodo: string, dados: unknown) => ({ method: metodo, body: JSON.stringify(dados) })

export const admin = {
  alunos: () => chamar<AlunoAdmin[]>('/admin/alunos'),
  criarAlunos: (nomes: string[], plano: string) => chamar('/admin/alunos', corpo('POST', { nomes, plano })),
  salvarAluno: (a: AlunoAdmin) => chamar('/admin/alunos', corpo('PATCH', { ...a, ativo: a.ativo === 1 })),
  apagarAluno: (id: number) => chamar(`/admin/alunos?id=${id}`, { method: 'DELETE' }),

  grade: () => chamar<GradeAdmin[]>('/admin/grade'),
  criarHorario: (g: { dia_semana: number; hora: string; vagas: number; sem_limite: number; professor_id: number | null }) => chamar('/admin/grade', corpo('POST', g)),
  salvarHorario: (g: GradeAdmin) => chamar('/admin/grade', corpo('PATCH', { ...g, ativo: g.ativo === 1 })),
  apagarHorario: (id: number) => chamar(`/admin/grade?id=${id}`, { method: 'DELETE' }),

  bloqueios: () => chamar<Bloqueio[]>('/admin/bloqueios'),
  bloquear: (data: string, gradeId: number | null, motivo: string, nota: string) => chamar('/admin/bloqueios', corpo('POST', { data, gradeId, motivo, nota })),
  desbloquear: (id: number) => chamar(`/admin/bloqueios?id=${id}`, { method: 'DELETE' }),

  professores: () => chamar<ProfessorAdmin[]>('/admin/professores'),
  criarPessoa: (p: PessoaForm) => chamar('/admin/professores', corpo('POST', corpoPessoa(p))),
  salvarPessoa: (p: PessoaForm) => chamar('/admin/professores', corpo('PATCH', corpoPessoa(p))),
  apagarProfessor: (id: number) => chamar(`/admin/professores?id=${id}`, { method: 'DELETE' }),
  escalar: (data: string, gradeId: number, professorId: number | null) => chamar('/admin/escala', corpo('PUT', { data, gradeId, professorId })),

  enviarFoto: (tipo: 'aluno' | 'professor', id: number, imagem: Blob) => enviarImagem(`/api/admin/foto?tipo=${tipo}&id=${id}`, imagem),
  enviarFotoTreino: (gradeId: number, data: string, imagem: Blob) => enviarImagem(`/api/admin/foto-aula?gradeId=${gradeId}&data=${data}`, imagem),
  removerFotoTreino: (gradeId: number, data: string) => chamar(`/admin/foto-aula?gradeId=${gradeId}&data=${data}`, { method: 'DELETE' }),
  removerFoto: (tipo: 'aluno' | 'professor', id: number) => chamar(`/admin/foto?tipo=${tipo}&id=${id}`, { method: 'DELETE' }),

  regras: () => chamar<RegrasJanela>('/admin/config'),
  salvarRegras: (r: RegrasJanela) => chamar<RegrasJanela>('/admin/config', corpo('PUT', r)),

  trocarSenha: (atual: string, nova: string) => chamar<{ ok: true }>('/admin/senha', corpo('POST', { atual, nova })),

  info: () => chamar<InfoAcademia>('/admin/info'),
  salvarInfo: (i: InfoAcademia) => chamar<InfoAcademia>('/admin/info', corpo('PUT', i)),

  removerAgendamento: (id: number) => chamar(`/admin/agendamentos?id=${id}`, { method: 'DELETE' }),
}

export const sessao = {
  estado: () => chamar<{ logado: boolean }>('/admin/sessao'),
  entrar: (senha: string) => chamar<{ logado: boolean }>('/admin/sessao', corpo('POST', { senha })),
  sair: () => chamar<{ logado: boolean }>('/admin/sessao', { method: 'DELETE' }),
}
