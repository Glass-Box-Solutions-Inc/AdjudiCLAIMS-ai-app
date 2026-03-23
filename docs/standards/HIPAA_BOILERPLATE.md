# HIPAA Boilerplate — Reusable Documentation Sections

**Audience:** T3 (IT/Compliance Officer), T1 (Attorney Evaluator)
**Implementation Status:** Implemented
**Last Updated:** 2026-02-22
**Version:** 1.0

---

## Purpose

This file contains reusable HIPAA documentation sections for all Glass Box WC products. Copy the sections relevant to your product into your product's HIPAA compliance documentation and populate the bracketed fields. Do not modify the structure of the tables or the regulatory citations without legal review.

All Glass Box products that process Protected Health Information (PHI) must include each section below in their compliance documentation. Sections may be adapted but must not be abbreviated in ways that omit regulatory citations or compliance obligations.

---

## Section 1: PHI Inventory

### What Is PHI

Protected Health Information (PHI) is individually identifiable health information transmitted or maintained in any form or medium by a covered entity or business associate. In the California Workers' Compensation context, PHI commonly includes medical records, treatment notes, IME/QME reports, billing records, and diagnosis codes associated with a specific claimant.

### PHI Inventory Table

List every PHI field processed by the product. A field is "processed" if it is collected, stored, transmitted, used, analyzed, or displayed by the product at any point, including during AI processing.

| PHI Field | Source | Purpose | Retention | Legal Basis |
|-----------|--------|---------|-----------|-------------|
| Claimant name | Document upload / MerusCase import | Case identification, document matching | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955; HIPAA §164.530(j) |
| Date of birth | Document upload | Claimant identity verification, age-at-injury calculation | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955 |
| Date of injury | Document upload | WC claim eligibility, PDRS date selection | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955 |
| Diagnosis codes (ICD-10) | Medical records, PR-4 forms | AI classification, PD rating input | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955; HIPAA §164.530(j) |
| Treatment records and notes | Medical record uploads | Document classification, AI summary, attorney review | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955; HIPAA §164.530(j) |
| QME/AME reports | Document upload | AI analysis, case summary, attorney review | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955; HIPAA §164.530(j) |
| Workers' Compensation claim number | MerusCase import, user input | Case linkage across uploads | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955 |
| Social Security Number (last 4 digits) | DWC-1 form processing | Claimant identification on DWC forms | Per DATA_RETENTION_TEMPLATE.md | CA Labor Code §5955 |
| Attorney and firm name | User account | Case attribution, access control | Per DATA_RETENTION_TEMPLATE.md | Contractual |
| [ADD PRODUCT-SPECIFIC FIELDS] | [Source] | [Purpose] | [Period] | [Statute] |

**Instruction:** Delete rows for fields your product does not process. Add rows for any additional fields. Every row must have a legal basis; "business need" alone is not a legal basis under HIPAA.

---

## Section 2: Sub-Processor Table

### Sub-Processor Disclosure

Glass Box Solutions, Inc. engages the following sub-processors that may process PHI in connection with this product. All sub-processors handling PHI have executed Business Associate Agreements (BAAs).

**Source:** Glass Box SUBPROCESSOR_LIST.md (legal/final-documents/product/SUBPROCESSOR_LIST.md), effective as of the date of this document.

| Provider | Service | PHI Processed | BAA Status | Location | Contact |
|----------|---------|--------------|------------|----------|---------|
| Google Cloud Platform (GCP) | Cloud infrastructure, data storage, computing | All PHI at rest and in transit | BAA Executed | United States (us-west1, us-central1) | Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 |
| Google Cloud SQL | Database services | Structured data, case metadata | BAA Executed | United States (us-west1) | Google LLC (see above) |
| Google Cloud Storage | Document and file storage | Uploaded medical records, legal documents | BAA Executed | United States (us-west1) | Google LLC (see above) |
| Anthropic | AI language model (Claude) for document analysis | Medical records, legal documents, user queries (no model training) | BAA Executed | United States | Anthropic PBC, San Francisco, CA — privacy@anthropic.com |
| OpenAI | Supplementary AI analysis (GPT) | Document summaries, legal research queries (no model training) | BAA Executed | United States | OpenAI, L.L.C., San Francisco, CA |
| Google Vertex AI | AI/ML, Document AI OCR, text extraction | Document images, scanned PDFs, form data | BAA Executed | United States (us-west1) | Google LLC (see above) |
| Pinecone | Vector database for semantic search | Document embeddings only (mathematical representations, not raw PHI text) | BAA Executed | United States (us-west1-gcp) | Pinecone Systems, Inc., New York, NY |

**Sub-processors that do not process PHI** (no BAA required):

| Provider | Service | Data Processed | BAA Required |
|----------|---------|---------------|-------------|
| Google Identity Platform | Authentication, SSO | User credentials, session data | No |
| SendGrid (Twilio) | Transactional email | Email addresses, notification content | No |
| Stripe | Payment processing | Payment information, billing details | No |
| Sentry | Error tracking | Error reports, stack traces (PHI excluded from logs by configuration) | No |

### AI Sub-Processor Training Restriction

All AI sub-processors (Anthropic, OpenAI, Google Vertex AI) are contractually prohibited from:
- Using client data for model training, fine-tuning, or evaluation
- Retaining prompt or response data beyond the duration of the API request
- Sharing client data with third parties

This restriction is enforced through executed BAAs and Data Processing Agreements. Evidence of these restrictions is available upon request at compliance@adjudica.ai.

### Sub-Processor Change Notification

Customers will receive at least **30 days' notice** before a new sub-processor begins processing customer PHI. Customers may object to a new sub-processor within **15 days** of notification. Objections and the resolution process are governed by the executed Data Processing Agreement.

