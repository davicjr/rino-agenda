-- Limite de tentativas de senha do admin por IP, em janelas de 15 minutos.
CREATE TABLE tentativas_login (
  ip TEXT NOT NULL,
  janela INTEGER NOT NULL,
  falhas INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, janela)
);
