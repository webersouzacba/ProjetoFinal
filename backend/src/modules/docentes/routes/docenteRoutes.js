const express = require('express')
const controller = require('../controllers/docenteController')
const router = express.Router()

/**
 * Política final (ProjetoFinal):
 * - O sistema inicia com OAuth/JWT ativo e utilizador deslogado;
 * - Mesmo deslogado, o CRUD de Docentes deve estar disponível (bootstrap acadêmico),
 *   permitindo que o professor avaliador cadastre o próprio e-mail como docente antes do login.
 * - Quando a autenticação é desativada, o sistema simula Docente ID=1 e libera tudo.
 *
 * Observação: por se tratar de uma prova de conceito acadêmica, o CRUD de docentes é público.
 */

/**
 * @openapi
 * /api/docentes:
 *   get:
 *     summary: Listar docentes (público)
 *     tags: [Docentes]
 *     responses:
 *       200:
 *         description: Lista de docentes
 */
router.get('/', controller.list)

/**
 * @openapi
 * /api/docentes/{id}:
 *   get:
 *     summary: Obter docente por ID (público)
 *     tags: [Docentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Docente encontrado
 *       404:
 *         description: Docente não encontrado
 */
router.get('/:id', controller.get)

// ✅ CRUD de Docentes disponível mesmo sem login (bootstrap acadêmico)
/**
 * @openapi
 * /api/docentes:
 *   post:
 *     summary: Criar docente (público - bootstrap acadêmico)
 *     tags: [Docentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email]
 *             properties:
 *               nome: { type: string, example: "Docente Exemplo" }
 *               email: { type: string, example: "docente@gmail.com" }
 *     responses:
 *       201:
 *         description: Docente criado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Docente já existe (email)
 */
router.post('/', controller.create)

/**
 * @openapi
 * /api/docentes/{id}:
 *   put:
 *     summary: Atualizar docente por ID (público - prova de conceito)
 *     tags: [Docentes]
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
 *       200:
 *         description: Docente atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Docente não encontrado
 */
router.put('/:id', controller.update)

/**
 * @openapi
 * /api/docentes/{id}:
 *   delete:
 *     summary: Remover docente por ID (público - prova de conceito)
 *     tags: [Docentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Docente removido
 *       404:
 *         description: Docente não encontrado
 */
router.delete('/:id', controller.remove)

module.exports = { docenteRoutes: router }
