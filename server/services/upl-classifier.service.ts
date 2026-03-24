/**
 * UPL (Unauthorized Practice of Law) query classifier.
 *
 * Classifies user queries into traffic-light zones:
 *   GREEN  -- Clearly permissible (factual, procedural, calculation)
 *   YELLOW -- Borderline (requires careful framing / disclaimers)
 *   RED    -- Prohibited (legal advice, strategy, case-specific recommendations)
 *
 * This is a critical compliance boundary. The production implementation
 * will use an LLM-based classifier with a curated evaluation suite of
 * 250+ labeled queries.
 */

export interface UplClassification {
  zone: 'GREEN' | 'YELLOW' | 'RED';
  reason: string;
}

/**
 * Classify a user query for UPL compliance.
 *
 * @param query - The raw user input to classify.
 * @returns Classification result with zone and reasoning.
 */
// TODO: Implement LLM-based classification in Phase 4
export function classifyQuery(query: string): UplClassification {
  // Stub: return GREEN for all queries during scaffold phase.
  // The production implementation will:
  //   1. Send the query to an LLM with a classification system prompt
  //   2. Parse structured output into zone + reason
  //   3. Log the classification via the audit logger
  //   4. Apply conservative defaults (unknown = YELLOW)
  return {
    zone: 'GREEN',
    reason: `Stub classifier -- query not analyzed (${String(query.length)} chars)`,
  };
}
