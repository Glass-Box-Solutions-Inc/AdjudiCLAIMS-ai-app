import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

export async function healthRoutes(server: FastifyInstance): Promise<void> {
  /**
   * GET /api/health
   * Basic liveness probe -- does not touch the database.
   */
  server.get('/health', async (_request, _reply) => {
    return {
      status: 'ok',
      product: 'AdjudiCLAIMS',
      version: '0.1.0',
    };
  });

  /**
   * GET /api/health/db
   * Readiness probe -- verifies database connectivity.
   */
  server.get('/health/db', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
      };
    } catch (err) {
      server.log.error({ err }, 'Database health check failed');
      return reply.code(503).send({
        status: 'error',
        database: 'disconnected',
      });
    }
  });
}
