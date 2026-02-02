# Projeto Final — Programação Web Avançada (PWA)

Aplicação Web desenvolvida no âmbito da unidade curricular **Programação Web Avançada**, do  
**Mestrado em Engenharia Informática e Tecnologias Web (MEIW)** — parceria **Universidade Aberta (UAb)** e **Universidade de Trás-os-Montes e Alto Douro (UTAD)**.

O projeto consiste em uma **aplicação web para gestão de propostas de temas de projeto final de curso**, permitindo que docentes criem, editem e removam propostas, bem como associem coorientadores, alunos e palavras-chave, respeitando regras de autenticação e autorização.

---

## 📌 Contexto Académico

- **UC:** Programação Web Avançada  
- **Ano Letivo:** 2025/2026  
- **Aluno:** Weber Marcelo Guirra de Souza (UTAD: al77734)  
- **Tarefas associadas:**  
  - **Tarefa 5.1** — Especificação da Aplicação  
  - **Tarefa 5.2** — Desenvolvimento da Aplicação (Front-end e Back-end)

Este repositório corresponde à **implementação final** descrita no relatório da **Tarefa 5.2**.

---

## 🧩 Visão Geral da Aplicação

A solução é composta por:

- **Front-end:** Single Page Application (SPA)  
- **Back-end:** API REST  
- **Persistência:** Base de dados relacional PostgreSQL  
- **Autenticação:** Google OAuth2  
- **Documentação da API:** Swagger (OpenAPI)

A comunicação entre front-end e back-end é realizada via **HTTP/JSON**, mantendo separação clara de responsabilidades.

---

## 🗂 Estrutura do Repositório

```
ProjetoFinal/
├── frontend/   # SPA desenvolvida em Vue.js
├── backend/    # API REST desenvolvida em Node.js / Express
├── infra/      # Infraestrutura (Docker Compose - PostgreSQL)
├── docs/       # Documentos do projeto (PDFs e relatórios)
└── README.md
```

O repositório **não contém dependências (`node_modules`) nem ficheiros sensíveis (`.env`)**.  
São disponibilizados apenas ficheiros `.env.example` para configuração local.

---

## 🚀 Acesso Rápido (Avaliação)

### Ambiente de Produção (VPS) — recomendado para avaliação

- **Aplicação (Front-end):**  
  http://webersouza.com.br/projetofinal/

- **Documentos do Projeto:**  
  http://webersouza.com.br/projetofinal/documentos

- **Documentação da API (Swagger):**  
  http://webersouza.com.br:5190/api-docs

---

## ▶️ Execução em Ambiente Local (Localhost)

### 1️⃣ Base de Dados (PostgreSQL)

A base de dados é executada via Docker.

```bash
cd infra
docker compose up -d
```

---

### 2️⃣ Back-end (API REST)

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

- **API:** http://localhost:5190  
- **Swagger:** http://localhost:5190/api-docs  

O acesso direto ao banco de dados **não é necessário para avaliação**, uma vez que todas as funcionalidades podem ser validadas por meio da interface web e da API.

---

### 3️⃣ Front-end (SPA)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- **Aplicação:** http://localhost:9102

---

## 🔐 Autenticação, Permissões e Simulação

- Autenticação via **Google OAuth2**.  
- O utilizador inicia **não autenticado**.  
- O **CRUD de Docentes é permitido sem autenticação**, possibilitando o *bootstrap académico*.  
- Após autenticação, o docente tem acesso completo às funcionalidades.

### 🔁 Modo de Simulação Académica

A opção **“Desativar autenticação”**:

- simula um docente autenticado (Docente ID = 1);
- é indicada visualmente na interface;
- permite validar todas as funcionalidades sem dependência de contas externas.

---

## ✅ Roteiro de Testes Funcionais (Avaliação)

### Com autenticação Google

1. Acessar a aplicação sem login;  
2. Consultar docentes;  
3. Cadastrar um docente com e-mail Google;  
4. Realizar login com a mesma conta Google;  
5. Criar, editar e remover propostas;  
6. Associar coorientadores, alunos e palavras-chave;  
7. Consultar documentos do projeto.

### Sem autenticação (modo de simulação)

1. Acessar a aplicação sem login;  
2. Consultar docentes e documentos;  
3. Na página principal, clicar em **“Desativar autenticação”**;  
4. Validar acesso total às funcionalidades;  
5. Criar, editar e remover propostas;  
6. Associar coorientadores, alunos e palavras-chave.

---

## 🧪 Tecnologias Utilizadas

### Front-end

- Vue.js 3 + Vite  
- Vue Router  
- Pinia  
- Bootstrap 5  
- VeeValidate + Yup  

### Back-end

- Node.js + Express  
- PostgreSQL  
- Prisma ORM  
- Google OAuth2 (Passport.js)  
- OpenAPI / Swagger  

Configurações sensíveis são externalizadas por **variáveis de ambiente**, seguindo boas práticas de segurança.

---

## 📄 Documentos do Projeto

Os documentos de entrega e apoio encontram-se no diretório `docs/` e são disponibilizados pela própria aplicação:

- **Listagem:** `/documentos`  
- **Visualização / download:** `/docs/<arquivo>`

---

## 🏁 Considerações Finais

Este repositório disponibiliza uma **prova de conceito funcional**, alinhada com a especificação definida na Tarefa 5.1 e orientada à replicação e avaliação conforme os objetivos da **Tarefa 5.2**.
