# Workers' Compensation Claims Examiner: Roles, Duties, and the "Adjuster in the Loop" Model

**Document Type:** Foundational Product Definition
**Purpose:** Comprehensive enumeration of statutory and non-statutory duties of a California WC claims examiner/adjuster, with source authority for each assertion, defining the framework for Adjudica's "Adjuster in the Loop" product model — with strict UPL guardrails
**Jurisdiction:** California (primary), with NAIC interstate framework
**Last Updated:** 2026-03-21
**Legal Review Required:** Yes — CRITICAL before any product decisions. The UPL boundary framework in this document requires attorney review.
**Companion Document:** [WC_DEFENSE_ATTORNEY_ROLES_AND_DUTIES.md](WC_DEFENSE_ATTORNEY_ROLES_AND_DUTIES.md)
**Statutory Citations Last Verified:** 2026-03-21 — verify against current law before reliance

---

## Executive Summary

A California Workers' Compensation claims examiner (also referred to as claims adjuster or claims representative) operates under a framework of statutory duties, regulatory obligations, and industry-standard practices that parallel — but are fundamentally distinct from — those of the defense attorney.

This document catalogs those duties in two categories — statutory (Part 1) and non-statutory (Part 2) — then defines the "Adjuster in the Loop" model (Part 3) and maps it to Adjudica's planned AdjudiCLAIMS architecture (Part 4).

### The Critical Distinction

> **The attorney product is a copilot for the practice of law. AdjudiCLAIMS MUST STRINGENTLY GUARD AGAINST THE UNAUTHORIZED PRACTICE OF LAW.**

AdjudiCLAIMS is **informational and fact-based**. It presents facts, performs calculations, tracks deadlines, and surfaces data. It does NOT provide legal advice, legal analysis, or legal conclusions. Any time a legal issue is implicated, the product must direct the examiner to seek guidance from assigned defense counsel or in-house legal.

The same AI capability that is lawful practice-of-law assistance in the attorney product may constitute **unauthorized practice of law** in AdjudiCLAIMS — because the user is NOT a licensed attorney. The framing, guardrails, and output boundaries differ by user type, not by AI capability.

**Related documents:**
- [INSURANCE_INDUSTRY_STRATEGY.md](../../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md) — Phase 2 product vision and examiner analogy
- [CA_INSURANCE_CODE.md](../../legal/compliance/regulations/CA_INSURANCE_CODE.md) — Insurance Code research
- [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md) — UPL boundary language (attorney context — must be adapted for examiner context)
- [REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](../REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md) — Compliance implementation phases

---

## Part 1: Statutory Duties and Legal Roles

Every duty in this section is rooted in a specific statutory, regulatory, or administrative authority. The claims examiner's obligations flow from four sources: (1) the California Insurance Code, (2) the Department of Insurance regulations (CCR Title 10), (3) the DWC claims administration regulations (CCR Title 8), and (4) the California Labor Code.

### 1.1 California Insurance Code — Unfair Claims Settlement Practices Act

California Insurance Code § 790.03(h) is the **core statutory authority** governing claims examiner conduct. It prohibits specific unfair claims settlement practices. Violation constitutes an unfair business practice subject to DOI enforcement action.

#### Insurance Code § 790.03(h) — Prohibited Practices

> "Knowingly committing or performing with such frequency as to indicate a general business practice any of the following unfair claims settlement practices..."
>
> — Cal. Ins. Code § 790.03(h)

| Subdivision | Prohibited Practice | Examiner Duty Implied |
|-------------|--------------------|-----------------------|
| **(h)(1)** | Misrepresenting pertinent facts or insurance policy provisions relating to coverages at issue | Accurately represent policy provisions and claim facts to all parties |
| **(h)(2)** | Failing to acknowledge and act reasonably promptly upon communications with respect to claims arising under insurance policies | Respond to all claim communications within reasonable timeframes |
| **(h)(3)** | Failing to adopt and implement reasonable standards for the prompt investigation of claims arising under insurance policies | Investigate claims promptly using established standards and procedures |
| **(h)(4)** | Refusing to pay claims without conducting a reasonable investigation based upon all available information | Conduct thorough investigation before denying any claim |
| **(h)(5)** | Failing to affirm or deny coverage of claims within a reasonable time after proof of loss requirements have been completed and submitted | Make timely coverage determinations — accept or deny |
| **(h)(6)** | Not attempting in good faith to effectuate prompt, fair, and equitable settlements of claims in which liability has become reasonably clear | Settle claims promptly and fairly when liability is established |
| **(h)(7)** | Compelling insureds to institute litigation to recover amounts due under an insurance policy by offering substantially less than the amounts ultimately recovered | Make reasonable settlement offers — do not force litigation through lowball offers |
| **(h)(8)** | Attempting to settle a claim by an insured for less than the amount to which a reasonable person would have believed he or she was entitled by reference to written or printed advertising material accompanying or made part of an application | Do not settle for less than the applicant would reasonably believe they are entitled to based on communications |
| **(h)(9)** | Attempting to settle claims on the basis of an application which was altered without notice to, or knowledge or consent of, the insured | Do not alter claim documents without insured's knowledge |
| **(h)(10)** | Making claims payments to insureds or beneficiaries not accompanied by a statement setting forth the coverage under which payments are being made | Accompany all payments with explanation of coverage basis |
| **(h)(11)** | Making known to insureds or claimants a practice of the insurer of appealing from arbitration awards in favor of insureds or claimants for the purpose of compelling them to accept settlements or compromises less than the amount awarded in arbitration | Do not use appeal threats to compel unfavorable settlements |
| **(h)(12)** | Delaying the investigation or payment of claims by requiring an insured, claimant, or the physician of either, to submit a preliminary claim report and then requiring the subsequent submission of formal proof of loss forms, both of which submissions contain substantially the same information | Do not require duplicative documentation to delay claims |
| **(h)(13)** | Failing to settle claims promptly where liability has become apparent under one portion of the insurance policy coverage in order to influence settlements under other portions of the policy coverage | Do not cross-leverage coverage portions in settlement |
| **(h)(14)** | Failing to provide promptly a reasonable explanation of the basis relied on in the insurance policy, in relation to the facts or applicable law, for the denial of a claim or for the offer of a compromise settlement | Provide clear written explanation for every denial or compromise offer |
| **(h)(15)** | Directly advising a claimant not to obtain the services of an attorney | Never discourage claimants from obtaining legal representation |
| **(h)(16)** | Misleading a claimant as to the applicable statute of limitations | Never misstate filing deadlines or limitations periods |

**Source:** Cal. Ins. Code § 790.03(h) | **KB Status:** Gap — no `insurance_code` source type exists; see [KB_REGULATORY_GAP_REPORT.md](KB_REGULATORY_GAP_REPORT.md)

---

### 1.2 Department of Insurance Regulations — Fair Claims Settlement Practices (CCR Title 10)

The California Code of Regulations, Title 10, §§ 2695.1-2695.12 implement the Insurance Code's fair claims settlement requirements with specific timelines and procedural standards. These are the **operational regulations** that govern day-to-day claims handling.

#### Key Timeline Requirements

| Regulation | Requirement | Deadline |
|-----------|------------|----------|
| **10 CCR 2695.5(b)** | Acknowledge receipt of claim communication | **15 calendar days** from receipt |
| **10 CCR 2695.5(e)** | Begin investigation of claim | **Immediately** upon receipt of proof of claim |
| **10 CCR 2695.7(b)** | Accept or deny claim after receipt of proof of claim | **40 calendar days** |
| **10 CCR 2695.7(c)** | If additional time needed, notify claimant of reasons for delay | Every **30 calendar days** until determination |
| **10 CCR 2695.7(d)** | Payment of accepted claim | **30 calendar days** after determination of amount owed |
| **10 CCR 2695.7(h)** | Written denial or partial denial with explanation | Upon denial — must include specific reasons and policy provisions |

#### Key Substantive Standards

| Regulation | Standard | Examiner Obligation |
|-----------|---------|---------------------|
| **10 CCR 2695.2(d)** | "Good faith" defined | Claims handling must be fair, honest, and complete |
| **10 CCR 2695.3** | File and record documentation | Maintain documentation of all claim handling activity and communications |
| **10 CCR 2695.4** | Representation of policy provisions | Never misrepresent what the policy covers; explain clearly |
| **10 CCR 2695.6** | Training and certification | Claims personnel must be properly trained and qualified |
| **10 CCR 2695.7(a)** | Minimum standards for investigation | Investigation must be fair, thorough, and objective |
| **10 CCR 2695.9** | Additional WC standards | WC-specific claims handling standards beyond general requirements |

**Source:** Cal. Code Regs., tit. 10, §§ 2695.1-2695.12 | **KB Status:** Gap — no `ccr_title_10` source type; see [KB_REGULATORY_GAP_REPORT.md](KB_REGULATORY_GAP_REPORT.md)

---

### 1.3 DWC Claims Administration Regulations (CCR Title 8)

The Division of Workers' Compensation regulations in CCR Title 8, §§ 10100-10118 govern the administrative requirements for claims administration.

#### Claims File and Documentation Requirements

