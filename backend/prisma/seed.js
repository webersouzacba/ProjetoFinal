/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ✅ Zera tudo e reinicia autoincrementos
  // CASCADE remove registros das tabelas dependentes (junções)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      proposta_palavras_chave,
      proposta_alunos,
      proposta_coorientadores,
      propostas,
      palavras_chave,
      alunos,
      docentes
    RESTART IDENTITY CASCADE;
  `)

  // Docentes (agora garantidamente começam em 1)
  const docente1 = await prisma.docente.create({
    data: {
      nome: 'Prof. Ana Ribeiro',
      email: 'ana.ribeiro@utad.pt',
      googleSub: 'seed-google-sub-ana'
    }
  })

  const docente2 = await prisma.docente.create({
    data: {
      nome: 'Prof. Bruno Lima',
      email: 'bruno.lima@utad.pt',
      googleSub: 'seed-google-sub-bruno'
    }
  })

  // Alunos
  const aluno1 = await prisma.aluno.create({
    data: { nome: 'Carla Souza', email: 'carla.souza@alunos.utad.pt' }
  })
  const aluno2 = await prisma.aluno.create({
    data: { nome: 'Diego Martins', email: 'diego.martins@alunos.utad.pt' }
  })
  const aluno3 = await prisma.aluno.create({
    data: { nome: 'Elisa Ferreira', email: 'elisa.ferreira@alunos.utad.pt' }
  })

  // Palavras-chave (domínio)
  const dominio = ['oauth2', 'postgresql', 'express', 'vue.js', 'prisma', 'api-rest']
  await prisma.palavraChave.createMany({
    data: dominio.map((palavra) => ({ palavra })),
    skipDuplicates: true
  })

  // Propostas
  const proposta1 = await prisma.proposta.create({
    data: {
      titulo: 'Gestão de Propostas de TCC com OAuth2 e PostgreSQL',
      descricao:
        'Construir uma aplicação web para gerir propostas de temas de TCC, incluindo autenticação OAuth2 (Google) e persistência em PostgreSQL.',
      id_orientador: docente1.id_docente, // será 1
      status: 'publicada'
    }
  })

  const proposta2 = await prisma.proposta.create({
    data: {
      titulo: 'Catálogo de Propostas com Busca e Palavras-Chave',
      descricao:
        'Desenvolver um catálogo navegável de propostas com filtros por docente, palavras-chave e vínculo de alunos/coorientadores.',
      id_orientador: docente2.id_docente, // será 2
      status: 'publicada'
    }
  })

  // Coorientadores
  await prisma.propostaCoorientador.createMany({
    data: [
      { id_proposta: proposta1.id_proposta, id_docente: docente2.id_docente },
      { id_proposta: proposta2.id_proposta, id_docente: docente1.id_docente }
    ]
  })

  // Alunos vinculados
  await prisma.propostaAluno.createMany({
    data: [
      { id_proposta: proposta1.id_proposta, id_aluno: aluno1.id_aluno },
      { id_proposta: proposta1.id_proposta, id_aluno: aluno2.id_aluno },
      { id_proposta: proposta2.id_proposta, id_aluno: aluno3.id_aluno }
    ]
  })

  // Relação proposta x palavras-chave (FK para domínio)
  await prisma.propostaPalavraChave.createMany({
    data: [
      { id_proposta: proposta1.id_proposta, palavra: 'oauth2' },
      { id_proposta: proposta1.id_proposta, palavra: 'postgresql' },
      { id_proposta: proposta1.id_proposta, palavra: 'express' },
      { id_proposta: proposta2.id_proposta, palavra: 'vue.js' },
      { id_proposta: proposta2.id_proposta, palavra: 'prisma' },
      { id_proposta: proposta2.id_proposta, palavra: 'api-rest' }
    ]
  })

  console.log('Seed concluído:', {
    docentes: [docente1.id_docente.toString(), docente2.id_docente.toString()],
    alunos: 3,
    propostas: 2
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
