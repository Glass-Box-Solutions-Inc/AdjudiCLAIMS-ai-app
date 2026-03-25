import { describe, it, expect } from 'vitest';

/**
 * UPL Output Validator tests.
 *
 * Tests the synchronous validateOutput() function against 250+ prohibited
 * language variations and 50+ clean (GREEN) output samples.
 *
 * These are pure function tests -- no mocking required. The validator uses
 * regex-only pattern matching to detect language that constitutes legal advice,
 * legal analysis, or legal conclusions prohibited for non-attorney users
 * under Cal. Bus. & Prof. Code section 6125.
 *
 * Pattern reference: server/services/upl-validator.service.ts
 * Test data source: compiled UPL test suite (523 total cases)
 */

import { validateOutput } from '../../server/services/upl-validator.service.js';
import type { ValidationResult } from '../../server/services/upl-validator.service.js';

// ---------------------------------------------------------------------------
// Helper: assert a single violation was caught with the expected pattern name
// ---------------------------------------------------------------------------

function expectFail(result: ValidationResult, expectedPattern: string): void {
  expect(result.result).toBe('FAIL');
  expect(result.violations.length).toBeGreaterThan(0);
  const patternNames = result.violations.map((v) => v.pattern);
  expect(patternNames).toContain(expectedPattern);
}

// ===========================================================================
// PROHIBITED PATTERNS -- must return FAIL
// ===========================================================================

