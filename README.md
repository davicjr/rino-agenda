# Rino Agenda

Agenda de treinos da **Rino Fight Team** (muay thai). O aluno abre o app, escolhe o dia, vê quem já vai treinar em cada horário e agenda com o próprio nome, sem login. O professor cuida da grade, dos alunos e dos bloqueios num painel protegido por senha.

## Stack
- **Front:** Vite, React, Tailwind 4, vaul (gaveta), cmdk (busca), react-day-picker, GSAP, TanStack Query
- **API:** Cloudflare Pages Functions (`functions/api`)
- **Banco:** Cloudflare D1 (`migrations/`)
- **Admin:** senha guardada no segredo `ADMIN_SENHA`, com sessão em cookie assinado por HMAC e limite de 5 erros a cada 15 minutos por IP

## Regras
- A vaga é reservada numa única instrução SQL, então dois alunos não ficam com a última vaga.
- Planos: livre, 3x e 2x por semana (semana de segunda a domingo).
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