To subscribe to sub-processor change notifications: email privacy@adjudica.ai with subject "Subprocessor Updates Subscribe."

---

## Section 3: Breach Notification Procedure

### Regulatory Basis

This procedure implements HIPAA Breach Notification Rule, 45 CFR §164.400–414, and the Glass Box Incident Response Policy (corporate/INCIDENT_RESPONSE_POLICY.md).

### Breach Definition

A breach of unsecured PHI is presumed unless Glass Box demonstrates a low probability that PHI has been compromised, assessed against the four factors at 45 CFR §164.402. The four-factor risk assessment is conducted by the Privacy Officer upon discovery of any incident involving PHI.

### 60-Day Notification Timeline

```
Day 0: Discovery of potential PHI breach
  |
  +-- Within 24 hours: Glass Box begins internal investigation
  |                    Incident Commander and Privacy Officer engaged
  |                    Affected systems isolated (if breach confirmed)
  |
  +-- Within 48 hours: Sub-processor notifies Glass Box (if breach originated at sub-processor)
  |
  +-- Within 72 hours: Preliminary incident assessment complete
  |                    Customer (attorney firm) notified via email + phone
  |                    Four-factor HIPAA risk assessment initiated
  |
  +-- Within 10 days: Customer (attorney firm) receives written notification per BAA
  |
Day 60: HARD DEADLINE — All required notifications must be complete
  |
  +-- Affected Individuals notified (written notice per 45 CFR §164.404(c))
  |
  +-- HHS Secretary notified:
  |     - 500+ individuals: online breach portal within 60 days
  |     - <500 individuals: annual log submitted within 60 days of calendar year end
  |
  +-- Media notification (if 500+ individuals in a single state):
        Press release to prominent media outlets in affected states
```

### Notification Content (45 CFR §164.404(c))

Individual breach notifications must include all of the following:

1. A brief description of what happened, including the date of the breach and the date of discovery
2. A description of the types of PHI involved (e.g., name, date of birth, diagnosis codes, treatment records)
3. Steps individuals should take to protect themselves from potential harm
4. A brief description of what Glass Box is doing to investigate, mitigate harm, and protect against recurrence
5. Contact information for affected individuals to ask questions: privacy@adjudica.ai or the toll-free number provided in the notification

### Notification Contacts

| Recipient | Method | Timeline | Contact |
|-----------|--------|---------|---------|
| Affected attorney firm (customer) | Email + phone | Within 72 hours of discovery | Account owner on file |
| Affected individuals (PHI subjects) | First-class mail or email (if agreed) | Within 60 days of discovery | Address on file |
| HHS Office for Civil Rights | HHS breach portal (breaches.hhs.gov) | Within 60 days (500+) or annual log (<500) | hhs.gov/ocr |
| Media (if applicable) | Press release | Within 60 days (500+ in one state) | Prominent media in state(s) affected |
| California Attorney General (if applicable) | Electronic submission | "Most expedient time" (CA Civil Code §1798.82) | oag.ca.gov |

### To Report a Suspected Breach

- **Email:** security@adjudica.ai (24/7 monitored)
- **Phone:** [EMERGENCY LINE — populate before publication]
- **For attorney firms:** Contact your designated account representative immediately, then follow up with security@adjudica.ai

---

## Section 4: Minimum Necessary Standard

Glass Box implements the HIPAA Minimum Necessary Standard (45 CFR §164.502(b)) through the following controls:

**Access controls:** Each user role within the product is granted access only to PHI required for their designated function. Paralegals access case-level PHI for assigned matters only. Administrative roles do not have access to PHI content.

**AI processing scope:** AI models receive only the minimum PHI fields required to complete the specific requested task. Documents are not transmitted in their entirety when only specific fields are required.

**Logging:** All PHI access events are logged with user identity, timestamp, record accessed, and action taken. Logs are retained per the audit log retention schedule and are available for attorney firm review.

**De-identification for analytics:** Aggregate analytics and system performance metrics use de-identified data only. PHI is not included in error logs, performance traces, or monitoring dashboards.

**Third-party disclosure:** PHI is not disclosed to parties other than the attorney firm (covered entity), authorized sub-processors under BAA, and individuals in accordance with HIPAA permitted disclosures.

---

## Section 5: Attorney Firm Obligations as Covered Entity

The attorney firm using this product operates as a HIPAA Covered Entity. The firm's obligations under HIPAA are not diminished by the firm's use of this product as a business associate's platform. The following obligations remain with the attorney firm:

**Training:** The firm must ensure all personnel who access PHI through this product have completed HIPAA training appropriate to their role. Glass Box provides product-specific privacy and security guidance; the firm's HIPAA training program is the firm's responsibility.

**Policies and procedures:** The firm must maintain policies and procedures governing its use of this product consistent with 45 CFR §164.530. This includes policies for workforce access, minimum necessary use, and incident reporting.

**Business Associate Agreement:** The firm must execute a BAA with Glass Box Solutions, Inc. before any PHI is processed through the product. Use of the product without an executed BAA is a HIPAA violation attributable to the firm as covered entity. Contact legal@glassboxsolutions.com to execute a BAA.

**Breach reporting to Glass Box:** If the firm becomes aware of a breach or suspected breach involving PHI processed through this product, the firm must notify Glass Box at security@adjudica.ai promptly and in any event within the timelines required by the executed BAA.

**Workforce termination:** When firm personnel who have accessed this product are terminated or change roles, the firm is responsible for timely notification to Glass Box to revoke access. Glass Box provides account management controls for this purpose.

**Right to audit:** Glass Box provides audit log access to attorney firms upon request. The firm's Security Officer or Privacy Officer may request a complete audit log for the firm's matters at compliance@adjudica.ai.

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
