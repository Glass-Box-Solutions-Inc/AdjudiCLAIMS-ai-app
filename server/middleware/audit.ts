// @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
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

// ---------------------------------------------------------------------------
// PHI deny-list — field names that must never appear in audit log eventData.
//
// These are key names (not values) that identify PHI fields. The sanitizer
// strips these keys from eventData before any DB write. Callers should log
// IDs (claimId, documentId, userId) rather than PHI values, but this acts
// as a defense-in-depth layer enforced at the middleware level.
//
// Regulatory basis: HIPAA §164.530(j), SOC 2 CC6.1 (data minimization).
// ---------------------------------------------------------------------------
const PHI_FIELDS = new Set([
  // Name fields
  'claimantname', 'firstname', 'lastname', 'fullname', 'name',
  // SSN / Tax ID
  'ssn', 'socialsecuritynumber', 'taxid', 'ein',
  // Date of birth
  'dateofbirth', 'dob', 'birthdate', 'birthyear',
  // Contact info
  'email', 'phone', 'phonenumber', 'mobilephone', 'cellphone', 'homephone',
  // Address
  'address', 'streetaddress', 'homeaddress', 'mailingaddress', 'city', 'state', 'zip', 'zipcode',
  // Medical content
  'medicalcontent', 'diagnosis', 'icdcode', 'icd', 'cptcode',
  'wpiscore', 'wpi', 'apportionment',
  'treatmentnotes', 'prognosis', 'medicalhistory', 'clinicalnotes',
  'prescription', 'medication', 'drugname',
]);

/**
 * Recursively sanitize an event data object, removing any keys that match
 * the PHI deny-list. Works on nested objects and arrays.
 *
 * This function is defense-in-depth: callers should never pass PHI keys in
 * eventData, but this ensures no PHI leaks through the audit pipeline even
 * if a caller inadvertently includes a sensitive field.
 *
 * Keys are compared case-insensitively after stripping non-alphanumeric chars.
 *
 * @param data - The raw eventData object to sanitize
 * @returns A new object with all PHI keys removed, or undefined if data is null/undefined
 */
export function sanitizeEventData(
  data: Record<string, unknown> | null | undefined,
): Record<string, unknown> | undefined {
  if (data == null) return undefined;

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Normalize key: lowercase, strip non-alphanumeric chars for comparison
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (PHI_FIELDS.has(normalizedKey)) {
      // Strip PHI key — do not include in sanitized output
      continue;
    }

    // Recurse into nested objects (but not arrays — array values are left as-is
    // since arrays typically contain IDs or primitive values, not PHI-keyed objects)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeEventData(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Compute the retention expiry date — 7 years from the current timestamp.
 *
 * Regulatory basis: HIPAA §164.530(j) requires audit documentation to be
 * retained for 6 years from creation or last effective date. We use 7 years
 * for safety margin, consistent with Cal. Lab. Code § 3762 and the existing
 * data-retention policy for claim records.
 */
function computeRetentionExpiry(): Date {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 7);
  return expiry;
}

/**
 * Write an immutable audit log entry.
 *
 * This function is append-only by design — the AuditEvent table has
 * DB-level triggers that block all UPDATE and DELETE operations
 * (see migration: 20260420_audit_append_only).
 *
 * PHI exclusion: eventData is passed through sanitizeEventData() before
 * the DB write, stripping any keys that match the PHI deny-list.
 *
 * Retention: retentionExpiresAt is set to 7 years from now per HIPAA §164.530(j).
 *
 * Failures are logged but never rethrown — audit failures must never
 * crash or degrade the request that triggered them.
 *
 * @param params - Audit event parameters including userId, eventType, and optional eventData
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  const { userId, claimId, eventType, eventData, uplZone, request } = params;

  const ipAddress =
    (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
    request.ip;
  const userAgent = request.headers['user-agent'] ?? 'unknown';

  // Strip PHI fields from eventData before persistence
  const sanitizedEventData = sanitizeEventData(eventData ?? null);

  // Compute 7-year retention expiry at creation time
  const retentionExpiresAt = computeRetentionExpiry();

  try {
    await prisma.auditEvent.create({
      data: {
        userId,
        claimId: claimId ?? null,
        eventType,
        eventData: sanitizedEventData
          ? (JSON.parse(JSON.stringify(sanitizedEventData)) as Prisma.InputJsonValue)
          : undefined,
        uplZone: uplZone ?? null,
        ipAddress,
        userAgent,
        retentionExpiresAt,
      },
    });
  } catch (err) {
    // Audit failures must never crash the request -- log and continue.
    request.log.error({ err, eventType, userId }, 'Failed to write audit event');
  }
}
