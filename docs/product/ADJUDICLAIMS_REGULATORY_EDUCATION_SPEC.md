# AdjudiCLAIMS — Contextual Regulatory Education Specification

**Product:** AdjudiCLAIMS by Glass Box — Augmented Intelligence for CA Workers Compensation Claims Professionals
**Document Type:** Product Design Specification — Contextual Education Content
**Purpose:** Defines the in-product education content that appears at every examiner decision point, explaining the statutory authority, practical standard, consequences of non-compliance, and common mistakes for each legally mandated duty
**Philosophy:** From Black Box to Glass Box — the regulatory framework becomes transparent
**Audience Baseline:** Zero WC knowledge — every term defined, every regulation explained in plain English
**Last Updated:** 2026-03-23
**Legal Review Required:** Yes — education content must not cross into legal advice (GREEN zone only)
**Foundation:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md](foundations/WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md)

---

## Progressive Disclosure Model

Education content in AdjudiCLAIMS is split into two tiers:

### Tier 1: Dismissable Basics (Training Wheels)
Term definitions, acronym explanations, process overviews. New examiners see these by default. Once the examiner knows the concept, they dismiss it permanently. The product remembers their preference.

**Examples:** "AWE stands for Average Weekly Earnings — the worker's average weekly pay before injury." / "A QME (Qualified Medical Examiner) is a physician certified by the DWC to evaluate disputed medical issues in workers' comp claims."

### Tier 2: Always-Present Core Explanations (Glass Box Foundation)
Statutory authority, regulatory reasoning, consequences of non-compliance. These are NEVER hidden. Even a 20-year veteran benefits from seeing the regulatory basis for each action. This is the Glass Box foundation — the system is always transparent, always cited, always explainable.

**Examples:** "LC 4650 requires first TD payment within 14 days because the legislature determined injured workers should not bear financial hardship during claim investigation." / "Missing the 40-day deadline under 10 CCR 2695.7(b) is a DOI audit violation that can result in administrative penalties per CCR 10108."

### UPL Compliance Note
All education content is factual and regulatory — it explains the system, it does not tell the examiner what to decide. Education is GREEN zone content. "The statute requires X" is education. "You should do X" is legal advice. The line is clear.

---

## Part 1: California Insurance Code — Unfair Claims Settlement Practices Act

> **Cal. Ins. Code § 790.03(h)** is the core statutory authority governing claims examiner conduct. It prohibits 16 specific unfair claims settlement practices. Violation constitutes an unfair business practice subject to Department of Insurance (DOI) enforcement action under Ins. Code § 790.06.

**Tier 1 (Dismissable):** The California Insurance Code is the set of state laws that govern how insurance companies must operate in California. Section 790.03 specifically addresses unfair business practices in claims handling. Think of it as the rulebook that defines what you CANNOT do as a claims examiner. The Department of Insurance (DOI) enforces these rules through audits called "market conduct examinations."

---

### 1.1 — Misrepresentation of Facts or Policy Provisions

> **"Misrepresenting pertinent facts or insurance policy provisions relating to coverages at issue."**
> — Cal. Ins. Code § 790.03(h)(1)

**Tier 1 (Dismissable):** "Policy provisions" are the specific terms, conditions, and coverages in the workers' compensation insurance policy. "Pertinent facts" means the facts that are relevant to the claim — the injury details, medical findings, employment history, or anything else that affects whether and how the claim is covered. "Coverages at issue" means the specific types of benefits the injured worker may be entitled to under the policy, such as temporary disability, permanent disability, or medical treatment.

**The Authority:** California Insurance Code Section 790.03(h)(1); enforced by the California Department of Insurance under Ins. Code Section 790.06; implementing regulation at 10 CCR 2695.4 (Representation of Policy Provisions).

**The Standard — What This Means in Practice:**
Every communication you make about what the policy covers or what the facts of a claim show must be accurate. If you tell an injured worker that a type of treatment is not covered, that statement must be correct based on the actual policy language and applicable law. If you summarize medical findings in a letter, those summaries must faithfully reflect what the medical reports actually say. You cannot downplay the severity of findings, omit favorable evidence, or overstate unfavorable evidence. Accuracy is not just good practice — it is a statutory duty.

**The Consequence — What Happens If You Don't:**
The DOI can cite a misrepresentation finding during a market conduct examination. Under the administrative penalty framework (10 CCR 2695.12, CCR 10108), each instance of misrepresentation can result in an administrative penalty. If a pattern of misrepresentation is found across multiple claim files, the DOI may characterize it as a "general business practice" under Section 790.03, which escalates enforcement from individual file findings to a company-level Cease and Desist order or monetary penalties under Ins. Code Section 790.035. The insured or claimant may also pursue a bad faith civil action. In Royal Globe Ins. Co. v. Superior Court's progeny, the courts have recognized that systematic misrepresentation supports bad faith claims with potential compensatory and punitive damages.

**The Common Mistake:**
A new examiner receives a medical report that assigns a 12% Whole Person Impairment (WPI) rating. The examiner writes a letter to the injured worker saying, "The doctor found minimal impairment." That is a misrepresentation — 12% WPI is a meaningful impairment rating, and characterizing it as "minimal" distorts the medical evidence. Another common scenario: an examiner tells a claimant that their policy does not cover a specific treatment when the policy is actually silent on it and applicable treatment guidelines (MTUS/ACOEM) support it. The examiner assumed the answer instead of checking the actual policy language and applicable regulations.

**AdjudiCLAIMS Helps You By:**
The Document Classification engine automatically identifies and categorizes medical reports, policy documents, and correspondence. The Medical Record Summary feature extracts factual findings (WPI ratings, diagnoses, work restrictions) verbatim from source documents, so you always have the accurate data at your fingertips. The Claims Chat answers questions about document contents by referencing the original text — it quotes the source rather than paraphrasing, reducing the risk of inadvertent distortion. **Planned feature:** Policy Provision Lookup — surfaces the exact policy language relevant to a coverage question so the examiner never has to guess what the policy says.

**You Must:**
Read the actual medical reports and policy provisions before making any written or verbal representation about what they say. Do not rely on summaries alone — verify against the source. When writing letters or making notes, use the language from the documents rather than your own characterization. If a finding is unfavorable to the carrier's position, you must still represent it accurately. Your duty is to the truth of the record, not to the outcome.

**Escalation Trigger:**
Escalate to your supervisor or assigned defense counsel when you encounter conflicting medical reports that create ambiguity about the claim facts, or when you are unsure whether a particular treatment or benefit is covered under the policy. If you are ever uncertain whether a statement you are about to make is accurate, stop and verify before communicating it. Do not guess.

---

### 1.2 — Failure to Acknowledge and Act Promptly on Communications

> **"Failing to acknowledge and act reasonably promptly upon communications with respect to claims arising under insurance policies."**
> — Cal. Ins. Code § 790.03(h)(2)

**Tier 1 (Dismissable):** "Communications" means any contact about a claim — phone calls, emails, letters, faxes, or messages from injured workers, their attorneys, medical providers, employers, or anyone else involved in the claim. "Acknowledge" means to confirm receipt — letting the person know you got their communication. "Act reasonably promptly" means you must do something about it within a defined timeframe, not just let it sit in your inbox. The specific deadline is 15 calendar days under 10 CCR 2695.5(b).

**The Authority:** California Insurance Code Section 790.03(h)(2); implementing regulation at 10 CCR 2695.5(b) (15 calendar day acknowledgment requirement); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
When you receive any communication related to a claim — a letter from an applicant attorney, a phone call from the injured worker, a medical report from a treating physician, a voicemail, an email — you must acknowledge receipt within 15 calendar days. Acknowledgment is not just sending a form letter. You must also begin to act on the substance of the communication. If an injured worker calls asking about the status of their claim, you must return that call and provide a substantive response, not just log it. If an attorney sends a letter demanding benefits, you must acknowledge receipt and begin evaluating the demand. With 125 to 175 open claims on your desk at any given time, this means you need a system — not just good intentions.

**The Consequence — What Happens If You Don't:**
The 15-day acknowledgment deadline under 10 CCR 2695.5(b) is one of the most commonly audited compliance points in DOI market conduct examinations. Auditors pull a sample of claim files, identify incoming communications, and check whether acknowledgment was documented within 15 calendar days. Each missed deadline is a separate audit finding. Under CCR 10108, the DWC Administrative Director can assess administrative penalties for each violation. Multiple violations across a book of business can result in a corrective action plan, increased audit frequency, or escalation to formal enforcement proceedings under Ins. Code 790.06. Beyond regulatory penalties, failing to respond promptly is often the first step in a chain that leads to bad faith exposure — the claimant or their attorney will point to unanswered communications as evidence that the insurer was not handling the claim in good faith.

**The Common Mistake:**
A new examiner with 150 open claims receives a letter from an applicant's attorney requesting an update on a pending medical authorization. The examiner reads the letter, plans to respond after finishing a more urgent task, and then forgets. Three weeks later, the attorney sends a follow-up letter noting the lack of response. Now the examiner is already past the 15-day window. The claim file has no record of acknowledgment. In a DOI audit, this file would be cited. The fix was simple — acknowledge immediately, even if the substantive response takes longer. A brief acknowledgment letter saying "We received your correspondence dated [date] and are reviewing the matter" satisfies the acknowledgment requirement and buys time for the substantive response.

**AdjudiCLAIMS Helps You By:**
The Regulatory Deadline Dashboard tracks the 15-day acknowledgment window for every incoming communication across all your open claims. When a document is uploaded or a communication is logged, the system starts the 15-day clock automatically and displays it on your dashboard with color-coded urgency (green, yellow, red). You will see at a glance which claims have communications approaching or past the 15-day window. **Planned feature:** Acknowledgment Letter Templates — pre-built templates for common acknowledgment scenarios (attorney correspondence, medical report receipt, claimant inquiry) that you can generate and send in under a minute.

**You Must:**
Check your communications dashboard daily. When you receive a communication, log it immediately — even if you cannot act on it right away. Send an acknowledgment within 15 calendar days. If you need more time to provide a substantive response, send the acknowledgment and note in the file when you plan to follow up. Do not rely on memory. Your caseload is too large for memory to be reliable.

**Escalation Trigger:**
If you discover that a communication has gone unacknowledged past the 15-day window, notify your supervisor immediately. Document the late acknowledgment in the claim file with the date you discovered it and the corrective action taken. If the communication involves a demand for benefits or a coverage question with a pending deadline, treat it as urgent — the delay may have compounding effects on other compliance timelines.

---

### 1.3 — Failure to Adopt Reasonable Investigation Standards

> **"Failing to adopt and implement reasonable standards for the prompt investigation of claims arising under insurance policies."**
> — Cal. Ins. Code § 790.03(h)(3)

**Tier 1 (Dismissable):** "Reasonable standards" means your employer (the insurance carrier or TPA) must have written procedures for how claims are investigated — and you must actually follow them. "Prompt investigation" means the investigation begins immediately when a claim is reported, not after a delay. This subdivision is about having a system for investigation, not just investigating each claim ad hoc. The DWC regulation at CCR 10109 specifies the duty to investigate and provides the baseline standard. An "investigation" in workers' comp includes the three-point contact (injured worker, employer, medical provider), gathering medical records, verifying employment, and documenting the mechanism of injury.

**The Authority:** California Insurance Code Section 790.03(h)(3); implementing regulation at 8 CCR 10109 (Duty to Conduct Investigation; Duty of Good Faith); investigation timing governed by 10 CCR 2695.5(e) (investigation must begin immediately upon receipt of proof of claim); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
You must follow your company's written investigation procedures on every claim. These procedures typically require a "three-point contact" — reaching out to the injured worker, the employer, and the treating physician — within a set number of days after receiving the claim. You must gather all reasonably available information: the DWC-1 claim form, medical records, employment records, wage statements, witness statements if applicable, and any other documents relevant to compensability. The investigation must be documented in the claim file. Each step — who you contacted, when, what they said, what documents you requested and received — must be logged. An undocumented investigation is, for audit purposes, the same as no investigation.

**The Consequence — What Happens If You Don't:**
Under CCR 10109, the DWC can audit claim files specifically for investigation adequacy. If your files show no evidence of the three-point contact, no documentation of information gathering, or long gaps between the claim report and the first investigative step, each file can be cited as a violation. Under CCR 10108, administrative penalties can be assessed per violation. At the DOI level, a pattern of inadequate investigation across multiple files supports a finding of a "general business practice" of violating Section 790.03(h)(3), which triggers company-level enforcement. Beyond regulatory penalties, an inadequate investigation is the foundation of most bad faith claims — if you deny a claim without investigating, you have violated subdivision (h)(4) as well, compounding your exposure.

**The Common Mistake:**
A new examiner receives a new claim report and immediately focuses on whether the injury is compensable based on the information in the DWC-1 form alone. The form says the worker injured their back "lifting a box," and the examiner thinks the claim looks straightforward, so they skip the three-point contact and go straight to setting reserves. Two months later, a supervisor reviews the file and asks: "Where is the employer statement? Did you verify the mechanism of injury? Did you contact the treating physician?" The file has none of this. The examiner investigated in their head but not in the file. In a DWC audit, this file would be cited for failure to investigate under CCR 10109.

**AdjudiCLAIMS Helps You By:**
The Investigation Checklist is a structured workflow that tracks every required investigative step for each new claim. When a new claim is created, the checklist automatically populates with the investigation steps required by your company's procedures and by regulation: three-point contact, document requests, medical record gathering, wage verification, and more. Each item shows its status (pending, complete, overdue) and the checklist cannot be marked complete until all required steps are documented. The Claim Chronology feature generates a timeline of all investigative activity, making it easy to see gaps. **Planned feature:** Investigation Adequacy Score — a compliance indicator that analyzes the claim file against CCR 10109 requirements and flags files that may be audit-vulnerable.

**You Must:**
Follow the investigation checklist for every new claim without exception. Contact the injured worker, employer, and treating physician within the timeframes your company requires. Document every contact attempt — even unsuccessful ones — in the claim file with the date, time, method (phone, email, letter), and outcome. Request all relevant medical records and employment documents. Do not make any coverage determination until your investigation is reasonably complete.

**Escalation Trigger:**
Escalate to your supervisor if you cannot complete the investigation within the applicable timeframes because a party is unresponsive (injured worker not returning calls, employer not providing wage records, physician not sending records). Document your attempts and the escalation. Also escalate if the investigation reveals facts that suggest fraud, subrogation potential, or coverage questions that require legal analysis — these go to your Special Investigations Unit (SIU) or defense counsel, respectively.

---

### 1.4 — Refusing to Pay Without Reasonable Investigation

> **"Refusing to pay claims without conducting a reasonable investigation based upon all available information."**
> — Cal. Ins. Code § 790.03(h)(4)

**Tier 1 (Dismissable):** "Refusing to pay" includes denying the claim entirely or denying a specific benefit (such as a treatment authorization or a temporary disability payment). "Reasonable investigation" means you reviewed all the information that was available — not just the information that supports the denial. "All available information" is the key phrase: you cannot cherry-pick evidence that supports a denial and ignore evidence that supports the claim. This subdivision works hand-in-hand with (h)(3) — if you did not investigate under (h)(3), you cannot deny under (h)(4).

**The Authority:** California Insurance Code Section 790.03(h)(4); implementing regulation at 8 CCR 10109(a) (investigation must include all reasonably available information); 10 CCR 2695.7(a) (minimum standards for claim investigation); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Before you deny any claim or any component of a claim, you must be able to point to a documented investigation that considered all the evidence — favorable and unfavorable to the carrier's position. If you deny a claim for lack of medical evidence, your file must show that you requested medical records from all known treating physicians and gave adequate time for them to respond. If you deny compensability because the injury did not arise out of employment, your file must document the factual basis for that conclusion and show that you considered the injured worker's account, the employer's account, and any witness statements. A denial without investigation is per se unreasonable under this statute.

**The Consequence — What Happens If You Don't:**
This is one of the most aggressively audited subdivisions because it directly harms injured workers. A denial without adequate investigation can result in: (1) DWC audit findings under CCR 10108 with administrative penalties per file; (2) DOI market conduct findings under 790.03(h)(4); (3) WCAB penalties under Labor Code Section 5814 (up to 25% increase on delayed or unreasonably denied benefits); (4) bad faith exposure in civil court under Royal Globe progeny, with potential compensatory and punitive damages. In practice, the WCAB frequently imposes Section 5814 penalties when an examiner denies a claim and the file shows no investigation or a clearly inadequate one. The penalty is paid directly to the injured worker — it is real money, not just a regulatory finding.

**The Common Mistake:**
A new examiner receives a claim for a knee injury. The employer's First Report of Injury says the worker was injured at work, but the examiner notices that the injured worker had a prior knee surgery five years ago. The examiner denies the claim, reasoning that the current condition is pre-existing. The problem: the examiner never obtained the current medical records to see whether the physician found a new injury, aggravation, or causation opinion. The examiner never contacted the injured worker to understand how the injury occurred. The denial was based on a hunch, not an investigation. At the WCAB, the Workers' Compensation Judge (WCJ) sees a denial with no medical evidence, no investigation, and a pre-existing condition assumption. The claim is found compensable, benefits are ordered, and a Section 5814 penalty is imposed for unreasonable delay.

**AdjudiCLAIMS Helps You By:**
The Investigation Checklist enforces investigation completeness before you can issue a denial. The system tracks whether the three-point contact was completed, whether medical records were requested and received, and whether all available documents have been reviewed. The Document Classification engine ensures that all uploaded documents are categorized and surfaced — you cannot miss a medical report that contradicts your denial theory if the system has already flagged it. The Claims Chat allows you to query all documents in the claim file at once: "Is there any medical opinion on causation in this file?" surfaces all relevant findings. **Planned feature:** Denial Readiness Check — before a denial letter is generated, the system reviews the investigation checklist and flags any gaps (e.g., "Three-point contact not completed," "No treating physician records in file").

**You Must:**
Never deny a claim — or any component of a claim — without first completing a documented investigation. Before writing a denial, ask yourself: "If a WCJ or DOI auditor looked at this file right now, would the investigation support this denial?" If the answer is uncertain, the investigation is not complete. Review all available medical records, not just the ones that support the denial. Document your reasoning in the file. If you are denying based on medical evidence, cite the specific medical report and finding.

**Escalation Trigger:**
If the investigation reveals conflicting evidence — for example, one physician says the injury is work-related and another says it is not — do not deny on your own. Consult with defense counsel or your supervisor about whether a Panel QME or Agreed Medical Evaluator (AME) is needed to resolve the dispute. Also escalate if you are being pressured (by a supervisor, by claim volume, by any source) to deny claims without completing the investigation. That pressure, if acted on, creates the exact violation this statute prohibits.

---

### 1.5 — Failure to Affirm or Deny Coverage Timely

> **"Failing to affirm or deny coverage of claims within a reasonable time after proof of loss requirements have been completed and submitted by the insured."**
> — Cal. Ins. Code § 790.03(h)(5)

**Tier 1 (Dismissable):** "Affirm or deny coverage" means to formally accept or reject the claim. "Proof of loss" in workers' compensation is the documentation establishing that an injury occurred — typically the DWC-1 Claim Form (the official form used to report a work injury in California), supporting medical records, and the employer's First Report of Injury. Once the claimant has submitted the necessary documentation, the clock starts. "Reasonable time" is defined by regulation: 10 CCR 2695.7(b) gives you 40 calendar days after receiving the proof of claim to accept or deny. In workers' comp, there is also a separate 90-day period under Labor Code Section 5402(b) within which the claim is presumed compensable if not denied.

**The Authority:** California Insurance Code Section 790.03(h)(5); implementing regulation at 10 CCR 2695.7(b) (40 calendar day accept/deny deadline); Labor Code Section 5402(b) (90-day presumption period); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Once you receive a completed proof of claim — typically the DWC-1 form and supporting documentation — you have 40 calendar days under the DOI regulation to either accept or deny the claim. In workers' compensation, Labor Code 5402(b) creates a separate but overlapping rule: if you do not deny compensability within 90 days of the employer's knowledge of injury, the claim is presumed compensable. These two deadlines operate independently. You must meet both. In practice, good claims handling means making a coverage determination as quickly as your investigation supports, not waiting until the deadline. The 40-day and 90-day windows are maximums, not targets.

**The Consequence — What Happens If You Don't:**
Missing the 40-day deadline under 10 CCR 2695.7(b) is a per-file DOI audit violation subject to administrative penalties under CCR 10108. Missing the 90-day denial window under LC 5402(b) has a more severe consequence: the claim becomes presumptively compensable. Once the presumption attaches, the burden of proof shifts — the carrier must now prove the claim is not compensable, rather than the claimant proving it is. This is an extremely difficult position to litigate from. The carrier may end up paying benefits on a claim that could have been denied if the timeline had been met. Additionally, the WCAB may impose LC 5814 penalties for unreasonable delay in making the coverage determination.

**The Common Mistake:**
A new examiner receives a DWC-1 on March 1. The examiner begins the investigation but is waiting for medical records from the treating physician. The records do not arrive. Weeks pass. The examiner does not send a delay letter (required under 10 CCR 2695.7(c) every 30 days if the determination cannot yet be made). By June 1, the 90-day window has passed, and the claim is now presumptively compensable. The examiner finally receives the medical records and they contain evidence that the injury may not be work-related — but it is too late. The presumption has attached. The examiner's mistake was not the waiting; it was failing to track the deadline, failing to send delay notifications, and failing to issue a timely denial based on the information available.

**AdjudiCLAIMS Helps You By:**
The Regulatory Deadline Dashboard tracks both the 40-day DOI deadline and the 90-day LC 5402(b) presumption deadline for every open claim. These appear on your dashboard as separate countdown timers with escalating color warnings. The system also tracks the 30-day delay notification requirement — if you cannot make a determination within 40 days, the system reminds you to send a written delay letter to the claimant every 30 days explaining why the determination is pending and what additional information is needed. **Planned feature:** Delay Letter Templates — pre-built, regulation-compliant templates for the 30-day delay notification required by 10 CCR 2695.7(c), pre-populated with the claim information and reason for delay.

**You Must:**
Track both the 40-day and 90-day deadlines for every claim. Make your coverage determination as soon as your investigation supports one — do not wait for the deadline. If you need more time, send a written delay letter every 30 days as required by 10 CCR 2695.7(c). Document in the file what additional information you are waiting for and why the determination cannot yet be made. Never let a deadline pass without either (a) making the determination or (b) sending the required delay notification.

**Escalation Trigger:**
If you are approaching the 90-day window under LC 5402(b) and your investigation is incomplete, escalate immediately to your supervisor. A decision must be made before the presumption attaches — either deny based on available evidence (if it supports denial) or accept the claim. Also escalate if you are approaching the 40-day DOI deadline without a determination. Your supervisor may authorize additional investigation resources or make a coverage decision at a higher authority level.

---

### 1.6 — Failure to Settle Promptly and Fairly When Liability Is Clear

> **"Not attempting in good faith to effectuate prompt, fair, and equitable settlements of claims in which liability has become reasonably clear."**
> — Cal. Ins. Code § 790.03(h)(6)

**Tier 1 (Dismissable):** "Liability has become reasonably clear" means you have enough information to know the claim is valid — the injury is work-related, the worker is entitled to benefits, and the general scope of those benefits is determinable. "Good faith" means honest, fair dealing — not looking for reasons to delay or reduce what is owed. "Effectuate" means to actually make the settlement happen — not just agree in principle but follow through with payment. "Prompt, fair, and equitable" means timely, at a reasonable amount, and balanced. This is the affirmative duty to settle — not just the duty to not deny unfairly, but the duty to actively pursue resolution.

**The Authority:** California Insurance Code Section 790.03(h)(6); related standards at 10 CCR 2695.7(d) (payment within 30 days after determination of amount owed); Labor Code Section 5814 (penalty for unreasonable delay in payment); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Once your investigation establishes that a claim is compensable and benefits are owed, you must move to pay those benefits or negotiate a fair settlement without delay. This applies at every stage: once TD is clearly owed, pay it; once PD is determinable, advance it; once a settlement value is calculable and both sides are engaged, negotiate in good faith. You cannot sit on a compensable claim, slow-walk settlement negotiations, or offer unreasonably low amounts to see if the claimant will accept. If the medical evidence supports a certain level of disability, your settlement posture must reflect that evidence — not a hope that the claimant will take less.

**The Consequence — What Happens If You Don't:**
The WCAB routinely imposes LC 5814 penalties (up to 25% increase on delayed benefits) when an examiner unreasonably delays payment after liability is clear. The DOI can cite 790.03(h)(6) violations in market conduct examinations. In civil court, failure to settle when liability is clear is a textbook bad faith scenario — courts have recognized that when an insurer has the information to know a claim is valid and delays settlement, the insured or claimant may recover compensatory damages for the harm caused by the delay, plus punitive damages if the conduct is found to be oppressive or malicious. The financial exposure from bad faith litigation often dwarfs the cost of the original settlement.

**The Common Mistake:**
An examiner accepts a claim as compensable and begins paying temporary disability benefits. The injured worker reaches Maximum Medical Improvement (MMI) and a QME assigns a 25% WPI rating with clear apportionment. The permanent disability is calculable. But the examiner delays advancing PD benefits because they are "waiting to see if the applicant's attorney will make a demand first." Months pass. The applicant's attorney eventually files a Declaration of Readiness to Proceed (DOR) to force the case to trial. Now the carrier is defending at the WCAB, facing LC 5814 penalties for delay, and the examiner's file notes show no reason for the delay other than waiting. The examiner should have advanced PD benefits and initiated settlement discussions as soon as the PD was determinable.

**AdjudiCLAIMS Helps You By:**
The Benefit Calculator computes TD rates, PD advances, and statutory benefit amounts using verified formulas so you always know the correct payment amount. The Regulatory Deadline Dashboard tracks payment due dates — the 14-day TD payment window under LC 4650 and the 30-day payment deadline after determination under 10 CCR 2695.7(d). The Claim Chronology shows the timeline of medical findings, making it clear when liability became reasonably established and benefits became calculable. **Planned feature:** Settlement Readiness Indicator — flags claims where the medical evidence, disability ratings, and benefit calculations have reached a point where settlement discussions should be initiated.

**You Must:**
Monitor the medical evidence in every accepted claim. When the evidence establishes the nature and extent of disability, act on it — advance benefits, initiate settlement discussions, or both. Do not wait for the claimant to demand payment. Your duty is affirmative: you must attempt to settle, not just respond to demands. Document your settlement efforts in the file — offers made, responses received, negotiations conducted. If there is a legitimate reason to delay (e.g., waiting for a supplemental medical report), document that reason.

**Escalation Trigger:**
If you believe a claim should be settled but the settlement authority required exceeds your authorization level, escalate to your supervisor or claims manager immediately. Do not let your authority limit become a reason for delay. Also escalate if settlement negotiations have stalled because of a legal issue (e.g., apportionment disputes, lien resolution) — defense counsel should be engaged to resolve legal barriers to settlement.

---

### 1.7 — Compelling Litigation Through Lowball Offers

> **"Compelling insureds to institute litigation to recover amounts due under an insurance policy by offering substantially less than the amounts ultimately recovered in actions brought by such insureds."**
> — Cal. Ins. Code § 790.03(h)(7)

