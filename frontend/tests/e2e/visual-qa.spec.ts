import { test } from '@playwright/test';

test('Visual QA - Login Page', async ({ page }) => {
  await page.goto('http://localhost:3847/login');
  await page.waitForLoadState('networkidle');

  // ログインページのスクリーンショット
  await page.screenshot({
    path: 'tests/screenshots/login-page.png',
    fullPage: true,
  });
});

test('Visual QA - Dashboard Page', async ({ page }) => {
  await page.goto('http://localhost:3847/login');

  // デモユーザーでログイン
  await page.fill('input[type="email"]', 'demo@example.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');

  // ダッシュボードに遷移するまで待機
  await page.waitForURL('http://localhost:3847/');
  await page.waitForLoadState('networkidle');

  // ダッシュボードのスクリーンショット
  await page.screenshot({
    path: 'tests/screenshots/dashboard-page.png',
    fullPage: true,
  });
});
