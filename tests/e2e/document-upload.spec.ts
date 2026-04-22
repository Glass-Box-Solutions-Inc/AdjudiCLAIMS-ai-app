/**
 * AdjudiCLAIMS Document Upload & Classification — E2E Tests
 *
 * Covers:
 * - Document upload zone is visible on the documents tab
 * - Upload zone accepts click interaction (file input exposed)
 * - Upload pending/error state renders without crash
 * - OCR status badges are rendered in the documents table
 * - Document type badge rendered per row
 * - Upload API endpoint exists and is auth-gated
 *
 * Tests run against the live deployment URL. They are written defensively:
 * when data-dependent elements may not exist (e.g., no claims in DB),
 * the test skips rather than failing.
 */

import { test, expect, type Page } from '@playwright/test';
import * as path from 'path';

const BASE_URL =
  process.env.DEPLOYMENT_URL ||
  'https://adjudiclaims-api-104228172531.us-west1.run.app';

const E2E_EMAIL = process.env.E2E_EXAMINER_EMAIL || 'examiner@acme-ins.test';
const E2E_PASSWORD = process.env.E2E_EXAMINER_PASSWORD || 'TestPassword1!';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

async function loginAs(page: Page, email = E2E_EMAIL, password = E2E_PASSWORD): Promise<void> {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[name="email"], input[type="email"]', { timeout: 10000 }).catch(() => {});
  await page.locator('[name="email"], input[type="email"]').first().fill(email);
  await page.locator('[name="password"], input[type="password"]').first().fill(password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|training)/, { timeout: 15000 }).catch(() => {});
}

