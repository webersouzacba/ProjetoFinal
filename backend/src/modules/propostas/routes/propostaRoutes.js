const express = require('express');
const controller = require('../controllers/propostaController');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Público (POC): lista
router.get('/', controller.listPublic);

// Docente autenticado (quando OAuth estiver ativo)
router.get('/mine', requireAuth, controller.listMine);
router.get('/mine/:id', requireAuth, controller.getMine);
router.post('/mine', requireAuth, controller.createMine);
router.put('/mine/:id', requireAuth, controller.updateMine);
router.delete('/mine/:id', requireAuth, controller.deleteMine);

// ✅ POR ÚLTIMO: detalhe público (não captura "mine")
router.get('/:id', controller.getPublic);

module.exports = { propostaRoutes: router };
