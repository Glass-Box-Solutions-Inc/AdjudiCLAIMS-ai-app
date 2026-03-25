/**
 * Counsel referral service.
 *
 * Generates factual claim summaries for defense counsel referral.
 * Triggered when an examiner hits a RED zone query and requests
 * a summary to send to their assigned attorney.
 *
 * The summary contains 6 sections (Claim Overview, Medical Evidence,
 * Benefits Status, Timeline, Legal Issue Identified, Documents Available)
 * and must pass UPL output validation before delivery.
 */

import type { FastifyRequest } from 'fastify';
import { prisma } from '../db.js';
import { getLLMAdapter } from '../lib/llm/index.js';
import { COUNSEL_REFERRAL_PROMPT } from '../prompts/adjudiclaims-chat.prompts.js';
import { validateOutput, type ValidationResult } from './upl-validator.service.js';
import { logAuditEvent } from '../middleware/audit.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CounselReferralRequest {
  claimId: string;
  userId: string;
  legalIssue: string;
  /** Fastify request for audit logging (IP, user-agent). */
  request: FastifyRequest;
}

export interface CounselReferralResponse {
  summary: string;
  sections: string[];
  validation: ValidationResult;
  wasBlocked: boolean;
}

// ---------------------------------------------------------------------------
// Data gathering
// ---------------------------------------------------------------------------

/**
 * Fetch the claim data needed for the counsel referral summary.
 * Excludes attorney-only and privileged documents from the document list.
 * Never fetches document content -- only metadata (IDs, names, types, dates).
 */
async function gatherClaimData(claimId: string) {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: {
      claimNumber: true,
      claimantName: true,
      dateOfInjury: true,
      bodyParts: true,
      employer: true,
      insurer: true,
      status: true,
      dateReceived: true,
      dateAcknowledged: true,
      dateDetermined: true,
      isLitigated: true,
      hasApplicantAttorney: true,
      totalPaidIndemnity: true,
      totalPaidMedical: true,
      currentReserveIndemnity: true,
      currentReserveMedical: true,
      documents: {
        where: {
          accessLevel: { not: 'ATTORNEY_ONLY' },
          containsPrivileged: false,
        },
        select: {
          id: true,
          fileName: true,
          documentType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      deadlines: {
        select: {
          deadlineType: true,
          dueDate: true,
          status: true,
          statutoryAuthority: true,
        },
        orderBy: { dueDate: 'asc' },
      },
    },
  });

  return claim;
}

/**
 * Format the gathered claim data into a context string for the LLM prompt.
 * All data is factual -- no analysis, interpretation, or PII beyond what
 * the claim record already contains.
 */
