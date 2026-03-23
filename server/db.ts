import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton.
 *
 * In development, the module-level client would be re-created on every
 * hot-reload, leaking database connections. We store the instance on
 * `globalThis` so it survives HMR cycles.
 */

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.__prisma = prisma;
}
