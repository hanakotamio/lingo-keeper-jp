import { Page } from '@playwright/test';

export const TEST_USERS = {
  demo: {
    email: 'demo@example.com',
    password: 'demo123',
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
  },
};

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

export async function loginAsDemo(page: Page) {
  await login(page, TEST_USERS.demo.email, TEST_USERS.demo.password);
}

export async function loginAsAdmin(page: Page) {
  await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
}

export async function logout(page: Page) {
  await page.click('button[aria-label="ログアウト"]');
  await page.waitForURL('/login');
}