| Regulation | Requirement | Examiner Obligation |
|-----------|------------|---------------------|
| **CCR 10101** | Claim File Contents | Maintain complete claim file with all relevant documents, correspondence, and notes |
| **CCR 10102** | Retention of Claim Files | Retain files for the period specified by regulation (minimum 5 years after final disposition) |
| **CCR 10103** | Claim Log Contents and Maintenance | Maintain claim log documenting all activity on each claim |
| **CCR 10104** | Annual Report of Inventory | Submit annual reports of claims inventory as required |

#### Investigation and Good Faith

| Regulation | Requirement | Examiner Obligation |
|-----------|------------|---------------------|
| **CCR 10109** | Duty to Conduct Investigation; Duty of Good Faith | Conduct prompt, thorough investigation of every claim; act in good faith |
| **CCR 10109(a)** | Investigation must include all reasonably available information | Cannot deny claim without reviewing all available evidence |
| **CCR 10109(b)** | Good faith handling | Claims must be handled fairly and honestly; examiner must not act with bias or prejudice |

#### Audit and Penalties

| Regulation | Requirement | Examiner Obligation |
|-----------|------------|---------------------|
| **CCR 10105** | Auditing authority | DWC Administrative Director has authority to audit claims handling |
| **CCR 10106** | Audit subject selection (random and targeted) | Claims files may be selected for audit at any time |
| **CCR 10107** | Notice of audit; file production | Must produce complete claim files upon audit notice |
| **CCR 10108** | Audit violation rules and penalties | Violations subject to administrative penalties |
| **CCR 10110-10112** | Penalty assessment and appeal procedures | Penalties may be assessed for violations; appeal procedures available |

**Source:** Cal. Code Regs., tit. 8, §§ 10100-10118 | **KB Status:** Present — all sections confirmed in `regulatory_sections` table with full text

---

### 1.4 California Labor Code — WC-Specific Obligations

The Labor Code imposes direct obligations on claims administrators (insurers, TPAs, and self-insured employers) in the handling of WC claims.

#### Benefits Payment Obligations

| Section | Obligation | Timeline |
|---------|-----------|----------|
| **LC 4650** | First TD payment after employer knowledge of injury | **Within 14 days** |
| **LC 4650(b)** | Subsequent TD payments | **Every 14 days** thereafter |
| **LC 4650(c)** | Penalty for late payment — 10% self-imposed increase | Automatic if payment not timely |
| **LC 4650(d)** | Payment during investigation — must begin within 14 days even if liability not determined | Cannot delay initial payment pending full investigation |
| **LC 4653** | TD rate calculation | 2/3 of average weekly earnings, subject to statutory minimum and maximum |
| **LC 4654** | TD aggregate limit | 104 compensable weeks within 2 years (non-specified injuries) |
| **LC 4656** | Conditions for TD termination | Medical release, MMI determination, or statutory cap |

**Source:** Cal. Lab. Code §§ 4650-4657 | **KB Status:** Present — all sections confirmed

#### Medical Treatment Obligations

| Section | Obligation |
|---------|-----------|
| **LC 4600** | Employer/insurer shall provide all medical treatment reasonably required to cure or relieve effects of industrial injury |
| **LC 4600.3** | Medical Provider Network (MPN) requirements |
| **LC 4603.2** | Medical billing payment timelines |
| **LC 4610** | Utilization Review — insurer must establish UR program; prospective, concurrent, and retrospective review of treatment requests |
| **LC 4610.5** | Penalties for UR violations |

**Source:** Cal. Lab. Code §§ 4600-4610 | **KB Status:** Present — all sections confirmed (LC 4610: 23,903 chars)

#### Medical-Legal Evaluation Process

| Section | Obligation | Examiner's Role |
|---------|-----------|-----------------|
| **LC 4060** | QME evaluation when no party objects (unrepresented) | Examiner initiates QME process when disputes arise |
| **LC 4061** | QME panel when represented employee and parties cannot agree on AME | Examiner participates in AME negotiation; requests QME panel if no agreement |
| **LC 4062** | AME selection — mutual agreement process | Examiner communicates with defense counsel on AME selection preferences |
| **LC 4062.2** | AME panel request from DWC Medical Director | Examiner coordinates with counsel on panel request strategy |

**Source:** Cal. Lab. Code §§ 4060-4062.2 | **KB Status:** Gap — LC 4060-4062 in coverage gap (3866-4450); see [KB_REGULATORY_GAP_REPORT.md](KB_REGULATORY_GAP_REPORT.md)

#### Notice and Disclosure Requirements

| Section | Obligation |
|---------|-----------|
| **LC 138.4** | DWC electronic adjudication management system — claims administrators must comply with electronic filing and data reporting requirements |
| **LC 3761** | Insurer must notify employer within 15 days of each claim for indemnity filed |
| **LC 3762** | Insurer shall discuss elements of claim file affecting employer's premium; restrictions on medical information disclosure to employer |

**Source:** Cal. Lab. Code §§ 138.4, 3761, 3762 | **KB Status:** LC 3761, 3762 present; LC 138.4 is gap (below LC 3200)

#### Utilization Review Regulations

| Regulation | Requirement |
|-----------|------------|
| **CCR 9792.6** | UR Standards — definitions and general requirements |
| **CCR 9792.7** | UR Standards — applicability |
| **CCR 9792.8** | Medically-based criteria for UR decisions |
| **CCR 9792.9** | UR timeframes — prospective (5 business days), retrospective (30 days), concurrent |
| **CCR 9792.9.1** | UR standards for injuries on or after Jan. 1, 2013 |
| **CCR 9792.10** | UR dispute resolution procedures |
| **CCR 9792.11** | UR violation investigation procedures |
| **CCR 9792.12** | UR penalty schedule |

**Source:** Cal. Code Regs., tit. 8, §§ 9792.6-9792.12 | **KB Status:** Present — 75 records covering comprehensive UR regulations

---

### 1.5 NAIC and Interstate Regulatory Framework

California's unfair claims settlement practices law (Ins. Code § 790.03) is based on the **NAIC Model Unfair Claims Settlement Practices Act**. Over 24 states have adopted NAIC-aligned frameworks requiring human-in-the-loop for claims decisions.

| Regulation/Law | Jurisdiction | Key Requirement | Relevance to AI |
|---------------|-------------|-----------------|-----------------|
| **NAIC Model Bulletin on AI** | Model (adopted by 24+ states) | AI must act as support tool, not sole decision-maker | Adjuster makes all decisions; AI provides evidence |
| **Florida HB 527** | Florida | Human must independently verify AI was not sole basis for denial | Adjuster reviews AI analysis and makes independent determination |
| **Arizona HB 2175** | Arizona | Licensed professional must personally review health insurance denials | Adjuster personally reviews every AI-assisted recommendation |
| **California AB 3030** | California | Transparency disclaimers required for AI in healthcare | Glass Box citations show exactly what AI analyzed and recommended |
| **Colorado SB 24-205** | Colorado | Risk management for high-impact AI systems | Audit trails, bias monitoring, human oversight checkpoints |

**Key principle:** The regulatory trend across all jurisdictions is toward **mandatory human decision-making** with AI as an assistive tool — exactly the "Adjuster in the Loop" model.

**Source:** [INSURANCE_INDUSTRY_STRATEGY.md Part 3](../../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md) (lines 155-165) | NAIC website

---

### 1.6 THE UPL BOUNDARY — What Claims Examiners Cannot Do

**This is the single most important section in this document.** It defines the line between claims administration (permitted) and the practice of law (prohibited under B&P § 6125).

#### The Statutory Prohibition

> **Cal. Bus. & Prof. Code § 6125:** "No person shall practice law in California unless the person is an active licensee of the State Bar."
>
> **Cal. Bus. & Prof. Code § 6126(a):** Violation is a misdemeanor punishable by up to one year in county jail, a fine of up to $1,000, or both.

#### What Constitutes "Practice of Law"

California courts have defined the practice of law broadly:

> "The practice of law... includes legal advice and counsel, and the preparation of legal instruments and contracts by which legal rights are secured..."
>
> — *People v. Landlords Professional Services, Inc.* (1989) 215 Cal.App.3d 1599, 1608

> "[T]he practice of law includes the giving of advice and the drafting of instruments, whether or not it involves court proceedings."
>
> — *Baron v. City of Los Angeles* (1970) 2 Cal.3d 535, 543

#### The Examiner's Permitted vs. Prohibited Activities

