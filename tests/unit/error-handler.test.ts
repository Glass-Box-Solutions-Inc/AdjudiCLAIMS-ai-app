import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ExternalServiceError,
} from '../../server/lib/errors.js';
import { registerErrorHandler } from '../../server/lib/error-handler.js';

// ==========================================================================
// ERROR CLASS HIERARCHY
// ==========================================================================

describe('Error classes', () => {
  it('AppError has correct properties', () => {
    const err = new AppError('test', 500, 'TEST_CODE');
    expect(err.message).toBe('test');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('TEST_CODE');
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it('AppError can be non-operational', () => {
    const err = new AppError('fatal', 500, 'FATAL', false);
    expect(err.isOperational).toBe(false);
  });

  it('AppError sets name to constructor name', () => {
    const err = new AppError('test', 500, 'TEST');
    expect(err.name).toBe('AppError');
  });

  it('ValidationError is 400 with details', () => {
    const details = [{ field: 'email', message: 'required' }];
    const err = new ValidationError('invalid input', details);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.details).toEqual(details);
    expect(err).toBeInstanceOf(AppError);
  });

  it('ValidationError works without details', () => {
    const err = new ValidationError('invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.details).toBeUndefined();
  });

  it('UnauthorizedError defaults to 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe('Authentication required');
  });

  it('UnauthorizedError accepts custom message', () => {
    const err = new UnauthorizedError('Token expired');
    expect(err.message).toBe('Token expired');
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError defaults to 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.message).toBe('Insufficient permissions');
  });

  it('ForbiddenError accepts custom message', () => {
    const err = new ForbiddenError('Admin only');
    expect(err.message).toBe('Admin only');
  });

  it('NotFoundError defaults to 404', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Resource not found');
  });

  it('NotFoundError accepts custom message', () => {
    const err = new NotFoundError('Claim not found');
    expect(err.message).toBe('Claim not found');
  });

  it('ConflictError defaults to 409', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
    expect(err.message).toBe('Resource conflict');
  });

  it('ExternalServiceError includes service name', () => {
    const err = new ExternalServiceError('Anthropic');
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe('EXTERNAL_SERVICE_ERROR');
    expect(err.service).toBe('Anthropic');
    expect(err.message).toContain('Anthropic');
  });

  it('ExternalServiceError accepts custom message', () => {
    const err = new ExternalServiceError('Gemini', 'Rate limited');
    expect(err.message).toBe('Rate limited');
    expect(err.service).toBe('Gemini');
  });

  it('ExternalServiceError uses default message when no custom message', () => {
    const err = new ExternalServiceError('DocumentAI');
    expect(err.message).toBe('External service unavailable: DocumentAI');
  });

  it('all errors preserve prototype chain', () => {
    expect(new ValidationError('test')).toBeInstanceOf(AppError);
    expect(new UnauthorizedError()).toBeInstanceOf(AppError);
    expect(new ForbiddenError()).toBeInstanceOf(AppError);
    expect(new NotFoundError()).toBeInstanceOf(AppError);
    expect(new ConflictError()).toBeInstanceOf(AppError);
    expect(new ExternalServiceError('test')).toBeInstanceOf(AppError);
  });

  it('all errors are instanceof Error', () => {
    expect(new AppError('test', 500, 'T')).toBeInstanceOf(Error);
    expect(new ValidationError('test')).toBeInstanceOf(Error);
    expect(new UnauthorizedError()).toBeInstanceOf(Error);
    expect(new ForbiddenError()).toBeInstanceOf(Error);
    expect(new NotFoundError()).toBeInstanceOf(Error);
    expect(new ConflictError()).toBeInstanceOf(Error);
    expect(new ExternalServiceError('svc')).toBeInstanceOf(Error);
  });

  it('all errors have a stack trace', () => {
    const err = new AppError('test', 500, 'T');
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain('AppError');
  });
});

// ==========================================================================
// ERROR HANDLER (registerErrorHandler)
// ==========================================================================

