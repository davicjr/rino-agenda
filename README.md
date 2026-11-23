# Rino Agenda

Agenda de treinos da **Rino Fight Team** (muay thai). O aluno abre o app, escolhe o dia, vê quem já vai treinar em cada horário e agenda com o próprio nome, sem login. O professor cuida da grade, dos alunos e dos bloqueios num painel protegido por senha.

## Stack
- **Front:** Vite, React, Tailwind 4, vaul (gaveta), cmdk (busca), react-day-picker, GSAP, TanStack Query
- **API:** Cloudflare Pages Functions (`functions/api`)
- **Banco:** Cloudflare D1 (`migrations/`)
- **Admin:** senha inicial no segredo `ADMIN_SENHA`; depois que o professor troca a senha em Ajustes → Senha, a nova fica no banco (PBKDF2) e vale no lugar da inicial. Sessão em cookie assinado por HMAC e limite de 5 erros a cada 15 minutos por IP (vale também para a troca de senha)

## Regras
- A vaga é reservada numa única instrução SQL, então dois alunos não ficam com a última vaga.
- Planos: 5x, 4x, 3x, 2x e 1x por semana (semana de domingo a sábado).
- Diária e experimental: na gaveta de agendar, a diária vale para um aluno da lista ou um nome digitado; a experimental é só nome digitado. Não têm limite semanal, não gastam o plano e continuam sendo um treino por dia. Ocupam vaga e aparecem com etiqueta.
- Não se agenda no passado, além de 30 dias, em horário bloqueado ou lotado.
- O aluno só retira o agendamento antes do horário da aula.
- O fuso é `America/Bahia`.

As regras ficam em `functions/_lib/regras.ts` e os testes em `tests/regras.test.ts`.

## Rodar local
```sh
npm install
echo 'ADMIN_SENHA=uma-senha-local' > .dev.vars   # ou ADMIN_LIVRE_LOCAL=1 para pular a senha no ambiente local
npm run db:local                          # cria as tabelas e a grade no D1 local
npm run build && npm run pages            # http://localhost:8788
npm test
```

## Esqueci a senha do painel
Apagar a senha trocada volta a valer o segredo `ADMIN_SENHA` do Cloudflare:
`npx wrangler d1 execute rino-agenda --remote --command "DELETE FROM config WHERE chave = 'admin.senha'"`

## Deploy
1. Criar o banco e aplicar as migrations:
   - `npx wrangler d1 create rino-agenda`
   - colar o `database_id` no `wrangler.toml`
   - `npm run db:remote`
2. No painel do Cloudflare, criar o projeto em **Workers & Pages → Create → Pages → Connect to Git**, apontando para este repositório:
   - build: `npm run build`
   - saída: `dist`
3. Definir a senha do painel (fica só no Cloudflare):
   - `npx wrangler pages secret put ADMIN_SENHA --project-name rinoft`
   - fazer um novo deploy para ela valer
