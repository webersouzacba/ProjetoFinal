# Projeto Final — PWA (MEIW/UAb+UTAD)
**Prova de conceito: Gestão de Propostas de Temas de TCC**

Aplicação Web full-stack (SPA + API REST) para apoiar o processo académico de recolha e gestão de **propostas de temas**, em linha com o enunciado do Projeto Final.

---

## 1) Stack e estrutura do repositório

- **Frontend**: Vue 3 + Vite + Vue Router + Pinia + Bootstrap 5
- **Backend**: Node.js + Express + Prisma ORM
- **Banco de dados**: PostgreSQL (Docker Compose em `infra/`)
- **Autenticação**: Google OAuth2 + JWT (Bearer)
- **API Docs**: Swagger UI em `/api-docs` e JSON em `/api-docs.json`
- **Documentos do projeto**: página pública em `/documentos` e arquivos publicados em `/docs/<arquivo>`

Estrutura do monorepo:
- `infra/` — PostgreSQL local (Docker Compose)
- `backend/` — API REST (Express + Prisma)
- `frontend/` — SPA (Vue 3 + Vite)
- `docs/` — documentos do projeto (PDF/MD)

---

## 2) Política final de permissões

A aplicação adota **uma política única e consistente** (sem perfis DEV/PROD via `.env`):

1) **OAuth/JWT ativo (padrão) e utilizador deslogado**
- **CRUD de Docentes**: permitido mesmo sem login (**bootstrap académico**), para que o professor avaliador possa cadastrar um docente com o seu e-mail Google antes do primeiro acesso.
- **Demais funcionalidades (Propostas/Alunos)**: exigem login.

2) **Docente autenticado**
- Acesso total às funcionalidades do sistema.

3) **Autenticação desativada (Simulação académica)**
- Acesso total, simulando um docente logado (**Docente ID=1**), com indicação visual no cabeçalho.
- O `seed` garante a existência do Docente ID=1.

---

## 3) Executar localmente (passo a passo)

### 3.1) Subir o PostgreSQL (Docker)
```bash
cd infra
docker compose up -d
```

### 3.2) Backend (API)
1. Entre em `backend/` e crie o arquivo `.env` a partir de `.env.example`.
2. Instale dependências e inicialize o banco:

```bash
cd backend
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

A API sobe em `http://localhost:9002`.

### 3.3) Frontend (SPA)
1. Entre em `frontend/` e crie o arquivo `.env` a partir de `.env.example`.
2. Instale dependências e rode a aplicação:

```bash
cd frontend
npm install
npm run dev
```

A SPA sobe em `http://localhost:5173`.

---

## 4) Documentos do projeto

- Página pública: `http://localhost:5173/documentos`
- Arquivos são servidos pelo backend: `http://localhost:9002/docs/<arquivo>`
- Listagem é obtida via API pública: `GET http://localhost:9002/api/documentos`

> Para adicionar documentos, basta colocar arquivos (PDF/MD/TXT) em `docs/`.

---

## 5) Observações para entrega (ZIP)

Conforme a política adotada no projeto:
- O **ZIP final de submissão** deve ser gerado a partir do repositório GitHub.
- O repositório deve conter apenas o necessário (com `.gitignore` adequado).
- Arquivos `.env` (com segredos) **não** devem ser versionados; apenas `.env.example`.
