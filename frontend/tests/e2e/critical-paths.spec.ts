import { test, expect, Page } from '@playwright/test';
import { TEST_USERS } from './helpers/auth.helper';

/**
 * Critical Path E2E Tests for Production
 *
 * This file contains the most critical user journeys that MUST work in production.
 * These tests are optimized for speed and reliability:
 * - Minimal timeouts (30s max)
 * - No unnecessary waits
 * - Focus on core functionality only
 * - Run sequentially (workers: 1) to avoid rate limiting
 *
 * Test Coverage:
 * 1. Login → Dashboard display
 * 2. Story list → Story viewing
 * 3. Quiz page → Quiz answer submission
 */

/**
 * Helper function to prevent language selection modal from appearing
 */
async function preventLanguageModal(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test.describe('Critical Paths - Production Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await preventLanguageModal(page);
  });

  /**
   * CRITICAL PATH 1: Login → Dashboard
   * User must be able to log in and see the dashboard
   */
  test('CP-001: Login and Dashboard Access', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify login form is displayed', async () => {
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
    });

    await test.step('Submit login with demo credentials', async () => {
      await page.fill('input[type="email"]', TEST_USERS.demo.email);
      await page.fill('input[type="password"]', TEST_USERS.demo.password);
      await page.click('button[type="submit"]');
    });

    await test.step('Verify redirect to dashboard', async () => {
      await page.waitForURL('/', { timeout: 15000 });
      await expect(page).toHaveURL('/');
    });

    await test.step('Verify dashboard content is visible', async () => {
      // Check for main dashboard heading or welcome message
      const dashboardHeading = page.locator('h1, h2, h3').first();
      await expect(dashboardHeading).toBeVisible({ timeout: 10000 });
    });
  });

  /**
   * CRITICAL PATH 2: Story List → Story Viewing
   * User must be able to browse stories and view story content
   */
  test('CP-002: Story List and Viewing', async ({ page }) => {
    await test.step('Navigate to stories page', async () => {
      await page.goto('/stories', { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify story cards are displayed', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });

      const count = await storyCards.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Verify story card contains essential elements', async () => {
      const firstCard = page.locator('[data-testid="story-card"]').first();

      // Title
      const title = firstCard.locator('[data-testid="story-title"]');
      await expect(title).toBeVisible({ timeout: 5000 });

      // Level badge
      const levelChip = firstCard.locator('[data-testid="story-level"]');
      await expect(levelChip).toBeVisible({ timeout: 5000 });
    });

    await test.step('Click on first story card', async () => {
      const firstStoryCard = page.locator('[data-testid="story-card"]').first();
      await firstStoryCard.click();
    });

    await test.step('Verify story viewer is displayed', async () => {
      // Wait for back button to confirm we're in viewer mode
      const backButton = page.getByRole('button', { name: /ストーリー一覧に戻る/i });
      await expect(backButton).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify story content is loaded', async () => {
      // Verify chapter content
      const contentBox = page.locator('[data-testid="chapter-content"]');
      await expect(contentBox).toBeVisible({ timeout: 10000 });

      // Verify progress bar
      const progressBar = page.locator('[role="progressbar"]');
      await expect(progressBar).toBeVisible({ timeout: 5000 });
    });
  });

  /**
   * CRITICAL PATH 3: Quiz Page → Answer Submission
   * User must be able to access quiz and submit answers
   */
  test('CP-003: Quiz Access and Answer Submission', async ({ page }) => {
    await test.step('Navigate to stories page first', async () => {
      await page.goto('/stories', { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Wait for story cards and click first story', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });
      await storyCards.first().click();
    });

    await test.step('Extract story ID and navigate to quiz', async () => {
      // Wait for story viewer to load
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      const storyIdMatch = currentUrl.match(/\/stories\/(\d+)/);
      const storyId = storyIdMatch ? storyIdMatch[1] : '3';

      await page.goto(`/quiz?story=${storyId}`, { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Verify quiz page is loaded', async () => {
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

    await test.step('Verify quiz progress indicator', async () => {
      const progressText = page.locator('text=/Question \\d+ of \\d+/');
      await expect(progressText).toBeVisible({ timeout: 10000 });
    });

    await test.step('Verify answer choices are displayed', async () => {
      const radioButtons = page.locator('input[type="radio"]');
      const count = await radioButtons.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    await test.step('Select an answer', async () => {
      const firstRadio = page.locator('input[type="radio"]').first();
      await expect(firstRadio).toBeVisible({ timeout: 5000 });
      await firstRadio.click();
      await page.waitForTimeout(500);
    });

    await test.step('Verify submit button is enabled', async () => {
      const submitButton = page.locator('button').filter({ hasText: 'Submit Answer' });
      await expect(submitButton).toBeVisible({ timeout: 5000 });
      await expect(submitButton).toBeEnabled({ timeout: 5000 });
    });

    await test.step('Submit answer', async () => {
      const submitButton = page.locator('button').filter({ hasText: 'Submit Answer' });
      await submitButton.click();
    });

    await test.step('Verify feedback is displayed', async () => {
      const feedbackMessage = page.locator('text=/^Correct!?$|^Incorrect!?$/').first();
      await expect(feedbackMessage).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify next question button is available', async () => {
      const nextButton = page.locator('button').filter({ hasText: /次の問題|Next|Continue/ });
      await expect(nextButton).toBeVisible({ timeout: 10000 });
      await expect(nextButton).toBeEnabled({ timeout: 5000 });
    });
  });

  /**
   * CRITICAL PATH 4: Story Level Filter
   * User must be able to filter stories by level
   */
  test('CP-004: Story Level Filtering', async ({ page }) => {
    await test.step('Navigate to stories page', async () => {
      await page.goto('/stories', { waitUntil: 'networkidle', timeout: 30000 });
    });

    await test.step('Wait for initial story list to load', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });
    });

    await test.step('Apply N3-B1 level filter', async () => {
      const filterButton = page.getByRole('button', { name: /N3.*B1/i });
      await expect(filterButton).toBeVisible({ timeout: 10000 });
      await filterButton.click();
      await page.waitForTimeout(1000);
    });

    await test.step('Verify filtered stories are displayed', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      const filteredCount = await storyCards.count();

      expect(filteredCount).toBeGreaterThan(0);

      // Verify first story has correct level
      const firstCard = storyCards.first();
      const levelChip = firstCard.locator('[data-testid="story-level"]');
      await expect(levelChip).toBeVisible({ timeout: 5000 });

      const levelText = await levelChip.textContent();
      expect(levelText).toMatch(/N3.*B1/i);
    });
  });

  /**
   * CRITICAL PATH 5: Story Navigation (Back to List)
   * User must be able to navigate back from story viewer to story list
   */
  test('CP-005: Story Navigation Back to List', async ({ page }) => {
    await test.step('Navigate to stories and open a story', async () => {
      await page.goto('/stories', { waitUntil: 'networkidle', timeout: 30000 });

      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });
      await storyCards.first().click();
    });

    await test.step('Verify story viewer is displayed', async () => {
      const backButton = page.getByRole('button', { name: /ストーリー一覧に戻る/i });
      await expect(backButton).toBeVisible({ timeout: 15000 });
    });

    await test.step('Click back to story list button', async () => {
      const backButton = page.getByRole('button', { name: /ストーリー一覧に戻る/i });
      await backButton.click();
    });

    await test.step('Verify returned to story list page', async () => {
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 15000 });

      const heading = page.getByText(/レベル別ストーリー一覧/);
      await expect(heading).toBeVisible({ timeout: 10000 });
    });
  });
});
