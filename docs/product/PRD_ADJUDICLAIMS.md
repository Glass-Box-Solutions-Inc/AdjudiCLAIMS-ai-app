# Product Requirements Document: AdjudiCLAIMS by Glass Box

**Product Name:** AdjudiCLAIMS by Glass Box
**Document Type:** Product Requirements Document (PRD)
**Version:** 1.0
**Last Updated:** 2026-03-22
**Target Launch:** Active Development (accelerated from 2027-2028 by agentic engineering)
**Owner:** CEO / Product
**Legal Review Required:** Yes — CRITICAL before development begins

---

## 1. Executive Summary

### What We're Building

An AI-powered claims management information tool for California Workers' Compensation claims examiners that provides factual data analysis, regulatory deadline tracking, medical record summarization, and benefit calculations — while **stringently guarding against the unauthorized practice of law**.

### What We're NOT Building

- A replacement for claims examiners
- A claims automation system that makes coverage or payment decisions
- A legal analysis tool (that's the attorney product)
- A black-box decision engine

### The Core Constraint

> **The examiner is NOT a licensed attorney. Every AI output must be informational and fact-based. Any time a legal issue is implicated, the product must direct the examiner to seek guidance from defense counsel. This is not a feature — it is a hard legal requirement under Cal. Bus. & Prof. Code § 6125.**

### Strategic Context

- Phase 1 (attorney product) establishes Adjudica as the CA WC AI platform
- Phase 2 (AdjudiCLAIMS) completes the ecosystem: attorney-side + carrier-side
- No competitor spans both sides — this is genuine whitespace *(see [INSURANCE_INDUSTRY_STRATEGY.md](../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md))*
- Industry benchmarks validate the model: EvolutionIQ ($730M acquisition), CLARA (95% triage accuracy), CorVel (1.5-2 hrs/week saved per adjuster)

---

## 2. Users and Personas

### Primary User: Claims Examiner

| Attribute | Description |
|-----------|------------|
| **Title** | Claims Examiner, Claims Adjuster, Claims Representative |
| **Employer** | Insurance carriers, TPAs, self-insured employers |
| **Caseload** | 125-175 open claims simultaneously |
| **Pain points** | Document volume (100s-1000s pages per claim), regulatory deadline pressure, medical record complexity, reserve accuracy, audit exposure |
| **NOT a lawyer** | Cannot receive legal advice from AI; must consult defense counsel for legal issues |
| **Decision authority** | Accept/deny claims, set reserves, authorize treatment, refer to counsel, authorize settlement |

### Secondary User: Claims Supervisor

| Attribute | Description |
|-----------|------------|
| **Title** | Claims Supervisor, Claims Manager, VP Claims |
| **Role** | Oversees examiner team; reviews complex claims; approves authority levels |
| **Pain points** | Portfolio visibility, reserve adequacy across book, regulatory compliance across team, ALAE management |

### Excluded User: Injured Worker / Applicant

AdjudiCLAIMS must NEVER be used to communicate legal information to injured workers. The product is for claims professionals only. *(Ins. Code § 790.03(h)(15) — cannot advise claimant not to get a lawyer)*

---

## 3. MVP Feature Scope

### Tier 1: Must-Have (MVP)

| Feature | Description | UPL Zone | Reuses Existing Service |
|---------|------------|----------|------------------------|
| **Document Ingestion & OCR** | Upload claim documents; OCR processing; text extraction | GREEN | ✅ Direct reuse: Google Document AI pipeline |
| **Document Classification** | Auto-categorize into 12 types / 150+ subtypes | GREEN | ✅ Direct reuse: `document-classifier.service.ts` |
| **Medical Record Summary** | Extract factual findings from medical reports (diagnoses, WPI, restrictions) | GREEN | ✅ Direct reuse: `document-field-extraction.service.ts` |
| **Claim Data Extraction** | Auto-populate claim fields from documents (employer, insurer, injury, AWE) | GREEN | ✅ Direct reuse: `matter-claim.model.ts` |
| **Benefit Calculator** | TD rate, PD advance, statutory deadlines — arithmetic only | GREEN | ⚠️ New: dedicated calculator service using existing extraction data |
| **Regulatory Deadline Dashboard** | Track all statutory deadlines across all claims (15-day, 40-day, 14-day TD, UR) | GREEN | ⚠️ New: extends existing timeline with claims-specific deadline engine |
| **Claims Chat (UPL-Filtered)** | Factual Q&A over claim documents with Green/Yellow/Red zone enforcement | GREEN/YELLOW/RED | ⚠️ Major modification: `case-chat.service.ts` + UPL filter layer |
| **Claim Chronology / Timeline** | Auto-generated timeline from document dates and events | GREEN | ✅ Direct reuse: `event-generation.service.ts` |
| **Investigation Checklist** | Track investigation completeness (three-point contact, records, statements) | GREEN | ⚠️ New: workflow-based checklist service |
| **Audit Trail** | Immutable logging of all examiner actions and AI interactions | GREEN | ✅ Direct reuse: `audit-logger.ts` |

### Tier 2: Should-Have (Post-MVP)

| Feature | Description | UPL Zone | Reuses Existing Service |
|---------|------------|----------|------------------------|
| **MTUS Guideline Matching** | Match treatment requests against UR guidelines | GREEN | ⚠️ Modification: integrate KB MTUS data (41 records) |
| **Comparable Claims Data** | Statistical resolution ranges for similar claims | YELLOW | ⚠️ New: requires claims outcome database; mandatory disclaimer |
| **Compliance Reporting** | Generate DOI audit-ready reports (CCR 10101-10108 compliance) | GREEN | ⚠️ New: report generation from audit trail |
| **Benefit Payment Letters** | Template-based benefit explanation correspondence | GREEN | ⚠️ Modification: `template-generation.service.ts` with examiner templates |
| **Employer Notifications** | Auto-generate LC 3761 employer notification letters | GREEN | ⚠️ Modification: examiner-specific templates |
| **Counsel Referral Workflow** | Generate factual claim summary for defense counsel referral | GREEN | ⚠️ New: referral summary generator (see [ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md §5](foundations/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md)) |
| **Training Sandbox** | Practice environment with sample claims for new examiner training | GREEN | ⚠️ New: isolated training tenant with synthetic data |

### Tier 3: Nice-to-Have (Future)

| Feature | Description | UPL Zone |
|---------|------------|----------|
| **Litigation Risk Scoring** | Statistical indicators of litigation probability | YELLOW |
| **Reserve Adequacy Analysis** | Comparable claims benchmarking for reserve review | YELLOW |
| **Defense Counsel Oversight** | Billing review, status report tracking, efficiency metrics | GREEN/YELLOW |
| **Claims Management System Integration** | Guidewire, Duck Creek, Origami Risk sync | GREEN |
| **Portfolio Analytics** | Aggregate metrics across examiner's book of business | GREEN |
| **Fraud Indicator Detection** | Factual pattern identification (not legal fraud assessment) | GREEN/YELLOW |

---

## 4. User Stories

### Claims Investigation

> **As a claims examiner**, I want to upload a new claim's documents and have AI extract the key facts (claimant info, employer, insurer, injury details, medical findings) so that I can set up the claim file without 30 minutes of manual data entry.
>
> **Acceptance criteria:** Claim record populated with extracted data within 5 minutes of document upload. All fields cite source document. Examiner can correct any field.

> **As a claims examiner**, I want to see an investigation checklist that shows which standard investigation steps are complete vs. outstanding (three-point contact, medical records, employer report, index bureau) so that I know what's missing before making a determination.
>
> **Acceptance criteria:** Checklist auto-updates as documents are uploaded and classified. Missing items clearly identified. No advisory language — just factual completeness tracking.

### Medical Management

> **As a claims examiner**, I want AI to summarize a 200-page medical record set and extract the key findings (diagnoses, WPI ratings, work restrictions, treatment history) with citations to specific pages, so that I can review the medical evidence in 15 minutes instead of 3 hours.
>
> **Acceptance criteria:** Summary presents factual findings only. Every finding cites source document and page. No interpretation of medical significance. No treatment recommendations.

> **As a claims examiner**, I want to ask "What WPI did Dr. Smith assign for the lumbar spine?" and get a cited answer from the uploaded documents, so that I can quickly find specific medical data without reading entire reports.
>
> **Acceptance criteria:** Chat returns factual answer with citation. GREEN zone — no disclaimer needed for pure factual extraction.

### Regulatory Compliance

> **As a claims examiner**, I want a dashboard showing all my claims with their regulatory deadlines color-coded by urgency, so that I never miss a 15-day acknowledgment, 40-day determination, or 14-day TD payment deadline.
>
> **Acceptance criteria:** Dashboard shows all active claims. Green (<50% of deadline elapsed), Yellow (50-80%), Red (>80% or overdue). Deadlines calculated from statutory requirements applied to claim dates.

> **As a claims supervisor**, I want to generate a compliance report for my team showing deadline adherence metrics across all examiners, so that I can identify compliance risks before DOI audit.
>
> **Acceptance criteria:** Report shows deadline adherence by examiner, by claim, by deadline type. Exportable for audit preparation. Factual data only.

### Legal Issue Escalation

> **As a claims examiner**, when I ask the AI a question that involves a legal issue (e.g., "Should I deny this claim?"), I want the AI to tell me this requires legal counsel and offer to prepare a factual summary for my attorney, so that I get appropriate help without the AI practicing law.
>
> **Acceptance criteria:** RED zone query detected and blocked. Attorney referral message displayed. Option to generate factual counsel referral summary. No legal advice provided under any circumstances.

> **As a claims examiner**, when the AI identifies that my claim involves cumulative trauma or apportionment issues, I want it to flag this as a legal issue and recommend I consult defense counsel, so that I know when legal expertise is needed.
>
> **Acceptance criteria:** YELLOW zone issue identification with mandatory disclaimer. Factual description of what was identified. "Consult defense counsel" language included. No legal analysis of the issue.

---

## 5. UPL Compliance Acceptance Criteria

**These criteria are non-negotiable. The product cannot launch without passing ALL of them.**

| # | Criterion | Test Method | Pass Threshold |
|---|-----------|-------------|----------------|
| 1 | RED zone queries are blocked | Automated test suite: 100+ legal advice queries | **100% blocked** (zero misses) |
| 2 | GREEN zone queries pass through | Automated test suite: 100+ factual queries | **≤2% false positive block rate** |
| 3 | YELLOW zone queries include disclaimer | Automated test suite: 50+ borderline queries | **100% include disclaimer** |
| 4 | Prohibited language patterns blocked | Automated test suite: 200+ response variations | **100% caught by output validator** |
| 5 | Adversarial prompts handled | Manual test suite: 50+ prompt injection attempts | **100% caught** |
| 6 | Attorney work product excluded from examiner RAG | Integration test: examiner queries legal analysis documents | **0% retrieved** |
| 7 | Case law KB access blocked for examiner | Integration test: examiner queries case law | **0% returned** |
| 8 | All outputs cite source documents | Automated test: 500+ random outputs | **100% have citations or explicit "not found"** |
| 9 | Benefit calculations match DWC tables | Automated test: 50+ known scenarios | **100% arithmetic accuracy** |
| 10 | Deadline calculations are correct | Automated test: 50+ known deadline scenarios | **100% accuracy** |
| 11 | Audit trail captures all actions | Integration test: perform all user actions, verify log | **100% logged** |
| 12 | Legal counsel sign-off | Manual review by licensed CA attorney | **Written approval** |

---

## 6. Success Metrics

### Product Metrics (Post-Launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Claims examiner time saved per claim | 1.5-2 hours/week | Self-reported + time-in-app analytics |
| Document review time reduction | 60-75% | Before/after timing studies |
| Regulatory deadline compliance | >98% across all users | Dashboard data |
| False positive UPL block rate | <2% | Output validator logs |
| Examiner satisfaction (NPS) | >50 | Quarterly survey |
| Audit examination pass rate | 100% | DOI audit results |
| Examiner regulatory competency score | >80% on quarterly assessments | Assessment results |
| Training completion rate (new examiners) | 100% within first week | Training module logs |
| Tier 1 dismissal velocity | 50%+ terms dismissed within 30 days | Education profile data |
| Workflow usage rate (new examiners, first 30 days) | >60% of decision points use guided workflow | Workflow activation logs |

### Business Metrics (Phase 2 Roadmap)

| Metric | Target | Timeline |
|--------|--------|----------|
| Carrier pilot programs | 2-3 | Month 24-30 |
| Paying customers | 5+ | Month 30-36 |
| Revenue from insurance segment | $500K+ ARR | Year 3 |
| Client retention | 95%+ | Ongoing |

*(Targets from [INSURANCE_INDUSTRY_STRATEGY.md Part 8](../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md))*

---

## 6.5 Education & Training — Core Product Pillar

> **AdjudiCLAIMS is not just a productivity tool — it is the training program.** Insurance companies experience 25-40% annual examiner turnover. New examiners often make decisions without understanding the regulatory framework they're operating in. AdjudiCLAIMS applies the Glass Box philosophy to claims education: every deadline, calculation, and requirement is transparent, cited, and explained.

### Education Architecture

| Layer | Purpose | Specification |
|-------|---------|--------------|
| **Pre-use mandatory training** | Gate: examiner cannot access product until 4 modules completed | [ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md](ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md) §2.1 |
| **In-product contextual education** | At every decision point, explain the WHY | [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) (57 entries) |
| **Decision workflow guidance** | Step-by-step regulatory-grounded workflows | [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md) (20 workflows) |
| **Ongoing regulatory education** | Keep examiners current as laws change | [ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md](ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md) §2.3 |

### Two-Tier Progressive Disclosure

| Tier | Content | Behavior |
|------|---------|----------|
| **Tier 1: Dismissable basics** | Term definitions, acronym explanations, process overviews | Shown by default for new examiners. Dismissed permanently once learned. Training wheels. |
| **Tier 2: Always-present core** | Statutory authority, regulatory reasoning, consequences | NEVER hidden. Even a 20-year veteran sees the regulatory basis. Glass Box foundation. |

### Education User Stories

> **As a brand-new claims examiner** with no CA WC experience, I want the product to explain every term, every deadline, and every regulatory requirement in plain English so that I can handle claims correctly from day one without relying solely on classroom training that I may not remember.
>
> **Acceptance criteria:** Every feature includes Tier 1 definitions for all WC-specific terms. Every compliance feature includes Tier 2 regulatory context (authority, standard, consequence). Pre-use training must be completed before product access.

> **As an experienced claims examiner**, I want to dismiss basic definitions I already know while still seeing the regulatory authority and consequences for each action, so that the product doesn't feel patronizing but still provides the Glass Box transparency I rely on.
>
> **Acceptance criteria:** Tier 1 content is permanently dismissable per-term. Tier 2 content is always present (collapsible but never removable). User education profile tracks dismissed terms.

> **As a claims supervisor**, I want to see which of my new examiners have completed training, which terms they've dismissed, and how often they're using guided workflows, so that I can identify who needs additional coaching.
>
> **Acceptance criteria:** Supervisor dashboard shows training completion, Tier 1 dismissal rates, workflow usage, and compliance scores per examiner.

### Education Acceptance Criteria Per MVP Feature

| MVP Feature | Education Requirement |
|-------------|---------------------|
| Document Ingestion & OCR | Tier 1: Explain document types (DWC-1, medical reports, etc.) |
| Document Classification | Tier 1: Define each classification category. Tier 2: Explain why classification matters for investigation completeness (CCR 10101) |
| Medical Record Summary | Tier 1: Define medical terms (WPI, MMI, diagnoses). Tier 2: Explain that summaries are factual extractions, not medical opinions |
| Benefit Calculator | Tier 1: Define AWE, TD, statutory min/max. Tier 2: Cite LC 4653, explain calculation method, warn about LC 4650(c) late penalty |
| Regulatory Deadline Dashboard | Tier 2 (always present): For each deadline type, show authority, consequence of missing, and what compliance looks like |
| Claims Chat (UPL-Filtered) | Tier 1: Explain zone system on first use. Tier 2: Every RED block explains WHY the question crosses into legal territory |
| Investigation Checklist | Tier 1: Explain each investigation step. Tier 2: Cite CCR 10109, explain what "reasonable investigation" means |
| Audit Trail | Tier 2: Explain that everything is logged for DOI audit compliance (CCR 10105-10108) |

### Regulatory Compliance: 10 CCR 2695.6

AdjudiCLAIMS's education system satisfies the DOI regulation requiring training of claims personnel. Full compliance mapping in [ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md §5](ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md).

---

## 7. Technical Architecture Summary

### Reuse from Attorney Product

| Component | Reuse Level | Notes |
|-----------|------------|-------|
| OCR pipeline (Document AI) | 100% | Same pipeline |
| Document classification | 95% | May add examiner-specific subtypes |
| Field extraction | 90% | Add examiner-specific schemas |
| RAG retrieval | 90% | Add UPL-aware filtering |
| Timeline/events | 90% | Add claims-specific date types |
| Chat services | 50% | Major modification: UPL filter layer |
| Draft/template services | 60% | Examiner-specific templates; block legal documents |
| Audit trail | 95% | Add examiner event types |
| RBAC | 70% | New role with restricted permissions |
| Knowledge Base | 40% | Restrict to regulatory sections; block case law |

### New Components Required

| Component | Purpose |
|-----------|---------|
| UPL query classifier | Pre-chat zone classification |
| UPL output validator | Post-generation compliance check |
| Benefit calculator | Statutory arithmetic (TD rate, PD, deadlines) |
| Compliance deadline engine | Multi-deadline tracking across claims portfolio |
| Investigation checklist | Claims investigation completeness tracker |
| Compliance reporting | DOI audit-ready report generation |
| Counsel referral generator | Factual summary for attorney referral |
| Claims management system integrations | Guidewire, Duck Creek, Origami Risk |

---

## 8. Dependencies

| Dependency | Status | Impact if Delayed |
|-----------|--------|-------------------|
| Knowledge Base — Insurance Code ingestion | Gap identified ([KB_REGULATORY_GAP_REPORT.md](foundations/KB_REGULATORY_GAP_REPORT.md)) | Cannot provide Insurance Code regulatory references |
| Knowledge Base — CCR Title 10 ingestion | Gap identified | Cannot provide DOI fair claims practice references |
| Knowledge Base — LC 4060-4062 ingestion | Gap identified | Cannot provide QME/AME regulatory references |
| Legal counsel review of UPL framework | Not started | **Cannot launch without written legal approval** |
| Carrier advisory board formation | Target Q4 2026 | Reduced product-market fit signal |
| Attorney product traction | In progress | AdjudiCLAIMS messaging depends on attorney-side proof points |

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| UPL violation in production | Medium | **Critical** — legal liability, reputation, regulatory action | Three-layer UPL filter (query classifier + system prompt + output validator); monthly compliance audits; quarterly legal review |
| Examiners frustrated by RED zone blocks | High | Medium — user satisfaction | Clearly explain WHY blocked; offer counsel referral alternative; refine zone boundaries based on usage data |
| Insurance carriers require different compliance frameworks | Medium | Medium — customization burden | Build configurable compliance rules per carrier; prioritize common framework first |
| Attorney product data leaks into AdjudiCLAIMS | Low | **Critical** — UPL via data contamination | Database-level data boundaries; role-based RAG filtering; integration testing |
| Regulatory landscape changes (new state AI laws) | Medium | Medium — compliance updates needed | Monitor legislative sessions; 90-day response process; configurable rules engine |

---

## 10. Open Questions

| # | Question | Who Decides | Status |
|---|---------|-------------|--------|
| 1 | Where exactly is the UPL line between "factual reserve analysis" and "case valuation"? | Legal counsel | **Open — requires legal opinion** |
| 2 | Can AdjudiCLAIMS show case law citations in any context (e.g., regulatory citations vs. case analysis)? | Legal counsel | **Open** |
| 3 | Should AdjudiCLAIMS support self-insured employer users (who are also the employer, not just the insurer)? | Product / Legal | **Open** |
| 4 | What claims management systems should be prioritized for integration? | Carrier advisory board | **Open — depends on pilot carrier selection** |
| 5 | Pricing model: per-seat, per-claim, or per-carrier license? | CEO / Business | **Open** |
| 6 | Should AdjudiCLAIMS be a separate app or a role within the existing Adjudica platform? | Engineering / Product | **Open — see [DATA_BOUNDARY_SPECIFICATION.md](foundations/DATA_BOUNDARY_SPECIFICATION.md)** |

---

**Document Status:** Initial PRD — iterate with carrier advisory board input
**Next Review:** When carrier advisory board is formed (target Q4 2026)

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
