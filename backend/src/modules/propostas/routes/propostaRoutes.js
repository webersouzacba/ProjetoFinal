const express = require('express');
const controller = require('../controllers/propostaController');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Público (POC): lista propostas com orientador/alunos/coorientadores/palavras-chave
router.get('/', controller.listPublic);

// Docente autenticado (quando OAuth estiver ativo)
router.get('/mine', requireAuth, controller.listMine);
router.get('/mine/:id', requireAuth, controller.getMine);
router.post('/mine', requireAuth, controller.createMine);
router.put('/mine/:id', requireAuth, controller.updateMine);
router.delete('/mine/:id', requireAuth, controller.deleteMine);

module.exports = { propostaRoutes: router };

