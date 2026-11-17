-- Esquema da agenda da Rino Fight Team.
CREATE TABLE alunos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  apelido TEXT,
  plano TEXT NOT NULL DEFAULT 'livre' CHECK (plano IN ('livre', '3x', '2x')),
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE grade (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = domingo
  hora TEXT NOT NULL,                                              -- 'HH:MM'
  vagas INTEGER NOT NULL DEFAULT 15 CHECK (vagas > 0),
  ativo INTEGER NOT NULL DEFAULT 1,
  UNIQUE (dia_semana, hora)
);

CREATE TABLE bloqueios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,                                       -- 'YYYY-MM-DD'
  grade_id INTEGER REFERENCES grade(id) ON DELETE CASCADE,  -- NULL = dia inteiro
  motivo TEXT
);

CREATE TABLE agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  grade_id INTEGER NOT NULL REFERENCES grade(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (aluno_id, data, grade_id)
);

CREATE INDEX idx_agend_data ON agendamentos (data, grade_id);
CREATE INDEX idx_bloq_data ON bloqueios (data);
