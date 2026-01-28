const { signToken } = require('../services/jwt');

function authCallback(req, res) {
  const docente = req.user;
  const wantsJson = (req.headers.accept || '').includes('application/json');

  // Info do Passport (ex.: { message: 'UNAUTHORIZED' } ou 'Conta Google sem e-mail disponível.')
  const infoMsg = req.authInfo?.message ? String(req.authInfo.message) : '';

  if (!docente) {
    // Mensagem padrão “não autorizado”
    let error =
      'Conta Google não autorizada: utilize um e-mail de docente cadastrado.';
    let code = 'DOCENTE_NAO_CADASTRADO';

    // Se o passport trouxe mensagem mais específica, usamos
    // - 'UNAUTHORIZED' significa “email não está na tabela docentes”
    // - outras mensagens podem ser exibidas (ex.: sem email)
    if (infoMsg && infoMsg !== 'UNAUTHORIZED') {
      error = infoMsg;
      code = 'OAUTH_FALHA';
    }

    const payload = { error, code };

    if (wantsJson) {
      return res.status(403).json(payload);
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = new URL(frontend);
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('error', payload.error);
    redirectUrl.searchParams.set('code', payload.code);
    return res.redirect(redirectUrl.toString());
  }

  // ✅ Docente autorizado: gera token e segue
  const token = signToken(docente);

  if (wantsJson) {
    return res.status(200).json({
      token,
      docente: {
        id: docente.id_docente,
        nome: docente.nome,
        email: docente.email,
        role: 'DOCENTE',
      },
    });
  }

  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = new URL(frontend);
  redirectUrl.pathname = '/auth/callback';
  redirectUrl.searchParams.set('token', token);
  return res.redirect(redirectUrl.toString());
}

module.exports = { authCallback };
