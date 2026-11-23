// POST /api/agendar {gradeId, data, tipo?, alunoId?, nome?}: valida e reserva a vaga numa instrução atômica.
// tipo 'plano' (padrão) exige alunoId; 'diaria' aceita alunoId ou nome digitado; 'experimental' só nome digitado.
import { erro, inteiro, json, lerCorpo, type Env } from '../_lib/http'
import { janelaAgendar, lerRegras, mensagemJanela } from '../_lib/janela'
import { agoraBahia, ehDataValida, LIMITE_SEMANAL, motivoRecusa, nomeVisitante, semanaDe, type Plano, type TipoAgendamento } from '../_lib/regras'

type Pedido = { alunoId?: unknown; gradeId?: unknown; data?: unknown; tipo?: unknown; nome?: unknown }
type Semana = { inicio: string; fim: string }

// Consultas sobre a pessoa, sempre na mesma ordem: cadastro, já neste horário, treinos do plano na semana, já treina no dia.
const doAluno = (db: D1Database, id: number, data: string, gradeId: number, s: Semana) => [
  db.prepare('SELECT plano, ativo FROM alunos WHERE id = ?').bind(id),
  db.prepare('SELECT 1 FROM agendamentos WHERE aluno_id = ? AND data = ? AND grade_id = ?').bind(id, data, gradeId),
  db.prepare("SELECT COUNT(*) AS n FROM agendamentos WHERE aluno_id = ? AND tipo = 'plano' AND data BETWEEN ? AND ?").bind(id, s.inicio, s.fim),
  db.prepare('SELECT 1 FROM agendamentos WHERE aluno_id = ? AND data = ? LIMIT 1').bind(id, data),
]
const doVisitante = (db: D1Database, nome: string, data: string, gradeId: number) => [
  db.prepare("SELECT 'avulso' AS plano, 1 AS ativo"),
  db.prepare('SELECT 1 FROM agendamentos WHERE visitante = ? COLLATE NOCASE AND data = ? AND grade_id = ?').bind(nome, data, gradeId),
  db.prepare('SELECT 0 AS n'),
  db.prepare('SELECT 1 FROM agendamentos WHERE visitante = ? COLLATE NOCASE AND data = ? LIMIT 1').bind(nome, data),
]

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const corpo = await lerCorpo<Pedido>(request)
  const gradeId = inteiro(corpo?.gradeId)
  const data = typeof corpo?.data === 'string' ? corpo.data : ''
  const tipo: TipoAgendamento = corpo?.tipo === 'diaria' || corpo?.tipo === 'experimental' ? corpo.tipo : 'plano'
  const alunoId = tipo === 'experimental' ? null : inteiro(corpo?.alunoId)
  const nome = alunoId ? null : nomeVisitante(corpo?.nome)
  if (!gradeId || !ehDataValida(data) || (!alunoId && !nome)) return erro(tipo === 'plano' ? 'Pedido incompleto.' : 'Digite o nome de quem vai treinar.')
  if (tipo === 'plano' && !alunoId) return erro('Pedido incompleto.')

  const db = env.DB
  const semana = semanaDe(data)
  const pessoa = alunoId ? doAluno(db, alunoId, data, gradeId, semana) : doVisitante(db, nome!, data, gradeId)
  const [grade, bloq, ocup, aluno, ja, sem, noDia] = await db.batch([
    db.prepare('SELECT dia_semana, hora, vagas, sem_limite, ativo FROM grade WHERE id = ?').bind(gradeId),
    db.prepare('SELECT 1 FROM bloqueios WHERE data = ? AND (grade_id IS NULL OR grade_id = ?) LIMIT 1').bind(data, gradeId),
    db.prepare('SELECT COUNT(*) AS n FROM agendamentos WHERE data = ? AND grade_id = ?').bind(data, gradeId),
    ...pessoa,
  ])
  const a = aluno.results[0] as { plano: Plano; ativo: number } | undefined
  const g = grade.results[0] as { dia_semana: number; hora: string; vagas: number; sem_limite: number; ativo: number } | undefined
  if (!g) return erro('Horário não encontrado.', 404)

  // Só o plano tem limite semanal; diária e experimental valem um treino, sem gastar o plano.
  const plano: Plano | 'avulso' = tipo === 'plano' ? (a?.plano ?? '5x') : 'avulso'
  const regras = await lerRegras(db)
  const recusa = motivoRecusa({
    data, hora: g.hora, diaSemanaGrade: g.dia_semana, gradeAtiva: g.ativo === 1, alunoAtivo: a?.ativo === 1, plano,
    bloqueado: bloq.results.length > 0, ocupados: (ocup.results[0] as { n: number }).n, vagas: g.sem_limite ? null : g.vagas,
    jaAgendado: ja.results.length > 0, jaTemNoDia: noDia.results.length > 0, agendadosNaSemana: (sem.results[0] as { n: number }).n,
    foraDaJanela: mensagemJanela(janelaAgendar(data, g.hora, agoraBahia(), regras), regras),
  })
  if (recusa) return erro(recusa, 409)

  // Revalida vaga, limite do plano e um-por-dia dentro da própria inserção: o D1 serializa escritas,
  // então dois pedidos simultâneos pela última vaga não passam juntos.
  const limite = Number.isFinite(LIMITE_SEMANAL[plano]) ? LIMITE_SEMANAL[plano] : 1_000_000
  try {
    const r = await db
      .prepare(
        `INSERT INTO agendamentos (aluno_id, visitante, grade_id, data, tipo)
         SELECT ?1, ?2, ?3, ?4, ?5
         WHERE ((SELECT sem_limite FROM grade WHERE id = ?3) = 1
                OR (SELECT COUNT(*) FROM agendamentos WHERE data = ?4 AND grade_id = ?3) < (SELECT vagas FROM grade WHERE id = ?3))
           AND (SELECT COUNT(*) FROM agendamentos WHERE aluno_id = ?1 AND tipo = 'plano' AND data BETWEEN ?6 AND ?7) < ?8
           AND NOT EXISTS (SELECT 1 FROM agendamentos WHERE data = ?4 AND ((?1 IS NOT NULL AND aluno_id = ?1) OR (?2 IS NOT NULL AND visitante = ?2 COLLATE NOCASE)))`,
      )
      .bind(alunoId, nome, gradeId, data, tipo, semana.inicio, semana.fim, limite)
      .run()
    if (r.meta.changes === 0) {
      // Outro pedido passou na frente: descobre qual regra barrou para a mensagem ser a certa.
      const outro = await pessoa[3].first()
      return erro(outro ? 'Você já tem treino marcado nesse dia. É um por dia.' : 'Horário lotado.', 409)
    }
    return json({ id: r.meta.last_row_id }, 201)
  } catch (e) {
    if (String(e).includes('UNIQUE')) return erro('Você já está nesse horário.', 409)
    throw e
  }
}
