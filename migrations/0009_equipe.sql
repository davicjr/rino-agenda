-- A tabela de professores passa a guardar a equipe: função, contatos opcionais e se dá aulas.
ALTER TABLE professores ADD COLUMN funcao TEXT NOT NULL DEFAULT 'Professor';
ALTER TABLE professores ADD COLUMN telefone TEXT;
ALTER TABLE professores ADD COLUMN instagram TEXT;
ALTER TABLE professores ADD COLUMN da_aula INTEGER NOT NULL DEFAULT 1;