**Tier 1 (Dismissable):** "Compelling insureds to institute litigation" means making offers so unreasonably low that the injured worker has no choice but to go to the WCAB (the Workers' Compensation Appeals Board — the court system that resolves WC disputes) to get what they are owed. "Substantially less than amounts ultimately recovered" means the gap between your offer and what the WCAB ultimately awards is so large that your offer was clearly unreasonable. In workers' comp, this typically happens when an examiner offers a settlement far below the calculable PD value based on the medical evidence, or denies benefits that are then awarded at trial.

**The Authority:** California Insurance Code Section 790.03(h)(7); enforced by the DOI under Ins. Code Section 790.06; WCAB penalty exposure under LC 5814 for unreasonable delay caused by forcing litigation.

**The Standard — What This Means in Practice:**
Your settlement offers must be reasonable based on the medical evidence and applicable law. In California WC, permanent disability is calculated using a formula based on WPI rating, occupation, age at injury, and the applicable PDRS (Permanent Disability Rating Schedule). If a QME assigns a 30% WPI that rates to a specific PD percentage, your settlement offer should reflect that calculation — not a number you pulled from thin air or reduced because "everyone negotiates down." If the claimant is clearly entitled to $80,000 in PD based on the rating, offering $20,000 is not a negotiation tactic — it is a violation of this statute. The test is retrospective: if the case goes to trial and the WCAB awards significantly more than your offer, that gap is evidence that your offer was unreasonable.

**The Consequence — What Happens If You Don't:**
If an examiner consistently makes settlement offers that are far below the amounts ultimately awarded at trial, the DOI can find a pattern of violating 790.03(h)(7) — a general business practice finding that triggers company-level enforcement. At the WCAB, the judge may note the disparity between the offer and the award and impose LC 5814 penalties. In bad faith litigation, a pattern of lowball offers is strong evidence of bad faith — it shows the insurer knew the claim was worth more and intentionally withheld fair compensation, forcing the injured worker to hire an attorney and litigate to get what they were owed. The legal fees, penalties, and damages from this litigation will almost certainly exceed the amount the carrier tried to save with the low offer.

**The Common Mistake:**
An examiner reviews a QME report that rates the injured worker's permanent disability at 45% PD. The examiner's supervisor says, "Offer 20% — they'll negotiate up." The examiner makes the offer. The applicant's attorney rejects it and files a DOR. At trial, the WCAB awards 42% PD (slightly less than the QME's opinion, after apportionment). The gap between the 20% offer and the 42% award is evidence that the examiner's offer was not a good faith attempt to settle — it was a tactic to force the claimant to litigate. The examiner was not acting in bad faith intentionally; they were following their supervisor's instruction. But the file reflects the examiner's offer, and the violation attaches to the claim file.

**AdjudiCLAIMS Helps You By:**
The Benefit Calculator computes PD values using the current PDRS, the QME's WPI rating, the worker's occupation and age at injury, and applicable apportionment. This gives you the mathematically correct PD value based on the medical evidence — so you always know the objective baseline for settlement discussions. The Medical Record Summary extracts WPI ratings and apportionment opinions from QME reports so you have clear data to support your offer. **Planned feature:** Offer Reasonableness Indicator — compares your proposed settlement offer against the calculated PD value and flags offers that deviate significantly from the evidence-based calculation with a warning.

**You Must:**
Base every settlement offer on the medical evidence and the applicable rating formula. Know the calculated PD value before you make an offer. If your offer deviates from the calculated value, document the legitimate reason in the file (e.g., apportionment to prior injury, credibility issues with the rating). Never make an offer that you cannot defend to a WCJ or DOI auditor. If you are directed to make an offer you believe is unreasonably low, see the escalation trigger below.

**Escalation Trigger:**
If you are directed by a supervisor to make an offer that you believe is substantially below the evidence-based value with no legitimate basis, escalate your concern in writing. Document the medical evidence, the calculated PD value, and the directed offer. If the concern is not resolved, consult with your company's compliance department. You have a personal professional obligation under the Insurance Code — "my supervisor told me to" does not eliminate your individual exposure.

---

### 1.8 — Settling for Less Than Reasonable Based on Written Materials

> **"Attempting to settle a claim by an insured for less than the amount to which a reasonable person would have believed he or she was entitled by reference to written or printed advertising material accompanying or made part of an application."**
> — Cal. Ins. Code § 790.03(h)(8)

**Tier 1 (Dismissable):** This subdivision addresses the gap between what the insurer communicated in writing (policy documents, benefit explanations, advertising) and what it actually pays. "Written or printed advertising material" includes any written communication that describes the coverage — not just advertisements in the traditional sense, but also benefit explanation letters, policy summaries, and educational materials provided to the insured or claimant. If you told someone in writing that they are entitled to a benefit, you cannot then settle for less than what a reasonable person would expect based on that communication.

**The Authority:** California Insurance Code Section 790.03(h)(8); related to 10 CCR 2695.4 (representation of policy provisions); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Every written communication you send — benefit explanation letters, payment notices, claim status letters — sets an expectation. If you send a letter explaining that temporary disability benefits are paid at two-thirds of the average weekly earnings, you cannot then settle the TD component for less than that formula produces without a clear, documented basis. If a benefit explanation pamphlet provided by the insurer says "You may be entitled to permanent disability benefits based on your level of impairment," you cannot then offer a settlement that ignores PD entirely. Your written communications must be consistent with your settlement posture.

**The Consequence — What Happens If You Don't:**
The DOI can cite 790.03(h)(8) when it finds a disconnect between the insurer's written communications and its settlement practices. This is particularly damaging because the evidence is documentary — the auditor compares the letter you sent to the offer you made, and the inconsistency speaks for itself. In bad faith litigation, written communications from the insurer are Exhibit A — they show what the insurer knew the claimant was entitled to and what they actually offered. The disparity between written representations and settlement offers can support both compensatory and punitive damages.

**The Common Mistake:**
An examiner sends a benefit explanation letter to an unrepresented injured worker that says: "Based on your average weekly earnings of $1,200, your temporary disability rate is $800 per week (2/3 of AWE)." The worker receives TD at $800/week for 20 weeks. Later, the examiner offers to settle the entire claim — including PD and future medical — for an amount that, when broken down, implies a TD rate lower than $800/week because the examiner retrospectively recalculated AWE using different wage records. The worker (or their newly retained attorney) produces the original benefit letter showing $800/week. The examiner's own written communication contradicts the settlement basis. This creates an immediate credibility problem and a potential 790.03(h)(8) violation.

**AdjudiCLAIMS Helps You By:**
The Benefit Calculator uses verified wage data and statutory formulas to produce consistent benefit calculations. Every calculation is logged with its inputs and outputs, creating an auditable record. The Payment Templates generate benefit explanation letters that are mathematically consistent with the calculated rates — so your written communications and your payments always match. The Audit Trail maintains a complete record of every calculation and every letter, making it easy to demonstrate consistency over time.

**You Must:**
Review every written communication before sending it. Verify that the benefit amounts, rates, and coverage descriptions are accurate and consistent with prior communications on the same claim. If you need to revise a calculation (e.g., new wage information changes the AWE), send a clear written explanation of the change with the new calculation — do not simply start paying a different amount without explanation.

**Escalation Trigger:**
If you discover that a prior written communication contained an error — an incorrect benefit rate, a wrong deadline, an inaccurate coverage description — escalate to your supervisor immediately. The correction must be communicated to the claimant in writing with a clear explanation. Do not attempt to quietly correct the error by adjusting future payments without explanation.

---

### 1.9 — Settling Based on Altered Application Without Consent

> **"Attempting to settle claims on the basis of an application which was altered without notice to, or knowledge or consent of, the insured, his or her representative, agent, or broker."**
> — Cal. Ins. Code § 790.03(h)(9)

**Tier 1 (Dismissable):** "Application" in this context refers to any claim document — the DWC-1 form, the employer's First Report of Injury, medical authorization forms, or any other document that forms part of the claim record. "Altered" means changed, modified, or amended. This subdivision prohibits settling a claim based on documents that have been changed without the knowledge of the person who submitted them. In workers' comp, this most commonly arises when claim forms are modified after submission — for example, changing the injury description, the date of injury, or the body parts claimed.

