# Data Boundary Technical Specification: Attorney-Side vs. AdjudiCLAIMS-Side

**Document Type:** Technical Design Specification
**Purpose:** Defines data isolation rules, RBAC roles, KB access control, and RAG retrieval filtering for the dual-product Adjudica platform serving both attorneys (Adjudica) and claims examiners (AdjudiCLAIMS) on the same claims
**Last Updated:** 2026-03-22
**Implementation Status:** Design Phase — Phase 2 Product (2027-2028)
**Foundation:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md §5.5](WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md)

---

## 1. Problem Statement

When the Adjudica platform serves both defense attorneys (Phase 1, Adjudica attorney product) and claims examiners (Phase 2, AdjudiCLAIMS) on the same workers' compensation claim, a data boundary must prevent:

1. **Attorney work product leaking to examiner AI** — Legal analysis generated for the attorney would be UPL if surfaced to the examiner via AI retrieval
2. **Examiner receiving AI-generated legal analysis** — Any AI output constituting legal advice delivered to a non-attorney is UPL under B&P § 6125
3. **Cross-role access to restricted features** — An examiner must not access legal research, case law analysis, or legal document generation features

The data boundary must be enforced at the **database query level**, not just the UI level, because the RAG retrieval pipeline queries documents programmatically and could surface restricted content if not properly filtered.

---

## 2. RBAC Role Definitions

### Current Roles (Attorney Product)

| Role | Permissions | Scope |
|------|------------|-------|
| `ADMIN` | Full firm management, user management, matter access control | Law firm |
| `ATTORNEY` | Full matter access, all AI features, document generation, legal research | Law firm |
| `CLERK` | Limited access, document upload, basic task functions | Law firm, per-attorney supervision |

### New Roles (AdjudiCLAIMS)

| Role | Permissions | Scope |
|------|------------|-------|
| `CLAIMS_ADMIN` | Examiner team management, compliance reporting, portfolio analytics | Insurance org / TPA |
| `CLAIMS_EXAMINER` | Claim access, factual AI features, benefit calculations, deadline tracking, counsel referral | Insurance org / TPA, assigned claims |
| `CLAIMS_SUPERVISOR` | Examiner permissions + team oversight, reserve approval authority, compliance review | Insurance org / TPA |

### Permission Matrix

| Feature | ATTORNEY | CLERK | CLAIMS_EXAMINER | CLAIMS_SUPERVISOR | CLAIMS_ADMIN |
|---------|----------|-------|-----------------|-------------------|-------------|
| Document upload/OCR | ✅ | ✅ | ✅ | ✅ | ✅ |
| Document classification | ✅ | ✅ | ✅ | ✅ | ✅ |
| Medical record summary | ✅ | ✅ | ✅ | ✅ | ✅ |
| Claim data extraction | ✅ | ✅ | ✅ | ✅ | ✅ |
| Case timeline | ✅ | ✅ | ✅ | ✅ | ✅ |
| Benefit calculator | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deadline tracking | ✅ | ✅ | ✅ | ✅ | ✅ |
| Case Chat (attorney prompts) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Case Chat (examiner prompts) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Legal document drafting | ✅ | ✅ (supervised) | ❌ | ❌ | ❌ |
| Administrative document drafting | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Base — case law | ✅ | ✅ (supervised) | ❌ | ❌ | ❌ |
| Knowledge Base — regulatory sections | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Base — statistical outcomes | ✅ | ✅ | ✅ (YELLOW zone) | ✅ (YELLOW zone) | ✅ (YELLOW zone) |
| PD Calculator (legal tool) | ✅ | ✅ (supervised) | ❌ | ❌ | ❌ |
| Form Fill — DWC legal forms | ✅ | ✅ (supervised) | ❌ | ❌ | ❌ |
| Form Fill — claims admin forms | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compliance dashboard | ❌ | ❌ | ✅ | ✅ | ✅ |
| Investigation checklist | ❌ | ❌ | ✅ | ✅ | ✅ |
| Counsel referral generator | ❌ | ❌ | ✅ | ✅ | ✅ |
| Reserve management | ❌ | ❌ | ✅ | ✅ | ✅ |
| Audit report generation | ❌ | ❌ | ✅ | ✅ | ✅ |
| UPL compliance dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Team management | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 3. Tenant Architecture

