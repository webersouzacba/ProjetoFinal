function errorHandler(err, req, res, next) {
  // Log sempre (principalmente OAuth/Prisma)
  console.error('[ERROR]', {
    path: req.path,
    method: req.method,
    message: err?.message,
    name: err?.name,
    stack: err?.stack
  });

  // Zod
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      error: 'Payload inválido.',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
    });
  }

  const status = err.statusCode || 500;

  // Em DEV, devolve mensagem real para acelerar diagnóstico
  const isDev = process.env.NODE_ENV !== 'production';
  const msg = status >= 500
    ? (isDev ? (err?.message || 'Erro interno do servidor.') : 'Erro interno do servidor.')
    : err.message;

  return res.status(status).json({ error: msg });
}

module.exports = { errorHandler };
