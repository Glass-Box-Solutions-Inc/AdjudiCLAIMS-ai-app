# Workers' Compensation Defense Attorney: Roles, Duties, and the "Attorney in the Loop" Model

**Document Type:** Foundational Product Definition
**Purpose:** Comprehensive enumeration of statutory and non-statutory duties of a California WC defense attorney, with source authority for each assertion, defining the framework for Adjudica's "Attorney in the Loop" product model
**Jurisdiction:** California (primary)
**Last Updated:** 2026-03-21
**Legal Review Required:** Yes — before product decisions based on this document
**Companion Document:** [WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md](WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md)
**Statutory Citations Last Verified:** 2026-03-21 — verify against current law before reliance

---

## Executive Summary

A California Workers' Compensation defense attorney operates under a layered framework of statutory duties, professional conduct obligations, and industry-standard practices. This document catalogs those duties in two categories — statutory (Part 1) and non-statutory (Part 2) — then defines the "Attorney in the Loop" model (Part 3) and maps it to Adjudica's product architecture (Part 4).

**The core principle:** The attorney product is a copilot for the practice of law. Because the user IS a licensed professional, Adjudica can provide full attorney-level work assistance — drafting, research, analysis, calculation, and issue identification. The attorney exercises independent professional judgment over all substantive legal decisions. AI functions as a nonlawyer assistant under CRPC Rule 5.3, subject to the attorney's supervision and verification.

**Related documents:**
- [CA_BAR_ETHICS.md](../../legal/compliance/regulations/CA_BAR_ETHICS.md) — Detailed CRPC analysis
- [PROFESSIONAL_SUPERVISION_REQUIREMENT.md](../PROFESSIONAL_SUPERVISION_REQUIREMENT.md) — Three-tier user structure
- [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md) — UPL boundary language
- [DEFENSE_ATTORNEY_STRATEGY.md](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md) — Market positioning
- [BILLING_ETHICS_AND_AI_POSITION.md](../../marketing/research/BILLING_ETHICS_AND_AI_POSITION.md) — Fee ethics analysis

---

## Part 1: Statutory Duties and Legal Roles

Every duty in this section is rooted in a specific statutory, regulatory, or professional conduct authority. The defense attorney's obligations flow from four sources: (1) the California Rules of Professional Conduct, (2) the Business and Professions Code, (3) the Labor Code and DWC/WCAB regulations, and (4) technology-specific ethical guidance.

### 1.1 California Rules of Professional Conduct (CRPC)

The CRPC governs the professional conduct of all California-licensed attorneys. These rules are mandatory and enforceable through State Bar discipline. The California State Bar's November 2023 Practical Guidance on Generative AI confirms that all existing CRPC obligations apply with full force to attorneys using AI tools.

#### Rule 1.1 — Competence

> "A lawyer shall not intentionally, recklessly, or repeatedly fail to perform legal services with competence."
>
> — Cal. Rules of Prof. Conduct, Rule 1.1(a)

Comment [1] to Rule 1.1, effective March 22, 2021, adds:

> "The duties set forth in this rule include the duty to keep abreast of the changes in the law and its practice, **including the benefits and risks associated with relevant technology**."

**Application to WC defense practice:**
- The attorney must understand the capabilities and limitations of any AI tool used in practice *(CRPC 1.1, Comment [1])*
- Competence requires the ability to evaluate AI outputs against independent professional knowledge *(Nov. 2023 Practical Guidance, Principle 2)*
- In WC specifically: competence includes knowledge of the PDRS, AMA Guides 5th Edition, apportionment law, medical-legal evaluation procedures, and WCAB practice — the attorney cannot delegate substantive understanding of these domains to AI *(CRPC 1.1(b) — factors include "the lawyer's training and experience in the law")*

**Source:** [CA_BAR_ETHICS.md §1](../../legal/compliance/regulations/CA_BAR_ETHICS.md) | [Cal. State Bar — CRPC Rule 1.1](https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct)

---

#### Rule 1.4 — Communication with Clients

> "A lawyer shall reasonably inform the client of significant developments relating to the representation..."
>
> — Cal. Rules of Prof. Conduct, Rule 1.4(a)(3)

**Application to WC defense practice:**
- The defense attorney's client is the insurance carrier (not the injured worker) *(Cal. Lab. Code § 3700 et seq.; standard WC defense representation structure)*
- Significant developments that must be communicated include: claim status changes, settlement offers, MSC outcomes, deposition results, QME/AME findings, and material changes in case valuation
- AI use may require disclosure to the carrier client when it significantly affects the representation or billing *(Nov. 2023 Practical Guidance, Principle 6; CRPC 1.4(a)(3))*
- Billing implications of AI adoption (reduced hours per matter, rate adjustments) must be communicated transparently *(CRPC 1.5 reasonableness factors)*

**Source:** [CA_BAR_ETHICS.md §5](../../legal/compliance/regulations/CA_BAR_ETHICS.md)

---

#### Rule 1.5 — Fees

> "A lawyer shall not make an agreement for, charge, or collect an unconscionable or illegal fee."
>
> — Cal. Rules of Prof. Conduct, Rule 1.5(a)

The November 2023 Practical Guidance adds:

> "The lawyer must not charge hourly fees for the time saved by using generative AI."

