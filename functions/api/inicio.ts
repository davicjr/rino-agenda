// GET /api/inicio: grade semanal, alunos ativos e a data de hoje na Bahia.
import { alunosAtivos, gradeAtiva } from '../_lib/consultas'
import { json, type Env } from '../_lib/http'
import { agoraBahia, JANELA_DIAS } from '../_lib/regras'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [grade, alunos] = await Promise.all([gradeAtiva(env.DB), alunosAtivos(env.DB)])
  return json({
    agora: agoraBahia(),
    janelaDias: JANELA_DIAS,
    grade: grade.results,
    alunos: alunos.results.map(({ id, nome, apelido }) => ({ id, nome, apelido })),
  })
}
