import { test, expect } from '@playwright/test';
import { loginAsDemo, loginAsAdmin } from './helpers/auth.helper';

test.describe('Dashboard Page', () => {
  test.describe('Demo User Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemo(page);
    });

    test('should display dashboard after login', async ({ page }) => {
      await expect(page).toHaveURL('/');
      await expect(page.locator('text=ダッシュボード')).toBeVisible();
    });

    test('should show user greeting', async ({ page }) => {
      await expect(page.locator('text=こんにちは')).toBeVisible();
    });

    test('should navigate to stories page', async ({ page }) => {
      await page.click('text=ストーリー');
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
      await loginAsAdmin(page);
    });

    test('should display dashboard after admin login', async ({ page }) => {
      await expect(page).toHaveURL('/');
      await expect(page.locator('text=ダッシュボード')).toBeVisible();
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
      await expect(page.locator('text=ストーリー')).toBeVisible();
      await expect(page.locator('text=クイズ')).toBeVisible();
      await expect(page.locator('text=プロフィール')).toBeVisible();
      await expect(page.locator('text=管理画面')).toBeVisible();
    });
  });

  test.describe('Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemo(page);
    });

    test('should highlight active navigation item', async ({ page }) => {
      const storiesLink = page.locator('a[href="/stories"]');
      await storiesLink.click();
      await page.waitForURL('/stories');

      await expect(storiesLink).toHaveAttribute('aria-current', 'page');
    });

    test('should show sidebar on desktop', async ({ page }) => {
      const sidebar = page.locator('nav[aria-label="サイドバー"]');
      await expect(sidebar).toBeVisible();
    });

    test('should show header with logo', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(page.locator('text=Lingo Keeper JP')).toBeVisible();
    });
  });
});
