import { describe, it, expect } from 'vitest';

/**
 * Training module data structure validation tests.
 *
 * Tests the data integrity, lookup functions, and helper utilities exported
 * from server/data/training-modules.ts. These are pure function tests —
 * no mocking required.
 *
 * Validates:
 *   - TRAINING_MODULES array completeness and structure
 *   - TRAINING_MODULES_BY_ID map correctness
 *   - getQuestionsForClient() — strips correctOptionId
 *   - gradeAnswer() — correct/incorrect grading
 *   - evaluateAttempt() — pass/fail threshold logic
 *   - Per-module data integrity (question counts, IDs, options, passing scores)
 */

import {
  TRAINING_MODULES,
  TRAINING_MODULES_BY_ID,
  getQuestionsForClient,
  gradeAnswer,
  evaluateAttempt,
} from '../../server/data/training-modules.js';
import type {
  TrainingModule,
  AssessmentQuestion,
  QuestionType,
} from '../../server/data/training-modules.js';

// ---------------------------------------------------------------------------
// TRAINING_MODULES array structure
// ---------------------------------------------------------------------------

describe('TRAINING_MODULES array', () => {
  it('contains exactly 4 modules', () => {
    expect(TRAINING_MODULES).toHaveLength(4);
  });

  it('has module IDs module_1 through module_4', () => {
    const ids = TRAINING_MODULES.map((m) => m.id);
    expect(ids).toEqual(['module_1', 'module_2', 'module_3', 'module_4']);
  });

  it('each module has all required fields', () => {
    for (const mod of TRAINING_MODULES) {
      expect(typeof mod.id).toBe('string');
      expect(typeof mod.title).toBe('string');
      expect(typeof mod.description).toBe('string');
      expect(typeof mod.estimatedMinutes).toBe('number');
      expect(typeof mod.passingScore).toBe('number');
      expect(typeof mod.totalQuestions).toBe('number');
      expect(typeof mod.questionType).toBe('string');
      expect(mod.content).toBeDefined();
      expect(mod.content.sections).toBeDefined();
      expect(Array.isArray(mod.content.sections)).toBe(true);
      expect(mod.questions).toBeDefined();
      expect(Array.isArray(mod.questions)).toBe(true);
    }
  });

  it('each module has a non-empty title and description', () => {
    for (const mod of TRAINING_MODULES) {
      expect(mod.title.length).toBeGreaterThan(0);
      expect(mod.description.length).toBeGreaterThan(0);
    }
  });

  it('each module has estimatedMinutes > 0', () => {
    for (const mod of TRAINING_MODULES) {
      expect(mod.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it('each module has passingScore between 0 and 1 (inclusive)', () => {
    for (const mod of TRAINING_MODULES) {
      expect(mod.passingScore).toBeGreaterThanOrEqual(0);
      expect(mod.passingScore).toBeLessThanOrEqual(1);
    }
  });

  it('each module has totalQuestions matching its questions array length', () => {
    for (const mod of TRAINING_MODULES) {
      expect(mod.questions.length).toBe(mod.totalQuestions);
    }
  });

  it('each module has at least one content section', () => {
    for (const mod of TRAINING_MODULES) {
      expect(mod.content.sections.length).toBeGreaterThan(0);
    }
  });

  it('each content section has title and body', () => {
    for (const mod of TRAINING_MODULES) {
      for (const section of mod.content.sections) {
        expect(typeof section.title).toBe('string');
        expect(section.title.length).toBeGreaterThan(0);
        expect(typeof section.body).toBe('string');
        expect(section.body.length).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Per-module specifications
// ---------------------------------------------------------------------------

describe('Module 1: CA WC Framework', () => {
  const mod = TRAINING_MODULES_BY_ID.get('module_1')!;

  it('exists', () => {
    expect(mod).toBeDefined();
  });

  it('has 15 questions', () => {
    expect(mod.totalQuestions).toBe(15);
    expect(mod.questions).toHaveLength(15);
  });

  it('has 80% passing score', () => {
    expect(mod.passingScore).toBe(0.8);
  });

  it('has MULTIPLE_CHOICE question type', () => {
    expect(mod.questionType).toBe('MULTIPLE_CHOICE');
  });

  it('has 30 minute estimated time', () => {
    expect(mod.estimatedMinutes).toBe(30);
  });

  it('all question IDs start with mod1_', () => {
    for (const q of mod.questions) {
      expect(q.id).toMatch(/^mod1_q\d+$/);
    }
  });
});

describe('Module 2: Legal Obligations', () => {
  const mod = TRAINING_MODULES_BY_ID.get('module_2')!;

  it('exists', () => {
    expect(mod).toBeDefined();
  });

  it('has 10 questions', () => {
    expect(mod.totalQuestions).toBe(10);
    expect(mod.questions).toHaveLength(10);
  });

  it('has 80% passing score', () => {
    expect(mod.passingScore).toBe(0.8);
  });

  it('has SCENARIO question type', () => {
    expect(mod.questionType).toBe('SCENARIO');
  });

  it('all question IDs start with mod2_', () => {
    for (const q of mod.questions) {
      expect(q.id).toMatch(/^mod2_q\d+$/);
    }
  });
});

describe('Module 3: UPL Boundary', () => {
  const mod = TRAINING_MODULES_BY_ID.get('module_3')!;

  it('exists', () => {
    expect(mod).toBeDefined();
  });

  it('has 20 questions', () => {
    expect(mod.totalQuestions).toBe(20);
    expect(mod.questions).toHaveLength(20);
  });

  it('has 90% passing score (highest bar)', () => {
    expect(mod.passingScore).toBe(0.9);
  });

  it('has ZONE_CLASSIFICATION question type', () => {
    expect(mod.questionType).toBe('ZONE_CLASSIFICATION');
  });

  it('all question IDs start with mod3_', () => {
    for (const q of mod.questions) {
      expect(q.id).toMatch(/^mod3_q\d+$/);
    }
  });
});

describe('Module 4: Using AdjudiCLAIMS', () => {
  const mod = TRAINING_MODULES_BY_ID.get('module_4')!;

  it('exists', () => {
    expect(mod).toBeDefined();
  });

  it('has 8 questions', () => {
    expect(mod.totalQuestions).toBe(8);
    expect(mod.questions).toHaveLength(8);
  });

  it('has 100% passing score (all checkpoints required)', () => {
    expect(mod.passingScore).toBe(1.0);
  });

  it('has INTERACTIVE question type', () => {
    expect(mod.questionType).toBe('INTERACTIVE');
  });

  it('all question IDs start with mod4_', () => {
    for (const q of mod.questions) {
      expect(q.id).toMatch(/^mod4_q\d+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// Question data integrity (all modules)
// ---------------------------------------------------------------------------

describe('Question data integrity', () => {
  it('every question has a unique ID across all modules', () => {
    const allIds = TRAINING_MODULES.flatMap((m) => m.questions.map((q) => q.id));
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('every question has a non-empty questionText', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        expect(q.questionText.length).toBeGreaterThan(0);
      }
    }
  });

  it('every question has a valid questionType', () => {
    const validTypes: QuestionType[] = ['MULTIPLE_CHOICE', 'SCENARIO', 'ZONE_CLASSIFICATION', 'INTERACTIVE'];
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        expect(validTypes).toContain(q.questionType);
      }
    }
  });

  it('every question has at least 2 options', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every option has an id and non-empty text', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        for (const opt of q.options) {
          expect(typeof opt.id).toBe('string');
          expect(opt.id.length).toBeGreaterThan(0);
          expect(typeof opt.text).toBe('string');
          expect(opt.text.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every question has option IDs that are unique within that question', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        const optionIds = q.options.map((o) => o.id);
        const uniqueOptionIds = new Set(optionIds);
        expect(uniqueOptionIds.size).toBe(optionIds.length);
      }
    }
  });

  it('every question has a correctOptionId that matches one of its option IDs', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        const optionIds = q.options.map((o) => o.id);
        expect(optionIds).toContain(q.correctOptionId);
      }
    }
  });

  it('every question has a non-empty explanation', () => {
    for (const mod of TRAINING_MODULES) {
      for (const q of mod.questions) {
        expect(q.explanation.length).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// TRAINING_MODULES_BY_ID map
// ---------------------------------------------------------------------------

describe('TRAINING_MODULES_BY_ID map', () => {
  it('has exactly 4 entries', () => {
    expect(TRAINING_MODULES_BY_ID.size).toBe(4);
  });

  it('maps each module ID to the correct module', () => {
    for (const mod of TRAINING_MODULES) {
      const mapped = TRAINING_MODULES_BY_ID.get(mod.id);
      expect(mapped).toBeDefined();
      expect(mapped!.id).toBe(mod.id);
      expect(mapped!.title).toBe(mod.title);
    }
  });

  it('returns undefined for unknown module IDs', () => {
    expect(TRAINING_MODULES_BY_ID.get('module_99')).toBeUndefined();
    expect(TRAINING_MODULES_BY_ID.get('')).toBeUndefined();
    expect(TRAINING_MODULES_BY_ID.get('invalid')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getQuestionsForClient
// ---------------------------------------------------------------------------

describe('getQuestionsForClient', () => {
  it('returns questions for a valid module ID', () => {
    const questions = getQuestionsForClient('module_1');
    expect(questions).not.toBeNull();
    expect(questions!.length).toBe(15);
  });

  it('strips correctOptionId from all returned questions', () => {
    const questions = getQuestionsForClient('module_1');
    expect(questions).not.toBeNull();
    for (const q of questions!) {
      expect(q).not.toHaveProperty('correctOptionId');
    }
  });

  it('preserves all other question fields', () => {
    const questions = getQuestionsForClient('module_1');
    expect(questions).not.toBeNull();
    for (const q of questions!) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('questionText');
      expect(q).toHaveProperty('questionType');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('explanation');
    }
  });

  it('returns null for an unknown module ID', () => {
    const result = getQuestionsForClient('module_999');
    expect(result).toBeNull();
  });

  it('returns null for empty string module ID', () => {
    const result = getQuestionsForClient('');
    expect(result).toBeNull();
  });

  it('works for all 4 modules', () => {
    for (const modId of ['module_1', 'module_2', 'module_3', 'module_4']) {
      const questions = getQuestionsForClient(modId);
      expect(questions).not.toBeNull();
      expect(questions!.length).toBeGreaterThan(0);
      for (const q of questions!) {
        expect(q).not.toHaveProperty('correctOptionId');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// gradeAnswer
// ---------------------------------------------------------------------------

describe('gradeAnswer', () => {
  it('returns correct=true for the right answer', () => {
    // Module 1, Question 1: correct answer is 'b'
    const result = gradeAnswer('module_1', 'mod1_q01', 'b');
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(true);
  });

  it('returns correct=false for a wrong answer', () => {
    const result = gradeAnswer('module_1', 'mod1_q01', 'a');
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(false);
  });

  it('returns explanation regardless of correctness', () => {
    const correct = gradeAnswer('module_1', 'mod1_q01', 'b');
    const wrong = gradeAnswer('module_1', 'mod1_q01', 'a');
    expect(correct!.explanation).toBe(wrong!.explanation);
    expect(correct!.explanation.length).toBeGreaterThan(0);
  });

  it('returns null for unknown module ID', () => {
    const result = gradeAnswer('module_999', 'mod1_q01', 'b');
    expect(result).toBeNull();
  });

  it('returns null for unknown question ID', () => {
    const result = gradeAnswer('module_1', 'mod1_q99', 'b');
    expect(result).toBeNull();
  });

  it('returns correct=false for a non-existent option ID', () => {
    const result = gradeAnswer('module_1', 'mod1_q01', 'z');
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(false);
  });

  it('works for module 2 questions', () => {
    const result = gradeAnswer('module_2', 'mod2_q01', 'b');
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(true);
  });

  it('works for module 3 questions', () => {
    // Module 3, Question 1: need to find correct answer
    const mod3 = TRAINING_MODULES_BY_ID.get('module_3')!;
    const q1 = mod3.questions[0]!;
    const result = gradeAnswer('module_3', q1.id, q1.correctOptionId);
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(true);
  });

  it('works for module 4 questions', () => {
    const mod4 = TRAINING_MODULES_BY_ID.get('module_4')!;
    const q1 = mod4.questions[0]!;
    const result = gradeAnswer('module_4', q1.id, q1.correctOptionId);
    expect(result).not.toBeNull();
    expect(result!.correct).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateAttempt
// ---------------------------------------------------------------------------

describe('evaluateAttempt', () => {
  describe('Module 1 (80% passing, 15 questions)', () => {
    it('returns passes=true for 12/15 (exactly 80%)', () => {
      const result = evaluateAttempt('module_1', 12);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.score).toBeCloseTo(0.8);
      expect(result!.required).toBe(12);
      expect(result!.total).toBe(15);
    });

    it('returns passes=true for 15/15 (100%)', () => {
      const result = evaluateAttempt('module_1', 15);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.score).toBe(1.0);
    });

    it('returns passes=false for 11/15 (73.3%)', () => {
      const result = evaluateAttempt('module_1', 11);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
      expect(result!.score).toBeCloseTo(11 / 15);
    });

    it('returns passes=false for 0/15', () => {
      const result = evaluateAttempt('module_1', 0);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
      expect(result!.score).toBe(0);
    });
  });

  describe('Module 2 (80% passing, 10 questions)', () => {
    it('returns passes=true for 8/10 (exactly 80%)', () => {
      const result = evaluateAttempt('module_2', 8);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.required).toBe(8);
      expect(result!.total).toBe(10);
    });

    it('returns passes=false for 7/10 (70%)', () => {
      const result = evaluateAttempt('module_2', 7);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
    });
  });

  describe('Module 3 (90% passing, 20 questions)', () => {
    it('returns passes=true for 18/20 (exactly 90%)', () => {
      const result = evaluateAttempt('module_3', 18);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.required).toBe(18);
      expect(result!.total).toBe(20);
    });

    it('returns passes=false for 17/20 (85%)', () => {
      const result = evaluateAttempt('module_3', 17);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
    });

    it('returns passes=true for 20/20 (100%)', () => {
      const result = evaluateAttempt('module_3', 20);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.score).toBe(1.0);
    });
  });

  describe('Module 4 (100% passing, 8 questions)', () => {
    it('returns passes=true only for 8/8 (100%)', () => {
      const result = evaluateAttempt('module_4', 8);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(true);
      expect(result!.required).toBe(8);
      expect(result!.total).toBe(8);
    });

    it('returns passes=false for 7/8 (87.5%)', () => {
      const result = evaluateAttempt('module_4', 7);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
    });

    it('returns passes=false for 0/8', () => {
      const result = evaluateAttempt('module_4', 0);
      expect(result).not.toBeNull();
      expect(result!.passes).toBe(false);
      expect(result!.score).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('returns null for unknown module ID', () => {
      const result = evaluateAttempt('module_999', 10);
      expect(result).toBeNull();
    });

    it('returns null for empty string module ID', () => {
      const result = evaluateAttempt('', 10);
      expect(result).toBeNull();
    });

    it('score is calculated correctly (correctCount / totalQuestions)', () => {
      const result = evaluateAttempt('module_1', 9);
      expect(result).not.toBeNull();
      expect(result!.score).toBeCloseTo(9 / 15);
    });

    it('required field is ceiling of passingScore * totalQuestions', () => {
      // Module 1: ceil(0.8 * 15) = ceil(12) = 12
      const mod1 = evaluateAttempt('module_1', 0);
      expect(mod1!.required).toBe(12);

      // Module 3: ceil(0.9 * 20) = ceil(18) = 18
      const mod3 = evaluateAttempt('module_3', 0);
      expect(mod3!.required).toBe(18);

      // Module 4: ceil(1.0 * 8) = ceil(8) = 8
      const mod4 = evaluateAttempt('module_4', 0);
      expect(mod4!.required).toBe(8);
    });
  });
});

// ---------------------------------------------------------------------------
// QuestionType coverage
// ---------------------------------------------------------------------------

describe('QuestionType distribution', () => {
  it('Module 1 uses MULTIPLE_CHOICE for all questions', () => {
    const mod = TRAINING_MODULES_BY_ID.get('module_1')!;
    for (const q of mod.questions) {
      expect(q.questionType).toBe('MULTIPLE_CHOICE');
    }
  });

  it('Module 2 uses SCENARIO for all questions', () => {
    const mod = TRAINING_MODULES_BY_ID.get('module_2')!;
    for (const q of mod.questions) {
      expect(q.questionType).toBe('SCENARIO');
    }
  });

  it('Module 3 uses ZONE_CLASSIFICATION for all questions', () => {
    const mod = TRAINING_MODULES_BY_ID.get('module_3')!;
    for (const q of mod.questions) {
      expect(q.questionType).toBe('ZONE_CLASSIFICATION');
    }
  });

  it('Module 4 uses INTERACTIVE for all questions', () => {
    const mod = TRAINING_MODULES_BY_ID.get('module_4')!;
    for (const q of mod.questions) {
      expect(q.questionType).toBe('INTERACTIVE');
    }
  });
});
