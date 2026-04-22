/**
 * AJC-8: Document Access Control — Auth Integration Tests
 *
 * Verifies that all document endpoints reject unauthenticated requests
 * with HTTP 401. These tests make requests with NO session cookie and
 * assert that the requireAuth() middleware fires before any business logic.
 *
 * Endpoints covered:
 *   1. GET  /api/claims/:claimId/documents      — list documents for a claim
 *   2. POST /api/claims/:claimId/documents      — upload a document
 *   3. GET  /api/documents/:id                  — get document by ID
 *   4. DELETE /api/documents/:id                — delete document
 *   5. GET  /api/claims/:claimId/timeline       — timeline (also in documentRoutes)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Ensure session secret meets 32-char minimum for @fastify/session
process.env['SESSION_SECRET'] ??= 'e2e-test-secret-key-must-be-32-chars-minimum!!';
// Ensure DATABASE_URL is set (not used for auth-rejection tests, but required at build time)
process.env['DATABASE_URL'] ??= 'mysql://adjudiclaims:password@localhost:3306/adjudiclaims';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getServer() {
  const { buildServer } = await import('../../server/index.js');
  return buildServer();
}

// Placeholder IDs — the auth middleware fires before any DB lookup, so
// these values never reach the database in these tests.
const FAKE_CLAIM_ID = 'claim-unauthenticated-test';
const FAKE_DOC_ID = 'doc-unauthenticated-test';

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Document Access Control: unauthenticated requests must return 401', () => {
  let server: Awaited<ReturnType<typeof getServer>>;

  beforeAll(async () => {
    server = await getServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /api/claims/:claimId/documents — returns 401 without session', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/claims/${FAKE_CLAIM_ID}/documents`,
      // No cookie header — unauthenticated
    });

    expect(response.statusCode).toBe(401);
    const body = response.json<{ error: string }>();
    expect(body.error).toBeTruthy();
  });

  it('POST /api/claims/:claimId/documents — returns 401 without session', async () => {
    const boundary = '----TestBoundaryUnauth' + String(Date.now());
    const body = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
        'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n' +
        'Content-Type: application/pdf\r\n\r\n',
      ),
      Buffer.from('%PDF-1.4 minimal'),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await server.inject({
      method: 'POST',
      url: `/api/claims/${FAKE_CLAIM_ID}/documents`,
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      payload: body,
      // No cookie header — unauthenticated
    });

    expect(response.statusCode).toBe(401);
    const result = response.json<{ error: string }>();
    expect(result.error).toBeTruthy();
  });

  it('GET /api/documents/:id — returns 401 without session', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/documents/${FAKE_DOC_ID}`,
      // No cookie header — unauthenticated
    });

    expect(response.statusCode).toBe(401);
    const body = response.json<{ error: string }>();
    expect(body.error).toBeTruthy();
  });

  it('DELETE /api/documents/:id — returns 401 without session', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/documents/${FAKE_DOC_ID}`,
      // No cookie header — unauthenticated
    });

    expect(response.statusCode).toBe(401);
    const body = response.json<{ error: string }>();
    expect(body.error).toBeTruthy();
  });

  it('GET /api/claims/:claimId/timeline — returns 401 without session', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/claims/${FAKE_CLAIM_ID}/timeline`,
      // No cookie header — unauthenticated
    });

    expect(response.statusCode).toBe(401);
    const body = response.json<{ error: string }>();
    expect(body.error).toBeTruthy();
  });
});
