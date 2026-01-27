const repo = require('../repositories/propostaRepository');

function ensureOrientadorNotInCoorientadores(idDocente, coorientadoresIds = []) {
  const orientador = String(idDocente);
  const has = (coorientadoresIds || []).map(String).includes(orientador);
  if (has) {
    const err = new Error('Regra inválida: o orientador não pode ser selecionado como coorientador.');
    err.statusCode = 400;
    throw err;
  }
}

async function listPublic({ status, orientadorId } = {}) {
  return repo.listPublic({ status, orientadorId });
}

// ✅ NOVO – detalhe público
async function getPublic(propostaId) {
  return repo.findById(propostaId);
}

async function listMine(idDocente) {
  return repo.listByOrientador(idDocente);
}

async function getMine(idDocente, propostaId) {
  const proposta = await repo.findById(propostaId);
  if (!proposta) {
    const err = new Error('Proposta não encontrada.');
    err.statusCode = 404;
    throw err;
  }

  if (proposta.id_orientador !== BigInt(idDocente)) {
    const err = new Error('Acesso negado: proposta não pertence a este docente.');
    err.statusCode = 403;
    throw err;
  }

  return proposta;
}

// Padronização: "descricao" é o campo oficial.
// Compatibilidade: aceita "descricao_objetivos" como fallback.
function resolveDescricao(dto) {
  const desc = dto?.descricao;
  if (typeof desc === 'string') return desc;

  const legacy = dto?.descricao_objetivos;
  if (typeof legacy === 'string') return legacy;

  return null;
}

async function createMine(idDocente, dto) {
  ensureOrientadorNotInCoorientadores(idDocente, dto.coorientadores_ids);

  return repo.create({
    id_orientador: idDocente,
    titulo: dto.titulo,
    descricao: resolveDescricao(dto),
    status: dto.status,
    coorientadoresIds: dto.coorientadores_ids,
    alunosIds: dto.alunos_ids,
    palavrasChave: dto.palavras_chave,
  });
}

async function updateMine(idDocente, propostaId, dto) {
  await getMine(idDocente, propostaId);
  ensureOrientadorNotInCoorientadores(idDocente, dto.coorientadores_ids);

  return repo.update({
    id_proposta: propostaId,
    titulo: dto.titulo,
    descricao: resolveDescricao(dto),
    status: dto.status,
    coorientadoresIds: dto.coorientadores_ids,
    alunosIds: dto.alunos_ids,
    palavrasChave: dto.palavras_chave,
  });
}


async function deleteMine(idDocente, propostaId) {
  await getMine(idDocente, propostaId);
  return repo.remove(propostaId);
}

async function getIndicadores() {
  return repo.getIndicadores();
}

module.exports = {
  listPublic,
  getPublic, // ✅ exportado
  listMine,
  getMine,
  createMine,
  updateMine,
  deleteMine,
  getIndicadores,
};
