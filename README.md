# Projeto Final — PWA (MEIW/UAb+UTAD)  
**Prova de conceito: Gestão de Propostas de Temas de Projeto Final**

Este repositório implementa uma aplicação Web full‑stack (SPA + API REST) para apoiar o processo académico de recolha e gestão de **propostas de temas** por docentes, conforme o enunciado do Projeto Final da UC. fileciteturn0file2

---

## 1. Visão geral

### Objetivo funcional (escopo mínimo do enunciado)
- **Docentes (autenticados)**: consultar as suas propostas; adicionar; editar; apagar; gerir vínculos (coorientadores, alunos e palavras‑chave). fileciteturn0file2  
- **Visitantes (anónimos)**: consultar **lista de docentes** e **detalhe do docente**. fileciteturn0file2

### Stack e organização
- **Frontend**: Vue 3 + Vite + Vue Router + Pinia + Bootstrap 5  
- **Backend**: Node.js + Express + Prisma ORM  
- **BD**: PostgreSQL (via Docker Compose em `infra/`)  
- **Auth**: Google OAuth2 (Passport) + emissão de **JWT** para consumo da API  
- **Docs**: Swagger em `/api-docs`

Estrutura do monorepo:
- `infra/` — PostgreSQL local (Docker Compose)  
- `backend/` — API REST (Express + Prisma)  
- `frontend/` — SPA (Vue 3 + Vite)

---

## 2. Pré‑requisitos

- **Node.js 18+** (Vite 5 requer Node 18 ou superior)
- **Docker** (para PostgreSQL local)
- **Git** (opcional)

---

## 3. Executar localmente (passo a passo)

### 3.1 Subir o PostgreSQL (Docker)
```bash
cd infra
docker compose up -d
```

Credenciais padrão (ver `infra/docker-compose.yml`):
- Host: `localhost`
- Porta: `5432`
- Database: `app_db`
- User: `app_user`
- Password: `dev@2026`

> Observação: em `DATABASE_URL` a senha precisa estar URL‑encoded (`@` → `%40`).

---

### 3.2 Backend (API REST)

#### 1) Configurar `.env`
```bash
cd backend
cp .env.example .env   # ou: copy .env.example .env (Windows)
```

Variáveis relevantes (resumo):
- `PORT=9002`
- `DATABASE_URL=postgresql://app_user:dev%402026@localhost:5432/app_db?schema=public`
- `AUTH_ENABLED=false` (DEV) | `true` (ENTREGA com OAuth)
- `JWT_SECRET=dev@2026`

#### 2) Instalar dependências e preparar BD
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

#### 3) Executar
```bash
npm run dev
```

API:
- Health: `GET /health`
- Swagger UI: `GET /api-docs`
- Swagger JSON: `GET /api-docs.json`

---

### 3.3 Frontend (SPA)

#### 1) Configurar `.env`
```bash
cd ../frontend
cp .env.example .env
```

Variáveis relevantes:
- `VITE_API_BASE_URL=http://localhost:9002`
- `VITE_AUTH_ENABLED=false` (DEV) | `true` (ENTREGA)

#### 2) Instalar e executar
```bash
npm install
npm run dev
```

App (Vite): `http://localhost:5173`

---

## 4. Autenticação e modos de execução

O projeto foi estruturado com **feature flags** para facilitar validação em ambiente académico.

### 4.1 Modo DEV (sem OAuth, com bypass local)
- Backend: `AUTH_ENABLED=false`
- Frontend: `VITE_AUTH_ENABLED=false`
- Rotas protegidas aceitam um utilizador “Docente DEV” (configurável em `.env`).

Uso recomendado para correção rápida em máquina do docente/avaliador, sem depender de credenciais Google.

### 4.2 Modo ENTREGA (OAuth Google + JWT)
- Backend: `AUTH_ENABLED=true`
- Frontend: `VITE_AUTH_ENABLED=true`
- Necessário configurar no **Google Cloud Console**:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL` (padrão: `http://localhost:9002/auth/google/callback`)

**Política importante**: não há auto‑provisionamento.  
A conta Google só autentica se o e‑mail já existir em `docentes` (cadastro prévio).

Fluxo:
1. Frontend redireciona para `/auth/google` (backend)
2. Backend autentica com Google e redireciona para:
   - `GET /auth/callback?token=...` (frontend)
3. SPA salva o token e usa `Authorization: Bearer <token>` nos endpoints protegidos
4. Perfil: `GET /api/auth/me`

---

## 5. Endpoints principais (resumo)

### Visitante (público)
- `GET /api/docentes` — listar docentes  
- `GET /api/docentes/:id` — detalhe do docente

### Docente (autenticado)
- `GET /api/propostas/mine` — minhas propostas  
- `POST /api/propostas/mine` — criar proposta  
- `PUT /api/propostas/mine/:id` — atualizar proposta  
- `DELETE /api/propostas/mine/:id` — remover proposta  
- `GET /api/alunos` + CRUD completo — gestão de alunos (apoio)  
- `GET /api/palavras-chave` — lista distinta de palavras‑chave (apoio)

> Para detalhes completos, consulte `/api-docs`.

---

## 6. Notas de implementação (decisões relevantes)

- Persistência com **Prisma** e migrações versionadas.
- Integridade relacional: propostas referenciam orientador; vínculos (alunos/coorientadores/palavras‑chave) usam tabelas de associação.
- `status` de proposta modelado como `enum` (`rascunho`, `publicada`, `atribuida`, `encerrada`) para suportar evolução do ciclo de vida.

---

## 7. Resolução de problemas (rápido)

- **Porta 5432 ocupada**: pare outro Postgres ou altere `ports` em `infra/docker-compose.yml` e `DATABASE_URL`.
- **Falha OAuth**: verifique credenciais, URL de callback e se o docente já está cadastrado.
- **Senha com @**: lembre do `%40` no `DATABASE_URL`.

---

## 8. Contexto académico

Documento de especificação (Tarefa 5.1) produzido para a UC: fileciteturn0file3  
Enunciados da tarefa 5.1 e 5.2: fileciteturn0file0 fileciteturn0file1
