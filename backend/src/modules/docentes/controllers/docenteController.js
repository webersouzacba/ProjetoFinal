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

    if (!docente) {
      return res.status(404).json({ error: 'Docente não encontrado.' });
    }

    const normalize = (d) => ({
      ...d,
      id_docente: d.id_docente?.toString?.() ?? d.id_docente
    });

    return res.json(normalize(docente));
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, get };
