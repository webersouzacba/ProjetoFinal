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

async function create(data) {
  return prisma.aluno.create({
    data: {
      nome: data.nome,
      email: data.email ?? null
    },
    select: { id_aluno: true, nome: true, email: true }
  });
}

async function update(id, data) {
  const patch = {};
  if (data.nome !== undefined) patch.nome = data.nome;
  if (data.email !== undefined) patch.email = data.email;

  return prisma.aluno.update({
    where: { id_aluno: asBigInt(id) },
    data: patch,
    select: { id_aluno: true, nome: true, email: true }
  });
}

async function remove(id) {
  return prisma.aluno.delete({
    where: { id_aluno: asBigInt(id) }
  });
}

module.exports = { list, getById, create, update, remove };
