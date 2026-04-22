/**
 * In-memory regulatory knowledge base — California Workers' Compensation.
 *
 * Covers the most frequently referenced Labor Code and CCR sections encountered
 * during claims administration. Used by the `lookup_regulation` chat tool to
 * provide examiners with instant, cited regulatory guidance at the point of need.
 *
 * Content is accurate as of the effective dates listed per entry. The examiner
 * should verify applicability against any subsequent legislative amendments.
 *
 * UPL NOTE: This KB provides FACTUAL statutory text summaries and procedural
 * requirements only. It does NOT provide legal analysis, strategic guidance, or
 * coverage determinations. All such questions are RED zone and must be referred
 * to defense counsel.
 *
 * Sources:
 *   - California Labor Code (LC)
 *   - Title 8 California Code of Regulations (8 CCR) — DWC
 *   - Title 10 California Code of Regulations (10 CCR) — CDI
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegulationEntry {
  /** Primary citation key, e.g., "LC 4650" or "8 CCR 9785". */
  citation: string;
  /** Short descriptive title of the regulation. */
  title: string;
  /**
   * Regulatory summary — 2–4 sentences capturing the core duty and its context.
   * Written factually; no legal analysis or strategic guidance.
   */
  fullText: string;
  /** Enumerated procedural requirements the examiner must satisfy. */
  keyRequirements: string[];
  /** Consequences or penalties for non-compliance. */
  penalties: string[];
  /** Cross-referenced statutes and regulations. */
  relatedCitations: string[];
  /** Date the current version took effect (YYYY-MM-DD or "MM/DD/YYYY"). */
  effectiveDate: string;
  /** Practical significance for a claims examiner. */
  examinerRelevance: string;
}

// ---------------------------------------------------------------------------
// Knowledge base entries
// ---------------------------------------------------------------------------

