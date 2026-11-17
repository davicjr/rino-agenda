// GET /api/inicio: grade semanal, alunos ativos e a data de hoje na Bahia.
import { alunosAtivos, gradeAtiva } from '../_lib/consultas'
import { json, type Env } from '../_lib/http'
import { lerRegras } from '../_lib/janela'
import { agoraBahia, somarDias } from '../_lib/regras'

const NAVEGAR_DIAS = 60

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const agora = agoraBahia()
  const [grade, alunos, bloq, regras] = await Promise.all([
    gradeAtiva(env.DB),
    alunosAtivos(env.DB),
    env.DB.prepare('SELECT data, motivo FROM bloqueios WHERE grade_id IS NULL AND data BETWEEN ? AND ?')
      .bind(somarDias(agora.data, -60), somarDias(agora.data, NAVEGAR_DIAS))
      .all<{ data: string; motivo: string | null }>(),
    lerRegras(env.DB),
  ])
  return json({
    agora,
    bloqueiosDia: bloq.results,
    janelaDias: NAVEGAR_DIAS,
    regras,
    grade: grade.results,
    alunos: alunos.results.map(({ id, nome, apelido, foto }) => ({ id, nome, apelido, foto })),
  })
}