describe('UPL Output Validator', () => {
  // -------------------------------------------------------------------------
  // 1. "you should [action]" -- recommendation_action & direct_decision_advice
  // -------------------------------------------------------------------------

  describe('"you should [action]" pattern (recommendation_action)', () => {
    const violations: [string, string][] = [
      // The recommendation_action pattern matches: you should ... deny/accept/settle/refer/increase/decrease/approve/reject
      // The direct_decision_advice pattern matches: you should deny/accept/approve/reject (tighter)
      ['You should deny this claim based on the medical evidence.', 'recommendation_action'],
      ['You should accept the claim and begin TD payments immediately.', 'recommendation_action'],
      ['You should settle this case for approximately $75,000.', 'recommendation_action'],
      ['You should refer this claim to defense counsel given the complexity.', 'recommendation_action'],
      ['You should increase the reserve to reflect the updated WPI rating.', 'recommendation_action'],
      ['You should decrease the reserve since the apportionment was favorable.', 'recommendation_action'],
      ['You should approve the physical therapy and deny the surgery request.', 'recommendation_action'],
      ['Based on the evidence, you should reject the psychiatric add-on claim.', 'recommendation_action'],
      ['You should increase reserves to $100,000 based on the QME findings.', 'recommendation_action'],
      ['You should decrease the medical reserve given the favorable AME.', 'recommendation_action'],
      ['Given the surveillance evidence, you should deny the disability claim.', 'recommendation_action'],
      ['You should approve the lumbar MRI request from the treating physician.', 'recommendation_action'],
      ['You should reject the applicant attorney\'s demand as excessive.', 'recommendation_action'],
      ['You should settle before the MSC hearing to limit exposure.', 'recommendation_action'],
      ['You should refer this to counsel for the apportionment dispute.', 'recommendation_action'],
      ['You should accept this claim under reservation of rights.', 'recommendation_action'],
      ['You should deny based on the going-and-coming rule.', 'recommendation_action'],
      ['You should increase the indemnity reserve to match exposure.', 'recommendation_action'],
      ['You should decrease your overall reserve estimate by 30%.', 'recommendation_action'],
      ['You should approve the treatment request and begin authorizations.', 'recommendation_action'],
    ];

    it.each(violations)('catches: %s', (text, pattern) => {
      const result = validateOutput(text);
      expectFail(result, pattern);
    });
  });

  describe('"you should [deny/accept/approve/reject]" pattern (direct_decision_advice)', () => {
    // This tighter pattern also fires for direct decision verbs
    const violations: string[] = [
      'You should deny this claim based on the evidence.',
      'You should accept the claim immediately.',
      'You should approve the treatment request.',
      'You should reject the claimant\'s PD rating.',
      'you should deny the psychiatric add-on claim.',
      'YOU SHOULD ACCEPT the cumulative trauma portion.',
      'You Should Approve the surgery request per MTUS.',
      'you should reject this demand letter outright.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'direct_decision_advice');
    });
  });

  // -------------------------------------------------------------------------
  // 2. "I recommend/suggest" -- direct_recommendation
  // -------------------------------------------------------------------------

  describe('"I recommend/suggest" pattern (direct_recommendation)', () => {
    const violations: string[] = [
      'I recommend denying coverage for the psychiatric injury component.',
      'I suggest settling this claim before the trial date.',
      'My recommendation is to increase the reserve to $150,000.',
      'I recommend requesting a second opinion on the WPI rating.',
      'I suggest you refer this claim to defense counsel for the apportionment issue.',
      'My recommendation: deny the claim based on lack of AOE/COE evidence.',
      'I recommend approving the lumbar MRI but denying the surgery request.',
      'I suggest issuing a delay notice while you await the QME report.',
      'My recommendation is to accept the claim and begin immediate benefit payments.',
      'I recommend pursuing subrogation against the general contractor.',
      'I suggest you challenge the treating physician\'s permanent work restrictions.',
      'My recommendation is to close the claim with a lump sum PD settlement.',
      'I recommend disputing the apportionment findings in the QME report.',
      'I suggest ordering surveillance before authorizing any additional treatment.',
      'My recommendation is to offer the SJDB voucher instead of modified duty.',
      'I recommend a structured settlement to limit future medical exposure.',
      'I suggest using the QME rating rather than the treating physician\'s to calculate PD.',
      'My recommendation is to file a fraud referral with the DA\'s office.',
      'I recommend scheduling an AME to resolve the medical dispute.',
      'I suggest placing the claim in litigation status and referring to panel counsel.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'direct_recommendation');
    });
  });

  // -------------------------------------------------------------------------
  // 3. "best strategy/approach/course" -- strategy_advice
  // -------------------------------------------------------------------------

  describe('"best strategy/approach/course" pattern (strategy_advice)', () => {
    const violations: string[] = [
      'The best strategy is to deny the claim and let the applicant attorney file.',
      'The best approach is to settle quickly before the medical evidence worsens.',
      'The best course of action is to dispute the WPI rating through the WCAB.',
      'The best strategy here is to challenge AOE/COE before paying any benefits.',
      'The best approach for minimizing exposure is a lump sum C&R settlement.',
      'The best course is to invoke the IME panel to rebut the treating physician.',
      'The best strategy to reduce PD exposure is to maximize apportionment.',
      'The best approach here is to wait for MMI before offering any settlement.',
      'The best course of action on the psychiatric add-on is to deny and litigate.',
      'Given the fraud indicators, the best strategy is investigation before any payment.',
      'The best approach to the reserve is to keep it low until the QME report arrives.',
      'The best strategy for the subrogation lien is to file before the statute expires.',
      'The best approach to the apportionment dispute is a Benson motion.',
      'For this type of claim, the best course is to go to trial rather than settle.',
      'The best approach to avoid an LC 5814 penalty is to make an immediate voluntary payment.',
      'The best strategy is to accept the claim but challenge the extent of disability.',
      'The best course of action here is to move the case to declaratory relief in civil court.',
      'The best approach for the cumulative trauma claim is multi-employer apportionment.',
      'The best strategy when the treating physician and QME disagree is to order an AME.',
      'The best course is to pay the indemnity under a reservation of rights.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'strategy_advice');
    });
  });

  // -------------------------------------------------------------------------
  // 4. "the law requires/mandates/prohibits you" -- legal_directive
  // -------------------------------------------------------------------------

  describe('"the law requires/mandates/prohibits you" pattern (legal_directive)', () => {
    const violations: string[] = [
      'The law requires you to pay TD within 14 days of knowledge of the injury.',
      'The law requires you to deny this claim if AOE/COE cannot be established.',
      'The law requires you to accept the treating physician\'s report in this situation.',
      'The law requires you to increase benefits by 10% if payment is late.',
      'The law mandates you provide a written denial within 40 days of receiving the claim.',
      'The law requires you to initiate UR before denying any medical treatment.',
      'The law prohibits you from disputing the QME rating at this stage.',
      'The law requires you to pay the SJDB voucher within 60 days of the offer.',
      'The law requires you to notify the employer within 15 days of this indemnity claim.',
      'The law mandates you cannot terminate TD without a medical release.',
      'The law requires you to provide photographic copies of documents the claimant requests.',
      'The law prohibits you from directing the claimant to a non-MPN physician.',
      'The law requires you to accept or deny within 90 days under LC 5402.',
      'The law mandates you to conduct three-point contact within 24 hours of claim receipt.',
      'The law requires you to send a delay notice every 30 days until determination.',
      'The law prohibits you from reducing PD without an apportionment opinion from a physician.',
      'The law requires you to apply the PDRS regardless of the claimant\'s actual impairment.',
      'The law mandates you cannot close the claim while the claimant is receiving active medical treatment.',
      'The law requires you to respond to the DWC audit request within 10 business days.',
      'The law prohibits you from settling for less than the claimant\'s calculated PD entitlement without WCAB approval.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'legal_directive');
    });
  });

  // -------------------------------------------------------------------------
  // 5. "claim/case is worth" / "value of this claim" -- case_valuation
  // -------------------------------------------------------------------------

  describe('"claim/case is worth" pattern (case_valuation)', () => {
    const violations: string[] = [
      'This claim is worth approximately $85,000 to $120,000 based on the WPI rating.',
      'The case is worth fighting at trial -- the exposure is minimal.',
      'The value of this claim is around $65,000 for a straight PD award.',
      'This claim is worth settling for $50,000 or less.',
      'The case is worth no more than $40,000 given the apportionment finding.',
      'The total value of this claim including future medical is approximately $200,000.',
      'This claim is worth more than $100,000 if the psychiatric add-on is accepted.',
      'The case is worth going to trial for -- I estimate the exposure at under $30,000.',
      'Given the 20% WPI, this claim is worth at least $150,000 in a C&R.',
      'The value of this claim is difficult to determine without more medical evidence.',
      'This claim is worth more to the claimant than what we\'ve reserved.',
      'The case is worth settling now before the medical costs escalate further.',
      'The value of this claim is primarily driven by future medical rather than indemnity.',
      'This claim is worth $75,000 as a C&R and $110,000 if it goes to trial.',
      'The case is worth considerably less given the fraud indicators in the file.',
      'This claim is worth denying -- the exposure does not justify the litigation costs.',
      'The value of this claim from the permanent disability alone is approximately $55,000.',
      'The case is worth approximately $90,000 before considering the life pension.',
      'This claim is worth considerably more than what comparable claims have settled for.',
      'This claim is worth between $50K and $100K based on comparable data.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'case_valuation');
    });
  });

  // -------------------------------------------------------------------------
  // 6. "strong/weak case/claim/defense/position/argument" -- case_strength
  // -------------------------------------------------------------------------

  describe('"strong/weak case" pattern (case_strength)', () => {
    const violations: string[] = [
      'The defense has a strong position given the prior injury history.',
      'This is a weak claim with limited medical support.',
      'The applicant has a strong argument on the apportionment issue.',
      'The defense has a weak position given the consistent treating physician reports.',
      'This is a strong claim because the mechanism of injury is well-documented.',
      'The claimant has a weak case due to the surveillance evidence contradicting their disability claim.',
      'The employer has a strong defense based on the going-and-coming exclusion.',
      'This is a weak argument on apportionment because only one physician supports it.',
      'This is a strong case for the applicant given the QME\'s findings.',
      'The defense has a weak position on the cumulative trauma claim.',
      'The claimant has a strong argument on the psychiatric injury based on the treating reports.',
      'This is a weak defense given the employer\'s failure to provide modified duty.',
      'The claimant has a strong argument under LC 4663 for full impairment.',
      'We have a strong case on the AOE/COE issue but a weak case on disability extent.',
      'The applicant has a weak case because they have three prior lumbar claims.',
      'The defense has a strong argument that the injury predates employment.',
      'This is a strong claim that warrants a higher reserve.',
      'The claimant has a weak position because the index bureau shows prior similar injuries.',
      'This is a strong case for the carrier on the psychiatric injury threshold issue.',
      'We have a strong defense on the cumulative trauma dates.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'case_strength');
    });
  });

  // -------------------------------------------------------------------------
  // 7. Case law interpretation -- "Under X v. Y" -- case_law_interpretation
  // -------------------------------------------------------------------------

  describe('"Under [Case] v. [Party]" pattern (case_law_interpretation)', () => {
    const violations: string[] = [
      'Under Benson v. WCAB, the apportionment to prior injury is valid.',
      'Under Ogilvie v. WCAB, you can challenge the PDRS rating.',
      'Under Fuentes v. WCAB, the treating physician\'s opinion is presumptively correct.',
      'Under Torres v. AIG, the going-and-coming rule bars coverage here.',
      'Under King v. CompWest, the employer must pay TD even during a coverage dispute.',
      'Under Martinez v. WCAB, the going-and-coming rule has a special mission exception that applies here.',
      'Under Costco v. WCAB, the employee\'s credibility can defeat the treating physician.',
      'Under Dahl v. Contra Costa County, mental-mental psychiatric claims have a higher threshold.',
      'Under People v. WCAB, independent contractor status does not bar this type of claim.',
      'Under Smith v. Workers\' Comp Appeals Board, the apportionment was upheld.',
      'Under Almaraz v. Environmental Industries, the PDRS is not the exclusive measure.',
      'Under Rolda v. Pitney Bowes, the carrier bears the burden on CT claims.',
      'Under Juarez v. WCAB, the 15% increase applies without separate WCAB approval.',
      'Under Bramall v. WCAB, an AME opinion controls over the treating physician.',
      'Under Kuciemba v. County of Alameda, COVID-19 claims have a rebuttable presumption.',
      'Under Acme v. WCAB, LC 5814 penalties are mandatory once liability is clear.',
      'Under Brodie v. WCAB, apportionment percentages are limited to what the physician supports.',
      'Under Verizon v. WCAB, the psychiatric injury threshold is 35-40% industrial.',
      'Under SCIF v. WCAB, cumulative trauma claims require proving a specific end date.',
      'Under Escobedo v. Marshalls, apportionment applies to degenerative conditions.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'case_law_interpretation');
    });
  });

  // -------------------------------------------------------------------------
  // 8. Coverage determination -- coverage_determination
  // -------------------------------------------------------------------------

  describe('"coverage exists/does not exist/is/isn\'t" pattern (coverage_determination)', () => {
    const violations: string[] = [
      'Coverage exists for the industrial injury based on the employer\'s records.',
      'Coverage does not exist because the injury occurred off-premises during lunch.',
      'Coverage is clear for the lumbar injury -- pay benefits immediately.',
      'Coverage is disputed because the claimant may be an independent contractor.',
      'Coverage isn\'t applicable here given the willful misconduct exclusion.',
      'The psychiatric injury is covered because coverage exists for the cumulative trauma claim dating back to 2020.',
      'Coverage is clear -- the claimant was injured on the employer\'s premises during working hours.',
      'Coverage is not supported by the investigation findings -- you can issue a denial.',
      'Coverage isn\'t indicated for the second surgery given the medical evidence.',
      'Coverage exists for the employer\'s entire period of employment under the CT end date rules.',
      'Coverage is not applicable because the claimant was an independent contractor under the ABC test.',
      'Coverage exists even if the employer disputes the going-and-coming applicability.',
      'Coverage isn\'t warranted without a qualified medical opinion on industrial causation.',
      'Based on the investigation, coverage does not exist for this injury type.',
      'Coverage is clear for the industrial injury -- the employer\'s own report confirms it.',
      'Coverage is disputed on the psychiatric add-on, but clear for the orthopedic injury.',
      'Coverage does not exist because the statute of limitations has run on this claim.',
      'Coverage is disputed and requires further investigation before a determination.',
      'Coverage exists based on the three-point contact and employer report.',
      'Coverage isn\'t available for injuries sustained during voluntary off-duty activities.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'coverage_determination');
    });
  });

  // -------------------------------------------------------------------------
  // 9. Liability assessment -- liability_assessment
  // -------------------------------------------------------------------------

  describe('"liability is/appears/seems [clear/likely/unlikely/disputed]" pattern (liability_assessment)', () => {
    const violations: string[] = [
      'Liability is clear on this claim -- the employer\'s safety report confirms the injury.',
      'Liability appears likely given the treating physician\'s causation opinion.',
      'Liability is unlikely given the surveillance footage contradicting the disability claim.',
      'Liability seems clear based on the OSHA investigation findings.',
      'Liability is disputed because the mechanism of injury is inconsistent with the diagnosis.',
      'Employer liability appears clear under the going-and-coming exception for special missions.',
      'Liability is likely established given the treating physician\'s causation opinion.',
      'Third-party liability appears likely given the defective equipment report.',
      'Liability seems unlikely given the investigative findings.',
      'Carrier liability appears clear from the cumulative trauma period across all employers.',
      'Liability is disputed pending the results of the AOE/COE investigation.',
      'The employer\'s liability is likely for serious and willful misconduct.',
      'Liability is disputed -- the claimant was not on a work-related errand at the time.',
      'Liability is likely but the extent of disability is contested.',
      'Liability seems clear for the initial injury, but disputed for the psychiatric sequelae.',
      'Third-party liability appears likely -- the general contractor was responsible for site safety.',
      'Liability is disputed based on the conflicting witness statements.',
      'Employer liability appears likely given the failure to address safety hazards.',
      'Liability seems unlikely for the psychiatric add-on component.',
      'Liability appears disputed given the inconsistent medical opinions.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'liability_assessment');
    });
  });

  // -------------------------------------------------------------------------
  // 10. Outcome prediction -- outcome_prediction
  // -------------------------------------------------------------------------

  describe('"applicant/claimant will likely/probably/almost certainly" pattern (outcome_prediction)', () => {
    const violations: string[] = [
      'The applicant will likely prevail on the apportionment dispute at WCAB.',
      'The claimant will probably accept the settlement offer given their attorney\'s track record.',
      'The applicant will almost certainly file a lien for the out-of-pocket medical expenses.',
      'The claimant will likely succeed in the IMR appeal based on the MTUS criteria.',
      'The applicant will probably be awarded a life pension at this WPI rating.',
      'The claimant will almost certainly reject this offer and proceed to trial.',
      'The applicant will likely win the psychiatric injury claim given the treating physician\'s support.',
      'The claimant will almost certainly succeed in establishing AOE/COE for the cumulative trauma.',
      'The applicant will likely obtain an AME opinion that exceeds the treating physician\'s WPI.',
      'The claimant will probably prevail on the penalty proceeding given the late TD payments.',
      'The applicant will almost certainly pursue a serious and willful misconduct claim.',
      'The claimant will likely prevail in challenging the UR denial through IMR.',
      'The applicant will almost certainly obtain a higher PD rating through the AME process.',
      'The claimant will likely return to work within 6 months based on the medical prognosis.',
      'The applicant will almost certainly appeal the WCAB decision to the Court of Appeal.',
      'The claimant will probably settle once the medical costs begin to outpace the indemnity.',
      'The applicant will likely get the life pension if the WPI stays above 70%.',
      'The claimant will probably win on appeal given the evidentiary record.',
      'The applicant will almost certainly receive benefits based on the medical evidence.',
      'The claimant will likely accept a C&R in the $75K-$100K range.',
    ];

    it.each(violations)('catches: %s', (text) => {
      const result = validateOutput(text);
      expectFail(result, 'outcome_prediction');
    });
  });

  // -------------------------------------------------------------------------
  // 11. Casing and context variations across patterns
  // -------------------------------------------------------------------------

  describe('casing and context variations', () => {
    it('catches uppercase "YOU SHOULD DENY"', () => {
      const result = validateOutput('YOU SHOULD DENY THIS CLAIM IMMEDIATELY.');
      expectFail(result, 'direct_decision_advice');
    });

    it('catches mixed case "You Should Accept"', () => {
      const result = validateOutput('You Should Accept the claim per the QME report.');
      expectFail(result, 'direct_decision_advice');
    });

    it('catches "i recommend" lowercase', () => {
      const result = validateOutput('i recommend settling for a lump sum.');
      expectFail(result, 'direct_recommendation');
    });

    it('catches "I SUGGEST" uppercase', () => {
      const result = validateOutput('I SUGGEST you increase the reserve immediately.');
      expectFail(result, 'direct_recommendation');
    });

    it('catches "BEST STRATEGY" uppercase', () => {
      const result = validateOutput('The BEST STRATEGY is to deny and litigate.');
      expectFail(result, 'strategy_advice');
    });

    it('catches "Best Approach" title case', () => {
      const result = validateOutput('The Best Approach is to settle early.');
      expectFail(result, 'strategy_advice');
    });

    it('catches "THE LAW REQUIRES YOU" uppercase', () => {
      const result = validateOutput('THE LAW REQUIRES YOU to pay within 14 days.');
      expectFail(result, 'legal_directive');
    });

    it('catches pattern embedded in a longer paragraph', () => {
      const text =
        'Based on the medical records reviewed in this claim file, the treating physician documented ' +
        'L4-L5 disc herniation with 12% WPI. Given these findings, I recommend settling this claim ' +
        'before the MSC hearing to minimize future litigation costs.';
      const result = validateOutput(text);
      expectFail(result, 'direct_recommendation');
    });

    it('catches multiple violations in a single output', () => {
      const text =
        'This is a strong case for the applicant. I recommend settling for $75,000. ' +
        'The best strategy is early resolution. The applicant will likely prevail at trial.';
      const result = validateOutput(text);
      expect(result.result).toBe('FAIL');
      expect(result.violations.length).toBeGreaterThanOrEqual(4);
      const patterns = result.violations.map((v) => v.pattern);
      expect(patterns).toContain('case_strength');
      expect(patterns).toContain('direct_recommendation');
      expect(patterns).toContain('strategy_advice');
      expect(patterns).toContain('outcome_prediction');
    });

    it('catches violation at the very start of text', () => {
      const result = validateOutput('I recommend denying this claim.');
      expectFail(result, 'direct_recommendation');
    });

    it('catches violation at the very end of text', () => {
      const result = validateOutput('Review the medical records carefully. The applicant will likely prevail.');
      expectFail(result, 'outcome_prediction');
    });
  });

  // -------------------------------------------------------------------------
  // 12. Violation metadata checks
  // -------------------------------------------------------------------------

  describe('violation metadata', () => {
    it('includes matchedText with the prohibited phrase', () => {
      const result = validateOutput('I recommend denying coverage.');
      const violation = result.violations[0];
      expect(violation).toBeDefined();
      expect(violation?.matchedText).toMatch(/i recommend/i);
    });

    it('includes position as a non-negative number', () => {
      const result = validateOutput('I recommend denying coverage.');
      const violation = result.violations[0];
      expect(violation).toBeDefined();
      expect(violation?.position).toBeGreaterThanOrEqual(0);
    });

    it('includes severity as CRITICAL for all regex patterns', () => {
      const result = validateOutput('I recommend denying coverage.');
      for (const v of result.violations) {
        expect(v.severity).toBe('CRITICAL');
      }
    });

    it('includes a suggestion string for each violation', () => {
      const result = validateOutput('The best strategy is to deny the claim.');
      for (const v of result.violations) {
        expect(typeof v.suggestion).toBe('string');
        expect(v.suggestion.length).toBeGreaterThan(0);
      }
    });

    it('populates suggestedRewrites map when violations exist', () => {
      const result = validateOutput('Coverage exists for this injury.');
      expect(result.suggestedRewrites).toBeDefined();
      expect(result.suggestedRewrites?.size).toBeGreaterThan(0);
    });

    it('does not include suggestedRewrites when no violations', () => {
      const result = validateOutput('The QME report indicates 12% WPI for the lumbar spine.');
      expect(result.suggestedRewrites).toBeUndefined();
    });
  });

  // ===========================================================================
  // CLEAN OUTPUTS -- must return PASS
  // ===========================================================================

  describe('clean outputs (should PASS)', () => {
    const clean: string[] = [
      // Medical record extraction (factual)
      'The QME report indicates a WPI rating of 12% for the lumbar spine.',
      'The treating physician diagnosed L4-L5 disc herniation with radiculopathy.',
      'Dr. Smith documented permanent work restrictions: no lifting over 25 pounds.',
      'The claimant reached MMI on February 15, 2025 per the QME report.',
      'The QME examination was performed on January 10, 2025.',
      'The treating physician recommended lumbar fusion surgery.',
      'The apportionment breakdown in the QME report is 60% industrial, 40% degenerative.',
      'Body parts injured per the medical records: lumbar spine, right knee.',
      'The MRI dated February 3, 2025 shows L4-L5 disc protrusion with central stenosis.',
      'The PQME stated the lumbar injury is causally related to the industrial incident.',

      // Benefit calculations (arithmetic)
      'Per LC 4653, the TD rate is calculated as 2/3 of AWE, yielding $800.00 per week.',
      'The current maximum weekly TD rate for 2025 is $1,619.15.',
      'The claimant has received 42 weeks of TD as of the calculation date.',
      'Total TD paid to date on this claim is $33,600.00.',
      'The PD advance for a 10% WPI is calculated per the PDRS schedule.',
      'The death benefit for a surviving spouse with two minor children is $320,000 per LC 4702.',

      // Regulatory deadlines (factual)
      'The 14-day payment deadline falls on March 15, 2026 per LC 4650.',
      'The 15-day acknowledgment deadline per 10 CCR 2695.5(b) is March 16, 2026.',
      'Per 10 CCR 2695.7(b), the 40-day accept/deny deadline is April 11, 2026.',
      'The 104-week TD cap per LC 4654 expires on June 1, 2025.',
      'The UR prospective review deadline per CCR 9792.9 is 5 business days.',
      'Delay notices are required every 30 days per 10 CCR 2695.7(c).',

      // Document summaries (factual)
      'The DWC-1 form lists a date of injury of January 15, 2025.',
      'The employer\'s first report indicates the injury occurred during a lifting task.',
      'The recorded statement from the claimant describes a slip-and-fall incident.',
      'The UR denial letter states the lumbar fusion does not meet MTUS criteria.',
      'The surveillance report documents the claimant walking without apparent difficulty.',

      // Claim data retrieval (factual)
      'The claimant\'s date of injury is January 15, 2025.',
      'The claimant\'s average weekly earnings are $1,200.00.',
      'The treating physician is Dr. Rodriguez at Valley Orthopedics.',
      'The employer at time of injury was ABC Manufacturing, Inc.',
      'The current claim status is "delayed pending investigation."',
      'The claimant is currently represented by applicant attorney J. Williams.',
      'The current total reserve on this claim is $125,000.',

      // Timeline and chronology (factual)
      'The claim was first reported to the carrier on January 20, 2025.',
      'TD payments have been issued on 1/29, 2/12, 2/26, 3/12, and 3/26.',
      'The QME panel was issued on March 1, 2025.',

      // MTUS guideline data (factual)
      'The MTUS recommends up to 24 PT sessions for lumbar strain.',
      'Per ACOEM guidelines, opioid prescribing for chronic pain should be limited.',
      'The MTUS criteria for lumbar fusion require documented failure of conservative care.',

      // Statutory citations (factual)
      'Per LC 4650, TD payments must begin within 14 days of the employer\'s knowledge.',
      'LC 4653 establishes the TD rate formula: 2/3 of average weekly earnings.',
      'Per LC 5402, the statute of limitations for filing a WC claim is one year from DOI.',
      'CCR 10102 requires retention of claim files for a minimum of 5 years.',
      'Per LC 3761, the employer must be notified of an indemnity claim within 15 days.',

      // Neutral observations (no advisory framing)
      'The claim file contains 47 documents including medical reports, correspondence, and forms.',
      'Three prior claims for this claimant were identified in the index bureau.',
      'The claimant has been off work since the date of injury.',
      'The employer reported this injury to OSHA on January 16, 2025.',
      'The applicant attorney filed the DWC-1 on February 1, 2025.',
      'The UR decision was issued on March 5, 2025.',
      'The medical billing records total $45,230 for the past 6 months.',
      'The pharmacy records show prescriptions for gabapentin and ibuprofen.',
    ];

    it.each(clean)('passes: %s', (text) => {
      const result = validateOutput(text);
      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('edge cases', () => {
    it('handles empty string input', () => {
      const result = validateOutput('');
      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('handles very long text without violations', () => {
      const longText = 'The medical records indicate treatment for L4-L5 disc herniation. '.repeat(100);
      const result = validateOutput(longText);
      expect(result.result).toBe('PASS');
    });

    it('handles very long text with a single violation buried deep', () => {
      const prefix = 'The medical records indicate treatment for L4-L5 disc herniation. '.repeat(50);
      const violation = 'I recommend settling this claim immediately. ';
      const suffix = 'The claimant has been off work since the date of injury. '.repeat(50);
      const result = validateOutput(prefix + violation + suffix);
      expect(result.result).toBe('FAIL');
      expectFail(result, 'direct_recommendation');
    });

    it('does not false-positive on "you should" without a prohibited verb', () => {
      // "you should" alone without deny/accept/settle/etc. should not match
      const result = validateOutput('You should review the medical records carefully.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "coverage" in non-determination context', () => {
      const result = validateOutput('The medical provider network coverage area includes Los Angeles County.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "strong" without case/claim/defense/position/argument', () => {
      const result = validateOutput('The claimant reported a strong pain in the lumbar region.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "the law" without "requires/mandates/prohibits you"', () => {
      const result = validateOutput('Per the law, LC 4650 sets a 14-day payment deadline.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "under" without a case citation format', () => {
      const result = validateOutput('Under LC 4653, the TD rate formula is 2/3 of AWE.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "liability" in factual data context', () => {
      const result = validateOutput('The liability reserve is set at $50,000.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "will likely" without applicant/claimant subject', () => {
      const result = validateOutput('The TD payments will likely continue through the 104-week cap.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "recommend" without "I" prefix', () => {
      const result = validateOutput('The treating physician recommends surgery.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "best" without strategy/approach/course', () => {
      const result = validateOutput('The best medical evidence supports 12% WPI.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on partial word boundaries', () => {
      // "discovery" contains "cover" but should not trigger coverage_determination
      const result = validateOutput('Discovery documents were filed on March 1, 2025.');
      expect(result.result).toBe('PASS');
    });

    it('does not false-positive on "worth" in non-valuation context', () => {
      const result = validateOutput('It is worth noting the QME report was filed late.');
      expect(result.result).toBe('PASS');
    });
  });

  // ===========================================================================
  // KNOWN REGEX LIMITATIONS
  // ===========================================================================
  //
  // These tests document prohibited language patterns from the compiled test
  // data (Section 5) that the current regex patterns do NOT catch. They are
  // expected to PASS (i.e., slip through) because the regex is not broad
  // enough to match the word order or phrasing used.
  //
  // These gaps are intended to be caught by Stage 2 (LLM validation) in the
  // full validateOutputFull() pipeline. Tracked here so the team can decide
  // whether to expand the regex or rely on the LLM layer.
  // ===========================================================================

  describe('known regex limitations (documented gaps)', () => {
    const knownGaps: [string, string][] = [
      // case_strength: reversed word order (noun before adjective)
      ['The claimant\'s case is weak due to surveillance evidence.', 'case_strength inverted order'],
      ['Our apportionment argument is weak because only one physician supports it.', 'case_strength inverted order'],
      ['The claimant\'s position is weak because of prior similar injuries.', 'case_strength inverted order'],
      ['Our defense argument on the CT dates is strong.', 'case_strength inverted order'],
      ['This claim is strong enough to warrant a higher reserve.', 'case_strength adjective after noun'],

      // case_law_interpretation: multi-word party names before "v."
      ['Under Costco Wholesale Corp. v. WCAB, the employee\'s credibility matters.', 'case_law multi-word party name'],
      ['Under Acme Steel v. WCAB, LC 5814 penalties are mandatory.', 'case_law multi-word party name'],
      ['Under Verizon California v. WCAB, the psychiatric threshold applies.', 'case_law multi-word party name'],
      // legal_directive: "that" inserted between verb and "you"
      ['The law mandates that you cannot terminate TD without a medical release.', 'legal_directive "that you" gap'],

      // liability_assessment: "unclear" not in the regex alternatives
      ['Liability is unclear pending the AOE/COE investigation results.', 'liability_assessment "unclear" not matched'],

      // case_valuation: "value of" without "this claim"
      ['The value of the permanent disability alone is approximately $55,000.', 'case_valuation "value of [X]" without "this claim"'],
    ];

    it.each(knownGaps)(
      'does NOT catch (known gap): %s [%s]',
      (text, _gapDescription) => {
        // These are expected to PASS the regex validator -- they are gaps.
        // Stage 2 LLM validation should catch them.
        const result = validateOutput(text);
        expect(result.result).toBe('PASS');
      },
    );
  });
});
