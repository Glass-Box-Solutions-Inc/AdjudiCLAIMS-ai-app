/**
 * Education routes.
 *
 * Provides endpoints for managing a claims examiner's education state —
 * Tier 1 term dismissals, Tier 2 regulatory content lookup, and education
 * mode (NEW vs STANDARD). These routes are exempt from the training gate
 * because education is a prerequisite to training, not the reverse.
 *
 * Routes:
 *   GET  /api/education/profile                  — Get user's education state
 *   GET  /api/education/terms                    — Get all Tier 1 terms with dismissal state
 *   POST /api/education/terms/:termId/dismiss    — Dismiss a Tier 1 term
 *   POST /api/education/terms/reenable           — Re-enable dismissed terms (all or by category)
 *   GET  /api/education/content/:featureId       — Get Tier 2 entries for a feature
 *   GET  /api/education/mode                     — Get current mode (NEW/STANDARD)
 *
 * Layer 3 — Ongoing Education:
 *   GET  /api/education/changes                   — Active regulatory changes
 *   POST /api/education/changes/:changeId/acknowledge — Acknowledge a change
 *   GET  /api/education/monthly-review            — Current month's review data
 *   POST /api/education/monthly-review/complete   — Mark monthly review complete
 *   GET  /api/education/refreshers/current        — Current quarter's refresher
 *   POST /api/education/refreshers/:quarter/submit — Submit refresher assessment
 *   GET  /api/education/audit-training            — Required audit-triggered training
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../middleware/rbac.js';
import { logAuditEvent } from '../middleware/audit.js';
import * as educationService from '../services/education-profile.service.js';
import * as ongoingEducation from '../services/ongoing-education.service.js';
import type { Tier1Category, FeatureContext } from '../data/tier1-terms.js';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const TIER1_CATEGORIES: [Tier1Category, ...Tier1Category[]] = [
  'BENEFITS',
  'MEDICAL',
  'LEGAL_PROCESS',
  'REGULATORY_BODIES',
  'CLAIM_LIFECYCLE',
  'DOCUMENTS_FORMS',
];

const FEATURE_CONTEXTS: [FeatureContext, ...FeatureContext[]] = [
  'CLAIM_INTAKE',
  'BENEFIT_CALCULATION',
  'DEADLINE_TRACKING',
  'MEDICAL_REVIEW',
  'INVESTIGATION',
  'DOCUMENT_REVIEW',
  'CHAT',
  'COVERAGE_DETERMINATION',
  'SETTLEMENT',
  'UTILIZATION_REVIEW',
];

const ReEnableBodySchema = z.object({
  category: z.enum(TIER1_CATEGORIES).optional(),
});

const TermIdParamsSchema = z.object({
  termId: z.string().min(1),
});

const FeatureIdParamsSchema = z.object({
  featureId: z.enum(FEATURE_CONTEXTS),
});

const ChangeIdParamsSchema = z.object({
  changeId: z.string().min(1),
});

const MonthlyReviewCompleteBodySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Expected YYYY-MM format'),
});

const QuarterParamsSchema = z.object({
  quarter: z.string().regex(/^\d{4}-Q[1-4]$/, 'Expected YYYY-Q# format'),
});

const RefresherSubmitBodySchema = z.object({
  answers: z.record(z.string(), z.string()),
});

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify plugin signature requires async
export async function educationRoutes(server: FastifyInstance): Promise<void> {
  /**
   * GET /api/education/profile
   *
   * Get the authenticated user's full education profile — dismissed terms,
   * training completion status, and learning mode expiry.
   * Education routes are exempt from the training gate.
   */
  server.get(
    '/education/profile',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const profile = await educationService.getOrCreateProfile(user.id);
      return profile;
    },
  );

  /**
   * GET /api/education/terms
   *
   * Return all Tier 1 terms annotated with whether this user has dismissed them.
   * Order matches the canonical TIER1_TERMS source order.
   */
  server.get(
    '/education/terms',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const terms = await educationService.getTermsWithDismissalState(user.id);
      return terms;
    },
  );

  /**
   * POST /api/education/terms/:termId/dismiss
   *
   * Permanently dismiss a Tier 1 term for the authenticated user.
   * The term will no longer appear in the UI until re-enabled.
   * Logs a TIER1_TERM_DISMISSED audit event.
   */
  server.post<{ Params: { termId: string } }>(
    '/education/terms/:termId/dismiss',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const parsed = TermIdParamsSchema.safeParse(request.params);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid term ID',
          details: parsed.error.issues,
        });
      }

      const { termId } = parsed.data;

      try {
        const profile = await educationService.dismissTerm(user.id, termId);

        void logAuditEvent({
          userId: user.id,
          eventType: 'TIER1_TERM_DISMISSED',
          eventData: { termId },
          request,
        });

        return profile;
      } catch {
        return reply.code(404).send({ error: 'Term not found' });
      }
    },
  );

  /**
   * POST /api/education/terms/reenable
   *
   * Re-enable dismissed Tier 1 terms. If `category` is provided in the body,
   * only terms in that category are re-enabled. If omitted, ALL dismissed
   * terms are cleared.
   */
  server.post(
    '/education/terms/reenable',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const parsed = ReEnableBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid request body',
          details: parsed.error.issues,
        });
      }

      const { category } = parsed.data;
      const profile = await educationService.reEnableTerms(user.id, category);
      return profile;
    },
  );

  /**
   * GET /api/education/content/:featureId
   *
   * Return Tier 2 (always-present) regulatory education entries for a given
   * feature context. Tier 2 content is never personalized and never hidden.
   * Returns 400 if the featureId is not a known FeatureContext value.
   */
  server.get<{ Params: { featureId: string } }>(
    '/education/content/:featureId',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const parsed = FeatureIdParamsSchema.safeParse(request.params);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid feature ID',
          details: parsed.error.issues,
        });
      }

      const { featureId } = parsed.data;
      const entries = educationService.getEducationContentForFeature(featureId);
      return entries;
    },
  );

  /**
   * GET /api/education/mode
   *
   * Return the current education mode for the authenticated user.
   *
   * 'NEW'      — learningModeExpiry is set and is in the future (new examiner)
   * 'STANDARD' — no expiry set, or expiry has passed
   */
  server.get(
    '/education/mode',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const mode = await educationService.getEducationMode(user.id);
      return { mode };
    },
  );

  // =========================================================================
  // Layer 3 — Ongoing Education Routes
  // =========================================================================

  /**
   * GET /api/education/changes
   *
   * Return all active regulatory changes. Includes both acknowledged and
   * pending changes. Each change includes urgency, affected statutes, and
   * effective date.
   */
  server.get(
    '/education/changes',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const allChanges = ongoingEducation.getActiveRegulatoryChanges();
      const pending = await ongoingEducation.getPendingChanges(user.id);
      const pendingIds = new Set(pending.map((c) => c.id));

      return {
        changes: allChanges.map((c) => ({
          ...c,
          isAcknowledged: !pendingIds.has(c.id),
        })),
      };
    },
  );

  /**
   * POST /api/education/changes/:changeId/acknowledge
   *
   * Acknowledge a regulatory change. Logs a REGULATORY_CHANGE_ACKNOWLEDGED
   * audit event.
   */
  server.post<{ Params: { changeId: string } }>(
    '/education/changes/:changeId/acknowledge',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const parsed = ChangeIdParamsSchema.safeParse(request.params);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid change ID',
          details: parsed.error.issues,
        });
      }

      const { changeId } = parsed.data;

      try {
        await ongoingEducation.acknowledgeChange(user.id, changeId);

        void logAuditEvent({
          userId: user.id,
          eventType: 'REGULATORY_CHANGE_ACKNOWLEDGED',
          eventData: { changeId },
          request,
        });

        return { success: true, changeId };
      } catch {
        return reply.code(404).send({ error: 'Regulatory change not found' });
      }
    },
  );

  /**
   * GET /api/education/monthly-review
   *
   * Generate and return the current month's compliance review.
   * Includes missed deadlines, approaching deadlines, and stale claims.
   */
  server.get(
    '/education/monthly-review',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const isDue = await ongoingEducation.isMonthlyReviewDue(user.id);
      const review = await ongoingEducation.generateMonthlyReview(
        user.id,
        user.organizationId,
      );

      return { isDue, review };
    },
  );

  /**
   * POST /api/education/monthly-review/complete
   *
   * Mark the monthly review as completed for the specified month.
   * Logs a MONTHLY_REVIEW_COMPLETED audit event.
   */
  server.post(
    '/education/monthly-review/complete',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const parsed = MonthlyReviewCompleteBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid request body',
          details: parsed.error.issues,
        });
      }

      const { month } = parsed.data;

      await ongoingEducation.completeMonthlyReview(user.id, month);

      void logAuditEvent({
        userId: user.id,
        eventType: 'MONTHLY_REVIEW_COMPLETED',
        eventData: { month },
        request,
      });

      return { success: true, month };
    },
  );

  /**
   * GET /api/education/refreshers/current
   *
   * Return the current quarter's refresher assessment.
   * Questions have correctOptionId stripped for security.
   * Returns null if no refresher exists for the current quarter.
   */
  server.get(
    '/education/refreshers/current',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const refresher = ongoingEducation.getCurrentRefresher();
      const status = await ongoingEducation.getRefresherStatus(user.id);

      return { refresher, status };
    },
  );

  /**
   * POST /api/education/refreshers/:quarter/submit
   *
   * Submit answers for a quarterly refresher assessment.
   * Grades the answers and persists results.
   * Logs a QUARTERLY_REFRESHER_COMPLETED audit event.
   */
  server.post<{ Params: { quarter: string } }>(
    '/education/refreshers/:quarter/submit',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const paramsParsed = QuarterParamsSchema.safeParse(request.params);
      if (!paramsParsed.success) {
        return reply.code(400).send({
          error: 'Invalid quarter format',
          details: paramsParsed.error.issues,
        });
      }

      const bodyParsed = RefresherSubmitBodySchema.safeParse(request.body);
      if (!bodyParsed.success) {
        return reply.code(400).send({
          error: 'Invalid request body',
          details: bodyParsed.error.issues,
        });
      }

      const { quarter } = paramsParsed.data;
      const { answers } = bodyParsed.data;

      try {
        const result = await ongoingEducation.submitRefresherAssessment(
          user.id,
          quarter,
          answers,
        );

        void logAuditEvent({
          userId: user.id,
          eventType: 'QUARTERLY_REFRESHER_COMPLETED',
          eventData: { quarter, score: result.score, passed: result.passed },
          request,
        });

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Assessment submission failed';
        return reply.code(400).send({ error: message });
      }
    },
  );

  /**
   * GET /api/education/audit-training
   *
   * Return any audit-triggered training requirements for the user.
   * MVP returns an empty array — ready for audit system integration.
   */
  server.get(
    '/education/audit-training',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;
      if (!user) return reply.code(401).send({ error: 'Authentication required' });

      const requirements = await ongoingEducation.getRequiredAuditTraining(user.id);
      return { requirements };
    },
  );
}
