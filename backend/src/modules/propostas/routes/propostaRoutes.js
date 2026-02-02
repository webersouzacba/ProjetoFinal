const express = require('express')
const controller = require('../controllers/propostaController')
const { requireAuth } = require('../../../middlewares/requireAuth')

const router = express.Router()

/**
 * Endpoint dedicado de indicadores (PÚBLICO)
 * IMPORTANTE: precisa vir antes de '/:id'
 */

/**
 * @openapi
 * /api/propostas/indicadores:
 *   get:
 *     summary: Obter indicadores agregados de propostas (público)
 *     tags: [Propostas]
 *     responses:
 *       200:
 *         description: Indicadores (totais por status, totais gerais, etc.)
 */
router.get('/indicadores', controller.getIndicadores)

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
router.get('/', controller.listPublic)

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
router.get('/mine', requireAuth, controller.listMine)

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
router.get('/mine/:id', requireAuth, controller.getMine)

/**
 * @openapi
 * /api/propostas/mine:
 *   post:
 *     summary: Criar nova proposta
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Propostas
 */
router.post('/mine', requireAuth, controller.createMine)

/**
 * @openapi
 * /api/propostas/mine/{id}:
 *   put:
 *     summary: Atualizar proposta do docente autenticado (ownership)
 *     tags: [Propostas]
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
 *     responses:
 *       200: { description: Proposta atualizada }
 *       401: { description: Não autenticado }
 *       403: { description: Proibido (não é o docente orientador) }
 *       404: { description: Proposta não encontrada }
 */
router.put('/mine/:id', requireAuth, controller.updateMine)

/**
 * @openapi
 * /api/propostas/mine/{id}:
 *   delete:
 *     summary: Remover proposta do docente autenticado (ownership)
 *     tags: [Propostas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Proposta removida }
 *       401: { description: Não autenticado }
 *       403: { description: Proibido (não é o docente orientador) }
 *       404: { description: Proposta não encontrada }
 */
router.delete('/mine/:id', requireAuth, controller.deleteMine)

/**
 * @openapi
 * /api/propostas/{id}:
 *   get:
 *     summary: Detalhar proposta pública
 *     description: Retorna os detalhes de uma proposta pública pelo ID.
 *     tags:
 *       - Propostas
 */
router.get('/:id', controller.getPublic)

module.exports = { propostaRoutes: router }
