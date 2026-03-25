/**
 * Compliance reporting endpoints — DOI audit-ready report generation.
 *
 * Provides role-scoped report generation:
 * - GET /reports/claim/:claimId/file-summary   — CCR 10101 claim file summary (any auth)
 * - GET /reports/claim/:claimId/activity-log    — CCR 10103 activity log (any auth)
 * - GET /reports/deadline-adherence             — Org-wide deadline stats (SUPERVISOR+)
 * - GET /reports/audit-readiness                — DOI audit readiness score (ADMIN only)
 *
 * All outputs are GREEN zone — factual data aggregation only.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth, requireRole, UserRole } from '../middleware/rbac.js';
import { verifyClaimAccess } from '../middleware/claim-access.js';
import { logAuditEvent } from '../middleware/audit.js';
import {
  generateClaimFileSummary,
  generateClaimActivityLog,
  generateDeadlineAdherenceReport,
  generateAuditReadinessReport,
} from '../services/compliance-report.service.js';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const DateRangeQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseOptionalDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : undefined;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify plugin signature requires async
export async function reportRoutes(server: FastifyInstance): Promise<void> {
  /**
   * GET /api/reports/claim/:claimId/file-summary
   *
   * CCR 10101 — Comprehensive claim file summary for DOI audit purposes.
   * Requires authentication and claim access verification.
   */
  server.get(
    '/reports/claim/:claimId/file-summary',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const { claimId } = request.params as { claimId: string };

      const { authorized } = await verifyClaimAccess(claimId, user.id, user.role, user.organizationId);
      if (!authorized) return reply.code(404).send({ error: 'Claim not found' });

      const report = await generateClaimFileSummary(claimId);

      await logAuditEvent({
        userId: user.id,
        claimId,
        eventType: 'COMPLIANCE_REPORT_GENERATED',
        eventData: { reportType: 'CLAIM_FILE_SUMMARY' },
        request,
      });

      return report;
    },
  );

  /**
   * GET /api/reports/claim/:claimId/activity-log
   *
   * CCR 10103 — Chronological claim activity log grouped by date.
   * Supports optional date range filtering via query params.
   * Requires authentication and claim access verification.
   */
  server.get(
    '/reports/claim/:claimId/activity-log',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const { claimId } = request.params as { claimId: string };

      const { authorized } = await verifyClaimAccess(claimId, user.id, user.role, user.organizationId);
      if (!authorized) return reply.code(404).send({ error: 'Claim not found' });

      const queryParsed = DateRangeQuerySchema.safeParse(request.query);
      if (!queryParsed.success) {
        return reply.code(400).send({
          error: 'Invalid query parameters',
          details: queryParsed.error.issues,
        });
      }

      const { startDate, endDate } = queryParsed.data;
      const report = await generateClaimActivityLog(claimId, {
        startDate: parseOptionalDate(startDate),
        endDate: parseOptionalDate(endDate),
      });

      await logAuditEvent({
        userId: user.id,
        claimId,
        eventType: 'COMPLIANCE_REPORT_GENERATED',
        eventData: { reportType: 'CLAIM_ACTIVITY_LOG', startDate, endDate },
        request,
      });

      return report;
    },
  );

  /**
   * GET /api/reports/deadline-adherence
   *
   * Org-wide deadline adherence report with per-type breakdown and
   * worst-performing claims. Restricted to SUPERVISOR and ADMIN.
   */
  server.get(
    '/reports/deadline-adherence',
    { preHandler: [requireAuth(), requireRole(UserRole.CLAIMS_SUPERVISOR, UserRole.CLAIMS_ADMIN)] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const queryParsed = DateRangeQuerySchema.safeParse(request.query);
      if (!queryParsed.success) {
        return reply.code(400).send({
          error: 'Invalid query parameters',
          details: queryParsed.error.issues,
        });
      }

      const { startDate, endDate } = queryParsed.data;
      const report = await generateDeadlineAdherenceReport(user.organizationId, {
        startDate: parseOptionalDate(startDate),
        endDate: parseOptionalDate(endDate),
      });

      await logAuditEvent({
        userId: user.id,
        eventType: 'COMPLIANCE_REPORT_GENERATED',
        eventData: { reportType: 'DEADLINE_ADHERENCE', startDate, endDate },
        request,
      });

      return report;
    },
  );

  /**
   * GET /api/reports/audit-readiness
   *
   * DOI audit readiness assessment with composite score (0-100) and
   * per-category breakdown. Restricted to ADMIN only.
   */
  server.get(
    '/reports/audit-readiness',
    { preHandler: [requireAuth(), requireRole(UserRole.CLAIMS_ADMIN)] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const report = await generateAuditReadinessReport(user.organizationId);

      await logAuditEvent({
        userId: user.id,
        eventType: 'COMPLIANCE_REPORT_GENERATED',
        eventData: { reportType: 'AUDIT_READINESS' },
        request,
      });

      return report;
    },
  );
}
