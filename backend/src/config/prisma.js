const { PrismaClient } = require('@prisma/client');

// Singleton simples para evitar múltiplas instâncias em dev/hot-reload.
const prisma = new PrismaClient();

module.exports = { prisma };
