const express = require('express');
const { prisma } = require('../../../config/prisma');

const router = express.Router();

// Retorna lista do DOMÍNIO (tabela mestre palavras_chave)

/**
 * @openapi
 * /api/palavras-chave:
 *   get:
 *     summary: Listar palavras-chave (público)
 *     tags: [Palavras-chave]
 *     responses:
 *       200:
 *         description: Lista de palavras-chave (strings)
 */
router.get('/', async (req, res, next) => {
  try {
    const rows = await prisma.palavraChave.findMany({
      select: { palavra: true },
      orderBy: { palavra: 'asc' }
    });

    res.json(rows.map((r) => r.palavra));
  } catch (e) {
    next(e);
  }
});

module.exports = { palavrasChaveRoutes: router };
