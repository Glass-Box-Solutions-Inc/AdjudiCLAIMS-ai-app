/**
 * Gemini (Vertex AI) adapter.
 *
 * Implements the LLM adapter interface for Google's Gemini models.
 * Falls back to stub responses when VERTEX_AI_PROJECT is not configured.
 */

import type { ILLMAdapter } from './adapter.js';
import type { LLMRequest, LLMResponse, ModelConfig } from './types.js';
import { executeWithRetry } from './retry.js';

export class GeminiAdapter implements ILLMAdapter {
  public readonly provider = 'gemini' as const;
  public readonly modelId: string;
  private readonly config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
    this.modelId = config.modelId;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const project = process.env['VERTEX_AI_PROJECT'];
    if (!project) {
      return this.stubResponse(request);
    }

    return executeWithRetry(async () => {
      // Vertex AI REST API call
      const location = process.env['VERTEX_AI_LOCATION'] ?? 'us-central1';
      const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${this.modelId}:generateContent`;

      const contents = request.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const systemInstruction = request.systemPrompt
        ?? request.messages.find((m) => m.role === 'system')?.content;

      const body = {
        contents,
        ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
        generationConfig: {
          maxOutputTokens: request.maxTokens ?? this.config.maxTokens,
          temperature: request.temperature ?? 0.3,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const err = new Error(`Gemini API error: ${String(response.status)} ${errorBody}`);
        (err as Error & { status: number }).status = response.status;
        throw err;
      }

      const data = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
        usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
      };

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const finishReason = data.candidates?.[0]?.finishReason ?? 'STOP';

      return {
        content: text,
        provider: this.provider,
        model: this.modelId,
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
        },
        finishReason,
      };
    });
  }

  async generateStructured<T>(
    request: LLMRequest,
    schema?: { parse: (data: unknown) => T },
  ): Promise<{ data: T; response: LLMResponse }> {
    const modifiedRequest: LLMRequest = {
      ...request,
      messages: [
        ...request.messages,
        ...(request.messages[request.messages.length - 1]?.role !== 'user'
          ? []
          : []),
      ],
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
      content: `[Gemini stub — VERTEX_AI_PROJECT not configured] Received: ${lastMessage?.content.substring(0, 100) ?? ''}...`,
      provider: this.provider,
      model: this.modelId,
      usage: { inputTokens: 0, outputTokens: 0 },
      finishReason: 'STUB',
    };
  }

  private async getAccessToken(): Promise<string> {
    // Use Application Default Credentials via gcloud
    const { execSync } = await import('node:child_process');
    try {
      return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
    } catch {
      throw new Error('Failed to get GCP access token. Run: gcloud auth application-default login');
    }
  }
}