**Application to WC defense practice:**
- Defense attorneys bill hourly to insurance carriers, typically at $225-$300/hr for CA WC defense *(WCIRB rate data; see [DEFENSE_ATTORNEY_STRATEGY.md](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*
- CRPC 1.5 prohibits billing phantom hours — time not actually worked. It does NOT prohibit rate increases *(CRPC 1.5(a) — factors include "the experience, reputation, and ability of the lawyer")*
- An hour of concentrated expert medical-legal analysis at a higher rate is reasonable under CRPC 1.5; an hour of typing a cover letter at that same rate might not be — but AI eliminates the latter
- Carrier billing guidelines are contractual, not statutory — rate negotiations are market-driven
- The attorney must bill only for time actually worked, including time reviewing and correcting AI output *(Nov. 2023 Practical Guidance)*
- AI-generated audit trails provide billing transparency that supports CRPC 1.5 compliance

**Full analysis:** [BILLING_ETHICS_AND_AI_POSITION.md](../../marketing/research/BILLING_ETHICS_AND_AI_POSITION.md)

---

#### Rule 1.6 — Confidentiality of Information

> "A lawyer shall not reveal information protected from disclosure by Business and Professions Code section 6068, subdivision (e)(1) unless the client gives informed consent..."
>
> — Cal. Rules of Prof. Conduct, Rule 1.6(a)

California has the **strictest confidentiality obligation in the nation**, broader than attorney-client privilege.

**Cal. Bus. & Prof. Code § 6068(e)(1):**

> "[It is the duty of an attorney] to maintain inviolate the confidence, and at every peril to himself or herself to preserve the secrets, of his or her client."

**Application to WC defense practice:**
- Client data (medical records, claim files, litigation strategy, settlement authority) must not be input into AI systems that share data with third parties or use it for model training *(CRPC 1.6; Nov. 2023 Practical Guidance, Principle 3)*
- The platform must provide: end-to-end encryption, contractual commitment not to train on client data, prohibition on third-party sharing, US-based data processing *(Cal. Formal Ethics Op. 2010-179 — cloud computing standards)*
- WC cases involve extensive PHI — HIPAA/BAA compliance is required in addition to CRPC 1.6 *(45 CFR 164.512(l) — WC exception permits disclosure but does not eliminate minimum necessary standard)*
- Defense attorney work product (case evaluations, settlement strategies, legal analysis) is both privileged and confidential — AI processing must preserve these protections

**Source:** [CA_BAR_ETHICS.md §2](../../legal/compliance/regulations/CA_BAR_ETHICS.md) | [BAA_AI_ADDENDUM.md](../../legal/final-documents/product/BAA_AI_ADDENDUM.md)

---

#### Rule 3.1 — Meritorious Claims and Contentions

> "A lawyer shall not bring or defend a proceeding, or assert or controvert an issue therein, unless there is a basis in law and fact for doing so that is not frivolous..."
>
> — Cal. Rules of Prof. Conduct, Rule 3.1(a)

**Application to WC defense practice:**
- AI-generated legal arguments must be reviewed for factual and legal merit before assertion at the WCAB *(CRPC 3.1(a))*
- The attorney cannot submit AI-generated positions to the WCAB without independent evaluation of whether the position has a non-frivolous basis in law *(CRPC 3.1; cf. Mata v. Avianca, Inc. (S.D.N.Y. 2023) — sanctions for filing AI-fabricated citations)*
- In WC defense: common positions that must be independently evaluated include apportionment arguments, AOE/COE defenses, medical treatment disputes, and vocational rehabilitation challenges
- AI may surface potential defenses; the attorney decides which have merit and which to assert

**Source:** [Cal. State Bar — CRPC Rule 3.1](https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct)

---

#### Rule 3.3 — Candor Toward the Tribunal

> "A lawyer shall not... make a false statement of fact or law to a tribunal or fail to correct a false statement of material fact or law previously made to the tribunal by the lawyer..."
>
> — Cal. Rules of Prof. Conduct, Rule 3.3(a)(1)

> "A lawyer shall not... offer evidence that the lawyer knows to be false..."
>
> — Cal. Rules of Prof. Conduct, Rule 3.3(a)(3)

**Application to WC defense practice:**
- Every citation, factual assertion, and legal argument submitted to the WCAB must be verified by the attorney *(CRPC 3.3(a)(1))*
- AI-generated case citations MUST be independently verified before use in any filing — AI hallucination of citations constitutes a knowing false statement once the attorney has been warned of this risk *(CRPC 3.3; AI Transparency Disclosure §2.3)*
- Medical record summaries generated by AI must be verified against source documents before reliance in WCAB proceedings
- WC-specific applications: PD ratings, WPI calculations, apportionment percentages, and vocational data must be verified before submission to the WCAB as accurate

**Source:** [Cal. State Bar — CRPC Rule 3.3](https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct) | [AI_TRANSPARENCY_DISCLOSURE.md §2.3](../../legal/final-documents/product/AI_TRANSPARENCY_DISCLOSURE.md)

---

#### Rule 3.4 — Fairness to Opposing Party and Counsel

> "A lawyer shall not... suppress any evidence that the lawyer or the lawyer's client has a legal obligation to reveal or to produce..."
>
> — Cal. Rules of Prof. Conduct, Rule 3.4(a)

**Application to WC defense practice:**
- Discovery obligations at the WCAB require production of relevant documents and evidence *(CRPC 3.4; WCAB Rules of Practice)*
- AI-assisted document review does not diminish discovery obligations — the attorney remains responsible for ensuring complete and accurate production
- AI tools that identify privileged documents must be supervised by the attorney to avoid inadvertent waiver *(CRPC 3.4(a); Cal. Evid. Code § 912)*
- WC-specific: defense medical evidence (QME/AME reports, IME reports) must be disclosed per WCAB rules; AI extraction of key findings does not substitute for full document disclosure

**Source:** [Cal. State Bar — CRPC Rule 3.4](https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct)

---

#### Rule 5.3 — Responsibilities Regarding Nonlawyer Assistants

> "With respect to a nonlawyer employed or retained by or associated with a lawyer... [t]he lawyer shall make reasonable efforts to ensure that... the nonlawyer's conduct is compatible with the professional obligations of the lawyer."
>
> — Cal. Rules of Prof. Conduct, Rule 5.3(a)

The November 2023 Practical Guidance treats AI tools as analogous to nonlawyer assistants:

> Lawyers must supervise AI outputs. Lawyers remain responsible for AI-generated work product. Cannot delegate professional judgment to AI.

**Application to WC defense practice:**
- AI is supervised under the same framework as paralegals, law clerks, and other nonlawyer staff *(CRPC 5.3; Nov. 2023 Practical Guidance, Principle 4)*
- The attorney must: review all AI-generated work product, verify accuracy of citations and factual assertions, apply independent professional judgment, and correct errors before use *(CRPC 5.3(a))*
- The attorney is professionally responsible for work product that incorporates AI output, regardless of whether the error originated with the AI *(CRPC 5.3(c))*
- This rule is the doctrinal foundation for the "Attorney in the Loop" model — AI assists, the attorney supervises

**Source:** [CA_BAR_ETHICS.md §4](../../legal/compliance/regulations/CA_BAR_ETHICS.md) | [PROFESSIONAL_SUPERVISION_REQUIREMENT.md](../PROFESSIONAL_SUPERVISION_REQUIREMENT.md)

---

### 1.2 Business and Professions Code

#### § 6068 — Duties of Attorney

California Business and Professions Code § 6068 enumerates the affirmative duties of every California attorney. The following subdivisions are most relevant to WC defense practice:

| Subdivision | Duty | WC Defense Application |
|-------------|------|----------------------|
| **(a)** | Support the Constitution and laws of the United States and California | Attorney must ensure AI-assisted work product complies with applicable law |
| **(b)** | Maintain respect due to courts and judicial officers | Applies to all WCAB proceedings; AI submissions must meet WCAB standards |
| **(c)** | Counsel or maintain only actions that appear legal or just | Cannot assert frivolous defenses even if AI generates them |
| **(d)** | Employ means consistent with truth; never mislead judge or judicial officer | AI outputs must be verified for truthfulness before tribunal submission |
| **(e)(1)** | Maintain inviolate the confidence, and at every peril preserve the secrets, of the client | Foundation of confidentiality duty — see CRPC 1.6 above |
| **(f)** | Abstain from presenting facts prejudicial to honor of a party or witness unless required by justice | AI extraction of sensitive medical/personal information must be supervised |
| **(g)** | Not encourage commencement or continuance of action from corrupt motive of delay or gain | Cannot use AI to generate dilatory tactics |
| **(h)** | Never reject for personal consideration the cause of the defenseless or oppressed | |
| **(i)** | Cooperate and participate in disciplinary investigations | Must disclose AI-related issues if subject to Bar inquiry |
| **(m)** | Respond promptly to reasonable status inquiries of clients and keep clients reasonably informed | Carrier clients must be kept informed of AI-assisted case developments |
| **(o)** | Report to the State Bar within 30 days of specified events including sanctions, judgments, or convictions | AI-related sanctions (e.g., for unverified citations) are reportable |

**Source:** Cal. Bus. & Prof. Code § 6068 (Amended Stats. 2018, Ch. 659, § 50, eff. Jan. 1, 2019)

---

#### §§ 6125-6126 — Unauthorized Practice of Law

> **§ 6125:** "No person shall practice law in California unless the person is an active licensee of the State Bar."
>
> **§ 6126(a):** Any person advertising or practicing law without active State Bar licensure commits a misdemeanor punishable by up to one year in county jail, a fine of up to $1,000, or both.

**Application to WC defense practice:**
- These sections define the exclusive province of the licensed attorney — only the attorney can practice law *(B&P § 6125)*
- AI tools that produce legal analysis do not themselves practice law; the attorney who uses the output in legal proceedings is the one practicing law *(cf. Janson v. LegalZoom.com, Inc. (2017) 802 F. Supp. 2d 1053 — document preparation services that go beyond clerical work may constitute UPL)*
- Paralegals and legal assistants using Adjudica must operate under attorney supervision — their use of AI-assisted legal tools is permitted only under the attorney's professional umbrella *(B&P § 6125; CRPC 5.3)*
- The attorney product's UPL risk is lower than AdjudiCLAIMS because the end user IS the licensed professional — but the risk exists for unsupervised paralegal use

**Source:** Cal. Bus. & Prof. Code §§ 6125-6126 (Amended Stats. 2018, Ch. 659, §§ 89-90, eff. Jan. 1, 2019) | [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md)

---

### 1.3 California Labor Code — Division 4 (Workers' Compensation)

The Labor Code governs the substantive and procedural framework of WC practice. Defense attorneys must know and comply with these provisions.

#### §§ 4060-4062 — Medical-Legal Evaluation Process (QME/AME)

| Section | Provision | Defense Attorney Role |
|---------|-----------|----------------------|
| **LC 4060** | When no party has objected to a treating physician report, QME evaluation for unrepresented employees | Defense may object to treating physician findings, triggering QME process |
| **LC 4061** | QME evaluation when parties cannot agree on AME (represented employees) | Defense attorney participates in QME panel selection; may strike panelists |
| **LC 4062** | AME selection for represented employees — mutual agreement process | Defense attorney negotiates AME selection with applicant's counsel |
| **LC 4062.2** | AME panel request process when parties cannot agree | Defense attorney may request panel from DWC Medical Director |

**Application to AI-assisted practice:** AI can summarize medical records, identify inconsistencies between treating physician and QME/AME findings, calculate WPI discrepancies, and surface relevant apportionment case law. The attorney decides whether to object, which panelists to strike, and how to cross-examine the evaluating physician.

**Source:** Cal. Lab. Code §§ 4060-4062.2 | **KB Status:** Gap — LC 4060-4062 in 3866-4450 coverage gap; see [KB_REGULATORY_GAP_REPORT.md](KB_REGULATORY_GAP_REPORT.md)

---

#### §§ 4660, 4663, 4664 — Permanent Disability Rating and Apportionment

| Section | Provision | Defense Attorney Role |
|---------|-----------|----------------------|
| **LC 4660** | PD rating methodology — nature of physical injury, occupation, age | Attorney evaluates PD rating using PDRS 2005 + AMA Guides 5th Ed. |
| **LC 4660.1** | PD rating for post-2013 injuries — adjusted formula | Attorney applies updated methodology for newer injuries |
| **LC 4663** | Apportionment based on causation — physician must address | Attorney challenges or supports apportionment opinions; develops legal arguments on causation |
| **LC 4664** | Employer liable only for PD directly caused by industrial injury | Attorney argues for maximum apportionment to reduce carrier's liability |

**Application to AI-assisted practice:** The PD Calculator and Knowledge Base are directly relevant here. AI can calculate preliminary PD ratings, identify apportionment issues in medical reports, and surface relevant case law (Benson, Vigil, Escobedo, etc.). The attorney applies independent judgment on whether the apportionment analysis is factually supported and legally sound.

**Source:** Cal. Lab. Code §§ 4660-4664 | **KB Status:** Present — full text in `regulatory_sections` table

---

#### §§ 4903, 4903.1 — Liens Against Compensation

| Section | Provision | Defense Attorney Role |
|---------|-----------|----------------------|
| **LC 4903** | Types of liens allowable against compensation awards | Attorney evaluates lien validity and amount |
| **LC 4903.1** | Board must determine lien amounts before award; lien claimant filing requirements | Attorney challenges liens, negotiates lien reductions, advocates at lien conferences |

**Application to AI-assisted practice:** AI can track lien filings, calculate lien exposure, and flag deadline issues. The attorney decides which liens to contest, negotiation strategy, and settlement allocation.

**Source:** Cal. Lab. Code §§ 4903, 4903.1 | **KB Status:** Present — full text confirmed

---

#### § 4906 — Attorney Fees

> Fees for legal services in WC cases are "not enforceable" unless approved by the WCAB or agreed in writing and filed with the Board.
>
> — Cal. Lab. Code § 4906(a)

**Application to WC defense practice:**
- Defense attorney fees are governed by carrier billing guidelines (contractual), not LC 4906 which primarily addresses applicant attorney fees
- However, LC 4906 is relevant when defense counsel is appointed and fees require Board approval
- CRPC 1.5 reasonableness standards apply to all attorney fees regardless of LC 4906 applicability

**Source:** Cal. Lab. Code § 4906 | **KB Status:** Present — full text confirmed

---

#### §§ 5500, 5500.5 — WCAB Pleading Requirements

| Section | Provision | Defense Attorney Role |
|---------|-----------|----------------------|
| **LC 5500** | Application for adjudication and answer — no other pleadings required; must conform to WCAB-prescribed forms | Defense attorney files answers, declarations, and responsive pleadings per WCAB rules |
| **LC 5500.5** | Cumulative injury liability allocation — one year of injurious exposure; last employer liable | Attorney evaluates exposure periods, argues which employers bear liability |

**Application to AI-assisted practice:** AI can pre-populate WCAB forms, draft responsive pleadings, and analyze cumulative injury exposure periods. The attorney reviews for accuracy and applies strategic judgment on liability arguments.

**Source:** Cal. Lab. Code §§ 5500, 5500.5 | **KB Status:** Present — full text confirmed

---

#### §§ 4650-4657 — Temporary Disability Indemnity

| Section | Key Provision |
|---------|--------------|
| **LC 4650** | First TD payment due within 14 days of employer knowledge of injury; subsequent payments every 14 days |
| **LC 4650.5** | State civil service employee exception |
| **LC 4653** | TD rate: 2/3 of average weekly earnings, subject to minimum and maximum |
| **LC 4654** | Aggregate TD limitation (104 compensable weeks within 2 years for non-specified injuries) |
| **LC 4656** | TD termination conditions |

**Defense attorney role:** Attorney advises carrier on TD payment obligations, challenges medical basis for continued TD, identifies return-to-work opportunities. AI can calculate TD rates, track payment timelines, and flag potential overpayments.

**Source:** Cal. Lab. Code §§ 4650-4657 | **KB Status:** Present — all sections confirmed

---

#### §§ 4600-4610 — Medical Treatment

| Section | Key Provision |
|---------|--------------|
| **LC 4600** | Employer liability for all reasonable medical treatment to cure or relieve effects of industrial injury |
| **LC 4603.2** | Medical billing and payment requirements |
| **LC 4610** | Utilization Review — prospective, retrospective, and concurrent review of treatment requests |

**Defense attorney role:** Attorney advises carrier on treatment disputes, participates in UR/IMR challenges, and handles medical treatment litigation at WCAB. AI can match treatment requests against MTUS/ACOEM guidelines, identify treatment exceeding guidelines, and draft UR correspondence.

**Source:** Cal. Lab. Code §§ 4600-4610 | **KB Status:** Present — all sections confirmed, LC 4610 especially comprehensive (23,903 chars)

---

### 1.4 WCAB Rules of Practice and Procedure (CCR Title 8, Chapter 4.5)

The WCAB Rules govern procedure before the Workers' Compensation Appeals Board. Defense attorneys must comply with these rules in all WCAB proceedings.

| Rule | Subject | Defense Attorney Obligation |
|------|---------|---------------------------|
| **CCR 10500** | Form Pleadings | All pleadings must conform to WCAB-prescribed forms |
| **CCR 10508** | Verification of Pleadings | Pleadings must be verified under penalty of perjury |
| **CCR 10510** | Service of Documents | Proper service on all parties; proof of service required |
| **CCR 10517** | Document Filing via EAMS | Electronic filing requirements and procedures |
| **CCR 10541** | Declaration of Readiness to Proceed | Attorney files DOR when case is ready for hearing |
| **CCR 10563** | Mandatory Settlement Conference | Attorney must attend MSC with authority and preparation; good faith participation required |
| **CCR 10566** | Trial | Attorney must be prepared to present evidence and legal argument at trial |
| **CCR 10593** | Sanctions | WCAB may impose sanctions for bad faith actions, frivolous filings, or failure to comply with rules |

**Application to AI-assisted practice:** AI can pre-populate WCAB forms, track filing deadlines, draft declarations of readiness, prepare MSC briefs, and organize trial exhibits. The attorney makes all strategic decisions about when to file, what positions to take, and how to conduct proceedings.

**Source:** Cal. Code Regs., tit. 8, §§ 10500-10593 | **KB Status:** Present — 37 records covering full WCAB practice rules

---

### 1.5 Ethical Obligations Regarding Technology and AI

#### California State Bar — Practical Guidance on Generative AI (November 16, 2023)

California was the first state bar to issue AI-specific guidance. Key principles:

| Principle | Requirement |
|-----------|------------|
| **1** | All existing ethical obligations apply to AI tool usage |
| **2** | Competence requires understanding AI capabilities and limitations |
| **3** | Confidentiality prohibits inputting client data into unsecured AI systems |
| **4** | Supervision required — lawyers remain responsible for all work product |
| **5** | Verification mandatory — all AI outputs must be reviewed and verified |
| **6** | Bias awareness — lawyers must be aware of potential AI biases |
| **7** | Fee ethics — cannot bill for time saved by AI; can bill for time actually worked |

**Source:** [COPRAC Practical Guidance (Nov. 2023)](https://www.calbar.ca.gov/Portals/0/documents/ethics/Generative-AI-Practical-Guidance.pdf) | [CA_BAR_ETHICS.md §3](../../legal/compliance/regulations/CA_BAR_ETHICS.md)

#### ABA Formal Opinion 512 (July 2024)

The ABA's first formal opinion on AI in legal practice confirms:
- AI tools must comply with existing ethics rules
- Competence, confidentiality, and supervision duties apply
- Verification of AI outputs is mandatory
- Billing and disclosure considerations apply

**Note:** California rules are stricter than ABA Model Rules, especially on confidentiality.

**Source:** [ABA Formal Opinion 512](https://www.americanbar.org/news/abanews/aba-news-archives/2024/07/aba-issues-first-ethics-guidance-ai-tools/) | [CA_BAR_ETHICS.md §6](../../legal/compliance/regulations/CA_BAR_ETHICS.md)

---

## Part 2: Non-Statutory Duties and Typical Roles

The following activities represent the standard practice of a California WC defense attorney. While not individually mandated by specific statutes, they constitute the professional standard of care and are the activities that generate the majority of billable hours. Industry sources, practice guides, and operational benchmarks are cited for each.

### 2.1 Case Management Activities

**Typical activities:**
- Opening new matters upon carrier assignment; verifying claim information against DWC-1 and employer reports
- Maintaining case files (physical and electronic) in compliance with firm and carrier requirements
- Tracking all deadlines — WCAB hearing dates, discovery cutoffs, MSC dates, statute of limitations, lien filing deadlines
- Preparing status reports for carrier clients per billing guideline requirements (typically monthly or upon significant development)
- Coordinating with co-defendants, lien claimants, and applicant's counsel
- Managing case inventory across 50-80+ active matters per attorney

**Time allocation:** Case management activities consume approximately 10-15% of total billable hours per matter *(GBS estimate based on 15 years CA WC practice experience; see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** California Continuing Education of the Bar (CEB), *California Workers' Compensation Practice* (updated annually) — standard reference for WC case management protocols. WCIRB reports confirm average caseloads and billing patterns for CA WC defense *(WCIRB State of the System reports, annual)*.

---

### 2.2 Medical Record Review and Analysis

**Typical activities:**
- Reviewing medical records for each matter — treating physician reports, QME/AME reports, operative reports, imaging studies, pharmacy records
- Analyzing WPI ratings against AMA Guides 5th Edition criteria for accuracy
- Evaluating apportionment opinions for factual sufficiency under LC 4663
- Identifying inconsistencies between treating physician findings and QME/AME conclusions
- Reviewing medical-legal reports for compliance with CCR 9793 content requirements
- Cross-referencing treatment recommendations against MTUS/ACOEM guidelines
- Preparing summaries for carrier clients and for use in MSC/trial preparation

**Time allocation:** Medical record review consumes approximately 20-30% of total billable hours per matter — the single largest time component. For complex cases (multiple body parts, cumulative trauma, psychiatric overlay), this percentage is higher. *(GBS estimate; 8-12 hours per case average — see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** DWC Medical-Legal Report Requirements (8 CCR § 9793) define the content standards for medical-legal reports that attorneys must review. AMA Guides to the Evaluation of Permanent Impairment, 5th Edition — the mandatory reference for WPI evaluation in CA WC.

---

### 2.3 Discovery and Investigation

**Typical activities:**
- Propounding and responding to interrogatories and requests for production under WCAB rules
- Subpoenaing medical records, employment records, and tax returns
- Conducting or defending depositions of applicants, treating physicians, QMEs, AMEs, and vocational experts
- Investigating AOE/COE (arising out of employment / course of employment) disputes
- Conducting or authorizing sub rosa surveillance when appropriate
- Researching applicant's social media and public records for inconsistencies
- Obtaining and analyzing prior claims history (WCIS data)

**Time allocation:** Discovery and investigation consume approximately 10-15% of total billable hours per matter, rising significantly for litigated cases. *(GBS estimate; 3-5 hours per case average — see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** WCAB Rules of Practice and Procedure (CCR Title 8, §§ 10500 et seq.) govern discovery procedures. CEB *California Workers' Compensation Practice* provides detailed guidance on WC-specific discovery.

---

### 2.4 Settlement and Resolution

**Typical activities:**
- Evaluating case value based on PD rating, future medical exposure, TD exposure, and lien exposure
- Preparing MSC (Mandatory Settlement Conference) position statements
- Attending and actively participating in MSC proceedings with settlement authority from carrier
- Negotiating Compromise and Release (C&R) agreements vs. Stipulated Awards with Requests for Award (Stip)
- Evaluating structured settlement proposals
- Drafting settlement documents for WCAB approval
- Conducting cost-benefit analysis of litigation vs. settlement
- Advising carrier on Medicare Set-Aside (MSA) requirements for WC settlements involving Medicare beneficiaries

**Time allocation:** Settlement activities consume approximately 8-12% of total billable hours per matter. *(GBS estimate; 2-4 hours per case average — see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** WCAB Rules (CCR § 10563 — MSC requirements). DWC settlement procedures. CMS Medicare Set-Aside guidelines for WC settlements.

---

### 2.5 Client/Carrier Communication and Reporting

**Typical activities:**
- Providing initial case assessment to carrier claims examiner upon matter assignment
- Submitting periodic status reports (typically monthly or per billing cycle) with updated case valuations
- Responding to carrier inquiries regarding claim status, strategy, and developments
- Attending claim review meetings with carrier claims teams
- Providing litigation budgets and fee estimates per carrier billing guidelines
- Communicating settlement recommendations with supporting analysis
- Reporting significant developments within 24-48 hours (adverse depositions, unexpected medical findings, applicant representation changes)

**Time allocation:** Carrier communication consumes approximately 8-12% of total billable hours per matter. *(GBS estimate; 4-6 hours per case average — see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** Carrier billing guidelines (proprietary, vary by carrier — common sources include Zurich, Hartford, Travelers, Republic Indemnity, SCIF billing guideline templates). WCIRB panel counsel requirements.

---

### 2.6 Administrative and Regulatory Functions

**Typical activities:**
- Filing applications, answers, declarations, and other WCAB pleadings via EAMS (Electronic Adjudication Management System)
- Preparing and filing DWC forms (50+ form types — DWC-1, DWC-CA series, DWC-AD series)
- Serving documents on all parties per WCAB service requirements
- Maintaining EAMS case access and electronic document management
- Complying with carrier-specific document formatting and filing requirements
- Managing calendaring systems for WCAB deadlines, hearing dates, and statute-tracking

**Time allocation:** Administrative functions consume approximately 10-15% of total billable hours per matter. *(GBS estimate; 3-5 hours per case — see [DEFENSE_ATTORNEY_STRATEGY.md Part 1](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

**Industry source:** DWC Forms Library (dir.ca.gov/dwc/forms.html). EAMS filing requirements (CCR § 10517 et seq.).

---

## Part 3: The "Attorney in the Loop" Model

### 3.1 Definition

> **The "Attorney in the Loop" model requires that a licensed California attorney exercises independent professional judgment over all substantive legal decisions, with AI functioning as an assistive tool analogous to a nonlawyer assistant under CRPC Rule 5.3.**

This model is the doctrinal and architectural foundation for Adjudica's attorney-facing product. It is grounded in:

1. **CRPC Rule 5.3** — AI is treated as a nonlawyer assistant; the attorney supervises
2. **November 2023 Practical Guidance** — All existing ethical obligations apply to AI use; verification is mandatory
3. **ABA Formal Opinion 512** — Confirms supervision, verification, and professional responsibility framework
4. **B&P Code § 6125** — Only the licensed attorney practices law; AI assists, the attorney decides
5. **EULA Section 1A** — Contractual implementation of the professional supervision requirement

The attorney is not a reviewer of AI work product — the attorney is the practitioner, and AI is one of the attorney's tools. The distinction matters: the AI does not generate legal advice that the attorney then approves. The attorney uses AI to enhance the attorney's own practice of law.

---

### 3.2 Statutory Duty-to-Loop Mapping

| Statutory Duty | AI Assists With | Attorney Must Do |
|----------------|----------------|-----------------|
| **Competence (CRPC 1.1)** | Surface relevant law, identify issues, provide analysis | Understand AI limitations; verify output; apply independent knowledge |
| **Communication (CRPC 1.4)** | Draft correspondence, prepare status reports | Review before sending; disclose AI use when appropriate |
| **Fees (CRPC 1.5)** | Track time, document work performed, generate audit trail | Bill only for time actually worked; ensure rate reasonableness |
| **Confidentiality (CRPC 1.6)** | Process data in secure, compliant environment | Ensure platform meets confidentiality standards; monitor for breaches |
| **Meritorious Claims (CRPC 3.1)** | Generate potential arguments and defenses | Evaluate merit independently; assert only non-frivolous positions |
| **Candor (CRPC 3.3)** | Research authorities, draft filings | Verify ALL citations and factual assertions before filing |
| **Fairness (CRPC 3.4)** | Identify discoverable documents, organize production | Ensure complete and accurate discovery compliance |
| **Supervision (CRPC 5.3)** | Perform delegated tasks (research, drafting, analysis) | Review, verify, and approve all AI output |
| **B&P 6068(d) — Truth** | Generate factual summaries, legal analysis | Ensure all submissions are truthful and non-misleading |
| **B&P 6068(e)(1) — Confidentiality** | Process client information securely | Maintain inviolate client confidence at every peril |
| **LC 4663 — Apportionment** | Analyze medical evidence, surface case law | Apply independent judgment on apportionment arguments |
| **LC 5500 — Pleadings** | Pre-populate forms, draft responsive pleadings | Review and verify before filing with WCAB |
| **WCAB Rules — MSC** | Prepare position statements, compile evidence | Attend and participate in good faith; exercise settlement judgment |

---

### 3.3 What AI Can Do: Full Practice-of-Law Assistance

Because the user is a licensed attorney, Adjudica can provide comprehensive assistance with the practice of law:

**Document Analysis and Summarization**
- Ingest and analyze medical records, QME/AME reports, treating physician records
- Extract key findings: diagnoses, WPI ratings, work restrictions, treatment recommendations
- Generate chronological case summaries from uploaded documents
- Identify inconsistencies across documents

**Legal Research**
- Search the Knowledge Base (2,589+ CA WC cases, 16,949 legal principles)
- Retrieve relevant case law on apportionment, AOE/COE, penalties, benefits calculation
- Surface applicable statutory provisions and regulatory requirements
- Identify analogous cases and distinguishing factors

**Drafting and Document Generation**
- Draft correspondence to carriers, applicant's counsel, medical providers
- Pre-populate DWC forms with extracted data
- Draft MSC position statements and trial briefs
- Generate discovery requests and responses

**Calculation and Analysis**
- Calculate PD ratings using PDRS 2005 methodology
- Compute TD rates and exposure estimates
- Analyze settlement values based on case characteristics
- Track deadlines and generate compliance alerts

**Issue Identification**
- Flag potential apportionment issues in medical reports
- Identify missing medical evidence or diagnostic gaps
- Surface procedural issues (missed deadlines, filing deficiencies)
- Detect inconsistencies between claimed injury and medical evidence

---

### 3.4 What Only the Attorney Can Do

The following activities require the attorney's independent professional judgment and CANNOT be delegated to AI:

**Professional Judgment**
- Case strategy development and modification
- Settlement authority recommendations to carrier
- Litigation risk assessment and cost-benefit analysis
- Decision to accept or reject settlement offers
- Choice of legal arguments and defenses to assert

**Representation**
- Appearances at WCAB — MSC, trial, lien conferences
- Depositions — taking and defending
- Client meetings and claim review conferences
- Negotiations with opposing counsel

**Client Relationship**
- Establishing and maintaining the attorney-carrier relationship
- Communicating legal advice and strategy recommendations
- Obtaining settlement authority from carrier
- Managing carrier expectations and billing relationships

**Ethical Decisions**
- Conflict of interest evaluation
- Privilege and work product determinations
- Disclosure decisions under CRPC 1.4
- Fee reasonableness evaluation under CRPC 1.5
- Decision to withdraw from representation

**Verification**
- Final review and approval of ALL AI-generated work product before use
- Independent verification of citations, factual assertions, and calculations
- Certification that filed documents are accurate and meritorious

---

### 3.5 The CRPC Rule 5.3 Framework Applied to AI

The November 2023 Practical Guidance establishes that AI tools are treated as nonlawyer assistants under CRPC Rule 5.3. This creates a clear supervisory framework:

**Attorney's Supervisory Obligations:**

| Obligation | How It Applies to AI |
|-----------|---------------------|
| Make reasonable efforts to ensure compatible conduct | Configure AI appropriately; use only compliant platforms |
| Provide adequate supervision | Review all AI output before use; do not blindly accept |
| Review and approve work products | Every AI-generated document, calculation, and citation must be reviewed |
| Ensure ethical compliance | Verify confidentiality protections; monitor for bias; ensure accuracy |
| Maintain oversight of client matters | Attorney retains substantive knowledge of every matter; AI supplements, does not replace |

**Three-Tier Implementation:**

Per [PROFESSIONAL_SUPERVISION_REQUIREMENT.md](../PROFESSIONAL_SUPERVISION_REQUIREMENT.md):

```
Tier 1: Licensed Attorney (supervises all)
  └── Uses AI directly; reviews all AI output; bears professional responsibility
Tier 2: Paralegal/Legal Assistant (supervised by Tier 1)
  └── Uses AI under attorney direction; attorney reviews AI-assisted work product
Tier 3: Administrative Staff (supervised by Tier 1)
  └── Limited AI access; document upload and basic task functions only
```

---

## Part 4: Adjudica Product Adaptation for Attorneys

### 4.1 Feature-to-Duty Mapping

| Adjudica Feature | Attorney Duty Served | Loop Position | Authority |
|-----------------|---------------------|---------------|-----------|
| **Document Ingestion/Analysis** | Medical record review (§2.2); Investigation (§2.3) | AI processes and extracts; attorney verifies against source | CRPC 5.3; AI Transparency Disclosure §2.2 |
| **Knowledge Base** (2,589 cases, 16,949 principles) | Legal research (CRPC 1.1); Apportionment analysis (LC 4663) | AI retrieves and surfaces; attorney evaluates applicability | CRPC 3.1; CRPC 3.3 |
| **PD Calculator** | PD rating (LC 4660); Medical-legal analysis (§2.2) | AI calculates; attorney verifies inputs and output | UPL Disclaimer Template — PD rating provisions |
| **Matter Chat** | Case management (§2.1); Issue identification | AI responds with cited analysis; attorney applies judgment | CRPC 1.1; AI Transparency Disclosure §2.5 |
| **Form Fill** (50+ DWC forms) | Administrative functions (§2.6); WCAB filings (LC 5500) | AI pre-populates; attorney reviews before filing | UPL Disclaimer Template — form pre-population |
| **Custom Drafting** | Correspondence (§2.5); Discovery (§2.3); Settlement (§2.4) | AI drafts; attorney reviews, edits, approves | UPL Disclaimer Template — document generation |
| **Timeline/Deadline Tracking** | Case management (§2.1); WCAB rules compliance | AI tracks and alerts; attorney manages response | CCR 10500 et seq. |

### 4.2 Copilot Positioning: The Expertise Shift

Before AI, a WC defense attorney's billable hours are composed of approximately:
- **~70% mechanical work** — document summarization, correspondence, routine research, form filling, chronology preparation
- **~30% expert work** — case strategy, medical-legal analysis, apportionment evaluation, settlement positioning, complex legal research

After Adjudica, the composition shifts to approximately:
- **~15% review and verification** — reviewing AI-generated summaries, verifying citations, confirming extracted data
- **~85% expert analysis, strategy, and judgment** — the work that actually requires a law degree

This shift does not reduce the attorney's involvement — it concentrates it. Every billable hour becomes a higher-value hour.

*(GBS projections based on product capabilities and 15 years domain expertise — see [DEFENSE_ATTORNEY_STRATEGY.md Parts 1-2](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md))*

### 4.3 Non-Delegable Decisions

The following decisions must always remain with the attorney, regardless of AI capability:

| Decision | Why Non-Delegable | Adjudica's Role |
|----------|-------------------|-----------------|
| Case strategy | Professional judgment (CRPC 1.1, 3.1) | Provides information to support strategy development |
| Settlement recommendations | Professional judgment + carrier relationship (CRPC 1.4) | Provides case valuation data and comparable outcomes |
| Whether to depose a witness | Litigation strategy (CRPC 1.1) | Identifies potential deposition targets and issues |
| Which defenses to assert | Meritorious claims obligation (CRPC 3.1) | Surfaces potential defenses; attorney evaluates merit |
| Privilege designations | Ethical duty (CRPC 1.6; Cal. Evid. Code § 912) | Flags potentially privileged documents; attorney decides |
| Fee billing decisions | Fee ethics (CRPC 1.5; Nov. 2023 Guidance) | Tracks time and generates audit trail; attorney bills |
| Carrier communication content | Client relationship (CRPC 1.4) | Drafts communications; attorney reviews and sends |
| WCAB appearance decisions | Representation duty (B&P § 6125) | Prepares materials; attorney appears and argues |

### 4.4 UPL Boundary Enforcement in Attorney Context

Because the end user IS the licensed professional, UPL enforcement in the attorney product is **lighter** than in AdjudiCLAIMS. However, safeguards are still required for paralegal and support staff use:

**Required for ALL users:**
- All AI output labeled as requiring attorney review *(UPL Disclaimer Template — required verbatim statement)*
- Audit trail of all AI interactions *(REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md Phase 3)*
- Source citations displayed for all AI analysis *(Glass Box transparency principle)*

**Required for Tier 2 (Paralegal) and Tier 3 (Staff) users:**
- Attorney approval gate before document export or filing *(PROFESSIONAL_SUPERVISION_REQUIREMENT.md)*
- Escalation triggers for conflicting data, low-confidence flags, or unexpected results *(UPL Disclaimer Template — Escalation Trigger List)*
- Mandatory attorney review certification recorded in audit trail

**Not required for Tier 1 (Attorney) users:**
- Attorney is the licensed professional — no external approval gate needed for the attorney's own review and use of AI output
- However: verification workflow is still contractually required under EULA Section 1A

**Cross-reference:** [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md) | [PROFESSIONAL_SUPERVISION_REQUIREMENT.md](../PROFESSIONAL_SUPERVISION_REQUIREMENT.md) | [REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md](../REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md)

---

## Part 5: Defense Attorney Duties vs. Adjudica AI Implementation — Direct Comparison

This section maps each statutory and non-statutory duty of the WC defense attorney directly to how Adjudica's production AI platform implements assistance for that duty. Each row identifies the specific Adjudica service, AI model, and user interaction that addresses the duty.

**Source:** Adjudica AI App codebase at `/home/vncuser/Desktop/adjudica-ai-app/` (explored 2026-03-21). Technology stack: React Router 7 + Fastify 5 + Prisma 6 + PostgreSQL/pgvector + Google Vertex AI (Gemini 2.5 Flash) + Claude 3.5 Sonnet + Google Document AI.

---

### 5.1 Statutory Duties → Adjudica Implementation

#### CRPC Professional Conduct Obligations

| Statutory Duty | Adjudica Implementation | Service/Module | AI Model | Attorney Interaction |
|---------------|------------------------|----------------|----------|---------------------|
| **CRPC 1.1 — Competence (Technology Duty)** | Platform provides AI Transparency Disclosure, confidence scoring on all outputs, and citation linking so attorney understands what AI did and why | All services | N/A (design principle) | Attorney sees confidence badges (green 0.90+/yellow 0.70-0.89/red <0.70/blank) on every AI-generated field; can click through to source document |
| **CRPC 1.4 — Communication with Clients** | Template Drafts and Custom Drafts generate carrier correspondence (status reports, case assessments, settlement recommendations) grounded in case documents | `template-generation.service.ts`, `custom-draft-planning.service.ts` | Claude 3.5 Sonnet (template section generation), Gemini 2.5 Flash (custom drafts) | Attorney provides prompt or selects template; AI generates draft from case docs; attorney reviews/edits in TipTap rich text editor before sending |
| **CRPC 1.5 — Fees (No Phantom Hours)** | Immutable audit trail logs every AI interaction with timestamp, user, and action type (24 event types). Tracks what AI did vs. what attorney did. Langfuse traces every LLM call with token count and latency | `audit-logger.ts` (server plugin), Langfuse integration | N/A (logging) | Audit log distinguishes AI-generated content (`source: AI`) from attorney edits (`source: HUMAN`) in `DraftEditHistory` table. Creates billing transparency: carrier auditor can see exactly what work was AI-assisted vs. attorney-generated |
| **CRPC 1.6 — Confidentiality** | All client data processed in Google Cloud (US region) with BAA. AI providers contractually prohibited from model training on client data. Document chunks sent to LLM via minimum-necessary retrieval (top 5 chunks, not full case). Privileged documents auto-excluded from AI processing via classification | `document-classification.service.ts` (privilege detection), all RAG services (minimum necessary) | Google Document AI (classification), all LLM calls routed through Vertex AI (BAA-covered) | Attorney-client privileged documents classified as such and excluded from AI retrieval pipeline. Attorney can correct classification if AI misidentifies privilege status |
| **CRPC 3.1 — Meritorious Claims** | Knowledge Base integration provides case law grounded in 2,589+ CA WC cases with quality tiers (HIGH/MEDIUM/LOW). Case Chat surfaces potential arguments with citations to actual WCAB decisions | Knowledge Base (separate repo), `case-chat.service.ts` with `retrieve-documents` tool | Gemini 2.5 Flash (chat), KB uses multi-AI consensus (Gemini 2.5 Pro + GPT-4o + Claude) | Attorney asks case chat about potential defenses; AI returns analysis grounded in case documents with citations. Attorney independently evaluates whether position has merit before asserting |
| **CRPC 3.3 — Candor (Citation Verification)** | Every AI output includes clickable citations linking to specific document chunks with page number, text excerpt, and similarity score. Citation system stored in `Citation`, `ChatCitation`, `FactCitation`, and `EventCitation` tables | `citation-builder.service.ts`, `structured-citation-parser.service.ts` | N/A (citation infrastructure) | Attorney clicks citation → document viewer opens to exact page/excerpt. Verification takes seconds per citation. All citations display similarity score so attorney can assess relevance strength |
| **CRPC 3.4 — Fairness (Discovery)** | Document classification system (12 types, 150+ subtypes) automatically categorizes all uploaded documents. Classification correction system learns from human corrections | `document-classifier.service.ts`, `classification-few-shot.service.ts`, `correction-analyzer.service.ts` | Claude 3.5 Sonnet (classification, temp 0.1 for determinism) | Attorney uploads discovery documents; AI classifies each; attorney reviews classifications and corrects if needed. System prevents inadvertent withholding by ensuring all documents are categorized and findable |
| **CRPC 5.3 — Supervision of AI** | Three-tier RBAC (Admin/Attorney/Clerk) with matter-level access restrictions. All AI outputs require human review before export/filing. `DraftEditHistory` tracks every change with before/after values | RBAC middleware (`auth.middleware.ts`), `draft-publish.service.ts` (publish gate), `DraftEditHistory` model | N/A (access control) | Draft status workflow: `IN_PROGRESS` → `NEEDS_REVIEW` → `PUBLISHED`. Attorney must review before publishing. All edits (AI and human) tracked with attribution |

#### Business & Professions Code

| Statutory Duty | Adjudica Implementation | How It Works |
|---------------|------------------------|-------------|
| **B&P 6068(d) — Truth/Non-Misleading** | RAG architecture grounds all outputs in uploaded case documents. System cannot fabricate information not present in the document corpus. Temperature set to 0.2-0.3 (low creativity, high fidelity) | Semantic search retrieves top 5 most relevant chunks (cosine similarity ≥ 0.6, MMR diversity); LLM generates answer ONLY from retrieved chunks. If no relevant chunks found, field returns blank (null confidence) rather than hallucinating |
| **B&P 6068(e)(1) — Confidentiality** | See CRPC 1.6 above. Additionally: presigned URLs for document access (1-hour TTL), database-level row security on audit logs, TLS encryption in transit, AES-256 at rest | GCS presigned URLs prevent direct file access. Document chunks stored with firm-level isolation in PostgreSQL. No cross-firm data leakage possible |
| **B&P 6125 — Only Licensed Attorneys Practice Law** | Platform restricted to law firms. Registration requires firm affiliation. Clerk role has limited access. All AI outputs labeled "requires attorney review" | User roles: Admin (firm management), Attorney (full access), Clerk (limited access). No consumer-facing access path |

#### Labor Code — WC Practice

| Statutory Duty | Adjudica Implementation | Service/Module | How Attorney Uses It |
|---------------|------------------------|----------------|---------------------|
| **LC 4060-4062 — QME/AME Process** | Medical record analysis extracts WPI ratings, diagnoses, work restrictions, and treatment recommendations from QME/AME reports. Case Chat can answer questions about QME findings across documents | `document-field-extraction.service.ts` (extracts medical fields), `case-chat.service.ts` (Q&A about medical evidence) | Attorney uploads QME/AME report → AI extracts key findings → attorney asks Case Chat "What WPI did Dr. Smith assign for the lumbar spine?" → AI responds with citation to specific page |
| **LC 4660/4663/4664 — PD Rating & Apportionment** | Document extraction identifies WPI ratings and apportionment opinions from medical reports. Knowledge Base contains 259+ apportionment cases (Benson, Vigil, Escobedo lines). Case Chat can surface apportionment case law relevant to current facts | `document-field-extraction.service.ts` (WPI extraction), Knowledge Base (apportionment case law), `case-chat.service.ts` | Attorney reviews extracted WPI → asks Case Chat about apportionment arguments → AI surfaces relevant case law with citations → attorney evaluates and develops legal position |
| **LC 4903/4903.1 — Liens** | Document classification identifies lien-related documents (13 lien subtypes in taxonomy). Timeline extraction tracks lien filing dates and deadlines | `document-classifier.service.ts` (LIENS type with 13 subtypes), `event-generation.service.ts` (date extraction) | Attorney uploads lien filing → AI classifies as specific lien subtype → timeline shows lien filing date → attorney evaluates validity and amount |
| **LC 5500/5500.5 — WCAB Pleadings** | Form Fill system supports DWC/WCAB forms (50+). RAG pipeline pre-populates form fields from case documents with multi-candidate answers and confidence scoring | `form-filling.service.ts` (orchestrator), `form-filling-vector.service.ts` (semantic search), `answer-extraction.service.ts` | Attorney selects DWC form → AI pre-fills all fields from case docs → each field shows confidence badge + alternative candidates + source citations → attorney reviews every field → publishes filled form as PDF |
| **LC 4650-4657 — TD Indemnity** | Claim data extraction captures AWE, injury date, and employment data from uploaded documents. Form Fill can calculate TD rates for DWC benefit forms | `matter-claim.model.ts` (claim enrichment from docs), `form-filling.service.ts` | Attorney uploads employment records/wage statements → AI extracts AWE data → Form Fill calculates TD rate (2/3 AWE within min/max) for benefit-related forms → attorney verifies |
| **LC 4600-4610 — Medical Treatment** | Medical document classification (28 medical subtypes) organizes treatment records. MTUS/ACOEM guideline data available through Knowledge Base regulatory sections | `document-classifier.service.ts` (MEDICAL type, 28 subtypes), Knowledge Base (MTUS/UR regulations — 75 CCR 9792.x records) | Attorney uploads medical records → AI classifies by subtype (treating physician, QME, AME, hospital, etc.) → attorney uses Case Chat to query treatment history → KB provides MTUS guideline context |
| **WCAB Rules — Filings & MSC** | Form Fill supports WCAB-prescribed forms. Timeline tracks WCAB hearing dates, MSC dates, and filing deadlines. Event extraction identifies 30+ date types including FILING_DATE, HEARING_DATE, MSC_DATE, SERVICE_DATE | `form-filling.service.ts` (WCAB forms), `event-generation.service.ts` (date extraction with subtype-specific native dates) | Attorney uses Form Fill for WCAB filings → Timeline shows all case dates → attorney uses Custom Drafts or Template Drafts to prepare MSC position statements grounded in case documents |

---

### 5.2 Non-Statutory Duties → Adjudica Implementation

| Practice Activity | Adjudica Feature | AI Implementation Detail | Time Impact |
|------------------|-----------------|-------------------------|-------------|
| **Case Management (§2.1)** | **Matter Dashboard + Case Overview + Claim Extraction** — Matter creation captures case metadata. AI auto-extracts claim data from uploaded documents (employer, insurer, injury, adjusters). 40+ field name mappings handle variation across document types. Conservative enrichment: never overwrites, only fills empty fields | `matter-claim.model.ts`: `enrichClaimFromExtractedFields()` runs on every document processed. Deduplication logic merges body parts and physicians intelligently (case-insensitive matching) | Reduces matter setup from 30-60 min manual data entry to 5 min AI extraction + attorney verification |
| **Medical Record Review (§2.2)** | **Document Ingestion + OCR + Classification + Field Extraction + Case Chat** — Multi-stage pipeline: (1) Upload → (2) Google Document AI OCR (state-of-the-art, handles handwriting/scans) → (3) Text chunking (1,000 tokens, 200 overlap) → (4) Vector embedding (text-embedding-004) → (5) Classification (12 types, 28 medical subtypes) → (6) Field extraction (WPI, diagnoses, restrictions) → (7) Event timeline generation → (8) Case Chat for Q&A | Full pipeline in `document-processing-job.service.ts`. OCR confidence tracking with low-confidence block correction via LLM (`ocr-confidence-corrector.service.ts`). Multimodal verification available (`ocr-multimodal-verifier.service.ts`) | Reduces 8-12 hours of medical record review to 1-2 hours of AI-assisted review + verification. Attorney reads AI summaries, spot-checks against source, focuses on analytical assessment |
| **Discovery (§2.3)** | **Custom Drafts + Template Drafts** — Attorney can generate discovery requests, subpoena cover letters, and deposition outlines from case context. Draft Chat (17 AI tools) enables iterative editing: "Make the interrogatories more specific to the lumbar injury" | `custom-draft-planning.service.ts` (section structure), Template Drafts for standard discovery templates, `draft-chat.service.ts` with tools: `rewrite`, `modify-draft-section`, `find-inconsistencies` | Reduces discovery drafting from 3-5 hours to 30-60 min. Attorney provides direction; AI drafts; attorney refines via Draft Chat |
| **Settlement (§2.4)** | **Case Chat + Knowledge Base + Custom Drafts** — Case Chat summarizes case for MSC preparation. KB provides comparable case outcomes and apportionment case law. Custom Drafts generate MSC position statements grounded in case evidence | `case-chat.service.ts` with tools: `summarize-case`, `get-case-facts`, `search-timeline`. KB integration for legal research | Attorney asks Case Chat to "Summarize the medical evidence and key issues for MSC preparation" → AI generates comprehensive summary with citations → attorney drafts position statement using Custom Drafts |
| **Carrier Communication (§2.5)** | **Template Drafts + Custom Drafts** — Pre-built templates for standard carrier correspondence (status reports, case assessments, initial evaluations). Custom Drafts for non-standard communications. All grounded in case documents with citations | `template-generation.service.ts` (template-based), `custom-draft-planning.service.ts` (freeform). TipTap rich text editor with AI editing tools | Attorney selects "Status Report" template → AI generates from case docs → Draft Chat refines: "Add a section about the recent QME findings" → attorney reviews and sends |
| **Administrative/Forms (§2.6)** | **Form Fill (50+ DWC Forms) + Mailroom** — RAG-powered form filling: semantic search finds relevant document chunks for each field, generates 1-3 candidate answers with confidence scores and citations. Mailroom handles document intake, classification, and matter assignment | `form-filling.service.ts`: batches 10 fields at a time, 2 concurrent batches, ~2-5 sec/field. Mailroom: upload → classify → assign → review pipeline | A 50-field DWC form filled in 2-4 minutes (vs. 30-60 min manual). Attorney reviews confidence badges, verifies against citations, corrects as needed. Eliminates form-filling as a billable activity |

---

### 5.3 AI Services Inventory — Complete Platform Capability Map

| Service | Purpose | AI Model | Input | Output | Attorney Review Gate |
|---------|---------|----------|-------|--------|---------------------|
| **Document Classification** | Categorize uploaded documents into 12 types / 150+ subtypes | Claude 3.5 Sonnet (temp 0.1) | OCR text + document metadata | DocumentType, DocumentSubtype, confidence score | Attorney can correct classification; system learns from corrections |
| **Document Field Extraction** | Extract structured data from documents (dates, parties, amounts, diagnoses) | Claude 3.5 Sonnet | OCR text + document-type-specific extraction schema | Structured fields with confidence | Auto-populates claim data; attorney verifies in matter overview |
| **Form Filling (RAG)** | Pre-populate DWC/WCAB forms from case documents | Claude 3.5 Sonnet | Form field definitions + top 5 relevant document chunks (cosine similarity ≥ 0.6, MMR) | 1-3 answer candidates per field with confidence scores, reasoning, citations | Attorney reviews every field; green/yellow/red/blank badges guide review effort |
| **Case Chat (M2)** | Answer questions about case documents with citations | Vertex AI (Gemini 2.5 Flash, temp 0.3) | Attorney question + retrieved document chunks + case context | Text answer with citations (document ID, page, excerpt, similarity) | Attorney evaluates answer; clicks citations to verify; applies professional judgment |
| **Draft Chat (M3)** | AI-assisted editing of form and template drafts with 17 tools | Vertex AI (Gemini 2.5 Flash, temp 0.3, 16K output) | Attorney edit instruction + current draft content + case context | Modified draft content via tool execution (rewrite, append, update_field, etc.) | Attorney reviews every change; destructive actions require confirmation |
| **Section Draft Chat** | Section-level editing for template and custom drafts | Vertex AI (Gemini 2.5 Flash) | Attorney instruction + section content + case context | Modified section with rebuilt citations | Attorney reviews section changes |
| **Template Generation** | Generate legal documents from predefined templates | Claude 3.5 Sonnet | Template structure + case context + retrieved document chunks | Completed document sections with citations | Attorney reviews in TipTap editor; can regenerate or manually edit any section |
| **Custom Draft Planning** | Determine document structure from natural language prompt | Gemini 2.5 Flash | Attorney prompt describing desired document | Section plan (titles + purposes); fallback to Header/Salutation/Content | Attorney reviews proposed structure before generation proceeds |
| **Event/Timeline Extraction** | Extract time-bound events from documents for case chronology | Claude 3.5 Sonnet (temp 0.7) | Document text + subtype-specific native date types (30+ date types) | MatterEvent records with date, description, citations, embeddings | Attorney reviews timeline; can hide/edit events |
| **OCR Processing** | Extract text from scanned documents and images | Google Document AI | PDF/image upload (max 100MB) | Searchable text, page-level confidence scores | Low-confidence blocks auto-corrected by LLM; attorney can review OCR results |
| **OCR Confidence Correction** | Correct low-confidence OCR blocks | Claude 3.5 Sonnet (temp 0.7) | Low-confidence text block + document type context | Corrected text preserving original for comparison | Automatic; original preserved for attorney review |
| **Claim Data Enrichment** | Auto-populate claim fields from document extractions | Rule-based (no LLM) | Extracted fields from multiple documents | Populated claim record (employer, insurer, injury data, physicians) | Attorney reviews claim data in matter overview; can edit any field |
| **Classification Correction Analysis** | Learn from human corrections to improve future classification | Claude 3.5 Sonnet | Correction delta (old type → new type) + AI reasoning | Correction rules, overweighted/underweighted signals | Automatic learning loop; no attorney action needed beyond making corrections |
| **Workflow Automation** | Trigger draft generation on document events | Rule-based | Document upload/approval event matching workflow rules | Background job queued for draft generation | Attorney defines rules; reviews generated drafts |
| **MerusCase Integration** | Import matters and documents from MerusCase | N/A (API integration) | OAuth2 connection + matter/document selection | Imported matters and documents in Adjudica | Attorney selects which cases/documents to import |

---

### 5.4 Compliance Architecture — How Adjudica Enforces the Attorney-in-the-Loop

| Compliance Layer | Implementation | Where in Code |
|-----------------|---------------|---------------|
| **Citation on every output** | `Citation`, `ChatCitation`, `FactCitation`, `EventCitation` tables link every AI output to source document chunks with page, excerpt, and similarity score | `citation-builder.service.ts`, `structured-citation-parser.service.ts` |
| **Confidence scoring** | Every form field answer scored 0.0-1.0 with color-coded badges (green/yellow/red/blank) guiding attorney review effort | `form-filling.service.ts` → `AnswerCandidate.confidence` |
| **Multi-candidate answers** | 1-3 alternative answers per form field so attorney exercises judgment in selection, not just approval | `AnswerCandidate` model (1-3 per `DraftAnswer`) |
| **Immutable audit trail** | PostgreSQL policies enforce no UPDATE/DELETE on `AuditLog`. 24 event types logged. 7-year retention | `audit-logger.ts` plugin; database-level row policies |
| **Edit attribution** | `DraftEditHistory` records every change with `source` (AI vs HUMAN), `previousValue`, `newValue`, `userId`, `timestamp` | `DraftEditHistory` model in Prisma schema |
| **Draft status workflow** | Drafts progress through `IN_PROGRESS` → `NEEDS_REVIEW` → `PUBLISHED`. Cannot publish without attorney action | `Draft.status` enum; `draft-publish.service.ts` |
| **Privilege exclusion** | Documents classified as attorney-client privileged are excluded from AI retrieval pipeline | `document-classifier.service.ts` → classification check in RAG retrieval |
| **Minimum necessary** | RAG retrieves only top 5 most relevant chunks per query (not entire case file). Maximum Marginal Relevance ensures diversity | `form-filling-vector.service.ts` (cosine similarity ≥ 0.6, MMR diversification) |
| **No model training** | Google Vertex AI contractually prohibited from training on customer data (BAA + AI Addendum) | Architectural: all LLM calls through Vertex AI managed endpoint |
| **RBAC enforcement** | Admin/Attorney/Clerk roles with matter-level access restrictions | `auth.middleware.ts`; `LawFirmMember.role` |
| **LLM observability** | Every LLM call traced in Langfuse: model, prompt, tokens, latency, response | Langfuse integration across all AI services |

---

## References

### California Rules of Professional Conduct
- [Current Rules](https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct/Current-Rules)
- Rules 1.1, 1.4, 1.5, 1.6, 3.1, 3.3, 3.4, 5.3

### California Business and Professions Code
- [B&P Code Chapter 4 — Attorneys](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=BPC&division=3.&title=&part=&chapter=4.&article=)
- §§ 6068, 6125, 6126

### California Labor Code — Division 4
- [Labor Code Division 4](https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=LAB&division=4.)
- §§ 4060-4062.2, 4600-4610, 4650-4657, 4660-4664, 4903-4906, 5500-5500.5

### California Code of Regulations — Title 8
- [DWC Claims Administration (CCR 10100-10118)](https://www.dir.ca.gov/t8/ch4_5sb1.html)
- [WCAB Rules of Practice (CCR 10500-10593)](https://www.dir.ca.gov/t8/ch4_5sb2.html)
- [Medical-Legal Report Requirements (CCR 9793)](https://www.dir.ca.gov/t8/9793.html)

### State Bar Guidance
- [COPRAC Practical Guidance on Generative AI (Nov. 2023)](https://www.calbar.ca.gov/Portals/0/documents/ethics/Generative-AI-Practical-Guidance.pdf)
- [Formal Ethics Opinion 2010-179 (Cloud Computing)](https://www.calbar.ca.gov/Portals/0/documents/ethics/Opinions/2010-179.pdf)

### ABA
- [Formal Opinion 512 (July 2024)](https://www.americanbar.org/news/abanews/aba-news-archives/2024/07/aba-issues-first-ethics-guidance-ai-tools/)

### Glass Box Documentation
- [CA_BAR_ETHICS.md](../../legal/compliance/regulations/CA_BAR_ETHICS.md)
- [PROFESSIONAL_SUPERVISION_REQUIREMENT.md](../PROFESSIONAL_SUPERVISION_REQUIREMENT.md)
- [UPL_DISCLAIMER_TEMPLATE.md](../../standards/UPL_DISCLAIMER_TEMPLATE.md)
- [DEFENSE_ATTORNEY_STRATEGY.md](../../marketing/strategy/DEFENSE_ATTORNEY_STRATEGY.md)
- [BILLING_ETHICS_AND_AI_POSITION.md](../../marketing/research/BILLING_ETHICS_AND_AI_POSITION.md)
- [AI_TRANSPARENCY_DISCLOSURE.md](../../legal/final-documents/product/AI_TRANSPARENCY_DISCLOSURE.md)
- [END_USER_LICENSE_AGREEMENT.md — Section 1A](../../legal/final-documents/product/END_USER_LICENSE_AGREEMENT.md)

---

**Document Status:** Foundational reference — review annually or upon significant regulatory change
**Owner:** CEO / Product
**Legal Review:** Required before product decisions based on this document

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
