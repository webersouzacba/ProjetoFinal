const express = require('express');
const controller = require('../controllers/alunoController.js');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Autenticado (DOCENTE) — CRUD completo
router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

module.exports = { alunoRoutes: router };
