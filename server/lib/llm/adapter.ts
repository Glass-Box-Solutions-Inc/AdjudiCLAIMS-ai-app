/**
 * LLM adapter interface.
 *
 * All LLM providers implement this interface, enabling transparent
 * provider switching and model tier selection at runtime.
 */

import type { LLMRequest, LLMResponse } from './types.js';

export interface ILLMAdapter {
  readonly provider: string;
  readonly modelId: string;

  /**
   * Generate a text response.
   */
  generate(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Generate a structured (JSON) response.
   * Falls back to generate() + JSON.parse() if provider doesn't support native structured output.
   */
  generateStructured<T>(
    request: LLMRequest,
    schema?: { parse: (data: unknown) => T },
  ): Promise<{ data: T; response: LLMResponse }>;

  /**
   * Classify text into one of the provided categories.
   * Convenience method that wraps generate() with a classification prompt.
   */
  classify(
    text: string,
    categories: string[],
    systemPrompt?: string,
  ): Promise<{ category: string; confidence: number; response: LLMResponse }>;
}
