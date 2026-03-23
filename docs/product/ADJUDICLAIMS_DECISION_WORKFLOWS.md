# AdjudiCLAIMS — Decision Workflow Specifications

**Product:** AdjudiCLAIMS by Glass Box — Augmented Intelligence for CA Workers Compensation Claims Professionals
**Document Type:** Product Design Specification — Decision Workflows
**Purpose:** Step-by-step regulatory-grounded workflows for every major claims examiner action, designed to educate new examiners about the WHY behind each step while guiding them through the process
**Philosophy:** From Black Box to Glass Box — every step cites its regulatory authority
**Audience Baseline:** Zero WC knowledge — every term defined, every regulation explained
**Last Updated:** 2026-03-23
**Legal Review Required:** Yes — workflows must not cross into legal advice (GREEN zone only)
**Foundation:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md](foundations/WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md)
**Companion:** [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md)

---

## How to Read This Document

Each workflow represents a major claims examiner action from trigger to completion. Every step cites the statute or regulation that requires it. The document uses a two-tier progressive disclosure model:

- **Tier 1 (Dismissable):** Background context, term definitions, and process overviews for new examiners. Once you know the material, you dismiss it permanently in the product. Marked with the label "Tier 1 (Dismissable)."
- **Tier 2 (Always present):** Statutory authority, regulatory consequences, and compliance requirements. These are NEVER hidden, even for experienced examiners. They are the Glass Box foundation — the system is always transparent, always cited, always explainable. Tier 2 content appears in the step tables, decision points, and escalation sections.

The **UPL Zone** classification on each workflow tells you where the product sits on the unauthorized-practice-of-law spectrum. GREEN means the workflow is purely factual and informational. YELLOW means legal implications exist and counsel should be consulted at specific points. RED means the workflow touches legal analysis that only a licensed attorney can perform. See the [Examiner User Guide](ADJUDICLAIMS_USER_GUIDE.md) for full zone definitions.

The **"AdjudiCLAIMS Provides"** column in each step table shows what the product does for you. The **"You Decide"** column shows what requires your professional judgment. The product never crosses that line.

---

## Workflow 1: New Claim Intake (First 48 Hours)

**Regulatory Trigger:** Receipt of a DWC-1 Workers' Compensation Claim Form, an Employer's First Report of Occupational Injury or Illness, or any other written or verbal notice of a work injury from any source (injured worker, employer, medical provider, attorney).

**Primary Authority:** 10 CCR 2695.5(b) (15-day acknowledgment), 8 CCR 10109 (duty to investigate), 8 CCR 10101 (claim file contents), LC 5401 (claim form requirements)

**Key Deadlines:**
- Acknowledge receipt of claim: **15 calendar days** (10 CCR 2695.5(b))
- Begin investigation: **Immediately** upon receipt of proof of claim (10 CCR 2695.5(e))
- First TD payment (if disability exists): **14 calendar days** from employer knowledge (LC 4650)
- Accept or deny claim: **40 calendar days** (10 CCR 2695.7(b))
- Presumption of compensability attaches if not denied: **90 days** from employer knowledge (LC 5402(b))

**UPL Zone:** GREEN — Claim intake is purely administrative and procedural. No legal analysis is involved in setting up a claim file, acknowledging receipt, or beginning an investigation.

**Tier 1 (Dismissable):** When a worker is injured on the job in California, the employer is required to provide them with a DWC-1 Claim Form within one working day of learning about the injury (LC 5401(a)). The employee fills out the "employee" section and returns it to the employer, who fills out the "employer" section and sends it to the insurance carrier or third-party administrator (TPA). That form arriving on your desk is the starting gun. From that moment, multiple regulatory clocks begin ticking simultaneously — acknowledgment, investigation, payment, and determination deadlines all have separate countdowns. The intake process exists to make sure you capture the right information, start the right clocks, and create a claim file that will survive a Department of Insurance (DOI) audit years later.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Receive claim notice.** Log the date and method of receipt (mail, fax, email, phone). This date starts all regulatory clocks. | 10 CCR 2695.5(b); LC 5401 | Auto-logs receipt date when documents are uploaded. Extracts claim form data (claimant name, employer, date of injury, body parts, mechanism of injury) using OCR and field extraction. | Whether receipt is complete — does the DWC-1 have both employee and employer sections filled out? If incomplete, what follow-up is needed? | Day 0 — the moment you receive the claim form or notice. |
| 2 | **Create the claim file.** Set up the administrative record with all required fields: claimant information, employer information, insurer/TPA information, injury details, date of knowledge, claim number assignment. | 8 CCR 10101 (claim file contents); 8 CCR 10103 (claim log) | Auto-populates claim file fields from extracted DWC-1 data. Creates claim record with unique identifier. Initiates claim log per CCR 10103 requirements. Flags any missing fields that CCR 10101 requires. | Whether extracted data is correct — review every auto-populated field against the source document. Correct any errors before proceeding. | Day 0 — immediately after logging receipt. |
| 3 | **Send written acknowledgment to the injured worker.** Confirm that you received the claim and that it is being processed. Include your name, contact information, and claim number. | 10 CCR 2695.5(b) — must acknowledge within 15 calendar days | Generates acknowledgment letter template pre-populated with claim data. Starts 15-day countdown timer on your deadline dashboard. | Whether to send the standard acknowledgment template or customize it. Whether any additional information should be requested in the acknowledgment letter. | Within 1-3 business days (best practice) — regulatory maximum is 15 calendar days. |
| 4 | **Notify the employer.** Confirm claim receipt to the employer of record. Under LC 3761, the insurer must notify the employer within 15 days of each claim for indemnity filed. | LC 3761 (employer notification); 10 CCR 2695.5(b) | Generates employer notification letter template. Tracks employer notification deadline separately from claimant acknowledgment. | Whether additional information is needed from the employer (wage records, job description, incident report, witness information). | Within 15 calendar days of claim receipt. |
| 5 | **Begin investigation immediately.** This means starting the Three-Point Contact Protocol (see Workflow 2) and requesting all available documentation. Do not wait for all documents to arrive before starting. | 10 CCR 2695.5(e) — investigation must begin immediately; 8 CCR 10109 (duty to investigate) | Populates the Investigation Checklist (Workflow 2 items). Identifies what documents are in the file and what is missing. Starts tracking investigation completeness. | What investigation steps to prioritize based on the specific claim. Whether the injury description raises any questions that require deeper investigation. | Day 0 — investigation begins the day you receive the claim. |
| 6 | **Set initial reserves.** Estimate the total cost of the claim across all categories: indemnity (TD/PD), medical treatment, legal expense (ALAE), and liens. | No specific statutory mandate — but reserve adequacy impacts Ins. Code 790.03(h)(6) (good faith settlement) and carrier financial reporting | Provides injury-type benchmarks and historical data ranges for comparable claims. Calculates estimated TD exposure based on extracted wage data. | The actual reserve amounts — this is your professional judgment based on injury severity, claimant demographics, and claim complexity. See Workflow 7 for detailed reserve guidance. | Within 48 hours of claim receipt (carrier best practice — specific timelines vary by employer). |
| 7 | **Activate deadline tracking.** Ensure all regulatory deadlines are visible and monitored: 15-day acknowledgment, 14-day first TD payment, 40-day accept/deny, 90-day presumption, and 30-day delay notification cycles. | 10 CCR 2695.5(b); LC 4650; 10 CCR 2695.7(b); LC 5402(b); 10 CCR 2695.7(c) | Auto-calculates all deadline dates from claim receipt date and employer knowledge date. Displays all deadlines on your dashboard with color-coded urgency (green/yellow/red). Sends reminders as deadlines approach. | Whether any deadlines need adjustment based on facts you know that the system does not (e.g., the employer learned of the injury on a different date than the claim form date). | Day 0 — all clocks start on claim receipt. |

### Decision Points

**Is the claim form complete?** The DWC-1 has two sections — the employee section (describing the injury, body parts, date) and the employer section (confirming employment, providing insurer information, wage data). If either section is incomplete, you must still acknowledge receipt and begin investigation. An incomplete form does not stop the regulatory clocks. However, you should request the missing information promptly because incomplete information affects your ability to investigate and make a timely coverage determination.

**When did the employer "know" about the injury?** The employer's date of knowledge is critical because it starts the 14-day TD payment clock (LC 4650) and the 90-day presumption clock (LC 5402(b)). The employer's knowledge date may be different from the date you received the claim form. Under LC 5402(a), knowledge means the date the employer had actual knowledge of the injury, which may be the date the employee reported it verbally, the date of a witnessed incident, or the date the claim form was received — whichever is earliest. AdjudiCLAIMS will ask you to confirm the employer knowledge date because the system cannot determine it from the claim form alone.

**Does this claim require immediate TD payments?** Under LC 4650(d), if the employee is losing wages due to the injury, the first TD payment must begin within 14 days of employer knowledge — even if your investigation is not complete and even if you have not yet accepted or denied the claim. This is one of the most commonly missed deadlines for new examiners. See Workflow 4 for detailed TD payment guidance.

### Common Mistakes

**Mistake 1: Waiting for "all the information" before starting.** A new examiner receives a DWC-1 for a back injury. The form is complete but no medical records are attached. The examiner decides to wait until the medical records arrive before sending the acknowledgment letter and starting the investigation. Two weeks pass. The 15-day acknowledgment deadline is about to expire, the investigation has not started, and no three-point contact has been made. The examiner has done nothing wrong medically or factually — they simply misunderstood that the regulatory clocks start on claim receipt, not on file completeness. The fix: send the acknowledgment and begin the investigation on Day 0. Request the medical records as part of the investigation, not as a prerequisite to it.

**Mistake 2: Using the claim form date instead of the employer knowledge date.** An employee injures their shoulder on March 1 and tells their supervisor that day. The supervisor fills out an internal incident report. The employee does not fill out the DWC-1 until March 15. The claim form arrives at the carrier on March 20. A new examiner starts all deadlines from March 20 (the claim receipt date). But the employer's date of knowledge was March 1 — when the supervisor learned of the injury. The 14-day TD payment clock started on March 1. By March 20, the first TD payment is already six days overdue. The fix: always ask the employer when they first learned of the injury, and use that date for TD and presumption clocks.

**Mistake 3: Failing to log the claim in the claim log.** An examiner creates the claim file and begins working the claim, but does not make a contemporaneous entry in the claim log required by CCR 10103. Months later, during a DWC audit, the auditor pulls the claim log and finds no entry for the first three weeks of claim activity. The investigation may have been timely and thorough, but the log does not prove it. In an audit, undocumented activity is the same as no activity. The fix: log every action in real time. AdjudiCLAIMS creates log entries automatically for actions taken in the system, but you must also log phone calls, in-person meetings, and other off-system activities.

### Escalation Points

- **Incomplete or suspicious claim form:** If the DWC-1 contains inconsistencies (e.g., the injury date is after the employer knowledge date, or the described mechanism of injury does not match the body part claimed), bring this to your supervisor's attention. Do not delay the acknowledgment or investigation, but flag it for review.
- **Claim involves potential fraud indicators:** If the initial review suggests fraud (e.g., Monday morning claim, injury reported days or weeks after alleged occurrence, no witnesses for a claimed witnessed event), refer to your Special Investigations Unit (SIU) while continuing the standard investigation.
- **Claim involves multiple body parts or cumulative trauma:** Claims alleging injury to five or more body parts, or claims alleging cumulative trauma (injury developing gradually over time from repetitive activities), are typically more complex. Notify your supervisor so the claim can be assigned an appropriate complexity level and reserve.
- **Applicant is already represented by an attorney:** If the claim form arrives with an attorney lien or letter of representation, the claim is already in a litigation posture. Notify your supervisor and follow your company's litigated-claims protocol for assignment to defense counsel.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Claim receipt logged | Date, time, method of receipt, source, claim form data | 8 CCR 10103 (claim log) |
| Claim file created | All populated fields, claim number, assigned examiner | 8 CCR 10101 (claim file contents) |
| Acknowledgment letter sent | Date sent, method, recipient, letter content | 10 CCR 2695.5(b) (15-day acknowledgment) |
| Employer notification sent | Date sent, method, recipient | LC 3761 (employer notification) |
| Investigation initiated | Date, first investigative action taken | 10 CCR 2695.5(e) (immediate investigation) |
| Initial reserves set | Date, amounts by category, examiner rationale | Carrier financial reporting; supports Ins. Code 790.03(h)(6) |
| All deadline clocks activated | Calculated deadline dates, source dates used | All applicable statutes and regulations |

---

## Workflow 2: Three-Point Contact Protocol

**Regulatory Trigger:** Receipt of a new claim or claim notice. The Three-Point Contact is the first and most fundamental investigative step. It must begin immediately upon receipt of proof of claim.

**Primary Authority:** 10 CCR 2695.5(e) (begin investigation immediately), 8 CCR 10109 (duty to conduct investigation; duty of good faith), Ins. Code 790.03(h)(3) (reasonable investigation standards)

**Key Deadlines:**
- Begin investigation (including first contact attempts): **Immediately** upon receipt (10 CCR 2695.5(e))
- Industry best practice for all three contacts: **Within 24-48 hours** of claim receipt
- Document all contact attempts in the claim file: **Contemporaneously** (8 CCR 10103)

**UPL Zone:** GREEN — Gathering facts from parties is purely investigative. No legal analysis is involved in asking who, what, when, where, and how.

**Tier 1 (Dismissable):** The "Three-Point Contact" is an industry-standard investigation procedure where you contact the three key people who know the most about the claim: (1) the injured worker, who can describe what happened and how they are doing; (2) the employer (usually the supervisor or HR representative), who can confirm employment details, describe the work environment, and provide wage records; and (3) the treating physician, who can explain the medical diagnosis, treatment plan, and work restrictions. This is not just a formality — it is the foundation of your entire investigation. Under 8 CCR 10109, your duty to investigate requires you to gather "all reasonably available information." These three contacts are where that information lives. A DOI auditor reviewing your file will look for evidence of the three-point contact as the first indicator of investigation adequacy.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Contact the injured worker.** Introduce yourself, explain your role, express concern for their well-being. Gather: description of how the injury happened (mechanism of injury), body parts affected, current symptoms, treating physician name and location, work status (working, off work, modified duty), prior injuries to the same body parts, representation status (do they have an attorney?). | 10 CCR 2695.5(e); 8 CCR 10109(a) | Provides a structured contact questionnaire with all required data points. Records contact date, time, method, and responses. Flags if the worker reports attorney representation (triggers litigated-claims protocol). | How to approach the conversation — tone, order of questions, how much detail to pursue. Whether the worker's account is consistent with the claim form. Whether follow-up questions are needed. | Within 24 hours of claim receipt (best practice). |
| 2 | **Contact the employer.** Speak with the direct supervisor and/or HR representative. Gather: confirmation of employment status and dates, job title and description of duties, date employer first learned of injury (this is the "date of knowledge" — critical for TD and presumption deadlines), witnesses to the incident, whether modified duty is available, wage records (average weekly earnings for the 52 weeks before injury). | 10 CCR 2695.5(e); 8 CCR 10109(a); LC 4453 (AWE calculation) | Provides employer contact questionnaire. Extracts employer information from DWC-1 for pre-population. Flags the employer knowledge date as a critical data point. Calculates AWE from provided wage records. | Whether the employer's account is consistent with the worker's account. Whether the employer knowledge date matches the claim form date (discrepancies are common and must be resolved). Whether additional employer witnesses should be contacted. | Within 24 hours of claim receipt (best practice). |
| 3 | **Contact the treating physician.** Identify the primary treating physician (PTP) from the claim form or injured worker contact. Request: diagnosis, treatment plan, work restrictions, anticipated duration of disability, return-to-work prognosis, whether the injury is consistent with the reported mechanism. | 10 CCR 2695.5(e); 8 CCR 10109(a); LC 4600 (medical treatment obligation) | Identifies PTP from extracted claim form data. Provides physician contact template and records request. Tracks whether physician response has been received. Extracts medical findings from physician reports when received. | Whether the physician's findings are consistent with the reported injury mechanism. Whether additional medical records should be requested (e.g., pre-existing treatment records). Whether a specialist evaluation may be needed. | Within 24-48 hours of claim receipt (best practice). |
| 4 | **Document all contact attempts.** Record every attempt — successful or not — in the claim file with date, time, method (phone, email, letter), and outcome. If a party is unreachable, document the number of attempts and methods used. | 8 CCR 10103 (claim log); 8 CCR 10109 | Auto-generates claim log entries for all contacts made through the system. Provides templates for documenting off-system contacts (phone calls, voicemails, in-person meetings). | Whether additional contact attempts are needed for unresponsive parties. When to escalate to supervisor if a party remains unreachable after multiple attempts. | Contemporaneous — log every contact as it happens. |
| 5 | **Assess investigation completeness.** After the three-point contact, review what information you have and what is still missing. Determine whether the investigation is sufficient to support a coverage determination or whether additional steps are needed (e.g., witness statements, index bureau check, prior claims search, surveillance). | 8 CCR 10109(a) (all reasonably available information) | Displays investigation completeness dashboard showing which contacts are done, which data points are captured, and which are outstanding. Identifies gaps in the claim file. | Whether the current information is sufficient for a coverage determination. What additional investigation is needed and in what priority order. Whether any red flags require SIU referral. | After completing the three-point contact — typically Day 2-5. |

### Decision Points

**What if the injured worker is represented by an attorney?** If the worker tells you they have hired an attorney, or if you receive a letter of representation, you must direct all further communication with the worker through their attorney. Under California law, once a party is represented, direct contact with that party by the opposing side (which includes the insurer) is restricted. Note the representation in the claim file, obtain the attorney's contact information, and route all future communications through the attorney. This also changes the QME/AME process (see Workflow 6). AdjudiCLAIMS will flag the claim as "represented" and adjust downstream workflows accordingly.

**What if the injured worker's account contradicts the employer's account?** This is common and does not automatically mean fraud or denial. The two parties may simply have different perspectives on the same event. Your job at this stage is to document both accounts accurately and identify the specific points of disagreement. Do not resolve the contradiction based on your own judgment of credibility — that is a factual determination that may require additional investigation (witness statements, surveillance, medical opinion on mechanism of injury). Document the discrepancy and continue investigating.

**What if the treating physician does not respond?** Physicians are often slow to respond to claims examiner requests. After two unsuccessful contact attempts, send a written request via certified mail or fax with a specific deadline for response. Document all attempts. If the physician remains unresponsive, consider whether alternative medical information is available (emergency room records, urgent care records, MPN referral records). An unresponsive physician does not excuse you from the duty to investigate — it means you must pursue alternative sources of medical information.

**What if the employer cannot provide wage records?** Average Weekly Earnings (AWE) data is essential for calculating TD benefits. If the employer cannot provide it promptly, request it in writing and set a follow-up deadline. In the meantime, you must still initiate TD payments within 14 days (LC 4650). Use the best available information — the wage data on the DWC-1, the employee's account, or a reasonable estimate — and adjust when actual records arrive. LC 4650(d) requires payment during investigation; you cannot delay payment because wage records are pending.

### Common Mistakes

**Mistake 1: Conducting the three-point contact by checklist, not by conversation.** A new examiner calls the injured worker, rapidly fires through a list of questions ("Date of injury? Body part? Treating doctor? Prior injuries?"), writes down one-word answers, and hangs up. The claim log shows "contact made" but the notes are so sparse they provide no useful investigative information. A DOI auditor would see a check-the-box exercise, not a real investigation. The three-point contact is a conversation, not an interrogation. Ask open-ended questions. Let the person describe what happened in their own words. Follow up on details. Your notes should read like a narrative, not a form.

**Mistake 2: Skipping the employer contact because the claim form has employer information.** The DWC-1 includes employer information, but it is filled out by different people at different times and may not reflect reality. The job title on the form may be the official HR title, not the actual duties the worker performs. The supervisor may have information about the incident that HR does not. The employer's date of knowledge may be different from what is on the form. Skipping the employer contact means you are relying on a form instead of an investigation.

**Mistake 3: Not documenting unsuccessful contact attempts.** An examiner calls the injured worker three times and leaves voicemails. No return call. The examiner moves on to other claims and does not document the attempts. Weeks later, the worker's attorney sends a letter alleging the insurer never contacted the worker. The examiner knows they called three times — but the file has no record of it. In the eyes of a DOI auditor or WCAB judge, those calls never happened. Document every attempt, including the date, time, phone number called, and that a voicemail was left.

### Escalation Points

- **Injured worker reports retaliation or discrimination by employer.** This is a legal issue beyond claims administration. Note it in the file and notify your supervisor and defense counsel. The carrier may have separate obligations under LC 132a (discrimination for filing a WC claim).
- **Accounts suggest fraud.** If the injured worker's account, employer's account, or physician findings suggest the injury did not occur as described, or did not occur at all, refer to your SIU. Continue the standard investigation while the SIU referral is pending.
- **Mechanism of injury involves potential third-party liability.** If the injury was caused by a defective product, a negligent third party on the job site, or a motor vehicle accident, there may be a subrogation claim. Note the potential third-party involvement and notify your supervisor or subrogation unit.
- **Injured worker is a minor, does not speak English, or has a cognitive impairment.** Additional protections and accommodations may apply. Consult your supervisor for guidance on appropriate communication methods and any legal obligations.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Injured worker contact attempt | Date, time, method, outcome, notes | 8 CCR 10103; 10 CCR 2695.5(e) |
| Injured worker contact completed | Full questionnaire responses, representation status | 8 CCR 10109(a) |
| Employer contact attempt | Date, time, method, contact person, outcome | 8 CCR 10103; 10 CCR 2695.5(e) |
| Employer contact completed | Full questionnaire responses, knowledge date, wage data | 8 CCR 10109(a); LC 4453 |
| Physician contact attempt | Date, time, method, outcome | 8 CCR 10103; 10 CCR 2695.5(e) |
| Physician records requested | Date, method, records requested, expected response date | 8 CCR 10109(a) |
| Investigation completeness assessed | Gaps identified, additional steps planned | 8 CCR 10109 |

---

## Workflow 3: Coverage Determination (Accept/Deny)

**Regulatory Trigger:** Approaching the 40-day deadline under 10 CCR 2695.7(b) for accepting or denying the claim, OR investigation reaching a point where a coverage determination can be made — whichever comes first. The determination should be made as soon as the investigation supports one, not delayed until the deadline.

**Primary Authority:** Ins. Code 790.03(h)(5) (timely affirm or deny coverage), 10 CCR 2695.7(b) (40-day deadline), LC 5402(b) (90-day presumption), Ins. Code 790.03(h)(4) (no denial without investigation), 10 CCR 2695.7(h) (written denial requirements)

**Key Deadlines:**
- Accept or deny claim: **40 calendar days** after receipt of proof of claim (10 CCR 2695.7(b))
- If more time needed, send delay letter: **Every 30 calendar days** (10 CCR 2695.7(c))
- Presumption of compensability if not denied: **90 days** from employer knowledge (LC 5402(b))

**UPL Zone:** GREEN/YELLOW — The factual investigation and data gathering are GREEN. The actual coverage determination is the examiner's decision based on established facts and clear policy language (GREEN for straightforward claims). However, when claims involve complex legal issues — disputed causation, apportionment, cumulative trauma, policy interpretation — the determination crosses into YELLOW territory and defense counsel should be consulted. AdjudiCLAIMS helps gather facts and track deadlines but does NOT tell you whether to accept or deny.

