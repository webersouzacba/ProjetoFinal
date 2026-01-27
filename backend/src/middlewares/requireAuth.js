// backend/src/middlewares/requireAuth.js
const { verifyToken } = require('../modules/auth/services/jwt')
const { getAuthEnabled } = require('../config/runtimeFlags')

function requireAuth(req, res, next) {
  // ✅ MODO DEV: sem autenticação (flag runtime)
  if (!getAuthEnabled()) {
    req.user = {
      id_docente: String(process.env.DEV_DOCENTE_ID ?? '1'),
      email: process.env.DEV_DOCENTE_EMAIL ?? 'dev.docente@local',
      nome: process.env.DEV_DOCENTE_NOME ?? 'Docente DEV',
      role: 'DOCENTE'
    }
    return next()
  }

  // ✅ MODO AUTH: exige JWT
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token ausente ou inválido.' })
  }

  try {
    const payload = verifyToken(token)
    req.user = {
      id_docente: payload.sub,
      email: payload.email,
      nome: payload.nome,
      role: payload.role || 'DOCENTE'
    }

    if (req.user.role !== 'DOCENTE') {
      return res.status(403).json({ error: 'Acesso restrito a docentes.' })
    }

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token expirado ou inválido.' })
  }
}

module.exports = { requireAuth }
