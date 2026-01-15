import { test, expect, Page } from '@playwright/test';
import { TEST_USERS } from './helpers/auth.helper';

/**
 * Helper function to prevent language selection modal from appearing
 */
async function preventLanguageModal(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await preventLanguageModal(page);
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    // Check for heading instead of generic text to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /ログイン/ })).toBeVisible();
  });

  test('should show demo account information', async ({ page }) => {
    await expect(page.locator('text=デモアカウント:')).toBeVisible();
    await expect(page.locator('text=demo@example.com')).toBeVisible();
    await expect(page.locator('text=admin@example.com')).toBeVisible();
  });

  test('should successfully login with demo account', async ({ page }) => {
    await page.fill('input[type="email"]', TEST_USERS.demo.email);
    await page.fill('input[type="password"]', TEST_USERS.demo.password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should successfully login with admin account', async ({ page }) => {
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Use role for error alert to avoid strict mode violation
    await expect(page.getByRole('alert').filter({ hasText: 'メールアドレスまたはパスワードが正しくありません' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button[type="submit"]');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
  });

  test('should toggle remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should show loading state during login', async ({ page }) => {
    await page.fill('input[type="email"]', TEST_USERS.demo.email);
    await page.fill('input[type="password"]', TEST_USERS.demo.password);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(submitButton).toBeDisabled();
    await expect(page.locator('text=ログイン中...')).toBeVisible();
  });
});