**Tier 1 (Dismissable):** "Coverage determination" is the formal decision about whether the claim is compensable — meaning whether the injury is covered under the workers' compensation system and the employer's insurance policy. In California workers' compensation, the key question is usually "AOE/COE" — did the injury Arise Out of Employment and occur in the Course of Employment? If yes, the claim is generally compensable and benefits must be paid. If no, the claim may be denied. This decision is one of the most consequential actions you take as an examiner. Accepting a claim obligates the carrier to pay benefits. Denying a claim must be supported by a documented investigation and a specific, written explanation — and an improper denial exposes the carrier to penalties, bad faith liability, and audit violations. This is also the workflow where the line between claims administration and legal analysis is thinnest. When the facts are clear and the answer is obvious, the determination is a routine claims function. When the facts are disputed or the legal issues are complex, the determination may require legal counsel.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Review investigation findings.** Pull together everything from the Three-Point Contact and any subsequent investigation: injured worker statement, employer statement, medical records, wage data, witness statements, any additional evidence. Assess whether the investigation is complete enough to support a determination. | 8 CCR 10109(a) (investigation must include all reasonably available information) | Displays investigation completeness dashboard. Summarizes all evidence gathered to date organized by source (worker, employer, medical, other). Highlights any outstanding items from the investigation checklist. | Whether the investigation is complete. Whether any additional evidence should be gathered before making a determination. Whether outstanding items are material to the coverage decision. | Beginning at Day 20-25 (to allow time for determination before Day 40). |
| 2 | **Assess compensability.** Evaluate whether the evidence supports that the injury: (a) occurred as described, (b) arose out of employment (AOE), and (c) occurred in the course of employment (COE). For each element, note the supporting and contradicting evidence. | Ins. Code 790.03(h)(4) (reasonable investigation before denial); 8 CCR 10109(a) | Organizes evidence by compensability element (occurrence, AOE, COE). Extracts and displays relevant medical findings and physician opinions on causation. Flags discrepancies between accounts. | Whether the evidence supports compensability. This is your professional judgment. For straightforward claims (clear mechanism of injury, consistent accounts, supporting medical), this is a routine determination. For complex claims, see Step 3. | Day 25-35 (in time for determination before Day 40). |
| 3 | **Identify legal complexity.** Determine whether the claim involves legal issues that require counsel. Common triggers: disputed causation, cumulative trauma allegations, pre-existing condition apportionment, multiple employers, serious and willful misconduct allegations, third-party subrogation, coverage disputes. | B&P 6125 (UPL prohibition); Ins. Code 790.03(h)(14) (must provide explanation for denial) | Flags common legal complexity indicators found in the claim file (e.g., multiple body parts, cumulative trauma language, prior claims to same body part, attorney representation). Provides a factual summary suitable for counsel referral. Does NOT provide legal analysis. | Whether the complexity level requires defense counsel involvement. AdjudiCLAIMS identifies factual indicators; YOU determine whether they rise to the level of legal issues requiring attorney consultation. | Concurrent with Step 2. |
| 4a | **If compensable: Issue acceptance letter.** Formally accept the claim in writing. Specify the body parts accepted, the date of injury, and the benefits to which the worker is entitled. Begin benefit payments per Workflows 4 and 5. | 10 CCR 2695.7(b); Ins. Code 790.03(h)(5) | Generates acceptance letter template with claim-specific data. Updates claim status to "accepted." Triggers downstream workflows (TD payment initiation, UR readiness). | The decision to accept. The specific body parts and conditions to accept. Whether to accept the claim in full or accept certain body parts while investigating others. | By Day 40 from proof of claim (regulatory maximum). |
| 4b | **If not compensable: Issue denial letter.** Formally deny the claim in writing. The denial must include: (a) the specific reasons for the denial, (b) the factual basis for the denial, (c) the specific policy provisions or statutory authority supporting the denial, and (d) notice of the worker's right to dispute the denial at the WCAB. | 10 CCR 2695.7(h) (written denial requirements); Ins. Code 790.03(h)(14) (must explain basis for denial); LC 5402(b) | Generates denial letter template. Populates it with claim-specific factual findings that support the denial. Includes required elements (right-to-dispute notice, WCAB contact information). Does NOT draft the legal reasoning for the denial — that is your responsibility (or counsel's). | The decision to deny. The specific factual and regulatory basis for denial. Whether the denial should be reviewed by defense counsel before issuance (recommended for any non-routine denial). | By Day 40 — or by Day 90 from employer knowledge to avoid presumption (whichever is earlier and applicable). |
| 4c | **If more time needed: Issue delay letter.** If you cannot make a determination within 40 days, you must notify the claimant in writing, explaining what additional information is needed and the expected timeline for a determination. You must send a new delay letter every 30 days until the determination is made. | 10 CCR 2695.7(c) (30-day delay notification) | Generates delay letter template. Tracks the 30-day recurring notification deadline. Alerts you when the next delay letter is due. Displays the 90-day presumption deadline as an absolute backstop. | Whether a delay is justified — what specific information are you still waiting for? What have you done to obtain it? The delay must be reasonable, not a tactic to avoid a determination. | By Day 40 if determination not yet made; then every 30 days thereafter. |
| 5 | **Update reserves.** After making the coverage determination, revisit your reserves. Acceptance typically means reserves should be set at full expected claim cost. Denial may mean reserves are reduced (but not eliminated — denied claims are often litigated). | Carrier financial reporting; Ins. Code 790.03(h)(6) | Recalculates reserve benchmarks based on the determination and updated claim data. | The adjusted reserve amounts based on your assessment of likely claim trajectory. | Within 48 hours of the coverage determination. |

### Decision Points

**When is a claim "clear" versus "complex"?** A claim is generally clear when: the mechanism of injury is straightforward (fall, lifting, vehicle accident), the medical evidence supports the reported injury, the injured worker and employer accounts are consistent, and there is no pre-existing condition or prior claim to the same body part. A claim is generally complex when: causation is disputed, the injury is alleged as cumulative trauma, there are significant pre-existing conditions, the medical evidence is contradictory, an attorney is involved, or the claim involves multiple employers. Clear claims can usually be determined by the examiner. Complex claims should involve defense counsel.

**What is the difference between denying and delaying?** Denial means you have investigated and determined the claim is not compensable — you have a specific reason supported by evidence. Delay means you have not yet completed your investigation and need more time. Delay is appropriate when you are genuinely waiting for material information. Delay is NOT appropriate as a strategy to avoid making a difficult determination. DOI auditors and WCAB judges can distinguish between genuine investigative delay and delay-as-strategy, and the latter exposes the carrier to penalties under LC 5814 and Ins. Code 790.03(h)(5).

**What happens if the 90-day presumption period passes without a denial?** Under LC 5402(b), if the claim is not denied within 90 days of the employer's date of knowledge of injury, the claim is presumed compensable. This presumption is rebuttable — the carrier can still attempt to prove non-compensability — but the burden of proof shifts to the carrier. This is a significantly harder legal position. Missing the 90-day window is one of the most costly mistakes an examiner can make. AdjudiCLAIMS tracks this deadline with maximum-priority alerts, but ultimately it is your responsibility to ensure a timely determination.

### Common Mistakes

**Mistake 1: Denying without documenting the investigation.** An examiner reviews a claim where the injured worker alleges a back injury from lifting. The employer says the worker was not lifting that day. The examiner denies the claim based on the employer's account alone, without contacting the injured worker, reviewing medical records, or investigating further. At the WCAB, the Workers' Compensation Judge finds the denial was issued without a reasonable investigation under Ins. Code 790.03(h)(4). Benefits are ordered, LC 5814 penalties are imposed, and the file is flagged for DOI audit. The investigation must support the denial, not vice versa.

**Mistake 2: Letting the 90-day presumption period pass unnoticed.** An examiner is handling 150 open claims. A complex claim with disputed causation lands on their desk. The investigation is ongoing — waiting for medical records, waiting for an employer's witness statement. The examiner does not track the 90-day deadline independently. On Day 91, the presumption attaches. The carrier now must prove the claim is not compensable rather than the worker proving it is. The claim that might have been defensibly denied now becomes expensive to litigate. The fix: track every deadline, send delay letters, and make a determination before the 90-day backstop.

**Mistake 3: Making a coverage determination that requires legal analysis without consulting counsel.** An examiner handles a claim involving cumulative trauma from years of repetitive keyboard use. The injured worker alleges carpal tunnel syndrome. Two prior employers may share liability. Apportionment under LC 4663 and LC 4664 applies. The examiner, trying to be efficient, analyzes the apportionment issues, determines the current employer's share, and issues a partial acceptance. The problem: apportionment analysis requires application of case law (Benson, Escobedo, Vigil), which constitutes legal analysis. The examiner's determination may be incorrect and may expose the carrier to additional liability. This should have been referred to defense counsel.

### Escalation Points

- **Any denial:** Best practice is to have all denials reviewed by a supervisor before issuance. For non-routine denials (disputed causation, complex medical, cumulative trauma), defense counsel review is strongly recommended.
- **90-day presumption approaching with incomplete investigation:** Escalate immediately to supervisor. A decision must be made before the presumption attaches — either deny based on available evidence or accept the claim.
- **Claim involves legal issues beyond factual determination:** Cumulative trauma, apportionment, third-party liability, fraud, serious and willful misconduct, policy coverage disputes — these require defense counsel. Prepare a factual summary using AdjudiCLAIMS and refer.
- **Conflicting medical opinions on causation:** When one physician says the injury is work-related and another says it is not, you need a QME or AME evaluation to resolve the dispute (see Workflow 6). Do not make the coverage determination based on your own assessment of which physician is more credible — that is a medical-legal question.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Investigation review conducted | Date, items reviewed, gaps identified | 8 CCR 10109 |
| Compensability assessment documented | Examiner's factual analysis by element (occurrence, AOE, COE) | Ins. Code 790.03(h)(4), (h)(5) |
| Legal complexity flags triggered | Specific indicators identified, whether counsel was consulted | B&P 6125 (UPL compliance) |
| Acceptance letter issued | Date, body parts accepted, benefits authorized | 10 CCR 2695.7(b) |
| Denial letter issued | Date, reasons, factual basis, policy provisions cited, right-to-dispute notice | 10 CCR 2695.7(h); Ins. Code 790.03(h)(14) |
| Delay letter issued | Date, reason for delay, information awaited, expected timeline | 10 CCR 2695.7(c) |
| Counsel consulted | Date, reason, counsel name, recommendation received | UPL compliance; Ins. Code 790.03(h)(14) |
| Reserves updated | Date, new amounts, rationale for change | Carrier financial reporting |

---

## Workflow 4: TD Benefit Initiation and Ongoing Payment

**Regulatory Trigger:** Employer knowledge of a work injury where the injured worker is losing wages due to the industrial injury. Under LC 4650(d), TD payments must begin within 14 days of employer knowledge even if the investigation is not complete and the claim has not been accepted or denied. This is one of the most aggressively enforced deadlines in California workers' compensation.

**Primary Authority:** LC 4650 (14-day first payment), LC 4650(b) (subsequent biweekly payments), LC 4650(c) (10% self-imposed penalty for late payment), LC 4650(d) (payment during investigation), LC 4653 (TD rate calculation), LC 4654 (104-week aggregate cap)

**Key Deadlines:**
- First TD payment: **14 calendar days** from employer knowledge of injury and disability (LC 4650)
- Subsequent TD payments: **Every 14 days** thereafter (LC 4650(b))
- Late payment penalty: **10% automatic self-imposed increase** if any payment is late (LC 4650(c))
- Maximum TD duration (non-specified injuries): **104 compensable weeks** within 2 years from first payment (LC 4654)

**UPL Zone:** GREEN — TD calculation is statutory arithmetic. The rate is determined by a formula in the Labor Code, not by legal analysis. Calculating 2/3 of Average Weekly Earnings, applying statutory minimums and maximums, and determining the payment schedule are mathematical operations.

**Tier 1 (Dismissable):** Temporary Disability (TD) benefits are wage replacement payments made to an injured worker who cannot work — or cannot work at full capacity — due to a work injury. The purpose of TD is to replace a portion of the worker's lost wages while they recover. "Temporary" means the disability is expected to improve with medical treatment — it is not permanent. TD benefits continue until the worker returns to work, reaches Maximum Medical Improvement (MMI) — the point where the condition is stable and unlikely to improve further with treatment — or hits the 104-week statutory cap, whichever comes first. The TD rate is 2/3 of the worker's Average Weekly Earnings (AWE), subject to statutory minimum and maximum amounts that change each year. The critical thing to understand is that TD payments must begin within 14 days of the employer learning about the injury — even if you have not finished your investigation and even if you have not yet decided whether to accept or deny the claim. The legislature decided that injured workers should not bear the financial burden of the insurer's investigation timeline.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Determine employer's date of knowledge.** This is the date the employer first learned that the employee was injured at work AND that the employee is losing wages (off work or on reduced duty) due to the injury. Both elements must be present — the employer must know about the injury and about the wage loss. | LC 4650; LC 5402(a) | Extracts employer knowledge date from DWC-1 and employer contact data. Flags discrepancies between DWC-1 date and employer-reported date. Calculates the 14-day deadline from the confirmed knowledge date. | The actual date of employer knowledge, which may differ from the claim form date. You must confirm this with the employer during the three-point contact. | Day 0 — confirmed during Workflow 2 (Three-Point Contact). |
| 2 | **Verify wage loss.** Confirm that the injured worker is actually losing wages. Is the worker off work entirely? On modified duty at reduced hours or pay? Has the employer provided any salary continuation? TD is only payable when there is actual wage loss due to the industrial injury. | LC 4650 (applies when employee suffers wage loss); LC 4600 (medical treatment may result in work restrictions causing wage loss) | Extracts work status from medical reports and physician contact notes. Identifies whether the treating physician has placed the worker off work or on work restrictions that the employer cannot accommodate. | Whether the worker is actually suffering wage loss. Whether modified duty eliminates or reduces the wage loss. Whether salary continuation offsets TD (this is a carrier-specific policy question). | Confirmed during Workflow 2 and updated as medical reports are received. |
| 3 | **Calculate Average Weekly Earnings (AWE).** AWE is the basis for the TD rate. Under LC 4453, AWE is generally calculated using the worker's earnings for the 52 weeks prior to the date of injury. Gather wage records from the employer: pay stubs, W-2, payroll records. Include overtime, bonuses, and other regular compensation. | LC 4453 (AWE calculation methods); LC 4453(a)-(d) (specific calculation scenarios) | Calculates AWE from employer-provided wage data using the statutory formula. Applies the correct calculation method based on employment duration and pattern. Shows the calculation step-by-step with source data citations. | Whether the wage data is complete and accurate. Whether overtime and other compensation should be included (generally yes, if regular). Whether the standard AWE calculation method applies or a special method is needed (seasonal worker, concurrent employment, etc.). | Before first TD payment — by Day 10 at the latest. |
| 4 | **Calculate the TD rate.** The TD rate is 2/3 of AWE, subject to the statutory minimum and maximum. The minimum and maximum change annually — use the rates in effect on the date of injury. | LC 4653 (TD rate = 2/3 of AWE); LC 4653(c)-(d) (minimum and maximum rates) | Calculates the TD rate from AWE. Applies the correct statutory minimum and maximum for the date of injury year. Displays the calculation: AWE x 2/3 = rate, bounded by min/max. Shows the exact minimum and maximum in effect for the injury date. | Whether the calculated rate is correct — review the source wage data and calculation. Whether any adjustments are needed (e.g., concurrent employment earnings, tips not reflected in pay stubs). | Before first TD payment — by Day 10 at the latest. |
| 5 | **Issue first TD payment.** The first payment covers the period from the first day of disability through the payment date. TD benefits begin on the first day the worker loses wages due to the injury. The first 3 days of disability are a "waiting period" that is not compensable UNLESS the disability extends beyond 14 days, in which case the waiting period is retroactively compensated. | LC 4650 (first payment within 14 days); LC 4652 (3-day waiting period); LC 4652.5 (waiting period retroactively paid if disability exceeds 14 days) | Calculates the first payment amount based on TD rate and disability period. Accounts for the waiting period (excludes first 3 days unless disability exceeds 14 days, then includes retroactive payment). Generates payment voucher with rate breakdown. | Whether to issue the payment — you must unless there is a clear basis to dispute disability. Whether the disability start date is correct based on medical evidence. | Within 14 calendar days of employer knowledge. No exceptions. |
| 6 | **Set up recurring biweekly payments.** After the first payment, TD payments must be made every 14 days. Payments must be mailed or delivered on the date due — not initiated on the date due. | LC 4650(b) (every 14 days); LC 4650(c) (10% penalty for late payments) | Sets up automated recurring payment schedule. Calculates each payment date. Sends advance reminders before each payment is due. Flags any payment that is approaching its due date without being processed. | Whether the payment schedule is correct. Whether any changed circumstances (return to work, modified duty, new medical information) require adjusting or stopping payments. | Every 14 days after the first payment, ongoing. |
| 7 | **Monitor for termination events.** TD benefits stop when one of several conditions occurs: the worker returns to full duty, the worker reaches Maximum Medical Improvement (MMI), the worker hits the 104-week cap (LC 4654), or the worker refuses a valid offer of modified work. Track all of these conditions. | LC 4656 (conditions for TD termination); LC 4654 (104-week cap); LC 4658 (vocational rehabilitation) | Tracks cumulative weeks of TD paid against the 104-week cap. Monitors medical reports for MMI determinations and return-to-work releases. Alerts you when the cap is approaching. Calculates the projected cap-out date. | When to stop TD payments — this requires a valid basis. A physician's return-to-work release, an MMI determination, or reaching the statutory cap. Stopping TD without a valid basis exposes the carrier to LC 5814 penalties. | Ongoing — monitored throughout the life of the TD benefit. |

### Decision Points

**Must you pay TD if you plan to deny the claim?** Yes. Under LC 4650(d), TD must begin within 14 days of employer knowledge of injury and disability, even if the investigation is not complete. If you subsequently deny the claim, you can seek reimbursement of the TD payments made during the investigation period, but you cannot withhold initial payments pending your investigation. This is one of the most counterintuitive rules for new examiners, and one of the most important.

**What happens when the 3-day waiting period applies?** Under LC 4652, the first 3 calendar days of disability are a "waiting period" and are not initially compensable. However, under LC 4652.5, if the disability extends beyond 14 calendar days, the waiting period becomes retroactively compensable — you must go back and pay for those first 3 days. AdjudiCLAIMS tracks this automatically and generates the retroactive payment when the 14-day threshold is crossed.

**What is the 10% self-imposed penalty?** Under LC 4650(c), if any TD payment is not made within 14 days from the date it is due, the amount of the payment must be increased by 10%. This penalty is "self-imposed" — meaning YOU must add it to the payment automatically. You do not wait for someone to complain or for the WCAB to order it. The penalty is owed the moment the payment is late. AdjudiCLAIMS tracks payment timeliness and calculates the penalty amount if a payment is late.

**When does MMI stop TD?** Maximum Medical Improvement (MMI) means the worker's condition has stabilized and is not expected to improve further with medical treatment. Once the treating physician or a QME/AME determines the worker has reached MMI, the temporary disability period ends and any remaining disability is classified as permanent. The transition from TD to PD is a medical determination, not a legal one — but if the determination is disputed, it may require a QME/AME evaluation (see Workflow 6).

### Common Mistakes

**Mistake 1: Missing the 14-day first payment deadline.** A new examiner receives a claim and begins the investigation diligently. The three-point contact is done, medical records are requested, the file is well-organized. But the examiner does not realize that the TD payment clock started on the employer's knowledge date, which was 10 days before the claim form arrived. By the time the examiner calculates the TD rate and processes the first payment, it is Day 20 from employer knowledge — six days late. The 10% self-imposed penalty applies to the first payment. The fix: calculate employer knowledge date on Day 0 and start the TD clock immediately.

**Mistake 2: Stopping TD without a valid basis.** An examiner is handling a claim where the injured worker has been off work for eight weeks with a back injury. The examiner has not received a medical report in three weeks and assumes the worker must be better by now. The examiner stops TD payments. The worker's attorney files a petition for penalties. At the WCAB, the judge finds there was no medical release, no MMI determination, and no valid basis for stopping TD. LC 5814 penalties are imposed (up to 25% increase on all delayed payments). The fix: TD stops only when there is a documented basis — a physician's release, an MMI determination, or the statutory cap. Never stop TD based on assumptions.

**Mistake 3: Using the wrong AWE.** An examiner calculates AWE using only the worker's base hourly rate times 40 hours. But the worker regularly worked 10 hours of overtime per week, and had a monthly production bonus. The TD rate is calculated too low, and the worker is underpaid. When the error is discovered, the carrier must pay all back-owed TD plus the 10% penalty for each underpayment. The fix: gather complete wage records for the 52 weeks before injury and include all regular compensation.

### Escalation Points

