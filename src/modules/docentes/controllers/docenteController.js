const service = require('../services/docenteService');

async function list(req, res, next) {
  try {
    const docentes = await service.listPublic();
    const normalize = (d) => ({
      ...d,
      id_docente: d.id_docente?.toString?.() ?? d.id_docente
    });

    return res.json(docentes.map(normalize));
  } catch (err) {
    return next(err);
  }
}

async function get(req, res, next) {
  try {
    const docente = await service.getById(req.params.id);
    const normalize = (d) => ({
      ...d,
      id_docente: d.id_docente?.toString?.() ?? d.id_docente
    });

    return res.json(docentes.map(normalize));
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, get };
