# AdjudiCLAIMS by Glass Box — Examiner User Guide

**Product:** AdjudiCLAIMS by Glass Box — Augmented Intelligence for CA Workers Compensation Claims Professionals
**Audience:** California Workers' Compensation Claims Examiners, Claims Adjusters, Claims Supervisors
**Version:** 1.0 (Pre-Launch Draft)
**Last Updated:** 2026-03-22
**Implementation Status:** Active Development (accelerated from 2027-2028 by agentic engineering)
**Attorney-Side Equivalent:** [ATTORNEY_USER_GUIDE.md](../projects/adjudica-ai-app/ATTORNEY_USER_GUIDE.md)

---

## What This Tool Is

AdjudiCLAIMS is an AI-powered information tool that helps you manage California Workers' Compensation claims more efficiently by:

- Summarizing medical records with cited factual findings
- Calculating statutory benefits (TD rates, payment deadlines)
- Tracking regulatory compliance deadlines across your entire caseload
- Organizing and classifying claim documents automatically
- Generating factual claim chronologies from uploaded documents
- Matching treatment requests against MTUS/ACOEM guidelines for UR review
- Preparing factual claim summaries for defense counsel referral

Every output includes citations to the source documents so you can verify the information.

---

## What This Tool Is NOT

> **This tool provides factual information and data analysis. It does not provide legal advice, legal analysis, or legal conclusions.**

AdjudiCLAIMS is NOT:
- **A lawyer.** It cannot tell you whether to accept or deny a claim, how much a claim is worth, whether coverage exists, or what legal strategy to pursue.
- **A replacement for defense counsel.** When legal issues arise — and they will — this tool will direct you to consult your assigned defense attorney or in-house legal department.
- **A decision-maker.** YOU make all substantive claims decisions: coverage determinations, reserve setting, treatment authorization, settlement authority, counsel referral. The AI provides information to support your decisions — it never makes them for you.
- **A claims automation system.** Every output requires your review and professional judgment before action.

**When you see a legal question, stop and consult counsel.** This is not a limitation of the tool — it is a legal requirement. Claims examiners are not licensed attorneys. Providing legal analysis to non-attorneys is unauthorized practice of law under California law (B&P Code § 6125).

---

## Understanding the Zone System

Every AI output in AdjudiCLAIMS is classified into one of three zones that tell you how to use the information:

### GREEN — Factual Information

**What it means:** This output presents facts, calculations, or document extractions. Use it directly after verifying against source documents.

**What you see:** Standard output with citation links.

**Examples:** Medical record summaries, benefit calculations, deadline dates, document classifications, claim chronologies.

**Your action:** Review, verify against source, use in your claims work.

---

### YELLOW — Information With Legal Implications

**What it means:** This output presents factual information that may have legal implications. Use it for informational purposes, but consult defense counsel before making claims decisions based on it.

**What you see:** Output with this banner:

> **⚠️ This information may involve legal issues. Consult with assigned defense counsel or in-house legal before making decisions based on this information.**

**Examples:** Comparable claims resolution data, litigation risk indicators, medical evidence discrepancies, subrogation indicators, cumulative trauma identification.

**Your action:** Read the information. Note the legal issue flagged. Consult defense counsel before acting on it.

---

### RED — Legal Issue Detected (Blocked)

**What it means:** Your question or the situation involves a legal issue that requires analysis by a licensed attorney. The AI will NOT provide an answer — instead, it will direct you to counsel and offer to prepare a factual summary for your referral.

**What you see:**

> **This question involves a legal issue that requires analysis by a licensed attorney. Contact your assigned defense counsel or in-house legal department for guidance.**

**Examples:** Questions about case strength, coverage opinions, settlement strategy, case law meaning, legal rights of parties.

**Your action:** Contact defense counsel. If the AI offers to generate a factual claim summary for the referral, accept — it will compile the relevant facts to make your communication with counsel efficient.

---

## Feature Guide

### Document Upload and Processing

**What it does:** Upload claim documents (PDF, DOCX, images) for AI processing.

**How to use:**
1. Select your claim from the dashboard
2. Click "Upload Documents" or drag-and-drop files
3. AI processes each document: OCR → text extraction → classification → data extraction → timeline events
4. Review document classifications and correct any errors

**What AI does:** Extracts text, classifies document type (medical record, correspondence, DWC form, etc.), extracts key fields (dates, names, amounts), generates timeline events.

