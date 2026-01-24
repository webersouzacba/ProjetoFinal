const express = require('express')
const { requireAuth } = require('../../../middlewares/requireAuth')

const router = express.Router()

// Perfil do utilizador autenticado (Opção A)
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    id: Number(req.user.id_docente),
    id_docente: Number(req.user.id_docente),
    nome: req.user.nome,
    email: req.user.email,
    role: req.user.role || 'DOCENTE'
  })
})

module.exports = { apiAuthRoutes: router }
