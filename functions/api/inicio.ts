// GET /api/inicio: grade semanal, alunos ativos e a data de hoje na Bahia.
import { alunosAtivos, gradeAtiva } from '../_lib/consultas'
import { json, type Env } from '../_lib/http'
import { agoraBahia, JANELA_DIAS, somarDias } from '../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const agora = agoraBahia()
  const [grade, alunos, bloq] = await Promise.all([
    gradeAtiva(env.DB),
    alunosAtivos(env.DB),
    env.DB.prepare('SELECT data, motivo FROM bloqueios WHERE grade_id IS NULL AND data BETWEEN ? AND ?')
      .bind(somarDias(agora.data, -60), somarDias(agora.data, JANELA_DIAS))
      .all<{ data: string; motivo: string | null }>(),
  ])
  return json({
    agora,
    bloqueiosDia: bloq.results,
    janelaDias: JANELA_DIAS,
    grade: grade.results,
    alunos: alunos.results.map(({ id, nome, apelido, foto }) => ({ id, nome, apelido, foto })),
  })
}
