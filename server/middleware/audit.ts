import type { FastifyRequest } from 'fastify';
import type { AuditEventType, UplZone, Prisma } from '@prisma/client';
import { prisma } from '../db.js';

export type { AuditEventType };

export interface AuditEventParams {
  userId: string;
  claimId?: string;
  eventType: AuditEventType;
  eventData?: Record<string, unknown>;
  uplZone?: UplZone;
  request: FastifyRequest;
}

/**
 * Write an immutable audit log entry.
 *
 * This function is append-only by design -- the AuditEvent table should
 * have no UPDATE or DELETE operations anywhere in the codebase.
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  const { userId, claimId, eventType, eventData, uplZone, request } = params;

  const ipAddress =
    (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
    request.ip;
  const userAgent = request.headers['user-agent'] ?? 'unknown';

  try {
    await prisma.auditEvent.create({
      data: {
        userId,
        claimId: claimId ?? null,
        eventType,
        eventData: eventData ? (JSON.parse(JSON.stringify(eventData)) as Prisma.InputJsonValue) : undefined,
        uplZone: uplZone ?? null,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    // Audit failures must never crash the request -- log and continue.
    request.log.error({ err, eventType, userId }, 'Failed to write audit event');
  }
}
