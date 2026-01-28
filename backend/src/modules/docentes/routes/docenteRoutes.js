const express = require('express')
const controller = require('../controllers/docenteController')
const router = express.Router()

/**
 * Política final (ProjetoFinal):
 * - O sistema inicia com OAuth/JWT ativo e utilizador deslogado;
 * - Mesmo deslogado, o CRUD de Docentes deve estar disponível (bootstrap acadêmico),
 *   permitindo que o professor avaliador cadastre o próprio e-mail como docente antes do login.
 * - Quando a autenticação é desativada, o sistema simula Docente ID=1 e libera tudo.
 *
 * Observação: por se tratar de uma prova de conceito acadêmica, o CRUD de docentes é público.
 */

// Público (visitante)
router.get('/', controller.list)
router.get('/:id', controller.get)

// ✅ CRUD de Docentes disponível mesmo sem login (bootstrap acadêmico)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = { docenteRoutes: router }
