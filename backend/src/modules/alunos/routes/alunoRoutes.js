const express = require('express');
const controller = require('../controllers/alunoController.js');

const router = express.Router();

// Público (visitante)
router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = { alunoRoutes: router };
