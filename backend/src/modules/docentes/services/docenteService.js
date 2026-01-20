const repo = require('../repositories/docenteRepository');

async function listPublic() {
  return repo.listPublic();
}

async function getById(id) {
  const docente = await repo.findById(id);
  if (!docente) {
    const err = new Error('Docente não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return docente;
}

module.exports = { listPublic, getById };