| Activity | Permitted? | Authority | Rationale |
|----------|-----------|-----------|-----------|
| **Investigating facts of a claim** | **YES** | Ins. Code 790.03(h)(3); CCR 10109 | Factual investigation is claims administration, not legal practice |
| **Making coverage determinations based on clear policy language** | **YES** | Standard claims practice; Ins. Code 790.03(h)(5) | Applying unambiguous policy terms to established facts is contractual analysis |
| **Setting and adjusting reserves based on claim data** | **YES** | Standard claims practice | Financial estimation is actuarial/business judgment |
| **Authorizing medical treatment per UR guidelines** | **YES** | LC 4610; CCR 9792.6-9792.12 | UR decisions are medical/clinical, not legal |
| **Calculating indemnity benefits using statutory formulas** | **YES** | LC 4650-4657; LC 4653 | Statutory benefit calculations are arithmetic |
| **Tracking and complying with regulatory deadlines** | **YES** | CCR 2695.5; LC 4650 | Deadline compliance is procedural/administrative |
| **Deciding when to refer a claim to defense counsel** | **YES** | Standard claims practice | Case management decision |
| **Interpreting ambiguous policy language on complex legal questions** | **BORDERLINE — seek legal counsel** | | Interpretation of ambiguous language may constitute legal analysis |
| **Advising the insured/injured worker on their legal rights** | **NO — UPL** | B&P 6125 | Legal advice to non-clients is practicing law |
| **Providing legal analysis of case strengths and weaknesses** | **NO — UPL** | B&P 6125 | Legal analysis is the practice of law |
| **Recommending settlement strategy based on legal reasoning** | **NO — UPL if based on legal analysis** | B&P 6125 | Strategy based on legal analysis (case law, statutory interpretation) is legal practice |
| **Interpreting case law or WCAB decisions** | **NO — UPL** | B&P 6125 | Legal interpretation is the practice of law |
| **Advising on apportionment legal arguments** | **NO — UPL** | B&P 6125 | Apportionment analysis involves legal reasoning (Benson, Escobedo, Vigil) |
| **Drafting legal documents (settlement agreements, position statements)** | **NO — UPL** | B&P 6125 | Preparation of legal instruments is practicing law |

**The test is functional, not formal:** California courts look at whether the activity involves the application of legal knowledge and judgment to the circumstances of a particular case. If it does, it is the practice of law regardless of who performs it. *(People v. Landlords Professional Services, supra; Baron v. City of Los Angeles, supra)*

**⚠️ LEGAL REVIEW REQUIRED:** The boundary between factual claims administration and legal analysis is not a bright line. The classifications above represent a conservative framework. They must be reviewed by legal counsel before implementation in any product.

**Source:** Cal. Bus. & Prof. Code §§ 6125-6126 | *People v. Landlords Professional Services, Inc.* (1989) 215 Cal.App.3d 1599 | *Baron v. City of Los Angeles* (1970) 2 Cal.3d 535

---

## Part 2: Non-Statutory Duties and Typical Roles

The following activities represent the standard practice of a California WC claims examiner. These are the daily operational activities that generate the examiner's workload and are the activities where AI can provide the most value — within the UPL boundaries defined in Part 1.

### 2.1 Claims Investigation and Management

**Typical activities:**
- Receiving new claims and creating claim files per CCR 10101 requirements
- Conducting initial three-point contact (injured worker, employer, medical provider) within 24-48 hours of claim receipt
- Taking recorded statements from the injured worker and witnesses
- Requesting and reviewing medical records from treating physicians
- Ordering index bureau checks and prior claims searches
- Conducting or authorizing sub rosa surveillance when indicated
- Reviewing social media and public records for fraud indicators
- Investigating AOE/COE (arising out of employment / course of employment) issues factually
- Documenting all investigation activity in the claim file per CCR 10103

**Time significance:** Investigation is front-loaded — the first 30 days of a claim consume disproportionate adjuster time. A typical CA WC examiner manages 125-175 open claims simultaneously *(industry benchmark; varies by carrier, claim complexity, and TPA staffing ratios)*.

**Industry source:** WCIRB claims data reports; carrier operations manuals; DOI market conduct examination standards (define minimum investigation requirements).

---

### 2.2 Medical Management

**Typical activities:**
- Reviewing medical reports from treating physicians for treatment recommendations, work restrictions, and return-to-work status
- Authorizing or disputing treatment requests through Utilization Review (UR) per LC 4610
- Managing the QME/AME process — requesting panels, communicating with counsel on AME selection, reviewing QME/AME reports
- Coordinating Independent Medical Review (IMR) when UR decisions are disputed
- Monitoring treatment plans against MTUS (Medical Treatment Utilization Schedule) guidelines
- Tracking medical provider networks (MPN) and ensuring treatment within network
- Managing return-to-work programs and modified duty accommodations
- Reviewing pharmacy utilization and requesting Independent Pharmacy Review when appropriate
- Calculating and monitoring medical costs against reserves

**Time significance:** Medical management represents approximately 25-35% of an examiner's time on each claim and is the area with the highest volume of documents to review.

**Industry source:** DWC Medical Treatment Utilization Schedule (MTUS); ACOEM Practice Guidelines (adopted by DWC as evidence-based guidelines per LC 4604.5); CCR 9792.6 et seq. (UR regulations).

---

### 2.3 Reserve Setting and Financial Management

**Typical activities:**
- Setting initial reserves upon claim receipt based on available information (injury type, body part, employment data)
- Reviewing and adjusting reserves as new information becomes available (medical reports, investigation findings, litigation developments)
- Conducting periodic reserve adequacy reviews (typically 90-day cycles, varying by carrier)
- Calculating Incurred But Not Reported (IBNR) exposure for open claims
- Forecasting total claim cost including medical, indemnity, legal expense, and lien exposure
- Providing reserve justification documentation for actuarial reviews and financial audits
- Monitoring actual payments against established reserves; identifying adverse development

**Time significance:** Reserve accuracy directly impacts carrier financials — inadequate reserves lead to adverse development; excessive reserves tie up capital unnecessarily. This is a critical examiner judgment function.

**Industry source:** WCIRB aggregate reserve data; carrier actuarial guidelines; NAIC reserve adequacy standards. EvolutionIQ benchmarks show AI-assisted reserve analysis produces 8-10X ROI through improved reserve accuracy *(CCC/EvolutionIQ program data)*.

---

### 2.4 Litigation Management and Attorney Direction

**Typical activities:**
- Determining when to refer a claim to defense counsel (based on litigation triggers: attorney representation, denied claim, disputed medical, complex legal issues)
- Assigning claims to panel counsel based on carrier guidelines, attorney expertise, venue, and workload
- Providing initial case assessment and litigation objectives to assigned defense counsel
- Reviewing defense counsel status reports and billing statements
- Authorizing litigation budgets and monitoring attorney fees against billing guidelines
- Granting or withholding settlement authority based on case evaluation
- Participating in claim review meetings with defense counsel
- Directing defense counsel on investigation priorities and case management expectations

**⚠️ UPL BOUNDARY NOTE:** The examiner DIRECTS defense counsel on business objectives (settlement authority, budget parameters, investigation priorities) but does NOT provide legal analysis or strategy recommendations. The legal strategy is the attorney's professional domain. The examiner provides facts, financial parameters, and business objectives; the attorney provides legal advice and strategy.

**Time significance:** Litigated claims consume 3-5x the examiner time of non-litigated claims. Attorney direction and oversight is a significant portion of this additional burden.

**Industry source:** Carrier litigation management guidelines; WCIRB ALAE data (defense attorney fees are 45-50% of total ALAE per claim — see [INSURANCE_INDUSTRY_STRATEGY.md Part 1](../../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md)).

---

### 2.5 Regulatory Compliance and Reporting

**Typical activities:**
- Ensuring all statutory notice requirements are met (DWC-1 provision, benefit notices, denial letters per 10 CCR 2695.7(h))
- Filing required DWC reports (Annual Report of Inventory per CCR 10104, WCIS data reporting per LC 138.6)
- Maintaining claim files in audit-ready condition per CCR 10101-10103
- Responding to DWC audit requests per CCR 10107
- Tracking DOI market conduct examination requirements
- Ensuring compliance with CDI (California Department of Insurance) response deadlines
- Filing penalty self-assessments for late TD payments per LC 4650(c)
- Maintaining UR program compliance per LC 4610 and CCR 9792.6 et seq.
- Reporting fraud indicators to DOI and carrier SIU (Special Investigations Unit) when identified

**Time significance:** Regulatory compliance is non-discretionary — every deadline must be met. A single missed benefit notice can trigger penalties at DOI audit. This is an area where AI deadline tracking provides immediate, measurable value with zero UPL risk.

**Industry source:** DWC Audit Standards (CCR 10105-10108); DOI Market Conduct Examination Handbook; California Insurance Commissioner enforcement actions.

---

## Part 3: The "Adjuster in the Loop" Model

### 3.1 Definition

> **The "Adjuster in the Loop" model requires that a licensed claims examiner exercises independent professional judgment over all substantive claims decisions, with AI providing factual information, data analysis, and regulatory compliance support while NEVER crossing into legal advice, legal analysis, or legal conclusions.**

This model is grounded in:

1. **Ins. Code § 790.03(h)** — Claims handling duties require human judgment; no statutory authorization to delegate to AI
2. **NAIC Model Bulletin on AI** — AI must act as support tool, not sole decision-maker
3. **CCR 10109** — Duty to investigate requires human claims handling, not automated determination
4. **B&P Code § 6125** — The examiner is NOT a licensed attorney; any AI output constituting legal advice would be UPL
5. **Florida HB 527, Arizona HB 2175, Colorado SB 24-205** — Emerging interstate framework requires human verification of AI-assisted claims decisions

The examiner is the decision-maker. AI is the information provider. The AI does not advise, recommend, or conclude on legal matters — it presents facts and flags when the examiner should consult with legal counsel.

---

### 3.2 Statutory Duty-to-Loop Mapping

