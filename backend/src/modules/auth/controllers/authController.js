// backend/src/modules/auth/controllers/authController.js
const { signToken } = require('../services/jwt');
const { getFrontendBase } = require('../../../utils/publicUrl');

function normalizePrefix(prefix) {
  if (!prefix) return '';
  let p = String(prefix).trim();
  if (!p || p === '/') return '';
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/+$/, ''); // remove trailing slash
  return p;
}

function buildFrontendRedirect(req, targetPathname) {
  // Base do frontend (preferencialmente derivada do host público)
  const base = getFrontendBase(req);

  // Prefixo quando o frontend está servido em subpath (/projetofinal)
  // 1) Header (ideal quando usa proxy)
  // 2) Env como fallback
  const prefix =
    normalizePrefix(req.headers['x-forwarded-prefix']) ||
    normalizePrefix(process.env.FRONTEND_BASE_PATH);

  const url = new URL(base);

  // monta pathname final: {prefix}{targetPathname}
  const path = targetPathname.startsWith('/')
    ? targetPathname
    : `/${targetPathname}`;

  url.pathname = `${prefix}${path}`;
  return url;
}

function authCallback(req, res) {
  const docente = req.user;
  const wantsJson = (req.headers.accept || '').includes('application/json');

  // Info do Passport (ex.: { message: 'UNAUTHORIZED' } ou 'Conta Google sem e-mail disponível.')
  const infoMsg = req.authInfo?.message ? String(req.authInfo.message) : '';

  if (!docente) {
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

    const redirectUrl = buildFrontendRedirect(req, '/login');
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

  const redirectUrl = buildFrontendRedirect(req, '/auth/callback');
  redirectUrl.searchParams.set('token', token);
  return res.redirect(redirectUrl.toString());
}

module.exports = { authCallback };
