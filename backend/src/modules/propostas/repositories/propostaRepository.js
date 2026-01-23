const { prisma } = require('../../../config/prisma');

function asBigInt(x) {
  if (typeof x === 'bigint') return x;
  if (typeof x === 'number') return BigInt(x);
  if (typeof x === 'string') return BigInt(x);
  return null;
}

function includeGraph() {
  return {
    docentes: { select: { id_docente: true, nome: true, email: true } }, // orientador
    proposta_coorientadores: {
      include: { docentes: { select: { id_docente: true, nome: true, email: true } } }
    },
    proposta_alunos: {
      include: { alunos: { select: { id_aluno: true, nome: true, email: true } } }
    },
    proposta_palavras_chave: true
  };
}

async function listPublic({ status, orientadorId } = {}) {
  const where = {};

  // filtro por status (enum do Prisma: rascunho, publicada, atribuida, encerrada)
  if (status) {
    where.status = status;
  }

  // filtro por orientador (BigInt)
  if (orientadorId !== undefined && orientadorId !== null && orientadorId !== '') {
    where.id_orientador = asBigInt(orientadorId);
  }

  return prisma.proposta.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: includeGraph()
  });
}

async function listByOrientador(id_orientador) {
  const bid = asBigInt(id_orientador);
  return prisma.proposta.findMany({
    where: { id_orientador: bid },
    orderBy: { createdAt: 'desc' },
    include: includeGraph()
  });
}

async function findById(id_proposta) {
  const bid = asBigInt(id_proposta);
  return prisma.proposta.findUnique({
    where: { id_proposta: bid },
    include: includeGraph()
  });
}

async function create({
  id_orientador,
  titulo,
  descricao,
  status,
  coorientadoresIds,
  alunosIds,
  palavrasChave
}) {
  const bOrientador = asBigInt(id_orientador);

  return prisma.$transaction(async (tx) => {
    const proposta = await tx.proposta.create({
      data: {
        id_orientador: bOrientador,
        titulo,
        descricao: descricao ?? null,
        status
      }
    });

    const pid = proposta.id_proposta;

    if (coorientadoresIds?.length) {
      await tx.propostaCoorientador.createMany({
        data: coorientadoresIds.map((id_docente) => ({
          id_proposta: pid,
          id_docente: asBigInt(id_docente)
        }))
      });
    }

    if (alunosIds?.length) {
      await tx.propostaAluno.createMany({
        data: alunosIds.map((id_aluno) => ({
          id_proposta: pid,
          id_aluno: asBigInt(id_aluno)
        }))
      });
    }

    if (palavrasChave?.length) {
      await tx.propostaPalavraChave.createMany({
        data: palavrasChave.map((palavra) => ({
          id_proposta: pid,
          palavra
        }))
      });
    }

    return tx.proposta.findUnique({
      where: { id_proposta: pid },
      include: includeGraph()
    });
  });
}

async function update({
  id_proposta,
  titulo,
  descricao,
  status,
  coorientadoresIds,
  alunosIds,
  palavrasChave
}) {
  const pid = asBigInt(id_proposta);

  return prisma.$transaction(async (tx) => {
    await tx.proposta.update({
      where: { id_proposta: pid },
      data: {
        ...(titulo !== undefined ? { titulo } : {}),
        ...(descricao !== undefined ? { descricao } : {}),
        ...(status !== undefined ? { status } : {})
      }
    });

    // substituição total (POC)
    if (coorientadoresIds) {
      await tx.propostaCoorientador.deleteMany({ where: { id_proposta: pid } });
      if (coorientadoresIds.length) {
        await tx.propostaCoorientador.createMany({
          data: coorientadoresIds.map((id_docente) => ({
            id_proposta: pid,
            id_docente: asBigInt(id_docente)
          }))
        });
      }
    }

    if (alunosIds) {
      await tx.propostaAluno.deleteMany({ where: { id_proposta: pid } });
      if (alunosIds.length) {
        await tx.propostaAluno.createMany({
          data: alunosIds.map((id_aluno) => ({
            id_proposta: pid,
            id_aluno: asBigInt(id_aluno)
          }))
        });
      }
    }

    if (palavrasChave) {
      await tx.propostaPalavraChave.deleteMany({ where: { id_proposta: pid } });
      if (palavrasChave.length) {
        await tx.propostaPalavraChave.createMany({
          data: palavrasChave.map((palavra) => ({
            id_proposta: pid,
            palavra
          }))
        });
      }
    }

    return tx.proposta.findUnique({
      where: { id_proposta: pid },
      include: includeGraph()
    });
  });
}

async function remove(id_proposta) {
  const pid = asBigInt(id_proposta);
  return prisma.proposta.delete({ where: { id_proposta: pid } });
}

async function getIndicadores() {
  const [total, publicadas, rascunho, orientadoresGroup] = await Promise.all([
    prisma.proposta.count(),
    prisma.proposta.count({ where: { status: 'publicada' } }),
    prisma.proposta.count({ where: { status: 'rascunho' } }),
    prisma.proposta.groupBy({
      by: ['id_orientador'],
      _count: { id_orientador: true },
    }),
  ])

  const orientadores = Array.isArray(orientadoresGroup) ? orientadoresGroup.length : 0

  return { total, publicadas, rascunho, orientadores }
}

/*async function getIndicadores() {
  return {
    total: 123,
    publicadas: 45,
    rascunho: 67,
    orientadores: 8,
    _debug: 'ok-repository',
  }
}*/


module.exports = { listPublic, listByOrientador, findById, create, update, remove, getIndicadores };
