# AdjudiCLAIMS — Examiner Onboarding and Training Specification

**Product:** AdjudiCLAIMS by Glass Box — Augmented Intelligence for CA Workers Compensation Claims Professionals
**Document Type:** Product Design Specification — Training & Education System
**Purpose:** Defines the three-layer training system: pre-use mandatory training, in-product contextual education, and ongoing regulatory education
**Philosophy:** From Black Box to Glass Box — the product IS the training program
**Audience Baseline:** Zero WC knowledge
**Last Updated:** 2026-03-23
**Legal Review Required:** Yes — training content must stay in GREEN zone
**Foundation:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md](foundations/WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md)
**Companion Specs:** [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) | [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md)
**Referenced By:** [ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md) — Phase 5.3

---

## 1. Training Philosophy

### The Product IS the Training Program

AdjudiCLAIMS does not have a training system. AdjudiCLAIMS IS a training system that also manages claims. This is not a semantic distinction. Every screen, every tooltip, every deadline countdown, every workflow step is an act of education. The regulatory context is not supplementary content bolted onto a claims tool — it is the structural foundation of the tool itself.

The insurance industry treats training and software as separate concerns. New examiners attend a week of classroom training, receive a binder of regulations they will never read, and then sit down at a claims management system that tells them what to do without telling them why. AdjudiCLAIMS rejects this model entirely. The product teaches the examiner the regulatory framework by embedding it into every action. The examiner does not learn the regulations and then use the software. The examiner learns the regulations by using the software.

### Glass Box Principle: Transparency Breeds Competence

The Glass Box philosophy holds that when people understand the system they operate in, they make better decisions. A claims examiner who knows that LC 4650 requires first TD payment within 14 days because the legislature determined injured workers should not bear financial hardship during investigation will prioritize that deadline differently than an examiner who simply sees a red countdown timer. The first examiner understands the human consequence. The second is responding to a visual cue. Both may meet the deadline, but only the first will exercise sound judgment when an edge case falls outside the timer's logic.

Transparency is not a feature. It is the architecture.

### Why This Matters

**Examiner turnover is the industry's central problem.** Insurance carriers and third-party administrators (TPAs) experience annual examiner turnover rates between 25% and 40%. A carrier with 100 examiners replaces 25 to 40 of them every year. Each new examiner enters a complex regulatory environment with inadequate training, manages 125 to 175 open claims within weeks, and makes decisions that carry statutory penalties and bad faith exposure. The gap between what a new examiner knows and what the regulations require is the single largest source of DOI audit findings in California workers' compensation.

**Traditional training fails.** Classroom training covers theory. Claims management software covers mechanics. Neither covers the connection between the two — the regulatory reasoning that should inform every decision. Examiners learn to push buttons without understanding why those buttons exist. When a situation does not match the button, they guess. Guessing in a regulated environment produces compliance violations.

**DOI audit exposure is real.** The Department of Insurance conducts market conduct examinations that pull claim files and check them against dozens of regulatory requirements. Examiners who do not understand the regulatory basis for their actions create files that fail audit. Every finding is a potential administrative penalty. A pattern of findings escalates to company-level enforcement. The carrier's compliance problem is really a training problem, and the training problem is really a software design problem.

### Competitive Differentiator

No other claims AI product in the California workers' compensation market educates its users. Competing products automate tasks and surface data. AdjudiCLAIMS automates tasks, surfaces data, and explains the regulatory framework that governs both. For carriers evaluating claims technology, this means AdjudiCLAIMS simultaneously addresses two budget line items — claims management software and examiner training — while reducing a third: DOI audit remediation costs.

### Regulatory Alignment

This training architecture is not merely aspirational. It is legally grounded:

> **10 CCR 2695.6:** "Every insurer shall adopt and communicate to all its claims agents and claims adjusters minimum training standards..."

The regulation requires that claims personnel be trained. AdjudiCLAIMS does not merely help carriers comply with this requirement — it embeds compliance with this requirement into the product itself. An examiner using AdjudiCLAIMS is being trained continuously, with documentation of that training available for DOI examination at any time.

---

## 2. Three-Layer Training Architecture

The training system operates across three layers that correspond to three phases of the examiner's relationship with the product: before access (Layer 1), during use (Layer 2), and over the course of their career (Layer 3). No layer is optional. No layer replaces another. They are cumulative.

---

### Layer 1: Pre-Use Mandatory Training (Gate)

Before an examiner can access any AdjudiCLAIMS feature, they must complete four mandatory training modules. The product WILL NOT grant access until all modules are completed and all assessments are passed. There is no bypass, no supervisor override, no grace period. This is a hard gate.

**Rationale:** An untrained examiner making decisions in a regulated environment is a compliance liability from their first click. The pre-use gate ensures that every examiner who touches a claim through AdjudiCLAIMS has a baseline understanding of the regulatory framework, the UPL boundary, and the product itself. This protects the injured worker, the carrier, and Glass Box.

---

#### Module 1: California Workers' Compensation Framework (30 min)

**Learning Objectives:**
- Explain the no-fault nature of California workers' compensation
- Identify the parties involved in a workers' compensation claim
- Describe the claim lifecycle from injury report through resolution
- Define the key terms that appear throughout the product

**Content:**

1. **What is workers' compensation?** California's workers' compensation system is a no-fault insurance system. When a worker is injured on the job, they are entitled to benefits regardless of who was at fault for the injury. The employer carries insurance (or is self-insured) to pay those benefits. The trade-off: the worker gets guaranteed benefits without having to prove fault; the employer gets protection from personal injury lawsuits. This system is governed primarily by the California Labor Code (Divisions 4 and 4.5) and administered by the Division of Workers' Compensation (DWC).

