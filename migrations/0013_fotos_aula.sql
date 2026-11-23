-- Foto do treino: uma por aula (horário da grade + data), enviada pelo admin depois que o treino termina.
-- `versao` (timestamp) muda o endereço da imagem quando ela é trocada, para o cache renovar.
CREATE TABLE fotos_aula (
  grade_id INTEGER NOT NULL REFERENCES grade(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  mime TEXT NOT NULL,
  dados BLOB NOT NULL,
  versao INTEGER NOT NULL,
  PRIMARY KEY (grade_id, data)
);