function formatClaimContext(
  claim: NonNullable<Awaited<ReturnType<typeof gatherClaimData>>>,
  legalIssue: string,
): string {
  const dateStr = (d: Date | null | undefined): string =>
    d ? (d.toISOString().split('T')[0] ?? 'N/A') : 'N/A';

  const lines: string[] = [
    '## CLAIM DATA',
    `Claim Number: ${claim.claimNumber}`,
    `Claimant: ${claim.claimantName}`,
    `Date of Injury: ${dateStr(claim.dateOfInjury)}`,
    `Employer: ${claim.employer}`,
    `Insurer: ${claim.insurer}`,
    `Body Parts: ${claim.bodyParts.join(', ')}`,
    `Status: ${claim.status}`,
    `Litigated: ${String(claim.isLitigated)}`,
    `Applicant Attorney: ${String(claim.hasApplicantAttorney)}`,
    '',
    '## FINANCIAL',
    `Total Paid Indemnity: $${claim.totalPaidIndemnity.toString()}`,
    `Total Paid Medical: $${claim.totalPaidMedical.toString()}`,
    `Reserve Indemnity: $${claim.currentReserveIndemnity.toString()}`,
    `Reserve Medical: $${claim.currentReserveMedical.toString()}`,
    '',
    '## DEADLINES',
    ...claim.deadlines.map(
      (d) =>
        `- ${d.deadlineType}: ${dateStr(d.dueDate)} (${d.status}) [${d.statutoryAuthority}]`,
    ),
    '',
    '## DOCUMENTS',
    ...claim.documents.map(
      (d) =>
        `- ${d.fileName} (${d.documentType ?? 'unclassified'}, ${dateStr(d.createdAt)})`,
    ),
    '',
    '## LEGAL ISSUE IDENTIFIED',
    legalIssue,
  ];

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/** The 6 required sections in every counsel referral summary. */
const REQUIRED_SECTIONS = [
  'Claim Overview',
  'Medical Evidence',
  'Benefits Status',
  'Claim Timeline',
  'Legal Issue Identified',
  'Documents Available',
] as const;

/**
 * Generate a factual counsel referral summary.
 *
 * The summary is validated against UPL output patterns before delivery.
 * If validation fails, the summary is blocked and the examiner is
 * directed to contact defense counsel directly.
 *
 * Never logs claim content or PII -- only IDs, section counts, and metadata.
 */
export async function generateCounselReferral(
  referralRequest: CounselReferralRequest,
): Promise<CounselReferralResponse> {
  const { claimId, userId, legalIssue, request } = referralRequest;

  const claim = await gatherClaimData(claimId);

  if (!claim) {
    return {
      summary: 'Claim not found.',
      sections: [],
      validation: { result: 'PASS', violations: [] },
      wasBlocked: false,
    };
  }

  const context = formatClaimContext(claim, legalIssue);

  const adapter = getLLMAdapter('FREE');
  const llmResponse = await adapter.generate({
    systemPrompt: COUNSEL_REFERRAL_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate a factual counsel referral summary for this claim.\n\n${context}`,
      },
    ],
    temperature: 0.2,
    maxTokens: 4096,
  });

  let summary = llmResponse.content;

  // Handle stub mode (no API key configured)
  if (llmResponse.finishReason === 'STUB') {
    const dateStr = (d: Date | null | undefined): string =>
      d ? (d.toISOString().split('T')[0] ?? 'N/A') : 'N/A';

    summary = [
      '# Counsel Referral Summary',
      '',
      '## 1. Claim Overview',
      `Claimant: ${claim.claimantName} | Claim #: ${claim.claimNumber}`,
      `Date of Injury: ${dateStr(claim.dateOfInjury)}`,
      `Employer: ${claim.employer} | Insurer: ${claim.insurer}`,
      `Body Parts: ${claim.bodyParts.join(', ')}`,
      `Status: ${claim.status}`,
      '',
      '## 2. Medical Evidence Summary',
      '[LLM not configured -- medical evidence summary requires AI generation]',
      '',
      '## 3. Benefits Status',
      `Total Paid Indemnity: $${claim.totalPaidIndemnity.toString()}`,
      `Total Paid Medical: $${claim.totalPaidMedical.toString()}`,
      `Reserve Indemnity: $${claim.currentReserveIndemnity.toString()}`,
      `Reserve Medical: $${claim.currentReserveMedical.toString()}`,
      '',
      '## 4. Claim Timeline',
      `Date of Injury: ${dateStr(claim.dateOfInjury)}`,
      `Date Received: ${dateStr(claim.dateReceived)}`,
      `Date Acknowledged: ${dateStr(claim.dateAcknowledged)}`,
      `Date Determined: ${dateStr(claim.dateDetermined)}`,
      '',
      '## 5. Legal Issue Identified',
      legalIssue,
      '',
      '## 6. Documents Available',
      ...claim.documents.map((d) => `- ${d.fileName} (${d.documentType ?? 'unclassified'})`),
      '',
      "This factual summary is provided for defense counsel's review and legal analysis.",
    ].join('\n');
  }

  // Validate the output for UPL compliance
  const validation = validateOutput(summary);

  if (validation.result === 'FAIL') {
    void logAuditEvent({
      userId,
      claimId,
      eventType: 'UPL_OUTPUT_BLOCKED',
      eventData: {
        reason: 'Counsel referral output validation failed',
        violationCount: validation.violations.length,
      },
      request,
    });

    return {
      summary:
        'The generated summary was blocked because it contained language that may ' +
        'constitute legal advice. Please contact defense counsel directly.',
      sections: [],
      validation,
      wasBlocked: true,
    };
  }

  // Identify which of the 6 required sections are present
  const sections = REQUIRED_SECTIONS.filter((section) =>
    summary.includes(section),
  );

  void logAuditEvent({
    userId,
    claimId,
    eventType: 'COUNSEL_REFERRAL_GENERATED',
    eventData: {
      sectionsPresent: sections,
      sectionCount: sections.length,
      provider: llmResponse.provider,
      model: llmResponse.model,
    },
    request,
  });

  return {
    summary,
    sections: [...sections],
    validation,
    wasBlocked: false,
  };
}
