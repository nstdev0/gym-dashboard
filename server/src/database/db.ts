import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error'],
});

export { prisma }