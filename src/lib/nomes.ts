import type { Aluno } from './api'

/** O apelido, quando tem, é o nome que aparece na agenda. */
export const nomeExibido = (a: Pick<Aluno, 'nome' | 'apelido'>) => a.apelido || a.nome