const entries: RegulationEntry[] = [
  // -------------------------------------------------------------------------
  // Labor Code — Compensability & Employer Liability
  // -------------------------------------------------------------------------
  {
    citation: 'LC 3600',
    title: 'Conditions of Compensation — AOE/COE Requirement',
    fullText:
      'Labor Code § 3600 establishes the foundational conditions under which workers\' ' +
      'compensation liability attaches. The injury or illness must arise out of and in ' +
      'the course of employment (AOE/COE). The employer-employee relationship must exist ' +
      'at the time of injury, and the injury must not fall within any statutory exclusion ' +
      '(e.g., intoxication, intentional self-infliction).',
    keyRequirements: [
      'Injury must arise out of employment (AOE) — causal nexus to work activity required',
      'Injury must occur in the course of employment (COE) — during work time and space',
      'Employee status must be established at the time of injury',
      'Evaluate all statutory exclusions (intoxication, intentional self-harm, initial physical aggressor)',
      'Document the employment relationship and circumstances in the claim file',
    ],
    penalties: [
      'Failure to properly investigate AOE/COE exposes the insurer to bad faith claims',
      'Improper denial on compensability grounds is a common source of WCAB litigation',
    ],
    relatedCitations: ['LC 3700', 'LC 5402', '10 CCR 2695.7'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Every new claim requires an AOE/COE evaluation. Document the circumstances of injury thoroughly before making a coverage determination. Compensability questions must be referred to defense counsel.',
  },
  {
    citation: 'LC 3700',
    title: 'Employer Liability — Mandatory Workers\' Compensation Insurance',
    fullText:
      'Labor Code § 3700 requires every employer to secure payment of workers\' compensation ' +
      'by obtaining insurance, becoming a certified self-insurer, or in the case of a public ' +
      'entity, certifying self-insurance. Failure to secure coverage is a criminal offense ' +
      'and creates personal liability for the employer.',
    keyRequirements: [
      'Employer must maintain workers\' compensation coverage at all times during employment',
      'Coverage must be with an admitted carrier or through approved self-insurance',
      'Confirm policy is active and covers the employer, location, and injury date',
      'Verify the injured worker is within the scope of covered employees',
    ],
    penalties: [
      'Uninsured employers face criminal prosecution (misdemeanor or felony)',
      'Uninsured Employers Benefits Trust Fund (UEBTF) may seek reimbursement from uninsured employer',
      'Personal liability of employer officers for unpaid compensation',
    ],
    relatedCitations: ['LC 3600', 'LC 3715', 'LC 3720'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Verify coverage is in force for the injury date on every new claim. Check policy effective dates and any endorsements limiting coverage before accepting the claim.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Medical-Legal Evaluations (QME/AME)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4060',
    title: 'QME Evaluation — Contested Compensability',
    fullText:
      'Labor Code § 4060 governs medical evaluations to determine compensability when ' +
      'the employer disputes the claim. When liability is denied or disputed, the employee ' +
      'is entitled to a panel QME (panelQME) to evaluate compensability. The parties select ' +
      'from a three-physician panel provided by the Medical Unit. Represented employees may ' +
      'agree to an Agreed Medical Evaluator (AME) instead.',
    keyRequirements: [
      'Initiate QME process promptly upon denial or dispute of compensability',
      'Provide injured worker with proper notice of QME panel rights',
      'Unrepresented workers: DWC Medical Unit provides the three-physician panel',
      'Represented workers: parties may stipulate to an AME in lieu of QME panel',
      'Do not terminate medical treatment pending QME evaluation without authorization',
    ],
    penalties: [
      'Failure to comply with QME process can result in WCAB sanctions',
      'Delays in QME process may subject insurer to unreasonable delay penalties under LC 5814',
    ],
    relatedCitations: ['LC 4061', 'LC 4062', 'LC 4067', '8 CCR 31.1', '8 CCR 35'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'When denying a claim, immediately assess whether QME rights have been triggered. Track QME timelines carefully — missed windows can waive the right to a second evaluation.',
  },
  {
    citation: 'LC 4061',
    title: 'QME Evaluation — Objection to PTP Findings (Permanent Disability / Return to Work)',
    fullText:
      'Labor Code § 4061 governs the QME process when a treating physician\'s report on ' +
      'permanent disability or return-to-work capacity is disputed. Either party may object ' +
      'to the primary treating physician\'s (PTP) determination of permanent and stationary ' +
      '(P&S) status, work restrictions, or impairment rating within a specific timeframe. ' +
      'An objection triggers the right to a panel QME or AME evaluation.',
    keyRequirements: [
      'Object in writing to the PTP\'s P&S report within 20 days of receipt if disputing findings',
      'Specify the precise aspects of the report being contested (WPI, work restrictions, etc.)',
      'Provide the injured worker with required notices about QME panel rights upon objection',
      'For unrepresented workers: request panel from DWC Medical Unit',
      'Retain treating physician reports that will be provided to the QME',
    ],
    penalties: [
      'Failure to timely object may waive the right to challenge PTP findings at WCAB',
      'Late objection can result in the PTP report being deemed conclusive on permanent disability',
    ],
    relatedCitations: ['LC 4060', 'LC 4062', 'LC 4660', '8 CCR 35'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Calendar the 20-day objection window from the date you receive any P&S report. Missing this deadline can lock the claim into an unfavorable impairment rating.',
  },
  {
    citation: 'LC 4062',
    title: 'Medical Evaluation Process — Disputes on Medical Issues',
    fullText:
      'Labor Code § 4062 establishes the process for resolving medical disputes that do ' +
      'not involve compensability (those are governed by LC 4060). It covers disputes about ' +
      'medical treatment necessity, extent of disability, and other medical issues. The ' +
      'QME/AME process under this section is the exclusive mechanism for resolving medical ' +
      'disputes in represented cases.',
    keyRequirements: [
      'Identify whether the dispute is a medical issue (LC 4062) vs. compensability (LC 4060)',
      'Unrepresented workers: follow DWC Medical Unit panel QME process',
      'Represented workers: attempt to agree on AME before requesting panel QME',
      'Provide complete medical records to the evaluating physician',
      'Objection timelines under LC 4062 must be strictly tracked',
    ],
    penalties: [
      'Improper use of UR to avoid QME process can trigger penalties',
      'Failure to participate in QME process may result in WCAB adverse rulings',
    ],
    relatedCitations: ['LC 4060', 'LC 4061', 'LC 4600', '8 CCR 9792.6'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Medical disputes are common. Know whether the dispute requires UR (treatment necessity) or a QME (impairment, disability) — they are different tracks with different timelines and requirements.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Benefit Calculations
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4453',
    title: 'Average Weekly Earnings (AWE) — Definition and Calculation',
    fullText:
      'Labor Code § 4453 defines average weekly earnings (AWE) for purposes of calculating ' +
      'temporary and permanent disability benefits. AWE is the employee\'s average weekly ' +
      'wage from all employment at the time of injury, subject to statutory minimums and ' +
      'maximums that are adjusted by the date of injury. The AWE calculation includes ' +
      'regular wages, overtime, tips, and other remuneration.',
    keyRequirements: [
      'Calculate AWE based on all earnings from all employment at time of injury',
      'Use the correct minimum/maximum AWE for the applicable injury date',
      'Include base wages, overtime, tips, bonuses, and other compensation',
      'Exclude fringe benefits that are not wage substitutes',
      'Document wage verification: pay stubs, W-2s, or employer wage statements',
    ],
    penalties: [
      'Incorrect AWE calculation results in overpayment (recovery required) or underpayment (back pay owed)',
      'Willful underpayment may constitute bad faith',
    ],
    relatedCitations: ['LC 4653', 'LC 4654', 'LC 4659'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'AWE is the foundation of every TD and PD benefit calculation. Obtain wage verification before issuing the first payment. AWE errors compound over a long disability period.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Medical Treatment
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4600',
    title: 'Medical Treatment — Employer\'s Obligation to Provide',
    fullText:
      'Labor Code § 4600 requires the employer (or its insurer) to provide all medical ' +
      'treatment reasonably required to cure or relieve the injured worker from the effects ' +
      'of the injury. Treatment must be evidence-based, consistent with the MTUS, and ' +
      'authorized through the Utilization Review process. The employer selects the initial ' +
      'treating physician for 30 days unless a valid pre-designation exists.',
    keyRequirements: [
      'Provide immediate emergency medical care — no prior authorization required',
      'Authorize all MTUS-presumptive treatment promptly to avoid UR delays',
      'Administer UR for non-MTUS or non-emergency treatment requests',
      'Honor valid pre-designation of treating physician (DWC Form 9783 submitted before injury)',
      'Medical provider network (MPN) enrollment must meet regulatory standards',
      'Employer controls treating physician for first 30 days absent pre-designation',
    ],
    penalties: [
      'Denial of required treatment without UR can trigger LC 5814 25% penalty',
      'Delaying emergency care authorization exposes insurer to bad faith',
      'Failure to provide required medical treatment is an unfair claims practice',
    ],
    relatedCitations: ['LC 4601', 'LC 4604.5', 'LC 4610', '8 CCR 9785', '8 CCR 9792.6'],
    effectiveDate: '2004-01-01',
    examinerRelevance:
      'Authorize treatment proactively for MTUS-supported requests. Use UR only for treatment requests that fall outside MTUS guidelines. Document every authorization and denial decision.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Temporary Disability (TD) Benefits
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4650',
    title: 'Temporary Disability Indemnity — Payment Timing (14-Day Rule)',
    fullText:
      'Labor Code § 4650 requires the first payment of temporary disability indemnity ' +
      'to be made within 14 calendar days after the employer first has knowledge of the ' +
      'injury and the employee\'s inability to work. Subsequent payments must be made ' +
      'every 14 days. Late TD payments trigger a mandatory self-imposed 10% increase on ' +
      'the late payment (increasing to 15% effective July 1, 2026 per SB 1234).',
    keyRequirements: [
      'Issue first TD payment within 14 calendar days of knowledge of injury and disability',
      'Continue payments every 14 calendar days without interruption while TD continues',
      'If payment will be late, contact the examiner and document the reason',
      'Self-impose the 10% increase on any late payment — do not wait for a penalty order',
      'Track the first-knowledge date separately from the date of injury',
    ],
    penalties: [
      '10% self-imposed increase on late TD payments (per LC 4650(d))',
      '15% self-imposed increase effective July 1, 2026 (SB 1234)',
      'Additional LC 5814 25% penalty if delay is found unreasonable by the WCAB',
      'Audit findings and DOI market conduct consequences for systemic late payments',
    ],
    relatedCitations: ['LC 4651', 'LC 4653', 'LC 4654', 'LC 5814', '10 CCR 2695.7'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'The 14-day payment rule is the most frequently audited deadline. Calendar the first payment from the first-knowledge date, not the injury date. Late payments are self-auditing — you must self-impose the penalty.',
  },
  {
    citation: 'LC 4653',
    title: 'TD Rate — Two-Thirds of Average Weekly Earnings',
    fullText:
      'Labor Code § 4653 establishes the temporary total disability (TTD) rate at two-thirds ' +
      '(66.67%) of the employee\'s average weekly earnings (AWE), subject to statutory ' +
      'minimums and maximums that are adjusted by the date of injury. The maximum TTD rate ' +
      'is recalculated annually and tied to the state average weekly wage (SAWW).',
    keyRequirements: [
      'Calculate TTD at 2/3 of verified AWE',
      'Apply the correct statutory maximum for the date of injury (SAWW-based)',
      'Apply the correct statutory minimum for the date of injury',
      'Use the calculated rate — not a rounded or approximated figure',
      'Recalculate if AWE is later corrected or supplemented',
    ],
    penalties: [
      'Underpayment results in back pay obligation plus interest',
      'Systemic underpayment is an unfair claims practice',
    ],
    relatedCitations: ['LC 4453', 'LC 4654', 'LC 4650', 'LC 4656'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Get the AWE right before calculating the rate. The 2/3 formula is straightforward, but the min/max caps change each year — always verify against the applicable injury-year schedule.',
  },
  {
    citation: 'LC 4654',
    title: 'TD Rate — Minimums and Partial Disability',
    fullText:
      'Labor Code § 4654 establishes temporary partial disability (TPD) indemnity for ' +
      'employees who can return to work at reduced earnings. TPD is calculated as two-thirds ' +
      'of the difference between the employee\'s pre-injury AWE and their actual post-injury ' +
      'earnings. Minimum TTD/TPD rates are also governed by this section.',
    keyRequirements: [
      'Calculate TPD as 2/3 × (pre-injury AWE minus actual post-injury earnings)',
      'Obtain verified post-injury wage records before issuing TPD payments',
      'Coordinate with the employer regarding modified duty wage rates',
      'Apply statutory minimums — do not pay below the floor even if the calculation yields less',
      'Transition from TTD to TPD when the employee returns to modified duty',
    ],
    penalties: [
      'Failure to pay TPD when employee returns to reduced-wage modified duty triggers penalty exposure',
      'Incorrect TPD calculation results in underpayment liability',
    ],
    relatedCitations: ['LC 4453', 'LC 4653', 'LC 4650'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'When an employee returns to modified duty at reduced wages, transition from TTD to TPD immediately. Get the modified duty wage confirmed in writing from the employer.',
  },
  {
    citation: 'LC 4656',
    title: 'Temporary Total Disability — 104-Week Cap',
    fullText:
      'Labor Code § 4656 limits the aggregate period for which TTD benefits are payable. ' +
      'For most injuries occurring on or after January 1, 2008, TTD is limited to 104 ' +
      'compensable weeks within a 5-year period from the date of injury. Certain ' +
      'catastrophic injuries (e.g., loss of limb, severe burns, amputations, high-level ' +
      'spinal cord injuries) are exempt from the 104-week cap.',
    keyRequirements: [
      'Track cumulative TTD weeks — the cap is 104 compensable weeks, not calendar weeks',
      'Apply the 5-year period from the date of injury as the outer boundary',
      'Identify catastrophic injury categories — these are exempt from the cap',
      'Provide adequate notice before terminating TTD at the 104-week limit',
      'Transition to PD evaluation and PD advances when TTD cap approaches',
    ],
    penalties: [
      'Improper early termination of TTD triggers back pay and penalty exposure',
      'Failure to identify catastrophic injury exemptions is an unfair practice',
    ],
    relatedCitations: ['LC 4653', 'LC 4658', 'LC 4660', 'LC 4661.5'],
    effectiveDate: '2008-01-01',
    examinerRelevance:
      'Track TTD weeks from day one. Calendar the 104-week milestone and prepare the transition plan (PD advances, final P&S evaluation) before the cap is reached, not after.',
  },
  {
    citation: 'LC 4658',
    title: 'Temporary Partial Disability — Duration',
    fullText:
      'Labor Code § 4658 governs the duration of temporary partial disability (TPD) benefits ' +
      'and provides that TPD may not extend beyond 5 years from the date of injury. It also ' +
      'establishes the rate structure for ongoing PD payments once the employee is ' +
      'permanent and stationary, including percentage-based weekly rates tied to the ' +
      'WPI and the PD schedule.',
    keyRequirements: [
      'TPD terminates when the employee reaches P&S status or the 5-year limit, whichever is earlier',
      'Transition to PD advances when P&S status is established',
      'Obtain a P&S report before terminating TPD and switching to PD payments',
      'Apply the correct PD weekly rate based on the percentage and injury date',
    ],
    penalties: [
      'Premature termination of TPD without a P&S report triggers liability',
      'Failure to timely pay PD advances after P&S is established triggers LC 5814 penalties',
    ],
    relatedCitations: ['LC 4653', 'LC 4656', 'LC 4660', 'LC 4700'],
    effectiveDate: '2004-01-01',
    examinerRelevance:
      'P&S status is the trigger point for transitioning from temporary to permanent benefits. Do not terminate TD without a documented P&S determination from the treating physician or QME.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Permanent Disability (PD)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4660',
    title: 'Permanent Disability — Determination of Rating',
    fullText:
      'Labor Code § 4660 provides the framework for determining the percentage of permanent ' +
      'disability using the Schedule for Rating Permanent Disabilities promulgated by the ' +
      'DWC Administrative Director. The rating is based on the impairment rating in the ' +
      'medical report (using AMA Guides, 5th Edition for post-2004 injuries), the occupation ' +
      'of the employee, and the employee\'s age at the time of injury.',
    keyRequirements: [
      'Apply the 2005 PDRS (Permanent Disability Rating Schedule) for injuries on/after 1/1/2005',
      'Use AMA Guides 5th Edition WPI ratings as the medical basis for post-2004 injuries',
      'Apply occupation and age adjustment factors from the PDRS',
      'Obtain a complete P&S report with WPI ratings by body part before rating',
      'Provide the PD rating to the injured worker along with the methodology',
    ],
    penalties: [
      'Incorrect PD rating results in underpayment liability',
      'Failure to provide PD rating information to worker is a notice violation',
    ],
    relatedCitations: ['LC 4660.1', 'LC 4663', 'LC 4658', '8 CCR 10160'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'PD rating is the basis for the most significant financial exposure in many claims. Understand the three factors (WPI, occupation, age) and verify the QME/PTP report provides all three inputs.',
  },
  {
    citation: 'LC 4660.1',
    title: 'Permanent Disability — Psychiatric Add-On Limitations (Post-2013)',
    fullText:
      'Labor Code § 4660.1, enacted by SB 863 effective January 1, 2013, modified the PD ' +
      'rating rules for injuries on or after that date. Most significantly, it prohibits ' +
      'psychiatric add-on PD in cases where the psychiatric injury is compensable only ' +
      'because of a physical industrial injury (i.e., "compensable consequence" psychiatric ' +
      'claims), with narrow exceptions for violent acts and catastrophic injuries.',
    keyRequirements: [
      'Apply LC 4660.1 rules for injuries on/after January 1, 2013',
      'Identify whether psychiatric claim is primary or a compensable consequence of physical injury',
      'Evaluate exceptions: sexual assault, violent crime, direct criminal act, catastrophic injury',
      'Consult defense counsel before rating psychiatric PD add-on for post-2013 injuries',
      'Document the basis for any psychiatric PD rating with specific exception justification',
    ],
    penalties: [
      'Improper allowance of psychiatric add-on PD is an overpayment',
      'Improper denial of excepted psychiatric PD is an underpayment with penalty exposure',
    ],
    relatedCitations: ['LC 4660', 'LC 4663', 'LC 3208.3'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Post-2013 psychiatric PD claims require careful analysis of whether the exception applies. This is a legal determination — refer to defense counsel before adjusting or denying psychiatric PD.',
  },
  {
    citation: 'LC 4663',
    title: 'Apportionment — Causation to Non-Industrial Factors',
    fullText:
      'Labor Code § 4663 requires that permanent disability be apportioned to the percentage ' +
      'directly caused by the industrial injury vs. pre-existing conditions, subsequent ' +
      'non-industrial injuries, or the natural progression of disease. The treating ' +
      'physician or QME must provide a reasoned medical apportionment opinion based on ' +
      'substantial medical evidence.',
    keyRequirements: [
      'Request apportionment opinions from treating physician and/or QME in every PD case',
      'Obtain prior medical records to provide to the physician for apportionment analysis',
      'Apportionment must be based on causation — not just the existence of prior conditions',
      'A prior award of PD is a permissible basis for apportionment',
      'Document all prior industrial and non-industrial conditions in the claim file',
    ],
    penalties: [
      'Improper apportionment is frequently challenged at WCAB',
      'Failure to raise apportionment when evidence supports it may constitute bad faith',
    ],
    relatedCitations: ['LC 4660', 'LC 4664', 'LC 4750'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'Apportionment can significantly reduce the industrial PD percentage and the insurer\'s financial exposure. Gather prior medical records early and request explicit apportionment opinions in every PD case.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Utilization Review (Statutory Authority)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4610',
    title: 'Utilization Review — Employer Obligation and Standards',
    fullText:
      'Labor Code § 4610 requires every insurer, self-insured employer, and claims ' +
      'administrator to establish and maintain a Utilization Review (UR) program for ' +
      'prospective, concurrent, and retrospective review of medical treatment requests. ' +
      'The UR program must be consistent with the MTUS (Medical Treatment Utilization ' +
      'Schedule) and conducted under the supervision of a licensed physician. UR is the ' +
      'required mechanism for contesting a treating physician\'s treatment request — ' +
      'an insurer may not deny treatment without conducting proper UR.',
    keyRequirements: [
      'Establish and maintain a DWC-compliant UR program before any UR decisions are made',
      'All UR decisions must be made or reviewed by a licensed physician in the same or related specialty',
      'Apply MTUS guidelines as the primary evidence-based standard; ACOEM and peer-reviewed literature for gaps',
      'Issue prospective UR decisions within 5 business days of a complete RFA',
      'Issue concurrent UR decisions for inpatients within 24 hours',
      'Provide specific clinical reasons for any modification, delay, or denial of treatment',
    ],
    penalties: [
      'UR decisions not made by a qualifying physician are void and the treatment is deemed authorized',
      'Failure to maintain a UR program is an unfair claims practice',
      'Untimely UR decisions may be treated as automatic approvals under 8 CCR 9792.9',
    ],
    relatedCitations: ['LC 4610.5', 'LC 4616', '8 CCR 9792.6', '8 CCR 9792.9', '8 CCR 9792.9.1'],
    effectiveDate: '2004-01-01',
    examinerRelevance:
      'UR is the only lawful mechanism for contesting a treating physician\'s request. Never instruct a provider to change treatment without a proper UR determination. Denials without UR are per se unreasonable.',
  },
  {
    citation: 'LC 4610.5',
    title: 'Independent Medical Review — Establishment and Scope',
    fullText:
      'Labor Code § 4610.5 establishes the Independent Medical Review (IMR) process as ' +
      'the exclusive remedy for challenging a UR modification, delay, or denial. The DWC ' +
      'contracts with an independent organization to conduct IMR. An injured worker may ' +
      'apply for IMR within 30 days of a UR adverse decision. IMR is binding on all parties ' +
      'and replaces WCAB jurisdiction over treatment disputes.',
    keyRequirements: [
      'Provide IMR application materials with every UR modification, delay, or denial notice',
      'Cooperate with the IMR reviewer — provide all requested records within required timeframes',
      'Implement any IMR approval immediately — it is a binding order',
      'Do not pursue WCAB adjudication of a treatment dispute that is subject to IMR',
      'Track the 30-day employee window for requesting IMR after each UR adverse decision',
    ],
    penalties: [
      'Failure to implement an IMR approval is an unfair claims practice',
      'Ignoring IMR and pursuing WCAB adjudication instead is jurisdictionally improper',
    ],
    relatedCitations: ['LC 4610', 'LC 4610.6', '8 CCR 9792.12', '8 CCR 9792.13'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'IMR replaced WCAB as the forum for treatment disputes. When you issue a UR denial, provide the IMR application form. When IMR overturns you, authorize the treatment — no further contest is available within IMR.',
  },
  {
    citation: 'LC 4612',
    title: 'Utilization Review — Nurse Reviewer Limitations',
    fullText:
      'Labor Code § 4612 restricts UR decisions to licensed physicians and prohibits nurses, ' +
      'claims examiners, and non-physician personnel from making UR modification, delay, or ' +
      'denial decisions. A registered nurse may provide administrative support and gather ' +
      'information but may not override a treating physician\'s treatment request. Only the ' +
      'reviewing physician may sign or authorize a UR denial.',
    keyRequirements: [
      'Ensure all UR denial or modification decisions are signed by a licensed physician',
      'Nurses may perform intake, triage, and information gathering — not clinical decisions',
      'Never route a UR denial through a claims examiner review that bypasses physician sign-off',
      'Confirm that the reviewing physician is in the same or related specialty as the treating physician',
    ],
    penalties: [
      'UR denials signed by non-physicians are void — the treatment is deemed authorized',
      'Systematic non-physician UR decisions are an unfair claims practice',
    ],
    relatedCitations: ['LC 4610', '8 CCR 9792.7', '8 CCR 9792.9'],
    effectiveDate: '2004-01-01',
    examinerRelevance:
      'Verify your UR vendor\'s process: every adverse UR decision must carry a licensed physician\'s name and credentials. A denial without physician sign-off exposes the insurer to automatic authorization of the requested treatment.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Medical Provider Network (MPN)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4616',
    title: 'Medical Provider Network — Establishment and Employee Rights',
    fullText:
      'Labor Code § 4616 authorizes insurers and self-insured employers to establish a ' +
      'Medical Provider Network (MPN) — a selected group of health care providers who ' +
      'deliver medical treatment to injured workers. When a valid MPN is in place, the ' +
      'employer\'s control over the treating physician extends beyond the initial 30-day ' +
      'period. Injured workers in an MPN retain the right to a second and third opinion, ' +
      'and to request a treating physician change within the MPN.',
    keyRequirements: [
      'MPN must be approved by the DWC and include required specialties and geographic coverage',
      'Provide proper MPN notice to employees at time of hire and upon claim filing',
      'Employee must use MPN providers for treatment (after 30 days, or from day one if properly notified)',
      'Employee has the right to a second and third opinion within the MPN for disputed diagnoses',
      'After second and third opinions, employee may request an independent MPN Medical Evaluation (IMNE)',
      'MPN must include sufficient providers within geographic access standards',
    ],
    penalties: [
      'Improperly administered MPN loses its force — employee may treat outside the network',
      'Failure to provide proper MPN notice at hire can invalidate the MPN for that employee',
      'Denying legitimate MPN changes or second opinions is an unfair claims practice',
    ],
    relatedCitations: ['LC 4616.1', 'LC 4616.2', 'LC 4616.3', '8 CCR 9767.1', '8 CCR 9767.3'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'Confirm MPN notice was provided at hire before enforcing MPN restrictions. Without proper notice, the employee may treat outside the MPN at the insurer\'s expense. Track second- and third-opinion requests with their own deadlines.',
  },
  {
    citation: 'LC 4616.3',
    title: 'MPN — Independent Medical Review of Treatment Disputes',
    fullText:
      'Labor Code § 4616.3 provides that disputes about treatment within an MPN that are ' +
      'not resolved through UR and the second/third opinion process may be submitted for an ' +
      'Independent Medical Review (IMR). This IMR process for MPN treatment disputes is ' +
      'separate from the UR-based IMR under LC 4610.5 but similarly binding. The IMNE ' +
      '(Independent Medical Network Evaluation) is the mechanism for resolving specialty ' +
      'disputes about treating physician selection within the MPN.',
    keyRequirements: [
      'Provide proper notice of IMR rights when an MPN treatment dispute is not resolved',
      'Distinguish between MPN-based IMR (LC 4616.3) and UR-based IMR (LC 4610.5) — different tracks',
      'IMNE is ordered when employee disputes second/third opinion finding within MPN',
      'Cooperate with the IMNE reviewer and provide all requested records',
      'IMNE decision is binding on both parties regarding the disputed treatment',
    ],
    penalties: [
      'Failure to implement IMNE or MPN-based IMR decisions is an unfair claims practice',
      'Improper obstruction of MPN rights leads to employee\'s ability to treat outside MPN',
    ],
    relatedCitations: ['LC 4616', 'LC 4616.4', 'LC 4610.5', '8 CCR 9767.7'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'Track both UR-IMR and MPN-IMR timelines separately. MPN disputes have their own procedural pathway that, if not followed, can result in the employee obtaining treatment outside the network at insurer cost.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Liens
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4903',
    title: 'Liens — Types and Priority',
    fullText:
      'Labor Code § 4903 establishes the categories of liens that may be asserted against ' +
      'a workers\' compensation award. Priority liens include: (1) state, county, and city ' +
      'claims for medical treatment provided; (2) claims for medical treatment provided to ' +
      'the injured worker; (3) attorney fees and costs; (4) hospital, surgical, and nursing ' +
      'expenses; and (5) certain EDD disability or unemployment benefits. Medical provider ' +
      'liens must be filed timely to preserve lien rights.',
    keyRequirements: [
      'Identify all potential lienholders at the outset of the claim (medical providers, EDD, attorney)',
      'Verify lien filing deadlines — medical provider liens must be filed with the WCAB within applicable periods',
      'Do not settle the case without addressing known lien claims',
      'Request a lien conference or lien consolidation for complex claims with multiple lienholders',
      'Confirm lien priority order before distributing any settlement proceeds',
      'Obtain lien releases or satisfactions at settlement to close the file cleanly',
    ],
    penalties: [
      'Paying out a settlement without resolving liens creates double payment exposure',
      'Failure to address EDD/state agency liens can result in personal liability',
    ],
    relatedCitations: ['LC 4903.05', 'LC 4903.1', 'LC 4904', 'LC 4905', '8 CCR 10770'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Run a lien search at settlement. Medical providers who treated the claimant outside the authorized network may file liens — resolve them before final payment to avoid double exposure.',
  },
  {
    citation: 'LC 4903.05',
    title: 'Lien Filing — $150 Filing Fee and Activation Requirements',
    fullText:
      'Labor Code § 4903.05 requires medical-legal and non-attorney lienholders to pay ' +
      'a $150 filing fee when filing a lien with the WCAB. Failure to pay the filing fee ' +
      'results in the lien being dismissed. Additionally, lienholders must file an ' +
      '"activation" within a specified period or the lien is deemed abandoned. These ' +
      'provisions were enacted to reduce the volume of dormant liens on the WCAB docket.',
    keyRequirements: [
      'Verify that any lien presented for payment was properly filed and the $150 fee was paid',
      'Check WCAB docket for lien activation — an unactivated lien may be subject to dismissal',
      'Do not pay a lien that was not properly filed or that is subject to a dismissal order',
      'Request proof of lien filing and fee payment before agreeing to pay any lien claim',
    ],
    penalties: [
      'Paying an invalid or dismissed lien creates an unreimbursable overpayment',
      'Failure to object to invalid liens at the lien conference waives the defect',
    ],
    relatedCitations: ['LC 4903', 'LC 4903.06', '8 CCR 10770', '8 CCR 10770.5'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Always verify lien validity before paying. Pull the WCAB docket to confirm the lien was filed, the fee was paid, and the lien was activated. Invalid liens are not owed.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Permanent Disability (additional)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4664',
    title: 'Apportionment — Prior Awards and Combined Disability Limits',
    fullText:
      'Labor Code § 4664 provides that a prior award of permanent disability is conclusive ' +
      'evidence that the disability existed and has been rated. When a subsequent injury ' +
      'results in permanent disability, the prior award must be deducted to avoid double ' +
      'compensation. Additionally, the total permanent disability from all combined injuries ' +
      'cannot exceed 100%.',
    keyRequirements: [
      'Obtain all prior workers\' compensation award documentation when PD is at issue',
      'A prior PD award is conclusive — it does not need to be re-litigated for apportionment',
      'Calculate the net industrial PD by deducting any prior award percentage from the current WPI',
      'Coordinate with defense counsel when multiple prior awards complicate the apportionment analysis',
      'The 100% cap prevents over-compensation across multiple open claims',
    ],
    penalties: [
      'Failure to apply prior award apportionment is an overpayment requiring recovery',
      'Improper application of LC 4664 to non-award medical history is legally incorrect',
    ],
    relatedCitations: ['LC 4660', 'LC 4663', 'LC 4750'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'Query prior claims history and obtain all prior WC award documents on every PD claim. A $50K savings in PD exposure may turn on a properly applied LC 4664 prior-award deduction.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Temporary Disability (additional)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4651',
    title: 'TD Payment — Electronic Payment Option',
    fullText:
      'Labor Code § 4651 authorizes claims administrators to pay temporary disability ' +
      'indemnity by electronic fund transfer (EFT/direct deposit) if the employee ' +
      'consents. The injured worker has the right to receive payment by check and ' +
      'cannot be compelled to use electronic payment. Electronic payment does not ' +
      'alter the 14-day payment timing requirement under LC 4650.',
    keyRequirements: [
      'Obtain written employee consent before switching to electronic TD payments',
      'Maintain the 14-day payment cycle regardless of payment method',
      'Provide the employee with the option to revert to check payment upon request',
      'Document consent form in the claim file',
      'EFT payment date is the settlement date — ensure funds are available 14 days from the first-knowledge date',
    ],
    penalties: [
      'Forcing electronic payment without consent is a payment method violation',
      'Electronic payment does not excuse late payment — the 14-day rule still applies',
    ],
    relatedCitations: ['LC 4650', 'LC 4653'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'EFT can speed up payment processing but requires documented consent. For the 14-day deadline, confirm the EFT will settle in the employee\'s account within the window — initiation date is not settlement date.',
  },
  {
    citation: 'LC 4657',
    title: 'TD Rate — Earnings Computation for Irregular Employment',
    fullText:
      'Labor Code § 4657 provides an alternative AWE calculation for employees with ' +
      'irregular, seasonal, or part-time employment histories where the standard 52-week ' +
      'average under LC 4453 would be unfair or inaccurate. In these cases, the AWE is ' +
      'computed as the daily earnings of similar employees in the same occupation and ' +
      'locality for the same type of work, multiplied by the number of working days per ' +
      'week that the injured worker customarily worked.',
    keyRequirements: [
      'Identify whether the employee has irregular, seasonal, or part-time employment',
      'Gather comparable employee wage data from the employer for the same job classification',
      'Compute AWE by multiplying the daily comparable wage by actual working days per week',
      'Document the methodology and comparable-employee data used',
      'Confirm calculated AWE with the employer before issuing benefits',
    ],
    penalties: [
      'Incorrect AWE for irregular workers results in underpayment or overpayment liability',
      'Using the standard 52-week calculation when LC 4657 applies is an error',
    ],
    relatedCitations: ['LC 4453', 'LC 4653', 'LC 4659'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Agricultural workers, seasonal construction workers, day laborers, and part-time employees often qualify for the LC 4657 alternative calculation. Always ask about employment pattern when computing AWE.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Statute of Limitations (additional)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 5410',
    title: 'New and Further Disability — 5-Year Petition Period',
    fullText:
      'Labor Code § 5410 provides that a petition to reopen a claim for new or further ' +
      'disability arising from an industrial injury must be filed within 5 years from the ' +
      'date of injury. "New or further disability" includes a worsening of a previously ' +
      'rated condition, a new body part becoming symptomatic as a result of the industrial ' +
      'injury, or the need for additional medical treatment that was not previously awarded.',
    keyRequirements: [
      'Track the 5-year period from date of injury for all closed claims that may have further disability',
      'Respond to any petition to reopen with a review of all prior medical evidence',
      'Verify whether the claimed new disability is causally related to the original industrial injury',
      'Consult defense counsel before accepting a petition to reopen',
      'Review prior award language to understand what conditions were previously adjudicated',
    ],
    penalties: [
      'Improperly rejecting a timely petition to reopen exposes the insurer to WCAB sanctions',
      'Missing the 5-year period permanently bars the petition — confirm the injury date',
    ],
    relatedCitations: ['LC 5405', 'LC 5412', 'LC 4660'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Keep closed files accessible for 5 years post-injury. A petition to reopen within that window is legally cognizable and must be investigated on the merits before any denial.',
  },

  // -------------------------------------------------------------------------
  // Title 8 CCR — WCAB Procedure
  // -------------------------------------------------------------------------
  {
    citation: '8 CCR 10450',
    title: 'WCAB — Filing Requirements and Verified Pleadings',
    fullText:
      'Title 8 CCR § 10450 governs the requirements for filing pleadings and documents with ' +
      'the Workers\' Compensation Appeals Board (WCAB). All pleadings that contain ' +
      'factual allegations must be verified under penalty of perjury. Documents must be ' +
      'filed in the district office with venue jurisdiction over the claim. Electronic ' +
      'filing (e-filing) is required for claims administrators and attorneys.',
    keyRequirements: [
      'Verify all WCAB pleadings containing factual allegations before filing',
      'File in the WCAB district office with venue jurisdiction (employee\'s county of injury or residence)',
      'Use the DWC electronic filing system (e-filing) as required for claims administrators',
      'Include the case number and all party names on every filed document',
      'Retain copies of all filed documents with proof of service',
    ],
    penalties: [
      'Unverified pleadings may be rejected or stricken by the WCAB',
      'Filing in the wrong venue causes delay and may result in transfer orders',
    ],
    relatedCitations: ['8 CCR 10453', '8 CCR 10500', '8 CCR 10600'],
    effectiveDate: '2020-01-01',
    examinerRelevance:
      'All litigation documents sent to the WCAB must be properly verified and filed in the correct office. Coordinate with defense counsel to ensure filings meet procedural requirements.',
  },
  {
    citation: '8 CCR 10500',
    title: 'WCAB — Declaration of Readiness to Proceed',
    fullText:
      'Title 8 CCR § 10500 governs the Declaration of Readiness to Proceed (DOR), the ' +
      'document that requests a WCAB hearing date. A party may file a DOR when a genuine ' +
      'dispute exists and informal resolution has been exhausted. The filing party must ' +
      'complete the DOR form, certify the claim is ready for hearing, and indicate the type ' +
      'of hearing requested (Mandatory Settlement Conference, Expedited Hearing, or Trial).',
    keyRequirements: [
      'File a DOR only when the claim is genuinely ready for hearing — not as a tactical move',
      'Identify the specific issues to be heard on the DOR form',
      'Serve the DOR on all parties of record on the same day as filing',
      'Prepare a summary of evidence and witnesses for the pre-hearing exchange',
      'Be prepared to resolve the listed issues at the hearing — the WCAB expects resolution',
    ],
    penalties: [
      'Filing a DOR for issues not yet ripe can result in WCAB sanctions and attorney fee awards',
      'Failure to appear at a scheduled hearing after a DOR is filed triggers default procedures',
    ],
    relatedCitations: ['8 CCR 10450', '8 CCR 10505', '8 CCR 10545'],
    effectiveDate: '2020-01-01',
    examinerRelevance:
      'The DOR is the trigger for WCAB litigation. When defense counsel files a DOR on your claim, begin gathering all evidence immediately — the MSC date may arrive within 30 to 60 days.',
  },
  {
    citation: '8 CCR 10545',
    title: 'WCAB — Mandatory Settlement Conference Procedures',
    fullText:
      'Title 8 CCR § 10545 governs the Mandatory Settlement Conference (MSC), the primary ' +
      'hearing at which the parties attempt to resolve a pending dispute before a WCAB Judge. ' +
      'Both parties (or their representatives) must appear at the MSC with full settlement ' +
      'authority. If the case does not settle, the judge sets a Trial date and the parties ' +
      'exchange witness and evidence lists.',
    keyRequirements: [
      'Appear at the MSC with full settlement authority — not limited authority',
      'Complete the pre-MSC Joint Exhibit and Witness List exchange before the hearing',
      'Bring all medical reports, wage records, and relevant claim documents to the MSC',
      'If settling, have a written Compromise and Release or Stipulation with Request for Award prepared',
      'If not settling, be prepared to identify all disputed issues and proposed evidence for Trial',
    ],
    penalties: [
      'Failure to appear at an MSC results in sanctions and may result in a default judgment against the absent party',
      'Appearing without settlement authority is an MSC violation subject to sanctions',
    ],
    relatedCitations: ['8 CCR 10500', '8 CCR 10560', '8 CCR 10600'],
    effectiveDate: '2020-01-01',
    examinerRelevance:
      'MSCs frequently resolve claims. Prepare defense counsel with a realistic settlement range before the MSC. Appearing without authority to settle wastes judicial resources and triggers sanctions.',
  },
  {
    citation: '8 CCR 10600',
    title: 'WCAB — Compromise and Release Agreement',
    fullText:
      'Title 8 CCR § 10600 governs the Compromise and Release (C&R) — the document by ' +
      'which the parties fully settle a workers\' compensation claim for a lump sum payment. ' +
      'A C&R must be approved by a WCAB Judge after confirming the worker understands the ' +
      'terms. The C&R releases future liability for the industrial injury, including future ' +
      'medical treatment, unless specific carve-outs are negotiated. The worker must be ' +
      'represented by counsel or appear in person before the WCJ.',
    keyRequirements: [
      'Prepare a written C&R form using the DWC-approved format',
      'Address all issues: TD, PD, medical-legal, liens, future medical treatment',
      'Ensure all known lienholders are addressed and either paid or released in the C&R',
      'Obtain WCAB Judge approval before issuing the settlement check',
      'Issue the settlement check within 30 days of final WCAB approval',
      'Retain a copy of the approved C&R in the claim file',
    ],
    penalties: [
      'Paying settlement before WCAB approval is improper and may not constitute a valid release',
      'Failure to address liens in the C&R creates double-payment exposure',
      'Delay in post-approval payment triggers penalty exposure',
    ],
    relatedCitations: ['8 CCR 10545', '8 CCR 10605', 'LC 4903', 'LC 5000'],
    effectiveDate: '2020-01-01',
    examinerRelevance:
      'Never issue a settlement check until the WCJ has approved the C&R and the approval is documented. Calendar the 30-day post-approval payment deadline. Ensure the C&R resolves all known liens by name.',
  },

  // -------------------------------------------------------------------------
  // Title 8 CCR — Permanent Disability Rating Schedule
  // -------------------------------------------------------------------------
  {
    citation: '8 CCR 10160',
    title: 'Permanent Disability Rating Schedule — 2005 PDRS and AMA Guides',
    fullText:
      'Title 8 CCR § 10160 adopts the 2005 Schedule for Rating Permanent Disabilities (PDRS) ' +
      'for injuries occurring on or after January 1, 2005. The PDRS translates whole person ' +
      'impairment (WPI) ratings from AMA Guides (5th Ed.) into California permanent ' +
      'disability percentages using occupational adjustment and age factors. The resulting ' +
      'PD percentage determines the number of weeks of PD indemnity payable under the ' +
      'benefit rate schedule.',
    keyRequirements: [
      'Use the 2005 PDRS for all injuries on or after January 1, 2005',
      'Input the WPI percentage from the AMA Guides (5th Ed.) as the medical basis',
      'Apply the occupational modifier using the employee\'s occupation code and group',
      'Apply the age modifier based on the employee\'s age at time of injury',
      'Calculate final PD percentage and convert to weeks and total PD indemnity dollar amount',
      'Document the rating methodology in the claim file with the specific numbers used',
    ],
    penalties: [
      'Incorrect PDRS application results in underpayment liability',
      'Using the wrong schedule edition (pre-2005 vs. 2005) is a rating error',
    ],
    relatedCitations: ['LC 4660', 'LC 4658', 'LC 4663', '8 CCR 10161'],
    effectiveDate: '2005-01-01',
    examinerRelevance:
      'Use the DWC PDRS rating instructions to convert the QME\'s WPI to a California PD percentage. The three inputs are WPI, occupation group, and age — all must be documented to support the rating.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Death Benefits
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4700',
    title: 'Death Benefits — Entitlement',
    fullText:
      'Labor Code §§ 4700–4706 govern death benefits payable to dependents of employees ' +
      'who die as a result of an industrial injury. Dependents are classified as total, ' +
      'partial, or presumptive. Total dependents receive a lump sum of $320,000 (for ' +
      'injuries on/after 1/1/2013). Burial expenses of up to $10,000 are also required.',
    keyRequirements: [
      'Confirm death was caused by or related to an industrial injury or illness',
      'Identify all potential dependents: spouse, minor children, parents, siblings',
      'Classify each dependent as total, partial, or none based on dependency test',
      'Pay burial expenses up to $10,000 promptly regardless of dependency determination',
      'For total dependents: $320,000 lump sum (or per applicable injury-date schedule)',
      'Provide proper notices to surviving family regarding their WC rights',
    ],
    penalties: [
      'Failure to pay burial expenses promptly is an unfair claims practice',
      'Delayed death benefit payments trigger penalty and interest liability',
    ],
    relatedCitations: ['LC 4702', 'LC 4703', 'LC 4704', 'LC 4706', 'LC 5402'],
    effectiveDate: '2013-01-01',
    examinerRelevance:
      'Death claims require immediate engagement with the family and prompt payment of burial expenses. Do not delay burial expense payment while investigating death causation.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Special Benefits (Public Safety)
  // -------------------------------------------------------------------------
  {
    citation: 'LC 4850',
    title: 'Police and Firefighter Leave of Absence — Full Salary Continuation',
    fullText:
      'Labor Code § 4850 provides that certain public safety employees (police officers, ' +
      'firefighters, lifeguards, and others listed in the statute) receive a leave of ' +
      'absence without loss of salary (LOA) for up to one year when disabled by an ' +
      'industrial injury. The LOA benefit replaces TD for the first year of disability. ' +
      'After one year, the employee receives normal TD benefits.',
    keyRequirements: [
      'Confirm the employee qualifies as a 4850 employee (police, fire, corrections, etc.)',
      'Pay full salary during the LOA period — not the 2/3 TD rate',
      'LOA runs concurrent with any TTD period, up to one year',
      'After the 4850 year, standard TD rate and caps apply',
      'Coordinate with employer regarding integration with accrued leave (varies by MOU)',
      'Track the 4850 year carefully — it starts from the date of disability',
    ],
    penalties: [
      'Failure to pay full salary during the 4850 period is a wage violation',
      'Miscalculating 4850 entitlement triggers back pay liability',
    ],
    relatedCitations: ['LC 4853', 'LC 4653', 'LC 4656'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'LC 4850 applies exclusively to public agency employers. When handling public safety claims, immediately identify 4850 eligibility — the payment obligation is full salary, not the standard TD rate.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Filing Requirements & Statute of Limitations
  // -------------------------------------------------------------------------
  {
    citation: 'LC 5401',
    title: 'DWC-1 Claim Form — Employer Obligation and Filing',
    fullText:
      'Labor Code § 5401 requires an employer to provide the DWC-1 Claim Form to an ' +
      'injured employee within one working day of receiving notice or knowledge of an ' +
      'industrial injury. The employee must complete and return the form. The employer ' +
      'must then forward the completed claim to the claims administrator within one ' +
      'working day of receipt.',
    keyRequirements: [
      'Employer provides DWC-1 within 1 working day of knowledge of injury',
      'DWC-1 must include: insurer name, employer name, instructions for filing',
      'Employee completes Part B and returns to employer',
      'Employer/insurer forwards completed DWC-1 to claims administrator within 1 working day',
      'Filing the DWC-1 opens the claim and triggers the investigative clock',
      'Document the date received to establish the 90-day liability presumption window',
    ],
    penalties: [
      'Failure to provide DWC-1 within 1 working day is an unfair claims practice',
      'Employer failure to provide DWC-1 can subject employer to civil penalty of $1,000',
    ],
    relatedCitations: ['LC 5402', 'LC 5405', '10 CCR 2695.5'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'The DWC-1 receipt date starts the 90-day clock for a liability presumption under LC 5402. Document receipt immediately and confirm the employer met the 1-working-day provision timeline.',
  },
  {
    citation: 'LC 5402',
    title: 'Statute of Limitations — 1-Year Filing Period and Liability Presumption',
    fullText:
      'Labor Code § 5402 establishes a one-year statute of limitations for filing a workers\' ' +
      'compensation claim, running from the date of injury or date the employee knew or ' +
      'should have known the injury was work-related. Additionally, if the insurer fails to ' +
      'accept or deny the claim within 90 days of the employer\'s receipt of the DWC-1, ' +
      'the injury is presumed compensable.',
    keyRequirements: [
      'Evaluate timeliness of filing for every new claim — run from injury date or knowledge date',
      'Affirmatively accept or deny the claim within 90 days of DWC-1 receipt',
      'If 90 days passes without a decision, the injury is presumed industrial (rebuttable)',
      'Document the DWC-1 receipt date in the claim file',
      'Consult defense counsel before asserting a statute of limitations defense',
    ],
    penalties: [
      'Missing the 90-day decision window creates a presumption of compensability',
      'Improper SOL defense that delays payment can trigger LC 5814 penalties',
    ],
    relatedCitations: ['LC 5401', 'LC 5405', '10 CCR 2695.7'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Calendar the 90-day decision deadline from DWC-1 receipt on every new claim. The liability presumption is one of the most consequential administrative mistakes in claims handling.',
  },
  {
    citation: 'LC 5405',
    title: 'Time for Filing Application — WCAB Petition',
    fullText:
      'Labor Code § 5405 provides a one-year period for injured workers to file an ' +
      'Application for Adjudication with the WCAB. The one-year period runs from the ' +
      'date of injury, date of last payment of temporary disability, or date of last ' +
      'provision of medical treatment, whichever is later. The statute creates rolling ' +
      'limitations periods that reset with each benefit payment or treatment.',
    keyRequirements: [
      'Track the last TD payment date and last medical treatment date for each claim',
      'Understand that every benefit payment or medical authorization restarts the 1-year window',
      'Do not assume a claim is time-barred without analyzing the full payment history',
      'Consult defense counsel before raising a statute of limitations defense at WCAB',
    ],
    penalties: [
      'Improper SOL assertion can result in WCAB sanctions',
      'Failure to raise a valid SOL defense early may waive it',
    ],
    relatedCitations: ['LC 5402', 'LC 5410', 'LC 5412'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Statute of limitations issues require legal analysis — they are RED zone for the AI. Always refer SOL questions to defense counsel.',
  },

  // -------------------------------------------------------------------------
  // Labor Code — Penalties
  // -------------------------------------------------------------------------
  {
    citation: 'LC 5814',
    title: 'Penalty for Unreasonable Delay or Refusal to Pay Compensation',
    fullText:
      'Labor Code § 5814 authorizes the WCAB to impose a 25% increase (up to $10,000) on ' +
      'any unreasonably delayed or withheld compensation payment. The penalty applies to ' +
      'each specific benefit payment that is delayed without good cause. Systemic delays ' +
      'may be found to constitute a single course of conduct, limiting the penalty, but ' +
      'each distinct delay may be subject to a separate 25% award.',
    keyRequirements: [
      'Pay all compensation on time — create calendar reminders for all payment deadlines',
      'Document the reason for any delay contemporaneously',
      'If delay is necessary (e.g., verification needed), communicate the reason to the worker',
      'Self-impose the 10% increase for late TD payments under LC 4650 before a penalty is sought',
      'Review all pending payments when a claim comes off reserve or status changes',
    ],
    penalties: [
      '25% increase on the delayed payment, capped at $10,000 per instance',
      'Systemic pattern of delays may result in regulatory action by the CDI',
    ],
    relatedCitations: ['LC 4650', 'LC 4651', 'LC 5814.5'],
    effectiveDate: '1989-01-01',
    examinerRelevance:
      'Every unjustified late payment is a potential LC 5814 exposure. Document your reason for any delay, communicate it to the injured worker, and resolve the delay as quickly as possible.',
  },

  // -------------------------------------------------------------------------
  // Title 8 CCR — Treating Physician Reporting
  // -------------------------------------------------------------------------
  {
    citation: '8 CCR 9785',
    title: 'Reporting Duties of Primary Treating Physician',
    fullText:
      'Title 8 CCR § 9785 establishes the reporting obligations of the primary treating ' +
      'physician (PTP), including the PR-2 progress report and PR-4 permanent and stationary ' +
      'report. The PTP must report on work status, treatment plan, and disability as ' +
      'directed. PR-2 reports are due within 5 days of a significant change in the ' +
      'employee\'s condition.',
    keyRequirements: [
      'Initial medical report required within 5 days of initial treatment',
      'PR-2 required within 5 days of any significant change in condition or work status',
      'PR-4 (P&S report) required when the employee reaches maximum medical improvement',
      'Follow up on overdue physician reports — delays block benefit adjustments',
      'Copy of all PR-2 and PR-4 reports must be provided to the insurer and employee',
    ],
    penalties: [
      'Missing physician reports delay P&S determinations and PD evaluations',
      'Failure to follow up on overdue reports can be an unfair claims practice',
    ],
    relatedCitations: ['LC 4600', 'LC 4061', '8 CCR 9786'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Track PTP reporting deadlines. PR-2 reports with work status changes must be reviewed promptly — they trigger TD adjustments and return-to-work actions.',
  },

  // -------------------------------------------------------------------------
  // Title 8 CCR — Utilization Review
  // -------------------------------------------------------------------------
  {
    citation: '8 CCR 9792.6',
    title: 'Utilization Review — Definitions and Scope',
    fullText:
      'Title 8 CCR § 9792.6 defines the terms used in the Utilization Review (UR) ' +
      'regulatory scheme, including "prospective review," "concurrent review," ' +
      '"retrospective review," and the standards for what constitutes a complete ' +
      'request for authorization (RFA). The definitions in this section control the ' +
      'timeliness requirements in 8 CCR 9792.9 and 9792.9.1.',
    keyRequirements: [
      'Understand the three types of UR: prospective, concurrent, and retrospective',
      'A complete RFA must include the treating physician\'s substantive supporting information',
      'An incomplete RFA triggers a request for additional information — specific timelines apply',
      'UR must be conducted by a licensed physician in the same or related specialty',
      'Apply MTUS guidelines as the primary evidence-based standard for UR decisions',
    ],
    penalties: [
      'Improperly conducted UR may be set aside by the IMR process',
      'Non-compliant UR programs expose insurers to CDI market conduct penalties',
    ],
    relatedCitations: ['8 CCR 9792.7', '8 CCR 9792.9', '8 CCR 9792.9.1', 'LC 4610'],
    effectiveDate: '2013-04-09',
    examinerRelevance:
      'UR is the required pathway for disputing medical treatment requests. Know the difference between an RFA that triggers UR timelines and an incomplete RFA that requires follow-up.',
  },
  {
    citation: '8 CCR 9792.9',
    title: 'Utilization Review — Prospective/Concurrent Timeliness',
    fullText:
      'Title 8 CCR § 9792.9 establishes the timeliness requirements for prospective and ' +
      'concurrent UR decisions. A written UR decision must be issued within 5 business days ' +
      'of receipt of a complete RFA for prospective reviews, or within 24 hours for ' +
      'concurrent reviews when the employee is an inpatient. These timelines are strictly ' +
      'enforced and a missed UR deadline can invalidate the UR determination.',
    keyRequirements: [
      'Prospective UR decision: within 5 business days of complete RFA',
      'Concurrent UR decision: within 24 hours if patient is an inpatient',
      'If RFA is incomplete, request additional information within 5 business days',
      'Modified or delayed UR decisions must be communicated to the treating physician and worker',
      'UR denial must state the specific criteria or guidelines on which it is based',
    ],
    penalties: [
      'Late UR decision may be treated as an automatic approval of the treatment request',
      'IMR may overturn a late UR decision on procedural grounds',
      'Systematic UR delays are unfair claims practices',
    ],
    relatedCitations: ['8 CCR 9792.6', '8 CCR 9792.9.1', '8 CCR 9792.10', 'LC 4610'],
    effectiveDate: '2013-04-09',
    examinerRelevance:
      'UR timeliness is one of the most scrutinized compliance areas. Calendar UR deadlines from the RFA receipt date. A late UR decision is worse than no UR decision.',
  },
  {
    citation: '8 CCR 9792.10',
    title: 'Utilization Review — Retrospective Review',
    fullText:
      'Title 8 CCR § 9792.10 governs retrospective UR — review of treatment that has ' +
      'already been rendered. Retrospective UR must be completed and communicated within ' +
      '30 calendar days of receipt of the complete medical records supporting the claim. ' +
      'A retrospective denial does not create an obligation to repay an employee for ' +
      'treatment already rendered, but it affects future payment obligations.',
    keyRequirements: [
      'Complete retrospective UR within 30 calendar days of receiving complete medical records',
      'Document the date all records were received to establish the 30-day window',
      'Communicate the retrospective UR decision to the treating physician and employee',
      'Retrospective denial applies only to the insurer\'s payment obligation — provider issues',
    ],
    penalties: [
      'Late retrospective UR decisions may be treated as approvals',
      'Use of retrospective UR to avoid prospective approval timelines is improper',
    ],
    relatedCitations: ['8 CCR 9792.6', '8 CCR 9792.9', 'LC 4610'],
    effectiveDate: '2013-04-09',
    examinerRelevance:
      'Retrospective UR is appropriate when treatment was rendered on an emergency basis. Do not use retrospective UR as a substitute for timely prospective UR.',
  },
  {
    citation: '8 CCR 9792.12',
    title: 'Independent Medical Review — UR Dispute Resolution',
    fullText:
      'Title 8 CCR § 9792.12 establishes the Independent Medical Review (IMR) process ' +
      'as the exclusive mechanism for challenging a UR modification, delay, or denial. ' +
      'An injured worker may request IMR within 30 calendar days of a UR decision. IMR ' +
      'is conducted by a state-contracted independent reviewer and is binding on all parties.',
    keyRequirements: [
      'Provide proper notice of the right to request IMR with every UR adverse decision',
      'Cooperate with the IMR process — provide all requested records promptly',
      'IMR decisions are binding — implement authorization if IMR overturns the UR denial',
      'Do not reopen a UR denial after an IMR approval without new medical information',
    ],
    penalties: [
      'Failure to implement an IMR decision is an unfair claims practice',
      'Delay in providing records to IMR can result in the UR denial being set aside',
    ],
    relatedCitations: ['8 CCR 9792.9', 'LC 4610.5', 'LC 4616.3'],
    effectiveDate: '2013-04-09',
    examinerRelevance:
      'IMR is the final word on treatment disputes. Once IMR issues a decision, you must comply. Track IMR deadlines as carefully as UR deadlines.',
  },

  // -------------------------------------------------------------------------
  // Title 8 CCR — Claim Administration (DWC)
  // -------------------------------------------------------------------------
  {
    citation: '8 CCR 10101',
    title: 'Claim Acknowledgment — 14-Day Requirement',
    fullText:
      'Title 8 CCR § 10101 requires the claims administrator to acknowledge receipt of ' +
      'every filed DWC-1 claim form within 14 calendar days of receipt. The acknowledgment ' +
      'must provide the claimant with information about the claim process, including the ' +
      'name of the assigned examiner and contact information.',
    keyRequirements: [
      'Send written acknowledgment within 14 calendar days of DWC-1 receipt',
      'Include the assigned examiner\'s name and direct contact information',
      'Provide information about the claim process and the worker\'s rights',
      'Document the acknowledgment in the claim file with the date sent',
    ],
    penalties: [
      'Failure to acknowledge is an unfair claims practice under Cal. Ins. Code § 790.03(h)(2)',
      'Audit finding per 10 CCR 2695.5(b) for each missed acknowledgment',
    ],
    relatedCitations: ['LC 5401', '10 CCR 2695.5', '8 CCR 10109'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Acknowledgment letters should be generated automatically upon claim assignment. Verify the acknowledgment was sent and the confirmation is in the file.',
  },
  {
    citation: '8 CCR 10109',
    title: 'Notice Requirements — Rights, Benefits, and Obligations',
    fullText:
      'Title 8 CCR § 10109 requires the claims administrator to provide the injured worker ' +
      'with specific notices regarding their rights, benefits, and obligations under the ' +
      'workers\' compensation system. Required notices include the Benefit Notice (BN), ' +
      'Delay Notice, and the Notice of Rights to Medical Evaluation.',
    keyRequirements: [
      'Send the initial Benefit Notice (or delay notice) within 14 days of knowledge of injury/disability',
      'Provide the worker with the DWCA notice of rights upon claim filing',
      'Send written notice of any change in benefit status within 14 days',
      'All notices must be in the language primarily spoken by the worker if that language is not English',
      'Document all notices in the claim file with proof of delivery',
    ],
    penalties: [
      'Failure to provide required notices is an unfair claims practice',
      'Missing notice can waive certain defenses and delay determination rights',
    ],
    relatedCitations: ['LC 4650', 'LC 5401', '8 CCR 10101', '10 CCR 2695.7'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Notices are legally required at multiple points. Build a notice checklist into the claim setup workflow and verify completion at each stage.',
  },
  {
    citation: '8 CCR 10110',
    title: 'Investigation Standards — Claims Administration',
    fullText:
      'Title 8 CCR § 10110 establishes minimum standards for claim investigation by claims ' +
      'administrators. Every claim must be promptly, thoroughly, and objectively investigated. ' +
      'The investigation must include contact with the employer, the employee, witnesses, and ' +
      'treating medical providers as appropriate. Investigation notes must be documented in ' +
      'the claim file.',
    keyRequirements: [
      'Contact the employee within 3 business days of claim assignment',
      'Contact the employer and witnesses within 5 business days',
      'Obtain and review all available medical records',
      'Document all investigation steps, contacts, and findings in the claim file',
      'Conduct investigation objectively — gather all evidence, favorable and unfavorable',
      'Complete the investigation before making a coverage determination',
    ],
    penalties: [
      'Inadequate investigation is the most common basis for bad faith claims',
      'CDI market conduct audits specifically examine investigation completeness',
    ],
    relatedCitations: ['8 CCR 10111', '10 CCR 2695.7', 'LC 5402'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Document every investigation step with dates. An undocumented investigation is an uninvestigated claim from a legal defense perspective.',
  },
  {
    citation: '8 CCR 10111',
    title: 'Coverage Determination — 40-Day Standard',
    fullText:
      'Title 8 CCR § 10111 requires the claims administrator to accept, deny, or delay ' +
      'the claim within 40 calendar days of receiving the completed DWC-1. A delay notice ' +
      'extends the decision window with valid justification. The 90-day liability presumption ' +
      'under LC 5402 runs concurrently but represents a separate legal consequence.',
    keyRequirements: [
      'Issue acceptance, denial, or delay notice within 40 calendar days of DWC-1 receipt',
      'Delay notice must state the specific reason for the delay',
      'Each delay notice extends the deadline by 30 days, not to exceed 90 days total',
      'Document the basis for the decision with specific evidence in the claim file',
      'Acceptance or denial must be communicated in writing to the employee',
    ],
    penalties: [
      'Missing the 40-day deadline is an unfair claims practice per 10 CCR 2695.7(b)',
      'Failure to timely deny triggers the 90-day compensability presumption under LC 5402',
    ],
    relatedCitations: ['LC 5402', '8 CCR 10112', '10 CCR 2695.7'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'Calendar the 40-day determination deadline on every new claim. This is a bright-line rule — no exceptions without a documented delay notice.',
  },
  {
    citation: '8 CCR 10112',
    title: 'Delay Notice — 14-Day Communication Requirement',
    fullText:
      'Title 8 CCR § 10112 requires that when a claims administrator cannot complete its ' +
      'investigation within the initial timeframe, a written delay notice must be sent to ' +
      'the injured worker within 14 calendar days of the DWC-1 receipt. The notice must ' +
      'state the specific reason for the delay and the expected decision date.',
    keyRequirements: [
      'Send delay notice within 14 calendar days of DWC-1 receipt when investigation is not complete',
      'State the specific reason for delay (e.g., awaiting medical records, employer statement)',
      'Provide an estimated decision date in the delay notice',
      'Delay notice is not a denial — do not terminate TD or medical treatment pending investigation',
      'Follow up within 30 days with either a decision or a subsequent delay notice',
    ],
    penalties: [
      'Failure to send timely delay notice is an unfair claims practice',
      'Using delay notices as a tactic to avoid decisions triggers CDI scrutiny',
    ],
    relatedCitations: ['8 CCR 10111', '10 CCR 2695.7', 'LC 5402'],
    effectiveDate: '2003-01-01',
    examinerRelevance:
      'When investigation is not complete by day 14, send the delay notice rather than missing the 40-day deadline silently. Document the specific reason — generic delay notices are an audit red flag.',
  },

  // -------------------------------------------------------------------------
  // Title 10 CCR — Insurance Department Standards
  // -------------------------------------------------------------------------
  {
    citation: '10 CCR 2695.5',
    title: 'File and Record Documentation Standards',
    fullText:
      'Title 10 CCR § 2695.5 requires insurers to maintain a complete written record of ' +
      'each claim file, including all communications, investigation notes, medical records, ' +
      'decisions, and notices. The claim file must be maintained in good order and be ' +
      'accessible to CDI auditors. Retaining records for the minimum statutory period is ' +
      'required (generally 5 years from closure).',
    keyRequirements: [
      'Document every contact, decision, and action in the claim file contemporaneously',
      'Retain all written communications, medical records, investigation notes, and payment records',
      'Maintain a claim diary with required future action dates',
      'File must be accessible within 15 calendar days of CDI audit request',
      'Minimum file retention: 5 years post-closure or longer if litigation is pending',
    ],
    penalties: [
      'Inadequate documentation is the most common audit finding — separate penalty per violation',
      'Destroyed or missing records create an adverse inference in litigation',
    ],
    relatedCitations: ['10 CCR 2695.7', 'Cal. Ins. Code § 790.03', '8 CCR 10110'],
    effectiveDate: '1993-01-01',
    examinerRelevance:
      'If it is not documented, it did not happen. Note the date, time, and substance of every claim-related communication and decision, no matter how routine.',
  },
  {
    citation: '10 CCR 2695.7',
    title: 'Standards for Prompt Investigation — CDI Fair Claims Regulations',
    fullText:
      'Title 10 CCR § 2695.7 sets forth standards for fair and prompt claim investigation ' +
      'and decision-making. It requires acknowledgment within 15 days, acceptance or denial ' +
      'within 40 days, and that every benefit payment obligation be identified and met ' +
      'without requiring an explicit demand from the claimant. The insurer has an ' +
      'affirmative duty to pay all benefits owed.',
    keyRequirements: [
      'Acknowledge claim within 15 calendar days of receipt (10 CCR 2695.5(b))',
      'Begin investigation immediately upon claim receipt',
      'Accept or deny within 40 calendar days of written notice of claim',
      'Identify all benefits owed and pay them without waiting for a formal demand',
      'Provide a written explanation for every denial with the specific factual and legal basis',
      'Do not deny a claim solely because the information is unavailable — continue investigating',
    ],
    penalties: [
      'Violation of fair claims standards is an unfair claims practice per Ins. Code § 790.03(h)',
      'Each violation carries administrative penalties and may support bad faith litigation',
    ],
    relatedCitations: ['Cal. Ins. Code § 790.03(h)', '10 CCR 2695.5', '8 CCR 10111'],
    effectiveDate: '1993-01-01',
    examinerRelevance:
      'The affirmative duty to pay means you cannot wait for the worker to ask for benefits you know are owed. Identify and pay all owed benefits as you discover the obligation.',
  },
];

// ---------------------------------------------------------------------------
// REGULATORY_KB Map — O(1) lookup by citation
// ---------------------------------------------------------------------------

/** Map of all regulation entries keyed by normalized citation string. */
export const REGULATORY_KB: Map<string, RegulationEntry> = new Map(
  entries.map((e) => [e.citation.toLowerCase(), e]),
);

// ---------------------------------------------------------------------------
// lookupRegulation — multi-mode search
// ---------------------------------------------------------------------------

/**
 * Look up one or more regulation entries matching the given query.
 *
 * Supports three matching modes evaluated in order:
 *   1. Exact citation match (case-insensitive): "LC 4650" → single result
 *   2. Partial citation match: "4650" → finds "LC 4650" and any section containing "4650"
 *   3. Topic/keyword search: "temporary disability payment" → searches title, fullText, and examinerRelevance
 *
 * Returns an empty array if no match is found.
 *
 * @param query - Citation string or keyword topic
 * @returns Matching RegulationEntry objects (may be multiple for topic searches)
 */
export function lookupRegulation(query: string): RegulationEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  // Mode 1: Exact citation match
  const exact = REGULATORY_KB.get(normalizedQuery);
  if (exact) return [exact];

  // Mode 2: Partial citation match — query is a substring of any citation
  const partialMatches: RegulationEntry[] = [];
  for (const [key, entry] of REGULATORY_KB) {
    if (key.includes(normalizedQuery) || entry.citation.toLowerCase().includes(normalizedQuery)) {
      partialMatches.push(entry);
    }
  }
  if (partialMatches.length > 0) return partialMatches;

  // Mode 3: Topic/keyword search across title, fullText, examinerRelevance, and keyRequirements
  const keywords = normalizedQuery.split(/\s+/).filter((k) => k.length > 2);
  if (keywords.length === 0) return [];

  const scored: Array<{ entry: RegulationEntry; score: number }> = [];

  for (const entry of entries) {
    const searchTarget = [
      entry.title,
      entry.fullText,
      entry.examinerRelevance,
      entry.keyRequirements.join(' '),
      entry.relatedCitations.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    let score = 0;
    for (const keyword of keywords) {
      if (searchTarget.includes(keyword)) score++;
    }

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  // Return up to 5 most relevant entries, sorted by descending score
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.entry);
}
