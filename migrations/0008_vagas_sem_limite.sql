-- Horário pode não ter limite de vagas; o número guardado volta a valer se o limite for religado.
ALTER TABLE grade ADD COLUMN sem_limite INTEGER NOT NULL DEFAULT 0;
