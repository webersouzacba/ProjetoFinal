# Projeto Final — PWA (MEIW/UAb+UTAD)
**Prova de conceito: Gestão de Propostas de Temas de TCC**

Este repositório implementa uma aplicação Web full-stack (SPA + API REST) para apoiar o processo académico de recolha e gestão de **propostas de temas**, conforme o enunciado do Projeto Final da UC.

---

## 1. Visão geral

### Objetivo funcional (escopo do enunciado)
- **Docentes (autenticados)**: consultar e gerir as suas propostas; adicionar; editar; apagar; gerir vínculos (coorientadores, alunos e palavras-chave).
- **Visitantes (anónimos)**: consultar **lista de docentes** e **detalhe do docente**.

### Stack e organização
- **Frontend**: Vue 3 + Vite + Vue Router + Pinia + Bootstrap 5
- **Backend**: Node.js + Express + Prisma ORM
- **BD**: PostgreSQL (via Docker Compose em `infra/`)
- **Auth**: Google OAuth2 + emissão de **JWT** para consumo da API
- **Docs**: Swagger em `/api-docs`

Estrutura do monorepo:
- `infra/` — PostgreSQL local (Docker Compose)
- `backend/` — API REST (Express + Prisma)
- `frontend/` — SPA (Vue 3 + Vite)

---

## 2. Pré-requisitos

- **Node.js 18+**
- **Docker** (para PostgreSQL local)

---

## 3. Executar localmente (passo a passo)

### 3.1 Subir o PostgreSQL (Docker)
```bash
cd infra
docker compose up -d

## Política de permissões (versão final)

A aplicação adota uma política única e consistente (sem perfis DEV/PROD via `.env`):

1) **OAuth/JWT ativo (padrão) e utilizador deslogado**
- **CRUD de Docentes**: permitido mesmo sem login (bootstrap académico), para que o professor avaliador possa cadastrar um docente com o seu e-mail Google antes do primeiro acesso.
- **Demais funcionalidades (Propostas/Alunos)**: exigem login.

2) **Docente autenticado**
- Acesso total às funcionalidades do sistema.

3) **Autenticação desativada (Simulação académica)**
- Acesso total, simulando um docente logado (**Docente ID=1**), com indicação visual no cabeçalho.
- Requer o seed para garantir a existência do Docente ID=1.
