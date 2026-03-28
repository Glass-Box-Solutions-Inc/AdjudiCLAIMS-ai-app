/**
 * AI-assisted draft generation service — LLM-powered document drafting
 * with iterative refinement.
 *
 * Upgrades the template-based document generation system with AI that
 * produces richer, more contextual drafts and supports conversational
 * refinement. All output is UPL-validated (GREEN zone only — factual
 * content, statutory citations, no legal analysis).
 *
 * Pipeline:
 *   1. Fetch claim data + graph context
 *   2. Get template structure from document-generation service
 *   3. LLM generates draft following template outline + claim data
 *   4. UPL output validation (prohibited language scan)
 *   5. Persist to GeneratedLetter table
 *
 * Refinement loop:
 *   1. Load existing draft
 *   2. LLM applies user instruction to current content
 *   3. UPL output validation
 *   4. Update persisted record + append to revision history
 *
 * UPL Note: All generated content is GREEN zone — factual data,
 * arithmetic, regulatory citations only. No legal analysis, opinions,
 * strategy, or recommendations. Output is validated post-generation
 * via the UPL validator service.
 */

import { prisma } from '../db.js';
import { getLLMAdapter } from '../lib/llm/index.js';
import { validateOutput } from './upl-validator.service.js';
import { getTemplate } from './document-generation.service.js';
import { queryGraphForExaminer, formatGraphContext } from './graph/examiner-graph-access.service.js';
import { getClaimGraphSummary } from './graph/graph-traversal.service.js';
import { parseJsonStringArray } from '../lib/json-array.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DraftRequest {
  claimId: string;
  userId: string;
  templateId: string;
  /** Optional user instructions to guide generation. */
  instructions?: string;
  /** Optional field overrides (same as template system). */
  overrides?: Record<string, string>;
}

export interface DraftResult {
  draftId: string;
  templateId: string;
  title: string;
  content: string;
  /** Fields that were populated from claim data. */
  populatedFields: string[];
  /** Fields that had no data available. */
  missingFields: string[];
  /** Whether AI generation was used (vs template-only). */
  aiGenerated: boolean;
  /** UPL zone of the generated content. */
  uplZone: 'GREEN' | 'YELLOW';
}

export interface RefinementRequest {
  draftId: string;
  instruction: string;
  userId: string;
}

export interface RefinementResult {
  draftId: string;
  content: string;
  changesSummary: string;
  iterationCount: number;
}

export interface DraftHistoryEntry {
  iteration: number;
  content: string;
  instruction: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const DRAFT_GENERATION_SYSTEM_PROMPT = `You are generating a factual Workers' Compensation document for a claims examiner.

RULES:
- GREEN ZONE ONLY: factual data, arithmetic, regulatory citations
- NO legal analysis, opinions, strategy, or recommendations
- Cite specific Labor Code sections and CCR regulations where applicable
- Use the provided template structure as your outline
- Fill in all data from the claim context provided
- Mark any missing data as [PENDING: field description]
- Be thorough but factual — this is a regulatory compliance document

Do NOT include phrases like "I recommend", "you should consider", "in my opinion", "the claim has merit", or any language that could constitute legal advice.`;

const DRAFT_REFINEMENT_SYSTEM_PROMPT = `You are refining a factual Workers' Compensation document for a claims examiner.

RULES:
- GREEN ZONE ONLY: factual data, arithmetic, regulatory citations
- NO legal analysis, opinions, strategy, or recommendations
- Apply the user's refinement instruction to the existing draft
- Preserve the overall document structure
- Cite specific Labor Code sections and CCR regulations where applicable
- Mark any missing data as [PENDING: field description]
- Return the COMPLETE updated document (not just the changes)

After the document, add a brief "CHANGES:" line summarizing what was modified.

Do NOT include phrases like "I recommend", "you should consider", "in my opinion", "the claim has merit", or any language that could constitute legal advice.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format a Date to YYYY-MM-DD string. Returns empty string for null/undefined.
 */
function formatDate(d: Date | null | undefined): string {
  if (!d) return '';
  return d.toISOString().split('T')[0] ?? '';
}

/**
 * Fetch claim data needed for draft generation context.
 */
async function fetchClaimContext(claimId: string) {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: {
      id: true,
      claimNumber: true,
      claimantName: true,
      dateOfInjury: true,
      bodyParts: true,
      employer: true,
      insurer: true,
      status: true,
      dateReceived: true,
      assignedExaminer: {
        select: { name: true },
      },
    },
  });

  if (!claim) {
    throw new Error(`Claim not found: "${claimId}"`);
  }

  // Fetch extracted fields for additional context
  const extractedFields = await prisma.extractedField.findMany({
    where: {
      document: { claimId },
    },
    select: {
      fieldName: true,
      fieldValue: true,
    },
  });

  return { claim, extractedFields };
}

/**
 * Build the claim data map for template population and LLM context.
 */
function buildClaimDataMap(
  claim: NonNullable<Awaited<ReturnType<typeof fetchClaimContext>>['claim']>,
  extractedFields: Array<{ fieldName: string; fieldValue: string }>,
  overrides?: Record<string, string>,
): { data: Record<string, string>; populatedFields: string[]; missingFields: string[] } {
  const data: Record<string, string> = {
    claimNumber: claim.claimNumber,
    claimantName: claim.claimantName,
    dateOfInjury: formatDate(claim.dateOfInjury),
    employer: claim.employer,
    insurer: claim.insurer,
    dateReceived: formatDate(claim.dateReceived),
    bodyParts: parseJsonStringArray(claim.bodyParts).join(', '),
    examinerName: claim.assignedExaminer?.name ?? '',
    claimStatus: claim.status,
    currentDate: formatDate(new Date()),
  };

  // Add extracted fields
  for (const field of extractedFields) {
    if (!data[field.fieldName]) {
      data[field.fieldName] = field.fieldValue;
    }
  }

  // Apply overrides last (highest priority)
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      data[key] = value;
    }
  }

  const populatedFields: string[] = [];
  const missingFields: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value && value !== '') {
      populatedFields.push(key);
    } else {
      missingFields.push(key);
    }
  }

  return { data, populatedFields, missingFields };
}

/**
 * Format claim data as a structured text block for LLM context.
 */
function formatClaimContext(data: Record<string, string>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value && value !== '') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: [NOT AVAILABLE]`);
    }
  }
  return lines.join('\n');
}

