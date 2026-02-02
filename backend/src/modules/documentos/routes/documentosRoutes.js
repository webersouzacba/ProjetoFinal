const express = require('express')
const controller = require('../controllers/documentosController')

const router = express.Router()

// Público: lista documentos disponíveis em /docs

/**
 * @openapi
 * /api/documentos:
 *   get:
 *     summary: Listar documentos publicados (público)
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos disponíveis em /docs
 */
router.get('/', controller.list)

module.exports = { documentosRoutes: router }