2. **The parties.** Every claim involves multiple parties with different roles and interests:
   - **Injured worker (applicant/claimant):** The person who was hurt. Entitled to benefits under the Labor Code.
   - **Employer:** Legally obligated to carry workers' compensation insurance and to provide a DWC-1 Claim Form within one working day of learning about the injury (LC 5401).
   - **Insurer or TPA:** The insurance carrier or third-party administrator that manages the claim. YOU work for the insurer or TPA. Your job is to administer the claim fairly and in compliance with all applicable laws.
   - **Defense counsel:** The attorney who represents the insurer's interests when a claim is disputed or litigated. Defense counsel provides legal advice to the examiner. The examiner does not practice law.
   - **Applicant attorney:** The attorney who represents the injured worker. Not all injured workers have attorneys, but represented claims follow different procedures (particularly for medical-legal evaluations under LC 4061-4062).
   - **WCAB (Workers' Compensation Appeals Board):** The judicial body that resolves disputed claims. WCAB judges hear cases and issue awards.
   - **DWC (Division of Workers' Compensation):** The state agency that administers the workers' compensation system. The DWC writes the regulations (CCR Title 8) that govern claim administration.
   - **DOI (Department of Insurance):** The state agency that regulates insurance companies. The DOI audits carriers for compliance with the Insurance Code and the Fair Claims Settlement Practices Regulations (10 CCR 2695).

3. **Claim lifecycle overview.** Injury occurs, employer provides DWC-1 Claim Form, employee returns the form, form reaches the insurer, examiner receives the claim, acknowledgment sent within 15 days, investigation begins immediately, TD payments begin within 14 days if disability exists, coverage determination (accept or deny) within 40 days, medical treatment authorized through utilization review, medical-legal evaluations if disputes arise, permanent disability evaluated if applicable, claim resolves through settlement (C&R or Stips) or WCAB award.

4. **Key terms glossary.** This section defines every term that appears as Tier 1 dismissable content in the product. Terms are organized by category:
   - **Benefits terms:** TD (Temporary Disability), PD (Permanent Disability), SJDB (Supplemental Job Displacement Benefit), AWE (Average Weekly Earnings), WPI (Whole Person Impairment), TTD (Temporary Total Disability), TPD (Temporary Partial Disability)
   - **Medical terms:** PTP (Primary Treating Physician), QME (Qualified Medical Examiner), AME (Agreed Medical Examiner), MPN (Medical Provider Network), MTUS (Medical Treatment Utilization Schedule), ACOEM (American College of Occupational and Environmental Medicine), UR (Utilization Review), IMR (Independent Medical Review)
   - **Legal process terms:** DWC-1 (Claim Form), C&R (Compromise and Release), Stips (Stipulations with Request for Award), WCAB (Workers' Compensation Appeals Board), EAMS (Electronic Adjudication Management System), MSC (Mandatory Settlement Conference), Trial
   - **Regulatory body terms:** DOI (Department of Insurance), DWC (Division of Workers' Compensation), DIR (Department of Industrial Relations), CHSWC (Commission on Health and Safety and Workers' Compensation)
   - **Claim lifecycle terms:** AOE/COE (Arising Out of Employment / Course of Employment), Three-Point Contact, P&S (Permanent and Stationary), MMI (Maximum Medical Improvement), Subrogation, Lien, SIU (Special Investigations Unit)

**Assessment:** 15 multiple-choice questions covering the no-fault system, party identification, lifecycle stages, and key terms. Passing score: 80% (12/15). Failed attempts may be retaken immediately with randomized question sets.

---

#### Module 2: Your Legal Obligations as a Claims Examiner (30 min)

**Learning Objectives:**
- Identify the 16 prohibited practices under Insurance Code 790.03(h) and explain each in plain English
- State the four critical timeline requirements (15-day, 40-day, 14-day, 30-day)
- Explain the duty to investigate in good faith under CCR 10109
- Describe the consequences of non-compliance: DOI audit findings, administrative penalties, bad faith exposure

**Content:**

1. **Insurance Code 790.03(h) — The 16 Prohibited Practices.** This is the core statute governing your conduct as a claims examiner. Each of the 16 prohibitions is presented with a plain-English explanation and a concrete example of violation. Content is drawn from Part 1 of [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md), entries 1.1 through 1.16. The training module presents a condensed version; the full education content is available in-product.

2. **CCR 2695 — Timeline Requirements.** The DOI regulations define four critical deadlines that every examiner must know:
   - **15 calendar days** to acknowledge receipt of any claim communication (10 CCR 2695.5(b))
   - **40 calendar days** to accept or deny a claim after receiving proof of claim (10 CCR 2695.7(b))
   - **14 calendar days** to issue first temporary disability payment after employer knowledge of injury (LC 4650)
   - **30 calendar days** between written status updates to the claimant if investigation or delay continues (10 CCR 2695.7(c))

3. **CCR 10109 — Duty to Investigate in Good Faith.** Every claim must be investigated thoroughly before a coverage determination is made. You cannot deny a claim based on incomplete information. You cannot accept a claim without verifying the facts. Investigation is not optional — it is a statutory duty. "Good faith" means you are genuinely seeking the truth, not looking for reasons to deny.

4. **What happens when you get it wrong.** DOI market conduct examinations pull sample claim files and check each one against regulatory requirements. Each violation is a finding. Each finding can result in an administrative penalty under CCR 10108. Multiple findings escalate to corrective action plans, increased audit frequency, and potential enforcement proceedings under Insurance Code 790.06. Beyond DOI penalties, systematic violations expose the insurer to bad faith civil liability with compensatory and punitive damages.

**Assessment:** 10 scenario-based questions. Each scenario presents a claim handling situation and asks the examiner to identify the regulatory violation, the applicable statute or regulation, and the potential consequence. Passing score: 80% (8/10). Failed attempts may be retaken after a mandatory 15-minute review of the relevant material.

---

#### Module 3: The UPL Boundary — What You Cannot Do (20 min)

**Learning Objectives:**
- Define Unauthorized Practice of Law (UPL) under B&P Code 6125
- Explain why UPL matters to claims examiners and to AI-assisted claims management
- Classify queries and product outputs as GREEN, YELLOW, or RED zone
- Identify the 11 mandatory triggers for consulting defense counsel

**Content:**

1. **What is UPL?** Under California Business and Professions Code Section 6125, only licensed attorneys may practice law in California. Practicing law includes giving legal advice, preparing legal documents, and representing others in legal proceedings. You are a claims examiner, not an attorney. AdjudiCLAIMS is a claims information tool, not a legal advisor.

2. **Why it matters to you.** When a claims examiner interprets a statute and tells an injured worker what they are legally entitled to, that is legal advice. When an AI tool tells an examiner what the law requires them to do in a specific case, that is legal advice. Neither the examiner nor the AI is licensed to provide it. The consequences include criminal prosecution of UPL (misdemeanor under B&P 6126), malpractice exposure for the carrier, and regulatory enforcement against Glass Box. AdjudiCLAIMS is designed to make this boundary clear and impossible to cross.

3. **The Green/Yellow/Red Zone System.** Every product interaction is classified:
   - **GREEN zone:** Factual information, regulatory text, deadline calculations, document summaries, process explanations. "LC 4650 requires first TD payment within 14 days of employer knowledge." This is information. The product provides it freely.
   - **YELLOW zone:** Information with legal implications that requires the examiner's professional judgment. "The medical report identifies three body parts. The claim form lists two. You should discuss this discrepancy with your supervisor or defense counsel." The product flags the issue but does not resolve it.
   - **RED zone:** Legal analysis, legal conclusions, case strategy, coverage opinions, settlement recommendations. "Based on the medical evidence, the claim should be denied." The product NEVER says this. These queries are blocked and redirected to defense counsel.

   The training module presents 15 example queries for each zone (45 total) and asks the examiner to classify them.

4. **The 11 mandatory triggers for consulting defense counsel.** Specific situations where the examiner must stop and refer to a licensed attorney. These include: disputed compensability requiring legal analysis, coverage questions involving policy interpretation, potential fraud requiring legal strategy, subrogation decisions, settlement authority requests, lien disputes, penalty exposure assessment, WCAB hearing preparation, applicant attorney correspondence requiring legal response, cumulative trauma legal exposure analysis, and death benefit calculations with disputed dependents.

**Assessment:** 20 query classification questions. Each presents a question or product output and asks the examiner to classify it as GREEN, YELLOW, or RED. Passing score: 90% (18/20). This is the highest passing threshold because UPL compliance is the most critical boundary in the product. Failed attempts require a mandatory review session and supervisor notification before retaking.

---

#### Module 4: Using AdjudiCLAIMS (20 min)

**Learning Objectives:**
- Navigate the product dashboard, claim view, document upload, chat, calculator, and compliance dashboard
- Read and interpret AI outputs including citations, zone badges, and disclaimers
- Dismiss Tier 1 education content and manage education preferences
- Generate counsel referral summaries
- Report errors in product content

**Content:**

1. **Product walkthrough.** Interactive guided tour of each product area:
   - **Dashboard:** Open claims, deadline overview, compliance score, alerts
   - **Claim view:** Claim details, documents, medical records, correspondence, activity log, regulatory deadline panel
   - **Document upload:** How to upload, what happens during classification, how to review extracted data
   - **Claims Chat:** How to ask questions, how to read cited responses, zone badges on every response, what to do with YELLOW zone responses
   - **Benefit Calculator:** TD/PD calculation with regulatory citations, wage data entry, rate tables
   - **Compliance Dashboard:** Deadline tracking, audit readiness score, pending actions across all claims

2. **How to read AI outputs.** Every AdjudiCLAIMS output includes:
   - **Citation:** The statute, regulation, or document source for every factual statement
   - **Zone badge:** GREEN, YELLOW, or RED classification visible on every interaction
   - **Disclaimer:** Context-appropriate disclaimer on YELLOW zone responses
   - **Confidence indicator:** When the AI's output is based on incomplete information, it says so

3. **How to dismiss Tier 1 content.** When a tooltip, definition, or process overview appears, the examiner clicks "Got it" to dismiss it permanently for that term. Dismissals are stored in the examiner's education profile. To re-enable dismissed content, go to Settings and select "Reset dismissed terms" (all or by category). The examiner can also switch education display modes from settings.

4. **How to generate counsel referral summaries.** When the examiner identifies a situation requiring defense counsel input, the product generates a structured summary: claim facts, regulatory context, specific question for counsel, supporting documents. This summary can be sent directly or exported.

5. **How to report errors.** Every education display and AI output includes a "Report an error" link. Error reports are routed to the content team for review. Reports include the specific content displayed, the examiner's description of the error, and the claim context (anonymized).

**Assessment:** Interactive product walkthrough with 8 checkpoints. At each checkpoint, the examiner must complete a specific task (e.g., "find the 40-day deadline for claim #12345," "dismiss the AWE definition," "identify the zone badge on this chat response"). All 8 checkpoints must be completed successfully. No partial credit.

---

#### Gating Requirements

| Requirement | Standard |
|-------------|----------|
| Module 1 assessment | 80% (12/15 questions) |
| Module 2 assessment | 80% (8/10 scenarios) |
| Module 3 assessment | 90% (18/20 classifications) |
| Module 4 assessment | 100% (8/8 checkpoints) |
| All modules completed | Mandatory — no module may be skipped |
| Product access before completion | BLOCKED — no exceptions |
| Training completion logged | Yes — date, time, scores, attempts recorded in audit trail |
| Annual recertification | Required — all 4 modules retaken annually with updated content |
| Supervisor visibility | Yes — supervisor dashboard shows team training completion status |

---

### Layer 2: In-Product Contextual Education (Always Active)

This is the heart of the Glass Box education system. Education content is not a help system that the examiner accesses when confused. It is the product surface itself. Every decision point presents its regulatory context as a structural element of the interface.

---

#### 2.1 Tier 1: Dismissable Basics

**What:** Term definitions, acronym expansions, process overviews. The foundational vocabulary and procedural knowledge that a new examiner needs to understand the product's regulatory content.

**Where they appear:** Inline tooltips on first occurrence of each term within a product feature. Expandable info panels in sidebars and decision-point screens. Contextual callout boxes above complex form fields.

**Behavior:**
- Shown by default for all new users (users who have not dismissed them)
- User clicks "Got it" to dismiss permanently for that specific term
- Dismissals stored in user education profile, keyed to term ID
- Dismissed terms show a subtle underline (no tooltip) so the examiner can still hover for a quick reminder without re-enabling the full explanation
- Can be re-enabled individually or in bulk from Settings > Education Preferences
- Supervisor can force-reset dismissals for a team member

**Content source:** Glossary database maintained by the product team, cross-referenced with KB regulatory sections. Every Tier 1 entry maps to one or more Tier 2 entries so the examiner can always go deeper.

**Example UX:** When "AWE" first appears in the Benefit Calculator, a tooltip expands:

> **AWE (Average Weekly Earnings)** — Your worker's average weekly pay before injury. This is the basis for calculating temporary disability benefits. AWE is determined from the employer's wage records and may include overtime, bonuses, and concurrent employment. [Got it]

**Term categories and approximate counts:**
- Benefits terms: ~15 terms (TD, PD, TTD, TPD, SJDB, AWE, WPI, DEU, LC 4453 rate, etc.)
- Medical terms: ~20 terms (PTP, QME, AME, MPN, MTUS, ACOEM, UR, IMR, PR-2, PR-4, RFA, etc.)
- Legal process terms: ~15 terms (DWC-1, C&R, Stips, WCAB, EAMS, MSC, Trial, Award, F&A, etc.)
- Regulatory body terms: ~10 terms (DOI, DWC, DIR, CHSWC, AD, Commissioner, etc.)
- Claim lifecycle terms: ~15 terms (AOE/COE, P&S, MMI, Subrogation, Lien, SIU, Delay Letter, etc.)
- Document and form terms: ~10 terms (DWC-1, Employer's Report, PR-2, RFA, BRE, etc.)
- **Total: ~85 terms**

---

#### 2.2 Tier 2: Always-Present Core Explanations

**What:** Statutory authority, regulatory reasoning, consequences of non-compliance. The "why" behind every product feature and every examiner action.

**Where they appear:** Persistent context panels alongside every decision-point feature. Integrated into dashboard elements, workflow steps, calculator outputs, and compliance alerts. Not in a separate help window — embedded in the feature itself.

**Behavior:**
- NEVER dismissable. Always visible. This is a hard design constraint.
- May be collapsed to a single-line citation (e.g., "LC 4650 | 14-day payment deadline") but expandable with one click to the full explanation
- Collapsed state is the default for the standard experience; expanded state is the default for new examiner experience (first 30 days)
- The panel structure is: Authority, Standard, Consequence — matching the format in the education spec

**Content source:** [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) — all 57 education entries mapped to specific product features. Each entry contains Authority, Standard, Consequence, Common Mistake, and AdjudiCLAIMS Helps You By sections.

**Example UX:** On the Regulatory Deadline Dashboard, next to the 14-day TD payment deadline:

> **LC 4650 | First TD Payment — 14 Days from Employer Knowledge**
>
> The legislature mandated this timeline to prevent injured workers from bearing financial hardship during claim investigation. First payment or denial of TD is due within 14 calendar days of the date the employer had knowledge of the injury. Missing this deadline triggers a mandatory 10% self-imposed penalty under LC 4650(c) and may result in DOI audit findings under CCR 10108. The payment obligation exists even if your investigation is not complete — LC 4650(d) requires payment during the investigation period if the employee is losing wages.

**Design principle:** The explanation IS the feature. The deadline countdown and the regulatory context are not separate — they are one integrated display. Removing the explanation would not create a "cleaner" interface. It would create a less functional one. The examiner who understands why a deadline exists manages it differently than the examiner who simply watches a timer.

**Feature-to-education mapping:** Each product feature maps to specific education spec entries:

| Product Feature | Education Spec Entries |
|----------------|----------------------|
| Regulatory Deadline Dashboard | 2695.5(b), 2695.7(b), 2695.7(c), LC 4650, LC 4650(b), LC 4650(c), LC 4650(d) |
| Claim Intake Screen | 1.2, 1.3, 2695.5(b), 2695.5(e), CCR 10101, CCR 10103 |
| Coverage Determination | 1.4, 1.5, 2695.7(a), 2695.7(b), 2695.7(h), CCR 10109 |
| Benefit Calculator | LC 4650, LC 4650(b), LC 4653, LC 4654, LC 4656 |
| Document Classification | 1.1, 2695.3, CCR 10101 |
| Claims Chat | 1.14, 2695.4, 2695.7(h) (zone-dependent) |
| UR Authorization | LC 4600, LC 4600.3, LC 4610, CCR 9792.6-9792.12 |
| Compliance Dashboard | CCR 10105, CCR 10106, CCR 10107, CCR 10108 |
| Denial Issuance | 1.4, 1.14, 2695.7(h), CCR 10109 |
| Settlement/Reserve Review | 1.6, 1.7, 1.8, 1.13, CCR 10104 |

---

#### 2.3 Decision Workflow Integration

**What:** Step-by-step guided workflows activated at major decision points. Each workflow walks the examiner through every required step with regulatory citations.

**Where:** Initiated by the examiner from any relevant claim screen, or triggered by system events (e.g., 40-day deadline approaching triggers a Coverage Determination workflow suggestion). Available from a persistent "Workflows" menu accessible from any claim view.

**Behavior:**
- Examiner can follow the workflow step-by-step or skip ahead to a specific step
- Each step shows the regulatory authority in the Tier 2 panel
- Completed steps are marked and logged in the claim's audit trail
- Workflow progress is saved; examiners can pause and resume
- Skipping steps generates a log entry noting which steps were bypassed (for audit purposes)
- Workflow completion generates a summary document suitable for file documentation

**Content source:** [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md) — 20 workflows covering every major examiner action, from new claim intake to penalty self-assessment.

**Example UX:** When the examiner clicks "Issue Denial" on a claim, the system presents:

> **Guided Workflow Available: Denial Issuance (Workflow 9)**
>
> This workflow guides you through the required steps under Ins. Code 790.03(h)(4), (h)(14), and 10 CCR 2695.7(h). It covers: verifying investigation completeness, documenting denial basis, drafting the denial letter with required elements, identifying appeal rights to include, and generating the audit-ready file record.
>
> [Follow Workflow] [Proceed Without Workflow]

If the examiner selects "Proceed Without Workflow," the action is logged but not blocked. The product respects examiner autonomy while documenting the choice.

---

### Layer 3: Ongoing Regulatory Education (Continuous)

Training does not end after onboarding. The regulatory landscape changes. Examiners develop habits — some good, some problematic. The product maintains a continuous education posture throughout the examiner's career.

---

#### 3.1 Regulatory Change Notifications

When a statute or regulation referenced in the education content is amended by the California Legislature or a regulatory agency, all affected users receive an in-product notification.

**Notification content:**
- What changed (old text vs. new text, summarized in plain English)
- Why it matters to your claims handling
- What to do differently starting on the effective date
- Which of your open claims may be affected

**Behavior:**
- Notifications appear as a persistent banner at the top of the dashboard until acknowledged
- Examiner must click "I understand this change" to acknowledge
- Acknowledgment logged in audit trail with timestamp
- If the change affects a feature the examiner is currently using, the Tier 2 panel updates immediately and highlights the change with a "Recently Updated" badge for 90 days
- Change history maintained in the KB; examiners can browse past changes

---

#### 3.2 Monthly Compliance Review Prompts

On the first business day of each month, the product prompts the examiner to review their compliance dashboard across all open claims.

**Prompt content:**
- Summary of missed deadlines in the prior month (count and claim identifiers)
- Approaching deadlines for the current month
- Claims without activity in the past 30 days (potential 10 CCR 2695.7(c) violations)
- Educational context for each category: the applicable regulation, why the deadline exists, and the consequence of missing it

**Example prompt:**
> **Monthly Compliance Review — March 2026**
>
> You have 3 claims approaching the 40-day coverage determination deadline. Under 10 CCR 2695.7(b), you must accept or deny within 40 calendar days of receiving proof of claim. Failure to meet this deadline is a DOI audit finding under CCR 10108 and may trigger the presumption of compensability under LC 5402(b) if the 90-day window also passes.
>
> You have 1 claim with no logged activity in 34 days. Under 10 CCR 2695.7(c), you must provide written status updates to the claimant every 30 days during any ongoing delay. [Review Claims]

**Behavior:**
- Prompt appears as a modal on first login of the month
- Cannot be permanently dismissed — appears monthly
- Examiner can defer to later in the day but it reappears on next login
- Completion of the review (clicking through each flagged claim) is logged

---

#### 3.3 Quarterly Training Refreshers

Every quarter, the product delivers a brief refresher module (10-15 minutes) covering:

1. **Common mistakes from the quarter.** Anonymized patterns identified from UPL compliance monitoring, missed-deadline trends, and workflow bypass rates across the user base. Presented as scenarios: "An examiner did X. Here is why that is a problem under regulation Y."

2. **Regulatory changes from the quarter.** Summary of any legislative or regulatory changes that affect claims handling. If no changes occurred, a brief reminder of the most commonly misunderstood regulations.

3. **New product features.** When new features are deployed, the quarterly refresher explains the regulatory context for the new feature and how to use it.

**Behavior:**
- Refresher available on the first day of each quarter (January, April, July, October)
- Completion is tracked in the examiner's education profile
- Supervisor dashboard shows team completion rates
- Not gating — the examiner can use the product without completing the refresher, but non-completion is visible to supervisors and flagged after 14 days

---

#### 3.4 Audit-Triggered Training

When a DOI audit identifies compliance findings against the carrier or TPA, the product generates targeted training modules addressing the specific regulations violated.

**Process:**
1. Carrier compliance officer enters audit findings into AdjudiCLAIMS (finding type, regulation cited, claim sample affected)
2. System generates a targeted training module from existing education content for the cited regulation
3. All examiners in the affected office or team are assigned the module
4. Examiner must complete the module before resuming work on the affected claim type
5. Completion is logged and available for DOI remediation documentation

**Example:** DOI audit finds that 15% of sampled files missed the 15-day acknowledgment deadline. The system generates a targeted module covering 10 CCR 2695.5(b), the acknowledgment workflow (Workflow 1, Steps 3-4), and the Dashboard feature that tracks acknowledgment deadlines. Examiners must complete the module and pass a 5-question assessment on the regulation.

---

## 3. Progressive Disclosure UX Specification

---

### 3.1 User Education Profile

Each examiner has an education profile that tracks their training state across all three layers.

**Profile data:**
- **Training module completion:** Module ID, completion date, score, attempt count (Layer 1)
- **Tier 1 dismissals:** Term ID, dismissal date, re-enable date if applicable (Layer 2)
- **Workflow usage:** Workflow ID, claim ID, steps completed, steps skipped, completion date (Layer 2)
- **Refresher completion:** Quarter, completion date (Layer 3)
- **Audit-triggered training:** Finding ID, module ID, completion date, score (Layer 3)
- **Education mode:** New / Standard / Minimal (see section 3.4)
- **Time-in-product:** Cumulative hours, used for internal analytics only
- **Tier 1 dismissal velocity:** Rate at which the examiner is learning new terms (internal metric for supervisor insight)

**Privacy:** Education profiles are visible to the examiner and their supervisor. Carrier administrators see aggregate data only. Glass Box sees anonymized aggregate data for product improvement. No education profile data is shared outside the carrier's organization.

---

### 3.2 New Examiner Experience (First 30 Days)

For the first 30 calendar days after completing pre-use training (or until the supervisor transitions the examiner to standard mode, whichever comes first):

**Display behavior:**
- All Tier 1 content expanded by default (tooltips auto-open on first view of each screen)
- All Tier 2 panels expanded by default (full Authority / Standard / Consequence visible without clicking)
- Workflow suggestions proactively offered at every decision point (not just available in the menu)
- "Learning Mode" badge visible in the product header — a visual reminder to the examiner and anyone reviewing their screen that this user is in their onboarding period

**Supervisor oversight:**
- Supervisor receives a weekly email summary of the new examiner's education progress: terms dismissed, workflows completed, compliance score, assessment results
- Supervisor can extend the new examiner period beyond 30 days if the examiner is struggling
- Supervisor can end the new examiner period early if the examiner demonstrates rapid competence
- Supervisor can assign specific workflows or education modules based on the examiner's claim assignments

**Transition to standard mode:**
- Automatic after 30 calendar days unless supervisor extends
- Supervisor can trigger early transition from the supervisor dashboard
- Transition is logged in the education profile
- Upon transition, Tier 1 content collapses to tooltip-only (still visible on hover until dismissed), Tier 2 content collapses to citation-only (one click to expand), and workflow suggestions shift from proactive to on-demand

---

### 3.3 Standard Experience

The default mode for examiners who have completed the new examiner period.

**Display behavior:**
- Tier 1 content shown only for terms the examiner has NOT yet dismissed. Displayed as hover tooltips (not auto-expanded).
- Tier 2 content displayed as collapsed citation bars (e.g., "LC 4650 | 14-day payment deadline"). One click expands to full explanation. Always accessible — never hidden.
- Workflow suggestions available in the Workflows menu and triggered by system events (e.g., approaching deadlines), but not proactively offered on every action.
- No "Learning Mode" badge.
- Full access to all features without additional guidance overlays.

---

### 3.4 Settings and Preferences

Accessible from the examiner's profile under Settings > Education Preferences.

| Setting | Options | Default |
|---------|---------|---------|
| **Reset dismissed terms** | Reset all / Reset by category | N/A (action button) |
| **Education display mode** | New / Standard / Minimal | Standard (after 30-day period) |
| **Tier 2 default state** | Expanded / Collapsed | Collapsed (Standard), Expanded (New) |
| **Workflow suggestions** | Proactive / On-demand / Off | On-demand (Standard) |
| **Monthly compliance prompt** | Beginning of month / Weekly | Beginning of month |

**Minimal mode:** For experienced examiners who want a streamlined interface. Tier 2 content is reduced to statutory citation only (e.g., "LC 4650") with no inline explanation — but full explanation is still accessible via click. Tier 1 content is fully hidden (all terms treated as dismissed). Minimal mode is available only after 6 months of product use AND supervisor approval. It can be revoked by the supervisor at any time.

**Supervisor override:** Supervisors can force any team member into New examiner mode regardless of tenure. This is used for performance issues, claim type transitions (e.g., an examiner moving from medical-only claims to indemnity claims), or remedial training after compliance findings.

---

## 4. Training Content Management

---

### 4.1 Content Sources

| Source | Type | Maintenance | Update Trigger |
|--------|------|-------------|----------------|
| KB regulatory sections | Statutory and regulatory text | Auto-updated when KB is updated | Legislative session, regulatory amendments |
| [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) | 57 education entries (Authority, Standard, Consequence, Common Mistake) | Manually maintained by product team | Regulatory change, product feature change, user feedback |
| [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md) | 20 step-by-step decision workflows | Manually maintained by product team | Regulatory change, product feature change, workflow effectiveness data |
| Glossary database | ~85 term definitions for Tier 1 content | Manually maintained by product team with KB cross-references | New terms identified, user feedback, product feature additions |
| Pre-use training modules | 4 modules with assessments | Updated quarterly or on regulatory change | Regulatory change, product UX change, assessment effectiveness data |

---

### 4.2 Content Update Process

When the California Legislature amends a statute or the DWC/DOI publishes new or amended regulations:

1. **KB team ingests updated regulatory text.** The new or amended text is added to the Knowledge Base with effective date, prior version archived.

2. **Education spec entries flagged for review.** Any education entry in [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) that references the affected section is automatically flagged. The product team receives a notification listing all affected entries.

3. **Product team updates education content.** Authority citations are updated. Standard and Consequence sections are revised if the regulatory change affects the practical requirement or the penalty framework. Common Mistake and AdjudiCLAIMS Helps You By sections are updated if the product behavior changes.

4. **Workflow steps reviewed.** Any workflow in [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md) that references the affected section is reviewed. Steps, timelines, and authority citations are updated as needed.

5. **Legal counsel reviews changes.** All updated education content and workflow steps are reviewed by legal counsel to confirm they remain in the GREEN zone. No updated content is deployed without legal sign-off.

6. **Updated content deployed.** Content updates are deployed to production. Affected Tier 2 panels display a "Recently Updated" badge.

7. **Regulatory change notification sent.** All users who interact with the affected product features receive an in-product notification per Layer 3, Section 3.1.

**Target turnaround:** Updated content deployed within 30 days of the effective date of the regulatory change. Emergency changes (e.g., court order invalidating a regulation) are handled on an expedited basis.

---

### 4.3 Quality Assurance

**Pre-deployment review:**
- All education content reviewed by legal counsel before deployment (GREEN zone compliance confirmed)
- All assessment questions reviewed for accuracy and fairness
- New content tested with a sample of examiners (when possible) for clarity

**Ongoing quality:**
- Quarterly sampling of 100 random in-product education displays for accuracy against current statutory text
- User feedback mechanism on every education display: "Is this explanation helpful?" (thumbs up/down) and "Report an error in this explanation" (free-text report)
- Error reports triaged within 48 hours; confirmed errors corrected within 7 days
- Quarterly review of user feedback trends to identify consistently confusing or unhelpful content

**Assessment quality:**
- Assessment questions reviewed annually for continued relevance
- Question-level pass rate analysis: questions with <50% pass rates are reviewed for clarity (the question may be poorly written, not just difficult)
- Questions with >98% pass rates are reviewed for usefulness (the question may be too easy to provide meaningful signal)

---

## 5. Compliance with 10 CCR 2695.6

This section explicitly addresses the California regulation requiring training of claims personnel.

> **10 CCR 2695.6:** "Every insurer shall adopt and communicate to all its claims agents and claims adjusters minimum training standards for those claims agents and claims adjusters engaged in the handling of claims. Such training standards shall include, but not be limited to, the requirements of the Fair Claims Settlement Practices Regulations."

### How AdjudiCLAIMS Satisfies This Requirement

| Regulatory Requirement | AdjudiCLAIMS Implementation |
|----------------------|----------------------------|
| "Adopt minimum training standards" | Four mandatory pre-use training modules with defined learning objectives, content, and assessments (Layer 1) |
| "Communicate to all claims agents" | Training gate prevents product access until completed; completion documented per-user (Layer 1) |
| "Training standards for those engaged in handling of claims" | Training is specific to California workers' compensation claims handling, not generic insurance training (all layers) |
| "Include the requirements of the Fair Claims Settlement Practices Regulations" | Module 2 covers 10 CCR 2695 timeline requirements; all 57 education spec entries cover Fair Claims Settlement Practices in detail; Tier 2 panels present regulatory requirements at every decision point (Layers 1 and 2) |
| Ongoing training obligation (implied) | Quarterly refreshers, monthly compliance prompts, regulatory change notifications, audit-triggered remedial training (Layer 3) |

### Audit Documentation

AdjudiCLAIMS maintains a complete training audit trail for every examiner:

- Date and time of pre-use training completion, per module
- Assessment scores and attempt counts
- Annual recertification dates
- Quarterly refresher completion dates
- Audit-triggered training completion dates and scores
- Tier 1 dismissal history (demonstrates progressive learning)
- Workflow usage logs (demonstrates guided decision-making)

This audit trail is exportable in a format suitable for DOI examination. When a DOI auditor asks "how does your company train its claims personnel?", the carrier can produce per-examiner training records documenting every aspect of their regulatory education, generated automatically by the product.

---

## 6. Training Metrics and Reporting

---

### 6.1 Examiner-Level Metrics

| Metric | Description | Purpose |
|--------|-------------|---------|
| **Module completion** | Pre-use training modules completed, scores, dates | Verify baseline training |
| **Assessment scores** | Per-module and per-question scores | Identify knowledge gaps |
| **Tier 1 dismissal rate** | Terms dismissed per week | Measure learning velocity |
| **Tier 1 dismissal coverage** | Percentage of total glossary terms dismissed | Measure cumulative learning |
| **Workflow usage rate** | Percentage of decision points where guided workflow was followed | Measure reliance on structured guidance |
| **Workflow skip rate** | Steps skipped within followed workflows | Identify which steps examiners find unnecessary or confusing |
| **Compliance dashboard engagement** | Frequency and duration of compliance dashboard views | Measure proactive compliance monitoring |
| **Monthly prompt response time** | Time between monthly compliance prompt and review completion | Measure compliance priority |
| **Error report rate** | Education content errors reported per month | Measure engagement with content quality |
| **Refresher completion** | Quarterly refresher modules completed on time | Measure ongoing training participation |

---

### 6.2 Supervisor Dashboard

The supervisor dashboard provides team-level visibility into training and education engagement.

**Dashboard panels:**

- **Team Training Status:** Table showing each examiner's pre-use training completion, last recertification date, current education mode, and quarterly refresher status. Color-coded: green (current), yellow (approaching recertification), red (overdue).
- **New Examiner Progress:** For examiners in the 30-day onboarding period: daily Tier 1 dismissal count, workflow usage rate, compliance score trend, and recommendation for early transition or extended onboarding.
- **Compliance Score Trends:** Team-average compliance scores over time, broken down by deadline type (15-day, 40-day, 14-day, 30-day). Enables supervisors to identify systemic training gaps.
- **Training Gap Identification:** Modules and assessment questions with the lowest team scores. If 60% of the team struggles with Module 3 Question 14, the supervisor knows to address UPL boundary understanding.
- **Workflow Adoption:** Percentage of team members using guided workflows at each decision point. Low adoption on the Denial Issuance workflow, for example, may indicate that examiners are issuing denials without following the required steps.

---

### 6.3 Carrier/TPA-Level Reporting

For carrier compliance officers and executive leadership.

| Report | Content | Frequency |
|--------|---------|-----------|
| **Training completion summary** | Aggregate completion rates by office, team, and module | Monthly |
| **Training-compliance correlation** | Statistical correlation between training engagement metrics and compliance scores (deadline adherence, audit findings) | Quarterly |
| **DOI audit readiness score** | Composite score based on training completion, compliance dashboard engagement, and deadline adherence across all examiners | Monthly |
| **Training ROI** | Deadline adherence rates before and after AdjudiCLAIMS deployment; comparison of DOI audit findings pre- and post-deployment | Quarterly |
| **UPL compliance** | RED zone block rate, YELLOW zone escalation rate, counsel referral generation rate | Monthly |
| **Examiner retention correlation** | Correlation between training engagement and examiner tenure (hypothesis: better-trained examiners stay longer) | Annually |

---

## 7. Implementation Phases

| Phase | Content | Dependencies | Success Criteria |
|-------|---------|-------------|-----------------|
| **MVP** | Pre-use training (4 modules with assessments), Tier 2 core explanations on all decision-point screens, 5 critical workflows (Workflow 1: New Claim Intake, Workflow 3: Coverage Determination, Workflow 4: TD Benefit Initiation, Workflow 5: UR Treatment Authorization, Workflow 9: Denial Issuance) | Education spec complete, workflow spec complete, KB regulatory content ingested, product feature screens built | All 4 modules passing legal review; Tier 2 panels rendering on all decision-point screens; 5 workflows functional end-to-end; training gate blocking access for untrained users |
| **Post-MVP** | Full Tier 1 glossary (~85 terms with dismissal tracking), all 20 workflows, monthly compliance review prompts, education profile with full dismissal/usage tracking | User profile system, education tracking database, glossary database populated | All 85 terms rendering correctly; dismissal state persisting across sessions; all 20 workflows functional; monthly prompts generating on schedule |
| **Future** | Quarterly refreshers, audit-triggered training, regulatory change notification pipeline, supervisor dashboard, carrier-level reporting, minimal display mode, annual recertification flow | KB auto-update pipeline, compliance monitoring system, supervisor RBAC, reporting infrastructure | Refresher modules generating quarterly; audit findings triggering targeted training within 48 hours; regulatory changes reflected in education content within 30 days of effective date |

---

## 8. UPL Compliance in Training Content

All training and education content must remain in the GREEN zone. This is a hard constraint.

**GREEN (permitted):**
- "LC 4650 requires first TD payment within 14 days of employer knowledge of injury."
- "Under 10 CCR 2695.7(b), the claim must be accepted or denied within 40 calendar days."
- "The 16 prohibited practices under Insurance Code 790.03(h) include..."
- "Missing this deadline triggers a mandatory 10% self-imposed penalty under LC 4650(c)."

**NOT permitted (crosses into legal advice):**
- "You should deny this claim because..."
- "Based on these facts, the claim is not compensable."
- "The injured worker is entitled to..."
- "Your best strategy is to..."

The education system tells the examiner what the law says and what happens if they violate it. It never tells the examiner what to decide. The line between education and advice is the line between "the statute requires X" and "you should do X." Training content stays on the education side. Always.

**Review process:** All training module content, education spec entries, workflow steps, and glossary definitions are reviewed by legal counsel before deployment. Any content flagged as potentially crossing the GREEN/YELLOW boundary is revised or removed. Quarterly sampling of in-product education displays confirms ongoing GREEN zone compliance.

---

## 9. Integration with Companion Specifications

This specification does not exist in isolation. It is the third leg of a three-document system:

| Document | Role | Relationship to This Spec |
|----------|------|--------------------------|
| [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md) | Defines the 57 education entries (Authority, Standard, Consequence, Common Mistake) for every legally mandated examiner duty across 7 regulatory domains | Provides the content for Tier 2 always-present explanations and the substantive material for pre-use training Modules 1 and 2 |
| [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md) | Defines 20 step-by-step decision workflows for every major examiner action, with regulatory citations at each step | Provides the content for Layer 2 decision workflow integration and the interactive walkthrough material for pre-use training Module 4 |
| **This document** (ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md) | Defines the training architecture: how education content is delivered, when it appears, how it progresses, and how it is managed | Specifies the delivery system for the content defined in the companion specs |

**Content flows one direction:** The education spec and workflow spec define WHAT is taught. This spec defines HOW it is taught. If a regulatory requirement changes, the education spec and workflow spec are updated first, and the training system delivers the updated content through the mechanisms defined here.

---

**Document Status:** Design phase — review before Phase 5 implementation begins
**Owner:** CEO / Product / Engineering / Legal
**Legal Review:** CRITICAL — training content defines the education/advice boundary
**Companion:** [ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md) — Phase 5.3

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
