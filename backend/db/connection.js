const { PrismaClient } = require('@prisma/client');

// Singleton do Prisma Client.
// Em serverless (Vercel), o módulo pode ser reaproveitado entre invocações "quentes" —
// guardar a instância no globalThis evita criar um cliente novo a cada request
// (o que esgotaria conexões no Postgres rapidinho).
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
globalForPrisma.prisma = prisma;

module.exports = prisma;
