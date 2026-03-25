/**
 * LLM abstraction layer types.
 *
 * Model selection is a billing feature in AdjudiCLAIMS:
 * - Free tier: Gemini Flash Lite (default)
 * - Standard: Gemini Flash
 * - Premium: Gemini Pro
 * - Premium+: Claude Sonnet
 * - Enterprise: Claude Opus
 */

export type LLMProvider = 'gemini' | 'anthropic';

export type ModelTier = 'FREE' | 'STANDARD' | 'PREMIUM' | 'PREMIUM_PLUS' | 'ENTERPRISE';

export interface ModelConfig {
  provider: LLMProvider;
  modelId: string;
  displayName: string;
  tier: ModelTier;
  maxTokens: number;
  supportsStructuredOutput: boolean;
}

export const MODEL_REGISTRY: Record<ModelTier, ModelConfig> = {
  FREE: {
    provider: 'gemini',
    modelId: 'gemini-2.0-flash-lite',
    displayName: 'Gemini Flash Lite',
    tier: 'FREE',
    maxTokens: 8192,
    supportsStructuredOutput: true,
  },
  STANDARD: {
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    displayName: 'Gemini Flash',
    tier: 'STANDARD',
    maxTokens: 8192,
    supportsStructuredOutput: true,
  },
  PREMIUM: {
    provider: 'gemini',
    modelId: 'gemini-2.5-pro',
    displayName: 'Gemini Pro',
    tier: 'PREMIUM',
    maxTokens: 8192,
    supportsStructuredOutput: true,
  },
  PREMIUM_PLUS: {
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-20250514',
    displayName: 'Claude Sonnet',
    tier: 'PREMIUM_PLUS',
    maxTokens: 8192,
    supportsStructuredOutput: true,
  },
  ENTERPRISE: {
    provider: 'anthropic',
    modelId: 'claude-opus-4-20250514',
    displayName: 'Claude Opus',
    tier: 'ENTERPRISE',
    maxTokens: 8192,
    supportsStructuredOutput: true,
  },
};

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface LLMUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  usage: LLMUsage;
  finishReason: string;
}
