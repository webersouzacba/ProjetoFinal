const service = require('../services/alunoService');

// helper: converte BigInt para string (evita 500 no res.json)
function toJsonSafe(value) {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
}

async function list(req, res, next) {
  try {
    const alunos = await service.list();
    res.json(toJsonSafe(alunos));
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    const aluno = await service.get(req.params.id);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json(toJsonSafe(aluno));
  } catch (e) {
    next(e);
  }
}

// -------------------------
// CRUD autenticado (DOCENTE)
// -------------------------

async function create(req, res, next) {
  try {
    const created = await service.create(req.body);
    res.status(201).json(toJsonSafe(created));
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json(toJsonSafe(updated));
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, create, update, remove };
