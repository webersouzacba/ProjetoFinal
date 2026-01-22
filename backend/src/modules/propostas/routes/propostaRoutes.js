const express = require('express');
const controller = require('../controllers/propostaController');
const { requireAuth } = require('../../../middlewares/requireAuth');

const router = express.Router();

/**
 * @openapi
 * /api/propostas:
 *   get:
 *     summary: Listar propostas públicas
 *     description: Retorna a lista de propostas disponíveis publicamente.
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar propostas pelo status
 *     responses:
 *       200:
 *         description: Lista de propostas públicas
 */
router.get('/', controller.listPublic);

/**
 * @openapi
 * /api/propostas/{id}:
 *   get:
 *     summary: Detalhar proposta pública
 *     description: Retorna os detalhes de uma proposta pública pelo ID.
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Proposta encontrada
 *       404:
 *         description: Proposta não encontrada
 */
router.get('/:id', controller.getPublic);

/**
 * @openapi
 * /api/propostas/mine:
 *   get:
 *     summary: Listar propostas do docente autenticado
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 *     responses:
 *       200:
 *         description: Lista de propostas do docente
 */
router.get('/mine', requireAuth, controller.listMine);

/**
 * @openapi
 * /api/propostas/mine/{id}:
 *   get:
 *     summary: Detalhar proposta do docente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proposta encontrada
 *       404:
 *         description: Proposta não encontrada
 */
router.get('/mine/:id', requireAuth, controller.getMine);

/**
 * @openapi
 * /api/propostas/mine:
 *   post:
 *     summary: Criar nova proposta
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao_objetivos
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao_objetivos:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proposta criada com sucesso
 */
router.post('/mine', requireAuth, controller.createMine);

/**
 * @openapi
 * /api/propostas/mine/{id}:
 *   put:
 *     summary: Atualizar proposta existente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proposta atualizada
 *       404:
 *         description: Proposta não encontrada
 */
router.put('/mine/:id', requireAuth, controller.updateMine);

/**
 * @openapi
 * /api/propostas/mine/{id}:
 *   delete:
 *     summary: Remover proposta
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Proposta removida com sucesso
 */
router.delete('/mine/:id', requireAuth, controller.deleteMine);

module.exports = { propostaRoutes: router };