**The Authority:** California Insurance Code Section 790.03(h)(9); enforced by the DOI under Ins. Code Section 790.06; potential criminal exposure under Ins. Code Section 1871.4 (workers' compensation fraud) if documents are altered with fraudulent intent.

**The Standard — What This Means in Practice:**
You must never alter a claim document — or base a claim decision on an altered document — without the knowledge and consent of the person who submitted it. If a DWC-1 form has a discrepancy (e.g., the injury date appears incorrect based on other evidence), you do not change the form. You document the discrepancy in your file notes and investigate. If the insured or their representative provides a corrected document, that correction is filed alongside the original — the original is never destroyed or overwritten. All claim documents must be maintained in their original form.

**The Consequence — What Happens If You Don't:**
Altering claim documents is one of the most serious violations in claims handling. Beyond the DOI enforcement under 790.03(h)(9), document alteration can constitute fraud under Ins. Code Section 1871.4 — a criminal offense. Even unintentional alteration (e.g., accepting a "corrected" document without retaining the original) can be cited as a violation in a DOI audit or DWC audit. The claim file must be a complete, unaltered record. If an auditor discovers that documents have been modified without documented consent, the entire file's integrity is compromised. In bad faith litigation, evidence of document alteration — even minor — can be catastrophic for the insurer's defense.

**The Common Mistake:**
An examiner receives a DWC-1 form listing the date of injury as January 15. The employer's representative calls and says the actual date was January 10 — there was a clerical error on the form. The examiner crosses out "January 15" and writes "January 10" on the form and proceeds with the claim. This is an alteration without the insured's knowledge or consent. The correct procedure: keep the original DWC-1 as submitted, document the employer's statement about the date discrepancy in your file notes, and request a corrected form if appropriate. If a corrected form is submitted, both the original and the correction go into the file.

**AdjudiCLAIMS Helps You By:**
The Document Ingestion system creates an immutable record of every document at the time it is uploaded. Original documents are preserved exactly as received — OCR text extraction and field population never modify the source document. The Audit Trail logs every document version with timestamps, so if a corrected version is uploaded, both versions are retained and linked. The system never allows overwriting of a previously uploaded document — corrections are uploaded as new documents with a "corrects" relationship to the original.

**You Must:**
Never alter a claim document for any reason. If you identify an error in a document, note the discrepancy in your claim file and investigate. If a corrected document is provided, file it alongside the original. If you receive a document that appears to have been altered by someone else, flag it immediately — it may indicate fraud. Treat the claim file as a legal record that must reflect everything exactly as it was received.

**Escalation Trigger:**
If you receive a document that appears to have been altered — white-out, different handwriting, inconsistent formatting, metadata discrepancies — escalate immediately to your SIU (Special Investigations Unit) for possible fraud investigation. If you discover that a prior handler altered a document in your file, escalate to your supervisor and compliance department immediately. If you are directed to alter a document, refuse and document the directive. This is a non-negotiable ethical line.

---

### 1.10 — Payments Without Coverage Explanation

> **"Making claims payments to insureds or beneficiaries not accompanied by a statement setting forth the coverage under which payments are being made."**
> — Cal. Ins. Code § 790.03(h)(10)

**Tier 1 (Dismissable):** "Statement setting forth the coverage" means a written explanation that tells the injured worker what benefit is being paid and under what authority. Every check or electronic payment must come with a letter or notice that says, in plain language, what the payment is for. "TD payment for the period [date] to [date] at the rate of [$X]/week under Labor Code Section 4653" is an example of a proper coverage explanation. Sending a check with no explanation violates this statute.

**The Authority:** California Insurance Code Section 790.03(h)(10); implementing regulation at 10 CCR 2695.7(h) (written explanations accompanying payments); related Labor Code provisions for specific benefit types (LC 4650 for TD, LC 4658 for PD); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Every payment you issue — every single one — must be accompanied by a written explanation. The explanation must state: (1) the type of benefit being paid (temporary disability, permanent disability advance, medical, mileage, etc.); (2) the period covered (for indemnity payments); (3) the rate or amount and how it was calculated; and (4) the statutory or policy basis for the payment. This is not optional and it is not a best practice — it is a statutory requirement. The explanation must be clear enough that the injured worker understands what they are receiving and why.

**The Consequence — What Happens If You Don't:**
Payments without accompanying explanation letters are a high-frequency DOI audit finding. Auditors check every payment in a sampled file for an accompanying explanation. Each payment without an explanation is a separate violation, which means a single file with 26 biweekly TD payments issued without explanations represents 26 separate violations. Under the penalty framework, this adds up rapidly. Beyond the regulatory exposure, payments without explanations create confusion for injured workers, generate unnecessary phone calls and correspondence, and can lead to disputes about what was paid and why — disputes that would not exist if the explanation had been provided.

**The Common Mistake:**
A new examiner sets up the first TD payment and the system generates a check. The examiner does not realize that a separate benefit explanation letter must accompany the check. The check arrives at the injured worker's home with the carrier's name and an amount — but no letter explaining what the payment is for, what period it covers, or how the rate was calculated. The injured worker calls, confused. "Is this for my medical bills? Is this my disability payment? Why is it this amount?" Meanwhile, the file has no record of an explanation letter being sent. In a DOI audit, every payment in this file without a corresponding explanation letter is cited.

**AdjudiCLAIMS Helps You By:**
The Payment Templates automatically generate benefit explanation letters that accompany every payment. When you authorize a TD payment, the system generates a letter that includes the benefit type, period covered, rate, AWE basis, and statutory authority — pre-populated from the claim data. You review and send. The Audit Trail links every payment to its corresponding explanation letter, creating a clean audit record. The Regulatory Deadline Dashboard tracks not just when payments are due but whether the explanation letter has been generated and sent.

**You Must:**
Never issue a payment without an accompanying written explanation. Use the payment template system to generate explanation letters for every payment. Review each letter before sending to ensure the amounts, dates, and calculations are correct. If you issue a payment and realize after the fact that no explanation was sent, send the explanation immediately and document the delay in the file.

**Escalation Trigger:**
If you discover that prior payments on a claim were issued without explanation letters — perhaps by a prior examiner or through a system error — escalate to your supervisor. The missing explanations should be sent retroactively with a clear notation that they are being provided late. If your payment system is not generating explanation letters automatically, report the system deficiency to your IT department or supervisor as a compliance issue.

---

### 1.11 — Threatening Appeals to Compel Lesser Settlements

> **"Making known to insureds or claimants a practice of the insurer of appealing from arbitration awards in favor of insureds or claimants for the purpose of compelling them to accept settlements or compromises less than the amount awarded in arbitration."**
> — Cal. Ins. Code § 790.03(h)(11)

**Tier 1 (Dismissable):** "Arbitration awards" in general insurance are binding decisions made by a neutral arbitrator. In California workers' compensation, the closest analog is a WCAB Findings and Award — the decision issued by a Workers' Compensation Judge (WCJ) after a hearing. "Appealing" means filing a Petition for Reconsideration with the WCAB Appeals Board (or further appeal to the Court of Appeal). This subdivision prohibits using the appeal process as a threat — telling the claimant or their attorney, "We will appeal any award, so you should settle for less." The right to appeal is legitimate; using it as a coercion tool is not.

**The Authority:** California Insurance Code Section 790.03(h)(11); enforced by the DOI under Ins. Code Section 790.06; WCAB sanctions may apply if frivolous petitions for reconsideration are filed as a pattern.

**The Standard — What This Means in Practice:**
You may never communicate — directly or indirectly — that your company's practice is to appeal all awards or that the claimant should settle for less to avoid the appeal process. Each claim must be evaluated individually. If a WCAB award is issued and you believe there is a legitimate legal basis for appeal (e.g., the WCJ misapplied the law, the evidence does not support the finding), that decision is made by defense counsel based on the merits — not as a negotiating tactic. Your settlement discussions must focus on the facts and evidence of the specific claim, not on threats about what will happen after an award.

**The Consequence — What Happens If You Don't:**
If the DOI finds evidence that an insurer is systematically appealing awards to pressure claimants into lower settlements, this is a 790.03(h)(11) violation. Evidence can include: a pattern of appealing awards and then settling for less during the appeal period, communications referencing the appeal process during settlement negotiations, or a statistically unusual rate of petitions for reconsideration across the carrier's book. The WCAB may also impose sanctions under its rules for frivolous petitions for reconsideration. Beyond regulatory consequences, this behavior damages the carrier's reputation with WCJs and applicant attorneys, making every future case harder to resolve.

**The Common Mistake:**
During a settlement conference at the WCAB, an examiner tells the applicant's attorney: "You know we appeal everything. It'll be another two years before your client sees any money if this goes to award. Better to settle now for what we're offering." This is a textbook violation. The examiner may believe they are simply negotiating, but they have communicated a practice of appealing awards for the purpose of compelling a lesser settlement. The correct approach: negotiate based on the evidence and the applicable law. If the settlement offer is fair and supported by the evidence, the offer speaks for itself. The appeal process is not a negotiating tool.

**AdjudiCLAIMS Helps You By:**
The Claims Chat includes guardrails that prevent generating language related to appeal threats or coercive settlement tactics. If an examiner types a draft communication that references appealing as a settlement pressure tool, the chat UPL filter flags it as a prohibited practice. **Planned feature:** Settlement Communication Review — analyzes outgoing settlement-related correspondence for language that could be interpreted as coercive or threatening under 790.03(h)(7) or 790.03(h)(11), and suggests alternative phrasing focused on the claim-specific evidence.

**You Must:**
Keep settlement negotiations focused on the facts, medical evidence, and applicable law of the specific claim. Never reference your company's appeal rate, appeal history, or "what will happen" if the claimant does not accept your offer. If you believe an award should be appealed, that recommendation goes to defense counsel with a written explanation of the legal basis — it is never communicated to the claimant as a negotiation tactic.

**Escalation Trigger:**
If you are directed to communicate appeal threats as part of settlement negotiations, escalate to your compliance department. If you become aware that your company has a practice of systematically appealing awards without legitimate legal basis, report this concern through your company's compliance reporting channel. This is a company-level violation, not just a file-level issue.

---

### 1.12 — Requiring Duplicative Documentation to Delay Claims

> **"Delaying the investigation or payment of claims by requiring an insured, claimant, or the physician of either, to submit a preliminary claim report and then requiring the subsequent submission of formal proof of loss forms, both of which submissions contain substantially the same information."**
> — Cal. Ins. Code § 790.03(h)(12)

**Tier 1 (Dismissable):** "Preliminary claim report" is the initial paperwork the injured worker or employer submits to report the claim — in workers' comp, this is typically the DWC-1 Claim Form. "Formal proof of loss" is a more detailed submission that insurers sometimes require. This subdivision says: if the preliminary report and the formal proof of loss contain substantially the same information, you cannot require both. The purpose is to prevent insurers from creating artificial delays by making claimants fill out the same information twice on different forms. In practice, the DWC-1 in workers' comp is generally sufficient — requiring additional proof-of-loss forms with the same information is a red flag.

**The Authority:** California Insurance Code Section 790.03(h)(12); related to 10 CCR 2695.5(e) (investigation must begin immediately upon receipt of proof of claim — cannot wait for duplicative forms); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
When a claim is reported with sufficient information to begin investigation — typically via the DWC-1 and any supporting medical documentation — you must begin the investigation immediately. You cannot delay by requesting the claimant to fill out additional forms that ask for the same information already provided. If you need additional information beyond what the initial report contains, you must request the specific information you need, not a new form that duplicates the old one. Every information request must be necessary, specific, and non-duplicative.

**The Consequence — What Happens If You Don't:**
Each instance of requiring duplicative documentation is a citable violation in a DOI audit. Beyond the per-file penalty, a pattern of requiring duplicative forms constitutes a "delay tactic" finding that can trigger company-level enforcement. The DOI is specifically looking for this pattern because it is a known insurance industry tactic for slowing claims — each additional form requirement adds days or weeks of delay. Under CCR 10108, the DWC can assess penalties for investigation delay caused by duplicative documentation requirements. The claimant's attorney will also use this at the WCAB as evidence of bad faith.

**The Common Mistake:**
A new examiner receives a DWC-1 from the employer, which includes the injured worker's name, Social Security number, date of injury, body parts injured, and description of the incident. The examiner's company has an internal "Claim Intake Form" that asks for the exact same information in a different format. The examiner sends the internal form to the injured worker and says the investigation cannot begin until the form is returned. This creates an unnecessary delay — the DWC-1 already contained all the information on the internal form. The investigation should have begun immediately upon receipt of the DWC-1. If the internal form collects additional information not on the DWC-1, only the new information should be requested.

**AdjudiCLAIMS Helps You By:**
The Claim Data Extraction engine automatically populates claim fields from the DWC-1 and other intake documents, eliminating the need for manual re-entry on additional forms. The Document Classification system identifies what information has already been received, and the Investigation Checklist shows what specific information is still needed — differentiating between "information already in the file" and "information that must be requested." This prevents you from requesting information you already have. **Planned feature:** Duplicate Request Detection — if an examiner attempts to send an information request for data that already exists in the claim file, the system flags it with a warning: "This information appears to already be on file in [document name]."

**You Must:**
Review what information is already in the claim file before requesting anything from the claimant, employer, or physician. If the DWC-1 provides sufficient information to begin the investigation, begin immediately. If you need additional information, request only the specific items that are not already in the file. Never send a claimant a form that asks for information they already provided. If your company's internal processes require duplicative forms, raise this as a compliance concern.

**Escalation Trigger:**
If your company's standard procedures require claimants to submit forms that duplicate information already provided on the DWC-1, escalate this as a systemic compliance issue to your compliance department. This is not a file-level problem — it is a company-level practice that exposes the entire book of business to DOI audit findings. Also escalate if you are directed to delay investigation until an internal form is returned when you already have sufficient information to begin.

---

### 1.13 — Cross-Leveraging Coverage Portions in Settlement

> **"Failing to settle claims promptly, where liability has become apparent, under one portion of the insurance policy coverage in order to influence settlements under other portions of the insurance policy coverage."**
> — Cal. Ins. Code § 790.03(h)(13)

**Tier 1 (Dismissable):** "Portions of insurance policy coverage" in workers' comp means the different types of benefits: temporary disability (TD), permanent disability (PD), medical treatment, supplemental job displacement benefit (SJDB), and death benefits. Each is a separate "portion" of coverage. "Cross-leveraging" means holding one benefit hostage to force a concession on another. For example: refusing to pay undisputed TD benefits in order to pressure the claimant into accepting a lower PD settlement. Each benefit stands on its own — your obligation to pay benefits that are clearly owed under one portion does not depend on resolving disputes under another portion.

**The Authority:** California Insurance Code Section 790.03(h)(13); related to LC 4650 (TD payment obligation independent of PD disputes); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
If temporary disability benefits are clearly owed, you must pay them — even if the permanent disability rating is disputed. If medical treatment is authorized and the claimant is also disputing their PD rating, the medical treatment authorization does not wait for the PD dispute to resolve. Each benefit type is evaluated and paid based on its own criteria. You cannot use undisputed benefits as bargaining chips in disputes about other benefits. In practice, this means maintaining separate tracking and separate decision-making for each benefit component on a claim.

**The Consequence — What Happens If You Don't:**
Cross-leveraging is a sophisticated violation that experienced DOI auditors look for specifically. The auditor examines the timeline: when was TD clearly owed? When was it paid? Was there a simultaneous PD dispute? If the TD payment delay coincides with PD settlement negotiations, the inference of cross-leveraging is strong. Each delayed benefit payment is subject to LC 5814 penalties (up to 25% increase) and the DOI can cite 790.03(h)(13). In bad faith litigation, cross-leveraging is particularly damaging because it shows intentional manipulation of the claims process — not just negligence or delay, but strategic withholding. Courts view this very unfavorably.

**The Common Mistake:**
An injured worker is receiving TD benefits while also in dispute about the PD rating. The applicant's attorney sends a demand for PD benefits based on a QME report. The examiner tells the attorney, "Let's resolve the PD issue globally — we'll include the remaining TD in a Compromise & Release (C&R) settlement." The attorney responds that the TD is not disputed and should be paid now, separate from the PD negotiations. The examiner stops paying TD and insists on a global settlement. Now the examiner has cross-leveraged undisputed TD benefits to influence the PD settlement. The TD was clearly owed and should have continued while PD negotiations proceeded separately.

**AdjudiCLAIMS Helps You By:**
The Regulatory Deadline Dashboard tracks each benefit type independently — TD payment cycles, PD advance deadlines, medical treatment authorization timelines, and SJDB notifications are all separate tracks on the dashboard. The system does not allow one benefit type's payment status to affect another's deadline tracking. Each benefit appears as its own compliance timeline. **Planned feature:** Cross-Leverage Detection — if an examiner pauses or delays payments on one benefit type while settlement negotiations are active on a different benefit type for the same claim, the system generates a compliance alert: "TD payments are past due on this claim. TD obligations are independent of pending PD negotiations."

**You Must:**
Treat each benefit type as a separate obligation. Pay undisputed TD on its own schedule regardless of PD disputes. Authorize undisputed medical treatment regardless of settlement negotiations on other benefits. Track each benefit component independently. If you are negotiating a global settlement (C&R), continue paying all undisputed benefits until the settlement is finalized and approved by the WCAB. A pending settlement does not suspend your payment obligations.

**Escalation Trigger:**
If you are directed to delay or withhold undisputed benefits in order to influence negotiations on other benefit components, escalate to your compliance department. If a claimant's attorney accuses you of cross-leveraging, take the accusation seriously — review the file immediately to ensure all undisputed benefits are current. If they are not, bring them current immediately and escalate to your supervisor.

---

### 1.14 — Failure to Explain Denial or Compromise Offer

> **"Failing to provide promptly a reasonable explanation of the basis relied on in the insurance policy, in relation to the facts or applicable law, for the denial of a claim or for the offer of a compromise settlement."**
> — Cal. Ins. Code § 790.03(h)(14)

**Tier 1 (Dismissable):** "Reasonable explanation" means a clear, written statement that explains WHY you are denying the claim or offering a compromise amount. "Basis relied on" means the specific facts and specific policy provisions or legal authority that support the decision. "Promptly" means when the denial or offer is made — not later, not upon request, but at the same time. A denial letter that says "Claim denied" without an explanation violates this statute. A compromise offer that says "We offer $30,000" without explaining how that number was derived violates this statute. The claimant has a right to understand the reasoning.

**The Authority:** California Insurance Code Section 790.03(h)(14); implementing regulation at 10 CCR 2695.7(h) (written denial must include specific reasons and policy provisions); enforced by the DOI under Ins. Code Section 790.06.

**The Standard — What This Means in Practice:**
Every denial must include: (1) the specific factual basis (what evidence supports the denial); (2) the specific legal or policy basis (which provision or statute is being applied); and (3) an explanation in plain language that a non-lawyer can understand. For example, a denial of a specific body part should say: "Based on the QME report of Dr. Smith dated [date], which found no objective medical evidence of injury to the left shoulder, the claim for left shoulder injury is denied. The QME examined you on [date] and found [specific findings]. Under applicable law, a work injury must be supported by medical evidence of injury (LC 3202.5)." Every compromise offer must similarly explain: "Based on the QME rating of [X]% WPI with [Y]% apportionment to non-industrial factors, the permanent disability rates to [Z]%, valued at $[amount] under the [year] PDRS."

**The Consequence — What Happens If You Don't:**
Denials without explanations are among the most common DOI audit findings. Under 10 CCR 2695.7(h), a denial without a written explanation is a per-file violation. The DWC can assess administrative penalties under CCR 10108 for each violation. At the WCAB, a denial without explanation weakens the carrier's litigation position — the WCJ may view the lack of explanation as evidence that the denial lacked a reasonable basis, which supports LC 5814 penalties. In bad faith litigation, a pattern of unexplained denials is powerful evidence: the insurer denied claims without articulating any basis, suggesting the denials were arbitrary or pretextual.

**The Common Mistake:**
A new examiner denies a claim and sends a form letter that says: "After review, we have determined that your claim is denied. If you disagree with this decision, you may file an Application for Adjudication of Claim with the WCAB." The letter does not explain why the claim was denied, what evidence was considered, or what policy or statutory provision applies. The injured worker has no idea what happened or what they could do differently. At the WCAB, the applicant's attorney demands the basis for denial, and the examiner now has to articulate reasons months after the fact — reasons that should have been stated at the time of denial. In a DOI audit, this file is cited for violating both 790.03(h)(14) and 10 CCR 2695.7(h).

**AdjudiCLAIMS Helps You By:**
The system includes structured Denial Letter Templates that require you to fill in the factual basis, the medical evidence referenced, and the statutory or policy authority before the letter can be generated. The template will not produce a denial letter without these fields — it enforces completeness by design. The Document Classification engine surfaces the relevant medical reports and policy provisions so you can easily reference the specific evidence supporting the denial. The Claims Chat can help you identify the key evidence in the file: "What medical evidence addresses compensability of the left shoulder?" **Planned feature:** Denial Completeness Check — before a denial is finalized, the system reviews it against 10 CCR 2695.7(h) requirements and flags missing elements (e.g., "No statutory basis cited," "No specific medical evidence referenced").

**You Must:**
Never issue a denial or compromise offer without a written explanation. Use the denial letter templates and fill in every required field. Reference specific medical reports by doctor name, date, and finding. Cite the specific statutory or policy provision that supports the denial. Write in plain language — the recipient may not be a lawyer. If you are offering a compromise settlement, show the calculation: the WPI rating, the apportionment, the applicable PDRS, and the resulting value. The recipient should be able to follow your reasoning from evidence to conclusion.

**Escalation Trigger:**
If you are denying a claim and you are unsure of the correct legal basis, stop and consult defense counsel. A denial with an incorrect legal basis may be worse than no basis at all — it can constitute a misrepresentation under 790.03(h)(1). If the denial involves a complex legal issue (e.g., statute of limitations defense, jurisdictional question, apportionment to non-industrial factors), the legal basis should be reviewed by counsel before the denial is issued.

---

### 1.15 — Advising Claimants Not to Obtain an Attorney

> **"Directly advising a claimant not to obtain the services of an attorney."**
> — Cal. Ins. Code § 790.03(h)(15)

**Tier 1 (Dismissable):** "Directly advising" means explicitly telling, suggesting, or implying to the claimant that they should not hire a lawyer. "Claimant" in workers' comp is the injured worker who has filed a claim. This subdivision exists because there is an inherent power imbalance between an insurance company and an individual claimant — the insurer is a sophisticated party with legal resources, and the claimant may not know their rights. The legislature determined that the claimant's right to representation must be absolutely protected. You cannot say "You don't need a lawyer," "Hiring a lawyer will slow things down," "Lawyers take a percentage of your settlement," or any other statement designed to discourage representation.

**The Authority:** California Insurance Code Section 790.03(h)(15); enforced by the DOI under Ins. Code Section 790.06; related to Cal. Bus. & Prof. Code Section 6125 (UPL — advising someone about their need for legal counsel may itself constitute legal advice).

**The Standard — What This Means in Practice:**
You may never, under any circumstances, tell or suggest to a claimant that they do not need an attorney, that hiring an attorney will be detrimental to their claim, or that the claim will be resolved more quickly without an attorney. This applies to all forms of communication: phone calls, letters, emails, in-person conversations, and any other interaction. If a claimant asks you, "Do I need a lawyer?" the correct response is: "That is your decision to make. You have the right to hire an attorney at any time. The State Bar of California and the WCAB Information and Assistance officers can help you find an attorney if you want one." You may not editorialize. You may not suggest that attorney involvement complicates matters.

**The Consequence — What Happens If You Don't:**
This is one of the most straightforward violations to prove. If a claimant or their subsequently hired attorney reports that the examiner discouraged representation, the DOI will investigate. Evidence includes: the claimant's testimony, claim file notes documenting the conversation, recorded phone calls (if applicable), or written correspondence. A single substantiated instance is a violation. A pattern across multiple claimants constitutes a general business practice finding with company-level enforcement. In bad faith litigation, evidence that the insurer discouraged the claimant from obtaining legal counsel is extraordinarily damaging — it suggests the insurer wanted the claimant to remain at a disadvantage. Courts may infer that the insurer's subsequent claims handling was similarly self-serving.

**The Common Mistake:**
An unrepresented injured worker calls the examiner and says, "My friend told me I should get a lawyer. What do you think?" The examiner, genuinely trying to be helpful, says: "A lot of claims settle without an attorney involved. It's really up to you, but most of the time we can work things out directly." The examiner did not intend to discourage representation, but the statement — "most of the time we can work things out directly" — implies that an attorney is unnecessary. Another common scenario: an examiner tells the claimant, "You know, attorneys take 12-15% of your settlement." While factually true, communicating attorney fee information in the context of the claimant's decision about whether to hire one is a discourage-representation signal. The examiner's role is to process the claim, not to advise the claimant about legal representation.

**AdjudiCLAIMS Helps You By:**
The Claims Chat UPL filter is specifically trained to detect and block any output that could be interpreted as discouraging legal representation. If an examiner asks the chat system how to respond to a claimant asking about attorneys, the system provides only the neutral, compliant response: inform the claimant of their right to representation and provide referral resources. The chat guardrails will not generate any language that evaluates whether a claimant needs an attorney. **Planned feature:** Communication Compliance Scanner — reviews outgoing correspondence to claimants for any language that could be interpreted as discouraging attorney representation, including subtle signals like emphasizing the ease of resolving claims directly.

**You Must:**
Treat the claimant's right to attorney representation as absolute and non-negotiable. If a claimant asks about getting a lawyer, respond neutrally: "You have the right to hire an attorney at any time. If you'd like help finding one, the WCAB Information and Assistance Unit can provide referrals." Do not add commentary. Do not share your opinion. Do not provide information about attorney fees in a context that could discourage hiring one. If the claimant is unrepresented, you have a heightened obligation to ensure all your claim handling is fair and well-documented — unrepresented claimants are the most vulnerable to unfair practices, and DOI auditors know it.

**Escalation Trigger:**
If a claimant tells you that a prior examiner or someone at your company discouraged them from getting a lawyer, report this immediately to your supervisor and compliance department. If you witness a colleague discouraging a claimant from obtaining representation, report it. This is not a gray area. If you are unsure whether something you said could be interpreted as discouraging representation, document the conversation in the file and notify your supervisor.

---

### 1.16 — Misleading Claimants About the Statute of Limitations

> **"Misleading a claimant as to the applicable statute of limitations."**
> — Cal. Ins. Code § 790.03(h)(16)

**Tier 1 (Dismissable):** "Statute of limitations" is the legal deadline by which a claim must be filed or certain actions must be taken. In California workers' compensation, the key limitations period is one year from the date of injury under Labor Code Section 5405 — but there are important exceptions. For cumulative trauma injuries (injuries caused by repetitive activity over time, not a single incident), the limitations period runs from the date the employee knew or should have known the injury was work-related (LC 5412). For occupational diseases, there are additional rules. "Misleading" means communicating incorrect, incomplete, or confusing information about these deadlines. You do not need to intend to mislead — an honest mistake about a filing deadline still violates this statute.

**The Authority:** California Insurance Code Section 790.03(h)(16); related Labor Code Sections 5405 (one-year limitations for specific injury), 5406 (occupational disease), 5412 (cumulative trauma — date of knowledge); enforced by the DOI under Ins. Code Section 790.06; potential UPL exposure under Bus. & Prof. Code 6125 if the examiner provides legal analysis of limitations questions.

**The Standard — What This Means in Practice:**
You must never communicate incorrect limitations period information to a claimant. In practice, the safest approach is to avoid making representations about limitations periods at all — limitations analysis involves legal judgment (when did the claimant "know or should have known"?) that is beyond an examiner's scope. If a claimant asks, "How long do I have to file?" the compliant answer is: "Filing deadlines are governed by the California Labor Code and may vary depending on your specific situation. I am not able to provide legal advice about filing deadlines. I recommend consulting with an attorney or contacting the WCAB Information and Assistance Unit." You may state objective facts from the statute — "Labor Code Section 5405 provides a one-year filing deadline from the date of injury for specific injuries" — but you must not apply that statute to the claimant's specific situation.

**The Consequence — What Happens If You Don't:**
If an examiner provides incorrect limitations information and the claimant misses a filing deadline as a result, the consequences are severe for all parties. The claimant may lose their right to benefits entirely. The insurer faces bad faith liability — the claimant (or their subsequently hired attorney) will argue that the insurer's misinformation caused the loss of the claim. Courts treat this extremely seriously. Beyond the civil liability, the DOI can cite 790.03(h)(16), and the examiner personally may face disciplinary action. If the misstatement involved legal analysis (applying the statute to specific facts), the examiner may also have committed unauthorized practice of law under Bus. & Prof. Code 6125.

**The Common Mistake:**
An injured worker calls and says, "I got hurt at work six months ago but I haven't filed anything yet. Am I too late?" The examiner, trying to be helpful, says: "No, you have one year from the date of injury." This sounds correct for a specific injury under LC 5405 — but the examiner does not know whether this might be a cumulative trauma injury (different limitations rule), whether the employer had knowledge that triggers a different date, or whether other exceptions apply. The examiner has just provided legal analysis — applying a statute of limitations to a specific factual situation — and may have provided incorrect information if the facts turn out to be different than assumed. If the worker relies on this information and misses the actual deadline, the examiner's statement will be Exhibit A.

**AdjudiCLAIMS Helps You By:**
The Claims Chat is programmed with strict guardrails around limitations period questions. If an examiner asks the chat system about a claimant's filing deadline, the system provides only the objective statutory text (LC 5405, 5406, 5412) with a mandatory disclaimer: "Statute of limitations analysis involves legal judgment that must be performed by a licensed attorney. This information is general and may not apply to the specific facts of this claim. Consult with defense counsel before communicating any limitations information to the claimant." The Regulatory Deadline Dashboard tracks internal deadlines (when the carrier must act) but does not display claimant-facing filing deadlines — because communicating those deadlines requires legal analysis. **Planned feature:** Limitations Safe Response Generator — when a claimant asks about filing deadlines, generates a compliant response that directs them to the WCAB Information and Assistance Unit and to an attorney, without stating any specific deadline.

**You Must:**
Never tell a claimant what their specific filing deadline is. Never apply a statute of limitations to the facts of a specific case — that is legal analysis reserved for attorneys. If a claimant asks about deadlines, direct them to the WCAB Information and Assistance Unit or to an attorney. If you need to understand the limitations period for your own claim handling purposes (e.g., determining whether a late-filed claim should be investigated), consult defense counsel for a legal analysis. Document any limitations-related conversations in the claim file.

**Escalation Trigger:**
If a claimant asks you about filing deadlines, escalate the question: "I cannot provide legal advice about filing deadlines. I recommend contacting an attorney or the WCAB Information and Assistance Unit at [phone number]." If you discover that incorrect limitations information was previously communicated to a claimant on a claim in your file (by a prior examiner, by your company, by anyone), escalate immediately to defense counsel and your supervisor. The claimant may need to be notified of the error, and the carrier may need to take corrective action to avoid bad faith exposure.

---

*End of Part 1. Parts 2-5 (DOI Regulations, DWC Regulations, Labor Code, Utilization Review) are maintained in separate sections of this specification.*

---

## Part 2: DOI Regulations — Fair Claims Settlement Practices (10 CCR 2695)

The California Department of Insurance (DOI) is the state agency that regulates insurance companies and the people who work for them. The DOI enforces the rules that govern how claims are handled. While Part 1 of this specification covered the Insurance Code — the statutes passed by the California Legislature — Part 2 covers the **regulations** written by the DOI to implement those statutes.

Think of it this way: the Insurance Code says "you must investigate claims promptly." The DOI regulations say exactly what "promptly" means — 15 days to acknowledge, 40 days to decide, 30-day status updates. The Insurance Code is the law. The DOI regulations are the operating manual.

These regulations are found in the **California Code of Regulations, Title 10, Sections 2695.1 through 2695.12**, commonly called the "Fair Claims Settlement Practices Regulations." They apply to every line of insurance, but Section 2695.9 adds requirements specific to Workers' Compensation.

**Tier 1 (Dismissable):** The California Department of Insurance (DOI) is the regulatory agency that oversees all insurance activity in California. The DOI has the power to investigate complaints, conduct market conduct examinations, impose fines, and revoke licenses. The Commissioner of Insurance is a statewide elected official. The DOI's regulations — published in Title 10 of the California Code of Regulations — have the force of law. When a regulation says "shall," it means "must." Violation of these regulations is treated as a violation of the Insurance Code itself, because the regulations implement the statutory mandate of Insurance Code Section 790.03. Every claims examiner in California operates under these regulations every day, whether they know it or not. AdjudiCLAIMS makes the invisible framework visible.

---

### 10 CCR 2695.2(d) — Definition of "Good Faith"

> **"Good faith" means that claims must be handled fairly, honestly, and completely. The absence of good faith is not merely negligence — it is an affirmative failure to deal fairly with the claimant.**
> — Cal. Code Regs., tit. 10, section 2695.2(d)

**Tier 1 (Dismissable):** "Good faith" is a legal term that appears throughout insurance law. In everyday language, it means you are genuinely trying to do the right thing — not looking for technicalities to avoid paying a valid claim, not dragging your feet, not making the process harder than it needs to be. In the regulatory context, good faith is measured by your actions, not your intentions. If your claims handling pattern shows repeated delays, missing documentation, or unexplained denials, a regulator will conclude you were not acting in good faith — regardless of what you believed at the time. This definition matters because it sets the baseline standard against which every other regulation in this section is measured. Every action you take on a claim is evaluated through the lens of: was this fair, honest, and complete?

**The Authority:** Cal. Code Regs., tit. 10, section 2695.2(d); implements Cal. Ins. Code section 790.03(h)

**The Standard — What This Means in Practice:**
Good faith is not an abstract concept — it is a measurable standard applied to every claim handling action. In practice, it means you investigate every claim thoroughly before making a decision. You do not look for reasons to deny; you look for the truth. You document your reasoning so that anyone reviewing the file — a supervisor, an auditor, a judge — can follow your thought process and see that you acted fairly. When you communicate with the injured worker, their attorney, or the employer, you are accurate, timely, and transparent.

**The Consequence — What Happens If You Don't:**
A pattern of bad faith claims handling triggers DOI enforcement action under Insurance Code section 790.03. The DOI can impose administrative penalties, order corrective action plans, and in severe cases refer matters for license revocation proceedings. Individual examiners may face disciplinary action from their employer as a result of DOI findings. Beyond regulatory penalties, bad faith conduct exposes the insurer to civil liability — California courts award damages, and in egregious cases punitive damages, against insurers who handle claims in bad faith. The Royal Globe line of cases established that injured workers can bring direct actions against insurers for unfair claims practices.

**The Common Mistake:**
An examiner receives a claim for a knee injury from a warehouse worker. The initial medical report is ambiguous — the doctor notes "possible pre-existing degenerative changes." Rather than investigating further (ordering additional records, requesting a panel QME evaluation), the examiner immediately denies the claim based on the ambiguity alone, writing "claim denied — pre-existing condition." This is not good faith. Good faith required the examiner to investigate the ambiguity, not exploit it. The correct action was to accept the claim for initial treatment while investigating the pre-existing condition question, or at minimum to obtain additional medical evidence before rendering a determination.

**AdjudiCLAIMS Helps You By:**
The investigation checklist tracks whether all standard investigation steps have been completed before you make a determination. The audit trail logs every action you take, creating a documented record that demonstrates good faith handling. The document summary engine extracts factual findings from medical records so you can base decisions on complete information rather than partial reads.

**You Must:**
Make the actual decision. AdjudiCLAIMS shows you what information you have and what is missing. You must apply your professional judgment to determine whether the investigation is complete and whether the evidence supports your determination. The tool surfaces facts; you weigh them.

**Escalation Trigger:**
If you believe the evidence on a claim is ambiguous and could support either acceptance or denial, consult your supervisor. If the ambiguity involves a legal question — such as whether an injury "arose out of and in the course of employment" — escalate to defense counsel. Never resolve a legal ambiguity on your own.

---

### 10 CCR 2695.3 — File and Record Documentation

> **"Every insurer shall maintain claim data that is accessible, legible, and retrievable so that the insurer can comply with the obligations imposed by these regulations. All claim files shall be subject to examination by the Commissioner or the Commissioner's designees."**
> — Cal. Code Regs., tit. 10, section 2695.3

**Tier 1 (Dismissable):** This regulation requires you to keep a complete record of everything that happens on a claim. Every phone call, every letter, every decision, every payment — documented in the claim file. "Accessible, legible, and retrievable" means the file must be organized so that someone unfamiliar with the claim (such as an auditor) can open it and understand the history. This is not optional record-keeping — it is a regulatory requirement, and the DOI can examine your files at any time. In the workers' compensation context, your claim file is your proof that you handled the claim correctly. If it is not documented, it did not happen.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.3; implements Cal. Ins. Code section 790.03(h)(3)

**The Standard — What This Means in Practice:**
Every claim file must contain a complete, chronological record of all activity. This includes: the initial claim report, all correspondence (incoming and outgoing), all medical records and reports, payment records, investigation notes, supervisor diary entries, reserve change documentation, and the reasoning behind every accept/deny/delay decision. The file must be organized so that an auditor can review it and trace every decision to its supporting documentation. Electronic files must be searchable. If you take an action on a claim and do not document it in the file, regulators will treat it as if the action never occurred.

**The Consequence — What Happens If You Don't:**
Incomplete documentation is the single most common finding in DOI market conduct examinations and DWC audits. During an audit, if the examiner cannot produce documentation supporting a decision, the auditor will cite a violation — even if the examiner actually did the right thing. The penalty is assessed based on the file contents, not the examiner's memory. Repeated documentation failures across multiple files indicate a systemic problem and can escalate from individual violations to a full corrective action plan imposed on the entire claims operation. Administrative penalties under CCR 10108 apply per violation, per file.

**The Common Mistake:**
An examiner speaks with the injured worker's treating physician by phone to clarify work restrictions. The doctor confirms the injured worker can return to modified duty. The examiner adjusts the TD payments accordingly — but never documents the phone call in the claim file. Three months later, the injured worker's attorney disputes the TD adjustment. The examiner remembers the call but has no documentation. In the audit, this appears as an unsupported benefit reduction, which is a violation of both the documentation standard (2695.3) and the good faith standard (2695.2(d)). A two-minute file note would have prevented this.

**AdjudiCLAIMS Helps You By:**
The audit trail automatically logs every action taken within AdjudiCLAIMS — every document uploaded, every summary generated, every deadline tracked, every chat interaction. The claim chronology/timeline feature auto-generates a time-ordered record of all events from uploaded documents. Document classification ensures every file is categorized and retrievable. These features create a documentation layer that supplements your manual file notes.

**You Must:**
Document your own reasoning, observations, and decisions. AdjudiCLAIMS logs system activity, but it cannot record your phone calls, your in-person conversations, or your professional judgment. You must add diary entries for any activity that occurs outside the system. The standard is: if it is not in the file, it did not happen.

**Escalation Trigger:**
If you discover that a claim file has significant gaps in documentation — missing correspondence, undocumented decisions, gaps in the timeline — notify your supervisor immediately. Reconstructing a file after the fact raises its own compliance concerns, and your supervisor needs to determine the appropriate remediation.

---

### 10 CCR 2695.4 — Representation of Policy Provisions

> **"No insurer shall misrepresent to claimants pertinent facts or insurance policy provisions relating to any coverage at issue. No insurer shall fail to disclose to first-party claimants all benefits, coverage, time limits, or other provisions of any insurance policy issued by that insurer that may apply to the claim presented by the claimant."**
> — Cal. Code Regs., tit. 10, section 2695.4

**Tier 1 (Dismissable):** This regulation has two parts. First, you cannot misrepresent — that is, lie about or inaccurately describe — what the insurance policy covers. Second, you must affirmatively disclose all benefits and provisions that might apply to the claim. In workers' compensation, "policy provisions" includes the statutory benefit framework (temporary disability, permanent disability, medical treatment, supplemental job displacement benefits) as well as any specific terms in the employer's workers' compensation insurance policy. The key word is "affirmatively" — you cannot sit on information and hope the injured worker does not ask about it. If a benefit applies, you must tell them.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.4; implements Cal. Ins. Code section 790.03(h)(1)

**The Standard — What This Means in Practice:**
When you communicate with an injured worker about their claim, you must accurately describe the benefits available under their employer's workers' compensation coverage. If the injured worker is entitled to temporary disability, you must inform them of that entitlement and the payment amount. If they are entitled to medical treatment, you must explain the MPN process. You must not overstate policy limitations to discourage a claim, and you must not omit information about available benefits. Every written communication — benefit notices, denial letters, payment explanations — must accurately reflect the applicable policy provisions and statutory benefits.

**The Consequence — What Happens If You Don't:**
Misrepresentation of policy provisions is one of the most serious violations in the DOI regulatory framework. It directly violates Insurance Code section 790.03(h)(1) — the first prohibited practice on the statutory list. The DOI treats misrepresentation as an intentional act unless the insurer can demonstrate it was an honest error that was promptly corrected. Penalties are assessed per occurrence. In egregious cases — such as systematically understating benefits across multiple claims — the DOI can pursue license revocation proceedings against the insurer. Individual examiners who knowingly misrepresent coverage face termination and potential personal liability.

**The Common Mistake:**
An injured worker calls to ask about supplemental job displacement benefits (SJDB). The examiner is not sure whether the injured worker qualifies, so rather than researching the question or consulting a supervisor, the examiner says "that benefit doesn't apply to your type of injury." In fact, SJDB is available to any injured worker whose injury results in permanent partial disability and whose employer does not offer modified or alternative work within 60 days of the PD rating becoming final. The examiner's incorrect statement is a misrepresentation of policy provisions — not because the examiner intended to deceive, but because the examiner provided inaccurate information about available benefits rather than saying "let me look into that and get back to you."

**AdjudiCLAIMS Helps You By:**
The benefit calculator provides accurate statutory benefit calculations based on the claim data — TD rates, PD estimates, and deadline-driven benefit triggers. The claims chat (UPL-filtered) can answer factual questions about statutory benefit provisions. These tools help you give accurate answers to benefit questions rather than guessing. Every calculation cites its statutory source.

**You Must:**
Verify that any benefit information you provide to a claimant is accurate. If you are unsure about a benefit provision, say so — tell the injured worker you will research the question and follow up. Never guess. AdjudiCLAIMS provides calculations and citations, but you are the one communicating with the injured worker, and you are responsible for the accuracy of that communication.

**Escalation Trigger:**
If an injured worker asks about a benefit or provision you are unfamiliar with, do not answer on the spot. Research the question using your resources, consult your supervisor if needed, and provide a documented written response. If the question involves a legal interpretation — such as whether a specific injury qualifies for a particular benefit — escalate to defense counsel.

---

### 10 CCR 2695.5(b) — Acknowledge Receipt of Claim Within 15 Calendar Days

> **"Upon receiving any communication with respect to a claim, every insurer shall immediately, but in no event more than fifteen (15) calendar days after receipt of that communication, acknowledge receipt of such communication unless payment is made within that period of time."**
> — Cal. Code Regs., tit. 10, section 2695.5(b)

**Tier 1 (Dismissable):** When someone sends you anything related to a claim — a new claim form, a letter from an attorney, medical records, a benefit inquiry — you have 15 calendar days to acknowledge that you received it. "Calendar days" means every day counts, including weekends and holidays. The clock starts when the communication arrives at the insurer's office, not when it reaches your desk. "Acknowledge" means sending a written response confirming receipt. This is one of the most commonly audited deadlines in workers' compensation. It is non-negotiable and there are no extensions.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.5(b); implements Cal. Ins. Code section 790.03(h)(2)

**The Standard — What This Means in Practice:**
Every incoming claim communication must be date-stamped upon receipt. Within 15 calendar days from that date stamp, you must send a written acknowledgment to the person who sent it. The acknowledgment must confirm what was received and identify the claim. For a new claim, the acknowledgment typically includes the assigned claim number, the examiner's name and contact information, and a summary of next steps. For subsequent communications, it confirms receipt and advises the claimant of any action being taken. Many claims operations use automated acknowledgment letters triggered by the date stamp — this is acceptable as long as the letter is actually sent within the 15-day window.

**The Consequence — What Happens If You Don't:**
Late or missing acknowledgments are among the most frequent audit findings in DOI market conduct examinations. Each missed acknowledgment is a separate violation subject to administrative penalties under CCR 10108. Because the deadline is absolute and easily measurable (date of receipt versus date of acknowledgment), auditors can identify violations with minimal judgment required — the dates either comply or they do not. A pattern of late acknowledgments across multiple files constitutes a "general business practice" under Insurance Code section 790.03(h), which elevates the finding from individual violations to a systemic unfair claims practice. Penalties escalate accordingly.

**The Common Mistake:**
An examiner with 150 open claims receives a packet of medical records from an attorney's office on a Friday afternoon. The examiner is busy with other deadlines and sets the packet aside to review on Monday. Monday brings its own priorities, and the packet gets buried under other work. Three weeks later, the examiner finally reviews the records — but the 15-day acknowledgment deadline passed 6 days ago. Even though the examiner eventually reviewed the records and acted on them, the failure to acknowledge receipt within 15 days is a standalone violation. The records sitting unopened on a desk does not stop the clock.

**AdjudiCLAIMS Helps You By:**
The regulatory deadline dashboard tracks the 15-day acknowledgment deadline for every incoming communication. When a document is uploaded to the system, the clock starts automatically. The dashboard color-codes claims by deadline urgency: green (less than 50% of the deadline elapsed), yellow (50-80%), red (more than 80% or overdue). You receive alerts as deadlines approach. The system cannot send the acknowledgment for you, but it ensures you never lose track of the deadline.

**You Must:**
Send the actual acknowledgment letter. AdjudiCLAIMS tracks the deadline and alerts you, but you must draft and send the acknowledgment communication. You must also ensure that incoming communications are uploaded to the system promptly — the dashboard can only track deadlines for items it knows about. If a letter arrives by mail and sits on your desk for a week before you scan and upload it, you have already consumed half your deadline.

**Escalation Trigger:**
If you discover that an acknowledgment deadline has already passed — a communication was received but never acknowledged — notify your supervisor immediately. Late acknowledgment is better than no acknowledgment, but your supervisor needs to know about the compliance gap. If you are consistently unable to meet the 15-day deadline across your caseload, that is a workload management issue requiring supervisor intervention.

---

### 10 CCR 2695.5(e) — Begin Investigation Immediately Upon Receipt

> **"Upon receiving proof of claim, every insurer shall immediately, but in no event more than forty (40) calendar days later, accept or deny the claim, in whole or in part. The insurer shall immediately begin investigation of the claim upon receipt of the proof of claim."**
> — Cal. Code Regs., tit. 10, section 2695.5(e)

**Tier 1 (Dismissable):** "Proof of claim" in workers' compensation typically means the employer's first report of injury and the claim form (DWC-1). Once you receive proof of claim, two obligations begin simultaneously: (1) you must begin investigating the claim immediately, and (2) the 40-day clock starts for you to accept or deny the claim. "Immediately" means right away — not next week, not when your caseload lightens up. This does not mean you must complete the investigation immediately; it means you must begin the investigation immediately. A common investigation start includes: contacting the employer for a statement, contacting the injured worker, requesting medical records, and assigning the claim in your system with an investigation plan.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.5(e); implements Cal. Ins. Code section 790.03(h)(3) and (h)(4)

**The Standard — What This Means in Practice:**
When proof of claim arrives, your file note should show investigation activity beginning within one to two business days. "Investigation" includes the "three-point contact" standard used by most claims operations: contact the injured worker, contact the employer, and contact the treating physician. You should also request index bureau checks, prior claim history, and any relevant employment records. The investigation must be documented in the file as it progresses. If certain investigation steps are delayed (for example, a witness is unavailable), that delay and the reason for it must be documented. The goal is to gather enough information within the 40-day window to make an informed accept/deny decision.

**The Consequence — What Happens If You Don't:**
Failure to begin a timely investigation is a violation of both this regulation and the good faith standard (2695.2(d)). In an audit, the auditor reviews the file for evidence of investigation activity following receipt of proof of claim. If the file shows no activity for two or three weeks after receipt, the auditor will cite a violation — even if the examiner subsequently conducted a thorough investigation and made a correct determination. The violation is about timeliness, not outcome. Additionally, if the examiner denies a claim after an untimely or incomplete investigation, that denial is vulnerable to challenge as unreasonable under Insurance Code section 790.03(h)(4): refusing to pay a claim without conducting a reasonable investigation.

**The Common Mistake:**
An examiner receives a new claim on a busy Monday and enters it into the system with basic data. The examiner plans to start the investigation later in the week. But other urgent matters — pending hearings, overdue payments, supervisor requests — keep pushing the new claim to the back of the queue. Two weeks pass before the examiner makes the first call to the employer. The investigation itself is eventually thorough, and the examiner makes the correct determination within the 40-day window. But the two-week delay before beginning investigation is a standalone violation of the "immediately" standard. The examiner's file shows receipt on day 1 and first investigation activity on day 14 — that gap is a citation.

**AdjudiCLAIMS Helps You By:**
The investigation checklist automatically generates when a new claim is created, listing standard investigation steps: three-point contact, records requests, index checks, and more. Each step is tracked as complete or outstanding. The regulatory deadline dashboard tracks both the "investigation start" obligation and the 40-day determination deadline. Document ingestion and classification accelerate the information-gathering phase by auto-extracting claim data from uploaded documents, so you can begin substantive investigation sooner.

**You Must:**
Make the calls, send the letters, and request the records. AdjudiCLAIMS shows you what investigation steps are needed and tracks your progress, but it cannot conduct the investigation for you. You must personally contact the injured worker, the employer, and the treating physician. You must exercise professional judgment to identify what additional investigation is needed beyond the standard steps. The checklist is a floor, not a ceiling.

**Escalation Trigger:**
If you receive a new claim and cannot begin investigation within two business days due to workload, notify your supervisor immediately. Workload is not an excuse for untimely investigation — it is a resource allocation problem that your supervisor must address. If the claim involves complex facts that may require more than 40 days to investigate, begin the delay notification process under 10 CCR 2695.7(c) as early as possible.

---

### 10 CCR 2695.6 — Training and Certification of Claims Personnel

> **"Every insurer shall adopt and communicate to all of its claims agents and other claims settlement personnel operating on its behalf, written standards for the prompt investigation and processing of claims. All such claims agents and claims settlement personnel shall be advised of and shall adhere to the standards."**
> — Cal. Code Regs., tit. 10, section 2695.6

**Tier 1 (Dismissable):** This regulation requires your employer — the insurer or TPA — to train you. You must be trained on the company's written claims handling standards before you handle claims independently. "Claims agents" includes adjusters, examiners, and anyone else who touches claim files. The regulation places the primary obligation on the insurer (to create and communicate the standards), but it also requires you to follow them. If your employer has not trained you on its written claims handling standards, that is a compliance problem for both you and your employer. You should request the training and document that you did so.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.6; implements Cal. Ins. Code section 790.03(h)(3)

**The Standard — What This Means in Practice:**
Your employer must have written claims handling procedures that comply with these DOI regulations. Those procedures must be provided to every person who handles claims. The procedures should cover: acknowledgment deadlines, investigation standards, documentation requirements, decision timelines, payment processing, denial procedures, and communication standards. Training must occur before the claims handler begins independent work, and updates must be provided when procedures change. Many insurers and TPAs require claims examiners to complete initial training programs (often 40-80 hours) before receiving their own caseload, followed by annual continuing education. Some states require licensing or certification of claims adjusters — California does not require a state license for claims examiners employed by an insurer, but the insurer must still comply with this training regulation.

**The Consequence — What Happens If You Don't:**
If the insurer fails to train claims personnel, the DOI can cite the insurer for a systemic violation. During a market conduct examination, the DOI may request evidence of training programs, training completion records, and written procedures. If these do not exist or are inadequate, the finding is an institutional violation — not just an individual one. For the individual examiner, handling claims without proper training increases the risk of making errors that trigger other regulatory violations. The examiner may face disciplinary action if violations occur that proper training would have prevented.

**The Common Mistake:**
A new claims examiner is hired during a busy period. The employer assigns a partial caseload immediately, planning to schedule formal training "when things slow down." The examiner — eager to contribute — begins handling claims using general knowledge and guidance from colleagues, but without having been trained on the company's specific written procedures. The examiner misses a 15-day acknowledgment deadline because they were not told about the tracking system. The employer cannot effectively defend the violation because the examiner was never trained on the procedure. Both the training gap (2695.6) and the missed deadline (2695.5(b)) are separate citable violations.

**AdjudiCLAIMS Helps You By:**
The contextual regulatory education system — the feature described by this specification — is itself a training tool. Every regulatory deadline, every compliance requirement, and every claims handling standard is explained in-product at the point where you encounter it. The two-tier disclosure system ensures that fundamental concepts are available when you need them (Tier 1) and that mandatory compliance information is always present (Tier 2). AdjudiCLAIMS supplements your employer's training program by making the regulatory framework visible and accessible during daily work.

**You Must:**
Complete all training required by your employer before handling claims independently. If you have not received training on a specific process or regulation, tell your supervisor. Do not handle claims in areas where you have not been trained. AdjudiCLAIMS provides contextual education, but it is not a substitute for your employer's formal training program.

**Escalation Trigger:**
If you are assigned claims in an area where you have not been trained — for example, a complex cumulative trauma claim when you have only been trained on specific-injury claims — notify your supervisor before proceeding. If your employer does not have written claims handling procedures or has not provided them to you, document your request for them in writing.

---

### 10 CCR 2695.7(a) — Minimum Standards for Claims Investigation

> **"Every insurer shall conduct and diligently pursue a thorough, fair, and objective investigation. No insurer shall persist in seeking information not reasonably required for or material to the resolution of a claim dispute."**
> — Cal. Code Regs., tit. 10, section 2695.7(a)

**Tier 1 (Dismissable):** This regulation sets the quality standard for your investigation. Three words define it: thorough, fair, and objective. "Thorough" means you gathered all the relevant information. "Fair" means you gave appropriate weight to evidence supporting the claim, not just evidence against it. "Objective" means you did not start with a conclusion and work backward to justify it. The second sentence is equally important: you cannot drag out an investigation by endlessly requesting information that is not relevant to the claim. If you have enough information to make a determination, make it. Demanding unnecessary documentation is itself a violation.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.7(a); implements Cal. Ins. Code section 790.03(h)(3) and (h)(4)

**The Standard — What This Means in Practice:**
Your investigation must cover all facts material to the claim determination. For a workers' compensation claim, this typically includes: the circumstances of the injury (how, when, where), the medical evidence (diagnosis, causation, treatment, disability), the employment relationship (job duties, wages, employment status), and any coverage issues (policy in force, employer covered). You must weigh all evidence — both supporting and contradicting the claim — and document your analysis. You must not request information solely to delay the claims process. For example, demanding five years of prior medical records when the claim is for a clearly industrial laceration is not "thorough" — it is obstructive. The standard is materiality: request what is reasonably needed to resolve the claim.

**The Consequence — What Happens If You Don't:**
An investigation that is not thorough, fair, or objective exposes the insurer to multiple regulatory violations. A denial based on an incomplete investigation violates Insurance Code section 790.03(h)(4). A biased investigation that ignores favorable evidence violates the good faith standard (2695.2(d)). Requesting unnecessary information to delay the process violates both this regulation and 790.03(h)(12) (requiring duplicative documentation to delay claims). In the audit context, the auditor examines whether the investigation file supports the determination. If the file shows a denial but lacks evidence of thorough investigation, the denial itself is cited as unsupported.

**The Common Mistake:**
An examiner receives a claim for a back injury from an office worker. The employer confirms the injury occurred at work. The treating physician confirms an industrial back sprain. The injured worker has no prior back claims. But the examiner, concerned about "fraud," orders a sub rosa investigation, requests five years of prior medical records from every provider the injured worker has ever seen, and demands a recorded statement — all before making any determination. Four months pass. The investigation finds nothing to contradict the claim. The examiner finally accepts the claim. The 40-day deadline was missed months ago, the delay notification requirements were not met, and the investigation was not "fair and objective" — it was a fishing expedition driven by suspicion rather than evidence. The claim should have been accepted while pursuing any specific, identified concerns in parallel.

**AdjudiCLAIMS Helps You By:**
The investigation checklist is calibrated to the standard investigation requirements for each claim type. It distinguishes between required steps (three-point contact, initial medical review) and circumstance-dependent steps (sub rosa, prior records) that are only triggered when specific factual indicators are present. The document summary engine extracts factual findings from medical records so you can assess the evidence efficiently. The regulatory deadline dashboard ensures the 40-day determination deadline remains visible throughout the investigation.

**You Must:**
Direct the investigation based on the facts of each specific claim. AdjudiCLAIMS provides a framework, but you must decide which investigation steps are warranted by the specific circumstances. Do not conduct a maximum investigation on every claim — investigate what is material. Equally, do not accept claims without sufficient investigation. The balance between thoroughness and timeliness is a professional judgment call that you make on each claim.

**Escalation Trigger:**
If your investigation reveals facts that suggest the claim may involve complex legal issues — disputed employment, third-party liability, serious and willful misconduct, or fraud indicators — escalate to your supervisor and defense counsel before making a determination. These issues require legal analysis that is beyond the claims examiner's scope.

---

### 10 CCR 2695.7(b) — Accept or Deny Claim Within 40 Calendar Days

> **"Upon receiving proof of claim, every insurer shall immediately, but in no event more than forty (40) calendar days later, accept or deny the claim, in whole or in part. If the insurer denies or rejects the claim, in whole or in part, the insurer shall provide to the claimant a written statement listing all bases for such rejection or denial and the factual and legal bases for each reason given for such rejection or denial."**
> — Cal. Code Regs., tit. 10, section 2695.7(b)

**Tier 1 (Dismissable):** This is the core determination deadline. From the day you receive proof of claim (typically the DWC-1 claim form and employer's first report), you have exactly 40 calendar days to either accept or deny the claim. "Calendar days" means every day counts — weekends, holidays, all of them. "Accept or deny" means a definitive decision communicated in writing to the claimant. You can accept the claim in full, deny the claim in full, or accept in part and deny in part. If you deny any portion, you must provide a written explanation of every reason for the denial. Vague or boilerplate denial language is not sufficient — the reasons must be specific to this claim, based on the facts you investigated and the applicable law.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.7(b); implements Cal. Ins. Code section 790.03(h)(5)

**The Standard — What This Means in Practice:**
The 40-day clock starts when the insurer receives proof of claim. In a workers' compensation context, this is typically when the claims administrator receives the completed DWC-1 form from the employer, though other documents may also constitute proof of claim depending on the circumstances. Within 40 days, your file must show: (1) the investigation you conducted, (2) the evidence you considered, (3) your determination (accept or deny), and (4) written communication of that determination to the claimant. For acceptances, you must begin providing benefits. For denials, your written denial letter must state every reason for the denial with specificity — "claim denied based on investigation" is not sufficient. You must state the specific factual and legal basis: "claim denied because medical evidence from Dr. Jones (report dated MM/DD/YY) indicates the condition predates the claimed date of injury and is not industrially caused."

**The Consequence — What Happens If You Don't:**
Missing the 40-day deadline is a per-claim violation subject to administrative penalties. In the workers' compensation context, failure to accept or deny within the required timeframe can also trigger automatic acceptance of the claim under certain circumstances — if you do not act, the law may act for you. Late denials are particularly problematic because they compound: the late denial itself is a violation, the injured worker may have incurred costs or suffered hardship during the delay, and any litigation over the denial will be colored by the fact that the insurer could not even make a timely determination. Auditors track the 40-day deadline rigorously because it is a bright-line rule with no ambiguity.

**The Common Mistake:**
An examiner is investigating a claim involving a knee injury. By day 30, the examiner has employer and employee statements, initial medical records, and an index bureau report. The evidence is sufficient to make a determination — the injury is clearly industrial. But the examiner is waiting for one more medical record from a specialist appointment that occurred after the date of injury. The specialist's office has not responded to two requests. Rather than making a determination on the available evidence and supplementing the file later, the examiner waits. Day 40 passes. Day 50 passes. The specialist records finally arrive on day 55. The examiner accepts the claim. The determination was correct, but it was 15 days late — a clear violation. The correct action was to accept the claim based on the evidence available by day 40 and continue pursuing the specialist records for the ongoing file.

**AdjudiCLAIMS Helps You By:**
The regulatory deadline dashboard tracks the 40-day determination deadline for every open claim from the moment proof of claim is received. The countdown is always visible. As the deadline approaches, alert intensity increases. The investigation checklist shows what evidence you have gathered versus what is still outstanding, helping you assess whether you have enough information to make a determination before the deadline. The document summary engine ensures you can review gathered evidence quickly rather than re-reading entire files under deadline pressure.

**You Must:**
Make the determination. AdjudiCLAIMS tracks the deadline and organizes the evidence, but the accept/deny decision is yours. If you do not have all the evidence you want by day 35, you must decide: is what you have sufficient to make a determination, or do you need to invoke the delay notification process under 2695.7(c)? That is a professional judgment call. Do not let the perfect be the enemy of the compliant.

**Escalation Trigger:**
If you are approaching the 40-day deadline and do not believe you have sufficient evidence to make a determination, initiate the delay notification process under 2695.7(c) before the deadline passes — not after. If the claim involves complex legal issues that prevent determination (such as disputed employment or coverage), escalate to defense counsel well before the deadline. A claim sitting on defense counsel's desk does not stop your regulatory clock.

---

### 10 CCR 2695.7(c) — Notify Claimant Every 30 Days If Delay Needed

> **"If more time is required than is allotted in subdivision (b) to determine whether a claim should be accepted and/or denied in whole or in part, every insurer shall provide the claimant, within the time specified in subdivision (b), with written notice of the need for additional time. Such written notice shall specify any additional information the insurer requires in order to make a determination and shall specify any continued reasons for the insurer's inability to make a determination. Thereafter, written notice of the status of a claim shall be furnished to the claimant every thirty (30) calendar days until a final determination is made."**
> — Cal. Code Regs., tit. 10, section 2695.7(c)

**Tier 1 (Dismissable):** If you cannot make an accept/deny decision within the 40 calendar days required by subdivision (b), you must send a written status letter to the claimant before the 40 days expire. This letter must explain why you need more time and specify exactly what additional information you are waiting for. After that first letter, you must send a status update every 30 calendar days until you make a final determination. These are commonly called "delay letters" or "status letters." They are not optional — each missed status letter is a separate violation. The requirement protects the injured worker from being left in the dark about their claim.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.7(c); implements Cal. Ins. Code section 790.03(h)(2) and (h)(5)

**The Standard — What This Means in Practice:**
Before day 40, if you cannot make a determination, you must send a written notice to the claimant that includes: (1) a statement that more time is needed, (2) the specific reason more time is needed, (3) what additional information you are still seeking, and (4) an estimate of when you expect to make a determination. Every 30 calendar days after that, you must send another letter with the same information — updated with the current status. The letters must be specific, not boilerplate. "We are continuing to investigate your claim" is not sufficient. "We are awaiting medical records from Dr. Smith, which were requested on [date] and have not yet been received" is sufficient. The 30-day cycle continues until you make a final accept/deny decision.

**The Consequence — What Happens If You Don't:**
Each missed delay letter is a separate regulatory violation. The consequences compound: if you miss the 40-day determination deadline without sending a delay letter, that is two violations (late determination + no delay notice). If you then go another 30 days without a status update, that is a third violation. Auditors review the file timeline and look for gaps between the determination deadline and the first delay letter, and between successive delay letters. A claim file that shows no activity for 90 days after proof of claim — no determination, no delay letters — will generate multiple violations in a single file. Multiply this across an examiner's caseload, and the penalty exposure grows rapidly.

**The Common Mistake:**
An examiner sends a timely delay letter on day 38, explaining that the QME report is pending. The QME appointment is scheduled for day 60. The QME report arrives on day 75. The examiner makes a determination on day 80. This looks reasonable — but the examiner forgot to send the 30-day status update that was due on day 68 (30 days after the initial delay letter). Even though the claim was resolved only 12 days after the missed update, the failure to send the day-68 letter is a standalone violation. Each 30-day cycle is a separate obligation with its own deadline.

**AdjudiCLAIMS Helps You By:**
The regulatory deadline dashboard tracks not only the initial 40-day determination deadline but also the rolling 30-day delay notification cycle. When you mark a claim as "delayed/pending," the system automatically starts tracking 30-day intervals and alerts you when each status letter is due. The dashboard shows all claims in delay status with their next letter due date, color-coded by urgency.

**You Must:**
Write and send the delay letters. AdjudiCLAIMS tracks the deadlines, but you must draft the letter with specific, accurate information about why the claim is delayed and what you are waiting for. Boilerplate language will not satisfy the regulation — the letter must reflect the actual status of your investigation on this specific claim.

**Escalation Trigger:**
If a claim has been in delay status for more than 90 days without a determination, notify your supervisor. Extended delays may indicate that the investigation has stalled or that the claim requires different resources (legal analysis, specialist referral, or reallocation to a more experienced examiner). If the delay is caused by a dispute that involves legal questions, the claim should have been referred to defense counsel already.

---

### 10 CCR 2695.7(h) — Written Denial Must Include Specific Reasons

> **"If a claim or any portion thereof is denied or rejected, the written notice of denial or rejection shall include a statement of the reasons for such rejection or denial and shall include specific reference to the policy provisions, conditions, or exclusions upon which the denial or rejection is based."**
> — Cal. Code Regs., tit. 10, section 2695.7(h)

**Tier 1 (Dismissable):** When you deny a claim — in whole or in part — you must put the denial in writing and explain why. The denial letter must do two things: (1) state the specific reasons for the denial, based on the facts of this particular claim, and (2) cite the specific policy provisions, conditions, or exclusions that support the denial. In workers' compensation, "policy provisions" includes both the insurance policy terms and the applicable statutory provisions. A denial letter that says only "claim denied" or "claim denied — not industrially caused" is not sufficient. The letter must explain the factual basis (what evidence was considered) and the legal/policy basis (what provision applies) in enough detail that the claimant can understand why the claim was denied and how to challenge the denial if they disagree.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.7(h); implements Cal. Ins. Code section 790.03(h)(14)

**The Standard — What This Means in Practice:**
Every denial letter must contain: (1) the specific factual basis for the denial — what evidence was reviewed and what conclusions were drawn; (2) the specific policy provisions, statutory sections, or regulatory standards that support the denial; (3) the claimant's rights — how to dispute the denial and what process is available; and (4) contact information for the examiner or claims office. For a workers' compensation denial, this might look like: "Based on our investigation, including review of the medical report from Dr. Smith dated MM/DD/YY, the employer's first report of injury, and the employee's statement, we are denying the claim for the following reason: the medical evidence does not establish that the claimed injury arose out of or in the course of employment. Specifically, Dr. Smith's report states [specific finding]. This denial is based on Labor Code Section 3600, which requires that the injury arise out of and in the course of employment."

**The Consequence — What Happens If You Don't:**
Inadequate denial letters violate both this regulation and Insurance Code section 790.03(h)(14) — failing to provide a reasonable explanation for the denial. In an audit, every denial in the sampled files will be reviewed for compliance with this standard. A denial letter that lacks specific reasons, or that uses generic boilerplate language without claim-specific facts, will be cited as a violation. Inadequate denial letters also weaken the insurer's position in any subsequent litigation — if the denial letter does not clearly state the basis, the WCAB may infer that the insurer did not have a legitimate basis at the time of denial. Courts view post-hoc explanations with skepticism.

**The Common Mistake:**
An examiner denies a cumulative trauma claim and sends a denial letter stating: "After investigation, we have determined that your claimed injury is not compensable. If you disagree with this decision, you may contact the Workers' Compensation Appeals Board." This denial letter violates the regulation in multiple ways: it does not state the factual basis (what investigation was conducted, what evidence was reviewed), it does not cite the medical evidence (what did the doctors say?), it does not identify the specific statutory or policy basis for the denial, and it does not explain why cumulative trauma was not established. An auditor reviewing this file would cite a violation even if the denial itself was substantively correct.

**AdjudiCLAIMS Helps You By:**
The document summary engine provides concise, cited summaries of all medical evidence in the file, making it easier to identify and reference the specific evidence supporting your denial. The claims chat can answer factual questions about the evidence — "What did Dr. Jones say about causation?" — so you can accurately state the factual basis in your denial letter. The benefit calculator ensures that any statutory calculations cited in a partial denial are accurate. The audit trail documents the investigation steps that support your determination.

**You Must:**
Write the denial letter with specific, accurate, claim-specific language. AdjudiCLAIMS helps you identify the evidence, but you must articulate the reasons for denial clearly and completely. Do not use templates without customizing them to the specific facts. Do not deny a claim unless your investigation supports the denial and you can explain the basis in writing. If you cannot clearly articulate why you are denying the claim, you may not have a sufficient basis to deny it.

**Escalation Trigger:**
If the basis for denial involves legal analysis — such as the application of apportionment standards, the interpretation of "arising out of employment" for a novel fact pattern, or the application of a statute of limitations defense — the denial basis should be developed in consultation with defense counsel. The legal analysis is counsel's responsibility; the denial letter is yours. Consult counsel before, not after, issuing a denial on legally complex claims.

---

### 10 CCR 2695.9 — Additional Workers' Compensation Claims Handling Standards

> **"In addition to the other provisions of these regulations, the following shall apply to workers' compensation claims: all claims handling shall comply with the requirements of the Labor Code, the regulations of the Division of Workers' Compensation, and the rules of the Workers' Compensation Appeals Board."**
> — Cal. Code Regs., tit. 10, section 2695.9

**Tier 1 (Dismissable):** This regulation is the bridge between the DOI's general fair claims settlement regulations (which apply to all lines of insurance) and the specific requirements of workers' compensation law. It says, in essence: everything in regulations 2695.1 through 2695.8 applies to workers' compensation claims, AND you must also comply with the entire Labor Code workers' compensation framework, the DWC regulations (CCR Title 8), and the WCAB rules of practice. Workers' compensation is the most heavily regulated line of insurance in California. A WC claims examiner is subject to more regulatory oversight than an examiner handling auto, homeowner, or general liability claims. This regulation ensures that the DOI's enforcement authority explicitly covers WC-specific requirements.

**The Authority:** Cal. Code Regs., tit. 10, section 2695.9; cross-references Cal. Lab. Code sections 3200-6002; Cal. Code Regs., tit. 8, sections 9700-10997; WCAB Rules of Practice and Procedure

**The Standard — What This Means in Practice:**
Workers' compensation claims handling must comply with three overlapping regulatory frameworks simultaneously: (1) the DOI fair claims settlement regulations (10 CCR 2695, the regulations covered in this Part), (2) the DWC claims administration regulations (8 CCR 10100-10118, covered in Part 3 of this specification), and (3) the Labor Code and WCAB rules governing benefits, medical treatment, dispute resolution, and adjudication. This means that a single claims handling action — such as paying temporary disability benefits — must comply with the payment amount requirements (Labor Code section 4653), the payment timing requirements (Labor Code section 4650), the documentation requirements (10 CCR 2695.3 and 8 CCR 10101), and the good faith standard (10 CCR 2695.2(d)). Compliance with one framework does not excuse non-compliance with another.

**The Consequence — What Happens If You Don't:**
Because workers' compensation claims are subject to multiple regulatory frameworks, violations can be cited by multiple authorities. The DOI can cite violations of the fair claims settlement regulations. The DWC can cite violations of the claims administration regulations and assess penalties under CCR 10108. The WCAB can award penalties and sanctions in individual cases. An injured worker's attorney can seek penalties under Labor Code section 5814 (unreasonable delay or refusal to pay benefits) and Labor Code section 5814.5 (attorney fees for unreasonable conduct). A single act of non-compliance can trigger consequences from multiple directions simultaneously.

**The Common Mistake:**
An examiner focuses exclusively on meeting the DOI timeline requirements — 15-day acknowledgment, 40-day determination — but neglects the parallel Labor Code requirements. The examiner accepts a claim on day 35 (within the 40-day window) but does not issue the first temporary disability payment until day 50 — 15 days after acceptance but 50 days after the employer first knew of the injury. The DOI determination deadline was met, but the Labor Code section 4650 requirement (first TD payment within 14 days of employer knowledge) was violated weeks ago. Compliance with one regulation does not cure non-compliance with another. The examiner needed to begin TD payments within 14 days of employer knowledge, even while the investigation was ongoing.

**AdjudiCLAIMS Helps You By:**
The regulatory deadline dashboard tracks deadlines from all three regulatory frameworks simultaneously — DOI timelines, DWC requirements, and Labor Code obligations. You see a unified view of every compliance obligation across every claim, regardless of which regulatory body imposed it. The contextual regulatory education system (this specification) explains which authority imposes each obligation, so you understand the source and consequence of each requirement.

**You Must:**
Understand that workers' compensation compliance is multi-layered. Meeting one deadline does not mean you have met all your obligations. Review your compliance dashboard holistically, not one deadline at a time. When in doubt about which requirement applies in a specific situation, consult your supervisor or defense counsel.

**Escalation Trigger:**
If you identify a conflict between regulatory requirements — for example, a situation where complying with one regulation appears to require violating another — stop and escalate to your supervisor and defense counsel immediately. Regulatory conflicts are rare but real, and resolving them requires legal judgment.

---

## Part 3: DWC Claims Administration Regulations (CCR Title 8)

The Division of Workers' Compensation (DWC) is the state agency within the Department of Industrial Relations that administers California's workers' compensation system. While Part 2 covered the Department of Insurance regulations (how insurers must handle claims fairly), Part 3 covers the DWC's regulations (how claims administrators must manage claim files, maintain records, and submit to audits).

Think of the DWC as the operational regulator. The DOI focuses on fair treatment of claimants. The DWC focuses on the mechanics of claims administration — what is in the file, how long you keep it, what you report, and how you are audited. The DWC has its own enforcement apparatus: it audits claims administrators, assesses penalties for violations, and publishes audit results.

These regulations are found in the **California Code of Regulations, Title 8, Sections 10100 through 10118**, commonly called the "Claims Administration Regulations." They were adopted under the authority of Labor Code Section 129 and 129.5, which give the DWC Administrative Director broad power to audit claims administrators and impose civil penalties for regulatory violations.

**Tier 1 (Dismissable):** The Division of Workers' Compensation (DWC) is a division within the California Department of Industrial Relations (DIR). The DWC oversees the workers' compensation system — it sets the rules for claims administration, operates the Workers' Compensation Appeals Board (WCAB), maintains the medical provider network system, and administers the Return-to-Work Supplement Program. The DWC Administrative Director has the authority to audit any claims administrator at any time and to impose civil penalties of up to $100,000 per audit for patterns of violations. Unlike the DOI, which regulates insurers generally, the DWC regulates workers' compensation claims administration specifically. Every self-insured employer, insurance carrier, and third-party administrator handling California workers' compensation claims is subject to DWC audit authority. The DWC publishes audit results publicly, and a poor audit record can affect an insurer's reputation and business relationships.

---

### CCR 10101 — Claim File Contents

> **"The claim file maintained by the claims administrator shall contain, at a minimum, the following: all documents relating to the claim, all notes and communications regarding the claim, the basis for all decisions made regarding the claim, and a history of benefits paid and reserves established."**
> — Cal. Code Regs., tit. 8, section 10101

**Tier 1 (Dismissable):** This regulation specifies the minimum contents of a workers' compensation claim file. "Claims administrator" means whoever is administering the claim — the insurer, the TPA, or the self-insured employer. "At a minimum" means the regulation sets a floor, not a ceiling. Your file must contain at least the items listed, but your employer may require additional items. The claim file is the single source of truth for everything that has happened on a claim. During a DWC audit, the auditor reviews your claim file to determine whether the claim was handled correctly. If documentation is not in the file, it does not exist for audit purposes. This regulation works in tandem with DOI regulation 10 CCR 2695.3 (file and record documentation) — both require complete documentation, but CCR 10101 specifies the minimum contents specific to workers' compensation files.

**The Authority:** Cal. Code Regs., tit. 8, section 10101; adopted under authority of Cal. Lab. Code sections 129, 129.5, and 133

**The Standard — What This Means in Practice:**
Your claim file must contain, at minimum: (1) the DWC-1 claim form and employer's first report of injury; (2) all medical reports and records related to the claim; (3) all correspondence — letters sent and received, including emails; (4) all investigation documentation — statements, sub rosa reports, index bureau results; (5) diary and activity notes documenting every action taken on the claim, including phone calls and meetings; (6) the written basis for every determination — accept, deny, set reserves, authorize or deny treatment; (7) copies of all benefit notices and denial letters sent to the claimant; (8) payment history — every payment made, with date, amount, and benefit type; (9) reserve history — every reserve amount set or changed, with date and rationale; (10) any attorney correspondence (applicant's attorney and defense counsel). The file must be organized chronologically or in a logical indexing system that allows an auditor to find any specific item efficiently.

**The Consequence — What Happens If You Don't:**
During a DWC audit, the auditor reviews each sampled claim file against the CCR 10101 requirements. Missing items are cited as violations. Under CCR 10108, penalties are assessed based on the severity and frequency of violations. A claim file missing its determination rationale is a more serious finding than one missing a single diary note — but both are citable. If a significant number of files in the audit sample are incomplete, the finding escalates from individual violations to a systemic deficiency, which can trigger corrective action requirements and increased penalty assessments. Civil penalties under Labor Code section 129.5 can reach up to $100,000 per audit for patterns of violations. Additionally, incomplete files make it difficult to defend claims handling decisions if they are challenged in litigation before the WCAB.

**The Common Mistake:**
An examiner maintains a thorough paper file but does not consistently transfer items to the electronic claims management system. The auditor requests files electronically. The electronic file is missing half the documentation — not because the examiner did not do the work, but because the examiner did not keep the system of record current. Many claims operations have moved to paperless environments where the electronic file is the official claim file. If your employer uses an electronic system, that system must contain the complete file. A paper folder in your desk drawer does not satisfy CCR 10101 if the electronic system is the designated system of record.

**AdjudiCLAIMS Helps You By:**
Every document uploaded to AdjudiCLAIMS is automatically classified, indexed, and stored in the claim file. The document classification system categorizes each item (medical report, correspondence, legal document, etc.), creating an organized, searchable file structure. The audit trail logs all actions taken on the claim within the system. The claim chronology provides a time-ordered view of all file contents. These features create a file that meets or exceeds the CCR 10101 minimum requirements for all activity that occurs within the system.

**You Must:**
Ensure that activity occurring outside AdjudiCLAIMS is also documented in the claim file. If you have a phone conversation, add a diary note. If you receive a paper document, scan and upload it. If you make a decision, document the reasoning. AdjudiCLAIMS builds the file structure; you must ensure completeness. The system cannot capture what it does not know about.

**Escalation Trigger:**
If you inherit a claim file from another examiner and discover that it is significantly incomplete — missing investigation documentation, no determination rationale, gaps in the payment history — notify your supervisor immediately. Do not attempt to reconstruct the file from memory or assumption. Your supervisor must determine the appropriate remediation, which may involve contacting the previous examiner, conducting supplemental investigation, or documenting the gaps.

---

### CCR 10102 — Retention of Claim Files

> **"Every claims administrator shall retain claim files and claim logs for a minimum of five years after the date of final disposition of the claim."**
> — Cal. Code Regs., tit. 8, section 10102

**Tier 1 (Dismissable):** "Retention" means how long you must keep the file after the claim is closed. "Final disposition" means the claim is completely resolved — all benefits have been paid, all disputes have been settled, and the claim is closed with no further activity expected. Five years is the minimum. Some employers and insurers maintain longer retention periods as a business practice, and some claims (particularly those involving permanent total disability or death benefits) may have obligations that extend well beyond five years. This regulation applies to the full claim file — all documents, all notes, all payment records. You cannot selectively destroy parts of a file while retaining others. When the retention period expires, the claims administrator may dispose of the file, but many choose to retain files longer for litigation protection.

**The Authority:** Cal. Code Regs., tit. 8, section 10102; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
From the date a claim reaches final disposition — the last payment is made, the last order is issued, the settlement is approved and all payments are disbursed — the five-year clock starts. During those five years, the complete claim file must be maintained and available for production if requested by the DWC. "Available" means accessible within a reasonable time — you cannot store files in a way that makes them effectively irretrievable. Electronic files must be maintained in a format that remains readable; if your claims management system is replaced during the retention period, the data must be migrated or otherwise preserved. Physical files must be stored in a secure location that protects against fire, flood, and unauthorized access.

**The Consequence — What Happens If You Don't:**
Premature destruction of claim files is a serious violation. If the DWC requests a file during an audit and it has been destroyed before the retention period expired, the claims administrator faces penalties for both the destruction and the inability to demonstrate compliance with the underlying claims handling regulations. The auditor cannot verify compliance without the file, so the assumption shifts against the claims administrator. Beyond regulatory penalties, premature destruction of files can constitute spoliation of evidence if the claim is later reopened — an injured worker has the right to petition to reopen a claim for new and further disability within five years of the original injury date (Labor Code section 5410), and the claims administrator must be able to produce the file.

**The Common Mistake:**
A TPA loses a client — the insured employer moves to a different TPA. The departing TPA assumes that the new TPA will maintain the files going forward and disposes of its copies after three years. But the five-year retention obligation belongs to the claims administrator who administered the claim, not the current administrator. The departing TPA violated CCR 10102 by disposing of files before the five-year period expired. Additionally, during the transition, some files were incompletely transferred — the new TPA has only partial files. Now neither the old TPA (files destroyed) nor the new TPA (files incomplete) can produce complete files for audit.

**AdjudiCLAIMS Helps You By:**
All claim data stored in AdjudiCLAIMS is maintained with immutable audit trails and automated retention tracking. The system flags claims approaching final disposition and tracks the five-year retention clock. Electronic file storage ensures files remain accessible and searchable throughout the retention period and beyond. The compliance reporting feature can generate a retention status report showing which files are within the retention period and which are approaching expiration.

**You Must:**
Follow your employer's file retention policies, which may exceed the five-year minimum. Do not delete or destroy any claim file or any part of a claim file without authorization from your supervisor and confirmation that the retention period has expired. If you are transferring files to another claims administrator or transitioning systems, ensure that complete files are transferred and that the retention obligation is clearly assigned.

**Escalation Trigger:**
If you discover that claim files have been destroyed or are missing before the retention period expired, notify your supervisor and your employer's compliance officer immediately. This is a serious regulatory exposure that may require self-reporting to the DWC. If you are aware of a system migration or TPA transition that may affect file retention, raise the retention requirement proactively before the transition occurs.

---

### CCR 10103 — Claim Log Contents and Maintenance

> **"Every claims administrator shall maintain a claim log for each claim, which shall contain a record of all transactions relating to the claim, including but not limited to the date and type of each action taken, the identity of the person taking the action, and the basis for each action."**
> — Cal. Code Regs., tit. 8, section 10103

**Tier 1 (Dismissable):** The "claim log" is distinct from the "claim file." The claim file (CCR 10101) contains all the documents — medical records, letters, reports. The claim log is an activity record — a chronological list of every action taken on the claim, by whom, and why. Think of the claim file as the library and the claim log as the card catalog. In many electronic claims management systems, the claim log is the "notes" or "diary" section where examiners record their actions. The log must be maintained as activity occurs — not reconstructed later from memory. Each entry must include the date, what was done, who did it, and the reason. An auditor reviews the claim log to understand the narrative of the claim: what happened, when, and why.

**The Authority:** Cal. Code Regs., tit. 8, section 10103; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
Every time you take an action on a claim, it should be logged: phone calls made or received, letters sent, documents received and reviewed, decisions made, payments authorized, reserves changed, referrals to counsel, supervisor reviews. Each log entry includes: (1) the date and time, (2) what action was taken, (3) who took the action (your name or identifier), and (4) the reason or basis for the action. The log should be contemporaneous — entries made at or near the time the action occurs. A claim log that shows a dense cluster of entries all dated on the same day for actions that clearly occurred over weeks is a red flag to auditors. The log must be legible and organized chronologically.

**The Consequence — What Happens If You Don't:**
An incomplete or absent claim log is a violation cited during DWC audits under CCR 10108. The claim log is how auditors reconstruct the examiner's handling of the claim without needing to read every document in the file. If the log is incomplete, the auditor must spend more time on the file — and missing entries raise questions about whether the actions were actually taken. A claim file with complete documents but no log is still deficient. A claim file with a thorough log but missing documents is also deficient, but differently — the log at least shows the examiner was working the file. Both standards must be met, but a good log demonstrates good faith handling even when documents are missing, while a poor log suggests inattention regardless of file completeness.

**The Common Mistake:**
An experienced examiner handles claims efficiently but considers diary notes to be "busywork." The examiner makes phone calls, reviews medical records, makes determinations — but logs only major events (payments, denials) and skips routine activity. During an audit, the file shows a 14-day gap between proof of claim receipt and the first diary entry. The examiner was actively working the claim during those 14 days — making calls, reviewing records — but none of it was logged. The auditor sees inactivity. The 14-day gap looks like a delayed investigation start, which is a violation of both 10 CCR 2695.5(e) and CCR 10109. The examiner's word alone cannot cure the documentation gap.

**AdjudiCLAIMS Helps You By:**
The audit trail automatically logs every system action: document uploads, classification events, summary generation, chat interactions, deadline tracking activity, and all system-initiated actions. This automated logging creates a base layer of claim log activity that captures all work performed within the system. The audit trail records the date, time, user, and action type for every event, providing the framework that CCR 10103 requires.

**You Must:**
Supplement the automated log with entries for activity that occurs outside the system. Phone calls, in-person meetings, observations, professional judgments, and the reasoning behind decisions must be manually logged by you. The system captures the "what" for in-system activity; you must capture the "why" for all activity and the "what" for out-of-system activity. Make diary entries contemporaneously — when the action occurs, not at the end of the week.

**Escalation Trigger:**
If you realize you have fallen behind on claim log entries and have a backlog of undocumented activity, notify your supervisor. It is better to disclose the gap and develop a plan to catch up than to have the gap discovered during an audit. Do not fabricate backdated entries — entering a note today with today's date explaining what occurred on a prior date is acceptable and honest; entering a note today with a false prior date is not.

---

### CCR 10104 — Annual Report of Inventory

> **"Every claims administrator shall submit an annual report of its claims inventory to the Administrative Director, on a form prescribed by the Administrative Director, at such times and containing such information as the Administrative Director may require."**
> — Cal. Code Regs., tit. 8, section 10104

**Tier 1 (Dismissable):** This regulation requires your employer — the claims administrator — to report to the DWC once a year on its claims inventory. "Claims inventory" means the total number of open claims, broken down by categories specified by the DWC. This is an organizational obligation, not something individual examiners file. However, the data for the annual report comes from individual claim files, so accurate data in your files directly affects the accuracy of the report. If your files do not accurately reflect claim status (open, closed, pending), the annual report will be inaccurate. The DWC uses annual inventory data for planning purposes, including targeting audits. An unusually high volume of open claims relative to staff, or an unusual pattern in claim types, may trigger a closer look.

**The Authority:** Cal. Code Regs., tit. 8, section 10104; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
The claims administrator must compile and submit an accurate inventory of all open workers' compensation claims on an annual basis. The report typically includes: total number of indemnity claims, total number of medical-only claims, claims by status (open, closed, pending), claims by type (specific injury, cumulative trauma, death), and aggregate reserve and payment data. The data must be accurate as of the reporting date. This means that claim statuses in your system must be current — claims that have been resolved must be closed, and open claims must reflect their actual status. Individual examiners contribute to this report by maintaining accurate claim status data in their files.

**The Consequence — What Happens If You Don't:**
Failure to submit the annual report is a regulatory violation. Submission of an inaccurate report can trigger follow-up inquiries and may contribute to audit selection. The DWC uses inventory data in its risk-based approach to audit selection — claims administrators with anomalous data patterns are more likely to be selected for audit. If the annual report shows a disproportionately high volume of denied claims, for example, the DWC may target that administrator for a focused audit on denial practices. Inaccurate reporting can also indicate systemic problems with data management that would concern the DWC.

**The Common Mistake:**
An examiner settles a claim and the settlement is approved by the WCAB. The final payment is made. But the examiner forgets to close the claim in the system. The claim sits in "open" status for months or years. When the annual inventory report is compiled, this settled claim is counted as "open," inflating the administrator's inventory numbers. Multiplied across multiple examiners, this data hygiene problem distorts the entire report. It also creates a false impression of workload and resource needs, and it may attract DWC attention.

**AdjudiCLAIMS Helps You By:**
The regulatory deadline dashboard tracks claim status and alerts you when a claim appears to have reached final disposition but has not been formally closed. The compliance reporting feature can generate inventory snapshots at any time, allowing supervisors to verify data accuracy before the annual report is submitted. Automated status tracking reduces the risk of claims lingering in incorrect statuses.

**You Must:**
Keep your claim statuses current. When a claim is resolved — whether by acceptance and completion of benefits, denial that is not challenged, or settlement — close it in the system promptly. When a claim changes status (for example, from "accepted" to "settled"), update the status. Accurate claim status data is your contribution to the annual report.

**Escalation Trigger:**
If you discover a significant number of claims in your caseload that have incorrect statuses — open claims that should be closed, or closed claims that still have outstanding obligations — notify your supervisor. A data cleanup effort may be needed before the next annual report.

---

### CCR 10105 — DWC Auditing Authority

> **"The Administrative Director, or his or her designee, may, at any time and without advance notice, examine and audit the files and records of any claims administrator for the purpose of determining compliance with the requirements of the Labor Code and the regulations of the Administrative Director."**
> — Cal. Code Regs., tit. 8, section 10105

**Tier 1 (Dismissable):** The DWC Administrative Director has the legal authority to audit any claims administrator at any time. "Without advance notice" is significant — while the DWC typically provides notice before an audit (see CCR 10107), this regulation establishes that notice is not legally required. The DWC can show up unannounced if circumstances warrant. "Any claims administrator" means insurers, TPAs, and self-insured employers — all are subject to audit. The scope of the audit is broad: the DWC can examine any files and records for compliance with any Labor Code provision or DWC regulation. This regulation is the source of the DWC's audit power, and every other audit regulation (10106 through 10108) operates under this authority.

**The Authority:** Cal. Code Regs., tit. 8, section 10105; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
Every claim file you maintain may be selected for audit at any time. There is no "audit season" and no guaranteed safe period. This means your files must be audit-ready at all times — not just when you know an audit is coming. Audit readiness means: complete documentation (CCR 10101), current claim logs (CCR 10103), timely determinations (10 CCR 2695.7(b)), accurate benefit payments, and clear decision rationale for every action. The DWC's audit authority extends to all records, not just claim files — it includes claims procedures, training records, payment records, and any other documentation relevant to claims administration compliance.

**The Consequence — What Happens If You Don't:**
You cannot refuse a DWC audit or limit its scope. Obstructing, delaying, or failing to cooperate with a DWC audit is itself a violation subject to penalty. If files are not produced upon request, the auditor may infer non-compliance. Claims administrators who are found to be obstructing audits face escalated enforcement action, including referral to the DWC Administrative Director for formal proceedings. The reality is that audits happen whether you are ready or not — the only variable is how well your files perform when examined.

**The Common Mistake:**
A claims operation learns informally that a DWC audit may be coming and scrambles to "clean up" files before the auditors arrive. Examiners backdate diary entries, add missing documentation, and reconstruct decision rationale after the fact. This is worse than having imperfect files. If the auditor discovers that file entries were added or modified in the period immediately before the audit, it undermines the credibility of the entire file and may constitute obstruction. Audit preparation should be ongoing compliance, not a last-minute scramble.

**AdjudiCLAIMS Helps You By:**
The immutable audit trail ensures that all system activity is logged with accurate timestamps that cannot be altered after the fact. This protects you and your employer: the audit trail proves when actions were taken, eliminating any question of backdating. The compliance reporting feature provides real-time compliance metrics across your caseload, so you can identify and address compliance gaps before an audit, not because of one.

**You Must:**
Handle every claim as if it will be audited tomorrow — because it might be. Maintain complete files, current logs, and documented rationale for every decision. If you identify a compliance gap in one of your files, fix it now and document that you did so, with today's date. Do not wait for an audit to address known issues.

**Escalation Trigger:**
If you receive notice of a DWC audit (or learn that one is imminent), notify your supervisor immediately if they are not already aware. Do not modify files after receiving audit notice unless directed to do so by your compliance officer. If you are aware of significant compliance issues in your files, disclose them to your supervisor before the auditor finds them — proactive disclosure is treated more favorably than concealment.

---

### CCR 10106 — Random and Non-Random Audit Selection

> **"The Administrative Director may select claims administrators for audit on either a random or non-random basis. Non-random selection may be based upon, but not limited to, the number and nature of complaints received, the claims administrator's performance on prior audits, the claims administrator's annual report data, and any other information available to the Administrative Director."**
> — Cal. Code Regs., tit. 8, section 10106

**Tier 1 (Dismissable):** The DWC selects audit targets in two ways: random and non-random (also called "targeted"). Random audits are exactly what they sound like — any claims administrator can be selected regardless of its track record. Non-random audits are targeted based on risk indicators: complaints from injured workers, poor results on prior audits, anomalies in annual report data, or other intelligence available to the DWC. This means that maintaining good compliance reduces but does not eliminate your audit risk. A claims administrator with a perfect track record can still be randomly selected. Conversely, a claims administrator with multiple complaints and prior audit findings is significantly more likely to be targeted. The DWC does not publish its selection criteria in detail, but the regulation gives a clear sense of the factors considered.

**The Authority:** Cal. Code Regs., tit. 8, section 10106; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
The DWC maintains a risk-based audit selection methodology. Factors that increase the probability of being targeted for audit include: a high volume of complaints filed by injured workers or their attorneys with the DWC, audit findings from prior examinations that were not adequately corrected, anomalous data in annual inventory reports (unusually high denial rates, unusually long claim durations, unusually low benefit payments), and information from WCAB proceedings suggesting claims handling problems. Claims administrators with clean track records and low complaint volumes are still subject to random selection, but at a lower frequency. The practical implication is that every claim you handle contributes to your employer's overall audit profile.

**The Consequence — What Happens If You Don't:**
Poor claims handling generates complaints. Complaints trigger targeted audits. Targeted audits find violations. Violations generate penalties and corrective action plans. Corrective action failures trigger follow-up audits with enhanced scrutiny. This cycle is self-reinforcing. A claims administrator that enters the cycle of repeated targeted audits faces increasing regulatory pressure, escalating penalties, and reputational damage. Individual examiners whose claims files contribute disproportionately to audit findings face performance consequences. Conversely, consistent compliance reduces complaint volume, which reduces targeted audit risk.

**The Common Mistake:**
An examiner handles a claim poorly — slow response times, vague denial letter, incomplete investigation. The injured worker, frustrated, files a complaint with the DWC. The examiner's supervisor resolves the individual claim, but no one addresses the underlying handling patterns. Over the next year, three more complaints come in on the same examiner's files. The DWC, seeing multiple complaints from the same claims administrator, adds the administrator to the non-random audit list. The audit examines not just the complained-about files but a random sample of the administrator's entire inventory. The systemic issues in the examiner's caseload are now exposed across the board. A pattern that started with one poorly handled claim has become an enterprise-level regulatory event.

**AdjudiCLAIMS Helps You By:**
The compliance reporting feature tracks compliance metrics across your entire caseload and across the claims operation, identifying patterns that might attract audit attention before they generate complaints. The regulatory deadline dashboard prevents the kind of missed deadlines that lead to injured worker frustration and DWC complaints. The investigation checklist ensures that claims handling is thorough and documented, reducing the likelihood of complaints about incomplete investigation.

**You Must:**
Treat every claim as though the injured worker may file a complaint — because they can, at any time, and the DWC takes every complaint seriously. If an injured worker expresses frustration with the claims process, address their concern promptly and document your response. A resolved complaint is far better than an unresolved one that ends up at the DWC.

**Escalation Trigger:**
If you receive notice that the DWC has received a complaint about one of your claims, notify your supervisor immediately. If you become aware that multiple complaints have been filed against your claims operation within a short period, escalate to management — this pattern may indicate a systemic problem that needs to be addressed before a targeted audit is triggered.

---

### CCR 10107 — Notice of Audit; File Production

> **"When the Administrative Director elects to provide advance notice of an audit, such notice shall specify the claims files to be produced for audit and the date, time, and location for production. The claims administrator shall produce the specified claim files at the date, time, and location designated in the notice. Failure to produce claim files shall constitute a separate violation subject to penalty."**
> — Cal. Code Regs., tit. 8, section 10107

**Tier 1 (Dismissable):** When the DWC decides to give you advance notice of an audit (which it usually does, though it is not required to), the notice will tell you exactly which claim files the auditors want to review. You must produce those files — completely and on time. "Produce" means make the full, unaltered file available to the auditor at the specified location. You cannot redact, withhold, or selectively produce parts of a file. If the notice says "produce files A, B, C, D, and E by March 15," all five complete files must be available on March 15. Failure to produce each file is a separate violation — so failing to produce all five files is five violations, each subject to its own penalty.

**The Authority:** Cal. Code Regs., tit. 8, section 10107; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
When an audit notice arrives, your compliance team or supervisor will coordinate file production. As an examiner, your responsibility is to ensure your claim files are complete and accessible. If you maintain files partly in the electronic system and partly in physical form, both must be compiled for production. If an audit notice requests a file you are actively working on, the file must still be produced — you do not get to delay production because the claim is in process. The files must be produced as they exist, not as you wish they existed. This means no adding missing documentation, no backdating entries, and no altering the file content between receipt of the audit notice and production.

**The Consequence — What Happens If You Don't:**
Each file not produced is a separate violation under CCR 10108, subject to civil penalty. If files are produced late, incomplete, or altered, the consequences are more severe — the auditor may cite the production failure and draw negative inferences about the missing or altered content. Altered files are a particularly serious matter: if an auditor determines that a file was modified after the audit notice was received, the finding shifts from "compliance issue" to "obstruction," which the DWC treats as a deliberate violation warranting enhanced penalties. In extreme cases, obstruction of a DWC audit can be referred for investigation as an unfair business practice.

**The Common Mistake:**
An examiner receives word that an audit notice includes three files from their caseload. The examiner realizes that one file is missing the written denial rationale — the examiner made the denial decision verbally with the supervisor but never documented it in the file. The examiner quickly writes up the denial rationale and adds it to the file, dated as of today. This is the correct approach — adding a missing note with today's date that explains what occurred is honest supplementation. But some examiners backdate the entry to make it look contemporaneous with the original denial. If the auditor detects the backdating (and auditors are experienced at this), the finding becomes far worse than the original missing note.

**AdjudiCLAIMS Helps You By:**
The immutable audit trail logs every action with tamper-proof timestamps. When files must be produced for audit, the system can generate a complete, chronologically ordered file export that includes all documents, all log entries, and the full audit trail. Because the audit trail is immutable, it provides credible evidence of when actions were taken and prevents any appearance of post-notice file manipulation. The compliance reporting feature can identify which files in your caseload have potential compliance gaps, allowing you to address issues proactively — before an audit notice arrives, not after.

**You Must:**
Keep your files complete at all times so that production is simply a matter of compiling what already exists. If you receive word that your files have been selected for audit, do not alter them. If you discover a gap in a file after receiving audit notice, consult your supervisor and compliance officer before adding anything. Adding a truthful, current-dated note is generally acceptable; altering or backdating is never acceptable.

**Escalation Trigger:**
If you receive an audit notice and cannot locate a file, or if you discover a significant deficiency in a file that has been selected for audit, notify your supervisor and compliance officer immediately. Do not attempt to resolve the situation independently. Audit production is a compliance-team function, and your supervisor needs to be aware of any issues before the auditor is.

---

### CCR 10108 — Audit Violation Rules and Penalties

> **"The Administrative Director may assess civil penalties against a claims administrator for any violation of the Labor Code or the regulations of the Administrative Director found during an audit. Penalties shall be assessed based on the severity of the violation, the number of violations, and whether the violations indicate a pattern or practice of non-compliance."**
> — Cal. Code Regs., tit. 8, section 10108

**Tier 1 (Dismissable):** This is the penalty regulation — it tells you what happens when the DWC finds violations during an audit. The DWC Administrative Director can impose civil penalties (fines) for every violation found. The penalty amount depends on three factors: (1) how serious the violation is, (2) how many violations were found, and (3) whether the violations show a pattern. A single missed deadline on one file is treated differently than the same missed deadline on fifteen files. An isolated documentation gap is treated differently than a systematic failure to document denial rationale across the entire caseload. The maximum penalty under Labor Code section 129.5 is $100,000 per audit, but individual violation penalties are assessed per file, which can add up quickly across a sample.

**The Authority:** Cal. Code Regs., tit. 8, section 10108; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
Violations found during audit are categorized by severity: (1) documentation violations (missing notes, incomplete files) are typically lower severity; (2) timeline violations (missed deadlines, late payments) are moderate severity; (3) substantive violations (denials without investigation, failure to pay benefits when due) are higher severity; (4) systemic violations (patterns affecting multiple files) are the highest severity. Penalties escalate with frequency — an administrator with one file showing a late acknowledgment faces a smaller penalty than one with twelve files showing late acknowledgments. Pattern findings — where the same violation appears in a significant percentage of sampled files — trigger the highest penalty levels and may result in corrective action plans, increased reporting requirements, and follow-up audits. Prior audit history matters: a first-time finding is treated differently than a repeated finding that the administrator was previously warned about.

**The Consequence — What Happens If You Don't:**
Civil penalties are assessed per violation, per file. For a standard DWC audit that examines 50-100 files, even a moderate violation rate can generate significant penalty exposure. Beyond the financial penalties, audit findings become part of the administrator's permanent DWC record and influence future audit selection (CCR 10106). Repeated poor audit results can lead to increased regulatory scrutiny, more frequent audits, mandatory corrective action plans, and in severe cases, referral to the DOI for action against the insurer's license. For individual examiners, files that generate audit findings often lead to performance reviews, additional training requirements, or caseload adjustments.

**The Common Mistake:**
A claims administrator receives an audit report showing violations in 15% of sampled files. Management views this as "not great but not terrible" and addresses the individual file issues without investigating the root cause. The next audit, two years later, finds the same violations at the same rate. The DWC now treats this as a "pattern or practice of non-compliance" — the administrator was aware of the issues, received the findings, and failed to correct the underlying causes. Penalties on the second audit are significantly higher, and a corrective action plan is imposed. The correct response to the first audit was to investigate why 15% of files had violations, implement systemic corrections (training, process changes, oversight), and verify effectiveness before the next audit.

**AdjudiCLAIMS Helps You By:**
The compliance reporting feature monitors your caseload for the specific violations that DWC auditors look for: missed deadlines, incomplete files, missing denial rationale, late payments, and documentation gaps. By identifying these issues in real time — not after an audit finds them — you can address violations before they become audit findings. The regulatory deadline dashboard prevents timeline violations by alerting you to approaching deadlines. The contextual education system (this specification) ensures you understand what constitutes a violation and why it matters.

**You Must:**
Take audit findings seriously and implement corrections. If an audit identifies violations in your files, understand the root cause — not just the specific files cited, but why the violations occurred. Were you undertrained? Overloaded? Using an incorrect process? Address the cause, not just the symptom. If your employer implements corrective actions based on audit findings, follow them consistently.

**Escalation Trigger:**
If you receive feedback that your claim files contributed to audit findings, request a meeting with your supervisor to understand the specific violations and develop a corrective plan. If you believe the violations were caused by systemic issues (understaffing, inadequate training, system limitations) rather than individual performance, communicate that to your supervisor — the corrective action needs to address the actual root cause.

---

### CCR 10109 — Duty to Investigate; Duty of Good Faith

> **"Every claims administrator shall conduct a good faith investigation of each claim. The investigation shall be commenced promptly upon receipt of a claim and shall include all reasonably obtainable evidence. The claims administrator shall not deny a claim until the claims administrator has conducted a reasonable investigation of the claim."**
> — Cal. Code Regs., tit. 8, section 10109

**Tier 1 (Dismissable):** This is the DWC's version of the investigation and good faith requirement. While DOI regulation 10 CCR 2695.7(a) sets the "thorough, fair, and objective" standard for investigation, CCR 10109 adds the DWC's emphasis: (1) the investigation must begin promptly, (2) it must include all reasonably obtainable evidence, and (3) you cannot deny a claim until you have completed a reasonable investigation. Note the word "reasonably" — you are not required to obtain every piece of evidence that theoretically exists, but you must obtain what is reasonably available. If a medical record is available from a treating physician and you did not request it before denying the claim, that is a violation. If a medical record exists at a provider in another state whom you had no reason to know about, its absence from your file is not a violation. The duty of good faith under CCR 10109(b) mirrors the DOI standard: handle claims fairly and honestly, without bias or prejudice.

**The Authority:** Cal. Code Regs., tit. 8, section 10109; adopted under authority of Cal. Lab. Code sections 129 and 129.5

**The Standard — What This Means in Practice:**
Upon receiving a workers' compensation claim, you must promptly begin investigating the facts. A reasonable investigation for a standard specific-injury claim typically includes: (1) obtaining the employer's first report of injury and employee claim form; (2) contacting the injured worker (or their attorney if represented) to gather their account; (3) contacting the employer for a supervisor's statement and any witness information; (4) requesting medical records from the treating physician; (5) running index bureau checks for prior claims; (6) reviewing any available surveillance or incident reports; and (7) evaluating the collective evidence to determine compensability. For complex claims (cumulative trauma, multiple body parts, disputed employment), additional investigation is required. The investigation must be complete before you deny a claim — you cannot deny first and investigate later. For claim acceptance, you may accept based on initial evidence and continue investigating to develop the file, particularly when the Labor Code requires benefits to commence before investigation is complete (as with LC 4650).

**The Consequence — What Happens If You Don't:**
A denial issued without a reasonable investigation is per se unreasonable under both DWC and DOI standards. During a DWC audit, the auditor reviews each denial in the sample to determine whether a reasonable investigation preceded it. If the file shows a denial letter but no evidence of investigation — no statements obtained, no medical records reviewed, no employer contacted — the auditor cites a CCR 10109 violation for failure to investigate and a CCR 10108 penalty applies. This violation also exposes the insurer to bad faith claims and, in the workers' compensation context, to WCAB penalties under Labor Code section 5814 for unreasonable delay or refusal to pay benefits. The injured worker's attorney can use the audit finding as evidence of bad faith in WCAB proceedings.

**The Common Mistake:**
An examiner receives a cumulative trauma claim for bilateral carpal tunnel syndrome from a data entry clerk with 15 years of tenure. The examiner reviews the initial medical report, which states "probable industrial causation," and the employer's report, which notes the claimant's repetitive keyboard use. The examiner denies the claim, writing: "Denied — medical evidence insufficient to establish industrial causation." But the examiner never contacted the injured worker for a statement about their work duties and symptom history. The examiner never obtained prior employment records to evaluate exposure at previous employers. The examiner never requested a QME evaluation to resolve the causation question. The medical report actually supported the claim, and the examiner's stated basis for denial ("insufficient evidence") is contradicted by the evidence in the file. This denial fails on multiple levels: the investigation was incomplete, the denial basis was inaccurate, and the good faith standard was not met.

**AdjudiCLAIMS Helps You By:**
The investigation checklist is calibrated to the claim type — a cumulative trauma claim generates a different checklist than a specific-injury claim, reflecting the different investigation requirements. The document summary engine provides clear, cited summaries of medical evidence so you can accurately assess what the evidence actually says, rather than drawing incorrect conclusions from partial reads. The claims chat (UPL-filtered) can answer factual questions about the evidence in your file: "What did the treating physician say about causation?" helps you verify that your understanding of the evidence is correct before you make a determination.

**You Must:**
Conduct a reasonable, good faith investigation before making any determination. Do not deny a claim until you have reviewed all reasonably obtainable evidence. Do not accept a claim without at least a basic investigation to confirm the facts. When reviewing evidence, read it objectively — do not look for reasons to deny, and do not ignore evidence that complicates the claim. Your job is to determine the truth, not to achieve a particular outcome. Document every step of your investigation in the claim file and claim log.

**Escalation Trigger:**
If your investigation reveals facts that create a genuine dispute about compensability — for example, conflicting medical opinions on causation, disputed accounts of how the injury occurred, or evidence suggesting the injury may not be industrial — consult your supervisor before making a determination. If the dispute involves a legal question (such as the applicability of apportionment, the statute of limitations, or the AOE/COE standard), escalate to defense counsel. A reasoned decision to deny is compliant; a reflexive denial without adequate investigation is not.

---

*End of Parts 2 and 3. Parts 4 and 5 (California Labor Code and WCAB Rules) are specified in a separate section of this document.*
<!-- AdjudiCLAIMS Contextual Regulatory Education Spec -->
<!-- Parts 4-7 -->
<!-- Written for: Brand-new claims examiners with zero WC knowledge -->
<!-- Progressive disclosure: Tier 1 (dismissable) + Tier 2 (always present) -->

---

## Part 4: Labor Code -- Benefits Payment Obligations

**Tier 1 (Dismissable):**
This is the heart of your job. When a worker is injured on the job, the employer (through its insurance carrier) owes the worker specific benefits. These benefits are not optional and they are not negotiable -- they are mandated by the California Labor Code. As a claims examiner, you are the person responsible for making sure these payments go out correctly, on time, and in the right amount. This Part covers the three pillars of your payment obligations: (1) medical treatment, (2) temporary disability indemnity (wage replacement), and (3) the rules that govern how much, how often, and for how long. Every dollar you pay -- or fail to pay -- is governed by specific statutes. Every deadline you miss carries specific penalties. There is no grace period, there is no "I didn't know," and there is no discretion to withhold benefits that the law says must be paid.

**Key Terms You Need to Know:**

- **TD (Temporary Disability)** -- Wage replacement payments made to an injured worker while they are recovering and cannot work, or cannot work at full capacity. Think of it as: the worker is temporarily unable to earn their normal wages because of the injury, so the insurer pays a portion of those lost wages until the worker either returns to work, reaches maximum medical improvement, or hits the statutory cap.

- **AWE (Average Weekly Earnings)** -- The worker's average weekly pay before the injury. This is the base number used to calculate the TD rate. It is not just the worker's hourly wage times 40 -- it includes overtime, bonuses, and other compensation, and there are specific rules for how to calculate it depending on the worker's employment pattern.

- **MMI (Maximum Medical Improvement)** -- The point at which the treating physician determines that the worker's condition has stabilized and is not expected to improve substantially with further medical treatment. This does not mean the worker is "cured" -- it means the condition is as good as it is going to get. Once a worker reaches MMI, temporary disability ends and the claim shifts to evaluating permanent disability, if any.

- **MPN (Medical Provider Network)** -- An approved network of physicians and other healthcare providers that the insurer or employer has established for treating injured workers. The employer has the right to direct medical care through its MPN, but the network must meet specific adequacy and access requirements set by the DWC.

---

### LC 4600 -- Employer's Obligation to Provide Medical Treatment

> **The employer shall provide that which is reasonably required to cure or relieve the injured worker from the effects of the injury, including medical, surgical, chiropractic, acupuncture, and hospital treatment, nursing, medicines, medical and surgical supplies, crutches, and apparatuses, including orthotic and prosthetic devices and services.**
> -- Cal. Lab. Code Section 4600

**Tier 1 (Dismissable):**
This is the foundational medical treatment statute in California Workers' Compensation. In plain English: if a worker gets hurt on the job, the employer (through its insurer) must pay for all reasonable and necessary medical care to treat that injury. This is not limited to emergency care or a single doctor visit. It covers the full spectrum -- doctors, hospitals, surgery, physical therapy, medications, medical equipment, chiropractic care, acupuncture, and more. The obligation continues for as long as the injury requires treatment, which can be for the life of the claim.

**The Authority:** Cal. Lab. Code Section 4600

**The Standard -- What This Means in Practice:**
Medical treatment must be provided promptly when the employer knows or should know of a work injury. You may not delay or deny reasonable treatment because liability has not been formally accepted. During the first 30 days after the employer learns of the injury, the employer may direct treatment to a physician within its MPN or to a predesignated physician. After 30 days, the employee may treat with a physician of their choosing within the MPN. If the employer does not have an MPN, the employee has the right to choose their own treating physician after the initial 30-day period. The standard for what qualifies as "reasonably required" is governed by the Medical Treatment Utilization Schedule (MTUS), which is covered in Part 7 of this document.

**The Consequence -- What Happens If You Don't:**
Failure to provide reasonably required medical treatment can result in penalties under LC 5814 (up to 25% increase in the value of the benefit unreasonably delayed or denied), sanctions from the Workers' Compensation Appeals Board (WCAB), and potential exposure to bad faith claims. If an employee does not receive timely treatment and their condition worsens as a result, the insurer may be liable for additional medical costs, increased temporary disability, and potentially a higher permanent disability rating. The DWC Audit Unit specifically flags claims where medical treatment authorization is delayed beyond statutory timeframes.

**The Common Mistake:**
A new examiner receives a medical treatment request and thinks, "I haven't accepted liability on this claim yet, so I can't authorize treatment." This is wrong. The obligation to provide medical treatment begins when the employer has knowledge of a potential work injury, not when the claim is formally accepted. You must authorize up to $10,000 in treatment during the investigation period (per LC 4600(c)) regardless of whether you have made a final compensability determination.

**AdjudiCLAIMS Helps You By:**
Tracking treatment authorization requests against statutory deadlines, flagging requests that are approaching or past the required response window, matching requested treatment against MTUS guidelines to help you assess medical necessity, and maintaining a running total of treatment authorized during the liability investigation period against the $10,000 presumptive cap.

**You Must:**
Evaluate whether requested treatment is reasonably required to cure or relieve the effects of the industrial injury. You must exercise medical and claims judgment -- AdjudiCLAIMS surfaces the guidelines and deadlines, but you decide whether to authorize, modify, delay, or deny (through the UR process) the specific treatment request. You must also ensure treatment is being directed through the appropriate MPN channels.

**Escalation Trigger:**
Escalate to supervision or counsel when: (1) a treatment request exceeds $10,000 during the liability investigation period and compensability has not been determined, (2) an applicant attorney demands treatment outside the MPN and you are unsure whether the MPN notice was properly served, (3) a treating physician requests treatment that is significantly outside MTUS guidelines, or (4) the injured worker alleges the MPN does not have a provider of the required specialty within the access standards.

---

### LC 4600.3 -- Medical Provider Network (MPN) Requirements

> **Every employer or insurer providing medical treatment to injured employees may establish or modify a medical provider network for the purpose of providing medical treatment to injured employees.**
> -- Cal. Lab. Code Section 4600.3

**Tier 1 (Dismissable):**
A Medical Provider Network is the insurer's or employer's approved roster of doctors, specialists, hospitals, and other medical providers who are available to treat injured workers. Think of it like a managed care network, similar to an HMO or PPO in the group health world, except this one is specific to workers' compensation. The MPN must meet minimum standards for the number and type of providers, geographic accessibility, and the employee's right to choose among providers within the network. If the employer has a properly established MPN, injured workers must generally treat within the network (with certain exceptions). If the employer does not have an MPN, the employee has broader rights to choose their own physician.

**The Authority:** Cal. Lab. Code Section 4600.3; Cal. Code Regs., tit. 8, Sections 9767.1 through 9767.16

**The Standard -- What This Means in Practice:**
As a claims examiner, you must verify that your insurer or employer client has a valid, approved MPN before directing treatment. The MPN must be filed with and approved by the DWC Administrative Director. You must provide the injured worker with written MPN notification that includes instructions on how to access the network, a provider directory or website, and information about the employee's right to choose a provider within the MPN after the first visit (or after the first 30 days, depending on the situation). The MPN must include an adequate number of physicians in each specialty likely to be needed, and the physicians must be geographically accessible. The employee has the right to switch physicians within the MPN at any time. If the employee disputes the MPN treating physician's diagnosis or treatment recommendations, the employee has the right to obtain a second and third opinion within the MPN.

**The Consequence -- What Happens If You Don't:**
If the MPN was not properly established, not properly noticed to the employee, or does not meet adequacy standards, the employee may have the right to treat outside the network -- meaning you lose control over the direction of medical care, which can significantly increase claim costs. If you fail to provide proper MPN notification, the employee may treat with any physician and the insurer must pay. The DWC Audit Unit reviews MPN compliance and can impose penalties for failure to maintain adequate networks.

**The Common Mistake:**
A new examiner assumes the MPN is valid because "we've always used it" and sends the injured worker the standard MPN notification letter. But the MPN approval may have lapsed, the employer may not actually be covered under that MPN plan, or the MPN may not have a specialist in the required discipline within the required geographic radius. You must verify MPN applicability and adequacy for each claim, not rely on a blanket assumption.

**AdjudiCLAIMS Helps You By:**
Maintaining a registry of active MPN plans, verifying that the correct MPN notification has been sent and documenting the date of service, flagging when a claim requires a specialty that may not be adequately represented in the current MPN, and tracking the employee's position in the MPN selection process (initial treatment, transfer of care, second opinion, third opinion).

**You Must:**
Verify that the MPN is valid and applicable to the specific claim. Confirm that proper notification was provided to the injured worker. Monitor whether the employee has exercised their right to choose or change physicians within the MPN. Evaluate whether the MPN has adequate providers for the specific injury type. You make the judgment calls about MPN applicability -- the system tracks the administrative compliance.

**Escalation Trigger:**
Escalate when: (1) the injured worker or applicant attorney challenges the validity or adequacy of the MPN, (2) there is no provider of the required specialty within the MPN's geographic access standards, (3) you cannot confirm that proper MPN notification was served, or (4) the employee claims they were not properly informed of their MPN rights and is treating outside the network.

---

### LC 4610 -- Utilization Review Program Requirement

> **For all treatment requests on or after January 1, 2013, the insurer shall establish a utilization review process in compliance with this section and the Administrative Director's rules.**
> -- Cal. Lab. Code Section 4610

**Tier 1 (Dismissable):**
Utilization Review (UR) is the formal process by which the insurer evaluates whether a requested medical treatment is medically necessary. Every insurer in California Workers' Compensation must have a UR program. When a treating physician submits a Request for Authorization (RFA) for medical treatment, the UR process is triggered. The UR reviewer (who must be a licensed physician) evaluates the request against the Medical Treatment Utilization Schedule (MTUS) and other evidence-based medical guidelines. The reviewer can approve, modify, delay, or deny the request. This is one of the most regulated areas in California Workers' Compensation, with strict timelines and notification requirements covered in detail in Part 7 of this document.

**The Authority:** Cal. Lab. Code Section 4610; Cal. Code Regs., tit. 8, Sections 9792.6 through 9792.12

**The Standard -- What This Means in Practice:**
As a claims examiner, you must ensure that every Request for Authorization (RFA) from a treating physician is routed through your insurer's UR program within the required timeframes. You do not personally make the medical necessity determination -- that is done by the UR physician reviewer -- but you are responsible for making sure the process is initiated, tracked, and completed within regulatory deadlines. Prospective UR decisions (for treatment that has not yet been provided) must be made within 5 business days of receipt of the RFA. Retrospective UR decisions (for treatment already provided) must be made within 30 days. Concurrent UR decisions (for treatment in progress, such as an inpatient stay) require even faster turnaround. Failure to issue a timely UR decision results in the treatment being deemed authorized by operation of law.

**The Consequence -- What Happens If You Don't:**
If the UR decision is not issued within the required timeframes, the requested treatment is automatically authorized -- even if it would not have met medical necessity standards. Under LC 4610.5, penalties for UR violations range from $500 to $5,000 per violation. The DWC Audit Unit specifically targets UR timeliness, and patterns of late UR decisions can result in significant aggregate penalties. Additionally, if the insurer does not have a compliant UR program at all, the insurer may be unable to deny any treatment request, effectively giving the treating physician unlimited treatment authority.

**The Common Mistake:**
A new examiner receives an RFA from a treating physician and puts it in the "to review" pile, intending to look at it later. But the 5-business-day clock for prospective UR started the moment the RFA was received by the claims administrator -- not when the examiner personally reviews it. By the time the examiner gets to it, the deadline has passed and the treatment is authorized by operation of law, regardless of whether it was medically necessary. Another common mistake: the examiner tries to make the medical necessity determination themselves rather than routing the RFA through the UR process.

**AdjudiCLAIMS Helps You By:**
Automatically tracking the receipt date of every RFA and calculating the UR deadline, escalating RFAs that are approaching their deadline, providing a dashboard view of all pending UR decisions and their status, flagging when a UR decision is overdue (meaning treatment is deemed authorized), and connecting each RFA to the relevant MTUS guideline for reference.

**You Must:**
Ensure every RFA is promptly routed to the UR process. Monitor UR timelines. Communicate UR decisions to the treating physician, the injured worker, and the applicant attorney (if any) in the required format and within the required timeframes. You do not substitute your judgment for the UR physician's medical determination, but you are responsible for the administrative process that ensures UR happens on time and the results are properly communicated.

**Escalation Trigger:**
Escalate when: (1) a UR deadline is about to be missed and the UR vendor has not issued a determination, (2) the UR physician requests additional medical records or information and you are unsure whether this extends the UR timeline, (3) a treating physician or applicant attorney challenges the UR process or alleges the UR decision was not made by a properly licensed reviewer, or (4) a pattern of UR delays suggests a systemic issue with the UR vendor.

---

### LC 4650 -- Timing of First Temporary Disability Payment

> **If an injury causes temporary disability, the first payment of temporary disability indemnity shall be made not later than 14 days after the employer has knowledge of the injury and disability.**
> -- Cal. Lab. Code Section 4650

**Tier 1 (Dismissable):**
This is one of the most critical deadlines in your job as a claims examiner. When a worker is injured and cannot work (or cannot work at full capacity), they are entitled to Temporary Disability (TD) payments -- essentially wage replacement while they recover. The law says the very first TD payment must go out within 14 days of the employer learning about the injury and the resulting disability. Not 14 days from when you personally receive the claim file. Not 14 days from when you decide to accept the claim. Fourteen days from when the employer first knows. This is a hard deadline with an automatic penalty for missing it.

**The Authority:** Cal. Lab. Code Section 4650

**The Standard -- What This Means in Practice:**
The 14-day clock starts when the employer has "knowledge of the injury and disability." In practice, this is typically the date the employer receives the employee's claim form (DWC-1) or the date the employer otherwise learns that an employee was injured and is unable to work. You must identify this date on every claim and calculate the 14-day deadline from it. The first TD payment must be issued (not just processed, but issued) within that 14-day window. If the injured worker's physician certifies any period of disability -- even one day -- the TD obligation is triggered. You must pay even if the claim is still under investigation (see LC 4650(d) below).

**The Consequence -- What Happens If You Don't:**
Under LC 4650(c), if you miss the 14-day deadline, the payment automatically increases by 10%. This is a self-imposed penalty -- you do not need a judge to order it. You simply must add 10% to the late payment. This applies to the first payment and to any subsequent late payment. In addition to the 10% self-imposed increase, the WCAB can impose penalties under LC 5814 of up to 25% of the benefit amount for unreasonable delay, and the employee's attorney can seek attorney's fees under LC 5814.5. DWC audits specifically flag late initial TD payments.

**The Common Mistake:**
A new examiner receives a claim file and begins investigating. The investigation takes three weeks. The examiner thinks, "I can't pay TD until I've determined liability." This is wrong. LC 4650(d) (below) requires that you begin payments within 14 days even if liability has not been determined. The examiner has now missed the deadline and owes the 10% self-imposed penalty on the late payment. Another common mistake: the examiner calculates the 14-day deadline from the date they personally received the file, not from the date the employer first had knowledge of the injury.

**AdjudiCLAIMS Helps You By:**
Automatically calculating the 14-day deadline from the employer's date of knowledge, displaying a countdown timer on every claim where TD is potentially owed, alerting you when the deadline is approaching (at 7 days, 3 days, and 1 day remaining), calculating the correct TD rate based on AWE and current statutory minimums and maximums, and automatically applying the 10% self-imposed penalty when a payment is late so that you do not inadvertently underpay.

**You Must:**
Identify the employer's date of knowledge for every claim. Determine whether the injured worker has a period of certified disability. Calculate the correct TD rate. Issue the first TD payment within 14 days. Even if you believe the claim may not be compensable, you must initiate payment and can seek reimbursement later if the claim is ultimately denied. This is a judgment call about timing and process, not about whether to comply -- compliance is mandatory.

**Escalation Trigger:**
Escalate when: (1) you cannot determine the employer's date of knowledge and the 14-day deadline is approaching, (2) the employer disputes that they had knowledge of the injury on the date alleged, (3) the medical documentation is ambiguous about whether the worker is actually disabled (unable to work), or (4) the claim involves unusual employment arrangements (such as multiple employers or staffing agencies) where the identity of the responsible employer is disputed.

---

### LC 4650(b) -- Subsequent Temporary Disability Payments

> **Subsequent payments of temporary disability indemnity shall be made as due every two weeks.**
> -- Cal. Lab. Code Section 4650(b)

**Tier 1 (Dismissable):**
After you make that first TD payment, you cannot just stop and wait. The law requires that you continue making TD payments every two weeks (14 days) as long as the worker remains temporarily disabled. This creates a regular payment cadence -- like a payroll schedule, except the "paycheck" comes from the insurer, not the employer. Missing a subsequent payment triggers the same 10% self-imposed penalty as missing the first payment.

**The Authority:** Cal. Lab. Code Section 4650(b)

**The Standard -- What This Means in Practice:**
Once TD payments begin, you must establish a regular two-week payment cycle and maintain it without interruption as long as the worker remains eligible. This means you need a system for tracking when each TD payment is due and ensuring it is issued on time. Each payment covers the preceding two-week period of disability. If the worker's physician certifies ongoing disability, the payments must continue. If you are waiting for updated medical reports, that does not pause the payment obligation -- you must continue paying based on the most recent medical certification of disability until you have a valid basis to stop (see LC 4656 below).

**The Consequence -- What Happens If You Don't:**
Each late subsequent payment is subject to the same 10% self-imposed increase under LC 4650(c). If you miss multiple payments or establish a pattern of late payments, the WCAB can impose LC 5814 penalties (up to 25% increase), award attorney's fees under LC 5814.5, and the DWC Audit Unit can assess administrative penalties. A pattern of late TD payments on multiple claims can trigger a full audit of the claims administrator's operations.

**The Common Mistake:**
An examiner is paying TD on a claim but has not received updated medical reports from the treating physician. The examiner stops TD payments, reasoning that they "have no current medical support" for the disability. This is incorrect. You cannot unilaterally stop TD payments because you have not received updated medical reports. You must continue paying until you have an affirmative basis to terminate -- such as a medical release to return to work, MMI determination, or the statutory cap. The proper response to missing medical reports is to request them, not to stop payment.

**AdjudiCLAIMS Helps You By:**
Maintaining a TD payment schedule for every active claim, alerting you when a subsequent payment is due (at 3 days and 1 day before the due date), tracking which payments have been issued and which are pending, flagging claims where TD payments have stopped but no valid termination basis has been documented, and generating payment history reports that show your compliance with the two-week cadence.

**You Must:**
Maintain the two-week payment cadence. Document the basis for each payment. Monitor the medical evidence to confirm ongoing disability. If you believe TD should be terminated, you must have a valid statutory basis (see LC 4656) and follow proper procedures -- you cannot simply stop paying. Your judgment is required to evaluate evolving medical evidence, but the payment schedule is not discretionary.

**Escalation Trigger:**
Escalate when: (1) you have not received updated medical reports and the most recent disability certification is about to expire, (2) the treating physician provides conflicting information about the worker's ability to return to work, (3) the employer reports that the worker has been seen working elsewhere while receiving TD, or (4) you are unsure whether a specific medical status qualifies as a basis to terminate TD.

---

### LC 4650(c) -- Penalty for Late Payment (Self-Imposed 10% Increase)

> **If any indemnity payment is not made timely as required by this section, the amount of the late payment shall be increased 10 percent.**
> -- Cal. Lab. Code Section 4650(c)

**Tier 1 (Dismissable):**
This subsection is the enforcement mechanism for the TD payment deadlines. If you miss a deadline -- whether it is the initial 14-day deadline or any subsequent two-week payment -- the law automatically increases the late payment by 10%. You do not need a judge to tell you this. You do not need the injured worker or their attorney to demand it. It is self-executing: if the payment is late, you add 10%. Period. This is one of the few penalties in California Workers' Compensation that the claims examiner must impose on themselves.

**The Authority:** Cal. Lab. Code Section 4650(c)

**The Standard -- What This Means in Practice:**
Every time you issue a TD payment, you must evaluate whether it is timely. If it is late by even one day, you must add 10% to the payment amount. This is not discretionary. For example: if the TD payment is $1,000 and it is one day late, you pay $1,100. If you fail to add the 10% self-imposed increase, the injured worker's attorney will petition the WCAB for the penalty, and the WCAB will likely also impose additional penalties under LC 5814 for the unreasonable failure to self-impose the penalty. In short: you pay 10% now voluntarily, or you pay 10% plus 25% plus attorney's fees later. Always self-impose.

**The Consequence -- What Happens If You Don't:**
If you fail to self-impose the 10% increase on a late payment, you face compounding exposure: (1) the original 10% penalty still owed, (2) an additional LC 5814 penalty of up to 25% for unreasonably failing to pay the self-imposed increase, (3) attorney's fees under LC 5814.5, and (4) potential DWC audit penalties. The total exposure for a single late payment where you failed to self-impose the penalty can exceed 35% of the original payment amount. DWC auditors specifically check for proper application of the 10% self-imposed increase on late payments.

**The Common Mistake:**
A new examiner misses a TD payment deadline, realizes it is late, and issues the payment for the standard amount without adding the 10%. The examiner either does not know about the self-imposed increase requirement or thinks, "I'll deal with it if someone complains." Months later, the applicant attorney files a petition for penalties at the WCAB, and the examiner's failure to self-impose results in significantly higher penalties than the 10% would have been. Another mistake: the examiner adds the 10% but calculates it on the wrong base amount or applies it to the net payment rather than the gross payment.

**AdjudiCLAIMS Helps You By:**
Automatically detecting when a TD payment is issued after its due date, calculating the correct 10% self-imposed increase, flagging the payment for your review and confirmation before issuance, maintaining a record of all self-imposed increases for audit compliance, and generating reports showing late payment frequency and self-imposed penalty amounts.

**You Must:**
Know when each TD payment is due. If a payment is late, add 10% before issuing it. Document the reason for the late payment in the claim file. Do not wait to be asked -- the self-imposed increase is your obligation. Your judgment is required to determine the correct base amount for the 10% calculation and to document why the payment was late.

**Escalation Trigger:**
Escalate when: (1) you are unsure whether a payment qualifies as "late" (for example, if there is a dispute about the employer's date of knowledge), (2) a pattern of late payments on a caseload suggests a systemic issue that needs operational attention, or (3) an applicant attorney is claiming that additional penalties are owed beyond the 10% self-imposed increase.

---

### LC 4650(d) -- Payment Required During Liability Investigation

> **If liability for the claim is not rejected within 90 days after the filing of the claim form, the employer shall commence the payment of temporary disability indemnity not later than 14 days after the employer has knowledge of the injury and disability.**
> -- Cal. Lab. Code Section 4650(d)

**Tier 1 (Dismissable):**
This is the provision that confuses more new examiners than almost anything else in Workers' Compensation. Here is the plain English version: Even if you have not decided whether the claim is compensable, you must start paying TD within 14 days. You cannot use your investigation as an excuse to delay payment. The law creates a "pay first, investigate simultaneously" framework. If you ultimately determine the claim is not compensable, you can recover the payments -- but you cannot withhold them while you are making that determination. The only exception: if you issue a formal denial (rejection of liability) within 90 days.

**The Authority:** Cal. Lab. Code Section 4650(d)

**The Standard -- What This Means in Practice:**
When you receive a new claim, you have two parallel obligations: (1) investigate compensability, and (2) begin TD payments within 14 days if there is any evidence of disability. These two tracks run simultaneously. You do not need to complete the investigation before paying. You do not need to formally accept the claim before paying. You simply need to know that a worker claims to have been injured and a doctor says the worker cannot work. If those two conditions are met, the 14-day clock is running and you must pay. If your investigation subsequently reveals that the claim is not compensable, you issue a formal denial (within the 90-day investigation window) and can seek to recover any TD payments made during the investigation period. But you cannot hold payment while you investigate.

**The Consequence -- What Happens If You Don't:**
All the penalties discussed in LC 4650 and LC 4650(c) apply. If you delay the initial TD payment past 14 days because you were "still investigating," the payment is late and you owe the 10% self-imposed increase. If you delayed because you were waiting for compensability determination, the WCAB will find this unreasonable and may impose LC 5814 penalties. The law is explicit: investigation is not a defense to late payment. DWC auditors specifically flag claims where TD was delayed during the investigation period.

**The Common Mistake:**
This is the single most common mistake made by new claims examiners. The examiner receives a claim, opens an investigation, and holds all TD payments until the investigation concludes. The investigation takes 45 days. The examiner then accepts the claim and begins paying TD. But the first 31 days of TD payments (days 14 through 45) are now late, each subject to a 10% self-imposed increase. The examiner's entire initial TD payment is subject to penalty. This mistake is so common that DWC audit protocols specifically target "investigation delay" as a flagged pattern.

**AdjudiCLAIMS Helps You By:**
Displaying a prominent warning on every new claim: "TD payment due within 14 days regardless of compensability status." Tracking the 14-day deadline independently from the compensability investigation timeline. Showing the 90-day investigation window alongside the TD payment schedule so you can see both obligations simultaneously. Alerting you when a claim is approaching 90 days without a compensability determination.

**You Must:**
Initiate TD payments within 14 days even if you are still investigating the claim. Document that payments are being made pending investigation. If you determine the claim is not compensable, issue a timely denial and document the basis for seeking reimbursement of TD paid during the investigation period. This requires your professional judgment about risk: paying pending investigation is always safer than holding payment and incurring penalties, even if you believe the claim may ultimately be denied.

**Escalation Trigger:**
Escalate when: (1) you believe the claim is fraudulent and are uncomfortable paying pending investigation, (2) the 90-day investigation period is expiring and you have not made a compensability determination, (3) the employer is pressuring you to delay payment until investigation is complete, or (4) the medical evidence is ambiguous about whether the worker is actually disabled.

---

### LC 4653 -- Temporary Disability Rate Calculation

> **Temporary disability indemnity is two-thirds of the average weekly earnings of the injured employee, subject to the minimum and maximum amounts set forth in Sections 4453 and 4454.**
> -- Cal. Lab. Code Section 4653

**Tier 1 (Dismissable):**
This statute tells you exactly how much to pay in TD. The formula is straightforward: take the worker's Average Weekly Earnings (AWE), multiply by two-thirds (66.67%), and that is the weekly TD rate. But there are minimum and maximum limits. If two-thirds of the AWE falls below the statutory minimum, you pay the minimum. If it exceeds the statutory maximum, you pay the maximum. The minimum and maximum amounts are adjusted annually by the DWC. For 2026, the maximum TD rate is set by statute and adjusted based on the State Average Weekly Wage (SAWW). Getting this calculation right is fundamental -- an incorrect TD rate means every payment on the claim is wrong.

**The Authority:** Cal. Lab. Code Section 4653; Cal. Lab. Code Sections 4453 and 4454 (for min/max)

**The Standard -- What This Means in Practice:**
For every claim where TD is owed, you must: (1) calculate the worker's AWE using the methods prescribed in LC 4453 (which accounts for different earnings patterns such as regular hourly, seasonal, irregular, or concurrent employment), (2) multiply the AWE by 2/3, (3) compare the result to the current statutory minimum and maximum TD rates, and (4) pay the higher of the calculated amount or the minimum (but not more than the maximum). You must recalculate if the worker's earnings change or if you receive updated earnings information. The TD rate must be stated on the first benefit notice sent to the injured worker.

**The Consequence -- What Happens If You Don't:**
Underpayment of TD results in the same penalties as late payment -- the worker is owed the correct amount plus any applicable LC 5814 penalty (up to 25%) for unreasonable underpayment. Overpayment of TD creates a credit issue that can be complex to resolve, particularly if the worker has already spent the money. Incorrect AWE calculations are one of the most common findings in DWC audits and can result in administrative penalties. Systematic underpayment across a caseload can trigger a full audit of the claims administrator.

**The Common Mistake:**
A new examiner calculates AWE by simply looking at the worker's most recent paycheck and extrapolating a weekly amount. But the worker had overtime for the past three months, or the worker holds two jobs, or the worker is a seasonal employee whose earnings fluctuate significantly. The LC 4453 calculation methods account for these variations, and using the wrong method produces the wrong AWE, which produces the wrong TD rate, which means every payment on the claim is incorrect. Another common mistake: failing to update the TD rate when the statutory minimum or maximum changes on January 1.

**AdjudiCLAIMS Helps You By:**
Providing a step-by-step AWE calculator that walks you through the correct LC 4453 method based on the worker's employment pattern, automatically applying the current statutory minimum and maximum TD rates, recalculating the TD rate when statutory limits change, flagging when a manual AWE calculation may need review (such as when reported earnings are inconsistent with the employer's payroll records), and generating a detailed TD rate worksheet for the claim file.

**You Must:**
Gather complete earnings information from the employer. Select the correct AWE calculation method under LC 4453 for the worker's employment pattern. Verify the calculated TD rate against the current statutory minimums and maximums. Document your AWE calculation and the resulting TD rate in the claim file. The TD rate calculation requires your judgment when earnings are irregular, when there are disputes about what counts as "earnings," or when the worker has concurrent employment.

**Escalation Trigger:**
Escalate when: (1) the worker's earnings pattern is highly irregular and you are unsure which LC 4453 method to apply, (2) the employer and the worker disagree about the worker's pre-injury earnings, (3) the worker has concurrent employment and you are unsure how to combine earnings, or (4) the applicant attorney disputes your AWE calculation.

---

### LC 4654 -- Temporary Disability Aggregate Limit

> **Aggregate disability payments for a single injury occurring on or after January 1, 2008, causing temporary disability shall not extend for more than 104 compensable weeks within a period of two years from the date of commencement of temporary disability payment.**
> -- Cal. Lab. Code Section 4654

**Tier 1 (Dismissable):**
Temporary disability does not last forever. The law sets an outer boundary: a maximum of 104 compensable weeks (two years) of TD payments for a single injury. The two-year clock starts from the date of the first TD payment, not from the date of injury. Once the worker has received 104 weeks of TD within that two-year window, the TD benefit is exhausted -- even if the worker has not yet reached MMI. There are a few narrow exceptions for certain severe injuries (such as severe burns or hepatitis B/C), which can extend the cap to 240 weeks. But for the vast majority of claims, 104 weeks is the absolute maximum.

**The Authority:** Cal. Lab. Code Section 4654; Cal. Lab. Code Section 4656(c) (for exceptions)

**The Standard -- What This Means in Practice:**
You must track the total number of compensable weeks of TD paid on every claim. "Compensable weeks" means weeks for which TD was actually owed and paid -- if the worker returned to work for two months in the middle of the TD period, those two months do not count toward the 104-week cap. You must also track the two-year window from the date of the first TD payment. As the claim approaches either the 104-week cap or the two-year window, you must prepare for the transition from TD to either a return to work, a permanent disability evaluation, or other appropriate next steps. You must provide the injured worker with notice that TD benefits are about to exhaust.

**The Consequence -- What Happens If You Don't:**
If you continue paying TD beyond the 104-week cap (overpayment), you may not be able to recover the excess. If you terminate TD before the cap without a valid basis, you face the standard penalties for premature termination. If you fail to track the aggregate and the claim drifts past 104 weeks, you create an overpayment situation that is difficult to resolve and may result in criticism during a DWC audit. Conversely, if you terminate TD at 104 weeks without providing proper notice, you may face procedural challenges.

**The Common Mistake:**
An examiner tracks TD payments by calendar time rather than by compensable weeks. The worker was injured in January 2025, received TD for six months, returned to work for four months, then went back on TD. The examiner thinks, "It's been two years since the injury, so TD must be over." But the 104-week cap counts compensable weeks, not calendar time, and the two-year window runs from the first TD payment date, not the date of injury. The worker may still have weeks remaining. The reverse is also common: an examiner fails to count a period of partial TD as a "compensable week" and overpays.

**AdjudiCLAIMS Helps You By:**
Tracking the total compensable weeks of TD paid on every claim in real time, calculating the remaining weeks available under the 104-week cap, tracking the two-year window from the first TD payment date, providing advance notice at 90 weeks, 100 weeks, and 103 weeks that the cap is approaching, and flagging claims where the 104-week cap has been reached so you can initiate the appropriate transition.

**You Must:**
Accurately track compensable weeks versus calendar time. Understand the difference between the 104-week cap and the two-year window. Identify claims that may qualify for the extended 240-week cap under LC 4656(c). Prepare the transition plan as the TD benefit approaches exhaustion. Notify the injured worker and their attorney in advance. Your judgment is needed to correctly classify periods as compensable versus non-compensable and to manage the transition out of TD.

**Escalation Trigger:**
Escalate when: (1) you are unsure whether a period qualifies as "compensable" for purposes of the 104-week cap, (2) the claim may qualify for the 240-week exception and you need to verify the qualifying condition, (3) the injured worker has not reached MMI but the 104-week cap is about to be reached, or (4) there is a dispute about the correct start date for the two-year window.

---

### LC 4656 -- Temporary Disability Termination Conditions

> **Temporary disability payments shall be made until the employee's condition becomes permanent and stationary, the employee is released to return to work, or the statutory maximum is reached.**
> -- Cal. Lab. Code Section 4656

**Tier 1 (Dismissable):**
This statute tells you when you can stop paying TD. There are only three valid reasons: (1) the treating physician determines that the worker has reached Maximum Medical Improvement (MMI), also called "permanent and stationary" -- meaning the condition is as good as it is going to get, (2) the treating physician releases the worker to return to their usual and customary work (or the worker actually returns to work), or (3) the 104-week statutory cap under LC 4654 is reached. You cannot stop TD for any other reason without a valid legal basis. "I think the worker should be better by now" is not a valid basis. "The employer says the worker is exaggerating" is not a valid basis. Only the three statutory conditions.

**The Authority:** Cal. Lab. Code Section 4656

**The Standard -- What This Means in Practice:**
Before terminating any TD payment, you must document which of the three statutory conditions has been met. If the physician determines the worker is permanent and stationary, obtain the written medical report documenting this finding. If the physician releases the worker to return to work, obtain the written work status report and verify that the release is to the worker's usual and customary position (a release to modified duty does not necessarily end TD -- it may convert the claim to Temporary Partial Disability). If the 104-week cap is reached, verify your records. In all cases, send the injured worker a notice explaining why TD is being terminated.

**The Consequence -- What Happens If You Don't:**
Improper termination of TD is one of the most common bases for penalties in California Workers' Compensation. If you terminate TD without a valid basis, the WCAB will order retroactive TD payments plus a penalty of up to 25% under LC 5814, plus attorney's fees under LC 5814.5. If the worker has been without income during the improper termination period, the WCAB may view the delay as egregious and impose the maximum penalty. DWC audits specifically flag claims where TD was terminated without documented medical support.

**The Common Mistake:**
An examiner receives a report from the treating physician that says the worker "can return to modified work with restrictions." The examiner terminates TD, reasoning that the worker has been released to return to work. But a release to modified duty with restrictions is not the same as a release to the worker's usual and customary job. If the employer cannot accommodate the restrictions, the worker may be entitled to continued TD (or TPD -- Temporary Partial Disability). Another common mistake: the examiner stops TD because the employer says the worker has been seen out and about, without obtaining a medical determination supporting termination.

**AdjudiCLAIMS Helps You By:**
Requiring you to select one of the three statutory termination conditions before processing a TD termination, prompting you to upload the supporting medical documentation, flagging when a "return to work" release includes restrictions that may not match the worker's usual job duties, generating the required notification to the injured worker, and maintaining a complete termination history for audit compliance.

**You Must:**
Identify and document the specific statutory basis for terminating TD. Obtain and review the supporting medical evidence. Evaluate whether a "return to work" release matches the worker's actual job requirements. Send proper notice to the injured worker. Your judgment is critical here -- you must read the medical reports carefully, understand the difference between a full release and a modified release, and ensure that the termination basis is solid before you stop payment.

**Escalation Trigger:**
Escalate when: (1) the medical reports are ambiguous about whether the worker has reached MMI or can return to work, (2) the treating physician and a QME disagree about the worker's status, (3) the worker disputes the termination and files for a hearing, or (4) you believe the worker may be entitled to TD beyond the 104-week cap under one of the narrow exceptions.

---

---

## Part 5: Labor Code -- Medical-Legal Evaluation

**Tier 1 (Dismissable):**
Medical-legal evaluations are the formal process by which disputed medical questions in a Workers' Compensation claim are resolved by an independent physician. When the claims examiner and the injured worker (or their attorney) disagree about a medical issue -- such as whether the injury is work-related, how much disability exists, what treatment is needed, or whether the worker has reached MMI -- the dispute is resolved through a medical-legal evaluation, not through the opinions of the treating physician alone. California has a structured system for selecting the evaluating physician, and the rules differ depending on whether the injured worker is represented by an attorney. This Part covers the three key statutes that govern who does the evaluation and how they are selected.

**Key Terms You Need to Know:**

- **QME (Qualified Medical Examiner)** -- A physician who has been certified by the DWC Medical Unit to perform medical-legal evaluations in Workers' Compensation cases. QMEs must pass a competency exam, complete specific training, and maintain their certification. They are neutral -- they do not work for the insurer or the injured worker. When there is a medical dispute and the parties cannot agree on a doctor, the DWC assigns a panel of three QMEs, and the parties select one.

- **AME (Agreed Medical Examiner)** -- A physician whom both the insurer and the injured worker (through their attorney) mutually agree to use for a medical-legal evaluation. An AME does not need to be a DME-certified QME, although many are. The AME process is only available when the injured worker is represented by an attorney. It is generally preferred over the QME panel process because both sides have agreed to the evaluator, which often produces more accepted results.

- **IME (Independent Medical Examination)** -- A general term for a medical examination performed by a physician who is not the treating physician, for the purpose of providing an independent opinion on disputed medical issues. In California Workers' Compensation, the IME is formalized through the QME and AME processes described above. You may hear "IME" used informally, but the correct California terminology is QME or AME.

---

### LC 4060 -- QME Evaluation for Unrepresented Employees

> **When an employee who has no attorney is not satisfied with the opinion of the treating physician, the employee or the employer may request the assignment of a three-member panel of qualified medical evaluators.**
> -- Cal. Lab. Code Section 4060

**Tier 1 (Dismissable):**
When an injured worker does not have an attorney (is "unrepresented" or "pro per"), and there is a disputed medical issue, the QME panel process under LC 4060 is the exclusive method for resolving that dispute. Neither side can simply hire their own medical expert. Instead, the DWC Medical Unit assigns a panel of three QMEs from its roster, and the unrepresented employee selects one of the three to perform the evaluation. The QME's report is given great weight by the WCAB and often determines the outcome of the disputed issue. As a claims examiner, you must understand when a QME evaluation is triggered, how to request the panel, and what deadlines apply.

**The Authority:** Cal. Lab. Code Section 4060; Cal. Code Regs., tit. 8, Sections 31 through 31.9

**The Standard -- What This Means in Practice:**
A QME panel can be requested when there is a dispute about any medical issue: compensability (is the injury work-related?), the need for treatment, the nature and extent of disability, the worker's ability to return to work, or whether the worker has reached MMI. For unrepresented employees, the process is triggered when either the employee or the claims administrator objects to the treating physician's findings on one of these issues. You request the QME panel from the DWC Medical Unit by submitting a Panel Request Form (QME Form 105). The DWC issues a panel of three QMEs in the relevant medical specialty, and the unrepresented employee has the right to select one of the three. The evaluation must generally be completed within specific timeframes, and the QME's report becomes the primary medical-legal evidence in the case.

**The Consequence -- What Happens If You Don't:**
If you fail to timely request or respond to a QME panel request, you may waive your right to challenge the treating physician's opinion, which becomes the default medical evidence. If you interfere with the employee's right to select from the panel, you face sanctions from the WCAB. If you fail to provide the QME with the relevant medical records before the evaluation, the QME may issue an incomplete or unfavorable report. Delays in the QME process extend the life of the claim, increase costs, and frustrate all parties.

**The Common Mistake:**
A new examiner receives a treating physician's report that the examiner disagrees with -- perhaps the physician has found the injury compensable when the examiner believes it is not work-related. The examiner writes a letter to the treating physician disputing the opinion. But for an unrepresented employee, the proper mechanism to dispute the treating physician's opinion is the QME process, not correspondence with the treating doctor. The examiner has wasted time and may have missed the deadline to request a QME panel. Another mistake: the examiner requests a QME panel in the wrong medical specialty (for example, requesting an orthopedist when the primary dispute is a psychiatric injury).

**AdjudiCLAIMS Helps You By:**
Identifying when a medical dispute exists that triggers the QME process, generating the QME Panel Request Form (QME Form 105) with the correct dispute information, tracking the QME panel assignment and selection process, monitoring the timeline for the QME evaluation and report, and maintaining a checklist of medical records that should be sent to the QME before the evaluation.

**You Must:**
Identify disputed medical issues. Determine whether the employee is represented or unrepresented. If unrepresented, initiate the QME panel request process at the appropriate time. Compile and send all relevant medical records to the QME. Review the QME's report and determine its implications for the claim. Your judgment is required to identify which medical issues are genuinely in dispute and to select the appropriate medical specialty for the QME panel request.

**Escalation Trigger:**
Escalate when: (1) the unrepresented employee has obtained an attorney and the evaluation process needs to shift from QME to potential AME, (2) you disagree with the QME's findings and are considering whether to contest the report, (3) the QME panel does not include a specialist in the relevant medical area, or (4) the employee is not cooperating with the QME evaluation scheduling.

---

### LC 4061 -- QME Panel When No AME Agreement (Represented Employees)

> **If the employee is represented by an attorney and the parties have not agreed upon an agreed medical evaluator, either party may request assignment of a three-member panel of qualified medical evaluators.**
> -- Cal. Lab. Code Section 4061

**Tier 1 (Dismissable):**
When an injured worker has an attorney and the parties cannot agree on an AME (Agreed Medical Examiner), the fallback is the QME panel process -- similar to the unrepresented employee process, but with some key differences. In the represented context, both the claims examiner and the applicant attorney have the right to strike one QME from the three-member panel, and the remaining QME performs the evaluation. The QME panel process for represented employees is the backup mechanism -- the law prefers that represented parties use the AME process (LC 4062), but when they cannot agree, the QME panel is available.

**The Authority:** Cal. Lab. Code Section 4061; Cal. Code Regs., tit. 8, Sections 31 through 31.9

**The Standard -- What This Means in Practice:**
When a represented employee has a disputed medical issue and the parties cannot agree on an AME within the timeframes specified by law, either the claims examiner or the applicant attorney may request a QME panel from the DWC Medical Unit. The three-member panel is issued, and each side has the right to strike one QME. The remaining QME performs the evaluation. In practice, the parties often try to use the strike process strategically -- striking the QME they believe may be least favorable. You must understand the timeline for the AME negotiation process (typically 10 days to agree), after which the QME panel can be requested. You must also understand the strike process and the deadlines for exercising the strike.

**The Consequence -- What Happens If You Don't:**
If you fail to exercise your strike within the allowed timeframe, you lose the right to strike and the applicant attorney effectively controls the QME selection. If you fail to request a QME panel when the AME process has stalled, the medical dispute remains unresolved and the claim languishes. If you do not send the QME the relevant medical records, the evaluation may be incomplete or unfavorable. Delays in the medical-legal evaluation process are one of the most common causes of extended claim duration and increased costs.

**The Common Mistake:**
An examiner and an applicant attorney exchange AME proposals but cannot agree. The examiner assumes the attorney will request the QME panel. Weeks go by with no action. Meanwhile, the claim sits without a medical-legal evaluation, TD continues to accrue, and the insurer is exposed to increased costs. Either side can request the QME panel -- you should not wait for the attorney to do it. Another mistake: the examiner receives the QME panel and exercises the strike immediately without researching the three QMEs. Taking the time to review the QMEs' qualifications, specialties, and track records (to the extent available) before striking is an important strategic step.

**AdjudiCLAIMS Helps You By:**
Tracking the AME negotiation timeline and alerting you when the deadline to agree has passed, generating the QME panel request form when needed, presenting the QME panel members with available profile information to assist in the strike decision, tracking the strike deadline, and monitoring the evaluation timeline.

**You Must:**
Engage in good-faith AME negotiations. When AME negotiations fail, promptly request or respond to a QME panel request. Research the panel members before exercising your strike. Compile and send all relevant medical records to the selected QME. Review and act on the QME report. Your judgment is required at every step -- in the AME negotiation, the strike decision, and the evaluation of the QME's findings.

**Escalation Trigger:**
Escalate when: (1) you believe the applicant attorney is engaging in bad faith AME negotiations to delay the process, (2) you need guidance on the strike decision because all three QME panel members present challenges, (3) the QME's report is significantly unfavorable and you need to evaluate options for supplemental reports or rebuttal, or (4) there are procedural irregularities in the QME process that may warrant a challenge.

---

### LC 4062 -- AME Selection (Mutual Agreement Process)

> **If the employee is represented by an attorney, the parties may agree on any physician to serve as an agreed medical evaluator.**
> -- Cal. Lab. Code Section 4062

**Tier 1 (Dismissable):**
The AME process is the preferred method for resolving medical disputes when the injured worker has an attorney. Both sides -- the claims examiner (representing the insurer) and the applicant attorney (representing the injured worker) -- agree on a single physician to evaluate the disputed medical issues. Because both sides have agreed on the doctor, the AME's report typically carries even more weight than a QME report. The AME process requires good-faith negotiation between the parties. If the parties cannot agree, the fallback is the QME panel process under LC 4061.

**The Authority:** Cal. Lab. Code Section 4062; Cal. Code Regs., tit. 8, Sections 31 through 31.9

**The Standard -- What This Means in Practice:**
The AME process typically begins when one side sends the other a list of proposed AME candidates. The parties then negotiate to find a physician both sides can accept. There are no statutory requirements for the AME's qualifications beyond being a licensed physician, although in practice both sides prefer physicians who are experienced in Workers' Compensation and knowledgeable about the specific body part or condition at issue. Once the parties agree, they jointly send the AME the relevant medical records and a letter outlining the disputed issues. The AME examines the worker and issues a report. The AME's findings are given great weight by the WCAB and are very difficult to challenge.

**The Consequence -- What Happens If You Don't:**
If you refuse to engage in AME negotiations, the applicant attorney can immediately request a QME panel, and you lose the opportunity to have a mutually agreed-upon evaluator -- which is generally a better outcome for both sides. If you agree to an AME but fail to send the required medical records, the AME may issue an incomplete report. If you fail to raise all disputed issues in the AME referral letter, those issues may not be addressed in the report. The AME process, when done correctly, is the most efficient path to resolving medical disputes. When done poorly, it creates additional delays and costs.

**The Common Mistake:**
A new examiner receives an AME proposal from the applicant attorney and ignores it, not realizing there is a deadline to respond. After the deadline passes, the attorney requests a QME panel, and the examiner has lost the opportunity to select a mutually agreeable evaluator. Another mistake: the examiner agrees to an AME who is not the right specialist for the disputed issue. For example, agreeing to an AME who is an orthopedic surgeon when the primary dispute is about the worker's psychiatric condition. The wrong specialty AME cannot adequately address the disputed issue, and the report may be of limited value or require a supplemental evaluation.

**AdjudiCLAIMS Helps You By:**
Tracking AME proposals and response deadlines, maintaining a database of physicians who have served as AMEs (with outcome history where available), generating AME referral letters with a checklist of disputed issues, tracking the record compilation process, and monitoring the AME evaluation and report timeline.

**You Must:**
Respond promptly to AME proposals. Evaluate proposed AME candidates for qualifications, specialty fit, and experience. Negotiate in good faith. Compile and send all relevant medical records. Clearly identify all disputed medical issues in the referral letter. Review the AME report thoroughly and determine its implications for the claim. Your judgment is required at every stage -- AME selection is one of the most strategically significant decisions in the life of a claim.

**Escalation Trigger:**
Escalate when: (1) you need guidance on AME selection strategy for a complex or high-exposure claim, (2) the applicant attorney proposes an AME who you believe is biased or unqualified, (3) the AME report contains findings that are significantly unfavorable and you need to evaluate your options, or (4) the AME process has broken down and you need to transition to the QME panel process.

---

---

## Part 6: Labor Code -- Notice and Disclosure

**Tier 1 (Dismissable):**
Workers' Compensation is not just about paying benefits and resolving medical disputes. There is also a regulatory framework governing notices, disclosures, and information sharing between the insurer, the employer, the employee, and the state. These requirements exist to ensure transparency, protect privacy (especially medical information), and keep all parties informed about the status and impact of claims. As a claims examiner, you must understand what notices are required, when they are due, and what information can and cannot be disclosed. This Part covers three key statutes governing notice and disclosure obligations.

---

### LC 138.4 -- DWC Electronic Adjudication Management System (EAMS) Compliance

> **The administrative director shall establish, maintain, and operate an electronic adjudication management system for the purpose of case management, document management, and calendaring of proceedings.**
> -- Cal. Lab. Code Section 138.4

**Tier 1 (Dismissable):**
EAMS is the Division of Workers' Compensation's electronic system for managing workers' compensation cases. Think of it as the court's electronic filing and case management system. When documents need to be filed with the WCAB (such as a Declaration of Readiness to Proceed, a Compromise and Release, or a Stipulation with Request for Award), they are filed through EAMS. As a claims examiner, you interact with EAMS when you or your defense attorney need to file documents with the WCAB or retrieve documents filed by the applicant's attorney. Compliance with EAMS means using the correct forms, filing formats, and electronic submission protocols.

**The Authority:** Cal. Lab. Code Section 138.4; Cal. Code Regs., tit. 8, Sections 10205 through 10208

**The Standard -- What This Means in Practice:**
All documents filed with the WCAB must comply with EAMS formatting and submission requirements. This includes using DWC-designated forms, following document naming conventions, submitting documents electronically through the JET File portal or other approved methods, and ensuring documents are filed within applicable deadlines. As a claims examiner, you will work with defense counsel on WCAB filings, but you must understand the EAMS requirements to ensure your claim file contains the correct documentation, to track filing deadlines, and to retrieve documents filed by other parties.

**The Consequence -- What Happens If You Don't:**
Documents that do not comply with EAMS formatting requirements may be rejected by the WCAB, which can result in missed filing deadlines, procedural defaults, and loss of rights. For example, if a response to a petition is filed in the wrong format and rejected, you may miss the deadline to respond, potentially resulting in a default judgment. EAMS non-compliance can also delay proceedings, increasing the overall cost and duration of the claim.

**The Common Mistake:**
A new examiner needs to file a document with the WCAB and creates it in a format that does not comply with EAMS requirements -- wrong form number, incorrect formatting, or submitted through the wrong channel. The document is rejected, the deadline passes, and the examiner must now seek relief from the WCAB to file late, which is not guaranteed. Another mistake: the examiner does not monitor EAMS for documents filed by the applicant attorney, such as a Declaration of Readiness to Proceed (DOR), and misses a hearing date.

**AdjudiCLAIMS Helps You By:**
Integrating with EAMS filing requirements to ensure documents are formatted correctly, tracking WCAB filing deadlines and hearing dates, alerting you when documents are filed by the opposing party, maintaining a complete record of all EAMS filings on each claim, and providing templates for common WCAB filings that comply with EAMS formatting rules.

**You Must:**
Ensure all WCAB filings comply with EAMS requirements. Monitor EAMS for filings by other parties. Track hearing dates and filing deadlines. Coordinate with defense counsel on WCAB proceedings. Your judgment is required to determine what filings are necessary and when, and to ensure the claim is properly positioned for WCAB proceedings.

**Escalation Trigger:**
Escalate when: (1) a filing has been rejected by EAMS and a deadline is at risk, (2) a Declaration of Readiness to Proceed has been filed and you need to prepare for a hearing, (3) you are unsure about the correct EAMS procedure for a particular filing, or (4) there are EAMS system outages that may affect your ability to file timely.

---

### LC 3761 -- Insurer Notification to Employer of Indemnity Claims

> **Every insurer, upon acceptance or rejection of a claim for indemnity, shall notify the employer within 15 days of the decision.**
> -- Cal. Lab. Code Section 3761

**Tier 1 (Dismissable):**
When an injured worker files a claim that involves indemnity benefits (meaning TD, PD, or death benefits -- not just medical treatment), the insurer must notify the employer of the claim within 15 days. This notification requirement exists because indemnity claims have a direct financial impact on the employer through experience modification ratings and premium calculations. The employer has the right to know about indemnity claims on their policy so they can take appropriate action -- such as reviewing workplace safety, investigating the incident, and planning for the worker's return.

**The Authority:** Cal. Lab. Code Section 3761

**The Standard -- What This Means in Practice:**
Within 15 days of accepting or rejecting a claim that involves indemnity benefits, you must notify the employer. The notification should include the basic facts of the claim -- the employee's name, date of injury, nature of injury, and the insurer's decision (accepted or denied). This is a separate obligation from the initial claim reporting that the employer does. Even if the employer reported the claim to you, you must notify them of your indemnity decision. This ensures the employer is aware of claims that will affect their workers' compensation experience rating and future premiums.

**The Consequence -- What Happens If You Don't:**
Failure to notify the employer within 15 days can result in administrative penalties from the DWC. More practically, if the employer is not informed of indemnity claims, they cannot effectively manage their workers' compensation program -- they cannot investigate late-reported claims, they cannot implement corrective safety measures, and they may be surprised by premium increases at renewal. Employers who are not properly notified sometimes file complaints with the Department of Insurance, which can trigger regulatory scrutiny of the claims administrator.

**The Common Mistake:**
A new examiner accepts a claim and begins paying benefits but does not separately notify the employer of the indemnity claim determination. The examiner assumes the employer already knows because they reported the injury in the first place. But the employer's knowledge of the injury is different from being notified of the insurer's decision to accept or reject the indemnity claim. The employer needs the formal notification to understand the financial impact. Another mistake: the examiner notifies the employer by phone but does not document the notification in writing, which fails to satisfy the statutory requirement.

**AdjudiCLAIMS Helps You By:**
Automatically triggering the employer notification workflow when an indemnity claim determination is made, generating the notification letter with the required information, tracking the 15-day deadline, confirming that the notification was sent and documenting the date, and flagging claims where the employer notification is overdue.

**You Must:**
Ensure that every indemnity claim determination (accept or deny) is followed by a timely employer notification. Document the notification in the claim file. Use the correct format and include the required information. Your judgment is needed to ensure the notification accurately reflects the claim determination and includes appropriate information for the employer.

**Escalation Trigger:**
Escalate when: (1) you are unsure whether a claim involves "indemnity" that triggers the notification requirement, (2) the employer cannot be located or is unresponsive, (3) the employer disputes the claim determination and requests additional information, or (4) there is a sensitive or high-profile claim where the employer notification needs to be carefully crafted.

---

### LC 3762 -- Discussion of Claim Elements Affecting Premium; Medical Disclosure Restrictions

> **Upon the employer's request, the insurer shall discuss with the employer elements of the claim that affect the employer's premium, provided that no medical information beyond the general nature of the injury may be disclosed without the employee's written consent.**
> -- Cal. Lab. Code Section 3762

**Tier 1 (Dismissable):**
This statute balances two competing interests: the employer's right to understand how workers' compensation claims affect their premiums, and the employee's right to medical privacy. The employer pays the workers' compensation premium, so they have a legitimate interest in understanding claim costs and the factors driving those costs. But the injured worker has medical records that are private and cannot be freely shared. LC 3762 draws the line: you can discuss claim elements that affect the premium (such as reserve amounts, payment history, and claim status), but you cannot disclose medical information beyond the "general nature of the injury" without the employee's written consent.

**The Authority:** Cal. Lab. Code Section 3762

**The Standard -- What This Means in Practice:**
When an employer asks about a claim on their policy, you may discuss: the general nature of the injury (for example, "low back strain" or "right shoulder injury"), the claim status (open, closed, accepted, denied), the reserves set on the claim, the payments made to date, and how the claim may affect the employer's experience modification rating. You may not disclose: specific medical diagnoses beyond the general nature, detailed medical records, treatment plans, medication information, psychiatric or psychological details, or any other specific medical information. If the employer wants more detailed medical information, the employee must provide written authorization. This restriction applies even if the employer is the one who reported the injury.

**The Consequence -- What Happens If You Don't:**
Disclosing protected medical information without the employee's consent violates LC 3762 and potentially HIPAA (for employers with group health plans), the California Confidentiality of Medical Information Act (CMIA), and other privacy laws. Penalties can include regulatory sanctions, civil liability, and reputational damage. If an employee learns that their medical information was improperly disclosed to their employer, they may file a complaint with the DWC, the Department of Insurance, or pursue civil remedies. Even well-intentioned disclosures ("I was just trying to help the employer understand the claim") can result in serious consequences.

**The Common Mistake:**
An employer calls the examiner and asks, "What's going on with John's claim? He's been out for three months." The new examiner, trying to be helpful and responsive to the policyholder, provides detailed medical information: "He had surgery on his lumbar spine, he's on opioid medication, and his doctor says he has a 15% impairment." This disclosure violates LC 3762. The correct response would be: "The claim involves a low back injury. He is currently receiving temporary disability benefits. I can discuss how the claim reserves affect your experience modification, but I cannot share specific medical details without the employee's written consent."

**AdjudiCLAIMS Helps You By:**
Providing a clear visual separation between information that can be shared with employers and information that is restricted, generating employer-facing claim summaries that include only permissible information, flagging when a user attempts to include restricted medical information in an employer communication, maintaining a record of all employer disclosures for compliance auditing, and providing templates for employer discussions that comply with LC 3762.

**You Must:**
Understand the line between permissible and restricted disclosure. Respond to employer inquiries with appropriate information while protecting the employee's medical privacy. Obtain written consent before disclosing detailed medical information. Document all employer communications. Your judgment is critical here -- you must evaluate each disclosure request against the LC 3762 standard and err on the side of protecting medical privacy.

**Escalation Trigger:**
Escalate when: (1) an employer is demanding detailed medical information and you are unsure what can be disclosed, (2) you have inadvertently disclosed medical information that may exceed the LC 3762 standard, (3) an employer claims they need specific medical information for a legitimate business purpose (such as return-to-work planning), or (4) an employee has filed a complaint alleging improper disclosure of medical information.

---

---

## Part 7: Utilization Review Regulations (CCR Title 8)

**Tier 1 (Dismissable):**
Part 4 introduced the statutory requirement for Utilization Review (UR) under LC 4610. This Part covers the implementing regulations -- the detailed rules in the California Code of Regulations (CCR), Title 8, that govern how UR actually works in practice. These regulations are where the rubber meets the road: they define what UR is, what standards the reviewer must use, how fast decisions must be made, what happens when the injured worker disagrees with a UR denial, and what penalties apply for violations. As a claims examiner, UR is one of the most regulated and audited areas of your work. You must understand these regulations not just conceptually, but operationally -- because a missed deadline or a procedurally deficient UR decision can result in treatment being deemed authorized by default, penalties from the DWC, and increased claim costs.

**Key Terms You Need to Know:**

- **UR (Utilization Review)** -- The formal process by which the insurer evaluates whether a requested medical treatment is medically necessary. Every treatment request (submitted via a Request for Authorization, or RFA) from a treating physician must go through UR. The UR reviewer is a licensed physician who evaluates the request against evidence-based medical treatment guidelines.

- **IMR (Independent Medical Review)** -- The appeal process available to an injured worker when UR denies, modifies, or delays a treatment request. IMR is conducted by an independent physician reviewer contracted by the DWC through Maximus Federal Services (the current IMR organization). The IMR determination is binding -- it overrides the UR decision and is not subject to appeal to the WCAB (with very narrow exceptions). IMR is the injured worker's remedy for a UR denial; the treating physician does not appeal directly.

- **MTUS (Medical Treatment Utilization Schedule)** -- The DWC's evidence-based medical treatment guidelines. The MTUS is the primary standard against which UR decisions are measured. It is largely based on the ACOEM (American College of Occupational and Environmental Medicine) Practice Guidelines, supplemented by DWC-specific rules for topics like opioid prescribing, chronic pain, and acupuncture. When a UR reviewer evaluates a treatment request, the first question is: "Is this treatment consistent with the MTUS?"

- **ACOEM (American College of Occupational and Environmental Medicine)** -- The medical professional organization whose Practice Guidelines form the foundation of California's MTUS. ACOEM guidelines are evidence-based treatment recommendations for occupational injuries and illnesses. California adopted a version of ACOEM guidelines as its MTUS, meaning that ACOEM is the default standard for evaluating medical treatment in California Workers' Compensation. When you see a reference to the MTUS or "ACOEM guidelines," they are referring to the same body of evidence-based treatment standards.

- **RFA (Request for Authorization)** -- The standardized form (DWC Form RFA) that a treating physician submits to request authorization for medical treatment. The RFA triggers the UR process. It must include the requested treatment, the diagnosis, and supporting clinical information. The date the RFA is received by the claims administrator starts the UR timeline clock.

---

### CCR 9792.6 -- UR Definitions and General Requirements

> **Utilization review means the prospective, concurrent, or retrospective review of the medical necessity and appropriateness of treatment recommendations made by treating physicians.**
> -- Cal. Code Regs., tit. 8, Section 9792.6

**Tier 1 (Dismissable):**
This regulation provides the foundational definitions for the entire UR process. It defines the three types of UR review: prospective (reviewing treatment before it is provided), concurrent (reviewing treatment while it is being provided, such as an inpatient hospital stay), and retrospective (reviewing treatment after it has already been provided). It also establishes the general requirements for UR programs, including who can perform UR reviews, what qualifications are required, and what information must be included in UR communications. Think of CCR 9792.6 as the "definitions section" of a contract -- it sets the terms that all the other UR regulations rely on.

**The Authority:** Cal. Code Regs., tit. 8, Section 9792.6

**The Standard -- What This Means in Practice:**
Your UR program must comply with the definitions and requirements in CCR 9792.6. Key requirements include: (1) UR decisions must be made by a licensed physician (for clinical determinations) or a licensed healthcare professional working under physician supervision (for non-clinical administrative functions), (2) the UR reviewer must be competent to evaluate the specific clinical issue (for example, an orthopedic treatment request should be reviewed by a physician with relevant expertise), (3) UR communications must include specific information such as the clinical reasons for the decision, the criteria used, and the employee's right to request IMR if the decision is adverse, and (4) the UR program must have written policies and procedures that comply with the regulation.

**The Consequence -- What Happens If You Don't:**
A UR decision made by a non-physician (for clinical determinations), by a reviewer without relevant competence, or without the required information is procedurally deficient and may be overturned on appeal. If the UR program itself does not comply with CCR 9792.6's general requirements, the entire program may be deemed non-compliant, which means the insurer cannot effectively deny any treatment request. DWC audits specifically review UR program compliance against CCR 9792.6 requirements.

**The Common Mistake:**
A new examiner receives a treatment request and asks a nurse on staff to review it and make a determination. While nurses may play a role in the UR process (such as gathering medical records or performing initial screening), the clinical determination of medical necessity must be made by a licensed physician. A nurse's denial of treatment is procedurally deficient and will not withstand challenge. Another mistake: the UR decision letter does not include all required elements (such as the clinical rationale, the guidelines relied upon, or notice of IMR rights), making it deficient even if the clinical determination was correct.

**AdjudiCLAIMS Helps You By:**
Providing UR decision templates that include all elements required by CCR 9792.6, verifying that the UR reviewer has the appropriate credentials and specialty, flagging UR decisions that are missing required information before they are sent, tracking UR program compliance metrics, and maintaining a reference library of CCR 9792.6 definitions and requirements.

**You Must:**
Ensure your UR program complies with the general requirements of CCR 9792.6. Verify that UR decisions are made by appropriately qualified reviewers. Confirm that UR communications include all required elements. Monitor your UR vendor (if you use one) for compliance. Your judgment is required to oversee the UR process -- you may not make the clinical determination yourself (unless you are a licensed physician), but you are responsible for the administrative compliance of the UR process.

**Escalation Trigger:**
Escalate when: (1) you have concerns about the qualifications or competence of a UR reviewer, (2) a UR decision is challenged on procedural grounds (such as an allegation that the reviewer was not properly licensed), (3) your UR vendor is not providing compliant decision letters, or (4) a DWC audit has identified deficiencies in your UR program.

---

### CCR 9792.8 -- Medically-Based Criteria for UR Decisions

> **Utilization review decisions shall be based on the medical treatment utilization schedule (MTUS) adopted by the administrative director. If the MTUS does not address the treatment at issue, the reviewer shall use evidence-based, peer-reviewed medical literature.**
> -- Cal. Code Regs., tit. 8, Section 9792.8

**Tier 1 (Dismissable):**
This regulation answers the question: "What standard does the UR reviewer use to decide whether treatment is medically necessary?" The answer is the MTUS -- specifically, the ACOEM-based guidelines adopted by the DWC. The MTUS covers the vast majority of treatments commonly requested in Workers' Compensation. If the MTUS addresses the treatment, the reviewer must use it. If the MTUS does not address the specific treatment (which is less common), the reviewer can turn to other evidence-based, peer-reviewed medical literature. The key point: UR decisions cannot be based on the reviewer's personal opinion, cost considerations, or arbitrary standards. They must be grounded in evidence-based medicine.

**The Authority:** Cal. Code Regs., tit. 8, Section 9792.8; Cal. Lab. Code Section 4604.5 (MTUS statutory authority)

**The Standard -- What This Means in Practice:**
Every UR decision must cite the specific MTUS guideline (or other evidence-based source) that supports the decision. If treatment is approved, the reviewer confirms it is consistent with the MTUS. If treatment is denied or modified, the reviewer must explain specifically how the requested treatment deviates from the MTUS and cite the relevant guideline. This requirement applies to all UR decisions -- prospective, concurrent, and retrospective. The UR decision letter must include the specific criteria and clinical rationale, not just a generic statement like "treatment not medically necessary."

**The Consequence -- What Happens If You Don't:**
A UR denial that does not cite specific MTUS or evidence-based criteria is procedurally deficient and is unlikely to survive IMR review. If the UR reviewer simply states "not medically necessary" without citing the specific guideline that supports the denial, the IMR reviewer may overturn the decision simply because it was not properly supported. This means the treatment is authorized after a delay that harmed the injured worker and wasted administrative resources. DWC audit penalties for UR decisions that fail to cite medical criteria range from $500 to $5,000 per violation under CCR 9792.12.

**The Common Mistake:**
A UR reviewer denies a treatment request for physical therapy, writing: "Requested treatment exceeds what is medically necessary." The denial does not cite the specific MTUS guideline for physical therapy frequency and duration, does not explain which MTUS criteria the request exceeds, and does not specify what alternative treatment (if any) would be appropriate. This denial is almost guaranteed to be overturned on IMR because it does not demonstrate that the reviewer applied the MTUS. The correct approach: cite the specific MTUS section that addresses physical therapy for the diagnosed condition, compare the requested treatment to the MTUS recommendation, and explain the variance.

**AdjudiCLAIMS Helps You By:**
Linking each treatment request to the relevant MTUS guideline, providing UR reviewers with the specific MTUS criteria for the requested treatment, flagging UR denial letters that do not include specific MTUS citations, tracking IMR overturn rates (which may indicate that UR reviewers are not properly applying the MTUS), and maintaining an up-to-date MTUS reference database that reflects the latest DWC guidelines.

**You Must:**
Ensure that UR decisions cite specific medical criteria. Review UR denial letters for completeness before they are sent. Monitor IMR outcomes to identify patterns of overturn that may indicate UR quality issues. Ensure your UR reviewers have access to the current MTUS. Your judgment is needed to evaluate whether UR decisions are properly supported -- even though the clinical determination is made by the UR physician, you are responsible for the quality and compliance of the UR process.

**Escalation Trigger:**
Escalate when: (1) you notice a pattern of UR denials being overturned on IMR, suggesting the UR reviewers are not properly applying the MTUS, (2) a UR denial letter does not cite specific medical criteria and you cannot get the UR vendor to correct it, (3) a treating physician is requesting treatment that is not addressed by the MTUS and you are unsure what criteria should be applied, or (4) there is a new MTUS update and you need to ensure your UR program reflects the latest guidelines.

---

### CCR 9792.9 -- UR Timeframes

> **The utilization review decision shall be made in a timely manner to prevent any unnecessary delay in the provision of medical treatment to the injured worker.**
> -- Cal. Code Regs., tit. 8, Section 9792.9

**Tier 1 (Dismissable):**
This is the most operationally critical UR regulation. It sets the strict deadlines for UR decisions based on the type of review. There are three types, each with different timeframes:

- **Prospective review** (treatment not yet provided): The UR decision must be made within **5 business days** from the date the RFA is received by the claims administrator.
- **Concurrent review** (treatment in progress, such as an inpatient stay): The UR decision must be made within **24 hours** if the treatment is about to begin or continue, to avoid interruption of care.
- **Retrospective review** (treatment already provided): The UR decision must be made within **30 days** from the date the claims administrator receives the medical information reasonably necessary to make the determination.

These deadlines are absolute. If the UR decision is not made within the required timeframe, the treatment is **deemed authorized by operation of law** -- meaning it is automatically approved regardless of medical necessity.

**The Authority:** Cal. Code Regs., tit. 8, Section 9792.9; Cal. Lab. Code Section 4610

**The Standard -- What This Means in Practice:**
The clock starts when the claims administrator receives the RFA (for prospective review) or the relevant medical information (for retrospective review). "Receives" means the date the document arrives at the claims administrator's office, not the date the examiner personally reviews it. You must have a system for date-stamping incoming RFAs and routing them to the UR program immediately. For prospective review, the 5-business-day clock means you have very little time -- if an RFA arrives on Monday, the UR decision must be issued by the following Monday (assuming no holidays). For concurrent review, the 24-hour window is even tighter and applies primarily to requests to extend inpatient stays or ongoing treatment. For retrospective review, the 30-day window is more generous but still requires prompt action.

If the UR reviewer needs additional medical information to make a decision, they may request it, but this does not stop the clock in most cases. For prospective review, if additional information is requested within the first 5 business days, the reviewer gets an additional 14 days from the date the information is received -- but must still make a decision within the extended timeframe. If the information is never received, the reviewer must make a decision based on the information available.

**The Consequence -- What Happens If You Don't:**
If the UR decision is not issued within the required timeframe, the treatment is deemed authorized. This means: (1) the insurer must pay for the treatment even if it would not have met medical necessity standards, (2) the insurer cannot subsequently deny the treatment on medical necessity grounds, and (3) the claims administrator may face penalties under CCR 9792.12 for the untimely UR decision. Deemed authorizations are one of the most costly UR failures -- they result in payment for treatment that may have been properly deniable if the process had been timely. DWC audits specifically flag UR timeliness rates and deemed authorizations.

**The Common Mistake:**
An examiner receives an RFA on Tuesday but does not route it to the UR program until Friday because the examiner was "reviewing the claim file first." The UR reviewer now has only one business day to make a decision before the 5-business-day deadline. The reviewer cannot adequately evaluate the request in one day, the deadline passes, and the treatment is deemed authorized. The root cause: the examiner held the RFA instead of immediately routing it. Another common mistake: the examiner receives an RFA via fax and does not realize the fax date (not the date the examiner found it) is the start of the UR clock.

A third common mistake: the UR reviewer requests additional information and both the reviewer and the examiner assume the clock is "paused." In most cases, the clock is not paused -- the reviewer gets an extension from the date additional information is received, but must still act within the extended timeframe.

**AdjudiCLAIMS Helps You By:**
Automatically date-stamping every incoming RFA, calculating the applicable UR deadline (prospective, concurrent, or retrospective), displaying a countdown timer for each pending UR decision, escalating alerts at 3 days, 1 day, and same-day deadlines, tracking when additional information is requested and recalculating the extended deadline, flagging when a UR decision is overdue (meaning treatment is deemed authorized), and generating compliance reports showing UR timeliness rates.

**You Must:**
Route every RFA to the UR program immediately upon receipt. Do not hold RFAs for your own review before routing. Monitor UR deadlines actively. Follow up with UR reviewers when decisions are approaching their deadlines. Understand the rules for when additional information requests extend the deadline and when they do not. Your judgment is required to manage the UR workflow efficiently and to prioritize urgent cases (such as concurrent review requests with 24-hour deadlines).

**Escalation Trigger:**
Escalate when: (1) a UR deadline is about to be missed and the UR reviewer has not issued a determination, (2) a concurrent review request requires a 24-hour decision and the UR reviewer is not available, (3) you are unsure whether a request qualifies as prospective, concurrent, or retrospective (which determines the applicable deadline), (4) there is a pattern of missed UR deadlines suggesting a systemic issue with the UR vendor, or (5) a deemed authorization has occurred and you need guidance on the financial and claims management implications.

---

### CCR 9792.10 -- UR Dispute Resolution (IMR Process)

> **If the utilization review decision denies, modifies, or delays a treatment recommendation, the injured employee may request an independent medical review.**
> -- Cal. Code Regs., tit. 8, Section 9792.10; Cal. Lab. Code Section 4610.5

**Tier 1 (Dismissable):**
When the UR process results in a denial, modification, or delay of requested treatment, the injured worker has the right to appeal through Independent Medical Review (IMR). IMR is not conducted by the insurer or the insurer's UR reviewer -- it is conducted by an independent physician reviewer assigned by the DWC through its contracted IMR organization (currently Maximus Federal Services). The IMR reviewer examines the same medical records and treatment request and makes an independent determination. The IMR decision is binding on all parties, which means: if the IMR reviewer upholds the UR denial, the treatment is denied; if the IMR reviewer overturns the UR denial, the insurer must authorize the treatment. The IMR decision is not subject to appeal to the WCAB except in very narrow circumstances (such as fraud or conflict of interest).

**The Authority:** Cal. Code Regs., tit. 8, Section 9792.10; Cal. Lab. Code Sections 4610.5 and 4610.6

**The Standard -- What This Means in Practice:**
When a UR decision denies, modifies, or delays treatment, the UR decision letter must include clear notice of the employee's right to request IMR, along with an IMR application form and instructions. The employee (or their attorney or treating physician) has 30 days from the date of the UR decision to request IMR. Once IMR is requested, the claims administrator must provide the IMR organization with all relevant medical records within specified timeframes. The IMR reviewer then makes a determination, typically within 30 days (or 3 days for urgent cases). The IMR determination is communicated to all parties and is immediately effective. If the IMR overturns the UR denial, you must authorize the treatment promptly.

As a claims examiner, you must: (1) ensure that every adverse UR decision includes proper IMR notification, (2) respond promptly to IMR requests by providing the required medical records, (3) monitor IMR outcomes, and (4) comply immediately with IMR determinations that overturn UR denials.

**The Consequence -- What Happens If You Don't:**
Failure to include IMR notice in a UR decision letter is a procedural deficiency that can result in the UR decision being voided. Failure to provide medical records to the IMR organization within the required timeframe can result in a default determination in favor of the injured worker. Failure to comply with an IMR determination that authorizes treatment can result in LC 4610.5 penalties, LC 5814 penalties, and potential sanctions. IMR compliance is closely monitored by the DWC, and patterns of non-compliance can trigger audits and administrative action.

**The Common Mistake:**
An examiner receives notice that an IMR has been requested and assumes the UR denial remains in effect while the IMR is pending. The examiner does not prepare the medical records for submission to the IMR organization, thinking, "I'll deal with it when they ask." But the regulation requires the claims administrator to proactively submit records within specified timeframes. The delay in providing records may result in a default IMR determination authorizing the treatment, or may extend the IMR process unnecessarily. Another common mistake: the examiner receives an IMR determination overturning the UR denial but does not authorize the treatment promptly, thinking, "We should review this first." The IMR determination is binding -- there is no second review. Authorize the treatment immediately.

**AdjudiCLAIMS Helps You By:**
Tracking the IMR request deadline (30 days from UR decision), alerting you when an IMR has been requested, generating the medical record package for submission to the IMR organization, tracking the IMR determination timeline, flagging IMR determinations that overturn UR denials and require immediate treatment authorization, and maintaining IMR outcome statistics for quality improvement.

**You Must:**
Ensure every adverse UR decision includes proper IMR notification. Respond to IMR requests by promptly providing all required medical records. Comply immediately with IMR determinations. Track IMR outcomes to identify patterns. Your judgment is needed to evaluate IMR determinations in the context of the overall claim and to ensure that treatment authorized by IMR is coordinated with the treating physician and the injured worker.

**Escalation Trigger:**
Escalate when: (1) an IMR determination overturns a UR denial for a treatment you believe is clearly inappropriate (options to challenge an IMR determination are very limited but do exist in narrow circumstances), (2) you are unable to compile the required medical records within the IMR submission deadline, (3) there is a pattern of IMR overturns that suggests your UR program is not properly applying the MTUS, or (4) you receive conflicting IMR determinations on related treatment requests.

---

### CCR 9792.12 -- UR Penalty Schedule

> **The administrative director may assess administrative penalties for violations of the utilization review standards and timeframes.**
> -- Cal. Code Regs., tit. 8, Section 9792.12

**Tier 1 (Dismissable):**
This regulation is the enforcement mechanism for the entire UR regulatory framework. It establishes a specific penalty schedule for violations of the UR regulations -- including late UR decisions, procedurally deficient UR decisions, failure to include required information in UR communications, and failure to maintain a compliant UR program. Penalties are assessed per violation, which means: if you have 50 late UR decisions, that is 50 separate penalties. The DWC Administrative Director has the authority to assess these penalties through audit or complaint-driven investigations.

**The Authority:** Cal. Code Regs., tit. 8, Section 9792.12; Cal. Lab. Code Section 4610.5

**The Standard -- What This Means in Practice:**
The penalty schedule establishes specific dollar amounts for specific violations. Key penalty categories include:

- **Late UR decision (failure to meet CCR 9792.9 timeframes):** Penalties range from $500 to $5,000 per violation, depending on the severity and whether the violation resulted in a deemed authorization.
- **Failure to include required elements in UR decision letter:** Penalties for missing clinical rationale, missing MTUS citations, or missing IMR notification.
- **Failure to use appropriate medical criteria (CCR 9792.8):** Penalties for UR decisions not based on MTUS or evidence-based guidelines.
- **Failure to maintain a compliant UR program:** Broader penalties for systemic non-compliance.

The DWC Audit Unit conducts regular audits of claims administrators' UR programs and assesses penalties based on a sample of claims. The penalties are per-violation, meaning that systemic non-compliance across a large caseload can result in aggregate penalties in the tens or hundreds of thousands of dollars.

**The Consequence -- What Happens If You Don't:**
The financial exposure is significant. Consider: a DWC audit reviews 50 claims and finds that 20 of them had late UR decisions. At $1,000 per violation (a moderate penalty), that is $20,000 in penalties from a single audit. If the auditor finds additional violations (missing IMR notices, missing MTUS citations), the penalties compound. Beyond the direct financial penalties, DWC audit findings become part of the claims administrator's regulatory record, which can affect insurer licensing, contract renewals, and reputation. In severe cases, the DWC can order corrective action plans, increased monitoring, or revocation of the claims administrator's authority to conduct UR.

**The Common Mistake:**
A claims operation views UR compliance as a "best effort" rather than a regulatory requirement. UR timeliness rates hover around 85% -- which sounds good in many business contexts but means 15% of UR decisions are late, each one a potential $500-$5,000 penalty. Over a caseload of 1,000 active treatment requests, that is 150 violations. At $1,000 each, that is $150,000 in potential penalties. The operation does not realize the financial exposure until the DWC audit arrives. Another mistake: the examiner assumes the UR vendor is handling compliance and does not monitor UR timeliness or quality independently. When the audit reveals deficiencies, the claims administrator (not the vendor) bears the regulatory penalty.

**AdjudiCLAIMS Helps You By:**
Providing real-time UR compliance dashboards showing timeliness rates, decision quality metrics, and IMR outcomes. Calculating potential penalty exposure based on current compliance rates. Flagging individual UR decisions that are at risk of penalty. Generating audit-ready reports that demonstrate compliance with CCR 9792.6 through 9792.12. Alerting management when compliance rates drop below acceptable thresholds.

**You Must:**
Monitor your UR program's compliance metrics. Ensure that UR timeliness targets are not just "good" but compliant -- the regulatory standard is 100% timely, not 85% or 90%. Address systemic issues that cause UR delays. Review UR decision quality to ensure letters include all required elements. Prepare for DWC audits by maintaining clean records. Your judgment is needed to balance caseload management with regulatory compliance and to escalate systemic issues before they become audit findings.

**Escalation Trigger:**
Escalate when: (1) UR timeliness rates drop below 95%, (2) you receive notice of a DWC audit, (3) aggregate penalty exposure exceeds a threshold set by your organization, (4) a systemic issue (such as UR vendor staffing shortages or IT system failures) is causing widespread UR delays, or (5) you receive a penalty assessment from the DWC and need guidance on whether to contest or pay.

---

<!-- END OF PARTS 4-7 -->
<!-- AdjudiCLAIMS Contextual Regulatory Education Spec -->
<!-- Glass Box Solutions, Inc. -->
<!-- "From Black Box to Glass Box." -->
