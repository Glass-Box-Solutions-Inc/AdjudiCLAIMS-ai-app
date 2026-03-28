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

// ---------------------------------------------------------------------------
// Tool-use types
// ---------------------------------------------------------------------------

/** JSON Schema definition for a tool the LLM can invoke. */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;  // JSON Schema
}

/** A tool invocation returned by the LLM. */
export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/** The result of executing a tool, sent back to the LLM on the next turn. */
export interface ToolResult {
  toolCallId: string;
  content: string;
}

// ---------------------------------------------------------------------------
// Request / Response
// ---------------------------------------------------------------------------

export interface LLMRequest {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  /** Tool definitions available for this request. */
  tools?: ToolDefinition[];
  /** Results from previously invoked tools (multi-turn tool use). */
  toolResults?: ToolResult[];
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
  /** Tool invocations requested by the LLM (present when stopReason === 'tool_use'). */
  toolCalls?: ToolCall[];
  /** Semantic stop reason: 'end_turn' | 'tool_use' | 'max_tokens'. */
  stopReason?: string;
}
