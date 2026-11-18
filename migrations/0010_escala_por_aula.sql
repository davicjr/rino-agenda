-- O professor passa a ser escolhido só por aula: quem estava escalado para o dia inteiro
-- continua em cada aula ativa daquela data, sem substituir escolhas feitas para uma aula.
INSERT OR IGNORE INTO escala (data, grade_id, professor_id)
SELECT e.data, g.id, e.professor_id
FROM escala e
JOIN grade g ON g.dia_semana = CAST(strftime('%w', e.data) AS INTEGER) AND g.ativo = 1
WHERE e.grade_id = 0;

DELETE FROM escala WHERE grade_id = 0;