| Statutory Duty | AI Provides | Examiner Must Do |
|----------------|------------|-----------------|
| **Investigation (Ins. Code 790.03(h)(3); CCR 10109)** | Organize and summarize claim documents; highlight key medical findings; identify information gaps | Conduct investigation; evaluate evidence; make factual determinations |
| **Timely coverage determination (Ins. Code 790.03(h)(5))** | Track timeline; alert when deadline approaching; present relevant policy language and claim facts | Make accept/deny decision; provide written explanation |
| **Good faith settlement (Ins. Code 790.03(h)(6))** | Present comparable claims data; calculate statutory benefits; summarize medical evidence | Determine fair settlement amount; negotiate; authorize payment |
| **Reasonable explanation for denial (Ins. Code 790.03(h)(14))** | Identify factual basis for denial; surface relevant policy provisions | Draft denial letter with specific reasons; ensure legal sufficiency (**consult counsel if legal issues involved**) |
| **TD payment timing (LC 4650)** | Calculate TD rates; track 14-day payment deadlines; flag overdue payments | Authorize payments; ensure correct amounts |
| **UR decisions (LC 4610)** | Match treatment requests against MTUS/ACOEM guidelines; identify guideline support or conflict | Make treatment authorization decision; ensure UR program compliance |
| **Claim file documentation (CCR 10101-10103)** | Organize documents; generate activity summaries; maintain chronology | Ensure completeness and accuracy of file |
| **Reserve setting** | Analyze comparable claims; calculate exposure components; flag adverse development indicators | Set and adjust reserves based on professional judgment |
| **Counsel referral** | Flag litigation triggers; identify claims with characteristics associated with higher litigation rates | Decide whether and when to refer to defense counsel |

---

### 3.3 What AI Can Do: Information and Facts Only

AI in AdjudiCLAIMS operates exclusively in the **informational, factual, and computational** domain:

**Factual Summaries**
- Summarize medical records with key findings: diagnoses, treatment history, work restrictions, WPI ratings
- Generate claim chronologies from uploaded documents
- Extract and organize data: dates, providers, treatments, costs
- Identify gaps in medical evidence or missing documentation

**Regulatory Deadline Tracking**
- Calculate and track all statutory deadlines (14-day TD payment, 40-day coverage determination, UR response times)
- Generate alerts as deadlines approach
- Track DWC filing requirements and audit preparation deadlines

**Benefit Calculations**
- Calculate TD rates using statutory formula (2/3 AWE within min/max — LC 4653)
- Calculate PD advance amounts
- Compute benefit offsets and credits
- Track aggregate TD limits (LC 4654)

**Statistical Comparisons**
- Present comparable claims data (similar injury, body part, occupation, venue)
- Display average resolution ranges for similar claims
- Track claim development against benchmarks

**Guideline Matching**
- Match treatment requests against MTUS/ACOEM guidelines
- Identify whether requested treatment has guideline support
- Present relevant guideline citations for UR review

**Issue Flagging**
- Identify potential issues for examiner review (NOT legal conclusions — see §3.5 below)
- Flag claims with characteristics associated with higher complexity
- Alert to potential fraud indicators based on factual patterns

---

### 3.4 What Only the Adjuster Can Do

The following decisions are **non-delegable** — the examiner must exercise independent professional judgment:

| Decision | Why Non-Delegable | AI's Role |
|----------|-------------------|-----------|
| **Accept or deny the claim** | Coverage determination requires human judgment (Ins. Code 790.03(h)(5)) | Present relevant facts and policy provisions; examiner decides |
| **Set and adjust reserves** | Financial judgment with actuarial implications | Provide comparable claims data and exposure analysis; examiner sets amount |
| **Authorize or dispute medical treatment** | UR decision requires clinical/regulatory judgment (LC 4610) | Present guideline matching results; examiner makes authorization decision |
| **Determine whether to refer to counsel** | Case management decision with legal implications | Flag litigation triggers and complexity indicators; examiner decides |
| **Authorize settlement amount** | Financial and strategic decision; may involve legal issues | Present comparable resolution data; examiner sets authority |
| **Direct defense counsel on case objectives** | Business judgment — sets parameters for legal representation | Provide claim data for counsel communication; examiner directs |
| **Approve or deny lien claims** | May involve legal analysis of lien validity | Present lien amounts and filing data; **examiner consults counsel for legal issues** |
| **Report suspected fraud** | Factual and regulatory decision with legal consequences | Flag factual indicators; examiner evaluates and reports |

---

### 3.5 THE UPL BOUNDARY FRAMEWORK — Three-Zone Model

This framework operationalizes the UPL prohibition for AdjudiCLAIMS. Every AI output must be classified into one of three zones that determine how the output is framed and what guardrails apply.

**⚠️ LEGAL REVIEW REQUIRED:** This framework is a product design proposal, not a legal opinion. The boundaries between zones must be reviewed by legal counsel before implementation.

---

#### GREEN ZONE — AI Freely Provides

**Definition:** Factual, arithmetic, or procedural information that does not involve legal analysis, legal interpretation, or legal conclusions.

**Framing:** Outputs are presented as factual statements. No legal disclaimer needed beyond standard product disclaimer.

| Output Type | Example | Why GREEN |
|------------|---------|-----------|
| **Factual medical record summaries** | "The QME report dated 3/15/2026 identifies a 12% WPI for the lumbar spine based on DRE Category III" | Presenting extracted facts from a document |
| **Statutory benefit calculations** | "Based on AWE of $1,200, the TD rate is $800/week (2/3 × $1,200), within the 2026 min/max range" | Arithmetic using statutory formula |
| **Regulatory deadline calculations** | "The 14-day TD payment deadline under LC 4650 is April 4, 2026" | Calendar calculation from statutory requirement |
| **MTUS guideline matching** | "The requested lumbar fusion is addressed in MTUS Chronic Pain Guidelines, Section 4.3. The guideline criteria include: [list criteria]" | Presenting published guideline content |
| **Document organization** | "This claim file contains 47 documents: 12 medical reports, 8 correspondence items, 15 DWC forms..." | Factual inventory |
| **Payment history** | "Total TD paid to date: $24,000 over 30 weeks. Last payment: $800 on 3/14/2026" | Factual financial summary |
| **Prior claims data** | "WCIS shows two prior claims for this employee: 2019 (right knee, closed) and 2022 (left shoulder, open)" | Presenting factual database records |

---

#### YELLOW ZONE — AI Provides with Mandatory Disclaimer and "Consult Legal Counsel" Trigger

**Definition:** Information that identifies potential legal issues, presents data with legal implications, or summarizes information that could inform legal analysis — without itself constituting legal analysis.

**Framing:** Outputs must include a standardized disclaimer and a "consult legal counsel" recommendation. The AI identifies the issue; it does NOT analyze the legal implications.

**Mandatory disclaimer language:**

> **This information may involve legal issues. Consult with assigned defense counsel before making decisions based on this information.**

| Output Type | Example | Why YELLOW |
|------------|---------|------------|
| **Issue identification** | "This claim involves cumulative trauma with multiple employer exposure periods. Cumulative trauma claims may raise apportionment and employer liability questions. **Consult defense counsel for analysis of legal issues.**" | Identifying that a legal issue exists is factual; analyzing the issue would be legal advice |
| **Comparable claim outcomes** | "Similar claims (lumbar spine, 12% WPI, defense venue, represented applicant) have resolved in a range of $45,000-$85,000 based on [N] comparable claims. **These figures reflect historical outcomes, not a legal evaluation of this claim's value. Consult defense counsel for case valuation.**" | Statistical data could inform settlement strategy — a legal activity |
| **Medical inconsistency flags** | "The treating physician reports 25% WPI; the QME reports 12% WPI for the same body part and condition. This discrepancy may be relevant to the medical-legal evaluation. **Consult defense counsel regarding implications for the claim.**" | Identifying inconsistencies is factual; interpreting their legal significance is legal analysis |
| **Litigation risk indicators** | "This claim has characteristics associated with higher litigation rates: cumulative trauma, psychiatric overlay, applicant attorney representation, disputed medical. [X]% of comparable claims with these characteristics were referred to defense counsel. **This is statistical information, not a legal recommendation.**" | Statistical correlation is factual; recommending litigation strategy is legal analysis |
| **Subrogation indicators** | "The injury description references a third-party involvement (motor vehicle accident). Third-party involvement may implicate subrogation rights. **Consult defense counsel regarding subrogation analysis.**" | Identifying that a third-party exists is factual; analyzing subrogation rights is legal |
| **Benefit dispute indicators** | "The applicant's claimed AWE of $2,400 exceeds the employer's payroll records showing $1,800. This discrepancy may affect benefit calculations. **Consult defense counsel if the dispute cannot be resolved factually.**" | Factual discrepancy; resolution may require legal analysis |

---

#### RED ZONE — AI Must NOT Provide; Mandatory Attorney Referral

**Definition:** Legal conclusions, legal analysis, legal advice, statutory interpretation, case law application, or any output that constitutes the practice of law.

**Framing:** The AI blocks the output entirely and replaces it with a mandatory attorney referral message.

**Mandatory referral language:**

> **This question involves a legal issue that requires analysis by a licensed attorney. Contact your assigned defense counsel or in-house legal department for guidance.**

