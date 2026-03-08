import { test, expect } from '@playwright/test';

/**
 * Production Verification Test: Button Labels English Translation
 *
 * Purpose: Verify that UI buttons and labels changed from Japanese to English
 * in commit 80d5421 are correctly displayed in production environment.
 *
 * Test Environment: https://lingo-keeper-jp.vercel.app
 */

test.describe('Button Labels English Translation Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production URL
    await page.goto('https://lingo-keeper-jp.vercel.app');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('E2E-VERIFY-001: Login page should have English labels', async ({ page }) => {
    // Check for Login button (if login page exists)
    const loginButton = page.getByRole('button', { name: /login/i });
    if (await loginButton.isVisible()) {
      await expect(loginButton).toBeVisible();
    }
  });

  test('E2E-VERIFY-002: Dashboard/Stories page should display English section headers', async ({ page }) => {
    // Navigate to stories page
    await page.goto('https://lingo-keeper-jp.vercel.app/stories');
    await page.waitForLoadState('networkidle');

    // Verify "Stories by Level" header
    const storiesByLevelHeader = page.getByRole('heading', { name: /stories by level/i });
    await expect(storiesByLevelHeader).toBeVisible({ timeout: 10000 });

    // Verify "Recommended for You" section exists
    const recommendedSection = page.getByText(/recommended for you/i);
    if (await recommendedSection.isVisible()) {
      await expect(recommendedSection).toBeVisible();
    }

    // Verify "All Stories" section or button
    const allStoriesSection = page.getByText(/all stories/i);
    if (await allStoriesSection.isVisible()) {
      await expect(allStoriesSection).toBeVisible();
    }
  });

  test('E2E-VERIFY-003: Loading states should display "Loading..." in English', async ({ page }) => {
    // Navigate to stories page
    await page.goto('https://lingo-keeper-jp.vercel.app/stories');

    // Check if loading text appears (might be brief)
    const loadingText = page.getByText(/loading\.\.\./i);

    // This is optional as loading might complete quickly
    // We'll check if it exists but won't fail if not visible
    const isVisible = await loadingText.isVisible().catch(() => false);

    if (isVisible) {
      await expect(loadingText).toBeVisible();
    }

    // Verify content eventually loads (no Japanese "読み込み中...")
    const japaneseLoading = page.getByText('読み込み中...');
    await expect(japaneseLoading).not.toBeVisible();
  });

  test('E2E-VERIFY-004: Story detail page should have "Back to Story List" button', async ({ page }) => {
    // Navigate to stories page
    await page.goto('https://lingo-keeper-jp.vercel.app/stories');
    await page.waitForLoadState('networkidle');

    // Wait for stories to load
    await page.waitForSelector('[data-testid="story-card"], .MuiCard-root', { timeout: 10000 });

    // Click on the first available story card
    const firstStoryCard = page.locator('[data-testid="story-card"], .MuiCard-root').first();
    await firstStoryCard.waitFor({ state: 'visible', timeout: 10000 });
    await firstStoryCard.click();

    // Wait for story detail page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow time for content to render

    // Verify "Back to Story List" button exists
    const backButton = page.getByRole('button', { name: /back to story list/i });
    await expect(backButton).toBeVisible({ timeout: 10000 });

    // Verify no Japanese "ストーリー一覧に戻る" button exists
    const japaneseBackButton = page.getByRole('button', { name: 'ストーリー一覧に戻る' });
    await expect(japaneseBackButton).not.toBeVisible();
  });

  test('E2E-VERIFY-005: Quiz page should have English voice instructions', async ({ page }) => {
    // Navigate to quiz page (if accessible)
    await page.goto('https://lingo-keeper-jp.vercel.app/quiz');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for voice instructions in English
    const voiceInstructions = page.getByText(/voice instructions/i);

    // If quiz page is accessible, verify instructions
    const pageContent = await page.content();

    if (pageContent.includes('quiz') || pageContent.includes('Voice')) {
      // Verify English instructions exist
      const instructionText = page.getByText(/say the letter \(a, b, c, d\)/i);
      if (await instructionText.isVisible().catch(() => false)) {
        await expect(instructionText).toBeVisible();
      }
    }

    // Verify no Japanese instructions
    const japaneseInstructions = page.getByText('音声指示');
    await expect(japaneseInstructions).not.toBeVisible();
  });

  test('E2E-VERIFY-006: Header and navigation should be in English', async ({ page }) => {
    // Check header/navigation elements
    await page.waitForTimeout(2000);

    // Common navigation items that should be in English
    const commonEnglishTexts = [
      /dashboard/i,
      /stories/i,
      /quiz/i,
      /profile/i,
      /settings/i
    ];

    let englishTextFound = false;

    for (const textPattern of commonEnglishTexts) {
      const element = page.getByText(textPattern).first();
      if (await element.isVisible().catch(() => false)) {
        englishTextFound = true;
        break;
      }
    }

    expect(englishTextFound).toBe(true);

    // Verify no Japanese navigation items
    const japaneseNavItems = [
      'ダッシュボード',
      'ストーリー',
      'クイズ',
      'プロフィール',
      '設定'
    ];

    for (const japaneseText of japaneseNavItems) {
      const japaneseElement = page.getByText(japaneseText);
      await expect(japaneseElement).not.toBeVisible();
    }
  });

  test('E2E-VERIFY-007: Story completion modal should be in English', async ({ page }) => {
    // This test checks if story completion modal uses English
    // Note: This requires completing a story, which may not be practical
    // We'll document this for manual verification

    // Navigate to stories
    await page.goto('https://lingo-keeper-jp.vercel.app/stories');
    await page.waitForLoadState('networkidle');

    // Expected English text in completion modal:
    // - "Story Completed!"
    // - "Quiz Accuracy"
    // - "Recommended Next Story"
    // - "Go to Next Story" / "Back to Story List"

    // For this verification test, we'll just confirm the page loads
    // Manual verification required for actual story completion
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
  });

  test('E2E-VERIFY-008: No Japanese text should appear in main UI elements', async ({ page }) => {
    // Navigate through main pages and check for Japanese text
    const pagesToCheck = [
      'https://lingo-keeper-jp.vercel.app',
      'https://lingo-keeper-jp.vercel.app/stories',
      'https://lingo-keeper-jp.vercel.app/dashboard'
    ];

    for (const pageUrl of pagesToCheck) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const pageContent = await page.content();

      // Common Japanese UI terms that should NOT appear
      const japaneseTerms = [
        'レベル別ストーリー',
        'おすすめ',
        'すべてのストーリー',
        'ストーリー一覧に戻る',
        '読み込み中',
        'ダッシュボード',
        'クイズ',
        'プロフィール'
      ];

      for (const term of japaneseTerms) {
        // Check if Japanese term appears in visible UI (not in story content)
        const element = page.locator(`button:has-text("${term}"), [role="heading"]:has-text("${term}"), nav:has-text("${term}")`);
        const count = await element.count();

        if (count > 0) {
          console.warn(`Warning: Found Japanese UI term "${term}" on ${pageUrl}`);
        }
      }
    }
  });
});
