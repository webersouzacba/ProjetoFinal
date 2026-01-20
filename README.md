# Projeto Final PWA — Back-end (Node.js + Express + PostgreSQL + Prisma)

Este back-end implementa a API REST do projeto final descrito na **Atividade 5.1**, com organização em camadas **Routes → Controllers → Services → Repositories**, autenticação **Google OAuth2** e persistência em **PostgreSQL** (local) via **Prisma**.

## 1) Pré-requisitos
- Node.js 18+ (recomendado)
- Docker + Docker Compose (para o Postgres local)

## 2) Subir o banco local
```bash
docker compose up -d
```

## 3) Configurar variáveis de ambiente
```bash
copy .env.example .env  # (Windows PowerShell) ou cp .env.example .env
```
Preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

## 4) Instalar dependências
```bash
npm install
```

## 5) Criar schema e gerar client
```bash
npx prisma migrate dev --name init
```

## 6) Popular com dados iniciais (seed)
```bash
npm run seed
```

## 7) Rodar em desenvolvimento
```bash
npm run dev
```

## 8) Endpoints principais
- `GET /health`
- `GET /auth/google` (inicia OAuth)
- `GET /auth/google/callback`
- Visitante:
  - `GET /api/docentes`
  - `GET /api/docentes/:id`
- Docente autenticado (Bearer JWT):
  - `GET /api/propostas/mine`
  - `GET /api/propostas/mine/:id`
  - `POST /api/propostas/mine`
  - `PUT /api/propostas/mine/:id`
  - `DELETE /api/propostas/mine/:id`

> Observação: O callback do OAuth redireciona para `FRONTEND_URL/auth/callback?token=...` por padrão.