- **Cannot determine AWE from available wage records.** If the worker was employed less than 52 weeks, had irregular hours, held concurrent employment, or was self-employed, the AWE calculation may require a non-standard method under LC 4453(b)-(d). Consult your supervisor or defense counsel.
- **Worker disputes the TD rate.** If the worker or their attorney contends the TD rate is incorrect, review the calculation and wage data. If you cannot resolve the dispute, the rate may need to be determined by the WCAB.
- **Worker is approaching the 104-week cap.** Notify your supervisor so the claim can be evaluated for permanent disability, vocational rehabilitation, or settlement before TD ends.
- **Employer offers modified work and worker refuses.** This may be a basis for stopping or reducing TD, but it involves legal analysis (is the modified work within the physician's restrictions? Is it a reasonable offer?). Consult defense counsel before stopping TD based on a refused offer.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Employer knowledge date confirmed | Date, source of confirmation, who confirmed | LC 4650; LC 5402(a) |
| Wage loss verified | Work status, medical restrictions, wage loss type | LC 4650 |
| AWE calculated | Wage data sources, calculation method, result | LC 4453 |
| TD rate calculated | AWE, rate, applicable min/max, date of injury year | LC 4653 |
| First TD payment issued | Date, amount, period covered, method | LC 4650 |
| Each subsequent TD payment | Date, amount, period covered, on-time status | LC 4650(b) |
| Late payment penalty applied | Payment date, due date, penalty amount | LC 4650(c) |
| TD termination event | Date, basis (RTW, MMI, cap), supporting documentation | LC 4656; LC 4654 |

---

## Workflow 5: UR Treatment Authorization

**Regulatory Trigger:** Receipt of a Request for Authorization (RFA) from the injured worker's treating physician requesting approval for a specific medical treatment, test, referral, or procedure. Under LC 4610, every insurer must have a Utilization Review (UR) program to evaluate the medical necessity of requested treatments.

**Primary Authority:** LC 4610 (UR requirement), CCR 9792.6-9792.12 (UR standards and procedures), MTUS/ACOEM guidelines (evidence-based treatment standards), LC 4610.5 (penalties for UR violations)

**Key Deadlines:**
- Prospective review decision (treatment not yet provided): **5 business days** from receipt of RFA (CCR 9792.9.1(c)(3))
- Concurrent review decision (treatment in progress): **Within 24 hours** for urgent requests; 5 business days for non-urgent (CCR 9792.9.1(c)(4))
- Retrospective review decision (treatment already provided): **30 calendar days** from receipt of information necessary for decision (CCR 9792.9.1(c)(2))
- Notify requesting physician of decision: **Within 24 hours** of the decision (CCR 9792.9.1(e))
- If incomplete RFA, request additional information: **Within 1 business day** of receipt (CCR 9792.9.1(c)(1))

**UPL Zone:** GREEN — Utilization Review is a medical-clinical process, not a legal one. The UR decision is based on evidence-based medical guidelines (MTUS/ACOEM), not legal analysis. The examiner coordinates the UR process; a licensed physician reviewer makes the medical necessity determination.

**Tier 1 (Dismissable):** Utilization Review (UR) is the process of evaluating whether a requested medical treatment is medically necessary under evidence-based guidelines. When a treating physician wants to perform a surgery, order an MRI, prescribe a medication, or provide any treatment to an injured worker, they submit a Request for Authorization (RFA). The insurer reviews this request against the Medical Treatment Utilization Schedule (MTUS) — California's official evidence-based treatment guidelines based on the ACOEM (American College of Occupational and Environmental Medicine) Practice Guidelines. If the treatment aligns with the guidelines, it is approved. If it does not, a UR physician reviewer explains why and the treating physician can modify the request or the worker can dispute the decision through Independent Medical Review (IMR). The examiner does not make the medical necessity decision — a licensed UR physician reviewer does. Your role is to receive the RFA, ensure it is routed through the UR process correctly, and communicate the decision. There are three types of UR review depending on timing: prospective (treatment not yet provided), concurrent (treatment in progress), and retrospective (treatment already provided and provider is seeking payment).

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Receive and log the RFA.** When a treating physician submits a Request for Authorization, log it immediately. Record the date of receipt, the requesting physician, the specific treatment requested, and the diagnosis it is related to. The date of receipt starts the deadline clock. | CCR 9792.9.1(c) (timeframes begin on receipt); LC 4610 | Auto-logs RFA receipt when uploaded. Extracts the treatment type, diagnosis, requesting physician, and procedure codes using document classification and field extraction. Starts the UR deadline clock based on review type (prospective, concurrent, or retrospective). | Whether the RFA is complete. Does it contain the treatment description, diagnosis, supporting clinical information, and physician contact information? If incomplete, you must request additional information within 1 business day. | Day 0 — the day you receive the RFA. |
| 2 | **Determine the review type.** Classify the RFA as prospective (treatment not yet rendered), concurrent (treatment currently in progress — e.g., continuation of physical therapy sessions already begun), or retrospective (treatment already provided and the provider is billing for it). The review type determines the deadline. | CCR 9792.9.1(c)(2)-(4) | Classifies the review type based on treatment dates and RFA context. Applies the correct deadline: 5 business days for prospective, 24 hours for urgent concurrent, 30 days for retrospective. | Whether the system's classification is correct. In ambiguous cases (e.g., the treatment date is today), you may need to make a judgment call on the review type. | Immediately upon receipt — this determines the deadline. |
| 3 | **Match against MTUS/ACOEM guidelines.** Compare the requested treatment to the California Medical Treatment Utilization Schedule. The MTUS is the presumptively correct standard for treatment in CA workers' comp — if the treatment is consistent with MTUS guidelines for the diagnosed condition, the presumption is that it is medically necessary. If it deviates, the burden shifts to the requesting physician to justify the deviation. | LC 4604.5 (MTUS as presumptive standard); CCR 9792.8 (medically-based criteria) | Matches the requested treatment against MTUS/ACOEM guidelines for the specific diagnosis. Identifies whether the treatment aligns with guidelines, partially aligns, or deviates. Highlights relevant MTUS sections and recommendations. Documents the basis for the match or mismatch. | Nothing at this step — this is informational. The MTUS match informs the UR physician reviewer's decision, not yours. Your role is to ensure the UR reviewer has this information. | Within 1-2 business days of receipt. |
| 4 | **Route to UR physician reviewer.** Forward the RFA, supporting medical records, and MTUS analysis to the licensed physician who will make the medical necessity determination. Under LC 4610, UR decisions must be made by a licensed physician. The examiner does not make medical necessity determinations. | LC 4610 (UR by physician); CCR 9792.7 (UR reviewer qualifications) | Packages the RFA, claim medical history, and MTUS match analysis for the UR reviewer. Tracks routing date and expected decision date. | Whether the RFA package is complete before routing. Whether additional medical records from the claim file should be included for the reviewer's consideration. | Within 1-2 business days of receipt — leaving the reviewer sufficient time for the 5-day deadline. |
| 5 | **Issue the UR determination.** Once the UR physician makes their decision (approve, modify, or deny), communicate the decision to the requesting physician, the injured worker, and the worker's attorney (if represented). The decision letter must include specific elements defined by regulation. | CCR 9792.9.1(e) (notification requirements); CCR 9792.9.1(f) (decision letter contents) | Generates the decision notification letter with all required elements: the specific treatment requested, the decision, the clinical basis, the MTUS citation, the reviewer's identity, and IMR appeal rights (if denied or modified). Routes notification to all required parties. | Whether the decision letter accurately reflects the UR reviewer's determination. Whether any additional communication is needed with the treating physician. | Within 24 hours of the reviewer's decision (CCR 9792.9.1(e)). |
| 6 | **Handle disputes — IMR referral.** If the RFA is denied or modified, the injured worker or treating physician may request an Independent Medical Review (IMR). IMR is an independent, external review by a physician not employed by or contracted with the insurer. The examiner must facilitate the IMR process — it is not optional. | LC 4610.5 (IMR process); LC 4610.6 (IMR determination is binding) | Generates IMR referral documentation. Packages the claim file, RFA, UR decision, and all supporting medical records for the IMR organization. Tracks IMR timelines. | Nothing — IMR is mandatory when requested. Your role is to facilitate, not to decide whether the worker is entitled to IMR. | When requested by the injured worker or physician after a UR denial or modification. |

### Decision Points

**What is the difference between prospective, concurrent, and retrospective review?**
- **Prospective review:** The physician is asking for approval BEFORE providing the treatment. This is the most common type. Deadline: 5 business days. Example: The physician wants to schedule an MRI. They submit an RFA. You have 5 business days to get a UR decision.
- **Concurrent review:** The physician is asking for approval to CONTINUE treatment that is already in progress. Deadline: 24 hours for urgent requests, 5 business days for non-urgent. Example: The worker is in the middle of a 12-session physical therapy course, and the physician wants to extend it by 12 more sessions.
- **Retrospective review:** The treatment has ALREADY been provided, and the physician is submitting the RFA after the fact (often with the billing). Deadline: 30 calendar days. Example: The worker went to the emergency room and received treatment. The ER submits records and bills.

**What happens if the UR deadline is missed?** Under LC 4610.5, failure to complete UR within the required timeframes can result in the requested treatment being deemed authorized. This means the treatment is approved by default because you missed the deadline. Additionally, the DWC can impose administrative penalties for UR timeline violations. Missing a UR deadline is both operationally and financially damaging — the treatment is approved regardless of medical necessity, and the carrier may face penalties on top of the treatment cost.

**Can the examiner override a UR physician's denial?** The examiner can authorize treatment even when the UR physician recommends denial. Authorization is the examiner's business decision (paying for the treatment). However, the examiner cannot DENY treatment that the UR physician recommended approving. The UR process is a floor, not a ceiling — you can always authorize more than the UR physician recommends, but you cannot authorize less. In practice, overriding a UR denial is a business decision typically made at the supervisor level.

### Common Mistakes

**Mistake 1: Sitting on an RFA without logging it.** An examiner receives an RFA by fax on Monday. The examiner is busy and does not look at it until Wednesday. The 5-business-day clock started on Monday (when the fax was received), not Wednesday (when the examiner read it). Two days of the deadline are already gone. If the UR decision is not communicated by end of day the following Monday, the deadline is missed and the treatment may be deemed authorized. The fix: log every RFA immediately upon receipt — even before you review it.

**Mistake 2: Making the medical necessity decision yourself.** A new examiner receives an RFA for an MRI of the lumbar spine. The examiner reads the MTUS guidelines and sees that MRIs are recommended after 6 weeks of conservative treatment failure. The worker has only been treating for 3 weeks. The examiner denies the RFA directly, without routing it to a UR physician reviewer. This violates LC 4610 — the medical necessity determination must be made by a licensed physician, not by the examiner. The examiner's role is to facilitate, not to decide.

**Mistake 3: Forgetting to include IMR appeal rights in the denial letter.** The UR physician denies a treatment request. The examiner sends a denial letter but does not include information about the worker's right to request Independent Medical Review (IMR). Under CCR 9792.9.1(f), the decision notification must include information about the IMR process. Omitting it is a regulatory violation and delays the worker's access to the appeal process. AdjudiCLAIMS includes IMR information in every denial or modification letter by default.

### Escalation Points

- **Urgent concurrent review request.** If a treating physician indicates that a treatment is urgently needed for a condition in progress, the UR decision must be made within 24 hours. Escalate immediately to ensure the UR physician reviewer is available within this timeframe.
- **Treatment request outside MTUS guidelines with clinical justification.** When a physician requests treatment that deviates from MTUS but provides a detailed clinical rationale, the UR reviewer must consider the specific facts of the case. Ensure the clinical justification is included in the UR package.
- **Repeated denials for the same treatment.** If a physician repeatedly submits RFAs for the same treatment that has been denied, and the IMR upholds the denial, consult your supervisor about whether further communication with the treating physician is appropriate.
- **Provider billing for unauthorized treatment.** If a provider renders treatment without prior authorization and then submits a bill, this is a retrospective review situation. Route it through UR normally, but flag it for your supervisor — repeated unauthorized treatment by a provider may require intervention.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| RFA received and logged | Date, time, requesting physician, treatment type, procedure codes | CCR 9792.9.1(c) |
| Review type classified | Prospective, concurrent, or retrospective; rationale | CCR 9792.9.1(c)(2)-(4) |
| MTUS guideline match | Treatment vs. MTUS findings, alignment assessment | LC 4604.5; CCR 9792.8 |
| Routed to UR physician | Date, reviewer name, package contents | LC 4610; CCR 9792.7 |
| UR decision issued | Decision (approve/modify/deny), clinical basis, reviewer identity | CCR 9792.9.1(e)-(f) |
| Decision notification sent | Date, recipients, method, IMR rights included | CCR 9792.9.1(e) |
| IMR requested | Date, requestor, disposition | LC 4610.5; LC 4610.6 |
| UR deadline tracking | All milestone dates, on-time/late status | LC 4610.5 |

---

## Workflow 6: QME/AME Process Management

**Regulatory Trigger:** A disputed medical issue that cannot be resolved by the treating physician's reports. Common triggers: disputed diagnosis, disputed causation (is the condition work-related?), disputed extent of disability (WPI rating), disputed work restrictions, disputed need for future medical treatment, or disputed MMI date. The process differs depending on whether the injured worker is represented by an attorney.

**Primary Authority:** LC 4060 (QME for unrepresented employees), LC 4061 (QME when represented employee and parties cannot agree on AME), LC 4062 (AME selection by mutual agreement), LC 4062.2 (AME panel request), CCR 31.1-31.9 (QME panel procedures)

**Key Deadlines:**
- QME panel request (unrepresented): Filed with DWC Medical Unit after dispute arises
- AME agreement attempt (represented): **Time varies** — parties negotiate; no statutory deadline for agreement but delays impact claim resolution
- QME panel request (represented, no AME agreement): Within **10 days** of failure to agree on AME (LC 4062.2)
- QME panel strike process: **Completed within 10 days** of receipt of panel (CCR 31.5)
- QME examination: **Within 60 days** of panel selection (CCR 36)

**UPL Zone:** YELLOW — The QME/AME process straddles the line between claims administration and legal strategy. Requesting an evaluation and coordinating logistics are administrative (GREEN). Selecting which medical issues to evaluate, framing the questions for the evaluator, and interpreting the legal implications of the evaluation report involve legal analysis that may require defense counsel (YELLOW). For represented claims, the AME selection process is a negotiation between the worker's attorney and defense counsel — the examiner participates on the carrier side but should coordinate with defense counsel on strategy.

**Tier 1 (Dismissable):** When a medical issue is in dispute — for example, the carrier's chosen physician says the injury is not work-related but the treating physician says it is — the Workers' Compensation system provides a process for obtaining an independent medical evaluation. There are two types of independent medical evaluators. A QME (Qualified Medical Examiner) is a physician certified by the DWC's Medical Unit who is assigned from a randomly generated panel of three physicians. An AME (Agreed Medical Examiner) is a physician that both sides — the injured worker (or their attorney) and the insurer — agree to select together. AMEs are generally preferred because both sides chose the doctor, which reduces disputes about the evaluator's neutrality. However, if the parties cannot agree on an AME, either side can request a QME panel from the DWC. The process for selecting the evaluator is different depending on whether the injured worker has an attorney.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Identify the disputed medical issue.** Clearly define what medical question needs to be resolved. Common disputes: causation (AOE/COE), diagnosis, temporary disability duration, permanent impairment rating (WPI), apportionment to pre-existing conditions, need for future medical treatment, MMI date. The more precisely you define the dispute, the more useful the evaluation will be. | LC 4060-4062 (evaluation triggered by medical dispute) | Identifies potential medical disputes by comparing medical reports in the claim file (e.g., treating physician says 15% WPI, employer's medical report says 8% WPI). Highlights discrepancies between medical opinions. | Whether a QME/AME evaluation is actually needed. Not every discrepancy requires an independent evaluation — sometimes the treating physician's opinion is accepted, or additional information resolves the dispute. | When a medical dispute is identified — could be during investigation, after UR, or during reserve review. |
| 2 | **Determine representation status.** Is the injured worker represented by an attorney? This is the single most important factor because it determines the entire evaluation pathway. Represented workers follow the AME process (attempt agreement, then QME panel if no agreement). Unrepresented workers go directly to the QME panel process. | LC 4060 (unrepresented); LC 4061-4062 (represented) | Displays the worker's representation status from the claim file. Activates the correct process pathway based on status. | Confirming representation status is current — it can change at any time during the claim. If the worker retains an attorney after you have already started the unrepresented process, the process changes. | Before initiating the evaluation process. |
| 3a | **Unrepresented path: Request QME panel from DWC.** File a QME panel request with the DWC Medical Unit, specifying the specialty needed (orthopedic, neurological, psychiatric, etc.) and the disputed medical issues. The DWC will return a panel of three QMEs in the requested specialty. | LC 4060 (unrepresented employee QME process); CCR 31.1 (panel request procedures) | Generates QME panel request form pre-populated with claim data and disputed issues. Identifies the appropriate medical specialty based on the body parts and conditions in dispute. Tracks the panel request status. | The medical specialty to request. The specific medical issues to list on the panel request. These define what the QME will evaluate. | After confirming the dispute cannot be resolved without independent evaluation. |
| 3b | **Represented path: Attempt AME agreement.** Contact the worker's attorney (or coordinate with your defense counsel to contact the applicant attorney) to propose AME candidates. The parties negotiate to agree on a single physician to serve as AME. In practice, each side proposes names and the parties work toward mutual acceptance. | LC 4062 (AME by agreement); LC 4062.1 (AME process) | Provides list of AME candidates based on specialty, location, and claim type. Tracks the AME negotiation timeline and correspondence. Does NOT recommend which AME to select — that is a strategic decision. | Which AME candidates to propose. Whether to accept the applicant attorney's proposed candidates. This involves strategy that should be coordinated with defense counsel. | After identifying the disputed issue. No statutory deadline, but unnecessary delay harms the claim. |
| 4a | **Unrepresented: Conduct QME panel strike.** The injured worker selects one QME from the three-name panel. Under CCR 31.5, the worker has the right to strike one name; the insurer strikes one name; and the remaining physician is the QME. The worker strikes first. | CCR 31.5 (QME panel strike procedures) | Tracks the strike process. Records which names are struck and by whom. Identifies the selected QME. Initiates scheduling. | Which physician to strike from the panel. Consider specialty expertise, location (for the worker's convenience), and physician reputation. | Within 10 days of receiving the panel (CCR 31.5). |
| 4b | **Represented: If no AME agreement, request QME panel.** If the parties cannot agree on an AME, either side can request a QME panel from the DWC. The represented-employee QME process is similar to the unrepresented process but involves the attorneys in the strike process. | LC 4062.2 (QME panel when no AME agreement) | Generates QME panel request. Tracks timeline from AME failure to panel request. | When to abandon AME negotiations and request a QME panel. Whether defense counsel should make this decision. | Within 10 days of failure to agree on AME (LC 4062.2). |
| 5 | **Schedule and coordinate the evaluation.** Contact the selected QME or AME to schedule the evaluation. Prepare and send the physician all relevant medical records and a cover letter identifying the disputed issues and the questions to be addressed. The worker must be notified of the appointment date, time, and location. | CCR 36 (examination scheduling — within 60 days); CCR 35 (medical record provision) | Generates the cover letter and record package for the evaluator. Compiles all medical records in the claim file organized chronologically. Provides a claim summary. Tracks the appointment date. | What records to include (generally all medical records — withholding records can bias the evaluation). How to frame the disputed issues in the cover letter (should be coordinated with defense counsel for represented claims). | QME exam within 60 days of selection (CCR 36). |
| 6 | **Receive and review the QME/AME report.** The evaluator will issue a written report addressing the disputed issues. The report will include findings on causation, diagnosis, disability rating, work restrictions, future medical treatment, and apportionment. Extract the key findings and update the claim file. | LC 4061 (QME report); LC 4062.3 (AME report weight) | Extracts key findings from the QME/AME report: WPI rating, causation opinion, apportionment findings, work restrictions, future medical recommendations. Organizes findings by disputed issue. Cites specific pages and passages. | How to use the report findings in your claim management. AME reports carry greater weight at the WCAB than QME reports (LC 4062.3). Whether the findings change your reserves, benefit calculations, or claim strategy. Whether defense counsel should review the report before you act on it. | Upon receipt of the report — typically 30-60 days after the evaluation. |

### Decision Points

**AME vs. QME: Why does it matter?** Under California law, an AME report carries significantly more weight at the WCAB than a QME report. Because both sides agreed to the physician, the WCAB gives great deference to the AME's findings. A QME report can be challenged more readily. For this reason, AME selection is a strategic decision that should involve defense counsel for represented claims. The right AME can significantly influence the outcome of the claim.

**How do QME/AME reports affect reserves?** The QME/AME report is often the most important piece of medical evidence in the claim. If the evaluator finds 20% WPI where you had reserved for 10%, your reserves are likely inadequate. If the evaluator finds no industrial causation, your claim may be closeable. After receiving the report, immediately review your reserves against the new findings (see Workflow 7).

**What if you disagree with the QME/AME findings?** As a claims examiner, you can note your concerns in the file and consult defense counsel about options. For QME reports, the defense counsel can take the QME's deposition to challenge findings, or request a supplemental report if issues were not adequately addressed. For AME reports, the options are more limited due to the deference given to AME findings. This is a legal strategy question — consult defense counsel.

### Common Mistakes

**Mistake 1: Requesting the wrong medical specialty.** An examiner handling a claim for a back injury requests a QME panel in internal medicine instead of orthopedic surgery. The internal medicine QME provides a report on the claimant's general health but lacks the specialized knowledge to assess the spinal condition properly. The report is of limited value, and the process must be restarted with the correct specialty — months of delay. The fix: match the QME specialty to the disputed medical condition.

**Mistake 2: Not sending complete medical records to the evaluator.** An examiner sends the QME the treating physician's reports but forgets to include the emergency room records from the date of injury, the pre-injury medical records that show a prior condition, and the employer's job description. The QME's report is based on incomplete information and may not address all the disputed issues. Either side can challenge the report on the basis of incomplete records. The fix: send ALL medical records in the claim file — favorable and unfavorable — to the evaluator.

**Mistake 3: Acting on a QME/AME report without counsel review in a represented claim.** An examiner receives a QME report in a represented (litigated) claim. The report is favorable to the carrier — it finds low WPI and significant apportionment. The examiner immediately adjusts reserves downward and sends a settlement offer based on the QME findings. But the applicant attorney had not yet received the report, and the examiner did not coordinate with defense counsel on how to use the findings. Defense counsel would have recommended waiting for the applicant's response and preparing a more strategic approach. The fix: for represented claims, always coordinate with defense counsel before acting on QME/AME findings.

### Escalation Points

- **Represented claim — AME selection.** Always coordinate with defense counsel. The AME selection is a strategic decision that can significantly influence claim outcomes.
- **QME/AME report contains apportionment findings.** Apportionment analysis involves legal principles (Benson, Escobedo, Vigil line of cases). The medical findings are factual, but applying apportionment legally requires counsel.
- **QME/AME report is inconsistent with the medical record.** If the evaluator's findings appear to contradict the medical evidence, defense counsel may recommend taking the physician's deposition or requesting a supplemental report.
- **Worker fails to attend QME appointment.** The worker's failure to attend may have procedural consequences. Consult with defense counsel on next steps.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Disputed medical issue identified | Issue description, triggering evidence, date identified | LC 4060-4062 |
| Representation status confirmed | Represented/unrepresented, attorney name if applicable | LC 4060 vs. LC 4061-4062 |
| QME panel requested | Date, specialty, disputed issues listed | LC 4060; CCR 31.1 |
| AME negotiation initiated | Date, candidates proposed, correspondence | LC 4062 |
| QME/AME selected | Physician name, selection method, date | CCR 31.5; LC 4062 |
| Medical records sent to evaluator | Date, record list, cover letter | CCR 35 |
| Evaluation appointment | Date, location, attendance status | CCR 36 |
| QME/AME report received | Date, key findings extracted, impact on claim | LC 4061; LC 4062.3 |
| Counsel consulted on findings | Date, counsel name, recommendations | UPL compliance |

---

## Workflow 7: Reserve Setting and Review

**Regulatory Trigger:** Three situations trigger reserve activity: (1) new claim intake — initial reserves must be set when the claim is established; (2) significant new information — a medical report, QME/AME evaluation, legal development, or other material event changes the expected claim outcome; (3) periodic review cycle — most carriers require reserves to be reviewed at regular intervals (typically every 90 days, though carrier policies vary).

**Primary Authority:** No specific California statute mandates reserve setting methodology. However, reserve adequacy directly impacts compliance with Ins. Code 790.03(h)(6) (duty to settle in good faith when liability is clear — adequate reserves are necessary to fund timely settlements) and affects the carrier's financial reporting obligations under NAIC accounting standards and California Insurance Code financial solvency requirements.

**Key Deadlines:**
- Initial reserves: **Within 48 hours** of claim receipt (carrier best practice — not a statutory deadline)
- Reserve review after significant event: **Within 5 business days** (carrier best practice)
- Periodic reserve review: **Per carrier policy** — typically every 90 days
- Financial reporting: **Quarterly and annual** per NAIC/DOI reporting requirements

**UPL Zone:** GREEN — Reserve setting is a financial and actuarial function, not a legal one. Estimating the cost of a claim based on injury severity, medical evidence, comparable data, and claim trajectory is business judgment. However, when reserve setting involves assessing the likely outcome of legal disputes (e.g., "What is the probability that the WCAB will find this claim compensable?"), it crosses into YELLOW territory. AdjudiCLAIMS provides factual data and statistical benchmarks; the legal outcome assessment is a question for defense counsel.

**Tier 1 (Dismissable):** Reserves are the insurance carrier's estimate of how much a claim will ultimately cost. When you set a reserve of $150,000 on a claim, you are telling the carrier's financial department to set aside $150,000 to pay this claim's benefits, medical treatment, legal costs, and any liens. Reserves are not payments — they are financial placeholders. They serve two purposes: (1) they ensure the carrier has enough money to pay claims when they come due (solvency), and (2) they provide data for actuarial analysis, pricing, and financial reporting. Reserve accuracy matters enormously. Under-reserving means the carrier does not have enough money set aside, which affects financial solvency and surprises management with adverse development. Over-reserving means the carrier is holding capital unnecessarily, which affects investment income and pricing. As an examiner, reserve setting is one of the most consequential judgment calls you make. There are four categories of reserves, each estimating a different cost component: indemnity (wage replacement and permanent disability payments), medical (treatment costs), legal expense (defense attorney fees and costs, also called ALAE — Allocated Loss Adjustment Expense), and liens (third-party claims against the workers' comp claim, such as medical provider liens or Employment Development Department liens for disability benefits advanced).

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | **Gather claim data for reserve estimation.** Collect the information needed to estimate claim cost: injury description, body parts, diagnosis, age and occupation of worker, pre-injury wages, medical treatment to date, work status, representation status, and any initial medical prognosis. | Carrier reserve guidelines; supports Ins. Code 790.03(h)(6) | Organizes all available claim data relevant to reserve estimation. Displays injury details, worker demographics, wage information, and medical findings in a reserve-focused summary. Identifies data gaps that may affect reserve accuracy. | Whether the available data is sufficient to set meaningful reserves. If critical data is missing (e.g., no medical diagnosis yet), you may need to set preliminary reserves and flag them for early review. | Initial reserves: within 48 hours of claim receipt. |
| 2 | **Assess injury severity and expected claim trajectory.** Based on the medical evidence and claim facts, estimate the likely trajectory: Will the worker recover quickly and return to work? Will there be permanent disability? Will litigation be involved? Will there be future medical treatment? Each scenario produces a different cost profile. | Carrier reserve guidelines | Provides statistical benchmarks for comparable claims based on injury type, body part, age, occupation, and jurisdiction. Shows ranges (low/expected/high) for each reserve category. Displays outcomes of similar historical claims if comparable data is available. | The expected trajectory — this is your professional judgment. The benchmarks inform your estimate but do not replace it. Two claims with identical injuries can have very different outcomes based on the specific facts. | Concurrent with Step 1 for initial reserves. |
| 3 | **Set indemnity reserves.** Estimate the total cost of wage replacement (TD) and permanent disability (PD) benefits. For TD: calculate the weekly TD rate times the expected number of weeks of disability. For PD: estimate the likely permanent impairment rating (WPI) and use the PD rate schedule to estimate the total PD payment. Include PD advances if applicable. | LC 4650-4657 (TD obligations); LC 4658-4664 (PD obligations); LC 4453 (AWE for rate calculation) | Calculates TD exposure based on the current TD rate and estimated disability duration. Estimates PD exposure based on comparable claims data and body-part-specific impairment ranges. Shows the statutory PD rate schedule for the worker's age and occupation. | The estimated disability duration for TD. The estimated WPI range for PD. These are judgment calls informed by the medical evidence and comparable claims. | Within 48 hours of claim receipt (initial); updated as medical evidence develops. |
| 4 | **Set medical reserves.** Estimate the total cost of medical treatment for the life of the claim. Consider: current treatment costs, expected future treatment (physical therapy, surgery, medications, DME), and whether the claim will have a lifetime medical award (many WC claims include ongoing medical rights). | LC 4600 (employer obligation to provide medical treatment) | Provides treatment cost benchmarks by injury type and body part. Estimates surgical costs if surgery is likely based on the diagnosis. Displays average medical costs for comparable claims. | The expected medical trajectory — will this claim involve surgery? Long-term medication? Chronic pain management? Future medical treatment over years or decades? | Concurrent with Step 3. |
| 5 | **Set legal expense (ALAE) reserves.** Estimate the cost of defense attorney fees and litigation costs. Factors: Is the worker represented by an attorney? Is litigation likely? What is the expected duration and complexity of litigation? What are the anticipated legal proceedings (depositions, MSC, trial)? | Carrier litigation guidelines; ALAE reporting requirements | Provides average ALAE benchmarks by claim complexity and litigation status. Estimates defense counsel costs based on typical fee schedules and expected proceedings. | Whether the claim will be litigated, and if so, how complex the litigation will be. Represented claims are almost always litigated. The complexity of the medical and legal issues determines ALAE exposure. | Concurrent with Steps 3-4. |
| 6 | **Set lien reserves.** Estimate the cost of third-party liens against the claim. Common liens: medical provider liens (for treatment provided outside the carrier's medical network), EDD liens (for state disability benefits the worker received), Medicare conditional payments, and hospital liens. | LC 4903 (types of liens); LC 4903.1 (lien filing requirements) | Identifies known liens from documents in the claim file. Provides average lien exposure benchmarks by claim type. Flags claims where EDD involvement is likely based on disability duration. | The expected lien exposure — which liens are likely to be filed and at what amount? This depends on the worker's treatment pattern, disability duration, and whether treatment was provided within the carrier's network. | Concurrent with Steps 3-5. |
| 7 | **Document reserve rationale.** For each reserve category, document the basis for your estimate: what data you considered, what comparable claims informed your judgment, and what assumptions you made. This documentation is essential for reserve reviews, audits, and financial reporting. | Carrier documentation requirements; actuarial audit standards | Generates a reserve summary showing all four categories, total incurred, and the data points that informed each estimate. Creates a dated reserve record for the audit trail. | Whether your rationale is complete and defensible. Could someone reviewing this file understand why you set the reserves where you did? | Immediately — reserves without documented rationale are meaningless. |
| 8 | **Schedule the next reserve review.** Set a calendar reminder for the next reserve review date. Reserves should also be reviewed immediately upon receipt of any significant new information (QME/AME report, litigation development, surgical outcome, settlement demand, new lien filing). | Carrier reserve review policy (typically every 90 days) | Schedules the next review date on your dashboard. Sets automatic review triggers for specific events (new medical report uploaded, new lien detected, litigation status change). | The review frequency for this specific claim. Complex, fast-moving claims may need monthly reviews. Stable claims on a payment schedule may follow the standard 90-day cycle. | Before closing the initial reserve-setting activity. |

### Decision Points

**How do you estimate disability duration for a brand-new claim?** At claim intake, you may have limited medical information — perhaps only the DWC-1 description and the employer's account. For initial reserves, use the diagnosis (if known) and body part as starting points. A minor soft tissue strain may resolve in 4-8 weeks. A herniated disc may result in 6-12 months of disability and possible surgery. A psychiatric claim may last years. Use the available medical information, comparable claims benchmarks, and your judgment. Initial reserves are estimates — they will be refined as more information becomes available. The key is to make a reasonable initial estimate, not to be precisely right.

**What is "adverse development" and why does it matter?** Adverse development occurs when actual claim costs exceed the reserves — meaning you underestimated the claim. The opposite is "favorable development." Carriers track adverse development closely because it affects financial statements, actuarial pricing, and management confidence in the claims operation. Persistent adverse development across an examiner's book of business may indicate a pattern of under-reserving that needs to be addressed. AdjudiCLAIMS tracks your reserve history against actual payments, so you can see your accuracy over time.

**When should reserves be zero?** Never on an open claim. Even a claim that you believe will cost nothing should carry a nominal reserve as long as it is open, because open claims carry risk. Only reduce reserves to zero when the claim is formally closed with no outstanding exposure. A claim with a pending denial should still carry reserves for the possibility that the denial is overturned.

**How do reserves affect settlement?** Reserves are the carrier's internal estimate — they are NOT disclosed to the applicant or their attorney. However, reserves directly affect your settlement authority. You can typically settle within your reserve authority without additional approval. A claim reserved at $50,000 limits your settlement flexibility to approximately that amount. If a fair settlement would be $75,000, you need to increase reserves first. Setting reserves too low constrains your ability to settle fairly and promptly, which can violate Ins. Code 790.03(h)(6).

### Common Mistakes

**Mistake 1: Setting reserves at the statutory minimum.** A new examiner is unsure how to estimate claim costs and sets all reserves at the minimum required by the carrier's system (e.g., $2,000 for indemnity, $5,000 for medical). Six months later, the claim has a surgical authorization, 20 weeks of TD, and a PD rating from the QME. The actual incurred cost is $180,000 against reserves of $7,000. The adverse development is severe, and the examiner's supervisor must explain the reserve deficiency to actuarial. The fix: spend time on the initial reserve estimate. Use the benchmarks, consider the diagnosis, and set a realistic estimate even if the information is limited.

**Mistake 2: Not updating reserves after significant events.** An examiner sets initial reserves of $75,000 on a shoulder claim. A QME report comes in with a WPI rating of 22%, much higher than the 10% the examiner assumed. The examiner reads the report, notes the findings, but does not adjust the reserves. Three months later, the applicant's attorney sends a settlement demand for $140,000. The reserves are still at $75,000. The examiner now needs to increase reserves by 87% to evaluate the demand, which triggers management review and questions about why the QME findings were not reflected in the reserves when received. The fix: every significant new piece of information should trigger a reserve review.

**Mistake 3: Not reserving for legal expense on a represented claim.** An examiner has a claim where the injured worker has retained an attorney. The examiner sets reserves for indemnity and medical but sets ALAE at zero because defense counsel has not been assigned yet. The claim is almost certainly going to litigation — the worker has an attorney, there is a disputed medical issue, and the claim is complex. ALAE exposure is real. The fix: if the worker is represented, assume litigation costs. Set ALAE reserves based on expected litigation complexity.

### Escalation Points

- **Total incurred exceeds your reserve authority.** Most carriers set authority levels — examiners can set reserves up to a certain amount (e.g., $100,000), and claims above that threshold require supervisor or manager approval. Know your authority level and escalate when needed.
- **Reserve decrease of more than 50%.** A dramatic reserve decrease may indicate a change in claim trajectory that your supervisor should be aware of. It could also indicate an initial over-reserve that should be discussed.
- **Adverse development pattern across your book.** If you notice that your reserves are consistently inadequate across multiple claims, discuss this with your supervisor. It may indicate a systematic estimating bias that can be corrected.
- **Settlement demand significantly exceeds reserves.** When an applicant attorney sends a settlement demand that is far above your reserves, this is a signal to reassess the claim with fresh eyes and possibly with defense counsel input. Either the demand is unreasonable or the reserves are inadequate — determine which.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulatory Basis |
|-------|--------------|-----------------|
| Initial reserves set | Date, amounts by category (indemnity, medical, ALAE, lien), rationale, data sources | Carrier financial reporting |
| Reserve review conducted | Date, trigger (periodic/event), prior amounts, new amounts, rationale for change or confirmation | Carrier audit standards |
| Reserve adjustment | Date, old amounts, new amounts, triggering event, examiner rationale | Carrier financial reporting; supports Ins. Code 790.03(h)(6) |
| Reserve authority escalation | Date, amount, approving authority, approval documentation | Carrier authority matrix |
| Adverse/favorable development | Comparison of reserves to actual paid, variance analysis | Actuarial reporting requirements |

---

*Workflows 8+ continue in subsequent sections of this document.*

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
## Workflow 8: Counsel Referral Decision

**Regulatory Trigger:** Litigation trigger detected -- applicant retains attorney, claim denied, medical dispute arises, or complex legal issue identified (cumulative trauma, apportionment, subrogation, fraud)
**Primary Authority:** Ins. Code 790.03(h)(6) (good faith claims handling); B&P Code 6125 (unauthorized practice of law prohibition)
**Key Deadlines:** No statute mandates a specific referral timeline, but delayed referral while legal issues are active risks bad faith exposure under Ins. Code 790.03(h)(6) and may result in the examiner inadvertently practicing law in violation of B&P 6125
**UPL Zone:** YELLOW -- The decision to refer is the examiner's business judgment (GREEN), but the underlying legal issues that trigger the referral are in YELLOW/RED territory. AdjudiCLAIMS identifies triggers factually but does NOT analyze the legal issues themselves.

**Tier 1 (Dismissable):** "Defense counsel" (also called "panel counsel") is the attorney hired by the insurance carrier to represent its interests in a litigated workers' compensation claim. When a claim involves legal issues -- meaning questions that require a licensed attorney to analyze -- the examiner refers the claim to defense counsel. This is not a sign of failure; it is how the system is designed. The examiner handles facts, finances, and administration. The attorney handles legal strategy, legal analysis, and litigation. The line between these roles is enforced by California law: B&P Code Section 6125 makes it a misdemeanor for anyone other than a licensed attorney to practice law. "UPL" stands for Unauthorized Practice of Law. When AdjudiCLAIMS directs you to consult counsel, it is protecting you from crossing that line.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify litigation trigger | Ins. Code 790.03(h)(6); B&P 6125 | Flags trigger events: applicant attorney letter of representation received, claim denial issued, disputed QME/AME findings, cumulative trauma indicators, subrogation potential, fraud indicators | Whether the trigger warrants referral -- not every trigger requires immediate counsel involvement | Within 24-48 hours of trigger event |
| 2 | Assess claim complexity | CCR 10109 (investigation adequacy) | Claim complexity score based on factual indicators: number of body parts, treatment disputes, prior claims, multiple employers, lien count. Presented as data, not legal evaluation | Whether the complexity level requires legal guidance vs. continued examiner-level handling | Same business day as trigger identification |
| 3 | Determine whether to refer | Examiner business judgment | Referral decision checklist (factual triggers present/absent). Does NOT recommend whether to refer -- that is your call | Yes or no: does this claim need defense counsel? This is a non-delegable business decision | Promptly after assessment |
| 4 | Select panel counsel | Carrier litigation guidelines | Panel counsel directory filtered by venue, specialty, availability, and carrier billing guidelines. Factual data only | Which attorney to assign -- based on your knowledge of the attorneys, the claim's needs, and carrier preferences | Same day as referral decision |
| 5 | Prepare factual claim summary | Ins. Code 790.03(h)(14) (explanation of basis) | Auto-generated factual summary: claim chronology, medical record highlights, investigation status, benefit payment history, reserve position, open issues. All facts, zero legal analysis | Review the summary for accuracy and completeness before sending to counsel | Within 1-2 business days of referral decision |
| 6 | Communicate objectives to counsel | Examiner business judgment | Template for initial referral letter with factual sections pre-populated | What you want counsel to accomplish: investigate specific legal issues, prepare for hearing, evaluate settlement, defend denial. You set the business objectives; counsel develops legal strategy | Within 3 business days of referral decision |

### Decision Points

The referral decision is yours. No AI tool can make it for you, and no AI tool should analyze the underlying legal issues to help you decide. Here is what you weigh:

**Mandatory referral situations (carrier policy typically requires referral):**
- Applicant has retained an attorney (letter of representation received)
- You have denied compensability and the applicant contests the denial
- A Declaration of Readiness to Proceed (DOR) has been filed (the case is heading to the WCAB for a hearing)
- Suspected fraud requiring coordination with SIU and potential criminal referral

**Judgment-call situations (you assess whether counsel adds value):**
- Medical dispute between treating physician and QME -- you may handle through the UR/IMR process without counsel, or you may need counsel if the dispute has legal dimensions (e.g., the applicant challenges the QME selection process)
- Cumulative trauma with multiple employer exposure -- factual investigation is yours, but apportionment analysis across employers is a legal question
- Subrogation potential (third party caused the injury) -- factual investigation is yours, but pursuing the third-party claim is legal work
- Complex lien disputes where the validity of the lien is contested on legal grounds

**The examiner's role vs. the attorney's role after referral:**
You remain the claims manager. You set financial authority, approve budgets, direct business objectives, and make benefit payment decisions. Counsel provides legal advice, develops litigation strategy, appears at hearings, and negotiates legal issues. You do not take legal direction from AI -- you take it from counsel.

### Common Mistakes

**Mistake 1: Referring too late.** A new examiner receives a letter of representation from an applicant attorney on March 1. The examiner thinks, "I'll finish my investigation first and then refer." By March 20, the applicant's attorney has filed a DOR, requested a QME panel, and served discovery. The examiner is now scrambling to find defense counsel for a case that already has hearing dates. The investigation and the referral should have happened in parallel -- not sequentially.

**Mistake 2: Referring without a factual summary.** An examiner refers a claim to defense counsel with a one-line email: "Please handle this case." Counsel opens the file and has no context -- no claim chronology, no medical summary, no benefit payment history, no reserve position. Counsel spends three billable hours reviewing the entire file to understand what the examiner already knows. That is wasted ALAE (Allocated Loss Adjustment Expense -- the legal costs charged to the claim). A five-minute factual summary from the examiner saves hours of attorney time.

**Mistake 3: Trying to handle legal issues without counsel.** An examiner with five years of experience receives a cumulative trauma claim involving three employers over 10 years. The examiner starts analyzing which employer bears what share of liability -- that is apportionment analysis, which is a legal question. The examiner's analysis is UPL. The examiner should identify the factual exposure periods and refer the apportionment question to counsel.

### Escalation Points

- If you are unsure whether a trigger warrants referral, consult your claims supervisor -- not AdjudiCLAIMS. The referral decision is a business judgment that may involve considerations (budget, carrier philosophy, claim strategy) beyond what the AI can see.
- If a referred claim involves an emergency (e.g., applicant's attorney files for penalties for unpaid benefits while you are arranging counsel), authorize the benefit payment and document the reason. Do not let the referral process delay a payment that is otherwise due under LC 4650.
- If defense counsel provides advice that conflicts with your understanding of the claim facts, discuss it with counsel. You know the facts; counsel knows the law. Resolution comes from dialogue, not deference.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `litigation_trigger_identified` | Trigger type, date identified, source document ID | 7 years |
| `counsel_referral_decision` | Decision (refer/not refer), examiner ID, reasoning summary, date | 7 years |
| `panel_counsel_assigned` | Attorney name, firm, venue, assignment date | 7 years |
| `referral_summary_generated` | Summary document ID, generation timestamp, examiner review confirmation | 7 years |
| `counsel_objectives_communicated` | Communication date, method, objectives summary | 7 years |

---

## Workflow 9: Denial Issuance

**Regulatory Trigger:** Coverage determination to deny a claim or a component of a claim (compensability denial, treatment denial, benefit denial) after investigation is complete
**Primary Authority:** Ins. Code 790.03(h)(4) (no denial without investigation); Ins. Code 790.03(h)(14) (reasonable explanation required); 10 CCR 2695.7(h) (written denial requirements)
**Key Deadlines:** 40 calendar days from proof of claim to accept/deny (10 CCR 2695.7(b)); 90-day presumption window (LC 5402(b)) -- if compensability is not denied within 90 days of employer knowledge, the claim is presumed compensable
**UPL Zone:** YELLOW/RED -- AdjudiCLAIMS populates the factual basis for denial (GREEN). The legal reasoning supporting the denial is the examiner's determination, with counsel review required when legal issues are involved (YELLOW/RED). AI does NOT draft legal conclusions or recommend whether to deny.

**Tier 1 (Dismissable):** A "denial" is the formal written decision that a claim, or a specific benefit within a claim, is not covered under the workers' compensation policy. There are different types: a compensability denial says the injury itself is not work-related; a treatment denial says a specific medical treatment is not authorized; a benefit denial says a particular benefit (like temporary disability payments) is not owed. Every denial must be in writing, must explain the specific reasons for the denial, and must be based on a completed investigation. You cannot deny first and investigate later -- the investigation comes first, the denial comes second, and both must be documented in the claim file. A denial without investigation is a per se violation of Ins. Code 790.03(h)(4).

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Confirm investigation is complete | Ins. Code 790.03(h)(4); CCR 10109 | Investigation Checklist status: all required steps (three-point contact, medical records, wage verification) marked complete or documented as attempted. Flags any gaps | Whether the investigation supports a coverage determination -- the checklist shows completion, but adequacy is your judgment | Before drafting any denial |
| 2 | Document the factual basis for denial | 10 CCR 2695.7(h) | Factual summary of evidence supporting the denial: relevant medical findings, investigation results, applicable policy provisions, timeline of events. All sourced from claim documents with citations | Whether the factual basis is sufficient to support the denial. Ask yourself: "If a WCJ or DOI auditor read this file, would the evidence support this denial?" | Before drafting denial letter |
| 3 | Draft denial letter | 10 CCR 2695.7(h); Ins. Code 790.03(h)(14) | Denial letter template pre-populated with: claim identification, date of injury, claimant information, factual basis (from Step 2), applicable regulatory references, claimant's appeal rights. CRITICAL: The template populates facts. You provide the reasoning. AI does NOT write the "reason for denial" section | The specific language explaining WHY you are denying. This is your determination, not the AI's. If legal issues are involved, counsel drafts or reviews the reasoning | Within the 40-day window (10 CCR 2695.7(b)) |
| 4 | Legal review (when required) | B&P 6125; Ins. Code 790.03(h)(14) | Flags whether the denial involves legal issues that require counsel review (e.g., compensability disputes, apportionment, AOE/COE questions, coverage interpretation) | Whether to send the denial to counsel for review before issuance. For compensability denials on litigated claims, counsel review is strongly recommended | Before issuance -- do not delay the denial past the 40-day deadline waiting for counsel review; coordinate timing |
| 5 | Issue the denial | 10 CCR 2695.7(h) | Generates final denial letter for your review and signature. Tracks delivery method and date. Confirms all required elements are present (specific reasons, policy provisions, appeal rights) | Final review and approval. You sign the denial. You are responsible for its contents | Within 40-day window; before 90-day presumption deadline |
| 6 | Track appeal and response deadlines | LC 5402; 10 CCR 2695.7 | Sets follow-up reminders: applicant response window, DOR filing watch, potential penalty exposure if denial is overturned | How to respond if the denial is contested -- this typically triggers a counsel referral (see Workflow 8) | Ongoing after issuance |

### Decision Points

**The investigation-first rule is absolute.** Under Ins. Code 790.03(h)(4), you cannot deny a claim without conducting a reasonable investigation based on all available information. "All available information" means you reviewed evidence both for and against the claim -- not just the evidence supporting denial. If you denied because the injury "seems pre-existing" but never obtained medical records addressing causation, you have violated this statute.

**The UPL boundary on denial letters is critical.** AdjudiCLAIMS populates facts into the denial template: "The medical record from Dr. Smith dated 3/15/2026 states no objective findings of injury." That is a factual statement (GREEN zone). The denial reasoning -- "Based on the investigation, the claimed injury did not arise out of and in the course of employment because..." -- is the examiner's determination. If the reasoning involves legal analysis (interpreting policy language, applying case law, analyzing apportionment), counsel must be involved. AI does not draft legal reasoning for denial letters. Ever.

**Partial denials vs. full denials:** You can accept compensability but deny a specific treatment or benefit. Each denial -- whether full or partial -- requires its own written explanation with its own factual basis. A treatment denial based on UR must follow the UR process (LC 4610, CCR 9792.9) and is a separate workflow from a compensability denial.

### Common Mistakes

**Mistake 1: Denying without completing the investigation.** An examiner receives a claim and notices the injury description is vague -- "hurt my back at work." The examiner denies for "lack of evidence of industrial injury" without ever contacting the injured worker, the employer, or the treating physician. At the WCAB, the WCJ sees a denial with no investigation and orders benefits paid plus LC 5814 penalties (25% increase for unreasonable delay). The denial letter looked professional, but the file behind it was empty.

**Mistake 2: Letting the AI write the denial reasoning.** An examiner asks AdjudiCLAIMS, "Why should I deny this claim?" The system blocks the question (RED zone) because answering it would be legal analysis. The examiner reformulates: "Summarize the evidence in this claim file." The system provides a factual summary (GREEN zone). The examiner uses that summary as the factual basis and writes their own denial reasoning. That is the correct workflow. The facts come from the system; the reasoning comes from you or counsel.

**Mistake 3: Missing the 90-day presumption window.** An examiner has a claim under investigation. The 40-day DOI deadline passes, and the examiner sends a delay letter (correct). But the examiner loses track of the 90-day LC 5402(b) deadline. On day 91, the claim is presumed compensable. The examiner now has the burden of overcoming the presumption -- a much harder legal position. AdjudiCLAIMS tracks both deadlines independently, but the examiner must act on the alerts.

### Escalation Points

- If you are approaching the 90-day presumption deadline and your investigation is incomplete, escalate to your supervisor immediately. A decision must be made before the presumption attaches.
- If the denial involves a legal question you cannot resolve (coverage interpretation, apportionment, AOE/COE dispute), refer to defense counsel before issuing the denial. Do not guess at legal conclusions.
- If you are directed by a supervisor to deny a claim and you believe the investigation does not support the denial, document your concern in writing. Your individual compliance obligations under the Insurance Code do not disappear because a supervisor directed the action.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `investigation_completeness_check` | Checklist status at time of denial decision, gaps identified, examiner confirmation | 7 years |
| `denial_factual_basis_compiled` | Document IDs cited, factual summary generated, examiner review timestamp | 7 years |
| `denial_letter_drafted` | Template ID, factual sections auto-populated, reasoning sections (examiner-authored) flagged separately | 7 years |
| `legal_review_requested` | Whether counsel review was requested, counsel response date, modifications made | 7 years |
| `denial_issued` | Denial date, delivery method, recipient, claim component denied, statutory basis cited | 7 years |
| `appeal_deadline_set` | Response window dates, 90-day presumption status, follow-up reminders scheduled | 7 years |

---

## Workflow 10: Delay Notification

**Regulatory Trigger:** Claim approaching the 40-day accept/deny deadline under 10 CCR 2695.7(b) without a coverage determination, and the investigation is not yet complete
**Primary Authority:** 10 CCR 2695.7(c) (written delay notification every 30 days until determination)
**Key Deadlines:** First delay notification before the 40-day deadline expires; subsequent notifications every 30 calendar days thereafter until the claim is accepted or denied
**UPL Zone:** GREEN -- Delay notifications are procedural compliance correspondence. They state factual reasons for the delay and do not involve legal analysis.

**Tier 1 (Dismissable):** When you receive a workers' compensation claim, you have 40 calendar days to accept or deny it under DOI regulation 10 CCR 2695.7(b). But investigations are not always that fast -- you may be waiting for medical records, employer statements, or a sub rosa investigation report. The law does not require you to rush a decision with incomplete information. It does require you to tell the injured worker why the decision is taking longer than 40 days. That is what the delay notification does: it is a written letter to the claimant explaining (1) that you have not yet made a coverage determination, (2) why, and (3) what additional information you need. You must send one every 30 days until you make your decision. This requirement exists because the California Legislature determined that injured workers should not be left in the dark about why their claim is pending. They are often unable to work, their income has been disrupted, and they deserve to know what is happening.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify claims approaching the 40-day deadline | 10 CCR 2695.7(b) | Regulatory Deadline Dashboard highlights all claims with accept/deny deadlines approaching in the next 10 days. Color-coded urgency: green (>10 days), yellow (5-10 days), red (<5 days) | Which claims require delay notifications vs. which can be determined before the deadline | Review dashboard daily |
| 2 | Determine the reason for delay | 10 CCR 2695.7(c) | Investigation Checklist shows which steps are incomplete: pending medical records, awaiting employer statement, sub rosa not yet received, QME report pending | Whether the reason for delay is legitimate and documented. The reason must be specific, not boilerplate | Before drafting the notification |
| 3 | Draft delay notification letter | 10 CCR 2695.7(c) | Template pre-populated with: claim identification, date of injury, claimant name, date proof of claim received, specific reason for delay (from Step 2), what additional information is needed, expected timeline for determination if known | Review the letter for accuracy. Confirm the stated reason matches the actual status of the investigation | Before the 40-day deadline |
| 4 | Issue the notification to claimant | 10 CCR 2695.7(c) | Tracks delivery method, date sent, and recipient. Logs the notification in the claim file chronology | Approve and send the letter. Ensure it goes to the correct address | Before the 40-day deadline |
| 5 | Set 30-day follow-up | 10 CCR 2695.7(c) | Automatically sets a 30-day reminder for the next delay notification if the claim remains undetermined | Whether additional investigation steps need to be expedited to avoid repeated delays | Immediately after issuance |
| 6 | Repeat until determination | 10 CCR 2695.7(c) | Each 30-day cycle: re-checks investigation status, identifies updated reason for delay, generates new notification draft. Tracks cumulative delay period and total notifications sent | At each cycle: is the investigation now complete enough to make a determination? Every 30-day cycle is a decision point, not just a letter | Every 30 days |

### Decision Points

**The delay notification is not a substitute for making a decision.** The regulation permits delay when additional time is genuinely needed for investigation. It does not permit indefinite delay. Each 30-day cycle should be accompanied by active investigation progress. If you have sent three delay letters (90+ days) and the investigation has not materially progressed, something is wrong -- either the investigation is stalled and needs escalation, or you have enough information to make a determination and are avoiding the decision.

**Be specific about the reason.** The regulation requires you to state the reason for the delay. "Investigation ongoing" is not specific enough. "Awaiting medical records from Dr. Martinez requested on March 5, 2026" is specific. The delay notification should tell the claimant exactly what you are waiting for and, if possible, when you expect to have it.

**Watch the 90-day presumption deadline.** The delay notification process runs in parallel with the LC 5402(b) 90-day presumption window. Sending delay letters does NOT extend or toll the 90-day presumption period. If you reach day 89 and have not denied the claim, the presumption attaches on day 90 regardless of how many delay letters you sent. The delay letter is a DOI compliance tool; it does not affect the Labor Code presumption.

### Common Mistakes

**Mistake 1: Sending boilerplate delay letters.** An examiner uses the same generic language every 30 days: "We are continuing our investigation and will notify you of our decision." The DOI auditor reads three identical letters and cites the file for non-compliance because the letters do not state the specific reason for delay as required by 10 CCR 2695.7(c). Each letter must reflect the current status and the current reason.

**Mistake 2: Forgetting to send subsequent 30-day notifications.** An examiner sends the first delay letter on day 38. Good. But then the investigation drags on. Day 68 passes with no second letter. Day 98 passes with no third letter. Each missed 30-day cycle is a separate DOI audit violation. The examiner was focused on the investigation and forgot the notification cycle. AdjudiCLAIMS tracks these automatically, but the examiner must act on the reminders.

**Mistake 3: Confusing the delay letter with a denial.** A new examiner is unsure about a claim and writes a delay letter that says, "Based on our investigation to date, it appears this injury may not be work-related. We are continuing to investigate." That language implies a coverage opinion before the determination has been made -- it could be construed as a premature denial or as misleading the claimant about the status of the claim. The delay letter should state facts ("awaiting medical records") not opinions ("it appears the injury may not be work-related").

### Escalation Points

- If a claim has been in delay status for more than 90 days, escalate to your supervisor. Prolonged delay is both a DOI compliance risk and a potential bad faith indicator.
- If the investigation is delayed because a third party (physician, employer, medical records provider) is unresponsive, document your follow-up attempts and escalate to your supervisor for assistance. The carrier may need to use alternative methods to obtain the information.
- If you realize a delay notification was not sent on time, send it immediately, document the late issuance in the claim file, and notify your supervisor. Late is better than never, but the file should reflect what happened.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `delay_deadline_approaching` | Claim ID, days remaining to 40-day deadline, investigation status | 7 years |
| `delay_notification_drafted` | Template ID, specific reason for delay, additional information needed | 7 years |
| `delay_notification_issued` | Date sent, delivery method, recipient, notification sequence number (1st, 2nd, 3rd...) | 7 years |
| `delay_followup_set` | Next notification due date, investigation milestones expected | 7 years |
| `delay_cycle_review` | Each 30-day review: investigation progress since last notification, updated reason for delay | 7 years |

---

## Workflow 11: Employer Notification (LC 3761)

**Regulatory Trigger:** Receipt of any claim for indemnity benefits (temporary disability, permanent disability, or death benefits -- as distinguished from medical-only claims)
**Primary Authority:** LC 3761 (insurer must notify employer within 15 days of indemnity claim filing); LC 3762 (insurer shall discuss elements affecting employer's premium; medical information restrictions)
**Key Deadlines:** 15 calendar days from receipt of the indemnity claim to notify the employer (LC 3761)
**UPL Zone:** GREEN -- Employer notification is a factual, administrative duty. The notification conveys claim facts, not legal analysis. However, strict attention to medical privacy boundaries under LC 3762 is required.

**Tier 1 (Dismissable):** When an employee files a workers' compensation claim that includes indemnity benefits (money benefits like temporary disability or permanent disability, as opposed to medical treatment only), the law requires the insurer to notify the employer within 15 days. This serves two purposes: (1) the employer needs to know a claim has been filed so they can plan for the employee's absence, coordinate modified duty if appropriate, and cooperate with the investigation; and (2) the employer has a right to understand how claims affect their insurance premium. However -- and this is critical -- the notification is subject to medical privacy restrictions. Under LC 3762, you can discuss the elements of the claim file that affect the employer's premium (like indemnity costs and reserve amounts), but you cannot share the employee's detailed medical information with the employer. The employer learns that a claim was filed and what it may cost; they do not get to read the medical records.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Receive indemnity claim | LC 3761 | Identifies the claim as an indemnity claim (not medical-only) based on the DWC-1 form and benefit type requested. Starts the 15-day notification clock | Confirm the claim classification is correct -- if it is truly medical-only, the LC 3761 notification requirement does not apply | Upon claim receipt |
| 2 | Prepare employer notification | LC 3761; LC 3762 | Template pre-populated with: employer name and contact, employee name, date of injury, claim number, date claim filed, type of indemnity benefits claimed. EXCLUDES medical details per LC 3762 | Review the notification for accuracy. Confirm no medical information has been included beyond what LC 3762 permits | Within 10 days of receipt (allows buffer before the 15-day deadline) |
| 3 | Verify medical privacy compliance | LC 3762 | Flags any content in the notification that references specific diagnoses, medical findings, treatment details, or physician opinions. These must be removed before sending | Final review: does this notification contain any medical information that should not be shared with the employer? | Before sending |
| 4 | Send notification to employer | LC 3761 | Tracks delivery method, date sent, recipient, and confirms the 15-day deadline was met. Logs in claim chronology | Approve and send. Ensure notification goes to the correct employer contact (HR, risk management, or designated claims contact) | Within 15 days of claim receipt |
| 5 | Document in claim file | CCR 10103 (claim log) | Auto-logs the notification event in the claim chronology with date, delivery method, and content summary | Confirm the file reflects the notification | Same day as sending |

### Decision Points

**What CAN be shared with the employer under LC 3762:**
- That a claim for indemnity benefits has been filed
- The date of injury and claim number
- The type of benefits claimed (TD, PD, death benefits)
- Elements of the claim file that affect the employer's premium (reserve amounts, indemnity costs, ALAE)
- The employee's work restrictions IF relevant to modified duty coordination -- but only the functional restrictions ("no lifting over 10 lbs"), not the underlying medical diagnosis

**What CANNOT be shared with the employer under LC 3762:**
- Specific medical diagnoses ("herniated disc at L4-L5")
- Physician opinions on causation or prognosis
- Detailed medical records or reports
- Psychiatric or psychological diagnoses
- Treatment plans or medication information
- Any medical information beyond what is strictly necessary for return-to-work coordination

**The line is functional, not medical.** You can tell the employer "the employee is restricted to sedentary work" (functional restriction). You cannot tell the employer "the employee has a herniated disc" (medical diagnosis). The restriction enables modified duty planning; the diagnosis is private.

### Common Mistakes

**Mistake 1: Including medical details in the notification.** A new examiner writes to the employer: "Your employee has filed a claim for a lumbar disc herniation sustained on March 5, 2026." That notification just disclosed a medical diagnosis. The correct notification says: "Your employee has filed a claim for indemnity benefits for an injury dated March 5, 2026." The diagnosis is the employee's private medical information.

**Mistake 2: Forgetting to send the notification at all.** In a high-volume caseload, a new examiner focuses on the investigation, the three-point contact, the medical records -- and forgets that LC 3761 requires a separate notification to the employer within 15 days. The employer learns about the claim three months later when the premium audit occurs. While penalties for missing this deadline are less severe than for some other violations, it is still a compliance failure and damages the carrier's relationship with the employer.

**Mistake 3: Sending the notification to the wrong person.** The examiner sends the notification to the employee's direct supervisor instead of the employer's HR or risk management department. The supervisor now knows about the claim and may treat the employee differently -- a potential retaliation concern under LC 132a. Notifications should go to the employer's designated claims contact, not to line management.

### Escalation Points

- If you are unsure what information can be shared with a specific employer (e.g., a small employer where the owner is also the direct supervisor), consult your supervisor or defense counsel about appropriate disclosure boundaries.
- If an employer requests detailed medical information about the claimant, explain that LC 3762 restricts medical disclosure. If the employer insists, escalate to your supervisor. Do not disclose medical information under employer pressure.
- If the notification deadline has been missed, send it immediately and document the late issuance in the claim file. Notify your supervisor.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `indemnity_claim_received` | Claim ID, date received, benefit type, 15-day deadline date | 7 years |
| `employer_notification_drafted` | Template ID, content generated, medical privacy check result (pass/fail) | 7 years |
| `medical_privacy_review` | Fields checked, any flagged content removed, reviewer confirmation | 7 years |
| `employer_notification_sent` | Date sent, delivery method, recipient name and title, deadline compliance (met/missed) | 7 years |

---

## Workflow 12: DOI Audit Response

**Regulatory Trigger:** Receipt of audit notice from the Department of Insurance (DOI) or Division of Workers' Compensation (DWC) Administrative Director per CCR 10107
**Primary Authority:** CCR 10105 (audit authority); CCR 10106 (audit selection -- random and targeted); CCR 10107 (notice and file production); CCR 10108 (penalties for violations)
**Key Deadlines:** As specified in the audit notice -- typically 10-30 business days to produce files, though the notice will state the exact deadline. Production deadlines are firm; extensions must be requested in writing before the deadline expires.
**UPL Zone:** GREEN -- Audit response is administrative compliance. Assembling claim files and producing documents is factual work. However, responding to audit findings and appealing penalties may require counsel involvement (YELLOW).

**Tier 1 (Dismissable):** The DOI and DWC have the authority to audit your claims handling at any time. They can select claim files randomly (to check general compliance) or target specific files based on complaints or patterns. When you receive an audit notice, it means the auditor wants to review specific claim files to determine whether you handled them in compliance with the Insurance Code, the Labor Code, and the CCR regulations. The auditor will check things like: Did you acknowledge communications within 15 days? Did you accept or deny within 40 days? Did you send delay notifications? Did you investigate before denying? Did you pay benefits on time? Each violation they find is a separate "finding" that can result in an administrative penalty under CCR 10108. Audits are not punitive by design -- they exist to ensure injured workers receive the protections the law provides. But the penalties are real and the findings become part of the carrier's regulatory record.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Receive and log audit notice | CCR 10107 | Parses the audit notice to identify: auditing agency (DOI or DWC), audit type (random or targeted), claim files selected, production deadline, auditor contact information | Confirm receipt and notify your supervisor and compliance department immediately. Audit response is typically a team effort, not a solo examiner task | Same day as receipt |
| 2 | Identify selected claim files | CCR 10107 | Retrieves all selected claim files from the system. Generates a checklist of files requested vs. files available | Verify that all requested files are in your system. If any files have been transferred, archived, or are missing, identify this immediately | Within 2 business days of notice |
| 3 | Assemble complete claim files | CCR 10101 (file contents) | For each selected file, generates a CCR 10101-compliant file summary: document inventory, chronological activity log, benefit payment history, investigation checklist status, correspondence log, deadline compliance timeline | Review each file for completeness. If documents are missing, attempt to locate them. If gaps exist, document what is missing and why | Begin immediately; allow time before deadline |
| 4 | Run compliance self-check | CCR 10101-10103; Ins. Code 790.03(h) | For each selected file, runs a compliance check against auditable standards: 15-day acknowledgment (10 CCR 2695.5(b)), 40-day determination (10 CCR 2695.7(b)), 14-day TD payment (LC 4650), delay notifications (10 CCR 2695.7(c)), investigation adequacy (CCR 10109). Flags potential findings | Review the self-check results. For each flagged item, prepare a factual explanation if one exists. This is not about hiding deficiencies -- it is about knowing what the auditor will see before they see it | Before file production |
| 5 | Produce files to auditor | CCR 10107 | Generates organized file production in the format requested (physical copies, electronic, or both). Tracks what was produced, when, and to whom | Final review before production. Ensure completeness. Deliver within the stated deadline | By the deadline in the audit notice |
| 6 | Respond to audit findings | CCR 10108; CCR 10110-10112 | Compiles factual data relevant to each finding: timeline of events, documents supporting compliance, explanations for apparent violations. Factual compilation only | How to respond to each finding: accept, explain, or dispute. Accepting means you acknowledge the violation. Explaining means you provide context (e.g., "the delay was caused by..."). Disputing means you believe the finding is incorrect. For disputes involving legal interpretation, consult counsel | Per the response timeline in the audit report |
| 7 | Appeal findings if warranted | CCR 10110-10112 | Provides the factual record for appeal: dates, documents, actions taken. Does NOT advise on whether to appeal -- that decision may involve legal analysis | Whether to appeal specific findings. Appeals of penalty assessments may require counsel -- the appeal process involves legal argument about whether the facts constitute a violation | Per appeal deadline in CCR 10110 |

### Decision Points

**What auditors look for (CCR 10101 file requirements):**
- Complete claim file with all relevant documents
- Documented investigation activity (three-point contact, medical records, statements)
- Timely acknowledgment of all communications (15-day rule)
- Timely coverage determinations (40-day rule) or properly documented delay notifications
- Benefits paid correctly and on time (14-day TD payment, correct rates)
- Written denial letters with specific reasons when claims are denied
- Claim log documenting all activity (CCR 10103)

**Self-check before production:** Running a compliance self-check is not about manufacturing a defense. It is about understanding your exposure so you can prepare accurate, complete responses. If the self-check reveals that a delay notification was not sent, that is what it is -- the auditor will find it regardless. Knowing in advance allows you to prepare a truthful explanation rather than being surprised.

**When audit response requires counsel:** If the audit findings include allegations of bad faith, pattern violations, or penalties exceeding your carrier's threshold, defense counsel or the carrier's regulatory counsel should be involved in the response. Individual file findings are typically handled by the examiner with supervisor guidance. Systemic findings or significant penalty exposure warrant legal involvement.

### Common Mistakes

**Mistake 1: Panicking and producing incomplete files.** An examiner receives an audit notice and rushes to produce files within a day, even though the deadline is 20 business days away. In the rush, medical records from one claim and correspondence from another are omitted. The auditor notes the incomplete production and adds findings for inadequate file documentation under CCR 10101. Take the time the deadline allows. Completeness matters more than speed.

**Mistake 2: Retroactively adding documentation.** An examiner reviews a file selected for audit and realizes the three-point contact was never documented. The examiner adds a backdated note: "Contacted employer on March 5." That is falsification of a claim file. It will not survive auditor scrutiny (auditors check system timestamps) and converts a minor compliance finding into a serious integrity issue. Document what exists. Explain gaps honestly. Never backdate.

**Mistake 3: Ignoring the audit notice.** A new examiner receives an audit notice and does not understand its significance. The examiner sets it aside "to deal with later" and misses the production deadline. Non-response to an audit notice is itself a violation and can result in escalated enforcement action. Audit notices are priority-one items.

### Escalation Points

- Notify your supervisor and compliance department on the same day you receive the audit notice. Audit response is not a solo activity.
- If the self-check reveals systemic issues across multiple selected files (e.g., delay notifications were consistently not sent), escalate immediately. The carrier needs to know the scope of exposure before the audit findings are issued.
- If audit findings allege bad faith violations or propose significant penalties, consult regulatory counsel before responding. The response to findings is a legal communication.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `audit_notice_received` | Audit type, agency, files selected, production deadline, auditor contact | 7 years |
| `audit_files_assembled` | Files assembled, document count per file, completeness status, gaps identified | 7 years |
| `compliance_self_check_run` | Check results per file: compliant/non-compliant per standard, flagged items with explanations | 7 years |
| `audit_files_produced` | Production date, delivery method, recipient, file inventory produced | 7 years |
| `audit_finding_response` | Finding ID, response type (accept/explain/dispute), factual basis for response | 7 years |
| `audit_appeal_filed` | Finding IDs appealed, appeal deadline, appeal basis (factual summary) | 7 years |

---

## Workflow 13: Lien Management

**Regulatory Trigger:** Filing of a lien against the workers' compensation claim by a medical provider, attorney, or other party claiming payment from the compensation award
**Primary Authority:** LC 4903 (types of liens allowed against compensation); LC 4903.1 (lien filing requirements and fees); LC 4903.05 (lien filing prerequisites); LC 4903.6 (lien conferences and hearings)
**Key Deadlines:** Lien conference scheduling per LC 4903.6; lien filing fee deadlines per LC 4903.1; WCAB lien hearing dates as set by the WCJ
**UPL Zone:** YELLOW/RED -- AdjudiCLAIMS can track lien amounts, filing dates, and lien types (GREEN). Evaluating the legal validity of a lien, challenging a lien on legal grounds, or negotiating lien resolution based on legal arguments is YELLOW/RED and may require counsel.

**Tier 1 (Dismissable):** A "lien" in workers' compensation is a claim filed by someone other than the injured worker, asserting that they are owed money from the compensation award or settlement. The most common type is a medical provider lien -- when a doctor or hospital treats the injured worker and the treatment bills have not been paid, the provider can file a lien against the claim to recover those costs. Other types include: attorney fee liens (the applicant's attorney claims a percentage of the recovery), expense liens (costs of medical records, copying, expert reports), Employment Development Department (EDD) liens (when the worker collected state disability or unemployment benefits that overlap with workers' compensation benefits), and WCAB cost liens. Liens are filed with the WCAB (Workers' Compensation Appeals Board) and become part of the case. They must be resolved -- either paid, negotiated down, or contested -- before the claim can be fully closed. LC 4903 lists the specific types of liens that California law allows.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Receive and log the lien | LC 4903; LC 4903.1 | Parses lien filing: lien claimant name, lien type (medical, attorney fee, EDD, expense, etc.), amount claimed, date filed, WCAB case number, filing fee status per LC 4903.1 | Confirm the lien is logged correctly and the lien type is properly classified | Within 5 business days of receipt |
| 2 | Verify lien filing compliance | LC 4903.1; LC 4903.05 | Checks lien filing prerequisites: Was the required filing fee paid? Does the lien meet the documentation requirements of LC 4903.05? Was it filed within the applicable time limits? Flags non-compliant filings | Whether to challenge the lien on procedural grounds (missing filing fee, untimely filing). NOTE: Challenging a lien on legal validity grounds (e.g., "this treatment was not reasonable and necessary") may require counsel | Promptly after receipt |
| 3 | Determine lien type and assess amount | LC 4903 | Categorizes the lien and presents: lien amount claimed, supporting documentation provided, medical billing codes and fee schedule amounts (for medical liens), applicable OMFS (Official Medical Fee Schedule) rates, any prior payments on the same bills | Whether the amount claimed is reasonable. For medical liens, compare the claimed amount against OMFS rates -- overpayment above fee schedule is a factual discrepancy. For attorney fee liens, the amount is typically set by statute or court order | Within 10 business days |
| 4 | Negotiate or dispute | Examiner judgment; LC 4903.6 | For medical liens: presents fee schedule comparison, payment history on the claim, and any UR denials for the treatments at issue. Factual data to support negotiation. Does NOT advise on negotiation strategy or legal arguments | Whether to pay the lien in full, negotiate a reduction, or dispute it. Simple medical lien overpayments (amount above fee schedule) are administrative -- you can handle them. Complex disputes (lien validity, reasonableness of treatment) may need counsel | Case-dependent |
| 5 | Track through resolution | LC 4903.6 | Tracks lien status: pending, in negotiation, paid, disputed, resolved, withdrawn. Tracks lien conference dates (LC 4903.6) and hearing dates. Alerts when deadlines approach | How to resolve each lien -- payment authorization, settlement, or continued dispute | Ongoing until resolved |
| 6 | Document resolution | CCR 10101 (claim file) | Logs final disposition: amount paid, negotiated reduction (if any), withdrawal, or WCAB order. Calculates impact on claim reserves | Final approval of lien payment or settlement amount | Upon resolution |

### Decision Points

**Types of liens and how they arise (LC 4903):**

| Lien Type | Filed By | Common Basis | Examiner's Role |
|-----------|----------|-------------|-----------------|
| **Medical provider lien** | Treating physician, hospital, clinic | Unpaid medical bills for treatment of the industrial injury | Verify treatment was authorized, compare billed amount against OMFS, pay or dispute |
| **Attorney fee lien** | Applicant's attorney | Statutory fee on benefits obtained through attorney's efforts | Typically set by statute (LC 4906) or WCAB order; limited examiner discretion |
| **EDD lien** | Employment Development Department | Overlap between state disability/unemployment benefits and WC indemnity | Verify overlap period and amounts; coordinate with EDD |
| **Expense lien** | Various (copy services, interpreters, experts) | Costs incurred in connection with the claim | Verify the expense was related to the claim and the amount is reasonable |
| **Child support lien** | Local Child Support Agency | Court-ordered child support against the injured worker's compensation | Mandatory compliance; pay per court order |

**When you need counsel for liens:**
- The medical provider disputes your UR denial and the lien conference becomes a contested hearing on treatment reasonableness -- that is a legal proceeding
- The lien claimant argues the lien is valid based on a legal theory you are not equipped to evaluate (e.g., employer liability for treatment by an out-of-network provider)
- Multiple liens total a significant portion of the claim value and resolution strategy involves legal trade-offs between lien claimants and the applicant's settlement
- The lien involves a billing dispute that implicates LC 4603.2 payment timelines and potential penalty exposure

### Common Mistakes

**Mistake 1: Ignoring liens until settlement.** An examiner sees lien filings come in but thinks, "I'll deal with those when we settle the case." By settlement time, there are 14 medical liens totaling $180,000, an attorney fee lien, and an EDD lien. The total lien exposure exceeds the proposed settlement amount. The examiner should have been tracking and resolving liens throughout the claim's life -- paying undisputed amounts, disputing overpayments, and maintaining an accurate lien inventory.

**Mistake 2: Paying a medical lien without checking the fee schedule.** A medical provider files a lien for $12,000 for lumbar spine treatment. The examiner pays the full amount without comparing it to the OMFS. The fee schedule rate for the billed services is $7,200. The carrier overpaid by $4,800. AdjudiCLAIMS compares lien amounts against OMFS rates automatically, but the examiner must review and act on the discrepancy.

**Mistake 3: Attempting to evaluate lien validity on legal grounds.** An examiner receives a medical lien for treatment that the examiner believes was not reasonable or necessary. The examiner writes to the lien claimant: "We have determined that this treatment was not medically necessary and therefore deny your lien." That letter contains a medical-legal conclusion. If the treatment was subject to UR and the UR decision was upheld through IMR, the examiner can cite the UR denial as the factual basis. But if the examiner is making an independent determination of medical necessity outside the UR process, that requires clinical and potentially legal review.

### Escalation Points

- If total lien exposure on a claim approaches or exceeds the reserve, notify your supervisor immediately. Reserve adjustments may be needed.
- If a lien conference or hearing is scheduled at the WCAB, defense counsel must be involved. Lien proceedings are legal proceedings.
- If you suspect a lien is fraudulent (e.g., billing for services not rendered, provider not properly licensed), report to your SIU and consult counsel.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `lien_received` | Lien claimant, lien type, amount claimed, filing date, filing fee status | 7 years |
| `lien_compliance_check` | Filing prerequisites met/not met, flags for non-compliant filings | 7 years |
| `lien_amount_assessed` | Claimed amount, OMFS comparison (for medical liens), discrepancy amount | 7 years |
| `lien_negotiation_activity` | Offer/counteroffer amounts, dates, communication method | 7 years |
| `lien_resolved` | Resolution type (paid in full, negotiated, disputed, withdrawn, WCAB order), final amount, date | 7 years |
| `lien_hearing_scheduled` | WCAB hearing date, counsel assigned, lien claimant attorney (if any) | 7 years |

---

## Workflow 14: Return-to-Work Coordination

**Regulatory Trigger:** Treating physician issues a work status report releasing the injured worker to modified duty or full duty, or the injured worker reaches Maximum Medical Improvement (MMI)
**Primary Authority:** LC 4600 (employer's obligation to provide medical treatment continues); LC 4658.5 (employer return-to-work programs and premium credit); LC 4658.6 (supplemental job displacement benefit when employer does not offer modified or alternative work)
**Key Deadlines:** TD terminates when the employee is released to return to work (LC 4656); supplemental job displacement benefit (SJDB) voucher must be issued within statutory timelines when applicable (LC 4658.6); employer has 60 days from offer of modified/alternative work to make it available (LC 4658.6)
**UPL Zone:** GREEN -- Return-to-work coordination is administrative claims management. Communicating work restrictions, coordinating modified duty, and adjusting benefits are examiner-level duties. However, disputes about whether an employer's modified duty offer satisfies the statutory requirements may involve legal analysis (YELLOW).

**Tier 1 (Dismissable):** "Return to work" (RTW) is the process of transitioning an injured worker from receiving temporary disability benefits back to employment. It is triggered when the treating physician (or QME/AME) determines that the worker can perform some or all of their job duties. There are several possible scenarios: (1) "Full duty release" means the worker can return to their regular job with no restrictions. (2) "Modified duty release" means the worker can return to work but with restrictions (e.g., no lifting over 10 lbs, sedentary work only, limited hours). (3) "MMI" (Maximum Medical Improvement) means the worker's medical condition has stabilized and is not expected to improve further with treatment -- at this point, temporary disability ends and permanent disability evaluation begins. RTW coordination is where several obligations intersect: the employer's duty to provide work, the injured worker's right to benefits during recovery, and the transition from temporary disability to permanent disability. LC 4658.5 encourages employers to accommodate injured workers with modified or alternative work -- employers who do so receive a premium credit. LC 4658.6 provides a Supplemental Job Displacement Benefit (SJDB) voucher for vocational retraining when the employer cannot or does not offer modified/alternative work within 60 days.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Receive work status report | LC 4600; LC 4656 | Extracts key data from the physician's work status report: release type (full duty, modified duty, or MMI), effective date, specific work restrictions (if any), duration of restrictions, next follow-up date | Review the work status report. Confirm the restrictions are clear and actionable. If the report is ambiguous ("light duty"), contact the physician for clarification | Within 2 business days of receipt |
| 2 | Communicate restrictions to employer | LC 4658.5 | Generates employer communication with functional restrictions only (no medical diagnoses per LC 3762). Format: "Employee is released to modified duty effective [date] with the following restrictions: [list functional restrictions]" | Whether the communication accurately reflects the physician's restrictions. Ensure no medical information beyond functional restrictions is disclosed to the employer | Within 3 business days of receiving work status report |
| 3 | Coordinate modified duty with employer | LC 4658.5; LC 4658.6 | Tracks employer response: Has the employer offered modified or alternative work? Does the offer accommodate all stated restrictions? Starts the 60-day clock under LC 4658.6 for SJDB voucher eligibility if employer does not offer work | Whether the employer's modified duty offer (if any) actually accommodates the restrictions. A desk job is not "modified duty" if the worker's restrictions include "no sitting for more than 30 minutes" | Ongoing; 60-day window under LC 4658.6 |
| 4 | Adjust benefits | LC 4656; LC 4657 | Calculates benefit adjustments: if the worker returns to full duty, TD terminates on the release date. If the worker returns to modified duty at reduced wages, temporary partial disability may be owed. If MMI is reached, PD evaluation begins. Computes amounts and effective dates | Authorize the benefit adjustment. You make the payment change, not the AI. Confirm the effective dates and amounts are correct | Upon return to work or MMI |
| 5 | Monitor compliance | LC 4600; LC 4658.5 | Tracks: Is the employer maintaining the modified duty position? Is the worker performing modified duty? Are follow-up medical appointments happening? Has the employer withdrawn the modified duty offer? | Whether the return-to-work arrangement is working. If the employer withdraws modified duty, benefits may need to be reinstated. If the worker is not complying with modified duty, investigate why | Ongoing until claim closure or PD determination |
| 6 | Issue SJDB voucher if applicable | LC 4658.6 | Determines SJDB eligibility: (a) the worker has a permanent impairment, (b) the employer has not offered modified or alternative work within 60 days, (c) the work offered does not accommodate all restrictions. Generates SJDB voucher for examiner review and issuance | Whether the SJDB voucher criteria are met. If the employer offered modified work but the worker disputes that it accommodates the restrictions, this may become a legal dispute requiring counsel | Per LC 4658.6 timelines |

### Decision Points

**The transition from TD to RTW is where multiple obligations converge:**

- **Medical treatment continues (LC 4600).** Returning to work does not end the employer's obligation to provide medical treatment. The worker may still need follow-up care, physical therapy, or medication even after returning to work. Do not close the medical component of the claim just because the worker returned to duty.
- **TD terminates on release (LC 4656).** Temporary disability payments stop when the physician releases the worker to return to work -- whether or not the employer actually has modified duty available. However, if the employer cannot accommodate the restrictions, other benefits may apply.
- **Modified duty vs. alternative work.** "Modified duty" means the worker's existing job, adjusted to accommodate restrictions. "Alternative work" means a different position that the worker can perform within restrictions. Under LC 4658.5, both qualify. The employer must offer work that (a) pays at least 85% of the pre-injury wages and (b) is within reasonable commuting distance.
- **SJDB voucher (LC 4658.6).** If the employer does not offer modified or alternative work within 60 days of the disability becoming permanent and stationary (P&S), the worker is entitled to a supplemental job displacement benefit -- a voucher for vocational retraining. The voucher amount depends on the PD rating.

**When RTW coordination requires counsel:**
- The worker disputes that the employer's modified duty offer accommodates all restrictions
- The employer terminates the worker after the return to work, raising LC 132a retaliation concerns
- The work status report is ambiguous and the parties disagree about what the physician meant
- The SJDB voucher eligibility is contested (dispute about whether the employer made a valid offer)

### Common Mistakes

**Mistake 1: Terminating TD before confirming the employer has work available.** An examiner receives a modified duty release and immediately stops TD payments. But the employer says they have no modified duty available. The worker is now without income and without benefits. The examiner should have coordinated with the employer before adjusting benefits. If modified duty is not available, the worker may still be entitled to TD until the employer provides work or the 60-day SJDB window is triggered.

**Mistake 2: Sharing medical diagnoses with the employer during RTW coordination.** In the process of coordinating modified duty, an examiner tells the employer, "The worker has a torn rotator cuff and cannot lift overhead." The restriction ("cannot lift overhead") is appropriate to share. The diagnosis ("torn rotator cuff") is not. Communicate functional limitations, not medical conditions. This is the same LC 3762 medical privacy requirement from Workflow 11.

**Mistake 3: Forgetting to issue the SJDB voucher.** The employer does not offer modified duty. Sixty days pass. The examiner does not issue the SJDB voucher because they forgot or did not realize it was triggered. The worker is now entitled to the voucher and the carrier faces penalties for failing to issue it timely. AdjudiCLAIMS tracks the 60-day window, but the examiner must act on the alert.

### Escalation Points

- If the employer offers modified duty that appears to not accommodate the physician's restrictions, consult your supervisor before approving or rejecting the offer. This can become a disputed issue at the WCAB.
- If the injured worker refuses to return to modified duty that appears to accommodate all restrictions, document the refusal and consult your supervisor. Unreasonable refusal of modified duty may affect benefit entitlement, but this determination has legal dimensions.
- If the employer terminates the worker after the return to work, this raises potential LC 132a (anti-retaliation) concerns. Notify your supervisor and consider whether counsel should be involved.
- If the work status report is ambiguous or the physician provides conflicting release dates, contact the physician directly for clarification. Do not guess at the meaning of medical restrictions.

### Audit Trail -- What Gets Logged

| Event | Data Captured | Retention |
|-------|--------------|-----------|
| `work_status_report_received` | Physician name, release type (full/modified/MMI), restrictions, effective date, follow-up date | 7 years |
| `employer_rtw_communication` | Restrictions communicated, date sent, employer contact, medical privacy compliance check | 7 years |
| `modified_duty_offer_tracked` | Employer offer date, position offered, wage rate, restriction accommodation assessment | 7 years |
| `benefit_adjustment_authorized` | Adjustment type (TD termination, TPD calculation, PD initiation), effective date, amounts, examiner authorization | 7 years |
| `sjdb_eligibility_assessed` | 60-day window start, employer offer status, eligibility determination, voucher amount | 7 years |
| `sjdb_voucher_issued` | Voucher date, amount, delivery method, recipient confirmation | 7 years |
| `rtw_compliance_monitoring` | Periodic check-ins: modified duty maintained, worker performing duties, employer compliance | 7 years |
## Workflow 15: Claim Closure

**Regulatory Trigger:** Claim reaches final resolution — settlement approved, award issued, voluntary dismissal filed, or administrative closure criteria met
**Primary Authority:** CCR 10102 (claim file retention); CCR 10101 (claim file contents); LC 5001-5002 (finality of awards)
**Key Deadlines:** File retention minimum 5 years after final disposition per CCR 10102; settlement documents within timeframes set by WCAB order
**UPL Zone:** GREEN (administrative file closure) / YELLOW (evaluating whether claim is ready for closure — legal issues may remain)

**Tier 1 (Dismissable):** "Claim closure" means formally closing the claim file because the claim has been fully resolved. A claim can be resolved in several ways. A **Compromise and Release (C&R)** is a settlement where the injured worker receives a lump sum payment and gives up the right to all future benefits on the claim — medical treatment, disability payments, everything. The case is done. A **Stipulated Award (Stip)** is an agreement on the level of permanent disability, but the injured worker keeps the right to future medical treatment for the injury. A **voluntary dismissal** means the applicant (injured worker) withdraws their claim. An **administrative closure** means the claim has been inactive for an extended period and meets the criteria for closure without a formal settlement or award. A **Findings and Award** is a decision by a Workers' Compensation Administrative Law Judge (WCJ) after a trial, ordering specific benefits. Closure is the last step in the claim lifecycle, but it must be done correctly — premature closure can leave the insurer exposed to reopened claims, unresolved liens, and audit findings.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Confirm all indemnity benefits have been paid in full | LC 4650, LC 4658, settlement terms | Payment history summary; flags any outstanding indemnity balances | Whether payment records match settlement/award terms | Before closure |
| 2 | Verify all liens have been resolved or addressed | LC 4903, LC 4903.1 | Lien tracking dashboard; list of open liens by provider | Whether each lien is resolved, disputed, or included in settlement | Before closure |
| 3 | Confirm no outstanding medical treatment obligations | LC 4600; settlement terms (C&R vs Stip) | Medical authorization status; open treatment requests | Whether all medical obligations are satisfied or properly transferred (Stip — future medical remains open through separate process) | Before closure |
| 4 | Verify no pending WCAB hearings or open proceedings | CCR 10101; WCAB rules of practice | WCAB hearing calendar check; open petition status | Whether any proceedings remain that prevent closure | Before closure |
| 5 | Obtain and file proper closure documentation | CCR 10101, WCAB rules | Document checklist based on closure type; flags missing documents | Whether the file is complete for the closure type | Within 30 days of resolution |
| 6 | Set final reserves to zero (or appropriate residual for Stip future medical) | Ins. Code 790.03(h)(6); actuarial standards | Reserve adjustment form; suggests zero for C&R, residual for Stip based on injury type | Whether reserve amounts accurately reflect remaining exposure | At closure |
| 7 | Close claim file per retention requirements | CCR 10102 | Retention period calculator (5-year minimum from final disposition); archive date | Confirm file is complete and ready for closure status | Upon completion of Steps 1-6 |
| 8 | Archive file with proper indexing | CCR 10102, CCR 10103 | Archive classification; retention reminder scheduling | Final review that nothing was missed | Same day as closure |

**Tier 2 (Always Present):** CCR 10102 requires retention of claim files for a minimum of 5 years after the date of final disposition. "Final disposition" means the date on which all benefits have been paid, all obligations discharged, and the claim has been formally resolved. If a file is destroyed prematurely, the insurer cannot produce it in a subsequent audit (CCR 10105-10107) or reopening proceeding (LC 5410 — claims may be reopened within 5 years of injury date). The DWC Administrative Director can assess penalties under CCR 10108 for failure to maintain complete files. Proper closure is not just administrative housekeeping — it is a compliance obligation.

### Decision Points

**C&R vs. Stip — What Stays Open:**
When a claim settles by Compromise and Release, the insurer's obligations end completely upon payment of the settlement amount — no future medical, no future disability payments. The case is done. When a claim settles by Stipulated Award, permanent disability is fixed but the right to future medical treatment for the industrial injury remains open indefinitely under LC 4600. This means a "closed" Stip file may still generate future medical authorizations. Your claims system must reflect this distinction. A Stip closure is a partial closure — the indemnity portion is closed, but the medical portion remains active. Reserves should reflect the ongoing future medical exposure on Stip files.

**Tier 2 (Always Present):** Closing a Stip file as if it were a C&R — cutting off future medical — is a denial of benefits without investigation. This violates Ins. Code 790.03(h)(4) and exposes the insurer to LC 5814 penalties (up to 25% increase on unreasonably delayed or denied benefits) and bad faith liability. AdjudiCLAIMS flags the settlement type on every closure action to prevent this error.

**Reopening Risk:** Under LC 5410, a claim may be reopened within 5 years of the date of injury based on new and further disability. A closed file is not necessarily a dead file. Retain everything. Additionally, if a Petition to Reopen is filed, the insurer must be able to produce the complete file to defend against the petition or evaluate the new claim. The 5-year retention requirement under CCR 10102 aligns with this reopening window — it is not a coincidence.

**Administrative Closure Criteria:** Not every inactive claim should be administratively closed. Before closing a claim for inactivity, verify that no outstanding obligations exist, no pending investigations are underway, and no communications have gone unanswered. An improperly administered closure can be challenged by the applicant or their attorney, resulting in reinstatement and potential penalties for failure to maintain the claim file.

**Findings and Award vs. Settlement:** When the case is resolved by a judge's Findings and Award after trial, the closure process follows the terms of the award. The examiner must pay all awarded benefits within the timeframes specified by the WCJ. Failure to comply with a WCAB order can result in contempt proceedings and LC 5814 penalties on top of the award amount.

**Voluntary Dismissal — Verify It Is Complete:**
If the applicant voluntarily dismisses their claim, verify that the dismissal covers all claimed body parts, all causes of action, and all case numbers. A partial dismissal (dismissing one body part but not others, or dismissing the claim against one defendant but not others) does not close the entire file. Request the complete dismissal document and have counsel confirm it is comprehensive before closing.

**Administrative Closure Checklist:**
Administrative closure — closing a file for inactivity without a formal resolution — is not available in all circumstances. Before administratively closing a file, confirm: (a) no benefits are being paid, (b) no treatment requests are pending, (c) no lien proceedings are active, (d) the statute of limitations for reopening (LC 5410) has expired or is close to expiring, and (e) no WCAB proceedings are pending. If any of these conditions are not met, the file should remain open. An improperly administratively closed file that must be reopened reflects poorly in audit.

### Common Mistakes

**Mistake 1: Closing a Stip file and denying subsequent medical.** An examiner settles a claim by Stipulated Award for 20% permanent disability. Six months later, the injured worker requests authorization for physical therapy related to the industrial injury. The examiner sees the claim is "closed" and denies the request. This is wrong. A Stip preserves the right to future medical treatment under LC 4600. The examiner must process the medical request through Utilization Review like any other treatment request. The denial triggers a complaint, a DOI audit finding, and potential LC 5814 penalties. AdjudiCLAIMS prevents this by displaying a persistent alert on Stip files: "Future medical remains open — LC 4600."

**Mistake 2: Closing before liens are resolved.** An examiner closes a claim after the C&R is approved, but three medical provider liens totaling $47,000 remain unresolved. The lien claimants file a Petition to Enforce against the insurer. The file must be reopened, the examiner must reconstruct the claim history, and the insurer incurs unnecessary legal fees defending lien proceedings that should have been resolved at settlement. Before closing any file, verify the lien log is clear or that all liens were addressed in the settlement. A well-drafted C&R should address lien resolution — if it does not, consult counsel before closing.

**Mistake 3: Failing to retain the file for the required period.** An examiner marks a file for destruction three years after closure. The injured worker files a Petition to Reopen under LC 5410 at four years post-injury. The insurer cannot produce the file, cannot demonstrate what was paid, and faces adverse inferences in the reopening proceeding plus audit penalties under CCR 10108. AdjudiCLAIMS calculates the earliest permissible destruction date and blocks premature archival.

**Mistake 4: Not zeroing reserves on a fully closed C&R file.** An examiner completes the C&R payment but leaves $15,000 in reserves on the file. The open reserves distort the insurer's loss reports, affect actuarial calculations, and may trigger unnecessary management attention on a file that is fully resolved. When a C&R is fully paid with no remaining obligations, reserves should be set to zero. For Stip files, a residual future medical reserve is appropriate — but it should reflect a reasonable estimate, not the pre-settlement figure.

### Escalation Points

- **Lien disputes at closure:** If liens remain unresolved and the settlement did not address them, consult defense counsel before closing the file. Lien resolution strategy is a legal determination (YELLOW zone).
- **Ambiguous settlement terms:** If the C&R or Stip language is unclear about what is being resolved, do not interpret it yourself. Forward to counsel for clarification. Contract interpretation is the practice of law.
- **Reopening petitions on closed files:** If a Petition to Reopen is received on a closed claim, immediately reopen the file, preserve all documents, and refer to counsel. Reopening proceedings involve legal analysis of new and further disability — RED zone.
- **Outstanding WCAB proceedings:** If you discover a pending hearing or open petition that was not resolved before closure, halt the closure and notify counsel immediately.
- **Settlement payment not clearing:** If the C&R settlement check has not been cashed within 60-90 days, do not close the file. Contact counsel and the applicant's attorney to determine why. An uncashed settlement check may indicate the applicant did not receive the payment, disputes the amount, or has changed addresses.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| Closure initiated | Closure type (C&R/Stip/Dismissal/Admin/F&A), date, examiner ID | CCR 10101 |
| Benefits payment verification | Final payment amounts, dates, confirmation of full payment | LC 4650, settlement terms |
| Lien status at closure | Each lien: resolved/included in settlement/disputed, amounts | LC 4903 |
| Medical status at closure | Open authorizations, pending UR decisions, future medical rights (Stip) | LC 4600 |
| WCAB proceeding check | Pending hearings: none/listed, open petitions: none/listed | CCR 10101 |
| Reserves zeroed or adjusted | Final reserve amount, rationale for any residual (Stip future medical) | Ins. Code 790.03(h)(6) |
| Closure documentation filed | List of documents in file at closure, completeness check result | CCR 10101 |
| Retention period set | Calculated destruction-eligible date (minimum 5 years from final disposition) | CCR 10102 |
| Archive confirmation | Archive location, index reference, retention reminder date | CCR 10102, CCR 10103 |

**Why This Workflow Matters:** Claim closure is the final compliance checkpoint. Every preceding workflow — benefits payment, lien resolution, medical treatment, reserve setting — converges at closure. A poorly closed file is a file that will come back to haunt you: through reopening petitions, audit findings, lien proceedings, or inability to defend the insurer's position. AdjudiCLAIMS walks you through the closure checklist step by step, ensuring nothing is missed. A well-closed file is a clean file. A clean file is your best defense.

---

## Workflow 16: Fraud Indicator Response

**Regulatory Trigger:** Identification of factual patterns in the claim file that are consistent with fraud — inconsistent statements, surveillance contradicting claimed disability, billing anomalies, or other objective red flags
**Primary Authority:** Ins. Code 1871-1871.7 (insurance fraud provisions); Penal Code 550 (fraudulent claims); Ins. Code 1872.4 (SIU requirements)
**Key Deadlines:** Referral to SIU should occur promptly upon identification of indicators; no specific statutory deadline for examiner referral, but unreasonable delay may be viewed as failure to investigate under CCR 10109
**UPL Zone:** GREEN (identifying factual patterns and documenting observations) / RED (making fraud determinations, confronting claimants, conducting investigations beyond claims handling scope)

**Tier 1 (Dismissable):** "Fraud" in workers' compensation means someone is intentionally making false statements or misrepresenting facts to obtain benefits they are not entitled to — or to avoid paying benefits that are owed. Fraud can be committed by injured workers, employers, medical providers, or attorneys. An **SIU (Special Investigations Unit)** is a department within the insurance company — or contracted to it — staffed by trained investigators (often former law enforcement) whose job is to investigate suspected fraud. Your job as an examiner is NOT to investigate fraud. Your job is to recognize factual patterns that do not add up, document what you observe in the claim file, and refer to SIU. The SIU conducts the investigation. If fraud is confirmed, the SIU refers to the District Attorney's office or the California Department of Insurance Fraud Division for prosecution under Penal Code 550. **You are a spotter, not an investigator.**

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify factual inconsistencies or patterns in the claim file | CCR 10109 (duty to investigate); Ins. Code 1872.4 | Pattern alerts: flags objective inconsistencies (e.g., treatment dates conflicting with employment records, billing anomalies, multiple claims with identical patterns) | Whether the flagged patterns warrant further attention — apply your judgment to the facts | Ongoing during claim handling |
| 2 | Document observations in the claim file with specificity | CCR 10101 (file documentation) | Structured documentation template for factual observations; date-stamped entries | What specific facts you observed and why they appear inconsistent — factual statements only, no conclusions of fraud | Immediately upon identification |
| 3 | DO NOT confront the claimant, employer, or provider | Ins. Code 1871.7(a); Penal Code 550 | Warning prompt: "Fraud investigation is an SIU/legal function. Do not discuss suspicions with any party." | Nothing — this is a hard rule, not a judgment call | Always |
| 4 | Refer to SIU with documented factual basis | Ins. Code 1872.4 (insurer SIU requirements) | SIU referral form pre-populated with claim data and documented observations | Whether the factual pattern is sufficient to warrant SIU referral — when in doubt, refer | Within 5 business days of identification |
| 5 | Continue normal claims handling | Ins. Code 790.03(h)(3)-(4); CCR 10109 | Normal workflow continues; claim dashboard shows SIU referral status | All normal claims decisions — do not alter your handling because of the referral | Ongoing |
| 6 | Cooperate with SIU investigation as requested | Ins. Code 1872.4 | Document requests from SIU tracked in file; SIU communication log | What documents or information to provide when SIU requests them | As requested by SIU |

**Tier 2 (Always Present):** Insurance Code 1872.4 requires every insurer to establish and maintain an SIU. The examiner's role is strictly limited to identifying factual patterns and referring to SIU. Penal Code 550 makes it a crime to knowingly present a false or fraudulent claim — but the determination of whether conduct constitutes fraud is a legal and investigative function, not a claims handling function. If an examiner confronts a claimant with fraud accusations, the examiner may compromise a criminal investigation (evidence contamination, witness tampering concerns), expose the insurer to defamation liability, and create bad faith exposure if the suspicion turns out to be unfounded. The examiner documents facts. The SIU investigates facts. The District Attorney prosecutes fraud. Each role is distinct. Crossing these boundaries is dangerous legally and operationally.

### Decision Points

**What Constitutes a "Fraud Indicator" vs. Normal Claim Complexity:**
Not every inconsistency is fraud. Claims are messy. Medical records contain errors. Claimants misremember dates. Employers provide incomplete information. A fraud indicator is a pattern of factual inconsistencies that lacks an innocent explanation after reasonable consideration. AdjudiCLAIMS flags objective data patterns (e.g., a claimant reporting inability to work while employment records show concurrent employment elsewhere). You evaluate whether the pattern has an innocent explanation before referring. A single date discrepancy is probably a clerical error. Multiple overlapping inconsistencies across different documents with no plausible innocent explanation — that is a referral.

**Tier 2 (Always Present):** Ins. Code 790.03(h)(3) requires reasonable investigation standards. Failing to investigate a claim because you suspect fraud — without completing the investigation or making a referral — violates fair claims practices. You cannot deny a claim based on suspicion alone. You must either (a) complete your investigation and make a decision based on the evidence, or (b) refer to SIU and continue normal handling while the investigation proceeds. Suspicion is not a basis for denial. Evidence is.

**Types of Fraud — Not Just Claimant Fraud:**
Fraud is not limited to injured workers fabricating claims. Provider fraud — medical providers billing for services never rendered, upcoding (billing for a more expensive service than was performed), or performing unnecessary treatment to generate billings — is a significant source of WC fraud. Employer fraud — underreporting payroll to reduce premiums, misclassifying employees, or denying knowledge of injuries — also occurs. When AdjudiCLAIMS flags billing anomalies from medical providers or inconsistencies in employer reporting, evaluate those patterns with the same discipline: document facts, refer to SIU.

**Your Bias Awareness Obligation:**
Fraud suspicion must be based on objective factual patterns, not stereotypes, assumptions, or personal biases about the type of person who "looks like" a fraud risk. Demographic characteristics, English language proficiency, or the type of injury claimed are not fraud indicators. Factual inconsistencies in documents, statements, and records are fraud indicators. If you catch yourself forming a suspicion that you cannot tie to specific documented facts, stop and reassess. AdjudiCLAIMS flags are based on data patterns, not demographics — and even data-driven flags require your human judgment before becoming referrals.

**Common Fraud Indicator Categories (for reference — not an exhaustive list):**
- **Statement inconsistencies:** Claimant's description of injury mechanism differs between the claim form, the medical history given to the treating physician, and the recorded statement given to the examiner.
- **Timing anomalies:** Claim filed on a Monday for an alleged Friday injury with no contemporaneous medical treatment; claim filed immediately after a layoff or termination notice.
- **Medical record discrepancies:** Treatment dates do not align with claimed disability periods; billing for services on dates when the provider's office was closed.
- **Employment inconsistencies:** Claimant reports inability to work but social media or other records indicate concurrent employment.
- **Pattern claims:** Multiple claims from the same employee within a short period; multiple employees from the same employer reporting identical injuries.

These are factual patterns, not conclusions. Each one may have an innocent explanation. Your job is to document the pattern, consider whether an innocent explanation exists, and refer if it does not.

### Common Mistakes

**Mistake 1: Confronting the claimant.** An examiner notices that surveillance video shows the injured worker playing recreational basketball despite claiming total temporary disability. The examiner calls the injured worker and says, "We have you on video playing basketball — how can you claim you can't work?" This is catastrophic. The examiner has now alerted the subject of a potential fraud investigation, potentially compromising evidence and enabling the subject to adjust behavior or destroy records. The correct action: document the surveillance findings in the file, note the inconsistency with the claimed disability, and refer to SIU immediately. Additionally, the surveillance may not prove fraud — the treating physician may have authorized recreational activity as therapeutic. Let SIU evaluate.

**Mistake 2: Denying the claim based on suspicion without completing investigation.** An examiner sees red flags and immediately denies the claim, writing "suspected fraud" in the denial letter. This violates Ins. Code 790.03(h)(4) (refusing to pay without reasonable investigation) and exposes the insurer to bad faith liability, LC 5814 penalties, and potentially a lawsuit. If the claim turns out to be legitimate, the insurer faces compounding consequences. Refer to SIU, continue normal handling, and let the investigation determine the facts. Never use the word "fraud" in any communication with the claimant, their attorney, the employer, or medical providers.

**Mistake 3: Failing to document the factual basis.** An examiner has a "gut feeling" that something is off about a claim but does not document the specific facts that triggered the concern. Six months later, the SIU asks what prompted the referral, and the examiner cannot recall. The referral stalls because there is nothing actionable for SIU to investigate. Always document the specific factual observations — dates, documents, statements — that created the concern. "Something felt wrong" is not a referral basis. "Claimant stated injury date of 3/15 but employment records show claimant was not scheduled to work on 3/15, and treating physician's initial report is dated 3/10, five days before the claimed injury" is a referral basis.

**Mistake 4: Using the word "fraud" in claim notes or communications.** An examiner documents "possible fraud" or "suspected fraudulent claim" in the claim file notes. If the claim turns out to be legitimate — or even if it is fraudulent but the note is discoverable — those words can be used against the insurer in a bad faith lawsuit. They suggest the insurer prejudged the claim. Document only facts: "Inconsistency noted between claimant's reported work schedule and employer's attendance records for the date of claimed injury." Let the SIU and prosecutors use the word "fraud." You document facts.

### Escalation Points

- **Any fraud indicator identification:** Refer to SIU. This is not optional. If you see a pattern, document and refer. Under-referral is a bigger risk than over-referral — SIU can quickly screen out unfounded referrals, but missed fraud costs the insurer and the system.
- **SIU requests to alter claims handling:** If SIU asks you to delay or modify normal claims processing as part of their investigation, consult your supervisor first. You cannot deviate from statutory claims handling obligations (payment deadlines, investigation timelines) without supervisor approval and documentation of the reason.
- **Claimant or attorney asks about fraud investigation:** If anyone asks whether a fraud investigation is underway, do not confirm or deny. Say, "I'm handling the claim in the normal course." Refer the inquiry to SIU or your supervisor. Disclosing the existence of a fraud investigation can constitute obstruction.
- **Provider billing pattern concerns:** If you notice a pattern of questionable billing across multiple claims from the same provider, report it to SIU as a provider-level concern, not just a single-claim referral. Provider fraud schemes often span many claims.
- **Retaliation concerns:** If the injured worker reports that the employer is retaliating against them for filing the claim (threatening termination, reducing hours, changing assignments), that is a separate issue from fraud — it may violate LC 132a (discrimination for filing a WC claim). If you observe retaliation indicators, consult your supervisor. Do not conflate employer retaliation with fraud by the worker.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| Pattern flag generated | Specific data points flagged, source documents, AI confidence indicators | CCR 10109 |
| Examiner review of flag | Examiner evaluation: confirmed concern / innocent explanation / needs more info | CCR 10101 |
| Factual observations documented | Specific facts noted, document references, dates, inconsistencies described | CCR 10101 |
| SIU referral submitted | Referral date, factual basis summary, documents attached, SIU case number | Ins. Code 1872.4 |
| Normal claims handling continued | Confirmation that claim processing was not suspended or altered due to referral | Ins. Code 790.03(h)(3) |
| SIU cooperation logged | Requests received from SIU, documents provided, communications | Ins. Code 1872.4 |
| SIU outcome received | Investigation result (if shared with claims), impact on claim handling | Ins. Code 1872.4 |

**Why This Workflow Matters:** Fraud costs the California workers' compensation system billions of dollars annually — those costs are passed to employers through higher premiums and to injured workers through a system that treats legitimate claims with increased skepticism. By identifying fraud indicators factually and referring them properly, you protect the integrity of the system without compromising the rights of legitimate claimants. AdjudiCLAIMS helps you walk this line: it surfaces data patterns for your evaluation, it never labels a claim as fraudulent, and it enforces the discipline of documenting facts rather than conclusions. Your role is to be a careful observer, not a judge.

---

## Workflow 17: Subrogation Identification and Referral

**Regulatory Trigger:** Identification of third-party involvement in the causation of a work injury — the injury was caused or contributed to by someone other than the employer or a co-employee acting within the scope of employment
**Primary Authority:** LC 3850-3865 (employer's lien and right of subrogation against third parties)
**Key Deadlines:** No specific statutory deadline for subrogation referral, but LC 3853 requires the employer/insurer to exercise its lien rights within the statute of limitations for the underlying tort action (generally 2 years from date of injury under CCP 335.1)
**UPL Zone:** GREEN (identifying third-party involvement from claim documents) / YELLOW-RED (evaluating legal liability of third parties, determining subrogation strategy — these are legal functions)

**Tier 1 (Dismissable):** "Subrogation" is the insurer's legal right to recover money from a third party who caused the injury. Here is the plain English version: If a delivery driver is injured on the job when another motorist runs a red light and hits them, the workers' comp insurer pays the driver's medical bills and disability benefits. But the other motorist caused the accident — the injury was not the employer's fault. Subrogation means the insurer can go after the at-fault motorist (or their auto insurance company) to get back the money it paid out. The insurer "steps into the shoes" of the injured worker and recovers from the party who caused the harm. This is authorized by Labor Code Sections 3850 through 3865. Why does this matter to you? Because subrogation recoveries directly reduce the insurer's claim costs. Missing a subrogation opportunity means the insurer absorbs costs that should have been paid by the responsible third party — and that loss flows into loss ratios, premium calculations, and ultimately the employer's insurance costs. Your job is to spot when a third party may be involved and refer it to the subrogation department or subrogation counsel. You do not evaluate the legal merits of the subrogation claim — that is a legal function.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify third-party involvement from claim documents | LC 3850 (employer's right to recover from third parties) | Flags keywords and patterns suggesting third-party involvement (auto accident, premises defect, product malfunction, assault by non-employee) from intake forms, medical records, and investigation notes | Whether the facts suggest a third party caused or contributed to the injury | During initial investigation and ongoing |
| 2 | Document the factual basis for third-party involvement | CCR 10101 | Structured subrogation identification form; pre-populates known facts from claim file | What specific facts indicate third-party involvement — who, what, where, when | Immediately upon identification |
| 3 | Refer to subrogation counsel or subrogation department | LC 3852-3853 (employer's lien rights) | Subrogation referral form pre-populated with claim data, third-party information, and documented facts | Whether the facts are sufficient to warrant referral — when in doubt, refer | Within 10 business days of identification |
| 4 | Track subrogation status and recovery | LC 3856-3860 (distribution of recovery) | Subrogation recovery tracking; lien amount calculation (total WC benefits paid to date) | Whether to update reserves based on subrogation recovery potential | Ongoing |
| 5 | Coordinate lien notices if injured worker files personal injury lawsuit | LC 3853-3854 (notice requirements) | Lien notice template; tracks whether notice has been served on third-party defendant and injured worker's PI attorney | Whether lien notice has been properly served — coordinate with subrogation counsel | Upon learning of PI lawsuit |
| 6 | Continue normal claims handling | Ins. Code 790.03(h)(3)-(6) | Normal workflow; subrogation status visible on claim dashboard | All normal claims decisions — subrogation does not change your benefit obligations to the injured worker | Ongoing |

**Tier 2 (Always Present):** Under LC 3852, the employer (and its insurer) has a lien against any recovery the injured worker obtains from a responsible third party, to the extent of benefits paid. Under LC 3853, if the injured worker does not file a civil action against the third party within one year of the date of injury, the employer/insurer may file suit directly. If neither party files within the applicable statute of limitations (generally 2 years per CCP 335.1), the right is lost forever. This is why early identification matters — the clock is running from the date of injury, not from the date you discover the third-party involvement. A missed subrogation opportunity is unrecoverable money. LC 3856-3860 govern how any recovery is distributed between the injured worker and the employer/insurer, including the allocation of litigation costs and attorney fees.

### Decision Points

**What Triggers a Subrogation Referral:**
Look for any facts suggesting a non-employer, non-co-employee caused the injury. Common scenarios: motor vehicle accidents (the most frequent subrogation source — any claim involving a car, truck, or vehicle collision where someone other than the injured worker was at fault), slip-and-fall on third-party premises (worker injured while visiting a client site, vendor location, or public property), injury caused by defective equipment manufactured by a third party (the employer bought a machine that malfunctioned), assault by a member of the public (customer or stranger), toxic exposure from a third-party product or substance. If the injured worker was on the employer's premises doing their normal job and was injured by the normal hazards of that job with no outside party involved, subrogation is unlikely. If someone or something outside the employment relationship caused the injury, subrogation should be evaluated.

**Tier 2 (Always Present):** The determination of whether a viable subrogation claim exists — whether the third party was legally at fault, whether the claim has sufficient value to pursue, whether comparative negligence reduces the recovery — is a legal analysis. It falls squarely in the YELLOW-RED zone. Your role is to identify the factual indicators and refer. Subrogation counsel evaluates the legal merits. Do not decide that a subrogation claim is "not worth pursuing" based on your own assessment — that evaluation involves legal judgment about liability, damages, collectability, and litigation economics that is outside your scope.

**Subrogation Does Not Reduce the Injured Worker's Benefits:**
A critical point for new examiners: the existence of a subrogation claim does not reduce, delay, or change the benefits owed to the injured worker. The injured worker receives full WC benefits regardless of whether subrogation is pursued. The insurer recovers from the third party separately. Do not tell an injured worker, "You should sue the other driver and we will reduce your benefits." That is wrong both legally and practically. The workers' compensation system is a no-fault system — the injured worker receives benefits regardless of who caused the injury. Subrogation is a separate recovery mechanism that operates between the insurer and the third party.

**Co-Employee Exclusion:**
A co-employee (a fellow worker of the injured worker) acting within the scope of their employment is generally not a subrogation target. Workers' compensation provides the exclusive remedy between co-employees for work-related injuries under LC 3601. If a co-worker's negligence caused the injury, the injured worker's remedy is WC benefits — not a lawsuit against the co-worker. However, if the co-worker was acting outside the scope of employment (e.g., intoxicated, engaged in horseplay, or acting with willful and unprovoked assault), the exclusion may not apply. This distinction is a legal determination — flag the facts and refer to counsel.

**Reserve Impact of Subrogation:**
When a subrogation opportunity is identified, consider whether reserves should reflect the potential recovery. Many carriers establish a "subrogation receivable" or reduce the net reserve to account for expected recovery. Coordinate with your supervisor and actuarial guidance on your company's specific reserving practices for subrogation claims. The recovery is never guaranteed — litigation is uncertain — so reserve adjustments should be conservative.

**Timing Is Everything — The Statute of Limitations Clock:**
The statute of limitations for a personal injury action in California is generally two years from the date of injury (CCP 335.1). Under LC 3853, the employer/insurer can file suit directly against the third party if the injured worker has not done so within one year. This creates two critical dates you must track: (1) the one-year date, after which the insurer can independently file suit, and (2) the two-year date, after which the right to sue expires permanently. AdjudiCLAIMS calculates both dates from the injury date and displays them on the subrogation tracking dashboard. If you identify third-party involvement after the one-year mark, escalate immediately — time is already short.

### Common Mistakes

**Mistake 1: Failing to identify a motor vehicle accident as a subrogation opportunity.** An examiner processes a claim for a warehouse worker injured in a forklift collision. The investigation reveals that the forklift was struck by a delivery truck operated by a contractor — not an employee of the insured employer. The examiner treats it as a standard industrial injury and never flags the third-party involvement. Tens of thousands of dollars in subrogation recovery are lost. Any time a vehicle accident involves a non-employee driver, flag it for subrogation review.

**Mistake 2: Waiting too long to refer.** An examiner identifies possible third-party involvement eight months into the claim but does not refer to subrogation counsel because the claim is "still developing." Under LC 3853, the employer/insurer can file suit after one year if the injured worker has not. If the examiner waits 14 months to refer and the statute of limitations is approaching, subrogation counsel is forced into emergency action — or worse, the window has closed. Refer early, even if the facts are incomplete. Subrogation counsel can evaluate timing and preserve rights while the investigation continues.

**Mistake 3: Evaluating the legal merits of the subrogation claim.** An examiner identifies a third-party involvement but decides "there's probably not enough to pursue — the injured worker was partially at fault" and does not refer. The examiner is not qualified to evaluate tort liability, comparative negligence, or the economics of subrogation litigation. In California, comparative negligence reduces recovery but does not eliminate it (Li v. Yellow Cab Co.). Refer every identified third-party involvement. Let the legal professionals decide whether to pursue.

**Mistake 4: Telling the injured worker to "go sue the other driver."** An examiner identifies a motor vehicle accident caused by a third party and tells the injured worker, "You should file a personal injury lawsuit against the other driver." This is problematic on multiple levels. First, advising someone to file a lawsuit may cross into legal advice territory — you are not a licensed attorney. Second, the insurer's subrogation strategy may differ from what would benefit the injured worker in a PI action. Third, the injured worker's recovery in a PI action affects the insurer's lien rights under LC 3856. The correct approach: document the third-party involvement, refer to subrogation counsel, and let the professionals handle both the subrogation strategy and any coordination with the injured worker's personal injury action.

**Mistake 5: Ignoring subrogation potential on low-value claims.** An examiner identifies third-party involvement on a claim with only $5,000 in medical expenses and decides "it's not worth pursuing." But the claim is still open, and the injured worker may need surgery. By the time the claim totals $85,000, the subrogation opportunity has been forgotten and the statute of limitations has expired. Refer early regardless of current claim value — subrogation counsel can monitor the claim and pursue recovery when the economics justify it.

### Escalation Points

- **Any third-party involvement identified:** Refer to subrogation counsel or department. Do not evaluate legal merits yourself.
- **Statute of limitations approaching:** If you discover third-party involvement late in the claim and the two-year statute of limitations is approaching, escalate immediately to subrogation counsel as urgent. Time-sensitive legal action may be required to preserve rights.
- **Injured worker has retained a personal injury attorney:** If the injured worker has filed or is planning to file a personal injury lawsuit against the third party, notify subrogation counsel immediately. The insurer's lien rights under LC 3852 must be asserted in that action, or the lien may be compromised.
- **Third party is also the employer's client or business partner:** If the potential subrogation target has a business relationship with the employer, notify your supervisor and subrogation counsel. Business relationship dynamics do not eliminate the legal right, but they may affect the strategy.
- **Product liability claim:** If the injury was caused by defective equipment or a product, subrogation counsel may need to engage product liability experts and preserve the defective product as evidence. Notify subrogation counsel immediately and advise the employer not to dispose of, repair, or alter the equipment. Evidence preservation is critical in product liability subrogation.
- **Government entity as third party:** If the third party is a government entity (e.g., a city that failed to maintain a road, a state agency whose vehicle caused the accident), special notice requirements and shorter filing deadlines may apply under the Government Claims Act (Government Code 900-915.4). Flag government entity involvement as urgent.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| Third-party involvement flagged | Source document, specific facts indicating third-party involvement, flag type (auto/premises/product/assault/other) | LC 3850 |
| Examiner review of flag | Confirmed/not confirmed, factual basis documented | CCR 10101 |
| Subrogation referral submitted | Referral date, factual summary, third-party identity (if known), counsel assigned | LC 3852-3853 |
| Lien notice served | Date served, on whom, method of service | LC 3853-3854 |
| Subrogation status updates | Counsel updates, litigation status, settlement negotiations, recovery amounts | LC 3856-3860 |
| Recovery received | Amount recovered, distribution calculation, offset applied to claim costs | LC 3858-3860 |

**Why This Workflow Matters:** Subrogation is one of the most significant cost recovery mechanisms available to workers' compensation insurers. Industry data consistently shows that a disciplined subrogation identification program recovers millions of dollars annually — money that would otherwise be absorbed into the insurer's losses. Yet subrogation opportunities are frequently missed because examiners do not recognize third-party involvement, do not understand what subrogation is, or wait too long to refer. AdjudiCLAIMS scans every claim for third-party indicators from the moment of intake, surfaces them to your attention, and makes referral as simple as confirming the facts and clicking a button. Your vigilance at identification is the critical first step in the recovery chain.

---

## Workflow 18: Cumulative Trauma Claim Handling

**Regulatory Trigger:** Claim filed alleging injury from repeated exposure or repetitive activity over a period of time — not a single incident on a specific date
**Primary Authority:** LC 5500.5 (cumulative injury — liability allocation); LC 5412 (date of injury for cumulative trauma); LC 3208.1 (cumulative injury definition)
**Key Deadlines:** Same as all claims — employer knowledge triggers 14-day payment obligation under LC 4650; 90-day investigation period under LC 5402(b) applies; claim must be accepted or denied within statutory timeframes
**UPL Zone:** GREEN (identifying claim as CT, gathering employment history, calculating exposure periods) / YELLOW-RED (apportionment analysis, coverage disputes between carriers, AOE/COE determinations involving complex legal standards)

**Tier 1 (Dismissable):** A **cumulative trauma (CT)** claim is an injury that develops gradually from repeated exposure to a work condition over time, rather than from a single accident on a specific date. Examples: a data entry clerk develops carpal tunnel syndrome from years of typing; a warehouse worker develops a herniated disc from years of heavy lifting; a firefighter develops hearing loss from prolonged exposure to sirens and equipment noise; an examiner develops a stress-related psychiatric injury from sustained workload pressure. CT claims are among the most complex claim types in California workers' compensation. Here is why:

- **Multiple employers:** If the worker had the same type of exposure at several different jobs, each employer's insurer during the exposure period may share liability.
- **Apportionment:** Medical evaluators must determine how much of the disability is attributable to the industrial cumulative exposure versus other factors (aging, pre-existing conditions, non-industrial activities).
- **Date of injury:** Under LC 5412, the date of injury for a CT claim is the date the employee first suffered disability AND knew or should have known that the disability was caused by work — this is a legal determination, not a calendar date.
- **AOE/COE** stands for "Arising Out of Employment / Course of Employment" — the legal test for whether the injury is work-related. For CT claims, proving AOE/COE is often more complex than for specific injury claims because the exposure is gradual and may involve non-work factors.

Almost every contested CT claim involves attorneys because of these complexities.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify claim as cumulative trauma based on description of injury | LC 3208.1 (cumulative injury defined) | CT claim flag based on claim form language (keywords: "gradual," "over time," "repetitive," "years of"); differentiates from specific injury | Confirm the claim describes a gradual onset from repeated exposure, not a single incident | At intake |
| 2 | Obtain complete employment history for the relevant exposure period | LC 5500.5 (liability during exposure period) | Employment history questionnaire template; calculates potential exposure period based on claimed onset and diagnosis dates | What information to request from the claimant and employer; whether history is complete | Within 14 days of identification |
| 3 | Identify all potentially liable employers and insurers during the exposure period | LC 5500.5(a) (last year of exposure — liability allocation) | Exposure timeline visualization; identifies periods of employment and corresponding insurers during the exposure period | Whether all employers/insurers have been identified; whether additional investigation is needed | Within 30 days |
| 4 | Calculate exposure periods and identify last year of injurious exposure | LC 5500.5(a) (employer during last year of exposure bears full liability initially) | Exposure period calculator; identifies which employer/insurer covers the last year of injurious exposure | Whether the exposure data supports the calculated periods — verify with employment records | Within 30 days |
| 5 | Investigate AOE/COE — gather factual evidence of work-relatedness | CCR 10109 (duty to investigate); LC 3600 (conditions of compensation) | Document checklist for CT investigation: job descriptions, physical demands analysis, medical records showing onset/progression, prior claims history | What additional evidence is needed to evaluate work-relatedness; whether current evidence supports or contradicts the claim | Within 90 days (LC 5402(b) investigation period) |
| 6 | Coordinate with other carriers if applicable | LC 5500.5(c) (contribution among insurers) | Carrier notification templates; contribution demand tracking | Whether to accept coverage for your insured's exposure period and seek contribution from other carriers — coordinate with counsel | Ongoing |
| 7 | Obtain medical evaluation addressing causation, apportionment, and disability | LC 4060-4062 (QME/AME process); LC 4663-4664 (apportionment) | QME/AME request workflow (see Workflow 6); tracks evaluation status | Whether to accept medical findings or dispute through proper channels — consult counsel on disputed medical issues | Per QME/AME timelines |

**Tier 2 (Always Present):** LC 5500.5(a) establishes the default liability rule for CT claims: the employer during the last year of cumulative injurious exposure bears initial liability for the entire claim. That employer's insurer must begin benefit payments. The last-year employer may then seek contribution from other employers/insurers who covered earlier exposure periods under LC 5500.5(c). This means you may receive a contribution demand from another carrier asserting that your insured employed the worker during the exposure period. Alternatively, you may need to file contribution demands against other carriers. The determination of which employers are liable, and for what proportion of the disability, involves legal analysis of employment records, exposure evidence, and medical apportionment findings. This is YELLOW-RED zone work. Your role is to gather the factual foundation — employment history, exposure data, medical records — and coordinate with counsel on liability and apportionment determinations.

### Decision Points

**Is This Really a CT Claim?**
Some claims are filed as CT but are actually specific injuries. If a worker says, "My back has been bothering me for years from lifting," that is CT. If a worker says, "I hurt my back lifting a box on March 5th, and it has been getting worse since," that is a specific injury with subsequent development — not CT. The distinction matters because the liability rules, date of injury, and investigation approach differ significantly. AdjudiCLAIMS flags this distinction at intake. If uncertain, investigate both theories — a worker can have both a specific injury and a cumulative trauma to the same body part.

**Tier 2 (Always Present):** The date of injury for a CT claim under LC 5412 is the date the employee first suffered disability AND either knew or should have known it was caused by employment. This is not the date the claim was filed, the date of the last day of work, or the date of the first medical visit. It is a legal determination that affects which insurer is liable, whether the statute of limitations has run, and which benefit rates apply. If the date of injury is disputed, this is a legal issue for counsel. Getting the date of injury wrong can mean your carrier is on the risk when it should not be — or off the risk when it should be on.

**The "Last Year" Rule and Why It Creates Disputes:**
Under LC 5500.5(a), the employer/insurer covering the last year of injurious exposure bears initial full liability. This creates predictable disputes: every carrier wants to prove it was NOT the last-year carrier. If the worker had three employers over 10 years of exposure, the third employer's insurer pays all benefits first and then seeks contribution from the first and second. This allocation is inherently adversarial between carriers. Your role is to gather the employment records that establish the exposure timeline. The legal arguments about who was "last" are for counsel.

**Psychiatric CT Claims — Additional Complexity:**
Psychiatric cumulative trauma claims (stress, anxiety, depression from work conditions) face additional legal hurdles. Under LC 3208.3, a psychiatric injury requires at least six months of employment (with exceptions), and the employment must be a "predominant cause" (more than 50%) of the psychiatric injury if there are fewer than six months of employment. These thresholds are legal standards applied to medical evidence. If you receive a psychiatric CT claim, refer to counsel early — the legal and medical standards are more demanding than for physical CT claims.

### Common Mistakes

**Mistake 1: Treating a CT claim like a specific injury.** An examiner receives a claim alleging carpal tunnel syndrome from 15 years of data entry work. The examiner investigates only the current employer and current job duties, ignoring the prior 14 years of employment at three other companies. This fails to identify potentially liable carriers, deprives the examiner of evidence needed for apportionment, and results in the current carrier bearing 100% of liability that should be shared. Always obtain the complete employment history for the entire alleged exposure period.

**Mistake 2: Accepting the applicant's stated date of injury without investigation.** The applicant claims the CT date of injury is January 2026, the date they stopped working. But medical records show the applicant was diagnosed with the condition in 2023 and was placed on work restrictions at that time. Under LC 5412, the date of injury may be 2023 — when the employee first suffered disability and knew it was work-related. The date of injury affects which insurer is on the risk, the applicable benefit rates, and the statute of limitations. Investigate the actual LC 5412 date — do not accept the claimed date at face value. Refer the date-of-injury determination to counsel if disputed.

**Mistake 3: Attempting to resolve apportionment without counsel.** An examiner receives a QME report that apportions 40% of the permanent disability to the industrial CT and 60% to pre-existing degenerative changes. The examiner calculates permanent disability based on 40% and issues an offer. But apportionment under LC 4663-4664 involves complex legal standards — including whether the non-industrial apportionment is supported by substantial medical evidence and whether it complies with case law standards (Escobedo, Benson, etc.). The examiner has no business evaluating whether the apportionment is legally valid. Refer apportionment questions to counsel before issuing any offers or determinations based on apportioned findings.

### Escalation Points

- **Date of injury disputed:** Refer to counsel. LC 5412 date determination is a legal analysis.
- **Multiple carriers involved:** Refer to counsel for contribution demands and allocation. Inter-carrier disputes are litigated at the WCAB.
- **Apportionment findings received:** Refer to counsel to evaluate whether the medical apportionment is legally sufficient under current case law.
- **AOE/COE disputed:** If the employer denies the work-relatedness of the cumulative exposure, refer to counsel. Causation disputes in CT claims almost always require legal representation.
- **Psychiatric CT claim filed:** Refer to counsel immediately. The legal standards under LC 3208.3 require legal analysis from the outset. Psychiatric CT claims have a higher litigation rate and more complex evidentiary requirements than physical CT claims.
- **Any CT claim where the applicant is represented by an attorney:** Coordinate with defense counsel from the outset. Represented CT claims are litigated matters.
- **Employer disputes that the work caused the condition:** If the employer contests AOE/COE, this will likely require medical-legal evaluation and potentially a trial. Refer to counsel and ensure the investigation file is complete and well-documented — the quality of your investigation becomes the foundation for the legal defense.
- **Worker alleges CT to multiple body parts:** CT claims frequently involve multiple body parts (e.g., both shoulders, low back, and neck from years of heavy lifting; or carpal tunnel in both wrists plus cervical spine from years of computer work). Each body part may require separate medical evaluation, and apportionment may differ by body part. Document all alleged body parts at intake and ensure medical evaluations address each one.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| CT claim identified | Claim form language, classification rationale, flag source (examiner/AI) | LC 3208.1 |
| Employment history obtained | Employers, dates of employment, job duties, exposure description for each period | LC 5500.5 |
| Carrier identification | Each insurer during exposure period, policy numbers, coverage dates | LC 5500.5 |
| Exposure period calculated | Last year of injurious exposure identified, calculation methodology | LC 5500.5(a) |
| Other carrier notifications | Date notified, carrier name, response received, contribution demand status | LC 5500.5(c) |
| Medical evaluation requested | QME/AME panel request, evaluation date, issues to be addressed (causation, apportionment, disability) | LC 4060-4062 |
| Counsel referral | Date referred, issues identified (date of injury/apportionment/AOE-COE/carrier dispute), counsel assigned | CCR 10101 |

**Why This Workflow Matters:** CT claims represent a disproportionate share of total WC costs because of their complexity, their tendency to involve multiple body parts, their longer duration of disability, and the legal costs associated with multi-carrier disputes and apportionment litigation. A CT claim that is mishandled at the outset — incorrect date of injury, incomplete employment history, failure to identify other carriers — cascades into compounding problems that are expensive and time-consuming to correct. AdjudiCLAIMS structures the CT investigation from intake, ensures the employment history is complete, calculates exposure periods, and connects you to counsel at every decision point that crosses into legal territory. This is the workflow where the examiner-counsel partnership matters most.

---

## Workflow 19: Death Benefit Claim Processing

**Regulatory Trigger:** Death of an injured worker where the death is or may be industrially caused — either death from a work injury or death resulting from a previously accepted industrial injury
**Primary Authority:** LC 4700-4706 (death benefits); LC 4701 (dependency determination); LC 4702 (dependency categories and benefit amounts); LC 4703.5 (burial allowance)
**Key Deadlines:** First death benefit payment must begin within 14 days of employer knowledge of death per LC 4650 (applied to death benefits); burial allowance payable promptly upon verification of death and dependency
**UPL Zone:** GREEN (identifying death claim, gathering dependency documentation, calculating benefit amounts per statutory tables) / YELLOW-RED (determining industrial causation of death, resolving disputed dependency status, complex apportionment of death to industrial vs. non-industrial causes)

**Tier 1 (Dismissable):** A **death benefit claim** arises when a worker dies and the death is caused by a work-related injury or condition. The workers' compensation system provides two types of benefits when this happens: (1) **Death benefits** — ongoing payments to the worker's **dependents** (people who relied on the worker financially), and (2) **Burial allowance** — a fixed amount to help pay for funeral and burial expenses.

**Dependents** are people who relied on the deceased worker for financial support. California law recognizes two categories:
- **Total dependents** are people who were wholly dependent on the worker's earnings — they relied on the worker as their primary or sole source of financial support. A **spouse** and **minor children** are presumed to be totally dependent under LC 4702, meaning the law assumes they qualify unless proven otherwise.
- **Partial dependents** received some financial support from the worker but were not wholly reliant on them — for example, an adult child or parent to whom the worker contributed regular financial support but who also had other income.

The amount of death benefits depends on the dependency category, the number of dependents, and the worker's earnings at the time of injury. This is one of the most sensitive claim types you will handle. A family has lost someone. Handle it with care, urgency, and meticulous attention to their rights.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Verify the death and its circumstances | LC 4700 (death benefits payable when death results from injury) | Death verification checklist: death certificate, medical records linking death to industrial injury, autopsy report if available | Whether the documents sufficiently verify the death and its potential industrial causation — if causation is unclear, refer to counsel | Immediately upon notice |
| 2 | Investigate industrial causation of the death | LC 3600 (conditions of compensation); LC 4700 | Causation investigation checklist: prior claim history, treating physician records, cause of death on death certificate vs. industrial injury diagnosis | Whether the evidence supports industrial causation — if disputed or unclear, refer to counsel immediately | Within 14 days |
| 3 | Identify all potential dependents | LC 4701 (dependency determination); LC 4702 (categories) | Dependent identification questionnaire; statutory presumptions reference (spouse and minor children presumed total dependents) | Whether all potential dependents have been identified — request additional information if dependency is unclear | Within 14 days |
| 4 | Determine dependency status for each potential dependent | LC 4701-4702 | Dependency analysis template: total vs. partial dependent criteria, statutory presumptions, financial support documentation checklist | Whether each dependent qualifies as total or partial — note: disputed dependency is a legal determination (YELLOW zone), consult counsel | Within 30 days |
| 5 | Calculate death benefit amount | LC 4702(a) (total dependents — benefit amounts by number of dependents); LC 4702(b) (partial dependents) | Benefit calculator: applies statutory rates based on dependency status, number of dependents, and date of injury; displays current statutory maximum and minimum | Whether the calculation inputs are correct (dependency status, number of dependents, earnings data) | Within 30 days |
| 6 | Initiate death benefit payments | LC 4650 (payment timing — 14 days); LC 4702 | Payment schedule generator based on calculated benefit amount and payment frequency | Confirm payment amount and payee(s) are correct before initiating | Within 14 days of employer knowledge |
| 7 | Process burial allowance | LC 4703.5 (burial allowance — currently $10,000) | Burial allowance amount per current statute; payment form pre-populated | Verify that the person requesting the allowance is the appropriate recipient | Promptly upon verification |
| 8 | Monitor for additional dependent claims | LC 4701-4702 | Dependent tracking dashboard; statute of limitations for dependency claims | Whether newly identified dependents have valid claims — refer disputed claims to counsel | Ongoing for 240 weeks from date of injury |

**Tier 2 (Always Present):** LC 4702(a) sets death benefit amounts based on the number of total dependents. As of the current statutory schedule: one total dependent receives a specified maximum (verify current LC 4702(a)(1)-(3) amounts — these are periodically adjusted by the legislature); three or more total dependents receive the statutory maximum. For partial dependents, LC 4702(b) provides a death benefit equal to four times the annual support the worker was providing, up to the statutory maximum for total dependents. LC 4703.5 provides a burial allowance of $10,000 (verify current amount — subject to legislative amendment). The 14-day payment rule under LC 4650 applies to death benefits — late payment triggers the 10% self-imposed increase under LC 4650(c) (see Workflow 20). In a death claim, late payment is not just a compliance issue — it is a family without income while grieving. The legislature imposed tight timelines for this reason.

### Decision Points

**Industrial Causation of Death:**
The threshold question is whether the death resulted from the industrial injury. If the worker died from a traumatic injury that occurred at work — a fall, an equipment accident, a workplace violence incident — causation is usually clear. If the worker had an accepted industrial injury, recovered partially, and then died months or years later, causation may be disputed. Did the industrial injury contribute to the death? Was the death from an entirely unrelated cause? A worker with an accepted back injury who dies in a car accident unrelated to work — that is likely not industrial. A worker with an accepted cardiac condition who suffers a fatal heart attack — that may be industrial. This is a medical and legal question. If causation is not straightforward, refer to counsel immediately. Do not delay benefit payments while causation is investigated if there is a reasonable basis to believe the death is industrial — LC 4650(d) requires payment during investigation.

**Tier 2 (Always Present):** Dependency determination under LC 4701 may require legal analysis when the facts are not straightforward. A surviving spouse and minor children are presumed to be totally dependent (LC 4702). But what if the worker was separated from their spouse? What if there are adult children who received financial support? What if a domestic partner asserts dependency? What if the worker had children from multiple relationships? These are legal questions that may require WCAB proceedings to resolve. When dependency is undisputed (surviving spouse and minor children only, no competing claims), the examiner can proceed with benefit calculations. When dependency is disputed or involves non-presumptive dependents, consult counsel before making dependency determinations. An incorrect dependency determination can result in paying the wrong people or paying the wrong amounts — both of which create liability.

**No Dependents Identified:**
If the deceased worker had no dependents, death benefits are not payable under LC 4706.5 — but the burial allowance under LC 4703.5 is still payable to the person who incurred the burial expenses. Additionally, if no dependents are identified, a portion of the death benefit that would have been payable may go to the state under certain circumstances. Consult counsel if no dependents are identified.

### Common Mistakes

**Mistake 1: Delaying payments while investigating causation.** An examiner receives notice that an injured worker with an accepted back injury has died. The death certificate lists "cardiac arrest" as the cause of death. The examiner is unsure whether the death is related to the industrial injury and delays death benefit payments pending a medical opinion. The surviving spouse and two minor children receive no income for six weeks. This violates LC 4650 — payment must begin within 14 days even if causation is under investigation. If there is a reasonable possibility the death is industrial (the worker had an accepted claim), begin payments and investigate causation concurrently. If causation is ultimately determined to be non-industrial, the overpayment issue can be addressed through proper channels — but delaying benefits to a grieving family triggers penalties and bad faith exposure.

**Mistake 2: Missing a partial dependent.** An examiner identifies the surviving spouse and two minor children as dependents but fails to investigate whether the deceased worker was also providing financial support to an elderly parent. The parent later files a claim for partial dependency benefits. The examiner must now reopen the dependency investigation, potentially adjust the benefit allocation, and has delayed benefits to a legitimate dependent. Always ask during the initial investigation: is there anyone else who relied on the worker for financial support? Cast a wide net. It is better to identify and evaluate all potential dependents early than to be surprised later.

**Mistake 3: Paying the wrong burial allowance amount.** The burial allowance amount under LC 4703.5 has been amended multiple times by the legislature. An examiner pays based on an outdated statutory amount — either overpaying (creating an overpayment recovery problem) or underpaying (requiring a supplemental payment and creating a complaint). AdjudiCLAIMS maintains the current statutory amount and flags the applicable rate based on the date of injury — always verify against the current statute, as the amount applicable is determined by the date of injury, not the date of death.

**Mistake 4: Failing to communicate with compassion and clarity.** A death benefit claim is not a routine file. The people you are communicating with have lost a family member. An examiner sends a form letter requesting "proof of dependency" without any acknowledgment of the loss or explanation of why the documentation is needed. The family perceives the insurer as callous and adversarial. While you must gather the information required by statute, how you communicate matters. Acknowledge the loss. Explain in plain language what information is needed and why. Provide a direct contact number for questions. AdjudiCLAIMS provides communication templates for death benefit claims that balance compliance requirements with appropriate tone. Use them.

**Mistake 5: Treating a death claim as routine priority.** An examiner processes a death benefit claim on the same timeline as a standard TD claim — "I'll get to it when I get to it." Death claims require immediate escalation. The family may have lost their primary income. Minor children may be involved. The 14-day payment deadline under LC 4650 is the same as for TD, but the human urgency is greater. Prioritize death claims above routine work.

### Escalation Points

- **Industrial causation of death disputed or unclear:** Refer to counsel immediately. This is a medical-legal determination requiring expert analysis. Do not attempt to determine causation yourself.
- **Dependency status disputed:** If anyone contests who qualifies as a dependent, or if non-presumptive dependents assert claims, refer to counsel. Dependency disputes are resolved at the WCAB.
- **Multiple dependents with competing claims:** If total and partial dependents both assert claims and the allocation is disputed, refer to counsel. Benefit allocation among multiple dependents is a legal function.
- **Death of an unrepresented worker:** If the deceased worker did not have an attorney, be especially careful that dependents are informed of their rights. Do not provide legal advice — direct them to the Information and Assistance Officer at the local DWC district office, who can explain the process and their options.
- **Any death claim:** Notify your supervisor immediately upon receipt. Death claims require heightened attention due to their severity, sensitivity, potential for litigation, and the vulnerability of the dependents.
- **Minor children as dependents:** If the deceased worker has minor children, additional considerations apply. Payments may need to be made to a guardian or through a guardianship proceeding. If no guardian has been appointed, consult counsel on the proper payment mechanism. Never pay death benefits directly to a minor child.
- **Concurrent death and subrogation:** If the death was caused by a third party (e.g., a fatal vehicle accident at work caused by another driver), both this workflow and Workflow 17 (Subrogation) apply simultaneously. Initiate both workflows in parallel — death benefit payments to dependents and subrogation referral against the third party.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| Death notification received | Date of notice, source of notification, date of death, circumstances | LC 4700 |
| Industrial causation investigation | Evidence reviewed, medical opinions obtained, causation determination or referral to counsel | LC 4700, CCR 10109 |
| Dependents identified | Each dependent: name, relationship, dependency category (total/partial), supporting documentation | LC 4701-4702 |
| Dependency status determined | Basis for each determination, statutory presumption applied or factual analysis, counsel consulted (Y/N) | LC 4701-4702 |
| Benefit calculation | Number of dependents, dependency categories, applicable statutory rates, calculated payment amount, date of injury rate applied | LC 4702 |
| First payment issued | Payment date, amount, payee(s), confirmation of 14-day compliance | LC 4650 |
| Burial allowance paid | Amount, recipient, date, statutory basis, verification of expenses | LC 4703.5 |
| Counsel referral (if applicable) | Date referred, issues identified (causation/dependency/other), counsel assigned | CCR 10101 |

**Why This Workflow Matters:** Death benefit claims are the most consequential claims you will handle. The stakes are absolute — a worker has died, a family has lost their provider, and children may have lost a parent. The regulatory framework reflects this severity: the payment timelines are tight, the benefit amounts are statutory, and the penalties for mishandling are significant. But beyond compliance, this is the workflow where your humanity as a claims professional matters most. A death claim handled with competence, urgency, and compassion reflects the values of the organization you represent. AdjudiCLAIMS structures the process, calculates the benefits, tracks the deadlines, and provides communication templates — so you can focus on getting it right and treating the family with the dignity they deserve.

---

## Workflow 20: Penalty Self-Assessment (LC 4650(c))

**Regulatory Trigger:** Temporary disability payment was not made within the required 14-day timeframe under LC 4650 — the payment is late
**Primary Authority:** LC 4650(c) (10% self-imposed increase for late TD payment); LC 5814 (WCAB-imposed penalty up to 25% for unreasonable delay)
**Key Deadlines:** Self-assessment should be added to the next payment immediately upon identification of the late payment; no grace period
**UPL Zone:** GREEN (calculating and self-assessing the 10% penalty is an administrative/mathematical function)

**Tier 1 (Dismissable):** When a temporary disability (TD) payment is late — meaning it was not paid within 14 days as required by LC 4650 — the insurer must add a **10% penalty** to the late payment. This penalty is called a "self-imposed increase" under LC 4650(c). The insurer does not wait for someone to complain or for a judge to order it. The insurer identifies that the payment was late and adds the 10% automatically. Think of it as a self-assessed late fee.

Here is why self-assessment exists and why it is actually in the insurer's interest: if the insurer does NOT self-assess the 10% penalty, the injured worker (or their attorney) can petition the **WCAB (Workers' Compensation Appeals Board)** for a penalty under **LC 5814**, which allows a penalty of up to **25%** of the delayed payment amount for unreasonable delay or refusal to pay benefits. The WCAB can also award attorney fees to the applicant's attorney on top of the penalty. So the math is straightforward: self-assess 10% now, or risk paying 25% plus attorney fees later. Self-assessing the 10% is cheaper than fighting a 25% penalty petition, paying the applicant attorney's fees, and explaining to a judge why you did not follow the statute.

This workflow is corrective — it fixes the immediate problem (the penalty owed) and then addresses the root cause to prevent recurrence. It is the only workflow in this document designed to fix your own mistakes.

---

### Step-by-Step

| Step | Action | Authority | AdjudiCLAIMS Provides | You Decide | Timeline |
|------|--------|-----------|----------------------|------------|----------|
| 1 | Identify that a TD payment was late | LC 4650 (14-day payment requirement); LC 4650(b) (subsequent payments every 14 days) | Late payment alert: system compares payment issuance date against the 14-day deadline; flags any payment issued past the deadline with the number of days late | Confirm the payment was actually late — verify the facts (was there a legitimate delay reason such as employer delay in reporting? Was the payment issued on time but delivered late by mail?) | Immediately upon identification |
| 2 | Calculate the 10% self-imposed penalty amount | LC 4650(c) | Penalty calculator: 10% of the late payment amount, displayed with the underlying payment amount and the late payment date | Verify the calculation inputs are correct (correct payment amount, correct TD rate) | Same day as identification |
| 3 | Add the penalty amount to the next TD payment | LC 4650(c) | Payment adjustment form pre-populated with penalty amount; combined payment amount (regular TD + penalty) displayed for review | Approve the adjusted payment before it is issued | Next scheduled payment — do not delay |
| 4 | Document the late payment and self-assessment in the claim file | CCR 10101 (file documentation) | Documentation template: records original due date, actual payment date, days late, penalty amount, statutory basis, corrective action | Confirm documentation is complete and accurate | Same day as penalty payment |
| 5 | Assess root cause of the late payment | CCR 10109 (reasonable claims handling standards) | Root cause analysis prompts: Was it a workload issue? A missed deadline? A system error? An employer reporting delay? A pending investigation that should not have delayed payment? | What caused the late payment — be honest in the assessment, not defensive | Within 5 business days |
| 6 | Implement process improvement to prevent recurrence | 10 CCR 2695.6 (training and procedures) | Suggests preventive actions based on root cause category; links to relevant deadline management tools and workflows | What specific corrective action to take — and whether to escalate systemic issues to supervision | Within 10 business days |

**Tier 2 (Always Present):** LC 4650(c) is mandatory, not discretionary. The statute states that if payment is not made within the required timeframe, the amount shall be increased by 10%. "Shall" means must — there is no room for interpretation and no examiner discretion. The examiner does not decide whether to self-assess — the statute requires it every time a payment is late. Failure to self-assess the 10% penalty does not make the penalty go away. It means the insurer has now committed two violations: (1) the original late payment, and (2) failure to self-assess the statutorily required penalty. When the applicant's attorney discovers both — and they will, because attorneys routinely audit payment histories — the attorney will petition for LC 5814 penalties (up to 25%), argue that the insurer's failure to self-assess demonstrates bad faith, and seek attorney fees. The self-assessment obligation under LC 4650(c) is one of the most audited compliance points in DOI examinations. Auditors check whether late payments were identified and whether the 10% was assessed. Every missed self-assessment is a separate audit finding under CCR 10108.

### Decision Points

**When is a Payment "Late"?**
A TD payment is late if it is not issued within 14 days of the triggering event. For the first payment, the trigger is the date of the employer's knowledge of the injury (LC 4650). For subsequent payments, the trigger is 14 days after the prior payment (LC 4650(b)). Note: LC 4650(d) requires payment within 14 days even if liability has not been determined — the insurer must pay during the investigation period. The only exception is if the claim has been formally denied within the 14-day window. If you denied the claim before the 14-day payment deadline and the denial is valid, no payment is due and no penalty applies. But if the denial is later overturned, the payment obligation is retroactive — and all the penalties accrue.

**Tier 2 (Always Present):** LC 5814 authorizes the WCAB to impose a penalty of up to 25% on any benefit payment that has been unreasonably delayed or refused. Unlike the 10% self-assessment under LC 4650(c), the LC 5814 penalty is imposed by a judge after a petition and hearing. The 25% penalty is in addition to — not instead of — the 10% self-assessment. An insurer who is late AND fails to self-assess faces potential total penalties of 35% (10% under 4650(c) + 25% under 5814) plus applicant attorney fees. Self-assessment is the insurer's first line of defense. It demonstrates good faith. It often prevents the LC 5814 petition from being filed at all, because the applicant attorney sees that the insurer has already acknowledged the error and self-corrected. A self-correcting insurer is a less attractive target for penalty petitions than one that ignores its own errors.

**Multiple Late Payments on the Same Claim:**
If you identify that multiple TD payments on the same claim were late, self-assess the 10% penalty on each late payment individually. Do not try to "batch" them or apply a single penalty to multiple late payments. Each late payment is a separate statutory violation with its own 10% obligation. Document each one separately.

**The "Why Was It Late?" Question — Common Root Causes:**
Understanding why payments are late is essential to preventing recurrence. Common root causes include: (a) workload — the examiner has too many claims and lost track of the payment schedule; (b) diary failure — the payment reminder system did not trigger or was dismissed; (c) employer reporting delay — the employer was late notifying the insurer, compressing the 14-day window; (d) investigation confusion — the examiner mistakenly believed they could withhold payment during investigation (LC 4650(d) says otherwise); (e) system error — the claims system did not process the payment correctly. Each root cause has a different fix. AdjudiCLAIMS surfaces the root cause category to help you implement the right corrective action.

**This Workflow Applies to More Than TD:**
While LC 4650(c) specifically addresses temporary disability payments, the principle of self-assessment applies broadly. Late payment of any benefit — permanent disability advances, supplemental job displacement vouchers, medical payments — can trigger penalty exposure under LC 5814. The 10% self-assessment under LC 4650(c) is specifically mandated for TD, but the discipline of identifying late payments, self-correcting, documenting, and preventing recurrence should be applied to all benefit types. AdjudiCLAIMS tracks all payment deadlines across all benefit types and alerts you when any payment is approaching or past its deadline.

**The Relationship Between 4650(c) and 5814:**
Think of these two statutes as a two-tier penalty system. LC 4650(c) is the first tier — a self-imposed 10% increase that you control. LC 5814 is the second tier — a judge-imposed penalty of up to 25% that you do not control. The first tier exists specifically so that the second tier is less likely to be triggered. When you self-assess the 10%, you are telling the injured worker (and their attorney, and any future judge): "We know the payment was late. We acknowledged it. We corrected it. We assessed the statutory penalty ourselves." That is the posture of a responsible claims handler acting in good faith. The alternative posture — ignoring the late payment and hoping no one notices — is the posture that invites LC 5814 petitions, judicial scrutiny, and bad faith findings.

### Common Mistakes

**Mistake 1: Not self-assessing because "it was only one day late."** An examiner issues a TD payment on day 15 instead of day 14. The examiner thinks one day is immaterial and does not self-assess the penalty. At the next DOI audit, the auditor pulls the file, calculates the days, and writes a finding. One day late is still late. The statute does not provide a grace period, a de minimis exception, or any wiggle room. Self-assess the 10% on every late payment, regardless of how many days late. The math: if the TD payment was $1,200 and it was one day late, the penalty is $120. Paying $120 now is far better than paying $300 (25%) plus $2,000 in applicant attorney fees later.

**Mistake 2: Self-assessing but not documenting.** An examiner adds the 10% to the next payment but does not document why the additional amount was included. The injured worker receives a payment that is larger than expected and calls to ask why. The examiner explains verbally but the file has no written documentation. During an audit, there is no evidence that the self-assessment was intentional rather than a payment calculation error. Without documentation, the auditor cannot credit the self-assessment. Document every self-assessment with: what payment was late, how many days late, the penalty amount calculated, the statutory basis (LC 4650(c)), and the date the penalty was paid.

**Mistake 3: Treating the symptom without addressing the root cause.** An examiner self-assesses penalties on three different claims in the same month but does not investigate why payments are consistently late. The root cause turns out to be a broken diary system — the examiner's payment reminders are not firing on the correct dates. Without root cause analysis, the same error keeps occurring, penalties accumulate across the book of business, and the pattern becomes evidence of a systematic claims handling deficiency — exactly the kind of pattern that triggers an Ins. Code 790.03 "general business practice" finding during a DOI audit. That elevates the issue from individual file findings to a company-level enforcement action. Self-assess the penalty AND fix the underlying problem.

**Mistake 4: Blaming the employer for a late payment without documentation.** An examiner's payment is late because the employer did not report the claim timely. The examiner notes "employer reported late" but does not document the specific dates — when the injury occurred, when the employer learned of it, when the employer reported to the insurer, and when the insurer received the report. Without specific dates, the late-reporting defense is just an assertion. Document the timeline with precision: "Injury date: 3/1. Employer knowledge: 3/3. Employer report to insurer: 3/12 (9 days after knowledge). Insurer receipt: 3/12. 14-day clock starts: 3/12. Payment due: 3/26." This documentation supports the root cause analysis and may mitigate LC 5814 exposure if the late payment is challenged.

### Escalation Points

- **Pattern of late payments across multiple claims:** If you identify that you are self-assessing penalties on more than two claims in a single month, notify your supervisor. This may indicate a workload issue, a system problem, or a training gap that requires management intervention — not just individual correction.
- **Applicant attorney files LC 5814 petition despite self-assessment:** If the attorney petitions for additional penalties beyond your 10% self-assessment, refer to defense counsel immediately. The response to a 5814 petition is a legal matter involving strategy, evidence, and hearing preparation.
- **Late payment caused by system error or employer reporting delay:** If the root cause is outside your control (claims system outage, employer failed to report the claim timely), document the external cause thoroughly with dates and specifics. This evidence may mitigate exposure if a 5814 petition is filed — the WCAB considers whether the delay was "unreasonable," and circumstances beyond the insurer's control are relevant to that determination.
- **Uncertainty about whether payment was actually late:** If the facts are ambiguous — for example, the employer's date of knowledge is disputed, or there is a question about when the 14-day clock started — consult your supervisor. It is better to self-assess unnecessarily (the 10% overpayment can be addressed) than to fail to self-assess when required (which creates escalating penalty exposure).
- **Applicant attorney sends a demand letter citing late payments:** If you receive a letter from an applicant attorney identifying late payments and demanding penalties, immediately verify the payment dates, self-assess any missed penalties, and refer the letter to defense counsel. An attorney demand letter is often the precursor to a formal LC 5814 petition — addressing the issue proactively can sometimes prevent the petition from being filed.
- **New claim with compressed timeline:** If the employer was late reporting the claim and you receive the file with only a few days left in the 14-day payment window (or already past it), document the employer's late reporting, initiate payment immediately, and self-assess the penalty if the 14-day window has passed. The employer's delay in reporting does not excuse the insurer's payment obligation, but it is relevant context for root cause documentation and may mitigate LC 5814 exposure.

### Audit Trail — What Gets Logged

| Event | Data Captured | Regulation |
|-------|--------------|------------|
| Late payment identified | Original due date, actual payment date, days late, payment amount, how identified (system alert/manual review/attorney demand) | LC 4650 |
| Penalty calculated | Late payment amount, 10% penalty amount, total adjusted payment | LC 4650(c) |
| Penalty payment issued | Payment date, payee, combined amount (TD + penalty), payment method | LC 4650(c) |
| File documentation | Narrative entry: which payment was late, how many days, why it was late, penalty calculation, statutory basis (LC 4650(c)) | CCR 10101 |
| Root cause assessed | Category (workload/diary failure/system error/employer delay/investigation confusion/other), specific description | 10 CCR 2695.6 |
| Corrective action implemented | Description of process change, date implemented, supervisor notified (Y/N), systemic issue escalated (Y/N) | 10 CCR 2695.6 |

**Why This Workflow Matters:** This is the only workflow in this document that exists to fix your own errors. Every other workflow is about handling a claim event. This one is about handling your mistake — and handling it well. The self-assessment discipline under LC 4650(c) embodies a principle that applies to all of claims handling: when you make an error, own it, correct it, document it, and prevent it from recurring. Insurers that self-correct earn credibility with the WCAB, with the DOI, and with applicant attorneys. Insurers that ignore their own errors earn penalty petitions, audit findings, and bad faith lawsuits. AdjudiCLAIMS tracks every payment deadline across your entire caseload, alerts you before deadlines pass, and catches the ones you miss. When a payment is late, the system walks you through this workflow so the correction is documented, the penalty is paid, and the root cause is addressed. The goal is not just to fix today's late payment — it is to ensure you never have to run this workflow again.

---

## Appendix: Workflow Cross-Reference to Regulatory Education Spec

Each workflow in this document corresponds to education entries in [ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md](ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md). The education spec provides detailed regulatory context for each duty; the workflows provide the step-by-step execution path.

| Workflow | Primary Education Spec Entries |
|----------|------------------------------|
| 1. New Claim Intake | 10 CCR 2695.5(b), CCR 10101, CCR 10109 |
| 2. Three-Point Contact | CCR 10109, 10 CCR 2695.5(e) |
| 3. Coverage Determination | Ins. Code 790.03(h)(5), 10 CCR 2695.7(b) |
| 4. TD Benefits | LC 4650, LC 4650(b)-(d), LC 4653 |
| 5. UR Authorization | LC 4610, CCR 9792.6-9792.12 |
| 6. QME/AME Process | LC 4060-4062 |
| 7. Reserve Setting | Ins. Code 790.03(h)(6) |
| 8. Counsel Referral | B&P 6125, Ins. Code 790.03(h)(6) |
| 9. Denial Issuance | Ins. Code 790.03(h)(4), (h)(14), 10 CCR 2695.7(h) |
| 10. Delay Notification | 10 CCR 2695.7(c) |
| 11. Employer Notification | LC 3761, LC 3762 |
| 12. DOI Audit Response | CCR 10105-10108 |
| 13. Lien Management | LC 4903 |
| 14. Return-to-Work | LC 4600, LC 4658.5-4658.6 |
| 15. Claim Closure | CCR 10102 |
| 16. Fraud Response | Ins. Code 1871, Penal Code 550 |
| 17. Subrogation | LC 3850-3865 |
| 18. Cumulative Trauma | LC 5500.5, LC 5412 |
| 19. Death Benefits | LC 4700-4706 |
| 20. Penalty Self-Assessment | LC 4650(c) |

---

**Document Status:** Product design specification — review before implementation
**Owner:** Product / Engineering / Training
**Legal Review:** Required — workflows must not cross into legal advice

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
