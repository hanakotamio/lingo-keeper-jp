import { test, expect, Page } from '@playwright/test';
import { loginAsDemo } from './helpers/auth.helper';

/**
 * Helper function to prevent language selection modal from appearing
 */
async function preventLanguageModal(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test.describe('Layout Verification', () => {
  test('should capture login page screenshot for layout verification', async ({ page }) => {
    await preventLanguageModal(page);
    await page.goto('/login');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/login-page-verification.png',
      fullPage: true
    });

    // Verify login form is visible
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();

    // Take screenshot of just the login form
    await loginForm.screenshot({
      path: 'tests/screenshots/login-form-verification.png'
    });
  });

  test('should capture dashboard page screenshot for layout verification', async ({ page }) => {
    await preventLanguageModal(page);
    await loginAsDemo(page);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/dashboard-page-verification.png',
      fullPage: true
    });

    // Verify sidebar is visible
    const sidebar = page.locator('nav[aria-label="サイドバー"]');
    await expect(sidebar).toBeVisible();

    // Take screenshot of sidebar
    await sidebar.screenshot({
      path: 'tests/screenshots/dashboard-sidebar-verification.png'
    });
  });

  test('should capture stories page screenshot', async ({ page }) => {
    await preventLanguageModal(page);
    await loginAsDemo(page);
    await page.goto('/stories');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/stories-page-verification.png',
      fullPage: true
    });
  });

  test('should capture quiz page screenshot', async ({ page }) => {
    await preventLanguageModal(page);
    await loginAsDemo(page);
    await page.goto('/quiz');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/quiz-page-verification.png',
      fullPage: true
    });
  });

  test('should capture profile page screenshot', async ({ page }) => {
    await preventLanguageModal(page);
    await loginAsDemo(page);
    await page.goto('/profile');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/profile-page-verification.png',
      fullPage: true
    });
  });
});
