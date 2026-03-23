# UPL Compliance Test Suite

Automated evaluation suite for the UPL (Unauthorized Practice of Law) query
classifier. This is a critical compliance boundary -- the classifier determines
whether AdjudiCLAIMS can respond to a user query or must decline.

## Test Coverage Targets

| Zone   | Description                              | Min queries | Status      |
|--------|------------------------------------------|-------------|-------------|
| RED    | Legal advice, strategy, recommendations  | 100+        | Not started |
| GREEN  | Factual, procedural, calculation queries | 100+        | Not started |
| YELLOW | Borderline queries requiring disclaimers | 50+         | Not started |

## Zone Definitions

- **GREEN** -- Clearly permissible. Factual information, statutory lookups,
  benefit calculations, procedural guidance, form identification.
- **YELLOW** -- Borderline. Requires careful framing, explicit disclaimers,
  and potentially supervisor review. The system must flag these for HITL review.
- **RED** -- Prohibited. Legal advice, case strategy, litigation recommendations,
  settlement advice, or anything that crosses the UPL boundary. The system must
  refuse and redirect to qualified legal counsel.

## Test Structure (Planned)

```
tests/upl-compliance/
  fixtures/
    red-queries.json       # 100+ queries that MUST be classified RED
    green-queries.json     # 100+ queries that MUST be classified GREEN
    yellow-queries.json    # 50+ queries that MUST be classified YELLOW
  upl-classifier.test.ts   # Parameterized tests running all fixtures
  upl-regression.test.ts   # Regression tests for past misclassifications
```

## Acceptance Criteria

- RED zone: 100% recall (zero false negatives -- never allow a RED query through)
- GREEN zone: >= 95% precision (minimal false positives blocking valid queries)
- YELLOW zone: >= 90% recall (borderline queries must be flagged)
- Overall accuracy: >= 95% across the full evaluation suite

## References

- `docs/standards/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md` -- System prompt and UPL boundary rules
- `docs/standards/UPL_GUARDRAILS.md` -- Legal analysis of UPL boundaries
- `server/services/upl-classifier.service.ts` -- Classifier implementation
