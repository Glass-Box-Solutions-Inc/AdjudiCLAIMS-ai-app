import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  classifyError,
  executeWithRetry,
  getLLMAdapter,
  _resetAdapterCache,
  MODEL_REGISTRY,
} from '../../server/lib/llm/index.js';

// ==========================================================================
// ERROR CLASSIFICATION
// ==========================================================================

describe('Error classification', () => {
  // -----------------------------------------------------------------------
  // RATE_LIMIT
  // -----------------------------------------------------------------------

  it('classifies 429 as RATE_LIMIT', () => {
    const err = Object.assign(new Error('Too many requests'), { status: 429 });
    expect(classifyError(err)).toBe('RATE_LIMIT');
  });

  it('classifies rate limit message as RATE_LIMIT', () => {
    expect(classifyError(new Error('rate limit exceeded'))).toBe('RATE_LIMIT');
  });

  it('classifies "too many requests" message as RATE_LIMIT', () => {
    expect(classifyError(new Error('too many requests'))).toBe('RATE_LIMIT');
  });

  // -----------------------------------------------------------------------
  // UNAVAILABLE
  // -----------------------------------------------------------------------

  it('classifies 503 as UNAVAILABLE', () => {
    const err = Object.assign(new Error('Service unavailable'), { status: 503 });
    expect(classifyError(err)).toBe('UNAVAILABLE');
  });

  it('classifies 502 as UNAVAILABLE', () => {
    const err = Object.assign(new Error('Bad gateway'), { status: 502 });
    expect(classifyError(err)).toBe('UNAVAILABLE');
  });

  it('classifies 504 as UNAVAILABLE', () => {
    const err = Object.assign(new Error('Gateway timeout'), { status: 504 });
    expect(classifyError(err)).toBe('UNAVAILABLE');
  });

  it('classifies overloaded message as UNAVAILABLE', () => {
    expect(classifyError(new Error('API is overloaded'))).toBe('UNAVAILABLE');
  });

  it('classifies unavailable message as UNAVAILABLE', () => {
    expect(classifyError(new Error('Service is unavailable right now'))).toBe('UNAVAILABLE');
  });

  // -----------------------------------------------------------------------
  // AUTH
  // -----------------------------------------------------------------------

  it('classifies 401 as AUTH', () => {
    const err = Object.assign(new Error('Unauthorized'), { status: 401 });
    expect(classifyError(err)).toBe('AUTH');
  });

  it('classifies 403 as AUTH', () => {
    const err = Object.assign(new Error('Forbidden'), { status: 403 });
    expect(classifyError(err)).toBe('AUTH');
  });

  it('classifies invalid api key as AUTH', () => {
    expect(classifyError(new Error('Invalid API key provided'))).toBe('AUTH');
  });

  it('classifies authentication message as AUTH', () => {
    expect(classifyError(new Error('Authentication failed'))).toBe('AUTH');
  });

  // -----------------------------------------------------------------------
  // INVALID_REQUEST
  // -----------------------------------------------------------------------

  it('classifies 400 as INVALID_REQUEST', () => {
    const err = Object.assign(new Error('Bad request'), { status: 400 });
    expect(classifyError(err)).toBe('INVALID_REQUEST');
  });

  it('classifies invalid request message as INVALID_REQUEST', () => {
    expect(classifyError(new Error('invalid request body'))).toBe('INVALID_REQUEST');
  });

  // -----------------------------------------------------------------------
  // UNKNOWN
  // -----------------------------------------------------------------------

  it('classifies unknown errors as UNKNOWN', () => {
    expect(classifyError(new Error('Something went wrong'))).toBe('UNKNOWN');
  });

  it('classifies non-Error as UNKNOWN', () => {
    expect(classifyError('string error')).toBe('UNKNOWN');
    expect(classifyError(42)).toBe('UNKNOWN');
    expect(classifyError(null)).toBe('UNKNOWN');
    expect(classifyError(undefined)).toBe('UNKNOWN');
  });

  // -----------------------------------------------------------------------
  // Priority: status code wins over message text
  // -----------------------------------------------------------------------

  it('status code takes priority when it comes first in classification', () => {
    // 429 with "unavailable" message -- 429 check runs first so RATE_LIMIT wins
    const err = Object.assign(new Error('service unavailable'), { status: 429 });
    expect(classifyError(err)).toBe('RATE_LIMIT');
  });
});

