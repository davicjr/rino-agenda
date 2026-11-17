-- Professores, professor padrão por horário da grade e escala por data.
CREATE TABLE professores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE grade ADD COLUMN professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL;

-- grade_id = 0 vale para o dia inteiro; um horário específico tem prioridade sobre o dia.
CREATE TABLE escala (
  data TEXT NOT NULL,
  grade_id INTEGER NOT NULL DEFAULT 0,
  professor_id INTEGER NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
  PRIMARY KEY (data, grade_id)
);
