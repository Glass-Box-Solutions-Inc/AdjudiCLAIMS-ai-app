import { describe, it, expect, vi } from 'vitest';

/**
 * Training gate middleware tests.
 *
 * Tests requireTrainingComplete() preHandler hook for all branches:
 * - No user (401)
 * - isTrainingComplete === false (403)
 * - isTrainingComplete === true (allowed)
 * - isTrainingComplete === undefined/null (allowed — legacy session)
 */

import { requireTrainingComplete } from '../../server/middleware/training-gate.js';
import type { FastifyRequest, FastifyReply } from 'fastify';

function makeMockRequest(user: unknown): FastifyRequest {
  return {
    session: { user },
  } as unknown as FastifyRequest;
}

function makeMockReply() {
  const reply = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as unknown as FastifyReply & {
    code: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
  };
}

describe('requireTrainingComplete', () => {
  it('returns 401 when no user on session', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest(undefined);
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(done).not.toHaveBeenCalled();
  });

  it('returns 401 when user is null', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest(null);
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(done).not.toHaveBeenCalled();
  });

  it('returns 403 when isTrainingComplete is false', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest({
      id: 'user-1',
      isTrainingComplete: false,
    });
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(reply.code).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Training required',
        trainingRequired: true,
      }),
    );
    expect(done).not.toHaveBeenCalled();
  });

  it('calls done() when isTrainingComplete is true', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest({
      id: 'user-1',
      isTrainingComplete: true,
    });
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(done).toHaveBeenCalledOnce();
    expect(reply.code).not.toHaveBeenCalled();
  });

  it('calls done() when isTrainingComplete is undefined (legacy session)', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest({
      id: 'user-1',
      // isTrainingComplete not present
    });
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(done).toHaveBeenCalledOnce();
    expect(reply.code).not.toHaveBeenCalled();
  });

  it('calls done() when isTrainingComplete is null (legacy session)', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest({
      id: 'user-1',
      isTrainingComplete: null,
    });
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(done).toHaveBeenCalledOnce();
  });

  it('403 response includes trainingRequired and message', () => {
    const handler = requireTrainingComplete();
    const request = makeMockRequest({
      id: 'user-1',
      isTrainingComplete: false,
    });
    const reply = makeMockReply();
    const done = vi.fn();

    handler.call(null as never, request, reply as unknown as FastifyReply, done);

    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('/training'),
      }),
    );
  });
});
