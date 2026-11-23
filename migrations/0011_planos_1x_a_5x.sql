-- Planos de 1x a 5x por semana; o antigo "livre" vira 5x. O CHECK de `plano` não muda por ALTER,
-- então a tabela é refeita. Apagar `alunos` apaga em cascata os agendamentos, por isso:
--  * bkp_0011_alunos e bkp_0011_agendamentos guardam uma cópia de tudo como estava antes (podem ser
--    apagadas depois de conferir: DROP TABLE bkp_0011_alunos; DROP TABLE bkp_0011_agendamentos;);
--  * os agendamentos voltam para a tabela no fim.
CREATE TABLE bkp_0011_alunos AS SELECT * FROM alunos;
CREATE TABLE bkp_0011_agendamentos AS SELECT * FROM agendamentos;

CREATE TABLE alunos_nova (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  apelido TEXT,
  plano TEXT NOT NULL DEFAULT '5x' CHECK (plano IN ('5x', '4x', '3x', '2x', '1x')),
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  foto INTEGER
);
INSERT INTO alunos_nova (id, nome, apelido, plano, ativo, criado_em, foto)
SELECT id, nome, apelido, CASE plano WHEN 'livre' THEN '5x' ELSE plano END, ativo, criado_em, foto FROM alunos;

DROP TABLE alunos;
ALTER TABLE alunos_nova RENAME TO alunos;

INSERT INTO agendamentos SELECT * FROM bkp_0011_agendamentos;
