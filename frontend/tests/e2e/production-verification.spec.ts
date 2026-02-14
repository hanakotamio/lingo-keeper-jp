import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://frontend-seven-beta-72.vercel.app';

/**
 * Production Environment Verification
 *
 * This test suite verifies that the production deployment is working correctly.
 * Since this is an MVP with no authentication (LocalStorage only), we test:
 * 1. Frontend loads successfully
 * 2. Backend API is accessible
 * 3. Story list displays
 * 4. Story viewing works
 * 5. Quiz page is accessible
 */

/**
 * Helper function to set up LocalStorage to prevent language modal
 */
async function setupLocalStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test.describe('Production Verification Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupLocalStorage(page);
  });

  test('PV-001: Frontend loads successfully', async ({ page }) => {
    await test.step('Navigate to production URL', async () => {
      await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Lingo Keeper JP/i);
    });

    await test.step('Verify main content is visible', async () => {
      const mainContent = page.locator('main, #root');
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    console.log('✅ Frontend loads successfully');
  });

  test('PV-002: Backend API health check', async ({ page, request }) => {
    await test.step('Test backend health endpoint directly', async () => {
      const response = await request.get('https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health');

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.status).toBe('healthy');
      expect(data.database).toBe('connected');
    });

    console.log('✅ Backend API health check passed');
  });

  test('PV-003: Stories API returns data', async ({ request }) => {
    await test.step('Fetch stories from API', async () => {
      const response = await request.get('https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories');

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);

      // Verify story structure
      const firstStory = data.data[0];
      expect(firstStory).toHaveProperty('story_id');
      expect(firstStory).toHaveProperty('title');
      expect(firstStory).toHaveProperty('level_jlpt');
      expect(firstStory).toHaveProperty('level_cefr');
    });

    console.log('✅ Stories API returns valid data');
  });

  test('PV-004: Stories page displays story cards', async ({ page }) => {
    await test.step('Navigate to stories page', async () => {
      await page.goto(`${PRODUCTION_URL}/stories`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify story cards are visible', async () => {
      // Wait for story cards to load
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });

      const count = await storyCards.count();
      expect(count).toBeGreaterThan(0);

      console.log(`Found ${count} story cards`);
    });

    await test.step('Verify story card content', async () => {
      const firstCard = page.locator('[data-testid="story-card"]').first();

      // Check for title
      const title = firstCard.locator('[data-testid="story-title"]');
      await expect(title).toBeVisible({ timeout: 5000 });

      // Check for level badge
      const levelChip = firstCard.locator('[data-testid="story-level"]');
      await expect(levelChip).toBeVisible({ timeout: 5000 });
    });

    console.log('✅ Story cards display correctly');
  });

  test('PV-005: Story viewer works', async ({ page }) => {
    await test.step('Navigate to stories page', async () => {
      await page.goto(`${PRODUCTION_URL}/stories`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Click on first story card', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });

      const firstCard = storyCards.first();
      const storyTitle = await firstCard.locator('[data-testid="story-title"]').textContent();
      console.log(`Opening story: ${storyTitle}`);

      await firstCard.click();
    });

    await test.step('Verify story viewer loads', async () => {
      // Wait for story viewer to load
      await page.waitForTimeout(2000);

      // Verify we're on a story page
      const url = page.url();
      expect(url).toContain('/stories/');

      // Verify back button is visible
      const backButton = page.getByRole('button', { name: /ストーリー一覧に戻る/i });
      await expect(backButton).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify chapter content is loaded', async () => {
      const contentBox = page.locator('[data-testid="chapter-content"]');
      await expect(contentBox).toBeVisible({ timeout: 10000 });

      const content = await contentBox.textContent();
      expect(content).toBeTruthy();
      expect(content!.trim().length).toBeGreaterThan(0);
    });

    console.log('✅ Story viewer works correctly');
  });

  test('PV-006: Quiz page is accessible', async ({ page }) => {
    await test.step('Navigate to stories page', async () => {
      await page.goto(`${PRODUCTION_URL}/stories`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Get story ID from first card', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });
      await storyCards.first().click();

      // Wait for navigation
      await page.waitForTimeout(2000);
    });

    await test.step('Navigate to quiz page', async () => {
      const currentUrl = page.url();
      const storyIdMatch = currentUrl.match(/\/stories\/(\d+)/);
      const storyId = storyIdMatch ? storyIdMatch[1] : '6';

      await page.goto(`${PRODUCTION_URL}/quiz?story=${storyId}`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify quiz page loads', async () => {
      const pageTitle = page.locator('h1').filter({ hasText: 'Quiz' });
      await expect(pageTitle).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify quiz question is displayed', async () => {
      const questionText = page.locator('h2').first();
      await expect(questionText).toBeVisible({ timeout: 10000 });

      const questionContent = await questionText.textContent();
      expect(questionContent).toBeTruthy();
      expect(questionContent!.trim().length).toBeGreaterThan(0);
    });

    await test.step('Verify answer choices are available', async () => {
      const radioButtons = page.locator('input[type="radio"]');
      const count = await radioButtons.count();
      expect(count).toBeGreaterThanOrEqual(2);

      console.log(`Found ${count} answer choices`);
    });

    console.log('✅ Quiz page is accessible and working');
  });

  test('PV-007: Dashboard access', async ({ page }) => {
    await test.step('Navigate to dashboard', async () => {
      await page.goto(`${PRODUCTION_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify dashboard loads', async () => {
      // The dashboard should show some content
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    console.log('✅ Dashboard is accessible');
  });
});