**What AI does NOT do:** Assess the legal significance of any document.

> AI-generated factual summary. Verify against source documents.

#### Why This Matters

> **10 CCR 2695.3** requires you to maintain documentation of all claim handling activity. **CCR 10101** specifies what must be in every claim file. Proper document organization isn't just helpful — it's a regulatory requirement that DOI auditors check during market conduct examinations. AdjudiCLAIMS automates classification and organization so your files are always audit-ready.

#### What Happens If You Don't

Missing or misfiled documents can result in DOI audit findings under CCR 10108. More practically, incomplete files lead to missed deadlines, uninformed decisions, and potential bad faith exposure under Ins. Code 790.03(h)(3)-(4).

---

### Claims Chat

**What it does:** Ask questions about your claim documents and get cited answers.

**How to use:**
1. Open Claims Chat from your claim dashboard
2. Type your question
3. AI retrieves relevant information from your uploaded documents
4. Review the answer and click citations to verify

**GREEN zone questions (AI answers directly):**
- "What WPI did Dr. Johnson assign for the lumbar spine?"
- "What is the claimant's average weekly wage?"
- "When was the last QME appointment?"
- "Summarize the treating physician's most recent report"
- "What documents are in this claim file?"

**YELLOW zone questions (AI answers with disclaimer):**
- "Are there comparable claims to this one?"
- "Is there a discrepancy between the medical reports?"
- "Does this claim involve cumulative trauma?"

**RED zone questions (AI blocks and redirects to counsel):**
- "Should I deny this claim?"
- "What is this case worth?"
- "Is the claimant's attorney's argument strong?"
- "What does Benson mean for this case?"
- "How much should I offer to settle?"

**When AI blocks your question:** Don't be frustrated — the block protects you. Legal questions need legal answers. The AI will offer to prepare a factual summary you can send to defense counsel, making the referral efficient.

#### Why This Matters

> The Green/Yellow/Red zone system exists because **you are not a licensed attorney** (Cal. Bus. & Prof. Code § 6125). When AI provides legal analysis to a non-lawyer, that constitutes unauthorized practice of law — a misdemeanor under B&P § 6126. The zone system protects you by ensuring you receive factual information (GREEN), flagged information with disclaimers (YELLOW), or attorney referrals (RED) — never legal advice.

#### What Happens If You Don't

If you attempt to work around the RED zone blocks — for example, by rephrasing legal questions as factual ones — you risk making decisions based on information that should have been reviewed by defense counsel. The audit trail records all zone classifications, so DOI and your carrier's compliance team can review how you interacted with AI-flagged content.

---

### Benefit Calculator

**What it does:** Calculates statutory benefit amounts using the formulas in the Labor Code.

**How to use:**
1. Enter or verify the Average Weekly Earnings (AWE)
2. Select the injury date (determines which min/max rates apply)
3. Calculator computes TD rate (2/3 AWE within statutory min/max per LC 4653)
4. View payment schedule with 14-day payment deadlines per LC 4650

**What AI does:** Arithmetic. Applies statutory formula to your inputs.

**What AI does NOT do:** Advise on whether benefits should be paid, disputed, or adjusted. If there is a dispute about AWE or benefit entitlement, consult defense counsel.

> This benefit calculation applies the statutory formula to the data provided. It is arithmetic only and does not constitute a benefits determination.

#### Why This Matters

> **LC 4653** sets the TD rate formula: 2/3 of Average Weekly Earnings (AWE), subject to statutory minimum and maximum rates that change annually. Getting the rate wrong — even by a small amount — affects every subsequent payment. **LC 4650** requires the first payment within 14 days of employer knowledge. **LC 4650(c)** imposes an automatic 10% penalty for late payments. The calculator ensures arithmetic accuracy; you ensure the input data (AWE, injury date) is correct.

#### What Happens If You Don't

Incorrect benefit calculations result in overpayments (difficult to recover) or underpayments (penalty exposure under LC 4650(c) plus potential DOI audit findings). Late first payments trigger the mandatory 10% self-imposed penalty — and if the WCAB finds unreasonable delay, LC 5814 penalties of up to 25% may apply.

---

### Regulatory Compliance Dashboard

**What it does:** Tracks all statutory deadlines across your entire caseload.

