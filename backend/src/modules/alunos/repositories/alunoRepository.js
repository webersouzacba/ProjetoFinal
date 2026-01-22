const { prisma } = require('../../../config/prisma');

function asBigInt(x) {
  if (typeof x === 'bigint') return x;
  if (typeof x === 'number') return BigInt(x);
  if (typeof x === 'string') return BigInt(x);
  return null;
}

async function list() {
  return prisma.aluno.findMany({
    orderBy: { nome: 'asc' },
    select: { id_aluno: true, nome: true, email: true }
  });
}

async function getById(id) {
  return prisma.aluno.findUnique({
    where: { id_aluno: asBigInt(id) },
    select: { id_aluno: true, nome: true, email: true }
  });
}

module.exports = { list, getById };
