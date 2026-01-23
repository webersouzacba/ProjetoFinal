const service = require('../services/propostaService');
const {
  propostaCreateSchema,
  propostaUpdateSchema
} = require('../services/propostaSchemas');

// helper: converte BigInt para string (evita 500 no res.json)
function toJsonSafe(value) {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
}

function getAuthDocenteId(req) {
  // requireAuth deve setar req.user; ainda assim, defesa extra:
  const id = req.user?.id_docente;

  if (id === undefined || id === null) {
    const err = new Error('Não autenticado.');
    err.statusCode = 401;
    throw err;
  }

  return id;
}

// PÚBLICO (POC)
async function listPublic(req, res, next) {
  try {
    const filtros = {
      status: req.query.status,
      orientadorId: req.query.orientador_id
    };

    const propostas = await service.listPublic(filtros);
    return res.json(toJsonSafe(propostas));
  } catch (err) {
    return next(err);
  }
}

// PÚBLICO (POC) – detalhe
async function getPublic(req, res, next) {
  try {
    const proposta = await service.getPublic(req.params.id);

    if (!proposta) {
      return res.status(404).json({ error: 'Proposta não encontrada.' });
    }

    return res.json(toJsonSafe(proposta));
  } catch (err) {
    return next(err);
  }
}

// AUTENTICADO (quando OAuth estiver ativo)
async function listMine(req, res, next) {
  try {
    const idDocente = getAuthDocenteId(req);
    const propostas = await service.listMine(idDocente);
    return res.json(toJsonSafe(propostas));
  } catch (err) {
    return next(err);
  }
}

async function getMine(req, res, next) {
  try {
    const idDocente = getAuthDocenteId(req);
    const proposta = await service.getMine(idDocente, req.params.id);

    if (!proposta) {
      // caso o service/repo retorne null em vez de lançar
      return res.status(404).json({ error: 'Proposta não encontrada.' });
    }

    return res.json(toJsonSafe(proposta));
  } catch (err) {
    return next(err);
  }
}

async function createMine(req, res, next) {
  try {
    const idDocente = getAuthDocenteId(req);
    const dto = propostaCreateSchema.parse(req.body);

    const proposta = await service.createMine(idDocente, dto);
    return res.status(201).json(toJsonSafe(proposta));
  } catch (err) {
    return next(err);
  }
}

async function updateMine(req, res, next) {
  try {
    const idDocente = getAuthDocenteId(req);
    const dto = propostaUpdateSchema.parse(req.body);

    const proposta = await service.updateMine(idDocente, req.params.id, dto);
    return res.json(toJsonSafe(proposta));
  } catch (err) {
    return next(err);
  }
}

async function deleteMine(req, res, next) {
  try {
    const idDocente = getAuthDocenteId(req);

    await service.deleteMine(idDocente, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function getIndicadores(req, res, next) {
  try {
    const stats = await service.getIndicadores();
    return res.json(toJsonSafe(stats));
    return 'ok';
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPublic,
  getPublic,
  listMine,
  getMine,
  createMine,
  updateMine,
  deleteMine,
  getIndicadores
};

