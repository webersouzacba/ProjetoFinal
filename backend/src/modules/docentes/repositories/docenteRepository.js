const { prisma } = require('../../../config/prisma');

function asBigInt(x) {
  if (typeof x === 'bigint') return x;
  if (typeof x === 'number') return BigInt(x);
  if (typeof x === 'string') return BigInt(x);
  return null;
}

async function listPublic() {
  return prisma.docente.findMany({
    select: { id_docente: true, nome: true, email: true, createdAt: true },
    orderBy: { nome: 'asc' }
  });
}

async function findById(id) {
  return prisma.docente.findUnique({
    where: { id_docente: asBigInt(id) },
    select: { id_docente: true, nome: true, email: true, createdAt: true }
  });
}

async function create(data) {
  return prisma.docente.create({
    data: {
      nome: data.nome,
      email: data.email ?? null
    },
    select: { id_docente: true, nome: true, email: true, createdAt: true }
  });
}

async function update(id, data) {
  // remove undefined para não sobrescrever acidentalmente
  const patch = {};
  if (data.nome !== undefined) patch.nome = data.nome;
  if (data.email !== undefined) patch.email = data.email;

  return prisma.docente.update({
    where: { id_docente: asBigInt(id) },
    data: patch,
    select: { id_docente: true, nome: true, email: true, createdAt: true }
  });
}

async function remove(id) {
  return prisma.docente.delete({
    where: { id_docente: asBigInt(id) }
  });
}

module.exports = {
  listPublic,
  findById,
  create,
  update,
  remove
};
