const express = require('express');
const controller = require('../controllers/docenteController');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Público (visitante)
router.get('/', controller.list);
router.get('/:id', controller.get);

// Autenticado (DOCENTE) — CRUD administrativo (POC)
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

module.exports = { docenteRoutes: router };
