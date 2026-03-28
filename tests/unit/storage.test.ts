/**
 * Tests for storage.service.ts — GCS and local filesystem backends.
 *
 * Mocks @google-cloud/storage and node:fs/promises to test both backends
 * without touching real cloud storage or the filesystem.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — must be set up before importing the module under test
// ---------------------------------------------------------------------------

const mockSave = vi.fn().mockResolvedValue(undefined);
const mockDownload = vi.fn().mockResolvedValue([Buffer.from('file-contents')]);
const mockDelete = vi.fn().mockResolvedValue(undefined);
const mockFile = vi.fn().mockReturnValue({
  save: mockSave,
  download: mockDownload,
  delete: mockDelete,
});
const mockBucket = vi.fn().mockReturnValue({ file: mockFile });

vi.mock('@google-cloud/storage', () => ({
  Storage: class MockStorage {
    bucket = mockBucket;
  },
}));

const mockMkdir = vi.fn().mockResolvedValue(undefined);
const mockWriteFile = vi.fn().mockResolvedValue(undefined);
const mockReadFile = vi.fn().mockResolvedValue(Buffer.from('local-contents'));
const mockUnlink = vi.fn().mockResolvedValue(undefined);

vi.mock('node:fs/promises', () => ({
  mkdir: (...args: unknown[]) => mockMkdir(...args),
  writeFile: (...args: unknown[]) => mockWriteFile(...args),
  readFile: (...args: unknown[]) => mockReadFile(...args),
  unlink: (...args: unknown[]) => mockUnlink(...args),
}));

// ---------------------------------------------------------------------------
// Helper to dynamically import the module with specific env
// ---------------------------------------------------------------------------

async function importStorage(gcsBucket?: string) {
  // Reset module cache so we get a fresh singleton
  vi.resetModules();

  // Set or clear the env var BEFORE import
  if (gcsBucket) {
    process.env['GCS_BUCKET'] = gcsBucket;
  } else {
    delete process.env['GCS_BUCKET'];
  }

  const mod = await import('../../server/services/storage.service.js');
  return mod.storageService;
}

// ==========================================================================
// PATH TRAVERSAL PROTECTION (objectPath helper)
// ==========================================================================

describe('Storage — path traversal protection', () => {
  let service: Awaited<ReturnType<typeof importStorage>>;

  beforeEach(async () => {
    service = await importStorage('test-bucket');
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env['GCS_BUCKET'];
  });

  it('rejects filenames with path separators', async () => {
    await expect(
      service.upload('org1', 'claim1', 'doc1', 'sub/file.pdf', Buffer.from('x'), 'application/pdf'),
    ).rejects.toThrow('Invalid file name: path traversal detected');
  });

  it('rejects filenames with double-dot traversal', async () => {
    await expect(
      service.upload('org1', 'claim1', 'doc1', '../etc/passwd', Buffer.from('x'), 'text/plain'),
    ).rejects.toThrow('Invalid file name: path traversal detected');
  });

  it('accepts a simple filename', async () => {
    await expect(
      service.upload('org1', 'claim1', 'doc1', 'report.pdf', Buffer.from('x'), 'application/pdf'),
    ).resolves.toBeDefined();
  });
});

// ==========================================================================
// GCS BACKEND
// ==========================================================================

describe('Storage — GCS backend', () => {
  let service: Awaited<ReturnType<typeof importStorage>>;
  const BUCKET = 'my-gcs-bucket';

  beforeEach(async () => {
    vi.clearAllMocks();
    service = await importStorage(BUCKET);
  });

  afterEach(() => {
    delete process.env['GCS_BUCKET'];
  });

  // -----------------------------------------------------------------------
  // upload
  // -----------------------------------------------------------------------

  it('uploads a file to the correct GCS object path', async () => {
    const url = await service.upload(
      'org1', 'claim1', 'doc1', 'report.pdf',
      Buffer.from('pdf-data'), 'application/pdf',
    );

    expect(mockFile).toHaveBeenCalledWith('org1/claim1/doc1/report.pdf');
    expect(mockSave).toHaveBeenCalledWith(Buffer.from('pdf-data'), {
      contentType: 'application/pdf',
      resumable: false,
    });
    expect(url).toBe(`gs://${BUCKET}/org1/claim1/doc1/report.pdf`);
  });

  it('returns a gs:// URL on successful upload', async () => {
    const url = await service.upload(
      'orgA', 'claimB', 'docC', 'image.png',
      Buffer.from('png-data'), 'image/png',
    );
    expect(url).toMatch(/^gs:\/\/my-gcs-bucket\//);
  });

  it('propagates GCS save errors', async () => {
    mockSave.mockRejectedValueOnce(new Error('GCS write failed'));

    await expect(
      service.upload('org1', 'claim1', 'doc1', 'file.pdf', Buffer.from('x'), 'application/pdf'),
    ).rejects.toThrow('GCS write failed');
  });

  // -----------------------------------------------------------------------
  // download
  // -----------------------------------------------------------------------

  it('downloads a file by stripping the gs:// prefix', async () => {
    const buf = await service.download(`gs://${BUCKET}/org1/claim1/doc1/report.pdf`);

    expect(mockFile).toHaveBeenCalledWith('org1/claim1/doc1/report.pdf');
    expect(mockDownload).toHaveBeenCalled();
    expect(buf).toEqual(Buffer.from('file-contents'));
  });

  it('propagates GCS download errors', async () => {
    mockDownload.mockRejectedValueOnce(new Error('GCS read failed'));

    await expect(
      service.download(`gs://${BUCKET}/org1/claim1/doc1/file.pdf`),
    ).rejects.toThrow('GCS read failed');
  });

  // -----------------------------------------------------------------------
  // delete
  // -----------------------------------------------------------------------

  it('deletes a file by stripping the gs:// prefix', async () => {
    await service.delete(`gs://${BUCKET}/org1/claim1/doc1/report.pdf`);

    expect(mockFile).toHaveBeenCalledWith('org1/claim1/doc1/report.pdf');
    expect(mockDelete).toHaveBeenCalled();
  });

  it('propagates GCS delete errors', async () => {
    mockDelete.mockRejectedValueOnce(new Error('GCS delete failed'));

    await expect(
      service.delete(`gs://${BUCKET}/org1/claim1/doc1/file.pdf`),
    ).rejects.toThrow('GCS delete failed');
  });
});

// ==========================================================================
// LOCAL FILESYSTEM BACKEND
// ==========================================================================

describe('Storage — local filesystem backend', () => {
  let service: Awaited<ReturnType<typeof importStorage>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    service = await importStorage(undefined); // no GCS_BUCKET
  });

  afterEach(() => {
    delete process.env['GCS_BUCKET'];
  });

  // -----------------------------------------------------------------------
  // upload
  // -----------------------------------------------------------------------

  it('creates directories and writes the file locally', async () => {
    const path = await service.upload(
      'org1', 'claim1', 'doc1', 'report.pdf',
      Buffer.from('local-pdf'), 'application/pdf',
    );

    expect(mockMkdir).toHaveBeenCalledWith(
      expect.stringContaining('org1/claim1/doc1'),
      { recursive: true },
    );
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('org1/claim1/doc1/report.pdf'),
      Buffer.from('local-pdf'),
    );
    expect(path).toContain('uploads');
    expect(path).toContain('org1/claim1/doc1/report.pdf');
  });

  it('returns a local file path (not gs://)', async () => {
    const path = await service.upload(
      'org1', 'claim1', 'doc1', 'file.txt',
      Buffer.from('data'), 'text/plain',
    );
    expect(path).not.toContain('gs://');
  });

  it('propagates mkdir errors', async () => {
    mockMkdir.mockRejectedValueOnce(new Error('EACCES'));

    await expect(
      service.upload('org1', 'claim1', 'doc1', 'file.pdf', Buffer.from('x'), 'application/pdf'),
    ).rejects.toThrow('EACCES');
  });

  it('propagates writeFile errors', async () => {
    mockWriteFile.mockRejectedValueOnce(new Error('ENOSPC'));

    await expect(
      service.upload('org1', 'claim1', 'doc1', 'file.pdf', Buffer.from('x'), 'application/pdf'),
    ).rejects.toThrow('ENOSPC');
  });

  // -----------------------------------------------------------------------
  // download
  // -----------------------------------------------------------------------

  it('reads a file from the local filesystem', async () => {
    const buf = await service.download('./uploads/org1/claim1/doc1/report.pdf');

    expect(mockReadFile).toHaveBeenCalledWith('./uploads/org1/claim1/doc1/report.pdf');
    expect(buf).toEqual(Buffer.from('local-contents'));
  });

  it('propagates readFile errors', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));

    await expect(
      service.download('./uploads/missing.pdf'),
    ).rejects.toThrow('ENOENT');
  });

  // -----------------------------------------------------------------------
  // delete
  // -----------------------------------------------------------------------

  it('deletes a file from the local filesystem', async () => {
    await service.delete('./uploads/org1/claim1/doc1/report.pdf');

    expect(mockUnlink).toHaveBeenCalledWith('./uploads/org1/claim1/doc1/report.pdf');
  });

  it('propagates unlink errors', async () => {
    mockUnlink.mockRejectedValueOnce(new Error('EPERM'));

    await expect(
      service.delete('./uploads/org1/claim1/doc1/report.pdf'),
    ).rejects.toThrow('EPERM');
  });
});