| Blocked Output Type | Why RED | What AI Does Instead |
|--------------------|---------|--------------------|
| **Legal conclusions about case strength** | "This is a strong/weak claim" is a legal opinion | Present factual evidence only; attorney evaluates strength |
| **Coverage opinions** | "Coverage exists/does not exist under this policy" is a legal conclusion | Present policy language and claim facts; examiner consults counsel |
| **Settlement value based on legal analysis** | "This case is worth $X because of [legal reasoning]" is legal advice | Present comparable claim statistics (YELLOW zone); counsel provides valuation |
| **Apportionment legal analysis** | "Under Benson/Vigil, the apportionment argument is..." is case law interpretation | Flag apportionment as an issue (YELLOW zone); attorney analyzes law |
| **Interpretation of ambiguous statutes** | "LC [section] means..." when the meaning is disputed is legal interpretation | Present statutory text (GREEN zone); attorney interprets |
| **Advice on legal strategy** | "You should deny this claim because..." or "You should settle because..." is legal advice | Present facts and data; examiner decides with counsel guidance |
| **Analysis of applicant attorney arguments** | "The applicant's legal position is strong/weak because..." is legal analysis | Attorney evaluates opposing arguments |
| **Recommended legal positions for WCAB proceedings** | Drafting or recommending positions for tribunal submission is practicing law | Attorney handles all WCAB submissions |
| **Advice on handling unrepresented injured workers' legal questions** | Answering legal questions for injured workers is UPL | Direct examiner to refer worker to information & assistance officer or suggest the worker consult an attorney |

---

### 3.6 The Fundamental Principle

> **The same AI output can be lawful practice-of-law assistance in the attorney product and unauthorized practice of law in AdjudiCLAIMS.**

Example: "Based on Benson v. WCAB and the QME's 12% WPI finding, the defense has a strong apportionment argument that could reduce PD exposure by approximately 40%."

- **In the attorney product:** This is a valid legal research output for a licensed attorney to evaluate and use. The attorney decides whether to assert this argument. ✅
- **In AdjudiCLAIMS:** This is legal analysis provided to a non-lawyer — an interpretation of case law applied to specific facts. This is UPL. ❌

**The AdjudiCLAIMS equivalent:** "The QME report identifies 12% WPI for the lumbar spine. The report addresses apportionment and identifies pre-existing degenerative changes. Apportionment may be a legal issue in this claim. **Consult defense counsel for analysis.**" ✅

The content changes. The framing changes. The guardrails change. The underlying AI capability is the same — but the legal permissibility depends on WHO the user is.

---

## Part 4: Adjudica Product Adaptation for Examiners

### 4.1 Feature-to-Duty Mapping (Planned Phase 2 Capabilities)

| Planned Feature | Examiner Duty Served | Zone | Notes |
|----------------|---------------------|------|-------|
| **Medical record analysis** | Medical management (§2.2); Investigation (§2.1) | GREEN | Factual extraction and summarization only |
| **Reserve adequacy analysis** | Reserve setting (§2.3) | GREEN/YELLOW | Comparable data = GREEN; implications for settlement = YELLOW |
| **Treatment authorization support** | UR decisions (LC 4610) | GREEN | MTUS/ACOEM guideline matching; examiner decides |
| **Litigation risk scoring** | Counsel referral (§2.4) | YELLOW | Statistical indicators, not legal conclusions |
| **Regulatory deadline tracking** | Compliance (§2.5) | GREEN | Calendar calculations from statutory requirements |
| **Benefit calculation** | TD/PD payments (LC 4650-4657) | GREEN | Statutory arithmetic |
| **Defense counsel oversight** | Attorney direction (§2.4) | GREEN/YELLOW | Billing data = GREEN; case strategy = RED (blocked) |
| **Apportionment data presentation** | Investigation (§2.1) | GREEN/YELLOW | Medical data = GREEN; legal analysis = RED (blocked) |
| **Claim summary generation** | Case management (§2.1) | GREEN | Factual chronology only |
| **Fraud indicator detection** | Investigation (§2.1) | GREEN | Factual pattern identification |

---

### 4.2 Zone-Classified Feature Map

#### GREEN Zone Features (No Restrictions Beyond Standard Disclaimer)

- Medical record summarization with extracted findings
- TD/PD benefit rate calculations
- Regulatory deadline calculation and tracking
- DWC form data extraction and organization
- Claim chronology generation
- Document inventory and organization
- Payment history and financial summary
- MTUS/ACOEM guideline matching for UR
- Prior claims data presentation
- Provider network verification

#### YELLOW Zone Features (Mandatory Disclaimer + "Consult Counsel" Trigger)

- Comparable claims outcome statistics
- Litigation risk indicator scoring
- Medical evidence inconsistency flags
- Subrogation potential identification
- Cumulative trauma / multi-employer exposure identification
- Psychiatric overlay identification
- Reserve adequacy analysis with comparable benchmarks
- Defense counsel billing comparison data

#### RED Zone Features (Blocked — Mandatory Attorney Referral)

- Legal case evaluation or strength assessment
- Coverage opinion generation
- Settlement value analysis based on legal reasoning
- Apportionment legal analysis
- Case law interpretation or application
- Legal strategy recommendations
- Position statement or legal document drafting
- Advice on handling unrepresented claimant legal questions

---

### 4.3 Mandatory "Seek Legal Counsel" Trigger List

The following conditions MUST trigger a mandatory "Consult defense counsel" message, regardless of the AI output's zone classification:

1. **Coverage dispute or ambiguous policy language** — Any time the examiner encounters a coverage question that cannot be resolved by clear policy terms
2. **Subrogation questions involving third-party liability** — Third-party involvement requires legal analysis of contribution and recovery rights
3. **Apportionment disputes requiring legal analysis** — When medical evidence on apportionment is conflicting or legally contested
4. **Lien claims requiring legal evaluation** — Lien validity, priority, and settlement allocation involve legal determinations
5. **Fraud indicators requiring investigation guidance** — Fraud referral and investigation strategy involves legal process
6. **Applicant asks the examiner legal questions** — The examiner must never provide legal advice to an injured worker; refer to I&A officer or suggest consultation with an attorney
7. **Multi-state jurisdictional questions** — Choice of law and jurisdictional analysis is legal practice
8. **Penalty exposure assessment** — Whether LC 5814 penalties apply involves legal analysis
9. **Serious and willful misconduct allegations** — LC 4553 claims involve heightened legal complexity
10. **Death benefit disputes** — LC 4700-4706 death benefits involve complex legal issues including dependency determinations
11. **Any question phrased as "should I..."** regarding legal strategy, claim denial, or settlement — The word "should" in a legal context implies advisory judgment that constitutes legal practice

---

### 4.4 Legal Issue Detection and Attorney Referral Workflow

When the AI detects that a question or claim situation approaches the YELLOW or RED zone, the system follows this workflow:

```
Step 1: DETECT
  AI identifies that the examiner's query or the claim data involves
  a legal issue (using keyword detection, issue classification, and
  context analysis)

Step 2: CLASSIFY
  AI classifies the issue:
  - YELLOW: Present information + disclaimer + "consult counsel"
  - RED: Block output + mandatory attorney referral

Step 3: INFORM (YELLOW) or BLOCK (RED)
  YELLOW: AI provides the factual information with mandatory
  disclaimer language and "consult counsel" trigger

  RED: AI blocks the legal output and displays:
  "This question involves a legal issue that requires analysis by a
  licensed attorney. Contact your assigned defense counsel or
  in-house legal department for guidance."

Step 4: ASSIST REFERRAL
  AI helps the examiner prepare the referral to counsel by generating:
  - Factual summary of the claim relevant to the legal issue
  - Identification of the legal issue detected
  - Summary of relevant medical and claim data
  - Timeline of key events

  The AI HELPS the examiner communicate with counsel effectively.
  It does NOT answer the legal question.

Step 5: LOG
  All zone classifications, disclaimers, blocks, and referrals
  are logged in the audit trail for compliance review.
```

---

### 4.5 Strict Informational Framing Requirements

All AI outputs in AdjudiCLAIMS must use **factual framing** — never advisory framing.

#### Permitted Language Patterns

| Pattern | Example |
|---------|---------|
| "The records indicate..." | "The records indicate the applicant was seen by Dr. Smith on 3/15/2026 with complaints of lumbar pain" |
| "Based on the claim data..." | "Based on the claim data, the current TD rate is $800/week" |
| "The guideline states..." | "The MTUS guideline states that lumbar fusion is indicated when [criteria]" |
| "Comparable claims show..." | "Comparable claims with similar characteristics have resolved in the range of $X-$Y" |
| "[N]% of similar claims..." | "78% of similar claims with these characteristics were referred to defense counsel" |
| "The statute requires..." | "LC 4650 requires the first TD payment within 14 days of employer knowledge" |
| "This claim has [characteristic]..." | "This claim has multiple body parts, cumulative trauma, and applicant representation" |

#### Prohibited Language Patterns

| Pattern | Why Prohibited | What to Use Instead |
|---------|---------------|-------------------|
| "You should..." | Advisory — implies recommendation | "The data shows... [examiner decides]" |
| "The best strategy is..." | Legal/strategic advice | "Consult defense counsel regarding strategy" |
| "The law requires you to..." | Legal interpretation for a non-lawyer | "The statute states [quoted text]; consult counsel for application to this claim" |
| "This claim is worth..." | Legal valuation | "Comparable claims have resolved in the range of..." |
| "The defense has a strong/weak..." | Legal analysis of case strength | "Consult defense counsel for case evaluation" |
| "You should deny because..." | Legal advice on coverage | "Present the following facts to defense counsel for coverage analysis" |
| "Under [case name], the applicant..." | Case law interpretation | "Consult defense counsel regarding applicable case law" |

