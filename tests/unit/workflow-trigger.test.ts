import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Workflow trigger service tests.
 *
 * Tests all 4 exported trigger functions:
 *   - startDocumentPipeline (fire-and-forget)
 *   - startChatResponse (synchronous — waits for result)
 *   - startCounselReferral (fire-and-forget)
 *   - startOmfsComparison (fire-and-forget)
 *
 * Mocks: server/lib/temporal.js (startWorkflow, getWorkflowHandle)
 *        server/constants/temporal.js (re-exported as-is for ID generators)
 */

// ---------------------------------------------------------------------------
// Mock Temporal lib
// ---------------------------------------------------------------------------

const mockStartWorkflow = vi.fn();
const mockGetWorkflowHandle = vi.fn();

vi.mock('../../server/lib/temporal.js', () => ({
  startWorkflow: (...args: unknown[]) => mockStartWorkflow(...args),
  getWorkflowHandle: (...args: unknown[]) => mockGetWorkflowHandle(...args),
}));

// Dynamic import after mocks
const {
  startDocumentPipeline,
  startChatResponse,
  startCounselReferral,
  startOmfsComparison,
} = await import('../../server/services/workflow-trigger.service.js');

// Also import constants for assertion
const {
  TEMPORAL_TASK_QUEUES,
  TEMPORAL_WORKFLOWS,
} = await import('../../server/constants/temporal.js');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Workflow Trigger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // startDocumentPipeline
  // -------------------------------------------------------------------------

  describe('startDocumentPipeline', () => {
    it('calls startWorkflow with correct workflow name, task queue, and args', async () => {
      mockStartWorkflow.mockResolvedValueOnce('doc-pipeline-doc-123');

      await startDocumentPipeline('doc-123');

      expect(mockStartWorkflow).toHaveBeenCalledOnce();
      expect(mockStartWorkflow).toHaveBeenCalledWith(
        TEMPORAL_WORKFLOWS.DOCUMENT_PIPELINE,
        expect.objectContaining({
          workflowId: 'doc-pipeline-doc-123',
          taskQueue: TEMPORAL_TASK_QUEUES.DOCUMENT_PROCESSING,
          args: ['doc-123'],
        }),
      );
    });

    it('returns the workflow ID from startWorkflow', async () => {
      mockStartWorkflow.mockResolvedValueOnce('doc-pipeline-doc-456');

      const result = await startDocumentPipeline('doc-456');

      expect(result).toBe('doc-pipeline-doc-456');
    });

    it('generates deterministic workflow ID for the same document', async () => {
      mockStartWorkflow.mockResolvedValueOnce('doc-pipeline-doc-abc');

      await startDocumentPipeline('doc-abc');

      const call = mockStartWorkflow.mock.calls[0] as [string, { workflowId: string }];
      expect(call[1].workflowId).toBe('doc-pipeline-doc-abc');
    });

    it('propagates errors from startWorkflow', async () => {
      mockStartWorkflow.mockRejectedValueOnce(new Error('Temporal server unavailable'));

      await expect(startDocumentPipeline('doc-err')).rejects.toThrow('Temporal server unavailable');
    });
  });

  // -------------------------------------------------------------------------
  // startChatResponse
  // -------------------------------------------------------------------------

  describe('startChatResponse', () => {
    const chatInput = {
      claimId: 'claim-1',
      sessionId: 'session-abc',
      message: 'What is the TD rate?',
      systemPrompt: 'You are a helpful assistant.',
      messages: [
        { role: 'user' as const, content: 'What is the TD rate?' },
      ],
    };

    const chatResult = {
      blocked: false,
      zone: 'GREEN' as const,
      content: 'The TD rate is 2/3 of AWE.',
      classification: {
        zone: 'GREEN' as const,
        reason: 'Factual calculation request',
        confidence: 0.95,
        isAdversarial: false,
      },
      validation: {
        result: 'PASS' as const,
        violations: [],
      },
      citations: [],
    };

    it('calls startWorkflow with CHAT_RESPONSE workflow and LLM_JOBS queue', async () => {
      mockStartWorkflow.mockResolvedValueOnce('chat-session-abc-12345');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.resolve(chatResult),
      });

      await startChatResponse(chatInput);

      expect(mockStartWorkflow).toHaveBeenCalledOnce();
      expect(mockStartWorkflow).toHaveBeenCalledWith(
        TEMPORAL_WORKFLOWS.CHAT_RESPONSE,
        expect.objectContaining({
          taskQueue: TEMPORAL_TASK_QUEUES.LLM_JOBS,
          args: [chatInput],
        }),
      );
    });

    it('generates a workflow ID containing the session ID', async () => {
      mockStartWorkflow.mockResolvedValueOnce('chat-session-abc-12345');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.resolve(chatResult),
      });

      await startChatResponse(chatInput);

      const call = mockStartWorkflow.mock.calls[0] as [string, { workflowId: string }];
      expect(call[1].workflowId).toContain('session-abc');
    });

    it('waits for the workflow result and returns it', async () => {
      mockStartWorkflow.mockResolvedValueOnce('chat-session-abc-99999');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.resolve(chatResult),
      });

      const result = await startChatResponse(chatInput);

      expect(result).toEqual(chatResult);
      expect(mockGetWorkflowHandle).toHaveBeenCalledOnce();
    });

    it('calls getWorkflowHandle with the generated workflow ID', async () => {
      mockStartWorkflow.mockResolvedValueOnce('chat-session-abc-99999');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.resolve(chatResult),
      });

      await startChatResponse(chatInput);

      // The workflowId passed to getWorkflowHandle should match the one generated
      const startCall = mockStartWorkflow.mock.calls[0] as [string, { workflowId: string }];
      const handleCall = mockGetWorkflowHandle.mock.calls[0] as [string];
      expect(handleCall[0]).toBe(startCall[1].workflowId);
    });

    it('propagates errors from startWorkflow', async () => {
      mockStartWorkflow.mockRejectedValueOnce(new Error('Workflow start failed'));

      await expect(startChatResponse(chatInput)).rejects.toThrow('Workflow start failed');
    });

    it('propagates errors from workflow result', async () => {
      mockStartWorkflow.mockResolvedValueOnce('chat-session-err-12345');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.reject(new Error('Workflow execution failed')),
      });

      await expect(startChatResponse(chatInput)).rejects.toThrow('Workflow execution failed');
    });
  });

  // -------------------------------------------------------------------------
  // startCounselReferral
  // -------------------------------------------------------------------------

  describe('startCounselReferral', () => {
    it('calls startWorkflow with correct workflow name, task queue, and args', async () => {
      mockStartWorkflow.mockResolvedValueOnce('referral-claim-1-12345');

      await startCounselReferral('claim-1', 'user-1', 'apportionment dispute');

      expect(mockStartWorkflow).toHaveBeenCalledOnce();
      expect(mockStartWorkflow).toHaveBeenCalledWith(
        TEMPORAL_WORKFLOWS.COUNSEL_REFERRAL,
        expect.objectContaining({
          taskQueue: TEMPORAL_TASK_QUEUES.LLM_JOBS,
          args: [{ claimId: 'claim-1', userId: 'user-1', legalIssue: 'apportionment dispute' }],
        }),
      );
    });

    it('generates a workflow ID containing the claim ID', async () => {
      mockStartWorkflow.mockResolvedValueOnce('referral-claim-42-12345');

      await startCounselReferral('claim-42', 'user-1', 'coverage dispute');

      const call = mockStartWorkflow.mock.calls[0] as [string, { workflowId: string }];
      expect(call[1].workflowId).toContain('claim-42');
    });

    it('returns the workflow ID for status polling', async () => {
      mockStartWorkflow.mockResolvedValueOnce('referral-claim-1-99999');

      const result = await startCounselReferral('claim-1', 'user-1', 'issue');

      expect(result).toBe('referral-claim-1-99999');
    });

    it('propagates errors from startWorkflow', async () => {
      mockStartWorkflow.mockRejectedValueOnce(new Error('Temporal down'));

      await expect(
        startCounselReferral('claim-err', 'user-1', 'issue'),
      ).rejects.toThrow('Temporal down');
    });
  });

  // -------------------------------------------------------------------------
  // startOmfsComparison
  // -------------------------------------------------------------------------

  describe('startOmfsComparison', () => {
    it('calls startWorkflow with correct workflow name, task queue, and args', async () => {
      mockStartWorkflow.mockResolvedValueOnce('omfs-compare-lien-1');

      await startOmfsComparison('lien-1');

      expect(mockStartWorkflow).toHaveBeenCalledOnce();
      expect(mockStartWorkflow).toHaveBeenCalledWith(
        TEMPORAL_WORKFLOWS.OMFS_COMPARISON,
        expect.objectContaining({
          workflowId: 'omfs-compare-lien-1',
          taskQueue: TEMPORAL_TASK_QUEUES.LLM_JOBS,
          args: ['lien-1'],
        }),
      );
    });

    it('generates deterministic workflow ID for the same lien', async () => {
      mockStartWorkflow.mockResolvedValueOnce('omfs-compare-lien-xyz');

      await startOmfsComparison('lien-xyz');

      const call = mockStartWorkflow.mock.calls[0] as [string, { workflowId: string }];
      expect(call[1].workflowId).toBe('omfs-compare-lien-xyz');
    });

    it('returns the workflow ID from startWorkflow', async () => {
      mockStartWorkflow.mockResolvedValueOnce('omfs-compare-lien-99');

      const result = await startOmfsComparison('lien-99');

      expect(result).toBe('omfs-compare-lien-99');
    });

    it('propagates errors from startWorkflow', async () => {
      mockStartWorkflow.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(startOmfsComparison('lien-err')).rejects.toThrow('Connection refused');
    });
  });

  // -------------------------------------------------------------------------
  // Cross-cutting concerns
  // -------------------------------------------------------------------------

  describe('cross-cutting concerns', () => {
    it('uses DOCUMENT_PROCESSING queue for document pipeline', async () => {
      mockStartWorkflow.mockResolvedValueOnce('id');

      await startDocumentPipeline('doc-1');

      const call = mockStartWorkflow.mock.calls[0] as [string, { taskQueue: string }];
      expect(call[1].taskQueue).toBe('adjudiclaims-document-processing');
    });

    it('uses LLM_JOBS queue for chat response', async () => {
      mockStartWorkflow.mockResolvedValueOnce('id');
      mockGetWorkflowHandle.mockReturnValueOnce({
        result: () => Promise.resolve({}),
      });

      await startChatResponse({
        claimId: 'c1',
        sessionId: 's1',
        message: 'test',
        systemPrompt: 'prompt',
        messages: [],
      });

      const call = mockStartWorkflow.mock.calls[0] as [string, { taskQueue: string }];
      expect(call[1].taskQueue).toBe('adjudiclaims-llm-jobs');
    });

    it('uses LLM_JOBS queue for counsel referral', async () => {
      mockStartWorkflow.mockResolvedValueOnce('id');

      await startCounselReferral('c1', 'u1', 'issue');

      const call = mockStartWorkflow.mock.calls[0] as [string, { taskQueue: string }];
      expect(call[1].taskQueue).toBe('adjudiclaims-llm-jobs');
    });

    it('uses LLM_JOBS queue for OMFS comparison', async () => {
      mockStartWorkflow.mockResolvedValueOnce('id');

      await startOmfsComparison('lien-1');

      const call = mockStartWorkflow.mock.calls[0] as [string, { taskQueue: string }];
      expect(call[1].taskQueue).toBe('adjudiclaims-llm-jobs');
    });
  });
});