/**
 * Fetch graph context for the claim (non-fatal on failure).
 */
async function fetchGraphContext(claimId: string): Promise<string> {
  try {
    const maturity = await getClaimGraphSummary(claimId);
    if (maturity.maturityLabel !== 'NASCENT') {
      const graphResult = await queryGraphForExaminer(
        claimId,
        'GREEN',
        { maxNodes: 20, maxEdges: 30 },
      );
      return formatGraphContext(graphResult);
    }
  } catch {
    // Graph context failure is non-fatal — draft continues without it
  }
  return '';
}

/**
 * Parse the refinement response to separate content from changes summary.
 */
function parseRefinementResponse(response: string): { content: string; changesSummary: string } {
  const changesIndex = response.lastIndexOf('CHANGES:');
  if (changesIndex !== -1) {
    const content = response.substring(0, changesIndex).trim();
    const changesSummary = response.substring(changesIndex + 'CHANGES:'.length).trim();
    return { content, changesSummary };
  }
  return { content: response.trim(), changesSummary: 'Draft updated per instructions.' };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate an AI-assisted draft from a template and claim data.
 *
 * Fetches claim data, graph context, and the template structure, then uses
 * the LLM to produce a richer, more contextual draft. Falls back to the
 * template structure if the LLM call fails. All output is UPL-validated.
 *
 * @throws Error if templateId is unknown.
 * @throws Error if claimId is not found.
 * @throws Error if UPL validation fails (prohibited content detected).
 */
export async function generateDraft(request: DraftRequest): Promise<DraftResult> {
  const { claimId, userId, templateId, instructions, overrides } = request;

  // Validate template
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Unknown template: "${templateId}"`);
  }

  // Fetch claim data
  const { claim, extractedFields } = await fetchClaimContext(claimId);
  const { data, populatedFields, missingFields } = buildClaimDataMap(
    claim,
    extractedFields,
    overrides,
  );

  // Fetch graph context (non-fatal)
  const graphContext = await fetchGraphContext(claimId);

  // Build LLM prompt
  const claimContext = formatClaimContext(data);
  const userContent = [
    `TEMPLATE STRUCTURE:\n${template.template}`,
    `\nCLAIM DATA:\n${claimContext}`,
    graphContext ? `\nGRAPH CONTEXT:\n${graphContext}` : '',
    instructions ? `\nADDITIONAL INSTRUCTIONS:\n${instructions}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  // Generate via LLM
  const adapter = getLLMAdapter('FREE');
  const llmResponse = await adapter.generate({
    systemPrompt: DRAFT_GENERATION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
    temperature: 0.3,
    maxTokens: 4096,
  });

  let content = llmResponse.content;
  let aiGenerated = true;

  // Handle stub mode (no API key configured)
  if (llmResponse.finishReason === 'STUB') {
    content = template.template;
    aiGenerated = false;
  }

  // UPL validation — block if prohibited content detected
  const validation = validateOutput(content);
  if (validation.result === 'FAIL') {
    throw new Error(
      'Draft generation blocked: AI output contained prohibited language that may ' +
      'constitute legal advice. Please adjust instructions and retry.',
    );
  }

  // Persist to GeneratedLetter table
  const record = await prisma.generatedLetter.create({
    data: {
      claimId,
      userId,
      letterType: 'TD_BENEFIT_EXPLANATION', // Default type; template maps to letter types
      content,
      templateId,
      populatedData: {
        ...data,
        aiGenerated: String(aiGenerated),
        iterationCount: '0',
        revisionHistory: JSON.stringify([]),
      },
    },
  });

  return {
    draftId: record.id,
    templateId,
    title: template.title,
    content,
    populatedFields,
    missingFields,
    aiGenerated,
    uplZone: 'GREEN',
  };
}

/**
 * Refine an existing draft with a natural-language instruction.
 *
 * Loads the current draft, sends it to the LLM with the refinement
 * instruction, validates the output, and updates the persisted record.
 * Revision history is maintained in the letter metadata.
 *
 * @throws Error if draftId is not found.
 * @throws Error if UPL validation fails on the refined content.
 */
export async function refineDraft(request: RefinementRequest): Promise<RefinementResult> {
  const { draftId, instruction, userId } = request;

  // Fetch existing draft
  const existing = await prisma.generatedLetter.findUnique({
    where: { id: draftId },
  });

  if (!existing) {
    throw new Error(`Draft not found: "${draftId}"`);
  }

  // Parse existing metadata
  const metadata = existing.populatedData as Record<string, unknown>;
  const currentIteration = Number(metadata.iterationCount ?? 0);
  const revisionHistory: Array<{
    iteration: number;
    content: string;
    instruction: string;
    timestamp: string;
  }> = JSON.parse(String(metadata.revisionHistory ?? '[]'));

  // Save current content to revision history before modification
  revisionHistory.push({
    iteration: currentIteration,
    content: existing.content,
    instruction: currentIteration === 0 ? 'Initial generation' : instruction,
    timestamp: new Date().toISOString(),
  });

  // Build refinement prompt
  const adapter = getLLMAdapter('FREE');
  const llmResponse = await adapter.generate({
    systemPrompt: DRAFT_REFINEMENT_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `CURRENT DRAFT:\n${existing.content}\n\nREFINEMENT INSTRUCTION:\n${instruction}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 4096,
  });

  let refinedContent: string;
  let changesSummary: string;

  if (llmResponse.finishReason === 'STUB') {
    // Stub mode — append instruction as a comment
    refinedContent = `${existing.content}\n\n<!-- Refinement requested: ${instruction} -->`;
    changesSummary = 'Stub mode — refinement instruction recorded but not applied.';
  } else {
    const parsed = parseRefinementResponse(llmResponse.content);
    refinedContent = parsed.content;
    changesSummary = parsed.changesSummary;
  }

  // UPL validation
  const validation = validateOutput(refinedContent);
  if (validation.result === 'FAIL') {
    throw new Error(
      'Draft refinement blocked: AI output contained prohibited language that may ' +
      'constitute legal advice. Please adjust your instruction and retry.',
    );
  }

  const newIteration = currentIteration + 1;

  // Update the persisted record
  await prisma.generatedLetter.update({
    where: { id: draftId },
    data: {
      content: refinedContent,
      populatedData: {
        ...(metadata as Record<string, string>),
        iterationCount: String(newIteration),
        revisionHistory: JSON.stringify(revisionHistory),
        lastRefinedBy: userId,
        lastRefinedAt: new Date().toISOString(),
      },
    },
  });

  return {
    draftId,
    content: refinedContent,
    changesSummary,
    iterationCount: newIteration,
  };
}

/**
 * Get the revision history for a draft.
 *
 * Returns all prior versions of the draft in chronological order,
 * including the instruction that prompted each revision.
 *
 * @throws Error if draftId is not found.
 */
export async function getDraftHistory(
  draftId: string,
): Promise<DraftHistoryEntry[]> {
  const record = await prisma.generatedLetter.findUnique({
    where: { id: draftId },
  });

  if (!record) {
    throw new Error(`Draft not found: "${draftId}"`);
  }

  const metadata = record.populatedData as Record<string, unknown>;
  const rawHistory = String(metadata.revisionHistory ?? '[]');

  let history: Array<{
    iteration: number;
    content: string;
    instruction: string;
    timestamp: string;
  }>;

  try {
    history = JSON.parse(rawHistory);
  } catch {
    history = [];
  }

  return history.map((entry) => ({
    iteration: entry.iteration,
    content: entry.content,
    instruction: entry.instruction,
    timestamp: new Date(entry.timestamp),
  }));
}
