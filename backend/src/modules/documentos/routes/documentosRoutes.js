const express = require('express')
const controller = require('../controllers/documentosController')

const router = express.Router()

// Público: lista documentos disponíveis em /docs
router.get('/', controller.list)

module.exports = { documentosRoutes: router }
