// backend/src/middlewares/requireAuth.js
const { verifyToken } = require('../modules/auth/services/jwt')
const { getAuthEnabled } = require('../config/runtimeFlags')
const { prisma } = require('../config/prisma')

async function requireAuth(req, res, next) {
  // ✅ Autenticação DESATIVADA (simulação acadêmica): assume Docente ID=1 logado
  // Regra final do projeto: não há variáveis DEV/PROD nem usuário DEV via .env.
  if (!getAuthEnabled()) {
    try {
      const docente = await prisma.docente.findUnique({
        where: { id_docente: 1 },
        select: { id_docente: true, nome: true, email: true }
      })

      if (!docente) {
        return res.status(503).json({
          error: 'Docente ID=1 não existe. Execute o seed para garantir o bootstrap acadêmico.'
        })
      }

      req.user = {
        id_docente: String(docente.id_docente),
        email: docente.email || 'docente.simulado@local',
        nome: docente.nome || 'Docente (Simulação)',
        role: 'DOCENTE',
        simulated: true
      }

      return next()
    } catch {
      return res.status(503).json({
        error: 'Falha ao obter o Docente ID=1 para simulação acadêmica.'
      })
    }
  }

  // ✅ OAuth/JWT ativo: exige Bearer JWT
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