describe('registerErrorHandler', () => {
  // Helpers to create a mock Fastify-like context
  function createMockReply() {
    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    return reply as unknown as FastifyReply & { code: ReturnType<typeof vi.fn>; send: ReturnType<typeof vi.fn> };
  }

  function createMockRequest() {
    return {
      log: {
        error: vi.fn(),
      },
    } as unknown as FastifyRequest & { log: { error: ReturnType<typeof vi.fn> } };
  }

  type ErrorHandler = (
    error: FastifyError | Error,
    request: FastifyRequest,
    reply: FastifyReply,
  ) => void;

  let handler: ErrorHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    // Capture the error handler passed to setErrorHandler
    const mockServer = {
      setErrorHandler: vi.fn((fn: ErrorHandler) => {
        handler = fn;
      }),
    };
    registerErrorHandler(mockServer);
  });

  it('registers the error handler on the server', () => {
    expect(handler).toBeDefined();
  });

  it('handles AppError with correct status code and response', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = new AppError('Something broke', 502, 'BAD_GATEWAY');

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(502);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Something broke',
      code: 'BAD_GATEWAY',
    });
  });

  it('handles ValidationError with details', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const details = [{ field: 'email', message: 'required' }];
    const error = new ValidationError('invalid input', details);

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'invalid input',
      code: 'VALIDATION_ERROR',
      details,
    });
  });

  it('handles ValidationError without details (no details key)', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = new ValidationError('bad data');

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'bad data',
      code: 'VALIDATION_ERROR',
    });
  });

  it('handles ZodError (name=ZodError with issues)', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = Object.assign(new Error('Validation failed'), {
      name: 'ZodError',
      issues: [{ path: ['email'], message: 'Invalid email' }],
    });

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [{ path: ['email'], message: 'Invalid email' }],
    });
  });

  it('handles Prisma P2002 (unique constraint violation) as 409', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = Object.assign(new Error('Unique constraint failed'), {
      code: 'P2002',
    });

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(409);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Resource already exists',
      code: 'CONFLICT',
    });
  });

  it('handles Prisma P2025 (record not found) as 404', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = Object.assign(new Error('Record not found'), {
      code: 'P2025',
    });

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Resource not found',
      code: 'NOT_FOUND',
    });
  });

  it('handles Fastify validation errors (has validation property)', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = Object.assign(new Error('Request validation failed'), {
      validation: [{ keyword: 'required', params: { missingProperty: 'email' } }],
    });

    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Request validation failed',
      code: 'VALIDATION_ERROR',
      details: error.validation,
    });
  });

  it('handles unknown errors with 500 in non-production', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';

    const error = new Error('Something unexpected');
    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(500);
    const sentPayload = (reply.send as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as {
      error: string;
      code: string;
      stack?: string;
    };
    expect(sentPayload.error).toBe('Something unexpected');
    expect(sentPayload.code).toBe('INTERNAL_ERROR');
    expect(sentPayload.stack).toBeDefined();

    process.env['NODE_ENV'] = originalEnv;
  });

  it('hides error message and stack in production', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    const error = new Error('Sensitive internal details');
    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(500);
    const sentPayload = (reply.send as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as {
      error: string;
      code: string;
      stack?: string;
    };
    expect(sentPayload.error).toBe('Internal server error');
    expect(sentPayload.code).toBe('INTERNAL_ERROR');
    expect(sentPayload.stack).toBeUndefined();

    process.env['NODE_ENV'] = originalEnv;
  });

  it('uses statusCode from Fastify-style errors if available', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';

    const error = Object.assign(new Error('Not Found'), { statusCode: 404 });
    handler(error, request, reply);

    expect(reply.code).toHaveBeenCalledWith(404);

    process.env['NODE_ENV'] = originalEnv;
  });

  it('logs every error server-side', () => {
    const reply = createMockReply();
    const request = createMockRequest();
    const error = new NotFoundError('Claim not found');

    handler(error, request, reply);

    expect(request.log.error).toHaveBeenCalledWith(
      { err: error },
      'Request error',
    );
  });
});
