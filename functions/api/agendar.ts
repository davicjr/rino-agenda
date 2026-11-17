// POST /api/agendar {alunoId, gradeId, data}: valida e reserva a vaga numa instrução atômica.
import { erro, inteiro, json, lerCorpo, type Env } from '../_lib/http'
import { janelaAgendar, lerRegras, mensagemJanela } from '../_lib/janela'
import { agoraBahia, ehDataValida, LIMITE_SEMANAL, motivoRecusa, semanaDe, type Plano } from '../_lib/regras'

type Pedido = { alunoId?: unknown; gradeId?: unknown; data?: unknown }

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const corpo = await lerCorpo<Pedido>(request)
  const alunoId = inteiro(corpo?.alunoId)
  const gradeId = inteiro(corpo?.gradeId)
  const data = typeof corpo?.data === 'string' ? corpo.data : ''
  if (!alunoId || !gradeId || !ehDataValida(data)) return erro('Pedido incompleto.')

  const db = env.DB
  const semana = semanaDe(data)
  const [aluno, grade, bloq, ocup, ja, sem, noDia] = await db.batch([
    db.prepare('SELECT plano, ativo FROM alunos WHERE id = ?').bind(alunoId),
    db.prepare('SELECT dia_semana, hora, vagas, ativo FROM grade WHERE id = ?').bind(gradeId),
    db.prepare('SELECT 1 FROM bloqueios WHERE data = ? AND (grade_id IS NULL OR grade_id = ?) LIMIT 1').bind(data, gradeId),
    db.prepare('SELECT COUNT(*) AS n FROM agendamentos WHERE data = ? AND grade_id = ?').bind(data, gradeId),
    db.prepare('SELECT 1 FROM agendamentos WHERE aluno_id = ? AND data = ? AND grade_id = ?').bind(alunoId, data, gradeId),
    db.prepare('SELECT COUNT(*) AS n FROM agendamentos WHERE aluno_id = ? AND data BETWEEN ? AND ?').bind(alunoId, semana.inicio, semana.fim),
    db.prepare('SELECT 1 FROM agendamentos WHERE aluno_id = ? AND data = ? LIMIT 1').bind(alunoId, data),
  ])
  const a = aluno.results[0] as { plano: Plano; ativo: number } | undefined
  const g = grade.results[0] as { dia_semana: number; hora: string; vagas: number; ativo: number } | undefined
  if (!g) return erro('Horário não encontrado.', 404)

  const plano: Plano = a?.plano ?? 'livre'
  const regras = await lerRegras(db)
  const recusa = motivoRecusa(
    {
      data, hora: g.hora, diaSemanaGrade: g.dia_semana, gradeAtiva: g.ativo === 1, alunoAtivo: a?.ativo === 1, plano,
      bloqueado: bloq.results.length > 0, ocupados: (ocup.results[0] as { n: number }).n, vagas: g.vagas,
      jaAgendado: ja.results.length > 0, jaTemNoDia: noDia.results.length > 0, agendadosNaSemana: (sem.results[0] as { n: number }).n,
      foraDaJanela: mensagemJanela(janelaAgendar(data, g.hora, agoraBahia(), regras), regras),
    },
  )
  if (recusa) return erro(recusa, 409)

  // Revalida vaga, limite do plano e um-por-dia dentro da própria inserção: o D1 serializa escritas,
  // então dois pedidos simultâneos pela última vaga não passam juntos.
  const limite = Number.isFinite(LIMITE_SEMANAL[plano]) ? LIMITE_SEMANAL[plano] : 1_000_000
  try {
    const r = await db
      .prepare(
        `INSERT INTO agendamentos (aluno_id, grade_id, data)
         SELECT ?1, ?2, ?3
         WHERE (SELECT COUNT(*) FROM agendamentos WHERE data = ?3 AND grade_id = ?2) < (SELECT vagas FROM grade WHERE id = ?2)
           AND (SELECT COUNT(*) FROM agendamentos WHERE aluno_id = ?1 AND data BETWEEN ?4 AND ?5) < ?6
           AND NOT EXISTS (SELECT 1 FROM agendamentos WHERE aluno_id = ?1 AND data = ?3)`,
      )
      .bind(alunoId, gradeId, data, semana.inicio, semana.fim, limite)
      .run()
    if (r.meta.changes === 0) {
      // Outro pedido passou na frente: descobre qual regra barrou para a mensagem ser a certa.
      const outro = await db.prepare('SELECT 1 FROM agendamentos WHERE aluno_id = ? AND data = ? LIMIT 1').bind(alunoId, data).first()
      return erro(outro ? 'Você já tem treino marcado nesse dia. É um por dia.' : 'Horário lotado.', 409)
    }
    return json({ id: r.meta.last_row_id }, 201)
  } catch (e) {
    if (String(e).includes('UNIQUE')) return erro('Você já está nesse horário.', 409)
    throw e
  }
}
