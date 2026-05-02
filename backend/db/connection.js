const { PrismaClient } = require('@prisma/client');

// Singleton do Prisma Client — uma única instância reutilizada em todas as rotas.
const prisma = new PrismaClient();

module.exports = prisma;
