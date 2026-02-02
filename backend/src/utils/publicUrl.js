function firstHeader(req, name) {
  const v = req.headers?.[name];
  if (!v) return '';
  return String(v).split(',')[0].trim();
}

function getPublicProto(req) {
  return (
    req.headers['x-forwarded-proto'] ||
    req.protocol ||
    'http'
  ).split(',')[0].trim()
}

function getPublicHost(req) {
  return (
    req.headers['x-forwarded-host'] ||
    req.get('host') ||
    ''
  ).split(',')[0].trim()
}

function normalizeBasePath(p) {
  const raw = (p || '').trim();
  if (!raw) return '';
  if (raw === '/') return '';
  return raw.startsWith('/') ? raw.replace(/\/+$/, '') : `/${raw.replace(/\/+$/, '')}`;
}

/**
 * Retorna a base pública do frontend.
 * - VPS: http(s)://webersouza.com.br + /projetofinal
 * - Local dev: se host terminar com :5190, troca para :9102
 */
function getFrontendBase(req) {
  // fallback explícito (dev)
  if (process.env.FRONTEND_URL?.trim()) {
    return process.env.FRONTEND_URL.replace(/\/+$/, '')
  }


  const proto = getPublicProto(req)
  const host = getPublicHost(req)

  // 👉 EM PRODUÇÃO, o frontend está NO MESMO HOST (via nginx)
  // 👉 EM DEV, host será localhost:9102
  return `${proto}://${host}/projetofinal`
}

module.exports = { getFrontendBase, getPublicProto, getPublicHost };
