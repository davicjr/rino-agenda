-- Fotos de alunos e professores. O blob fica numa tabela à parte para não pesar nas listas;
-- a coluna `foto` guarda a versão (timestamp) para o endereço da imagem mudar quando ela muda.
CREATE TABLE fotos (
  tipo TEXT NOT NULL CHECK (tipo IN ('aluno', 'professor')),
  dono_id INTEGER NOT NULL,
  mime TEXT NOT NULL,
  dados BLOB NOT NULL,
  PRIMARY KEY (tipo, dono_id)
);
ALTER TABLE alunos ADD COLUMN foto INTEGER;
ALTER TABLE professores ADD COLUMN foto INTEGER;
