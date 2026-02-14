import { test, expect, Page } from '@playwright/test';

/**
 * Translation Content Verification Test
 * Tests that English translations are correctly displayed when the translation button is clicked
 */

async function preventLanguageModal(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test('Translation Content Display Test', async ({ page }) => {
  await preventLanguageModal(page);

  await test.step('Navigate to /stories and open first story', async () => {
    await page.goto('http://localhost:3847/stories', { waitUntil: 'networkidle' });

    const storyCards = page.locator('[data-testid="story-card"]');
    await expect(storyCards.first()).toBeVisible({ timeout: 10000 });
    await storyCards.first().click();
    await page.waitForTimeout(1000);
  });

  await test.step('Wait for story viewer to load', async () => {
    const backButton = page.getByRole('button', { name: /ストーリー一覧に戻る/i });
    await expect(backButton).toBeVisible({ timeout: 10000 });
  });

  await test.step('Get Japanese content before translation', async () => {
    const contentBox = page.locator('[data-testid="chapter-content"]');
    await expect(contentBox).toBeVisible();

    const japaneseContent = await contentBox.textContent();
    console.log('Japanese content:', japaneseContent);
    expect(japaneseContent).toBeTruthy();
    expect(japaneseContent!.length).toBeGreaterThan(0);
  });

  await test.step('Click translation button', async () => {
    const translationButton = page.getByRole('button', { name: /翻訳表示/i });
    await expect(translationButton).toBeVisible();
    await translationButton.click();
    await page.waitForTimeout(500);
  });

  await test.step('Verify translation header is displayed', async () => {
    const translationHeader = page.getByText('🌐 English Translation');
    await expect(translationHeader).toBeVisible({ timeout: 5000 });
  });

  await test.step('Verify English translation content is displayed', async () => {
    // Find the translation section - it should be after the border separator
    const contentBox = page.locator('[data-testid="chapter-content"]').locator('..');
    const fullText = await contentBox.textContent();

    console.log('Full content with translation:', fullText);

    // Verify the translation section exists
    expect(fullText).toContain('English Translation');

    // The translation should be in English (check for common English words)
    const hasEnglishWords = /\b(the|is|in|at|to|my|I|a|and|of)\b/i.test(fullText || '');
    expect(hasEnglishWords).toBeTruthy();

    console.log('Translation content verified: Contains English text');
  });

  await test.step('Toggle translation off', async () => {
    const translationButton = page.getByRole('button', { name: /翻訳表示/i });
    await translationButton.click();
    await page.waitForTimeout(500);

    // Translation header should not be visible
    const translationHeader = page.getByText('🌐 English Translation');
    await expect(translationHeader).not.toBeVisible();

    console.log('Translation successfully toggled off');
  });

  await test.step('Toggle translation back on', async () => {
    const translationButton = page.getByRole('button', { name: /翻訳表示/i });
    await translationButton.click();
    await page.waitForTimeout(500);

    // Translation header should be visible again
    const translationHeader = page.getByText('🌐 English Translation');
    await expect(translationHeader).toBeVisible();

    console.log('Translation successfully toggled back on');
  });
});
