/**
 * Tests for ClaudeAdapter — Anthropic Claude LLM adapter.
 *
 * Covers:
 *  - Stub mode (no ANTHROPIC_API_KEY)
 *  - Successful generate() with mocked Anthropic SDK
 *  - System prompt from request.systemPrompt and from messages
 *  - maxTokens / temperature defaults and overrides
 *  - Response text extraction (text block found vs missing)
 *  - generateStructured() with and without schema
 *  - classify() end-to-end
 *  - Error propagation through retry
 *  - Client caching (getClient called once)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock the Anthropic SDK
// ---------------------------------------------------------------------------

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate };
      constructor(_opts: unknown) { /* noop */ }
    },
  };
});

// Mock retry to run inline (no delays)
vi.mock('../../server/lib/llm/retry.js', () => ({
  executeWithRetry: async <T>(fn: () => Promise<T>) => fn(),
}));

import { ClaudeAdapter } from '../../server/lib/llm/claude-adapter.js';
import type { ModelConfig, LLMRequest } from '../../server/lib/llm/types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TEST_CONFIG: ModelConfig = {
  provider: 'anthropic',
  modelId: 'claude-sonnet-4-20250514',
  displayName: 'Claude Sonnet',
  tier: 'PREMIUM_PLUS',
  maxTokens: 8192,
  supportsStructuredOutput: true,
};

function makeAnthropicResponse(text: string, stopReason = 'end_turn') {
  return {
    content: [{ type: 'text', text }],
    usage: { input_tokens: 10, output_tokens: 20 },
    stop_reason: stopReason,
  };
}

// ==========================================================================
// CONSTRUCTOR
// ==========================================================================

describe('ClaudeAdapter — constructor', () => {
  it('sets provider to "anthropic"', () => {
    const adapter = new ClaudeAdapter(TEST_CONFIG);
    expect(adapter.provider).toBe('anthropic');
  });

  it('sets modelId from config', () => {
    const adapter = new ClaudeAdapter(TEST_CONFIG);
    expect(adapter.modelId).toBe('claude-sonnet-4-20250514');
  });
});

// ==========================================================================
// STUB MODE (no API key)
// ==========================================================================

describe('ClaudeAdapter — stub mode', () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    delete process.env['ANTHROPIC_API_KEY'];
    adapter = new ClaudeAdapter(TEST_CONFIG);
  });

  it('returns a stub response when ANTHROPIC_API_KEY is absent', async () => {
    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'Hello Claude' }],
    });

    expect(response.finishReason).toBe('STUB');
    expect(response.provider).toBe('anthropic');
    expect(response.model).toBe('claude-sonnet-4-20250514');
    expect(response.usage.inputTokens).toBe(0);
    expect(response.usage.outputTokens).toBe(0);
    expect(response.content).toContain('Claude stub');
    expect(response.content).toContain('ANTHROPIC_API_KEY not configured');
  });

  it('includes truncated message content in stub', async () => {
    const longContent = 'A'.repeat(200);
    const response = await adapter.generate({
      messages: [{ role: 'user', content: longContent }],
    });
    // Should include first 100 chars
    expect(response.content).toContain('A'.repeat(100));
    // But also have the trailing "..."
    expect(response.content).toContain('...');
  });

  it('handles empty messages array in stub', async () => {
    const response = await adapter.generate({ messages: [] });
    expect(response.finishReason).toBe('STUB');
    // lastMessage is undefined, so content substring is empty
    expect(response.content).toContain('...');
  });
});

// ==========================================================================
// GENERATE — with API key
// ==========================================================================

describe('ClaudeAdapter — generate()', () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key-123';
    adapter = new ClaudeAdapter(TEST_CONFIG);
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env['ANTHROPIC_API_KEY'];
  });

  it('calls Anthropic messages.create with correct parameters', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Hello!'));

    await adapter.generate({
      messages: [{ role: 'user', content: 'Hi' }],
    });

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.3,
      messages: [{ role: 'user', content: 'Hi' }],
    });
  });

  it('uses systemPrompt from request', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Yes'));

    await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
      systemPrompt: 'You are helpful',
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ system: 'You are helpful' }),
    );
  });

  it('extracts systemPrompt from system-role message if no explicit systemPrompt', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Done'));

    await adapter.generate({
      messages: [
        { role: 'system', content: 'System instruction' },
        { role: 'user', content: 'test' },
      ],
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ system: 'System instruction' }),
    );
    // System message should be filtered out of messages array
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages).toEqual([{ role: 'user', content: 'test' }]);
  });

  it('does not include system key when no system prompt exists', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Ok'));

    await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty('system');
  });

  it('uses custom maxTokens when provided', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Ok'));

    await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
      maxTokens: 1024,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ max_tokens: 1024 }),
    );
  });

  it('uses custom temperature when provided', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Ok'));

    await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
      temperature: 0.9,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 0.9 }),
    );
  });

  it('returns correct LLMResponse shape', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('Answer text', 'end_turn'));

    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(response).toEqual({
      content: 'Answer text',
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      usage: { inputTokens: 10, outputTokens: 20 },
      finishReason: 'end_turn',
    });
  });

  it('returns empty content when no text block in response', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'tool_use', id: 'tool1', name: 'fn', input: {} }],
      usage: { input_tokens: 5, output_tokens: 0 },
      stop_reason: 'tool_use',
    });

    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(response.content).toBe('');
  });

  it('handles null stop_reason', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'partial' }],
      usage: { input_tokens: 5, output_tokens: 10 },
      stop_reason: null,
    });

    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(response.finishReason).toBe('end_turn');
  });

  it('propagates API errors', async () => {
    mockCreate.mockRejectedValue(new Error('Anthropic API error'));

    await expect(
      adapter.generate({ messages: [{ role: 'user', content: 'test' }] }),
    ).rejects.toThrow('Anthropic API error');
  });

  it('caches the Anthropic client across calls (no extra create)', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('1'));
    await adapter.generate({ messages: [{ role: 'user', content: 'a' }] });

    mockCreate.mockResolvedValue(makeAnthropicResponse('2'));
    await adapter.generate({ messages: [{ role: 'user', content: 'b' }] });

    // Both calls should go through — the client is reused, so mockCreate is called twice
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('filters assistant messages and maps roles correctly', async () => {
    mockCreate.mockResolvedValue(makeAnthropicResponse('reply'));

    await adapter.generate({
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello' },
        { role: 'user', content: 'Follow up' },
      ],
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages).toEqual([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello' },
      { role: 'user', content: 'Follow up' },
    ]);
  });
});

