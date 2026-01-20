const { prisma } = require('../../../config/prisma');

async function listPublic() {
  return prisma.docente.findMany({
    select: { id_docente: true, nome: true, email: true, createdAt: true },
    orderBy: { nome: 'asc' }
  });
}

async function findById(id) {
  return prisma.docente.findUnique({
    where: { id_docente: BigInt(id) },
    select: { id_docente: true, nome: true, email: true, createdAt: true }
  });
}

module.exports = { listPublic, findById };