// ==========================================================================
// EXECUTE WITH RETRY
// ==========================================================================

describe('executeWithRetry', () => {
  it('returns result on first successful call', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await executeWithRetry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('retries on RATE_LIMIT errors', async () => {
    const err = Object.assign(new Error('rate limit'), { status: 429 });
    const fn = vi.fn()
      .mockRejectedValueOnce(err)
      .mockResolvedValue('success');

    const result = await executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 1 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on UNAVAILABLE errors', async () => {
    const err = Object.assign(new Error('unavailable'), { status: 503 });
    const fn = vi.fn()
      .mockRejectedValueOnce(err)
      .mockResolvedValue('success');

    const result = await executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 1 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry AUTH errors', async () => {
    const err = Object.assign(new Error('unauthorized'), { status: 401 });
    const fn = vi.fn().mockRejectedValue(err);

    await expect(executeWithRetry(fn, { maxRetries: 3, baseDelayMs: 1 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('does not retry INVALID_REQUEST errors', async () => {
    const err = Object.assign(new Error('bad request'), { status: 400 });
    const fn = vi.fn().mockRejectedValue(err);

    await expect(executeWithRetry(fn, { maxRetries: 3, baseDelayMs: 1 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('throws after max retries exhausted', async () => {
    const err = Object.assign(new Error('rate limit'), { status: 429 });
    const fn = vi.fn().mockRejectedValue(err);

    await expect(executeWithRetry(fn, { maxRetries: 2, baseDelayMs: 1 })).rejects.toThrow('rate limit');
    // initial call + 2 retries = 3 total
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('retries multiple times before succeeding', async () => {
    const err = Object.assign(new Error('overloaded'), { status: 503 });
    const fn = vi.fn()
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err)
      .mockResolvedValue('finally');

    const result = await executeWithRetry(fn, { maxRetries: 3, baseDelayMs: 1 });
    expect(result).toBe('finally');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry UNKNOWN errors', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Something strange'));

    await expect(executeWithRetry(fn, { maxRetries: 3, baseDelayMs: 1 })).rejects.toThrow('Something strange');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('preserves the original error when throwing', async () => {
    const err = Object.assign(new Error('rate limit'), { status: 429 });
    const fn = vi.fn().mockRejectedValue(err);

    await expect(executeWithRetry(fn, { maxRetries: 1, baseDelayMs: 1 })).rejects.toBe(err);
  });

  it('uses default options when none provided', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await executeWithRetry(fn);
    expect(result).toBe('ok');
  });
});

// ==========================================================================
// MODEL REGISTRY
// ==========================================================================

describe('MODEL_REGISTRY', () => {
  it('has 5 tiers', () => {
    expect(Object.keys(MODEL_REGISTRY)).toHaveLength(5);
  });

  it('has the expected tier names', () => {
    const tiers = Object.keys(MODEL_REGISTRY);
    expect(tiers).toContain('FREE');
    expect(tiers).toContain('STANDARD');
    expect(tiers).toContain('PREMIUM');
    expect(tiers).toContain('PREMIUM_PLUS');
    expect(tiers).toContain('ENTERPRISE');
  });

  it('FREE tier uses Gemini', () => {
    expect(MODEL_REGISTRY.FREE.provider).toBe('gemini');
  });

  it('STANDARD tier uses Gemini', () => {
    expect(MODEL_REGISTRY.STANDARD.provider).toBe('gemini');
  });

  it('PREMIUM tier uses Gemini', () => {
    expect(MODEL_REGISTRY.PREMIUM.provider).toBe('gemini');
  });

  it('PREMIUM_PLUS tier uses Anthropic', () => {
    expect(MODEL_REGISTRY.PREMIUM_PLUS.provider).toBe('anthropic');
  });

  it('ENTERPRISE tier uses Anthropic', () => {
    expect(MODEL_REGISTRY.ENTERPRISE.provider).toBe('anthropic');
  });

  it('all tiers have required fields', () => {
    for (const [tier, config] of Object.entries(MODEL_REGISTRY)) {
      expect(config.provider, `${tier} must have provider`).toBeDefined();
      expect(config.modelId, `${tier} must have modelId`).toBeDefined();
      expect(config.displayName, `${tier} must have displayName`).toBeDefined();
      expect(config.tier, `${tier} must have tier`).toBe(tier);
      expect(config.maxTokens, `${tier} must have maxTokens`).toBeGreaterThan(0);
      expect(typeof config.supportsStructuredOutput).toBe('boolean');
    }
  });
});

// ==========================================================================
// LLM ADAPTER FACTORY (getLLMAdapter)
// ==========================================================================

describe('getLLMAdapter', () => {
  beforeEach(() => {
    _resetAdapterCache();
  });

  it('returns an adapter with correct provider for FREE tier', () => {
    const adapter = getLLMAdapter('FREE');
    expect(adapter.provider).toBe('gemini');
  });

  it('returns an adapter with correct model ID for FREE tier', () => {
    const adapter = getLLMAdapter('FREE');
    expect(adapter.modelId).toBe(MODEL_REGISTRY.FREE.modelId);
  });

  it('returns an adapter with correct provider for STANDARD tier', () => {
    const adapter = getLLMAdapter('STANDARD');
    expect(adapter.provider).toBe('gemini');
  });

  it('returns an adapter with correct provider for PREMIUM tier', () => {
    const adapter = getLLMAdapter('PREMIUM');
    expect(adapter.provider).toBe('gemini');
  });

  it('returns an adapter with correct provider for PREMIUM_PLUS tier', () => {
    const adapter = getLLMAdapter('PREMIUM_PLUS');
    expect(adapter.provider).toBe('anthropic');
  });

  it('returns an adapter with correct provider for ENTERPRISE tier', () => {
    const adapter = getLLMAdapter('ENTERPRISE');
    expect(adapter.provider).toBe('anthropic');
  });

  it('defaults to FREE tier when no tier specified', () => {
    const adapter = getLLMAdapter();
    expect(adapter.provider).toBe('gemini');
    expect(adapter.modelId).toBe(MODEL_REGISTRY.FREE.modelId);
  });

  it('caches adapter instances', () => {
    const adapter1 = getLLMAdapter('FREE');
    const adapter2 = getLLMAdapter('FREE');
    expect(adapter1).toBe(adapter2);
  });

  it('returns different adapters for different tiers', () => {
    const free = getLLMAdapter('FREE');
    const premium = getLLMAdapter('PREMIUM_PLUS');
    expect(free).not.toBe(premium);
  });

  it('returns different adapters for same-provider different tiers', () => {
    const free = getLLMAdapter('FREE');
    const standard = getLLMAdapter('STANDARD');
    expect(free).not.toBe(standard);
  });

  it('cache is cleared by _resetAdapterCache', () => {
    const adapter1 = getLLMAdapter('FREE');
    _resetAdapterCache();
    const adapter2 = getLLMAdapter('FREE');
    expect(adapter1).not.toBe(adapter2);
  });

  it('returns stub response when no API key is set (Gemini)', async () => {
    const adapter = getLLMAdapter('FREE');
    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'test message' }],
    });
    expect(response.finishReason).toBe('STUB');
    expect(response.content).toContain('stub');
    expect(response.provider).toBe('gemini');
    expect(response.usage.inputTokens).toBe(0);
    expect(response.usage.outputTokens).toBe(0);
  });

  it('returns stub response when no API key is set (Claude)', async () => {
    const adapter = getLLMAdapter('PREMIUM_PLUS');
    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'test message' }],
    });
    expect(response.finishReason).toBe('STUB');
    expect(response.content).toContain('stub');
    expect(response.provider).toBe('anthropic');
  });

  it('stub response includes truncated message content', async () => {
    const adapter = getLLMAdapter('FREE');
    const response = await adapter.generate({
      messages: [{ role: 'user', content: 'What is the TD rate?' }],
    });
    expect(response.content).toContain('What is the TD rate?');
  });

  it('adapter has generate method', () => {
    const adapter = getLLMAdapter('FREE');
    expect(typeof adapter.generate).toBe('function');
  });

  it('adapter has generateStructured method', () => {
    const adapter = getLLMAdapter('FREE');
    expect(typeof adapter.generateStructured).toBe('function');
  });

  it('adapter has classify method', () => {
    const adapter = getLLMAdapter('FREE');
    expect(typeof adapter.classify).toBe('function');
  });
});
