/**
 * Tests for examiner-chat.service.ts — Stage 1.5 graph context integration.
 *
 * Covers:
 * - Graph context included when maturity is GROWING+
 * - Graph context skipped when maturity is NASCENT
 * - Graph context failure is non-fatal
 * - graphContextIncluded flag set correctly
 * - Graph context appears in prompt before documents
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CLAIM_ID = 'claim-test-001';
const USER_ID = 'user-test-001';
const ORG_ID = 'org-test-001';
const SESSION_ID = 'session-test-001';

// ---------------------------------------------------------------------------
// Mock setup — must be before imports
// ---------------------------------------------------------------------------

// Mock prisma
const mockChatSessionFindFirst = vi.fn();
const mockChatSessionCreate = vi.fn();
const mockChatMessageCreate = vi.fn();
const mockDocumentChunkFindMany = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    chatSession: {
      findFirst: (...args: unknown[]) => mockChatSessionFindFirst(...args) as unknown,
      create: (...args: unknown[]) => mockChatSessionCreate(...args) as unknown,
    },
    chatMessage: {
      create: (...args: unknown[]) => mockChatMessageCreate(...args) as unknown,
    },
    documentChunk: {
      findMany: (...args: unknown[]) => mockDocumentChunkFindMany(...args) as unknown,
    },
  },
}));

// Mock hybrid search
const mockHybridSearch = vi.fn();

vi.mock('../../server/services/hybrid-search.service.js', () => ({
  hybridSearch: (...args: unknown[]) => mockHybridSearch(...args) as unknown,
}));

// Mock UPL classifier
const mockClassifyQuery = vi.fn();

vi.mock('../../server/services/upl-classifier.service.js', () => ({
  classifyQuery: (...args: unknown[]) => mockClassifyQuery(...args) as unknown,
}));

// Mock UPL validator — always pass
const mockValidateOutput = vi.fn();

vi.mock('../../server/services/upl-validator.service.js', () => ({
  validateOutput: (...args: unknown[]) => mockValidateOutput(...args) as unknown,
}));

// Mock disclaimer service
vi.mock('../../server/services/disclaimer.service.js', () => ({
  getDisclaimer: () => ({
    disclaimer: 'This is factual information only.',
    referralMessage: null,
  }),
}));

// Mock LLM adapter
const mockLLMGenerate = vi.fn();

vi.mock('../../server/lib/llm/index.js', () => ({
  getLLMAdapter: () => ({
    generate: (...args: unknown[]) => mockLLMGenerate(...args) as unknown,
  }),
}));

// Mock prompts
vi.mock('../../server/prompts/adjudiclaims-chat.prompts.js', () => ({
  EXAMINER_CASE_CHAT_PROMPT: 'You are a claims assistant.',
}));

// Mock audit logging — capture calls for verification
const mockLogAuditEvent = vi.fn();

vi.mock('../../server/middleware/audit.js', () => ({
  logAuditEvent: (...args: unknown[]) => mockLogAuditEvent(...args) as unknown,
}));

// Mock graph services
const mockGetClaimGraphSummary = vi.fn();
const mockQueryGraphForExaminer = vi.fn();
const mockFormatGraphContext = vi.fn();

vi.mock('../../server/services/graph/examiner-graph-access.service.js', () => ({
  queryGraphForExaminer: (...args: unknown[]) => mockQueryGraphForExaminer(...args) as unknown,
  formatGraphContext: (...args: unknown[]) => mockFormatGraphContext(...args) as unknown,
}));

vi.mock('../../server/services/graph/graph-traversal.service.js', () => ({
  getClaimGraphSummary: (...args: unknown[]) => mockGetClaimGraphSummary(...args) as unknown,
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

import { processExaminerChat } from '../../server/services/examiner-chat.service.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeChatRequest(message = 'What is the TD rate?') {
  return {
    claimId: CLAIM_ID,
    sessionId: SESSION_ID,
    message,
    userId: USER_ID,
    orgId: ORG_ID,
    request: { ip: '127.0.0.1', headers: {} } as unknown as import('fastify').FastifyRequest,
  };
}

function setupDefaultMocks() {
  // UPL classifier: GREEN zone
  mockClassifyQuery.mockResolvedValue({
    zone: 'GREEN',
    confidence: 0.95,
    reason: 'Factual query',
    isAdversarial: false,
  });

  // UPL validator: PASS
  mockValidateOutput.mockReturnValue({ result: 'PASS', violations: [] });

  // Session management
  mockChatSessionFindFirst.mockResolvedValue({ id: SESSION_ID });
  mockChatMessageCreate.mockResolvedValue({ id: 'msg-001' });

  // LLM adapter
  mockLLMGenerate.mockResolvedValue({
    content: 'The TD rate is calculated based on 2/3 of AWE.',
    finishReason: 'end_turn',
    provider: 'stub',
    model: 'stub',
    usage: { inputTokens: 100, outputTokens: 50 },
  });

  // Hybrid search: return one result by default
  mockHybridSearch.mockResolvedValue([
    {
      chunkId: 'chunk-1',
      documentId: 'doc-1',
      content: 'TD rate content',
      parentContent: null,
      headingBreadcrumb: 'Benefits > TD',
      vectorScore: 0.9,
      keywordScore: 0.8,
      fusedScore: 0.02,
      matchedKeywords: ['rate'],
    },
  ]);

  // Graph: NASCENT by default (no graph context)
  mockGetClaimGraphSummary.mockResolvedValue({
    totalNodes: 0,
    totalEdges: 0,
    nodeTypeCounts: {},
    maturityLabel: 'NASCENT',
    maturityScore: 0,
  });

  mockFormatGraphContext.mockReturnValue('');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('examiner-chat Stage 1.5: graph context integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  // =========================================================================
  // Graph context included when maturity is GROWING+
  // =========================================================================

  describe('when graph maturity is GROWING or higher', () => {
    beforeEach(() => {
      mockGetClaimGraphSummary.mockResolvedValue({
        totalNodes: 15,
        totalEdges: 20,
        nodeTypeCounts: { PERSON: 5, MEDICAL_CONDITION: 3, BODY_PART: 7 },
        maturityLabel: 'GROWING',
        maturityScore: 0.45,
      });

      mockQueryGraphForExaminer.mockResolvedValue({
        nodes: [{ id: 'n1', nodeType: 'PERSON', canonicalName: 'John Doe', confidence: 0.9 }],
        edges: [],
        disclaimer: null,
        wasFiltered: false,
        filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
      });

      mockFormatGraphContext.mockReturnValue(
        '## CLAIM KNOWLEDGE GRAPH\n### Key Entities\n- PERSON: John Doe [confident]',
      );
    });

    it('queries graph and includes context in LLM prompt', async () => {
      const response = await processExaminerChat(makeChatRequest());

      expect(mockGetClaimGraphSummary).toHaveBeenCalledWith(CLAIM_ID);
      expect(mockQueryGraphForExaminer).toHaveBeenCalledWith(
        CLAIM_ID,
        'GREEN',
        { maxNodes: 20, maxEdges: 30 },
      );
      expect(mockFormatGraphContext).toHaveBeenCalled();
      expect(response.graphContextIncluded).toBe(true);
    });

    it('places graph context before CLAIM DOCUMENTS in prompt', async () => {
      await processExaminerChat(makeChatRequest());

      const llmCall = mockLLMGenerate.mock.calls[0]![0] as {
        messages: Array<{ content: string }>;
      };
      const userContent = llmCall.messages[0]!.content;

      // Graph context should come before documents
      const graphIdx = userContent.indexOf('## CLAIM KNOWLEDGE GRAPH');
      const docsIdx = userContent.indexOf('## CLAIM DOCUMENTS');
      const questionIdx = userContent.indexOf('## EXAMINER QUESTION');

      expect(graphIdx).toBeGreaterThanOrEqual(0);
      expect(docsIdx).toBeGreaterThan(graphIdx);
      expect(questionIdx).toBeGreaterThan(docsIdx);
    });

    it('passes UPL zone from classification to graph query', async () => {
      mockClassifyQuery.mockResolvedValueOnce({
        zone: 'YELLOW',
        confidence: 0.8,
        reason: 'Statistical query',
        isAdversarial: false,
      });

      await processExaminerChat(makeChatRequest('What is the average settlement?'));

      expect(mockQueryGraphForExaminer).toHaveBeenCalledWith(
        CLAIM_ID,
        'YELLOW',
        { maxNodes: 20, maxEdges: 30 },
      );
    });

    it('works with MATURE maturity label', async () => {
      mockGetClaimGraphSummary.mockResolvedValue({
        totalNodes: 50,
        totalEdges: 80,
        nodeTypeCounts: { PERSON: 10 },
        maturityLabel: 'MATURE',
        maturityScore: 0.85,
      });

      const response = await processExaminerChat(makeChatRequest());

      expect(mockQueryGraphForExaminer).toHaveBeenCalled();
      expect(response.graphContextIncluded).toBe(true);
    });
  });

  // =========================================================================
  // Graph context skipped when maturity is NASCENT
  // =========================================================================

  describe('when graph maturity is NASCENT', () => {
    it('skips graph query and does not include graph context', async () => {
      // Default mock is NASCENT
      const response = await processExaminerChat(makeChatRequest());

      expect(mockGetClaimGraphSummary).toHaveBeenCalledWith(CLAIM_ID);
      expect(mockQueryGraphForExaminer).not.toHaveBeenCalled();
      expect(mockFormatGraphContext).not.toHaveBeenCalled();
      expect(response.graphContextIncluded).toBe(false);
    });

    it('does not include graph section in LLM prompt', async () => {
      await processExaminerChat(makeChatRequest());

      const llmCall = mockLLMGenerate.mock.calls[0]![0] as {
        messages: Array<{ content: string }>;
      };
      const userContent = llmCall.messages[0]!.content;

      expect(userContent).not.toContain('CLAIM KNOWLEDGE GRAPH');
      expect(userContent).toContain('## CLAIM DOCUMENTS');
      expect(userContent).toContain('## EXAMINER QUESTION');
    });
  });

  // =========================================================================
  // Graph context failure is non-fatal
  // =========================================================================

  describe('when graph context fails', () => {
    it('continues with RAG only when getClaimGraphSummary throws', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockGetClaimGraphSummary.mockRejectedValueOnce(new Error('Database connection lost'));

      const response = await processExaminerChat(makeChatRequest());

      expect(response.wasBlocked).toBe(false);
      expect(response.graphContextIncluded).toBe(false);
      expect(response.content).toBeTruthy();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[examiner-chat] Graph context failed'),
        expect.stringContaining('Database connection lost'),
      );

      consoleWarnSpy.mockRestore();
    });

    it('continues with RAG only when queryGraphForExaminer throws', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockGetClaimGraphSummary.mockResolvedValueOnce({
        totalNodes: 10,
        totalEdges: 15,
        nodeTypeCounts: {},
        maturityLabel: 'GROWING',
        maturityScore: 0.4,
      });

      mockQueryGraphForExaminer.mockRejectedValueOnce(new Error('Graph query timeout'));

      const response = await processExaminerChat(makeChatRequest());

      expect(response.wasBlocked).toBe(false);
      expect(response.graphContextIncluded).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[examiner-chat] Graph context failed'),
        expect.stringContaining('Graph query timeout'),
      );

      consoleWarnSpy.mockRestore();
    });

    it('continues with RAG only when formatGraphContext throws', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockGetClaimGraphSummary.mockResolvedValueOnce({
        totalNodes: 10,
        totalEdges: 15,
        nodeTypeCounts: {},
        maturityLabel: 'GROWING',
        maturityScore: 0.4,
      });

      mockQueryGraphForExaminer.mockResolvedValueOnce({
        nodes: [],
        edges: [],
        disclaimer: null,
        wasFiltered: false,
        filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
      });

      mockFormatGraphContext.mockImplementationOnce(() => {
        throw new Error('Unexpected format error');
      });

      const response = await processExaminerChat(makeChatRequest());

      expect(response.wasBlocked).toBe(false);
      expect(response.graphContextIncluded).toBe(false);

      consoleWarnSpy.mockRestore();
    });
  });

  // =========================================================================
  // graphContextIncluded flag
  // =========================================================================

  describe('graphContextIncluded flag', () => {
    it('is true when graph context is non-empty', async () => {
      mockGetClaimGraphSummary.mockResolvedValue({
        totalNodes: 10,
        totalEdges: 15,
        nodeTypeCounts: {},
        maturityLabel: 'GROWING',
        maturityScore: 0.4,
      });

      mockQueryGraphForExaminer.mockResolvedValue({
        nodes: [{ id: 'n1', nodeType: 'PERSON', canonicalName: 'Test', confidence: 0.9 }],
        edges: [],
        disclaimer: null,
        wasFiltered: false,
        filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
      });

      mockFormatGraphContext.mockReturnValue('## CLAIM KNOWLEDGE GRAPH\n### Key Entities\n- PERSON: Test');

      const response = await processExaminerChat(makeChatRequest());
      expect(response.graphContextIncluded).toBe(true);
    });

    it('is false when graph returns empty string', async () => {
      mockGetClaimGraphSummary.mockResolvedValue({
        totalNodes: 10,
        totalEdges: 15,
        nodeTypeCounts: {},
        maturityLabel: 'GROWING',
        maturityScore: 0.4,
      });

      mockQueryGraphForExaminer.mockResolvedValue({
        nodes: [],
        edges: [],
        disclaimer: null,
        wasFiltered: false,
        filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
      });

      mockFormatGraphContext.mockReturnValue('');

      const response = await processExaminerChat(makeChatRequest());
      expect(response.graphContextIncluded).toBe(false);
    });

    it('is undefined (not set) for RED zone blocked responses', async () => {
      mockClassifyQuery.mockResolvedValueOnce({
        zone: 'RED',
        confidence: 0.99,
        reason: 'Legal advice request',
        isAdversarial: false,
      });
      mockChatMessageCreate.mockResolvedValue({ id: 'msg-blocked' });

      const response = await processExaminerChat(makeChatRequest('Should I accept this claim?'));

      expect(response.wasBlocked).toBe(true);
      expect(response.graphContextIncluded).toBeUndefined();
      expect(mockGetClaimGraphSummary).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Graph stats in audit event
  // =========================================================================

  describe('audit event includes graph context stats', () => {
    it('includes graphContextLength in CHAT_RESPONSE_GENERATED event', async () => {
      mockGetClaimGraphSummary.mockResolvedValue({
        totalNodes: 10,
        totalEdges: 15,
        nodeTypeCounts: {},
        maturityLabel: 'GROWING',
        maturityScore: 0.4,
      });

      mockQueryGraphForExaminer.mockResolvedValue({
        nodes: [{ id: 'n1', nodeType: 'PERSON', canonicalName: 'Test', confidence: 0.9 }],
        edges: [],
        disclaimer: null,
        wasFiltered: false,
        filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
      });

      const graphText = '## CLAIM KNOWLEDGE GRAPH\n### Key Entities\n- PERSON: Test';
      mockFormatGraphContext.mockReturnValue(graphText);

      await processExaminerChat(makeChatRequest());

      // Find the CHAT_RESPONSE_GENERATED audit call
      const chatResponseCall = mockLogAuditEvent.mock.calls.find(
        (call: unknown[]) => (call[0] as { eventType: string }).eventType === 'CHAT_RESPONSE_GENERATED',
      );

      expect(chatResponseCall).toBeDefined();
      const eventData = (chatResponseCall![0] as { eventData: { graphContextLength: number } }).eventData;
      expect(eventData.graphContextLength).toBe(graphText.length);
    });

    it('includes graphContextLength of 0 when graph context is empty', async () => {
      // Default is NASCENT -> no graph context
      await processExaminerChat(makeChatRequest());

      const chatResponseCall = mockLogAuditEvent.mock.calls.find(
        (call: unknown[]) => (call[0] as { eventType: string }).eventType === 'CHAT_RESPONSE_GENERATED',
      );

      expect(chatResponseCall).toBeDefined();
      const eventData = (chatResponseCall![0] as { eventData: { graphContextLength: number } }).eventData;
      expect(eventData.graphContextLength).toBe(0);
    });
  });
});
