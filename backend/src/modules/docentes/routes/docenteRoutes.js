const express = require('express');
const controller = require('../controllers/docenteController');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Público (visitante)
router.get('/', controller.list);
router.get('/:id', controller.get);

// Autenticado (DOCENTE) — CRUD administrativo (POC)
router.post('/',  controller.create);
router.put('/:id',  controller.update);
router.delete('/:id',  controller.remove);

module.exports = { docenteRoutes: router };
