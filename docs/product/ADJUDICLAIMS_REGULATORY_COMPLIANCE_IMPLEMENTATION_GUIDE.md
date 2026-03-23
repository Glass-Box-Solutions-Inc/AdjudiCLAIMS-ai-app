# AdjudiCLAIMS — Regulatory Compliance Implementation Guide

**Purpose:** Actionable implementation checklist for a regulatory-safe claims examiner AI product
**Informed By:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md](foundations/WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md), [ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md](../standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md), [REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md) (attorney product)
**Last Updated:** 2026-03-22
**Implementation Status:** Design Phase — Active Development (accelerated by agentic engineering)

---

## Implementation Priority Matrix

| Phase | Focus | Timeline | Risk Level |
|-------|-------|----------|------------|
| **Phase 1: UPL Elimination** | UPL zone framework, chat filters, prohibited language enforcement | Pre-launch | **CRITICAL** |
| **Phase 2: Insurance Code Compliance** | Fair claims practices, DOI regulation alignment, timeline enforcement | Pre-launch | **CRITICAL** |
| **Phase 3: Data Boundaries** | Attorney-side / examiner-side isolation, KB access control, RBAC | Pre-launch | HIGH |
| **Phase 4: Audit & Monitoring** | DOI audit readiness, compliance dashboards, UPL violation detection | Pre-launch | HIGH |
| **Phase 5: Marketing & Disclaimers** | Product messaging, disclaimer review, training materials | Pre-launch | CRITICAL |
| **Phase 6: Ongoing Compliance** | UPL monitoring, regulatory updates, audit response | Post-launch | MEDIUM |

---

## Phase 1: UPL Elimination (Pre-Launch — CRITICAL)

### 1.1 Chat UPL Filter Implementation

**Objective:** Ensure no examiner chat interaction produces legal advice, legal analysis, or legal conclusions.

**Tasks:**
- [ ] Implement examiner-specific system prompts from [ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md](foundations/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md)
- [ ] Build query classification layer (GREEN/YELLOW/RED) as pre-chat filter
- [ ] Build output validation layer as post-generation filter
- [ ] Implement prohibited language pattern detection (regex-based, from [ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md](../standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md))
- [ ] Build RED zone blocking with mandatory attorney referral message
- [ ] Build YELLOW zone auto-disclaimer injection
- [ ] Test with 100+ RED zone queries — 100% must be blocked
- [ ] Test with 100+ GREEN zone queries — 0% false positive blocks
- [ ] Test with adversarial prompt injection attempts — all must be caught
- [ ] Legal counsel reviews all system prompts and validation rules

**Validation:** Run full UPL compliance test suite (see [ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md §Testing](foundations/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md))

### 1.2 Product Naming and Positioning Audit

**Objective:** Ensure no product element implies legal capability.

**Tasks:**
- [ ] Review all UI text for prohibited terms ("legal analysis," "legal advice," "case evaluation")
- [ ] Replace any advisory framing with informational framing
- [ ] Ensure product name/tagline does not imply legal capability (e.g., NOT "AdjudiCLAIMS Legal Counsel")
- [ ] Review all endpoint names, database fields, and variable names for prohibited legal terminology
- [ ] Verify all marketing materials use "claims information tool" or "claims management assistant" — never "legal tool"

### 1.3 Examiner Role and Permissions

**Objective:** Create RBAC role that enforces UPL boundaries at the platform level.

**Tasks:**
- [ ] Create `CLAIMS_EXAMINER` role in RBAC system (separate from `ATTORNEY` and `CLERK`)
- [ ] Define permission set: document upload, classification, factual summaries, benefit calculations, deadline tracking
- [ ] Block permissions: legal document generation, case law research, legal analysis features, settlement document drafting
- [ ] Implement role-based prompt selection (examiner role → examiner system prompts; attorney role → attorney system prompts)
- [ ] Implement role-based tool restriction in Draft Chat (examiner gets restricted tool set)
- [ ] Test role enforcement — examiner cannot access attorney-only features

### 1.4 Disclaimer Implementation

**Objective:** Apply verbatim disclaimer language from [ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md](../standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md) to all AI outputs.

**Tasks:**
- [ ] Implement product-wide disclaimer on login/home screen
- [ ] Implement GREEN zone disclaimer on all factual outputs
- [ ] Implement YELLOW zone disclaimer with "consult counsel" trigger on all flagged outputs
- [ ] Implement RED zone blocking message on all blocked outputs
- [ ] Verify disclaimers appear on all exported documents and reports
- [ ] Verify disclaimers are non-removable (cannot be stripped from exports)

---

## Phase 2: Insurance Code Compliance (Pre-Launch — CRITICAL)

### 2.1 Fair Claims Settlement Practices — Timeline Enforcement

**Objective:** Ensure AdjudiCLAIMS helps examiners meet Ins. Code § 790.03 and 10 CCR 2695 requirements.