---

### 4.6 Worked Examples: Correct vs. Incorrect AI Output Framing

#### Example 1: Reserve Adequacy

| | Output |
|--|--------|
| **INCORRECT (Legal Conclusion)** | "You should increase reserves to $85,000 because the applicant will likely receive a higher PD rating based on the QME's findings, and under current case law the defense's apportionment argument is unlikely to succeed." |
| **CORRECT (Factual Information)** | "Current reserves: $55,000. Comparable claims with similar injury profile (lumbar spine, 12% WPI, represented applicant, defense venue) have resolved in the range of $60,000-$90,000 based on 43 comparable claims in the Knowledge Base. The QME report identifies 12% WPI; the treating physician identified 25% WPI. This discrepancy may be relevant to case valuation. **Consult defense counsel for case evaluation and reserve recommendation.**" |

#### Example 2: Treatment Authorization

| | Output |
|--|--------|
| **INCORRECT (Legal Advice)** | "You should deny this lumbar fusion request because it exceeds MTUS guidelines and the applicant's condition does not meet the surgical criteria. The denial will likely be upheld at IMR." |
| **CORRECT (Guideline Matching)** | "The requested lumbar fusion is addressed in MTUS Chronic Pain Guidelines, Section 4.3. The guideline criteria for lumbar fusion include: [listed criteria]. Based on the medical records in the claim file, the following criteria appear to be met: [list]. The following criteria do not appear to be documented: [list]. **This guideline matching is provided for your review in making a UR determination. Consult with the UR physician reviewer for clinical assessment.**" |

#### Example 3: Litigation Referral

| | Output |
|--|--------|
| **INCORRECT (Legal Analysis)** | "This case should be referred to defense counsel because the applicant's attorney will argue cumulative trauma under LC 5500.5, and the defense will need to develop apportionment arguments under Benson and Escobedo to limit employer liability." |
| **CORRECT (Statistical Information)** | "This claim has characteristics associated with higher litigation rates: cumulative trauma with 8 years of exposure, applicant represented by attorney (since 2/15/2026), disputed medical evidence (treating physician and QME WPI discrepancy), psychiatric overlay claimed. 91% of cumulative trauma claims with attorney involvement proceed to litigation *(CWCI CT study)*. **This is statistical information for your claims management decision. If you determine counsel referral is appropriate, the AI can generate a factual claim summary for your referral communication.**" |

#### Example 4: Injured Worker Question

| | Output |
|--|--------|
| **INCORRECT (Legal Advice to Non-Client)** | "The injured worker asked whether they should get a lawyer. Tell them that given the complexity of their claim, legal representation would be advisable." |
| **CORRECT (Regulatory Compliance)** | "**Ins. Code § 790.03(h)(15) prohibits directly advising a claimant not to obtain the services of an attorney.** You may inform the injured worker that they have the right to consult an attorney. You may also direct them to the DWC Information and Assistance Officer at their local DWC district office. You may NOT advise them on whether to retain legal representation. **If the worker has specific legal questions, direct them to an attorney or to DWC I&A.**" |

---

## Part 5: Examiner Duties vs. Adjudica Platform Architecture — Design Specification

This section maps each statutory and non-statutory duty of the WC claims examiner to how the Adjudica platform architecture must be adapted for Phase 2 (AdjudiCLAIMS). Unlike the attorney document's Part 5 (which maps to production features), this section is a **design specification** — AdjudiCLAIMS does not yet exist.

**Design constraint:** Every capability described below reuses existing Adjudica AI infrastructure (RAG, Document AI, classification, timeline, chat, form fill) but applies the Green/Yellow/Red UPL zone framework from Part 3.5 to every output. The same underlying AI pipeline serves both products; the framing, guardrails, and output filters differ.

**Source:** Adjudica AI App architecture at `/home/vncuser/Desktop/adjudica-ai-app/` (explored 2026-03-21). Existing platform: React Router 7 + Fastify 5 + Prisma 6 + PostgreSQL/pgvector + Vertex AI + Claude 3.5 Sonnet + Google Document AI.

---

### 5.1 Statutory Duties → Platform Adaptation

#### Insurance Code — Fair Claims Settlement Practices

| Statutory Duty | Existing Adjudica Capability to Reuse | Required Adaptation for AdjudiCLAIMS | UPL Zone |
|---------------|--------------------------------------|----------------------------------------|----------|
| **Ins. Code 790.03(h)(2) — Acknowledge claims promptly** | Timeline/event extraction (`event-generation.service.ts`) already tracks dates | Add claims-specific deadline engine: auto-calculate 15-day acknowledgment deadline from claim receipt date; generate regulatory alerts | GREEN — deadline calculation is arithmetic |
| **Ins. Code 790.03(h)(3) — Prompt investigation standards** | Document ingestion pipeline (OCR → classification → extraction → timeline) processes all claim documents | Reuse entire document pipeline. Add investigation checklist tracker: flag missing standard investigation items (recorded statement, medical records, employer report, index bureau) | GREEN — factual checklist of documents received vs. expected |
| **Ins. Code 790.03(h)(5) — Affirm or deny within reasonable time** | Timeline tracks deadlines; Form Fill pre-populates forms | Add 40-day coverage determination deadline tracker. Present policy language and claim facts side-by-side. **DO NOT generate coverage opinion** | GREEN (deadline tracking) / RED (coverage opinion blocked) |
| **Ins. Code 790.03(h)(6) — Good faith settlement** | Knowledge Base has comparable claims data; Case Chat can retrieve case outcomes | Present comparable claims statistics (range, median, distribution). **Frame as data, NOT as settlement recommendation.** Mandatory disclaimer on all output | YELLOW — comparable data has legal implications; requires "consult counsel" trigger |
| **Ins. Code 790.03(h)(10) — Payment with explanation** | Form Fill generates structured forms; Template Drafts generate correspondence | Generate benefit payment explanation letters from claim data. Pre-populate statutory basis (LC section, benefit rate, calculation). Factual framing only | GREEN — statutory benefit calculations are arithmetic |
| **Ins. Code 790.03(h)(14) — Explanation of denial** | Template Drafts + Custom Drafts generate documents | **CRITICAL UPL BOUNDARY:** AI can populate factual basis of denial (dates, medical findings, policy provisions cited). AI CANNOT draft the legal reasoning for denial. Mandatory: "This denial letter must be reviewed by legal counsel before issuance" | YELLOW (factual population) / RED (legal reasoning for denial blocked) |
| **Ins. Code 790.03(h)(15) — Never advise against attorney** | Case Chat has guardrails | Hard-block any output that could be interpreted as discouraging legal representation. Auto-detect questions about "should claimant get lawyer" and redirect to DWC I&A referral language | RED — any advice about legal representation is blocked |

#### DOI Regulations — Fair Claims Settlement Practices

| Regulatory Requirement | Existing Capability | Required Adaptation | UPL Zone |
|----------------------|--------------------|--------------------|----------|
| **10 CCR 2695.5(b) — 15-day acknowledgment** | Timeline deadline tracking | Regulatory compliance dashboard: show all claims with days-since-receipt, color-coded by urgency (green <10 days, yellow 10-14 days, red ≥15 days) | GREEN |
| **10 CCR 2695.7(b) — 40-day accept/deny** | Timeline deadline tracking | Same compliance dashboard: 40-day coverage determination deadline for each claim | GREEN |
| **10 CCR 2695.7(c) — 30-day delay notification** | Template Drafts | Auto-generate delay notification letters when claim approaches 40-day deadline without determination. Pre-populate with factual reason for delay. Examiner reviews and sends | GREEN — procedural compliance correspondence |
| **10 CCR 2695.7(h) — Written denial explanation** | See Ins. Code 790.03(h)(14) above | Same adaptation — factual population only, legal reasoning blocked | YELLOW/RED |
| **10 CCR 2695.3 — File documentation** | Immutable audit trail (`audit-logger.ts`, 24 event types, 7-year retention) | Reuse audit trail directly. Add examiner-specific event types: benefit payment, reserve change, UR decision, counsel referral, investigation activity | GREEN |
| **10 CCR 2695.7(a) — Fair investigation** | Document classification (12 types, 150+ subtypes) + field extraction | Investigation completeness tracker: compare uploaded documents against expected document types for claim characteristics. Flag gaps (e.g., "No QME report uploaded for disputed medical claim") | GREEN — factual gap analysis |
| **10 CCR 2695.9 — WC-specific standards** | All WC-specific features (classification taxonomy, medical subtypes, DWC form coverage) | Existing platform is already CA WC-specialized. Reuse classification taxonomy, medical subtypes, and regulatory deadline calculations | GREEN |

#### DWC Claims Administration Regulations

| Regulatory Requirement | Existing Capability | Required Adaptation | UPL Zone |
|----------------------|--------------------|--------------------|----------|
| **CCR 10101 — Claim file contents** | Document management with classification | Claim file completeness dashboard: show all required file components per CCR 10101 and whether each is present. Factual inventory, not compliance opinion | GREEN |
| **CCR 10103 — Claim log maintenance** | Audit trail logs all system activity | Extend audit trail to generate CCR 10103-compliant claim log format. Auto-log all examiner actions on each claim | GREEN |
| **CCR 10109 — Duty to investigate** | Document ingestion + classification + field extraction | Investigation tracker: auto-identify what investigation steps have been completed vs. outstanding. Present as factual checklist. **Do NOT advise on whether investigation is "sufficient" — that may be a legal determination** | GREEN (checklist) / YELLOW (sufficiency determination requires "consult counsel") |
| **CCR 10105-10108 — Audit readiness** | Immutable audit trail with 7-year retention | Audit preparation report: generate claim file summary with document inventory, timeline of activity, and compliance timeline. Factual compilation for audit response | GREEN |