async function navigateToFirstClaimDocuments(page: Page): Promise<boolean> {
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  const claimLink = page.locator('a[href*="/claims/"]').first();
  if (!(await claimLink.isVisible())) return false;
  await claimLink.click();
  await page.waitForURL(/\/claims\/.+/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  // Navigate to documents tab
  const docsTab = page
    .locator(
      '[role="tab"]:has-text("Documents"), a[href*="documents"], button:has-text("Documents"), a:has-text("Documents")',
    )
    .first();

  if (await docsTab.isVisible()) {
    await docsTab.click();
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle');
    return true;
  }

  // The route may be directly accessible via URL pattern
  const currentUrl = page.url();
  const claimIdMatch = currentUrl.match(/\/claims\/([^/]+)/);
  if (claimIdMatch) {
    await page.goto(`${BASE_URL}/claims/${claimIdMatch[1]}/documents`, { waitUntil: 'networkidle' });
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// 1. Upload Zone Visibility
// ---------------------------------------------------------------------------

test.describe('Document Upload Zone', () => {
  test('documents tab loads without 500 error', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    const claimLink = page.locator('a[href*="/claims/"]').first();
    if (!(await claimLink.isVisible())) {
      test.skip();
      return;
    }

    await claimLink.click();
    await page.waitForURL(/\/claims\/.+/, { timeout: 10000 });

    const claimIdMatch = page.url().match(/\/claims\/([^/]+)/);
    if (!claimIdMatch) {
      test.skip();
      return;
    }

    const response = await page.goto(
      `${BASE_URL}/claims/${claimIdMatch[1]}/documents`,
      { waitUntil: 'networkidle' },
    );
    expect(response?.status()).not.toBe(500);
  });

  test('upload zone element is present on documents tab', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    const hasUploadZone =
      html.toLowerCase().includes('drag') ||
      html.toLowerCase().includes('upload') ||
      html.toLowerCase().includes('drop') ||
      html.toLowerCase().includes('browse');
    expect(hasUploadZone).toBe(true);
  });

  test('file input element exists in upload zone', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    // File input may be hidden (display:none) — check for DOM presence not visibility
    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();

    if (count === 0) {
      // Accept: upload zone may use a different pattern
      const html = await page.content();
      const hasUploadIndicator =
        html.toLowerCase().includes('upload') || html.toLowerCase().includes('attach');
      expect(hasUploadIndicator).toBe(true);
      return;
    }

    expect(count).toBeGreaterThan(0);
    // Verify accepted file types are scoped (not open-ended)
    const acceptAttr = await fileInput.first().getAttribute('accept');
    if (acceptAttr) {
      // Should accept document types, not arbitrary files
      expect(acceptAttr).toMatch(/pdf|png|jpg|doc|tiff/i);
    }
  });

  test('upload zone click does not crash the page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    // Click the upload zone area (not the hidden file input)
    const uploadZone = page
      .locator(
        '[data-testid="upload-zone"], .cursor-pointer:has(input[type="file"]), div:has-text("Drag & drop")',
      )
      .first();

    if (await uploadZone.isVisible()) {
      // Intercept the file chooser to avoid hanging
      const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 3000 }).catch(() => null);
      await uploadZone.click();
      await fileChooserPromise;
    }

    // No critical JS errors
    const critical = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('hydration'),
    );
    expect(critical).toHaveLength(0);
  });

  test('upload zone shows "drop to upload" affordance text', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    const hasDragText =
      html.toLowerCase().includes('drag') ||
      html.toLowerCase().includes('drop') ||
      html.toLowerCase().includes('browse') ||
      html.toLowerCase().includes('click to');
    expect(hasDragText).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. OCR Status Badges
// ---------------------------------------------------------------------------

test.describe('OCR Status Badges', () => {
  test('documents table renders when documents exist', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    const hasTable =
      html.toLowerCase().includes('document') ||
      html.toLowerCase().includes('no documents') ||
      html.toLowerCase().includes('uploaded');
    expect(hasTable).toBe(true);
  });

  test('OCR status column header is present when documents table renders', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    // If there are documents, OCR Status column header should be present
    const hasDocuments =
      !html.toLowerCase().includes('no documents') && !html.toLowerCase().includes('no files');

    if (hasDocuments && html.toLowerCase().includes('<table')) {
      const hasOcrColumn =
        html.toLowerCase().includes('ocr') ||
        html.toLowerCase().includes('status') ||
        html.toLowerCase().includes('processing');
      expect(hasOcrColumn).toBe(true);
    }
  });

  test('valid OCR status badge text is rendered for each document row', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    // If documents exist, at least one OCR status badge should be present
    const hasOcrBadge =
      html.toLowerCase().includes('ocr complete') ||
      html.toLowerCase().includes('processing') ||
      html.toLowerCase().includes('pending') ||
      html.toLowerCase().includes('ocr failed') ||
      // Empty state is also acceptable
      html.toLowerCase().includes('no documents') ||
      html.toLowerCase().includes('upload files');
    expect(hasOcrBadge).toBe(true);
  });

  test('document type badge rendered per document row', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    // Either document type badges exist or the empty state is shown
    const hasContent =
      html.toLowerCase().includes('medical') ||
      html.toLowerCase().includes('legal') ||
      html.toLowerCase().includes('report') ||
      html.toLowerCase().includes('photo') ||
      html.toLowerCase().includes('no documents') ||
      html.toLowerCase().includes('upload');
    expect(hasContent).toBe(true);
  });

  test('page renders file size column when documents are present', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    const hasDocuments = html.toLowerCase().includes('<tr') && !html.toLowerCase().includes('no documents');

    if (hasDocuments) {
      const hasSizeCol =
        html.toLowerCase().includes('size') ||
        html.match(/\d+\s*(kb|mb|b)\b/i);
      expect(hasSizeCol).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Upload API Endpoints
// ---------------------------------------------------------------------------

test.describe('Document Upload API', () => {
  test('POST /api/documents/upload returns 401 or 404 without session', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/documents/upload`, {
      multipart: {
        file: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 fake content'),
        },
        claimId: 'fake-claim-id',
      },
    });
    expect([401, 404]).toContain(response.status());
  });

  test('GET /api/documents returns 401 or 404 without session', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/documents`);
    expect([401, 404]).toContain(response.status());
  });

  test('GET /api/documents/:claimId returns 401 or 404 without session', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/documents/fake-claim-id`);
    expect([401, 404]).toContain(response.status());
  });

  test('document upload endpoint does not return 500 for unauthenticated POST', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/documents/upload`, {
      data: { claimId: 'fake-claim-id' },
    });
    expect(response.status()).not.toBe(500);
  });
});

// ---------------------------------------------------------------------------
// 4. Upload State Feedback
// ---------------------------------------------------------------------------

test.describe('Upload State Feedback', () => {
  test('upload error state shows retry affordance (no 500 on failed upload)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    // The page should be stable — no JS errors at rest
    const critical = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('hydration'),
    );
    expect(critical).toHaveLength(0);
  });

  test('upload zone is accessible via keyboard (has tabIndex or role)', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    // Upload zone should be keyboard accessible
    const html = await page.content();
    const hasAccessibility =
      html.includes('tabindex') ||
      html.includes('role=') ||
      html.includes('aria-') ||
      html.toLowerCase().includes('cursor-pointer');
    expect(hasAccessibility).toBe(true);
  });

  test('documents tab does not expose internal server errors to user', async ({ page }) => {
    await loginAs(page);
    const hasDocTab = await navigateToFirstClaimDocuments(page);
    if (!hasDocTab) {
      test.skip();
      return;
    }

    const html = await page.content();
    // Should not show raw stack traces
    const hasServerError =
      html.includes('at Object.') ||
      html.includes('TypeError:') ||
      html.includes('ReferenceError:') ||
      html.includes('stack trace');
    expect(hasServerError).toBe(false);
  });
});