**Deadlines tracked:**
| Deadline | Source | Alert Colors |
|----------|--------|-------------|
| 15-day claim acknowledgment | 10 CCR 2695.5(b) | Green (<10 days) / Yellow (10-14) / Red (≥15) |
| 40-day coverage determination | 10 CCR 2695.7(b) | Green (<25 days) / Yellow (25-35) / Red (≥36) |
| 14-day first TD payment | LC 4650 | Green (<10 days) / Yellow (10-13) / Red (≥14) |
| 14-day subsequent TD payments | LC 4650(b) | Same pattern |
| UR prospective decision | CCR 9792.9 (5 business days) | Green (<3 days) / Yellow (3-4) / Red (≥5) |
| UR retrospective decision | CCR 9792.9 (30 days) | Same pattern |
| 30-day delay notification | 10 CCR 2695.7(c) | Triggered when claim approaching 40-day deadline |

**What AI does:** Calendar math from statutory requirements applied to dates in your claim file.

**What AI does NOT do:** Advise on whether a deadline applies to your specific situation. If you're unsure whether a deadline applies, consult your compliance department or legal counsel.

#### Why This Matters

> Every deadline on this dashboard has a specific statutory or regulatory source. The **15-day acknowledgment** comes from 10 CCR 2695.5(b). The **40-day coverage determination** comes from 10 CCR 2695.7(b). The **14-day TD payment** comes from LC 4650. These aren't arbitrary deadlines — the California legislature and DOI set them to protect injured workers from delays in claims handling. Missing any of these deadlines is a violation that DOI can cite during market conduct examination.

#### What Happens If You Don't

Missed deadlines are the single most common DOI audit finding. Each missed deadline is a separate violation under CCR 10108, subject to administrative penalties. Patterns of missed deadlines can trigger targeted audits under CCR 10106. For TD payment deadlines specifically, LC 4650(c) imposes an automatic 10% penalty that the examiner must self-assess.

---

### Medical Record Summary

**What it does:** Extracts factual findings from medical reports.

**What you see for each medical document:**
- **Provider name and date of examination**
- **Diagnoses** (as stated in the report)
- **WPI rating** (if assigned, with AMA Guides reference)
- **Work restrictions** (as stated)
- **Treatment recommendations** (as stated)
- **Apportionment opinion** (if stated — flagged as YELLOW zone because apportionment has legal implications)
- **Citation** to specific page in source document

**What AI does:** Extracts what the doctor wrote. Presents it as factual data.

**What AI does NOT do:** Interpret medical findings, assess their legal significance, evaluate whether the doctor's opinion is correct, or recommend whether to accept or dispute the findings.

> This medical record summary presents extracted factual findings as stated in the source documents. It does not interpret medical findings or assess their legal significance.

#### Why This Matters

> Medical evidence is the factual foundation of every claim. **LC 4600** requires the employer/insurer to provide all medical treatment reasonably required. **LC 4610** requires a Utilization Review program for treatment authorization decisions. Understanding the medical evidence — diagnoses, WPI ratings, work restrictions, treatment recommendations — is essential for every claims decision from reserves to settlement. AdjudiCLAIMS extracts these facts so you can review them efficiently, but the medical records themselves are the source of truth.

#### What Happens If You Don't

Making claims decisions without reviewing the medical evidence violates **CCR 10109** (duty to investigate based on all available information) and potentially **Ins. Code 790.03(h)(4)** (refusing to pay without reasonable investigation). AI summaries are tools to help you find key data faster — they are not substitutes for your professional review of the actual medical reports.

---

### Investigation Checklist

**What it does:** Tracks whether standard investigation steps have been completed for each claim.

**Checklist items:**
- [ ] Three-point contact completed (injured worker, employer, medical provider)
- [ ] Recorded statement obtained from injured worker
- [ ] Employer report received
- [ ] Medical records requested from treating physician
- [ ] DWC-1 claim form on file
- [ ] Index bureau / prior claims search completed
- [ ] Average weekly earnings verified
- [ ] Initial reserves set

**What AI does:** Auto-checks items as documents are uploaded and classified. Identifies gaps.

**What AI does NOT do:** Advise whether your investigation is "sufficient" — investigation adequacy may be a legal determination. The checklist tracks completeness, not sufficiency.

#### Why This Matters

