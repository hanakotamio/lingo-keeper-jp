import { test, expect } from '@playwright/test';

/**
 * Debug Test: Language Setting Investigation
 *
 * Purpose: Investigate why production environment is loading Japanese UI
 * despite DEFAULT_LANGUAGE = 'en' in the codebase
 */

test.describe('Language Setting Debug Tests', () => {
  test('DEBUG-001: Check localStorage language setting', async ({ page }) => {
    // Navigate to production
    await page.goto('https://lingo-keeper-jp.vercel.app');
    await page.waitForLoadState('networkidle');

    // Check what language is stored in localStorage
    const storedLanguage = await page.evaluate(() => {
      return localStorage.getItem('lingo_keeper_ui_language');
    });

    console.log('Stored language in localStorage:', storedLanguage);

    // Check document language attribute
    const htmlLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    console.log('HTML lang attribute:', htmlLang);

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-language-before-clear.png', fullPage: true });
  });

  test('DEBUG-002: Clear localStorage and check default language', async ({ page }) => {
    // Navigate to production
    await page.goto('https://lingo-keeper-jp.vercel.app');
    await page.waitForLoadState('networkidle');

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });

    console.log('Cleared localStorage');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check what language is now set
    const newLanguage = await page.evaluate(() => {
      return localStorage.getItem('lingo_keeper_ui_language');
    });

    console.log('Language after clear and reload:', newLanguage);

    // Check HTML lang
    const htmlLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    console.log('HTML lang after reload:', htmlLang);

    // Check if login button shows English
    const pageText = await page.content();
    const hasLoginEnglish = pageText.includes('Login') || pageText.includes('Email');
    const hasLoginJapanese = pageText.includes('ログイン') || pageText.includes('メールアドレス');

    console.log('Has English Login text:', hasLoginEnglish);
    console.log('Has Japanese Login text:', hasLoginJapanese);

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-language-after-clear.png', fullPage: true });

    // Verify English is loaded
    expect(newLanguage).toBe('en');
    expect(htmlLang).toBe('en');
  });

  test('DEBUG-003: Force set English and verify', async ({ page }) => {
    // Navigate to production
    await page.goto('https://lingo-keeper-jp.vercel.app');
    await page.waitForLoadState('networkidle');

    // Force set English in localStorage before page loads
    await page.evaluate(() => {
      localStorage.setItem('lingo_keeper_ui_language', 'en');
    });

    console.log('Forced localStorage to "en"');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if English is displayed
    const loginButton = page.getByRole('button', { name: /login/i });
    const emailField = page.getByLabel(/email/i);

    // These should be visible with English UI
    const hasLoginButton = await loginButton.isVisible().catch(() => false);
    const hasEmailField = await emailField.isVisible().catch(() => false);

    console.log('Has Login button (English):', hasLoginButton);
    console.log('Has Email field (English):', hasEmailField);

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-language-forced-en.png', fullPage: true });

    // At least one English element should be visible
    expect(hasLoginButton || hasEmailField).toBe(true);
  });

  test('DEBUG-004: Check browser language detection', async ({ page, context }) => {
    // Set browser language preference to English
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'en-US',
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    // Navigate to production
    await page.goto('https://lingo-keeper-jp.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check browser language
    const browserLang = await page.evaluate(() => {
      return {
        language: navigator.language,
        languages: navigator.languages,
      };
    });

    console.log('Browser language:', browserLang);

    // Check localStorage
    const storedLanguage = await page.evaluate(() => {
      return localStorage.getItem('lingo_keeper_ui_language');
    });

    console.log('Stored language:', storedLanguage);

    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-language-browser-en.png', fullPage: true });
  });

  test('DEBUG-005: Check all localStorage keys', async ({ page }) => {
    // Navigate to production
    await page.goto('https://lingo-keeper-jp.vercel.app');
    await page.waitForLoadState('networkidle');

    // Get all localStorage keys and values
    const localStorageContents = await page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key) || '';
        }
      }
      return items;
    });

    console.log('All localStorage contents:', JSON.stringify(localStorageContents, null, 2));

    // Check for any language-related keys
    const languageKeys = Object.keys(localStorageContents).filter((key) =>
      key.toLowerCase().includes('lang') || key.toLowerCase().includes('i18n')
    );

    console.log('Language-related keys:', languageKeys);
  });
});
