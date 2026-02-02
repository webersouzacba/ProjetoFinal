const express = require('express');
const controller = require('../controllers/alunoController.js');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

// Autenticado (DOCENTE) — CRUD completo

/**
 * @openapi
 * /api/alunos:
 *   get:
 *     summary: Listar alunos (requer autenticação)
 *     tags: [Alunos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de alunos }
 *       401: { description: Não autenticado }
 */
router.get('/', requireAuth, controller.list);

/**
 * @openapi
 * /api/alunos/{id}:
 *   get:
 *     summary: Obter aluno por ID (requer autenticação)
 *     tags: [Alunos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Aluno encontrado }
 *       401: { description: Não autenticado }
 *       404: { description: Aluno não encontrado }
 */
router.get('/:id', requireAuth, controller.get);

/**
 * @openapi
 * /api/alunos:
 *   post:
 *     summary: Criar aluno (requer autenticação)
 *     tags: [Alunos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email]
 *             properties:
 *               nome: { type: string, example: "Aluno Exemplo" }
 *               email: { type: string, example: "aluno@exemplo.com" }
 *     responses:
 *       201: { description: Aluno criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autenticado }
 *       409: { description: Aluno já existe (email) }
 */
router.post('/', requireAuth, controller.create);

/**
 * @openapi
 * /api/alunos/{id}:
 *   put:
 *     summary: Atualizar aluno por ID (requer autenticação)
 *     tags: [Alunos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               email: { type: string }
 *     responses:
 *       200: { description: Aluno atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autenticado }
 *       404: { description: Aluno não encontrado }
 */
router.put('/:id', requireAuth, controller.update);

/**
 * @openapi
 * /api/alunos/{id}:
 *   delete:
 *     summary: Remover aluno por ID (requer autenticação)
 *     tags: [Alunos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Aluno removido }
 *       401: { description: Não autenticado }
 *       404: { description: Aluno não encontrado }
 */
router.delete('/:id', requireAuth, controller.remove);

module.exports = { alunoRoutes: router };
