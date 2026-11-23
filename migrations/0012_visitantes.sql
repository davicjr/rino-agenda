-- Diária e experimental. Um agendamento tem um tipo e, no lugar do aluno cadastrado,
-- pode ter só o nome digitado (`visitante`). A experimental é sempre por nome digitado.
-- bkp_0012_agendamentos guarda os agendamentos como estavam antes (pode ser apagada depois de conferir).
CREATE TABLE bkp_0012_agendamentos AS SELECT * FROM agendamentos;

CREATE TABLE agendamentos_nova (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
  grade_id INTEGER NOT NULL REFERENCES grade(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  tipo TEXT NOT NULL DEFAULT 'plano' CHECK (tipo IN ('plano', 'diaria', 'experimental')),
  visitante TEXT,
  UNIQUE (aluno_id, data, grade_id),
  CHECK (aluno_id IS NOT NULL OR visitante IS NOT NULL)
);
INSERT INTO agendamentos_nova (id, aluno_id, grade_id, data, criado_em)
SELECT id, aluno_id, grade_id, data, criado_em FROM agendamentos;

DROP TABLE agendamentos;
ALTER TABLE agendamentos_nova RENAME TO agendamentos;

CREATE INDEX idx_agend_data ON agendamentos (data, grade_id);
CREATE INDEX idx_agend_visitante ON agendamentos (data, visitante COLLATE NOCASE);
