import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/rbac.js';

// TODO: Implement in Phase 1

export async function claimsRoutes(server: FastifyInstance): Promise<void> {
  /**
   * GET /api/claims
   * List claims visible to the authenticated user.
   */
  server.get(
    '/claims',
    { preHandler: [requireAuth()] },
    async (_request, _reply) => {
      // TODO: Implement in Phase 1 -- query claims scoped to user's organization
      return [];
    },
  );

  /**
   * GET /api/claims/:id
   * Retrieve a single claim by ID.
   */
  server.get<{ Params: { id: string } }>(
    '/claims/:id',
    { preHandler: [requireAuth()] },
    async (_request, reply) => {
      // TODO: Implement in Phase 1 -- fetch claim with authorization check
      return reply.code(404).send({ error: 'Not found' });
    },
  );

  /**
   * POST /api/claims
   * Create a new claim.
   */
  server.post(
    '/claims',
    { preHandler: [requireAuth()] },
    async (_request, reply) => {
      // TODO: Implement in Phase 1 -- validate input, create claim record
      return reply.code(501).send({ error: 'Not implemented' });
    },
  );
}
