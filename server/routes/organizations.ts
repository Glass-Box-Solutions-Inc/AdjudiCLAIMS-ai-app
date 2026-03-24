/**
 * Organization management routes.
 *
 * All routes require authentication. Organization access is scoped
 * to the authenticated user's organization. Member listing requires
 * CLAIMS_SUPERVISOR or CLAIMS_ADMIN role.
 */

import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { requireAuth, requireRole, UserRole } from '../middleware/rbac.js';

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify plugin signature requires async
export async function organizationRoutes(server: FastifyInstance): Promise<void> {
  /**
   * GET /api/orgs/:id
   *
   * Get organization by ID. The authenticated user must belong to this org.
   */
  server.get<{ Params: { id: string } }>(
    '/orgs/:id',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.session.user;

      if (!user) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Users can only view their own organization
      if (user.organizationId !== id) {
        return reply.code(403).send({ error: 'Access denied to this organization' });
      }

      const org = await prisma.organization.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!org) {
        return reply.code(404).send({ error: 'Organization not found' });
      }

      return org;
    },
  );

  /**
   * GET /api/orgs/:id/members
   *
   * List members of the organization. Requires CLAIMS_SUPERVISOR or CLAIMS_ADMIN role.
   */
  server.get<{ Params: { id: string } }>(
    '/orgs/:id/members',
    {
      preHandler: [
        requireAuth(),
        requireRole(UserRole.CLAIMS_SUPERVISOR, UserRole.CLAIMS_ADMIN),
      ],
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.session.user;

      if (!user) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Users can only view members of their own organization
      if (user.organizationId !== id) {
        return reply.code(403).send({ error: 'Access denied to this organization' });
      }

      const members = await prisma.user.findMany({
        where: { organizationId: id, isActive: true },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { name: 'asc' },
      });

      return { members };
    },
  );
}
