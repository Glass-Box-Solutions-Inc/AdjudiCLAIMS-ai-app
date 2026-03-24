/**
 * UPL compliance routes.
 *
 * Provides API endpoints for:
 * - Query classification (pre-chat UPL zone determination)
 * - Output validation (post-generation prohibited language detection)
 *
 * All routes require authentication. Every call is audit-logged.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../middleware/rbac.js';
import { logAuditEvent } from '../middleware/audit.js';
import { classifyQuery } from '../services/upl-classifier.service.js';
import { validateOutput, validateOutputFull } from '../services/upl-validator.service.js';
import { getDisclaimer } from '../services/disclaimer.service.js';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const ClassifyBodySchema = z.object({
  query: z.string().min(1, 'Query must not be empty').max(10000, 'Query too long'),
});

const ValidateBodySchema = z.object({
  text: z.string().min(1, 'Text must not be empty').max(50000, 'Text too long'),
  fullValidation: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify plugin signature requires async
export async function uplRoutes(server: FastifyInstance): Promise<void> {
  /**
   * POST /api/upl/classify
   *
   * Classify a user query for UPL compliance.
   * Returns the zone (GREEN/YELLOW/RED), reason, confidence, and disclaimer.
   *
   * Uses the two-stage classification pipeline:
   *   1. Keyword pre-filter (regex, ~0ms)
   *   2. LLM classification (Claude Haiku, ~0.5-1s) if needed
   */
  server.post(
    '/upl/classify',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;

      if (!user) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      const parsed = ClassifyBodySchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid request body',
          details: parsed.error.issues,
        });
      }

      const { query } = parsed.data;

      const classification = await classifyQuery(query);
      const disclaimer = getDisclaimer(classification.zone);

      // Audit log -- log zone and adversarial flag, NEVER the query content (may contain PII)
      void logAuditEvent({
        userId: user.id,
        eventType: 'UPL_ZONE_CLASSIFICATION',
        eventData: {
          zone: classification.zone,
          confidence: classification.confidence,
          isAdversarial: classification.isAdversarial,
          queryLength: query.length,
        },
        uplZone: classification.zone,
        request,
      });

      // Additional audit for blocked queries
      if (classification.zone === 'RED') {
        void logAuditEvent({
          userId: user.id,
          eventType: 'UPL_OUTPUT_BLOCKED',
          eventData: {
            reason: classification.reason,
            isAdversarial: classification.isAdversarial,
          },
          uplZone: 'RED',
          request,
        });
      }

      // Additional audit for disclaimer injection
      if (classification.zone === 'YELLOW') {
        void logAuditEvent({
          userId: user.id,
          eventType: 'UPL_DISCLAIMER_INJECTED',
          eventData: {
            zone: classification.zone,
          },
          uplZone: 'YELLOW',
          request,
        });
      }

      return {
        classification,
        disclaimer: disclaimer.disclaimer,
        isBlocked: disclaimer.isBlocked,
        referralMessage: disclaimer.referralMessage,
      };
    },
  );

  /**
   * POST /api/upl/validate
   *
   * Validate AI-generated output text for UPL violations.
   * Returns PASS/FAIL with any violations found.
   *
   * By default runs regex-only validation (fast, synchronous).
   * Set fullValidation: true to include LLM-based subtle advisory detection.
   */
  server.post(
    '/upl/validate',
    { preHandler: [requireAuth()] },
    async (request, reply) => {
      const user = request.session.user;

      if (!user) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      const parsed = ValidateBodySchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: 'Invalid request body',
          details: parsed.error.issues,
        });
      }

      const { text, fullValidation } = parsed.data;

      const result = fullValidation === true
        ? await validateOutputFull(text)
        : validateOutput(text);

      // Serialize violations for JSON response (Map is not JSON-serializable)
      const violations = result.violations.map((v) => ({
        pattern: v.pattern,
        matchedText: v.matchedText,
        position: v.position,
        severity: v.severity,
        suggestion: v.suggestion,
      }));

      // Convert Map to plain object for JSON serialization
      const suggestedRewrites: Record<string, string> | undefined = result.suggestedRewrites
        ? Object.fromEntries(result.suggestedRewrites)
        : undefined;

      // Audit log validation failures
      if (result.result === 'FAIL') {
        void logAuditEvent({
          userId: user.id,
          eventType: 'UPL_OUTPUT_VALIDATION_FAIL',
          eventData: {
            violationCount: violations.length,
            patterns: violations.map((v) => v.pattern),
            textLength: text.length,
          },
          request,
        });
      }

      return {
        result: result.result,
        violations,
        suggestedRewrites,
      };
    },
  );
}