> **CCR 10109** requires you to conduct a prompt, thorough investigation of every claim. **Ins. Code 790.03(h)(3)** makes it a prohibited practice to fail to adopt reasonable investigation standards. The investigation checklist tracks the standard investigation steps that DOI auditors expect to see documented in your claim file. A complete investigation protects you, your carrier, and the injured worker — it ensures decisions are based on all available facts.

#### What Happens If You Don't

Denying a claim without completing the investigation violates **Ins. Code 790.03(h)(4)** — one of the most serious prohibited practices. DOI auditors specifically check investigation completeness during market conduct examinations (CCR 10107). Incomplete investigations also create bad faith exposure and can result in LC 5814 penalty awards at the WCAB.

---

### Counsel Referral Summary

**What it does:** When you decide to refer a claim to defense counsel, this feature generates a factual claim summary to make your referral communication efficient.

**What the summary includes:**
1. Claim overview (claimant, employer, insurer, DOI, body parts)
2. Medical evidence summary (provider findings with citations)
3. Benefits status (TD/PD, payments to date)
4. Claim timeline (key dates)
5. Legal issue identified (what was flagged)
6. Documents available (list for counsel review)

**What the summary does NOT include:** Legal analysis, case evaluation, settlement recommendations, or strategic advice.

> This factual summary is provided for defense counsel's review and legal analysis.

#### Why This Matters

> Defense counsel exists to handle the legal issues you cannot. When AdjudiCLAIMS flags a RED zone issue, the counsel referral summary ensures your communication with the attorney is efficient and complete. The attorney gets the facts they need — claim data, medical evidence, timeline, identified legal issue — without having to rebuild the file from scratch. This saves time for everyone and ensures the legal issue gets proper attention.

---

## Common Scenarios

> For comprehensive step-by-step decision workflows covering all 20 major examiner actions, see [ADJUDICLAIMS_DECISION_WORKFLOWS.md](ADJUDICLAIMS_DECISION_WORKFLOWS.md). The scenarios below are quick-reference summaries.

### Scenario: New Claim Received

1. Upload all available documents (DWC-1, employer report, initial medical)
2. AI classifies documents and extracts claim data
3. Review extracted data in claim overview — correct any errors
4. Check Investigation Checklist — identify missing items
5. Review Compliance Dashboard — note your 15-day acknowledgment deadline and 14-day TD payment deadline
6. If medical records available, review AI summary for key findings
7. Set initial reserves based on your professional judgment

### Scenario: QME Report Received

1. Upload QME report
2. AI classifies as medical document (QME subtype) and extracts findings
3. Review Medical Record Summary — note WPI rating, diagnoses, restrictions, apportionment opinion
4. If apportionment is addressed → YELLOW zone flag: "Consult defense counsel regarding apportionment"
5. Use Claims Chat to ask factual questions: "What WPI did the QME assign for each body part?"
6. If you need legal analysis of the QME findings → generate Counsel Referral Summary and send to defense attorney

### Scenario: Applicant Obtains Attorney Representation

1. AI detects applicant attorney in uploaded documents → YELLOW zone flag
2. Consider whether to refer to defense counsel (your decision)
3. If referring: generate Counsel Referral Summary with all claim data
4. DO NOT ask AI for legal strategy on how to handle the represented claim

### Scenario: Treatment Authorization Request

1. Upload treatment request documentation
2. AI matches requested treatment against MTUS/ACOEM guidelines
3. Review guideline matching: criteria met vs. not documented
4. Make UR authorization decision based on guideline data + your clinical/professional judgment
5. If treatment involves complex medical-legal issues (e.g., disputed body part, denied claim) → consult defense counsel

---

## Important Reminders

1. **You make all decisions.** AI provides information — you decide what to do with it.
2. **Verify AI outputs.** Click citations. Check source documents. AI can make errors.
3. **When in doubt, consult counsel.** The cost of an unnecessary attorney call is small. The cost of making a legal determination without legal advice can be significant.
4. **Never provide legal advice to injured workers.** If they ask legal questions, refer them to the DWC Information and Assistance Officer or suggest they consult an attorney.
5. **The audit trail records everything.** Every AI interaction, every decision, every export is logged. This protects you during DOI audit by documenting your claims handling process.

---

**Document Status:** Pre-launch draft — revise during pilot testing with examiner feedback
**Owner:** Product / Training
**Legal Review:** Required — ensure all disclaimers and framing are compliant

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
