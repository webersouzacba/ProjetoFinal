-- CreateEnum
CREATE TYPE "proposta_status" AS ENUM ('rascunho', 'publicada', 'atribuida', 'encerrada');

-- CreateTable
CREATE TABLE "docentes" (
    "id_docente" BIGSERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "google_sub" VARCHAR(80),

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id_docente")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id_aluno" BIGSERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id_aluno")
);

-- CreateTable
CREATE TABLE "propostas" (
    "id_proposta" BIGSERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "id_orientador" BIGINT NOT NULL,
    "status" "proposta_status" NOT NULL DEFAULT 'rascunho',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propostas_pkey" PRIMARY KEY ("id_proposta")
);

-- CreateTable
CREATE TABLE "palavras_chave" (
    "palavra" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "palavras_chave_pkey" PRIMARY KEY ("palavra")
);

-- CreateTable
CREATE TABLE "proposta_coorientadores" (
    "id_proposta" BIGINT NOT NULL,
    "id_docente" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposta_coorientadores_pkey" PRIMARY KEY ("id_proposta","id_docente")
);

-- CreateTable
CREATE TABLE "proposta_alunos" (
    "id_proposta" BIGINT NOT NULL,
    "id_aluno" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposta_alunos_pkey" PRIMARY KEY ("id_proposta","id_aluno")
);

-- CreateTable
CREATE TABLE "proposta_palavras_chave" (
    "id_proposta" BIGINT NOT NULL,
    "palavra_chave" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposta_palavras_chave_pkey" PRIMARY KEY ("id_proposta","palavra_chave")
);

-- CreateIndex
CREATE UNIQUE INDEX "docentes_email_key" ON "docentes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_docentes_google_sub" ON "docentes"("google_sub");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");

-- CreateIndex
CREATE INDEX "idx_propostas_orientador" ON "propostas"("id_orientador");

-- CreateIndex
CREATE INDEX "idx_propostas_status" ON "propostas"("status");

-- CreateIndex
CREATE INDEX "idx_pc_docente" ON "proposta_coorientadores"("id_docente");

-- CreateIndex
CREATE INDEX "idx_pa_aluno" ON "proposta_alunos"("id_aluno");

-- CreateIndex
CREATE INDEX "idx_ppc_palavra" ON "proposta_palavras_chave"("palavra_chave");

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "fk_propostas_orientador" FOREIGN KEY ("id_orientador") REFERENCES "docentes"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_coorientadores" ADD CONSTRAINT "fk_pc_docente" FOREIGN KEY ("id_docente") REFERENCES "docentes"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_coorientadores" ADD CONSTRAINT "fk_pc_proposta" FOREIGN KEY ("id_proposta") REFERENCES "propostas"("id_proposta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_alunos" ADD CONSTRAINT "fk_pa_aluno" FOREIGN KEY ("id_aluno") REFERENCES "alunos"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_alunos" ADD CONSTRAINT "fk_pa_proposta" FOREIGN KEY ("id_proposta") REFERENCES "propostas"("id_proposta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_palavras_chave" ADD CONSTRAINT "fk_ppc_proposta" FOREIGN KEY ("id_proposta") REFERENCES "propostas"("id_proposta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta_palavras_chave" ADD CONSTRAINT "fk_ppc_palavra" FOREIGN KEY ("palavra_chave") REFERENCES "palavras_chave"("palavra") ON DELETE RESTRICT ON UPDATE CASCADE;
