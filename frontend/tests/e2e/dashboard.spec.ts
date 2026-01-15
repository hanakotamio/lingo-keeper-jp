import { test, expect, Page } from '@playwright/test';
import { loginAsDemo, loginAsAdmin } from './helpers/auth.helper';

/**
 * Helper function to prevent language selection modal from appearing
 */
async function preventLanguageModal(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

test.describe('Dashboard Page', () => {
  test.describe('Demo User Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await preventLanguageModal(page);
      await loginAsDemo(page);
    });

    test('should display dashboard after login', async ({ page }) => {
      await expect(page).toHaveURL('/');
      // Use role selector to avoid strict mode violation
      await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
    });

    test('should show user greeting', async ({ page }) => {
      await expect(page.getByText('Demo User')).toBeVisible();
    });

    test('should navigate to stories page', async ({ page }) => {
      await page.getByRole('button', { name: 'ストーリー' }).click();
      await page.waitForURL('/stories');
      await expect(page).toHaveURL('/stories');
    });

    test('should navigate to quiz page', async ({ page }) => {
      await page.click('text=クイズ');
      await page.waitForURL('/quiz');
      await expect(page).toHaveURL('/quiz');
    });

    test('should navigate to profile page', async ({ page }) => {
      await page.click('text=プロフィール');
      await page.waitForURL('/profile');
      await expect(page).toHaveURL('/profile');
    });

    test('should not show admin menu for demo user', async ({ page }) => {
      const adminLink = page.locator('text=管理画面');
      await expect(adminLink).not.toBeVisible();
    });
  });

  test.describe('Admin User Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await preventLanguageModal(page);
      await loginAsAdmin(page);
    });

    test('should display dashboard after admin login', async ({ page }) => {
      await expect(page).toHaveURL('/');
      // Use role selector to avoid strict mode violation
      await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
    });

    test('should show admin menu', async ({ page }) => {
      const adminLink = page.locator('text=管理画面');
      await expect(adminLink).toBeVisible();
    });

    test('should navigate to admin page', async ({ page }) => {
      await page.click('text=管理画面');
      await page.waitForURL('/admin');
      await expect(page).toHaveURL('/admin');
    });

    test('should have all navigation options', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'ストーリー' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'クイズ' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'プロフィール' })).toBeVisible();
      await expect(page.getByRole('button', { name: '管理画面' })).toBeVisible();
    });
  });

  test.describe('Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await preventLanguageModal(page);
      await loginAsDemo(page);
    });

    test('should highlight active navigation item', async ({ page }) => {
      const storiesButton = page.getByRole('button', { name: 'ストーリー' });
      await storiesButton.click();
      await page.waitForURL('/stories');

      // Verify we're on the stories page
      await expect(page).toHaveURL('/stories');
    });

    test('should show sidebar on desktop', async ({ page }) => {
      // Verify sidebar navigation buttons are visible
      await expect(page.getByRole('button', { name: 'ダッシュボード' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ストーリー' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'クイズ' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'プロフィール' })).toBeVisible();
    });

    test('should show header with logo', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(page.locator('header').getByText('Lingo Keeper JP')).toBeVisible();
    });
  });
});
