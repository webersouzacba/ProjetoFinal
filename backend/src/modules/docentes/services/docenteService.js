const { prisma } = require('../../../config/prisma');
const repo = require('../repositories/docenteRepository');

function validatePayload(dto, { partial = false } = {}) {
  const nome = dto?.nome;
  const email = dto?.email;

  if (!partial || nome !== undefined) {
    if (!nome || String(nome).trim().length < 3) {
      const err = new Error('Campo "nome" é obrigatório e deve ter ao menos 3 caracteres.');
      err.statusCode = 400;
      throw err;
    }
  }

  if (!partial || email !== undefined) {
    if (email !== null && email !== undefined && String(email).trim().length > 0) {
      // validação simples
      const s = String(email).trim();
      if (!s.includes('@') || s.length < 5) {
        const err = new Error('Campo "email" inválido.');
        err.statusCode = 400;
        throw err;
      }
    }
  }

  return {
    nome: nome !== undefined ? String(nome).trim() : undefined,
    email:
      email === '' ? null : email !== undefined ? (email === null ? null : String(email).trim()) : undefined
  };
}

async function listPublic() {
  return repo.listPublic();
}

async function getById(id) {
  return repo.findById(id);
}

// -------------------------
// CRUD autenticado (DOCENTE)
// -------------------------

async function create(dto) {
  const data = validatePayload(dto);
  return repo.create(data);
}

async function update(id, dto) {
  const existing = await repo.findById(id);
  if (!existing) {
    const err = new Error('Docente não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const data = validatePayload(dto, { partial: true });
  return repo.update(id, data);
}

async function remove(id) {
  const existing = await repo.findById(id);
  if (!existing) {
    const err = new Error('Docente não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const idBig = BigInt(id);

  // Contagens para mensagem “amigável”
  const [qOrientador, qCoorientador] = await Promise.all([
    prisma.proposta.count({ where: { id_orientador: idBig } }),
    prisma.propostaCoorientador.count({ where: { id_docente: idBig } })
  ]);

  if (qOrientador > 0 || qCoorientador > 0) {
    const parts = [];
    if (qOrientador > 0) parts.push(`Docente é orientador de ${qOrientador} Propostas.`);
    if (qCoorientador > 0) parts.push(`Docente é coorientador de ${qCoorientador} Propostas.`);

    const err = new Error(parts.join(' ')); // ou '\n' se você preferir
    err.statusCode = 409; // conflito / integridade
    throw err;
  }

  return repo.remove(id);
}


module.exports = {
  listPublic,
  getById,
  create,
  update,
  remove
};
