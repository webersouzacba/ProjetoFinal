/* eslint-disable no-console */
const { PrismaClient, PropostaStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpeza (ordem por dependências)
  await prisma.propostaPalavraChave.deleteMany();
  await prisma.propostaAluno.deleteMany();
  await prisma.propostaCoorientador.deleteMany();
  await prisma.proposta.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.docente.deleteMany();

  const docente1 = await prisma.docente.create({
    data: {
      nome: 'Prof. Ana Ribeiro',
      email: 'ana.ribeiro@utad.pt',
      googleSub: 'seed-google-sub-ana'
    }
  });

  const docente2 = await prisma.docente.create({
    data: {
      nome: 'Prof. Bruno Lima',
      email: 'bruno.lima@utad.pt',
      googleSub: 'seed-google-sub-bruno'
    }
  });

  const aluno1 = await prisma.aluno.create({
    data: { nome: 'Carla Souza', email: 'carla.souza@alunos.utad.pt' }
  });
  const aluno2 = await prisma.aluno.create({
    data: { nome: 'Diego Martins', email: 'diego.martins@alunos.utad.pt' }
  });
  const aluno3 = await prisma.aluno.create({
    data: { nome: 'Elisa Ferreira', email: 'elisa.ferreira@alunos.utad.pt' }
  });

  const proposta1 = await prisma.proposta.create({
    data: {
      titulo: 'Gestão de Propostas de TCC com OAuth2 e PostgreSQL',
      descricaoObjetivos:
        'Construir uma aplicação web para gerir propostas de temas de TCC, incluindo autenticação OAuth2 (Google) e persistência em PostgreSQL.',
      orientadorId: docente1.id,
      status: PropostaStatus.publicada
    }
  });

  const proposta2 = await prisma.proposta.create({
    data: {
      titulo: 'Catálogo de Propostas com Busca e Palavras-Chave',
      descricaoObjetivos:
        'Desenvolver um catálogo navegável de propostas com filtros por docente, palavras-chave e vínculo de alunos/coorientadores.',
      orientadorId: docente2.id,
      status: PropostaStatus.publicada
    }
  });

  // Coorientadores
  await prisma.propostaCoorientador.create({
    data: { propostaId: proposta1.id, docenteId: docente2.id }
  });
  await prisma.propostaCoorientador.create({
    data: { propostaId: proposta2.id, docenteId: docente1.id }
  });

  // Alunos vinculados
  await prisma.propostaAluno.createMany({
    data: [
      { propostaId: proposta1.id, alunoId: aluno1.id },
      { propostaId: proposta1.id, alunoId: aluno2.id },
      { propostaId: proposta2.id, alunoId: aluno3.id }
    ]
  });

  // Palavras-chave
  await prisma.propostaPalavraChave.createMany({
    data: [
      { propostaId: proposta1.id, palavra: 'oauth2' },
      { propostaId: proposta1.id, palavra: 'postgresql' },
      { propostaId: proposta1.id, palavra: 'express' },
      { propostaId: proposta2.id, palavra: 'vue.js' },
      { propostaId: proposta2.id, palavra: 'prisma' },
      { propostaId: proposta2.id, palavra: 'api-rest' }
    ]
  });

  console.log('Seed concluido:', {
    docentes: 2,
    alunos: 3,
    propostas: 2
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
