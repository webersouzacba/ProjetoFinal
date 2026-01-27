// backend/src/modules/appConfig/routes/appConfigRoutes.js
const express = require('express')
const ctrl = require('../controllers/appConfigController')

const router = express.Router()

// Retorna o estado atual das flags runtime
router.get('/', ctrl.getConfig)

// Alterna authEnabled em runtime
router.post('/auth/toggle', ctrl.toggleAuth)

module.exports = { appConfigRoutes: router }
