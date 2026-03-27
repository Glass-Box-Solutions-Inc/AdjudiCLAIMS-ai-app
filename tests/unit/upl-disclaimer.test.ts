import { describe, it, expect } from 'vitest';

/**
 * UPL Disclaimer Service tests.
 *
 * Tests the getDisclaimer() and getProductDisclaimer() functions against
 * all zone/feature/trigger combinations to verify correct disclaimer text,
 * block status, and referral messages.
 *
 * These are pure function tests -- no mocking required.
 *
 * Disclaimer text sourced from: docs/standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md
 * Implementation: server/services/disclaimer.service.ts
 */

import {
  getDisclaimer,
  getProductDisclaimer,
  PRODUCT_DISCLAIMER,
} from '../../server/services/disclaimer.service.js';
import type {
  FeatureContext,
  RedTriggerCategory,
  DisclaimerResult,
} from '../../server/services/disclaimer.service.js';

// ===========================================================================
// GREEN ZONE
// ===========================================================================

describe('Disclaimer Service', () => {
  describe('GREEN zone disclaimers', () => {
    it('returns correct brief disclaimer for GREEN zone', () => {
      const result = getDisclaimer('GREEN');
      expect(result.zone).toBe('GREEN');
      expect(result.disclaimer).toBe('AI-generated factual summary. Verify against source documents.');
    });

    it('sets isBlocked to false for GREEN zone', () => {
      const result = getDisclaimer('GREEN');
      expect(result.isBlocked).toBe(false);
    });

    it('does not include referralMessage for GREEN zone', () => {
      const result = getDisclaimer('GREEN');
      expect(result.referralMessage).toBeUndefined();
    });

    it('ignores featureContext parameter for GREEN zone', () => {
      const result = getDisclaimer('GREEN', 'comparable_claims');
      expect(result.disclaimer).toBe('AI-generated factual summary. Verify against source documents.');
    });

    it('ignores redTrigger parameter for GREEN zone', () => {
      const result = getDisclaimer('GREEN', undefined, 'coverage');
      expect(result.disclaimer).toBe('AI-generated factual summary. Verify against source documents.');
    });

    const greenContexts: FeatureContext[] = [
      'medical_summary',
      'benefit_calculation',
      'deadline',
      'document_classification',
      'timeline',
      'general',
    ];

    it.each(greenContexts)('returns same GREEN disclaimer regardless of featureContext "%s"', (ctx) => {
      const result = getDisclaimer('GREEN', ctx);
      expect(result.zone).toBe('GREEN');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toBe('AI-generated factual summary. Verify against source documents.');
    });
  });

  // ===========================================================================
  // YELLOW ZONE
  // ===========================================================================

  describe('YELLOW zone disclaimers', () => {
    it('returns generic YELLOW disclaimer when no featureContext provided', () => {
      const result = getDisclaimer('YELLOW');
      expect(result.zone).toBe('YELLOW');
      expect(result.disclaimer).toContain('Consult with assigned defense counsel');
      expect(result.disclaimer).toContain('legal issues');
    });

    it('sets isBlocked to false for YELLOW zone', () => {
      const result = getDisclaimer('YELLOW');
      expect(result.isBlocked).toBe(false);
    });

    it('does not include referralMessage for YELLOW zone', () => {
      const result = getDisclaimer('YELLOW');
      expect(result.referralMessage).toBeUndefined();
    });

    it('returns generic YELLOW disclaimer for "general" featureContext', () => {
      const result = getDisclaimer('YELLOW', 'general');
      expect(result.disclaimer).toContain('legal issues');
      expect(result.disclaimer).toContain('defense counsel');
    });

    // Feature-specific YELLOW disclaimers

    it('returns comparable_claims-specific disclaimer', () => {
      const result = getDisclaimer('YELLOW', 'comparable_claims');
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toContain('Comparable claims data');
      expect(result.disclaimer).toContain('informational purposes only');
      expect(result.disclaimer).toContain('settlement recommendation');
      expect(result.disclaimer).toContain('defense counsel');
    });

    it('returns litigation_risk-specific disclaimer', () => {
      const result = getDisclaimer('YELLOW', 'litigation_risk');
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toContain('Litigation risk factors');
      expect(result.disclaimer).toContain('statistical patterns');
      expect(result.disclaimer).toContain('defense counsel');
    });

    it('returns medical_inconsistency-specific disclaimer', () => {
      const result = getDisclaimer('YELLOW', 'medical_inconsistency');
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toContain('Medical inconsistency');
      expect(result.disclaimer).toContain('factual observations');
      expect(result.disclaimer).toContain('defense counsel');
    });

    it('returns subrogation-specific disclaimer', () => {
      const result = getDisclaimer('YELLOW', 'subrogation');
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toContain('Subrogation');
      expect(result.disclaimer).toContain('factual claim data');
      expect(result.disclaimer).toContain('defense counsel');
    });

    it('returns reserve_analysis-specific disclaimer', () => {
      const result = getDisclaimer('YELLOW', 'reserve_analysis');
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer).toContain('Reserve');
      expect(result.disclaimer).toContain('actuarial models');
      expect(result.disclaimer).toContain('defense counsel');
    });

    // Features without specific disclaimers fall back to generic YELLOW

    const genericYellowContexts: FeatureContext[] = [
      'medical_summary',
      'benefit_calculation',
      'deadline',
      'document_classification',
      'timeline',
    ];

    it.each(genericYellowContexts)(
      'falls back to generic YELLOW disclaimer for "%s" (no feature-specific text)',
      (ctx) => {
        const result = getDisclaimer('YELLOW', ctx);
        expect(result.zone).toBe('YELLOW');
        expect(result.isBlocked).toBe(false);
        // Should use the generic YELLOW text, not a feature-specific one
        expect(result.disclaimer).toContain('legal issues');
        expect(result.disclaimer).toContain('defense counsel');
      },
    );
  });

  // ===========================================================================
  // RED ZONE
  // ===========================================================================

  describe('RED zone disclaimers', () => {
    it('sets isBlocked to true for RED zone', () => {
      const result = getDisclaimer('RED');
      expect(result.isBlocked).toBe(true);
    });

    it('uses PRODUCT_DISCLAIMER as the disclaimer text for RED zone', () => {
      const result = getDisclaimer('RED');
      expect(result.disclaimer).toBe(PRODUCT_DISCLAIMER);
    });

    it('includes referralMessage for RED zone', () => {
      const result = getDisclaimer('RED');
      expect(result.referralMessage).toBeDefined();
      expect(typeof result.referralMessage).toBe('string');
      expect(result.referralMessage?.length).toBeGreaterThan(0);
    });

    it('returns general RED referral when no trigger specified', () => {
      const result = getDisclaimer('RED');
      expect(result.referralMessage).toContain('legal issue');
      expect(result.referralMessage).toContain('licensed attorney');
      expect(result.referralMessage).toContain('defense counsel');
    });

    it('returns general RED referral for "general" trigger', () => {
      const result = getDisclaimer('RED', undefined, 'general');
      expect(result.referralMessage).toContain('legal issue');
      expect(result.referralMessage).toContain('licensed attorney');
    });

    it('returns coverage-specific RED referral', () => {
      const result = getDisclaimer('RED', undefined, 'coverage');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('Coverage determinations');
      expect(result.referralMessage).toContain('legal analysis');
      expect(result.referralMessage).toContain('defense counsel');
      expect(result.referralMessage).toContain('coverage analysis');
    });

    it('returns case_evaluation-specific RED referral', () => {
      const result = getDisclaimer('RED', undefined, 'case_evaluation');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('Case evaluation');
      expect(result.referralMessage).toContain('legal analysis');
      expect(result.referralMessage).toContain('defense counsel');
    });

    it('returns settlement-specific RED referral', () => {
      const result = getDisclaimer('RED', undefined, 'settlement');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('Settlement');
      expect(result.referralMessage).toContain('legal analysis');
      expect(result.referralMessage).toContain('defense counsel');
    });

    it('returns case_law-specific RED referral', () => {
      const result = getDisclaimer('RED', undefined, 'case_law');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('Case law interpretation');
      expect(result.referralMessage).toContain('licensed attorney');
      expect(result.referralMessage).toContain('defense counsel');
    });

    it('returns injured_worker_rights-specific RED referral', () => {
      const result = getDisclaimer('RED', undefined, 'injured_worker_rights');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('injured worker legal rights');
      expect(result.referralMessage).toContain('attorney');
      expect(result.referralMessage).toContain('defense counsel');
    });

    // All RED trigger categories produce a referral with a help offer

    const redTriggers: RedTriggerCategory[] = [
      'general',
      'coverage',
      'case_evaluation',
      'settlement',
      'case_law',
      'injured_worker_rights',
    ];

    it.each(redTriggers)('RED trigger "%s" offers to generate a factual summary', (trigger) => {
      const result = getDisclaimer('RED', undefined, trigger);
      expect(result.referralMessage).toBeDefined();
      // All RED referrals offer to help prepare factual information
      expect(result.referralMessage).toMatch(/would you like|can help|can provide/i);
    });

    it.each(redTriggers)('RED trigger "%s" always uses PRODUCT_DISCLAIMER as disclaimer', (trigger) => {
      const result = getDisclaimer('RED', undefined, trigger);
      expect(result.disclaimer).toBe(PRODUCT_DISCLAIMER);
    });
  });

  // ===========================================================================
  // isBlocked across zones
  // ===========================================================================

  describe('isBlocked flag', () => {
    it('GREEN zone: isBlocked is false', () => {
      expect(getDisclaimer('GREEN').isBlocked).toBe(false);
    });

    it('YELLOW zone: isBlocked is false', () => {
      expect(getDisclaimer('YELLOW').isBlocked).toBe(false);
    });

    it('RED zone: isBlocked is true', () => {
      expect(getDisclaimer('RED').isBlocked).toBe(true);
    });

    it('YELLOW with feature context: isBlocked is false', () => {
      expect(getDisclaimer('YELLOW', 'comparable_claims').isBlocked).toBe(false);
    });

    it('RED with trigger: isBlocked is true', () => {
      expect(getDisclaimer('RED', undefined, 'settlement').isBlocked).toBe(true);
    });
  });

  // ===========================================================================
  // referralMessage presence
  // ===========================================================================

  describe('referralMessage presence', () => {
    it('GREEN zone: no referralMessage', () => {
      expect(getDisclaimer('GREEN').referralMessage).toBeUndefined();
    });

    it('YELLOW zone: no referralMessage', () => {
      expect(getDisclaimer('YELLOW').referralMessage).toBeUndefined();
    });

    it('YELLOW zone with feature: no referralMessage', () => {
      expect(getDisclaimer('YELLOW', 'litigation_risk').referralMessage).toBeUndefined();
    });

    it('RED zone: referralMessage is present', () => {
      expect(getDisclaimer('RED').referralMessage).toBeDefined();
    });

    it('RED zone with every trigger: referralMessage is present', () => {
      const triggers: RedTriggerCategory[] = [
        'general', 'coverage', 'case_evaluation', 'settlement', 'case_law', 'injured_worker_rights',
      ];
      for (const trigger of triggers) {
        const result = getDisclaimer('RED', undefined, trigger);
        expect(result.referralMessage).toBeDefined();
        expect(result.referralMessage?.length).toBeGreaterThan(0);
      }
    });
  });

  // ===========================================================================
  // Product disclaimer
  // ===========================================================================

  describe('product disclaimer', () => {
    it('getProductDisclaimer() returns the PRODUCT_DISCLAIMER constant', () => {
      expect(getProductDisclaimer()).toBe(PRODUCT_DISCLAIMER);
    });

    it('PRODUCT_DISCLAIMER contains required elements', () => {
      expect(PRODUCT_DISCLAIMER).toContain('factual information');
      expect(PRODUCT_DISCLAIMER).toContain('does not provide legal advice');
      expect(PRODUCT_DISCLAIMER).toContain('legal analysis');
      expect(PRODUCT_DISCLAIMER).toContain('legal conclusions');
      expect(PRODUCT_DISCLAIMER).toContain('claims examiner');
      expect(PRODUCT_DISCLAIMER).toContain('independent professional judgment');
      expect(PRODUCT_DISCLAIMER).toContain('defense counsel');
    });

    it('PRODUCT_DISCLAIMER is a non-empty string', () => {
      expect(typeof PRODUCT_DISCLAIMER).toBe('string');
      expect(PRODUCT_DISCLAIMER.length).toBeGreaterThan(50);
    });
  });

  // ===========================================================================
  // Disclaimer result structure
  // ===========================================================================

  describe('DisclaimerResult structure', () => {
    it('GREEN result has correct shape', () => {
      const result: DisclaimerResult = getDisclaimer('GREEN');
      expect(result).toHaveProperty('disclaimer');
      expect(result).toHaveProperty('zone');
      expect(result).toHaveProperty('isBlocked');
      expect(typeof result.disclaimer).toBe('string');
      expect(typeof result.zone).toBe('string');
      expect(typeof result.isBlocked).toBe('boolean');
    });

    it('YELLOW result has correct shape', () => {
      const result: DisclaimerResult = getDisclaimer('YELLOW', 'comparable_claims');
      expect(result).toHaveProperty('disclaimer');
      expect(result).toHaveProperty('zone');
      expect(result).toHaveProperty('isBlocked');
    });

    it('RED result has correct shape with referralMessage', () => {
      const result: DisclaimerResult = getDisclaimer('RED', undefined, 'coverage');
      expect(result).toHaveProperty('disclaimer');
      expect(result).toHaveProperty('zone');
      expect(result).toHaveProperty('isBlocked');
      expect(result).toHaveProperty('referralMessage');
    });
  });

  // ===========================================================================
  // Each RED trigger produces unique text
  // ===========================================================================

  describe('RED trigger uniqueness', () => {
    it('each RED trigger category produces a distinct referral message', () => {
      const triggers: RedTriggerCategory[] = [
        'coverage', 'case_evaluation', 'settlement', 'case_law', 'injured_worker_rights',
      ];

      const messages = triggers.map((t) => getDisclaimer('RED', undefined, t).referralMessage);

      // All messages should be unique
      const uniqueMessages = new Set(messages);
      expect(uniqueMessages.size).toBe(triggers.length);
    });

    it('general RED trigger is different from specific triggers', () => {
      const generalMsg = getDisclaimer('RED', undefined, 'general').referralMessage;
      const coverageMsg = getDisclaimer('RED', undefined, 'coverage').referralMessage;
      expect(generalMsg).not.toBe(coverageMsg);
    });
  });

  // ===========================================================================
  // YELLOW feature-specific disclaimer uniqueness
  // ===========================================================================

  describe('YELLOW feature disclaimer uniqueness', () => {
    it('each feature-specific YELLOW disclaimer is distinct', () => {
      const featureContexts: FeatureContext[] = [
        'comparable_claims', 'litigation_risk', 'medical_inconsistency', 'subrogation', 'reserve_analysis',
      ];

      const disclaimers = featureContexts.map((ctx) => getDisclaimer('YELLOW', ctx).disclaimer);

      const uniqueDisclaimers = new Set(disclaimers);
      expect(uniqueDisclaimers.size).toBe(featureContexts.length);
    });

    it('feature-specific YELLOW disclaimers differ from generic YELLOW', () => {
      const genericDisclaimer = getDisclaimer('YELLOW', 'general').disclaimer;
      const featureContexts: FeatureContext[] = [
        'comparable_claims', 'litigation_risk', 'medical_inconsistency', 'subrogation', 'reserve_analysis',
      ];

      for (const ctx of featureContexts) {
        const featureDisclaimer = getDisclaimer('YELLOW', ctx).disclaimer;
        expect(featureDisclaimer).not.toBe(genericDisclaimer);
      }
    });
  });

  // ===========================================================================
  // All FeatureContext values covered
  // ===========================================================================

  describe('All FeatureContext values', () => {
    const allContexts: FeatureContext[] = [
      'medical_summary',
      'benefit_calculation',
      'deadline',
      'document_classification',
      'timeline',
      'comparable_claims',
      'reserve_analysis',
      'litigation_risk',
      'medical_inconsistency',
      'subrogation',
      'general',
    ];

    it.each(allContexts)('getDisclaimer handles featureContext "%s" in GREEN zone', (ctx) => {
      const result = getDisclaimer('GREEN', ctx);
      expect(result.zone).toBe('GREEN');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer.length).toBeGreaterThan(0);
    });

    it.each(allContexts)('getDisclaimer handles featureContext "%s" in YELLOW zone', (ctx) => {
      const result = getDisclaimer('YELLOW', ctx);
      expect(result.zone).toBe('YELLOW');
      expect(result.isBlocked).toBe(false);
      expect(result.disclaimer.length).toBeGreaterThan(0);
    });

    it.each(allContexts)('getDisclaimer handles featureContext "%s" in RED zone', (ctx) => {
      const result = getDisclaimer('RED', ctx);
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toBeDefined();
    });
  });

  // ===========================================================================
  // RED zone with featureContext + redTrigger combined
  // ===========================================================================

  describe('RED zone with combined parameters', () => {
    it('RED zone with featureContext and redTrigger returns trigger-specific referral', () => {
      const result = getDisclaimer('RED', 'comparable_claims', 'settlement');
      expect(result.zone).toBe('RED');
      expect(result.isBlocked).toBe(true);
      expect(result.referralMessage).toContain('Settlement');
    });

    it('YELLOW zone ignores redTrigger parameter', () => {
      const result = getDisclaimer('YELLOW', 'general', 'coverage');
      expect(result.zone).toBe('YELLOW');
      expect(result.referralMessage).toBeUndefined();
    });
  });
});