### Current: Single-Tenant (Law Firm)

```
LawFirm (tenant root)
  └── Users (Admin, Attorney, Clerk)
  └── Matters
      └── Documents → DocumentChunks → Embeddings
      └── Drafts → DraftAnswers → Citations
      └── ChatSessions → ChatMessages
      └── MatterEvents
```

### Proposed: Dual-Tenant

```
Organization (abstract tenant root)
  ├── LawFirm (attorney-side tenant)
  │   └── Users (Admin, Attorney, Clerk)
  │   └── Matters
  │       └── Documents → DocumentChunks → Embeddings
  │       └── Drafts (legal documents)
  │       └── ChatSessions (attorney prompts)
  │       └── WorkProduct (legal analysis — RESTRICTED)
  │
  └── InsuranceOrg (AdjudiCLAIMS-side tenant)
      └── Users (Claims_Admin, Claims_Supervisor, Claims_Examiner)
      └── Claims (linked to same underlying claim as attorney Matter)
          └── Documents → DocumentChunks → Embeddings (SHARED subset)
          └── Drafts (admin documents only)
          └── ChatSessions (examiner prompts)
          └── ComplianceData (deadlines, investigation status)
```

### Shared Claim Linkage

A workers' compensation claim may have both:
- A `Matter` record in the attorney-side tenant (defense counsel's case file)
- A `Claim` record in the AdjudiCLAIMS-side tenant (claims examiner's claim file)

These reference the same underlying WC claim but have different access rules:

```prisma
model SharedClaim {
  id                String          @id @default(cuid())
  claimNumber       String          @unique
  dateOfInjury      DateTime
  // ... claim identifiers

  // Linked records in each tenant
  attorneyMatter    Matter?         @relation("AttorneySide")
  examinerClaim     ExaminerClaim?  @relation("ExaminerSide")

  // Shared documents (medical records, claim admin docs)
  sharedDocuments   Document[]      @relation("SharedDocuments")
}
```

---

## 4. Document Access Rules

### Document Classification and Access

| Document Category | Attorney Access | Examiner Access | RAG Retrieval — Attorney | RAG Retrieval — Examiner |
|------------------|----------------|-----------------|-------------------------|--------------------------|
| **Medical records** (treating, QME, AME, hospital) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |
| **Claim administration docs** (benefit notices, employer reports, DWC-1) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |
| **Employment records** (wage statements, job descriptions) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |
| **Correspondence — factual** (medical provider letters, employer letters) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |
| **Attorney work product** (case evaluations, legal memos, strategy docs) | ✅ Full | ❌ Blocked | ✅ Included | ❌ **Excluded from RAG** |
| **Attorney-client privileged** (attorney-carrier strategy communications) | ✅ Full | ❌ Blocked | ✅ Included | ❌ **Excluded from RAG** |
| **Legal filings** (WCAB forms, position statements, briefs) | ✅ Full | ✅ Read only | ✅ Included | ⚠️ Included but AI cannot analyze legal content |
| **Defense counsel billing** (invoices, billing statements) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |
| **AI-generated legal analysis** (from attorney product) | ✅ Full | ❌ Blocked | ✅ Included | ❌ **Excluded from RAG** |
| **AI-generated factual summaries** (from AdjudiCLAIMS) | ✅ Full | ✅ Full | ✅ Included | ✅ Included |

### Implementation: Document Access Flag

```prisma
model Document {
  id                String          @id @default(cuid())
  // ... existing fields

  // NEW: Access control for dual-product
  accessLevel       DocumentAccess  @default(SHARED)
  containsLegalAnalysis Boolean     @default(false)
  containsWorkProduct   Boolean     @default(false)
  containsPrivileged    Boolean     @default(false)
}

enum DocumentAccess {
  SHARED              // Both products can access
  ATTORNEY_ONLY       // Attorney product only
  EXAMINER_ONLY       // AdjudiCLAIMS only (rare — e.g., internal carrier memos)
}
```

### RAG Retrieval Filter

The vector search service (`form-filling-vector.service.ts`, `case-chat.service.ts`) must apply a role-based filter:

```typescript
// Pseudocode — examiner RAG filter
const getRetrievalFilter = (userRole: UserRole): DocumentFilter => {
  if (isExaminerRole(userRole)) {
    return {
      accessLevel: { not: 'ATTORNEY_ONLY' },
      containsLegalAnalysis: false,
      containsWorkProduct: false,
      containsPrivileged: false
    };
  }
  // Attorney roles: no additional filter
  return {};
};
```

---

## 5. Knowledge Base Access Control

### Access by Source Type

| KB Source Type | Records | Attorney Access | Examiner Access | Rationale |
|--------------|---------|----------------|-----------------|-----------|
| `labor_code` | 401 | ✅ Full | ✅ Statutory text only | Regulatory compliance reference |
| `ccr_title_8` | 409 | ✅ Full | ✅ Regulatory text only | Claims admin and UR regulations |
| `insurance_code` | TBD (gap) | ✅ Full | ✅ Full | Core examiner regulatory authority |
| `ccr_title_10` | TBD (gap) | ✅ Full | ✅ Full | DOI fair claims regulations |
| `ama_guides_5th` | 584 | ✅ Full | ⚠️ Reference only (GREEN) | Medical reference — not legal analysis |
| `pdrs_2005` | 59 | ✅ Full | ❌ Blocked | PD rating is legal tool — examiner uses attorney for PD analysis |
| `mtus` | 41 | ✅ Full | ✅ Full | UR guideline matching — clinical, not legal |
| `omfs` | 86 | ✅ Full | ✅ Full | Fee schedule — billing reference |
| `crpc` | TBD (gap) | ✅ Full | ❌ Blocked | Attorney ethics — not examiner domain |
| `business_professions` | TBD (gap) | ✅ Full | ⚠️ B&P 6125 only (reference) | UPL statute — examiner needs to understand the boundary |

### Access by Content Type

| KB Content Type | Attorney | Examiner | Rationale |
|----------------|----------|----------|-----------|
| **Regulatory sections** (statutory text) | ✅ | ✅ | Factual reference material |
| **Legal principles** (case law analysis) | ✅ | ❌ | Legal analysis = UPL for examiners |
| **Case summaries** (case holdings) | ✅ | ❌ | Legal interpretation = UPL |
| **IRAC briefs** (legal reasoning) | ✅ | ❌ | Legal reasoning = UPL |
| **Statistical outcomes** (claim resolution data) | ✅ | ✅ (YELLOW) | Data with legal implications — requires disclaimer |

### Implementation

```typescript
// Pseudocode — KB access filter
const getKBFilter = (userRole: UserRole): KBQueryFilter => {
  if (isExaminerRole(userRole)) {
    return {
      allowedSourceTypes: ['labor_code', 'ccr_title_8', 'insurance_code',
                           'ccr_title_10', 'mtus', 'omfs', 'ama_guides_5th'],
      blockedSourceTypes: ['pdrs_2005', 'crpc'],
      allowedContentTypes: ['regulatory_section', 'statistical_outcome'],
      blockedContentTypes: ['legal_principle', 'case_summary', 'irac_brief'],
      requireDisclaimer: ['statistical_outcome']  // YELLOW zone
    };
  }
  return {};  // Attorney: unrestricted
};
```

---

## 6. Chat Session Isolation

### Prompt Selection by Role

| User Role | System Prompt | Available Tools | Output Validation |
|-----------|--------------|-----------------|-------------------|
| `ATTORNEY` | Attorney system prompt (current) | All 17 tools | Standard citation validation |
| `CLERK` | Attorney system prompt (supervised) | All 17 tools (output requires attorney review) | Standard citation validation |
| `CLAIMS_EXAMINER` | AdjudiCLAIMS system prompt (UPL-filtered) | Restricted tool set (see §2) | UPL query classifier + output validator |
| `CLAIMS_SUPERVISOR` | AdjudiCLAIMS system prompt (UPL-filtered) | Restricted tool set + compliance tools | UPL query classifier + output validator |

### Chat History Isolation

Attorney and examiner chat sessions on the same claim must be isolated:
- Attorney chat sessions are NOT visible to examiner users
- Examiner chat sessions are NOT visible to attorney users
- Attorney chat may contain legal analysis that would be UPL if surfaced to examiner
- Chat history is scoped by `organizationId` (tenant) and `role`

---

## 7. Draft/Document Generation Boundaries

### Template Availability by Role

| Template Category | Attorney | Examiner |
|------------------|----------|----------|
| DWC legal forms (Application, Answer, etc.) | ✅ | ❌ |
| MSC position statements | ✅ | ❌ |
| Settlement documents (C&R, Stip) | ✅ | ❌ |
| Legal correspondence (to opposing counsel) | ✅ | ❌ |
| Benefit notification letters | ✅ | ✅ |
| Employer notification letters | ✅ | ✅ |
| UR correspondence | ✅ | ✅ |
| Investigation checklists | ❌ | ✅ |
| Claims status reports (internal) | ❌ | ✅ |
| Compliance reports | ❌ | ✅ |
| Counsel referral summaries | ❌ | ✅ |

### Custom Draft Restrictions

Attorney `CustomDraft`: unrestricted — can generate any document type
AdjudiCLAIMS `CustomDraft`: restricted — prompt validation rejects requests for legal documents

```typescript
// Pseudocode — examiner custom draft validation
const blockedDraftTypes = [
  'legal brief', 'position statement', 'settlement', 'compromise and release',
  'stipulation', 'motion', 'petition', 'legal memorandum', 'legal analysis',
  'case evaluation', 'defense strategy', 'coverage opinion'
];

const validateExaminerDraftRequest = (prompt: string): boolean => {
  const lower = prompt.toLowerCase();
  return !blockedDraftTypes.some(type => lower.includes(type));
};
```

---

## 8. Audit Trail Extensions

### New Examiner-Specific Event Types

| Event Type | Description | Data Captured |
|-----------|-------------|---------------|
| `upl_zone_classification` | Query classified as GREEN/YELLOW/RED | Zone, query text (sanitized), confidence |
| `upl_output_blocked` | RED zone output blocked | Blocked query, referral message served |
| `upl_output_validation_fail` | Output validator caught prohibited language | Offending text, rule triggered |
| `upl_disclaimer_injected` | YELLOW zone disclaimer added to output | Output text, disclaimer type |
| `counsel_referral_generated` | Factual summary generated for counsel referral | Claim ID, legal issue identified |
| `benefit_payment_calculated` | Benefit amount calculated | Claim ID, calculation inputs, result |
| `reserve_change` | Reserve set or adjusted | Claim ID, old reserve, new reserve, reason |
| `coverage_determination` | Accept/deny decision recorded | Claim ID, determination, basis |
| `ur_decision` | UR authorization/dispute recorded | Claim ID, treatment, decision, guideline reference |
| `investigation_activity` | Investigation step completed | Claim ID, activity type, description |
| `compliance_deadline_alert` | Deadline alert generated | Claim ID, deadline type, due date, days remaining |

---

## 9. Migration Strategy

### Phase 2A: AdjudiCLAIMS-Only Deployment (No Shared Claims)

Initial launch with AdjudiCLAIMS as standalone — no attorney-side data sharing:
- Separate tenant for insurance org users
- Examiners upload their own documents
- No cross-reference to attorney matters
- Simplest data boundary: complete tenant isolation

### Phase 2B: Shared Claim Linkage

After standalone AdjudiCLAIMS is stable, introduce shared claim linkage:
- Attorney and examiner on same claim can share medical records and claim admin documents
- Document access rules enforced per §4
- KB access rules enforced per §5
- Chat isolation enforced per §6

### Phase 2C: Defense Counsel Oversight

Advanced integration where carriers see aggregate defense counsel metrics:
- Billing data shared (factual)
- Legal strategy never shared
- Requires careful data classification at ingest time

---

**Document Status:** Technical design spec — review before Phase 2 engineering
**Owner:** Engineering / Product
**Legal Review:** Required — data boundary rules have UPL implications

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
