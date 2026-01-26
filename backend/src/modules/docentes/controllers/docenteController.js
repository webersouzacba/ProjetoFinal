const service = require('../services/docenteService');

// helper: converte BigInt para string (evita 500 no res.json)
function toJsonSafe(value) {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
}

async function list(req, res, next) {
  try {
    const docentes = await service.listPublic();
    return res.json(toJsonSafe(docentes));
  } catch (err) {
    return next(err);
  }
}

async function get(req, res, next) {
  try {
    const docente = await service.getById(req.params.id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente não encontrado.' });
    }

    return res.json(toJsonSafe(docente));
  } catch (err) {
    return next(err);
  }
}

// -------------------------
// CRUD autenticado (DOCENTE)
// -------------------------

async function create(req, res, next) {
  try {
    const created = await service.create(req.body);
    return res.status(201).json(toJsonSafe(created));
  } catch (e) {
    return next(e);
  }
}

async function update(req, res, next) {
  try {
    const updated = await service.update(req.params.id, req.body);
    return res.json(toJsonSafe(updated));
  } catch (e) {
    return next(e);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return res.status(204).send();
  } catch (e) {
    return next(e);
  }
}
module.exports = { list, get, create, update, remove };