#### Labor Code — WC-Specific

| Statutory Duty | Existing Capability | Required Adaptation | UPL Zone |
|---------------|--------------------|--------------------|----------|
| **LC 4650 — TD payment within 14 days** | Claim data extraction (AWE, injury date) + Form Fill | TD payment calculator: compute rate from AWE using statutory formula (2/3 AWE within min/max). Track 14-day deadline from employer knowledge date. Generate payment authorization worksheet | GREEN — statutory arithmetic |
| **LC 4650(d) — Payment during investigation** | Timeline tracking | Alert when 14-day deadline approaches even if investigation incomplete. Present LC 4650(d) requirement text. Examiner decides whether to begin payment | GREEN (deadline alert + statute text) |
| **LC 4610 — Utilization Review** | Knowledge Base has 75 CCR 9792.x records (comprehensive UR regulations) + MTUS data | UR decision support: match treatment request against MTUS/ACOEM guidelines. Present guideline criteria and whether documentation supports each criterion. **Frame as clinical guideline matching, NOT as treatment recommendation** | GREEN — guideline matching is clinical, not legal |
| **LC 4060-4062 — QME/AME process** | Medical record extraction + classification (28 medical subtypes) | QME/AME process tracker: identify where claim is in medical-legal evaluation process. Track panel request dates, appointment dates, report due dates. **Do NOT advise on QME/AME strategy — that is legal** | GREEN (process tracking) / RED (evaluation strategy blocked) |
| **LC 3761-3762 — Employer notification** | Template Drafts + claim data | Generate employer notification letters pre-populated with claim data per LC 3761 requirements (within 15 days). Examiner reviews and sends | GREEN — regulatory compliance correspondence |

---

### 5.2 Non-Statutory Duties → Platform Adaptation

| Practice Activity | Existing Adjudica Feature to Reuse | Examiner-Specific Adaptation | UPL Zone Classification |
|------------------|------------------------------------|-----------------------------|------------------------|
| **Claims Investigation (§2.1)** | Document ingestion pipeline (OCR → classify → extract → timeline) | Reuse entire pipeline. Add investigation checklist by claim type. Three-point contact tracker (injured worker, employer, medical provider). Recorded statement management. Index bureau/prior claims integration | GREEN — factual document processing and tracking |
| **Medical Management (§2.2)** | Document classification (28 medical subtypes), field extraction (WPI, diagnoses, restrictions), UR regulation data (75 CCR 9792.x records) | Medical record summary dashboard: extracted findings by provider, by date, with discrepancy flags. MTUS guideline matching for UR decisions. Treatment authorization worksheet. **All medical data presentation, no treatment recommendations** | GREEN (summaries, guideline matching) / YELLOW (discrepancy flags — "consult UR physician") |
| **Reserve Setting (§2.3)** | Knowledge Base has comparable claims data | Reserve analysis workbench: present comparable claims by injury type, body part, WPI, venue, representation status. Show statistical distribution (range, median, quartiles). **Present data only — no reserve recommendation.** Examiner sets reserves using professional judgment | GREEN (statistical data) / YELLOW (comparable outcomes — mandatory disclaimer) |
| **Litigation Management (§2.4)** | Case Chat, Template Drafts, audit trail | Counsel referral workflow: when examiner decides to refer, AI generates factual claim summary for defense counsel (injury details, medical status, exposure analysis, timeline). **AI helps examiner communicate with counsel — does NOT provide legal analysis.** Billing review dashboard: defense counsel invoices vs. billing guidelines | GREEN (factual summaries for counsel) / RED (legal strategy, case evaluation blocked) |
| **Regulatory Compliance (§2.5)** | Timeline/deadline tracking, audit trail, Form Fill | Compliance dashboard: all regulatory deadlines across all claims (15-day acknowledge, 40-day determination, 14-day TD payment, UR response times, DWC filing deadlines). Color-coded by urgency. Auto-generate compliance reports for audit preparation | GREEN — deadline tracking and compliance reporting is arithmetic/procedural |

---

### 5.3 Adjudica Services — AdjudiCLAIMS Reuse and Modification Map

This table shows exactly which existing Adjudica AI services can be reused for AdjudiCLAIMS, which require modification, and which are new.

| Existing Service | Reuse for Examiner? | Modification Required | UPL Risk |
|-----------------|--------------------|-----------------------|----------|
| **Google Document AI (OCR)** | ✅ Direct reuse | None — OCR is format-agnostic | None |
| **Document Classification** (12 types, 150+ subtypes) | ✅ Direct reuse | May need additional examiner-specific subtypes (e.g., benefit notices, employer reports, DOI correspondence) | None |
| **Document Field Extraction** | ✅ Direct reuse | Add examiner-specific extraction schemas (policy numbers, coverage dates, employer data, AWE data) | None |
| **Vector Embedding & RAG Retrieval** | ✅ Direct reuse | None — retrieval infrastructure is user-agnostic | None |
| **Event/Timeline Generation** | ✅ Direct reuse | Add examiner-specific date types (benefit payment dates, UR decision dates, compliance deadlines) | None |
| **Form Fill (RAG)** | ✅ Reuse with modification | Retarget from DWC legal forms to claims administration forms (benefit notices, payment authorizations, employer notifications). Same RAG pipeline, different form templates | Low — claims forms are administrative |
| **Case Chat** | ⚠️ Reuse with MAJOR modification | **Must apply UPL zone filter to every response.** Chat must detect when query approaches YELLOW/RED zone and apply appropriate framing or blocking. System prompt must enforce factual-only framing. Prohibited language patterns must be hard-coded into response validation. This is the highest-risk service for UPL | **HIGH** — chat is the primary vector for UPL violation |
| **Draft Chat (tool-calling)** | ⚠️ Reuse with MAJOR modification | Restrict available tools to examiner-appropriate actions only. Remove tools that could generate legal content. Add UPL validation layer on all tool outputs | **HIGH** |
| **Template Drafts** | ✅ Reuse with modification | Create examiner-specific templates (status reports to management, employer notifications, benefit letters, UR correspondence). **Exclude legal document templates** (position statements, settlement docs, legal correspondence) | Medium — must ensure templates don't produce legal content |
| **Custom Drafts** | ⚠️ Reuse with MAJOR modification | **Restrict to factual documents only.** Block any prompt requesting legal analysis, legal correspondence, or legal strategy documents. Validate output against prohibited language patterns before delivery | **HIGH** |
| **Claim Data Enrichment** | ✅ Direct reuse | Already extracts employer, insurer, injury data — directly relevant to examiner workflow | None |
| **Classification Correction Learning** | ✅ Direct reuse | Same correction loop applies to examiner document classification | None |
| **Audit Trail** | ✅ Direct reuse | Add examiner-specific event types (benefit payment, reserve change, UR decision, counsel referral) | None |
| **RBAC/Access Control** | ⚠️ Reuse with modification | New role: `Claims Examiner` (separate from Attorney/Clerk). Different permission set — no access to legal analysis features. Matter-level isolation between attorney-side and AdjudiCLAIMS-side data | Medium — must enforce data boundaries |
| **Knowledge Base Integration** | ⚠️ Reuse with MAJOR modification | **Examiner access must be restricted to regulatory sections only** (Labor Code, CCR, Insurance Code). Case law access must be blocked or heavily restricted — case law interpretation is legal analysis (RED zone). Statistical/outcome data may be accessible (YELLOW zone) | **HIGH** — KB contains legal analysis that would be UPL for examiners |
| **Workflow Automation** | ✅ Reuse with modification | Examiner-specific workflow triggers (new claim → generate investigation checklist; document upload → classify and extract; deadline approaching → generate compliance alert) | Low |
| **MerusCase Integration** | ❌ Not applicable | AdjudiCLAIMS would integrate with claims management systems (Guidewire, Duck Creek, Origami Risk), not legal practice management | N/A — new integrations needed |

---

### 5.4 The Chat UPL Filter — AdjudiCLAIMS's Critical Technical Challenge

The Case Chat service (`case-chat.service.ts`) is the **highest UPL risk component** in AdjudiCLAIMS because it generates free-text responses to user queries. Unlike Form Fill (structured fields) or Timeline (dates/events), chat can produce any text — including legal analysis.

**Required implementation: UPL Response Filter**

