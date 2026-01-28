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