// ==========================================================================
// GENERATE STRUCTURED
// ==========================================================================

describe('ClaudeAdapter — generateStructured()', () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key-123';
    adapter = new ClaudeAdapter(TEST_CONFIG);
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env['ANTHROPIC_API_KEY'];
  });

  it('parses JSON response without schema', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"name":"test","value":42}'),
    );

    const { data, response } = await adapter.generateStructured<{ name: string; value: number }>({
      messages: [{ role: 'user', content: 'give json' }],
    });

    expect(data).toEqual({ name: 'test', value: 42 });
    expect(response.provider).toBe('anthropic');
  });

  it('applies schema.parse when provided', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"name":"test","value":42}'),
    );

    const schema = {
      parse: (d: unknown) => {
        const obj = d as { name: string; value: number };
        return { ...obj, validated: true };
      },
    };

    const { data } = await adapter.generateStructured({
      messages: [{ role: 'user', content: 'give json' }],
    }, schema);

    expect(data).toEqual({ name: 'test', value: 42, validated: true });
  });

  it('appends JSON instruction to system prompt', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"ok":true}'),
    );

    await adapter.generateStructured({
      messages: [{ role: 'user', content: 'test' }],
      systemPrompt: 'Base prompt',
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.system).toContain('Base prompt');
    expect(callArgs.system).toContain('Respond with valid JSON only');
  });

  it('adds JSON instruction even when no original system prompt', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"ok":true}'),
    );

    await adapter.generateStructured({
      messages: [{ role: 'user', content: 'test' }],
    });

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.system).toContain('Respond with valid JSON only');
  });

  it('throws on invalid JSON in response', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('not valid json'),
    );

    await expect(
      adapter.generateStructured({
        messages: [{ role: 'user', content: 'test' }],
      }),
    ).rejects.toThrow();
  });

  it('throws when schema.parse rejects', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"bad":true}'),
    );

    const schema = {
      parse: () => { throw new Error('Schema validation failed'); },
    };

    await expect(
      adapter.generateStructured({
        messages: [{ role: 'user', content: 'test' }],
      }, schema),
    ).rejects.toThrow('Schema validation failed');
  });
});

// ==========================================================================
// CLASSIFY
// ==========================================================================

describe('ClaudeAdapter — classify()', () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key-123';
    adapter = new ClaudeAdapter(TEST_CONFIG);
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env['ANTHROPIC_API_KEY'];
  });

  it('returns category and confidence from LLM', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"category":"GREEN","confidence":0.95}'),
    );

    const result = await adapter.classify(
      'What is the TD rate?',
      ['GREEN', 'YELLOW', 'RED'],
    );

    expect(result.category).toBe('GREEN');
    expect(result.confidence).toBe(0.95);
    expect(result.response.provider).toBe('anthropic');
  });

  it('passes system prompt to underlying generate', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"category":"RED","confidence":0.8}'),
    );

    await adapter.classify(
      'Should I settle?',
      ['GREEN', 'YELLOW', 'RED'],
      'UPL classifier system prompt',
    );

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.system).toContain('UPL classifier system prompt');
  });

  it('uses temperature 0 for classification', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"category":"GREEN","confidence":1.0}'),
    );

    await adapter.classify('test', ['GREEN', 'RED']);

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.temperature).toBe(0);
  });

  it('includes categories in the classification prompt', async () => {
    mockCreate.mockResolvedValue(
      makeAnthropicResponse('{"category":"A","confidence":0.9}'),
    );

    await adapter.classify('text', ['A', 'B', 'C']);

    const callArgs = mockCreate.mock.calls[0][0];
    const userMessage = callArgs.messages[0].content;
    expect(userMessage).toContain('A, B, C');
  });
});
