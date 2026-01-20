function errorHandler(err, req, res, next) {
  // Zod
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      error: 'Payload inválido.',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
    });
  }

  const status = err.statusCode || 500;
  const msg = status >= 500 ? 'Erro interno do servidor.' : err.message;
  return res.status(status).json({ error: msg });
}

module.exports = { errorHandler };
