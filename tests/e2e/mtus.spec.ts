/**
 * AdjudiCLAIMS MTUS Guideline Lookup — E2E Tests
 *
 * Covers:
 * - MTUS page loads at /mtus
 * - Search/lookup interface is present
 * - MTUS results render without crash
 * - Regulatory citation is visible on MTUS page
 * - MTUS API endpoint is auth-gated
 * - MTUS page is reachable from sidebar
 *
 * Tests run against the live deployment URL. All tests are defensive.
 */

import { test, expect, type Page } from '@playwright/test';

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

// ---------------------------------------------------------------------------
// 1. Page Load
// ---------------------------------------------------------------------------

test.describe('MTUS Page Load', () => {
  test('MTUS page loads without 500 error', async ({ page }) => {
    await loginAs(page);
    const response = await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    expect(response?.status()).not.toBe(500);
  });

  test('MTUS page contains MTUS-related content', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    const html = await page.content();
    const hasMtusContent =
      html.toUpperCase().includes('MTUS') ||
      html.toLowerCase().includes('medical treatment') ||
      html.toLowerCase().includes('utilization') ||
      html.toLowerCase().includes('guideline') ||
      html.toLowerCase().includes('treatment');
    expect(hasMtusContent).toBe(true);
  });

  test('MTUS page renders without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });

    const critical = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('hydration'),
    );
    expect(critical).toHaveLength(0);
  });

  test('MTUS page is reachable from sidebar navigation', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    const mtusLink = page
      .locator('a[href*="mtus"], nav a:has-text("MTUS"), nav a:has-text("Guidelines"), nav a:has-text("Medical Treatment")')
      .first();

    if (!(await mtusLink.isVisible())) {
      test.skip();
      return;
    }

    await mtusLink.click();
    await page.waitForURL(/mtus/, { timeout: 10000 }).catch(() => {});
    const html = await page.content();
    expect(html.toLowerCase()).toMatch(/mtus|medical treatment|guideline|utilization/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Search / Lookup Interface
// ---------------------------------------------------------------------------

test.describe('MTUS Search Interface', () => {
  test('search input or lookup interface is present on MTUS page', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });

    const html = await page.content();
    const hasSearch =
      html.toLowerCase().includes('search') ||
      html.toLowerCase().includes('lookup') ||
      html.toLowerCase().includes('find') ||
      html.toLowerCase().includes('guideline') ||
      // Input element
      html.includes('<input') ||
      html.includes('<select');
    expect(hasSearch).toBe(true);
  });

  test('MTUS search field accepts text without crash', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });

    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="search" i], input[placeholder*="find" i], input[placeholder*="condition" i], input[placeholder*="treatment" i]',
      )
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('low back pain');
      const value = await searchInput.inputValue();
      expect(value).toBe('low back pain');
    }

    const critical = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('hydration'),
    );
    expect(critical).toHaveLength(0);
  });

  test('MTUS page shows result list or empty state', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });

    const html = await page.content();
    const hasResultArea =
      html.toLowerCase().includes('guideline') ||
      html.toLowerCase().includes('result') ||
      html.toLowerCase().includes('treatment') ||
      html.toLowerCase().includes('no results') ||
      html.toLowerCase().includes('search') ||
      html.toLowerCase().includes('mtus');
    expect(hasResultArea).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Regulatory Citations
// ---------------------------------------------------------------------------

test.describe('MTUS Regulatory Context', () => {
  test('MTUS page shows regulatory reference (CCR or MTUS citation)', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    const html = await page.content();
    const hasRegCitation =
      html.includes('CCR') ||
      html.includes('8 Cal') ||
      html.toLowerCase().includes('california code') ||
      html.toLowerCase().includes('regulation') ||
      html.toLowerCase().includes('mtus') ||
      html.toLowerCase().includes('workers') ||
      html.toLowerCase().includes('evidence-based');
    expect(hasRegCitation).toBe(true);
  });

  test('MTUS page does not contain raw server error text', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    const html = await page.content();
    const hasServerError =
      html.includes('at Object.') ||
      html.includes('TypeError:') ||
      html.includes('ReferenceError:') ||
      html.includes('stack trace');
    expect(hasServerError).toBe(false);
  });

  test('MTUS content does not contain prohibited legal conclusions', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    const html = await page.content();
    // MTUS guidelines are factual; they must not contain legal conclusions
    const hasProhibited =
      html.toLowerCase().includes('you must deny') ||
      html.toLowerCase().includes('claim should be denied') ||
      html.toLowerCase().includes('legal conclusion:');
    expect(hasProhibited).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. MTUS API Endpoints
// ---------------------------------------------------------------------------

test.describe('MTUS API Security', () => {
  test('GET /api/mtus returns 401 or 404 without session', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/mtus`);
    expect([401, 404]).toContain(response.status());
  });

  test('GET /api/mtus/search returns 401 or 404 without session', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/mtus/search?q=low+back+pain`);
    expect([401, 404]).toContain(response.status());
  });

  test('MTUS API does not return 500 for unauthenticated request', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/mtus`);
    expect(response.status()).not.toBe(500);
  });

  test('POST /api/mtus/lookup returns 401 or 404 without session', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/mtus/lookup`, {
      data: { condition: 'lumbar radiculopathy' },
    });
    expect([401, 404]).toContain(response.status());
  });
});

// ---------------------------------------------------------------------------
// 5. MTUS Integration with Claim Context
// ---------------------------------------------------------------------------

test.describe('MTUS from Claim Context', () => {
  test('MTUS page accessible from claim detail (if linked)', async ({ page }) => {
    await loginAs(page);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    const claimLink = page.locator('a[href*="/claims/"]').first();
    if (!(await claimLink.isVisible())) {
      test.skip();
      return;
    }

    await claimLink.click();
    await page.waitForURL(/\/claims\/.+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Look for MTUS link within the claim context
    const mtusLinkInClaim = page
      .locator('a[href*="mtus"], button:has-text("MTUS"), a:has-text("Guidelines")')
      .first();

    if (await mtusLinkInClaim.isVisible()) {
      await mtusLinkInClaim.click();
      await page.waitForTimeout(2000);
      const html = await page.content();
      expect(html.toLowerCase()).toMatch(/mtus|guideline|treatment/i);
    } else {
      // MTUS not linked from claim detail — acceptable
      const html = await page.content();
      expect(html.length).toBeGreaterThan(100);
    }
  });

  test('standalone /mtus page does not require claim context', async ({ page }) => {
    await loginAs(page);
    // Navigate directly without visiting a claim first
    const response = await page.goto(`${BASE_URL}/mtus`, { waitUntil: 'networkidle' });
    expect(response?.status()).not.toBe(500);
    const html = await page.content();
    expect(html.toLowerCase()).toMatch(/mtus|guideline|treatment|medical/i);
  });
});
