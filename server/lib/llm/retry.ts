/**
 * LLM retry utility with exponential backoff and jitter.
 * Classifies errors to determine retry eligibility.
 */

export type ErrorCategory = 'RATE_LIMIT' | 'UNAVAILABLE' | 'AUTH' | 'INVALID_REQUEST' | 'UNKNOWN';

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

/**
 * Classify an error to determine if it's retryable.
 */
export function classifyError(error: unknown): ErrorCategory {
  if (!(error instanceof Error)) return 'UNKNOWN';

  const message = error.message.toLowerCase();
  const statusCode = 'status' in error ? (error as { status: number }).status : undefined;

  if (statusCode === 429 || message.includes('rate limit') || message.includes('too many requests')) {
    return 'RATE_LIMIT';
  }
  if (statusCode === 503 || statusCode === 502 || statusCode === 504 || message.includes('unavailable') || message.includes('overloaded')) {
    return 'UNAVAILABLE';
  }
  if (statusCode === 401 || statusCode === 403 || message.includes('unauthorized') || message.includes('invalid api key') || message.includes('authentication')) {
    return 'AUTH';
  }
  if (statusCode === 400 || message.includes('invalid request') || message.includes('validation')) {
    return 'INVALID_REQUEST';
  }
  return 'UNKNOWN';
}

function isRetryable(category: ErrorCategory): boolean {
  return category === 'RATE_LIMIT' || category === 'UNAVAILABLE';
}

function calculateDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseDelayMs;
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute an async function with exponential backoff retry.
 * Only retries on RATE_LIMIT and UNAVAILABLE errors.
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const category = classifyError(error);

      if (!isRetryable(category) || attempt === opts.maxRetries) {
        throw error;
      }

      const delay = calculateDelay(attempt, opts.baseDelayMs, opts.maxDelayMs);
      await sleep(delay);
    }
  }

  throw lastError;
}
