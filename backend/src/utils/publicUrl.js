function getPublicProto(req) {
  return (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim()
}

function getPublicHost(req) {
  return (req.headers['x-forwarded-host'] || req.get('host') || '').split(',')[0].trim()
}

// Monta a URL do frontend com base no host público
function getFrontendBase(req) {
  // Fallback explícito
  const env = process.env.FRONTEND_URL
  if (env && env.trim().length) return env.replace(/\/+$/, '')

  const proto = getPublicProto(req)
  const host = getPublicHost(req)

  // Se o host já inclui porta, usamos como base
  // e trocamos para a porta do frontend (9102), se necessário.
  const hostname = host.includes(':') ? host.split(':')[0] : host
  return `${proto}//${hostname}:9102`
}

module.exports = { getFrontendBase }
