/**
 * Claude (Anthropic) adapter.
 *
 * Implements the LLM adapter interface for Anthropic's Claude models.
 * Falls back to stub responses when ANTHROPIC_API_KEY is not configured.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ILLMAdapter } from './adapter.js';
import type { LLMRequest, LLMResponse, ModelConfig } from './types.js';
import { executeWithRetry } from './retry.js';

export class ClaudeAdapter implements ILLMAdapter {
  public readonly provider = 'anthropic' as const;
  public readonly modelId: string;
  private readonly config: ModelConfig;
  private client: Anthropic | null = null;

  constructor(config: ModelConfig) {
    this.config = config;
    this.modelId = config.modelId;
  }

  private getClient(): Anthropic | null {
    if (this.client) return this.client;
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) return null;
    this.client = new Anthropic({ apiKey });
    return this.client;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const client = this.getClient();
    if (!client) {
      return this.stubResponse(request);
    }

    return executeWithRetry(async () => {
      const systemPrompt = request.systemPrompt
        ?? request.messages.find((m) => m.role === 'system')?.content;

      const messages = request.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const response = await client.messages.create({
        model: this.modelId,
        max_tokens: request.maxTokens ?? this.config.maxTokens,
        temperature: request.temperature ?? 0.3,
        ...(systemPrompt ? { system: systemPrompt } : {}),
        messages,
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      const content = textBlock && 'text' in textBlock ? textBlock.text : '';

      return {
        content,
        provider: this.provider,
        model: this.modelId,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
        finishReason: response.stop_reason ?? 'end_turn',
      };
    });
  }

  async generateStructured<T>(
    request: LLMRequest,
    schema?: { parse: (data: unknown) => T },
  ): Promise<{ data: T; response: LLMResponse }> {
    const modifiedRequest: LLMRequest = {
      ...request,
      systemPrompt: (request.systemPrompt ?? '') + '\n\nRespond with valid JSON only. No markdown fencing.',
    };

    const response = await this.generate(modifiedRequest);
    const parsed = JSON.parse(response.content) as unknown;
    const data = schema ? schema.parse(parsed) : parsed as T;
    return { data, response };
  }

  async classify(
    text: string,
    categories: string[],
    systemPrompt?: string,
  ): Promise<{ category: string; confidence: number; response: LLMResponse }> {
    const classifyPrompt = `Classify the following text into exactly one of these categories: ${categories.join(', ')}

Respond with JSON: {"category": "<one of the categories>", "confidence": <0.0-1.0>}

Text: ${text}`;

    const { data, response } = await this.generateStructured<{ category: string; confidence: number }>(
      {
        messages: [{ role: 'user', content: classifyPrompt }],
        systemPrompt,
        temperature: 0,
      },
    );

    return { category: data.category, confidence: data.confidence, response };
  }

  private stubResponse(request: LLMRequest): LLMResponse {
    const lastMessage = request.messages[request.messages.length - 1];
    return {
      content: `[Claude stub — ANTHROPIC_API_KEY not configured] Received: ${lastMessage?.content.substring(0, 100) ?? ''}...`,
      provider: this.provider,
      model: this.modelId,
      usage: { inputTokens: 0, outputTokens: 0 },
      finishReason: 'STUB',
    };
  }
}
