const express = require('express');
const { prisma } = require('../../../config/prisma');

const router = express.Router();

// Retorna lista "enum" baseada no BD (distinct em proposta_palavras_chave)
router.get('/', async (req, res, next) => {
  try {
    const rows = await prisma.propostaPalavraChave.findMany({
      distinct: ['palavra'],
      select: { palavra: true },
      orderBy: { palavra: 'asc' }
    });

    res.json(rows.map((r) => r.palavra));
  } catch (e) {
    next(e);
  }
});

module.exports = { palavrasChaveRoutes: router };