**Tasks:**
- [ ] Implement 15-day acknowledgment deadline tracker (10 CCR 2695.5(b))
- [ ] Implement 40-day accept/deny deadline tracker (10 CCR 2695.7(b))
- [ ] Implement 30-day delay notification reminder (10 CCR 2695.7(c))
- [ ] Implement 14-day TD first payment deadline tracker (LC 4650)
- [ ] Implement subsequent 14-day TD payment cycle tracker (LC 4650(b))
- [ ] Implement UR decision timeline tracker (CCR 9792.9 — 5 business days prospective, 30 days retrospective)
- [ ] Build compliance dashboard: all claims color-coded by deadline urgency
- [ ] Test: verify all deadline calculations against known scenarios

### 2.2 Benefit Calculation Accuracy

**Objective:** Ensure statutory benefit calculations are arithmetically correct.

**Tasks:**
- [ ] Implement TD rate calculator (2/3 AWE within statutory min/max per LC 4653)
- [ ] Implement PD advance calculator
- [ ] Implement death benefit calculator (LC 4700-4706)
- [ ] Verify all calculations against DWC published rate tables for current year
- [ ] Implement statutory min/max rate updates (annual update process needed)
- [ ] Test: verify calculations against 50+ known scenarios with published correct answers

### 2.3 Notice and Disclosure Requirements

**Objective:** Generate compliant notices and disclosures.

**Tasks:**
- [ ] Build employer notification template per LC 3761 (15-day notification of claim)
- [ ] Build benefit payment explanation template per Ins. Code 790.03(h)(10)
- [ ] Build denial explanation template with factual basis (NOT legal reasoning) per 10 CCR 2695.7(h)
- [ ] Build delay notification template per 10 CCR 2695.7(c)
- [ ] All templates: factual population only, with placeholder for legal review where required
- [ ] Denial letters: mandatory "Legal review completed" certification before export

### 2.4 UR Guideline Matching

**Objective:** Provide MTUS/ACOEM guideline matching for utilization review decisions.

**Tasks:**
- [ ] Integrate MTUS guidelines data (already in KB — 41 `mtus` records)
- [ ] Build treatment-to-guideline matching service
- [ ] Present guideline criteria and document support/gaps
- [ ] Frame all output as "guideline matching for UR review" — NOT treatment recommendations
- [ ] UR physician reviewer makes clinical decision; AI provides data only
- [ ] Include GREEN zone disclaimer on all UR-related outputs

---

## Phase 3: Data Boundaries (Pre-Launch — HIGH)

### 3.1 Attorney-Side / Examiner-Side Isolation

**Objective:** Prevent cross-contamination of attorney work product into examiner AI outputs.

**Tasks:**
- [ ] Design data isolation schema (see [DATA_BOUNDARY_SPECIFICATION.md](foundations/DATA_BOUNDARY_SPECIFICATION.md))
- [ ] Implement document-level access control: attorney work product (case evaluations, legal memos, strategy documents) excluded from examiner RAG retrieval
- [ ] Implement classification-based filtering: documents classified as legal analysis excluded from examiner vector search
- [ ] Test: examiner chat cannot retrieve attorney work product, even when queried directly
- [ ] Test: attorney chat can access all documents (no restriction on attorney side)

### 3.2 Knowledge Base Access Control

**Objective:** Restrict examiner access to KB regulatory sections only; block case law analysis.

**Tasks:**
- [ ] Implement KB access control layer by user role
- [ ] Examiner role: access to `labor_code`, `ccr_title_8`, `insurance_code` (when ingested), `ccr_title_10` (when ingested), `mtus`, `omfs` source types
- [ ] Examiner role: BLOCK access to case law analysis, legal principles with legal reasoning, apportionment case analysis
- [ ] Allow examiner access to statistical/outcome data with YELLOW zone disclaimer
- [ ] Test: examiner cannot retrieve case law via KB queries

### 3.3 Cross-Product Data Sharing Rules

**Objective:** Define what data flows between the attorney product and AdjudiCLAIMS on the same claim.

**Tasks:**
- [ ] Medical records: shared (both need them; same documents)
- [ ] Claim administration data (reserves, payments, investigation notes): shared
- [ ] Attorney work product (legal analysis, strategy memos): attorney-only
- [ ] Defense counsel communications (legal strategy): attorney-only; billing data shared
- [ ] AI-generated legal analysis (from attorney product): attorney-only; never enters examiner RAG
- [ ] Implement and test all sharing rules at database query level

---

## Phase 4: Audit and Monitoring (Pre-Launch — HIGH)

### 4.1 DOI Audit Readiness

**Objective:** Ensure AdjudiCLAIMS supports DOI market conduct examination requirements.