```
┌─────────────────────────────────────────────┐
│ EXAMINER CHAT REQUEST                       │
│ "Should I deny this claim?"                 │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ STEP 1: QUERY CLASSIFICATION                │
│ Classify incoming query against UPL zones:  │
│ - GREEN: Factual/data query                 │
│ - YELLOW: Issue identification query        │
│ - RED: Legal advice/analysis query          │
│                                             │
│ "Should I deny" → RED (advisory language    │
│  + coverage determination = legal advice)   │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ STEP 2: ZONE-APPROPRIATE RESPONSE           │
│                                             │
│ GREEN: Generate response normally with      │
│        factual framing                      │
│                                             │
│ YELLOW: Generate response + append          │
│         mandatory disclaimer + "consult     │
│         counsel" language                   │
│                                             │
│ RED: BLOCK the query. Return:               │
│      "This question involves a legal issue. │
│       Contact your assigned defense counsel │
│       or in-house legal for guidance.        │
│                                             │
│       I can help you prepare a factual      │
│       claim summary for your counsel        │
│       referral. Would you like me to        │
│       generate one?"                        │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ STEP 3: OUTPUT VALIDATION                   │
│ Before delivering ANY response, validate:   │
│ - No prohibited language patterns           │
│   ("you should", "the law requires",        │
│    "under [case name]", "strong/weak case") │
│ - No legal conclusions                      │
│ - No case law citations (RED zone)          │
│ - Factual framing only                      │
│ - Disclaimer present if YELLOW              │
│                                             │
│ If validation fails → rewrite or block      │
└─────────────────────────────────────────────┘
```

**Implementation approach:** Add a UPL classification layer to the existing chat system prompt. The AdjudiCLAIMS system prompt would include:

1. **Role definition:** "You are a claims information assistant. You provide factual information about claims. You do NOT provide legal advice, legal analysis, or legal conclusions."
2. **Prohibited output patterns:** Hard-coded list of phrases that trigger output blocking
3. **Mandatory referral triggers:** Pattern matching on queries that implicate legal issues
4. **Output validation:** Post-generation scan of response text against prohibited patterns before delivery to user

**Existing infrastructure to leverage:**
- `source-compliance.service.ts` — already validates citation sources and detects conflicts; can be extended to validate UPL compliance
- `case-chat.prompts.ts` — system prompt customization already exists; examiner prompt would be a separate prompt set
- Langfuse tracing — all examiner chat interactions would be traced for UPL compliance auditing

---

### 5.5 Data Boundary Architecture — Attorney-Side vs. AdjudiCLAIMS-Side

When both the attorney product and AdjudiCLAIMS serve the same claim, data boundaries must prevent UPL through cross-contamination:

| Data Type | Attorney Product Access | AdjudiCLAIMS Access | Boundary Enforcement |
|-----------|----------------------|------------------------|---------------------|
| **Medical records** | Full access — used for legal analysis | Full access — used for claims administration | Same data, different output framing |
| **Attorney work product** (case evaluations, legal analysis, strategy memos) | Full access | **BLOCKED** — attorney work product is privileged and contains legal analysis that would be UPL if surfaced to examiner via AI | Separate document classification: attorney-generated legal analysis excluded from examiner RAG retrieval |
| **Case law / legal principles** (Knowledge Base) | Full access — legal research tool | **Restricted** — regulatory sections (LC, CCR, Ins. Code) accessible; case law analysis BLOCKED | KB access control layer: examiner role cannot query case law categories; regulatory sections only |
| **Claim administration data** (reserves, payments, investigation notes) | Read access — relevant to defense strategy | Full access — examiner's primary data | Standard claims data shared appropriately |
| **Defense counsel communications** | Full access (attorney IS the counsel) | Limited access — billing data and factual status reports only; legal strategy excluded | Communication classification: legal strategy flagged and excluded from examiner AI retrieval |
| **AI-generated legal analysis** (from attorney product) | Full access | **BLOCKED** — AI legal analysis generated for attorney would be UPL if presented to examiner | Hard boundary: attorney-product AI outputs never enter AdjudiCLAIMS RAG corpus |

**Implementation:** The existing multi-tenancy architecture (`LawFirm` isolation in Prisma) provides the foundation. AdjudiCLAIMS would use a parallel tenant structure (`InsuranceOrg` or equivalent) with cross-tenant data sharing rules enforced at the database query level — not just the UI level.

---

### 5.6 Compliance Architecture — How AdjudiCLAIMS Enforces Adjuster-in-the-Loop

| Compliance Layer | Attorney Product Implementation | AdjudiCLAIMS Adaptation |
|-----------------|-------------------------------|---------------------------|
| **Citation on every output** | Citations link to source documents | Same — every factual assertion cites source document. Additionally: regulatory citations link to KB `regulatory_sections` records |
| **Confidence scoring** | Green/yellow/red/blank on form fields | Same visual system — but interpretation differs. Low confidence in examiner context triggers "verify with counsel" rather than just "verify" |
| **UPL zone classification** | Not applicable (attorney IS the professional) | **NEW** — every AI output tagged with GREEN/YELLOW/RED zone. Zone determines framing and disclaimers |
| **Prohibited language filter** | Not applicable | **NEW** — post-generation scan blocks advisory language ("you should", "strong/weak case", case law interpretation) before delivery |
| **Mandatory "consult counsel" triggers** | Not applicable | **NEW** — 11 trigger conditions (§4.3) inject mandatory attorney referral language |
| **Attorney referral workflow** | Not applicable | **NEW** — AI assists examiner in preparing factual summaries for counsel referral rather than answering legal questions |
| **Immutable audit trail** | 24 event types, 7-year retention | Reuse + add examiner-specific events. Additionally: log all UPL zone classifications and blocked outputs for compliance auditing |
| **RBAC enforcement** | Admin/Attorney/Clerk roles | New `Claims Examiner` role with restricted permissions: no legal analysis features, no case law access, no legal document generation |
| **KB access control** | Full access to all KB content | Restricted: regulatory sections (LC, CCR, Ins. Code) only. Case law analysis blocked. Statistical outcome data accessible with YELLOW zone disclaimer |
| **Draft status workflow** | IN_PROGRESS → NEEDS_REVIEW → PUBLISHED | Same workflow. Additionally: certain document types (denial letters, settlement correspondence) require "Legal review completed" certification before publishing |
| **Data boundary enforcement** | Firm-level isolation | Firm-level + product-level isolation. Attorney work product excluded from examiner RAG. Legal analysis outputs excluded from examiner access |

---

## References

### California Insurance Code
- [Ins. Code § 790.03 — Unfair Practices](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=790.03.&lawCode=INS)
- [Ins. Code § 790.06 — Penalties](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=790.06.&lawCode=INS)

### California Code of Regulations — Title 10 (DOI)
- [10 CCR §§ 2695.1-2695.12 — Fair Claims Settlement Practices](https://www.insurance.ca.gov/0250-insurers/0500-legal-info/0200-regulations/fair-claims-settlement-702.cfm)

### California Code of Regulations — Title 8 (DWC)
- [CCR §§ 10100-10118 — Claims Administration](https://www.dir.ca.gov/t8/ch4_5sb1.html)
- [CCR §§ 9792.6-9792.12 — Utilization Review](https://www.dir.ca.gov/t8/ch4_5sb1.html)
- [CCR §§ 10500-10593 — WCAB Rules of Practice](https://www.dir.ca.gov/t8/ch4_5sb2.html)

### California Labor Code — Division 4
- [LC §§ 4060-4062.2 — Medical-Legal Evaluations](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=LAB&division=4.)
- [LC §§ 4600-4610 — Medical Treatment](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=LAB&division=4.)
- [LC §§ 4650-4657 — Temporary Disability](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=LAB&division=4.)
- [LC § 138.4 — EAMS](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=138.4.&lawCode=LAB)
- [LC §§ 3761-3762 — Notice and Disclosure](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=LAB&division=4.)

### California Business and Professions Code
- [B&P §§ 6125-6126 — Unauthorized Practice of Law](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=6125.&lawCode=BPC)

### Case Law (UPL Boundary)
- *People v. Landlords Professional Services, Inc.* (1989) 215 Cal.App.3d 1599
- *Baron v. City of Los Angeles* (1970) 2 Cal.3d 535
- *Janson v. LegalZoom.com, Inc.* (2014) 802 F. Supp. 2d 1053

### Interstate Regulatory Framework
- NAIC Model Unfair Claims Settlement Practices Act
- Florida HB 527 (2024) — Human verification requirement
- Arizona HB 2175 (2024) — Licensed professional review requirement
- California AB 3030 (2024) — AI transparency in healthcare
- Colorado SB 24-205 (2024) — High-impact AI risk management

### Industry Benchmarks
- EvolutionIQ (CCC Intelligent Solutions) — 8-10X ROI, 20-29% cost reduction *(CCC investor presentations)*
- CLARA Analytics — 95% Day-1 triage accuracy *(CLARA marketing materials)*
- WCIRB State of the System reports (annual)
- CWCI Cumulative Trauma study

### Glass Box Documentation
- [INSURANCE_INDUSTRY_STRATEGY.md](../../marketing/strategy/INSURANCE_INDUSTRY_STRATEGY.md)
- [CA_INSURANCE_CODE.md](../../legal/compliance/regulations/CA_INSURANCE_CODE.md)
- [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md)
- [REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](../REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md)
- [KB_REGULATORY_GAP_REPORT.md](KB_REGULATORY_GAP_REPORT.md)

---

**Document Status:** Foundational reference — review annually or upon significant regulatory change
**Owner:** CEO / Product
**Legal Review:** **CRITICAL** — The Green/Yellow/Red zone UPL framework MUST be reviewed by legal counsel before implementation. The boundary between factual information and legal advice is itself a legal question.
**Phase 2 Product Status:** Planned (2027-2028) — this document is forward-looking; AdjudiCLAIMS does not yet exist.

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
