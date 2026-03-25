/**
 * LLM adapter factory.
 *
 * Creates and caches LLM adapter instances by model tier.
 * Default tier is FREE (Gemini Flash Lite) — included at no cost.
 */

import type { ILLMAdapter } from './adapter.js';
import type { ModelTier } from './types.js';
import { MODEL_REGISTRY } from './types.js';
import { GeminiAdapter } from './gemini-adapter.js';
import { ClaudeAdapter } from './claude-adapter.js';

const adapterCache = new Map<ModelTier, ILLMAdapter>();

/**
 * Get an LLM adapter for the specified tier.
 * Defaults to FREE tier (Gemini Flash Lite).
 * Caches instances for reuse.
 */
export function getLLMAdapter(tier: ModelTier = 'FREE'): ILLMAdapter {
  const cached = adapterCache.get(tier);
  if (cached) return cached;

  const config = MODEL_REGISTRY[tier];
  let adapter: ILLMAdapter;

  switch (config.provider) {
    case 'gemini':
      adapter = new GeminiAdapter(config);
      break;
    case 'anthropic':
      adapter = new ClaudeAdapter(config);
      break;
    default:
      throw new Error(`Unknown LLM provider: ${String(config.provider)}`);
  }

  adapterCache.set(tier, adapter);
  return adapter;
}

/**
 * Clear the adapter cache (for testing).
 */
export function _resetAdapterCache(): void {
  adapterCache.clear();
}