**Tasks:**
- [ ] Extend audit trail with examiner-specific event types: `benefit_payment`, `reserve_change`, `ur_decision`, `counsel_referral`, `coverage_determination`, `investigation_activity`
- [ ] Build claim file export: generate CCR 10101-compliant claim file summary on demand
- [ ] Build claim log export: generate CCR 10103-compliant claim activity log on demand
- [ ] Build compliance report: deadline adherence metrics across all claims
- [ ] Verify 7-year retention (already implemented for attorney product; confirm for AdjudiCLAIMS)
- [ ] Test: generate audit-ready reports for sample claims

### 4.2 UPL Compliance Monitoring

**Objective:** Detect and report any UPL boundary violations in production.

**Tasks:**
- [ ] Log all UPL zone classifications (GREEN/YELLOW/RED) for every chat interaction
- [ ] Log all output blocks (RED zone) with the blocked query and referral message served
- [ ] Log all output validation failures (prohibited language detected) with the offending text
- [ ] Build UPL compliance dashboard: blocked queries by type, zone distribution over time, false positive rate
- [ ] Set up alerts: if output validator FAIL rate exceeds threshold → investigate prompt drift
- [ ] Monthly UPL compliance review: sample 100 random examiner chat interactions for manual review
- [ ] Quarterly legal review: counsel reviews sampled outputs for UPL compliance

### 4.3 Regulatory Update Process

**Objective:** Keep statutory calculations, deadlines, and guidelines current.

**Tasks:**
- [ ] Establish annual update process for statutory benefit rates (TD min/max, PD schedule)
- [ ] Establish process for updating MTUS guidelines when DWC publishes revisions
- [ ] Establish process for updating CCR regulatory sections when amendments take effect
- [ ] Establish monitoring for new Insurance Code or DOI regulation changes affecting claims handling
- [ ] Document update procedures with responsible parties and timelines

---

## Phase 5: Marketing and Disclaimers (Pre-Launch — CRITICAL)

### 5.1 Product Messaging Alignment

**Objective:** Ensure all marketing materials accurately represent AdjudiCLAIMS as informational, not legal.

**Tasks:**
- [ ] Review all marketing copy for prohibited terms (legal advice, legal analysis, case evaluation, etc.)
- [ ] Ensure all messaging uses "claims information," "claims data," "factual analysis" — never "legal analysis"
- [ ] Verify messaging emphasizes "adjuster in the loop" — AI provides data, examiner decides
- [ ] Align with [INSURANCE_INDUSTRY_STRATEGY.md](../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md) messaging framework
- [ ] Legal counsel reviews all external-facing marketing materials

### 5.2 EULA and Terms Adaptation

**Objective:** Adapt attorney-focused legal agreements for examiner users.

**Tasks:**
- [ ] Draft examiner-specific EULA provisions (parallel to attorney EULA Section 1A but for non-attorney users)
- [ ] Add examiner-specific UPL prohibition: user represents they will not use the product for legal advice or legal practice
- [ ] Add examiner-specific indemnification: user indemnifies Glass Box for UPL claims arising from misuse
- [ ] Add mandatory "not legal advice" acknowledgment in registration flow
- [ ] Legal counsel reviews and approves all agreement modifications

### 5.3 Training Materials

**Objective:** Ensure examiner users understand UPL boundaries before using the product.

**Tasks:**
- [ ] Draft [ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md](ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md)
- [ ] Build in-product onboarding flow: Green/Yellow/Red zone tutorial with examples
- [ ] Create "what this tool does NOT do" prominently in onboarding
- [ ] Build video or interactive walkthrough of common examiner workflows with UPL boundaries highlighted
- [ ] Require completion of UPL training module before granting product access

---

## Phase 6: Ongoing Compliance (Post-Launch)

### 6.1 Continuous Monitoring

- [ ] Monthly UPL compliance review (100 random chat interaction samples)
- [ ] Quarterly legal counsel review of sampled outputs
- [ ] Annual comprehensive compliance audit
- [ ] Incident response procedure for detected UPL violations
- [ ] User feedback collection on UPL boundary experience (too restrictive? unclear boundaries?)

### 6.2 Regulatory Change Response

- [ ] Monitor California legislative sessions for Insurance Code, Labor Code amendments
- [ ] Monitor DOI regulatory actions and guidance
- [ ] Monitor NAIC model act developments and state adoptions
- [ ] Update product within 90 days of any regulatory change affecting examiner duties or UPL boundaries

### 6.3 Product Improvement

- [ ] Analyze RED zone block logs to identify patterns: are examiners consistently asking questions the product should handle differently?
- [ ] Analyze false positive rate: are GREEN zone queries being incorrectly blocked?
- [ ] Refine zone classification based on production data
- [ ] Update system prompts and validation rules based on real-world usage patterns
- [ ] All prompt changes require legal counsel review before deployment

---

**Document Status:** Design phase — review before Phase 2 implementation begins
**Owner:** CEO / Product / Engineering / Legal
**Legal Review:** CRITICAL — compliance framework defines the UPL boundary
**Companion:** [REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md) (attorney product)

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
