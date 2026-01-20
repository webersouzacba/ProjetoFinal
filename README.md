# Projeto Final PWA — Prova de Conceito (Monorepo)

Estrutura do repositório:

- `infra/`: infraestrutura local (PostgreSQL via Docker Compose)
- `backend/`: API REST (Node.js + Express + Prisma)
- `frontend/`: SPA (Vue 3 + Vite) — em construção

## 1) Banco de Dados (local)

### Subir o Postgres via Docker

> A porta **5432** precisa estar disponível. Se você já tem um Postgres local rodando na 5432, pare o serviço ou altere a porta no `infra/docker-compose.yml`.

```bash
cd infra
docker compose up -d
```

Credenciais padrão (POC):

- Host: `localhost`
- Porta: `5432`
- Database: `app_db`
- User: `app_user`
- Password: `meiw@2026`

## 2) Backend (Node.js + Express + Prisma)

### Configurar variáveis de ambiente

```bash
cd backend
copy .env.example .env  # Windows PowerShell (ou cp .env.example .env)
```

Ajuste o `DATABASE_URL` no `.env` se necessário.

> OAuth Google é opcional nesta fase. Se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` não estiverem configurados, a API sobe com OAuth desativado.

### Instalar dependências e gerar Prisma Client

```bash
cd backend
npm install
npx prisma generate
```

### Sincronizar o schema com o banco existente

Como o banco já foi criado localmente, a abordagem padrão é **introspecção**:

```bash
cd backend
npx prisma db pull
npx prisma generate
```

### Rodar a API

```bash
cd backend
npm run dev
```

A API ficará em `http://localhost:9002`.

Endpoints úteis:

- `GET /health`
- `GET /debug/db` (temporário, para validar conexão)
- `GET /api/docentes`
- `GET /api/propostas`
  - filtros: `?status=publicada` e/ou `?orientador_id=1`

## 3) Frontend (Vue 3 + Vite)

A pasta `frontend/` será usada para a interface web. Para iniciar:

```bash
cd frontend
npm install
npm run dev
```
