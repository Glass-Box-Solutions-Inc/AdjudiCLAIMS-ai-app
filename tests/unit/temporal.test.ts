import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Temporal client tests.
 *
 * Tests getTemporalClient(), startWorkflow(), getWorkflowHandle(),
 * and disconnectTemporal() with mocked @temporalio/client.
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockConnectionLazy = vi.fn();
const mockConnectionClose = vi.fn();
const mockWorkflowStart = vi.fn();
const mockWorkflowGetHandle = vi.fn();

class MockWorkflowExecutionAlreadyStartedError extends Error {
  constructor() {
    super('Workflow already started');
    this.name = 'WorkflowExecutionAlreadyStartedError';
  }
}

vi.mock('@temporalio/client', () => ({
  Connection: {
    lazy: (...args: unknown[]) => {
      mockConnectionLazy(...args);
      return { close: mockConnectionClose };
    },
  },
  Client: class MockClient {
    workflow = {
      start: (...args: unknown[]) => mockWorkflowStart(...args),
      getHandle: (...args: unknown[]) => mockWorkflowGetHandle(...args),
    };
  },
  WorkflowExecutionAlreadyStartedError: MockWorkflowExecutionAlreadyStartedError,
}));

vi.mock('../../server/lib/env.js', () => ({
  getEnv: vi.fn().mockReturnValue({
    TEMPORAL_ADDRESS: 'localhost:7233',
    TEMPORAL_NAMESPACE: 'test-ns',
    TEMPORAL_API_KEY: undefined,
  }),
}));

// Dynamic import after mocks
const {
  getTemporalClient,
  startWorkflow,
  getWorkflowHandle,
  disconnectTemporal,
} = await import('../../server/lib/temporal.js');

// ---------------------------------------------------------------------------
// Reset module-level singleton between tests by disconnecting
// ---------------------------------------------------------------------------

describe('Temporal Client', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await disconnectTemporal();
  });

  // -------------------------------------------------------------------------
  // getTemporalClient
  // -------------------------------------------------------------------------

  describe('getTemporalClient', () => {
    it('creates a Temporal client singleton', () => {
      const client = getTemporalClient();
      expect(client).toBeDefined();
      expect(mockConnectionLazy).toHaveBeenCalledOnce();
    });

    it('returns cached client on subsequent calls', () => {
      const client1 = getTemporalClient();
      const client2 = getTemporalClient();
      expect(client1).toBe(client2);
      expect(mockConnectionLazy).toHaveBeenCalledOnce();
    });

    it('uses env TEMPORAL_ADDRESS and TEMPORAL_NAMESPACE', () => {
      getTemporalClient();
      expect(mockConnectionLazy).toHaveBeenCalledWith(
        expect.objectContaining({
          address: 'localhost:7233',
        }),
      );
    });

    it('enables TLS when TEMPORAL_API_KEY is set', async () => {
      // Reset
      await disconnectTemporal();

      const { getEnv } = await import('../../server/lib/env.js');
      (getEnv as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        TEMPORAL_ADDRESS: 'cloud.temporal.io:7233',
        TEMPORAL_NAMESPACE: 'cloud-ns',
        TEMPORAL_API_KEY: 'my-api-key',
      });

      getTemporalClient();

      expect(mockConnectionLazy).toHaveBeenCalledWith(
        expect.objectContaining({
          address: 'cloud.temporal.io:7233',
          tls: true,
          apiKey: 'my-api-key',
        }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // startWorkflow
  // -------------------------------------------------------------------------

  describe('startWorkflow', () => {
    it('starts a new workflow and returns the workflow ID', async () => {
      mockWorkflowStart.mockResolvedValueOnce({ workflowId: 'wf-123' });

      const result = await startWorkflow('myWorkflow', {
        workflowId: 'wf-123',
        taskQueue: 'my-queue',
        args: ['arg1'],
      });

      expect(result).toBe('wf-123');
      expect(mockWorkflowStart).toHaveBeenCalledWith('myWorkflow', {
        workflowId: 'wf-123',
        taskQueue: 'my-queue',
        args: ['arg1'],
      });
    });

    it('returns existing workflow ID on WorkflowExecutionAlreadyStartedError', async () => {
      mockWorkflowStart.mockRejectedValueOnce(new MockWorkflowExecutionAlreadyStartedError());

      const result = await startWorkflow('myWorkflow', {
        workflowId: 'wf-existing',
        taskQueue: 'my-queue',
        args: [],
      });

      expect(result).toBe('wf-existing');
    });

    it('throws non-duplicate errors', async () => {
      mockWorkflowStart.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(
        startWorkflow('myWorkflow', {
          workflowId: 'wf-err',
          taskQueue: 'my-queue',
          args: [],
        }),
      ).rejects.toThrow('Connection refused');
    });
  });

  // -------------------------------------------------------------------------
  // getWorkflowHandle
  // -------------------------------------------------------------------------

  describe('getWorkflowHandle', () => {
    it('returns a workflow handle for a given workflow ID', () => {
      const mockHandle = { workflowId: 'wf-123', result: vi.fn() };
      mockWorkflowGetHandle.mockReturnValueOnce(mockHandle);

      const handle = getWorkflowHandle('wf-123');
      expect(handle).toBe(mockHandle);
      expect(mockWorkflowGetHandle).toHaveBeenCalledWith('wf-123');
    });
  });

  // -------------------------------------------------------------------------
  // disconnectTemporal
  // -------------------------------------------------------------------------

  describe('disconnectTemporal', () => {
    it('closes connection and clears singleton', async () => {
      getTemporalClient(); // Establish connection
      mockConnectionClose.mockClear(); // Clear any prior calls from beforeEach
      await disconnectTemporal();

      expect(mockConnectionClose).toHaveBeenCalledOnce();
    });

    it('is safe to call when no connection exists', async () => {
      // No client created — should not throw
      await disconnectTemporal();
      expect(mockConnectionClose).not.toHaveBeenCalled();
    });

    it('creates a new client after disconnect', async () => {
      const client1 = getTemporalClient();
      await disconnectTemporal();
      const client2 = getTemporalClient();

      expect(client1).not.toBe(client2);
      expect(mockConnectionLazy).toHaveBeenCalledTimes(2);
    });
  });
});
