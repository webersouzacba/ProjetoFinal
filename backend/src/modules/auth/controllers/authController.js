const { signToken } = require('../services/jwt');

function authCallback(req, res) {
  // req.user vem do Passport (Docente)
  const docente = req.user;
  const token = signToken(docente);

  const wantsJson = (req.headers.accept || '').includes('application/json');
  if (wantsJson) {
    return res.status(200).json({
      token,
      docente: { id: docente.id_docente, nome: docente.nome, email: docente.email, role: 'DOCENTE' }
    });
  }

  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = new URL(frontend);
  redirectUrl.pathname = '/auth/callback';
  redirectUrl.searchParams.set('token', token);
  return res.redirect(redirectUrl.toString());
}

module.exports = { authCallback };
