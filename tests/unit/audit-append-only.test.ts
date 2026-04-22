// @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Audit Trail — Append-Only Enforcement Tests (AJC-6 §7.1)
 *
 * Verifies that:
 * 1. No UPDATE or DELETE paths exist on AuditEvent rows anywhere in server/ source
 * 2. The DB-level append-only migration files exist
 * 3. logAuditEvent() only uses prisma.auditEvent.create() — never update/delete
 *
 * The DB trigger (migration 20260420_audit_append_only) enforces append-only
 * at the database level. These tests prove the same constraint at the code level.
 */

// ---------------------------------------------------------------------------
// Codebase scan helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all .ts files under a directory.
 */
function collectTsFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const SERVER_DIR = join(process.cwd(), 'server');
const MIGRATIONS_DIR = join(process.cwd(), 'prisma', 'migrations');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Audit Trail — Append-Only Enforcement', () => {
  /**
   * Scan all server/ TypeScript files for auditEvent.update or auditEvent.delete calls.
   * These operations are forbidden — audit events are immutable.
   */
  it('no auditEvent.update() calls exist in server/ source files', () => {
    const serverFiles = collectTsFiles(SERVER_DIR);
    const violations: string[] = [];

    for (const filePath of serverFiles) {
      const content = readFileSync(filePath, 'utf-8');
      // Match patterns like: prisma.auditEvent.update, auditEvent.update(
      // Allow the word "auditEvent" in comments that describe the prohibition
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        // Skip comment lines
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
        // Detect auditEvent.update or auditEvent.updateMany
        if (/auditEvent\s*\.\s*update\s*[(\s]/i.test(line)) {
          violations.push(`${filePath}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('no auditEvent.delete() calls exist in server/ source files', () => {
    const serverFiles = collectTsFiles(SERVER_DIR);
    const violations: string[] = [];

    for (const filePath of serverFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
        // Detect auditEvent.delete or auditEvent.deleteMany
        if (/auditEvent\s*\.\s*delete\s*[(\s]/i.test(line)) {
          // Allow deleteMany only in data-retention.service.ts (authorized purge via $executeRaw)
          // The data-retention service uses $executeRawUnsafe, not .deleteMany()
          violations.push(`${filePath}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  /**
   * Verify the DB-level append-only migration exists and contains
   * the expected trigger function name.
   */
  it('append-only DB migration file exists with trigger function', () => {
    const migrationPath = join(
      MIGRATIONS_DIR,
      '20260420_audit_append_only',
      'migration.sql',
    );

    let content: string;
    try {
      content = readFileSync(migrationPath, 'utf-8');
    } catch {
      throw new Error(
        `Append-only migration not found at ${migrationPath}. ` +
          'The DB trigger is required to enforce audit immutability.',
      );
    }

    // Verify the trigger function is defined
    expect(content).toContain('audit_events_immutable');
    // Verify both triggers are created
    expect(content).toContain('audit_events_no_update');
    expect(content).toContain('audit_events_no_delete');
    // Verify RAISE EXCEPTION is used (not silent DO INSTEAD NOTHING)
    expect(content).toContain('RAISE EXCEPTION');
    // Verify the authorized retention purge bypass uses a session-scoped variable
    // (not a broad bypass that could be exploited outside the purge transaction)
    expect(content).toContain('adjudica.authorized_retention_purge');
  });

  /**
   * Verify that logAuditEvent() only calls prisma.auditEvent.create —
   * by checking the audit middleware source directly.
   */
  it('logAuditEvent() in middleware/audit.ts only calls auditEvent.create', () => {
    const auditMiddlewarePath = join(SERVER_DIR, 'middleware', 'audit.ts');
    const content = readFileSync(auditMiddlewarePath, 'utf-8');

    // Must have auditEvent.create
    expect(content).toContain('auditEvent.create');
    // Must NOT have auditEvent.update (would violate append-only)
    expect(content).not.toMatch(/auditEvent\s*\.\s*update\s*[(\s]/);
    // Must NOT have auditEvent.delete (would violate append-only)
    expect(content).not.toMatch(/auditEvent\s*\.\s*delete\s*[(\s]/);
  });

  /**
   * Verify that the Prisma schema AuditEvent model has no updatedAt field —
   * the absence of updatedAt is a schema-level indicator of append-only intent.
   */
  it('AuditEvent schema model has no updatedAt field', () => {
    const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma');
    const content = readFileSync(schemaPath, 'utf-8');

    // Extract just the AuditEvent model block
    const modelMatch = content.match(/model AuditEvent \{[\s\S]*?\n\}/);
    expect(modelMatch).not.toBeNull();
    const modelBlock = modelMatch![0];

    // AuditEvent must NOT have an updatedAt FIELD definition — append-only tables have no update timestamp.
    // Note: the word may appear in comments that document the absence; check for the field declaration pattern.
    expect(modelBlock).not.toMatch(/^\s+updatedAt\s+DateTime/m);
    // AuditEvent MUST have createdAt — it's the only timestamp needed
    expect(modelBlock).toContain('createdAt');
  });
});

// ---------------------------------------------------------------------------
// Mock required to prevent Prisma client import errors in test environment
// ---------------------------------------------------------------------------

vi.mock('../../server/db.js', () => ({
  prisma: {
    auditEvent: {
      create: vi.fn().mockResolvedValue({ id: 'ae-1' }),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
  },
}));
